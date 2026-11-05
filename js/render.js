/* ============================================================
 render.js — aggiorna tutto il DOM in base allo stato
 KAIZEN v6.37
 ============================================================ */

import { store, STORAGE_KEY } from "./state.js";
import { syncState } from "./sync.js";
import { getFirebaseConfig, hasCustomFirebaseConfig } from "./firebase-config.js";
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
  try { regenPV(); } catch (e) { console.error("regenPV error:", e); }
  try { regenPA(); } catch (e) { console.error("regenPA error:", e); }

  const state = store.state;
  const w = state?.world || {};
  let heroS = {}, rank = 0, title = "MENDICANTE";
  try {
    heroS = getHeroStats();
    rank = getHeroRank();
    title = getRankTitle(rank);
  } catch (e) {
    console.error("Hero stats error:", e);
  }

  try { renderHabits(state, rank, title); } catch (e) { console.error("renderHabits error:", e); }
  try { renderHero(state, heroS, rank, title); } catch (e) { console.error("renderHero error:", e); }
  try { renderQuests(state); } catch (e) { console.error("renderQuests error:", e); }
  try { renderWorld(heroS, w); } catch (e) { console.error("renderWorld error:", e); }
  try { renderBacheca(state, w); } catch (e) { console.error("renderBacheca error:", e); }
  try { renderShop(); } catch (e) { console.error("renderShop error:", e); }
  try { renderLog(state); } catch (e) { console.error("renderLog error:", e); }
  try { renderSettings(state); } catch (e) { console.error("renderSettings error:", e); }
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

