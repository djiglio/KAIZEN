/* ============================================================
 navigation.js — sidebar, cambio pagina, rank page, tab
 KAIZEN v6.0
 ============================================================ */

import { store } from "./state.js";
import { rankTitles } from "./data.js";
import { getHeroRank } from "./engine.js";

export function toggleSidebar() {
 const isOpen = document.getElementById("sidebar").classList.toggle("open");
 document.getElementById("sidebar-overlay").style.display = isOpen ? "block" : "none";
}

export function showPage(id, el) {
 document.querySelectorAll(".page, #p-ranks")
 .forEach(p => p.classList.remove("active"));
 document.querySelectorAll(".nav-btn")
 .forEach(n => n.classList.remove("active"));
 const target = document.getElementById(id);
 if (target) target.classList.add("active");
 if (el) el.classList.add("active");
 const sidebar = document.getElementById("sidebar");
 if (sidebar.classList.contains("open")) toggleSidebar();
 window.scrollTo({ top:0, behavior:"instant" });
}

export function showRankPage() {
 const rank = getHeroRank();
 let currentTitleIdx = 0;
 rankTitles.forEach((rt, i) => { if (rank >= rt.r) currentTitleIdx = i; });

 const listEl = document.getElementById("rank-list");
 if (!listEl) return;

 listEl.innerHTML = rankTitles.map((rt, i) => {
 let cls, badgeText;
 if (i < currentTitleIdx) { cls="rank-past"; badgeText="CONQUISTATO"; }
 else if (i === currentTitleIdx){ cls="rank-current"; badgeText="ATTUALE"; }
 else { cls="rank-future"; badgeText=`RANGO ${rt.r}`; }
 const indicator = i === currentTitleIdx
 ? `<span class="rank-current-indicator"></span>` : "";
 return `<div class="rank-entry ${cls}">
 <div class="rank-title-text">${rt.t}</div>
 <div class="rank-badge-label">${badgeText}</div>
 ${indicator}
 </div>`;
 }).join(`<div class="rank-section-divider">· · ·</div>`);

 document.querySelectorAll(".page, #p-ranks")
 .forEach(p => p.classList.remove("active"));
 document.querySelectorAll(".nav-btn")
 .forEach(n => n.classList.remove("active"));
 document.getElementById("p-ranks").classList.add("active");
 window.scrollTo({ top:0, behavior:"instant" });

 setTimeout(() => {
 const entries = listEl.querySelectorAll(".rank-entry");
 if (entries[currentTitleIdx]) {
 entries[currentTitleIdx].scrollIntoView({ behavior:"smooth", block:"center" });
 }
 }, 120);
}

export function switchTab(panelId, btn) {
 document.querySelectorAll(".tab-panel")
 .forEach(p => p.classList.remove("active"));
 document.querySelectorAll(".tab-btn")
 .forEach(b => b.classList.remove("active"));
 const panel = document.getElementById(panelId);
 if (panel) panel.classList.add("active");
 if (btn) btn.classList.add("active");
}
