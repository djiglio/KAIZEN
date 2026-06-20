/* ============================================================
 render.js — aggiorna tutto il DOM in base allo stato
 KAIZEN v6.1
 ============================================================ */

import { store } from "./state.js";
import { HABITS, STAT_DEFS, rankTitles,
         BESTIARY, TREASURES, RELICS,
         EQUIPMENT_POOL,
         QUEST_POOL_EVO, QUEST_POOL_WORLD,
         titleMetalColors,
         WORLD_AREAS, AREA_QUESTS , EMPIREO_GODS } from './data.js';
import { isDone, getHeroStats, getHeroRank,
         getRankTitle, habitLevel,
         habitXpInLevel } from "./engine.js";
import { formatDate } from "./ui.js";
import { regenPV, regenPA,
         getMinsPerPV, getMinsPerPA } from "./world.js";
import { renderShop, renderEquipment } from "./shop.js";
import { enemyImgCard, enemyImgHTML, enemyImgPath, heroAvatarHTML, resolveImgs } from "./img.js";

/* ══════════════════════════════════════════════════════════
 RENDER PRINCIPALE
══════════════════════════════════════════════════════════ */
export function render() {
 regenPV();
 regenPA();

 const state = store.state;
 const w = state.world;
 const heroS = getHeroStats();
 const rank = getHeroRank();
 const title = getRankTitle(rank);

 renderHabits(state, title);
 renderHero(state, heroS, rank, title);
 renderQuests(state);
 renderWorld(heroS, w);
 renderBacheca(state, w);
 renderShop();
 renderLog(state);
}

/* ── Pagina ABITUDINI ── */
function renderHabits(state) {
 const el = document.getElementById("habit-list");
 if (!el) return;

 el.innerHTML = HABITS.map(hd => {
 const h = state.habits[hd.id] || { xp:0, last:null, result:null };
 const lv = habitLevel(hd.id);
 const xp = habitXpInLevel(hd.id);
 const done = isDone(h.last) && h.result === "done";
 const failed = isDone(h.last) && h.result === "failed";
 const marked = done || failed;

 const borderCol = done ? "#4ecca3" : failed ? "#dc2626" : hd.color;
 const barCol = done ? "#4ecca3" : failed ? "#dc2626" : hd.color;

 const badgeHTML = done
 ? `<span class="habit-result-badge habit-result-done">&#10003;</span>`
 : failed
 ? `<span class="habit-result-badge habit-result-failed">&#10005;</span>`
 : "";

 return `<div class="habit-row ${marked?"done":""}" style="border-left-color:${borderCol}">
 <div class="habit-top">
 <span class="habit-label">
 ${hd.label}${badgeHTML}
 </span>
 <span class="habit-level-badge">LV ${lv}</span>
 </div>
 <div class="habit-xp-text">
 <span>${Math.floor(h.xp)} XP totali</span>
 <span>${xp} / 100</span>
 </div>
 <div class="habit-xp-bar-wrap">
 <div class="habit-xp-bar" style="width:${xp}%;background:${barCol};box-shadow:0 0 8px ${barCol}44"></div>
 </div>
 <div class="btn-row">
 <button class="btn-up"
 onclick="window.__kaizen.updateXP('${hd.id}',true)"
 ${marked?"disabled":""}>&#10003;</button>
 <button class="btn-down"
 onclick="window.__kaizen.updateXP('${hd.id}',false)"
 ${marked?"disabled":""}>&#10005;</button>
 </div>
 </div>`;
 }).join("");
}

/* ── Pagina EROE ── */
function renderHero(state, heroS, rank, title) {
 // Avatar: SVG procedurale + immagine rango sovrapposta
 const avViewport = document.getElementById("avatar-viewport-inner");
 if (avViewport) {
    avViewport.innerHTML = heroAvatarHTML(title);
    resolveImgs(avViewport);
  }

 // Nome titolo
 const nameEl = document.getElementById("char-spec");
 if (nameEl) {
 nameEl.innerText = title;
 nameEl.style.color = titleMetalColors[title] || "#9090a0";
 nameEl.style.textShadow = `0 0 30px ${titleMetalColors[title]||"#9090a0"}55`;
 }
 const rankEl = document.getElementById("char-rank");
 if (rankEl) rankEl.innerText = "RANGO " + rank;

 // Stats — barre orizzontali con nome completo
 const sgEl = document.getElementById("stats-grid");
 if (sgEl) {
   sgEl.innerHTML = STAT_DEFS.map(sd => {
     const val     = heroS[sd.id] ?? 0;
     const lv      = habitLevel(sd.habit);
     const hdef    = HABITS.find(h => h.id === sd.habit);
     const col     = hdef?.color || "var(--primary)";
     const showPct = ["destrezza","critico","furtivita","carisma"].includes(sd.id);
     const displayVal = `${val}${showPct ? "%" : ""}`;
     return `<div style="margin-bottom:12px;border-left:2px solid ${col}44;padding-left:10px">
       <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px">
         <span style="font-family:'Cinzel',serif;font-size:11px;font-weight:700;
                      color:${col};letter-spacing:1.5px;
                      text-shadow:0 0 10px ${col}66">${sd.label}</span>
         <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:800;
                      color:${col}">${displayVal}</span>
       </div>
       <div style="font-family:'JetBrains Mono',monospace;font-size:8px;color:#4b5563;letter-spacing:1px">
         ${hdef?.label||""} · Lv ${lv} — ${sd.desc}
       </div>
     </div>`;
   }).join("");
 }

 renderEquipment();
}

