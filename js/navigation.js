/* ============================================================
 navigation.js — sidebar, cambio pagina, rank page, tab
 KAIZEN v6.37
 ============================================================ */

import { store } from "./state.js";
import { rankTitles, titleMetalColors } from "./data.js";
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

 const cardsHTML = rankTitles.map((rt, i) => {
   const isPast = i < currentTitleIdx;
   const isCurrent = i === currentTitleIdx;
   const metalCol = titleMetalColors[rt.t] || "var(--gold)";
   const acc = isCurrent ? "var(--gold-light)" : isPast ? "#4ecca3" : "rgba(255,255,255,0.12)";
   const chipCls = isCurrent ? "mk-chip--gold" : isPast ? "mk-chip--ok" : "";
   const statusTxt = isCurrent ? "✦ Titolo Attuale" : isPast ? "Conquistato" : "Da Conquistare";

   return `
   <div class="mk-tile rank-entry ${isCurrent ? "is-active rank-current" : isPast ? "rank-past" : "is-off rank-future"}"
        style="--acc:${acc};padding-bottom:12px;">
     <div class="mk-tile-cap">Soglia · Rango ${rt.r}</div>
     <div class="mk-tile-name" style="font-size:13px;color:${isCurrent ? "var(--gold-light)" : isPast ? metalCol : "#6f6656"};min-height:1.8em;">
       ${rt.t}
     </div>
     <div class="mk-chip ${chipCls}" style="margin-bottom:0;">${statusTxt}</div>
   </div>`;
 }).join("");

 listEl.innerHTML = `<div class="mk"><div class="mk-grid">${cardsHTML}</div></div>`;

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
