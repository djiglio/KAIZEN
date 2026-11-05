/* ============================================================
 main.js — punto di ingresso KAIZEN v6.66
 ============================================================ */

import {
  exportData,
  importData,
  downloadSigilloFile,
  uploadSigilloFile,
  store,
  save
} from "./state.js";
import { updateXP, checkEndOfDay, refreshQuests } from "./engine.js";
import { toggleSidebar, showPage, showRankPage, switchTab } from "./navigation.js";
import {
  render,
  renderWorld,
  showBestiaryDetail,
  showTreasureDetail,
  showTrophyDetail,
  toggleAllTreasures,
  closeDetailModal,
  showAllAreaQuests
} from "./render.js";
import { updateTimer, createParticles } from "./ui.js";
import { runMission, regenPV, regenPA } from "./world.js";
import {
  buyPotion,
  buyEquipment,
  equipItem,
  unequipItem,
  discardItem,
  useRelic,
  repairItem,
  openCoatingModal,
  applyCoating
} from "./shop.js";
import { APP_VERSION, APP_RELEASE, BESTIARY, rankTitles } from "./data.js";
import { preloadAllImages, initImgObserver } from "./img.js";
import {
  initSync,
  loginWithGoogle,
  submitEmailAuth,
  logoutCloud,
  forceSyncNow,
  connectAnonymousSession,
  toggleEmailPanel,
  setEmailMode,
  saveCustomFirebaseConfigFromUI,
  restoreDefaultFirebaseConfig
} from "./sync.js";

/* ── Inizializzazione ── */
createParticles();
checkEndOfDay();
refreshQuests();
preloadAllImages(BESTIARY, rankTitles);
initImgObserver();
render();
initSync(() => {
  checkEndOfDay();
  refreshQuests();
  render();
});

/* ── Info app ── */
const vEl = document.getElementById("app-version");
const rEl = document.getElementById("app-release");
if (vEl) vEl.textContent = APP_VERSION;
if (rEl) rEl.textContent = APP_RELEASE;

/* ── Form Email/Password listener (Modern Web Guidance) ── */
const emailForm = document.getElementById("sync-email-form");
if (emailForm) {
  emailForm.addEventListener("submit", async e => {
    e.preventDefault();
    const emailEl = document.getElementById("sync-email-input");
    const pwdEl = document.getElementById("sync-password-input");
    const submitBtn = document.getElementById("sync-email-submit-btn");
    if (submitBtn) submitBtn.disabled = true;
    try {
      await submitEmailAuth(emailEl?.value || "", pwdEl?.value || "");
      if (pwdEl) pwdEl.value = "";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

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
  // Data & Sigillo (Backup manuale secondario)
  exportData,
  importData,
  downloadSigilloFile,
  uploadSigilloFile,
  // Sincronizzazione Firebase
  loginWithGoogle,
  logoutCloud,
  forceSyncNow,
  connectAnonymousSession,
  toggleEmailPanel,
  setEmailMode,
  togglePasswordVisibility() {
    const pwdEl = document.getElementById("sync-password-input");
    const btnEl = document.getElementById("sync-pwd-toggle");
    if (!pwdEl || !btnEl) return;
    const isHidden = pwdEl.type === "password";
    pwdEl.type = isHidden ? "text" : "password";
    btnEl.setAttribute("aria-pressed", String(isHidden));
    btnEl.textContent = isHidden ? "Nascondi" : "Mostra";
  },
  saveCustomFirebaseConfig() {
    const ta = document.getElementById("sync-custom-cfg-input");
    if (!ta) return;
    saveCustomFirebaseConfigFromUI(ta.value);
  },
  restoreDefaultFirebaseConfig,
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
  repairItem,
  openCoatingModal,
  applyCoating,
  // Bacheca modals
  showBestiaryDetail,
  showAllAreaQuests,
  showTreasureDetail,
  showTrophyDetail,
  toggleAllTreasures,
  closeDetailModal,
  // Render callback
  onAfterUpdate: render,
};