/* ── Pagina QUEST SETTIMANALI ── */
function renderQuests(state) {
 const el = document.getElementById("quest-list");
 if (!el) return;

 const renderQuestSet = (quests, typeLabel, typeCls) =>
 quests.map(q => {
 const perc = Math.min(100, (q.progress / q.target) * 100);
 const bc = q.completed ? "var(--primary)" : (typeCls === "evo" ? "var(--gold)" : "#8b5cf6");
 return `<div class="quest-card ${q.completed?"completed":""} ${typeCls==="world"?"world-quest":""}">
 <span class="quest-type-badge ${typeCls}">${typeLabel}</span>
 <div class="quest-title">${q.text}</div>
 <div class="quest-desc">${q.desc}</div>
 <div class="quest-progress-text">${q.progress} / ${q.target}</div>
 <div class="q-progress-bg">
 <div class="q-progress-bar" style="width:${perc}%;background:${bc};color:${bc}"></div>
 </div>
 </div>`;
 }).join("");

 // Ricompense
 const evoAll = state.activeQuestsEvo.every(q=>q.completed) && state.activeQuestsEvo.length>0;
 const worldAll = state.activeQuestsWorld.every(q=>q.completed) && state.activeQuestsWorld.length>0;

 el.innerHTML = `
 <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--gold);letter-spacing:2px;margin-bottom:12px">
 Evoluzione
 </div>
 ${renderQuestSet(state.activeQuestsEvo, "EVOLUZIONE", "evo")}
 ${evoAll ? `<div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--primary);text-align:center;padding:8px;border:1px solid rgba(78,204,163,0.2);border-radius:8px;margin-bottom:16px">&#10022; BONUS COMPLETAMENTO: +20 XP ottenuti!</div>` : ""}

 <div style="font-family:'Cinzel',serif;font-size:12px;color:#a78bfa;letter-spacing:2px;margin:16px 0 12px">
 Mondo Esterno
 </div>
 ${renderQuestSet(state.activeQuestsWorld, "MONDO", "world")}
 ${worldAll ? `<div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--primary);text-align:center;padding:8px;border:1px solid rgba(78,204,163,0.2);border-radius:8px;margin-bottom:16px">&#10022; BONUS COMPLETAMENTO: +20 XP ottenuti!</div>` : ""}
 `;
}

/* ── Pagina MONDO ESTERNO ── */
export function renderWorld() {
  const state = store.state;
  const w     = state.world;
  const wp    = w.worldProgress || {};
  const heroS = getHeroStats();
  // Il pannello mondo è diviso in tre sezioni nell'HTML
  const elStatus = document.getElementById("world-status-panel");
  const elBtnWrap = document.getElementById("mission-btn-wrap");
  const elLog    = document.getElementById("world-log-section");
  if (!elStatus) return;

  // Inizializza worldProgress se mancante (salvataggi precedenti)
  if (!w.worldProgress) {
    w.worldProgress = {
      areaCorrente: "foresta", areeSbloccate: ["foresta"],
      missioniPerArea: {}, deniariPerArea: {}, spedizioniPerArea: {},
      uccisioniPerAreaEnemyName: {}, lottiPerArea: {},
      deiSconfitti: [], bottiniDivini: [], trofeiEmpirei: [], gameCompleted: false,
    };
  }
  // Riassegna wp dopo eventuale init
  const wpSafe = w.worldProgress;
  const areaId  = wpSafe.areaCorrente || "foresta";
  const areaCfg = WORLD_AREAS.find(a => a.id === areaId) || WORLD_AREAS[0];
  const areaSbloccate = wpSafe.areeSbloccate || ["foresta"];

  /* ── Selettore aree ── */
  const areaTabs = WORLD_AREAS.map(a => {
    const sbloccata = areaSbloccate.includes(a.id);
    const attiva    = a.id === areaId;
    const poolQ     = AREA_QUESTS[a.id] || [];
    const tracker   = wpSafe.missioniPerArea?.[a.id] || {};
    const done      = poolQ.filter(q => tracker[q.id]?.completed).length;
    const total     = poolQ.length;
    if (!sbloccata) {
      return `<div class="area-tab locked" title="Completa le missioni dell'area precedente">
        🔒 <span>${a.name}</span>
      </div>`;
    }
    return `<div class="area-tab${attiva ? " active" : ""}"
              onclick="window.__kaizen.setArea('${a.id}')"
              title="${a.desc}">
      ${a.icon} <span>${a.name}</span>
      <small class="area-tab-prog">${done}/${total}</small>
    </div>`;
  }).join("");

  /* ── Info area corrente ── */
  const poolQ   = AREA_QUESTS[areaId] || [];
  const tracker = wpSafe.missioniPerArea?.[areaId] || {};
  const doneQ   = poolQ.filter(q => tracker[q.id]?.completed).length;

  // Missioni area in corso (prime 5 non completate)
  const questePending = poolQ
    .filter(q => !tracker[q.id]?.completed)
    .slice(0, 5);

  const questsHTML = questePending.map(q => {
    const t = tracker[q.id] || { progress: 0, completed: false };
    const pct = q.target > 0 ? Math.min(100, Math.round(t.progress / q.target * 100)) : 0;
    return `<div class="area-quest-item">
      <div class="area-quest-header">
        <span class="area-quest-title">${q.n}. ${q.title}</span>
        <span class="area-quest-prog">${t.progress}/${q.target}</span>
      </div>
      <div class="area-quest-desc">${q.desc}</div>
      <div class="area-quest-bar-bg">
        <div class="area-quest-bar" style="width:${pct}%"></div>
      </div>
    </div>`;
  }).join("") || `<div class="area-quest-item" style="color:var(--accent)">
    ✅ Tutte le missioni completate!
  </div>`;

  // Empireo: pannello dei (unico)
  let empireoPanel = "";
  if (areaId === "empireo") {
    const dei = [
      {id:"e181",name:"Valeska"}, {id:"e182",name:"Thalmos"},
      {id:"e183",name:"Sylvaris"},{id:"e184",name:"Ignaroth"},
      {id:"e185",name:"Abyssor"}, {id:"e186",name:"Lunarys"},
      {id:"e187",name:"Solarius"},{id:"e188",name:"Varos"},
      {id:"e189",name:"Morvath"}, {id:"e190",name:"Kaelos"},
    ];
    const deiSconfitti = wpSafe.deiSconfitti || [];
    const deiHTML = dei.map(d => {
      const morto = (wpSafe.deiSconfitti || []).includes(d.id);
      return `<div class="empireo-god ${morto ? "dead" : "alive"}">
        ${morto ? "☠️" : "✨"} ${d.name}
      </div>`;
    }).join("");
    empireoPanel = `<div class="empireo-panel">
      <div class="empireo-title">⚜️ Divinità dell'Empireo</div>
      <div class="empireo-gods-grid">${deiHTML}</div>
      <div class="empireo-note">${(wpSafe.deiSconfitti||[]).length}/10 divinità sconfitte. Ogni divinità può essere affrontata una sola volta.</div>
    </div>`;
  }

  /* ── Stato PV / PA / Denari ── */
  const pvPct = Math.round(w.pvAttuali / heroS.pvMax * 100);
  const paPct = Math.round(w.paAttuali / heroS.paMax * 100);

  // Contenuto principale nel pannello status
  elStatus.innerHTML = `
    <!-- Selettore aree -->
    <div class="area-tabs-scroll">
      <div class="area-tabs">${areaTabs}</div>
    </div>

    <!-- Info area corrente -->
    <div class="area-info-bar">
      <span class="area-info-name">${areaCfg.icon} ${areaCfg.name}</span>
      <span class="area-info-range">Lv ${areaCfg.lvlMin}–${areaCfg.lvlMax}</span>
      <span class="area-info-cost">🪙${areaCfg.costoOro} ⚡${areaCfg.costoPA} PA</span>
      <span class="area-info-prog">${doneQ}/${poolQ.length} missioni</span>
    </div>

    ${empireoPanel}

    <!-- Missioni area in corso -->
    <div class="world-section-title" style="display:flex;align-items:center;justify-content:space-between;">
      <span>MISSIONI AREA</span>
      <button class="btn-all-quests" onclick="window.__kaizen.showAllAreaQuests()">VEDI TUTTE</button>
    </div>
    <div class="area-quests-list">${questsHTML}</div>
    ${doneQ < poolQ.length ? "" : `<div class="area-all-done">✅ Area completata!</div>`}

    <!-- PV / PA / Denari -->
    <div class="world-resources">
      <div class="world-res-row">
        <span>❤️ PV</span>
        <div class="world-res-bar-bg">
          <div class="world-res-bar pv" style="width:${pvPct}%"></div>
        </div>
        <span>${w.pvAttuali}/${heroS.pvMax}</span>
      </div>
      <div class="world-res-row">
        <span>⚡ PA</span>
        <div class="world-res-bar-bg">
          <div class="world-res-bar pa" style="width:${paPct}%"></div>
        </div>
        <span>${w.paAttuali}/${heroS.paMax}</span>
      </div>
      <div class="world-res-row denari-row">
        <span>🪙 Denari</span>
        <strong>${w.denari}</strong>
      </div>
    </div>

  `;

  // Pulsante spedizione nel wrapper dedicato
  if (elBtnWrap) {
    elBtnWrap.innerHTML = `
    <button class="btn-expedition" onclick="window.__kaizen.runMission()">
      ${areaCfg.icon} INVIA SPEDIZIONE
      <small>🪙${areaCfg.costoOro} · ⚡${areaCfg.costoPA} PA</small>
    </button>`;
  }

  // Log ultime spedizioni nella sezione log
  if (elLog) {
    elLog.innerHTML = `
    <div class="world-section-title" style="margin-top:14px">ULTIME SPEDIZIONI</div>
    <div class="mission-log">
      ${(w.missioniLog || []).slice(0,5).map(m => {
        const icon = m.tipo==="win"?"⚔️":m.tipo==="lose"?"💀":m.tipo==="treasure"?"💎":
                     m.tipo==="relic"?"🔮":m.tipo==="equip"?"🗡️":m.tipo==="fled"?"🏃":m.tipo==="empty"?"🌫️":"❓";
        return `<div class="mission-log-row ${m.tipo}">
          ${icon} ${m.nome} ${m.denari ? `<span class="log-gold">+${m.denari}🪙</span>` : ""}
        </div>`;
      }).join("") || `<div class="mission-log-row">Nessuna spedizione ancora.</div>`}
    </div>`;
  }
}


function renderBacheca(state, w) {
 // ── Trofei ──
 const trophyEl = document.getElementById("trophy-list");
 if (trophyEl) {
 const allQuests = [...QUEST_POOL_EVO, ...QUEST_POOL_WORLD];
 const entries = Object.entries(state.trophies);
 if (!entries.length) {
 trophyEl.innerHTML = `<div style="color:#374151;font-family:'JetBrains Mono',monospace;font-size:10px;grid-column:1/-1;text-align:center;padding:28px;letter-spacing:1px">Nessun trofeo ancora</div>`;
 } else {
 trophyEl.innerHTML = entries.map(([id, count]) => {
 const q = allQuests.find(x => x.id === id) ||
 (id === "day_perfect" ? { text:"Sole Invincibile", id } : null);
 if (!q) return "";
 const isWorld = QUEST_POOL_WORLD.some(x => x.id === id);
 const icon = id === "day_perfect" ? "" : isWorld ? "" : "";
 return `<div class="trophy-card" onclick="window.__kaizen.showTrophyDetail('${id}')">
 <span class="trophy-icon">${icon}</span>
 <div class="trophy-name">${q.text}</div>
 <div class="trophy-count">×${count}</div>
 </div>`;
 }).join("");
 }
 }

 // ── Bestiario ──
 const nbSeen = Object.keys(w.nemiciIncontrati||{}).length + Object.keys(w.nemiciAbbattuti||{}).length;
 const seenIds = new Set([...Object.keys(w.nemiciIncontrati||{}), ...Object.keys(w.nemiciAbbattuti||{})]);
 const nKills = Object.values(w.nemiciAbbattuti||{}).reduce((a,b)=>a+b,0);

 const bestStatEl = document.getElementById("bestiary-stats");
 if (bestStatEl) {
 bestStatEl.innerHTML = `
 <div class="bacheca-stat"><div class="bacheca-stat-num">${seenIds.size}</div><div class="bacheca-stat-lbl">INCONTRATI</div></div>
 <div class="bacheca-stat"><div class="bacheca-stat-num">${nKills}</div><div class="bacheca-stat-lbl">UCCISI</div></div>
 <div class="bacheca-stat"><div class="bacheca-stat-num">${BESTIARY.length - seenIds.size}</div><div class="bacheca-stat-lbl">NASCOSTI</div></div>
    <div class="bacheca-stat"><div class="bacheca-stat-num">${(w.worldProgress?.deiSconfitti||[]).length}/10</div><div class="bacheca-stat-lbl">DEI</div></div>`;
 }

 const bestListEl = document.getElementById("bestiary-list");
 if (bestListEl) {
 const normalCards = BESTIARY.map(e => {
    const seen = seenIds.has(e.id);
    const kills = w.nemiciAbbattuti?.[e.id] || 0;
    const incontri = Math.max(w.nemiciIncontrati?.[e.id]||0, kills);
    const tier = e.lvl>=121?"tier-5":e.lvl>=81?"tier-4":e.lvl>=41?"tier-3":e.lvl>=11?"tier-2":"tier-1";

  const portrait = seen
  ? enemyImgCard(e, 56)
  : `<div style="width:56px;height:56px;margin:0 auto 4px;display:flex;
      align-items:center;justify-content:center;
      font-size:24px;color:#1e2535">?</div>`;

  return `<div class="discovery-card ${seen?"unlocked":"locked"}"
  onclick="${seen?`window.__kaizen.showBestiaryDetail('${e.id}')`:``}"
  style="display:flex;flex-direction:column;align-items:center;padding:8px 6px 8px">
  <div style="font-family:'Cinzel',serif;font-size:8px;font-weight:700;
              color:${seen?"var(--text)":"#1e2535"};text-align:center;
              width:100%;margin-bottom:5px;line-height:1.3;min-height:22px
              ">${seen?e.name:"???"}</div>
  ${portrait}
  <span class="discovery-tier ${tier}" style="margin-top:5px;margin-bottom:2px">L${e.lvl}</span>
  <div class="discovery-sub" style="text-align:center">${seen?`${incontri} inc · ${kills} ucc`:"—"}</div>
  </div>`;
 }).join("");

  // ── Sezione Dei dell'Empireo ──
  const wpSafe2 = w.worldProgress || {};
  const deiSconfitti = wpSafe2.deiSconfitti || [];
  const empireoUnlocked = (wpSafe2.areeSbloccate||[]).includes("empireo");

  const godDivider = `<div style="grid-column:1/-1;padding:16px 4px 8px;
    display:flex;align-items:center;gap:10px;">
    <div style="height:1px;flex:1;background:linear-gradient(90deg,transparent,rgba(212,160,23,0.25))"></div>
    <div style="font-family:'Cinzel',serif;font-size:9px;font-weight:700;
      color:var(--gold);letter-spacing:3px;white-space:nowrap;text-transform:uppercase;">Dei dell'Empireo</div>
    <div style="height:1px;flex:1;background:linear-gradient(90deg,rgba(212,160,23,0.25),transparent)"></div>
  </div>`;

  const godCards = EMPIREO_GODS.map(g => {
    const sconfitto = deiSconfitti.includes(g.id);
    const portrait2 = empireoUnlocked
      ? enemyImgCard(g, 56)
      : `<div style="width:56px;height:56px;margin:0 auto 4px;display:flex;
          align-items:center;justify-content:center;
          font-size:24px;color:#1e2535">?</div>`;
    const nameStr = empireoUnlocked ? g.name : "???";
    const subStr  = empireoUnlocked ? (sconfitto ? "✦ sconfitto" : "mai affrontato") : "—";
    const borderStyle = sconfitto ? "border-color:rgba(78,204,163,0.2);" : empireoUnlocked ? "border-color:rgba(212,160,23,0.22);" : "";
    const opStyle = sconfitto ? "opacity:.4;filter:grayscale(0.6);" : "";
    return `<div class="discovery-card ${empireoUnlocked?"unlocked":"locked"}"
      onclick="${sconfitto?`window.__kaizen.showBestiaryDetail('${g.id}')`:``}"
      style="display:flex;flex-direction:column;align-items:center;padding:8px 6px 8px;${borderStyle}${opStyle}">
      <div style="font-family:'Cinzel',serif;font-size:8px;font-weight:700;
                  color:${empireoUnlocked?"var(--gold-light)":"#1e2535"};text-align:center;
                  width:100%;margin-bottom:5px;line-height:1.3;min-height:22px">${nameStr}</div>
      ${portrait2}
      <span class="discovery-tier tier-5" style="margin-top:5px;margin-bottom:2px;
        background:rgba(212,160,23,0.1);color:var(--gold);">L${g.lvl}</span>
      <div class="discovery-sub" style="text-align:center;color:${sconfitto?"var(--primary)":"#374151"}">${subStr}</div>
    </div>`;
  }).join("");

  bestListEl.innerHTML = normalCards + godDivider + godCards;
  resolveImgs();
 }

 // ── Tesori ──
 const ntFound = Object.keys(w.tesoriScoperti||{}).length;
 const tstatEl = document.getElementById("treasure-stats");
 if (tstatEl) {
 tstatEl.innerHTML = `
 <div class="bacheca-stat"><div class="bacheca-stat-num">${ntFound}</div><div class="bacheca-stat-lbl">TROVATI</div></div>
 <div class="bacheca-stat"><div class="bacheca-stat-num">${w.deniariTotaliGuadagnati}</div><div class="bacheca-stat-lbl">DENARI TOT.</div></div>
 <div class="bacheca-stat"><div class="bacheca-stat-num">${TREASURES.length-ntFound}</div><div class="bacheca-stat-lbl">NASCOSTI</div></div>`;
 }

 const tlistEl = document.getElementById("treasure-list");
 if (tlistEl) {
 tlistEl.innerHTML = TREASURES.map(t => {
 const count = (w.tesoriScoperti||{})[t.id] || 0;
 const locked = count === 0;
 return `<div class="discovery-card ${locked?"locked":"unlocked"}"
 onclick="${!locked?`window.__kaizen.showTreasureDetail('${t.id}')`:""}" >
 <span class="discovery-tier tier-${t.tier}">T${t.tier}</span>
 <span class="discovery-icon">${locked?"":t.icon}</span>
 <div class="discovery-name" style="color:${locked?"#1e2535":"var(--gold)"}">${locked?"???":t.name}</div>
 <div class="discovery-sub">${locked?"—":count>0?`×${count} · ${t.minV}-${t.maxV} 🪙`:""}</div>
 </div>`;
 }).join("");
 }
}

