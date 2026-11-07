/* ============================================================
 state.js — stato applicazione, persistenza, backup
 KAIZEN v6.66
 ============================================================ */

import { showToast } from "./ui.js";
import { AREA_LOOT_POOL, APP_VERSION, EQUIPMENT_POOL, HABITS, getTreasureDef } from "./data.js";

export const STORAGE_KEY = "kaizenV6_0";

let _onSaveListeners = [];
let _onImmediateSyncRequest = null;

export function onStateSaved(cb) {
  if (typeof cb === "function") _onSaveListeners.push(cb);
}

export function registerImmediateSyncHandler(fn) {
  _onImmediateSyncRequest = fn;
}

const defaultHabits = () => ({
  allenamento: { xp:0, last:null, streak:0 },
  passi: { xp:0, last:null, streak:0 },
  stretching: { xp:0, last:null, streak:0 },
  piegamenti: { xp:0, last:null, streak:0 },
  enigmistica: { xp:0, last:null, streak:0 },
  dieta: { xp:0, last:null, streak:0 },
  meditazione: { xp:0, last:null, streak:0 },
  lettura: { xp:0, last:null, streak:0 },
  sonno: { xp:0, last:null, streak:0 },
  studio: { xp:0, last:null, streak:0 },
  lingue: { xp:0, last:null, streak:0 },
});

const defaultEquipment = () => ({
  equipped: { testa: null, torace: null, braccia: null, mano_dx: null, mano_sx: null, gambe: null },
  zaino: [], // array di { id, type } dove type = "equip"|"relic"|"material"
});

const defaultWorld = () => ({
  denari: 30,
  pvAttuali: 50,
  paAttuali: 5,
  ultimaSessionePV: null,
  ultimaSessionePA: null,
  reliquieAttive: [], // [{ id, remaining }]
  missioniLog: [],
  nemiciAbbattuti: {},
  nemiciIncontrati: {},
  tesoriScoperti: {},
  tesoriMilestones: {},
  deniariTotaliGuadagnati: 0,
  regenBoostExpiry: null,
  // progressione aree mondo esterno
  worldProgress: {
    areaCorrente: "foresta",
    areeSbloccate: ["foresta"],
    missioniPerArea: {},
    deniariPerArea: {},
    spedizioniPerArea: {},
    uccisioniPerAreaEnemyName: {},
    lottiPerArea: {},
    deiSconfitti: [],
    bottiniDivini: [],
    trofeiEmpirei: [],
    gameCompleted: false,
  },
  // tracker quest mondo esterno
  wq: {
    kills_any: 0,
    kills_tag: {}, // tag -> count
    kills_lvl: {}, // minLvl -> count (stringa chiave)
    kills_human: 0,
    loot_value: 0,
    missions_total: 0,
    discoveries: 0,
    relics_found: 0,
    fled: 0,
    denari_earned: 0,
    combats_total: 0,
    equip_looted: 0,
    win_streak: 0,
    current_streak: 0,
    survived_low_hp: 0,
    no_damage_missions: 0,
    rare_finds: 0,
    unique_finds: [],
    unique_enemies: [],
  },
});

export const defaultState = () => ({
  habits: defaultHabits(),
  disciplina: { streak: 0, failedDate: null, sinceDate: new Date().toDateString() },
  equipment: defaultEquipment(),
  world: defaultWorld(),
  activeQuestsEvo: [],
  activeQuestsWorld: [],
  lastQuestWeek: -1,
  trophies: {}, // id -> count
  history: [], // { t, msg, cat }
  lastDayCheck: null,
  lastPerfectDate: null,
  settings: { theme:"dark" },
  _updatedAt: 0,
});

export function hasStateProgress(st) {
  if (!st) return false;
  if (Array.isArray(st.history) && st.history.length > 0) return true;
  if (st.world && (st.world.deniariTotaliGuadagnati > 0 || (st.world.wq && st.world.wq.missions_total > 0))) return true;
  if (st.habits) {
    for (const h of Object.values(st.habits)) {
      if (h && h.xp > 0) return true;
    }
  }
  return false;
}

