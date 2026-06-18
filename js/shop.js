/* ============================================================
 shop.js — Negozio: pozioni, equipaggiamento, reliquie
 KAIZEN v6.0
 ============================================================ */

import { store, save } from "./state.js";
import { POTIONS, EQUIPMENT_POOL,
 RELICS } from "./data.js";
import { showToast } from "./ui.js";
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
 state.equipment.zaino.push({ id:piece.id, type:"equip" });
 state.history.unshift({ t:Date.now(), msg:` Acquistato: ${piece.icon} ${piece.name} → zaino`, cat:"shop" });
 if (state.history.length > 200) state.history = state.history.slice(0,200);
 save();
 showToast(`${piece.icon} ${piece.name} → zaino!`);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Equipaggia da zaino ── */
export function equipItem(itemId) {
 const state = store.state;
 const eq = state.equipment;

 // Cerca nello zaino
 const idx = eq.zaino.findIndex(z => z.id === itemId);
 if (idx === -1) return;
 const zItem = eq.zaino[idx];

 // Solo equip, non reliquie
 if (zItem.type !== "equip") { showToast("Le reliquie non si equipaggiano!"); return; }

 const piece = EQUIPMENT_POOL.find(e => e.id === itemId);
 if (!piece) return;

 eq.zaino.splice(idx, 1);

 // Swap slot
 const old = eq.equipped[piece.slot];
 if (old) eq.zaino.push({ id:old, type:"equip" });
 eq.equipped[piece.slot] = itemId;

 save();
 showToast(`${piece.icon} ${piece.name} equipaggiato!`);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Disequipaggia ── */
export function unequipItem(slot) {
 const eq = store.state.equipment;
 const id = eq.equipped[slot];
 if (!id) return;
 eq.equipped[slot] = null;
 eq.zaino.push({ id, type:"equip" });
 save();
 const piece = EQUIPMENT_POOL.find(e => e.id === id);
 showToast(`${piece?.icon||""} Rimosso da ${slot}`);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Scarta oggetto ── */
export function discardItem(itemId) {
 const state = store.state;
 const eq = state.equipment;
 const idx = eq.zaino.findIndex(z => z.id === itemId);
 if (idx === -1) return;
 const zItem = eq.zaino[idx];
 eq.zaino.splice(idx, 1);

 let refund = 0;
 let name = itemId;
 let icon = "";

 if (zItem.type === "equip") {
 const piece = EQUIPMENT_POOL.find(e => e.id === itemId);
 if (piece) {
 refund = Math.floor(piece.prezzo * 0.30);
 name = piece.name;
 icon = piece.icon;
 }
 } else if (zItem.type === "relic") {
 const rel = RELICS.find(r => r.id === itemId);
 if (rel) { name = rel.name; icon = rel.icon; refund = 5; }
 }

 if (refund > 0) state.world.denari += refund;
 save();
 showToast(`${icon} ${name} scartato${refund > 0 ? ` +${refund} 🪙` : ""}`);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ── Usa reliquia dallo zaino ── */
export function useRelic(relicId) {
 const state = store.state;
 const w = state.world;
 const idx = state.equipment.zaino.findIndex(z => z.id === relicId && z.type === "relic");
 if (idx === -1) return;

 const rel = RELICS.find(r => r.id === relicId);
 if (!rel) return;

 state.equipment.zaino.splice(idx, 1);
 // Attiva reliquia (sostituisce eventuale della stessa stat)
 w.reliquieAttive = (w.reliquieAttive||[]).filter(ra =>
 Date.now() < ra.expiry && ra.id !== relicId
 );
 w.reliquieAttive.push({ id: relicId, expiry: Date.now() + 24 * 3600 * 1000 });
 save();
 showToast(`${rel.icon} ${rel.name} attivata! ${rel.desc}`);
 if (typeof window.__kaizen?.onAfterUpdate === "function") window.__kaizen.onAfterUpdate();
}

/* ══════════════════════════════════════════════════════════
 RENDER NEGOZIO
══════════════════════════════════════════════════════════ */
export function renderShop() {
 const el = document.getElementById("shop-content");
 if (!el) return;

 const w = store.state.world;
 const heroS = getHeroStats();
 const disc = heroS.shopDiscount;
 const boosted = w.regenBoostExpiry && Date.now() < w.regenBoostExpiry;

 // ── Pozioni ──
 const potionsHTML = POTIONS.map(p => {
 const finalPrice = discountedPrice(p.prezzo, disc);
 const canBuy = w.denari >= finalPrice;
 const isRegen = p.effect.tipo === "regen_boost";
 const active = isRegen && boosted;
 const priceHTML = disc > 0
 ? `<span class="shop-original-price">${p.prezzo} 🪙</span>${finalPrice} 🪙`
 : `${finalPrice} 🪙`;
 return `<div class="shop-item ${active?"shop-item-active":""}">
 <div class="shop-item-icon">${p.icon}</div>
 <div class="shop-item-body">
 <div class="shop-item-name">${p.name}</div>
 <div class="shop-item-desc">${p.desc}${active?" · <span style='color:var(--primary)'>ATTIVA</span>":""}</div>
 </div>
 <button class="shop-buy-btn ${canBuy&&!active?"":"disabled"}"
 onclick="${canBuy&&!active?`window.__kaizen.buyPotion('${p.id}')`:""}">${priceHTML}</button>
 </div>`;
 }).join("");

 // ── Equipaggiamento da negozio ──
 const shopEquip = EQUIPMENT_POOL.filter(e => e.fonte.includes("negozio"));
 const slotLabels = {
 arma:"Armi", elmo:"Elmi", scudo:"Scudi",
 corazza:"Corazze", gambali:"Gambali", bracciali:"Bracciali"
 };
 let equipHTML = "";
 for (const [slot, label] of Object.entries(slotLabels)) {
 const items = shopEquip.filter(e => e.slot === slot);
 if (!items.length) continue;
 equipHTML += `<div class="shop-section-label">${label}</div>`;
 equipHTML += items.map(e => {
 const fp = discountedPrice(e.prezzo, disc);
 const can = w.denari >= fp;
 const bStat = Object.keys(e.bonus)[0];
 const bVal = Object.values(e.bonus)[0];
 const bStr = bStat === "attacco" ? `+${bVal} ATK` :
 bStat === "difesa" ? `+${bVal} DEF` :
 bStat === "velocita"? `+${bVal} VEL` : `+${bVal} CRI`;
 const priceHTML = disc > 0
 ? `<span class="shop-original-price">${e.prezzo} 🪙</span>${fp} 🪙`
 : `${fp} 🪙`;
 return `<div class="shop-item">
 <div class="shop-item-icon">${e.icon}</div>
 <div class="shop-item-body">
 <div class="shop-item-name">${e.name}</div>
 <div class="shop-item-desc">${e.desc} · <span style="color:var(--primary)">${bStr}</span> · T${e.tier}</div>
 </div>
 <button class="shop-buy-btn ${can?"":"disabled"}"
 onclick="${can?`window.__kaizen.buyEquipment('${e.id}')`:""}">${priceHTML}</button>
 </div>`;
 }).join("");
 }

 el.innerHTML = `
 <div class="shop-balance">
 <span class="shop-balance-icon">🪙</span>
 <span class="shop-balance-val">${w.denari}</span>
 <span class="shop-balance-lbl">denari</span>
 ${disc > 0 ? `<span class="shop-discount-badge">-${disc}% CARISMA</span>` : ""}
 </div>

 <div class="shop-section-title">Pozioni</div>
 <div class="shop-section-note">Uso immediato all'acquisto</div>
 ${potionsHTML}

 <div class="shop-section-title" style="margin-top:22px">Armaiolo</div>
 <div class="shop-section-note">Gli acquisti vanno nello zaino</div>
 ${equipHTML}
 `;
}

/* ══════════════════════════════════════════════════════════
 RENDER EQUIPAGGIAMENTO (pagina Eroe)
══════════════════════════════════════════════════════════ */
export function renderEquipment() {
 const el = document.getElementById("equipment-section");
 if (!el) return;

 const eq = store.state.equipment;
 const stats = getHeroStats();

 const slotDefs = [
 { slot:"arma", label:"Arma", icon:"" },
 { slot:"elmo", label:"Elmo", icon:"" },
 { slot:"scudo", label:"Scudo", icon:"" },
 { slot:"corazza", label:"Corazza", icon:"" },
 { slot:"gambali", label:"Gambali", icon:"" },
 { slot:"bracciali",label:"Bracciali",icon:"" },
 ];

 const slotsHTML = slotDefs.map(({ slot, label, icon }) => {
 const id = eq.equipped[slot];
 const piece = id ? EQUIPMENT_POOL.find(e => e.id === id) : null;
 const bStat = piece ? Object.keys(piece.bonus)[0] : null;
 const bVal = piece ? Object.values(piece.bonus)[0] : 0;
 const bStr = piece
 ? (bStat === "attacco" ? `+${bVal} ATK` :
 bStat === "difesa" ? `+${bVal} DEF` :
 bStat === "velocita"? `+${bVal} VEL` : `+${bVal} CRI`)
 : "—";
 const bColor = piece
 ? (bStat === "attacco" ? "#dc2626" : bStat === "difesa" ? "#0e7490" :
 bStat === "velocita"? "#0ea5e9" : "#f97316")
 : "#374151";
 return `<div class="equip-slot ${piece?"equip-slot-filled":"equip-slot-empty"}">
 <div class="equip-slot-header">
 <span class="equip-slot-icon">${piece ? piece.icon : icon}</span>
 <div class="equip-slot-info">
 <div class="equip-slot-name">${piece ? piece.name : label}</div>
 <div class="equip-slot-bonus" style="color:${bColor}">${bStr}${piece?" · T"+piece.tier:""}</div>
 </div>
 ${piece ? `<button class="equip-remove-btn" onclick="window.__kaizen.unequipItem('${slot}')">×</button>` : ""}
 </div>
 ${piece ? `<div class="equip-slot-desc">${piece.desc}</div>` : ""}
 </div>`;
 }).join("");

 // Totali bonus
 const atkTotal = stats.eqBonus.attacco || 0;
 const defTotal = stats.eqBonus.difesa || 0;
 const velTotal = stats.eqBonus.velocita || 0;
 const criTotal = stats.eqBonus.critico || 0;

 // Reliquie attive
 const now = Date.now();
 const relAttive = (store.state.world.reliquieAttive || [])
 .filter(ra => now < ra.expiry);

 let relHTML = "";
 if (relAttive.length > 0) {
 relHTML = `<div class="zaino-title" style="margin-top:16px"> Reliquie Attive</div>` +
 relAttive.map(ra => {
 const rel = RELICS.find(r => r.id === ra.id);
 if (!rel) return "";
 const remaining = Math.ceil((ra.expiry - now) / 3600000);
 return `<div class="zaino-item">
 <span class="zaino-item-icon">${rel.icon}</span>
 <div class="zaino-item-body">
 <div class="zaino-item-name">${rel.name}</div>
 <div class="zaino-item-sub">${rel.desc} · ${remaining}h rimanenti</div>
 </div>
 </div>`;
 }).join("");
 }

 // Zaino
 const zItems = eq.zaino;
 let zainoHTML;
 if (!zItems.length) {
 zainoHTML = `<div class="zaino-empty">LO ZAINO È VUOTO</div>`;
 } else {
 zainoHTML = zItems.map((zItem, idx) => {
 if (zItem.type === "equip") {
 const piece = EQUIPMENT_POOL.find(e => e.id === zItem.id);
 if (!piece) return "";
 const bStat = Object.keys(piece.bonus)[0];
 const bVal = Object.values(piece.bonus)[0];
 const bStr = bStat === "attacco" ? `+${bVal} ATK` :
 bStat === "difesa" ? `+${bVal} DEF` :
 bStat === "velocita"? `+${bVal} VEL` : `+${bVal} CRI`;
 return `<div class="zaino-item">
 <span class="zaino-item-icon">${piece.icon}</span>
 <div class="zaino-item-body">
 <div class="zaino-item-name">${piece.name}</div>
 <div class="zaino-item-sub">${bStr} · T${piece.tier}</div>
 </div>
 <div class="zaino-item-actions">
 <button class="zaino-equip-btn" onclick="window.__kaizen.equipItem('${zItem.id}')">Equip</button>
 <button class="zaino-discard-btn" onclick="window.__kaizen.discardItem('${zItem.id}')"></button>
 </div>
 </div>`;
 } else if (zItem.type === "relic") {
 const rel = RELICS.find(r => r.id === zItem.id);
 if (!rel) return "";
 return `<div class="zaino-item">
 <span class="zaino-item-icon">${rel.icon}</span>
 <div class="zaino-item-body">
 <div class="zaino-item-name">${rel.name}</div>
 <div class="zaino-item-sub">${rel.desc}</div>
 </div>
 <div class="zaino-item-actions">
 <button class="zaino-equip-btn" style="background:rgba(212,160,23,0.15);border-color:rgba(212,160,23,0.3);color:var(--gold)"
 onclick="window.__kaizen.useRelic('${zItem.id}')">Usa</button>
 <button class="zaino-discard-btn" onclick="window.__kaizen.discardItem('${zItem.id}')"></button>
 </div>
 </div>`;
 }
 return "";
 }).join("");
 }

 el.innerHTML = `
 <div class="equip-totals">
 <div class="equip-total-box">
 <div class="equip-total-val" style="color:#dc2626">+${atkTotal}</div>
 <div class="equip-total-lbl">ATK BONUS</div>
 </div>
 <div class="equip-total-box">
 <div class="equip-total-val" style="color:#0e7490">+${defTotal}</div>
 <div class="equip-total-lbl">DEF BONUS</div>
 </div>
 <div class="equip-total-box">
 <div class="equip-total-val" style="color:#0ea5e9">+${velTotal}</div>
 <div class="equip-total-lbl">VEL BONUS</div>
 </div>
 <div class="equip-total-box">
 <div class="equip-total-val" style="color:#f97316">+${criTotal}</div>
 <div class="equip-total-lbl">CRI BONUS</div>
 </div>
 </div>

 <div class="equip-slots">${slotsHTML}</div>

 ${relHTML}

 <div class="zaino-title"> Zaino
 <span style="color:#64748b;font-size:10px;font-family:'JetBrains Mono',monospace">(${zItems.length} oggetti)</span>
 </div>
 <div class="zaino-list">${zainoHTML}</div>
 `;
}


