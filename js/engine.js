/* ============================================================
 engine.js — logica XP, livelli, statistiche, reset,
 aggiornamento quest evoluzione
 KAIZEN v6.0
 ============================================================ */

import { store, save } from "./state.js";
import { HABITS, STAT_DEFS, rankTitles,
 QUEST_POOL_EVO, QUEST_POOL_WORLD,
 EQUIPMENT_POOL, RELICS,
 WORLD_AREAS, AREA_QUESTS, EMPIREO_GODS, EMPIREO_LOOT,
 getEnemiesForArea } from "./data.js";
import { showToast } from "./ui.js";

/* ── Utility ── */
export function isDone(last) {
 return !!last && new Date().toDateString() === new Date(last).toDateString();
}

export function getWeekNumber(d) {
 const dc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
 dc.setUTCDate(dc.getUTCDate() + 4 - (dc.getUTCDay() || 7));
 const yearStart = new Date(Date.UTC(dc.getUTCFullYear(), 0, 1));
 return Math.ceil(((dc - yearStart) / 86400000 + 1) / 7);
}

export function habitLevel(hab) {
 return Math.floor((store.state.habits[hab]?.xp || 0) / 100);
}

export function habitXpInLevel(hab) {
 return (store.state.habits[hab]?.xp || 0) % 100;
}

/* ── Statistiche eroe calcolate ── */
export function getHeroStats() {
 const h = store.state.habits;
 const eq = store.state.equipment;
 const w = store.state.world;
 const now = Date.now();

 // Livelli base da abitudini
 const lvls = {};
 for (const hd of HABITS) lvls[hd.id] = habitLevel(hd.id);

 // Valori base
 let stats = {};
 for (const sd of STAT_DEFS) {
 stats[sd.id] = sd.formula(lvls[sd.habit] || 0);
 }

 // Bonus equipaggiamento
 const eqBonus = { attacco:0, difesa:0, velocita:0, critico:0 };
 for (const slot of ["arma","elmo","scudo","corazza","gambali","bracciali"]) {
 const id = eq.equipped[slot];
 if (!id) continue;
 const piece = EQUIPMENT_POOL.find(e => e.id === id);
 if (!piece) continue;
 for (const [k,v] of Object.entries(piece.bonus)) {
 eqBonus[k] = (eqBonus[k] || 0) + v;
 }
 }

 // Bonus reliquie attive
 const relBonus = {};
 for (const ra of (w.reliquieAttive || [])) {
 if (now > ra.expiry) continue;
 const rel = RELICS.find(r => r.id === ra.id);
 if (!rel) continue;
 relBonus[rel.stat] = (relBonus[rel.stat] || 0) + rel.bonus;
 }

 // Applica bonus equipaggiamento
 stats.forza += eqBonus.attacco || 0;
 stats.velocita += eqBonus.velocita || 0;
 stats.critico = Math.min(80, stats.critico + (eqBonus.critico || 0));
 const bonusDifesa = eqBonus.difesa || 0;

 // Applica bonus reliquie
 for (const [stat, mult] of Object.entries(relBonus)) {
 if (stat === "costituzione") {
 stats.costituzione = Math.floor(stats.costituzione * (1 + mult));
 } else if (stats[stat] !== undefined) {
 stats[stat] = Math.floor(stats[stat] * (1 + mult));
 }
 }

 // Sconto carisma (%)
 const shopDiscount = Math.min(40, stats.carisma);

 return {
 ...stats,
 bonusDifesa,
 eqBonus,
 relBonus,
 shopDiscount,
 pvMax: stats.costituzione,
 paMax: stats.sopravvivenza,
 };
}

/* ── Rango dell'eroe (media livelli abitudini) ── */
export function getHeroRank() {
 let total = 0;
 for (const hd of HABITS) total += habitLevel(hd.id);
 return Math.floor(total / HABITS.length);
}

export function getRankTitle(rank) {
 let title = rankTitles[0].t;
 for (const rt of rankTitles) { if (rank >= rt.r) title = rt.t; }
 return title;
}

/* ── Reset fine giornata ── */
export function checkEndOfDay() {
 const state = store.state;
 const today = new Date().toDateString();
 if (state.lastDayCheck && state.lastDayCheck !== today) {
 let missed = 0;
 for (const hd of HABITS) {
 const h = state.habits[hd.id];
 if (!h) continue;
 const lastDay = h.last ? new Date(h.last).toDateString() : null;
 if (lastDay !== state.lastDayCheck) {
 h.xp = Math.max(0, h.xp - 5);
 h.streak = 0;
 h.result = null;
 missed++;
 } else {
 h.result = null; // reset per nuovo giorno
 }
 }
 if (missed > 0) {
 addHistory(` OBLIO: ${missed} abitudini dimenticate. -${missed*5}XP totali`, "system");
 }
 }
 state.lastDayCheck = today;
 save();
}

