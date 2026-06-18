/* ============================================================
 world.js — Mondo Esterno v6.1
 PV/PA, regen, combattimento con schivate e critici,
 fuga basata su furtività, bottini, nemici con equip
 ============================================================ */

import { store, save } from "./state.js";
import { BESTIARY, TREASURES, RELICS,
         EQUIPMENT_POOL,
         WORLD_AREAS, EMPIREO_GODS, EMPIREO_LOOT,
         getEnemiesForArea } from "./data.js";
import { showToast, formatDate } from "./ui.js";
import { getHeroStats, addHistory,
         updateWorldQuests,
         checkAllWorldComplete,
         updateAreaQuests,
         getHeroRank, getRankTitle } from "./engine.js";
import { enemyImgHTML, enemyImgSmall,
 heroAvatarSmall, resolveImgs } from "./img.js";

/* ── Utility ── */
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/* ── Regen PV ── */
export function regenPV() {
 const w = store.state.world;
 const { pvMax } = getHeroStats();
 const now = Date.now();
 if (w.pvAttuali >= pvMax) { w.ultimaSessionePV = now; save(); return; }
 if (w.ultimaSessionePV) {
 const { guarigione } = getHeroStats();
 const boosted = w.regenBoostExpiry && now < w.regenBoostExpiry;
 const minsPerPV = boosted ? Math.max(0.5, guarigione / 2) : guarigione;
 const mins = (now - w.ultimaSessionePV) / 60000;
 const gained = Math.floor(mins / minsPerPV);
 if (gained > 0) w.pvAttuali = Math.min(pvMax, w.pvAttuali + gained);
 }
 w.ultimaSessionePV = now;
 w.pvAttuali = Math.min(pvMax, Math.max(0, w.pvAttuali));
 save();
}

/* ── Regen PA ── */
export function regenPA() {
 const w = store.state.world;
 const { paMax, pianificazione } = getHeroStats();
 const now = Date.now();
 if (w.paAttuali >= paMax) { w.ultimaSessionePA = now; save(); return; }
 if (w.ultimaSessionePA) {
 const minsPerPA = pianificazione;
 const mins = (now - w.ultimaSessionePA) / 60000;
 const gained = Math.floor(mins / minsPerPA);
 if (gained > 0) w.paAttuali = Math.min(paMax, w.paAttuali + gained);
 }
 w.ultimaSessionePA = now;
 w.paAttuali = Math.min(paMax, Math.max(0, w.paAttuali));
 save();
}

export function getMinsPerPV() {
 const { guarigione } = getHeroStats();
 const w = store.state.world;
 const boosted = w.regenBoostExpiry && Date.now() < w.regenBoostExpiry;
 return boosted ? Math.max(0.5, guarigione / 2) : guarigione;
}

export function getMinsPerPA() {
 const { pianificazione } = getHeroStats();
 return pianificazione;
}

/* ── Genera equip casuale per nemici umanoidi ── */
function generateEnemyEquip(enemy) {
 if (!enemy.human) return null;
 const lvl = enemy.lvl || 1;
 const prob = Math.min(0.90, 0.25 + (lvl / 150) * 0.65);
 if (Math.random() > prob) return null;

 const maxPieces = Math.min(4, 1 + Math.floor(lvl / 40));
 const numPieces = rnd(1, maxPieces);
 const slots = ["arma","elmo","scudo","corazza","gambali","bracciali"]
 .sort(() => Math.random() - 0.5)
 .slice(0, numPieces);

 const eqTier = Math.max(1, Math.min(10, Math.ceil(lvl / 15)));
 const equip = {};
 for (const slot of slots) {
 const pool = EQUIPMENT_POOL.filter(e =>
 e.slot === slot &&
 (e.tier === eqTier || e.tier === Math.max(1, eqTier - 1))
 );
 if (pool.length) equip[slot] = pool[rnd(0, pool.length - 1)];
 }
 return Object.keys(equip).length ? equip : null;
}