/* ── Migrazione da vecchie versioni ── */
export function migrate(p) {
  if (!p.habits) p.habits = defaultHabits();
  if (!p.disciplina || typeof p.disciplina !== "object") {
    p.disciplina = { streak: 0, failedDate: null, sinceDate: new Date().toDateString() };
  } else {
    if (typeof p.disciplina.streak !== "number") p.disciplina.streak = 0;
    if (p.disciplina.failedDate === undefined) p.disciplina.failedDate = null;
  }
  if (!p.equipment) p.equipment = defaultEquipment();
  if (!p.world) p.world = defaultWorld();
  else {
    const dw = defaultWorld();
    p.world = { ...dw, ...p.world };
    if (!p.world.wq) p.world.wq = dw.wq;
    else {
      p.world.wq = { ...dw.wq, ...p.world.wq };
      if (!Array.isArray(p.world.wq.unique_enemies)) p.world.wq.unique_enemies = [];
      if (!Array.isArray(p.world.wq.unique_finds)) p.world.wq.unique_finds = [];
    }
    if (!p.world.tesoriMilestones) p.world.tesoriMilestones = {};
    if (p.world.tesoriScoperti && p.habits) {
      let retroXP = 0;
      let retroCount = 0;
      for (const [id, count] of Object.entries(p.world.tesoriScoperti)) {
        const c = Number(count) || 0;
        let lastM = p.world.tesoriMilestones[id] || 0;
        const def = getTreasureDef(id);
        const rarity = def?.rarity || 1;
        for (const m of [5, 10, 15]) {
          if (c >= m && lastM < m) {
            for (const hd of HABITS) {
              if (p.habits[hd.id]) {
                p.habits[hd.id].xp += rarity;
              }
            }
            lastM = m;
            p.world.tesoriMilestones[id] = m;
            retroXP += rarity;
            retroCount++;
          }
        }
      }
      if (retroXP > 0) {
        if (!Array.isArray(p.history)) p.history = [];
        p.history.unshift({
          t: Date.now(),
          msg: `🏆 Collezionismo: accreditati +${retroXP} XP a tutte le abitudini per ${retroCount} traguardi tesori già raggiunti (5, 10, 15 pezzi)`,
          cat: "system"
        });
      }
    }
    if (!Array.isArray(p.world.reliquieAttive)) {
      p.world.reliquieAttive = [];
    } else {
      const now = Date.now();
      p.world.reliquieAttive = p.world.reliquieAttive
        .filter(ra => ra && ra.id && (typeof ra.remaining === "number" ? ra.remaining > 0 : (ra.expiry && ra.expiry > now)))
        .map(ra => ({ id: ra.id, remaining: typeof ra.remaining === "number" ? ra.remaining : 5 }))
        .slice(0, 1);
    }
    if (!p.world.worldProgress) {
      p.world.worldProgress = defaultWorld().worldProgress;
    } else {
      const _dwp = defaultWorld().worldProgress;
      const _ex  = p.world.worldProgress;
      p.world.worldProgress = { ..._dwp, ..._ex };
      if (!_ex.areeSbloccate)             p.world.worldProgress.areeSbloccate = ["foresta"];
      if (!_ex.missioniPerArea)           p.world.worldProgress.missioniPerArea = {};
      if (!_ex.deniariPerArea)            p.world.worldProgress.deniariPerArea = {};
      if (!_ex.spedizioniPerArea)         p.world.worldProgress.spedizioniPerArea = {};
      if (!_ex.uccisioniPerAreaEnemyName) p.world.worldProgress.uccisioniPerAreaEnemyName = {};
      if (!_ex.lottiPerArea)              p.world.worldProgress.lottiPerArea = {};
      if (!_ex.deiSconfitti)              p.world.worldProgress.deiSconfitti = [];
      if (!_ex.bottiniDivini)             p.world.worldProgress.bottiniDivini = [];
      if (!_ex.trofeiEmpirei)             p.world.worldProgress.trofeiEmpirei = [];
    }
  }
  if (!p.equipment.equipped) p.equipment.equipped = defaultEquipment().equipped;
  if (!p.equipment.zaino) p.equipment.zaino = [];

  // Migrazione vecchi slot (v6.70 -> v6.71)
  const legacyMap = {
    elmo: "testa",
    corazza: "torace",
    bracciali: "braccia",
    arma: "mano_dx",
    scudo: "mano_sx",
    gambali: "gambe",
  };
  for (const [oldSlot, newSlot] of Object.entries(legacyMap)) {
    if (oldSlot in p.equipment.equipped) {
      if (p.equipment.equipped[oldSlot] && !p.equipment.equipped[newSlot]) {
        p.equipment.equipped[newSlot] = p.equipment.equipped[oldSlot];
      }
      delete p.equipment.equipped[oldSlot];
    }
  }

  for (const slot of ["testa","torace","braccia","mano_dx","mano_sx","gambe"]) {
    if (!(slot in p.equipment.equipped)) p.equipment.equipped[slot] = null;
    else if (typeof p.equipment.equipped[slot] === "string") {
      p.equipment.equipped[slot] = { id: p.equipment.equipped[slot], dur: 100 };
    } else if (p.equipment.equipped[slot] && p.equipment.equipped[slot].dur === undefined) {
      p.equipment.equipped[slot].dur = 100;
    }
  }

  // Se l'arma impugnata nella mano destra è a 2 mani ("2h"), sposta eventuale oggetto in mano sinistra nello zaino
  if (p.equipment.equipped.mano_dx && p.equipment.equipped.mano_sx) {
    const dxPiece = EQUIPMENT_POOL.find(e => e.id === p.equipment.equipped.mano_dx.id);
    if (dxPiece && dxPiece.handType === "2h") {
      const sxObj = p.equipment.equipped.mano_sx;
      p.equipment.zaino.push({
        id: sxObj.id,
        type: "equip",
        dur: sxObj.dur !== undefined ? sxObj.dur : 100,
        ...(sxObj.rivestimento ? { rivestimento: sxObj.rivestimento } : {}),
      });
      p.equipment.equipped.mano_sx = null;
    }
  }
  if (!p.equipment.zaino) p.equipment.zaino = [];
  else {
    const remainingZaino = [];
    let convertedDenari = 0;
    for (let i=0; i<p.equipment.zaino.length; i++) {
      const zItem = p.equipment.zaino[i];
      if (zItem.type === "arealoot") {
        let val = 10;
        for (const pool of Object.values(AREA_LOOT_POOL)) {
          const piece = pool.find(item => item.id === zItem.id);
          if (piece) { val = piece.value; break; }
        }
        convertedDenari += val;
        if (p.world) {
          if (!p.world.tesoriScoperti) p.world.tesoriScoperti = {};
          p.world.tesoriScoperti[zItem.id] = (p.world.tesoriScoperti[zItem.id] || 0) + 1;
        }
      } else {
        if (zItem.type === "equip" && zItem.dur === undefined) zItem.dur = 100;
        remainingZaino.push(zItem);
      }
    }
    if (convertedDenari > 0 && p.world) {
      p.world.denari = (p.world.denari || 0) + convertedDenari;
      p.world.deniariTotaliGuadagnati = (p.world.deniariTotaliGuadagnati || 0) + convertedDenari;
    }
    p.equipment.zaino = remainingZaino;
  }
  if (!p.activeQuestsEvo) p.activeQuestsEvo = [];
  if (!p.activeQuestsWorld) p.activeQuestsWorld = [];
  if (p.lastQuestWeek === undefined) p.lastQuestWeek = -1;
  if (!p.trophies) p.trophies = {};
  if (!p.history) p.history = [];
  if (!p.settings) p.settings = { theme:"dark" };
  if (typeof p._updatedAt !== "number") {
    p._updatedAt = hasStateProgress(p) ? Date.now() : 0;
  }
  return p;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const p = JSON.parse(raw);
    return migrate(p);
  } catch {
    return defaultState();
  }
}