/* ── Refresh missioni settimanali ── */
export function refreshQuests() {
 const state = store.state;
 const curWeek = getWeekNumber(new Date());
 if (state.lastQuestWeek === curWeek) return;

 // Evoluzione: 3 casuali
 state.activeQuestsEvo = [...QUEST_POOL_EVO]
 .sort(() => Math.random() - 0.5)
 .slice(0, 3)
 .map(q => ({ ...q, progress:0, completed:false }));

 // Mondo: 3 casuali
 state.activeQuestsWorld = [...QUEST_POOL_WORLD]
 .sort(() => Math.random() - 0.5)
 .slice(0, 3)
 .map(q => ({ ...q, progress:0, completed:false }));

 state.lastQuestWeek = curWeek;
 addHistory(" Nuove Quest Settimanali Disponibili!", "system");
 save();
}

/* ── Aggiorna progresso quest evoluzione ── */
export function updateEvoQuests(habitId, count = 1) {
 const state = store.state;
 let anyCompleted = false;

 for (const q of state.activeQuestsEvo) {
 if (q.completed) continue;
 let hit = false;
 if (q.type === "total") hit = true;
 else if (q.type === "habit" && q.habit === habitId) hit = true;
 else if (q.type === "multi" && q.habits?.includes(habitId)) hit = true;
 else if (q.type === "all_once" ) hit = true;
 else if (q.type === "all_twice" ) hit = true;
 else if (q.type === "all_three" ) hit = true;
 else if (q.type === "variety5" ) hit = true;
 else if (q.type === "perfect_day") { /* gestito separatamente */ }

 if (hit) {
 q.progress = Math.min(q.target, q.progress + count);
 if (q.progress >= q.target && !q.completed) {
 q.completed = true;
 anyCompleted = true;
 grantQuestReward(q, "evo");
 }
 }
 }

 // Controlla se tutte e 3 le evo sono completate
 checkAllEvoComplete();
 return anyCompleted;
}

export function completePerfectDayQuests() {
 const state = store.state;
 for (const q of state.activeQuestsEvo) {
 if (q.completed || q.type !== "perfect_day") continue;
 q.progress = Math.min(q.target, q.progress + 1);
 if (q.progress >= q.target) {
 q.completed = true;
 grantQuestReward(q, "evo");
 }
 }
 checkAllEvoComplete();
}

function checkAllEvoComplete() {
 const state = store.state;
 if (state.activeQuestsEvo.length > 0 &&
 state.activeQuestsEvo.every(q => q.completed) &&
 !state._evoAllDone) {
 state._evoAllDone = true;
 // +20 XP a tutte le abitudini
 for (const hd of HABITS) {
 if (state.habits[hd.id]) state.habits[hd.id].xp += 20;
 }
 addHistory(" TUTTE LE QUEST EVOLUZIONE COMPLETATE! +20 XP", "quest");
 showToast(" Tutte le Quest Evoluzione! +20 XP");
 }
}

export function checkAllWorldComplete() {
 const state = store.state;
 if (state.activeQuestsWorld.length > 0 &&
 state.activeQuestsWorld.every(q => q.completed) &&
 !state._worldAllDone) {
 state._worldAllDone = true;
 for (const hd of HABITS) {
 if (state.habits[hd.id]) state.habits[hd.id].xp += 20;
 }
 addHistory(" TUTTE LE QUEST MONDO COMPLETATE! +20 XP", "quest");
 showToast(" Tutte le Quest Mondo! +20 XP");
 }
}

function grantQuestReward(q, type) {
 const state = store.state;
 // +15 XP a tutte le abitudini
 for (const hd of HABITS) {
 if (state.habits[hd.id]) state.habits[hd.id].xp += 15;
 }
 // +50 denari
 state.world.denari += 50;
 state.trophies[q.id] = (state.trophies[q.id] || 0) + 1;
 addHistory(` Quest completata: ${q.text} — +15 XP +50 denari`, "quest");
 showToast(` ${q.text}! +15 XP +50 🪙`);
}

