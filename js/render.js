/* ============================================================
 render.js — aggiorna tutto il DOM in base allo stato
 KAIZEN v6.37
 ============================================================ */

import { store } from "./state.js";
import { HABITS, STAT_DEFS, rankTitles,
         BESTIARY, TREASURES, RELICS,
         EQUIPMENT_POOL, AREA_LOOT_POOL,
         QUEST_POOL_EVO, QUEST_POOL_WORLD,
         titleMetalColors,
         WORLD_AREAS, AREA_QUESTS, EMPIREO_GODS } from "./data.js";
import { isDone, getHeroStats, getHeroRank,
         getRankTitle, habitLevel,
         habitXpInLevel } from "./engine.js";
import { formatDate } from "./ui.js";
import { regenPV, regenPA,
         getMinsPerPV, getMinsPerPA } from "./world.js";
import { renderShop, renderEquipment } from "./shop.js";
import { enemyImgCard, enemyImgHTML, enemyImgPath, heroAvatarHTML, resolveImgs } from "./img.js";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV"];
const roman = n => ROMAN[n] || String(n);
const fmtDen = n => Math.floor(n || 0).toLocaleString("it-IT");
const COIN = `<span class="mk-coin"></span>`;

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

  renderHabits(state, rank, title);
  renderHero(state, heroS, rank, title);
  renderQuests(state);
  renderWorld(heroS, w);
  renderBacheca(state, w);
  renderShop();
  renderLog(state);
}

/* ── Pagina ABITUDINI ── */
function renderHabits(state, rank = getHeroRank(), title = getRankTitle(rank)) {
  const el = document.getElementById("habit-list");
  if (!el) return;

  const tilesHTML = HABITS.map((hd) => {
    const h = state.habits[hd.id] || { xp: 0, last: null, result: null };
    const lv = habitLevel(hd.id);
    const xp = habitXpInLevel(hd.id);
    const done = isDone(h.last) && h.result === "done";
    const failed = isDone(h.last) && h.result === "failed";
    const marked = done || failed;

    const sdef = STAT_DEFS.find(s => s.habit === hd.id);
    const statLabel = sdef ? sdef.label : hd.stat.toUpperCase();
    const acc = done ? "#4ecca3" : failed ? "#e0533d" : hd.color;

    const actionBar = done
      ? `<button class="mk-price mk-price--ok" disabled><span class="mk-price-row">✦ Compiuta oggi</span></button>`
      : failed
      ? `<button class="mk-price mk-price--danger" disabled><span class="mk-price-row">✕ Mancata oggi</span></button>`
      : `<div class="mk-split-actions">
           <button class="mk-act mk-act--ok" onclick="window.__kaizen.updateXP('${hd.id}',true)">✓ Compiuta</button>
           <button class="mk-act mk-act--no" onclick="window.__kaizen.updateXP('${hd.id}',false)">✕ Mancata</button>
         </div>`;

    return `
    <div class="mk-tile ${done ? "is-active" : failed ? "is-off" : ""} ${marked ? "is-marked" : ""}" style="--acc:${acc}">
      <div class="mk-tile-cap">${statLabel} · Grado ${lv} · ${fmtDen(h.xp)} XP tot.</div>
      <div class="mk-tile-row-head">
        <span class="mk-tile-name">${hd.label}</span>
        <span class="mk-tile-big">${xp}<small>/ 100 XP</small></span>
      </div>
      <div class="mk-vital-bar mk-dur"><i style="width:${xp}%;background:${acc}"></i></div>
      ${actionBar}
    </div>`;
  }).join("");

  el.innerHTML = `
  <div class="mk">
    <div class="mk-grid mk-grid--1 mk-grid--habits">${tilesHTML}</div>
  </div>`;
}

/* ── Pagina EROE ── */
function renderHero(state, heroS, rank, title) {
  const avViewport = document.getElementById("avatar-viewport-inner");
  if (avViewport) {
    avViewport.innerHTML = heroAvatarHTML(title, "100%", "auto");
    resolveImgs(avViewport);
  }

  const nameEl = document.getElementById("char-spec");
  if (nameEl) {
    nameEl.innerText = title;
    nameEl.style.color = titleMetalColors[title] || "#ece3cf";
    nameEl.style.textShadow = `0 2px 18px ${titleMetalColors[title] || "#d4a017"}44`;
  }
  const rankEl = document.getElementById("char-rank");
  if (rankEl) rankEl.innerText = "RANGO " + rank + " · ALBO DEI RANGHI";

  const sgEl = document.getElementById("stats-grid");
  if (sgEl) {
    const statTiles = STAT_DEFS.map(sd => {
      const val = heroS[sd.id] ?? 0;
      const lv = habitLevel(sd.habit);
      const hdef = HABITS.find(h => h.id === sd.habit);
      const col = hdef?.color || "var(--gold)";
      const showPct = ["destrezza", "critico", "furtivita", "carisma"].includes(sd.id);
      const numVal = typeof val === "number" ? Math.round(val * 100) / 100 : val;
      return `
      <div class="mk-tile" style="--acc:${col};padding-bottom:7px;">
        <div class="mk-tile-cap">${hdef?.label || ""} · Lv ${lv}</div>
        <div class="mk-tile-row-head">
          <span class="mk-tile-name">${sd.label}</span>
          <span class="mk-tile-big">${numVal}${showPct ? `<small>%</small>` : ""}</span>
        </div>
        <div class="mk-tile-desc" style="margin-bottom:0">${sd.desc}</div>
      </div>`;
    }).join("");

    sgEl.innerHTML = `<div class="mk"><div class="mk-grid mk-grid--1">${statTiles}</div></div>`;
  }

  renderEquipment();
}

