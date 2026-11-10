/* ============================================================
 world.js — Mondo Esterno v6.71
 PV/PA, regen, combattimento con schivate e critici,
 fuga basata su furtività, bottini, nemici umanoidi con equip a 6 slot
 ============================================================ */

import { store, save, saveLocalOnly, unlockDiscoveredEquipment } from "./state.js";
import { HABITS, BESTIARY, TREASURES, RELICS,
         EQUIPMENT_POOL, AREA_LOOT_POOL, MATERIALS, getCoatingWearReduction,
         WORLD_AREAS, EMPIREO_GODS, EMPIREO_LOOT,
         getEnemiesForArea } from "./data.js";
import { showToast, formatDate } from "./ui.js";
import { getHeroStats, addHistory,
         updateWorldQuests,
         checkAllWorldComplete,
         updateAreaQuests,
         getHeroRank, getRankTitle } from "./engine.js";
import { enemyImgHTML, enemyImgSmall,
 heroAvatarSmall, heroAvatarHTML, resolveImgs } from "./img.js";
import { createCombatNarrator } from "./combatText.js";

/* ── Utility ── */
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const COIN = '<span class="mk-coin"></span>';

/* ── Regen PV ── */
export function regenPV() {
  const w = store.state.world;
  const { pvMax } = getHeroStats();
  const now = Date.now();
  if (w.pvAttuali >= pvMax) {
    const shouldSave = w.pvAttuali !== pvMax || !w.ultimaSessionePV || (now - w.ultimaSessionePV > 30000);
    w.pvAttuali = pvMax;
    w.ultimaSessionePV = now;
    if (shouldSave) saveLocalOnly();
    return;
  }
  let changed = false;
  if (w.ultimaSessionePV) {
    const { guarigione } = getHeroStats();
    const boosted = w.regenBoostExpiry && now < w.regenBoostExpiry;
    const minsPerPV = boosted ? Math.max(0.5, guarigione / 2) : guarigione;
    const mins = (now - w.ultimaSessionePV) / 60000;
    const gained = Math.floor(mins / minsPerPV);
    if (gained > 0) {
      w.pvAttuali = Math.min(pvMax, w.pvAttuali + gained);
      w.ultimaSessionePV = w.pvAttuali >= pvMax ? now : (w.ultimaSessionePV + gained * minsPerPV * 60000);
      changed = true;
    }
  } else {
    w.ultimaSessionePV = now;
    changed = true;
  }
  w.pvAttuali = Math.min(pvMax, Math.max(0, w.pvAttuali));
  if (changed) save();
  else saveLocalOnly();
}