/* ── Statistiche nemico con equip ── */
function getEnemyStats(enemy, equip) {
 let bonusAtk = 0, bonusDef = 0, bonusVel = 0, bonusCrit = 0;
 if (equip) {
 for (const piece of Object.values(equip)) {
 if (piece.bonus.attacco) bonusAtk += piece.bonus.attacco;
 if (piece.bonus.difesa) bonusDef += piece.bonus.difesa;
 if (piece.bonus.velocita) bonusVel += piece.bonus.velocita;
 if (piece.bonus.critico) bonusCrit += piece.bonus.critico;
 }
 }
 return {
 forza: enemy.forza + bonusAtk,
 velocita: enemy.velocita + bonusVel,
 destrezza: enemy.destrezza,
 critico: Math.min(80, enemy.critico + bonusCrit),
 costituzione: enemy.costituzione,
 bonusDef,
 bonusAtk,
 };
}

/* ══════════════════════════════════════════════════════════
 SIMULAZIONE COMBATTIMENTO v6.0
 - Iniziativa probabilistica per turno
 - Schivate basate su destrezza
 - Colpi critici basati su critico
 - Turno doppio per il più veloce
══════════════════════════════════════════════════════════ */
function simulateCombat(enemy, enemyEquip) {
 const heroS = getHeroStats();
 const eneS = getEnemyStats(enemy, enemyEquip);
 const w = store.state.world;

 let heroHP = Math.min(w.pvAttuali, heroS.pvMax);
 let enemyHP = eneS.costituzione;
 const turns = [];
 const heroHPMax = heroS.pvMax;
 const enemyHPMax = eneS.costituzione;

 // Probabilità turno hero
 const totalI = heroS.velocita + eneS.velocita;
 const pHero = heroS.velocita / totalI;

 // Turno doppio
 const iniGap = Math.abs(heroS.velocita - eneS.velocita) /
 Math.max(heroS.velocita, eneS.velocita);
 const pDouble = iniGap > 0.25 ? Math.min(0.45, iniGap * 0.6) : 0;
 const fasterIs = heroS.velocita >= eneS.velocita ? "hero" : "enemy";
 const MAX_TURNS = 80;

 while (heroHP > 0 && enemyHP > 0 && turns.length < MAX_TURNS) {
 const attacker = Math.random() < pHero ? "hero" : "enemy";

 if (attacker === "hero") {
 // Nemico schiva?
 const dodged = Math.random() * 100 < eneS.destrezza;
 if (dodged) {
 turns.push({ who:"hero", dodged:true, heroHP, enemyHP, heroHPMax, enemyHPMax });
 } else {
 const isCrit = Math.random() * 100 < heroS.critico;
 const rawDmg = rnd(Math.max(1, Math.floor(heroS.forza * 0.6)), heroS.forza);
 const dmg = Math.max(1, isCrit ? rawDmg * 2 : rawDmg - eneS.bonusDef);
 enemyHP = Math.max(0, enemyHP - dmg);
 turns.push({ who:"hero", dmg, isCrit, deflected: isCrit ? 0 : Math.max(0, rawDmg - dmg),
 heroHP, enemyHP, heroHPMax, enemyHPMax });
 }
 } else {
 // Hero schiva?
 const dodged = Math.random() * 100 < heroS.destrezza;
 if (dodged) {
 turns.push({ who:"enemy", dodged:true, heroHP, enemyHP, heroHPMax, enemyHPMax });
 } else {
 const isCrit = Math.random() * 100 < eneS.critico;
 const rawDmg = rnd(Math.max(1, Math.floor(eneS.forza * 0.6)), eneS.forza);
 const dmg = Math.max(1, isCrit ? rawDmg * 2 : rawDmg - heroS.bonusDifesa);
 heroHP = Math.max(0, heroHP - dmg);
 turns.push({ who:"enemy", dmg, isCrit, deflected: isCrit ? 0 : Math.max(0, rawDmg - dmg),
 heroHP, enemyHP, heroHPMax, enemyHPMax });
 }
 }
 if (heroHP <= 0 || enemyHP <= 0) break;

 // Turno doppio
 if (pDouble > 0 && Math.random() < pDouble) {
 if (fasterIs === "hero") {
 const isCrit = Math.random() * 100 < heroS.critico;
 const rawDmg = rnd(Math.max(1, Math.floor(heroS.forza * 0.6)), heroS.forza);
 const dmg = Math.max(1, isCrit ? rawDmg * 2 : rawDmg - eneS.bonusDef);
 enemyHP = Math.max(0, enemyHP - dmg);
 turns.push({ who:"hero", dmg, isCrit, isDouble:true,
 deflected: isCrit ? 0 : Math.max(0, rawDmg - dmg),
 heroHP, enemyHP, heroHPMax, enemyHPMax });
 } else {
 const isCrit = Math.random() * 100 < eneS.critico;
 const rawDmg = rnd(Math.max(1, Math.floor(eneS.forza * 0.6)), eneS.forza);
 const dmg = Math.max(1, isCrit ? rawDmg * 2 : rawDmg - heroS.bonusDifesa);
 heroHP = Math.max(0, heroHP - dmg);
 turns.push({ who:"enemy", dmg, isCrit, isDouble:true,
 deflected: isCrit ? 0 : Math.max(0, rawDmg - dmg),
 heroHP, enemyHP, heroHPMax, enemyHPMax });
 }
 if (heroHP <= 0 || enemyHP <= 0) break;
 }
 }

 return {
 victory: enemyHP <= 0,
 turns,
 heroHPFinal: Math.max(0, heroHP),
 heroStats: heroS,
 eneStats: eneS,
 pHero: Math.round(pHero * 100),
 };
}