/* ── Log in Impostazioni ── */
function renderLog(state) {
 const el = document.getElementById("settings-log-content");
 if (!el) return;

 const now48h = Date.now() - 48 * 3600 * 1000;
 const recent = state.history.filter(l => l.t >= now48h);

 if (!recent.length) {
 el.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#1e2535;text-align:center;padding:20px;letter-spacing:2px">NESSUNA ATTIVITÀ NELLE ULTIME 48 ORE</div>`;
 return;
 }

 el.innerHTML = `<div class="log-list">` +
 recent.map(l => `
 <div class="log-item cat-${l.cat||"system"}">
 <div class="log-item-time">${formatDate(l.t)}</div>
 <div class="log-item-msg">${l.msg}</div>
 </div>`).join("") +
 `</div>`;
}

/* ══════════════════════════════════════════════════════════
 MODALS DI DETTAGLIO
══════════════════════════════════════════════════════════ */
export function showBestiaryDetail(enemyId) {
 const enemy = BESTIARY.find(e => e.id === enemyId) || EMPIREO_GODS.find(e => e.id === enemyId);
 if (!enemy) return;
 const w = store.state.world;
 const kills = w.nemiciAbbattuti?.[enemyId] || 0;
 const incontri = Math.max(w.nemiciIncontrati?.[enemyId]||0, kills);
 const box = document.getElementById("detail-modal-box");
 if (!box) return;

 document.getElementById("detail-modal").classList.add("show");
 box.innerHTML = `
 <div class="modal-title">Bestiario</div>

 <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:14px">
 <!-- Immagine nemico -->
 <div style="flex-shrink:0">
 ${enemyImgHTML(enemy, 96)}
 </div>
 <!-- Nome e trait -->
 <div style="flex:1;min-width:0">
 <div style="font-family:'Cinzel',serif;font-size:15px;font-weight:700;
 margin-bottom:4px;line-height:1.3">${enemy.name}</div>
 <span class="enemy-trait-badge">Lv ${enemy.lvl} · ${enemy.trait}</span>
 <div style="font-family:'JetBrains Mono',monospace;font-size:8px;
 color:#64748b;margin-top:6px">
 ${enemy.human ? "UMANOIDE" : "CREATURA"}<br>
 ${enemy.tags.join(", ")||"—"}
 </div>
 </div>
 </div>

 <div class="detail-stat-grid">
 <div class="detail-stat-box"><div class="detail-stat-val" style="color:#dc2626">${enemy.forza}</div><div class="detail-stat-lbl">FORZA</div></div>
 <div class="detail-stat-box"><div class="detail-stat-val" style="color:#0ea5e9">${enemy.velocita}</div><div class="detail-stat-lbl">VELOCITÀ</div></div>
 <div class="detail-stat-box"><div class="detail-stat-val" style="color:#10b981">${enemy.destrezza}%</div><div class="detail-stat-lbl">DESTREZZA</div></div>
 <div class="detail-stat-box"><div class="detail-stat-val" style="color:#f97316">${enemy.critico}%</div><div class="detail-stat-lbl">CRITICO</div></div>
 <div class="detail-stat-box" style="grid-column:1/-1">
 <div class="detail-stat-val" style="color:#dc2626">${enemy.costituzione}</div>
 <div class="detail-stat-lbl">PUNTI VITA</div>
 </div>
 </div>

 <div style="display:flex;gap:8px;margin:10px 0">
 <div class="detail-stat-box" style="flex:1;text-align:center">
 <div class="detail-stat-val" style="color:var(--gold)">${incontri}</div>
 <div class="detail-stat-lbl">INCONTRI</div>
 </div>
 <div class="detail-stat-box" style="flex:1;text-align:center">
 <div class="detail-stat-val" style="color:var(--primary)">${kills}</div>
 <div class="detail-stat-lbl">UCCISI</div>
 </div>
 </div>

 <button class="modal-close-btn" onclick="window.__kaizen.closeDetailModal()">CHIUDI</button>
 `;
  resolveImgs();
}