/* ── Aggiorna progresso quest mondo esterno ── */
export function updateWorldQuests(type, payload = {}) {
 const state = store.state;
 for (const q of state.activeQuestsWorld) {
 if (q.completed) continue;
 let hit = false;
 let inc = payload.count || 1;

 switch (q.type) {
 case "kills_any": if (type === "kill") hit = true; break;
 case "kills_tag": if (type === "kill" && payload.tags?.includes(q.tag)) hit = true; break;
 case "kills_lvl": if (type === "kill" && payload.lvl >= (q.minLvl||0)) hit = true; break;
 case "kills_human": if (type === "kill" && payload.human) hit = true; break;
 case "loot_value": if (type === "loot") { inc = payload.value||0; hit = true; } break;
 case "missions_total":if (type === "mission") hit = true; break;
 case "discoveries": if (type === "discovery") hit = true; break;
 case "relics_found": if (type === "relic") hit = true; break;
 case "fled": if (type === "fled") hit = true; break;
 case "denari_earned": if (type === "denari") { inc = payload.value||0; hit = true; } break;
 case "combats_total": if (type === "combat") hit = true; break;
 case "equip_looted": if (type === "equip_loot") hit = true; break;
 case "win_streak": if (type === "win_streak") { inc = payload.count||1; hit = true; } break;
 case "survived_low_hp":if (type === "survived_low") hit = true; break;
 case "no_damage_missions":if (type === "no_damage") hit = true; break;
 case "rare_finds": if (type === "rare_find") hit = true; break;
 case "unique_finds": if (type === "unique_find") hit = true; break;
 case "unique_enemies":if (type === "unique_enemy") hit = true; break;
 }

 if (hit) {
 q.progress = Math.min(q.target, q.progress + inc);
 if (q.progress >= q.target && !q.completed) {
 q.completed = true;
 grantQuestReward(q, "world");
 checkAllWorldComplete();
 }
 }
 }
}

/* ── updateXP: click abitudine ── */
export function updateXP(habitId, isPos) {
 const state = store.state;
 const h = state.habits[habitId];
 if (!h) return;
 const now = new Date();
 let xpGain = 10;

 if (isPos && h.last) {
 // Streak: abitudine completata il giorno precedente
 const yest = new Date(); yest.setDate(yest.getDate() - 1);
 if (new Date(h.last).toDateString() === yest.toDateString()) {
 xpGain = 15;
 h.streak = (h.streak || 0) + 1;
 } else {
 h.streak = 1;
 }
 }

 if (isPos) {
 const lvlBefore = habitLevel(habitId);
 h.xp += xpGain;
 h.last = now.getTime();
 h.result = "done";
 const lvlAfter = habitLevel(habitId);
 state.world.denari += 2;

 showToast(`+${xpGain} XP — ${HABITS.find(x=>x.id===habitId)?.label}`);

 if (lvlAfter > lvlBefore) {
 showToast(`${HABITS.find(x=>x.id===habitId)?.label} — Livello ${lvlAfter}!`);
 addHistory(`${HABITS.find(x=>x.id===habitId)?.label} sale al Livello ${lvlAfter}!`, "habit");
 }

 // Aggiorna quest evoluzione
 updateEvoQuests(habitId, 1);

 // Controlla giornata perfetta:
 // TUTTE le abitudini devono essere completate oggi con result="done"
 // Se anche solo una è "failed" oggi, il trofeo non si vince
 const allMarkedToday = HABITS.every(hd => isDone(state.habits[hd.id]?.last));
 const anyFailed = HABITS.some(hd => {
 const hx = state.habits[hd.id];
 return isDone(hx?.last) && hx?.result === "failed";
 });
 if (allMarkedToday && !anyFailed) {
 // Evita di assegnare il trofeo più volte nella stessa giornata
 const todayStr = new Date().toDateString();
 if (state._lastPerfectDayStr !== todayStr) {
 state._lastPerfectDayStr = todayStr;
 state.trophies["day_perfect"] = (state.trophies["day_perfect"] || 0) + 1;
 state.lastPerfectDate = Date.now();
 for (const hd of HABITS) state.habits[hd.id].xp += 5;
 state.world.denari += 8;
 addHistory("GIORNATA PERFETTA! +5 XP +8 🪙", "habit");
 showToast("Giornata Perfetta! +5 XP!");
 completePerfectDayQuests();
 }
 }

 addHistory(`+${xpGain}XP: ${HABITS.find(x=>x.id===habitId)?.label}`, "habit");
 } else {
 h.xp = Math.max(0, h.xp - 5);
 h.last = now.getTime();
 h.result = "failed";
 h.streak = 0;
 showToast(`-5 XP — ${HABITS.find(x=>x.id===habitId)?.label}`);
 addHistory(`-5XP: ${HABITS.find(x=>x.id===habitId)?.label}`, "habit");
 }

 if (state.history.length > 200) state.history = state.history.slice(0, 200);
 save();

 if (typeof window.__kaizen?.onAfterUpdate === "function") {
 window.__kaizen.onAfterUpdate();
 }
}


