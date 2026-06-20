/* ============================================================
 main.js — punto di ingresso KAIZEN v6.0
 ============================================================ */

import { exportData, importData, store, save } from "./state.js";
import { updateXP, checkEndOfDay,
 refreshQuests } from "./engine.js";
import { toggleSidebar, showPage,
 showRankPage, switchTab } from "./navigation.js";
import { render, renderWorld,
 showBestiaryDetail,
 showTreasureDetail,
 showTrophyDetail,
 closeDetailModal , showAllAreaQuests} from "./render.js";
import { updateTimer, createParticles } from "./ui.js";
import { runMission, regenPV, regenPA } from "./world.js";
import { buyPotion, buyEquipment,
 equipItem, unequipItem,
 discardItem, useRelic } from "./shop.js";
import { APP_VERSION, APP_RELEASE,
 BESTIARY, rankTitles } from "./data.js";
import { preloadAllImages, initImgObserver } from "./img.js";

/* ── Inizializzazione ── */
createParticles();
checkEndOfDay();
refreshQuests();
preloadAllImages(BESTIARY, rankTitles);
initImgObserver();
render();

/* ── Info app ── */
const vEl = document.getElementById("app-version");
const rEl = document.getElementById("app-release");
if (vEl) vEl.textContent = APP_VERSION;
if (rEl) rEl.textContent = APP_RELEASE;

/* ── Timer countdown ── */
setInterval(updateTimer, 1000);
updateTimer();

/* ── Regen ogni minuto ── */
setInterval(() => {
 regenPV();
 regenPA();
 renderWorld();
}, 60_000);

/* ── API globale ── */
window.__kaizen = {
  // Mondo esterno — cambio area
  setArea(areaId) {
    const wp = store.state.world.worldProgress;
    if (!wp) return;
    if (!wp.areeSbloccate.includes(areaId)) return;
    wp.areaCorrente = areaId;
    save();
    render();
  },
 // Navigation
 toggleSidebar,
 showPage,
 showRankPage,
 switchTab,
 // Data
 exportData,
 importData,
 // Game
 updateXP,
 runMission,
 // Shop
 buyPotion,
 buyEquipment,
 equipItem,
 unequipItem,
 discardItem,
 useRelic,
 // Bacheca modals
 showBestiaryDetail,
 showAllAreaQuests,
 showTreasureDetail,
 showTrophyDetail,
 closeDetailModal,
 // Render callback
 onAfterUpdate: render,
};