export function showTreasureDetail(treasureId) {
 const t = TREASURES.find(x => x.id === treasureId);
 if (!t) return;
 const count = store.state.world.tesoriScoperti?.[treasureId] || 0;

 const box = document.getElementById("detail-modal-box");
 if (!box) return;
 document.getElementById("detail-modal").classList.add("show");
 box.innerHTML = `
 <div class="modal-title"> Tesori</div>
 <div style="text-align:center;font-size:48px;padding:16px 0 8px">${t.icon}</div>
 <div style="text-align:center;margin-bottom:4px">
 <span style="font-family:'Cinzel',serif;font-size:16px;font-weight:700;color:var(--gold)">${t.name}</span>
 </div>
 <div style="text-align:center;margin-bottom:14px">
 <span class="enemy-trait-badge">Tier ${t.tier}</span>
 </div>
 <div style="display:flex;gap:8px;margin:12px 0">
 <div class="detail-stat-box" style="flex:1;text-align:center">
 <div class="detail-stat-val" style="color:var(--gold)">${t.minV}–${t.maxV}</div>
 <div class="detail-stat-lbl">VALORE (🪙)</div>
 </div>
 <div class="detail-stat-box" style="flex:1;text-align:center">
 <div class="detail-stat-val" style="color:var(--primary)">${count}</div>
 <div class="detail-stat-lbl">TROVATO</div>
 </div>
 </div>
 <button class="modal-close-btn" onclick="window.__kaizen.closeDetailModal()">CHIUDI</button>
 `;
  resolveImgs();
}

