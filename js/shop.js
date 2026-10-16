/* ============================================================
 shop.js — Negozio: pozioni, equipaggiamento, reliquie
 KAIZEN v6.0
 ============================================================ */

import { store, save } from "./state.js";
import { POTIONS, EQUIPMENT_POOL,
 RELICS, AREA_LOOT_POOL, MATERIALS, MATERIAL_COATING_CONFIG, calculateCoatingCost, getCoatingBonus, getCoatingWearReduction } from "./data.js";
import { showToast } from "./ui.js";
import { resolveImgs } from "./img.js";
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

 if (w.denari < finalPrice) { showToast("🪙 Denari insufficienti!"); return; }

 w.denari -= finalPrice;

 if (potion.effect.tipo === "heal") {
 const prima = w.pvAttuali;
 w.pvAttuali = Math.min(heroS.pvMax, w.pvAttuali + potion.effect.val);
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
 const gained = w.paAttuali - prima;
 showToast(`${potion.icon} +${gained} Punti Azione! (${w.paAttuali}/${paMax})`);
 state.history.unshift({ t:Date.now(), msg:`${potion.icon} ${potion.name}: +${gained} PA`, cat:"shop" });
 }

 if (state.history.length > 200) state.history = state.history.slice(0,200);
 save();
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Acquisto equipaggiamento ── */
export function buyEquipment(equipId) {
 const piece = EQUIPMENT_POOL.find(e => e.id === equipId);
 if (!piece || !piece.fonte.includes("negozio")) return;
 const state = store.state;
 const heroS = getHeroStats();
 const finalPrice = discountedPrice(piece.prezzo, heroS.shopDiscount);

 if (state.world.denari < finalPrice) { showToast("🪙 Denari insufficienti!"); return; }

 state.world.denari -= finalPrice;
 state.equipment.zaino.push({ id:piece.id, type:"equip", dur:100 });
 state.history.unshift({ t:Date.now(), msg:` Acquistato: ${piece.icon} ${piece.name} → zaino`, cat:"shop" });
 if (state.history.length > 200) state.history = state.history.slice(0,200);
 save();
 showToast(`${piece.icon} ${piece.name} → zaino!`);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Equipaggia da zaino ── */
export function equipItem(idx) {
 const state = store.state;
 const eq = state.equipment;

 if (idx < 0 || idx >= eq.zaino.length) return;
 const zItem = eq.zaino[idx];

 if (zItem.type !== "equip") { showToast("Non puoi equipaggiare questo oggetto!"); return; }

 const piece = EQUIPMENT_POOL.find(e => e.id === zItem.id);
 if (!piece) return;

 eq.zaino.splice(idx, 1);

 const old = eq.equipped[piece.slot];
 if (old) eq.zaino.push({ id:old.id, type:"equip", dur:old.dur, rivestimento:old.rivestimento });
 eq.equipped[piece.slot] = { id:piece.id, dur:(zItem.dur !== undefined ? zItem.dur : 100), rivestimento:zItem.rivestimento };

 save();
 showToast(`${piece.icon} ${piece.name} equipaggiato!`);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Disequipaggia ── */
export function unequipItem(slot) {
 const eq = store.state.equipment;
 const eqObj = eq.equipped[slot];
 if (!eqObj) return;
 eq.equipped[slot] = null;
 eq.zaino.push({ id:eqObj.id, type:"equip", dur:eqObj.dur, rivestimento:eqObj.rivestimento });
 save();
 const piece = EQUIPMENT_POOL.find(e => e.id === eqObj.id);
 showToast(`${piece?.icon||""} Rimosso da ${slot}`);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Scarta oggetto ── */
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
 const toastMsg = icon ? `${icon} ${name} scartato${refund > 0 ? ` +${refund} 🪙` : ""}` : `${name} venduto (+${refund} denari)`;
 showToast(toastMsg);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Usa reliquia dallo zaino ── */
export function useRelic(target) {
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
 // Attiva reliquia (sostituisce eventuale della stessa stat)
 w.reliquieAttive = (w.reliquieAttive||[]).filter(ra =>
 Date.now() < ra.expiry && ra.id !== zItem.id
 );
 w.reliquieAttive.push({ id: zItem.id, expiry: Date.now() + 24 * 3600 * 1000 });
 save();
 showToast(`${rel.icon} ${rel.name} attivata! ${rel.desc}`);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ══════════════════════════════════════════════════════════
 TENDINE (condivise da Zaino e Mercato)
 Chiuse all'avvio; lo stato aperto viene ricordato per la sessione
 così non si richiudono quando la pagina viene ridisegnata.
══════════════════════════════════════════════════════════ */
const zainoOpenCats = new Set();
const mercatoOpenCats = new Set();

function dropdownHTML(openSet, key, title, count, bodyHTML) {
 const countHTML = count != null ? `<span class="zaino-cat-count">${count}</span>` : "";
 return `
 <details class="zaino-details" data-cat="${key}" ${openSet.has(key) ? "open" : ""}>
 <summary>
 <span class="zaino-cat-title">${title}</span>
 ${countHTML}
 <span class="zaino-cat-chevron"></span>
 </summary>
 ${bodyHTML}
 </details>`;
}

function bindDropdownState(container, openSet) {
 container.querySelectorAll(".zaino-details").forEach(d => {
 d.addEventListener("toggle", () => {
 if (d.open) openSet.add(d.dataset.cat);
 else openSet.delete(d.dataset.cat);
 });
 });
}


/* ── Fabbro: Ripara equipaggiamento ── */
export function repairItem(slot) {
 const state = store.state;
 const eqObj = state.equipment.equipped[slot];
 if (!eqObj) return;
 const dur = eqObj.dur !== undefined ? eqObj.dur : 100;
 if (dur >= 100) { showToast("L'oggetto è già in perfette condizioni!"); return; }

 const piece = EQUIPMENT_POOL.find(e => e.id === eqObj.id);
 if (!piece) return;

 const missing = 100 - dur;
 const cost = Math.max(1, Math.floor(piece.prezzo * (missing / 100) * 0.3));

 if (state.world.denari < cost) { showToast(`🪙 Denari insufficienti! Costo: ${cost}`); return; }

 state.world.denari -= cost;
 eqObj.dur = 100;

 save();
 showToast(`🛠️ ${piece.name} riparato per ${cost} 🪙!`);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ══════════════════════════════════════════════════════════
 RENDER MERCATO
══════════════════════════════════════════════════════════ */

/* ── Mercato: helper grafici ── */
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const roman = n => ROMAN[n] || String(n);
const fmtDen = n => Math.floor(n).toLocaleString("it-IT");
const STAT_META = {
  attacco:  { lbl:"ATK", acc:"#e0533d" },
  difesa:   { lbl:"DEF", acc:"#3fb0c4" },
  velocita: { lbl:"VEL", acc:"#5fb8ec" },
  critico:  { lbl:"CRI", acc:"#f0903f" },
};
const statLbl = k => (STAT_META[k] || { lbl:k }).lbl;
const bonusLine = obj => Object.entries(obj || {}).map(([k, v]) => `+${v} ${statLbl(k)}`).join(" · ");
const COIN = `<span class="mk-coin"></span>`;
const SLOT_NAMES = { arma:"Arma", elmo:"Elmo", scudo:"Scudo", corazza:"Corazza", gambali:"Gambali", bracciali:"Bracciali" };

// Tab attiva dell'Armaiolo (persiste tra i render)
let armaioloSlot = "arma";

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
    const cost = discountedPrice(calculateCoatingCost(piece, m), heroS.shopDiscount);
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
        <div class="mk-coat-bonus">${bonusLine(getCoatingBonus(m.id, slot))}</div>
        <div class="mk-coat-wear">usura −${Math.round((cfg.durabilityRes || 0) * 100)}%</div>
      </div>
      <div class="mk-chip ${hasMat ? "mk-chip--ok" : "mk-chip--lack"}">${owned} / ${cfg.reqQty} pezzi</div>
      ${isCurrent
        ? mkPriceBtn({ disabledLabel: "in uso", variant: "mk-price--blue" })
        : mkPriceBtn({ price: cost, can: hasMat && hasDen, onclick: `window.__kaizen.applyCoating('${slot}', '${m.id}')`, missing, variant: "mk-price--blue" })}
    </div>`;
  }).join("");

  const currentHTML = currentMat
    ? `Rivestito in <b>${currentMat.name}</b><br><span class="mk-mono">${bonusLine(getCoatingBonus(currentMat.id, slot))} · usura −${Math.round(getCoatingWearReduction(currentMat.id) * 100)}%</span>`
    : "Nessun rivestimento: il pezzo è ancora grezzo.";

  box.innerHTML = `
  <div class="mk mk-modal">
    <div class="mk-modal-cap">Forgia · ${SLOT_NAMES[slot]} · Grado ${roman(piece.tier)}</div>
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
  if (state.world.denari < cost) { showToast(`Denari insufficienti! Servono ${cost} denari`); return; }

  // Check material quantity in backpack
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

  // Deduct denari
  state.world.denari -= cost;

  // Deduct materials from backpack
  let removed = 0;
  for (let i = eq.zaino.length - 1; i >= 0 && removed < cfg.reqQty; i--) {
    if (eq.zaino[i].type === "material" && eq.zaino[i].id === mat.id) {
      eq.zaino.splice(i, 1);
      removed++;
    }
  }

  // Overwrite previous coating
  eqObj.rivestimento = mat.id;

  state.history.unshift({
    t: Date.now(),
    msg: `Forgiato: ${piece.name} rivestito con ${mat.name} (-${cost} den, -${cfg.reqQty} ${mat.name})`,
    cat: "shop"
  });
  if (state.history.length > 200) state.history = state.history.slice(0, 200);

  save();
  showToast(`${piece.name} rivestito con ${mat.name}!`);

  // Re-render modal if still open
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
    <div class="mk-purse-sub">denari sonanti</div>
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

  /* ── II · Armaiolo ── */
  const shopEquip = EQUIPMENT_POOL.filter(e => e.fonte.includes("negozio"));
  const tabDefs = [
    ["arma","Armi"], ["elmo","Elmi"], ["scudo","Scudi"],
    ["corazza","Corazze"], ["gambali","Gambali"], ["bracciali","Bracciali"],
  ].filter(([s]) => shopEquip.some(e => e.slot === s));
  if (!tabDefs.some(([s]) => s === armaioloSlot) && tabDefs.length) armaioloSlot = tabDefs[0][0];

  const equippedIds = new Set(Object.values(eq.equipped || {}).filter(Boolean).map(o => typeof o === "string" ? o : o.id));
  const bagCount = id => eq.zaino.filter(z => z.type === "equip" && z.id === id).length;

  const equipTiles = shopEquip.filter(e => e.slot === armaioloSlot).map(e => {
    const price = discountedPrice(e.prezzo, disc);
    const can = w.denari >= price;
    const [bStat, bVal] = Object.entries(e.bonus)[0];
    const meta = STAT_META[bStat] || { lbl: bStat, acc: "var(--gold)" };
    const inBag = bagCount(e.id);
    const chip = equippedIds.has(e.id)
      ? `<div class="mk-chip mk-chip--ok">indossato</div>`
      : inBag ? `<div class="mk-chip">nello zaino${inBag > 1 ? ` ×${inBag}` : ""}</div>` : "";
    return `
    <div class="mk-tile ${can ? "" : "is-off"}" style="--acc:${meta.acc}">
      <div class="mk-tile-cap">Grado ${roman(e.tier)}</div>
      <div class="mk-tile-name">${e.name}</div>
      <div class="mk-tile-big">+${bVal}<small>${meta.lbl}</small></div>
      <div class="mk-tile-desc">${e.desc}</div>
      ${chip}
      ${mkPriceBtn({ price, base: e.prezzo, can, onclick: `window.__kaizen.buyEquipment('${e.id}')`, missing: `mancano ${fmtDen(price - w.denari)}` })}
    </div>`;
  }).join("");

  const armaioloHTML = `
  <div class="mk-tabs">
    ${tabDefs.map(([s, lbl]) => `<button class="mk-tab ${s === armaioloSlot ? "is-on" : ""}" data-armslot="${s}">${lbl}<b>${shopEquip.filter(e => e.slot === s).length}</b></button>`).join("")}
  </div>
  <div class="mk-note">Gli acquisti finiscono nello zaino</div>
  <div class="mk-grid">${equipTiles}</div>`;

  /* ── III · Fabbro ── */
  const eqSlots = ["arma","elmo","scudo","corazza","gambali","bracciali"];
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
           <div class="mk-coat-bonus">${bonusLine(getCoatingBonus(mat.id, slot))}</div>
           <div class="mk-coat-wear">usura −${Math.round(getCoatingWearReduction(mat.id) * 100)}%</div>
         </div>`
      : `<div class="mk-tile-desc">ancora grezzo</div>`;
    return `
    <div class="mk-tile ${mat ? "is-coated" : ""}" style="--acc:#6cc4ef">
      <div class="mk-tile-cap">${SLOT_NAMES[slot]} · ${roman(piece.tier)}</div>
      <div class="mk-tile-name">${piece.name}</div>
      ${coatHTML}
      <button class="mk-price mk-price--blue" onclick="window.__kaizen.openCoatingModal('${slot}')">
        <span class="mk-price-row">${mat ? "Cambia rivestimento" : "Rivesti"}</span>
      </button>
    </div>`;
  }).join("");

  const repairTiles = worn.filter(x => x.dur < 100).map(({ slot, piece, dur }) => {
    const cost = Math.max(1, Math.floor(piece.prezzo * ((100 - dur) / 100) * 0.3));
    const can = w.denari >= cost;
    const acc = dur > 50 ? "#3fbf8a" : (dur > 20 ? "#e3a32b" : "#e0533d");
    return `
    <div class="mk-tile ${can ? "" : "is-off"}" style="--acc:${acc}">
      <div class="mk-tile-cap">${SLOT_NAMES[slot]}</div>
      <div class="mk-tile-name">${piece.name}</div>
      <div class="mk-tile-big">${dur}<small>%</small></div>
      <div class="mk-vital-bar mk-dur"><i style="width:${dur}%"></i></div>
      ${mkPriceBtn({ price: cost, can, label: "Ripara", onclick: `window.__kaizen.repairItem('${slot}')`, missing: `mancano ${fmtDen(cost - w.denari)}` })}
    </div>`;
  }).join("");

  const fabbroHTML = `
  <div class="mk-group">Forgia</div>
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
    ${mkShopHTML("armaiolo", "II", "Armaiolo", "lame e corazze su misura", armaioloHTML)}
    ${mkShopHTML("fabbro", "III", "Fabbro", "forgia e riparazioni", fabbroHTML)}
  </div>`;

  // Stato aperto/chiuso delle botteghe
  el.querySelectorAll(".mk-shop").forEach(d => {
    d.addEventListener("toggle", () => {
      if (d.open) mercatoOpenCats.add(d.dataset.cat);
      else mercatoOpenCats.delete(d.dataset.cat);
    });
  });
  // Tab dell'Armaiolo
  el.querySelectorAll("[data-armslot]").forEach(b => {
    b.addEventListener("click", () => {
      armaioloSlot = b.dataset.armslot;
      renderShop();
    });
  });
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
    { slot:"arma",      label:"Arma",      num:"I" },
    { slot:"elmo",      label:"Elmo",      num:"II" },
    { slot:"scudo",     label:"Scudo",     num:"III" },
    { slot:"corazza",   label:"Corazza",   num:"IV" },
    { slot:"gambali",   label:"Gambali",   num:"V" },
    { slot:"bracciali", label:"Bracciali", num:"VI" },
  ];

  const slotsHTML = slotDefs.map(({ slot, label, num }) => {
    const eqObj = eq.equipped[slot];
    const id = eqObj ? (typeof eqObj === "string" ? eqObj : eqObj.id) : null;
    const dur = eqObj ? (typeof eqObj === "string" ? 100 : (eqObj.dur !== undefined ? eqObj.dur : 100)) : 100;
    const piece = id ? EQUIPMENT_POOL.find(e => e.id === id) : null;

    if (!piece) {
      return `
      <div class="mk-tile is-off" style="--acc:rgba(212,160,23,.25);padding-bottom:14px;">
        <div class="mk-tile-cap">Slot ${num} · ${label}</div>
        <div class="mk-tile-name" style="min-height:1.8em;color:#6f6656;">Nessun pezzo</div>
        <div class="mk-tile-desc" style="margin-bottom:0;">slot vuoto</div>
      </div>`;
    }

    const bStat = Object.keys(piece.bonus)[0];
    const originalVal = Object.values(piece.bonus)[0] || 0;
    const bVal = Math.ceil(originalVal * (dur / 100));
    const meta = STAT_META[bStat] || { lbl: bStat, acc: "var(--gold)" };
    const durColor = dur > 50 ? "#3fbf8a" : (dur > 20 ? "#e3a32b" : "#e0533d");

    let coatHTML = "";
    if (eqObj && eqObj.rivestimento) {
      const mat = MATERIALS.find(m => m.id === eqObj.rivestimento);
      if (mat) {
        const bObj = getCoatingBonus(mat.id, slot);
        const resPct = Math.round(getCoatingWearReduction(mat.id) * 100);
        coatHTML = `
        <div class="mk-coat">
          <div class="mk-coat-name">✦ ${mat.name}</div>
          <div class="mk-coat-bonus">${bonusLine(bObj)}</div>
          <div class="mk-coat-wear">usura −${resPct}%</div>
        </div>`;
      }
    }

    return `
    <div class="mk-tile ${eqObj?.rivestimento ? "is-coated" : ""}" style="--acc:${meta.acc}">
      <div class="mk-tile-cap">${label} · Grado ${roman(piece.tier)}</div>
      <div class="mk-tile-name">${piece.name}</div>
      <div class="mk-tile-big">+${bVal}<small>${meta.lbl}</small></div>
      <div class="mk-vital-bar mk-dur"><i style="width:${dur}%;background:${durColor}"></i></div>
      ${coatHTML}
      <div class="mk-tile-desc">${piece.desc}</div>
      <button class="mk-price mk-price--danger" onclick="window.__kaizen.unequipItem('${slot}')">
        <span class="mk-price-row"><span class="mk-price-lbl">Rimuovi</span></span>
      </button>
    </div>`;
  }).join("");

  const atkTotal = stats.eqBonus.attacco || 0;
  const defTotal = stats.eqBonus.difesa || 0;
  const velTotal = stats.eqBonus.velocita || 0;
  const criTotal = stats.eqBonus.critico || 0;

  // Reliquie attive
  const now = Date.now();
  const relAttive = (store.state.world.reliquieAttive || []).filter(ra => now < ra.expiry);

  let relHTML = "";
  if (relAttive.length > 0) {
    const activeRelTiles = relAttive.map(ra => {
      const rel = RELICS.find(r => r.id === ra.id);
      if (!rel) return "";
      const remaining = Math.ceil((ra.expiry - now) / 3600000);
      return `
      <div class="mk-tile is-active" style="--acc:#4ecca3;padding-bottom:12px;">
        <div class="mk-tile-cap">Reliquia Attiva</div>
        <div class="mk-tile-name">${rel.name}</div>
        <div class="mk-tile-desc">${rel.desc}</div>
        <div class="mk-chip mk-chip--ok" style="margin-bottom:0;">${remaining}h rimanenti</div>
      </div>`;
    }).join("");
    relHTML = `
    <div class="mk-group">Reliquie Attive</div>
    <div class="mk-grid mk-grid--1" style="margin-bottom:16px;">${activeRelTiles}</div>`;
  }

  // Zaino
  const zItems = eq.zaino;
  let zainoHTML;
  if (!zItems.length) {
    zainoHTML = `<div class="mk-empty">Lo zaino è vuoto. Esplora il Mondo Esterno per raccogliere bottino.</div>`;
  } else {
    let equipHTMLs = [];
    const relicMap = new Map();
    const materialMap = new Map();

    zItems.forEach((zItem, idx) => {
      if (zItem.type === "equip") {
        const piece = EQUIPMENT_POOL.find(e => e.id === zItem.id);
        if (!piece) return;
        const dur = zItem.dur !== undefined ? zItem.dur : 100;
        const bStat = Object.keys(piece.bonus)[0];
        const bVal = Math.ceil(Object.values(piece.bonus)[0] * (dur / 100));
        const meta = STAT_META[bStat] || { lbl: bStat, acc: "var(--gold)" };
        const refund = Math.floor(piece.prezzo * 0.30);
        const durColor = dur > 50 ? "#3fbf8a" : (dur > 20 ? "#e3a32b" : "#e0533d");
        const coatMat = zItem.rivestimento ? MATERIALS.find(m => m.id === zItem.rivestimento) : null;

        equipHTMLs.push(`
        <div class="mk-tile" style="--acc:${meta.acc}">
          <div class="mk-tile-cap">${SLOT_NAMES[piece.slot] || piece.slot} · Grado ${roman(piece.tier)}</div>
          <div class="mk-tile-name">${piece.name}</div>
          <div class="mk-tile-big">+${bVal}<small>${meta.lbl}</small></div>
          <div class="mk-vital-bar mk-dur"><i style="width:${dur}%;background:${durColor}"></i></div>
          ${coatMat ? `<div class="mk-chip" style="color:#6cc4ef;border-color:rgba(108,196,239,.35);">✦ ${coatMat.name}</div>` : ""}
          <div class="mk-split-actions">
            <button class="mk-act mk-act--ok" onclick="window.__kaizen.equipItem(${idx})">Indossa</button>
            <button class="mk-act mk-act--no" onclick="window.__kaizen.discardItem(${idx})">Vendi ${COIN}<b>${fmtDen(refund)}</b></button>
          </div>
        </div>`);
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
      <div class="mk-tile" style="--acc:#a78bfa">
        <div class="mk-tile-cap">Reliquia Antica</div>
        <div class="mk-tile-name">${rel.name}</div>
        <div class="mk-tile-big" style="font-size:20px;">x${count}</div>
        <div class="mk-tile-desc">${rel.desc}</div>
        <div class="mk-split-actions">
          <button class="mk-act mk-act--gold" onclick="window.__kaizen.useRelic('${rel.id}')">Usa</button>
          <button class="mk-act mk-act--no" onclick="window.__kaizen.discardItem('${rel.id}')">Vendi ${COIN}<b>${refund}</b></button>
        </div>
      </div>`;
    });

    const sortedMaterials = Array.from(materialMap.values()).sort((a, b) => {
      if (a.mat.rarity !== b.mat.rarity) return a.mat.rarity - b.mat.rarity;
      return a.mat.name.localeCompare(b.mat.name);
    });

    let totalMaterialsCount = 0;
    const materialHTMLs = sortedMaterials.map(({ mat, count }) => {
      totalMaterialsCount += count;
      return `
      <div class="mk-tile" style="--acc:#6cc4ef">
        <div class="mk-tile-cap">Rarità ${roman(mat.rarity)}</div>
        <div class="mk-tile-name">${mat.name}</div>
        <div class="mk-tile-big" style="font-size:20px;">x${count}</div>
        <div class="mk-tile-desc">${mat.desc}</div>
        <button class="mk-price" onclick="window.__kaizen.discardItem('${mat.id}')">
          <span class="mk-price-row"><span class="mk-price-lbl">Vendi</span>${COIN}<b>${fmtDen(mat.value)}</b></span>
        </button>
      </div>`;
    });

    const makeZainoSection = (key, num, title, subtitle, htmls, countOverride) => {
      if (!htmls.length) return "";
      const count = countOverride !== undefined ? countOverride : htmls.length;
      return `
      <details class="mk-shop" data-cat="${key}" ${zainoOpenCats.has(key) ? "open" : ""}>
        <summary>
          <span class="mk-shop-num">Scomparto ${num} · ${count} ${count === 1 ? "oggetto" : "oggetti"}</span>
          <span class="mk-shop-name">${title}</span>
          <span class="mk-shop-tag">${subtitle}</span>
          <span class="mk-shop-toggle"></span>
        </summary>
        <div class="mk-shop-body">
          <div class="mk-grid mk-grid--1" style="margin-top:12px;">${htmls.join("")}</div>
        </div>
      </details>`;
    };

    zainoHTML =
      makeZainoSection("material", "I", "Materiali", "minerali e risorse per la forgia", materialHTMLs, totalMaterialsCount) +
      makeZainoSection("relic", "II", "Reliquie", "manufatti arcani ad uso temporaneo", relicHTMLs, totalRelicsCount) +
      makeZainoSection("equip", "III", "Equipaggiamento", "armi e corazze di riserva", equipHTMLs, equipHTMLs.length);
  }

  el.innerHTML = `
  <div class="mk">
    <div class="mk-vitals mk-vitals--4" style="margin-top:0;margin-bottom:14px;">
      <div class="mk-vital" style="--acc:#e0533d">
        <div class="mk-vital-cap">Attacco</div>
        <div class="mk-vital-val" style="color:#e0533d">+${atkTotal}</div>
      </div>
      <div class="mk-vital" style="--acc:#3fb0c4">
        <div class="mk-vital-cap">Difesa</div>
        <div class="mk-vital-val" style="color:#3fb0c4">+${defTotal}</div>
      </div>
      <div class="mk-vital" style="--acc:#5fb8ec">
        <div class="mk-vital-cap">Velocità</div>
        <div class="mk-vital-val" style="color:#5fb8ec">+${velTotal}</div>
      </div>
      <div class="mk-vital" style="--acc:#f0903f">
        <div class="mk-vital-cap">Critico</div>
        <div class="mk-vital-val" style="color:#f0903f">+${criTotal}</div>
      </div>
    </div>

    <div class="mk-group">Dotazione Indossata</div>
    <div class="mk-grid mk-grid--1">${slotsHTML}</div>

    ${relHTML}

    <div class="mk-group">Zaino · ${zItems.length} ${zItems.length === 1 ? "oggetto" : "oggetti"}</div>
    ${zainoHTML}
  </div>`;

  el.querySelectorAll(".mk-shop").forEach(d => {
    d.addEventListener("toggle", () => {
      if (d.open) zainoOpenCats.add(d.dataset.cat);
      else zainoOpenCats.delete(d.dataset.cat);
    });
  });
}