function getZoneExpeditionStyle(colorHex) {
  let c = (colorHex || "#df784b").replace("#", "");
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  // Tonalità leggermente più scura (~30% più scura) e trasparenza
  const dr = Math.round(r * 0.70);
  const dg = Math.round(g * 0.70);
  const db = Math.round(b * 0.70);
  return {
    bg: `radial-gradient(ellipse 80% 100% at 50% 0%, rgba(${dr},${dg},${db},0.32), rgba(${dr},${dg},${db},0.08)), rgba(15,13,10,0.85)`,
    border: `rgba(${r},${g},${b},0.55)`,
    shadow: `inset 0 0 0 3px var(--ink), inset 0 0 0 4px rgba(${dr},${dg},${db},0.24)`,
    titleGlow: `0 0 12px rgba(${dr},${dg},${db},0.55)`,
    drgb: `${dr}, ${dg}, ${db}`,
    rgb: `${r}, ${g}, ${b}`,
  };
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
  const areaSbloccate = wpSafe.areeSbloccate || ["foresta"];
  let areaId  = wpSafe.areaCorrente || "foresta";
  if (!areaSbloccate.includes(areaId)) {
    areaId = areaSbloccate[0] || "foresta";
    wpSafe.areaCorrente = areaId;
  }
  const areaCfg = WORLD_AREAS.find(a => a.id === areaId) || WORLD_AREAS[0];

  /* ── Selettore aree (mostra unicamente le zone sbloccate) ── */
  const unlockedAreas = WORLD_AREAS.filter(a => areaSbloccate.includes(a.id));
  const areaTabs = unlockedAreas.map((a, uIdx) => {
    const origIdx   = WORLD_AREAS.findIndex(x => x.id === a.id);
    const attiva    = a.id === areaId;
    const poolQ     = AREA_QUESTS[a.id] || [];
    const tracker   = wpSafe.missioniPerArea?.[a.id] || {};
    const done      = poolQ.filter(q => tracker[q.id]?.completed).length;
    const total     = poolQ.length;
    const spanFull  = (uIdx === unlockedAreas.length - 1 && unlockedAreas.length % 2 === 1) ? "grid-column:1/-1;" : "";
    return `<button class="mk-tab ${attiva ? "is-on" : ""}" style="${spanFull}${attiva ? `;border-color:${a.color}aa;background:${a.color}18;box-shadow:0 0 10px ${a.color}25;` : ''}"
              onclick="window.__kaizen.setArea('${a.id}')">
      <span style="opacity:0.7;">${roman(origIdx + 1)} ·</span> <span class="mk-tab-zone" style="color:${a.color};font-weight:700;">${a.name}</span> <b>${done}/${total}</b>
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
  const zoneExpStyle = getZoneExpeditionStyle(areaCfg.color);

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
      <button class="mk-expedition" onclick="window.__kaizen.runMission()"
        style="background:${zoneExpStyle.bg};border-color:${zoneExpStyle.border};box-shadow:${zoneExpStyle.shadow};--zone-drgb:${zoneExpStyle.drgb};--zone-rgb:${zoneExpStyle.rgb};">
        <span class="mk-expedition-cap">Esplorazione · <span style="color:${areaCfg.color};font-weight:700;">${areaCfg.name}</span></span>
        <span class="mk-expedition-title" style="text-shadow:${zoneExpStyle.titleGlow};">Invia Spedizione</span>
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
    const entries = Object.entries(state.trophies || {});
    const validEntries = entries
      .filter(([id, count]) => Number(count) > 0)
      .map(([id, count]) => {
        const q = allQuests.find(x => x.id === id) ||
          (id === "day_perfect" ? { text: "Sole Invincibile", desc: "Completa tutte le abitudini in un singolo giorno", target: 1, type: "day", id } : { text: id, id });
        const isWorld = id.startsWith("w") || QUEST_POOL_WORLD.some(x => x.id === id);
        return {
          id,
          count: Number(count),
          q,
          isWorld
        };
      });

    if (!validEntries.length) {
      trophyEl.innerHTML = `<div class="mk" style="grid-column:1/-1;"><div class="mk-empty">Nessun trofeo ancora inciso nella bacheca.</div></div>`;
    } else {
      const evoList = validEntries.filter(x => !x.isWorld);
      const worldList = validEntries.filter(x => x.isWorld);

      // Ordina per quantità vinta decrescente (a parità, alfabetico per nome)
      const sortByCount = (a, b) => (b.count - a.count) || a.q.text.localeCompare(b.q.text);
      evoList.sort(sortByCount);
      worldList.sort(sortByCount);

      const renderTile = (item) => {
        const { id, count, q, isWorld } = item;
        const acc = id === "day_perfect" ? "var(--gold-light)" : isWorld ? "#a78bfa" : "#df784b";
        return `
        <div class="mk-tile" style="--acc:${acc};padding-bottom:12px;cursor:pointer;" onclick="window.__kaizen.showTrophyDetail('${id}')">
          <div class="mk-tile-name">${q.text}</div>
          <div class="mk-tile-big">×${count}</div>
          <div class="mk-tile-desc" style="margin-bottom:0">tocca per consultare</div>
        </div>`;
      };

      const evoCardsHTML = evoList.length
        ? evoList.map(renderTile).join("")
        : `<div class="mk-empty" style="grid-column:1/-1;">Nessun trofeo d'Evoluzione ancora conquistato.</div>`;

      const worldCardsHTML = worldList.length
        ? worldList.map(renderTile).join("")
        : `<div class="mk-empty" style="grid-column:1/-1;">Nessun trofeo del Mondo Esterno ancora conquistato.</div>`;

      trophyEl.innerHTML = `
        <div class="mk-group" style="grid-column:1/-1;margin-top:0;">Evoluzione (${evoList.length})</div>
        ${evoCardsHTML}
        <div class="mk-group" style="grid-column:1/-1;margin-top:20px;">Mondo Esterno (${worldList.length})</div>
        ${worldCardsHTML}
      `;
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
    <div class="mk-modal-title" style="margin:2px 0 4px;">${enemy.name}</div>
    ${enemy.trait ? `<div class="mk-note" style="margin-bottom:6px;">${enemy.trait}</div>` : ""}

    <div style="margin:4px auto 8px;display:flex;justify-content:center;width:100%;max-width:240px;">
      ${enemyImgHTML(enemy, "100%", "auto")}
    </div>

    <div class="mk-vitals mk-vitals--compact" style="margin-bottom:5px;margin-top:4px;">
      <div class="mk-vital" style="--acc:#e0533d"><div class="mk-vital-cap">Forza</div><div class="mk-vital-val" style="color:#e0533d">${enemy.forza}</div></div>
      <div class="mk-vital" style="--acc:#5fb8ec"><div class="mk-vital-cap">Velocità</div><div class="mk-vital-val" style="color:#5fb8ec">${enemy.velocita}</div></div>
      <div class="mk-vital" style="--acc:#3fbf8a"><div class="mk-vital-cap">Destrezza</div><div class="mk-vital-val" style="color:#3fbf8a">${enemy.destrezza}%</div></div>
      <div class="mk-vital" style="--acc:#f0903f"><div class="mk-vital-cap">Critico</div><div class="mk-vital-val" style="color:#f0903f">${enemy.critico}%</div></div>
      <div class="mk-vital" style="--acc:#e0533d;grid-column:1/-1;"><div class="mk-vital-cap">Punti Vita</div><div class="mk-vital-val" style="color:#e0533d">${enemy.costituzione}</div></div>
    </div>

    <div class="mk-vitals mk-vitals--compact" style="margin-top:5px;">
      <div class="mk-vital" style="--acc:#8b7b5c"><div class="mk-vital-cap">Incontri</div><div class="mk-vital-val" style="color:#d4c7b2">${incontri}</div></div>
      <div class="mk-vital" style="--acc:#4ecca3"><div class="mk-vital-cap">Abbattuti</div><div class="mk-vital-val" style="color:#4ecca3">${kills}</div></div>
    </div>

    <button class="modal-close-btn" style="margin-top:10px;padding:10px;min-height:38px;" onclick="window.__kaizen.closeDetailModal()">CHIUDI</button>
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
  const isWorld = questId.startsWith("w") || QUEST_POOL_WORLD.some(x => x.id === questId);
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

export function showRankDetail(title) {
  const rank = getHeroRank();
  let currentTitleIdx = 0;
  rankTitles.forEach((rt, i) => { if (rank >= rt.r) currentTitleIdx = i; });

  const rankIdx = rankTitles.findIndex(x => x.t === title);
  if (rankIdx === -1) return;
  // Solo se già conquistato (raggiunto in passato o attuale)
  if (rankIdx > currentTitleIdx) return;

  const rt = rankTitles[rankIdx];
  const isCurrent = rankIdx === currentTitleIdx;
  const metalCol = titleMetalColors[rt.t] || "var(--gold)";
  const acc = isCurrent ? "var(--gold-light)" : "#4ecca3";
  const statusTxt = isCurrent ? "✦ Titolo Attuale" : "Rango Conquistato";
  const chipCls = isCurrent ? "mk-chip--gold" : "mk-chip--ok";

  const box = document.getElementById("detail-modal-box");
  if (!box) return;

  document.getElementById("detail-modal").classList.add("show");
  box.innerHTML = `
  <div class="mk mk-modal">
    <div class="mk-modal-cap">Albo dei Ranghi · Rango ${rt.r}</div>
    <div class="mk-modal-title" style="color:${isCurrent ? "var(--gold-light)" : metalCol};margin:2px 0 4px;">${rt.t}</div>
    <div class="mk-chip ${chipCls}" style="margin:2px auto 10px;">${statusTxt}</div>

    <div style="margin:6px auto 12px;display:flex;justify-content:center;align-items:center;width:100%;max-width:220px;min-height:180px;">
      ${heroAvatarHTML(rt.t, "100%", "auto")}
    </div>

    <div class="mk-vitals" style="margin:12px 0;">
      <div class="mk-vital" style="--acc:${acc}">
        <div class="mk-vital-cap">Soglia Rango</div>
        <div class="mk-vital-val" style="color:${metalCol}">Rango ${rt.r}</div>
      </div>
      <div class="mk-vital" style="--acc:#4ecca3">
        <div class="mk-vital-cap">Stato</div>
        <div class="mk-vital-val" style="color:#4ecca3">${isCurrent ? "In Carica" : "Conquistato"}</div>
      </div>
    </div>

    <button class="modal-close-btn" style="margin-top:6px;padding:10px;min-height:38px;" onclick="window.__kaizen.closeDetailModal()">CHIUDI</button>
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


/* ── Sincronizzazione e Info in Impostazioni ── */
export function renderSettings(state = store.state) {
  const statusCard = document.getElementById("sync-status-card");
  if (!statusCard) return;

  const st = syncState.status;
  const u = syncState.user;

  let badgeLabel = "Connessione...";
  let dotColor = "#f0b429";
  let accColor = "#df784b";
  let cloudShort = "Connessione";

  if (st === "synced") {
    badgeLabel = "Sincronizzato in tempo reale";
    dotColor = "#4ecca3";
    accColor = "#4ecca3";
    cloudShort = "Attivo";
  } else if (st === "syncing") {
    badgeLabel = "Sincronizzazione in corso...";
    dotColor = "#f0b429";
    accColor = "#f0b429";
    cloudShort = "In corso";
  } else if (st === "offline") {
    badgeLabel = u ? "Offline · Salvataggio locale attivo" : "Sessione locale · Non connesso";
    dotColor = "#c4675d";
    accColor = "#8b7b5c";
    cloudShort = "Locale";
  } else if (st === "error") {
    badgeLabel = "Attenzione · Salvataggio locale attivo";
    dotColor = "#e0533d";
    accColor = "#e0533d";
    cloudShort = "Locale";
  }

  statusCard.style.setProperty("--acc", accColor);

  const dotEl = document.getElementById("sync-status-dot");
  if (dotEl) {
    dotEl.style.background = dotColor;
    dotEl.style.boxShadow = `0 0 8px ${dotColor}`;
  }

  const badgeEl = document.getElementById("sync-status-label");
  if (badgeEl) {
    badgeEl.textContent = badgeLabel;
    badgeEl.style.color = dotColor;
  }

  const acctTitleEl = document.getElementById("sync-account-title");
  const acctSubEl = document.getElementById("sync-account-sub");
  if (acctTitleEl && acctSubEl) {
    if (!u) {
      acctTitleEl.textContent = "Nessun profilo attivo";
      acctSubEl.textContent = "Attiva la sessione rapida o accedi con il tuo account per sincronizzare i progressi.";
    } else if (u.isAnonymous) {
      const shortUid = u.uid.slice(0, 6).toUpperCase();
      acctTitleEl.textContent = `Sessione Rapida · #${shortUid}`;
      acctSubEl.textContent = "Sincronizzazione automatica attiva su questo dispositivo. Collega Google o un'Email per usarla su più dispositivi.";
    } else if (u.providerId === "google.com") {
      acctTitleEl.textContent = u.displayName || u.email || "Account Google";
      acctSubEl.textContent = `Profilo Google collegato${u.email ? ` (${u.email})` : ""} · ID #${u.uid.slice(0, 6).toUpperCase()}`;
    } else {
      acctTitleEl.textContent = u.email || "Account Email";
      acctSubEl.textContent = `Profilo Email collegato · ID #${u.uid.slice(0, 6).toUpperCase()}`;
    }
  }

  const lastSyncEl = document.getElementById("sync-last-time");
  if (lastSyncEl) {
    const ts = syncState.lastSyncAt || state?._updatedAt;
    lastSyncEl.textContent = ts ? `Ultimo salvataggio: ${formatDate(ts)}` : "Ultimo salvataggio: in attesa";
  }

  const errBox = document.getElementById("sync-error-box");
  if (errBox) {
    if (syncState.errorMsg) {
      errBox.style.display = "block";
      errBox.textContent = syncState.errorMsg;
    } else {
      errBox.style.display = "none";
      errBox.textContent = "";
    }
  }

  const btnAnon = document.getElementById("sync-btn-anon");
  const btnForce = document.getElementById("sync-btn-force");
  const btnGoogle = document.getElementById("sync-btn-google");
  const btnEmailToggle = document.getElementById("sync-btn-email-toggle");
  const btnLogout = document.getElementById("sync-btn-logout");

  const isPermanentUser = !!(u && !u.isAnonymous);

  if (btnAnon) btnAnon.style.display = !u ? "inline-flex" : "none";
  if (btnForce) btnForce.style.display = u ? "inline-flex" : "none";
  if (btnGoogle) {
    btnGoogle.style.display = isPermanentUser ? "none" : "inline-flex";
    const gSpan = btnGoogle.querySelector("span");
    if (gSpan) gSpan.textContent = u?.isAnonymous ? "G · Collega Account Google" : "G · Accedi con Google";
  }
  if (btnEmailToggle) {
    btnEmailToggle.style.display = isPermanentUser ? "none" : "inline-flex";
    btnEmailToggle.setAttribute("aria-expanded", String(!!syncState.emailPanelOpen));
    const eSpan = btnEmailToggle.querySelector("span");
    if (eSpan) eSpan.textContent = u?.isAnonymous ? "✉ · Collega o Accedi con Email" : "✉ · Accedi / Registrati con Email";
  }
  if (btnLogout) {
    btnLogout.style.display = isPermanentUser ? "inline-flex" : "none";
  }

  const emailPanel = document.getElementById("sync-email-panel");
  if (emailPanel) {
    emailPanel.style.display = (!isPermanentUser && syncState.emailPanelOpen) ? "block" : "none";
  }

  const tabLogin = document.getElementById("sync-tab-login");
  const tabReg = document.getElementById("sync-tab-register");
  const pwdInput = document.getElementById("sync-password-input");
  const submitBtn = document.getElementById("sync-email-submit-btn");

  const isReg = syncState.emailMode === "register";
  if (tabLogin) tabLogin.classList.toggle("is-on", !isReg);
  if (tabReg) tabReg.classList.toggle("is-on", isReg);
  if (pwdInput) pwdInput.setAttribute("autocomplete", isReg ? "new-password" : "current-password");
  if (submitBtn) {
    submitBtn.textContent = isReg
      ? (u?.isAnonymous ? "Registra e Collega Email" : "Crea Account con Email")
      : "Accedi con Email";
  }

  const projEl = document.getElementById("sync-firebase-project-id");
  if (projEl) {
    const cfg = getFirebaseConfig();
    projEl.textContent = `${cfg.projectId || "—"}${hasCustomFirebaseConfig() ? " (Personalizzato)" : ""}`;
  }

  const memEl = document.getElementById("settings-storage-size");
  if (memEl) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || "";
      const kb = (new Blob([raw]).size / 1024).toFixed(1);
      memEl.textContent = `${kb} KB`;
    } catch {
      memEl.textContent = "—";
    }
  }

  const cloudShortEl = document.getElementById("settings-cloud-short");
  if (cloudShortEl) {
    cloudShortEl.textContent = cloudShort;
    cloudShortEl.style.color = dotColor;
  }
}