export const store = { state: loadState() };

let _isSaving = false;
export function save() {
  if (_isSaving) return;
  _isSaving = true;
  try {
    store.state._updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.state));
    for (const cb of _onSaveListeners) {
      try { cb(store.state); } catch (e) { console.error(e); }
    }
  } finally {
    _isSaving = false;
  }
}

export function saveLocalOnly() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store.state));
}

export function encodeSigillo(stateObj = store.state) {
  return btoa(encodeURIComponent(JSON.stringify(stateObj)));
}

export function decodeSigillo(rawStr) {
  const trimmed = (rawStr || "").trim();
  if (!trimmed) throw new Error("Sigillo vuoto");
  if (trimmed.startsWith("{")) {
    const obj = JSON.parse(trimmed);
    if (obj.sigillo && typeof obj.sigillo === "string") {
      return JSON.parse(decodeURIComponent(atob(obj.sigillo.trim())));
    }
    if (obj.state && typeof obj.state === "object") {
      return obj.state;
    }
    if (obj.habits && obj.world) {
      return obj;
    }
  }
  return JSON.parse(decodeURIComponent(atob(trimmed)));
}

export function exportData() {
  try {
    const dataStr = encodeSigillo(store.state);
    navigator.clipboard.writeText(dataStr)
      .then(() => showToast("✦ Sigillo copiato negli appunti!"))
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = dataStr;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast("✦ Sigillo copiato!");
      });
  } catch {
    showToast("✕ Errore esportazione");
  }
}

export async function applyImportedState(parsedState) {
  store.state = migrate(parsedState);
  store.state._updatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store.state));
  if (typeof _onImmediateSyncRequest === "function") {
    try {
      await _onImmediateSyncRequest(store.state);
    } catch (e) {
      console.warn("Push cloud post-importazione non riuscito:", e);
    }
  }
  showToast("✦ Sigillo ripristinato con successo!");
  setTimeout(() => location.reload(), 900);
}

export function importData() {
  const input = prompt("Incolla il Sigillo di KAIZEN:");
  if (!input) return;
  try {
    const parsed = decodeSigillo(input);
    applyImportedState(parsed);
  } catch {
    showToast("✕ Sigillo non valido!");
  }
}

export function downloadSigilloFile() {
  try {
    const sigillo = encodeSigillo(store.state);
    const payload = {
      app: "KAIZEN RPG",
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      updatedAt: store.state._updatedAt || Date.now(),
      sigillo
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `kaizen-sigillo-v${APP_VERSION}-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("✦ File Sigillo scaricato!");
  } catch (e) {
    console.error(e);
    showToast("✕ Errore download Sigillo");
  }
}

export function uploadSigilloFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.txt,application/json,text/plain";
  input.onchange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const content = String(ev.target?.result || "");
        const parsed = decodeSigillo(content);
        applyImportedState(parsed);
      } catch (err) {
        console.error(err);
        showToast("✕ File Sigillo non valido!");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