/* ── Pagina QUEST SETTIMANALI ── */
function renderQuests(state) {
  const el = document.getElementById("quest-list");
  if (!el) return;

  const renderQuestTiles = (quests, typeLabel, baseAcc) =>
    quests.map((q) => {
      const perc = Math.min(100, (q.progress / q.target) * 100);
      const acc = q.completed ? "#4ecca3" : baseAcc;
      return `
      <div class="mk-tile ${q.completed ? "is-active is-marked" : ""}" style="--acc:${acc};padding-bottom:9px;">
        <div class="mk-tile-cap">${typeLabel}</div>
        <div class="mk-tile-row-head">
          <span class="mk-tile-name">${q.text}</span>
          <span class="mk-tile-big">${q.progress}<small>/ ${q.target}</small></span>
        </div>
        <div class="mk-vital-bar mk-dur"><i style="width:${perc}%;background:${acc}"></i></div>
        <div class="mk-tile-desc" style="margin-bottom:${q.completed ? "6px" : "0"}">${q.desc}</div>
        ${q.completed ? `<div class="mk-chip mk-chip--ok" style="margin-bottom:0">✦ Impresa Compiuta</div>` : ""}
      </div>`;
    }).join("");

  const evoDone = state.activeQuestsEvo.filter(q => q.completed).length;
  const worldDone = state.activeQuestsWorld.filter(q => q.completed).length;
  const evoAll = evoDone === state.activeQuestsEvo.length && state.activeQuestsEvo.length > 0;
  const worldAll = worldDone === state.activeQuestsWorld.length && state.activeQuestsWorld.length > 0;

  el.innerHTML = `
  <div class="mk">
    <div class="mk-group">Capitolo I · Evoluzione</div>
    <div class="mk-note">Prove di costanza legate alle tue discipline quotidiane</div>
    <div class="mk-grid mk-grid--1 mk-grid--quests">${renderQuestTiles(state.activeQuestsEvo, "Evoluzione", "#df784b")}</div>
    ${evoAll ? `<div class="mk-empty" style="color:#4ecca3;border-color:rgba(78,204,163,.35);margin-top:8px;">✦ Sigillo dell'Evoluzione compiuto: +20 XP ottenuti</div>` : ""}

    <div class="mk-group">Capitolo II · Mondo Esterno</div>
    <div class="mk-note">Imprese di caccia, bottino ed esplorazione nelle terre selvagge</div>
    <div class="mk-grid mk-grid--1 mk-grid--quests">${renderQuestTiles(state.activeQuestsWorld, "Mondo Esterno", "#a78bfa")}</div>
    ${worldAll ? `<div class="mk-empty" style="color:#4ecca3;border-color:rgba(78,204,163,.35);margin-top:8px;">✦ Sigillo del Mondo compiuto: +20 XP ottenuti</div>` : ""}
  </div>`;
}

/* ── Pagina MONDO ESTERNO ── */
export function renderWorld() {
  const state = store.state;
  const w     = state.world;
  const heroS = getHeroStats();
  const elStatus  = document.getElementById("world-status-panel");
  const elBtnWrap = document.getElementById("mission-btn-wrap");
  const elLog     = document.getElementById("world-log-section");
  if (!elStatus) return;

  if (!w.worldProgress) {
    w.worldProgress = {
      areaCorrente: "foresta", areeSbloccate: ["foresta"],
      missioniPerArea: {}, deniariPerArea: {}, spedizioniPerArea: {},
      uccisioniPerAreaEnemyName: {}, lottiPerArea: {},
      deiSconfitti: [], bottiniDivini: [], trofeiEmpirei: [], gameCompleted: false,
    };
  }
  const wpSafe = w.worldProgress;
  const areaId  = wpSafe.areaCorrente || "foresta";
  const areaCfg = WORLD_AREAS.find(a => a.id === areaId) || WORLD_AREAS[0];
  const areaSbloccate = wpSafe.areeSbloccate || ["foresta"];

  /* ── Selettore aree ── */
  const areaTabs = WORLD_AREAS.map((a, idx) => {
    const sbloccata = areaSbloccate.includes(a.id);
    const attiva    = a.id === areaId;
    const poolQ     = AREA_QUESTS[a.id] || [];
    const tracker   = wpSafe.missioniPerArea?.[a.id] || {};
    const done      = poolQ.filter(q => tracker[q.id]?.completed).length;
    const total     = poolQ.length;
    const spanFull  = idx === WORLD_AREAS.length - 1 && WORLD_AREAS.length % 2 === 1 ? "grid-column:1/-1;" : "";
    if (!sbloccata) {
      return `<button class="mk-tab is-locked" style="${spanFull}" disabled title="Completa le missioni della zona precedente">
        <span style="opacity:0.6;">${roman(idx + 1)} ·</span> <span class="mk-tab-zone" style="color:${a.color};opacity:0.65;">${a.name}</span> <b>Bloccata</b>
      </button>`;
    }
    return `<button class="mk-tab ${attiva ? "is-on" : ""}" style="${spanFull}${attiva ? `;border-color:${a.color}aa;background:${a.color}18;box-shadow:0 0 10px ${a.color}25;` : ''}"
              onclick="window.__kaizen.setArea('${a.id}')">
      <span style="opacity:0.7;">${roman(idx + 1)} ·</span> <span class="mk-tab-zone" style="color:${a.color};font-weight:700;">${a.name}</span> <b>${done}/${total}</b>
    </button>`;
  }).join("");

  const poolQ   = AREA_QUESTS[areaId] || [];
  const tracker = wpSafe.missioniPerArea?.[areaId] || {};
  const doneQ   = poolQ.filter(q => tracker[q.id]?.completed).length;

  const questePending = poolQ.filter(q => !tracker[q.id]?.completed).slice(0, 4);

  const questsHTML = questePending.map((q) => {
    const t = tracker[q.id] || { progress: 0, completed: false };
    const pct = q.target > 0 ? Math.min(100, Math.round(t.progress / q.target * 100)) : 0;
    const done = t.completed;
    const acc = done ? "#4ecca3" : "#df784b";
    return `
    <div class="mk-tile ${done ? "is-active is-marked" : ""}" style="--acc:${acc};">
      <div class="mk-tile-cap">Incarico ${roman(q.n) || q.n}${done ? " · Compiuto" : ""}</div>
      <div class="mk-tile-row-head">
        <span class="mk-tile-name">${q.title}</span>
        <span class="mk-tile-big">${done ? "✦" : `${t.progress}<small>/ ${q.target}</small>`}</span>
      </div>
      <div class="mk-vital-bar mk-dur"><i style="width:${pct}%;background:${acc}"></i></div>
      <div class="mk-tile-desc">${q.desc}</div>
      ${done ? `<div class="mk-chip mk-chip--ok" style="margin:2px 0 0;">✦ Incarico Compiuto</div>` : ""}
    </div>`;
  }).join("") || `<div class="mk-empty" style="color:#4ecca3;border-color:rgba(78,204,163,.35);">✦ Tutti gli incarichi di questa regione sono stati compiuti.</div>`;

  // Empireo: pannello divinità
  let empireoPanel = "";
  if (areaId === "empireo") {
    const dei = [
      {id:"e181",name:"Valeska"}, {id:"e182",name:"Thalmos"},
      {id:"e183",name:"Sylvaris"},{id:"e184",name:"Ignaroth"},
      {id:"e185",name:"Abyssor"}, {id:"e186",name:"Lunarys"},
      {id:"e187",name:"Solarius"},{id:"e188",name:"Varos"},
      {id:"e189",name:"Morvath"}, {id:"e190",name:"Kaelos"},
    ];
    const deiHTML = dei.map(d => {
      const morto = (wpSafe.deiSconfitti || []).includes(d.id);
      return `
      <div class="mk-tile ${morto ? "is-off" : "is-active"}" style="--acc:${morto ? "#6f6656" : "var(--gold-light)"};padding:10px 6px;">
        <div class="mk-tile-cap">${morto ? "Caduto" : "Immortale"}</div>
        <div class="mk-tile-name" style="min-height:1.4em;font-size:10.5px;${morto ? "text-decoration:line-through;" : ""}">${d.name}</div>
      </div>`;
    }).join("");
    empireoPanel = `
    <div class="mk-group">Pantheon dell'Empireo (${(wpSafe.deiSconfitti || []).length}/10)</div>
    <div class="mk-note">Ogni divinità può essere affrontata e sconfitta una sola volta</div>
    <div class="mk-grid" style="margin-bottom:12px;">${deiHTML}</div>`;
  }

  const pvPct = Math.min(100, Math.round(w.pvAttuali / heroS.pvMax * 100));
  const paPct = Math.min(100, Math.round(w.paAttuali / heroS.paMax * 100));

  elStatus.innerHTML = `
  <div class="mk">
    <div class="mk-group" style="margin-top:0">Atlante delle Regioni</div>
    <div class="mk-tabs mk-tabs--2">${areaTabs}</div>

    <div class="mk-purse" style="margin-top:12px;border-color:${areaCfg.color}40;">
      <div class="mk-purse-cap">Livello ${areaCfg.lvlMin}–${areaCfg.lvlMax} · Incarichi ${doneQ}/${poolQ.length}</div>
      <div class="mk-purse-val" style="font-size:22px;letter-spacing:2px;color:${areaCfg.color};text-shadow:0 0 14px ${areaCfg.color}40;">${areaCfg.name}</div>
      <div class="mk-purse-sub">${areaCfg.desc || "Terre inesplorate oltre il confine"}</div>
    </div>

    <div class="mk-vitals mk-vitals--3" style="margin-bottom:14px;">
      <div class="mk-vital" style="--acc:#d9473f">
        <div class="mk-vital-cap">Vita</div>
        <div class="mk-vital-val">${Math.floor(w.pvAttuali)}<small>/ ${heroS.pvMax}</small></div>
        <div class="mk-vital-bar"><i style="width:${pvPct}%"></i></div>
      </div>
      <div class="mk-vital" style="--acc:#4a8ee8">
        <div class="mk-vital-cap">Azione</div>
        <div class="mk-vital-val">${Math.floor(w.paAttuali)}<small>/ ${heroS.paMax}</small></div>
        <div class="mk-vital-bar"><i style="width:${paPct}%"></i></div>
      </div>
      <div class="mk-vital" style="--acc:var(--gold)">
        <div class="mk-vital-cap">Borsa</div>
        <div class="mk-vital-val" style="color:var(--gold-light);display:inline-flex;align-items:center;gap:5px;">${COIN}${fmtDen(w.denari)}</div>
        <div class="mk-vital-bar"><i style="width:100%"></i></div>
      </div>
    </div>

    ${empireoPanel}

    <div style="margin:14px 0 18px;">
      <button class="mk-expedition" onclick="window.__kaizen.runMission()" style="border-color:${areaCfg.color}55;">
        <span class="mk-expedition-cap">Esplorazione · <span style="color:${areaCfg.color};font-weight:700;">${areaCfg.name}</span></span>
        <span class="mk-expedition-title">Invia Spedizione</span>
        <span class="mk-expedition-sub">Costo: ${COIN} <b>${areaCfg.costoOro}</b> denari · <b>${areaCfg.costoPA} PA</b></span>
      </button>
    </div>

    <div class="mk-group">Incarichi di Regione (${doneQ}/${poolQ.length})</div>
    ${questePending.length ? `<div class="mk-grid mk-grid--1 mk-grid--world-quests">${questsHTML}</div>` : questsHTML}
    <button class="mk-wide-btn" onclick="window.__kaizen.showAllAreaQuests()">
      Consulta il Registro Completo (${doneQ}/${poolQ.length})
    </button>
  </div>`;

  if (elBtnWrap) {
    elBtnWrap.innerHTML = "";
    elBtnWrap.style.display = "none";
  }

  if (elLog) {
    const TYPE_META = {
      win:      { lbl:"Vittoria",        acc:"#4ecca3" },
      lose:     { lbl:"Sconfitta",       acc:"#e0533d" },
      treasure: { lbl:"Tesoro",          acc:"var(--gold)" },
      relic:    { lbl:"Reliquia",        acc:"#a78bfa" },
      equip:    { lbl:"Equipaggiamento", acc:"#5fb8ec" },
      material: { lbl:"Materiale",       acc:"#6cc4ef" },
      fled:     { lbl:"Ritirata",        acc:"#e3a32b" },
      empty:    { lbl:"Esplorazione",    acc:"#8b7b5c" },
    };
    const logs = (w.missioniLog || []).slice(0, 5);
    const logsHTML = logs.length
      ? `<div class="mk-grid mk-grid--1 mk-grid--logs">${logs.map((m) => {
          const meta = TYPE_META[m.tipo] || { lbl:"Evento", acc:"var(--gold)" };
          return `
          <div class="mk-tile mk-tile--log" style="--acc:${meta.acc};">
            <div class="mk-tile-cap" style="color:${meta.acc}">${meta.lbl}</div>
            <div class="mk-tile-row-head">
              <span class="mk-tile-name">${m.nome}</span>
              ${m.denari ? `<span class="mk-chip mk-chip--gold">+${fmtDen(m.denari)} denari</span>` : `<span class="mk-log-tag">registro di viaggio</span>`}
            </div>
          </div>`;
        }).join("")}</div>`
      : `<div class="mk-empty">Nessuna spedizione registrata nel diario.</div>`;

    elLog.innerHTML = `
    <div class="mk">
      <div class="mk-group">Diario delle Ultime Spedizioni</div>
      ${logsHTML}
    </div>`;
  }
}

const bachecaOpenCats = new Set();

function renderBacheca(state, w) {
  // ── Trofei ──
  const trophyEl = document.getElementById("trophy-list");
  if (trophyEl) {
    const allQuests = [...QUEST_POOL_EVO, ...QUEST_POOL_WORLD];
    const entries = Object.entries(state.trophies);
    if (!entries.length) {
      trophyEl.innerHTML = `<div class="mk" style="grid-column:1/-1;"><div class="mk-empty">Nessun trofeo ancora inciso nella bacheca.</div></div>`;
    } else {
      trophyEl.innerHTML = entries.map(([id, count]) => {
        const q = allQuests.find(x => x.id === id) ||
          (id === "day_perfect" ? { text: "Sole Invincibile", id } : null);
        if (!q) return "";
        const isWorld = QUEST_POOL_WORLD.some(x => x.id === id);
        const cap = id === "day_perfect" ? "Giornata Perfetta" : isWorld ? "Impresa del Mondo" : "Impresa d'Evoluzione";
        const acc = id === "day_perfect" ? "var(--gold-light)" : isWorld ? "#a78bfa" : "#df784b";
        return `
        <div class="mk-tile" style="--acc:${acc};padding-bottom:12px;cursor:pointer;" onclick="window.__kaizen.showTrophyDetail('${id}')">
          <div class="mk-tile-cap">${cap}</div>
          <div class="mk-tile-name">${q.text}</div>
          <div class="mk-tile-big">×${count}</div>
          <div class="mk-tile-desc" style="margin-bottom:0">tocca per consultare</div>
        </div>`;
      }).join("");
    }
  }

  // ── Bestiario ──
  const seenIds = new Set([...Object.keys(w.nemiciIncontrati || {}), ...Object.keys(w.nemiciAbbattuti || {})]);
  const nKills = Object.values(w.nemiciAbbattuti || {}).reduce((a, b) => a + b, 0);

  const bestStatEl = document.getElementById("bestiary-stats");
  if (bestStatEl) {
    bestStatEl.innerHTML = `
    <div class="mk-vital" style="--acc:#8b7b5c"><div class="mk-vital-cap">Incontrati</div><div class="mk-vital-val">${seenIds.size}</div></div>
    <div class="mk-vital" style="--acc:#e0533d"><div class="mk-vital-cap">Abbattuti</div><div class="mk-vital-val">${nKills}</div></div>
    <div class="mk-vital" style="--acc:#8b7b5c"><div class="mk-vital-cap">Ignoti</div><div class="mk-vital-val">${BESTIARY.length - seenIds.size}</div></div>
    <div class="mk-vital" style="--acc:var(--gold-light)"><div class="mk-vital-cap">Divinità</div><div class="mk-vital-val">${(w.worldProgress?.deiSconfitti || []).length}<small>/10</small></div></div>`;
  }

  const bestListEl = document.getElementById("bestiary-list");
  if (bestListEl) {
    const tierColors = { 1:"#4a9060", 2:"#4a70b0", 3:"#9060b0", 4:"#c07830", 5:"#c03030" };
    const normalCards = BESTIARY.map(e => {
      const seen = seenIds.has(e.id);
      const kills = w.nemiciAbbattuti?.[e.id] || 0;
      const incontri = Math.max(w.nemiciIncontrati?.[e.id] || 0, kills);
      const tNum = e.lvl >= 121 ? 5 : e.lvl >= 81 ? 4 : e.lvl >= 41 ? 3 : e.lvl >= 11 ? 2 : 1;
      const acc = seen ? tierColors[tNum] : "rgba(255,255,255,.08)";

      const portrait = seen
        ? `<div style="margin:4px auto 6px;">${enemyImgCard(e, 58)}</div>`
        : `<div class="mk-unknown-portrait">?</div>`;

      return `
      <div class="mk-tile ${seen ? "" : "is-off"}" style="--acc:${acc};padding-bottom:12px;cursor:${seen ? "pointer" : "default"};"
           onclick="${seen ? `window.__kaizen.showBestiaryDetail('${e.id}')` : ""}">
        <div class="mk-tile-cap">Livello ${e.lvl} · Grado ${roman(tNum)}</div>
        <div class="mk-tile-name" style="min-height:2.2em">${seen ? e.name : "Creatura Ignota"}</div>
        ${portrait}
        <div class="mk-tile-desc" style="margin-bottom:0">${seen ? `${incontri} incontri · ${kills} uccisi` : "non ancora avvistato"}</div>
      </div>`;
    }).join("");

    const wpSafe2 = w.worldProgress || {};
    const deiSconfitti = wpSafe2.deiSconfitti || [];
    const empireoUnlocked = (wpSafe2.areeSbloccate || []).includes("empireo");

    const godDivider = `<div class="mk-group" style="grid-column:1/-1;margin-top:20px;">Pantheon dell'Empireo</div>`;

    const godCards = EMPIREO_GODS.map(g => {
      const sconfitto = deiSconfitti.includes(g.id);
      const portrait2 = empireoUnlocked
        ? `<div style="margin:4px auto 6px;">${enemyImgCard(g, 58)}</div>`
        : `<div class="mk-unknown-portrait">?</div>`;
      const nameStr = empireoUnlocked ? g.name : "Divinità Ignota";
      const subStr  = empireoUnlocked ? (sconfitto ? "✦ sconfitto" : "mai affrontato") : "avvolto nel mito";
      return `
      <div class="mk-tile ${empireoUnlocked ? (sconfitto ? "is-active" : "") : "is-off"}"
           style="--acc:${sconfitto ? "#4ecca3" : "var(--gold-light)"};padding-bottom:12px;cursor:${sconfitto ? "pointer" : "default"};"
           onclick="${sconfitto ? `window.__kaizen.showBestiaryDetail('${g.id}')` : ""}">
        <div class="mk-tile-cap">Livello ${g.lvl} · Divinità</div>
        <div class="mk-tile-name" style="min-height:2.2em;color:var(--gold-light)">${nameStr}</div>
        ${portrait2}
        <div class="mk-tile-desc" style="margin-bottom:0;color:${sconfitto ? "#4ecca3" : "#8f8268"}">${subStr}</div>
      </div>`;
    }).join("");

    bestListEl.innerHTML = normalCards + godDivider + godCards;
    resolveImgs();
  }

  // ── Tesori (accorpati: generici + specifici per area) ──
  const tstatEl = document.getElementById("treasure-stats");
  const tlistEl = document.getElementById("treasure-list");
  if (tstatEl && tlistEl) {
    let allAreaItems = [];
    Object.values(AREA_LOOT_POOL).forEach(pool => {
      allAreaItems = allAreaItems.concat(pool);
    });
    const allCollectibles = [...TREASURES, ...allAreaItems];
    let totalFound = 0;
    allCollectibles.forEach(item => {
      if ((w.tesoriScoperti || {})[item.id]) totalFound++;
    });

    tstatEl.innerHTML = `
    <div class="mk-vital" style="--acc:#df784b"><div class="mk-vital-cap">Scoperti</div><div class="mk-vital-val">${totalFound}</div></div>
    <div class="mk-vital" style="--acc:var(--gold-light)"><div class="mk-vital-cap">Denari Totali</div><div class="mk-vital-val">${fmtDen(w.deniariTotaliGuadagnati)}</div></div>
    <div class="mk-vital" style="--acc:#8b7b5c"><div class="mk-vital-cap">Ignoti</div><div class="mk-vital-val">${allCollectibles.length - totalFound}</div></div>`;

    const makeTendina = (key, num, title, subtitle, countBadge, contentHTML) => {
      const isOpen = bachecaOpenCats.has(key);
      return `
      <details class="mk-shop zaino-details" data-cat="${key}" ${isOpen ? "open" : ""}>
        <summary>
          <span class="mk-shop-num">Catalogo ${num} · ${countBadge} scoperti</span>
          <span class="mk-shop-name">${title}</span>
          <span class="mk-shop-tag">${subtitle}</span>
          <span class="mk-shop-toggle"></span>
        </summary>
        <div class="mk-shop-body">
          <div class="mk-grid" style="margin-top:12px;">${contentHTML}</div>
        </div>
      </details>`;
    };

    let genFound = 0;
    TREASURES.forEach(t => {
      if ((w.tesoriScoperti || {})[t.id]) genFound++;
    });
    const genCards = TREASURES.map(t => {
      const count = (w.tesoriScoperti || {})[t.id] || 0;
      const locked = count === 0;
      return `
      <div class="mk-tile ${locked ? "is-off" : ""}" style="--acc:#df784b;padding-bottom:12px;cursor:${locked ? "default" : "pointer"};"
           onclick="${!locked ? `window.__kaizen.showTreasureDetail('${t.id}')` : ""}">
        <div class="mk-tile-cap">Grado ${roman(t.tier)}</div>
        <div class="mk-tile-name">${locked ? "Tesoro Ignoto" : t.name}</div>
        ${!locked ? `<div class="mk-tile-big" style="font-size:20px;">×${count}</div>` : ""}
        <div class="mk-tile-desc" style="margin-bottom:0">${locked ? "non ancora rinvenuto" : `${t.minV}–${t.maxV} denari`}</div>
      </div>`;
    }).join("");

    let sectionsHTML = makeTendina("generic", "I", "Tesori Generici", "reperti e monili diffusi in ogni terra", `${genFound}/${TREASURES.length}`, genCards);

    const areasWithLoot = WORLD_AREAS.filter(area => AREA_LOOT_POOL[area.id] && AREA_LOOT_POOL[area.id].length > 0);
    areasWithLoot.forEach((area, idx) => {
      const pool = AREA_LOOT_POOL[area.id];
      let areaFound = 0;
      pool.forEach(m => {
        if ((w.tesoriScoperti || {})[m.id]) areaFound++;
      });
      const areaCards = pool.map(m => {
        const count = (w.tesoriScoperti || {})[m.id] || 0;
        const locked = count === 0;
        return `
        <div class="mk-tile ${locked ? "is-off" : ""}" style="--acc:#df784b;padding-bottom:12px;cursor:${locked ? "default" : "pointer"};"
             onclick="${!locked ? `window.__kaizen.showTreasureDetail('${m.id}')` : ""}">
          <div class="mk-tile-cap">Rarità ${roman(m.rarity)}</div>
          <div class="mk-tile-name">${locked ? "Reperto Ignoto" : m.name}</div>
          ${!locked ? `<div class="mk-tile-big" style="font-size:20px;">×${count}</div>` : ""}
          <div class="mk-tile-desc" style="margin-bottom:0">${locked ? "non ancora rinvenuto" : `valore ${m.value} denari`}</div>
        </div>`;
      }).join("");

      sectionsHTML += makeTendina(area.id, roman(idx + 2), area.name, area.desc || "reperti esclusivi della regione", `${areaFound}/${pool.length}`, areaCards);
    });

    const toggleButtonsHTML = `
    <div class="mk-tabs mk-tabs--2" style="margin-top:0;margin-bottom:12px;">
      <button class="mk-tab" onclick="window.__kaizen.toggleAllTreasures(true)">Apri tutti i cataloghi</button>
      <button class="mk-tab" onclick="window.__kaizen.toggleAllTreasures(false)">Chiudi tutti i cataloghi</button>
    </div>`;

    tlistEl.innerHTML = `<div class="mk">${toggleButtonsHTML}${sectionsHTML}</div>`;

    tlistEl.querySelectorAll(".zaino-details").forEach(d => {
      d.addEventListener("toggle", () => {
        if (d.open) bachecaOpenCats.add(d.dataset.cat);
        else bachecaOpenCats.delete(d.dataset.cat);
      });
    });
  }
}

