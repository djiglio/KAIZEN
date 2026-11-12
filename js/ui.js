/* ============================================================
 ui.js — utilità UI: toast, timer, particelle, formatDate
 KAIZEN v6.0
 ============================================================ */

export const COIN = `<span class="mk-coin"></span>`;

export function formatCoinHTML(str) {
 if (!str) return "";
 return String(str)
   .replace(/🪙\s*(?:denari|den)\b/gi, COIN)
   .replace(/(?:denari|den)\s*🪙/gi, COIN)
   .replace(/🪙/g, COIN)
   .replace(/<span class="mk-coin"><\/span>\s*(?:denari|den)\b/gi, COIN)
   .replace(/(?:denari|den)\s*<span class="mk-coin"><\/span>/gi, COIN)
   .replace(/(\d[\d.,]*)\s*(?:denari|den)\b/gi, `$1 ${COIN}`)
   .replace(/\bdenari\b/gi, COIN)
   .replace(/(<span class="mk-coin"><\/span>\s*){2,}/g, `${COIN} `);
}

export function showToast(msg) {
 const t = document.getElementById("toast");
 if (!t) return;
 t.innerHTML = formatCoinHTML(msg);
 t.classList.add("show");
 clearTimeout(t._timer);
 t._timer = setTimeout(() => t.classList.remove("show"), 2800);
}

export function formatDate(ts) {
 const d = new Date(ts);
 return (
 `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")} ` +
 `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`
 );
}

export function formatDateFull(ts) {
 const d = new Date(ts);
 return d.toLocaleString("it-IT", {
 day:"2-digit", month:"2-digit", year:"numeric",
 hour:"2-digit", minute:"2-digit"
 });
}

export function updateTimer() {
 const now = new Date();
 const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
 const diff = tomorrow - now;
 const el = document.getElementById("timer");
 if (el) {
 el.innerText =
 `${String(Math.floor(diff / 3600000)).padStart(2,"0")}:` +
 `${String(Math.floor((diff % 3600000) / 60000)).padStart(2,"0")}:` +
 `${String(Math.floor((diff % 60000) / 1000)).padStart(2,"0")}`;
 }
 if (diff <= 1000) location.reload();
}

export function createParticles() {
 const container = document.getElementById("particles");
 if (!container) return;
 for (let i = 0; i < 20; i++) {
 const p = document.createElement("div");
 p.className = "particle";
 p.style.left = Math.random() * 100 + "%";
 p.style.animationDuration = 15 + Math.random() * 25 + "s";
 p.style.animationDelay = Math.random() * 20 + "s";
 p.style.width = p.style.height = 1 + Math.random() * 2 + "px";
 container.appendChild(p);
 }
}

export function ensureHeroSparks() {
 const container = document.getElementById("hero-sparks");
 if (!container || container.childElementCount > 0) return;
 for (let i = 0; i < 26; i++) {
  const s = document.createElement("div");
  s.className = "hero-spark";
  s.style.left = (4 + Math.random() * 92).toFixed(2) + "%";
  s.style.setProperty("--spark-size", (2.2 + Math.random() * 3.0).toFixed(2) + "px");
  s.style.setProperty("--spark-dur", (2.2 + Math.random() * 2.8).toFixed(2) + "s");
  s.style.setProperty("--spark-delay", (-Math.random() * 5).toFixed(2) + "s");
  s.style.setProperty("--drift", ((Math.random() - 0.5) * 36).toFixed(1) + "px");
  s.style.setProperty("--spark-alpha", (0.65 + Math.random() * 0.35).toFixed(2));
  s.style.setProperty("--spark-rest-y", (12 + Math.random() * 76).toFixed(1) + "%");
  container.appendChild(s);
 }
}

/** Mostra/nasconde una modal generica */
export function openModal(id) {
 const el = document.getElementById(id);
 if (el) el.classList.add("show");
}
export function closeModal(id) {
 const el = document.getElementById(id);
 if (el) el.classList.remove("show");
}
