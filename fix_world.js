const fs = require('fs');
let txt = fs.readFileSync('js/world.js', 'utf8');

txt = txt.replace(/addHistory\(` Trovato: 💎 \$\{aLoot\.name\} → zaino`, "world"\);/g, 'addHistory(` Trovato: ${aLoot.icon} ${aLoot.name} → zaino`, "world");');
txt = txt.replace(/showToast\(`💎 \$\{aLoot\.name\} trovato!`\);/g, 'showToast(`${aLoot.icon} ${aLoot.name} trovato!`);');

// In case the emoji isn't exactly the literal in the source code due to encoding when I made fix_world.js:
txt = txt.replace(/addHistory\(` Trovato: [^$]*\$\{aLoot\.name\} → zaino`, "world"\);/g, 'addHistory(` Trovato: ${aLoot.icon} ${aLoot.name} → zaino`, "world");');
txt = txt.replace(/showToast\(`[^$]*\$\{aLoot\.name\} trovato!`\);/g, 'showToast(`${aLoot.icon} ${aLoot.name} trovato!`);');

fs.writeFileSync('js/world.js', txt);