export function toggleAllTreasures(open) {
  const container = document.getElementById("treasure-list");
  if (!container) return;
  container.querySelectorAll(".zaino-details").forEach(d => {
    d.open = open;
    if (open) bachecaOpenCats.add(d.dataset.cat);
    else bachecaOpenCats.delete(d.dataset.cat);
  });
}

/* ── Log in Impostazioni ── */
function renderLog(state) {
  const el = document.getElementById("settings-log-content");
  if (!el) return;

  const now48h = Date.now() - 48 * 3600 * 1000;
  const recent = state.history.filter(l => l.t >= now48h);

  if (!recent.length) {
    el.innerHTML = `<div class="mk-empty">Nessuna attività registrata nelle ultime 48 ore.</div>`;
    return;
  }

  const CAT_META = {
    habit:  { lbl:"Disciplina", acc:"#4ecca3" },
    combat: { lbl:"Battaglia",  acc:"#e0533d" },
    world:  { lbl:"Mondo",      acc:"var(--gold)" },
    shop:   { lbl:"Mercato",    acc:"#6cc4ef" },
    quest:  { lbl:"Impresa",    acc:"#a78bfa" },
    system: { lbl:"Sistema",    acc:"#8b7b5c" },
  };

  el.innerHTML = `<div class="mk-log-list">` +
    recent.map(l => {
      const meta = CAT_META[l.cat || "system"] || CAT_META.system;
      return `
      <div class="mk-log-row" style="--acc:${meta.acc}">
        <div class="mk-log-cap">${meta.lbl} · ${formatDate(l.t)}</div>
        <div class="mk-log-msg">${l.msg}</div>
      </div>`;
    }).join("") +
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
  const incontri = Math.max(w.nemiciIncontrati?.[enemyId] || 0, kills);
  const box = document.getElementById("detail-modal-box");
  if (!box) return;

  document.getElementById("detail-modal").classList.add("show");
  box.innerHTML = `
  <div class="mk mk-modal">
    <div class="mk-modal-cap">Bestiario · Livello ${enemy.lvl}</div>
    <div class="mk-modal-title">${enemy.name}</div>
    ${enemy.trait ? `<div class="mk-note">${enemy.trait}</div>` : ""}

    <div style="margin:10px auto 14px;display:flex;justify-content:center;width:100%;">
      ${enemyImgHTML(enemy, "100%", "auto")}
    </div>

    <div class="mk-vitals" style="margin-bottom:8px;">
      <div class="mk-vital" style="--acc:#e0533d"><div class="mk-vital-cap">Forza</div><div class="mk-vital-val" style="color:#e0533d">${enemy.forza}</div></div>
      <div class="mk-vital" style="--acc:#5fb8ec"><div class="mk-vital-cap">Velocità</div><div class="mk-vital-val" style="color:#5fb8ec">${enemy.velocita}</div></div>
      <div class="mk-vital" style="--acc:#3fbf8a"><div class="mk-vital-cap">Destrezza</div><div class="mk-vital-val" style="color:#3fbf8a">${enemy.destrezza}%</div></div>
      <div class="mk-vital" style="--acc:#f0903f"><div class="mk-vital-cap">Critico</div><div class="mk-vital-val" style="color:#f0903f">${enemy.critico}%</div></div>
      <div class="mk-vital" style="--acc:#e0533d;grid-column:1/-1;"><div class="mk-vital-cap">Punti Vita</div><div class="mk-vital-val" style="color:#e0533d">${enemy.costituzione}</div></div>
    </div>

    <div class="mk-vitals" style="margin-top:8px;">
      <div class="mk-vital" style="--acc:#8b7b5c"><div class="mk-vital-cap">Incontri</div><div class="mk-vital-val" style="color:#d4c7b2">${incontri}</div></div>
      <div class="mk-vital" style="--acc:#4ecca3"><div class="mk-vital-cap">Abbattuti</div><div class="mk-vital-val" style="color:#4ecca3">${kills}</div></div>
    </div>

    <button class="modal-close-btn" onclick="window.__kaizen.closeDetailModal()">CHIUDI</button>
  </div>`;
  resolveImgs();
}