/* ══════════════════════════════════════════════════════════
 MODAL PRE-COMBATTIMENTO (mostra nemico + opzione fuga)
══════════════════════════════════════════════════════════ */
export function showPreCombat(enemy, enemyEquip, onFight, onFlee) {
 const overlay = document.getElementById("combat-overlay");
 const inner = document.getElementById("combat-inner");
 overlay.classList.add("show");
 document.body.style.overflow = "hidden";

 const eneS = getEnemyStats(enemy, enemyEquip);
 const heroS = getHeroStats();
 const heroTitle = getRankTitle(getHeroRank());
 const fleeChance = Math.min(85, heroS.furtivita);

 let equipStr = "";
 if (enemyEquip) {
 const pcs = Object.values(enemyEquip).map(p => p.name).join(", ");
 equipStr = `<div class="combat-enemy-equip">Equipaggiamento: ${pcs}</div>`;
 }

 inner.innerHTML = `
 <div class="combat-header">${enemy.name}</div>
 <div class="combat-sub">LVL ${enemy.lvl} · ${enemy.trait || ""}</div>
 ${equipStr}

 <!-- Ritratti affiancati: eroe a sinistra, nemico a destra -->
 <div style="display:flex;justify-content:center;align-items:center;
 gap:20px;padding:14px 0 10px">
 <div style="text-align:center">
 ${heroAvatarSmall(heroTitle, 80)}
 <div style="font-family:'JetBrains Mono',monospace;font-size:8px;
 color:var(--primary);letter-spacing:1px;margin-top:4px">EROE</div>
 </div>
 <div style="font-family:'Cinzel',serif;font-size:18px;color:#374151">VS</div>
 <div style="text-align:center">
 ${enemyImgHTML(enemy, 80)}
 <div style="font-family:'JetBrains Mono',monospace;font-size:8px;
 color:var(--danger);letter-spacing:1px;margin-top:4px">NEMICO</div>
 </div>
 </div>

 <!-- Statistiche nemico -->
 <div class="detail-stat-grid" style="margin-bottom:14px">
 <div class="detail-stat-box">
 <div class="detail-stat-val" style="color:#dc2626">${eneS.forza}</div>
 <div class="detail-stat-lbl">FORZA</div>
 </div>
 <div class="detail-stat-box">
 <div class="detail-stat-val" style="color:#0ea5e9">${eneS.velocita}</div>
 <div class="detail-stat-lbl">VELOCITÀ</div>
 </div>
 <div class="detail-stat-box">
 <div class="detail-stat-val" style="color:#10b981">${eneS.destrezza}%</div>
 <div class="detail-stat-lbl">DESTREZZA</div>
 </div>
 <div class="detail-stat-box">
 <div class="detail-stat-val" style="color:#f97316">${eneS.critico}%</div>
 <div class="detail-stat-lbl">CRITICO</div>
 </div>
 <div class="detail-stat-box" style="grid-column:1/-1">
 <div class="detail-stat-val" style="color:#dc2626">${eneS.costituzione}</div>
 <div class="detail-stat-lbl">PUNTI VITA</div>
 </div>
 </div>

 <div class="flee-panel">
 <div class="flee-title">[!] Nemico in vista!</div>
 <div class="flee-text">
 Furtività: <strong style="color:var(--primary)">${heroS.furtivita}%</strong> probabilità di fuga riuscita.<br>
 Se combatti e vinci, ottieni bottino e denari.
 </div>
 <div class="flee-btns">
 <button class="flee-btn fight" id="btn-fight">COMBATTI</button>
 <button class="flee-btn flee" id="btn-flee">FUGGI (${fleeChance}%)</button>
 </div>
 </div>
 `;
 resolveImgs(inner);

 inner.querySelector("#btn-fight").onclick = () => { inner.innerHTML = ""; onFight(); };
 inner.querySelector("#btn-flee").onclick = () => { inner.innerHTML = ""; onFlee(fleeChance); };
}

