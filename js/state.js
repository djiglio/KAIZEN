/* ============================================================
 state.js — stato applicazione, persistenza, backup
 KAIZEN v6.0
 ============================================================ */

import { showToast } from "./ui.js";

const STORAGE_KEY = "kaizenV6_0";

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
 equipped: { arma:null, elmo:null, scudo:null, corazza:null, gambali:null, bracciali:null },
 zaino: [], // array di { id, type } dove type = "equip"|"relic"
});

const defaultWorld = () => ({
 denari: 30,
 pvAttuali: 50,
 paAttuali: 5,
 ultimaSessionePV: null,
 ultimaSessionePA: null,
 reliquieAttive: [], // [{ id, expiry }]
 missioniLog: [],
 nemiciAbbattuti: {},
 nemiciIncontrati: {},
 tesoriScoperti: {},
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

const defaultState = () => ({
 habits: defaultHabits(),
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
});

/* ── Migrazione da vecchie versioni ── */
function migrate(p) {
 if (!p.habits) p.habits = defaultHabits();
 if (!p.equipment) p.equipment = defaultEquipment();
 if (!p.world) p.world = defaultWorld();
 else {
 const dw = defaultWorld();
 p.world = { ...dw, ...p.world };
 if (!p.world.wq) p.world.wq = dw.wq;
 else p.world.wq = { ...dw.wq, ...p.world.wq };
 if (!p.world.reliquieAttive) p.world.reliquieAttive = [];
    if (!p.world.worldProgress) {
      p.world.worldProgress = defaultWorld().worldProgress;
    } else {
      const _dwp = defaultWorld().worldProgress;
      const _ex  = p.world.worldProgress;
      p.world.worldProgress = { ..._dwp, ..._ex };
      if (!_ex.areeSbloccate)             p.world.worldProgress.areeSbloccate = ['foresta'];
      if (!_ex.missioniPerArea)           p.world.worldProgress.missioniPerArea = {};
      if (!_ex.deniariPerArea)            p.world.worldProgress.deniariPerArea = {};
      if (!_ex.spedizioniPerArea)         p.world.worldProgress.spedizioniPerArea = {};
      if (!_ex.uccisioniPerAreaEnemyName) p.world.worldProgress.uccisioniPerAreaEnemyName = {};
      if (!_ex.lottiPerArea)              p.world.worldProgress.lottiPerArea = {};
      if (!_ex.deiSconfitti)              p.world.worldProgress.deiSconfitti = [];
      if (!_ex.bottiniDivini)             p.world.worldProgress.bottiniDivini = [];
      if (!_ex.trofeiEmpirei)             p.world.worldProgress.trofeiEmpirei = [];
    }
 if (!p.world.worldProgress) {
  p.world.worldProgress = defaultWorld().worldProgress;
 } else {
  const _dwp = defaultWorld().worldProgress;
  const _ex  = p.world.worldProgress;
  p.world.worldProgress = { ..._dwp, ..._ex };
  if (!_ex.areeSbloccate)             p.world.worldProgress.areeSbloccate = ['foresta'];
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
 for (const slot of ["arma","elmo","scudo","corazza","gambali","bracciali"]) {
 if (!(slot in p.equipment.equipped)) p.equipment.equipped[slot] = null;
 }
 if (!p.equipment.zaino) p.equipment.zaino = [];
 if (!p.activeQuestsEvo) p.activeQuestsEvo = [];
 if (!p.activeQuestsWorld) p.activeQuestsWorld = [];
 if (p.lastQuestWeek === undefined) p.lastQuestWeek = -1;
 if (!p.trophies) p.trophies = {};
 if (!p.history) p.history = [];
 if (!p.settings) p.settings = { theme:"dark" };
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

export function save() {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(store.state));
}

export function exportData() {
 try {
 const dataStr = btoa(encodeURIComponent(JSON.stringify(store.state)));
 navigator.clipboard.writeText(dataStr)
 .then(() => showToast(" Sigillo copiato negli appunti!"))
 .catch(() => {
 const ta = document.createElement("textarea");
 ta.value = dataStr;
 document.body.appendChild(ta);
 ta.select();
 document.execCommand("copy");
 document.body.removeChild(ta);
 showToast(" Sigillo copiato!");
 });
 } catch {
 showToast(" Errore esportazione");
 }
}

export function importData() {
 const input = prompt("Incolla il Sigillo di Kaizen v6:");
 if (!input) return;
 try {
 const parsed = JSON.parse(decodeURIComponent(atob(input.trim())));
 store.state = migrate(parsed);
 save();
 showToast(" Sincronizzazione completata!");
 setTimeout(() => location.reload(), 1000);
 } catch {
 showToast(" Sigillo non valido!");
 }
}