export function showTreasureDetail(treasureId) {
  let t = TREASURES.find(x => x.id === treasureId);
  let isArea = false;
  let areaName = "";
  if (!t) {
    for (const [areaKey, pool] of Object.entries(AREA_LOOT_POOL)) {
      const found = pool.find(x => x.id === treasureId);
      if (found) {
        t = found;
        isArea = true;
        const aObj = WORLD_AREAS.find(a => a.id === areaKey);
        areaName = aObj ? aObj.name : areaKey;
        break;
      }
    }
  }
  if (!t) return;
  const count = store.state.world.tesoriScoperti?.[treasureId] || 0;

  const box = document.getElementById("detail-modal-box");
  if (!box) return;
  document.getElementById("detail-modal").classList.add("show");

  const badgeText = isArea
    ? `${areaName} · Rarità ${roman(t.rarity)}`
    : `Tesoro Generico · Grado ${roman(t.tier)}`;
  const valText = isArea ? `${t.value}` : `${t.minV}–${t.maxV}`;

  box.innerHTML = `
  <div class="mk mk-modal">
    <div class="mk-modal-cap">${badgeText}</div>
    <div class="mk-modal-title">${t.name}</div>
    ${t.desc ? `<div class="mk-note">${t.desc}</div>` : ""}

    <div class="mk-vitals" style="margin:12px 0;">
      <div class="mk-vital" style="--acc:var(--gold)">
        <div class="mk-vital-cap">Valore Stimato</div>
        <div class="mk-vital-val" style="color:var(--gold-light);display:inline-flex;align-items:center;gap:6px;">${COIN}${valText}</div>
      </div>
      <div class="mk-vital" style="--acc:#4ecca3">
        <div class="mk-vital-cap">Ritrovamenti</div>
        <div class="mk-vital-val" style="color:#4ecca3">×${count}</div>
      </div>
    </div>

    <button class="modal-close-btn" onclick="window.__kaizen.closeDetailModal()">CHIUDI</button>
  </div>`;
  resolveImgs();
}

