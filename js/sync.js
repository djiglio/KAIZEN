/* ============================================================
 sync.js — Sincronizzazione Real-Time con Firebase (Firestore + Auth)
 KAIZEN v6.66
 ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  linkWithCredential,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import {
  getFirebaseConfig,
  setCustomFirebaseConfig,
  resetFirebaseConfig,
  hasCustomFirebaseConfig
} from "./firebase-config.js";
import {
  store,
  migrate,
  saveLocalOnly,
  onStateSaved,
  registerImmediateSyncHandler,
  hasStateProgress
} from "./state.js";
import { APP_VERSION } from "./data.js";
import { showToast } from "./ui.js";
import { getHeroRank, getRankTitle } from "./engine.js";

const MANUAL_LOGOUT_KEY = "kaizenManualLogout";
const DEBOUNCE_MS = 1400;

let app = null;
let auth = null;
let db = null;
let unsubscribeSnapshot = null;
let debounceTimer = null;
let _lastPushedTimestamp = 0;
let _onSettingsRender = null;
let _onFullStateRender = null;
let _isReconciling = false;

export const syncState = {
  status: "connecting", // 'connecting' | 'synced' | 'syncing' | 'offline' | 'error'
  user: null,           // { uid, email, displayName, isAnonymous, providerId }
  lastSyncAt: null,
  errorMsg: null,
  emailPanelOpen: false,
  emailMode: "login",   // 'login' | 'register'
  configPanelOpen: false
};

function notifyUI() {
  if (typeof _onSettingsRender === "function") {
    try { _onSettingsRender(); } catch (e) { console.error(e); }
  }
}

function notifyFullState() {
  if (typeof _onFullStateRender === "function") {
    try { _onFullStateRender(); } catch (e) { console.error(e); }
  } else {
    notifyUI();
  }
}

function translateFirebaseError(err) {
  const code = err?.code || "";
  if (code.includes("operation-not-allowed")) {
    return "Metodo di accesso non ancora abilitato nella console Firebase (Authentication → Sign-in method).";
  }
  if (code.includes("permission-denied")) {
    return "Permesso negato su Firestore. Controlla le regole di sicurezza del database.";
  }
  if (code.includes("popup-closed-by-user") || code.includes("cancelled-popup-request")) {
    return "Accesso tramite finestra annullato.";
  }
  if (code.includes("popup-blocked")) {
    return "Finestra popup bloccata dal browser. Consenti i popup per questo sito.";
  }
  if (code.includes("invalid-email")) {
    return "Indirizzo email non valido.";
  }
  if (code.includes("weak-password")) {
    return "La password deve contenere almeno 6 caratteri.";
  }
  if (code.includes("email-already-in-use") || code.includes("credential-already-in-use")) {
    return "Questo account è già associato a un profilo esistente.";
  }
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "Credenziali non valide. Verifica email e password.";
  }
  if (code.includes("network-request-failed") || !navigator.onLine) {
    return "Connessione assente. I progressi sono salvati in locale.";
  }
  return err?.message || "Errore di sincronizzazione.";
}

function extractUserInfo(fbUser) {
  if (!fbUser) return null;
  const providerData = fbUser.providerData || [];
  let providerId = fbUser.isAnonymous ? "anonymous" : "password";
  if (providerData.some(p => p.providerId === "google.com")) {
    providerId = "google.com";
  } else if (providerData.some(p => p.providerId === "password")) {
    providerId = "password";
  }
  return {
    uid: fbUser.uid,
    email: fbUser.email || null,
    displayName: fbUser.displayName || null,
    isAnonymous: !!fbUser.isAnonymous,
    providerId
  };
}

function buildFirestorePayload(uid, stateObj) {
  const now = Math.max(1, Math.floor(Number(stateObj._updatedAt) || Date.now()));
  stateObj._updatedAt = now;
  const rank = getHeroRank();
  const title = getRankTitle(rank);
  const denari = Math.floor(stateObj.world?.denari || 0);
  return {
    stateJson: JSON.stringify(stateObj),
    updatedAt: now,
    appVersion: String(APP_VERSION).slice(0, 50),
    uid: String(uid),
    summary: {
      rank: Number(rank) || 1,
      title: String(title || "Novizio"),
      denari: Number(denari) || 0
    }
  };
}

export async function pushToCloudImmediate(customState = null) {
  if (!db || !auth?.currentUser) return false;
  if (!navigator.onLine) {
    syncState.status = "offline";
    notifyUI();
    return false;
  }
  const uid = auth.currentUser.uid;
  const targetState = customState || store.state;
  try {
    syncState.status = "syncing";
    syncState.errorMsg = null;
    notifyUI();

    const payload = buildFirestorePayload(uid, targetState);
    _lastPushedTimestamp = payload.updatedAt;
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, payload, { merge: true });

    syncState.status = "synced";
    syncState.lastSyncAt = payload.updatedAt;
    syncState.errorMsg = null;
    notifyUI();
    return true;
  } catch (err) {
    console.error("Errore pushToCloudImmediate:", err);
    syncState.status = navigator.onLine ? "error" : "offline";
    syncState.errorMsg = translateFirebaseError(err);
    notifyUI();
    return false;
  }
}

export function scheduleCloudSave() {
  if (!db || !auth?.currentUser) return;
  if (!navigator.onLine) {
    syncState.status = "offline";
    notifyUI();
    return;
  }
  syncState.status = "syncing";
  notifyUI();
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    pushToCloudImmediate();
  }, DEBOUNCE_MS);
}

async function reconcileWithCloud(uid, options = {}) {
  if (!db || !uid) return;
  _isReconciling = true;
  try {
    syncState.status = "syncing";
    syncState.errorMsg = null;
    notifyUI();

    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data();
      const remoteTime = Number(data.updatedAt || 0);
      const localTime = Number(store.state._updatedAt || 0);
      const localHasProgress = hasStateProgress(store.state);

      if (data.stateJson) {
        const remoteParsed = migrate(JSON.parse(data.stateJson));
        const remoteHasProgress = hasStateProgress(remoteParsed);

        if (options.preferRemoteIfPresent && remoteHasProgress) {
          let useRemote = true;
          if (localHasProgress && localTime > remoteTime && options.askOnConflict) {
            const remoteSummary = data.summary
              ? `Grado ${data.summary.rank || "?"} (${data.summary.title || ""}) · ${data.summary.denari ?? 0} denari`
              : "Salvataggio esistente";
            useRemote = confirm(
              `Trovato salvataggio sull'account (${remoteSummary}).\n\n` +
              `Premi OK per caricare i progressi dell'account, oppure Annulla per mantenere e salvare i progressi attuali di questo dispositivo.`
            );
          }
          if (useRemote) {
            store.state = remoteParsed;
            store.state._updatedAt = remoteTime || Date.now();
            saveLocalOnly();
            syncState.lastSyncAt = store.state._updatedAt;
            syncState.status = "synced";
            notifyFullState();
            showToast("✦ Progressi dell'account caricati!");
            return;
          } else {
            store.state._updatedAt = Date.now();
            saveLocalOnly();
            await pushToCloudImmediate();
            return;
          }
        }

        if (!localHasProgress || remoteTime > localTime) {
          store.state = remoteParsed;
          store.state._updatedAt = remoteTime || Date.now();
          saveLocalOnly();
          syncState.lastSyncAt = store.state._updatedAt;
          syncState.status = "synced";
          notifyFullState();
          return;
        } else if (localTime > remoteTime && localHasProgress) {
          await pushToCloudImmediate();
          return;
        }
      }

      syncState.lastSyncAt = remoteTime || localTime || Date.now();
      syncState.status = "synced";
      notifyUI();
    } else {
      await pushToCloudImmediate();
    }
  } catch (err) {
    console.error("Errore reconcileWithCloud:", err);
    syncState.status = navigator.onLine ? "error" : "offline";
    syncState.errorMsg = translateFirebaseError(err);
    notifyUI();
  } finally {
    _isReconciling = false;
  }
}

function attachRealtimeListener(uid) {
  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
    unsubscribeSnapshot = null;
  }
  if (!db || !uid) return;

  const userDocRef = doc(db, "users", uid);
  unsubscribeSnapshot = onSnapshot(
    userDocRef,
    snap => {
      if (_isReconciling) return;
      if (snap.metadata.hasPendingWrites) return;
      if (!snap.exists()) return;

      const data = snap.data();
      const remoteTime = Number(data.updatedAt || 0);
      const localTime = Number(store.state._updatedAt || 0);

      if (remoteTime > 0 && remoteTime > localTime && remoteTime !== _lastPushedTimestamp && data.stateJson) {
        try {
          const parsed = JSON.parse(data.stateJson);
          store.state = migrate(parsed);
          store.state._updatedAt = remoteTime;
          saveLocalOnly();
          syncState.lastSyncAt = remoteTime;
          syncState.status = "synced";
          syncState.errorMsg = null;
          notifyFullState();
          showToast("✦ Sincronizzato in tempo reale");
        } catch (e) {
          console.error("Errore parsing stato remoto:", e);
        }
      } else {
        syncState.status = "synced";
        if (remoteTime > 0) syncState.lastSyncAt = remoteTime;
        notifyUI();
      }
    },
    err => {
      console.error("Errore onSnapshot:", err);
      syncState.status = navigator.onLine ? "error" : "offline";
      syncState.errorMsg = translateFirebaseError(err);
      notifyUI();
    }
  );
}

export async function connectAnonymousSession() {
  if (!auth) return;
  try {
    sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
    syncState.status = "connecting";
    syncState.errorMsg = null;
    notifyUI();
    await signInAnonymously(auth);
    showToast("✦ Sessione rapida attivata!");
  } catch (err) {
    console.error("Errore signInAnonymously:", err);
    syncState.status = "error";
    syncState.errorMsg = translateFirebaseError(err);
    notifyUI();
    showToast("✕ " + syncState.errorMsg);
  }
}

export async function loginWithGoogle() {
  if (!auth) return;
  const provider = new GoogleAuthProvider();
  sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
  syncState.errorMsg = null;

  try {
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      try {
        const res = await linkWithPopup(auth.currentUser, provider);
        syncState.user = extractUserInfo(res.user);
        await pushToCloudImmediate();
        showToast("✦ Account Google collegato ai tuoi progressi!");
        notifyUI();
        return;
      } catch (linkErr) {
        const code = linkErr?.code || "";
        if (
          code.includes("credential-already-in-use") ||
          code.includes("email-already-in-use") ||
          code.includes("account-exists-with-different-credential")
        ) {
          const res = await signInWithPopup(auth, provider);
          syncState.user = extractUserInfo(res.user);
          await reconcileWithCloud(res.user.uid, { preferRemoteIfPresent: true, askOnConflict: true });
          attachRealtimeListener(res.user.uid);
          return;
        }
        throw linkErr;
      }
    } else {
      const res = await signInWithPopup(auth, provider);
      syncState.user = extractUserInfo(res.user);
      await reconcileWithCloud(res.user.uid, { preferRemoteIfPresent: true, askOnConflict: true });
      attachRealtimeListener(res.user.uid);
      showToast("✦ Accesso con Google effettuato!");
    }
  } catch (err) {
    console.error("Errore loginWithGoogle:", err);
    syncState.errorMsg = translateFirebaseError(err);
    notifyUI();
    showToast("✕ " + syncState.errorMsg);
  }
}

export async function submitEmailAuth(email, password, mode = syncState.emailMode) {
  if (!auth) return;
  const cleanEmail = (email || "").trim();
  if (!cleanEmail || !password) {
    showToast("✕ Inserisci email e password.");
    return;
  }
  sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
  syncState.errorMsg = null;

  try {
    if (mode === "register") {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        const cred = EmailAuthProvider.credential(cleanEmail, password);
        try {
          const res = await linkWithCredential(auth.currentUser, cred);
          syncState.user = extractUserInfo(res.user);
          syncState.emailPanelOpen = false;
          await pushToCloudImmediate();
          showToast("✦ Account Email registrato e collegato!");
          notifyUI();
          return;
        } catch (linkErr) {
          if ((linkErr?.code || "").includes("email-already-in-use")) {
            const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
            syncState.user = extractUserInfo(res.user);
            syncState.emailPanelOpen = false;
            await reconcileWithCloud(res.user.uid, { preferRemoteIfPresent: true, askOnConflict: true });
            attachRealtimeListener(res.user.uid);
            return;
          }
          throw linkErr;
        }
      } else {
        const res = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        syncState.user = extractUserInfo(res.user);
        syncState.emailPanelOpen = false;
        await pushToCloudImmediate();
        attachRealtimeListener(res.user.uid);
        showToast("✦ Account Email creato con successo!");
      }
    } else {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
      syncState.user = extractUserInfo(res.user);
      syncState.emailPanelOpen = false;
      await reconcileWithCloud(res.user.uid, { preferRemoteIfPresent: true, askOnConflict: true });
      attachRealtimeListener(res.user.uid);
      showToast("✦ Accesso effettuato!");
    }
    notifyUI();
  } catch (err) {
    console.error("Errore submitEmailAuth:", err);
    syncState.errorMsg = translateFirebaseError(err);
    notifyUI();
    showToast("✕ " + syncState.errorMsg);
  }
}

export async function logoutCloud() {
  if (!auth) return;
  try {
    clearTimeout(debounceTimer);
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }
    sessionStorage.setItem(MANUAL_LOGOUT_KEY, "1");
    await signOut(auth);
    syncState.user = null;
    syncState.status = "offline";
    syncState.errorMsg = null;
    notifyUI();
    showToast("✦ Account disconnesso.");
  } catch (err) {
    console.error("Errore logoutCloud:", err);
    showToast("✕ Errore durante la disconnessione.");
  }
}

export async function forceSyncNow() {
  if (!auth?.currentUser) {
    await connectAnonymousSession();
    return;
  }
  clearTimeout(debounceTimer);
  const ok = await pushToCloudImmediate();
  if (ok) {
    showToast("✦ Sincronizzazione completata!");
  } else {
    showToast("✕ Impossibile sincronizzare ora.");
  }
}

export function toggleEmailPanel(mode = null) {
  if (mode && mode !== syncState.emailMode) {
    syncState.emailMode = mode;
    syncState.emailPanelOpen = true;
  } else {
    syncState.emailPanelOpen = !syncState.emailPanelOpen;
  }
  notifyUI();
}

export function setEmailMode(mode) {
  syncState.emailMode = mode === "register" ? "register" : "login";
  notifyUI();
}

export function toggleConfigPanel() {
  syncState.configPanelOpen = !syncState.configPanelOpen;
  notifyUI();
}

export function saveCustomFirebaseConfigFromUI(rawInput) {
  try {
    setCustomFirebaseConfig(rawInput);
    showToast("✦ Configurazione Firebase aggiornata! Ricarico...");
    setTimeout(() => location.reload(), 800);
  } catch (err) {
    showToast("✕ " + (err.message || "JSON non valido"));
  }
}

export function restoreDefaultFirebaseConfig() {
  resetFirebaseConfig();
  showToast("✦ Configurazione predefinita ripristinata! Ricarico...");
  setTimeout(() => location.reload(), 800);
}

export function isUsingCustomConfig() {
  return hasCustomFirebaseConfig();
}

export function initSync(optionsOrFn) {
  if (typeof optionsOrFn === "function") {
    _onSettingsRender = optionsOrFn;
    _onFullStateRender = optionsOrFn;
  } else if (optionsOrFn && typeof optionsOrFn === "object") {
    _onSettingsRender = optionsOrFn.onSettingsRender || null;
    _onFullStateRender = optionsOrFn.onFullStateRender || optionsOrFn.onSettingsRender || null;
  }

  onStateSaved(() => {
    scheduleCloudSave();
  });
  registerImmediateSyncHandler(async st => {
    await pushToCloudImmediate(st);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
      pushToCloudImmediate();
    }
  });

  window.addEventListener("online", () => {
    if (auth?.currentUser) {
      pushToCloudImmediate();
    }
  });

  window.addEventListener("offline", () => {
    syncState.status = "offline";
    notifyUI();
  });

  try {
    const cfg = getFirebaseConfig();
    app = initializeApp(cfg);
    auth = getAuth(app);
    db = getFirestore(app);

    onAuthStateChanged(auth, async fbUser => {
      if (fbUser) {
        syncState.user = extractUserInfo(fbUser);
        await reconcileWithCloud(fbUser.uid);
        attachRealtimeListener(fbUser.uid);
        notifyUI();
      } else {
        syncState.user = null;
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
        if (sessionStorage.getItem(MANUAL_LOGOUT_KEY) === "1") {
          syncState.status = "offline";
          notifyUI();
        } else {
          try {
            syncState.status = "connecting";
            notifyUI();
            await signInAnonymously(auth);
          } catch (anonErr) {
            console.warn("Autenticazione anonima automatica non riuscita:", anonErr);
            syncState.status = navigator.onLine ? "error" : "offline";
            syncState.errorMsg = translateFirebaseError(anonErr);
            notifyUI();
          }
        }
      }
    });
  } catch (err) {
    console.error("Errore initSync Firebase:", err);
    syncState.status = "error";
    syncState.errorMsg = translateFirebaseError(err);
    notifyUI();
  }
}
