/* ============================================================
 shop.js — Negozio: pozioni, fabbro (costruzione, forgia, riparazioni),
 equipaggiamento a 6 slot e zaino
 KAIZEN v6.85
 ============================================================ */

import { store, save, unlockDiscoveredEquipment } from "./state.js";
import {
  POTIONS, EQUIPMENT_POOL,
  RELICS, AREA_LOOT_POOL, MATERIALS, MATERIAL_COATING_CONFIG,
  calculateCoatingCost, getCoatingBonus, getCoatingWearReduction
} from "./data.js";
import { showToast } from "./ui.js";
import { equipImgWrap, resolveImgs } from "./img.js";
import { getHeroStats } from "./engine.js";
import { getMinsPerPV, getMinsPerPA } from "./world.js";

/* ── Prezzo scontato ── */
export function discountedPrice(base, discountPct) {
  return Math.max(1, Math.round(base * (1 - discountPct / 100)));
}

/* ── Acquisto pozione ── */
export function buyPotion(potId) {
  const potion = POTIONS.find(p => p.id === potId);
  if (!potion) return;
  const state = store.state;
  const w = state.world;
  const heroS = getHeroStats();
  const finalPrice = discountedPrice(potion.prezzo, heroS.shopDiscount);

  if (w.denari < finalPrice) { showToast(`${COIN} insufficienti!`); return; }

  w.denari -= finalPrice;

  if (potion.effect.tipo === "heal") {
    const prima = w.pvAttuali;
    w.pvAttuali = Math.min(heroS.pvMax, w.pvAttuali + potion.effect.val);
    if (w.pvAttuali >= heroS.pvMax) w.ultimaSessionePV = Date.now();
    const gained = w.pvAttuali - prima;
    showToast(`${potion.icon} +${gained} PV ripristinati! (${w.pvAttuali}/${heroS.pvMax})`);
    state.history.unshift({ t:Date.now(), msg:`${potion.icon} ${potion.name}: +${gained} PV (tot. ${w.pvAttuali}/${heroS.pvMax})`, cat:"shop" });
  } else if (potion.effect.tipo === "regen_boost") {
    w.regenBoostExpiry = Date.now() + potion.effect.durata;
    showToast(`${potion.icon} Regen raddoppiata per 24 ore!`);
    state.history.unshift({ t:Date.now(), msg:`${potion.icon} ${potion.name}: regen PV x2 per 24h`, cat:"shop" });
  } else if (potion.effect.tipo === "restore_pa") {
    const { paMax } = getHeroStats();
    const prima = w.paAttuali;
    w.paAttuali = Math.min(paMax, w.paAttuali + potion.effect.val);
    if (w.paAttuali >= paMax) w.ultimaSessionePA = Date.now();
    const gained = w.paAttuali - prima;
    showToast(`${potion.icon} +${gained} Punti Azione! (${w.paAttuali}/${paMax})`);
    state.history.unshift({ t:Date.now(), msg:`${potion.icon} ${potion.name}: +${gained} PA`, cat:"shop" });
  }

  if (state.history.length > 200) state.history = state.history.slice(0,200);
  save();
  if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Costruzione equipaggiamento dal Fabbro (denari + materiali) ── */
export function buyEquipment(equipId) {
  const piece = EQUIPMENT_POOL.find(e => e.id === equipId);
  if (!piece || (!piece.fonte.includes("fabbro") && !piece.fonte.includes("negozio"))) return;
  const state = store.state;
  const eq = state.equipment;
  const heroS = getHeroStats();
  const finalPrice = discountedPrice(piece.prezzo, heroS.shopDiscount);

  if (state.world.denari < finalPrice) {
    showToast(`${COIN} insufficienti!`);
    return;
  }

  const recipe = Array.isArray(piece.recipe) ? piece.recipe : [];
  for (const req of recipe) {
    const owned = eq.zaino.filter(z => z.type === "material" && z.id === req.id).length;
    if (owned < req.qty) {
      const mat = MATERIALS.find(m => m.id === req.id);
      showToast(`Materiali insufficienti: servono ${req.qty}× ${mat ? mat.name : req.id}!`);
      return;
    }
  }

  // Scala denari
  state.world.denari -= finalPrice;

  // Scala materiali richiesti dallo zaino
  for (const req of recipe) {
    let removed = 0;
    for (let i = eq.zaino.length - 1; i >= 0 && removed < req.qty; i--) {
      if (eq.zaino[i].type === "material" && eq.zaino[i].id === req.id) {
        eq.zaino.splice(i, 1);
        removed++;
      }
    }
  }

  eq.zaino.push({ id: piece.id, type: "equip", dur: 100 });
  unlockDiscoveredEquipment(piece.id, state);
  const matSummary = recipe.map(r => {
    const m = MATERIALS.find(x => x.id === r.id);
    return `${r.qty} ${m ? m.name : r.id}`;
  }).join(", ");
  state.history.unshift({
    t: Date.now(),
    msg: `⚒️ Forgiato: ${piece.name} (-${finalPrice} ${COIN}${matSummary ? `, -${matSummary}` : ""}) → zaino`,
    cat: "shop"
  });
  if (state.history.length > 200) state.history = state.history.slice(0,200);
  save();
  showToast(`⚒️ ${piece.name} costruito e aggiunto allo zaino!`);
  if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Equipaggia da zaino (gestisce 1H, 2H, Scudo e 6 slot) ── */
export function equipItem(idx, targetSlot = null) {
  const state = store.state;
  const eq = state.equipment;

  if (idx < 0 || idx >= eq.zaino.length) return;
  const zItem = eq.zaino[idx];

  if (zItem.type !== "equip") { showToast("Non puoi equipaggiare questo oggetto!"); return; }

  const piece = EQUIPMENT_POOL.find(e => e.id === zItem.id);
  if (!piece) return;

  // Determina lo slot di destinazione
  let destSlot = piece.slot;
  if (piece.handType === "2h") {
    destSlot = "mano_dx";
  } else if (piece.handType === "shield") {
    destSlot = "mano_sx";
  } else if (piece.handType === "1h") {
    destSlot = (targetSlot === "mano_sx" || targetSlot === "mano_dx") ? targetSlot : "mano_dx";
  }

  // Rimuovi l'oggetto dallo zaino
  eq.zaino.splice(idx, 1);

  // Se stiamo equipaggiando un'arma a 2 mani ("2h") in mano_dx, libera anche mano_sx
  if (piece.handType === "2h" && eq.equipped.mano_sx) {
    const offOld = eq.equipped.mano_sx;
    eq.zaino.push({
      id: offOld.id,
      type: "equip",
      dur: offOld.dur !== undefined ? offOld.dur : 100,
      ...(offOld.rivestimento ? { rivestimento: offOld.rivestimento } : {}),
    });
    eq.equipped.mano_sx = null;
  }

  // Se stiamo equipaggiando qualcosa in mano_sx mentre in mano_dx c'è un'arma a 2 mani ("2h"), rimuovi l'arma 2H
  if (destSlot === "mano_sx" && eq.equipped.mano_dx) {
    const mainOld = eq.equipped.mano_dx;
    const mainPiece = EQUIPMENT_POOL.find(e => e.id === mainOld.id);
    if (mainPiece && mainPiece.handType === "2h") {
      eq.zaino.push({
        id: mainOld.id,
        type: "equip",
        dur: mainOld.dur !== undefined ? mainOld.dur : 100,
        ...(mainOld.rivestimento ? { rivestimento: mainOld.rivestimento } : {}),
      });
      eq.equipped.mano_dx = null;
    }
  }

  // Sposta eventuale oggetto già presente nello slot di destinazione nello zaino
  const old = eq.equipped[destSlot];
  if (old) {
    eq.zaino.push({
      id: old.id,
      type: "equip",
      dur: old.dur !== undefined ? old.dur : 100,
      ...(old.rivestimento ? { rivestimento: old.rivestimento } : {}),
    });
  }

  eq.equipped[destSlot] = {
    id: piece.id,
    dur: (zItem.dur !== undefined ? zItem.dur : 100),
    ...(zItem.rivestimento ? { rivestimento: zItem.rivestimento } : {}),
  };

  save();
  const slotLabel = SLOT_NAMES[destSlot] || destSlot;
  showToast(`${piece.name} equipaggiato (${slotLabel})!`);
  if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Disequipaggia ── */
export function unequipItem(slot) {
  const eq = store.state.equipment;
  const eqObj = eq.equipped[slot];
  if (!eqObj) return;
  eq.equipped[slot] = null;
  eq.zaino.push({
    id: eqObj.id,
    type: "equip",
    dur: eqObj.dur !== undefined ? eqObj.dur : 100,
    ...(eqObj.rivestimento ? { rivestimento: eqObj.rivestimento } : {}),
  });
  save();
  const piece = EQUIPMENT_POOL.find(e => e.id === eqObj.id);
  showToast(`${piece?.name || "Oggetto"} rimosso da ${SLOT_NAMES[slot] || slot}`);
  if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Scarta/Vendi oggetto ── */
export function discardItem(target) {
  const state = store.state;
  const eq = state.equipment;
  let idx = -1;
  if (typeof target === "number") {
    idx = target;
  } else if (typeof target === "string") {
    idx = eq.zaino.findIndex(z => z.id === target);
  }
  if (idx < 0 || idx >= eq.zaino.length) return;
  const zItem = eq.zaino[idx];
  eq.zaino.splice(idx, 1);

  let refund = 0;
  let name = zItem.id;
  let icon = "";

  if (zItem.type === "equip") {
    const piece = EQUIPMENT_POOL.find(e => e.id === zItem.id);
    if (piece) {
      refund = Math.floor(piece.prezzo * 0.30);
      name = piece.name;
      icon = piece.icon;
    }
  } else if (zItem.type === "relic") {
    const rel = RELICS.find(r => r.id === zItem.id);
    if (rel) { name = rel.name; icon = rel.icon; refund = 5; }
  } else if (zItem.type === "material") {
    const mat = MATERIALS.find(m => m.id === zItem.id);
    if (mat) { name = mat.name; icon = ""; refund = mat.value; }
  } else if (zItem.type === "arealoot") {
    let piece = null;
    for (const pool of Object.values(AREA_LOOT_POOL)) {
      piece = pool.find(i => i.id === zItem.id);
      if (piece) break;
    }
    if (piece) { name = piece.name; icon = "📦"; refund = piece.value; }
  }

  if (refund > 0) state.world.denari += refund;
  save();
  const toastMsg = icon ? `${icon} ${name} venduto${refund > 0 ? ` +${refund} ${COIN}` : ""}` : `${name} venduto (+${refund} ${COIN})`;
  showToast(toastMsg);
  if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Usa reliquia dallo zaino ── */
function getActiveRelics(w) {
  const now = Date.now();
  return (w.reliquieAttive || []).filter(ra =>
    ra && (typeof ra.remaining === "number" ? ra.remaining > 0 : (ra.expiry && now < ra.expiry))
  );
}

export function useRelic(target) {
  if (getActiveRelics(store.state.world).length > 0) {
    showToast("⚠️ Puoi usare solo una reliquia alla volta! Abbandona quella in uso prima di attivarne un'altra.");
    return;
  }
  const state = store.state;
  const w = state.world;
  let idx = -1;
  if (typeof target === "number") {
    idx = target;
  } else if (typeof target === "string") {
    idx = state.equipment.zaino.findIndex(z => z.type === "relic" && z.id === target);
  }
  if (idx < 0 || idx >= state.equipment.zaino.length) return;
  const zItem = state.equipment.zaino[idx];
  if (zItem.type !== "relic") return;

  const rel = RELICS.find(r => r.id === zItem.id);
  if (!rel) return;

  state.equipment.zaino.splice(idx, 1);
  w.reliquieAttive = [{ id: zItem.id, remaining: 5 }];
  save();
  showToast(`${rel.icon} ${rel.name} attivata! ${rel.desc}`);
  if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ══════════════════════════════════════════════════════════
 TENDINE (condivise da Zaino e Mercato)
══════════════════════════════════════════════════════════ */
export function abandonRelic(id) {
  const state = store.state;
  const w = state.world;
  const active = getActiveRelics(w);
  if (!active.length) return;
  const targetRelic = id ? (active.find(ra => ra.id === id) || active[0]) : active[0];
  const rel = RELICS.find(r => r.id === targetRelic.id);
  w.reliquieAttive = [];
  const heroS = getHeroStats();
  if (w.pvAttuali > heroS.pvMax) w.pvAttuali = heroS.pvMax;
  save();
  showToast(rel ? `${rel.icon} ${rel.name} abbandonata e perduta per sempre.` : "Reliquia abbandonata.");
  if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

const zainoOpenCats = new Set();
const mercatoOpenCats = new Set();

/* ── Fabbro: Ripara equipaggiamento ── */
export function repairItem(slot) {
  const state = store.state;
  const eqObj = state.equipment.equipped[slot];
  if (!eqObj) return;
  const dur = eqObj.dur !== undefined ? eqObj.dur : 100;
  if (dur >= 100) { showToast("L'oggetto è già in perfette condizioni!"); return; }

  const piece = EQUIPMENT_POOL.find(e => e.id === eqObj.id);
  if (!piece) return;


  const heroS = getHeroStats();
  const missing = 100 - dur;
  const baseCost = Math.max(1, Math.floor(piece.prezzo * (missing / 100) * 0.3));
  const cost = discountedPrice(baseCost, heroS.shopDiscount);

  if (state.world.denari < cost) { showToast(`${COIN} insufficienti! Costo: ${cost} ${COIN}`); return; }

  state.world.denari -= cost;
  eqObj.dur = 100;

  save();
  showToast(`🛠️ ${piece.name} riparato per ${cost} ${COIN}!`);
  if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ══════════════════════════════════════════════════════════
 HELPER GRAFICI EQUIPAGGIAMENTO, ICONE E COLORI
══════════════════════════════════════════════════════════ */
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const roman = n => ROMAN[n] || String(n);
const fmtDen = n => Math.floor(n).toLocaleString("it-IT");

const STAT_META = {
  attacco:   { lbl:"FOR", acc:"#e0533d" },
  difesa:    { lbl:"DIF", acc:"#3fb0c4" },
  velocita:  { lbl:"VEL", acc:"#5fb8ec" },
  destrezza: { lbl:"DES", acc:"#3fbf8a" },
  critico:   { lbl:"CRI", acc:"#f0903f" },
};

const RARITY_META = {
  comune:      { lbl:"Comune",      color:"#9ca3af" },
  magico:      { lbl:"Magico",      color:"#60a5fa" },
  leggendario: { lbl:"Leggendario", color:"#f59e0b" },
};

const HAND_LABELS = {
  "1h": "Arma 1H",
  "2h": "Arma 2H",
  "shield": "Scudo",
};

const statLbl = k => (STAT_META[k] || { lbl:k.toUpperCase() }).lbl;

function scaleBonusVal(v, dur = 100) {
  return v >= 0 ? Math.ceil(v * (dur / 100)) : v;
}

const bonusLine = (obj, dur = 100) =>
  Object.entries(obj || {})
    .map(([k, v]) => {
      const sv = scaleBonusVal(v, dur);
      return `${sv >= 0 ? "+" : "−"}${Math.abs(sv)} ${statLbl(k)}`;
    })
    .join(" · ");

function bonusBadgesHTML(bonusObj, dur = 100, inline = false) {
  const entries = Object.entries(bonusObj || {});
  if (!entries.length) return "";
  const pills = entries.map(([k, v]) => {
    const sv = scaleBonusVal(v, dur);
    const meta = STAT_META[k] || { lbl: k.toUpperCase(), acc: "#c9a84c" };
    const isNeg = sv < 0;
    const color = isNeg ? "#ef4444" : meta.acc;
    const bg = isNeg ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)";
    const border = isNeg ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.12)";
    const sign = sv >= 0 ? "+" : "−";
    return `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:700;color:${color};background:${bg};border:1px solid ${border};">${sign}${Math.abs(sv)} <small style="font-size:8px;opacity:0.88;">${meta.lbl}</small></span>`;
  }).join("");
  if (inline) return pills;
  return `<div style="display:flex;flex-wrap:wrap;gap:4px;margin:4px 0 6px;">${pills}</div>`;
}

/* ── Colore dell'icona per rarità e fascia di Tier ──
   Comuni:     Bronzo (Tier 1-3), Argento (Tier 4-7), Oro (Tier 8-10)
   Leggendari/Magici: Verde luminoso (Tier 1-3), Blu luminoso (Tier 4-7), Rosso luminoso (Tier 8-10)
── */
function getEquipIconTheme(piece) {
  const tier = piece?.tier || 1;
  const band = tier <= 3 ? "low" : (tier <= 7 ? "mid" : "high");
  const isSpecial = piece?.rarita === "leggendario" || piece?.rarita === "magico";

  if (!isSpecial) {
    if (band === "low") {
      return {
        color: "#cd7f32",
        bg: "rgba(205, 127, 50, 0.13)",
        border: "rgba(205, 127, 50, 0.45)",
        glow: "none",
      };
    }
    if (band === "mid") {
      return {
        color: "#cbd5e1",
        bg: "rgba(203, 213, 225, 0.13)",
        border: "rgba(203, 213, 225, 0.45)",
        glow: "none",
      };
    }
    return {
      color: "#fbbf24",
      bg: "rgba(251, 191, 36, 0.14)",
      border: "rgba(251, 191, 36, 0.50)",
      glow: "drop-shadow(0 0 3px rgba(251, 191, 36, 0.35))",
    };
  }

  // Magici / Leggendari: Verde luminoso, Blu luminoso, Rosso luminoso
  if (band === "low") {
    return {
      color: "#4ade80",
      bg: "rgba(34, 197, 94, 0.15)",
      border: "rgba(74, 222, 128, 0.60)",
      glow: "drop-shadow(0 0 6px rgba(74, 222, 128, 0.80))",
    };
  }
  if (band === "mid") {
    return {
      color: "#38bdf8",
      bg: "rgba(56, 189, 248, 0.15)",
      border: "rgba(56, 189, 248, 0.60)",
      glow: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.80))",
    };
  }
  return {
    color: "#f87171",
    bg: "rgba(239, 68, 68, 0.16)",
    border: "rgba(248, 113, 113, 0.65)",
    glow: "drop-shadow(0 0 7px rgba(248, 113, 113, 0.88))",
  };
}

/* ── Maschera PNG per categoria / tipo impugnatura ── */
function getEquipMaskPath(piece) {
  if (piece.handType === "1h") return "img/equip/arma_1h.png";
  if (piece.handType === "2h") return "img/equip/arma_2h.png";
  if (piece.handType === "shield" || piece.slot === "mano_sx") return "img/equip/scudo.png";
  if (piece.slot === "testa") return "img/equip/testa.png";
  if (piece.slot === "torace") return "img/equip/torace.png";
  if (piece.slot === "braccia") return "img/equip/braccia.png";
  if (piece.slot === "gambe") return "img/equip/gambe.png";
  return "img/equip/arma_1h.png";
}

/* ── Renderizza l'icona dell'equipaggiamento colorata senza alcun riquadro ── */
export function renderEquipIconHTML(piece, titleAttr = "", px = 44) {
  const theme = getEquipIconTheme(piece);
  const maskPath = getEquipMaskPath(piece);
  const title = titleAttr ? ` title="${titleAttr}"` : "";
  const fallback = `<div class="eq-icon" style="--icon-mask:url('${maskPath}');--icon-color:${theme.color};--icon-glow:${theme.glow};width:${px}px;height:${px}px;"${title}></div>`;
  return equipImgWrap(piece, px, fallback);
}

/* ── Costruisce il corpo a 2 colonne della scheda equipaggiamento ──
   - A sinistra: icona colorata per rarità/tier (senza alcun riquadro)
   - A destra:
     1) Nome oggetto
     2) Grado evidente + bonus/malus nominali (100% integrità, senza rivestimento)
     3) Barra di usura con percentuale sulla destra
     4) Eventuale rivestimento e relativi bonus su attributi e resistenza all'usura
── */
function renderEquipCardMainHTML({ piece, dur = 100, coatMat = null, slotKey = null, extraRightTag = "" }) {
  const durColor = dur > 50 ? "#3fbf8a" : (dur > 20 ? "#e3a32b" : "#e0533d");
  const typeLabel = piece.handType ? HAND_LABELS[piece.handType] : (SLOT_NAMES[piece.slot] || piece.slot);
  const rar = RARITY_META[piece.rarita] || RARITY_META.comune;

  let row4HTML = `<span class="eq-coat-none">Nessun rivestimento</span>`;
  if (coatMat) {
    const cBonus = getCoatingBonus(coatMat.id, slotKey || piece.slot, piece);
    const resPct = Math.round(getCoatingWearReduction(coatMat.id) * 100);
    row4HTML = `<div class="eq-coat-line">✦ <b>${coatMat.name}</b> · ${bonusLine(cBonus, 100)} · usura −${resPct}%</div>`;
  }

  return `
  <div class="eq-card-main">
    ${renderEquipIconHTML(piece, `${typeLabel} · ${rar.lbl} (Grado ${roman(piece.tier)})`)}
    <div class="eq-body">
      <div class="eq-row-1">
        <span class="eq-name">${piece.name}</span>
      </div>
      <div class="eq-row-2">
        <span class="eq-grade">${roman(piece.tier)}</span>
        ${bonusBadgesHTML(piece.bonus, 100, true)}
      </div>
      <div class="eq-row-3">
        <div class="eq-dur-track">
          <i class="eq-dur-fill" style="width:${dur}%;background:${durColor}"></i>
        </div>
        <span class="eq-dur-pct" style="color:${durColor}">${dur}%</span>
      </div>
      <div class="eq-row-4">
        ${row4HTML}
      </div>
    </div>
  </div>`;
}

function getPrimaryMeta(piece) {
  const entries = Object.entries(piece.bonus || {});
  const pos = entries.filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const chosen = pos.length ? pos[0][0] : (entries[0]?.[0] || "attacco");
  return STAT_META[chosen] || { lbl: chosen.toUpperCase(), acc: "var(--gold)" };
}

const COIN = `<span class="mk-coin"></span>`;
export const SLOT_NAMES = {
  testa: "Testa",
  torace: "Torace",
  braccia: "Braccia",
  mano_dx: "Mano Destra",
  mano_sx: "Mano Sinistra",
  gambe: "Gambe",
};

export const CATEGORY_ORDER = ["testa", "torace", "braccia", "armi", "scudi", "gambe"];

export function getPieceCategory(p) {
  if (!p) return "altro";
  if (p.handType === "shield") return "scudi";
  if (p.handType === "1h" || p.handType === "2h" || p.slot === "mano_dx") return "armi";
  if (p.slot === "testa") return "testa";
  if (p.slot === "torace") return "torace";
  if (p.slot === "braccia") return "braccia";
  if (p.slot === "gambe") return "gambe";
  if (p.slot === "mano_sx") return "scudi";
  return p.slot || "altro";
}

// Tab attiva della Bottega Costruzione (persiste tra i render)
let armaioloSlot = "armi";

function mkShopHTML(key, num, name, tagline, body) {
  return `
  <details class="mk-shop" data-cat="${key}" ${mercatoOpenCats.has(key) ? "open" : ""}>
    <summary>
      <span class="mk-shop-num">Bottega ${num}</span>
      <span class="mk-shop-name">${name}</span>
      <span class="mk-shop-tag">${tagline}</span>
      <span class="mk-shop-toggle"></span>
    </summary>
    <div class="mk-shop-body">${body}</div>
  </details>`;
}

function mkPriceBtn({ price = 0, base = 0, can = false, onclick = "", label = "", missing = "", variant = "", disabledLabel = "" }) {
  if (disabledLabel) {
    return `<button class="mk-price ${variant}" disabled><span class="mk-price-row">${disabledLabel}</span></button>`;
  }
  const strike = base && base !== price ? `<s>${fmtDen(base)}</s>` : "";
  return `<button class="mk-price ${variant}" ${can ? `onclick="${onclick}"` : "disabled"}>
    <span class="mk-price-row">${label ? `<span class="mk-price-lbl">${label}</span>` : ""}${strike}${COIN}<b>${fmtDen(price)}</b></span>
    ${!can && missing ? `<em>${missing}</em>` : ""}
  </button>`;
}

/* ── Forgia: Rivestimento con materiali ── */
export function openCoatingModal(slot) {
  const state = store.state;
  const eq = state.equipment;
  const w = state.world;
  const heroS = getHeroStats();
  const eqObj = eq.equipped[slot];
  if (!eqObj) { showToast("Nessun oggetto equipaggiato in questo slot!"); return; }
  const piece = EQUIPMENT_POOL.find(e => e.id === eqObj.id);
  if (!piece) return;

  const currentMat = eqObj.rivestimento ? MATERIALS.find(m => m.id === eqObj.rivestimento) : null;

  const box = document.getElementById("detail-modal-box");
  if (!box) return;
  document.getElementById("detail-modal").classList.add("show");

  const tilesHTML = MATERIALS.map(m => {
    const cfg = MATERIAL_COATING_CONFIG[m.id];
    if (!cfg) return "";
    const owned = eq.zaino.filter(z => z.type === "material" && z.id === m.id).length;
    const baseCost = calculateCoatingCost(piece, m);
    const cost = discountedPrice(baseCost, heroS.shopDiscount);
    const hasMat = owned >= cfg.reqQty;
    const hasDen = w.denari >= cost;
    const isCurrent = eqObj.rivestimento === m.id;
    const missing = !hasMat ? `mancano ${cfg.reqQty - owned} pezzi` : `mancano ${fmtDen(cost - w.denari)}`;
    const stateCls = isCurrent ? "is-active" : (hasMat && hasDen ? "" : "is-off");

    return `
    <div class="mk-tile ${stateCls}" style="--acc:#6cc4ef">
      <div class="mk-tile-cap">Rarità ${roman(m.rarity)}</div>
      <div class="mk-tile-name">${m.name}</div>
      <div class="mk-coat">
        <div class="mk-coat-bonus">${bonusLine(getCoatingBonus(m.id, slot, piece))}</div>
        <div class="mk-coat-wear">usura −${Math.round((cfg.durabilityRes || 0) * 100)}%</div>
      </div>
      <div class="mk-chip ${hasMat ? "mk-chip--ok" : "mk-chip--lack"}">${owned} / ${cfg.reqQty} pezzi</div>
      ${isCurrent
        ? mkPriceBtn({ disabledLabel: "in uso", variant: "mk-price--blue" })
        : mkPriceBtn({ price: cost, base: baseCost, can: hasMat && hasDen, onclick: `window.__kaizen.applyCoating('${slot}', '${m.id}')`, missing, variant: "mk-price--blue" })}
    </div>`;
  }).join("");

  const currentHTML = currentMat
    ? `Rivestito in <b>${currentMat.name}</b><br><span class="mk-mono">${bonusLine(getCoatingBonus(currentMat.id, slot, piece))} · usura −${Math.round(getCoatingWearReduction(currentMat.id) * 100)}%</span>`
    : "Nessun rivestimento: il pezzo è ancora grezzo.";

  box.innerHTML = `
  <div class="mk mk-modal">
    <div class="mk-modal-cap">Forgia · ${SLOT_NAMES[slot] || slot} · Grado ${roman(piece.tier)}</div>
    <div class="mk-modal-title">${piece.name}</div>
    <div class="mk-note">${currentHTML}</div>
    <div class="mk-modal-warn">Un nuovo rivestimento sostituisce il precedente</div>
    <div class="mk-modal-list"><div class="mk-grid">${tilesHTML}</div></div>
    <button class="modal-close-btn" onclick="window.__kaizen.closeDetailModal()">CHIUDI</button>
  </div>`;
  resolveImgs();
}

export function applyCoating(slot, matId) {
  const state = store.state;
  const eq = state.equipment;
  const heroS = getHeroStats();
  const eqObj = eq.equipped[slot];
  if (!eqObj) { showToast("Nessun oggetto equipaggiato in questo slot!"); return; }
  const piece = EQUIPMENT_POOL.find(e => e.id === eqObj.id);
  if (!piece) return;
  const mat = MATERIALS.find(m => m.id === matId);
  if (!mat) return;
  const cfg = MATERIAL_COATING_CONFIG[mat.id];
  if (!cfg) return;

  const cost = discountedPrice(calculateCoatingCost(piece, mat), heroS.shopDiscount);
  if (state.world.denari < cost) { showToast(`${COIN} insufficienti! Servono ${cost} ${COIN}`); return; }

  const matchingIndices = [];
  for (let i = 0; i < eq.zaino.length; i++) {
    if (eq.zaino[i].type === "material" && eq.zaino[i].id === mat.id) {
      matchingIndices.push(i);
    }
  }
  if (matchingIndices.length < cfg.reqQty) {
    showToast(`Materiale insufficiente! Servono ${cfg.reqQty} pezzi di ${mat.name}`);
    return;
  }

  state.world.denari -= cost;

  let removed = 0;
  for (let i = eq.zaino.length - 1; i >= 0 && removed < cfg.reqQty; i--) {
    if (eq.zaino[i].type === "material" && eq.zaino[i].id === mat.id) {
      eq.zaino.splice(i, 1);
      removed++;
    }
  }

  eqObj.rivestimento = mat.id;

  state.history.unshift({
    t: Date.now(),
    msg: `Forgiato: ${piece.name} rivestito con ${mat.name} (-${cost} ${COIN}, -${cfg.reqQty} ${mat.name})`,
    cat: "shop"
  });
  if (state.history.length > 200) state.history = state.history.slice(0, 200);

  save();
  showToast(`${piece.name} rivestito con ${mat.name}!`);

  openCoatingModal(slot);

  if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

export function renderShop() {
  const el = document.getElementById("shop-content");
  if (!el) return;

  const state = store.state;
  const w = state.world;
  const eq = state.equipment;
  const heroS = getHeroStats();
  const disc = heroS.shopDiscount;
  const boosted = w.regenBoostExpiry && Date.now() < w.regenBoostExpiry;

  /* ── Borsa ── */
  const purseHTML = `
  <div class="mk-purse">
    <div class="mk-purse-cap">La tua borsa</div>
    <div class="mk-purse-val">${COIN}${fmtDen(w.denari)}</div>
    <div class="mk-purse-sub">${COIN} sonanti</div>
    ${disc > 0 ? `<div class="mk-stamp">Carisma<b>−${Math.round(disc * 100) / 100}%</b></div>` : ""}
  </div>`;

  /* ── I · Erborista ── */
  const potionTile = p => {
    const price = discountedPrice(p.prezzo, disc);
    const can = w.denari >= price;
    const t = p.effect.tipo;
    const active = t === "regen_boost" && boosted;
    const acc = t === "restore_pa" ? "#4a8ee8" : "#d9473f";
    const big = t === "heal"       ? `+${p.effect.val}<small>PV</small>`
              : t === "restore_pa" ? `+${p.effect.val}<small>PA</small>`
              :                      `×2<small>REGEN</small>`;
    const caption = t === "regen_boost" ? "rigenerazione PV per 24 ore" : "effetto immediato";
    return `
    <div class="mk-tile ${active ? "is-active" : (can ? "" : "is-off")}" style="--acc:${acc}">
      <div class="mk-tile-name">${p.name}</div>
      <div class="mk-tile-big">${big}</div>
      <div class="mk-tile-desc">${caption}</div>
      ${active
        ? mkPriceBtn({ disabledLabel: "in corso" })
        : mkPriceBtn({ price, base: p.prezzo, can, onclick: `window.__kaizen.buyPotion('${p.id}')`, missing: `mancano ${fmtDen(price - w.denari)}` })}
    </div>`;
  };
  const pvPotions = POTIONS.filter(p => p.effect.tipo !== "restore_pa");
  const paPotions = POTIONS.filter(p => p.effect.tipo === "restore_pa");
  const pvPct = Math.min(100, (w.pvAttuali / heroS.pvMax) * 100).toFixed(1);
  const paPct = Math.min(100, (w.paAttuali / heroS.paMax) * 100).toFixed(1);

  const erboristaHTML = `
  <div class="mk-vitals">
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
  </div>
  <div class="mk-group">Vitalità</div>
  <div class="mk-grid">${pvPotions.map(potionTile).join("")}</div>
  <div class="mk-group">Energia</div>
  <div class="mk-grid">${paPotions.map(potionTile).join("")}</div>`;

  /* ── II · Fabbro: Costruzione Armi e Armature ── */
  const shopEquip = EQUIPMENT_POOL.filter(e => e.fonte.includes("fabbro") || e.fonte.includes("negozio"));
  const tabDefs = [
    ["testa",   "Testa"],
    ["torace",  "Torace"],
    ["braccia", "Braccia"],
    ["armi",    "Armi"],
    ["scudi",   "Scudi"],
    ["gambe",   "Gambe"],
  ].filter(([cat]) => shopEquip.some(e => getPieceCategory(e) === cat));
  if (armaioloSlot === "mano_dx") armaioloSlot = "armi";
  if (armaioloSlot === "mano_sx") armaioloSlot = "scudi";
  if (!tabDefs.some(([cat]) => cat === armaioloSlot) && tabDefs.length) armaioloSlot = tabDefs[0][0];

  const equippedIds = new Set(Object.values(eq.equipped || {}).filter(Boolean).map(o => typeof o === "string" ? o : o.id));
  const bagCount = id => eq.zaino.filter(z => z.type === "equip" && z.id === id).length;
  const matCount = id => eq.zaino.filter(z => z.type === "material" && z.id === id).length;

  const slotEquipList = shopEquip
    .filter(e => getPieceCategory(e) === armaioloSlot)
    .sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      const handA = a.handType === "2h" ? 2 : (a.handType === "1h" ? 1 : 0);
      const handB = b.handType === "2h" ? 2 : (b.handType === "1h" ? 1 : 0);
      if (handA !== handB) return handA - handB;
      return a.name.localeCompare(b.name);
    });

  const equipTiles = slotEquipList.map(e => {
    const price = discountedPrice(e.prezzo, disc);
    const hasDen = w.denari >= price;
    const recipe = Array.isArray(e.recipe) ? e.recipe : [];
    let hasAllMats = true;
    const matParts = recipe.map(r => {
      const m = MATERIALS.find(x => x.id === r.id);
      const owned = matCount(r.id);
      const ok = owned >= r.qty;
      if (!ok) hasAllMats = false;
      const matColor = ok ? "#4ecca3" : "#d4746a";
      return `<span class="eq-forgia-mat" style="color:${matColor}">${m ? m.name : r.id} ${owned}/${r.qty}</span>`;
    }).join(`<span class="eq-forgia-sep">·</span>`);

    const can = hasDen && hasAllMats;
    const meta = getPrimaryMeta(e);
    const theme = getEquipIconTheme(e);
    const inBag = bagCount(e.id);
    const statusTag = equippedIds.has(e.id)
      ? ` <small style="font-family:'JetBrains Mono',monospace;font-size:8px;color:#4ecca3;letter-spacing:1px;text-transform:uppercase;">· Indossato</small>`
      : (inBag ? ` <small style="font-family:'JetBrains Mono',monospace;font-size:8px;color:#c4b59d;letter-spacing:1px;text-transform:uppercase;">· Zaino ×${inBag}</small>` : "");

    const fullPriceHTML = (e.prezzo && e.prezzo !== price)
      ? `<s class="eq-forgia-fullprice">${fmtDen(e.prezzo)}</s>`
      : "";
    const priceColor = hasDen ? "#f0e6d2" : "#d4746a";

    return `
    <div class="mk-tile eq-card" style="--acc:${meta.acc}">
      <div class="eq-card-main">
        ${renderEquipIconHTML(e, `${e.name} · Grado ${roman(e.tier)}`)}
        <div class="eq-body">
          <div class="eq-row-1">
            <span class="eq-name">${e.name}${statusTag}</span>
            <span class="eq-grade eq-grade--right">${roman(e.tier)}</span>
          </div>
          <div class="eq-row-2">
            ${bonusBadgesHTML(e.bonus, 100, true)}
          </div>
          <div class="eq-fabbro-desc">${e.desc}</div>
        </div>
      </div>
      <button class="eq-forgia-btn" ${can ? `onclick="window.__kaizen.buyEquipment('${e.id}')"` : "disabled"}>
        <div class="eq-forgia-row">
          <span class="eq-forgia-lbl">Forgia</span>
          ${fullPriceHTML}
          <span style="display:inline-flex;align-items:center;gap:4px;color:${priceColor};">${COIN}<b>${fmtDen(price)}</b></span>
          ${matParts ? `<span class="eq-forgia-sep">·</span>${matParts}` : ""}
        </div>
      </button>
    </div>`;
  }).join("");

  const armaioloHTML = `
  <div class="mk-tabs">
    ${tabDefs.map(([cat, lbl]) => `<button class="mk-tab ${cat === armaioloSlot ? "is-on" : ""}" data-armslot="${cat}">${lbl}<b>${shopEquip.filter(e => getPieceCategory(e) === cat).length}</b></button>`).join("")}
  </div>
  <div class="mk-grid mk-grid--1">${equipTiles}</div>`;

  /* ── III · Forgia & Riparazioni ── */
  const eqSlots = ["testa","torace","braccia","mano_dx","mano_sx","gambe"];
  const worn = eqSlots.map(slot => {
    const eqObj = eq.equipped[slot];
    if (!eqObj || typeof eqObj === "string") return null;
    const piece = EQUIPMENT_POOL.find(e => e.id === eqObj.id);
    return piece ? { slot, eqObj, piece, dur: eqObj.dur !== undefined ? eqObj.dur : 100 } : null;
  }).filter(Boolean);

  const forgeTiles = worn.map(({ slot, eqObj, piece }) => {
    const mat = eqObj.rivestimento ? MATERIALS.find(m => m.id === eqObj.rivestimento) : null;
    const coatHTML = mat
      ? `<div class="mk-coat">
           <div class="mk-coat-name">${mat.name}</div>
           <div class="mk-coat-bonus">${bonusLine(getCoatingBonus(mat.id, slot, piece))}</div>
           <div class="mk-coat-wear">usura −${Math.round(getCoatingWearReduction(mat.id) * 100)}%</div>
         </div>`
      : `<div class="mk-tile-desc">ancora grezzo</div>`;
    return `
    <div class="mk-tile ${mat ? "is-coated" : ""}" style="--acc:#6cc4ef">
      <div class="mk-tile-cap">${SLOT_NAMES[slot] || slot} · Grado ${roman(piece.tier)}</div>
      <div class="mk-tile-name">${piece.name}</div>
      ${coatHTML}
      <button class="mk-price mk-price--blue" onclick="window.__kaizen.openCoatingModal('${slot}')">
        <span class="mk-price-row">${mat ? "Cambia rivestimento" : "Rivesti"}</span>
      </button>
    </div>`;
  }).join("");

  const repairTiles = worn.filter(x => x.dur < 100).map(({ slot, piece, dur }) => {
    const baseCost = Math.max(1, Math.floor(piece.prezzo * ((100 - dur) / 100) * 0.3));
    const cost = discountedPrice(baseCost, disc);
    const can = w.denari >= cost;
    const acc = dur > 50 ? "#3fbf8a" : (dur > 20 ? "#e3a32b" : "#e0533d");
    return `
    <div class="mk-tile ${can ? "" : "is-off"}" style="--acc:${acc}">
      <div class="mk-tile-cap">${SLOT_NAMES[slot] || slot}</div>
      <div class="mk-tile-name">${piece.name}</div>
      <div class="mk-tile-big">${dur}<small>%</small></div>
      <div class="mk-vital-bar mk-dur"><i style="width:${dur}%"></i></div>
      ${mkPriceBtn({ price: cost, base: baseCost, can, label: "Ripara", onclick: `window.__kaizen.repairItem('${slot}')`, missing: `mancano ${fmtDen(cost - w.denari)}` })}
    </div>`;
  }).join("");

  const fabbroHTML = `
  <div class="mk-group">Rivestimenti</div>
  <div class="mk-note">Riveste armi e armature con i materiali raccolti: più raro il materiale, più forte il pezzo e più lenta l'usura.</div>
  ${worn.length
    ? `<div class="mk-grid">${forgeTiles}</div>`
    : `<div class="mk-empty">Non indossi nulla da rivestire.</div>`}
  <div class="mk-group">Riparazioni</div>
  ${repairTiles
    ? `<div class="mk-grid">${repairTiles}</div>`
    : `<div class="mk-empty">Tutto in perfetto stato. Torna dopo qualche battaglia.</div>`}`;

  el.innerHTML = `
  <div class="mk">
    ${purseHTML}
    ${mkShopHTML("erborista", "I", "Erborista", "pozioni, tinture e rimedi", erboristaHTML)}
    ${mkShopHTML("armaiolo", "II", "Fabbro · Costruzione", "armi e armature forgiate con materiali", armaioloHTML)}
    ${mkShopHTML("fabbro", "III", "Forgia & Riparazioni", "rivestimenti e manutenzione dotazione", fabbroHTML)}
  </div>`;

  el.querySelectorAll(".mk-shop").forEach(d => {
    d.addEventListener("toggle", () => {
      if (d.open) mercatoOpenCats.add(d.dataset.cat);
      else mercatoOpenCats.delete(d.dataset.cat);
    });
  });
  el.querySelectorAll("[data-armslot]").forEach(b => {
    b.addEventListener("click", () => {
      armaioloSlot = b.dataset.armslot;
      renderShop();
    });
  });
  resolveImgs(el);
}

/* ══════════════════════════════════════════════════════════
 RENDER EQUIPAGGIAMENTO E ZAINO (pagina Eroe)
══════════════════════════════════════════════════════════ */
export function renderEquipment() {
  const el = document.getElementById("equipment-section");
  if (!el) return;

  const eq = store.state.equipment;
  const stats = getHeroStats();

  const slotDefs = [
    { slot:"testa",   label:"Testa",         num:"I",   hint:"elmi, cappucci, copricapi" },
    { slot:"torace",  label:"Torace",        num:"II",  hint:"corazze, cotte di maglia, vesti" },
    { slot:"braccia", label:"Braccia",       num:"III", hint:"bracciali, manopole, guanti d'arme" },
    { slot:"mano_dx", label:"Mano Destra",   num:"IV",  hint:"arma principale (1H o 2H)" },
    { slot:"mano_sx", label:"Mano Sinistra", num:"V",   hint:"scudo o arma secondaria (1H)" },
    { slot:"gambe",   label:"Gambe",         num:"VI",  hint:"gambali, schinieri, stivali" },
  ];

  const dxObj = eq.equipped.mano_dx;
  const dxId = dxObj ? (typeof dxObj === "string" ? dxObj : dxObj.id) : null;
  const dxPiece = dxId ? EQUIPMENT_POOL.find(e => e.id === dxId) : null;
  const isTwoHandedEquipped = dxPiece?.handType === "2h";

  const slotsHTML = slotDefs.map(({ slot, label, num, hint }) => {
    // Se mano_sx è bloccata da un'arma a 2 mani in mano_dx
    if (slot === "mano_sx" && isTwoHandedEquipped) {
      return `
      <div class="mk-tile is-off" style="--acc:#e3a32b;padding-bottom:9px;border-style:dashed;">
        <div class="mk-tile-cap">${label} · Doppia Impugnatura</div>
        <div class="mk-tile-row-head">
          <span class="mk-tile-name" style="color:#d4b46a;">Impegnata da ${dxPiece.name}</span>
          <span class="mk-tile-desc" style="margin:0;">2 Mani</span>
        </div>
        <div class="mk-tile-desc" style="margin-bottom:0;">L'arma impugnata nella mano destra occupa entrambe le mani.</div>
      </div>`;
    }

    const eqObj = eq.equipped[slot];
    const id = eqObj ? (typeof eqObj === "string" ? eqObj : eqObj.id) : null;
    const dur = eqObj ? (typeof eqObj === "string" ? 100 : (eqObj.dur !== undefined ? eqObj.dur : 100)) : 100;
    const piece = id ? EQUIPMENT_POOL.find(e => e.id === id) : null;

    if (!piece) {
      return `
      <div class="mk-tile is-off" style="--acc:rgba(85,74,62,.4);padding-bottom:7px;">
        <div class="mk-tile-cap">${label}</div>
        <div class="mk-tile-row-head">
          <span class="mk-tile-name" style="color:#6f6656;">Nessun pezzo</span>
          <span class="mk-tile-desc" style="margin:0;">${hint}</span>
        </div>
      </div>`;
    }

    const meta = getPrimaryMeta(piece);
    const coatMat = (eqObj && eqObj.rivestimento) ? MATERIALS.find(m => m.id === eqObj.rivestimento) : null;

    return `
    <div class="mk-tile eq-card ${coatMat ? "is-coated" : ""}" style="--acc:${meta.acc}">
      <div class="eq-card-slot-hdr">
        <span>${label}</span>
      </div>
      ${renderEquipCardMainHTML({ piece, dur, coatMat, slotKey: slot })}
      <button class="mk-price mk-price--danger" onclick="window.__kaizen.unequipItem('${slot}')">
        <span class="mk-price-row"><span class="mk-price-lbl">Rimuovi</span></span>
      </button>
    </div>`;
  }).join("");

  const fmtBonusTotal = v => `${v >= 0 ? "+" : "−"}${Math.abs(v)}`;
  const atkTotal = stats.eqBonus.attacco || 0;
  const defTotal = stats.eqBonus.difesa || 0;
  const velTotal = stats.eqBonus.velocita || 0;
  const desTotal = stats.eqBonus.destrezza || 0;
  const criTotal = stats.eqBonus.critico || 0;

  // Reliquie attive
  const now = Date.now();
  const relAttive = getActiveRelics(store.state.world).slice(0, 1);

  let relHTML = "";
  if (relAttive.length > 0) {
    const activeRelTiles = relAttive.map(ra => {
      const rel = RELICS.find(r => r.id === ra.id);
      if (!rel) return "";
      const remaining = typeof ra.remaining === "number" ? ra.remaining : 5;
      return `
      <div class="mk-tile mk-tile--relic is-active" style="--acc:#4ecca3;">
        <div class="mk-tile-cap">Reliquia Attiva · ${remaining} ${remaining === 1 ? "missione rimanente" : "missioni rimanenti"}</div>
        <div class="mk-tile-row-head">
          <span class="mk-tile-name">${rel.name}</span>
        </div>
        <div class="mk-tile-desc">${rel.desc}</div>
        <button class="mk-price mk-price--danger" onclick="window.__kaizen.abandonRelic('${rel.id}')">
          <span class="mk-price-row"><span class="mk-price-lbl">Abbandona</span></span>
        </button>
      </div>`;
    }).join("");
    relHTML = `
    <div class="mk-group">Reliquia in Uso</div>
    <div class="mk-grid mk-grid--1" style="margin-bottom:16px;">${activeRelTiles}</div>`;
  }

  // Zaino
  const zItems = eq.zaino;
  let zainoHTML;
  if (!zItems.length) {
    zainoHTML = `<div class="mk-empty">Lo zaino è vuoto. Esplora il Mondo Esterno per raccogliere bottino.</div>`;
  } else {
    const equipEntries = [];
    const relicMap = new Map();
    const materialMap = new Map();

    zItems.forEach((zItem, idx) => {
      if (zItem.type === "equip") {
        const piece = EQUIPMENT_POOL.find(e => e.id === zItem.id);
        if (!piece) return;
        equipEntries.push({ zItem, idx, piece });
      } else if (zItem.type === "relic") {
        const rel = RELICS.find(r => r.id === zItem.id);
        if (!rel) return;
        if (!relicMap.has(rel.id)) relicMap.set(rel.id, { rel, count: 1 });
        else relicMap.get(rel.id).count++;
      } else if (zItem.type === "material") {
        const mat = MATERIALS.find(m => m.id === zItem.id);
        if (!mat) return;
        if (!materialMap.has(mat.id)) materialMap.set(mat.id, { mat, count: 1 });
        else materialMap.get(mat.id).count++;
      }
    });

    // Ordina prima di tutto per categoria, poi per rango (tier) e infine per nome
    equipEntries.sort((a, b) => {
      const catA = CATEGORY_ORDER.indexOf(getPieceCategory(a.piece));
      const catB = CATEGORY_ORDER.indexOf(getPieceCategory(b.piece));
      const catDiff = (catA === -1 ? 99 : catA) - (catB === -1 ? 99 : catB);
      if (catDiff !== 0) return catDiff;
      if (a.piece.tier !== b.piece.tier) return a.piece.tier - b.piece.tier;
      const handA = a.piece.handType === "2h" ? 2 : (a.piece.handType === "1h" ? 1 : 0);
      const handB = b.piece.handType === "2h" ? 2 : (b.piece.handType === "1h" ? 1 : 0);
      if (handA !== handB) return handA - handB;
      return a.piece.name.localeCompare(b.piece.name);
    });

    const equipHTMLs = equipEntries.map(({ zItem, idx, piece }) => {
      const dur = zItem.dur !== undefined ? zItem.dur : 100;
      const meta = getPrimaryMeta(piece);
      const refund = Math.floor(piece.prezzo * 0.30);
      const coatMat = zItem.rivestimento ? MATERIALS.find(m => m.id === zItem.rivestimento) : null;

      let equipBtnsHTML = "";
      if (piece.handType === "1h") {
        equipBtnsHTML = `
          <button class="eq-btn eq-btn--equip" onclick="window.__kaizen.equipItem(${idx}, 'mano_dx')">Mano DX</button>
          <button class="eq-btn eq-btn--equip" onclick="window.__kaizen.equipItem(${idx}, 'mano_sx')">Mano SX</button>
          <button class="eq-btn eq-btn--sell" onclick="window.__kaizen.discardItem(${idx})">Vendi ${COIN}<b>${fmtDen(refund)}</b></button>
        `;
      } else if (piece.handType === "2h") {
        equipBtnsHTML = `
          <button class="eq-btn eq-btn--equip eq-btn--span2" onclick="window.__kaizen.equipItem(${idx}, 'mano_dx')">Impugna (2 Mani)</button>
          <button class="eq-btn eq-btn--sell" onclick="window.__kaizen.discardItem(${idx})">Vendi ${COIN}<b>${fmtDen(refund)}</b></button>
        `;
      } else if (piece.handType === "shield") {
        equipBtnsHTML = `
          <button class="eq-btn eq-btn--equip eq-btn--span2" onclick="window.__kaizen.equipItem(${idx}, 'mano_sx')">Mano SX (Scudo)</button>
          <button class="eq-btn eq-btn--sell" onclick="window.__kaizen.discardItem(${idx})">Vendi ${COIN}<b>${fmtDen(refund)}</b></button>
        `;
      } else {
        equipBtnsHTML = `
          <button class="eq-btn eq-btn--equip eq-btn--span2" onclick="window.__kaizen.equipItem(${idx})">Indossa (${SLOT_NAMES[piece.slot] || piece.slot})</button>
          <button class="eq-btn eq-btn--sell" onclick="window.__kaizen.discardItem(${idx})">Vendi ${COIN}<b>${fmtDen(refund)}</b></button>
        `;
      }

      return `
      <div class="mk-tile eq-card" style="--acc:${meta.acc}">
        ${renderEquipCardMainHTML({ piece, dur, coatMat, slotKey: piece.slot })}
        <div class="eq-zaino-actions">
          ${equipBtnsHTML}
        </div>
      </div>`;
    });

    const STAT_ORDER = [
      "forza", "difesa", "velocita", "destrezza", "critico", "costituzione",
      "furtivita", "guarigione", "fortuna", "sopravvivenza", "pianificazione", "carisma"
    ];

    const sortedRelics = Array.from(relicMap.values()).sort((a, b) => {
      const orderA = STAT_ORDER.indexOf(a.rel.stat);
      const orderB = STAT_ORDER.indexOf(b.rel.stat);
      const statDiff = (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
      if (statDiff !== 0) return statDiff;
      const bonusDiff = (b.rel.bonus || 0) - (a.rel.bonus || 0);
      if (bonusDiff !== 0) return bonusDiff;
      return a.rel.name.localeCompare(b.rel.name);
    });

    let totalRelicsCount = 0;
    const relicHTMLs = sortedRelics.map(({ rel, count }) => {
      totalRelicsCount += count;
      const refund = 5;
      return `
      <div class="mk-tile mk-tile--relic" style="--acc:#a78bfa">
        <div class="mk-tile-row-head">
          <span class="mk-tile-name">${rel.name}</span>
          <span class="mk-tile-big">x${count}</span>
        </div>
        <div class="mk-tile-desc">${rel.desc}</div>
        <div class="mk-split-actions">
          <button class="mk-act mk-act--gold" style="${relAttive.length > 0 ? 'opacity:.45;' : ''}" onclick="window.__kaizen.useRelic('${rel.id}')">Usa</button>
          <button class="mk-act mk-act--no" onclick="window.__kaizen.discardItem('${rel.id}')">Vendi ${COIN}<b>${refund}</b></button>
        </div>
      </div>`;
    });

    const sortedMaterials = Array.from(materialMap.values()).sort((a, b) => {
      if (a.mat.rarity !== b.mat.rarity) return a.mat.rarity - b.mat.rarity;
      if (a.mat.value !== b.mat.value) return a.mat.value - b.mat.value;
      return a.mat.name.localeCompare(b.mat.name);
    });

    let totalMaterialsCount = 0;
    const materialHTMLs = sortedMaterials.map(({ mat, count }) => {
      totalMaterialsCount += count;
      return `
      <div class="mk-tile" style="--acc:#6cc4ef">
        <div class="mk-tile-cap">Rarità ${roman(mat.rarity)}</div>
        <div class="mk-tile-row-head">
          <span class="mk-tile-name">${mat.name}</span>
          <span class="mk-tile-big">x${count}</span>
        </div>
        <div class="mk-tile-desc">${mat.desc}</div>
        <button class="mk-price" onclick="window.__kaizen.discardItem('${mat.id}')">
          <span class="mk-price-row"><span class="mk-price-lbl">Vendi</span>${COIN}<b>${fmtDen(mat.value)}</b></span>
        </button>
      </div>`;
    });

    const makeZainoSection = (key, title, subtitle, htmls, countOverride) => {
      if (!htmls.length) return "";
      const count = countOverride !== undefined ? countOverride : htmls.length;
      return `
      <details class="mk-shop mk-shop--zaino" data-cat="${key}" ${zainoOpenCats.has(key) ? "open" : ""}>
        <summary class="mk-shop-summary--zaino">
          <div class="mk-shop-zaino-info">
            <div class="mk-shop-zaino-row">
              <span class="mk-shop-zaino-title">${title}</span>
              <span class="mk-shop-zaino-count">${count} ${count === 1 ? "oggetto" : "oggetti"}</span>
            </div>
            <span class="mk-shop-zaino-tag">${subtitle}</span>
          </div>
          <span class="mk-shop-toggle"></span>
        </summary>
        <div class="mk-shop-body mk-shop-body--zaino">
          <div class="mk-grid mk-grid--1 mk-grid--zaino">${htmls.join("")}</div>
        </div>
      </details>`;
    };

    zainoHTML =
      makeZainoSection("material", "Materiali", "minerali e risorse per la forgia", materialHTMLs, totalMaterialsCount) +
      makeZainoSection("relic", "Reliquie", "manufatti arcani ad uso temporaneo", relicHTMLs, totalRelicsCount) +
      makeZainoSection("equip", "Equipaggiamento", "armi, scudi e armature di riserva", equipHTMLs, equipHTMLs.length);
  }

  el.innerHTML = `
  <div class="mk">
    <div class="mk-vitals" style="grid-template-columns:repeat(5,1fr);margin-top:0;margin-bottom:14px;">
      <div class="mk-vital" style="--acc:#e0533d">
        <div class="mk-vital-cap" title="Forza">FOR</div>
        <div class="mk-vital-val" style="color:${atkTotal < 0 ? '#ef4444' : '#e0533d'}">${fmtBonusTotal(atkTotal)}</div>
      </div>
      <div class="mk-vital" style="--acc:#3fb0c4">
        <div class="mk-vital-cap" title="Difesa">DIF</div>
        <div class="mk-vital-val" style="color:${defTotal < 0 ? '#ef4444' : '#3fb0c4'}">${fmtBonusTotal(defTotal)}</div>
      </div>
      <div class="mk-vital" style="--acc:#5fb8ec">
        <div class="mk-vital-cap" title="Velocità">VEL</div>
        <div class="mk-vital-val" style="color:${velTotal < 0 ? '#ef4444' : '#5fb8ec'}">${fmtBonusTotal(velTotal)}</div>
      </div>
      <div class="mk-vital" style="--acc:#3fbf8a">
        <div class="mk-vital-cap" title="Destrezza">DES</div>
        <div class="mk-vital-val" style="color:${desTotal < 0 ? '#ef4444' : '#3fbf8a'}">${fmtBonusTotal(desTotal)}</div>
      </div>
      <div class="mk-vital" style="--acc:#f0903f">
        <div class="mk-vital-cap" title="Critico">CRI</div>
        <div class="mk-vital-val" style="color:${criTotal < 0 ? '#ef4444' : '#f0903f'}">${fmtBonusTotal(criTotal)}</div>
      </div>
    </div>

    <div class="mk-group">Dotazione Indossata (6 Slot)</div>
    <div class="mk-grid mk-grid--1">${slotsHTML}</div>

    ${relHTML}

    <div class="section-header zaino-main-header">Zaino</div>
    ${zainoHTML}
  </div>`;

  el.querySelectorAll(".mk-shop").forEach(d => {
    d.addEventListener("toggle", () => {
      if (d.open) zainoOpenCats.add(d.dataset.cat);
      else zainoOpenCats.delete(d.dataset.cat);
    });
  });
  resolveImgs(el);
}
