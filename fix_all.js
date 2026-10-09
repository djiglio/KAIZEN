const fs = require('fs');

// 1. Update data.js
let txt = fs.readFileSync('js/data.js', 'utf8');

// Fix genEquip
txt = txt.replace(/function genEquip\(slot, icon, tier, idx, name, bonusStat, bonusVal, desc, fonte\) \{([\s\S]*?)return \{ id:`\$\{slot\[0\]\}\$\{tier\}\$\{idx\}`/g, (match, body) => {
    if (!body.includes('realIcon')) {
        return `function genEquip(slot, icon, tier, idx, name, bonusStat, bonusVal, desc, fonte) {${body}const realIcon = icon || (slot === "arma" ? "🗡️" : "🛡️");\n return { id:\`\${slot[0]}\${tier}\${idx}\`, slot, icon:realIcon`;
    }
    return match;
});

// Fix Pozione Rigenerante
txt = txt.replace(/id:"pot05",name:"Pozione Rigenerante", icon:"[^"]+"/g, 'id:"pot05",name:"Pozione Rigenerante", icon:"🩸"');

// Fix AREA_LOOT_POOL items missing icon
txt = txt.replace(/\{id:"al\d{3}",name:"[^"]+",rarity:\d,value:\d+,desc:"[^"]+"(,\s*icon:"[^"]*")?\}/g, (match) => {
    if (match.includes(',icon:')) return match;
    return match.slice(0, -1) + ',icon:"🦴"}';
});

fs.writeFileSync('js/data.js', txt);

// 2. Update shop.js
let shopTxt = fs.readFileSync('js/shop.js', 'utf8');
// Fix hardcoded box in arealootHTMLs.push
shopTxt = shopTxt.replace(/<span class="zaino-item-icon">📦<\/span>/g, '<span class="zaino-item-icon">${piece.icon || "🦴"}</span>');
// Just in case it's represented differently in encoding:
shopTxt = shopTxt.replace(/<span class="zaino-item-icon">[^<]+<\/span>/g, '<span class="zaino-item-icon">${piece.icon || "🦴"}</span>');

fs.writeFileSync('js/shop.js', shopTxt);
console.log("Done");