/* ── Regen PA ── */
export function regenPA() {
  const w = store.state.world;
  const { paMax, pianificazione } = getHeroStats();
  const now = Date.now();
  if (w.paAttuali >= paMax) {
    const shouldSave = w.paAttuali !== paMax || !w.ultimaSessionePA || (now - w.ultimaSessionePA > 30000);
    w.paAttuali = paMax;
    w.ultimaSessionePA = now;
    if (shouldSave) saveLocalOnly();
    return;
  }
  let changed = false;
  if (w.ultimaSessionePA) {
    const minsPerPA = pianificazione;
    const mins = (now - w.ultimaSessionePA) / 60000;
    const gained = Math.floor(mins / minsPerPA);
    if (gained > 0) {
      w.paAttuali = Math.min(paMax, w.paAttuali + gained);
      w.ultimaSessionePA = w.paAttuali >= paMax ? now : (w.ultimaSessionePA + gained * minsPerPA * 60000);
      changed = true;
    }
  } else {
    w.ultimaSessionePA = now;
    changed = true;
  }
  w.paAttuali = Math.min(paMax, Math.max(0, w.paAttuali));
  if (changed) save();
  else saveLocalOnly();
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

/* ── Genera equip casuale per nemici umanoidi (6 slot + regole 1H/2H) ── */
function generateEnemyEquip(enemy) {
  if (!enemy.human) return null;
  const lvl = enemy.lvl || 1;

  // Tutte le probabilità aumentate del 10%
  // Probabilità base di equipaggiare: aumento di +10% flat (+0.10, da 0.45-0.92 a 0.55-1.0)
  const prob = Math.min(1.0, 0.55 + (lvl / 150) * 0.45);
  if (Math.random() > prob) return null;

  // Numero di pezzi equipaggiati: probabilità di pezzi multipli aumentata del 10%
  let maxPieces = 1;
  let multiPieceChance = 0.10; // +10% anche a livelli bassi (1-34) dove prima era 0%
  if (lvl >= 105) {
    maxPieces = 4;
    multiPieceChance = 0.85; // prima ~75% -> ora 85% (+10%)
  } else if (lvl >= 70) {
    maxPieces = 3;
    multiPieceChance = 0.77; // prima ~67% -> ora 77% (+10%)
  } else if (lvl >= 35) {
    maxPieces = 2;
    multiPieceChance = 0.60; // prima 50% -> ora 60% (+10%)
  } else {
    maxPieces = 2;
    multiPieceChance = 0.10; // prima 0% -> ora 10% (+10%)
  }

  let numPieces = 1;
  if (maxPieces > 1 && Math.random() < multiPieceChance) {
    numPieces = rnd(2, maxPieces);
  }

  const slots = ["testa", "torace", "braccia", "mano_dx", "mano_sx", "gambe"]
    .sort(() => Math.random() - 0.5)
    .slice(0, numPieces);

  // Livello dell'equipaggiamento proporzionale al livello del nemico (Tier 1 a 10)
  const eqTier = Math.max(1, Math.min(10, Math.ceil(lvl / 15)));

  // Rarità proporzionale al livello del nemico:
  // Nemici deboli hanno quasi solo comune, salendo di livello crescono magico e leggendario
  const pLeg = Math.min(0.55, Math.max(0.01, 0.01 + ((lvl - 1) / 150) * 0.54));
  const pMag = Math.min(0.45, Math.max(0.05, 0.05 + ((lvl - 1) / 150) * 0.40));

  const equip = {};
  for (const slot of slots) {
    // Sceglie il tier proporzionato al livello (prevalentemente tier esatto, 20% tier precedente se > 1)
    const selectedTier = (eqTier > 1 && Math.random() < 0.20) ? eqTier - 1 : eqTier;

    let basePool = EQUIPMENT_POOL.filter(e => {
      if (e.tier !== selectedTier) return false;
      if (slot === "mano_sx") {
        return e.slot === "mano_sx" || (e.slot === "mano_dx" && e.handType === "1h");
      }
      return e.slot === slot;
    });

    if (!basePool.length) {
      basePool = EQUIPMENT_POOL.filter(e => {
        if (e.tier !== eqTier) return false;
        if (slot === "mano_sx") {
          return e.slot === "mano_sx" || (e.slot === "mano_dx" && e.handType === "1h");
        }
        return e.slot === slot;
      });
    }
    if (!basePool.length) continue;

    // Estrazione rarità proporzionale al livello del nemico
    const rRoll = Math.random();
    let targetRarity = "comune";
    if (rRoll < pLeg) {
      targetRarity = "leggendario";
    } else if (rRoll < pLeg + pMag) {
      targetRarity = "magico";
    } else {
      targetRarity = "comune";
    }

    const rarityPool = basePool.filter(e => e.rarita === targetRarity);
    const chosenPool = rarityPool.length > 0 ? rarityPool : basePool;
    equip[slot] = chosenPool[rnd(0, chosenPool.length - 1)];
  }

  // Se il nemico impugna un'arma a 2 mani in mano_dx, non può usare mano_sx
  if (equip.mano_dx && equip.mano_dx.handType === "2h") {
    delete equip.mano_sx;
  }

  return Object.keys(equip).length ? equip : null;
}

/* ── Statistiche nemico con equip (inclusi bonus e malus) ── */
function getEnemyStats(enemy, equip) {
  let bonusAtk = 0, bonusDef = 0, bonusVel = 0, bonusDes = 0, bonusCrit = 0;
  if (equip) {
    for (const piece of Object.values(equip)) {
      if (piece.bonus.attacco)   bonusAtk  += piece.bonus.attacco;
      if (piece.bonus.difesa)    bonusDef  += piece.bonus.difesa;
      if (piece.bonus.velocita)  bonusVel  += piece.bonus.velocita;
      if (piece.bonus.destrezza) bonusDes  += piece.bonus.destrezza;
      if (piece.bonus.critico)   bonusCrit += piece.bonus.critico;
    }
  }
  return {
    forza: Math.max(1, enemy.forza + bonusAtk),
    velocita: Math.max(1, enemy.velocita + bonusVel),
    destrezza: Math.max(0, Math.min(75, enemy.destrezza + bonusDes)),
    critico: Math.max(0, Math.min(80, enemy.critico + bonusCrit)),
    costituzione: enemy.costituzione,
    bonusDef: Math.max(0, bonusDef),
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

 // Turno doppio (solo se chi ha appena attaccato è il più veloce)
 if (pDouble > 0 && attacker === fasterIs && Math.random() < pDouble) {
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
 <div class="combat-sub" style="margin-bottom:6px">LVL ${enemy.lvl} · ${enemy.trait || ""}</div>
 ${equipStr}

 <!-- Immagine nemico -->
 <div style="display:flex;justify-content:center;padding:4px 0 6px;width:100%;max-width:270px;margin:0 auto;">
 ${enemyImgHTML(enemy, '100%', 'auto')}
 </div>

 <!-- Statistiche nemico -->
 <div class="detail-stat-grid" style="margin:6px 0 8px">
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

 <div class="flee-panel" style="padding:11px 12px;margin-bottom:0">
 <div class="flee-title" style="margin-bottom:4px">[!] Nemico in vista!</div>
 <div class="flee-text" style="margin-bottom:10px;font-size:13px;line-height:1.3">
 Furtività: <strong style="color:var(--primary)">${heroS.furtivita}%</strong> probabilità di fuga riuscita.<br>
 Se combatti e vinci, ottieni bottino e denari.
 </div>
 <div class="flee-btns">
 <button class="flee-btn fight" id="btn-fight" style="padding:9px;min-height:38px">COMBATTI</button>
 <button class="flee-btn flee" id="btn-flee" style="padding:9px;min-height:38px">FUGGI (${fleeChance}%)</button>
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
function showCombatModal(enemy, result, reward, loot, enemyEquip, areaLootObj, hpBefore) {
 const overlay = document.getElementById("combat-overlay");
 const inner = document.getElementById("combat-inner");

 const hs = result.heroStats;
 const es = result.eneStats;
 const pvMax = hs.pvMax;
 const initialHeroHP = hpBefore !== undefined ? hpBefore : store.state.world.pvAttuali;
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

 <!-- Miniature dei combattenti affiancate con VS -->
  <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin:15px 0; width:100%;">
    <div style="flex:1;">
      ${heroAvatarHTML(heroTitle, "100%", "auto")}
    </div>
    <div style="flex-shrink:0; text-align:center; width:40px;">
      <span style="font-size:24px; font-weight:bold; color:var(--text-dim); font-family:'Cinzel', serif;">VS</span>
    </div>
    <div style="flex:1;">
      ${enemyImgHTML(enemy, "100%", "auto")}
    </div>
  </div>

  <!-- Pannello HP con avatar eroe e immagine nemico -->
  <div class="combat-hp-panel">

 <!-- EROE: avatar + barra HP -->
 <div class="combat-hp-block">
 <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px">
 <div style="flex:1;min-width:0">
 <div class="combat-hp-label">
 <span style="color:var(--primary)">EROE</span>
 <span class="combat-hp-nums" id="hero-hp-nums">${initialHeroHP}/${pvMax}</span>
 </div>
 </div>
 </div>
 <div class="combat-hp-bar-bg">
 <div class="combat-hp-bar hero-hp-bar" id="hero-hp-bar"
 style="width:${Math.max(0,initialHeroHP/pvMax*100)}%"></div>
 </div>
 <div class="combat-hp-stats">ATK:${hs.forza} VEL:${hs.velocita} DES:${hs.destrezza}% CRI:${hs.critico}%</div>
 </div>

 <!-- VS centrale -->
 <div class="combat-hp-vs">
 <span class="combat-ini-odds" style="font-size:10px; margin-top:14px">${result.pHero}% INI</span>
 </div>

 <!-- NEMICO: immagine + barra HP -->
 <div class="combat-hp-block">
 <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px;flex-direction:row-reverse">
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

 const eqOf = slot => {
   const o = store.state.equipment?.equipped?.[slot];
   const id = typeof o === "string" ? o : o?.id;
   return id ? EQUIPMENT_POOL.find(e => e.id === id) || null : null;
 };
 // Dotazione completa dell'eroe (per narrare due armi / scudo / due mani / mani nude)
 const heroEquip = {};
 for (const s of ["testa", "torace", "braccia", "mano_dx", "mano_sx", "gambe"]) {
   const p = eqOf(s);
   if (p) heroEquip[s] = p;
 }
 const narrator = createCombatNarrator({ enemy, enemyEquip, heroEquip });

 // Riga introduttiva sugli stili di combattimento
 const introTxt = narrator.intro();
 if (introTxt) {
   logEl.innerHTML += `<div class="combat-line" style="font-style:italic;opacity:.85;">${introTxt}</div>`;
 }

 let i = 0;
 function showNextTurn() {
 if (i >= result.turns.length) {
 // Risultato finale
 if (result.victory) {
 let lootLine = "";
 if (loot) lootLine += `<br>Loot: <strong>${loot.name}</strong>`;
 if (areaLootObj) lootLine += `<br>Scoperto: <strong>${areaLootObj.icon || "📦"} ${areaLootObj.name} (+${areaLootObj.value} ${COIN})</strong>`;
 if (enemyEquip) {
 const razzia = Object.values(enemyEquip).map(p=>p.name).join(", ");
 lootLine += `<br>Razziato: <strong>${razzia}</strong>`;
 }
 logEl.innerHTML += `<div class="combat-line result-win">
 ✦ VITTORIA<br><span class="combat-result-text">${narrator.victory()}</span><br>+${reward} ${COIN}${lootLine}
 </div>`;
 } else {
 logEl.innerHTML += `<div class="combat-line result-lose">
 ✦ SCONFITTA<br><span class="combat-result-text">${narrator.defeat()}</span>
 </div>`;
 }
 appendCloseBtn();
 return;
 }

 const turn = result.turns[i];
 updateBars(turn);

 const tBadge = `<span class="combat-turn-num">T${i+1}</span>`;
 let line = "";
 if (turn.who === "hero") {
 if (turn.dodged) {
 const dodgeTxt = narrator.enemyDodge();
 line = `<div class="combat-line dodge">${tBadge} ${dodgeTxt}</div>`;
 } else {
 const critTag = turn.isCrit ? `<span class="combat-crit">CRITICO</span>` : "";
 const dblTag = turn.isDouble ? `<span class="combat-double">ATTACCO RAPIDO</span>` : "";
 const defTag = turn.deflected > 0 ? `<span class="combat-def">${narrator.enemyDeflect(turn)}</span>` : "";
 const cls = turn.isCrit ? "combat-line hero critical" : "combat-line hero";
 line = `<div class="${cls}">
 <div class="combat-line-main">${tBadge} ${dblTag}${critTag}${narrator.heroHit(turn)}</div>
 <div class="combat-line-meta">${defTag}<span class="combat-hp-inline">PV ${enemy.name}: ${turn.enemyHP}/${es.costituzione}</span></div>
 </div>`;
 }
 } else {
 if (turn.dodged) {
 const dodgeTxt = narrator.heroDodge();
 line = `<div class="combat-line dodge">${tBadge} ${dodgeTxt}</div>`;
 } else {
 const critTag = turn.isCrit ? `<span class="combat-crit">CRITICO NEMICO</span>` : "";
 const dblTag = turn.isDouble ? `<span class="combat-double">ATTACCO RAPIDO</span>` : "";
 const defTag = turn.deflected > 0 ? `<span class="combat-def">${narrator.heroDeflect(turn)}</span>` : "";
 const cls = turn.isCrit ? "combat-line enemy critical" : "combat-line enemy";
 line = `<div class="${cls}">
 <div class="combat-line-main">${tBadge} ${dblTag}${critTag}${narrator.enemyHit(turn)}</div>
 <div class="combat-line-meta">${defTag}<span class="combat-hp-inline">Tuoi PV: ${turn.heroHP}/${pvMax}</span></div>
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
  if (areaId === "empireo") {
    pool = pool.filter(g => !wp.deiSconfitti.includes(g.id));
    if (!pool.length) return null;
  }
  return pool[rnd(0, pool.length - 1)];
}
/** @deprecated usa pickEnemyForArea */
function pickEnemy() { return BESTIARY[rnd(0, BESTIARY.length - 1)]; }
function pickTreasure() { return TREASURES[rnd(0, TREASURES.length - 1)]; }
function pickRelic() { return RELICS[rnd(0, RELICS.length - 1)]; }

function consumeRelicMissionCharge() {
  const w = store.state.world;
  const now = Date.now();
  const active = (w.reliquieAttive || []).filter(ra =>
    ra && (typeof ra.remaining === "number" ? ra.remaining > 0 : (ra.expiry && now < ra.expiry))
  );
  if (!active.length) {
    w.reliquieAttive = [];
    return;
  }
  const ra = active[0];
  const rem = (typeof ra.remaining === "number" ? ra.remaining : 5) - 1;
  if (rem > 0) {
    w.reliquieAttive = [{ id: ra.id, remaining: rem }];
  } else {
    w.reliquieAttive = [];
    const rel = RELICS.find(r => r.id === ra.id);
    const heroS = getHeroStats();
    if (w.pvAttuali > heroS.pvMax) w.pvAttuali = heroS.pvMax;
    if (rel) {
      addHistory(`🔮 L'effetto di ${rel.name} si è esaurito`, "world");
    }
  }
}

/* ══════════════════════════════════════════════════════════
 ESEGUI MISSIONE (entry point)
══════════════════════════════════════════════════════════ */
export function runMission() {
  regenPV();
  regenPA();
  const state = store.state;
  const w = state.world;
  const wp = w.worldProgress || {};
  const heroS = getHeroStats();

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

  if (areaId === "empireo") {
    const deiRimasti = EMPIREO_GODS.filter(g => !(wp.deiSconfitti || []).includes(g.id));
    if (!deiRimasti.length) { showToast("✨ Tutti gli dei sono stati sconfitti!"); return; }
  }

  const wasFullPA = w.paAttuali >= heroS.paMax;
  w.denari    -= costoOro;
  w.paAttuali -= costoPA;
  if (wasFullPA || !w.ultimaSessionePA) {
    w.ultimaSessionePA = Date.now();
  }

  updateAreaQuests([{ type: "spedizione", areaId }]);
  updateWorldQuests("mission", {});

  const roll = Math.random();
  if (roll < 0.50) {
    // COMBATTIMENTO
    const enemy = pickEnemyForArea(areaId);
    if (!enemy) {
      showToast("Non ci sono più nemici in questa zona!");
      save();
      return;
    }
    const enemyEquip = generateEnemyEquip(enemy);
    w.nemiciIncontrati[enemy.id] = (w.nemiciIncontrati[enemy.id] || 0) + 1;

    if (!state.world.wq) state.world.wq = {};
    if (!Array.isArray(state.world.wq.unique_enemies)) state.world.wq.unique_enemies = [];
    if (!state.world.wq.unique_enemies.includes(enemy.id)) {
      state.world.wq.unique_enemies.push(enemy.id);
    }
    updateWorldQuests("unique_enemy", { id: enemy.id });
    save();

    showPreCombat(
      enemy, enemyEquip,
      /* onFight */ () => executeCombat(enemy, enemyEquip),
      /* onFlee */ (fleeChance) => executeFlee(enemy, fleeChance)
    );

  } else if (roll < 0.90) {
    // SCOPERTA
    executeDiscovery();
  } else {
    // ZONA DESERTA
    updateWorldQuests("no_damage", {});
    w.missioniLog.unshift({ tipo:"empty", nome:"Zona deserta", denari:0, t:Date.now() });
    addHistory(" Zona deserta, risorse sprecate.", "world");
    consumeRelicMissionCharge();
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

  if (success) {
    updateWorldQuests("fled", {});
    updateWorldQuests("no_damage", {});
    w.wq.current_streak = 0;
    updateWorldQuests("win_streak", { count: 0, reset: true });
    inner.innerHTML = `
    <div class="combat-header"> FUGA RIUSCITA</div>
    <div style="text-align:center;font-size:48px;padding:20px"></div>
    <div class="combat-line result-fled">✦ Sei riuscito a fuggire da ${enemy.name}!</div>
    `;
    resolveImgs(inner);
    w.missioniLog.unshift({ tipo:"fled", nome:enemy.name, denari:0, t:Date.now() });
    addHistory(` Fuggito da ${enemy.name}`, "combat");
    consumeRelicMissionCharge();
  } else {
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


/* ── Avanzamento collezione e traguardi XP (5, 10, 15 pezzi) ── */
function onTreasureFound(state, item) {
  const id = item.id;
  const w = state.world;
  if (!w.tesoriScoperti) w.tesoriScoperti = {};
  if (!w.tesoriMilestones) w.tesoriMilestones = {};

  const count = (w.tesoriScoperti[id] || 0) + 1;
  w.tesoriScoperti[id] = count;

  let lastM = w.tesoriMilestones[id] || 0;
  const rarity = item.rarity || item.tier || 1;
  const name = item.name || "Tesoro";

  for (const m of [5, 10, 15]) {
    if (count >= m && lastM < m) {
      for (const hd of HABITS) {
        if (state.habits[hd.id]) {
          state.habits[hd.id].xp += rarity;
        }
      }
      lastM = m;
      w.tesoriMilestones[id] = m;
      const tierName = m === 5 ? "Bronzo" : m === 10 ? "Argento" : "Oro";
      addHistory(`🏆 Collezione ${tierName} (${m}× ${name}): +${rarity} XP a tutte le abitudini`, "world");
      showToast(`🏆 Traguardo ${tierName} (${m}× ${name})! +${rarity} XP`);
    }
  }
  return count;
}

/* ── Pick area-specific loot (from AREA_LOOT_POOL) ── */
function pickAreaLoot(areaId, fortunaStat) {
  const pool = AREA_LOOT_POOL[areaId];
  if (!pool || !pool.length) return null;
  const chance = Math.min(0.35, 0.15 + fortunaStat * 0.005);
  if (Math.random() > chance) return null;
  const weights = pool.map(item => 6 - item.rarity);
  const total = weights.reduce((a,b) => a+b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/* ── Combattimento ── */
function executeCombat(enemy, enemyEquip) {
  regenPV();
  const state = store.state;
  const w = state.world;
  const heroS = getHeroStats();
  const hpBefore = w.pvAttuali;
  const result = simulateCombat(enemy, enemyEquip);

  updateWorldQuests("combat", {});
  updateWorldQuests("unique_enemy", { id: enemy.id });

  w.nemiciIncontrati[enemy.id] = (w.nemiciIncontrati[enemy.id] || 0);
  w.pvAttuali = result.heroHPFinal;
  if (result.heroHPFinal < hpBefore) {
    if (hpBefore >= heroS.pvMax || result.heroHPFinal <= 0 || !w.ultimaSessionePV) {
      w.ultimaSessionePV = Date.now();
    }
  }

  // Usura equipaggiamento proporzionale ai colpi:
  // - Armi: in proporzione ai colpi dell'eroe andati a segno (esclusi quelli schivati dal nemico; normali = critici)
  // - Armature/Scudi: in proporzione ai colpi subiti dall'eroe (esclusi quelli schivati dall'eroe)
  const heroHits = result.turns.filter(t => t.who === "hero" && !t.dodged).length;
  const enemyHits = result.turns.filter(t => t.who === "enemy" && !t.dodged).length;
  const wearPerHitByTier = [0, 2.0, 1.8, 1.6, 1.4, 1.2, 1.0, 0.8, 0.8, 0.6, 0.4]; // Indice = Tier (1..10)

  for (const slot of ["testa", "torace", "braccia", "mano_dx", "mano_sx", "gambe"]) {
    let eqObj = state.equipment.equipped[slot];
    if (!eqObj) continue;
    if (typeof eqObj === "string") {
      eqObj = { id: eqObj, dur: 100 };
      state.equipment.equipped[slot] = eqObj;
    }
    const piece = EQUIPMENT_POOL.find(e => e.id === eqObj.id);
    if (!piece) continue;

    const isWeapon = slot === "mano_dx" || piece.handType === "1h" || piece.handType === "2h";
    const hits = isWeapon ? heroHits : enemyHits;
    if (hits <= 0) continue;

    const basePerHit = wearPerHitByTier[piece.tier] || 0.4;
    const res = eqObj.rivestimento ? getCoatingWearReduction(eqObj.rivestimento) : 0;
    const effWear = hits * basePerHit * (1 - res);
    let wearLoss = Math.floor(effWear);
    if (Math.random() < (effWear - wearLoss)) wearLoss++;

    if (wearLoss > 0) {
      eqObj.dur = Math.max(0, (eqObj.dur !== undefined ? eqObj.dur : 100) - wearLoss);
    }
  }

  let reward = 0, loot = null, areaLootObj = null;

  if (result.victory) {
    const lvl = enemy.lvl || 1;
    const _areaId = store.state.world.worldProgress?.areaCorrente || "foresta";
    reward = rnd(Math.max(4, Math.round(4 + lvl * 0.55)), Math.max(10, Math.round(8 + lvl * 0.80)));
    w.denari += reward;
    w.deniariTotaliGuadagnati += reward;
    w.nemiciAbbattuti[enemy.id] = (w.nemiciAbbattuti[enemy.id] || 0) + 1;

    updateWorldQuests("kill", { tags: enemy.tags || [], lvl: enemy.lvl, human: enemy.human });
    updateWorldQuests("denari", { value: reward });

    let _areaLootItemsCount = 0;

    // Razzia equip nemico umanoide sconfitto (unico modo per ottenere armi/armature in missione)
    const enemyEquipPieces = enemyEquip ? Object.values(enemyEquip) : [];
    if (enemyEquipPieces.length > 0 && result.victory) {
      for (const piece of enemyEquipPieces) {
        state.equipment.zaino.push({ id: piece.id, type: "equip", dur: 100 });
        unlockDiscoveredEquipment(piece.id, state);
        _areaLootItemsCount++;
        if (piece.prezzo) updateWorldQuests("loot", { value: piece.prezzo });
        if ((piece.tier || 0) >= 4 || piece.rarita !== "comune") updateWorldQuests("rare_find", {});
        if (!state.world.wq.unique_finds.includes(piece.id)) {
          state.world.wq.unique_finds.push(piece.id);
        }
        updateWorldQuests("unique_find", { id: piece.id });
      }
      const names = enemyEquipPieces.map(p => p.name).join(", ");
      addHistory(` Razziato da ${enemy.name}: ${names}`, "world");
      updateWorldQuests("equip_loot", { count: 1 });
    }

    // Bottino area specifico
    let _areaLootDenari = reward;
    areaLootObj = pickAreaLoot(_areaId, heroS.fortuna);
    if (areaLootObj) {
      const val = areaLootObj.value;
      w.denari += val;
      w.deniariTotaliGuadagnati += val;
      _areaLootDenari += val;
      _areaLootItemsCount++;
      onTreasureFound(store.state, areaLootObj);
      updateWorldQuests("loot", { value: val });
      updateWorldQuests("denari", { value: val });
      if ((areaLootObj.rarity || 1) >= 4) updateWorldQuests("rare_find", {});
      if (!state.world.wq.unique_finds.includes(areaLootObj.id)) {
        state.world.wq.unique_finds.push(areaLootObj.id);
      }
      updateWorldQuests("unique_find", { id: areaLootObj.id });
      addHistory(` Trovato: ${areaLootObj.icon} ${areaLootObj.name} +${val} 🪙`, "world");
    }

    // Tracker streak vittorie
    w.wq.current_streak = (w.wq.current_streak || 0) + 1;
    updateWorldQuests("win_streak", { count: w.wq.current_streak });

    // Spedizione senza perdere PV
    if (result.heroHPFinal >= hpBefore) {
      updateWorldQuests("no_damage", {});
    }

    // Sopravvissuto con HP bassi (< 20% PV max)
    if (result.heroHPFinal > 0 && result.heroHPFinal / heroS.pvMax < 0.20) {
      updateWorldQuests("survived_low", {});
    }

    // Missioni area — kill & loot/denari
    const _killEvts = [
      { type: "kill", areaId: _areaId, enemyName: enemy.name, tags: enemy.tags || [] },
      { type: "loot", areaId: _areaId, lootCount: _areaLootItemsCount, denari: _areaLootDenari }
    ];
    if (enemy.isGod) {
      const _wp = store.state.world.worldProgress;
      if (!(_wp.deiSconfitti || []).includes(enemy.id)) {
        _killEvts.push({ type: "kill_god", areaId: "empireo", godId: enemy.id, enemyName: enemy.name });
        const _dl = EMPIREO_LOOT.find(l => l.godId === enemy.id);
        if (_dl && !(_wp.bottiniDivini || []).includes(_dl.id)) {
          _killEvts.push({ type: "loot_god", areaId: "empireo", lootId: _dl.id });
          if (_dl.value) updateWorldQuests("loot", { value: _dl.value });
          updateWorldQuests("rare_find", {});
          updateWorldQuests("unique_find", { id: _dl.id });
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
    updateWorldQuests("win_streak", { count: 0, reset: true });
    w.missioniLog.unshift({ tipo:"lose", nome:enemy.name, denari:0, t:Date.now() });
    addHistory(` Sconfitto da ${enemy.name}`, "combat");
  }

  consumeRelicMissionCharge();
  if (state.history.length > 200) state.history = state.history.slice(0,200);
  if (w.missioniLog.length > 5) w.missioniLog = w.missioniLog.slice(0,5);
  save();

  showCombatModal(enemy, result, reward, loot, result.victory ? enemyEquip : null, areaLootObj, hpBefore);
}

/* ── Scoperta ── */
function executeDiscovery() {
  const state = store.state;
  const w = state.world;
  const heroS = getHeroStats();
  const tr = Math.random();
  const currentArea = w.worldProgress?.areaCorrente || "foresta";

  updateWorldQuests("discovery", {});
  updateWorldQuests("no_damage", {});

  if (tr < 0.20) {
    // Reliquia (20%)
    const rel = pickRelic();
    state.equipment.zaino.push({ id: rel.id, type: "relic" });
    updateWorldQuests("relic", {});
    if (rel.prezzo) updateWorldQuests("loot", { value: rel.prezzo });
    updateWorldQuests("rare_find", {});
    if (!state.world.wq.unique_finds.includes(rel.id)) {
      state.world.wq.unique_finds.push(rel.id);
    }
    updateWorldQuests("unique_find", { id: rel.id });
    updateAreaQuests([{ type: "loot", areaId: currentArea, lootCount: 1, denari: 0 }]);
    w.missioniLog.unshift({ tipo: "relic", nome: rel.name, denari: 0, t: Date.now() });
    addHistory(` Reliquia: ${rel.icon} ${rel.name} — ${rel.desc}`, "world");
    showToast(`${rel.icon} Reliquia: ${rel.name}!`);
  } else if (tr < 0.65) {
    // Bottino d'area / tesoro (45%)
    const aLoot = pickAreaLoot(currentArea, heroS.fortuna);
    if (aLoot) {
      const val = aLoot.value;
      w.denari += val;
      w.deniariTotaliGuadagnati += val;
      onTreasureFound(state, aLoot);
      updateWorldQuests("loot", { value: val });
      updateWorldQuests("denari", { value: val });
      if ((aLoot.rarity || 1) >= 4) updateWorldQuests("rare_find", {});
      updateAreaQuests([{ type: "loot", areaId: currentArea, lootCount: 1, denari: val }]);
      if (!state.world.wq.unique_finds.includes(aLoot.id)) {
        state.world.wq.unique_finds.push(aLoot.id);
      }
      updateWorldQuests("unique_find", { id: aLoot.id });
      w.missioniLog.unshift({ tipo: "treasure", nome: aLoot.name, denari: val, t: Date.now() });
      addHistory(`Trovato: ${aLoot.name} +${val} denari`, "world");
      showToast(`${aLoot.name} +${val} denari!`);
    } else {
      pickTreasureReward();
    }
  } else {
    // Materiali per il Fabbro e la Forgia (35%)
    const areaMats = MATERIALS.filter(m => m.areaId === currentArea);
    if (areaMats.length > 0) {
      areaMats.sort((a, b) => a.rarity - b.rarity);
      const rareChance = Math.min(0.50, 0.35 + (heroS.fortuna || 0) * 0.003);
      const mat = (Math.random() < rareChance) ? areaMats[1] : areaMats[0];

      state.equipment.zaino.push({ id: mat.id, type: "material" });
      updateWorldQuests("loot", { value: mat.value });
      if ((mat.rarity || 1) >= 4) updateWorldQuests("rare_find", {});
      if (!state.world.wq.unique_finds.includes(mat.id)) {
        state.world.wq.unique_finds.push(mat.id);
      }
      updateWorldQuests("unique_find", { id: mat.id });
      updateAreaQuests([{ type: "loot", areaId: currentArea, lootCount: 1, denari: 0 }]);
      w.missioniLog.unshift({ tipo: "material", nome: mat.name, denari: 0, t: Date.now() });
      addHistory(`Materiale trovato: ${mat.name} (${mat.value} denari) → zaino`, "world");
      showToast(`Materiale trovato: ${mat.name} → zaino!`);
    } else {
      pickTreasureReward();
    }
  }

  consumeRelicMissionCharge();
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
  const fortunaBonus = 1 + (heroS.fortuna * 0.008);
  const v = Math.round(rnd(t.minV, t.maxV) * fortunaBonus);
  w.denari += v;
  w.deniariTotaliGuadagnati += v;
  onTreasureFound(state, t);

  updateWorldQuests("loot", { value: v });
  updateWorldQuests("denari", { value: v });
  if ((t.rarity || 1) >= 4) updateWorldQuests("rare_find", {});
  const _areaLoot = store.state.world.worldProgress?.areaCorrente || "foresta";
  updateAreaQuests([{ type: "loot", areaId: _areaLoot, lootCount: 1, denari: v }]);

  if (!state.world.wq.unique_finds.includes(t.id)) {
    state.world.wq.unique_finds.push(t.id);
  }
  updateWorldQuests("unique_find", { id: t.id });

  w.missioniLog.unshift({ tipo:"treasure", nome:t.name, denari:v, t:Date.now() });
  addHistory(` ${t.name} +${v} denari`, "world");
  showToast(`${t.icon} ${t.name} +${v} denari!`);
}
