const fs = require('fs');

let shopTxt = fs.readFileSync('js/shop.js', 'utf8');

// The active relics map function:
// const rel = RELICS.find...
// return `<div class="zaino-item">
// <span class="zaino-item-icon">${piece.icon || "🦴"}</span>
shopTxt = shopTxt.replace(/const rel = RELICS\.find\(r => r\.id === ra\.id\);\s*if \(\!rel\) return "";\s*const remaining = Math\.ceil\(\(ra\.expiry - now\) \/ 3600000\);\s*return `<div class="zaino-item">\s*<span class="zaino-item-icon">\$\{piece\.icon \|\| "[^"]+"\}<\/span>/, 
`const rel = RELICS.find(r => r.id === ra.id);
   if (!rel) return "";
   const remaining = Math.ceil((ra.expiry - now) / 3600000);
   return \`<div class="zaino-item">
   <span class="zaino-item-icon">\${rel.icon}</span>`);

// The relic loop in zaino:
// } else if (zItem.type === "relic") {
// const rel = RELICS.find...
// if (!rel) return;
// const refund = 5;
// relicHTMLs.push(`<div class="zaino-item">
// <span class="zaino-item-icon">${piece.icon || "🦴"}</span>
shopTxt = shopTxt.replace(/\} else if \(zItem\.type === "relic"\) \{\s*const rel = RELICS\.find\(r => r\.id === zItem\.id\);\s*if \(\!rel\) return;\s*const refund = 5;\s*relicHTMLs\.push\(`<div class="zaino-item">\s*<span class="zaino-item-icon">\$\{piece\.icon \|\| "[^"]+"\}<\/span>/,
`} else if (zItem.type === "relic") {
    const rel = RELICS.find(r => r.id === zItem.id);
    if (!rel) return;
    const refund = 5;
    relicHTMLs.push(\`<div class="zaino-item">
    <span class="zaino-item-icon">\${rel.icon}</span>`);

fs.writeFileSync('js/shop.js', shopTxt);
console.log("Done");