/* ══════════════════════════════════════════════════════════
 AREA QUESTS — Missioni permanenti per area
══════════════════════════════════════════════════════════ */

/** Restituisce (o inizializza) il tracker missioni di un'area */
function getAreaMissions(wp, areaId) {
  if (!wp.missioniPerArea[areaId]) wp.missioniPerArea[areaId] = {};
  const pool = AREA_QUESTS[areaId] || [];
  for (const q of pool) {
    if (!wp.missioniPerArea[areaId][q.id]) {
      wp.missioniPerArea[areaId][q.id] = { progress: 0, completed: false };
    }
  }
  return wp.missioniPerArea[areaId];
}

/** Controlla se tutte le missioni di un'area sono completate e sblocca la successiva */
function checkAreaUnlock(wp, areaId) {
  const pool = AREA_QUESTS[areaId] || [];
  const tracker = wp.missioniPerArea[areaId] || {};
  const allDone = pool.every(q => tracker[q.id]?.completed);
  if (!allDone) return;
  const area = WORLD_AREAS.find(a => a.id === areaId);
  if (!area?.sblocca) return;
  if (!wp.areeSbloccate.includes(area.sblocca)) {
    wp.areeSbloccate.push(area.sblocca);
    addHistory(`Nuova zona sbloccata: ${WORLD_AREAS.find(a=>a.id===area.sblocca)?.name}!`, "quest");
    showToast(`✨ Zona sbloccata: ${WORLD_AREAS.find(a=>a.id===area.sblocca)?.name}!`);
  }
}

/** Aggiorna una singola missione area e completa se raggiunge il target */
function tickAreaQuest(wp, areaId, questId, inc) {
  const missions = getAreaMissions(wp, areaId);
  const q = (AREA_QUESTS[areaId] || []).find(x => x.id === questId);
  if (!q) return;
  const t = missions[questId];
  if (t.completed) return;
  t.progress = Math.min(q.target, t.progress + inc);
  if (t.progress >= q.target) {
    t.completed = true;
    grantAreaQuestReward(q, areaId);
    checkAreaUnlock(wp, areaId);
  }
}

function grantAreaQuestReward(q, areaId) {
  const state = store.state;
  // Ricompense base per missione area
  const xpBonus = areaId === "empireo" ? 50 : 20;
  const goldBonus = areaId === "empireo" ? 500 : 100;
  for (const hd of HABITS) {
    if (state.habits[hd.id]) state.habits[hd.id].xp += xpBonus;
  }
  state.world.denari += goldBonus;
  if (q.trophy) {
    state.world.worldProgress.trofeiEmpirei.push(q.id);
    addHistory(`🏆 TROFEO: ${q.title}! +${xpBonus} XP +${goldBonus} 🪙`, "quest");
    showToast(`🏆 ${q.title}!`);
    if (q.final) {
      state.world.worldProgress.gameCompleted = true;
      addHistory("⚜️ KAIZEN COMPLETATO — Mortale Asceso!", "quest");
      showToast("⚜️ KAIZEN COMPLETATO!");
    }
  } else {
    addHistory(`✅ Missione: ${q.title} — +${xpBonus} XP +${goldBonus} 🪙`, "quest");
    showToast(`✅ ${q.title}! +${xpBonus} XP`);
  }
}

/**
 * Punto centrale di aggiornamento missioni area.
 * Chiamata da world.js dopo ogni spedizione.
 *
 * events: array di oggetti { type, areaId, enemyName, godId, lootId, denari, lootCount }
 */