/* ══════════════════════════════════════════════════════════
 MODAL COMBATTIMENTO ANIMATO
══════════════════════════════════════════════════════════ */
function showCombatModal(enemy, result, reward, loot, enemyEquip) {
 const overlay = document.getElementById("combat-overlay");
 const inner = document.getElementById("combat-inner");

 const hs = result.heroStats;
 const es = result.eneStats;
 const pvMax = hs.pvMax;
 const heroTitle = getRankTitle(getHeroRank());

 let enemyEquipStr = "";
 if (enemyEquip) {
 const pcs = Object.values(enemyEquip).map(p => p.name).join(", ");
 enemyEquipStr = `<div class="combat-enemy-equip">Equip: ${pcs}</div>`;
 }

 inner.innerHTML = `
 <div class="combat-header">${enemy.name}</div>
 <div class="combat-sub">LVL ${enemy.lvl} · ${enemy.trait||""}</div>
 ${enemyEquipStr}

 <!-- Pannello HP con avatar eroe e immagine nemico -->
 <div class="combat-hp-panel">

 <!-- EROE: avatar + barra HP -->
 <div class="combat-hp-block">
 <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px">
 ${heroAvatarSmall(heroTitle, 36)}
 <div style="flex:1;min-width:0">
 <div class="combat-hp-label">
 <span style="color:var(--primary)">EROE</span>
 <span class="combat-hp-nums" id="hero-hp-nums">${store.state.world.pvAttuali}/${pvMax}</span>
 </div>
 </div>
 </div>
 <div class="combat-hp-bar-bg">
 <div class="combat-hp-bar hero-hp-bar" id="hero-hp-bar"
 style="width:${Math.max(0,store.state.world.pvAttuali/pvMax*100)}%"></div>
 </div>
 <div class="combat-hp-stats">ATK:${hs.forza} VEL:${hs.velocita} DES:${hs.destrezza}% CRI:${hs.critico}%</div>
 </div>

 <!-- VS centrale -->
 <div class="combat-hp-vs">
 <span style="font-size:12px">VS</span>
 <span class="combat-ini-odds">${result.pHero}%</span>
 </div>

 <!-- NEMICO: immagine + barra HP -->
 <div class="combat-hp-block">
 <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px;flex-direction:row-reverse">
 ${enemyImgSmall(enemy, 36)}
 <div style="flex:1;min-width:0;text-align:right">
 <div class="combat-hp-label" style="flex-direction:row-reverse">
 <span style="color:var(--danger);font-size:9px">${enemy.name}</span>
 <span class="combat-hp-nums" id="enemy-hp-nums">${es.costituzione}/${es.costituzione}</span>
 </div>
 </div>
 </div>
 <div class="combat-hp-bar-bg">
 <div class="combat-hp-bar enemy-hp-bar" id="enemy-hp-bar" style="width:100%"></div>
 </div>
 <div class="combat-hp-stats">ATK:${es.forza} VEL:${es.velocita} DES:${es.destrezza}% CRI:${es.critico}%</div>
 </div>

 </div>

 <div class="combat-log" id="combat-log-lines"></div>
 `;
 resolveImgs(inner);

 const logEl = inner.querySelector("#combat-log-lines");
 const heroBarEl = inner.querySelector("#hero-hp-bar");
 const enemyBarEl = inner.querySelector("#enemy-hp-bar");
 const heroNumEl = inner.querySelector("#hero-hp-nums");
 const enemyNumEl = inner.querySelector("#enemy-hp-nums");

 function updateBars(turn) {
 const hp = Math.max(0, turn.heroHP / pvMax * 100);
 const ep = Math.max(0, turn.enemyHP / es.costituzione * 100);
 heroBarEl.style.width = hp + "%";
 enemyBarEl.style.width = ep + "%";
 heroNumEl.textContent = `${turn.heroHP}/${pvMax}`;
 enemyNumEl.textContent = `${turn.enemyHP}/${es.costituzione}`;
 heroBarEl.className = "combat-hp-bar hero-hp-bar" +
 (hp > 60 ? "" : hp > 30 ? " mid" : " low");
 }

 let i = 0;
 function showNextTurn() {
 if (i >= result.turns.length) {
 // Risultato finale
 if (result.victory) {
 let lootLine = "";
 if (loot) lootLine += `<br>Loot: <strong>${loot.name}</strong>`;
 if (enemyEquip) {
 const razzia = Object.values(enemyEquip).map(p=>p.name).join(", ");
 lootLine += `<br>Razziato: <strong>${razzia}</strong>`;
 }
 logEl.innerHTML += `<div class="combat-line result-win">
 ✦ VITTORIA — ${enemy.name} abbattuto!<br>+${reward} 🪙${lootLine}
 </div>`;
 } else {
 logEl.innerHTML += `<div class="combat-line result-lose">
 ✦ SCONFITTA — Abbattuto da ${enemy.name}.
 </div>`;
 }
 appendCloseBtn();
 return;
 }

 const turn = result.turns[i];
 updateBars(turn);

 let line = "";
 if (turn.who === "hero") {
 if (turn.dodged) {
 line = `<div class="combat-line dodge">T${i+1} ${enemy.name} schiva il tuo colpo!</div>`;
 } else {
 const critTag = turn.isCrit ? `<span class="combat-crit">CRITICO</span>` : "";
 const dblTag = turn.isDouble ? `<span class="combat-double">DOPPIO</span>` : "";
 const defTag = turn.deflected > 0 ? `<span class="combat-def">-${turn.deflected} DEF</span>` : "";
 const cls = turn.isCrit ? "combat-line critical" : "combat-line hero";
 line = `<div class="${cls}">
 T${i+1} ${dblTag}${critTag} Colpisci: <strong>-${turn.dmg} PV</strong> ${defTag}
 <span class="combat-hp-inline">${turn.enemyHP}/${es.costituzione}</span>
 </div>`;
 }
 } else {
 if (turn.dodged) {
 line = `<div class="combat-line dodge">T${i+1} Schivi l'attacco di ${enemy.name}!</div>`;
 } else {
 const critTag = turn.isCrit ? `<span class="combat-crit">CRITICO</span>` : "";
 const dblTag = turn.isDouble ? `<span class="combat-double">DOPPIO</span>` : "";
 const defTag = turn.deflected > 0 ? `<span class="combat-def">-${turn.deflected} DEF</span>` : "";
 const cls = turn.isCrit ? "combat-line critical" : "combat-line enemy";
 line = `<div class="${cls}">
 T${i+1} ${dblTag}${critTag} ${enemy.name}: <strong>-${turn.dmg} PV</strong> ${defTag}
 <span class="combat-hp-inline">${turn.heroHP}/${pvMax}</span>
 </div>`;
 }
 }
 logEl.innerHTML += line;
 logEl.scrollTop = logEl.scrollHeight;
 i++;

 const delay = result.turns.length > 30 ? 320 : 480;
 setTimeout(showNextTurn, delay);
 }

 setTimeout(showNextTurn, 400);
}