export function showTrophyDetail(questId) {
 const allQ = [...QUEST_POOL_EVO, ...QUEST_POOL_WORLD];
 const q = allQ.find(x => x.id === questId) ||
 (questId==="day_perfect"?{text:"Sole Invincibile",desc:"Completa tutte le abitudini in un giorno",target:1,type:"day"}:null);
 if (!q) return;
 const count = store.state.trophies[questId] || 0;
 const isWorld = QUEST_POOL_WORLD.some(x => x.id === questId);

 const box = document.getElementById("detail-modal-box");
 if (!box) return;
 document.getElementById("detail-modal").classList.add("show");
 box.innerHTML = `
 <div class="modal-title"> Trofeo</div>
 <div style="text-align:center;font-size:40px;padding:12px 0 6px">${isWorld?"":""}</div>
 <div style="text-align:center;margin-bottom:4px">
 <span style="font-family:'Cinzel',serif;font-size:15px;font-weight:700;color:var(--gold)">${q.text}</span>
 </div>
 <div style="text-align:center;margin-bottom:14px;font-family:'JetBrains Mono',monospace;font-size:9px;color:#94a3b8">
 ${q.desc || ""}
 </div>
 <div style="display:flex;gap:8px">
 <div class="detail-stat-box" style="flex:1;text-align:center">
 <div class="detail-stat-val" style="color:var(--gold)">${count}</div>
 <div class="detail-stat-lbl">OTTENUTO</div>
 </div>
 <div class="detail-stat-box" style="flex:1;text-align:center">
 <div class="detail-stat-val" style="color:var(--primary)">${q.target||"—"}</div>
 <div class="detail-stat-lbl">OBIETTIVO</div>
 </div>
 </div>
 <button class="modal-close-btn" onclick="window.__kaizen.closeDetailModal()">CHIUDI</button>
 `;
  resolveImgs();
}

