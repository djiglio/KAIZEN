/* ============================================================
 main.js — punto di ingresso KAIZEN v6.67
 ============================================================ */

import {
  exportData,
  importData,
  downloadSigilloFile,
  uploadSigilloFile,
  store,
  save
} from "./state.js";
import { updateXP, checkEndOfDay, refreshQuests } from "./engine.js";
import { toggleSidebar, showPage, showRankPage, switchTab } from "./navigation.js";
import {
  render,
  renderWorld,
  renderSettings,
  showBestiaryDetail,
  showTreasureDetail,
  showTrophyDetail,
  showRankDetail,
  toggleAllTreasures,
  closeDetailModal,
  showAllAreaQuests
} from "./render.js";
import { updateTimer, createParticles } from "./ui.js";
import { runMission, regenPV, regenPA } from "./world.js";
import {
  buyPotion,
  buyEquipment,
  equipItem,
  unequipItem,
  discardItem,
  useRelic,
  repairItem,
  openCoatingModal,
  applyCoating
} from "./shop.js";
import { APP_VERSION, APP_RELEASE, BESTIARY, rankTitles } from "./data.js";
import { preloadAllImages, initImgObserver } from "./img.js";
import {
  initSync,
  loginWithGoogle,
  submitEmailAuth,
  logoutCloud,
  forceSyncNow,
  connectAnonymousSession,
  toggleEmailPanel,
  setEmailMode,
  saveCustomFirebaseConfigFromUI,
  restoreDefaultFirebaseConfig
} from "./sync.js";

/* ── API globale (definita immediatamente per garantire reattività UI) ── */
window.__kaizen = {
  // Mondo esterno — cambio area
  setArea(areaId) {
    const wp = store.state.world?.worldProgress;
    if (!wp) return;
    if (!wp.areeSbloccate.includes(areaId)) return;
    wp.areaCorrente = areaId;
    save();
    render();
  },
  // Navigation
  toggleSidebar,
  showPage,
  showRankPage,
  switchTab,
  // Data & Sigillo (Backup manuale secondario)
  exportData,
  importData,
  downloadSigilloFile,
  uploadSigilloFile,
  // Sincronizzazione Firebase
  loginWithGoogle,
  logoutCloud,
  forceSyncNow,
  connectAnonymousSession,
  toggleEmailPanel,
  setEmailMode,
  togglePasswordVisibility() {
    const pwdEl = document.getElementById("sync-password-input");
    const btnEl = document.getElementById("sync-pwd-toggle");
    if (!pwdEl || !btnEl) return;
    const isHidden = pwdEl.type === "password";
    pwdEl.type = isHidden ? "text" : "password";
    btnEl.setAttribute("aria-pressed", String(isHidden));
    btnEl.textContent = isHidden ? "Nascondi" : "Mostra";
  },
  saveCustomFirebaseConfig() {
    const ta = document.getElementById("sync-custom-cfg-input");
    if (!ta) return;
    saveCustomFirebaseConfigFromUI(ta.value);
  },
  restoreDefaultFirebaseConfig,
  // Game
  updateXP,
  runMission,
  // Shop
  buyPotion,
  buyEquipment,
  equipItem,
  unequipItem,
  discardItem,
  useRelic,
  repairItem,
  openCoatingModal,
  applyCoating,
  // Bacheca modals
  showBestiaryDetail,
  showAllAreaQuests,
  showTreasureDetail,
  showTrophyDetail,
  showRankDetail,
  toggleAllTreasures,
  closeDetailModal,
  // Render callback
  onAfterUpdate: render,
};

/* ── Inizializzazione protetta da try/catch ── */
try { createParticles(); } catch (e) { console.error("createParticles error:", e); }
try { checkEndOfDay(); } catch (e) { console.error("checkEndOfDay error:", e); }
try { refreshQuests(); } catch (e) { console.error("refreshQuests error:", e); }
try { preloadAllImages(BESTIARY, rankTitles); } catch (e) { console.error("preloadAllImages error:", e); }
try { initImgObserver(); } catch (e) { console.error("initImgObserver error:", e); }
try { render(); } catch (e) { console.error("initial render error:", e); }

/* ── Inizializzazione Sincronizzazione Firebase ── */
try {
  initSync({
    onSettingsRender: () => {
      try { renderSettings(); } catch (e) { console.error("renderSettings error:", e); }
    },
    onFullStateRender: () => {
      try {
        checkEndOfDay();
        refreshQuests();
        render();
      } catch (e) {
        console.error("onFullStateRender error:", e);
      }
    }
  });
} catch (e) {
  console.error("initSync error:", e);
}

/* ── Info app ── */
const vEl = document.getElementById("app-version");
const rEl = document.getElementById("app-release");
if (vEl) vEl.textContent = APP_VERSION;
if (rEl) rEl.textContent = APP_RELEASE;

/* ── Form Email/Password listener (Modern Web Guidance) ── */
const emailForm = document.getElementById("sync-email-form");
if (emailForm) {
  emailForm.addEventListener("submit", async e => {
    e.preventDefault();
    const emailEl = document.getElementById("sync-email-input");
    const pwdEl = document.getElementById("sync-password-input");
    const submitBtn = document.getElementById("sync-email-submit-btn");
    if (submitBtn) submitBtn.disabled = true;
    try {
      await submitEmailAuth(emailEl?.value || "", pwdEl?.value || "");
      if (pwdEl) pwdEl.value = "";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* ── Timer countdown ── */
try {
  setInterval(updateTimer, 1000);
  updateTimer();
} catch (e) {
  console.error("updateTimer error:", e);
}

/* ── Regen ogni minuto ── */
setInterval(() => {
  try {
    regenPV();
    regenPA();
    renderWorld();
  } catch (e) {
    console.error("Regen loop error:", e);
  }
}, 60_000);
