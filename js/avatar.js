/* ============================================================
 avatar.js — sistema avatar SVG procedurale per ogni titolo
 ============================================================ */

import { avatarPalettes, nobleMantle } from "./data.js";

/**
 * Costruisce e restituisce una stringa SVG per il titolo indicato.
 * @param {string} title - titolo corrente del personaggio (es. "RE")
 * @returns {string} markup SVG completo
 */
export function buildAvatar(title) {
 const c = avatarPalettes[title] || "#8a9aaa";
 const id = title.replace(/[^a-zA-Z]/g, "_");
 const nm = nobleMantle[title] || null;
 const cx = 50;

 const nclBase = nm ? nm.base : "#1e1830";
 const nclHi = nm ? nm.hi : "#160e24";
 const nclTrim = nm ? nm.trim : "#3a2a50";

 // ---- SVG defs ----
 const D = `<defs>
 <filter id="g${id}"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="gs${id}"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="bl${id}"><feGaussianBlur stdDeviation="1.2"/></filter>
 <radialGradient id="sk${id}" cx="45%" cy="35%" r="60%">
 <stop offset="0%" stop-color="#d4a87a"/>
 <stop offset="60%" stop-color="#c8956c"/>
 <stop offset="100%" stop-color="#9b6644"/>
 </radialGradient>
 <radialGradient id="skd${id}" cx="40%" cy="30%" r="65%">
 <stop offset="0%" stop-color="#b07850"/>
 <stop offset="100%" stop-color="#7a4a28"/>
 </radialGradient>
 <linearGradient id="fab${id}" x1="30%" y1="0%" x2="70%" y2="100%">
 <stop offset="0%" stop-color="#1e1e2a"/>
 <stop offset="40%" stop-color="#141420"/>
 <stop offset="100%" stop-color="#08080e"/>
 </linearGradient>
 <linearGradient id="ac${id}" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stop-color="${c}" stop-opacity="0.9"/>
 <stop offset="100%" stop-color="${c}" stop-opacity="0.5"/>
 </linearGradient>
 <radialGradient id="acr${id}" cx="30%" cy="20%" r="70%">
 <stop offset="0%" stop-color="${c}" stop-opacity="0.6"/>
 <stop offset="100%" stop-color="${c}" stop-opacity="0.1"/>
 </radialGradient>
 <linearGradient id="met${id}" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stop-color="#3a3a4a"/>
 <stop offset="30%" stop-color="#5a5a6e"/>
 <stop offset="55%" stop-color="#2a2a38"/>
 <stop offset="100%" stop-color="#1a1a24"/>
 </linearGradient>
 <linearGradient id="meth${id}" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stop-color="#6a6a80"/>
 <stop offset="40%" stop-color="#9090aa"/>
 <stop offset="60%" stop-color="#4a4a5c"/>
 <stop offset="100%" stop-color="#282834"/>
 </linearGradient>
 <linearGradient id="gld${id}" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stop-color="#f5d060"/>
 <stop offset="35%" stop-color="${c}"/>
 <stop offset="65%" stop-color="#c8900a"/>
 <stop offset="100%" stop-color="#a07008"/>
 </linearGradient>
 <radialGradient id="gldr${id}" cx="30%" cy="25%" r="60%">
 <stop offset="0%" stop-color="#fff8d0"/>
 <stop offset="50%" stop-color="${c}"/>
 <stop offset="100%" stop-color="#906000"/>
 </radialGradient>
 <linearGradient id="cl${id}" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stop-color="#252535"/>
 <stop offset="50%" stop-color="#181825"/>
 <stop offset="100%" stop-color="#080810"/>
 </linearGradient>
 <radialGradient id="clr${id}" cx="50%" cy="0%" r="80%">
 <stop offset="0%" stop-color="#2a2a3a"/>
 <stop offset="100%" stop-color="#06060c"/>
 </radialGradient>
 <linearGradient id="ncl${id}" x1="0%" y1="0%" x2="80%" y2="100%">
 <stop offset="0%" stop-color="${nclBase}"/>
 <stop offset="40%" stop-color="${nclHi}"/>
 <stop offset="100%" stop-color="#06040c"/>
 </linearGradient>
 <radialGradient id="nclh${id}" cx="25%" cy="15%" r="50%">
 <stop offset="0%" stop-color="${nclTrim}" stop-opacity="0.8"/>
 <stop offset="100%" stop-color="#0a080e" stop-opacity="0"/>
 </radialGradient>
 <linearGradient id="fur${id}" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stop-color="#e8e4dc"/>
 <stop offset="100%" stop-color="#b8b0a4"/>
 </linearGradient>
 <radialGradient id="eth${id}" cx="50%" cy="40%" r="55%">
 <stop offset="0%" stop-color="${c}" stop-opacity="0.5"/>
 <stop offset="60%" stop-color="${c}" stop-opacity="0.1"/>
 <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
 </radialGradient>
 </defs>`;

 // ---- Helper functions (closures su id e c) ----
 function _face(fcx, fcy, rx, ry, withBeard, withHood, browStyle) {
 const eyeL = fcx - rx * 0.35, eyeR = fcx + rx * 0.35, eyeY = fcy - ry * 0.1;
 const noseX = fcx, noseY = fcy + ry * 0.18, mouthY = fcy + ry * 0.42;
 let hood = "";
 if (withHood) {
 hood = `
 <ellipse cx="${fcx}" cy="${fcy - ry * 0.55}" rx="${rx * 1.3}" ry="${ry * 0.6}" fill="#080810" opacity="0.97"/>
 <path d="M${fcx - rx * 1.3} ${fcy - ry * 0.55} Q${fcx - rx * 1.4} ${fcy - ry * 1.1} ${fcx} ${fcy - ry * 1.6} Q${fcx + rx * 1.4} ${fcy - ry * 1.1} ${fcx + rx * 1.3} ${fcy - ry * 0.55}" fill="#0f0f1a" stroke="url(#ac${id})" stroke-width="0.8" opacity="0.9"/>`;
 }
 const brow = browStyle === "stern"
 ? `<path d="M${eyeL - rx * 0.2} ${eyeY - ry * 0.32} Q${eyeL} ${eyeY - ry * 0.36} ${eyeL + rx * 0.18} ${eyeY - ry * 0.28}" fill="none" stroke="#3a2a18" stroke-width="1.2" stroke-linecap="round"/>
 <path d="M${eyeR - rx * 0.18} ${eyeY - ry * 0.28} Q${eyeR} ${eyeY - ry * 0.36} ${eyeR + rx * 0.2} ${eyeY - ry * 0.32}" fill="none" stroke="#3a2a18" stroke-width="1.2" stroke-linecap="round"/>`
 : browStyle === "noble"
 ? `<path d="M${eyeL - rx * 0.22} ${eyeY - ry * 0.34} Q${eyeL} ${eyeY - ry * 0.4} ${eyeL + rx * 0.2} ${eyeY - ry * 0.3}" fill="none" stroke="#2a1a0c" stroke-width="1.1" stroke-linecap="round"/>
 <path d="M${eyeR - rx * 0.2} ${eyeY - ry * 0.3} Q${eyeR} ${eyeY - ry * 0.4} ${eyeR + rx * 0.22} ${eyeY - ry * 0.34}" fill="none" stroke="#2a1a0c" stroke-width="1.1" stroke-linecap="round"/>`
 : `<path d="M${eyeL - rx * 0.2} ${eyeY - ry * 0.3} Q${eyeL} ${eyeY - ry * 0.35} ${eyeL + rx * 0.18} ${eyeY - ry * 0.26}" fill="none" stroke="#3a2a18" stroke-width="1" stroke-linecap="round"/>
 <path d="M${eyeR - rx * 0.18} ${eyeY - ry * 0.26} Q${eyeR} ${eyeY - ry * 0.35} ${eyeR + rx * 0.2} ${eyeY - ry * 0.3}" fill="none" stroke="#3a2a18" stroke-width="1" stroke-linecap="round"/>`;
 const beard = withBeard
 ? `<path d="M${fcx - rx * 0.5} ${mouthY + ry * 0.1} Q${fcx - rx * 0.4} ${fcy + ry * 0.85} ${fcx} ${fcy + ry * 0.95} Q${fcx + rx * 0.4} ${fcy + ry * 0.85} ${fcx + rx * 0.5} ${mouthY + ry * 0.1}" fill="#3a2810" opacity="0.7"/>` : "";
 return `${hood}
 <ellipse cx="${fcx}" cy="${fcy}" rx="${rx}" ry="${ry}" fill="url(#sk${id})" filter="url(#bl${id})"/>
 <ellipse cx="${fcx - rx * 0.5}" cy="${fcy + ry * 0.1}" rx="${rx * 0.35}" ry="${ry * 0.22}" fill="url(#skd${id})" opacity="0.35"/>
 <ellipse cx="${fcx + rx * 0.5}" cy="${fcy + ry * 0.1}" rx="${rx * 0.35}" ry="${ry * 0.22}" fill="url(#skd${id})" opacity="0.35"/>
 <ellipse cx="${fcx - rx * 0.1}" cy="${fcy - ry * 0.45}" rx="${rx * 0.45}" ry="${ry * 0.25}" fill="#d4a87a" opacity="0.3"/>
 ${brow}
 <ellipse cx="${eyeL}" cy="${eyeY}" rx="${rx * 0.22}" ry="${ry * 0.16}" fill="url(#skd${id})" opacity="0.4"/>
 <ellipse cx="${eyeR}" cy="${eyeY}" rx="${rx * 0.22}" ry="${ry * 0.16}" fill="url(#skd${id})" opacity="0.4"/>
 <ellipse cx="${eyeL}" cy="${eyeY}" rx="${rx * 0.14}" ry="${ry * 0.1}" fill="${c}" opacity="0.25" filter="url(#gs${id})"/>
 <ellipse cx="${eyeR}" cy="${eyeY}" rx="${rx * 0.14}" ry="${ry * 0.1}" fill="${c}" opacity="0.25" filter="url(#gs${id})"/>
 <circle cx="${eyeL}" cy="${eyeY}" r="${rx * 0.1}" fill="${c}" opacity="0.85" filter="url(#g${id})"/>
 <circle cx="${eyeR}" cy="${eyeY}" r="${rx * 0.1}" fill="${c}" opacity="0.85" filter="url(#g${id})"/>
 <circle cx="${eyeL + rx * 0.03}" cy="${eyeY - ry * 0.04}" r="${rx * 0.04}" fill="#ffffff" opacity="0.7"/>
 <circle cx="${eyeR + rx * 0.03}" cy="${eyeY - ry * 0.04}" r="${rx * 0.04}" fill="#ffffff" opacity="0.7"/>
 <path d="M${noseX - rx * 0.06} ${eyeY + ry * 0.18} L${noseX - rx * 0.1} ${noseY} Q${noseX} ${noseY + ry * 0.08} ${noseX + rx * 0.1} ${noseY} L${noseX + rx * 0.06} ${eyeY + ry * 0.18}" fill="url(#skd${id})" opacity="0.3"/>
 <circle cx="${noseX}" cy="${noseY + ry * 0.04}" r="${rx * 0.08}" fill="#c8906a" opacity="0.5"/>
 <path d="M${fcx - rx * 0.22} ${mouthY} Q${fcx} ${mouthY + ry * 0.08} ${fcx + rx * 0.22} ${mouthY}" fill="none" stroke="#8a4a30" stroke-width="0.9" stroke-linecap="round"/>
 <path d="M${fcx - rx * 0.3} ${fcy + ry * 0.65} Q${fcx} ${fcy + ry * 0.95} ${fcx + rx * 0.3} ${fcy + ry * 0.65}" fill="url(#skd${id})" opacity="0.25"/>
 ${beard}
 <ellipse cx="${fcx}" cy="${fcy + ry * 0.88}" rx="${rx * 0.45}" ry="${ry * 0.15}" fill="url(#skd${id})" opacity="0.4"/>`;
 }

 function _ns(ncx, top, sw, h) {
 return `<rect x="${ncx - sw * 0.22}" y="${top - h}" width="${sw * 0.44}" height="${h + 4}" rx="3" fill="#c08060" opacity="0.9"/>
 <rect x="${ncx - sw * 0.154}" y="${top - h}" width="${sw * 0.11}" height="${h}" rx="2" fill="#d4a07a" opacity="0.3"/>`;
 }

 function _cloak(scx, sy, bw, bh, gr, folds) {
 const sp = bw * 0.7, bL = scx - bw / 2 - sp / 2, bR = scx + bw / 2 + sp / 2, bB = sy + bh;
 let fl = "";
 for (let i = 1; i <= folds; i++) {
 const x = bL + (bR - bL) * i / (folds + 1), sw = Math.sin(i) * 3;
 fl += `<path d="M${x} ${sy + 10} Q${x + sw} ${sy + bh * 0.5} ${x + sw * 0.8} ${bB}" fill="none" stroke="#000008" stroke-width="0.5" opacity="0.35"/>`;
 }
 return `<path d="M${scx - bw / 2 + 4} ${sy} Q${bL + 6} ${sy + bh * 0.15} ${bL} ${bB} L${bR} ${bB} Q${bR - 6} ${sy + bh * 0.15} ${scx + bw / 2 - 4} ${sy} Z" fill="url(#${gr}${id})"/>
 <path d="M${scx - bw / 2 + 4} ${sy} Q${bL + 6} ${sy + bh * 0.15} ${bL} ${bB} L${bR} ${bB} Q${bR - 6} ${sy + bh * 0.15} ${scx + bw / 2 - 4} ${sy} Z" fill="url(#clr${id})" opacity="0.4"/>
 <path d="M${scx - bw / 2 + 4} ${sy} Q${bL + 20} ${sy + 8} ${bL + 10} ${sy + 20}" fill="none" stroke="#ffffff" stroke-width="0.6" opacity="0.12"/>
 <path d="M${scx + bw / 2 - 4} ${sy} Q${bR - 20} ${sy + 8} ${bR - 10} ${sy + 20}" fill="none" stroke="#ffffff" stroke-width="0.6" opacity="0.12"/>
 ${fl}<path d="M${bL} ${bB} L${bR} ${bB}" stroke="url(#ac${id})" stroke-width="0.5" opacity="0.3"/>`;
 }

 function _clothBody(bcx, top, bw, bh, gr, folds) {
 const bL = bcx - bw / 2, bR = bcx + bw / 2, bB = top + bh;
 let fl = "";
 for (let i = 1; i <= folds; i++) {
 const x = bL + (bw / (folds + 1)) * i, sw = (i % 2 ? 1 : -1) * 2;
 fl += `<path d="M${x} ${top + 4} Q${x + sw} ${top + bh * 0.4} ${x + sw * 0.5} ${bB}" fill="none" stroke="#000008" stroke-width="0.6" opacity="0.3"/>`;
 }
 return `<path d="M${bL + 6} ${top} Q${bL} ${top + bh * 0.3} ${bL - 4} ${bB} L${bR + 4} ${bB} Q${bR} ${top + bh * 0.3} ${bR - 6} ${top} Z" fill="url(#${gr}${id})"/>
 <path d="M${bL + 6} ${top} Q${bL} ${top + bh * 0.3} ${bL - 4} ${bB} L${bR + 4} ${bB} Q${bR} ${top + bh * 0.3} ${bR - 6} ${top} Z" fill="url(#clr${id})" opacity="0.4"/>
 ${fl}<ellipse cx="${bL + 8}" cy="${top + 4}" rx="8" ry="4" fill="#2a2a3c" opacity="0.5"/><ellipse cx="${bR - 8}" cy="${top + 4}" rx="8" ry="4" fill="#2a2a3c" opacity="0.5"/>`;
 }

 function _arms(acx, sy, bw, al, armored) {
 const sL = acx - bw / 2, sR = acx + bw / 2;
 const fill = armored ? `url(#met${id})` : `url(#cl${id})`;
 const sw = armored ? 0.8 : 0.4;
 return `<path d="M${sL + 4} ${sy + 2} Q${sL - 8} ${sy + al * 0.4} ${sL - 6} ${sy + al}" fill="${fill}" stroke="url(#ac${id})" stroke-width="${sw}" opacity="0.9"/>
 <ellipse cx="${sL - 6}" cy="${sy + al}" rx="${armored ? 5 : 3.5}" ry="3" fill="url(#sk${id})" opacity="0.8"/>
 <path d="M${sR - 4} ${sy + 2} Q${sR + 8} ${sy + al * 0.4} ${sR + 6} ${sy + al}" fill="${fill}" stroke="url(#ac${id})" stroke-width="${sw}" opacity="0.9"/>
 <ellipse cx="${sR + 6}" cy="${sy + al}" rx="${armored ? 5 : 3.5}" ry="3" fill="url(#sk${id})" opacity="0.8"/>`;
 }

 function _bp(bcx, top, w, h) {
 return `<path d="M${bcx - w / 2} ${top} Q${bcx - w / 2 - 3} ${top + h * 0.3} ${bcx - w / 2 + 2} ${top + h} L${bcx + w / 2 - 2} ${top + h} Q${bcx + w / 2 + 3} ${top + h * 0.3} ${bcx + w / 2} ${top} Q${bcx} ${top - 3} ${bcx - w / 2} ${top} Z" fill="url(#met${id})"/>
 <path d="M${bcx - w / 2} ${top} Q${bcx - w / 2 - 3} ${top + h * 0.3} ${bcx - w / 2 + 2} ${top + h} L${bcx + w / 2 - 2} ${top + h} Q${bcx + w / 2 + 3} ${top + h * 0.3} ${bcx + w / 2} ${top} Q${bcx} ${top - 3} ${bcx - w / 2} ${top} Z" fill="url(#acr${id})" opacity="0.3"/>
 <path d="M${bcx} ${top} L${bcx} ${top + h}" stroke="url(#meth${id})" stroke-width="1.5" opacity="0.6"/>
 <path d="M${bcx - w / 2 + 2} ${top + h * 0.45} Q${bcx} ${top + h * 0.4} ${bcx + w / 2 - 2} ${top + h * 0.45}" fill="none" stroke="url(#meth${id})" stroke-width="1" opacity="0.5"/>
 <path d="M${bcx - w / 2} ${top} Q${bcx - w / 2 - 10} ${top + 5} ${bcx - w / 2 - 8} ${top + 14} Q${bcx - w / 2 - 2} ${top + 14} ${bcx - w / 2 + 2} ${top + 8}" fill="url(#met${id})"/>
 <path d="M${bcx + w / 2} ${top} Q${bcx + w / 2 + 10} ${top + 5} ${bcx + w / 2 + 8} ${top + 14} Q${bcx + w / 2 + 2} ${top + 14} ${bcx + w / 2 - 2} ${top + 8}" fill="url(#met${id})"/>
 <ellipse cx="${bcx - 4}" cy="${top + h * 0.25}" rx="5" ry="4" fill="url(#meth${id})" opacity="0.4"/>`;
 }

 function _helm(hcx, hcy, rx, ry, style) {
 if (style === "open") return `<path d="M${hcx - rx} ${hcy} Q${hcx - rx - 2} ${hcy - ry * 1.1} ${hcx} ${hcy - ry * 1.4} Q${hcx + rx + 2} ${hcy - ry * 1.1} ${hcx + rx} ${hcy}" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.6"/>
 <path d="M${hcx - rx} ${hcy} Q${hcx - rx - 2} ${hcy - ry * 1.1} ${hcx} ${hcy - ry * 1.4} Q${hcx + rx + 2} ${hcy - ry * 1.1} ${hcx + rx} ${hcy}" fill="url(#acr${id})" opacity="0.25"/>
 <rect x="${hcx - 1.5}" y="${hcy - ry * 1.1}" width="3" height="${ry * 0.7}" rx="1.5" fill="url(#met${id})"/>
 <path d="M${hcx - rx} ${hcy} Q${hcx - rx - 3} ${hcy + ry * 0.4} ${hcx - rx + 2} ${hcy + ry * 0.6}" fill="url(#met${id})" opacity="0.8"/>
 <path d="M${hcx + rx} ${hcy} Q${hcx + rx + 3} ${hcy + ry * 0.4} ${hcx + rx - 2} ${hcy + ry * 0.6}" fill="url(#met${id})" opacity="0.8"/>
 <ellipse cx="${hcx - rx * 0.2}" cy="${hcy - ry * 0.9}" rx="${rx * 0.4}" ry="${ry * 0.25}" fill="url(#meth${id})" opacity="0.5"/>`;
 if (style === "full") return `<path d="M${hcx - rx - 2} ${hcy + ry * 0.3} Q${hcx - rx - 4} ${hcy - ry * 0.8} ${hcx} ${hcy - ry * 1.6} Q${hcx + rx + 4} ${hcy - ry * 0.8} ${hcx + rx + 2} ${hcy + ry * 0.3} Q${hcx} ${hcy + ry * 0.7} ${hcx - rx - 2} ${hcy + ry * 0.3} Z" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.7"/>
 <path d="M${hcx - rx - 2} ${hcy + ry * 0.3} Q${hcx - rx - 4} ${hcy - ry * 0.8} ${hcx} ${hcy - ry * 1.6} Q${hcx + rx + 4} ${hcy - ry * 0.8} ${hcx + rx + 2} ${hcy + ry * 0.3} Q${hcx} ${hcy + ry * 0.7} ${hcx - rx - 2} ${hcy + ry * 0.3} Z" fill="url(#acr${id})" opacity="0.2"/>
 <path d="M${hcx - rx * 0.6} ${hcy - ry * 0.1} L${hcx - rx * 0.15} ${hcy - ry * 0.1}" stroke="url(#ac${id})" stroke-width="1.5" opacity="0.7"/>
 <path d="M${hcx + rx * 0.15} ${hcy - ry * 0.1} L${hcx + rx * 0.6} ${hcy - ry * 0.1}" stroke="url(#ac${id})" stroke-width="1.5" opacity="0.7"/>
 <circle cx="${hcx - rx * 0.4}" cy="${hcy - ry * 0.1}" r="${rx * 0.09}" fill="${c}" opacity="0.9" filter="url(#g${id})"/>
 <circle cx="${hcx + rx * 0.4}" cy="${hcy - ry * 0.1}" r="${rx * 0.09}" fill="${c}" opacity="0.9" filter="url(#g${id})"/>
 <ellipse cx="${hcx - rx * 0.25}" cy="${hcy - ry * 0.9}" rx="${rx * 0.5}" ry="${ry * 0.3}" fill="url(#meth${id})" opacity="0.45"/>`;
 if (style === "gladiator") return `<path d="M${hcx - rx - 2} ${hcy + ry * 0.2} Q${hcx - rx - 3} ${hcy - ry * 0.7} ${hcx} ${hcy - ry * 1.5} Q${hcx + rx + 3} ${hcy - ry * 0.7} ${hcx + rx + 2} ${hcy + ry * 0.2} Z" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.7"/>
 <path d="M${hcx - rx * 0.3} ${hcy - ry * 1.5} Q${hcx} ${hcy - ry * 2.4} ${hcx + rx * 0.3} ${hcy - ry * 1.5}" fill="url(#ac${id})" opacity="0.8" filter="url(#g${id})"/>
 <path d="M${hcx - rx * 0.2} ${hcy - ry * 1.5} Q${hcx - rx * 0.05} ${hcy - ry * 2.5} ${hcx} ${hcy - ry * 2.6} Q${hcx + rx * 0.05} ${hcy - ry * 2.5} ${hcx + rx * 0.2} ${hcy - ry * 1.5}" fill="url(#ac${id})" opacity="0.6"/>
 <ellipse cx="${hcx - rx * 0.25}" cy="${hcy - ry * 0.9}" rx="${rx * 0.4}" ry="${ry * 0.25}" fill="url(#meth${id})" opacity="0.45"/>`;
 return "";
 }

 function _crown(ccx, ccy, rx, lv) {
 const base = `<rect x="${ccx - rx}" y="${ccy}" width="${rx * 2}" height="${lv > 2 ? 5 : 4}" rx="2" fill="url(#gld${id})" filter="url(#g${id})"/>`;
 if (lv === 1) return base + `<path d="M${ccx - rx} ${ccy} L${ccx - rx} ${ccy - 4} L${ccx} ${ccy - 6} L${ccx + rx} ${ccy - 4} L${ccx + rx} ${ccy}" fill="url(#gld${id})" filter="url(#g${id})"/>`;
 if (lv === 2) return base + `<path d="M${ccx - rx} ${ccy} L${ccx - rx} ${ccy - 6} L${ccx - rx * 0.5} ${ccy - 3} L${ccx} ${ccy - 9} L${ccx + rx * 0.5} ${ccy - 3} L${ccx + rx} ${ccy - 6} L${ccx + rx} ${ccy}" fill="url(#gld${id})" filter="url(#g${id})"/><circle cx="${ccx}" cy="${ccy - 10}" r="2" fill="${c}" opacity="0.9" filter="url(#gs${id})"/>`;
 if (lv === 3) return base + `<path d="M${ccx - rx} ${ccy} L${ccx - rx} ${ccy - 7} L${ccx - rx * 0.55} ${ccy - 3} L${ccx} ${ccy - 12} L${ccx + rx * 0.55} ${ccy - 3} L${ccx + rx} ${ccy - 7} L${ccx + rx} ${ccy}" fill="url(#gld${id})" filter="url(#g${id})"/>
 <circle cx="${ccx}" cy="${ccy - 13}" r="2.5" fill="${c}" opacity="0.95" filter="url(#gs${id})"/>
 <circle cx="${ccx - rx * 0.9}" cy="${ccy - 8}" r="1.5" fill="${c}" opacity="0.7" filter="url(#gs${id})"/>
 <circle cx="${ccx + rx * 0.9}" cy="${ccy - 8}" r="1.5" fill="${c}" opacity="0.7" filter="url(#gs${id})"/>`;
 if (lv === 4) return base + `<path d="M${ccx - rx} ${ccy} L${ccx - rx} ${ccy - 8} L${ccx - rx * 0.7} ${ccy - 4} L${ccx - rx * 0.35} ${ccy - 11} L${ccx} ${ccy - 4} L${ccx + rx * 0.35} ${ccy - 11} L${ccx + rx * 0.7} ${ccy - 4} L${ccx + rx} ${ccy - 8} L${ccx + rx} ${ccy}" fill="url(#gld${id})" filter="url(#g${id})"/>
 <circle cx="${ccx}" cy="${ccy - 4}" r="1.8" fill="${c}" opacity="0.85" filter="url(#gs${id})"/>
 <circle cx="${ccx - rx * 0.35}" cy="${ccy - 12}" r="2" fill="${c}" opacity="0.9" filter="url(#gs${id})"/>
 <circle cx="${ccx + rx * 0.35}" cy="${ccy - 12}" r="2" fill="${c}" opacity="0.9" filter="url(#gs${id})"/>
 <circle cx="${ccx - rx * 0.9}" cy="${ccy - 9}" r="1.5" fill="${c}" opacity="0.7" filter="url(#gs${id})"/>
 <circle cx="${ccx + rx * 0.9}" cy="${ccy - 9}" r="1.5" fill="${c}" opacity="0.7" filter="url(#gs${id})"/>`;
 return base + `<path d="M${ccx - rx} ${ccy} L${ccx - rx} ${ccy - 10} L${ccx - rx * 0.75} ${ccy - 5} L${ccx - rx * 0.4} ${ccy - 14} L${ccx - rx * 0.15} ${ccy - 6} L${ccx} ${ccy - 17} L${ccx + rx * 0.15} ${ccy - 6} L${ccx + rx * 0.4} ${ccy - 14} L${ccx + rx * 0.75} ${ccy - 5} L${ccx + rx} ${ccy - 10} L${ccx + rx} ${ccy}" fill="url(#gld${id})" filter="url(#g${id})"/>
 <circle cx="${ccx}" cy="${ccy - 18}" r="2.8" fill="${c}" opacity="1" filter="url(#gs${id})"/>
 <circle cx="${ccx - rx * 0.4}" cy="${ccy - 15}" r="2.2" fill="${c}" opacity="0.9" filter="url(#gs${id})"/>
 <circle cx="${ccx + rx * 0.4}" cy="${ccy - 15}" r="2.2" fill="${c}" opacity="0.9" filter="url(#gs${id})"/>
 <circle cx="${ccx - rx * 0.95}" cy="${ccy - 11}" r="1.8" fill="${c}" opacity="0.8" filter="url(#gs${id})"/>
 <circle cx="${ccx + rx * 0.95}" cy="${ccy - 11}" r="1.8" fill="${c}" opacity="0.8" filter="url(#gs${id})"/>
 <rect x="${ccx - rx}" y="${ccy}" width="${rx * 2}" height="2" rx="1" fill="#fff8c0" opacity="0.3"/>`;
 }

 // Alias leggibili con stessa firma del codice originale
 const face = (_i, fcx, fcy, rx, ry, _c, b, h, bs) => _face(fcx, fcy, rx, ry, b, h, bs);
 const neckShoulders = (_i, ncx, top, sw, h) => _ns(ncx, top, sw, h);
 const clothBody = (_i, bcx, top, bw, bh, gr, f) => _clothBody(bcx, top, bw, bh, gr, f || 3);
 const arms = (_i, acx, sy, bw, al, _c, armored) => _arms(acx, sy, bw, al, armored);
 const cloak = (_i, scx, sy, bw, bh, gr, f) => _cloak(scx, sy, bw, bh, gr, f || 4);
 const breastplate = (_i, bcx, top, w, h, _c) => _bp(bcx, top, w, h);
 const helmet = (_i, hcx, hcy, rx, ry, _c, style) => _helm(hcx, hcy, rx, ry, style);
 const crown = (_i, ccx, ccy, rx, _c, lv) => _crown(ccx, ccy, rx, lv);

 // ---- Body SVG per titolo ----
 let svg = "";

 if (title === "MENDICANTE") {
 svg = `
 ${cloak(id,cx,62,34,60,"cl",3)}
 ${neckShoulders(id,cx,62,34,8,c)}
 ${face(id,cx,46,12,15,c,false,false,"normal")}
 <path d="M${cx-10} 80 L${cx-14} 90 L${cx-8} 88" fill="#0a0a14" opacity="0.5"/>
 <path d="M${cx+8} 85 L${cx+12} 95 L${cx+6} 93" fill="#0a0a14" opacity="0.5"/>
 <line x1="${cx+18}" y1="38" x2="${cx+14}" y2="125" stroke="url(#ac${id})" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
 <circle cx="${cx+18}" cy="38" r="2.5" fill="url(#ac${id})" opacity="0.5"/>
 <ellipse cx="${cx-8}" cy="124" rx="9" ry="4" fill="#2a1a0a" opacity="0.7"/>
 <ellipse cx="${cx+8}" cy="124" rx="9" ry="4" fill="#2a1a0a" opacity="0.7"/>`;
 } else if (title === "VAGABONDO") {
 svg = `
 ${cloak(id,cx,60,36,62,"cl",3)}
 <path d="M${cx-20} 55 Q${cx-22} 30 ${cx} 22 Q${cx+22} 30 ${cx+20} 55 Q${cx+14} 62 ${cx} 63 Q${cx-14} 62 ${cx-20} 55 Z" fill="url(#fab${id})" stroke="url(#ac${id})" stroke-width="0.7"/>
 <ellipse cx="${cx}" cy="48" rx="14" ry="17" fill="#040408" opacity="0.95"/>
 ${face(id,cx,46,9,12,c,false,true,"normal")}
 <rect x="${cx+18}" y="72" width="14" height="12" rx="3" fill="#2a1a08" stroke="url(#ac${id})" stroke-width="0.6" opacity="0.8"/>
 <line x1="${cx+16}" y1="65" x2="${cx+25}" y2="72" stroke="url(#ac${id})" stroke-width="0.8" opacity="0.5"/>`;
 } else if (title === "PASTORE") {
 svg = `
 ${cloak(id,cx,60,38,62,"cl",4)}
 ${neckShoulders(id,cx,60,38,8,c)}
 ${face(id,cx,44,11,14,c,false,false,"normal")}
 <path d="M${cx-22} 33 Q${cx} 10 ${cx+22} 33" fill="url(#fab${id})" stroke="url(#ac${id})" stroke-width="0.8" opacity="0.9"/>
 <path d="M${cx-22} 33 Q${cx} 30 ${cx+22} 33" fill="#1e1810" opacity="0.8"/>
 <path d="M${cx+20} 40 Q${cx+26} 32 ${cx+22} 26 Q${cx+18} 22 ${cx+14} 26" fill="none" stroke="url(#ac${id})" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
 <line x1="${cx+20}" y1="40" x2="${cx+16}" y2="125" stroke="url(#ac${id})" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
 <ellipse cx="${cx-8}" cy="124" rx="9" ry="4" fill="#2a1a08" opacity="0.8"/>
 <ellipse cx="${cx+8}" cy="124" rx="9" ry="4" fill="#2a1a08" opacity="0.8"/>`;
 } else if (title === "CONTADINO") {
 svg = `
 <path d="M${cx-18} 60 Q${cx-20} 80 ${cx-18} 122 L${cx+18} 122 Q${cx+20} 80 ${cx+18} 60 Z" fill="url(#cl${id})"/>
 <path d="M${cx-14} 60 Q${cx-12} 80 ${cx-10} 122 L${cx+10} 122 Q${cx+12} 80 ${cx+14} 60 Z" fill="#1a1218" opacity="0.6"/>
 <path d="M${cx-18} 62 Q${cx-26} 72 ${cx-24} 86" fill="url(#cl${id})" stroke="url(#ac${id})" stroke-width="0.5" opacity="0.8"/>
 <path d="M${cx+18} 62 Q${cx+26} 72 ${cx+24} 86" fill="url(#cl${id})" stroke="url(#ac${id})" stroke-width="0.5" opacity="0.8"/>
 <path d="M${cx-24} 86 Q${cx-26} 96 ${cx-22} 100" fill="none" stroke="#c08060" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
 <path d="M${cx+24} 86 Q${cx+26} 96 ${cx+22} 100" fill="none" stroke="#c08060" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
 <rect x="${cx-18}" y="88" width="36" height="5" rx="2" fill="#3a2010" stroke="url(#ac${id})" stroke-width="0.5"/>
 <rect x="${cx-3}" y="88" width="6" height="5" rx="1" fill="url(#ac${id})" opacity="0.6"/>
 ${neckShoulders(id,cx,60,36,7,c)}
 ${face(id,cx,44,11,14,c,false,false,"normal")}
 <path d="M${cx-13} 32 Q${cx-14} 20 ${cx} 18 Q${cx+14} 20 ${cx+13} 32" fill="#2a2010" stroke="url(#ac${id})" stroke-width="0.6"/>
 <path d="M${cx-18} 118 Q${cx-20} 122 ${cx-10} 126 L${cx-6} 126 L${cx-4} 118 Z" fill="#2a1808"/>
 <path d="M${cx+18} 118 Q${cx+20} 122 ${cx+10} 126 L${cx+6} 126 L${cx+4} 118 Z" fill="#2a1808"/>`;
 } else if (title === "FABBRO") {
 svg = `
 <path d="M${cx-16} 60 Q${cx-18} 85 ${cx-14} 122 L${cx+14} 122 Q${cx+18} 85 ${cx+16} 60 Z" fill="#3a2008" stroke="url(#ac${id})" stroke-width="0.6" opacity="0.9"/>
 <path d="M${cx-20} 60 Q${cx-22} 80 ${cx-20} 122 L${cx+20} 122 Q${cx+22} 80 ${cx+20} 60 Z" fill="url(#cl${id})" opacity="0.5"/>
 <path d="M${cx-20} 63 Q${cx-32} 74 ${cx-28} 92" fill="#3a2008" stroke="url(#ac${id})" stroke-width="0.6" opacity="0.9"/>
 <path d="M${cx+20} 63 Q${cx+32} 74 ${cx+28} 92" fill="#3a2008" stroke="url(#ac${id})" stroke-width="0.6" opacity="0.9"/>
 <path d="M${cx-28} 92 Q${cx-30} 104 ${cx-24} 108" fill="none" stroke="#b07850" stroke-width="5" stroke-linecap="round"/>
 <path d="M${cx+28} 92 Q${cx+30} 104 ${cx+24} 108" fill="none" stroke="#b07850" stroke-width="5" stroke-linecap="round"/>
 <line x1="${cx+24}" y1="108" x2="${cx+20}" y2="122" stroke="#5a4020" stroke-width="2" opacity="0.8"/>
 <rect x="${cx+15}" y="118" width="10" height="6" rx="1" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.5"/>
 <path d="M${cx-12} 62 L${cx-10} 60" stroke="url(#ac${id})" stroke-width="1" opacity="0.5"/>
 <path d="M${cx+12} 62 L${cx+10} 60" stroke="url(#ac${id})" stroke-width="1" opacity="0.5"/>
 ${neckShoulders(id,cx,60,40,7,c)}
 ${face(id,cx,43,12,15,c,true,false,"stern")}
 <rect x="${cx-14}" y="30" width="28" height="4" rx="2" fill="#3a2008" stroke="url(#ac${id})" stroke-width="0.5"/>
 <path d="M${cx-20} 118 Q${cx-22} 124 ${cx-10} 128 L${cx-4} 128 L${cx-2} 118 Z" fill="#2a1808"/>
 <path d="M${cx+20} 118 Q${cx+22} 124 ${cx+10} 128 L${cx+4} 128 L${cx+2} 118 Z" fill="#2a1808"/>`;
 } else if (title === "RECLUTA") {
 svg = `
 ${clothBody(id,cx,62,36,60,"cl",3)}
 ${arms(id,cx,62,36,44,c,false)}
 <path d="M${cx-16} 62 Q${cx-18} 82 ${cx-14} 100 L${cx+14} 100 Q${cx+18} 82 ${cx+16} 62 Z" fill="url(#met${id})" opacity="0.6"/>
 <path d="M${cx-14} 70 Q${cx} 68 ${cx+14} 70" fill="none" stroke="#4a4a5a" stroke-width="0.4" opacity="0.4"/>
 <path d="M${cx-14} 78 Q${cx} 76 ${cx+14} 78" fill="none" stroke="#4a4a5a" stroke-width="0.4" opacity="0.4"/>
 <path d="M${cx-14} 86 Q${cx} 84 ${cx+14} 86" fill="none" stroke="#4a4a5a" stroke-width="0.4" opacity="0.4"/>
 ${neckShoulders(id,cx,62,36,8,c)}
 ${face(id,cx,44,11,14,c,false,false,"normal")}
 ${helmet(id,cx,44,13,15,c,"open")}
 <line x1="${cx+18}" y1="92" x2="${cx+22}" y2="118" stroke="url(#met${id})" stroke-width="2" opacity="0.8"/>
 <rect x="${cx+15}" y="90" width="8" height="3" rx="1" fill="#3a2808" opacity="0.8"/>
 <path d="M${cx-16} 118 Q${cx-18} 124 ${cx-8} 128 L${cx-2} 128 L${cx} 118 Z" fill="#2a1a0a"/>
 <path d="M${cx+16} 118 Q${cx+18} 124 ${cx+8} 128 L${cx+2} 128 L${cx} 118 Z" fill="#2a1a0a"/>`;
 } else if (title === "RAMINGO") {
 svg = `
 ${cloak(id,cx,58,38,64,"cl",5)}
 <path d="M${cx-20} 52 Q${cx-22} 24 ${cx} 16 Q${cx+22} 24 ${cx+20} 52 Q${cx+14} 60 ${cx} 62 Q${cx-14} 60 ${cx-20} 52 Z" fill="#0c0c18" stroke="url(#ac${id})" stroke-width="0.9" filter="url(#g${id})"/>
 <ellipse cx="${cx}" cy="46" rx="15" ry="20" fill="#030306" opacity="0.98"/>
 ${face(id,cx,46,9,13,c,false,true,"stern")}
 <path d="M${cx+24} 20 Q${cx+30} 68 ${cx+24} 116" fill="none" stroke="#5a3010" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
 <path d="M${cx+24} 22 Q${cx+18} 68 ${cx+24} 114" fill="none" stroke="#8a6030" stroke-width="0.8" opacity="0.5"/>
 <rect x="${cx+14}" y="28" width="8" height="22" rx="3" fill="#3a2010" stroke="url(#ac${id})" stroke-width="0.5" opacity="0.8"/>
 <line x1="${cx+16}" y1="28" x2="${cx+16}" y2="50" stroke="url(#ac${id})" stroke-width="0.5" opacity="0.4"/>
 <path d="M${cx-16} 118 Q${cx-18} 126 ${cx-6} 128 L${cx-2} 128 L${cx} 118 Z" fill="#1a1008"/>
 <path d="M${cx+16} 118 Q${cx+18} 126 ${cx+6} 128 L${cx+2} 128 L${cx} 118 Z" fill="#1a1008"/>`;
 } else if (title === "MERCENARIO") {
 svg = `
 ${clothBody(id,cx,60,38,62,"cl",4)}
 ${arms(id,cx,60,38,42,c,true)}
 <path d="M${cx-18} 60 Q${cx-20} 82 ${cx-16} 108 L${cx+16} 108 Q${cx+20} 82 ${cx+18} 60 Z" fill="#2a1808" stroke="url(#ac${id})" stroke-width="0.7" opacity="0.9"/>
 ${Array.from({length:5},(_,i)=>`<circle cx="${cx-12+i*6}" cy="${68+i%2*8}" r="1.2" fill="url(#ac${id})" opacity="0.6"/>`).join("")}
 ${Array.from({length:5},(_,i)=>`<circle cx="${cx-12+i*6}" cy="${84+i%2*8}" r="1.2" fill="url(#ac${id})" opacity="0.6"/>`).join("")}
 <rect x="${cx-18}" y="96" width="36" height="6" rx="2" fill="#3a2010" stroke="url(#ac${id})" stroke-width="0.6"/>
 <rect x="${cx+10}" y="97" width="8" height="8" rx="2" fill="#2a1808" stroke="url(#ac${id})" stroke-width="0.5"/>
 <rect x="${cx-22}" y="96" width="6" height="3" rx="1" fill="url(#met${id})"/>
 <line x1="${cx-19}" y1="99" x2="${cx-18}" y2="120" stroke="url(#met${id})" stroke-width="2" opacity="0.8"/>
 ${neckShoulders(id,cx,60,38,8,c)}
 ${face(id,cx,43,11,14,c,true,false,"stern")}
 <path d="M${cx-12} 30 Q${cx-14} 18 ${cx} 16 Q${cx+14} 18 ${cx+12} 30" fill="#2a1808" opacity="0.8"/>
 <path d="M${cx-4} 42 L${cx-2} 48" stroke="#8a4020" stroke-width="0.7" opacity="0.6"/>`;
 } else if (title === "SCUDIERO") {
 svg = `
 ${clothBody(id,cx,60,38,62,"cl",3)}
 ${arms(id,cx,60,38,42,c,true)}
 <path d="M${cx-16} 60 Q${cx-18} 82 ${cx-14} 108 L${cx+14} 108 Q${cx+18} 82 ${cx+16} 60 Z" fill="#1a0a28" stroke="url(#ac${id})" stroke-width="0.7"/>
 <path d="M${cx-4} 60 L${cx-4} 108 L${cx+4} 108 L${cx+4} 60 Z" fill="url(#ac${id})" opacity="0.3"/>
 <path d="M${cx-34} 62 Q${cx-40} 75 ${cx-36} 90 Q${cx-30} 100 ${cx-26} 90 L${cx-26} 64 Z" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.8"/>
 <path d="M${cx-33} 64 Q${cx-38} 75 ${cx-35} 88 Q${cx-30} 96 ${cx-27} 88 L${cx-27} 66 Z" fill="url(#acr${id})" opacity="0.35"/>
 <circle cx="${cx-31}" cy="78" r="4" fill="url(#met${id})"/>
 <circle cx="${cx-31}" cy="78" r="2" fill="url(#meth${id})" opacity="0.6"/>
 ${neckShoulders(id,cx,60,38,8,c)}
 ${face(id,cx,43,11,14,c,false,false,"normal")}
 ${helmet(id,cx,43,13,15,c,"open")}`;
 } else if (title === "SPADACCINO") {
 svg = `
 ${clothBody(id,cx,60,36,62,"cl",4)}
 <path d="M${cx-16} 60 Q${cx-18} 84 ${cx-14} 108 L${cx+14} 108 Q${cx+18} 84 ${cx+16} 60 Z" fill="#1e1228" stroke="url(#ac${id})" stroke-width="0.7" opacity="0.9"/>
 <ellipse cx="${cx-18}" cy="63" rx="8" ry="5" fill="#2a183a" stroke="url(#ac${id})" stroke-width="0.5"/>
 <ellipse cx="${cx+18}" cy="63" rx="8" ry="5" fill="#2a183a" stroke="url(#ac${id})" stroke-width="0.5"/>
 <path d="M${cx+18} 63 Q${cx+30} 74 ${cx+28} 90" fill="none" stroke="url(#cl${id})" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
 <circle cx="${cx+28}" cy="92" r="4" fill="url(#sk${id})"/>
 <line x1="${cx+28}" y1="92" x2="${cx+38}" y2="50" stroke="url(#meth${id})" stroke-width="1.5" opacity="0.9"/>
 <line x1="${cx+24}" y1="92" x2="${cx+32}" y2="92" stroke="url(#met${id})" stroke-width="2" opacity="0.8"/>
 <path d="M${cx-18} 63 Q${cx-28} 74 ${cx-26} 92" fill="none" stroke="url(#cl${id})" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
 <rect x="${cx-16}" y="94" width="32" height="5" rx="2" fill="#3a2010"/>
 <rect x="${cx+8}" y="98" width="4" height="22" rx="1" fill="#2a1808" opacity="0.8"/>
 ${neckShoulders(id,cx,60,36,7,c)}
 ${face(id,cx,43,11,14,c,false,false,"stern")}
 <path d="M${cx-16} 30 Q${cx-14} 20 ${cx} 18 Q${cx+14} 20 ${cx+16} 30" fill="#1a0e08" stroke="url(#ac${id})" stroke-width="0.6"/>
 <path d="M${cx-16} 30 L${cx+16} 30" stroke="url(#ac${id})" stroke-width="1" opacity="0.4"/>
 <path d="M${cx+16} 30 Q${cx+28} 20 ${cx+24} 12 Q${cx+22} 18 ${cx+16} 24" fill="url(#ac${id})" opacity="0.5"/>`;
 } else if (title === "GLADIATORE") {
 svg = `
 <path d="M${cx-18} 60 Q${cx-20} 82 ${cx-16} 108 L${cx+16} 108 Q${cx+20} 82 ${cx+18} 60 Z" fill="url(#skd${id})" opacity="0.9"/>
 <ellipse cx="${cx-5}" cy="72" rx="4" ry="5" fill="#8a5030" opacity="0.3"/>
 <ellipse cx="${cx+5}" cy="72" rx="4" ry="5" fill="#8a5030" opacity="0.3"/>
 <ellipse cx="${cx-5}" cy="83" rx="4" ry="5" fill="#8a5030" opacity="0.3"/>
 <ellipse cx="${cx+5}" cy="83" rx="4" ry="5" fill="#8a5030" opacity="0.3"/>
 <ellipse cx="${cx-4}" cy="65" rx="6" ry="4" fill="#d4a07a" opacity="0.25"/>
 <path d="M${cx-18} 63 Q${cx-30} 76 ${cx-28} 92" fill="#3a2010" stroke="url(#ac${id})" stroke-width="0.8" opacity="0.9"/>
 <path d="M${cx+18} 63 Q${cx+32} 74 ${cx+30} 98" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.8" opacity="0.9"/>
 <path d="M${cx+22} 70 Q${cx+30} 74 ${cx+28} 80" fill="none" stroke="url(#meth${id})" stroke-width="1.2" opacity="0.6"/>
 <path d="M${cx+24} 80 Q${cx+32} 82 ${cx+30} 90" fill="none" stroke="url(#meth${id})" stroke-width="1.2" opacity="0.6"/>
 <line x1="${cx+30}" y1="100" x2="${cx+34}" y2="120" stroke="url(#meth${id})" stroke-width="2.5" opacity="0.9"/>
 <rect x="${cx+26}" y="98" width="9" height="3" rx="1" fill="url(#met${id})"/>
 <path d="M${cx-16} 96 Q${cx} 92 ${cx+16} 96 Q${cx+18} 110 ${cx+14} 120 L${cx-14} 120 Q${cx-18} 110 ${cx-16} 96 Z" fill="#3a2010" stroke="url(#ac${id})" stroke-width="0.5" opacity="0.9"/>
 ${Array.from({length:5},(_,i)=>`<line x1="${cx-12+i*6}" y1="98" x2="${cx-12+i*5}" y2="120" stroke="#2a1808" stroke-width="0.6" opacity="0.5"/>`).join("")}
 <path d="M${cx-14} 120 Q${cx-16} 126 ${cx-6} 128 L${cx-2} 128 L${cx} 120 Z" fill="#3a2010"/>
 <path d="M${cx+14} 120 Q${cx+16} 126 ${cx+6} 128 L${cx+2} 128 L${cx} 120 Z" fill="#3a2010"/>
 <line x1="${cx-14}" y1="122" x2="${cx-4}" y2="124" stroke="url(#ac${id})" stroke-width="0.5" opacity="0.5"/>
 <line x1="${cx+14}" y1="122" x2="${cx+4}" y2="124" stroke="url(#ac${id})" stroke-width="0.5" opacity="0.5"/>
 ${neckShoulders(id,cx,60,36,7,c)}
 ${face(id,cx,42,12,15,c,false,false,"stern")}
 ${helmet(id,cx,42,14,16,c,"gladiator")}`;
 } else if (title === "VETERANO") {
 svg = `
 ${cloak(id,cx,60,38,62,"cl",4)}
 ${arms(id,cx,60,38,42,c,true)}
 <path d="M${cx-17} 60 Q${cx-19} 82 ${cx-15} 108 L${cx+15} 108 Q${cx+19} 82 ${cx+17} 60 Z" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.7" opacity="0.85"/>
 <path d="M${cx-10} 68 L${cx-6} 74" stroke="#0a0a12" stroke-width="1" opacity="0.5"/>
 <path d="M${cx+5} 80 L${cx+9} 86" stroke="#0a0a12" stroke-width="1" opacity="0.5"/>
 <ellipse cx="${cx+8}" cy="72" rx="3" ry="2" fill="#0a0a12" opacity="0.3"/>
 ${neckShoulders(id,cx,60,38,7,c)}
 ${face(id,cx,43,11,14,c,true,false,"stern")}
 ${helmet(id,cx,43,13,15,c,"open")}
 <path d="M${cx-14} 42 Q${cx-8} 40 ${cx-4} 43" fill="none" stroke="#1a0a00" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
 <ellipse cx="${cx-9}" cy="42" rx="5" ry="3" fill="#1a0a00" opacity="0.7"/>
 <path d="M${cx+6} 38 L${cx+4} 50" stroke="#8a3018" stroke-width="0.8" opacity="0.6"/>`;
 } else if (title === "PALADINO") {
 svg = `
 ${cloak(id,cx,58,40,64,"ncl",4)}
 ${arms(id,cx,58,40,42,c,true)}
 ${breastplate(id,cx,60,32,48,c)}
 <line x1="${cx}" y1="64" x2="${cx}" y2="88" stroke="url(#ac${id})" stroke-width="1.5" opacity="0.8" filter="url(#g${id})"/>
 <line x1="${cx-8}" y1="74" x2="${cx+8}" y2="74" stroke="url(#ac${id})" stroke-width="1.5" opacity="0.8" filter="url(#g${id})"/>
 ${neckShoulders(id,cx,58,40,8,c)}
 ${face(id,cx,40,11,14,c,false,false,"noble")}
 ${helmet(id,cx,40,14,17,c,"full")}
 <ellipse cx="${cx}" cy="38" rx="18" ry="22" fill="url(#ac${id})" opacity="0.06" filter="url(#gs${id})"/>
 <path d="M${cx-14} 62 L${cx-12} 108 L${cx+12} 108 L${cx+14} 62 Z" fill="#e8e0d0" opacity="0.12"/>`;
 } else if (title === "CAVALIERE") {
 svg = `
 ${cloak(id,cx,57,42,65,"ncl",5)}
 ${arms(id,cx,57,42,40,c,true)}
 ${breastplate(id,cx,59,34,50,c)}
 <path d="M${cx-25} 58 Q${cx-32} 66 ${cx-28} 78 Q${cx-22} 82 ${cx-18} 74 L${cx-18} 60 Z" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.7"/>
 <path d="M${cx+25} 58 Q${cx+32} 66 ${cx+28} 78 Q${cx+22} 82 ${cx+18} 74 L${cx+18} 60 Z" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.7"/>
 <rect x="${cx+10}" y="68" width="10" height="3" rx="1" fill="url(#met${id})" opacity="0.9"/>
 <line x1="${cx+15}" y1="71" x2="${cx+12}" y2="108" stroke="url(#gld${id})" stroke-width="1.5" opacity="0.7"/>
 ${neckShoulders(id,cx,57,42,8,c)}
 ${face(id,cx,39,11,14,c,false,false,"noble")}
 ${helmet(id,cx,39,14,17,c,"full")}
 <path d="M${cx-8} 72 Q${cx} 68 ${cx+8} 72 Q${cx+8} 84 ${cx} 88 Q${cx-8} 84 ${cx-8} 72 Z" fill="url(#ac${id})" opacity="0.25"/>`;
 } else if (title === "CAMPIONE") {
 svg = `
 ${cloak(id,cx,56,42,66,"ncl",5)}
 ${arms(id,cx,56,42,40,c,true)}
 ${breastplate(id,cx,58,34,50,c)}
 <circle cx="${cx}" cy="78" r="7" fill="url(#gld${id})" stroke="url(#ac${id})" stroke-width="0.8" filter="url(#g${id})"/>
 <circle cx="${cx}" cy="78" r="4" fill="url(#gldr${id})" opacity="0.8"/>
 <path d="M${cx-10} 78 Q${cx-8} 72 ${cx} 70 Q${cx+8} 72 ${cx+10} 78" fill="none" stroke="url(#ac${id})" stroke-width="0.8" opacity="0.6"/>
 <path d="M${cx-26} 57 Q${cx-34} 66 ${cx-30} 82 Q${cx-23} 86 ${cx-18} 76 L${cx-18} 59 Z" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.8"/>
 <path d="M${cx+26} 57 Q${cx+34} 66 ${cx+30} 82 Q${cx+23} 86 ${cx+18} 76 L${cx+18} 59 Z" fill="url(#met${id})" stroke="url(#ac${id})" stroke-width="0.8"/>
 ${neckShoulders(id,cx,56,42,8,c)}
 ${face(id,cx,38,11,14,c,false,false,"noble")}
 ${helmet(id,cx,38,14,17,c,"full")}`;
 } else if (title === "GENERALE") {
 svg = `
 ${cloak(id,cx,55,44,67,"ncl",5)}
 ${arms(id,cx,55,44,40,c,true)}
 ${breastplate(id,cx,57,36,52,c)}
 <path d="M${cx-18} 58 Q${cx} 62 ${cx+18} 58 L${cx+14} 108 L${cx-14} 108 Z" fill="url(#ac${id})" opacity="0.2"/>
 <rect x="${cx-28}" y="56" width="10" height="6" rx="2" fill="url(#gld${id})" filter="url(#g${id})"/>
 <rect x="${cx+18}" y="56" width="10" height="6" rx="2" fill="url(#gld${id})" filter="url(#g${id})"/>
 ${helmet(id,cx,37,14,17,c,"full")}
 <path d="M${cx} ${37-17} Q${cx-8} ${37-28} ${cx-4} ${37-38} Q${cx-2} ${37-30} ${cx+2} ${37-20}" fill="url(#ac${id})" opacity="0.7" filter="url(#g${id})"/>
 <path d="M${cx} ${37-17} Q${cx+6} ${37-26} ${cx+2} ${37-36}" fill="url(#ac${id})" opacity="0.4"/>
 ${neckShoulders(id,cx,55,44,8,c)}
 ${face(id,cx,37,11,14,c,false,false,"noble")}`;
 } else if (title === "BARONE") {
 svg = `
 ${cloak(id,cx,55,42,67,"ncl",5)}
 ${arms(id,cx,55,42,40,c,false)}
 <path d="M${cx-18} 55 Q${cx-20} 80 ${cx-16} 110 L${cx+16} 110 Q${cx+20} 80 ${cx+18} 55 Z" fill="url(#ncl${id})" stroke="url(#ac${id})" stroke-width="0.6"/>
 <path d="M${cx-18} 55 Q${cx-20} 80 ${cx-16} 110 L${cx+16} 110 Q${cx+20} 80 ${cx+18} 55 Z" fill="url(#nclh${id})" opacity="0.5"/>
 ${Array.from({length:5},(_,i)=>`<circle cx="${cx}" cy="${62+i*9}" r="1.5" fill="url(#gld${id})" opacity="0.8"/>`).join("")}
 <path d="M${cx-18} 55 Q${cx} 50 ${cx+18} 55 Q${cx+14} 62 ${cx} 64 Q${cx-14} 62 ${cx-18} 55 Z" fill="url(#fur${id})" opacity="0.9"/>
 <circle cx="${cx-10}" cy="57" r="1" fill="#1a1a1a" opacity="0.6"/>
 <circle cx="${cx-4}" cy="59" r="0.8" fill="#1a1a1a" opacity="0.6"/>
 <circle cx="${cx+6}" cy="57" r="1" fill="#1a1a1a" opacity="0.6"/>
 <circle cx="${cx+12}" cy="58" r="0.8" fill="#1a1a1a" opacity="0.6"/>
 ${neckShoulders(id,cx,55,42,8,c)}
 ${face(id,cx,38,11,14,c,false,false,"noble")}
 ${crown(id,cx,28,12,c,1)}
 <ellipse cx="${cx-28}" cy="97" rx="5" ry="3" fill="#2a1808" opacity="0.8"/>
 <ellipse cx="${cx+28}" cy="97" rx="5" ry="3" fill="#2a1808" opacity="0.8"/>`;
 } else if (title === "VISCONTE") {
 svg = `
 ${cloak(id,cx,54,44,68,"ncl",5)}
 ${arms(id,cx,54,44,38,c,false)}
 <path d="M${cx-20} 54 Q${cx-22} 82 ${cx-18} 112 L${cx+18} 112 Q${cx+22} 82 ${cx+20} 54 Z" fill="url(#ncl${id})" stroke="url(#ac${id})" stroke-width="0.7"/>
 <path d="M${cx-20} 54 Q${cx-22} 82 ${cx-18} 112 L${cx+18} 112 Q${cx+22} 82 ${cx+20} 54 Z" fill="url(#nclh${id})" opacity="0.5"/>
 <path d="M${cx-18} 110 Q${cx} 107 ${cx+18} 110" fill="url(#fur${id})" opacity="0.7"/>
 <path d="M${cx-14} 56 Q${cx} 52 ${cx+14} 56 Q${cx+10} 62 ${cx} 64 Q${cx-10} 62 ${cx-14} 56 Z" fill="none" stroke="url(#gld${id})" stroke-width="1.5" opacity="0.7" filter="url(#g${id})"/>
 <circle cx="${cx}" cy="64" r="3" fill="url(#gld${id})" opacity="0.8" filter="url(#g${id})"/>
 <path d="M${cx-20} 54 Q${cx-22} 82 ${cx-18} 112" fill="none" stroke="url(#gld${id})" stroke-width="0.8" opacity="0.4"/>
 <path d="M${cx+20} 54 Q${cx+22} 82 ${cx+18} 112" fill="none" stroke="url(#gld${id})" stroke-width="0.8" opacity="0.4"/>
 ${neckShoulders(id,cx,54,44,8,c)}
 ${face(id,cx,37,11,14,c,false,false,"noble")}
 ${crown(id,cx,26,12,c,2)}`;
 } else if (title === "CONTE") {
 svg = `
 ${cloak(id,cx,53,46,69,"ncl",6)}
 ${arms(id,cx,53,46,38,c,false)}
 <path d="M${cx-21} 53 Q${cx-24} 84 ${cx-20} 114 L${cx+20} 114 Q${cx+24} 84 ${cx+21} 53 Z" fill="url(#ncl${id})" stroke="url(#ac${id})" stroke-width="0.7"/>
 <path d="M${cx-21} 53 Q${cx-24} 84 ${cx-20} 114 L${cx+20} 114 Q${cx+24} 84 ${cx+21} 53 Z" fill="url(#nclh${id})" opacity="0.6"/>
 <path d="M${cx-20} 53 Q${cx} 48 ${cx+20} 53 Q${cx+15} 63 ${cx} 65 Q${cx-15} 63 ${cx-20} 53 Z" fill="url(#fur${id})" opacity="0.9"/>
 ${Array.from({length:6},(_,i)=>`<circle cx="${cx-14+i*6}" cy="${55+i%2*3}" r="${0.8+i%2*0.3}" fill="#1a1a1a" opacity="0.6"/>`).join("")}
 <path d="M${cx-3} 65 L${cx-2} 113" stroke="url(#gld${id})" stroke-width="0.7" opacity="0.5"/>
 <path d="M${cx+3} 65 L${cx+2} 113" stroke="url(#gld${id})" stroke-width="0.7" opacity="0.5"/>
 ${Array.from({length:4},(_,i)=>`<rect x="${cx-3}" y="${70+i*11}" width="6" height="3" rx="1" fill="url(#gld${id})" opacity="0.4"/>`).join("")}
 <circle cx="${cx+30}" cy="92" r="2.5" fill="url(#gld${id})" filter="url(#g${id})"/>
 ${neckShoulders(id,cx,53,46,8,c)}
 ${face(id,cx,36,11,14,c,false,false,"noble")}
 ${crown(id,cx,24,13,c,3)}`;
 } else if (title === "MARCHESE") {
 svg = `
 ${cloak(id,cx,52,48,70,"ncl",6)}
 ${arms(id,cx,52,48,36,c,false)}
 <path d="M${cx-22} 52 Q${cx-26} 86 ${cx-22} 116 L${cx+22} 116 Q${cx+26} 86 ${cx+22} 52 Z" fill="url(#ncl${id})" stroke="url(#ac${id})" stroke-width="0.8"/>
 <path d="M${cx-22} 52 Q${cx-26} 86 ${cx-22} 116 L${cx+22} 116 Q${cx+26} 86 ${cx+22} 52 Z" fill="url(#nclh${id})" opacity="0.7"/>
 <path d="M${cx-22} 52 Q${cx} 46 ${cx+22} 52 Q${cx+16} 65 ${cx} 67 Q${cx-16} 65 ${cx-22} 52 Z" fill="url(#fur${id})" opacity="0.95"/>
 ${Array.from({length:8},(_,i)=>`<circle cx="${cx-18+i*5.5}" cy="${54+i%3*3}" r="${0.7+i%2*0.4}" fill="#111" opacity="0.7"/>`).join("")}
 <path d="M${cx-22} 52 Q${cx-26} 86 ${cx-22} 116" fill="none" stroke="url(#gld${id})" stroke-width="1.2" opacity="0.5"/>
 <path d="M${cx+22} 52 Q${cx+26} 86 ${cx+22} 116" fill="none" stroke="url(#gld${id})" stroke-width="1.2" opacity="0.5"/>
 <rect x="${cx+20}" y="78" width="8" height="3" rx="1.5" fill="url(#gld${id})" filter="url(#g${id})"/>
 <line x1="${cx+24}" y1="81" x2="${cx+22}" y2="110" stroke="url(#gld${id})" stroke-width="1.2" opacity="0.6"/>
 ${neckShoulders(id,cx,52,48,8,c)}
 ${face(id,cx,35,12,15,c,false,false,"noble")}
 ${crown(id,cx,22,14,c,3)}`;
 } else if (title === "DUCA") {
 svg = `
 ${cloak(id,cx,51,50,71,"ncl",7)}
 ${arms(id,cx,51,50,36,c,false)}
 <path d="M${cx-24} 51 Q${cx-28} 88 ${cx-26} 120 L${cx+26} 120 Q${cx+28} 88 ${cx+24} 51 Z" fill="url(#ncl${id})" stroke="url(#ac${id})" stroke-width="0.9"/>
 <path d="M${cx-24} 51 Q${cx-28} 88 ${cx-26} 120 L${cx+26} 120 Q${cx+28} 88 ${cx+24} 51 Z" fill="url(#nclh${id})" opacity="0.7"/>
 <path d="M${cx-24} 51 Q${cx} 44 ${cx+24} 51 Q${cx+18} 66 ${cx} 68 Q${cx-18} 66 ${cx-24} 51 Z" fill="url(#fur${id})" opacity="0.96"/>
 ${Array.from({length:10},(_,i)=>`<circle cx="${cx-20+i*4.5}" cy="${53+i%3*3}" r="${0.7+i%2*0.5}" fill="#0a0a0a" opacity="0.7"/>`).join("")}
 ${Array.from({length:4},(_,i)=>`<path d="M${cx-20} ${75+i*12} Q${cx} ${72+i*12} ${cx+20} ${75+i*12}" fill="none" stroke="url(#gld${id})" stroke-width="0.6" opacity="0.4"/>`).join("")}
 <circle cx="${cx}" cy="82" r="6" fill="url(#gld${id})" opacity="0.5" filter="url(#g${id})"/>
 <circle cx="${cx}" cy="82" r="3.5" fill="url(#gldr${id})" opacity="0.7"/>
 ${neckShoulders(id,cx,51,50,8,c)}
 ${face(id,cx,33,12,15,c,false,false,"noble")}
 ${crown(id,cx,20,14,c,4)}`;
 } else if (title === "ARCIDUCA") {
 svg = `
 ${cloak(id,cx,50,52,72,"ncl",7)}
 ${arms(id,cx,50,52,35,c,false)}
 <path d="M${cx-26} 50 Q${cx-30} 90 ${cx-28} 122 L${cx+28} 122 Q${cx+30} 90 ${cx+26} 50 Z" fill="url(#ncl${id})" stroke="url(#ac${id})" stroke-width="1"/>
 <path d="M${cx-26} 50 Q${cx-30} 90 ${cx-28} 122 L${cx+28} 122 Q${cx+30} 90 ${cx+26} 50 Z" fill="url(#nclh${id})" opacity="0.8"/>
 <path d="M${cx-26} 50 Q${cx} 42 ${cx+26} 50 Q${cx+20} 68 ${cx} 70 Q${cx-20} 68 ${cx-26} 50 Z" fill="url(#fur${id})" opacity="0.97"/>
 ${Array.from({length:12},(_,i)=>`<circle cx="${cx-22+i*4}" cy="${52+i%4*3}" r="${0.7+i%2*0.5}" fill="#080808" opacity="0.75"/>`).join("")}
 <line x1="${cx+28}" y1="56" x2="${cx+24}" y2="108" stroke="url(#gld${id})" stroke-width="2.5" opacity="0.8" filter="url(#g${id})"/>
 <path d="M${cx+22} 52 Q${cx+24} 48 ${cx+28} 50 Q${cx+32} 52 ${cx+30} 56 Q${cx+26} 58 ${cx+22} 52 Z" fill="url(#gld${id})" filter="url(#g${id})"/>
 <circle cx="${cx+26}" cy="50" r="3" fill="${c}" opacity="0.9" filter="url(#gs${id})"/>
 <circle cx="${cx-28}" cy="90" r="7" fill="url(#gld${id})" opacity="0.6" filter="url(#g${id})"/>
 <circle cx="${cx-28}" cy="90" r="4" fill="${c}" opacity="0.4" filter="url(#gs${id})"/>
 ${neckShoulders(id,cx,50,52,8,c)}
 ${face(id,cx,32,12,15,c,false,false,"noble")}
 ${crown(id,cx,18,14,c,4)}`;
 } else if (title === "PRINCIPE") {
 svg = `
 ${cloak(id,cx,49,54,73,"ncl",8)}
 ${arms(id,cx,49,54,35,c,false)}
 <path d="M${cx-27} 49 Q${cx-32} 92 ${cx-30} 124 L${cx+30} 124 Q${cx+32} 92 ${cx+27} 49 Z" fill="url(#ncl${id})" stroke="url(#ac${id})" stroke-width="1"/>
 <path d="M${cx-27} 49 Q${cx-32} 92 ${cx-30} 124 L${cx+30} 124 Q${cx+32} 92 ${cx+27} 49 Z" fill="url(#nclh${id})" opacity="0.8"/>
 <path d="M${cx-14} 52 Q${cx-16} 72 ${cx-12} 86 L${cx+12} 86 Q${cx+16} 72 ${cx+14} 52 Q${cx} 48 ${cx-14} 52 Z" fill="url(#met${id})" opacity="0.85"/>
 <path d="M${cx-14} 52 Q${cx-16} 72 ${cx-12} 86 L${cx+12} 86 Q${cx+16} 72 ${cx+14} 52 Q${cx} 48 ${cx-14} 52 Z" fill="url(#acr${id})" opacity="0.3"/>
 <path d="M${cx-6} 58 Q${cx} 54 ${cx+6} 58 Q${cx+6} 70 ${cx} 74 Q${cx-6} 70 ${cx-6} 58 Z" fill="url(#ac${id})" opacity="0.4" filter="url(#g${id})"/>
 <path d="M${cx-27} 49 Q${cx} 40 ${cx+27} 49 Q${cx+20} 68 ${cx} 71 Q${cx-20} 68 ${cx-27} 49 Z" fill="url(#fur${id})" opacity="0.97"/>
 ${Array.from({length:14},(_,i)=>`<circle cx="${cx-24+i*3.8}" cy="${51+i%4*3}" r="${0.6+i%2*0.5}" fill="#060606" opacity="0.8"/>`).join("")}
 ${neckShoulders(id,cx,49,54,8,c)}
 ${face(id,cx,31,12,15,c,false,false,"noble")}
 ${crown(id,cx,17,15,c,5)}`;
 } else if (title === "RE") {
 svg = `
 <path d="M${cx-32} 48 Q${cx-42} 88 ${cx-38} 126 L${cx+38} 126 Q${cx+42} 88 ${cx+32} 48 Z" fill="url(#ncl${id})" stroke="url(#ac${id})" stroke-width="1.1"/>
 <path d="M${cx-32} 48 Q${cx-42} 88 ${cx-38} 126 L${cx+38} 126 Q${cx+42} 88 ${cx+32} 48 Z" fill="url(#nclh${id})" opacity="0.85"/>
 ${breastplate(id,cx,52,34,50,c)}
 <path d="M${cx-14} 55 Q${cx-10} 52 ${cx-6} 55 Q${cx-10} 58 ${cx-14} 55" fill="none" stroke="url(#ac${id})" stroke-width="0.7" opacity="0.5"/>
 <path d="M${cx-32} 48 Q${cx} 38 ${cx+32} 48 Q${cx+24} 70 ${cx} 73 Q${cx-24} 70 ${cx-32} 48 Z" fill="url(#fur${id})" opacity="0.98"/>
 ${Array.from({length:16},(_,i)=>`<circle cx="${cx-28+i*3.8}" cy="${50+i%4*3}" r="${0.6+i%2*0.6}" fill="#050505" opacity="0.85"/>`).join("")}
 <line x1="${cx+30}" y1="54" x2="${cx+26}" y2="110" stroke="url(#gld${id})" stroke-width="3" opacity="0.85" filter="url(#g${id})"/>
 <path d="M${cx+24} 48 Q${cx+26} 44 ${cx+30} 46 Q${cx+34} 48 ${cx+32} 54 Q${cx+28} 57 ${cx+24} 48 Z" fill="url(#gld${id})" filter="url(#g${id})"/>
 <circle cx="${cx+28}" cy="44" r="4" fill="${c}" opacity="1" filter="url(#gs${id})"/>
 <circle cx="${cx-30}" cy="86" r="9" fill="url(#gld${id})" opacity="0.7" filter="url(#g${id})"/>
 <path d="M${cx-30} 77 L${cx-30} 95 M${cx-39} 86 L${cx-21} 86" stroke="url(#ac${id})" stroke-width="0.7" opacity="0.6"/>
 <circle cx="${cx-30}" cy="86" r="5" fill="${c}" opacity="0.3" filter="url(#gs${id})"/>
 ${neckShoulders(id,cx,48,54,9,c)}
 ${face(id,cx,30,12,15,c,true,false,"noble")}
 ${crown(id,cx,16,16,c,5)}`;
 } else if (title === "IMPERATORE") {
 svg = `
 <path d="M${cx-36} 46 Q${cx-48} 92 ${cx-44} 128 L${cx+44} 128 Q${cx+48} 92 ${cx+36} 46 Z" fill="url(#ncl${id})" stroke="url(#ac${id})" stroke-width="1.2"/>
 <path d="M${cx-36} 46 Q${cx-48} 92 ${cx-44} 128 L${cx+44} 128 Q${cx+48} 92 ${cx+36} 46 Z" fill="url(#nclh${id})" opacity="0.9"/>
 ${breastplate(id,cx,50,36,52,c)}
 <path d="M${cx-8} 64 Q${cx-12} 60 ${cx-8} 58 Q${cx} 56 ${cx+8} 58 Q${cx+12} 60 ${cx+8} 64 Q${cx+4} 68 ${cx} 70 Q${cx-4} 68 ${cx-8} 64 Z" fill="url(#ac${id})" opacity="0.5" filter="url(#g${id})"/>
 <path d="M${cx-14} 60 L${cx-20} 56 M${cx+14} 60 L${cx+20} 56" stroke="url(#ac${id})" stroke-width="1.5" opacity="0.6" filter="url(#g${id})"/>
 <path d="M${cx-36} 46 Q${cx} 33 ${cx+36} 46 Q${cx+28} 70 ${cx} 74 Q${cx-28} 70 ${cx-36} 46 Z" fill="url(#fur${id})" opacity="0.99"/>
 ${Array.from({length:20},(_,i)=>`<circle cx="${cx-34+i*3.6}" cy="${48+i%4*4}" r="${0.6+i%3*0.3}" fill="#040404" opacity="0.9"/>`).join("")}
 <line x1="${cx+32}" y1="52" x2="${cx+28}" y2="112" stroke="url(#gld${id})" stroke-width="3.5" opacity="0.9" filter="url(#g${id})"/>
 <circle cx="${cx+30}" cy="48" r="5" fill="${c}" opacity="1" filter="url(#gs${id})"/>
 <circle cx="${cx+30}" cy="48" r="2.5" fill="#ffffff" opacity="0.5"/>
 <circle cx="${cx-32}" cy="84" r="11" fill="url(#gld${id})" opacity="0.75" filter="url(#g${id})"/>
 <path d="M${cx-32} 73 L${cx-32} 95 M${cx-43} 84 L${cx-21} 84" stroke="url(#ac${id})" stroke-width="0.8" opacity="0.6"/>
 <path d="M${cx-42} 84 Q${cx-32} 78 ${cx-22} 84" fill="none" stroke="url(#ac${id})" stroke-width="0.7" opacity="0.5"/>
 <circle cx="${cx-32}" cy="84" r="6" fill="${c}" opacity="0.35" filter="url(#gs${id})"/>
 ${neckShoulders(id,cx,46,56,9,c)}
 ${face(id,cx,28,13,16,c,true,false,"noble")}
 ${crown(id,cx,13,16,c,5)}
 <path d="M${cx-14} 13 Q${cx} 8 ${cx+14} 13" fill="none" stroke="url(#gld${id})" stroke-width="2" opacity="0.7" filter="url(#g${id})"/>
 <circle cx="${cx}" cy="8" r="3" fill="${c}" opacity="1" filter="url(#gs${id})"/>`;
 } else if (title === "SEMIDIO") {
 const fY=35, fRx=11, fRy=14;
 const nkTop=50, nkW=5.5;
 const shY=54, bW=28, bBot=118, chestMid=78;
 const chestTop=shY+2, chestH=36, chW=bW*0.58;

 function _wing(side) {
 const sx = side === "L" ? cx - bW/2 + 2 : cx + bW/2 - 2;
 const dir = side === "L" ? -1 : 1;
 let r = "";
 for (let i = 0; i < 7; i++) {
 const frac = i / 6;
 const ba = side === "L" ? Math.PI + Math.PI*(0.15 + frac*0.75) : -Math.PI*(0.15 + frac*0.75);
 const len = 28 + i*3 + (i === 3 ? 8 : 0);
 const x2 = sx + Math.cos(ba)*len, y2 = (shY+6) + Math.sin(ba)*len;
 const w = i===3 ? 2.2 : i===2||i===4 ? 1.6 : 1.1;
 const op = i===3 ? 0.75 : i===2||i===4 ? 0.6 : 0.4;
 const mx = sx + Math.cos(ba)*len*0.65, my = (shY+6) + Math.sin(ba)*len*0.65;
 const sa = ba + dir*0.28;
 const sx2 = mx + Math.cos(sa)*len*0.38, sy2 = my + Math.sin(sa)*len*0.38;
 r += `<line x1="${sx}" y1="${shY+6}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${op}" filter="url(#g${id})"/>
 <line x1="${mx}" y1="${my}" x2="${sx2}" y2="${sy2}" stroke="${c}" stroke-width="${w*0.6}" stroke-linecap="round" opacity="${op*0.65}" filter="url(#bl${id})"/>
 <circle cx="${x2}" cy="${y2}" r="${w*0.55}" fill="${c}" opacity="${op*0.7}" filter="url(#gs${id})"/>`;
 }
 return r;
 }

 const haloY = fY - fRy - 4;
 const crownRays = Array.from({length:12}, (_, i) => {
 const a = -Math.PI/2 + (i/12)*Math.PI*2;
 const r1=19, r2=30+(i%3)*5;
 const x1=cx+Math.cos(a)*r1, y1=haloY+Math.sin(a)*r1;
 const x2=cx+Math.cos(a)*r2, y2=haloY+Math.sin(a)*r2;
 const w = i%3===0 ? 2.2 : i%3===1 ? 1.5 : 1.0;
 const op = i%3===0 ? 0.95 : i%3===1 ? 0.75 : 0.55;
 const gr = i%3===0 ? 3.0 : i%3===1 ? 1.8 : 1.2;
 return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" opacity="${op}" filter="url(#g${id})"/>
 <circle cx="${x2}" cy="${y2}" r="${gr}" fill="${c}" opacity="${op}" filter="url(#gs${id})"/>
 <circle cx="${x2}" cy="${y2}" r="${gr*0.4}" fill="#ffffff" opacity="0.7"/>`;
 }).join("");

 svg = `
 <ellipse cx="${cx}" cy="${bBot}" rx="22" ry="4" fill="${c}" opacity="0.1" filter="url(#gs${id})"/>
 <ellipse cx="${cx}" cy="${chestMid}" rx="${bW*0.85}" ry="${(bBot-shY)*0.52}" fill="url(#acr${id})" opacity="0.25" filter="url(#gs${id})"/>
 <path d="M${cx-bW/2+2} ${shY} Q${cx-bW/2-6} ${chestMid} ${cx-bW/2-10} ${bBot} L${cx+bW/2+10} ${bBot} Q${cx+bW/2+6} ${chestMid} ${cx+bW/2-2} ${shY} Z" fill="url(#eth${id})" opacity="0.9"/>
 <path d="M${cx-bW/2+2} ${shY} Q${cx-bW/2-6} ${chestMid} ${cx-bW/2-10} ${bBot} L${cx+bW/2+10} ${bBot} Q${cx+bW/2+6} ${chestMid} ${cx+bW/2-2} ${shY} Z" fill="url(#acr${id})" opacity="0.18"/>
 <path d="M${cx-bW*0.38} ${shY+8} Q${cx-bW*0.38+2} ${chestMid} ${cx-bW*0.38+1.2} ${bBot}" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.18"/>
 <path d="M${cx} ${shY+8} Q${cx} ${chestMid} ${cx} ${bBot}" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.28"/>
 <path d="M${cx+bW*0.38} ${shY+8} Q${cx+bW*0.38-2} ${chestMid} ${cx+bW*0.38-1.2} ${bBot}" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.18"/>
 <path d="M${cx-bW/2-10} ${bBot} Q${cx} ${bBot-5} ${cx+bW/2+10} ${bBot}" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.4" filter="url(#bl${id})"/>
 ${_wing("L")} ${_wing("R")}
 <path d="M${cx-bW/2+2} ${shY+4} Q${cx-bW/2-10} ${shY+22} ${cx-bW/2-8} ${shY+42}" fill="none" stroke="url(#sk${id})" stroke-width="5.5" stroke-linecap="round" opacity="0.55"/>
 <path d="M${cx-bW/2+2} ${shY+4} Q${cx-bW/2-10} ${shY+22} ${cx-bW/2-8} ${shY+42}" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round" opacity="0.4" filter="url(#g${id})"/>
 <circle cx="${cx-bW/2-8}" cy="${shY+42}" r="5.5" fill="url(#skd${id})" opacity="0.6"/>
 <circle cx="${cx-bW/2-8}" cy="${shY+42}" r="6.5" fill="${c}" opacity="0.5" filter="url(#gs${id})"/>
 <circle cx="${cx-bW/2-8}" cy="${shY+42}" r="3" fill="#ffffff" opacity="0.35" filter="url(#g${id})"/>
 <path d="M${cx+bW/2-2} ${shY+4} Q${cx+bW/2+10} ${shY+22} ${cx+bW/2+8} ${shY+42}" fill="none" stroke="url(#sk${id})" stroke-width="5.5" stroke-linecap="round" opacity="0.55"/>
 <path d="M${cx+bW/2-2} ${shY+4} Q${cx+bW/2+10} ${shY+22} ${cx+bW/2+8} ${shY+42}" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round" opacity="0.4" filter="url(#g${id})"/>
 <circle cx="${cx+bW/2+8}" cy="${shY+42}" r="5.5" fill="url(#skd${id})" opacity="0.6"/>
 <circle cx="${cx+bW/2+8}" cy="${shY+42}" r="6.5" fill="${c}" opacity="0.5" filter="url(#gs${id})"/>
 <circle cx="${cx+bW/2+8}" cy="${shY+42}" r="3" fill="#ffffff" opacity="0.35" filter="url(#g${id})"/>
 <path d="M${cx-chW/2} ${chestTop} Q${cx-chW/2-4} ${chestTop+chestH*0.3} ${cx-4} ${chestTop+chestH} Q${cx} ${chestTop+chestH+4} ${cx+4} ${chestTop+chestH} Q${cx+chW/2+4} ${chestTop+chestH*0.3} ${cx+chW/2} ${chestTop} Q${cx} ${chestTop-4} ${cx-chW/2} ${chestTop} Z" fill="url(#acr${id})" stroke="${c}" stroke-width="0.7" stroke-opacity="0.5" opacity="0.7"/>
 <line x1="${cx}" y1="${chestTop}" x2="${cx}" y2="${chestTop+chestH}" stroke="${c}" stroke-width="0.8" opacity="0.6" filter="url(#g${id})"/>
 <path d="M${cx-chW/2+2} ${chestTop+chestH*0.45} Q${cx} ${chestTop+chestH*0.42} ${cx+chW/2-2} ${chestTop+chestH*0.45}" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.5"/>
 <circle cx="${cx-chW/2}" cy="${chestTop+2}" r="2.5" fill="${c}" opacity="0.85" filter="url(#gs${id})"/>
 <circle cx="${cx+chW/2}" cy="${chestTop+2}" r="2.5" fill="${c}" opacity="0.85" filter="url(#gs${id})"/>
 <rect x="${cx-nkW}" y="${nkTop-8}" width="${nkW*2}" height="12" rx="3" fill="#c08060" opacity="0.75"/>
 <rect x="${cx-nkW*0.7}" y="${nkTop-8}" width="${nkW*0.5}" height="10" rx="2" fill="#d4a07a" opacity="0.2"/>
 ${face(id,cx,fY,fRx,fRy,c,false,false,"noble")}
 <ellipse cx="${cx}" cy="${fY}" rx="${fRx*1.3}" ry="${fRy*1.15}" fill="${c}" opacity="0.1" filter="url(#gs${id})"/>
 <circle cx="${cx}" cy="${haloY}" r="22" fill="none" stroke="${c}" stroke-width="3" opacity="0.28" filter="url(#gs${id})"/>
 <circle cx="${cx}" cy="${haloY}" r="19" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.55" filter="url(#g${id})"/>
 <circle cx="${cx}" cy="${haloY}" r="16" fill="none" stroke="#ffffff" stroke-width="0.6" opacity="0.4"/>
 ${crownRays}`;
 } else if (title === "ASCESO") {
 const fY=33, fRx=11, fRy=14;
 const bTop=54, bH=64, bBot=118;
 const chY=bTop+bH*0.38;
 const armY=bTop+14, armBot=armY+34;

 const solarRays = Array.from({length:24}, (_, i) => {
 const a = (i/24)*Math.PI*2 - Math.PI/2;
 const r1=6, r2=34+(i%4)*8+(i%7)*3;
 const x1=cx+Math.cos(a)*r1, y1=chY+Math.sin(a)*r1;
 const x2=cx+Math.cos(a)*r2, y2=chY+Math.sin(a)*r2;
 const isPri=i%6===0, isSec=i%3===0;
 const w = isPri ? 2.5 : isSec ? 1.5 : 0.8;
 const op = isPri ? 0.9 : isSec ? 0.65 : 0.35;
 const gem = isPri
 ? `<circle cx="${x2}" cy="${y2}" r="2.8" fill="${c}" opacity="0.95" filter="url(#gs${id})"/><circle cx="${x2}" cy="${y2}" r="1.2" fill="#ffffff" opacity="1"/>`
 : isSec ? `<circle cx="${x2}" cy="${y2}" r="1.5" fill="${c}" opacity="0.8" filter="url(#g${id})"/>` : "";
 return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" opacity="${op}" stroke-linecap="round" filter="${isPri ? `url(#g${id})` : isSec ? `url(#bl${id})` : ""}"/>
 ${gem}`;
 }).join("");

 function _star(sx, sy) {
 return Array.from({length:8}, (_, i) => {
 const a = (i/8)*Math.PI*2, r1=2, r2=8+(i%2)*3;
 return `<line x1="${sx+Math.cos(a)*r1}" y1="${sy+Math.sin(a)*r1}" x2="${sx+Math.cos(a)*r2}" y2="${sy+Math.sin(a)*r2}" stroke="${c}" stroke-width="${i%2 ? 0.8 : 1.4}" opacity="${i%2 ? 0.5 : 0.8}" stroke-linecap="round" filter="url(#bl${id})"/>`;
 }).join("") + `<circle cx="${sx}" cy="${sy}" r="3.5" fill="${c}" opacity="0.8" filter="url(#gs${id})"/><circle cx="${sx}" cy="${sy}" r="1.5" fill="#ffffff" opacity="1"/>`;
 }

 const crownY2 = fY - fRy - 6;
 const crownRays2 = Array.from({length:16}, (_, i) => {
 const a = -Math.PI/2 + (i/16)*Math.PI*2;
 const isPri=i%4===0, isSec=i%2===0;
 const r1=20, r2=isPri ? 42 : isSec ? 36 : 30;
 const x1=cx+Math.cos(a)*r1, y1=crownY2+Math.sin(a)*r1;
 const x2=cx+Math.cos(a)*r2, y2=crownY2+Math.sin(a)*r2;
 const w = isPri ? 2.8 : isSec ? 1.8 : 1.0;
 const op = isPri ? 1.0 : isSec ? 0.8 : 0.55;
 const gr = isPri ? 3.5 : isSec ? 2.2 : 1.4;
 return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" opacity="${op}" stroke-linecap="round" filter="${isPri ? `url(#g${id})` : ""}"/>
 <circle cx="${x2}" cy="${y2}" r="${gr}" fill="${c}" opacity="${op*0.9}" filter="url(#gs${id})"/>
 <circle cx="${x2}" cy="${y2}" r="${gr*0.38}" fill="#ffffff" opacity="0.9"/>`;
 }).join("");

 svg = `
 <ellipse cx="${cx}" cy="${bBot+2}" rx="20" ry="3.5" fill="${c}" opacity="0.1" filter="url(#gs${id})"/>
 <path d="M${cx-14} ${bTop} Q${cx-17} ${bTop+bH*0.5} ${cx-16} ${bBot} L${cx+16} ${bBot} Q${cx+17} ${bTop+bH*0.5} ${cx+14} ${bTop} Z" fill="${c}" opacity="0.04" filter="url(#gs${id})"/>
 <path d="M${cx-10} ${bTop+4} Q${cx-13} ${bTop+bH*0.5} ${cx-12} ${bBot-4} L${cx+12} ${bBot-4} Q${cx+13} ${bTop+bH*0.5} ${cx+10} ${bTop+4} Z" fill="${c}" opacity="0.09" filter="url(#gs${id})"/>
 <path d="M${cx-6} ${bTop+8} Q${cx-8} ${bTop+bH*0.5} ${cx-7} ${bBot-8} L${cx+7} ${bBot-8} Q${cx+8} ${bTop+bH*0.5} ${cx+6} ${bTop+8} Z" fill="${c}" opacity="0.18" filter="url(#g${id})"/>
 ${solarRays}
 <circle cx="${cx}" cy="${chY}" r="10" fill="${c}" opacity="0.1" filter="url(#gs${id})"/>
 <circle cx="${cx}" cy="${chY}" r="5" fill="${c}" opacity="0.35" filter="url(#gs${id})"/>
 <circle cx="${cx}" cy="${chY}" r="2.5" fill="#ffffff" opacity="0.95" filter="url(#g${id})"/>
 <line x1="${cx}" y1="${bTop+2}" x2="${cx}" y2="${bBot}" stroke="${c}" stroke-width="2.5" opacity="0.8" filter="url(#g${id})"/>
 ${[0.15,0.35,0.55,0.75,0.9].map(t => {
 const y2=bTop+(bBot-bTop)*t, r2=t<0.3?3.5:t<0.6?4.5:t<0.8?3.8:3;
 return `<circle cx="${cx}" cy="${y2}" r="${r2}" fill="${c}" opacity="${0.7+t*0.2}" filter="url(#gs${id})"/><circle cx="${cx}" cy="${y2}" r="${r2*0.4}" fill="#ffffff" opacity="0.9"/>`;
 }).join("")}
 <path d="M${cx-12} ${armY} Q${cx-22} ${armY+14} ${cx-26} ${armBot}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" opacity="0.07" filter="url(#gs${id})"/>
 <path d="M${cx-12} ${armY} Q${cx-22} ${armY+14} ${cx-26} ${armBot}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.22" filter="url(#gs${id})"/>
 <path d="M${cx-12} ${armY} Q${cx-22} ${armY+14} ${cx-26} ${armBot}" fill="none" stroke="#ffffff" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>
 ${_star(cx-26, armBot)}
 <path d="M${cx+12} ${armY} Q${cx+22} ${armY+14} ${cx+26} ${armBot}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" opacity="0.07" filter="url(#gs${id})"/>
 <path d="M${cx+12} ${armY} Q${cx+22} ${armY+14} ${cx+26} ${armBot}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.22" filter="url(#gs${id})"/>
 <path d="M${cx+12} ${armY} Q${cx+22} ${armY+14} ${cx+26} ${armBot}" fill="none" stroke="#ffffff" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>
 ${_star(cx+26, armBot)}
 ${face(id,cx,fY,fRx,fRy,c,false,false,"noble")}
 <ellipse cx="${cx}" cy="${fY}" rx="${fRx*1.25}" ry="${fRy*1.1}" fill="${c}" opacity="0.22" filter="url(#gs${id})"/>
 <circle cx="${cx}" cy="${crownY2}" r="23" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.35" filter="url(#gs${id})"/>
 <circle cx="${cx}" cy="${crownY2}" r="20" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.45"/>
 <circle cx="${cx}" cy="${crownY2}" r="17" fill="none" stroke="${c}" stroke-width="1.2" opacity="0.25" filter="url(#g${id})"/>
 ${crownRays2}
 <circle cx="${cx}" cy="${crownY2}" r="5.5" fill="${c}" opacity="0.45" filter="url(#gs${id})"/>
 <circle cx="${cx}" cy="${crownY2}" r="2.5" fill="#ffffff" opacity="0.95"/>`;
 }

 return `<svg width="160" height="200" viewBox="0 0 100 130" overflow="visible">${D}${svg}</svg>`;
}