function appendCloseBtn() {
 const inner = document.getElementById("combat-inner");
 const btn = document.createElement("button");
 btn.className = "combat-close-btn";
 btn.textContent = "CHIUDI";
 btn.onclick = closeCombatModal;
 inner.appendChild(btn);
}

function closeCombatModal() {
 document.getElementById("combat-overlay").classList.remove("show");
 document.body.style.overflow = "";
 if (typeof window.__kaizen?.onAfterUpdate === "function") {
 window.__kaizen.onAfterUpdate();
 }
}
window.__closeCombat = closeCombatModal;

/* ── Pick random (area-aware) ── */
function pickEnemyForArea(areaId) {
  const wp = store.state.world.worldProgress;
  let pool = getEnemiesForArea(areaId);
  // Nell'Empireo filtra i dei già sconfitti
  if (areaId === "empireo") {
    pool = pool.filter(g => !wp.deiSconfitti.includes(g.id));
    if (!pool.length) return null; // tutti i dei sono morti
  }
  return pool[rnd(0, pool.length - 1)];
}
/** @deprecated usa pickEnemyForArea */
function pickEnemy() { return BESTIARY[rnd(0, BESTIARY.length - 1)]; }
function pickTreasure() { return TREASURES[rnd(0, TREASURES.length - 1)]; }
function pickRelic() { return RELICS[rnd(0, RELICS.length - 1)]; }

