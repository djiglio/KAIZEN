const fs = require('fs');

let txt = fs.readFileSync('js/data.js', 'utf8');

txt = txt.replace(/return \{ id:`\$\{slot\[0\]\}\$\{tier\}\$\{idx\}`,\s*slot,\s*icon:realIcon,\s*slot,\s*icon,/g, 'return { id:`${slot[0]}${tier}${idx}`, slot, icon:realIcon,');

fs.writeFileSync('js/data.js', txt);
console.log("Done");
