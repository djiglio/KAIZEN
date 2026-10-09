const fs = require('fs');
let txt = fs.readFileSync('js/data.js', 'utf8');

txt = txt.replace(/name:"Pozione PA Media",\s*icon:"🩸"/g, 'name:"Pozione PA Media",icon:"💧"');
txt = txt.replace(/name:"Pozione PA Grande",\s*icon:"🩸"/g, 'name:"Pozione PA Grande",icon:"💧"');
txt = txt.replace(/name:"Pozione Rinvigorente",\s*icon:"🩸"/g, 'name:"Pozione Rinvigorente",icon:"💧"');

// Fix ID for Rinvigorente too! (it was pot08 twice)
txt = txt.replace(/id:"pot08",name:"Pozione Rinvigorente"/g, 'id:"pot09",name:"Pozione Rinvigorente"');

fs.writeFileSync('js/data.js', txt);