function pickEquipmentLoot(enemyLvl, fortunaStat) {
 const dropChance = Math.min(0.65, 0.04 + (enemyLvl / 150) * 0.55 + fortunaStat * 0.005);
 if (Math.random() > dropChance) return null;
 const slots = ["arma","elmo","scudo","corazza","gambali","bracciali"];
 const slot = slots[rnd(0, slots.length - 1)];
 const eqTier = Math.max(1, Math.min(10, Math.ceil(enemyLvl / 15)));
 const pool = EQUIPMENT_POOL.filter(e =>
 e.slot === slot && e.fonte.includes("loot") &&
 (e.tier === eqTier || e.tier === Math.max(1, eqTier - 1))
 );
 if (!pool.length) return null;
 return pool[rnd(0, pool.length - 1)];
}

/* ══════════════════════════════════════════════════════════
 ESEGUI MISSIONE (entry point)
══════════════════════════════════════════════════════════ */
export function runMission() {
  const state = store.state;
  const w = state.world;
  const wp = w.worldProgress || {};
  const heroS = getHeroStats();

  // Area corrente e config
  // Inizializza worldProgress se mancante
  if (!w.worldProgress) {
    w.worldProgress = {
      areaCorrente: "foresta", areeSbloccate: ["foresta"],
      missioniPerArea: {}, deniariPerArea: {}, spedizioniPerArea: {},
      uccisioniPerAreaEnemyName: {}, lottiPerArea: {},
      deiSconfitti: [], bottiniDivini: [], trofeiEmpirei: [], gameCompleted: false,
    };
  }
  const areaId  = wp.areaCorrente || "foresta";
  const areaCfg = WORLD_AREAS.find(a => a.id === areaId) || WORLD_AREAS[0];
  const costoOro = areaCfg.costoOro;
  const costoPA  = areaCfg.costoPA;

  if (w.denari < costoOro) { showToast(`🪙 Denari insufficienti (${costoOro})!`); return; }
  if (w.pvAttuali < heroS.pvMax * 0.5) { showToast("⚠️ Recupera le forze! (50% HP)"); return; }
  if (w.paAttuali < costoPA) { showToast(`⚡ Punti Azione insufficienti (${costoPA})!`); return; }

  // Empireo: blocca se tutti i dei sono morti
  if (areaId === "empireo") {
    const deiRimasti = EMPIREO_GODS.filter(g => !(wp.deiSconfitti || []).includes(g.id));
    if (!deiRimasti.length) { showToast("✨ Tutti gli dei sono stati sconfitti!"); return; }
  }

  w.denari    -= costoOro;
  w.paAttuali -= costoPA;

  // Missioni area — evento spedizione
  updateAreaQuests([{ type: "spedizione", areaId }]);

  // Tracker quest settimanale
  updateWorldQuests("mission", {});

  const roll = Math.random();
  if (roll < 0.40) {
    // COMBATTIMENTO
    const enemy = pickEnemyForArea(areaId);
    if (!enemy) {
      showToast("Non ci sono più nemici in questa zona!");
      save();
      return;
    }
 const enemyEquip = generateEnemyEquip(enemy);
 w.nemiciIncontrati[enemy.id] = (w.nemiciIncontrati[enemy.id] || 0) + 1;

 // Tracker unique enemies
 if (!state.world.wq.unique_enemies.includes(enemy.id)) {
 state.world.wq.unique_enemies.push(enemy.id);
 updateWorldQuests("unique_enemy", {});
 }
 updateWorldQuests("combat", {});
 save();

 // Mostra pre-combat con opzione fuga
 showPreCombat(
 enemy, enemyEquip,
 /* onFight */ () => executeCombat(enemy, enemyEquip),
 /* onFlee */ (fleeChance) => executeFlee(enemy, fleeChance)
 );

 } else if (roll < 0.80) {
 // SCOPERTA
 executeDiscovery();
 } else {
 // ZONA DESERTA
 w.missioniLog.unshift({ tipo:"empty", nome:"Zona deserta", denari:0, t:Date.now() });
 addHistory(" Zona deserta, risorse sprecate.", "world");
 if (w.missioniLog.length > 5) w.missioniLog = w.missioniLog.slice(0,5);
 save();
 showToast(" Zona deserta...");
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
 }
}

