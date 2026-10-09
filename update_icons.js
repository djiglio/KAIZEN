const fs = require('fs');
let txt = fs.readFileSync('js/data.js', 'utf8');

// POTIONS
txt = txt.replace(/export const POTIONS = \[([\s\S]*?)\];/g, (match, body) => {
    return 'export const POTIONS = [' + body.replace(/icon:\s*""/g, (m, offset, str) => {
        // Find name to know if PV or PA
        let block = str.substring(offset - 100, offset + 100);
        if (block.includes('"pa"') || block.includes('"regen_boost"')) return 'icon:"💧"';
        return 'icon:"🩸"'; // default to PV
    }) + '];';
});

// RELICS
txt = txt.replace(/export const RELICS = \[([\s\S]*?)\];/g, (match, body) => {
    return 'export const RELICS = [' + body.replace(/icon:\s*""/g, 'icon:"🔮"') + '];';
});

// AREA_LOOT_POOL (materiali)
txt = txt.replace(/export const AREA_LOOT_POOL = \[([\s\S]*?)\];/g, (match, body) => {
    return 'export const AREA_LOOT_POOL = [' + body.replace(/icon:\s*""/g, 'icon:"🦴"') + '];';
});

// EQUIPMENT_POOL
txt = txt.replace(/export const EQUIPMENT_POOL = \[([\s\S]*?)\];/g, (match, body) => {
    return 'export const EQUIPMENT_POOL = [' + body.replace(/slot:\s*"([^"]+)",\s*icon:\s*""/g, (m, slot) => {
        if (slot === 'arma') return `slot:"${slot}", icon:"🗡️"`;
        return `slot:"${slot}", icon:"🛡️"`;
    }) + '];';
});

fs.writeFileSync('js/data.js', txt);
console.log("Done");