export function showTrophyDetail(questId) {
  const allQ = [...QUEST_POOL_EVO, ...QUEST_POOL_WORLD];
  const q = allQ.find(x => x.id === questId) ||
    (questId === "day_perfect" ? { text: "Sole Invincibile", desc: "Completa tutte le abitudini in un singolo giorno", target: 1, type: "day" } : null);
  if (!q) return;
  const count = store.state.trophies[questId] || 0;
  const isWorld = QUEST_POOL_WORLD.some(x => x.id === questId);
  const cap = questId === "day_perfect" ? "Trofeo Giornaliero" : isWorld ? "Trofeo del Mondo" : "Trofeo d'Evoluzione";

  const box = document.getElementById("detail-modal-box");
  if (!box) return;
  document.getElementById("detail-modal").classList.add("show");
  box.innerHTML = `
  <div class="mk mk-modal">
    <div class="mk-modal-cap">${cap}</div>
    <div class="mk-modal-title">${q.text}</div>
    <div class="mk-note">${q.desc || ""}</div>

    <div class="mk-vitals" style="margin:12px 0;">
      <div class="mk-vital" style="--acc:#df784b">
        <div class="mk-vital-cap">Volte Conquistato</div>
        <div class="mk-vital-val" style="color:#f6b088">×${count}</div>
      </div>
      <div class="mk-vital" style="--acc:#4ecca3">
        <div class="mk-vital-cap">Soglia Impresa</div>
        <div class="mk-vital-val" style="color:#4ecca3">${q.target || "—"}</div>
      </div>
    </div>

    <button class="modal-close-btn" onclick="window.__kaizen.closeDetailModal()">CHIUDI</button>
  </div>`;
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

  const tiles = poolQ.map((q) => {
    const t    = tracker[q.id] || { progress: 0, completed: false };
    const pct  = q.target > 0 ? Math.min(100, Math.round(t.progress / q.target * 100)) : 0;
    const done = t.completed;
    const acc  = done ? "#4ecca3" : "#df784b";
    return `
    <div class="mk-tile ${done ? "is-active is-marked" : ""}" style="--acc:${acc};">
      <div class="mk-tile-cap">Incarico ${roman(q.n) || q.n}${done ? " · Compiuto" : ""}</div>
      <div class="mk-tile-row-head">
        <span class="mk-tile-name">${q.title}</span>
        <span class="mk-tile-big">${done ? "✦" : `${t.progress}<small>/ ${q.target}</small>`}</span>
      </div>
      <div class="mk-vital-bar mk-dur"><i style="width:${pct}%;background:${acc}"></i></div>
      <div class="mk-tile-desc">${q.desc}</div>
      ${done ? `<div class="mk-chip mk-chip--ok" style="margin:2px 0 0;">✦ Incarico Compiuto</div>` : ""}
    </div>`;
  }).join("");

  const html = `
    <div id="all-quests-overlay" onclick="if(event.target===this)this.remove()"
      style="position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;backdrop-filter:blur(6px);
        display:flex;align-items:center;justify-content:center;padding:16px;">
      <div class="modal-box mk mk-modal" style="max-width:440px;max-height:86vh;display:flex;flex-direction:column;overflow:hidden;border-color:${areaCfg.color}55;">
        <div class="mk-modal-cap">Registro di Regione · ${doneCount}/${poolQ.length} Compiuti (${totalPct}%)</div>
        <div class="mk-modal-title" style="color:${areaCfg.color};text-shadow:0 0 12px ${areaCfg.color}44;">${areaCfg.name}</div>
        <div class="mk-vital-bar" style="--acc:${areaCfg.color};margin:4px 0 14px;"><i style="width:${totalPct}%;background:${areaCfg.color};"></i></div>
        <div style="overflow-y:auto;padding-right:2px;flex:1;">
          <div class="mk-grid mk-grid--1 mk-grid--world-quests">${tiles}</div>
        </div>
        <button class="modal-close-btn" onclick="document.getElementById('all-quests-overlay').remove()">CHIUDI</button>
      </div>
    </div>`;

  document.getElementById("all-quests-overlay")?.remove();
  document.body.insertAdjacentHTML("beforeend", html);
}