/* ── Fuga ── */
function executeFlee(enemy, fleeChance) {
 const overlay = document.getElementById("combat-overlay");
 const inner = document.getElementById("combat-inner");
 const w = store.state.world;

 const success = Math.random() * 100 < fleeChance;
 updateWorldQuests("fled", {});

 if (success) {
 inner.innerHTML = `
 <div class="combat-header"> FUGA RIUSCITA</div>
 <div style="text-align:center;font-size:48px;padding:20px"></div>
 <div class="combat-line result-fled">✦ Sei riuscito a fuggire da ${enemy.name}!</div>
 `;
 resolveImgs(inner);
 w.missioniLog.unshift({ tipo:"fled", nome:enemy.name, denari:0, t:Date.now() });
 addHistory(` Fuggito da ${enemy.name}`, "combat");
 } else {
 // Fuga fallita → combattimento forzato
 inner.innerHTML = `
 <div class="combat-header"> FUGA FALLITA</div>
 <div class="combat-sub">${enemy.name} ti blocca la via!</div>
 `;
 resolveImgs(inner);
 setTimeout(() => {
 inner.innerHTML = "";
 executeCombat(enemy, generateEnemyEquip(enemy));
 }, 1200);
 return;
 }

 if (w.missioniLog.length > 5) w.missioniLog = w.missioniLog.slice(0,5);
 save();
 appendCloseBtn();
}

/* ── Combattimento ── */
function executeCombat(enemy, enemyEquip) {
 const state = store.state;
 const w = state.world;
 const heroS = getHeroStats();
 const result = simulateCombat(enemy, enemyEquip);

 w.nemiciIncontrati[enemy.id] = (w.nemiciIncontrati[enemy.id] || 0);
 w.pvAttuali = result.heroHPFinal;

 let reward = 0, loot = null;

 if (result.victory) {
 const lvl = enemy.lvl || 1;
 reward = rnd(Math.max(4, Math.round(4 + lvl * 0.55)), Math.max(10, Math.round(8 + lvl * 0.80)));
 w.denari += reward;
 w.deniariTotaliGuadagnati += reward;
 w.nemiciAbbattuti[enemy.id] = (w.nemiciAbbattuti[enemy.id] || 0) + 1;

 // Aggiorna tracker quest
 updateWorldQuests("kill", { tags: enemy.tags||[], lvl: enemy.lvl, human: enemy.human });
 updateWorldQuests("denari", { value: reward });

 // Loot equipaggiamento
 loot = pickEquipmentLoot(enemy.lvl, heroS.fortuna);
 if (loot) {
 state.equipment.zaino.push({ id:loot.id, type:"equip" });
 updateWorldQuests("equip_loot", {});
 if (loot.tier >= 4) updateWorldQuests("rare_find", {});
 addHistory(` Loot: ${loot.icon} ${loot.name} → zaino`, "world");
 }

 // Razzia equip nemico umano
 if (enemyEquip && result.victory) {
 for (const piece of Object.values(enemyEquip)) {
 state.equipment.zaino.push({ id:piece.id, type:"equip" });
 updateWorldQuests("equip_loot", {});
 }
 const names = Object.values(enemyEquip).map(p=>p.name).join(", ");
 addHistory(` Razziato: ${names}`, "world");
 }

 // Tracker streak vittorie
 w.wq.current_streak = (w.wq.current_streak || 0) + 1;
 if (w.wq.current_streak >= 5) {
 updateWorldQuests("win_streak", { count: w.wq.current_streak });
 }

 // Sopravvissuto con HP bassi
 if (result.heroHPFinal / heroS.pvMax < 0.20) {
 updateWorldQuests("survived_low", {});
 }

 // Missioni area — kill
 const _areaKill = store.state.world.worldProgress?.areaCorrente || "foresta";
 const _killEvts = [{ type: "kill", areaId: _areaKill, enemyName: enemy.name }];
 if (enemy.isGod) {
   const _wp = store.state.world.worldProgress;
   if (!(_wp.deiSconfitti || []).includes(enemy.id)) {
     _killEvts.push({ type: "kill_god", areaId: "empireo", godId: enemy.id, enemyName: enemy.name });
     const _dl = EMPIREO_LOOT.find(l => l.godId === enemy.id);
     if (_dl && !(_wp.bottiniDivini || []).includes(_dl.id)) {
       _killEvts.push({ type: "loot_god", areaId: "empireo", lootId: _dl.id });
       addHistory(`✨ Bottino divino: ${_dl.name}`, "world");
       showToast(`✨ ${_dl.name}!`);
     }
   }
 }
 updateAreaQuests(_killEvts);

 w.missioniLog.unshift({ tipo:"win", nome:enemy.name, denari:reward, t:Date.now() });
 addHistory(` Sconfitto ${enemy.name} +${reward} denari`, "combat");
 } else {
 w.wq.current_streak = 0;
 w.missioniLog.unshift({ tipo:"lose", nome:enemy.name, denari:0, t:Date.now() });
 addHistory(` Sconfitto da ${enemy.name}`, "combat");
 }

 if (state.history.length > 200) state.history = state.history.slice(0,200);
 if (w.missioniLog.length > 5) w.missioniLog = w.missioniLog.slice(0,5);
 save();

 showCombatModal(enemy, result, reward, loot, result.victory ? enemyEquip : null);
}

