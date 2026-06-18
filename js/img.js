/* ============================================================
   img.js — KAIZEN v6.1
   Approccio diretto: nessun MutationObserver.
   Le funzioni restituiscono un ID univoco; dopo ogni innerHTML
   chiamare resolveImgs() per caricare tutto il visibile.
   ============================================================ */

export function rankImgPath(title) {
  return `/img/ranks/${title.toLowerCase()}.png`;
}
export function enemyImgPath(enemy) {
  return `/img/enemies/${enemy.id}.png`;
}

const _cache = {};

async function fetchFile(path) {
  if (_cache[path] !== undefined) return _cache[path];
  try {
    const res = await fetch(path);
    if (!res.ok) { _cache[path] = null; return null; }
    const buf = await res.arrayBuffer();
    const b = new Uint8Array(buf);
    if (b[0] === 0x89 && b[1] === 0x50) {
      // PNG reale
      _cache[path] = { type: 'png', url: URL.createObjectURL(new Blob([buf], {type:'image/png'})) };
    } else {
      // SVG placeholder
      _cache[path] = { type: 'svg', text: new TextDecoder().decode(buf) };
    }
    return _cache[path];
  } catch { _cache[path] = null; return null; }
}

async function injectInto(el) {
  const path = el.dataset.ki;
  const w = parseInt(el.dataset.kiw) || 56;
  const h = parseInt(el.dataset.kih) || 56;
  if (!path || el.dataset.kiDone === '1') return;
  el.dataset.kiDone = '1';

  const f = await fetchFile(path);
  if (!f) { const ph = el.querySelector('.img-ph'); if (ph) ph.style.display='flex'; return; }

  if (f.type === 'png') {
    const img = document.createElement('img');
    img.src = f.url;
    img.width = w; img.height = h;
    img.style.cssText = `width:${w}px;height:${h}px;object-fit:contain;display:block;`;
    el.innerHTML = ''; el.appendChild(img);
  } else {
    const tmp = document.createElement('div');
    tmp.innerHTML = f.text;
    const svg = tmp.querySelector('svg');
    if (!svg) { const ph = el.querySelector('.img-ph'); if (ph) ph.style.display='flex'; return; }
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.style.cssText = `display:block;width:${w}px;height:${h}px;`;
    el.innerHTML = ''; el.appendChild(svg);
  }
}

/* Chiamare dopo ogni innerHTML che può contenere immagini */
export function resolveImgs(root = document) {
  root.querySelectorAll('[data-ki]:not([data-ki-done="1"])').forEach(injectInto);
}

function wrap(path, w, h, phHTML, extra = '') {
  return `<div data-ki="${path}" data-kiw="${w}" data-kih="${h}"
    style="width:${w}px;height:${h}px;position:relative;flex-shrink:0;${extra}">
    <div class="img-ph" style="display:none;position:absolute;inset:0;
         flex-direction:column;align-items:center;justify-content:center;">${phHTML}</div>
  </div>`;
}

/* Lasciato per compatibilità — ora usa resolveImgs */
export function initImgObserver() {
  resolveImgs();
  new MutationObserver(() => resolveImgs())
    .observe(document.body, { childList: true, subtree: true });
}
export function preloadAllImages() {}

export function heroAvatarHTML(title, w = 200, h = 240) {
  const ph = `<span style="font-family:'Cinzel',serif;font-size:22px;color:rgba(212,160,23,0.5)">?</span>
    <span style="font-family:'JetBrains Mono',monospace;font-size:8px;color:rgba(212,160,23,0.4);letter-spacing:2px">${title}</span>`;
  return wrap(rankImgPath(title), w, h, ph, 'margin:0 auto;');
}
export function heroAvatarSmall(title, px = 64) {
  const ph = `<span style="font-size:${Math.round(px*0.3)}px;color:rgba(78,204,163,0.4)">?</span>`;
  return wrap(rankImgPath(title), px, px, ph);
}
export function enemyImgHTML(enemy, px = 120) {
  const ph = `<span style="font-size:${Math.round(px*0.35)}px;color:rgba(220,38,38,0.4)">${enemy.icon||'?'}</span>
    <span style="font-family:'JetBrains Mono',monospace;font-size:7px;color:rgba(220,38,38,0.35)">${enemy.id}</span>`;
  return wrap(enemyImgPath(enemy), px, px, ph);
}
export function enemyImgSmall(enemy, px = 48) {
  const ph = `<span style="font-size:${Math.round(px*0.4)}px;color:rgba(220,38,38,0.5)">${enemy.icon||'?'}</span>`;
  return wrap(enemyImgPath(enemy), px, px, ph);
}
export function enemyImgCard(enemy, px = 56) {
  const ph = `<span style="font-size:${Math.round(px*0.45)}px;opacity:0.4">${enemy.icon||'?'}</span>`;
  return wrap(enemyImgPath(enemy), px, px, ph, 'margin:0 auto 6px;');
}