export function closeDetailModal() {
 document.getElementById("detail-modal")?.classList.remove("show");
}

/* ══════════════════════════════════════════════════════════
 showAllAreaQuests — Modal con tutte le missioni dell'area
══════════════════════════════════════════════════════════ */
export function showAllAreaQuests() {
  const w   = store.state.world;
  const wp  = w.worldProgress || {};
  const areaId  = wp.areaCorrente || "foresta";
  const areaCfg = WORLD_AREAS.find(a => a.id === areaId) || WORLD_AREAS[0];
  const poolQ   = AREA_QUESTS[areaId] || [];
  const tracker = wp.missioniPerArea?.[areaId] || {};

  const doneCount = poolQ.filter(q => tracker[q.id]?.completed).length;
  const totalPct  = poolQ.length > 0 ? Math.round(doneCount / poolQ.length * 100) : 0;

  const rows = poolQ.map(q => {
    const t    = tracker[q.id] || { progress: 0, completed: false };
    const pct  = q.target > 0 ? Math.min(100, Math.round(t.progress / q.target * 100)) : 0;
    const done = t.completed;
    return `<div class="aq-row${done ? " aq-done" : ""}">
      <div class="aq-row-header">
        <span class="aq-num">${q.n}</span>
        <span class="aq-title">${q.title}</span>
        <span class="aq-prog">${done ? "✦" : `${t.progress}/${q.target}`}</span>
      </div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#4b5563;line-height:1.4;margin-bottom:5px;">${q.desc}</div>
      <div class="aq-bar-bg"><div class="aq-bar" style="width:${pct}%"></div></div>
    </div>`;
  }).join("");

  const html = `
    <div id="all-quests-overlay" onclick="if(event.target===this)this.remove()"
      style="position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:9999;backdrop-filter:blur(4px);
        display:flex;align-items:flex-end;justify-content:center;padding:0;">
      <div style="background:var(--card-solid);border:1px solid rgba(212,160,23,0.2);
        border-radius:16px 16px 0 0;width:100%;max-width:480px;max-height:88vh;
        display:flex;flex-direction:column;overflow:hidden;
        box-shadow:0 -20px 60px rgba(0,0,0,0.7);">

        <!-- Header -->
        <div style="padding:16px 18px 12px;border-bottom:1px solid var(--glass-border);flex-shrink:0;
          background:linear-gradient(180deg,rgba(212,160,23,0.06),transparent);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <div style="font-family:'Cinzel',serif;font-size:15px;font-weight:900;
                color:var(--gold-light);letter-spacing:1.5px;">${areaCfg.icon} ${areaCfg.name}</div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:8px;
                color:#64748b;letter-spacing:1px;margin-top:3px;">
                MISSIONI — ${doneCount}/${poolQ.length} COMPLETATE
              </div>
            </div>
            <button onclick="document.getElementById('all-quests-overlay').remove()"
              style="background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);
                color:#64748b;font-size:14px;cursor:pointer;padding:0;
                width:32px;height:32px;border-radius:8px;display:flex;
                align-items:center;justify-content:center;flex-shrink:0;">✕</button>
          </div>
          <!-- Progress bar totale -->
          <div style="margin-top:10px;">
            <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:${totalPct}%;
                background:linear-gradient(90deg,var(--gold),var(--gold-light));
                box-shadow:0 0 8px rgba(212,160,23,0.35);border-radius:3px;
                transition:width .5s cubic-bezier(0.4,0,0.2,1);"></div>
            </div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:8px;
              color:var(--gold);text-align:right;margin-top:4px;letter-spacing:0.5px;">${totalPct}%</div>
          </div>
        </div>

        <!-- Lista missioni -->
        <div style="overflow-y:auto;padding:14px 16px 24px;flex:1;">${rows}</div>
      </div>
    </div>`;

  document.getElementById("all-quests-overlay")?.remove();
  document.body.insertAdjacentHTML("beforeend", html);
}