/* ── Scoperta ── */
function executeDiscovery() {
 const state = store.state;
 const w = state.world;
 const heroS = getHeroStats();
 const tr = Math.random();

 updateWorldQuests("discovery", {});

 if (tr < 0.18) {
 // Reliquia
 const rel = pickRelic();
 const expiry = Date.now() + 24 * 3600 * 1000;
 // Rimuovi reliquie scadute e quelle dello stesso tipo
 w.reliquieAttive = (w.reliquieAttive||[]).filter(ra => Date.now() < ra.expiry && ra.id !== rel.id);
 w.reliquieAttive.push({ id: rel.id, expiry });
 // Aggiungi allo zaino
 state.equipment.zaino.push({ id:rel.id, type:"relic" });
 updateWorldQuests("relic", {});
 w.missioniLog.unshift({ tipo:"relic", nome:rel.name, denari:0, t:Date.now() });
 addHistory(` Reliquia: ${rel.name} — ${rel.desc}`, "world");
 showToast(`${rel.icon} Reliquia: ${rel.name}!`);
 } else if (tr < 0.35) {
 // Equipaggiamento da esplorazione
 const pool = EQUIPMENT_POOL.filter(e => e.fonte.includes("esplorazione"));
 if (pool.length) {
 const piece = pool[rnd(0, pool.length - 1)];
 state.equipment.zaino.push({ id:piece.id, type:"equip" });
 updateWorldQuests("equip_loot", {});
 if (piece.tier >= 4) updateWorldQuests("rare_find", {});
 w.missioniLog.unshift({ tipo:"equip", nome:piece.name, denari:0, t:Date.now() });
 addHistory(` Trovato: ${piece.icon} ${piece.name} → zaino`, "world");
 showToast(`${piece.icon} ${piece.name} trovato!`);
 } else {
 pickTreasureReward();
 }
 } else {
 pickTreasureReward();
 }

 if (state.history.length > 200) state.history = state.history.slice(0,200);
 if (w.missioniLog.length > 5) w.missioniLog = w.missioniLog.slice(0,5);
 save();
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

function pickTreasureReward() {
 const state = store.state;
 const w = state.world;
 const heroS = getHeroStats();
 const t = pickTreasure();
 // Fortuna aumenta il valore del bottino fino al +80%
 const fortunaBonus = 1 + (heroS.fortuna * 0.008);
 const v = Math.round(rnd(t.minV, t.maxV) * fortunaBonus);
 w.denari += v;
 w.deniariTotaliGuadagnati += v;
 w.tesoriScoperti[t.id] = (w.tesoriScoperti[t.id] || 0) + 1;

 updateWorldQuests("loot", { value: v });
 updateWorldQuests("denari",{ value: v });
 // Missioni area — loot
 const _areaLoot = store.state.world.worldProgress?.areaCorrente || "foresta";
 updateAreaQuests([{ type: "loot", areaId: _areaLoot, lootCount: 1, denari: v }]);

 // Oggetto unico per unique_finds
 if (!state.world.wq.unique_finds.includes(t.id)) {
 state.world.wq.unique_finds.push(t.id);
 updateWorldQuests("unique_find", {});
 }

 w.missioniLog.unshift({ tipo:"treasure", nome:t.name, denari:v, t:Date.now() });
 addHistory(` ${t.name} +${v} denari`, "world");
 showToast(`${t.icon} ${t.name} +${v} denari!`);
}