export function updateAreaQuests(events) {
  const state = store.state;
  // Inizializza worldProgress se mancante (salvataggi precedenti)
  if (!state.world.worldProgress) {
    state.world.worldProgress = {
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
    };
  }
  const wp = state.world.worldProgress;
  // Inizializza sub-oggetti mancanti
  if (!wp.missioniPerArea)           wp.missioniPerArea = {};
  if (!wp.deniariPerArea)            wp.deniariPerArea = {};
  if (!wp.spedizioniPerArea)         wp.spedizioniPerArea = {};
  if (!wp.uccisioniPerAreaEnemyName) wp.uccisioniPerAreaEnemyName = {};
  if (!wp.lottiPerArea)              wp.lottiPerArea = {};
  if (!wp.deiSconfitti)              wp.deiSconfitti = [];
  if (!wp.bottiniDivini)             wp.bottiniDivini = [];
  if (!wp.trofeiEmpirei)             wp.trofeiEmpirei = [];

  for (const ev of events) {
    const aid = ev.areaId;
    const pool = AREA_QUESTS[aid] || [];

    // --- Aggiorna contatori cumulativi ---
    if (ev.type === "spedizione") {
      wp.spedizioniPerArea[aid] = (wp.spedizioniPerArea[aid] || 0) + 1;
    }
    if (ev.type === "kill") {
      if (!wp.uccisioniPerAreaEnemyName[aid]) wp.uccisioniPerAreaEnemyName[aid] = {};
      const n = ev.enemyName;
      wp.uccisioniPerAreaEnemyName[aid][n] = (wp.uccisioniPerAreaEnemyName[aid][n] || 0) + 1;
    }
    if (ev.type === "loot") {
      wp.lottiPerArea[aid] = (wp.lottiPerArea[aid] || 0) + (ev.lootCount || 1);
      wp.deniariPerArea[aid] = (wp.deniariPerArea[aid] || 0) + (ev.denari || 0);
    }
    if (ev.type === "kill_god") {
      if (!wp.deiSconfitti.includes(ev.godId)) {
        wp.deiSconfitti.push(ev.godId);
      }
    }
    if (ev.type === "loot_god") {
      if (!wp.bottiniDivini.includes(ev.lootId)) {
        wp.bottiniDivini.push(ev.lootId);
      }
    }

    // --- Valuta ogni missione dell'area ---
    for (const q of pool) {
      const missions = getAreaMissions(wp, aid);
      if (missions[q.id]?.completed) continue;

      let inc = 0;

      switch (q.type) {
        case "spedizioni":
          if (ev.type === "spedizione") {
            // Usa il valore cumulativo
            const cumSped = wp.spedizioniPerArea[aid] || 0;
            missions[q.id].progress = Math.min(q.target, cumSped);
            if (missions[q.id].progress >= q.target) {
              missions[q.id].completed = true;
              grantAreaQuestReward(q, aid);
              checkAreaUnlock(wp, aid);
            }
          }
          break;

        case "kills_name":
          if (ev.type === "kill" && ev.enemyName === q.enemy) inc = 1;
          if (inc > 0) tickAreaQuest(wp, aid, q.id, inc);
          break;

        case "kills_area":
          if (ev.type === "kill") inc = 1;
          if (inc > 0) tickAreaQuest(wp, aid, q.id, inc);
          break;

        case "loot_area":
          if (ev.type === "loot") {
            const cumLoot = wp.lottiPerArea[aid] || 0;
            missions[q.id].progress = Math.min(q.target, cumLoot);
            if (missions[q.id].progress >= q.target) {
              missions[q.id].completed = true;
              grantAreaQuestReward(q, aid);
              checkAreaUnlock(wp, aid);
            }
          }
          break;

        case "denari_area":
          if (ev.type === "loot") {
            const cumDen = wp.deniariPerArea[aid] || 0;
            missions[q.id].progress = Math.min(q.target, cumDen);
            if (missions[q.id].progress >= q.target) {
              missions[q.id].completed = true;
              grantAreaQuestReward(q, aid);
              checkAreaUnlock(wp, aid);
            }
          }
          break;

        case "kills_god":
          if (ev.type === "kill_god" && ev.godId === q.godId) {
            missions[q.id].progress = 1;
            missions[q.id].completed = true;
            grantAreaQuestReward(q, aid);
            checkAreaUnlock(wp, aid);
          }
          break;

        case "kills_all_gods":
          if (ev.type === "kill_god") {
            missions[q.id].progress = Math.min(q.target, wp.deiSconfitti.length);
            if (missions[q.id].progress >= q.target) {
              missions[q.id].completed = true;
              grantAreaQuestReward(q, aid);
              checkAreaUnlock(wp, aid);
            }
          }
          break;

        case "loot_god":
          if (ev.type === "loot_god" && ev.lootId === q.lootId) {
            missions[q.id].progress = 1;
            missions[q.id].completed = true;
            grantAreaQuestReward(q, aid);
            checkAreaUnlock(wp, aid);
          }
          break;
      }
    }
  }

  save();
}

/* ── Helper: aggiungi alla cronologia ── */
export function addHistory(msg, cat) {
 const state = store.state;
 state.history.unshift({ t: Date.now(), msg, cat: cat || "system" });
 if (state.history.length > 200) state.history = state.history.slice(0, 200);
}
