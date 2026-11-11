/* ============================================================
 data.js — costanti statiche v6.3
 Abitudini, statistiche, ranghi, quest pool, bestiario (190),
 equipaggiamento (30x6 slot), reliquie/tesori (100), negozio
 ============================================================ */

/* ── App info ── */
export const APP_VERSION = "7.17";
export const APP_RELEASE = "11/11/2026";
export const APP_DEV = "djiglio.ai";

/* ── Abitudini (11) ── */
export const HABITS = [
 { id:"allenamento", label:"Allenamento", icon:"", stat:"forza", color:"#dc2626" },
 { id:"passi", label:"7000 Passi", icon:"", stat:"velocita", color:"#0ea5e9" },
 { id:"stretching", label:"Stretching", icon:"", stat:"destrezza", color:"#10b981" },
 { id:"piegamenti", label:"Piegamenti", icon:"", stat:"critico", color:"#f97316" },
 { id:"enigmistica", label:"Enigmistica", icon:"", stat:"furtivita", color:"#8b5cf6" },
 { id:"dieta", label:"Dieta", icon:"", stat:"costituzione", color:"#84cc16" },
 { id:"meditazione", label:"Meditazione", icon:"", stat:"guarigione", color:"#06b6d4" },
 { id:"lettura", label:"Lettura", icon:"", stat:"fortuna", color:"#d97706" },
 { id:"sonno", label:"8 Ore di Sonno", icon:"", stat:"sopravvivenza",color:"#4f46e5" },
 { id:"studio", label:"Studio", icon:"", stat:"pianificazione",color:"#0891b2" },
 { id:"lingue", label:"Lingue", icon:"", stat:"carisma", color:"#be185d" },
];

/* ── Statistiche dell'eroe ── */
export const STAT_DEFS = [
  { id:"forza",         icon:"FOR", label:"FORZA",         habit:"allenamento",  desc:"Danno per colpo",             formula: lv => lv*4+5 },
  { id:"velocita",      icon:"VEL", label:"VELOCITÀ",      habit:"passi",        desc:"Iniziativa in combattimento",  formula: lv => lv*3+5 },
  { id:"destrezza",     icon:"DES", label:"DESTREZZA",     habit:"stretching",   desc:"% schivata colpi",             formula: lv => lv <= 1 ? 0 : Math.min(65, (65/139)*(lv-1)) },
  { id:"critico",       icon:"CRI", label:"CRITICO",       habit:"piegamenti",   desc:"% colpi critici (x2)",         formula: lv => lv <= 1 ? 0 : Math.min(50, (50/139)*(lv-1)) },
  { id:"furtivita",     icon:"FUR", label:"FURTIVITÀ",     habit:"enigmistica",  desc:"% riuscita fuga",              formula: lv => Math.min(80, Math.floor(lv*0.5)+10) },
  { id:"costituzione",  icon:"COS", label:"COSTITUZIONE",  habit:"dieta",        desc:"PV massimi",           formula: lv => 50+lv*12 },
  { id:"guarigione",    icon:"GUA", label:"GUARIGIONE",    habit:"meditazione",  desc:"Minuti per +1 PV",             formula: lv => Math.max(0.3, 8-(17/86)*(lv-1)) },
  { id:"fortuna",       icon:"LUC", label:"FORTUNA",       habit:"lettura",      desc:"Bonus bottino missioni",       formula: lv => lv },
  { id:"sopravvivenza", icon:"SOP", label:"SOPRAVVIVENZA", habit:"sonno",        desc:"PA massimi",         formula: lv => 5+lv*2 },
  { id:"pianificazione",icon:"PIA", label:"PIANIFICAZIONE",habit:"studio",       desc:"Minuti per +1 PA",                formula: lv => Math.max(0.5, 10-(19/260)*lv) },
  { id:"carisma",       icon:"CAR", label:"CARISMA",       habit:"lingue",       desc:"% sconto al mercato",          formula: lv => Math.min(60,(6/13)*lv) },
];

/* ── Ranghi ── */
export const rankTitles = [
 { r:0, t:"MENDICANTE" }, { r:2, t:"VAGABONDO" }, { r:5, t:"PASTORE" },
 { r:8, t:"CONTADINO" }, { r:11, t:"FABBRO" }, { r:14, t:"RECLUTA" },
 { r:18, t:"RAMINGO" }, { r:22, t:"MERCENARIO" }, { r:26, t:"SCUDIERO" },
 { r:30, t:"SPADACCINO" }, { r:35, t:"GLADIATORE" }, { r:40, t:"VETERANO" },
 { r:45, t:"PALADINO" }, { r:50, t:"CAVALIERE" }, { r:55, t:"CAMPIONE" },
 { r:60, t:"GENERALE" }, { r:65, t:"BARONE" }, { r:70, t:"VISCONTE" },
 { r:75, t:"CONTE" }, { r:80, t:"MARCHESE" }, { r:85, t:"DUCA" },
 { r:90, t:"ARCIDUCA" }, { r:95, t:"PRINCIPE" }, { r:100, t:"RE" },
 { r:110, t:"IMPERATORE" }, { r:120, t:"SEMIDIO" }, { r:140, t:"ASCESO" },
];

export const titleMetalColors = {
 "MENDICANTE":"#6b6b78","VAGABONDO":"#7a6e5a","PASTORE":"#7d8c72","CONTADINO":"#8c7e62",
 "FABBRO":"#9e6840","RECLUTA":"#7090a8","RAMINGO":"#707e90","MERCENARIO":"#b09030",
 "SCUDIERO":"#8098b8","SPADACCINO":"#b89858","GLADIATORE":"#c07828","VETERANO":"#9098a0",
 "PALADINO":"#c0b090","CAVALIERE":"#a0b8cc","CAMPIONE":"#c8a828","GENERALE":"#c09040",
 "BARONE":"#a08868","VISCONTE":"#9878b8","CONTE":"#a09050","MARCHESE":"#7888a8",
 "DUCA":"#c0a870","ARCIDUCA":"#c8b840","PRINCIPE":"#d0b040","RE":"#d8c060",
 "IMPERATORE":"#e0d090","SEMIDIO":"#b8d8e8","ASCESO":"#e8e8f0",
};

export const avatarPalettes = {
 "MENDICANTE":"#5a5a6a","VAGABONDO":"#6b5e4a","PASTORE":"#7a8c6e","CONTADINO":"#8c7a5a",
 "FABBRO":"#a0522d","RECLUTA":"#7a9aaa","RAMINGO":"#6e7a8a","MERCENARIO":"#b8860b",
 "SCUDIERO":"#8faacc","SPADACCINO":"#c0a060","GLADIATORE":"#cc7722","VETERANO":"#9aaba8",
 "PALADINO":"#d4c5a9","CAVALIERE":"#b0c4de","CAMPIONE":"#d4af37","GENERALE":"#c8a050",
 "BARONE":"#a09070","VISCONTE":"#b8a0d0","CONTE":"#c0b080","MARCHESE":"#90a0b8",
 "DUCA":"#d8c090","ARCIDUCA":"#e8d080","PRINCIPE":"#f0d890","RE":"#f5e0a0",
 "IMPERATORE":"#f8ead0","SEMIDIO":"#e8f4f8","ASCESO":"#ffffff",
};

export const nobleMantle = {
 "BARONE": {base:"#3a1520",hi:"#6a2838",trim:"#8a3a50"},
 "VISCONTE": {base:"#20103a",hi:"#482070",trim:"#7040a0"},
 "CONTE": {base:"#0a2414",hi:"#165030",trim:"#2a7848"},
 "MARCHESE": {base:"#0c1830",hi:"#1a3460",trim:"#2a5090"},
 "DUCA": {base:"#080c24",hi:"#101850",trim:"#1c2e80"},
 "ARCIDUCA": {base:"#180828",hi:"#3a1060",trim:"#6020a0"},
 "PRINCIPE": {base:"#280808",hi:"#601010",trim:"#901a1a"},
 "RE": {base:"#140520",hi:"#300c50",trim:"#5a1888"},
 "IMPERATORE":{base:"#04040c",hi:"#181830",trim:"#303060"},
};

/* ══════════════════════════════════════════════════════════
 POOL MISSIONI SETTIMANALI — 50 evoluzione + 50 mondo
══════════════════════════════════════════════════════════ */
export const QUEST_POOL_EVO = [
 // Abitudini singole
 {id:"e01",text:"Atleta Instancabile",     desc:"Completa Allenamento 4 volte",                                           target:4,  type:"habit", habit:"allenamento"},
 {id:"e02",text:"Maratoneta",              desc:"Completa 7000 Passi 4 volte",                                            target:4,  type:"habit", habit:"passi"},
 {id:"e03",text:"Corpo Flessibile",        desc:"Completa Stretching 5 volte",                                            target:5,  type:"habit", habit:"stretching"},
 {id:"e04",text:"Guerriero di Ferro",      desc:"Completa Piegamenti 5 volte",                                            target:5,  type:"habit", habit:"piegamenti"},
 {id:"e05",text:"Mente Acuta",             desc:"Completa Enigmistica 6 volte",                                           target:6,  type:"habit", habit:"enigmistica"},
 {id:"e06",text:"Nutrizione Reale",        desc:"Completa Dieta 6 volte",                                                 target:6,  type:"habit", habit:"dieta"},
 {id:"e07",text:"Monaco Zen",              desc:"Completa Meditazione 5 volte",                                           target:5,  type:"habit", habit:"meditazione"},
 {id:"e08",text:"Topo di Biblioteca",      desc:"Completa Lettura 5 volte",                                               target:5,  type:"habit", habit:"lettura"},
 {id:"e09",text:"Letargo Profondo",        desc:"Completa 8 Ore di Sonno 5 volte",                                        target:5,  type:"habit", habit:"sonno"},
 {id:"e10",text:"Studioso Erudito",        desc:"Completa Studio 4 volte",                                                target:4,  type:"habit", habit:"studio"},
 {id:"e11",text:"Poliglotta",              desc:"Completa Lingue 6 volte",                                                target:6,  type:"habit", habit:"lingue"},
 // Totali e coppie bilanciate
 {id:"e12",text:"Mente e Corpo",           desc:"Completa 15 abitudini totali",                                           target:15, type:"total"},
 {id:"e13",text:"Costanza Eterna",         desc:"Completa 20 abitudini totali",                                           target:20, type:"total"},
 {id:"e14",text:"Maestro Kaizen",          desc:"Completa 28 abitudini totali",                                           target:28, type:"total"},
 {id:"e15",text:"Atleta Completo",         desc:"Completa Allenamento (3) e 7000 Passi (3) — 6 totali",                   target:6,  type:"multi", each:3, habits:["allenamento","passi"]},
 {id:"e16",text:"Corpo Perfetto",          desc:"Completa Piegamenti (4) e Stretching (4) — 8 totali",                    target:8,  type:"multi", each:4, habits:["piegamenti","stretching"]},
 {id:"e17",text:"Mente Sana",              desc:"Completa Studio (4) ed Enigmistica (4) — 8 totali",                      target:8,  type:"multi", each:4, habits:["studio","enigmistica"]},
 {id:"e18",text:"Anima Pura",              desc:"Completa Meditazione (4) e Lettura (4) — 8 totali",                      target:8,  type:"multi", each:4, habits:["meditazione","lettura"]},
 {id:"e19",text:"Ritmo Perfetto",          desc:"Completa 8 Ore di Sonno (5) e Dieta (5) — 10 totali",                    target:10, type:"multi", each:5, habits:["sonno","dieta"]},
 {id:"e20",text:"Tuttofare",               desc:"Completa ciascuna delle 11 abitudini almeno 1 volta",                    target:11, type:"all_once"},
 {id:"e21",text:"Giornata Perfetta",       desc:"Completa tutte le 11 abitudini nello stesso giorno",                     target:1,  type:"perfect_day"},
 {id:"e22",text:"Due Giornate Perfette",   desc:"Ottieni 2 giornate perfette nella settimana",                            target:2,  type:"perfect_day"},
 {id:"e23",text:"Campione Mattutino",      desc:"Completa Allenamento 6 volte",                                           target:6,  type:"habit", habit:"allenamento"},
 {id:"e24",text:"Nomade Instancabile",     desc:"Completa 7000 Passi 6 volte",                                            target:6,  type:"habit", habit:"passi"},
 {id:"e25",text:"Ginnasta",                desc:"Completa Stretching 7 volte",                                            target:7,  type:"habit", habit:"stretching"},
 {id:"e26",text:"100 Piegamenti al Giorno",desc:"Completa Piegamenti 7 volte",                                            target:7,  type:"habit", habit:"piegamenti"},
 {id:"e27",text:"Enigmista Professionista",desc:"Completa Enigmistica 7 volte",                                           target:7,  type:"habit", habit:"enigmistica"},
 {id:"e28",text:"Nutrizionista Rigoroso",  desc:"Completa Dieta 7 volte",                                                 target:7,  type:"habit", habit:"dieta"},
 {id:"e29",text:"Guru della Pace",         desc:"Completa Meditazione 7 volte",                                           target:7,  type:"habit", habit:"meditazione"},
 {id:"e30",text:"Lettore Vorace",          desc:"Completa Lettura 7 volte",                                               target:7,  type:"habit", habit:"lettura"},
 {id:"e31",text:"Ipnos Benedetto",         desc:"Completa 8 Ore di Sonno 7 volte",                                        target:7,  type:"habit", habit:"sonno"},
 {id:"e32",text:"Accademico",              desc:"Completa Studio 7 volte",                                                target:7,  type:"habit", habit:"studio"},
 {id:"e33",text:"Ambasciatore",            desc:"Completa Lingue 7 volte",                                                target:7,  type:"habit", habit:"lingue"},
 {id:"e34",text:"Settimana di Fuoco",      desc:"Completa 35 abitudini questa settimana",                                 target:35, type:"total"},
 {id:"e35",text:"Leggenda Vivente",        desc:"Completa 44 abitudini questa settimana",                                 target:44, type:"total"},
 {id:"e36",text:"Forza Bruta",             desc:"Completa Allenamento 5 volte",                                           target:5,  type:"habit", habit:"allenamento"},
 {id:"e37",text:"Corridore Solitario",     desc:"Completa 7000 Passi 7 volte",                                            target:7,  type:"habit", habit:"passi"},
 {id:"e38",text:"Mente di Cristallo",      desc:"Completa 5 diverse abitudini almeno 3 volte ciascuna (15 tot.)",         target:15, type:"variety5"},
 {id:"e39",text:"Equilibrio Cosmico",      desc:"Completa ciascuna delle 11 abitudini 2 volte (22 tot.)",                 target:22, type:"all_twice"},
 {id:"e40",text:"Guerriero Olistico",      desc:"Completa 15 abitudini fisiche (Allenamento, Passi, Piegamenti, Stretching)", target:15, type:"multi", habits:["allenamento","passi","piegamenti","stretching"]},
 {id:"e41",text:"Studioso Completo",       desc:"Completa 15 abitudini mentali (Studio, Enigmistica, Lettura, Lingue)",   target:15, type:"multi", habits:["studio","enigmistica","lettura","lingue"]},
 {id:"e42",text:"Corpo Sano",              desc:"Completa 15 volte tra Dieta, Meditazione e 8 Ore di Sonno",              target:15, type:"multi", habits:["dieta","meditazione","sonno"]},
 {id:"e43",text:"Primo Passo",             desc:"Completa 10 abitudini totali",                                           target:10, type:"total"},
 {id:"e44",text:"Inizio Promettente",      desc:"Completa 12 abitudini totali",                                           target:12, type:"total"},
 {id:"e45",text:"Disciplina di Acciaio",   desc:"Completa Allenamento (5) e Piegamenti (5) — 10 totali",                  target:10, type:"multi", each:5, habits:["allenamento","piegamenti"]},
 {id:"e46",text:"Mente Lucida",            desc:"Completa Studio (5) e Lettura (5) — 10 totali",                          target:10, type:"multi", each:5, habits:["studio","lettura"]},
 {id:"e47",text:"Spirito Libero",          desc:"Completa Meditazione (4) e Lingue (4) — 8 totali",                       target:8,  type:"multi", each:4, habits:["meditazione","lingue"]},
 {id:"e48",text:"Vitalità Massima",        desc:"Completa Dieta (6) e 8 Ore di Sonno (6) — 12 totali",                    target:12, type:"multi", each:6, habits:["dieta","sonno"]},
 {id:"e49",text:"Velocista",               desc:"Completa 7000 Passi (5) e Stretching (5) — 10 totali",                   target:10, type:"multi", each:5, habits:["passi","stretching"]},
 {id:"e50",text:"Campione Assoluto",       desc:"Completa ciascuna delle 11 abitudini 3 volte (33 tot.)",                 target:33, type:"all_three"},
];

export const QUEST_POOL_WORLD = [
 {id:"w01",text:"Primo Sangue",            desc:"Sconfiggi 3 nemici qualsiasi",                        target:3,    type:"kills_any"},
 {id:"w02",text:"Sterminatore",            desc:"Sconfiggi 10 nemici qualsiasi",                       target:10,   type:"kills_any"},
 {id:"w03",text:"Signore della Guerra",    desc:"Sconfiggi 15 nemici qualsiasi",                       target:15,   type:"kills_any"},
 {id:"w04",text:"Cacciatore di Goblin",    desc:"Sconfiggi 3 Goblin o Orchi",                          target:3,    type:"kills_tag", tag:"goblin"},
 {id:"w05",text:"Sterminatore di Non Morti",desc:"Sconfiggi 3 non-morti",                              target:3,    type:"kills_tag", tag:"nonmorto"},
 {id:"w06",text:"Ammazza Draghi",          desc:"Sconfiggi 2 draghi, idre o viverne",                  target:2,    type:"kills_tag", tag:"drago"},
 {id:"w07",text:"Cacciatore di Lupi",      desc:"Sconfiggi 4 lupi o mannari",                          target:4,    type:"kills_tag", tag:"lupo"},
 {id:"w08",text:"Uccisore di Troll",       desc:"Sconfiggi 3 troll",                                   target:3,    type:"kills_tag", tag:"troll"},
 {id:"w09",text:"Collezionista",           desc:'Raccogli oggetti per valore totale di 500 <span class="mk-coin"></span>',    target:500,  type:"loot_value"},
 {id:"w10",text:"Avventuriero Ricco",      desc:'Raccogli oggetti per valore totale di 1000 <span class="mk-coin"></span>',   target:1000, type:"loot_value"},
 {id:"w11",text:"Mercante di Tesori",      desc:'Raccogli oggetti per valore totale di 2000 <span class="mk-coin"></span>',   target:2000, type:"loot_value"},
 {id:"w12",text:"Esploratore",             desc:"Parti in spedizione 10 volte",                        target:10,   type:"missions_total"},
 {id:"w13",text:"Veterano del Campo",      desc:"Parti in spedizione 15 volte",                        target:15,   type:"missions_total"},
 {id:"w14",text:"Eroe Leggendario",        desc:"Parti in spedizione 25 volte",                        target:25,   type:"missions_total"},
 {id:"w15",text:"Fortunato",               desc:"Effettua 15 scoperte o ritrovamenti di tesori",       target:15,   type:"discoveries"},
 {id:"w16",text:"Trovatore",               desc:"Effettua 40 scoperte o ritrovamenti di tesori",       target:40,   type:"discoveries"},
 {id:"w17",text:"Cerca Reliquie",          desc:"Trova 10 reliquie in esplorazione",                   target:10,   type:"relics_found"},
 {id:"w18",text:"Guardiano delle Reliquie",desc:"Trova 15 reliquie in esplorazione",                   target:15,   type:"relics_found"},
 {id:"w19",text:"Fuggitivo",               desc:"Fuggi con successo da 3 combattimenti",               target:3,    type:"fled"},
 {id:"w20",text:"Sopravvissuto",           desc:"Fuggi con successo da 6 combattimenti",               target:6,    type:"fled"},
 {id:"w21",text:"Sterminatore di Mummie",  desc:"Sconfiggi 2 mummie o faraoni",                        target:2,    type:"kills_tag", tag:"mummia"},
 {id:"w22",text:"Ammazza Colossi",         desc:"Sconfiggi 4 giganti, ciclopi o troll",                target:4,    type:"kills_tag", tag:"gigante", tags:["gigante","ciclope","troll"]},
 {id:"w23",text:"Cacciatore di Demoni",    desc:"Sconfiggi 2 demoni",                                  target:2,    type:"kills_tag", tag:"demone"},
 {id:"w24",text:"Piccolo Tesoro",          desc:'Guadagna 500 <span class="mk-coin"></span> dalle spedizioni',                target:500,  type:"denari_earned"},
 {id:"w25",text:"Grande Fortuna",          desc:'Guadagna 800 <span class="mk-coin"></span> dalle spedizioni',                target:800,  type:"denari_earned"},
 {id:"w26",text:"Nemici Potenti",          desc:"Sconfiggi 2 nemici di livello 50+",                   target:2,    type:"kills_lvl", minLvl:50},
 {id:"w27",text:"Coraggioso",              desc:"Sconfiggi 1 nemico di livello 80+",                   target:1,    type:"kills_lvl", minLvl:80},
 {id:"w28",text:"Leggenda",                desc:"Sconfiggi 1 nemico di livello 100+",                  target:1,    type:"kills_lvl", minLvl:100},
 {id:"w29",text:"Predatore Seriale",       desc:"Sconfiggi 3 nemici umanoidi",                         target:3,    type:"kills_human"},
 {id:"w30",text:"Giustiziere",             desc:"Sconfiggi 5 nemici umanoidi",                         target:5,    type:"kills_human"},
 {id:"w31",text:"Razziatore",              desc:"Ottieni equipaggiamento da 3 nemici sconfitti",       target:3,    type:"equip_looted"},
 {id:"w32",text:"Armaiolo di Guerra",      desc:"Ottieni equipaggiamento da 6 nemici sconfitti",       target:6,    type:"equip_looted"},
 {id:"w33",text:"Cacciatore di Bestie",    desc:"Sconfiggi 4 bestie selvagge",                         target:4,    type:"kills_tag", tag:"bestia"},
 {id:"w34",text:"Sterminatore di Ragni",   desc:"Sconfiggi 3 ragni",                                   target:3,    type:"kills_tag", tag:"ragno"},
 {id:"w35",text:"Nemico dei Banditi",      desc:"Sconfiggi 4 banditi, ladri o pirati",                 target:4,    type:"kills_tag", tag:"bandito"},
 {id:"w36",text:"Puro Terrore",            desc:"Vinci 5 combattimenti consecutivi",                   target:5,    type:"win_streak"},
 {id:"w37",text:"Resistente",              desc:"Vinci un combattimento restando con meno del 20% PV", target:1,    type:"survived_low_hp"},
 {id:"w38",text:"Zona di Guerra",          desc:"Affronta 8 combattimenti",                            target:8,    type:"combats_total"},
 {id:"w39",text:"Pacifista Armato",        desc:"Completa 3 spedizioni senza perdere PV",              target:3,    type:"no_damage_missions"},
 {id:"w40",text:"Cacciatore di Teste",     desc:"Sconfiggi 25 nemici qualsiasi",                       target:25,   type:"kills_any"},
 {id:"w41",text:"Scopritore",              desc:"Trova 4 oggetti rari (grado/rarità 4+)",              target:4,    type:"rare_finds"},
 {id:"w42",text:"Alchimista",              desc:"Raccogli 15 oggetti diversi nella settimana",         target:15,   type:"unique_finds"},
 {id:"w43",text:"Ammazza Golem",           desc:"Sconfiggi 3 golem o colossi",                         target:3,    type:"kills_tag", tag:"golem"},
 {id:"w44",text:"Cacciatore di Spiriti",   desc:"Sconfiggi 3 spiriti o spettri",                       target:3,    type:"kills_tag", tag:"spirito"},
 {id:"w45",text:"Distruttore di Elementali",desc:"Sconfiggi 2 elementali",                             target:2,    type:"kills_tag", tag:"elementale"},
 {id:"w46",text:"Grande Esploratore",      desc:"Parti in spedizione 30 volte",                        target:30,   type:"missions_total"},
 {id:"w47",text:"Ricchissimo",             desc:'Guadagna 1000 <span class="mk-coin"></span> dalle spedizioni',               target:1000, type:"denari_earned"},
 {id:"w48",text:"Terrore del Bestiario",   desc:"Uccidi 20 nemici",                                    target:20,   type:"kills_any"},
 {id:"w49",text:"Sterminatore Totale",     desc:"Sconfiggi 20 nemici qualsiasi",                       target:20,   type:"kills_any"},
 {id:"w50",text:"Grande Cacciatore",       desc:"Sconfiggi 1 nemico di livello 120+",                  target:1,    type:"kills_lvl", minLvl:120},
];

/* ══════════════════════════════════════════════════════════
 IMMAGINI — percorsi standardizzati
 img/ranks/<titolo_minuscolo>.png — avatar per ogni rango (27 file)
 img/enemies/<id>.png — una per nemico (e001…e190)
 img/equip/<id>.png — una per ogni arma, scudo e armatura (a11…g105, 300 file)
 img/treasures/<id>.png — una per ogni tesoro (t001…t100, al001…al180, gl01…gl10, r01…r20, mat_*)
 Se un file manca, il codice mostra l'icona/simbolo di fallback.
══════════════════════════════════════════════════════════ */

/** Tutti i titoli/ranghi con il percorso immagine corrispondente */
export const RANK_IMG_MAP = {}; // popolato dopo rankTitles

/* ══════════════════════════════════════════════════════════
 EQUIPMENT POOL — 300 pezzi (50 per slot × 6 slot, 5 per tier nei tier 1-10)
 Slot: testa, torace, braccia, mano_dx, mano_sx, gambe
 Statistiche: attacco (Forza), difesa, velocita, destrezza, critico
 Rarità: comune (costruibile dal fabbro o loot), magico (solo loot), leggendario (solo loot)
══════════════════════════════════════════════════════════ */
export const EQUIP_SLOTS = ["testa", "torace", "braccia", "mano_dx", "mano_sx", "gambe"];

export const SLOT_LABELS = {
  testa:   "Testa",
  torace:  "Torace",
  braccia: "Braccia",
  mano_dx: "Mano Destra",
  mano_sx: "Mano Sinistra",
  gambe:   "Gambe",
};

const SLOT_PREFIX = {
  mano_dx: "a",
  testa:   "e",
  mano_sx: "s",
  torace:  "c",
  gambe:   "g",
  braccia: "b",
};

const TIER_DEFAULT_RECIPES = {
  1: [
    [{ id: "mat_legno", qty: 2 }],
    [{ id: "mat_legno", qty: 3 }],
    [{ id: "mat_legno", qty: 2 }, { id: "mat_ambra", qty: 1 }],
  ],
  2: [
    [{ id: "mat_legno", qty: 2 }, { id: "mat_carbone", qty: 1 }],
    [{ id: "mat_carbone", qty: 2 }, { id: "mat_rame", qty: 1 }],
    [{ id: "mat_ambra", qty: 2 }, { id: "mat_rame", qty: 1 }],
  ],
  3: [
    [{ id: "mat_rame", qty: 2 }, { id: "mat_carbone", qty: 2 }],
    [{ id: "mat_rame", qty: 3 }, { id: "mat_carbone", qty: 2 }],
    [{ id: "mat_rame", qty: 2 }, { id: "mat_ambra", qty: 2 }],
  ],
  4: [
    [{ id: "mat_bronzo", qty: 2 }, { id: "mat_carbone", qty: 2 }],
    [{ id: "mat_bronzo", qty: 3 }, { id: "mat_rame", qty: 2 }],
    [{ id: "mat_bronzo", qty: 3 }, { id: "mat_ferro", qty: 1 }],
  ],
  5: [
    [{ id: "mat_ferro", qty: 2 }, { id: "mat_carbone", qty: 3 }],
    [{ id: "mat_ferro", qty: 3 }, { id: "mat_bronzo", qty: 2 }],
    [{ id: "mat_ferro", qty: 4 }, { id: "mat_carbone", qty: 2 }],
  ],
  6: [
    [{ id: "mat_ferro", qty: 3 }, { id: "mat_granito", qty: 2 }],
    [{ id: "mat_granito", qty: 3 }, { id: "mat_ferro", qty: 3 }],
    [{ id: "mat_granito", qty: 3 }, { id: "mat_argento", qty: 1 }],
  ],
  7: [
    [{ id: "mat_argento", qty: 2 }, { id: "mat_granito", qty: 2 }],
    [{ id: "mat_argento", qty: 3 }, { id: "mat_ferro", qty: 3 }],
    [{ id: "mat_argento", qty: 4 }, { id: "mat_granito", qty: 2 }],
  ],
  8: [
    [{ id: "mat_oro", qty: 2 }, { id: "mat_argento", qty: 2 }],
    [{ id: "mat_oro", qty: 3 }, { id: "mat_topazio", qty: 2 }],
    [{ id: "mat_topazio", qty: 3 }, { id: "mat_oro", qty: 2 }],
  ],
  9: [
    [{ id: "mat_ossidiana", qty: 3 }, { id: "mat_topazio", qty: 2 }],
    [{ id: "mat_ossidiana", qty: 3 }, { id: "mat_rubino", qty: 2 }],
    [{ id: "mat_rubino", qty: 3 }, { id: "mat_ossidiana", qty: 3 }],
  ],
  10: [
    [{ id: "mat_platino", qty: 3 }, { id: "mat_rubino", qty: 2 }],
    [{ id: "mat_platino", qty: 3 }, { id: "mat_diamante", qty: 2 }],
    [{ id: "mat_diamante", qty: 3 }, { id: "mat_platino", qty: 3 }],
  ],
};

function genEquip(slot, tier, idx, name, bonus, desc, opts = {}) {
  const priceBase = [0, 45, 110, 240, 450, 780, 1250, 1900, 2750, 3900, 5800];
  const priceVar  = [0, 12, 25,  50,  85,  120, 170,  230,  310,  450,  600];
  const rarita = opts.rarita || (idx <= 3 ? "comune" : idx === 4 ? "magico" : "leggendario");
  const raritaMult = rarita === "leggendario" ? 1.4 : rarita === "magico" ? 1.2 : 1.0;
  const prezzo = Math.round((priceBase[tier] + (idx - 1) * priceVar[tier]) * raritaMult);
  const fonte = opts.fonte || (idx <= 2 ? ["fabbro"] : (idx === 3 && tier <= 6) ? ["fabbro"] : ["loot"]);
  const handType = opts.handType || (slot === "mano_dx" ? "1h" : slot === "mano_sx" ? "shield" : null);
  const recipe = fonte.includes("fabbro")
    ? (opts.recipe || (TIER_DEFAULT_RECIPES[tier] && TIER_DEFAULT_RECIPES[tier][Math.min(2, idx - 1)]) || [{ id: "mat_legno", qty: 2 }])
    : null;
  const prefix = SLOT_PREFIX[slot] || slot[0];
  const icon = slot === "mano_dx" ? "🗡️" : (slot === "mano_sx" && handType === "1h" ? "🗡️" : "🛡️");
  const id = `${prefix}${tier}${idx}`;
  return {
    id,
    slot,
    handType,
    rarita,
    icon,
    img: opts.img || `img/equip/${id}.png`,
    tier,
    name,
    bonus,
    desc,
    prezzo,
    fonte,
    recipe,
  };
}

export const EQUIPMENT_POOL = [
  // ══════════════════════════════════════════════════════════
  // 1. MANO DESTRA (50 Armi Principali: 1H e 2H)
  // ══════════════════════════════════════════════════════════
  // Tier 1
  genEquip("mano_dx",1,1,"Coltello da Scuoiatore",      {attacco:2,velocita:1,destrezza:1},           "Lama corta in ferro grezzo, leggera e rapida nei fendenti ravvicinati", {handType:"1h"}),
  genEquip("mano_dx",1,2,"Randello Ferrato",            {attacco:4,velocita:-1},                      "Bastone di frassino appesantito da chiodi in ferro battuto", {handType:"1h"}),
  genEquip("mano_dx",1,3,"Forcone da Guerra",           {attacco:6,difesa:1,velocita:-2,destrezza:-1},"Attrezzo contadino riadattato a lancia lunga per tenere a bada le belve", {handType:"2h"}),
  genEquip("mano_dx",1,4,"Pugnale di Selce Nera",       {attacco:3,velocita:2,critico:3,destrezza:1}, "Lama rituale scheggiata da una vena vulcanica che vibra al buio", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_dx",1,5,"Spada Spezzata del Disertore",{attacco:6,critico:4,velocita:1,difesa:-1},   "Vecchia lama militare riforgiata nel sangue lungo i confini della foresta", {handType:"1h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 2
  genEquip("mano_dx",2,1,"Spada Corta da Fante",        {attacco:5,velocita:1,destrezza:1},           "Ordinanza leggera della milizia cittadina, ben bilanciata per le stoccate", {handType:"1h"}),
  genEquip("mano_dx",2,2,"Mazza Chiodata",              {attacco:7,critico:1,velocita:-1},            "Testa di ferro massiccio progettata per ammaccare elmi e piastre", {handType:"1h"}),
  genEquip("mano_dx",2,3,"Picca da Trincea",            {attacco:10,difesa:2,velocita:-2,destrezza:-1},"Lunga asta di rovere con punta piramidale, richiede entrambe le mani", {handType:"2h"}),
  genEquip("mano_dx",2,4,"Sciabola del Contrabbandiere",{attacco:7,velocita:3,destrezza:2,critico:2}, "Lama ricurva incisa con segni del vento che fende l'aria senza rumore", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_dx",2,5,"Maglio del Capominiera",      {attacco:13,critico:5,velocita:-3,destrezza:-2},"Pesante martello a due mani intriso del calore delle gallerie profonde", {handType:"2h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 3
  genEquip("mano_dx",3,1,"Spada d'Arme",                {attacco:8,difesa:1,destrezza:1},             "Classica spada dritta a doppio filo con elsa a croce in acciaio temprato", {handType:"1h"}),
  genEquip("mano_dx",3,2,"Ascia Barbuta",               {attacco:11,critico:2,velocita:-1,difesa:-1}, "Scure a una mano dal tagliente allungato per agganciare gli scudi avversari", {handType:"1h"}),
  genEquip("mano_dx",3,3,"Alabarda da Guardia",         {attacco:15,difesa:3,velocita:-2,destrezza:-2},"Combina scure, lancia e uncino su un'asta di due metri", {handType:"2h"}),
  genEquip("mano_dx",3,4,"Stocco d'Argento Vivo",       {attacco:10,velocita:4,destrezza:3,critico:4},"Lama sottile temprata in sali alchemici, micidiale nei punti vitali", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_dx",3,5,"Spadone del Giudice",         {attacco:19,critico:6,difesa:2,velocita:-3},  "Lama di esecuzione a due mani recante i versi di un antico codice penale", {handType:"2h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 4
  genEquip("mano_dx",4,1,"Sciabola da Abordaggio",      {attacco:13,velocita:2,destrezza:2},          "Lama corta e robusta con guardia a cestello per proteggere le nocche", {handType:"1h"}),
  genEquip("mano_dx",4,2,"Martello da Guerra",          {attacco:16,critico:3,velocita:-2},           "Becco di corvo posteriore e testa battente per sfondare le corazze pesanti", {handType:"1h"}),
  genEquip("mano_dx",4,3,"Spadone da Fante",            {attacco:22,critico:4,velocita:-3,destrezza:-2},"Zweihänder d'acciaio con ricasso in cuoio per le prese ravvicinate", {handType:"2h"}),
  genEquip("mano_dx",4,4,"Lama Nera di Corallo",        {attacco:16,velocita:3,critico:5,destrezza:2},"Forgiata dai pirati abissali con corallo nero indurito dal sangue", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_dx",4,5,"Tridente del Naufrago Re",    {attacco:26,difesa:4,critico:5,velocita:-2},  "Arma inastata a tre punte che richiama la furia delle mareggiate", {handType:"2h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 5
  genEquip("mano_dx",5,1,"Rapiera da Duello",           {attacco:18,velocita:4,destrezza:3,critico:3},"Lama flessibile ed elegante, progettata per affondi fulminei", {handType:"1h"}),
  genEquip("mano_dx",5,2,"Spada Bastarda",              {attacco:21,difesa:2,critico:2,velocita:-1},  "Lama lunga e solida, bilanciata per fendenti potenti a una mano", {handType:"1h"}),
  genEquip("mano_dx",5,3,"Berdica del Nord",            {attacco:29,critico:6,velocita:-4,destrezza:-2},"Enorme lama a mezzaluna montata su asta, spacca scudi e cavalli", {handType:"2h"}),
  genEquip("mano_dx",5,4,"Brando delle Braci",          {attacco:23,critico:6,velocita:2,difesa:-2},  "Lama perennemente rovente lungo il filo, lascia scie di cenere nell'aria", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_dx",5,5,"Claymore dei Venti Gelidi",   {attacco:34,velocita:3,critico:7,difesa:-2},  "Spadone leggendario dei clan montani, leggero come il vento di tormenta", {handType:"2h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 6
  genEquip("mano_dx",6,1,"Cinquedea Veneziana",         {attacco:23,velocita:3,critico:4,destrezza:2},"Lama larga alla base e scanalata, letale negli scontri stretti", {handType:"1h"}),
  genEquip("mano_dx",6,2,"Mazza Flangiata d'Acciaio",   {attacco:27,difesa:2,critico:3,velocita:-2},  "Sei alette d'acciaio temprato che non rimbalzano mai sulle piastre", {handType:"1h"}),
  genEquip("mano_dx",6,3,"Lancia da Cavalleria Pesante",{attacco:36,difesa:4,velocita:-3,destrezza:-2},"Lunga lancia d'assalto bilanciata per impatti devastanti a due mani", {handType:"2h"}),
  genEquip("mano_dx",6,4,"Spada Runica del Tuono",      {attacco:28,velocita:5,critico:6,destrezza:2},"Incisa con glifi celesti che scaricano archi voltaici a ogni parata", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_dx",6,5,"Falce Lunare dell'Eclissi",   {attacco:42,critico:10,destrezza:3,difesa:-4},"Grande falce da guerra a due mani che miete le ombre stesse dei nemici", {handType:"2h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 7
  genEquip("mano_dx",7,1,"Khopesh delle Dune",          {attacco:29,velocita:3,critico:4,destrezza:2},"Spada-falce in bronzo e acciaio meteorico usata dalle guardie reali", {handType:"1h"}),
  genEquip("mano_dx",7,2,"Scimitarra di Damasco",       {attacco:32,velocita:4,destrezza:4,critico:3},"Acciaio marezzato a cento strati, scorre come acqua tra le difese", {handType:"1h"}),
  genEquip("mano_dx",7,3,"Glaive del Guardiano",        {attacco:43,difesa:5,critico:4,velocita:-3},  "Lama ricurva su lunga asta dorata, orgoglio dei custodi del tempio", {handType:"2h",fonte:["loot"]}),
  genEquip("mano_dx",7,4,"Lama Velenosa di Scorpione",  {attacco:35,velocita:5,critico:8,destrezza:3},"Scanalature interne rilasciano una neurotossina a ogni ferita inflitta", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_dx",7,5,"Spadone del Re Sepolto",      {attacco:50,difesa:4,critico:8,velocita:-4},  "Colossale lama cerimoniale intrisa del potere necromantico delle piramidi", {handType:"2h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 8
  genEquip("mano_dx",8,1,"Spada Lunga in Mithril",      {attacco:36,velocita:6,destrezza:4,critico:3},"Forgiata nel raro argento delle vette, pesa la metà dell'acciaio comune", {handType:"1h"}),
  genEquip("mano_dx",8,2,"Ascia Reale a Mano Singola",  {attacco:40,critico:6,difesa:2,velocita:-1},  "Lama d'oro temprato e acciaio scuro, spezza scudi e volontà", {handType:"1h"}),
  genEquip("mano_dx",8,3,"Martello Colossale dei Titani",{attacco:53,critico:8,velocita:-5,destrezza:-3},"Blocco di metallo astrale che richiede forza sovrumana per essere brandito", {handType:"2h",fonte:["loot"]}),
  genEquip("mano_dx",8,4,"Stocco Astrale",              {attacco:42,velocita:7,destrezza:5,critico:7},"La punta brilla come una stella fissa, guidando la mano verso il cuore", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_dx",8,5,"Alabarda del Sole Nero",      {attacco:58,difesa:6,critico:9,velocita:-3},  "Reliquia bellica di un impero caduto, avvolta da una corona di fuoco oscuro", {handType:"2h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 9
  genEquip("mano_dx",9,1,"Lama d'Ossidiana Infernale",  {attacco:44,velocita:5,critico:7,difesa:-2},  "Vetro vulcanico dell'Oltretomba affilato a livello molecolare", {handType:"1h"}),
  genEquip("mano_dx",9,2,"Mazza del Signore dei Morti", {attacco:48,difesa:4,critico:5,velocita:-2},  "Testa forgiata a forma di teschio coronato che rintocca a ogni impatto", {handType:"1h"}),
  genEquip("mano_dx",9,3,"Falce del Mietitore d'Anime", {attacco:63,critico:12,velocita:-3,difesa:-4},"Lunga falce spettrale a due mani che recide il legame tra corpo e spirito", {handType:"2h",fonte:["loot"]}),
  genEquip("mano_dx",9,4,"Spada del Vuoto Silente",     {attacco:51,velocita:6,destrezza:5,critico:8},"Non emette alcun suono quando colpisce, divorando la luce circostante", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_dx",9,5,"Zweihänder dell'Abisso",      {attacco:68,critico:11,difesa:5,velocita:-4}, "Spadone monumentale temprato nelle fucine demoniache del nono cerchio", {handType:"2h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 10
  genEquip("mano_dx",10,1,"Spada Celata di Platino",    {attacco:52,velocita:7,destrezza:6,critico:6},"Lama perfetta forgiata nel metallo incorruttibile dell'Empireo", {handType:"1h"}),
  genEquip("mano_dx",10,2,"Scettro Bellico del Sovrano",{attacco:56,difesa:6,critico:7,velocita:-1},  "Simbolo di dominio assoluto, capace di frantumare barriere divine", {handType:"1h"}),
  genEquip("mano_dx",10,3,"Lancia del Firmamento",      {attacco:72,difesa:8,destrezza:5,velocita:-2},"Asta di luce solidificata che richiede entrambe le mani per essere dominata", {handType:"2h",fonte:["loot"]}),
  genEquip("mano_dx",10,4,"Lama dell'Asceso",           {attacco:62,velocita:8,critico:10,destrezza:6},"Arma primordiale che risponde istantaneamente al pensiero del portatore", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_dx",10,5,"Excalibur del Crepuscolo",   {attacco:82,critico:14,difesa:6,velocita:-2}, "Lo spadone definitivo, forgiato all'alba del mondo per abbattere gli dèi", {handType:"2h",rarita:"leggendario",fonte:["loot"]}),

  // ══════════════════════════════════════════════════════════
  // 2. MANO SINISTRA (50 Scudi e Armi Secondarie 1H)
  // ══════════════════════════════════════════════════════════
  // Tier 1
  genEquip("mano_sx",1,1,"Brocchiere di Legno",         {difesa:2,destrezza:1},                       "Piccolo scudo tondo da pugno, utile per deviare fendenti rapidi", {handType:"shield"}),
  genEquip("mano_sx",1,2,"Tavola di Rovere Ferrata",    {difesa:4,velocita:-1,destrezza:-1},          "Asse spessa rinforzata con fasce di ferro grezzo, pesante ma solida", {handType:"shield"}),
  genEquip("mano_sx",1,3,"Coltello da Caccia Secondario",{attacco:2,velocita:2,critico:1},            "Lama corta bilanciata per essere impugnata nella mano non dominante", {handType:"1h"}),
  genEquip("mano_sx",1,4,"Targa d'Ambra Silvana",       {difesa:4,velocita:1,destrezza:2},            "Scudo leggero incrostato di resina fossile che attutisce i colpi", {handType:"shield",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_sx",1,5,"Artiglio del Branco",         {attacco:4,velocita:3,critico:3,difesa:-1},   "Pugnale ricurvo ricavato dalla zanna di un lupo alfa antico", {handType:"1h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 2
  genEquip("mano_sx",2,1,"Rotella di Cuoio Bollito",    {difesa:4,velocita:1,destrezza:1},            "Scudo circolare foderato in cuoio indurito a cera, molto maneggevole", {handType:"shield"}),
  genEquip("mano_sx",2,2,"Scudo Rotondo Vichingo",      {difesa:7,velocita:-1,destrezza:-1},          "Tavole di tiglio con umbone centrale in ferro per respingere gli assalti", {handType:"shield"}),
  genEquip("mano_sx",2,3,"Daga da Parata",              {attacco:4,difesa:2,destrezza:2},             "Guardia ad anello progettata per intrappolare la lama avversaria", {handType:"1h"}),
  genEquip("mano_sx",2,4,"Stiletto delle Ombre",        {attacco:6,velocita:3,critico:4,destrezza:2}, "Lama a sezione triangolare per colpi furtivi con la mano sinistra", {handType:"1h",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_sx",2,5,"Scudo del Minatore Sepolto",  {difesa:10,attacco:2,velocita:-2,destrezza:-1},"Piastra di carrello minerario temprata da crolli e fiamme sotterranee", {handType:"shield",rarita:"leggendario",fonte:["loot"]}),
  // Tier 3
  genEquip("mano_sx",3,1,"Brocchiere d'Acciaio",        {difesa:6,destrezza:2,critico:1},             "Scudo da duello interamente metallico, eccellente per il contrattacco", {handType:"shield"}),
  genEquip("mano_sx",3,2,"Scudo a Goccia Normanno",     {difesa:11,velocita:-2,destrezza:-1},         "Profilo allungato che protegge dal torso fino al ginocchio sinistro", {handType:"shield"}),
  genEquip("mano_sx",3,3,"Manosinistra da Duello",      {attacco:6,difesa:3,destrezza:2,critico:2},   "Daga rinascimentale con vela protettiva e lama spezza-punte", {handType:"1h"}),
  genEquip("mano_sx",3,4,"Scudo Eraldico Benedetto",    {difesa:12,velocita:1,destrezza:1},           "Dipinto con i colori di un ordine cavalleresco, infonde calma in mischia", {handType:"shield",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_sx",3,5,"Zanna Gemella del Gladiatore",{attacco:10,velocita:4,critico:5,destrezza:2},"Spada corta da arena pensata per chi combatte senza scudo", {handType:"1h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 4
  genEquip("mano_sx",4,1,"Targa Chiodata da Corsaro",   {difesa:9,attacco:2,destrezza:2},             "Munita di uno spuntone centrale per colpire con il dorso dello scudo", {handType:"shield"}),
  genEquip("mano_sx",4,2,"Pavese da Fanteria",          {difesa:15,velocita:-3,destrezza:-2},         "Grande scudo rettangolare in grado di fermare dardi e fendenti pesanti", {handType:"shield"}),
  genEquip("mano_sx",4,3,"Trincia-Lame Dentato",        {attacco:9,difesa:4,critico:3,destrezza:2},   "Profonde intaccature lungo il dorso permettono di spezzare le spade nemiche", {handType:"1h"}),
  genEquip("mano_sx",4,4,"Rotella delle Maree",         {difesa:14,velocita:2,destrezza:3},           "Forgiata in bronzo marino, devia i colpi con la fluidità dell'acqua", {handType:"shield",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_sx",4,5,"Arpione Corto del Kraken",    {attacco:14,critico:6,velocita:3,difesa:2},   "Lama secondaria uncinata ricavata dal rostro di un mostro degli abissi", {handType:"1h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 5
  genEquip("mano_sx",5,1,"Scudo Riscaldato da Sella",   {difesa:13,velocita:1,destrezza:2},           "Scudo triangolare compatto, ideale per non ostacolare i movimenti", {handType:"shield"}),
  genEquip("mano_sx",5,2,"Scudo Torre Legionario",      {difesa:20,velocita:-3,destrezza:-3},         "Muraglia portatile curvata che copre l'intero corpo del guerriero", {handType:"shield"}),
  genEquip("mano_sx",5,3,"Wakizashi d'Acciaio Piegato", {attacco:13,velocita:4,critico:4,destrezza:3},"Spada corta orientale dal filo rasoio per doppi fendenti incrociati", {handType:"1h"}),
  genEquip("mano_sx",5,4,"Scudo Glaciale delle Vette",  {difesa:19,attacco:3,velocita:-1},            "Ricoperto di ghiaccio perenne che intorpidisce le braccia di chi lo colpisce", {handType:"shield",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_sx",5,5,"Lama d'Ombra Secondaria",     {attacco:18,velocita:6,critico:7,destrezza:4},"Appare e scompare tra le dita della mano sinistra, impossibile da prevedere", {handType:"1h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 6
  genEquip("mano_sx",6,1,"Rotella d'Acciaio Incisa",    {difesa:16,destrezza:3,velocita:2},           "Scudo leggero nervato che fa scivolare via anche i colpi di mazza", {handType:"shield"}),
  genEquip("mano_sx",6,2,"Grande Bastione d'Assedio",   {difesa:25,velocita:-4,destrezza:-3},         "Lastra d'acciaio massiccio progettata per avanzare sotto il fuoco nemico", {handType:"shield"}),
  genEquip("mano_sx",6,3,"Kriss Serpeggiante",          {attacco:17,velocita:4,critico:6,destrezza:3},"Pugnale a lama ondulata che lacera le giunture delle armature", {handType:"1h"}),
  genEquip("mano_sx",6,4,"Scudo di Scaglie di Wyvern",  {difesa:23,velocita:2,destrezza:2},           "Leggero come il cuoio ma più duro del ferro grazie alle scaglie draconiche", {handType:"shield",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_sx",6,5,"Egida del Fulmine Bianco",    {difesa:27,velocita:3,attacco:4,destrezza:2}, "Scudo leggendario dei cieli che respinge gli assalti con un boato di tuono", {handType:"shield",rarita:"leggendario",fonte:["loot"]}),
  // Tier 7
  genEquip("mano_sx",7,1,"Targa Dorata del Deserto",    {difesa:20,velocita:2,destrezza:3},           "Scudo curvo in lega d'oro e bronzo che riflette la luce accecando il nemico", {handType:"shield"}),
  genEquip("mano_sx",7,2,"Scudo Sarcofago",             {difesa:30,velocita:-4,destrezza:-3},         "Pesante scudo torre scolpito come il coperchio di una tomba regale", {handType:"shield"}),
  genEquip("mano_sx",7,3,"Katar da Pugno",              {attacco:22,velocita:5,critico:7,destrezza:3},"Pugnale a spinta con impugnatura trasversale, estensione naturale del braccio", {handType:"1h",fonte:["loot"]}),
  genEquip("mano_sx",7,4,"Scudo dello Scarabeo Sacro",  {difesa:27,destrezza:4,critico:3},            "Avvolto da un campo di sabbia vorticosa che devia i fendenti", {handType:"shield",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_sx",7,5,"Zanna di Anubi",              {attacco:27,velocita:6,critico:9,difesa:3},   "Lama corta cerimoniale usata per pesare il cuore dei guerrieri caduti", {handType:"1h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 8
  genEquip("mano_sx",8,1,"Brocchiere di Mithril",       {difesa:24,velocita:4,destrezza:5},           "Talmente leggero da sembrare privo di peso, perfetto per schivare e parare", {handType:"shield"}),
  genEquip("mano_sx",8,2,"Muro dei Titani",             {difesa:36,attacco:3,velocita:-5,destrezza:-4},"Scudo colossale forgiato per reggere l'urto di giganti e draghi", {handType:"shield"}),
  genEquip("mano_sx",8,3,"Daga Reale in Topazio",       {attacco:27,velocita:5,critico:8,destrezza:4},"Lama secondaria della guardia imperiale che brilla di luce solare", {handType:"1h",fonte:["loot"]}),
  genEquip("mano_sx",8,4,"Scudo Specchio Arcano",       {difesa:32,destrezza:5,velocita:3},           "Superficie levigata a specchio che disorienta chiunque tenti di affondare il colpo", {handType:"shield",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_sx",8,5,"Lama Gemella delle Stelle",   {attacco:33,velocita:8,critico:10,destrezza:5},"Forgiata dallo stesso meteorite della Spada delle Stelle per il dual-wielding", {handType:"1h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 9
  genEquip("mano_sx",9,1,"Targa d'Ossidiana Tagliente", {difesa:28,attacco:6,critico:4,destrezza:2},  "I bordi affilati dello scudo trasformano ogni parata in un fendente", {handType:"shield"}),
  genEquip("mano_sx",9,2,"Bastione delle Anime Dannate",{difesa:42,velocita:-5,destrezza:-3},         "Pesante scudo nero su cui affiorano i volti pietrificati dei caduti", {handType:"shield"}),
  genEquip("mano_sx",9,3,"Stiletto Cremisi del Vampiro",{attacco:33,velocita:7,critico:9,destrezza:4},"Daga sottile dell'Oltretomba che cerca istintivamente le arterie scoperte", {handType:"1h",fonte:["loot"]}),
  genEquip("mano_sx",9,4,"Egida Spettrale",             {difesa:37,velocita:4,destrezza:6},           "Parzialmente incorporea, assorbe l'energia cinetica senza trasmettere l'urto", {handType:"shield",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_sx",9,5,"Artiglio del Signore Abissale",{attacco:40,velocita:8,critico:12,difesa:4}, "Lama secondaria demoniaca viva che squarcia ferro e carne con uguale facilità", {handType:"1h",rarita:"leggendario",fonte:["loot"]}),
  // Tier 10
  genEquip("mano_sx",10,1,"Rotella di Platino Celeste", {difesa:34,velocita:5,destrezza:6},           "Scudo da duello divino, bilanciato con perfezione geometrica assoluta", {handType:"shield"}),
  genEquip("mano_sx",10,2,"Bastione Incorruttibile",    {difesa:48,velocita:-4,destrezza:-2},         "Scudo torre forgiato in diamante e platino, nessuna forza mortale può incrinare", {handType:"shield"}),
  genEquip("mano_sx",10,3,"Daga di Luce Solida",        {attacco:39,velocita:8,critico:10,destrezza:6},"Impugnatura d'oro da cui scaturisce una lama corta di puro fulgore", {handType:"1h",fonte:["loot"]}),
  genEquip("mano_sx",10,4,"Scudo dell'Orizzonte Eterno",{difesa:44,velocita:4,destrezza:5,attacco:4}, "Riflette la volta dell'Empireo, deviando i colpi prima ancora che arrivino", {handType:"shield",rarita:"magico",fonte:["loot"]}),
  genEquip("mano_sx",10,5,"Egida del Re Eterno",        {difesa:52,attacco:8,velocita:3,destrezza:5}, "Lo scudo supremo degli dèi, unisce difesa impenetrabile e grazia assoluta", {handType:"shield",rarita:"leggendario",fonte:["loot"]}),

  // ══════════════════════════════════════════════════════════
  // 3. TESTA (50 Elmi, Copricapi, Cappucci)
  // ══════════════════════════════════════════════════════════
  // Tier 1
  genEquip("testa",1,1,"Cappuccio di Lana Grezza",      {difesa:1,velocita:1,destrezza:1},            "Ripara dal freddo e lascia la visuale completamente libera"),
  genEquip("testa",1,2,"Cuffia di Cuoio Imbottita",     {difesa:2,destrezza:1},                       "Sottocasco trapuntato che attutisce le percosse alla testa"),
  genEquip("testa",1,3,"Cerchiata di Ferro",            {difesa:3,velocita:-1},                       "Banda di ferro chiodata attorno alle tempie con nasale dritto"),
  genEquip("testa",1,4,"Cappuccio del Bracconiere",     {difesa:2,destrezza:2,critico:2,velocita:1},  "Tessuto mimetico intriso di resine del bosco che acuisce i sensi", {rarita:"magico",fonte:["loot"]}),
  genEquip("testa",1,5,"Maschera di Corteccia Antica",  {difesa:4,attacco:2,destrezza:1,velocita:-1}, "Volto ligneo scolpito dagli spiriti silvani, dura come la quercia", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 2
  genEquip("testa",2,1,"Cappuccio in Pelle di Lupo",    {difesa:2,velocita:2,destrezza:1,critico:1},  "Leggero e caldo, permette movimenti rapidi del collo"),
  genEquip("testa",2,2,"Cappello di Ferro da Fante",    {difesa:4,destrezza:1},                       "Elmo a tesa larga che protegge dai fendenti dall'alto senza chiudere la vista"),
  genEquip("testa",2,3,"Elmo Normanno con Nasale",      {difesa:6,velocita:-1,destrezza:-1},          "Calotta conica in ferro battuto che fa scivolare via i colpi di spada"),
  genEquip("testa",2,4,"Diadema di Rame Runico",        {difesa:4,velocita:2,critico:3,destrezza:2},  "Cerchio metallico estratto dalle miniere che schiarisce i riflessi", {rarita:"magico",fonte:["loot"]}),
  genEquip("testa",2,5,"Elmo Chiuso del Caposquadra",   {difesa:8,attacco:2,velocita:-2,destrezza:-1},"Pesante celata forgiata per resistere ai crolli di roccia", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 3
  genEquip("testa",3,1,"Cappuccio di Maglia Fine",      {difesa:5,destrezza:1,velocita:1},            "Camaglio di anelli intrecciati che avvolge capo, nuca e spalle"),
  genEquip("testa",3,2,"Barbuta d'Acciaio",             {difesa:7,critico:1,destrezza:-1},            "Elmo integrale con apertura a T che coniuga protezione e respiro"),
  genEquip("testa",3,3,"Grande Elmo Crociato",          {difesa:10,velocita:-2,destrezza:-2},         "Cilindro d'acciaio piatto con strette fessure oculari, quasi impenetrabile"),
  genEquip("testa",3,4,"Celata del Duellante",          {difesa:7,velocita:3,destrezza:3,critico:2},  "Profilo aerodinamico temperato nell'argento per non rallentare mai lo sguardo", {rarita:"magico",fonte:["loot"]}),
  genEquip("testa",3,5,"Elmo Creato del Gladiatore",    {difesa:11,attacco:4,critico:3,destrezza:-1}, "Sormontato da una cresta bronzea insanguinata in cento battaglie nell'arena", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 4
  genEquip("testa",4,1,"Tricorno Foderato in Cuoio",    {difesa:7,velocita:3,destrezza:3,critico:2},  "Copricapo da capitano di ventura rinforzato internamente con lamine sottili"),
  genEquip("testa",4,2,"Morione Spagnolo",              {difesa:10,critico:2,destrezza:1},            "Elmo a cresta alta e falde ricurve, protegge il volto lasciando mira perfetta"),
  genEquip("testa",4,3,"Bacinetto a Muso di Cane",      {difesa:14,velocita:-2,destrezza:-2},         "Visiera conica allungata progettata per deviare lance e frecce"),
  genEquip("testa",4,4,"Cappuccio delle Nebbie Marine", {difesa:10,velocita:4,destrezza:4,critico:3}, "Tessuto incantato che confonde la sagoma della testa tra i flutti", {rarita:"magico",fonte:["loot"]}),
  genEquip("testa",4,5,"Elmo di Corallo del Re Pirata", {difesa:15,attacco:4,critico:4,velocita:-1},  "Incrostato di madrepore indistruttibili e forgiato nell'oro sommerso", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 5
  genEquip("testa",5,1,"Cappuccio Furtivo d'Ombra",     {difesa:10,velocita:4,destrezza:4,critico:3}, "Seta scura multistrato che permette una percezione periferica totale"),
  genEquip("testa",5,2,"Borgognotta da Ufficiale",      {difesa:14,attacco:2,critico:2},              "Elmo aperto con frontale e guanciali mobili, prediletto dai comandanti"),
  genEquip("testa",5,3,"Armet Completo da Giostra",     {difesa:19,velocita:-3,destrezza:-3},         "Elmo chiuso a piastre incernierate che blinda interamente testa e gola"),
  genEquip("testa",5,4,"Diadema del Gelo Boreale",      {difesa:14,velocita:4,critico:5,destrezza:3}, "Cristallo delle vette che mantiene la mente fredda e calcolatrice", {rarita:"magico",fonte:["loot"]}),
  genEquip("testa",5,5,"Elmo Cornuto del Valchiria",    {difesa:20,attacco:5,velocita:3,destrezza:-1},"Forgiato in acciaio bianco con ali laterali che fischiano nella carica", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 6
  genEquip("testa",6,1,"Fascia Tattica del Maestro",    {difesa:12,velocita:5,destrezza:5,critico:4}, "Rinforzata con piastre di titanio cucite nella seta, zero ingombro"),
  genEquip("testa",6,2,"Celata Gotica Scanalata",       {difesa:18,destrezza:1,velocita:-1},          "Nervature nell'acciaio aumentano la resistenza strutturale riducendo il peso"),
  genEquip("testa",6,3,"Elmo a Testa di Rospo",         {difesa:24,velocita:-4,destrezza:-3},         "Pesantissimo elmo da cavalleria imbullonato direttamente alla corazza"),
  genEquip("testa",6,4,"Elmo di Scaglie di Drago",      {difesa:21,attacco:4,critico:4,velocita:1},   "Modellato sul cranio di una viverna, resiste al fuoco e alle lame", {rarita:"magico",fonte:["loot"]}),
  genEquip("testa",6,5,"Corona di Ferro del Conquistatore",{difesa:25,attacco:6,critico:5,velocita:-1},"Cerchio bellico forgiato fondendo le spade di dieci re sconfitti", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 7
  genEquip("testa",7,1,"Turbante Corazzato del Deserto",{difesa:16,velocita:4,destrezza:4,critico:2}, "Strati di seta avvolti attorno a una calotta d'acciaio, protegge da sole e fendenti"),
  genEquip("testa",7,2,"Elmo a Maschera Immortale",     {difesa:22,attacco:3,critico:3,destrezza:-1}, "Maschera funeraria in bronzo dorato che cela ogni espressione di dolore"),
  genEquip("testa",7,3,"Grande Elmo del Custode",       {difesa:28,velocita:-3,destrezza:-3},         "Pesante elmo cerimoniale in lega d'oro e ferro meteorico", {fonte:["loot"]}),
  genEquip("testa",7,4,"Cappuccio del Miraggio",        {difesa:20,velocita:6,destrezza:6,critico:4}, "Rifrange la luce del deserto facendo apparire la testa spostata di un palmo", {rarita:"magico",fonte:["loot"]}),
  genEquip("testa",7,5,"Nemes d'Oro del Faraone",       {difesa:29,attacco:6,velocita:3,critico:5},   "Copricapo regale con l'ureo sacro che incenerisce lo sguardo dei vili", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 8
  genEquip("testa",8,1,"Diadema in Mithril Filigranato",{difesa:20,velocita:6,destrezza:6,critico:5}, "Leggero come una piuma, proietta un velo deflettente davanti al volto"),
  genEquip("testa",8,2,"Elmo Reale in Oro Temprato",    {difesa:26,attacco:4,critico:4,velocita:-1},  "Forgiato per la guardia del trono con visiera a griglia finissima"),
  genEquip("testa",8,3,"Casco Colossale di Granito",    {difesa:34,velocita:-4,destrezza:-4},         "Scolpito nel cuore della montagna e rinforzato con vene di metallo astrale", {fonte:["loot"]}),
  genEquip("testa",8,4,"Elmo delle Costellazioni",      {difesa:28,velocita:5,destrezza:5,critico:6}, "All'interno della visiera brillano mappe stellari che anticipano le mosse nemiche", {rarita:"magico",fonte:["loot"]}),
  genEquip("testa",8,5,"Teschio Coronato del Titano",   {difesa:36,attacco:8,critico:6,velocita:-3},  "Elmo ricavato dall'osso frontale di un antico gigante, indistruttibile", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 9
  genEquip("testa",9,1,"Cappuccio del Carnefice Nero",  {difesa:24,velocita:6,destrezza:5,critico:7}, "Cuoio d'ombra cucito con tendini demoniaci, ispira terrore puro"),
  genEquip("testa",9,2,"Elmo d'Ossidiana e Rubino",     {difesa:31,attacco:5,critico:5,velocita:-2},  "Cresta di vetro vulcanico con un rubino centrale che pulsa di furore"),
  genEquip("testa",9,3,"Elmo Chiuso del Cavaliere Nero",{difesa:39,velocita:-4,destrezza:-3},         "Acciaio dell'Oltretomba saldato a freddo, nessuna lama può penetrarlo", {fonte:["loot"]}),
  genEquip("testa",9,4,"Corona di Spine Spettrali",     {difesa:30,attacco:7,velocita:6,critico:8},   "Sussurra i punti deboli del nemico direttamente nella mente dell'eroe", {rarita:"magico",fonte:["loot"]}),
  genEquip("testa",9,5,"Elmo del Signore dell'Oblio",   {difesa:42,attacco:9,critico:8,velocita:-2},  "Chi guarda nelle sue fessure vuote dimentica come impugnare la spada", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 10
  genEquip("testa",10,1,"Aureola di Platino",           {difesa:29,velocita:8,destrezza:7,critico:7}, "Cerchio fluttuante di metallo divino che protegge il capo senza toccarlo"),
  genEquip("testa",10,2,"Elmo Alato dell'Empireo",      {difesa:36,attacco:6,velocita:4,critico:5},   "Forgiato nelle fucine celesti, unisce protezione regale e vista d'aquila"),
  genEquip("testa",10,3,"Grande Elmo di Diamante Puro", {difesa:46,velocita:-3,destrezza:-2},         "Sfaccettato da un unico blocco di diamante immortale", {fonte:["loot"]}),
  genEquip("testa",10,4,"Diadema dell'Onniscienza",     {difesa:38,velocita:8,destrezza:8,critico:9}, "Permette di percepire il flusso del tempo un istante prima del colpo", {rarita:"magico",fonte:["loot"]}),
  genEquip("testa",10,5,"Corona dell'Asceso Eterno",    {difesa:48,attacco:10,velocita:5,critico:8},  "Insegna suprema di chi ha superato i limiti mortali e sconfitto il pantheon", {rarita:"leggendario",fonte:["loot"]}),

  // ══════════════════════════════════════════════════════════
  // 4. TORACE (50 Corazze, Cotte di Maglia, Vesti)
  // ══════════════════════════════════════════════════════════
  // Tier 1
  genEquip("torace",1,1,"Tunica di Lino Spesso",        {difesa:2,velocita:1,destrezza:1},            "Veste robusta a trama fitta che non impaccia la corsa né la schivata"),
  genEquip("torace",1,2,"Gambeson Imbottito",           {difesa:3,velocita:-1},                       "Giacca trapuntata di cotone grezzo e crine, assorbe l'impatto delle mazze"),
  genEquip("torace",1,3,"Pettorale di Cuoio Crudo",     {difesa:4,velocita:-1,destrezza:-1},          "Pelli sovrapposte indurite nel sego bollente, rigido ma protettivo"),
  genEquip("torace",1,4,"Cappa Verde del Guardaboschi", {difesa:3,velocita:2,destrezza:3,critico:1},  "Intrecciata con fibre vive che si mimetizzano nel sottobosco", {rarita:"magico",fonte:["loot"]}),
  genEquip("torace",1,5,"Corazza di Corteccia di Treant",{difesa:6,attacco:1,velocita:-2,destrezza:-1},"Spessa scorza arborea rigenerante strappata a un antico spirito del bosco", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 2
  genEquip("torace",2,1,"Farsetto da Schermidore",      {difesa:4,velocita:2,destrezza:2},            "Pelle morbida rinforzata sul petto con stecche d'osso flessibili"),
  genEquip("torace",2,2,"Giaco di Maglia di Rame",      {difesa:7,velocita:-1},                       "Anelli metallici intrecciati che proteggono il busto dai tagli"),
  genEquip("torace",2,3,"Corazza a Scaglie di Ferro",   {difesa:9,velocita:-2,destrezza:-2},          "Centinaia di piastrine cucite su cuoio, rumorosa e pesante ma solida"),
  genEquip("torace",2,4,"Tunica Runica del Minatore",   {difesa:7,velocita:2,destrezza:2,critico:2},  "Tessuto ignifugo inciso con sigilli di protezione contro i crolli", {rarita:"magico",fonte:["loot"]}),
  genEquip("torace",2,5,"Pettorale del Re Cinghiale",   {difesa:11,attacco:3,velocita:-2,destrezza:-1},"Forgiato con ferro scuro e zanne ricurve, respinge chiunque carichi", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 3
  genEquip("torace",3,1,"Giaco in Pelle di Daino",      {difesa:7,velocita:3,destrezza:3},            "Leggerissimo e aderente, pensato per chi fa affidamento sui riflessi"),
  genEquip("torace",3,2,"Cotta di Maglia Rivettata",    {difesa:11,velocita:-1,destrezza:-1},         "Ogni anello d'acciaio è chiuso con un rivetto per impedire alle punte di aprirlo"),
  genEquip("torace",3,3,"Corazza a Lamelle Legionaria", {difesa:14,velocita:-3,destrezza:-2},         "Fasce d'acciaio orizzontali sovrapposte, la difesa classica della fanteria pesante"),
  genEquip("torace",3,4,"Veste Cremisi del Duellante",  {difesa:10,velocita:4,destrezza:3,critico:3}, "Seta alchemica più resistente del cuoio che favorisce affondi letali", {rarita:"magico",fonte:["loot"]}),
  genEquip("torace",3,5,"Pettorale del Leone d'Oro",    {difesa:16,attacco:4,critico:2,velocita:-2},  "Scolpito con le fauci di un leone sul torace, appartenuto a un generale invitto", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 4
  genEquip("torace",4,1,"Cappotto d'Arme del Corsaro",  {difesa:10,velocita:3,destrezza:4,critico:2}, "Lungo soprabito in cuoio salmastro con piastre nascoste sul cuore"),
  genEquip("torace",4,2,"Brigantina Foderata",          {difesa:15,velocita:-1,destrezza:-1},         "Piastre d'acciaio rivettate all'interno di un corpetto di velluto robusto"),
  genEquip("torace",4,3,"Corazza da Arrembaggio Pesante",{difesa:19,velocita:-3,destrezza:-3},        "Spesso pettorale bombato a prova di dardo di balestra"),
  genEquip("torace",4,4,"Manto delle Profondità",       {difesa:14,velocita:4,destrezza:5,critico:3}, "Tessuto con fili d'alga abissale su cui le lame scivolano via", {rarita:"magico",fonte:["loot"]}),
  genEquip("torace",4,5,"Corazza del Leviatano",        {difesa:22,attacco:4,velocita:-2,destrezza:-1},"Ricavata dal carapace impenetrabile di un mostro oceanico", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 5
  genEquip("torace",5,1,"Tunica del Vento del Nord",    {difesa:14,velocita:5,destrezza:5,critico:2}, "Pelliccia leggera e seta glaciale che aumenta l'agilità nei climi estremi"),
  genEquip("torace",5,2,"Mezza Armatura da Mercenario", {difesa:20,attacco:2,velocita:-2,destrezza:-1},"Protegge petto, schiena e spalle lasciando liberi i fianchi"),
  genEquip("torace",5,3,"Armatura Bianca a Piastre",    {difesa:25,velocita:-4,destrezza:-3},         "Corazza cavalleresca liscia e lucidata per deviare ogni impatto frontale"),
  genEquip("torace",5,4,"Cotta di Cristallo Glaciale",  {difesa:21,velocita:3,critico:4,destrezza:2}, "Anelli di ghiaccio perenne fusi nell'acciaio, irradia un freddo pungente", {rarita:"magico",fonte:["loot"]}),
  genEquip("torace",5,5,"Corazza dell'Orso Bianco Reale",{difesa:27,attacco:6,velocita:-3,destrezza:-2},"Piastra toracica massiccia avvolta nel manto di una bestia leggendaria", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 6
  genEquip("torace",6,1,"Giubba d'Ombra dell'Assassino",{difesa:17,velocita:6,destrezza:6,critico:4}, "Cuoio nero trattato con oli silenzianti per muoversi come uno spettro"),
  genEquip("torace",6,2,"Armatura Gotica Scanalata",    {difesa:24,destrezza:1,velocita:-2},          "Capolavoro di armeria: le nervature scaricano la forza dei colpi senza appesantire"),
  genEquip("torace",6,3,"Corazza da Giostra Massiccia", {difesa:31,velocita:-5,destrezza:-4},         "Doppio spessore frontale progettato per reggere lo schianto delle lance"),
  genEquip("torace",6,4,"Pettorale di Scaglie di Drago",{difesa:26,attacco:5,velocita:2,critico:3},   "Scaglie rosse sovrapposte che pulsano di calore vitale", {rarita:"magico",fonte:["loot"]}),
  genEquip("torace",6,5,"Egida Toracica della Tempesta",{difesa:32,velocita:4,attacco:5,destrezza:2}, "Armatura leggendaria percorsa da saette che respingono gli assalitori", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 7
  genEquip("torace",7,1,"Veste Sacerdotale del Sole",   {difesa:21,velocita:6,destrezza:6,critico:4}, "Lino dorato intessuto con fili metallici incantati del deserto"),
  genEquip("torace",7,2,"Corazza a Scaglie d'Oro",      {difesa:29,attacco:3,critico:3,velocita:-2},  "Armatura della guardia reale delle dune, tanto splendida quanto letale"),
  genEquip("torace",7,3,"Armatura del Colosso di Sabbia",{difesa:36,velocita:-5,destrezza:-4},        "Piastre di granito e bronzo antico che trasformano l'eroe-in una fortezza", {fonte:["loot"]}),
  genEquip("torace",7,4,"Manto del Djinn del Fuoco",    {difesa:27,velocita:6,destrezza:5,critico:5}, "Avvolge il torso in un turbine di aria calda che devia i fendenti", {rarita:"magico",fonte:["loot"]}),
  genEquip("torace",7,5,"Corazza Reale di Ozymandias",  {difesa:38,attacco:7,critico:5,velocita:-2},  "Reliquia del Re dei Re, incisa con maledizioni contro chiunque osi colpirla", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 8
  genEquip("torace",8,1,"Cotta di Mithril Puro",        {difesa:27,velocita:7,destrezza:7,critico:3}, "Si indossa sotto una camicia comune ma ferma una lancia da guerra"),
  genEquip("torace",8,2,"Corazza Astrale in Topazio",   {difesa:34,attacco:5,critico:4,velocita:-1},  "Lega d'oro e gemme solari che rafforza il vigore di chi la porta"),
  genEquip("torace",8,3,"Armatura Muraglia del Titano", {difesa:43,velocita:-6,destrezza:-5},         "Piastre spesse un pollice forgiate per i campioni più possenti", {fonte:["loot"]}),
  genEquip("torace",8,4,"Veste delle Stelle Cadenti",   {difesa:33,velocita:7,destrezza:7,critico:6}, "Brilla come il firmamento notturno, rendendo i movimenti imprevedibili", {rarita:"magico",fonte:["loot"]}),
  genEquip("torace",8,5,"Corazza del Re della Montagna",{difesa:45,attacco:8,critico:4,velocita:-3},  "Forgiata nel cuore di un vulcano spento, non conosce ammaccature", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 9
  genEquip("torace",9,1,"Manto Spettrale dell'Ade",     {difesa:31,velocita:8,destrezza:8,critico:6}, "Tessuto d'ombra che lascia passare parte delle lame attraverso il vuoto"),
  genEquip("torace",9,2,"Corazza Cremisi d'Ossidiana",  {difesa:39,attacco:6,critico:6,velocita:-2},  "Piastre nere bordate di rubino sangue che alimentano la furia in battaglia"),
  genEquip("torace",9,3,"Armatura Infernale a Piastre", {difesa:49,velocita:-5,destrezza:-4},         "Forgiata nel ferro nero dell'Oltretomba e chiusa con catene ardenti", {fonte:["loot"]}),
  genEquip("torace",9,4,"Corazza del Signore dei Lich", {difesa:41,velocita:5,destrezza:5,critico:8}, "Proietta una barriera necrotica che indebolisce la forza degli impatti", {rarita:"magico",fonte:["loot"]}),
  genEquip("torace",9,5,"Armatura del Divoratore",      {difesa:52,attacco:10,critico:8,velocita:-3}, "Viva e pulsante, divora l'energia dei colpi subiti trasformandola in potenza", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 10
  genEquip("torace",10,1,"Veste Eterea dell'Empireo",   {difesa:36,velocita:10,destrezza:9,critico:7},"Tessuta con raggi di luce solidificata, conferisce la rapidità del pensiero"),
  genEquip("torace",10,2,"Corazza Reale di Platino",    {difesa:45,attacco:7,velocita:3,critico:5},   "L'armatura d'ordinanza delle schiere celesti, perfetta in ogni giuntura"),
  genEquip("torace",10,3,"Armatura Monolitica di Diamante",{difesa:57,velocita:-4,destrezza:-3},      "Scolpita nel diamante eterno, resiste persino all'ira degli dèi", {fonte:["loot"]}),
  genEquip("torace",10,4,"Manto del Firmamento Stellato",{difesa:47,velocita:8,destrezza:8,critico:9},"Contiene una galassia vivente nel tessuto che distorce lo spazio attorno al busto", {rarita:"magico",fonte:["loot"]}),
  genEquip("torace",10,5,"Corazza dell'Asceso Immortale",{difesa:60,attacco:12,velocita:5,critico:8}, "Il capolavoro supremo della creazione, rende il portatore pari a una divinità", {rarita:"leggendario",fonte:["loot"]}),

  // ══════════════════════════════════════════════════════════
  // 5. BRACCIA (50 Bracciali, Guanti, Manopole)
  // ══════════════════════════════════════════════════════════
  // Tier 1
  genEquip("braccia",1,1,"Fasce da Polso in Lino",      {velocita:1,destrezza:1},                     "Stringono i polsi garantendo presa salda sull'impugnatura"),
  genEquip("braccia",1,2,"Bracciali di Cuoio Grezzo",   {difesa:1,critico:1},                         "Proteggono gli avambracci dai rimbalzi delle lame"),
  genEquip("braccia",1,3,"Guanti da Lavoro Chiodati",   {difesa:2,attacco:1,destrezza:-1},            "Pelle spessa con borchie in ferro sulle nocche"),
  genEquip("braccia",1,4,"Polsini d'Ambra del Cacciatore",{velocita:2,destrezza:2,critico:2},         "Guidano il movimento del braccio con naturalezza felina", {rarita:"magico",fonte:["loot"]}),
  genEquip("braccia",1,5,"Catene Spezzate del Forzato", {attacco:3,critico:2,difesa:1,velocita:-1},   "Pesanti anelli di ferro rimasti ai polsi di un feroce ribelle", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 2
  genEquip("braccia",2,1,"Guanti in Pelle di Cervo",    {velocita:2,destrezza:2,critico:1},           "Morbidezza estrema che aumenta la sensibilità sull'elsa"),
  genEquip("braccia",2,2,"Parabraccia in Cuoio Bollito",{difesa:2,attacco:1,critico:1},               "Stecche rigide lungo l'ulna per parare fendenti improvvisi"),
  genEquip("braccia",2,3,"Manopole a Scaglie di Rame",  {difesa:4,attacco:2,velocita:-1,destrezza:-1},"Coprono dita e polsi con lamine metalliche sovrapposte"),
  genEquip("braccia",2,4,"Bracciali Incisi del Duellante",{velocita:3,destrezza:3,critico:2},         "Leggeri cerchi di rame runico che accelerano la rotazione del polso", {rarita:"magico",fonte:["loot"]}),
  genEquip("braccia",2,5,"Guanti d'Arme del Picconatore",{attacco:5,difesa:3,critico:2,destrezza:-2}, "Rinforzati con piastre da miniera per vibrare colpi demolitori", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 3
  genEquip("braccia",3,1,"Polsini da Schermidore",      {velocita:3,destrezza:3,critico:2},           "Disegnati per massimizzare la rapidità di affondo e recupero"),
  genEquip("braccia",3,2,"Vambracci d'Acciaio",         {difesa:4,attacco:2,critico:2},               "Tubi d'acciaio anatomici che avvolgono l'avambraccio dal polso al gomito"),
  genEquip("braccia",3,3,"Guanti di Maglia d'Acciaio",  {difesa:6,attacco:3,velocita:-1,destrezza:-2},"Permettono quasi di afferrare la lama avversaria a mani nude"),
  genEquip("braccia",3,4,"Guanti Cremisi dell'Assassino",{velocita:4,critico:5,destrezza:3},          "Cuciti con filo d'argento, guidano la lama dritta alle giunture", {rarita:"magico",fonte:["loot"]}),
  genEquip("braccia",3,5,"Cestus da Arena del Campione",{attacco:8,critico:5,difesa:3,destrezza:-2},  "Guanti da gladiatore armati di spuntoni che trasformano ogni gesto in un'arma", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 4
  genEquip("braccia",4,1,"Bracciali da Arciere Marino", {velocita:4,destrezza:4,critico:3},           "Cuoio di razza impermeabile che non scivola mai nemmeno col sangue"),
  genEquip("braccia",4,2,"Guanti con Cubitiere in Bronzo",{difesa:6,attacco:3,critico:3},             "Proteggono l'articolazione del gomito con coppe metalliche affilate"),
  genEquip("braccia",4,3,"Manopole a Clessidra",        {difesa:9,attacco:4,velocita:-2,destrezza:-2},"Forma svasata sul polso che devia le stoccate proteggendo i tendini"),
  genEquip("braccia",4,4,"Polsini della Corrente",      {velocita:6,destrezza:5,critico:4},           "Accompagnano il braccio come una corrente marina impetuosa", {rarita:"magico",fonte:["loot"]}),
  genEquip("braccia",4,5,"Manopole del Capitano Spettrale",{attacco:9,difesa:6,critico:6,velocita:-1},"Fredde come gli abissi, intorpidiscono il nemico a ogni contatto", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 5
  genEquip("braccia",5,1,"Guanti di Seta e Acciaio",    {velocita:6,destrezza:5,critico:5},           "Micro-maglia d'acciaio nascosta tra due strati di seta finissima"),
  genEquip("braccia",5,2,"Bracciali del Berserker",     {attacco:8,critico:6,velocita:3,difesa:-3},   "Lasciano scoperte le vene ma infondono una forza brutale nelle braccia"),
  genEquip("braccia",5,3,"Manopole Gotiche Articolate", {difesa:11,attacco:5,velocita:-2,destrezza:-1},"Decine di piastrine mobili sulle falangi garantiscono presa d'acciaio"),
  genEquip("braccia",5,4,"Bracciali del Fulmine",       {velocita:8,critico:6,attacco:4},             "Scintille elettriche percorrono le dita rendendo gli attacchi istantanei", {rarita:"magico",fonte:["loot"]}),
  genEquip("braccia",5,5,"Artigli del Drago Bianco",    {attacco:12,velocita:5,critico:8,difesa:3},   "Manopole forgiate con veri artigli di drago sulle nocche", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 6
  genEquip("braccia",6,1,"Polsini del Maestro di Spada",{velocita:7,destrezza:7,critico:6},           "Perfettamente calibrati per raddoppiare la precisione delle parate"),
  genEquip("braccia",6,2,"Vambracci Reali Incisi",      {difesa:9,attacco:6,critico:5},               "Acciaio temprato ad olio con guardie sporgenti per spezzare l'impeto nemico"),
  genEquip("braccia",6,3,"Manopole d'Assedio Pesanti",  {difesa:14,attacco:7,velocita:-3,destrezza:-2},"Blindatura totale per le braccia, progettata per chi impugna armi pesanti"),
  genEquip("braccia",6,4,"Guanti Velenosi della Vipera",{velocita:8,critico:9,destrezza:5},           "Sottili aghi sul dorso iniettano veleno al minimo graffio", {rarita:"magico",fonte:["loot"]}),
  genEquip("braccia",6,5,"Pugni di Ferro del Colosso",  {attacco:16,difesa:10,critico:6,velocita:-3}, "Manopole monolitiche che conferiscono la stretta inesorabile di un golem", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 7
  genEquip("braccia",7,1,"Fasce Sacre Imbalsamate",     {velocita:9,destrezza:8,critico:6},           "Lino antico intriso di resine solari che impedisce qualsiasi fatica muscolare"),
  genEquip("braccia",7,2,"Bracciali d'Oro dei Faraoni", {difesa:11,attacco:8,critico:7},              "Larghi bracciali regali incastonati di lapislazzuli e bronzo celeste"),
  genEquip("braccia",7,3,"Manopole del Guardiano del Tempio",{difesa:17,attacco:8,velocita:-3,destrezza:-2},"Pesanti guanti cerimoniali che non lasciano mai cadere l'arma", {fonte:["loot"]}),
  genEquip("braccia",7,4,"Polsini delle Sabbie Mobili", {velocita:10,destrezza:9,critico:8},          "Deviando la traiettoria dell'aria, fanno scivolare a vuoto le lame nemiche", {rarita:"magico",fonte:["loot"]}),
  genEquip("braccia",7,5,"Bracciali della Dea Guerriera",{attacco:18,velocita:7,critico:10,difesa:5}, "Benedetti dal fuoco del deserto, rendono ogni fendente una sentenza", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 8
  genEquip("braccia",8,1,"Guanti in Maglia di Mithril", {velocita:11,destrezza:10,critico:8,difesa:6},"Flessibili come seta ma impenetrabili, il sogno di ogni spadaccino"),
  genEquip("braccia",8,2,"Vambracci Solari in Topazio", {difesa:14,attacco:10,critico:9},             "Emettono un bagliore accecante ogni volta che si incrociano le armi"),
  genEquip("braccia",8,3,"Manopole del Titano di Roccia",{difesa:21,attacco:11,velocita:-4,destrezza:-3},"Pietra vulcanica e oro fusi insieme per una difesa incrollabile", {fonte:["loot"]}),
  genEquip("braccia",8,4,"Polsini Astrali",             {velocita:13,destrezza:10,critico:10},        "Allineano il movimento delle braccia con la rotazione delle stelle", {rarita:"magico",fonte:["loot"]}),
  genEquip("braccia",8,5,"Stretta del Re dei Giganti",  {attacco:23,difesa:12,critico:10,velocita:-2},"Conferiscono alle braccia la potenza necessaria a spaccare le montagne", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 9
  genEquip("braccia",9,1,"Guanti di Seta d'Ombra",      {velocita:14,destrezza:12,critico:11},        "Le mani sembrano muoversi in più punti contemporaneamente"),
  genEquip("braccia",9,2,"Bracciali d'Ossidiana Sangue",{attacco:14,critico:12,difesa:10,velocita:-1},"Assorbono il calore del sangue versato trasformandolo in vigore"),
  genEquip("braccia",9,3,"Manopole delle Catene Infernali",{difesa:24,attacco:13,velocita:-3,destrezza:-2},"Avvolte da anelli roventi che bloccano le armi degli avversari", {fonte:["loot"]}),
  genEquip("braccia",9,4,"Polsini del Vuoto",           {velocita:16,destrezza:12,critico:12},        "Annullano l'attrito dell'aria, portando la velocità d'attacco al limite", {rarita:"magico",fonte:["loot"]}),
  genEquip("braccia",9,5,"Artigli dell'Arcidemone",     {attacco:26,velocita:10,critico:14,difesa:6}, "Manopole demoniache che lacerano realtà e armature a ogni fendente", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 10
  genEquip("braccia",10,1,"Polsini di Luce Eterea",     {velocita:18,destrezza:15,critico:13},        "Pura energia celeste che guida i polsi con precisione infallibile"),
  genEquip("braccia",10,2,"Vambracci di Platino Divino",{difesa:19,attacco:15,critico:12,velocita:4}, "Forgiati per i campioni dell'Empireo, coniugano grazia e potenza"),
  genEquip("braccia",10,3,"Manopole di Diamante Eterno",{difesa:28,attacco:16,velocita:-2,destrezza:-1},"Cristallo immortale che non può essere scalfito da alcuna lama", {fonte:["loot"]}),
  genEquip("braccia",10,4,"Guanti del Tessitore del Tempo",{velocita:20,destrezza:15,critico:15},     "Rallentano il tempo attorno alle mani del portatore nel momento del colpo", {rarita:"magico",fonte:["loot"]}),
  genEquip("braccia",10,5,"Manopole dell'Asceso",       {attacco:28,velocita:14,critico:16,difesa:12},"Ogni colpo vibrato con questi guanti porta il peso del giudizio divino", {rarita:"leggendario",fonte:["loot"]}),

  // ══════════════════════════════════════════════════════════
  // 6. GAMBE (50 Gambali, Schinieri, Stivali)
  // ══════════════════════════════════════════════════════════
  // Tier 1
  genEquip("gambe",1,1,"Calzari di Cuoio Morbido",      {velocita:2,destrezza:1},                     "Suola flessibile per muoversi in silenzio sui sentieri del bosco"),
  genEquip("gambe",1,2,"Brache di Tela Rinforzata",     {difesa:1,velocita:1},                        "Doppio strato sulle ginocchia per resistere a rovi e cadute"),
  genEquip("gambe",1,3,"Schinieri di Cuoio Bollito",    {difesa:3,velocita:-1},                       "Proteggono gli stinchi dai fendenti bassi senza costare una fortuna"),
  genEquip("gambe",1,4,"Stivali del Passo Silvano",     {difesa:2,velocita:3,destrezza:2},            "Non lasciano impronte sul muschio e aumentano lo slancio nel salto", {rarita:"magico",fonte:["loot"]}),
  genEquip("gambe",1,5,"Gambali del Lupo Grigio",       {difesa:4,velocita:3,destrezza:2,critico:1},  "Foderati con pelliccia d'alfa, donano lo scatto implacabile del predatore", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 2
  genEquip("gambe",2,1,"Stivali da Marcia Leggeri",     {difesa:2,velocita:3,destrezza:2},            "Chiodati sotto la suola per non scivolare mai sul fango"),
  genEquip("gambe",2,2,"Cosciali Imbottiti",            {difesa:4,destrezza:1},                       "Proteggono le arterie femorali con spessi strati di lana pressata"),
  genEquip("gambe",2,3,"Schinieri di Ferro Battuto",    {difesa:6,velocita:-2,destrezza:-1},          "Mezzi tubi di ferro legati con cinghie dietro il polpaccio"),
  genEquip("gambe",2,4,"Calzari del Vento Sotterraneo", {difesa:4,velocita:4,destrezza:3},            "Permettono di schivare lateralmente con un semplice spostamento di peso", {rarita:"magico",fonte:["loot"]}),
  genEquip("gambe",2,5,"Gambali Corazzati del Nano",    {difesa:9,attacco:2,velocita:-2,destrezza:-1},"Piastre basse e massicce che radicano il guerriero al suolo come una roccia", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 3
  genEquip("gambe",3,1,"Stivali da Schermidore",        {difesa:4,velocita:4,destrezza:4},            "Tacco bilanciato per affondi rapidi e immediati balzi all'indietro"),
  genEquip("gambe",3,2,"Gambali di Maglia d'Acciaio",   {difesa:7,velocita:-1},                       "Calze di anelli metallici che coprono interamente la gamba"),
  genEquip("gambe",3,3,"Schinieri Legionari a Lamelle", {difesa:10,velocita:-2,destrezza:-2},         "Protezione pesante per stinco e ginocchio usata nelle prime linee"),
  genEquip("gambe",3,4,"Stivali dell'Arena",            {difesa:7,velocita:5,destrezza:3,critico:2},  "Cuoio rosso benedetto che favorisce giochi di gambe imprevedibili", {rarita:"magico",fonte:["loot"]}),
  genEquip("gambe",3,5,"Schinieri Dorati del Centurione",{difesa:12,attacco:3,velocita:1,destrezza:-1},"Cesellati con aquile imperiali, guidano la carica senza mai vacillare", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 4
  genEquip("gambe",4,1,"Stivali Alti da Corsaro",       {difesa:6,velocita:5,destrezza:5},            "Progettati per mantenere l'equilibrio sul ponte scivoloso delle navi in tempesta"),
  genEquip("gambe",4,2,"Cosciali e Ginocchiere d'Acciaio",{difesa:10,destrezza:1,velocita:-1},        "Coppe alate sulle ginocchia che deviano i fendenti diretti alle giunture"),
  genEquip("gambe",4,3,"Gambali Pesanti da Cavalleria", {difesa:14,velocita:-3,destrezza:-2},         "Corazzatura rigida completa dalla cintura fino allo sperone"),
  genEquip("gambe",4,4,"Calzari della schiuma Marina",  {difesa:10,velocita:6,destrezza:6},           "Chi li indossa sembra pattinare sull'acqua e sulla sabbia", {rarita:"magico",fonte:["loot"]}),
  genEquip("gambe",4,5,"Schinieri d'Osso di Leviatano", {difesa:16,attacco:3,velocita:2,destrezza:-1},"Scolpiti nelle costole di un colosso marino, infrangibili", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 5
  genEquip("gambe",5,1,"Calzari Silenziosi del Nord",   {difesa:9,velocita:7,destrezza:6,critico:2},  "Pelle di renna bianca che permette scatti fulminei anche sul ghiaccio"),
  genEquip("gambe",5,2,"Gambali Scanalati da Torneo",   {difesa:14,velocita:1,destrezza:1},           "Acciaio temperato leggero con articolazioni fluide alla caviglia"),
  genEquip("gambe",5,3,"Sabaton e Schinieri a Piastre", {difesa:19,velocita:-3,destrezza:-3},         "Scarpe d'arme in ferro laminato unite a schinieri chiusi a cerniera"),
  genEquip("gambe",5,4,"Stivali della Tormenta",        {difesa:14,velocita:8,destrezza:6,critico:2}, "Avvolti da correnti d'aria gelida che spingono i talloni in avanti", {rarita:"magico",fonte:["loot"]}),
  genEquip("gambe",5,5,"Gambali Alati della Valchiria", {difesa:19,velocita:7,destrezza:5,attacco:3}, "Fatti di argento celeste, permettono balzi che sfidano la gravità", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 6
  genEquip("gambe",6,1,"Stivali d'Ombra Furtivi",       {difesa:12,velocita:8,destrezza:8,critico:3}, "Assorbono ogni rumore del passo, ideali per aggirare il nemico alle spalle"),
  genEquip("gambe",6,2,"Gambali di Scaglie Draconiche", {difesa:18,velocita:2,destrezza:2},           "Flessibili e resistenti al fuoco, accompagnano ogni piegamento"),
  genEquip("gambe",6,3,"Schinieri da Giostra Blindati", {difesa:24,velocita:-4,destrezza:-3},         "Doppio strato d'acciaio temprato, impossibili da perforare"),
  genEquip("gambe",6,4,"Calzari del Fulmine Globulare", {difesa:17,velocita:10,destrezza:8,critico:3},"Trasformano lo scatto dell'eroe in un lampo accecante", {rarita:"magico",fonte:["loot"]}),
  genEquip("gambe",6,5,"Gambali del Signore dei Draghi",{difesa:25,attacco:5,velocita:5,destrezza:3}, "Forgiati nel fuoco antico, fanno tremare il suolo a ogni passo", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 7
  genEquip("gambe",7,1,"Sandali Alati del Deserto",     {difesa:15,velocita:10,destrezza:9,critico:3},"Non affondano mai nella sabbia finissima, garantendo velocità sovrumana"),
  genEquip("gambe",7,2,"Schinieri Reali in Bronzo Solare",{difesa:22,velocita:3,attacco:3},           "Riflettono il sole accecando chi guarda in basso per colpire le gambe"),
  genEquip("gambe",7,3,"Gambali del Colosso di Pietra", {difesa:29,velocita:-4,destrezza:-3},         "Pilastri di granito incantato che rendono impossibile atterrare l'eroe", {fonte:["loot"]}),
  genEquip("gambe",7,4,"Stivali del Vento del Simoom",  {difesa:21,velocita:11,destrezza:10,critico:4},"Sollevano mulinelli di sabbia rovente a ogni cambio di direzione", {rarita:"magico",fonte:["loot"]}),
  genEquip("gambe",7,5,"Gambali d'Oro del Re Scorpione",{difesa:30,attacco:6,velocita:6,critico:5},   "Speroni avvelenati e piastre regali appartenute al dominatore delle dune", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 8
  genEquip("gambe",8,1,"Stivali in Mithril Intrecciato",{difesa:20,velocita:12,destrezza:11,critico:4},"Offrono la protezione della piastra pesante con il peso di una scarpa di tela"),
  genEquip("gambe",8,2,"Gambali Solari in Topazio",     {difesa:26,velocita:5,destrezza:4,attacco:4}, "Accumulano energia cinetica a ogni passo liberandola negli affondi"),
  genEquip("gambe",8,3,"Schinieri Monolitici dei Titani",{difesa:35,velocita:-5,destrezza:-4},        "Forgiati per sostenere il peso del mondo senza piegarsi mai", {fonte:["loot"]}),
  genEquip("gambe",8,4,"Calzari delle Comete",          {difesa:25,velocita:14,destrezza:12,critico:5},"Lasciano una scia luminosa, triplicando la rapidità di schivata", {rarita:"magico",fonte:["loot"]}),
  genEquip("gambe",8,5,"Gambali del Padre dei Giganti", {difesa:37,attacco:8,velocita:5,destrezza:3}, "Ogni passo risuona come una valanga sulle vette eterne", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 9
  genEquip("gambe",9,1,"Calzari del Passo Spettrale",   {difesa:24,velocita:15,destrezza:14,critico:5},"Permettono di attraversare le ombre riapparendo al fianco del nemico"),
  genEquip("gambe",9,2,"Gambali d'Ossidiana e Rubino",  {difesa:31,attacco:6,velocita:5,critico:6},   "Cristallo nero affilato sulle ginocchiere che squarcia chi tenta il placcaggio"),
  genEquip("gambe",9,3,"Schinieri Infernali del Terrore",{difesa:41,velocita:-4,destrezza:-3},        "Acciaio dell'abisso che brucia l'erba sotto la suola", {fonte:["loot"]}),
  genEquip("gambe",9,4,"Stivali del Signore dei Morti", {difesa:33,velocita:14,destrezza:13,critico:6},"Sfidano le leggi fisiche permettendo scatti silenziosi e letali", {rarita:"magico",fonte:["loot"]}),
  genEquip("gambe",9,5,"Gambali dell'Araldo dell'Abisso",{difesa:43,attacco:9,velocita:8,critico:7},  "Forgiati nelle fiamme nere, conferiscono inarrestabile slancio demoniaco", {rarita:"leggendario",fonte:["loot"]}),
  // Tier 10
  genEquip("gambe",10,1,"Calzari Alati di Ermes",       {difesa:29,velocita:18,destrezza:17,critico:6},"Ali di pura luce alle caviglie che rendono l'eroe imprendibile"),
  genEquip("gambe",10,2,"Gambali Reali di Platino",     {difesa:37,velocita:8,destrezza:8,attacco:6}, "L'armatura perfetta per gli arti inferiori, forgiata nell'Empireo"),
  genEquip("gambe",10,3,"Schinieri di Diamante Immortale",{difesa:48,velocita:-3,destrezza:-2},       "Pura luce cristallizzata, nessun colpo può spezzarli", {fonte:["loot"]}),
  genEquip("gambe",10,4,"Stivali del Viaggiatore Astrale",{difesa:39,velocita:18,destrezza:16,critico:8},"Piegano lo spazio ad ogni passo, rendendo la schivata quasi assoluta", {rarita:"magico",fonte:["loot"]}),
  genEquip("gambe",10,5,"Gambali dell'Asceso Eterno",   {difesa:50,velocita:14,destrezza:12,attacco:8},"Il passo definitivo di chi cammina sopra i troni degli dèi sconfitti", {rarita:"leggendario",fonte:["loot"]}),
];

/* ── Raggruppa equipaggiamento per slot ── */
export const EQUIP_BY_SLOT = {};
for (const e of EQUIPMENT_POOL) {
 if (!EQUIP_BY_SLOT[e.slot]) EQUIP_BY_SLOT[e.slot] = [];
 EQUIP_BY_SLOT[e.slot].push(e);
}

/* ══════════════════════════════════════════════════════════
 RELIQUIE — bonus su statistiche per 5 missioni (vanno in zaino)
══════════════════════════════════════════════════════════ */
export const RELICS = [
 {id:"r01",name:"Artiglio del Lupo", icon:"🔮",stat:"forza", bonus:0.30,desc:"+30% FORZA per 5 missioni",img:"img/treasures/r01.png"},
 {id:"r02",name:"Costola dell'Orso Sacro", icon:"🔮",stat:"difesa", bonus:0.35,desc:"+35% DIFESA per 5 missioni",img:"img/treasures/r02.png"},
 {id:"r03",name:"Cuore di Pietra", icon:"🔮",stat:"costituzione",bonus:0.30,desc:"+30% PV MAX per 5 missioni",img:"img/treasures/r03.png"},
 {id:"r04",name:"Lama del Mercenario", icon:"🔮",stat:"forza", bonus:0.25,desc:"+25% FORZA per 5 missioni",img:"img/treasures/r04.png"},
 {id:"r05",name:"Piuma dell'Arpìa", icon:"🔮",stat:"velocita", bonus:0.20,desc:"+20% VELOCITÀ per 5 missioni",img:"img/treasures/r05.png"},
 {id:"r06",name:"Scaglia del Drago", icon:"🔮",stat:"costituzione",bonus:0.20,desc:"+20% PV MAX per 5 missioni",img:"img/treasures/r06.png"},
 {id:"r07",name:"Dente del Vampiro", icon:"🔮",stat:"forza", bonus:0.15,desc:"+15% FORZA per 5 missioni",img:"img/treasures/r07.png"},
 {id:"r08",name:"Piuma della Fenice", icon:"🔮",stat:"velocita", bonus:0.25,desc:"+25% VELOCITÀ per 5 missioni",img:"img/treasures/r08.png"},
 {id:"r09",name:"Osso del Titano", icon:"🔮",stat:"costituzione",bonus:0.25,desc:"+25% PV MAX per 5 missioni",img:"img/treasures/r09.png"},
 {id:"r10",name:"Frammento dell'Asceso",icon:"🔮",stat:"forza", bonus:0.20,desc:"+20% FORZA per 5 missioni",img:"img/treasures/r10.png"},
 {id:"r11",name:"Cristallo della Mente",icon:"🔮",stat:"furtivita", bonus:0.30,desc:"+30% FURTIVITÀ per 5 missioni",img:"img/treasures/r11.png"},
 {id:"r12",name:"Rosa Spinosa", icon:"🔮",stat:"critico", bonus:0.30,desc:"+30% CRITICO per 5 missioni",img:"img/treasures/r12.png"},
 {id:"r13",name:"Occhio del Falco", icon:"🔮",stat:"destrezza", bonus:0.30,desc:"+30% DESTREZZA per 5 missioni",img:"img/treasures/r13.png"},
 {id:"r14",name:"Medaglione della Sorte",icon:"🔮",stat:"fortuna", bonus:0.20,desc:"+20% FORTUNA per 5 missioni",img:"img/treasures/r14.png"},
 {id:"r15",name:"Amuleto della Velocità",icon:"🔮",stat:"velocita", bonus:0.35,desc:"+35% VELOCITÀ per 5 missioni",img:"img/treasures/r15.png"},
 {id:"r16",name:"Ciondolo di Ossidiana",icon:"🔮",stat:"fortuna", bonus:0.10,desc:"+10% FORTUNA per 5 missioni",img:"img/treasures/r16.png"},
 {id:"r17",name:"Riflesso della Pantera", icon:"🔮",stat:"destrezza", bonus:0.20,desc:"+20% DESTREZZA per 5 missioni",img:"img/treasures/r17.png"},
 {id:"r18",name:"Teschio del Basilisco", icon:"🔮",stat:"difesa", bonus:0.25,desc:"+25% DIFESA per 5 missioni",img:"img/treasures/r18.png"},
 {id:"r19",name:"Vertebra del Leone", icon:"🔮",stat:"critico", bonus:0.20,desc:"+20% CRITICO per 5 missioni",img:"img/treasures/r19.png"},
 {id:"r20",name:"Anima del Non-Morto", icon:"🔮",stat:"difesa", bonus:0.15,desc:"+15% DIFESA per 5 missioni",img:"img/treasures/r20.png"},
];

/* ══════════════════════════════════════════════════════════
 TREASURES — 100 oggetti con valore in denari, 5 tier
══════════════════════════════════════════════════════════ */
export const TREASURES = [
 // Tier 1 (3-8 den)
 {id:"t001",name:"Borsellino Sgualcito", icon:"",tier:1,minV:3,maxV:6,img:"img/treasures/t001.png"},
 {id:"t002",name:"Monete Sparse", icon:"",tier:1,minV:4,maxV:7,img:"img/treasures/t002.png"},
 {id:"t003",name:"Coltello da Caccia", icon:"",tier:1,minV:5,maxV:8,img:"img/treasures/t003.png"},
 {id:"t004",name:"Scarpe di Cuoio", icon:"",tier:1,minV:3,maxV:6,img:"img/treasures/t004.png"},
 {id:"t005",name:"Fiasca di Vino", icon:"",tier:1,minV:4,maxV:7,img:"img/treasures/t005.png"},
 {id:"t006",name:"Dadi da Gioco", icon:"",tier:1,minV:5,maxV:8,img:"img/treasures/t006.png"},
 {id:"t007",name:"Pietra Levigata", icon:"",tier:1,minV:6,maxV:8,img:"img/treasures/t007.png"},
 {id:"t008",name:"Moneta nel Pane", icon:"",tier:1,minV:3,maxV:5,img:"img/treasures/t008.png"},
 {id:"t009",name:"Ferro di Cavallo", icon:"",tier:1,minV:4,maxV:6,img:"img/treasures/t009.png"},
 {id:"t010",name:"Mappa Incomprensibile", icon:"",tier:1,minV:6,maxV:8,img:"img/treasures/t010.png"},
 {id:"t011",name:"Ciuffo di Erbe", icon:"",tier:1,minV:3,maxV:5,img:"img/treasures/t011.png"},
 {id:"t012",name:"Vecchia Moneta", icon:"",tier:1,minV:4,maxV:6,img:"img/treasures/t012.png"},
 {id:"t013",name:"Anello di Stagno", icon:"",tier:1,minV:5,maxV:7,img:"img/treasures/t013.png"},
 {id:"t014",name:"Osso Scolpito", icon:"",tier:1,minV:3,maxV:6,img:"img/treasures/t014.png"},
 {id:"t015",name:"Sacchetto di Sale", icon:"",tier:1,minV:4,maxV:7,img:"img/treasures/t015.png"},
 {id:"t016",name:"Candela Profumata", icon:"",tier:1,minV:5,maxV:8,img:"img/treasures/t016.png"},
 {id:"t017",name:"Frammento di Ceramica", icon:"",tier:1,minV:3,maxV:5,img:"img/treasures/t017.png"},
 {id:"t018",name:"Piuma Rara", icon:"",tier:1,minV:4,maxV:6,img:"img/treasures/t018.png"},
 {id:"t019",name:"Tappo di Bottiglia", icon:"",tier:1,minV:3,maxV:5,img:"img/treasures/t019.png"},
 {id:"t020",name:"Dente Animale", icon:"",tier:1,minV:4,maxV:7,img:"img/treasures/t020.png"},
 // Tier 2 (9-18 den)
 {id:"t021",name:"Cassa Sfondata", icon:"",tier:2,minV:9,maxV:12,img:"img/treasures/t021.png"},
 {id:"t022",name:"Spada Arrugginita", icon:"",tier:2,minV:11,maxV:14,img:"img/treasures/t022.png"},
 {id:"t023",name:"Calice d'Argento", icon:"",tier:2,minV:13,maxV:16,img:"img/treasures/t023.png"},
 {id:"t024",name:"Sella di Cavallo", icon:"",tier:2,minV:10,maxV:13,img:"img/treasures/t024.png"},
 {id:"t025",name:"Bottino di Predone", icon:"",tier:2,minV:11,maxV:15,img:"img/treasures/t025.png"},
 {id:"t026",name:"Tomo Strappato", icon:"",tier:2,minV:13,maxV:17,img:"img/treasures/t026.png"},
 {id:"t027",name:"Elmo Ammaccato", icon:"",tier:2,minV:11,maxV:14,img:"img/treasures/t027.png"},
 {id:"t028",name:"Gemma Opaca", icon:"",tier:2,minV:12,maxV:16,img:"img/treasures/t028.png"},
 {id:"t029",name:"Bussola Rotta", icon:"",tier:2,minV:8,maxV:12,img:"img/treasures/t029.png"},
 {id:"t030",name:"Fiala di Veleno", icon:"",tier:2,minV:14,maxV:18,img:"img/treasures/t030.png"},
 {id:"t031",name:"Maschera di Legno", icon:"",tier:2,minV:10,maxV:14,img:"img/treasures/t031.png"},
 {id:"t032",name:"Pergamena Strappata", icon:"",tier:2,minV:9,maxV:13,img:"img/treasures/t032.png"},
 {id:"t033",name:"Chiave Arrugginita", icon:"",tier:2,minV:11,maxV:15,img:"img/treasures/t033.png"},
 {id:"t034",name:"Borsa di Sabbia", icon:"",tier:2,minV:10,maxV:14,img:"img/treasures/t034.png"},
 {id:"t035",name:"Specchio Incrinato", icon:"",tier:2,minV:12,maxV:16,img:"img/treasures/t035.png"},
 {id:"t036",name:"Forcella di Osso", icon:"",tier:2,minV:9,maxV:13,img:"img/treasures/t036.png"},
 {id:"t037",name:"Anello con Corniola", icon:"",tier:2,minV:13,maxV:17,img:"img/treasures/t037.png"},
 {id:"t038",name:"Mappa Parziale", icon:"",tier:2,minV:10,maxV:15,img:"img/treasures/t038.png"},
 {id:"t039",name:"Corno di Caccia", icon:"",tier:2,minV:11,maxV:15,img:"img/treasures/t039.png"},
 {id:"t040",name:"Statuetta di Pietra", icon:"",tier:2,minV:12,maxV:16,img:"img/treasures/t040.png"},
 // Tier 3 (19-35 den)
 {id:"t041",name:"Statua Parlante", icon:"",tier:3,minV:20,maxV:28,img:"img/treasures/t041.png"},
 {id:"t042",name:"Scudo con Stemma", icon:"",tier:3,minV:18,maxV:26,img:"img/treasures/t042.png"},
 {id:"t043",name:"Pergamena Sigillata", icon:"",tier:3,minV:22,maxV:30,img:"img/treasures/t043.png"},
 {id:"t044",name:"Anello con Rubino", icon:"",tier:3,minV:24,maxV:32,img:"img/treasures/t044.png"},
 {id:"t045",name:"Cristallo Pulsante", icon:"",tier:3,minV:25,maxV:33,img:"img/treasures/t045.png"},
 {id:"t046",name:"Dente di Drago", icon:"",tier:3,minV:23,maxV:31,img:"img/treasures/t046.png"},
 {id:"t047",name:"Mantello di Seta Nera", icon:"",tier:3,minV:21,maxV:29,img:"img/treasures/t047.png"},
 {id:"t048",name:"Libro dei Morti", icon:"",tier:3,minV:19,maxV:27,img:"img/treasures/t048.png"},
 {id:"t049",name:"Orologio senza Lancette", icon:"",tier:3,minV:22,maxV:30,img:"img/treasures/t049.png"},
 {id:"t050",name:"Forziere Miniatura", icon:"",tier:3,minV:24,maxV:33,img:"img/treasures/t050.png"},
 {id:"t051",name:"Collana di Ambra", icon:"",tier:3,minV:20,maxV:28,img:"img/treasures/t051.png"},
 {id:"t052",name:"Calice di Ossidiana", icon:"",tier:3,minV:23,maxV:31,img:"img/treasures/t052.png"},
 {id:"t053",name:"Maschera d'Oro", icon:"",tier:3,minV:25,maxV:35,img:"img/treasures/t053.png"},
 {id:"t054",name:"Gemma Sanguigna", icon:"",tier:3,minV:22,maxV:30,img:"img/treasures/t054.png"},
 {id:"t055",name:"Tomo Arcano", icon:"",tier:3,minV:21,maxV:29,img:"img/treasures/t055.png"},
 {id:"t056",name:"Astrolabio Rotto", icon:"",tier:3,minV:19,maxV:27,img:"img/treasures/t056.png"},
 {id:"t057",name:"Sigillo d'Argento", icon:"",tier:3,minV:24,maxV:32,img:"img/treasures/t057.png"},
 {id:"t058",name:"Frammento di Reliquia", icon:"",tier:3,minV:23,maxV:31,img:"img/treasures/t058.png"},
 {id:"t059",name:"Fiala di Luce", icon:"",tier:3,minV:25,maxV:34,img:"img/treasures/t059.png"},
 {id:"t060",name:"Pietra Runata", icon:"",tier:3,minV:20,maxV:28,img:"img/treasures/t060.png"},
 // Tier 4 (36-60 den)
 {id:"t061",name:"Corona Spezzata", icon:"",tier:4,minV:38,maxV:52,img:"img/treasures/t061.png"},
 {id:"t062",name:"Armatura dell'Abisso", icon:"",tier:4,minV:40,maxV:54,img:"img/treasures/t062.png"},
 {id:"t063",name:"Mappa Città Proibita", icon:"",tier:4,minV:42,maxV:56,img:"img/treasures/t063.png"},
 {id:"t064",name:"Sfera Incrinata", icon:"",tier:4,minV:36,maxV:50,img:"img/treasures/t064.png"},
 {id:"t065",name:"Libro delle Leggi Arcane", icon:"",tier:4,minV:38,maxV:52,img:"img/treasures/t065.png"},
 {id:"t066",name:"Calice del Re Caduto", icon:"",tier:4,minV:44,maxV:58,img:"img/treasures/t066.png"},
 {id:"t067",name:"Spada della Mezzanotte", icon:"",tier:4,minV:42,maxV:56,img:"img/treasures/t067.png"},
 {id:"t068",name:"Reliquia del Tempio", icon:"",tier:4,minV:36,maxV:50,img:"img/treasures/t068.png"},
 {id:"t069",name:"Diario del Grande Mago", icon:"",tier:4,minV:40,maxV:54,img:"img/treasures/t069.png"},
 {id:"t070",name:"Cuore di Drago", icon:"",tier:4,minV:44,maxV:60,img:"img/treasures/t070.png"},
 {id:"t071",name:"Amuleto dei Re", icon:"",tier:4,minV:38,maxV:52,img:"img/treasures/t071.png"},
 {id:"t072",name:"Pietra Filosofale Falsa", icon:"",tier:4,minV:40,maxV:54,img:"img/treasures/t072.png"},
 {id:"t073",name:"Trofeo del Campione", icon:"",tier:4,minV:42,maxV:56,img:"img/treasures/t073.png"},
 {id:"t074",name:"Mappa del Tesoro Reale", icon:"",tier:4,minV:44,maxV:58,img:"img/treasures/t074.png"},
 {id:"t075",name:"Occhio di Cristallo", icon:"",tier:4,minV:38,maxV:52,img:"img/treasures/t075.png"},
 {id:"t076",name:"Diadema d'Oro", icon:"",tier:4,minV:40,maxV:54,img:"img/treasures/t076.png"},
 {id:"t077",name:"Tomo del Negromanzia", icon:"",tier:4,minV:36,maxV:50,img:"img/treasures/t077.png"},
 {id:"t078",name:"Collana del Drago Antico", icon:"",tier:4,minV:42,maxV:56,img:"img/treasures/t078.png"},
 {id:"t079",name:"Sigillo Imperiale", icon:"",tier:4,minV:44,maxV:58,img:"img/treasures/t079.png"},
 {id:"t080",name:"Frammento di Meteora", icon:"",tier:4,minV:40,maxV:55,img:"img/treasures/t080.png"},
 // Tier 5 (61-100 den)
 {id:"t081",name:"Frammento della Luna", icon:"",tier:5,minV:62,maxV:78,img:"img/treasures/t081.png"},
 {id:"t082",name:"Occhio del Leviatano", icon:"",tier:5,minV:70,maxV:86,img:"img/treasures/t082.png"},
 {id:"t083",name:"Prima Pagina del Tempo", icon:"",tier:5,minV:78,maxV:94,img:"img/treasures/t083.png"},
 {id:"t084",name:"Sangue di Titano", icon:"",tier:5,minV:68,maxV:84,img:"img/treasures/t084.png"},
 {id:"t085",name:"Chiave senza Serratura", icon:"",tier:5,minV:76,maxV:92,img:"img/treasures/t085.png"},
 {id:"t086",name:"Mantello dell'Asceso", icon:"",tier:5,minV:76,maxV:92,img:"img/treasures/t086.png"},
 {id:"t087",name:"Stella Caduta", icon:"",tier:5,minV:64,maxV:80,img:"img/treasures/t087.png"},
 {id:"t088",name:"Sigillo dell'Oblio", icon:"",tier:5,minV:72,maxV:88,img:"img/treasures/t088.png"},
 {id:"t089",name:"Corona dei Mille Anni", icon:"",tier:5,minV:80,maxV:96,img:"img/treasures/t089.png"},
 {id:"t090",name:"La Pietra dell'Origine", icon:"",tier:5,minV:84,maxV:100,img:"img/treasures/t090.png"},
 {id:"t091",name:"Lacrime di Drago", icon:"",tier:5,minV:66,maxV:82,img:"img/treasures/t091.png"},
 {id:"t092",name:"Sinfonia delle Stelle", icon:"",tier:5,minV:70,maxV:86,img:"img/treasures/t092.png"},
 {id:"t093",name:"Frammento del Sole", icon:"",tier:5,minV:74,maxV:90,img:"img/treasures/t093.png"},
 {id:"t094",name:"Vuoto Primordiale", icon:"",tier:5,minV:78,maxV:94,img:"img/treasures/t094.png"},
 {id:"t095",name:"Libro dell'Eternità", icon:"",tier:5,minV:82,maxV:98,img:"img/treasures/t095.png"},
 {id:"t096",name:"Scheggia del Velo", icon:"",tier:5,minV:68,maxV:84,img:"img/treasures/t096.png"},
 {id:"t097",name:"Cuore di Stelle", icon:"",tier:5,minV:72,maxV:88,img:"img/treasures/t097.png"},
 {id:"t098",name:"Essenza Primordiale", icon:"",tier:5,minV:76,maxV:92,img:"img/treasures/t098.png"},
 {id:"t099",name:"Respiro del Cosmo", icon:"",tier:5,minV:80,maxV:96,img:"img/treasures/t099.png"},
 {id:"t100",name:"Il Tutto e il Nulla", icon:"",tier:5,minV:86,maxV:100,img:"img/treasures/t100.png"},
];

/* ══════════════════════════════════════════════════════════
 POZIONI
══════════════════════════════════════════════════════════ */
export const POTIONS = [
 {id:"pot01",name:"Pozione PV Piccola",icon:"🩸",prezzo:25, desc:"Ripristina 30 PV istantaneamente", effect:{tipo:"heal",val:30}},
 {id:"pot02",name:"Pozione PV Media", icon:"🩸",prezzo:60, desc:"Ripristina 70 PV istantaneamente", effect:{tipo:"heal",val:70}},
 {id:"pot03",name:"Pozione PV Grande", icon:"🩸",prezzo:100, desc:"Ripristina 100 PV istantaneamente", effect:{tipo:"heal",val:100}},
 {id:"pot04",name:"Pozione Revitalizzante", icon:"🩸",prezzo:380, desc:"Ripristina 400 PV istantaneamente", effect:{tipo:"heal",val:400}},
 {id:"pot05",name:"Pozione Rigenerante", icon:"🩸",prezzo:70, desc:"Raddoppia la rigenerazione dei PV per 24 ore", effect:{tipo:"regen_boost",durata:86400000}},
 {id:"pot06",name:"Pozione PA Piccola",icon:"💧",prezzo:85, desc:"Ripristina 3 PA istantaneamente", effect:{tipo:"restore_pa",val:3}},
 {id:"pot07",name:"Pozione PA Media",icon:"💧",prezzo:220, desc:"Ripristina 10 PA istantaneamente", effect:{tipo:"restore_pa",val:10}},
 {id:"pot08",name:"Pozione PA Grande",icon:"💧",prezzo:400, desc:"Ripristina 20 PA istantaneamente", effect:{tipo:"restore_pa",val:20}},
  {id:"pot09",name:"Pozione Rinvigorente",icon:"💧",prezzo:1200, desc:"Ripristina 60 PA istantaneamente", effect:{tipo:"restore_pa",val:60}},
];

/* ══════════════════════════════════════════════════════════
 BESTIARIO — 150 nemici (livello 1-150)
 Ogni nemico ha img: "img/enemies/<id>.png"
 Es: e001 → img/enemies/e001.png
══════════════════════════════════════════════════════════ */
function npc(id, lvl, name, icon, human, forza, velocita, destrezza, critico, costituzione, trait, tags) {
  const L = Math.max(1, lvl);
  const orig_base_forza = 8 + (L - 1) * 0.64;
  const orig_base_cost = 30 + (L - 1) * 2.6;
  const orig_base_vel = 6 + (L - 1) * 0.48;

  const new_base_forza = L * 3 + 5;
  const new_base_cost = L * 12 + 50;
  const new_base_vel = L * 3 + 5;

  const final_forza = Math.round(new_base_forza * (forza / orig_base_forza));
  const final_cost = Math.round(new_base_cost * (costituzione / orig_base_cost));
  const final_vel = Math.round(new_base_vel * (velocita / orig_base_vel));

  return {
    id, lvl, name, icon,
    human: !!human,
    forza: final_forza,
    velocita: final_vel,
    destrezza,
    critico,
    costituzione: final_cost,
    trait, tags: tags || [],
    img: `img/enemies/${id}.png`,
  };
}

export const BESTIARY = [
  npc("e001",1,"Lupo Grigio","",0,8,6,3,0,30,"Predatore da branco, attacca di notte",["bestia","lupo"]),
 npc("e002",2,"Goblin Frugatore","",1,9,6,3,0,32,"Coltello arrugginito, armatura di stracci",["umano","goblin"]),
 npc("e003",3,"Ragno Cacciatore","",0,9,6,4,0,34,"Veleno lieve, si cala dall'alto",["bestia","ragno"]),
 npc("e004",4,"Cinghiale Selvatico","",0,10,7,4,0,38,"Carica dritta senza deviare",["bestia"]),
 npc("e005",5,"Bandito Disperato","",1,11,8,5,0,36,"Spada corta e scudo di legno",["umano","bandito"]),
 npc("e006",6,"Spirito del Muschio","",0,8,6,3,2,33,"Anima intrappolata tra le radici",["spirito","bestia"]),
 npc("e007",7,"Amazzone Giovane","",1,10,7,4,1,35,"Fionda e borsa di pietre appuntite",["umano"]),
 npc("e008",8,"Troll Piccolo","",0,12,9,5,0,44,"Si rigenera lentamente se non bruciato",["bestia","troll"]),
 npc("e009",9,"Druido Corrotto","",1,9,6,4,4,38,"Bastone nodoso, magie della natura",["umano"]),
 npc("e010",10,"Orso Bruno","",0,14,10,6,0,50,"Artigli pesanti, morso devastante",["bestia"]),
 npc("e011",11,"Ladro della Foresta","",1,13,9,6,0,42,"Doppio pugnale, colpisce da dietro",["umano","bandito"]),
 npc("e012",12,"Spirito Urlante","",0,9,6,5,4,40,"Il grido causa confusione",["spirito","bestia"]),
 npc("e013",13,"Goblin Capo","",1,14,10,7,0,46,"Ascia di ferro, corazza di cuoio",["umano","goblin"]),
 npc("e014",14,"Lupo Alfa","",0,15,11,7,0,52,"Guida il branco, ferite profonde",["bestia","lupo"]),
 npc("e015",15,"Cacciatore Rinnegato","",1,15,11,8,0,48,"Arco lungo, trappole nel bosco",["umano","bandito"]),
 npc("e016",16,"Spirito del Sangue","",0,11,8,6,6,44,"Drena vita al contatto",["spirito","bestia"]),
 npc("e017",17,"Orso Notturno","",0,17,12,8,0,58,"Attacca solo al calar delle tenebre",["bestia"]),
 npc("e018",18,"Guerriero Goblin","",1,17,12,9,0,52,"Elmo di ferro, lancia corta",["umano","goblin"]),
 npc("e019",19,"Mannaro","",0,18,13,9,0,60,"Si trasforma alla luna piena",["bestia","lupo"]),
 npc("e020",20,"Strega del Bosco","",1,12,9,8,8,50,"Pozioni velenose, maledizioni",["umano"]),
 npc("e021",21,"Troll del Bosco","",0,20,15,10,0,66,"Forza bruta, pelle coriacea",["bestia","troll"]),
 npc("e022",22,"Guardia Rinnegata","",1,19,14,11,0,58,"Spada lunga e scudo metallico",["umano","bandito"]),
 npc("e023",23,"Fantasma del Bosco","",0,12,9,8,8,50,"Incorporeo, immune alle armi normali",["nonmorto","spirito","bestia"]),
 npc("e024",24,"Centauro Selvaggio","",0,22,16,11,0,70,"Capace di cavalcare per enormi distanze",["bestia"]),
 npc("e025",25,"Mannaro Alfa","",0,23,17,12,0,76,"Capo del branco dei mutati",["bestia","lupo"]),
 npc("e026",26,"Capitano Bandito","",1,22,16,13,0,68,"Spada a due mani, armatura pesante",["umano","bandito"]),
 npc("e027",27,"Sciamano Goblin","",1,14,10,10,10,60,"Evoca spiriti, lancia maledizioni",["umano","goblin"]),
 npc("e028",28,"Spirito della Foresta","",0,15,11,11,11,62,"Antico protettore diventato ostile",["spirito","bestia"]),
 npc("e029",29,"Caccia Selvaggia","",0,24,18,13,7,72,"Spettri a cavallo che cacciano i vivi",["spirito","bestia"]),
 npc("e030",30,"Regina delle Streghe","",1,20,15,14,13,82,"Governa la foresta dal trono di spine",["umano"]),
 npc("e031",31,"Ratto delle Miniere","",0,22,16,12,0,80,"Rosicchia anche il metallo",["bestia"]),
 npc("e032",32,"Talpa Spinata","",0,24,18,13,0,82,"Scava lunghissimi cunicoli",["bestia"]),
 npc("e033",33,"Minatore Non-Morto","",0,21,15,12,4,78,"Rianimato da un crollo fatale",["nonmorto"]),
 npc("e034",34,"Pipistrello Gigante","",0,22,16,13,0,76,"Zanne avvelenate, volo rapido",["bestia"]),
 npc("e035",35,"Amazzone Tiratrice","",1,25,18,13,0,80,"Balestra e frecce avvelenate",["umano"]),
 npc("e036",36,"Scorpione di Caverna","",0,26,19,14,1,88,"Veleno potente, pungiglione veloce",["bestia"]),
 npc("e037",37,"Elementale di Pietra","",0,25,18,16,0,100,"Corpo di roccia, colpi devastanti",["elementale"]),
 npc("e038",38,"Nano Rinnegato","",1,27,20,15,0,90,"Ascia da guerra, corazza di acciaio",["umano","bandito"]),
 npc("e039",39,"Larva di Drago","",0,20,15,13,8,82,"Trascina i vivi nella roccia",["bestia","drago"]),
 npc("e040",40,"Verme Perforatore","",0,28,21,15,0,96,"Scava gallerie col corpo",["bestia"]),
 npc("e041",41,"Nano Sciamano","",1,22,16,14,9,86,"Invoca spiriti dei tunnel",["umano"]),
 npc("e042",42,"Golem di Carbone","",0,30,22,18,0,110,"Lento ma devastante",["golem"]),
 npc("e043",43,"Lanciere Nanico","",1,29,21,16,0,94,"A guardia di segreti millenari",["umano"]),
 npc("e044",44,"Troll delle Caverne","",0,32,24,17,0,105,"Cieco ma sente i passi",["bestia","troll"]),
 npc("e045",45,"Salamandra di Lava","",0,30,22,16,3,98,"Corpo avvolto di lava",["bestia"]),
 npc("e046",46,"Guardia Amazzone","",1,31,23,18,0,100,"Lancia e scudo di mithril grezzo",["umano"]),
 npc("e047",47,"Ragno Minerario","",0,28,21,16,4,96,"Reti di filo metallico",["bestia","ragno"]),
 npc("e048",48,"Elementale di Ferro","",0,34,25,19,0,115,"Ferro fuso che assume forma",["elementale"]),
 npc("e049",49,"Sergente Goblin","",1,33,24,19,0,104,"Addestramento militare e furia selvaggia",["umano","goblin"]),
 npc("e050",50,"Demone del Pozzo","",0,24,18,16,12,100,"Drena la forza vitale",["nonmorto","demone"]),
 npc("e051",51,"Basilisco","",0,32,24,20,4,118,"Lo sguardo pietrifica",["bestia"]),
 npc("e052",52,"Golem di Granito","",0,36,27,22,0,125,"Quasi immune alle armi normali",["golem"]),
 npc("e053",53,"Orco d'Assalto","",1,35,26,21,0,110,"Ascia runata, armatura d'acciaio",["umano", "goblin"]),
 npc("e054",54,"Elementale di Cristallo","",0,30,22,20,8,118,"Riflette gli incantesimi",["elementale"]),
 npc("e055",55,"Fantasma del Prigioniero","",0,26,19,18,15,106,"Intrappolato per l'eternità",["nonmorto","spirito"]),
 npc("e056",56,"Giovane Drago di Pietra","",0,40,30,22,4,140,"Custodisce una vena d'oro",["bestia","drago"]),
 npc("e057",57,"Colosso di Guardia","",0,38,28,24,0,132,"Difende l'ingresso della camera del re",["golem"]),
 npc("e058",58,"Amazzone del Labirinto","",1,28,21,20,16,112,"Magie runiche, bastone di ferro",["umano"]),
 npc("e059",59,"Re Nanico delle Miniere","",1,42,31,25,3,148,"Sovrano della civiltà sotterranea",["umano"]),
 npc("e060",60,"Drago delle Profondità","",0,46,34,26,7,160,"Un incubo che riemerge dall'oscurità",["bestia","drago"]),
 npc("e061",61,"Granchio Gigante","",0,42,31,22,0,148,"Chele capaci di spezzare le ossa",["bestia"]),
 npc("e062",62,"Pirata Annegato","",0,40,30,21,6,142,"Ancora la spada in pugno",["nonmorto","bandito"]),
 npc("e063",63,"Sirena Predatrice","",0,38,28,20,9,138,"Il canto attira e paralizza",["bestia"]),
 npc("e064",64,"Guerriero Vichingo","",1,44,33,23,0,150,"Ascia bipenne, elmo cornuto",["umano"]),
 npc("e065",65,"Polpo di Scogliera","",0,42,31,22,1,155,"Otto tentacoli, blocca il nemico",["bestia"]),
 npc("e066",66,"Corsaro Maledetto","",1,45,33,23,0,148,"Sciabola e pistola ad avancarica",["umano","bandito"]),
 npc("e067",67,"Spirito del Naufrago","",0,36,27,20,11,140,"Anima del marinaio perduto",["nonmorto","spirito"]),
 npc("e068",68,"Tritone Guerriero","",1,46,34,24,3,155,"Tridente e scudo di corallo",["umano"]),
 npc("e069",69,"Squalo Gigante","",0,48,36,24,0,165,"Morso devastante, nessuna pietà",["bestia"]),
 npc("e070",70,"Capitano Spettrale","",0,40,30,22,12,152,"Comanda la flotta fantasma",["nonmorto","spirito"]),
 npc("e071",71,"Granchio Colossale","",0,50,37,26,0,172,"Corazza naturale spessore acciaio",["bestia"]),
 npc("e072",72,"Vichingo Non-Morto","",0,48,36,24,6,160,"Resiste alle armi normali",["nonmorto","umano"]),
 npc("e073",73,"Elementale d'Acqua","",0,40,30,23,12,158,"Corpo liquido, difficile da colpire",["elementale"]),
 npc("e074",74,"Amazzone Pirata","",1,50,37,25,1,165,"Pistola rara e sciabola runata",["umano","bandito"]),
 npc("e075",75,"Idra Marina","",0,52,39,26,3,180,"Tre teste, ognuna attacca",["bestia","drago"]),
 npc("e076",76,"Calamaro Abissale","",0,52,39,26,2,175,"Tentacoli veloci, inchiostro accecante",["bestia"]),
 npc("e077",77,"Signore degli Squali","",1,54,40,27,4,170,"Capace di evocare centinaia di predatori",["umano"]),
 npc("e078",78,"Drago di Mare","",0,56,42,28,8,190,"Sputa fiamme subacquee",["bestia","drago"]),
 npc("e079",79,"Ammiraglio Spettrale","",0,48,36,26,16,175,"Comanda i morti in battaglia navale",["nonmorto","spirito"]),
 npc("e080",80,"Re dei Tritoni","",1,56,42,28,8,182,"Tridente d'oro, corazza di perle",["umano"]),
 npc("e081",81,"Squalo Demoniaco","",0,58,43,28,3,192,"Corrotto da magie degli abissi",["bestia","demone"]),
 npc("e082",82,"Colosso di Corallo","",0,56,42,30,0,200,"Statua animata dal dio del mare",["golem"]),
 npc("e083",83,"Fantasma del Kraken","",0,48,36,27,18,180,"L'ombra del mostro antico",["nonmorto","spirito","bestia"]),
 npc("e084",84,"Serpente di Mare","",0,60,45,30,4,205,"Lungo cinquanta metri, stringe le navi",["bestia"]),
 npc("e085",85,"Leviatano Giovane","",0,62,46,31,5,212,"Serpente marino ancora giovane",["bestia"]),
 npc("e086",86,"Capitano dei Corsari","",1,60,45,30,4,195,"Spadone raro, armatura di ferro",["umano","bandito"]),
 npc("e087",87,"Guardiano del Faro","",0,62,46,32,0,210,"Animato dalla magia del naufragio",["golem"]),
 npc("e088",88,"Drago Marino Antico","",0,66,49,33,9,225,"Custode degli abissi più profondi",["bestia","drago"]),
 npc("e089",89,"Ciclope Fantasma","",0,58,43,32,20,215,"Lo spettro di una bestia temuta in tutte le isole",["nonmorto","spirito","bestia","ciclope","gigante"]),
 npc("e090",90,"Kraken Primordiale","",0,65,48,33,12,222,"Sovrano di tutte le isole maledette",["bestia"]),
 npc("e091",91,"Lupo della Neve","",0,60,45,30,0,210,"Manto bianco, invisibile nella neve",["bestia","lupo"]),
 npc("e092",92,"Esploratore Congelato","",1,62,46,31,0,215,"Armatura semidissolta, ascia arrugginita",["umano"]),
 npc("e093",93,"Aquila Gigante","",0,62,46,31,0,212,"Artigli come spade corte",["bestia"]),
 npc("e094",94,"Goblin di Montagna","",1,63,47,31,1,218,"Lancia appuntita e scudo di roccia",["umano","goblin"]),
 npc("e095",95,"Yeti","",0,66,49,33,0,228,"Bestia del ghiaccio eterno",["bestia","gigante"]),
 npc("e096",96,"Elementale del Vento","",0,60,45,31,8,218,"Spirito del vento tra le vette",["elementale"]),
 npc("e097",97,"Sentinella di Pietra","",0,65,48,34,0,230,"Golem guardiano del passo di montagna",["golem"]),
 npc("e098",98,"Valchiria","",1,68,51,34,0,240,"Piomba dal cielo con tutta la sua furia",["umano"]),
 npc("e099",99,"Grifone","",0,66,49,33,4,232,"Leone-aquila, re dei cieli montani",["bestia"]),
 npc("e100",100,"Strega del Gelo","",1,58,43,32,19,225,"Congela il sangue con la voce",["umano"]),
 npc("e101",101,"Orso delle Nevi","",0,70,52,35,0,245,"Più grande di qualsiasi orso normale",["bestia"]),
 npc("e102",102,"Alce Gigante","",0,70,52,35,0,248,"Incornata letale quando carica",["bestia"]),
 npc("e103",103,"Elementale di Ghiaccio","",0,64,48,34,12,240,"Freddo assoluto, rallenta i movimenti",["elementale"]),
 npc("e104",104,"Ciclope Corazzato"," ",0,74,55,36,0,258,"Un occhio solo, forza immane",["bestia","ciclope","gigante"]),
 npc("e105",105,"Capitano Gigante","",1,72,54,36,0,252,"Armatura completa, ascia a due mani",["umano","gigante"]),
 npc("e106",106,"Fantasma della Vetta","",0,58,43,34,21,240,"Spirito di un alpinista morto sul picco",["nonmorto","spirito"]),
 npc("e107",107,"Grifone Albino","",0,76,57,37,0,268,"Uccello abbastanza grande da sollevare un bue",["bestia"]),
 npc("e108",108,"Gigante del Gelo","",0,78,58,38,3,272,"Dalla mitologia norrena, freddo come la morte",["bestia","gigante"]),
 npc("e109",109,"Stregone Gigante","",1,64,48,35,24,255,"Magie del ghiaccio, bastone di osso",["umano","gigante"]),
 npc("e110",110,"Viverna","",0,80,60,38,6,278,"Parente del drago, veleno letale",["bestia","drago"]),
 npc("e111",111,"Re dei Giganti","",1,82,61,40,0,285,"Armatura di montagna, clava leggendaria",["umano","gigante"]),
 npc("e112",112,"Gigante di Fuoco","",0,84,63,40,5,288,"Vive nel vulcano sul picco",["bestia","gigante"]),
 npc("e113",113,"Amazzone di Montagna","",1,78,58,42,0,282,"Agile tra i sentieri impervi",["umano"]),
 npc("e114",114,"Guardiano del Picco","",0,68,51,38,26,272,"Spirito antico legato alla cima",["nonmorto","spirito"]),
 npc("e115",115,"Drago delle Nevi","",0,86,64,42,8,295,"Bianco come la neve, invisibile in quota",["bestia","drago"]),
 npc("e116",116,"Signora del Ghiaccio","",1,70,52,40,28,280,"Maga del gelo, corazza di cristallo",["umano"]),
 npc("e117",117,"Titano di Granito","",0,90,67,44,0,305,"Gigante pietrificato risvegliato",["bestia","titan","gigante"]),
 npc("e118",118,"Signore dei Grifoni","",0,88,66,43,8,298,"Re del cielo montano",["bestia"]),
 npc("e119",119,"Drago Antico della Vetta","",0,92,69,44,11,312,"Custode immortale del passo",["bestia","drago"]),
 npc("e120",120,"Padre dei Giganti","",0,96,72,46,5,322,"Il più antico dei giganti della montagna",["bestia","gigante"]),
 npc("e121",121,"Scorpione del Deserto","",0,86,64,42,4,305,"Veleno che brucia dall'interno",["bestia"]),
 npc("e122",122,"Guerriero Mummia","",0,88,66,43,8,310,"Armatura di lino sacro, spada di bronzo",["nonmorto","mummia"]),
 npc("e123",123,"Serpente delle Sabbie","",0,84,63,42,4,302,"Si muove sotto la sabbia invisibile",["bestia"]),
 npc("e124",124,"Guardia del Faraone","",0,90,67,44,0,315,"Lancia dorata, scudo con geroglifici",["nonmorto","mummia"]),
 npc("e125",125,"Elementale di Sabbia","",0,84,63,43,9,312,"Tempesta di sabbia che pensa",["elementale"]),
 npc("e126",126,"Sacerdote Mummia","",0,80,60,42,14,308,"Magie sacre del dio del sole",["nonmorto","mummia"]),
 npc("e127",127,"Scarabeo Gigante","",0,92,69,45,0,325,"Corazza naturale, mandibole letali",["bestia"]),
 npc("e128",128,"Cacciatore del Deserto","",1,90,67,44,1,318,"Arco del deserto, frecce avvelenate",["umano"]),
 npc("e129",129,"Uomo-Cobra","",0,88,66,44,12,322,"Metà umano metà serpente, lancia di fuoco",["bestia"]),
 npc("e130",130,"Fantasma del Faraone","",0,78,58,43,20,315,"Il dominio è la sabbia e la morte",["nonmorto","spirito","mummia"]),
 npc("e131",131,"Manticora","",0,94,70,46,6,335,"Coda di scorpione, ali di pipistrello",["bestia"]),
 npc("e132",132,"Guardiano della Cripta","",0,92,69,46,3,330,"Armatura pesante, ascia sacra",["nonmorto"]),
 npc("e133",133,"Golem di Sabbia","",0,90,67,47,0,338,"Difficile da colpire, si riforma",["golem"]),
 npc("e134",134,"Genio del Deserto","",0,82,61,45,18,328,"Genio del deserto, magie di fuoco",["bestia","spirito"]),
 npc("e135",135,"Statua Colossale","",0,96,72,48,0,345,"Enorme statua di pietra animata",["golem"]),
 npc("e136",136,"Idra del Deserto","",0,98,73,48,4,355,"Cinque teste, ognuna autonoma",["bestia","drago"]),
 npc("e137",137,"Capitano della Cripta","",0,96,72,48,6,345,"Armatura d'oro, spada sacra",["nonmorto"]),
 npc("e138",138,"Sfinge"," ",0,92,69,48,19,350,"Custodisce piramidi, uccide chi sbaglia",["bestia","sfinge"]),
 npc("e139",139,"Drago del Deserto","",0,100,75,50,12,368,"Drago color sabbia, quasi invisibile",["bestia","drago"]),
 npc("e140",140,"Alto Sacerdote Mummia","",0,88,66,48,24,355,"Massima autorità del culto del faraone",["nonmorto","mummia"]),
 npc("e141",141,"Re Scorpione","",0,104,78,52,0,380,"Scorpione gigante con il corpo da uomo, un tempo sovrano del deserto",["bestia"]),
 npc("e142",142,"Signore degli Scarabei","",0,98,73,50,9,368,"Uno sciame con una mente",["bestia"]),
 npc("e143",143,"Genio del Fuoco","",0,96,72,51,23,375,"Re dei geni del fuoco",["bestia","spirito"]),
 npc("e144",144,"Verme del Deserto","",0,108,81,53,0,390,"Creatura primordiale del sottosuolo",["bestia"]),
 npc("e145",145,"Predone delle Sabbie","",1,104,78,52,8,385,"Protegge la tomba con la vita",["umano","bandito"]),
 npc("e146",146,"Araldo delle Amazzoni","",1,102,76,52,20,392,"Incarnazione di una dea della guerra",["umano"]),
 npc("e147",147,"Alta Sacerdotessa delle Dune","",1,100,75,53,25,400,"Custodisce il segreto del deserto",["umano"]),
 npc("e148",148,"Drago della Tempesta","",0,108,81,54,15,408,"Drago che cavalca le tempeste di sabbia",["bestia","drago"]),
 npc("e149",149,"Custode della Piramide","",0,106,79,54,8,402,"Il costrutto definitivo del faraone",["golem"]),
 npc("e150",150,"Faraone Non-Morto","",0,104,78,55,26,420,"Il re del deserto che non muore mai",["nonmorto","mummia"]),
 npc("e151",151,"Anima Perduta","",0,96,72,50,20,400,"Spirito senza meta tra i mondi",["nonmorto","spirito"]),
 npc("e152",152,"Guardia dei Morti","",0,98,73,51,12,408,"Armatura spettrale, lancia d'ombra",["nonmorto"]),
 npc("e153",153,"Ombra Divoratrice","",0,96,72,51,24,405,"Drena la vita al solo contatto",["nonmorto","spirito"]),
 npc("e154",154,"Demone Minore","",0,100,75,52,20,415,"Servo del signore dell'Oltretomba",["demone"]),
 npc("e155",155,"Cavaliere Spettrale","",0,104,78,53,11,422,"Armatura nera, spada d'ombra",["nonmorto","spirito"]),
 npc("e156",156,"Stregone dei Morti","",1,88,66,51,29,412,"Un tempo vivo, ora servo della morte",["umano","nonmorto"]),
 npc("e157",157,"Cavaliere della Morte","",0,108,81,54,12,432,"Campione di Morte, indistruttibile",["nonmorto"]),
 npc("e158",158,"Demone delle Catene","",0,106,79,53,17,425,"Incatena i vivi, li trascina nell'abisso",["demone"]),
 npc("e159",159,"Cane Infernale","",0,108,81,54,5,428,"Fuoco nelle vene, morso letale",["bestia"]),
 npc("e160",160,"Drago Non-Morto","",0,112,84,56,16,445,"Drago rianimato dalla necromanzìa",["nonmorto","drago"]),
 npc("e161",161,"Comandante dei Demoni","",0,110,82,56,22,440,"Guida legioni di ombre",["demone"]),
 npc("e162",162,"Spettro del Re","",0,100,75,54,28,432,"Monarca che rifiuta la morte",["nonmorto","spirito"]),
 npc("e163",163,"Cavaliere Senza Testa"," headless",0,112,84,57,12,450,"Porta la propria testa in mano",["nonmorto","cavaliere"]),
 npc("e164",164,"Titano dell'Oltretomba","",0,116,87,58,16,460,"Guardiano antico del regno dei morti",["bestia","titan","gigante"]),
 npc("e165",165,"Strega delle Ossa","",1,94,70,56,32,445,"Tesse maledizioni con ossa dei caduti",["umano"]),
 npc("e166",166,"Arcidemone","",0,114,85,57,25,455,"Nato nel punto più profondo dell'abisso",["demone"]),
 npc("e167",167,"Lich","",0,96,72,56,36,448,"Mago che ha sacrificato tutto per vivere",["nonmorto","lich"]),
 npc("e168",168,"Colosso Infernale","",0,120,90,60,16,470,"Macchina di morte forgiata nell'abisso",["golem"]),
 npc("e169",169,"Generale dei Morti","",0,112,84,58,24,462,"Comanda l'esercito dei caduti",["nonmorto"]),
 npc("e170",170,"Principe Demone","",0,118,88,60,27,480,"Nobile dell'inferno con eserciti d'ombre",["demone"]),
 npc("e171",171,"Drago Spettrale","",0,122,91,61,22,488,"Drago di nebbia e oscurità pura",["nonmorto","drago"]),
 npc("e172",172,"Re dei Morti","",0,114,85,61,30,480,"Signore assoluto dei caduti",["nonmorto"]),
 npc("e173",173,"Maestro Lich","",0,100,75,60,38,475,"Padrone assoluto della necromanzìa",["nonmorto","lich"]),
 npc("e174",174,"Signore dei Diavoli","",0,122,91,62,30,492,"Generale supremo delle forze infernali",["demone"]),
 npc("e175",175,"Drago Antico dei Morti","",0,126,94,63,24,500,"Il drago più antico, già morto e risorto",["nonmorto","drago"]),
 npc("e176",176,"Incarnazione della Morte","",0,118,88,62,34,494,"La morte fatta forma",["nonmorto"]),
 npc("e177",177,"Araldo dell'Abisso","",0,122,91,63,35,505,"Messaggero del signore supremo",["demone"]),
 npc("e178",178,"Colosso delle Anime","",0,126,94,64,22,510,"Costruito con le anime dei dannati",["golem"]),
 npc("e179",179,"Signore dell'Oltretomba","",0,124,93,65,39,520,"Governatore assoluto del reame dei morti",["nonmorto"]),
 npc("e180",180,"Il Divoratore","",0,130,97,67,42,540,"La fine di tutte le cose viventi",["demone"])
];

/* ══════════════════════════════════════════════════════════
 WORLD_AREAS — 7 zone del Mondo Esterno
 Sbloccate sequenzialmente completando 20 missioni per area
 (Empireo: 21 missioni speciali)
══════════════════════════════════════════════════════════ */
export const WORLD_AREAS = [
  {
    id: "foresta",
    name: "Foresta Crepuscolare",
    color: "#4ade80",
    icon: "",
    costoOro: 20,
    costoPA: 5,
    lvlMin: 1, lvlMax: 30,
    missioniRichieste: 20,
    sblocca: "miniere",
    desc: "Boschi oscuri abitati da spiriti e banditi",
  },
  {
    id: "miniere",
    name: "Miniere Sepolte",
    color: "#e07a5f",
    icon: "",
    costoOro: 40,
    costoPA: 7,
    lvlMin: 31, lvlMax: 60,
    missioniRichieste: 20,
    sblocca: "isole",
    desc: "Gallerie profonde, piene di creature sotterranee",
  },
  {
    id: "isole",
    name: "Isole dei Naufraghi",
    color: "#38bdf8",
    icon: "",
    costoOro: 70,
    costoPA: 9,
    lvlMin: 61, lvlMax: 90,
    missioniRichieste: 20,
    sblocca: "montagne",
    desc: "Arcipelago maledetto tra pirati spettrali e tritoni",
  },
  {
    id: "montagne",
    name: "Montagne Silenti",
    color: "#a5f3fc",
    icon: "",
    costoOro: 110,
    costoPA: 11,
    lvlMin: 91, lvlMax: 120,
    missioniRichieste: 20,
    sblocca: "deserto",
    desc: "Vette eterne dove regnano giganti e draghi",
  },
  {
    id: "deserto",
    name: "Deserto delle Ossa",
    color: "#e9c46a",
    icon: "",
    costoOro: 150,
    costoPA: 13,
    lvlMin: 121, lvlMax: 150,
    missioniRichieste: 20,
    sblocca: "oltretomba",
    desc: "Sabbie infinite di faraoni non-morti e geni malvagi",
  },
  {
    id: "oltretomba",
    name: "Oltretomba",
    color: "#c084fc",
    icon: "",
    costoOro: 200,
    costoPA: 15,
    lvlMin: 151, lvlMax: 180,
    missioniRichieste: 20,
    sblocca: "empireo",
    desc: "Il regno più buio, dove demoni e non-morti dominano",
  },
  {
    id: "empireo",
    name: "Empireo",
    color: "#ffd166",
    icon: "",
    costoOro: 300,
    costoPA: 20,
    lvlMin: 181, lvlMax: 190,
    missioniRichieste: 21,
    sblocca: null,
    desc: "La dimora degli déi",
  },
];

/* ── Nemici per area (estratti dal BESTIARY per livello) ── */
export function getEnemiesForArea(areaId) {
  const area = WORLD_AREAS.find(a => a.id === areaId);
  if (!area) return BESTIARY;
  // Empireo: divinità speciali (e181-e190) — fuori dal BESTIARY normale
  if (areaId === "empireo") return EMPIREO_GODS;
  return BESTIARY.filter(e => e.lvl >= area.lvlMin && e.lvl <= area.lvlMax);
}

function god(id, lvl, name, hp, atk, mag, def, trait) {
  const L = Math.max(1, lvl);
  const orig_base_forza = 8 + (L - 1) * 0.64;
  const orig_base_cost = 30 + (L - 1) * 2.6;
  const orig_base_vel = 6 + (L - 1) * 0.48;

  const new_base_forza = L * 3 + 5;
  const new_base_cost = L * 12 + 50;
  const new_base_vel = L * 3 + 5;

  const raw_forza = atk;
  const raw_vel = Math.floor(atk * 0.75);
  const raw_cost = hp;

  const final_forza = Math.round(new_base_forza * (raw_forza / orig_base_forza));
  const final_cost = Math.round(new_base_cost * (raw_cost / orig_base_cost));
  const final_vel = Math.round(new_base_vel * (raw_vel / orig_base_vel));

  return {
    id, lvl, name, icon: "",
    human: false,
    forza: final_forza,
    velocita: final_vel,
    destrezza: def,
    critico: Math.floor(mag * 0.4),
    costituzione: final_cost,
    trait, tags: ["divinita"],
    img: `img/enemies/${id}.png`,
    isGod: true,
  };
}
export const EMPIREO_GODS = [
  god("e181", 181, "Valeska",  580, 120, 140, 72, "Dea dell'amore — il suo tocco è veleno e desiderio"),
  god("e182", 182, "Thalmos",  560, 105, 160, 70, "Dio della conoscenza — conosce ogni tua debolezza"),
  god("e183", 183, "Sylvaris", 570, 135, 120, 74, "Dea della caccia — non sbaglia mai un colpo"),
  god("e184", 184, "Ignaroth", 595, 145, 130, 76, "Dio del fuoco — il suo corpo brucia chi si avvicina"),
  god("e185", 185, "Abyssor",  610, 140, 125, 78, "Dio del mare — porta con sé la pressione degli abissi"),
  god("e186", 186, "Lunarys",  575, 115, 155, 73, "Dea della luna — i suoi incantesimi crescono di notte"),
  god("e187", 187, "Solarius", 590, 130, 145, 75, "Dio del sole — la sua luce acceca e brucia"),
  god("e188", 188, "Varos",    620, 160, 100, 80, "Dio della guerra — ogni colpo è letale"),
  god("e189", 189, "Morvath",  600, 125, 165, 78, "Dea della morte — chi cade non risorge"),
  god("e190", 190, "Kaelos",   650, 150, 170, 85, "Dio del tempo — può annullare le tue azioni"),
];

/* ── Bottini divini dell'Empireo ── */
export const EMPIREO_LOOT = [
  { id:"gl01", godId:"e181", name:"Lacrime di Valeska",              value:12000, desc:"Lacrime d'amore cristallizzato" ,img:"img/treasures/gl01.png"},
  { id:"gl02", godId:"e182", name:"Frammento della Mente di Thalmos",value:13000, desc:"Un pensiero del dio — conoscenza di un'era" ,img:"img/treasures/gl02.png"},
  { id:"gl03", godId:"e183", name:"Freccia di Sylvaris",             value:12500, desc:"Non manca mai il bersaglio" ,img:"img/treasures/gl03.png"},
  { id:"gl04", godId:"e184", name:"Cenere di Ignaroth",              value:13500, desc:"Fuoco divino in polvere" ,img:"img/treasures/gl04.png"},
  { id:"gl05", godId:"e185", name:"Goccia dell'Abisso",              value:14000, desc:"Acqua degli oceani più profondi" ,img:"img/treasures/gl05.png"},
  { id:"gl06", godId:"e186", name:"Scheggia di Luna",                value:12000, desc:"Frammento della luna stessa" ,img:"img/treasures/gl06.png"},
  { id:"gl07", godId:"e187", name:"Raggio Solidificato",             value:13000, desc:"Luce del sole condensata in cristallo" ,img:"img/treasures/gl07.png"},
  { id:"gl08", godId:"e188", name:"Lama Spezzata di Varos",          value:15000, desc:"Metà della spada del dio della guerra" ,img:"img/treasures/gl08.png"},
  { id:"gl09", godId:"e189", name:"Velo di Morvath",                 value:14500, desc:"Tessuto dell'aldilà" ,img:"img/treasures/gl09.png"},
  { id:"gl10", godId:"e190", name:"Clessidra di Kaelos",             value:20000, desc:"Ferma il tempo per un istante" ,img:"img/treasures/gl10.png"},
];


/* ══════════════════════════════════════════════════════════
 AREA_LOOT_POOL — Bottini specifici per area
══════════════════════════════════════════════════════════ */
export const AREA_LOOT_POOL = {
  foresta: [
    {id:"al001",name:"Fungo Luminescente",rarity:1,value:5,desc:"Fungo che brilla nel buio, usato dagli alchimisti",icon:"🦴",img:"img/treasures/al001.png"},
    {id:"al002",name:"Bacca Selvatica",rarity:1,value:3,desc:"Bacche aspre, leggermente nutritive",icon:"🦴",img:"img/treasures/al002.png"},
    {id:"al003",name:"Pelliccia di Lupo",rarity:1,value:12,desc:"Pelliccia spessa, ottima per i mantelli",icon:"🦴",img:"img/treasures/al003.png"},
    {id:"al004",name:"Zanna di Cinghiale",rarity:1,value:8,desc:"Zanna ricurva, usata come amuleto",icon:"🦴",img:"img/treasures/al004.png"},
    {id:"al005",name:"Resina del Bosco",rarity:1,value:6,desc:"Resina appiccicosa con proprietà antisettiche",icon:"🦴",img:"img/treasures/al005.png"},
    {id:"al006",name:"Erba della Quiete",rarity:2,value:25,desc:"Induce un sonno profondo se inalata",icon:"🦴",img:"img/treasures/al006.png"},
    {id:"al007",name:"Seta di Ragno",rarity:2,value:35,desc:"Più resistente del cuoio, leggerissima",icon:"🦴",img:"img/treasures/al007.png"},
    {id:"al008",name:"Dente di Troll",rarity:2,value:40,desc:"Si rigenera anche una volta estratto",icon:"🦴",img:"img/treasures/al008.png"},
    {id:"al009",name:"Piuma del Corvo Nero",rarity:2,value:30,desc:"Porta presagi, ricercata dagli indovini",icon:"🦴",img:"img/treasures/al009.png"},
    {id:"al010",name:"Cristallo di Muschio",rarity:2,value:28,desc:"Muschio pietrificato con tracce di magia",icon:"🦴",img:"img/treasures/al010.png"},
    {id:"al011",name:"Occhio della Dryade",rarity:3,value:80,desc:"Vede attraverso le piante nel raggio di un miglio",icon:"🦴",img:"img/treasures/al011.png"},
    {id:"al012",name:"Sangue di Mannaro",rarity:3,value:90,desc:"Ingrediente raro per pozioni di trasformazione",icon:"🦴",img:"img/treasures/al012.png"},
    {id:"al013",name:"Amuleto della Strega",rarity:3,value:110,desc:"Potenzia le magie della natura",icon:"🦴",img:"img/treasures/al013.png"},
    {id:"al014",name:"Corno del Centauro",rarity:3,value:95,desc:"Strumento capace di incantare le bestie",icon:"🦴",img:"img/treasures/al014.png"},
    {id:"al015",name:"Gemma della Foresta",rarity:3,value:120,desc:"Pietra verde che pulsa di vita silvana",icon:"🦴",img:"img/treasures/al015.png"},
    {id:"al016",name:"Cuore del Treant",rarity:4,value:250,desc:"Palpita ancora, fonte di energia arcana",icon:"🦴",img:"img/treasures/al016.png"},
    {id:"al017",name:"Corona di Spine",rarity:4,value:280,desc:"Corona vegetale che amplifica le magie",icon:"🦴",img:"img/treasures/al017.png"},
    {id:"al018",name:"Sigillo della Strega",rarity:4,value:320,desc:"Frammento di potere della Regina delle Streghe",icon:"🦴",img:"img/treasures/al018.png"},
    {id:"al019",name:"Essenza del Bosco",rarity:4,value:300,desc:"Distillato di secoli di magia silvana",icon:"🦴",img:"img/treasures/al019.png"},
    {id:"al020",name:"Elmo del Cacciatore",rarity:4,value:350,desc:"Protegge la mente dagli spiriti",icon:"🦴",img:"img/treasures/al020.png"},
    {id:"al021",name:"Lacrime della Dryade",rarity:5,value:600,desc:"Guariscono qualsiasi ferita",icon:"🦴",img:"img/treasures/al021.png"},
    {id:"al022",name:"Ascia della Caccia",rarity:5,value:750,desc:"Colpisce sempre il bersaglio",icon:"🦴",img:"img/treasures/al022.png"},
    {id:"al023",name:"Mantello del Bosco",rarity:5,value:700,desc:"Rende invisibili tra gli alberi",icon:"🦴",img:"img/treasures/al023.png"},
    {id:"al024",name:"Tomo delle Erbe Proibite",rarity:5,value:650,desc:"Ricette alchemiche dimenticate",icon:"🦴",img:"img/treasures/al024.png"},
    {id:"al025",name:"Seme del Mondo",rarity:5,value:800,desc:"Fa crescere qualsiasi pianta istantaneamente",icon:"🦴",img:"img/treasures/al025.png"},
    {id:"al026",name:"Coltello del Bandito",rarity:1,value:15,desc:"Lama trovata su un brigante caduto",icon:"🦴",img:"img/treasures/al026.png"},
    {id:"al027",name:"Benda di Erbe",rarity:1,value:7,desc:"Benda medicata con erbe del bosco",icon:"🦴",img:"img/treasures/al027.png"},
    {id:"al028",name:"Pozione di Vitalismo",rarity:2,value:50,desc:"Recupera una piccola quantità di salute",icon:"🦴",img:"img/treasures/al028.png"},
    {id:"al029",name:"Artigli del Grifone",rarity:3,value:130,desc:"Graffiano l'armatura come fosse carta",icon:"🦴",img:"img/treasures/al029.png"},
    {id:"al030",name:"Reliquia del Bosco Antico",rarity:4,value:400,desc:"Oggetto di culto di tribù silvane estinte",icon:"🦴",img:"img/treasures/al030.png"},
  ],
  miniere: [
    {id:"al031",name:"Polvere di Carbone",rarity:1,value:4,desc:"Utilizzabile come combustibile o pigmento",icon:"🦴",img:"img/treasures/al031.png"},
    {id:"al032",name:"Frammento di Quarzo",rarity:1,value:10,desc:"Cristallo comune con lievi proprietà magiche",icon:"🦴",img:"img/treasures/al032.png"},
    {id:"al033",name:"Vena di Rame",rarity:1,value:8,desc:"Minerale di base per l'artigianato",icon:"🦴",img:"img/treasures/al033.png"},
    {id:"al034",name:"Fungo del Tunnel",rarity:1,value:6,desc:"Illumina i cunicoli bui, non commestibile",icon:"🦴",img:"img/treasures/al034.png"},
    {id:"al035",name:"Osso del Minatore",rarity:1,value:5,desc:"Resti di un minatore sepolto da un crollo",icon:"🦴",img:"img/treasures/al035.png"},
    {id:"al036",name:"Pepita d'Argento",rarity:2,value:45,desc:"Metallo prezioso da purificare",icon:"🦴",img:"img/treasures/al036.png"},
    {id:"al037",name:"Cristallo Sonoro",rarity:2,value:55,desc:"Risuona a frequenze che spezzano la roccia",icon:"🦴",img:"img/treasures/al037.png"},
    {id:"al038",name:"Goccia di Lava Solidificata",rarity:2,value:40,desc:"Mantiene il calore per ore",icon:"🦴",img:"img/treasures/al038.png"},
    {id:"al039",name:"Corazza del Verme",rarity:2,value:60,desc:"Esoscheletro resistente delle creature del sottosuolo",icon:"🦴",img:"img/treasures/al039.png"},
    {id:"al040",name:"Smeraldo Grezzo",rarity:2,value:70,desc:"Gemma verde con impurità di rame",icon:"🦴",img:"img/treasures/al040.png"},
    {id:"al041",name:"Frammento di Golem",rarity:3,value:100,desc:"Pezzo di un costrutto meccanico avanzato",icon:"🦴",img:"img/treasures/al041.png"},
    {id:"al042",name:"Vena di Mithril",rarity:3,value:150,desc:"Metallo leggero e resistente, rarissimo",icon:"🦴",img:"img/treasures/al042.png"},
    {id:"al043",name:"Occhio del Basilisco",rarity:3,value:140,desc:"Ancora capace di pietrificare se guardato",icon:"🦴",img:"img/treasures/al043.png"},
    {id:"al044",name:"Cristallo di Fuoco",rarity:3,value:130,desc:"Contiene fiamme intrappolate da secoli",icon:"🦴",img:"img/treasures/al044.png"},
    {id:"al045",name:"Lastra Runata",rarity:3,value:160,desc:"Frammento di muro con incisioni magiche",icon:"🦴",img:"img/treasures/al045.png"},
    {id:"al046",name:"Nucleo del Golem",rarity:4,value:360,desc:"Fonte di energia di un antico costrutto",icon:"🦴",img:"img/treasures/al046.png"},
    {id:"al047",name:"Diamante Oscuro",rarity:4,value:420,desc:"Gemma nera che assorbe la luce",icon:"🦴",img:"img/treasures/al047.png"},
    {id:"al048",name:"Armatura del Nano",rarity:4,value:450,desc:"Forgiata con tecniche perdute",icon:"🦴",img:"img/treasures/al048.png"},
    {id:"al049",name:"Chiave delle Profondità",rarity:4,value:380,desc:"Apre porte sigillate da millenni",icon:"🦴",img:"img/treasures/al049.png"},
    {id:"al050",name:"Martello del Forgiatore",rarity:4,value:410,desc:"Plasma il metallo come fosse cera",icon:"🦴",img:"img/treasures/al050.png"},
    {id:"al051",name:"Vena di Adamantio",rarity:5,value:900,desc:"Il metallo più duro conosciuto",icon:"🦴",img:"img/treasures/al051.png"},
    {id:"al052",name:"Anello del Re Nano",rarity:5,value:850,desc:"Comanda qualsiasi costrutto nelle miniere",icon:"🦴",img:"img/treasures/al052.png"},
    {id:"al053",name:"Tomo della Forgiatura",rarity:5,value:780,desc:"Segreti dimenticati della metallurgia arcana",icon:"🦴",img:"img/treasures/al053.png"},
    {id:"al054",name:"Cuore di Cristallo",rarity:5,value:950,desc:"Non si può spezzare, pulsa di energia",icon:"🦴",img:"img/treasures/al054.png"},
    {id:"al055",name:"Mithril Puro",rarity:5,value:1000,desc:"Una pepita pura, vale una fortuna",icon:"🦴",img:"img/treasures/al055.png"},
    {id:"al056",name:"Piccone del Minatore",rarity:1,value:12,desc:"Strumento trovato su un esploratore caduto",icon:"🦴",img:"img/treasures/al056.png"},
    {id:"al057",name:"Fiala di Acido",rarity:2,value:65,desc:"Scioglie le rocce più dure",icon:"🦴",img:"img/treasures/al057.png"},
    {id:"al058",name:"Rubino di Magma",rarity:3,value:170,desc:"Rubino formato da lava compressa",icon:"🦴",img:"img/treasures/al058.png"},
    {id:"al059",name:"Maschera dello Spettro",rarity:4,value:500,desc:"Protegge dalle maledizioni degli spiriti",icon:"🦴",img:"img/treasures/al059.png"},
    {id:"al060",name:"Squama del Drago di Pietra",rarity:5,value:1100,desc:"Frammento del drago delle caverne, indistruttibile",icon:"🦴",img:"img/treasures/al060.png"},
  ],
  isole: [
    {id:"al061",name:"Conchiglia Rara",rarity:1,value:10,desc:"Conchiglia con spirali dorate",icon:"🦴",img:"img/treasures/al061.png"},
    {id:"al062",name:"Alga Marina",rarity:1,value:8,desc:"Proprietà curative se bollita",icon:"🦴",img:"img/treasures/al062.png"},
    {id:"al063",name:"Perla Grigia",rarity:1,value:20,desc:"Perla di mare di valore moderato",icon:"🦴",img:"img/treasures/al063.png"},
    {id:"al064",name:"Dente di Squalo",rarity:1,value:15,desc:"Ottimo come pugnale improvvisato",icon:"🦴",img:"img/treasures/al064.png"},
    {id:"al065",name:"Cassa del Naufrago",rarity:1,value:30,desc:"Contenuto misto di beni deteriorati",icon:"🦴",img:"img/treasures/al065.png"},
    {id:"al066",name:"Inchiostro di Polpo",rarity:2,value:75,desc:"Usato per scrivere pergamene di magia",icon:"🦴",img:"img/treasures/al066.png"},
    {id:"al067",name:"Scaglia di Sirena",rarity:2,value:90,desc:"Iridescente, fortemente magica",icon:"🦴",img:"img/treasures/al067.png"},
    {id:"al068",name:"Corallo Sanguigno",rarity:2,value:85,desc:"Rosso vivo, ingrediente alchemico pregiato",icon:"🦴",img:"img/treasures/al068.png"},
    {id:"al069",name:"Bussola del Fantasma",rarity:2,value:100,desc:"Indica sempre la nave fantasma più vicina",icon:"🦴",img:"img/treasures/al069.png"},
    {id:"al070",name:"Moneta del Pirata",rarity:2,value:80,desc:"Valuta di un antico impero marittimo",icon:"🦴",img:"img/treasures/al070.png"},
    {id:"al071",name:"Tridente del Tritone",rarity:3,value:180,desc:"Forgiato con coralli abissali",icon:"🦴",img:"img/treasures/al071.png"},
    {id:"al072",name:"Essenza Marina",rarity:3,value:200,desc:"Bottiglia con l'essenza dell'oceano",icon:"🦴",img:"img/treasures/al072.png"},
    {id:"al073",name:"Mappa del Relitto",rarity:3,value:220,desc:"Indica la posizione di un relitto carico d'oro",icon:"🦴",img:"img/treasures/al073.png"},
    {id:"al074",name:"Squama del Drago di Mare",rarity:3,value:240,desc:"Impenetrabile, leggera come una piuma",icon:"🦴",img:"img/treasures/al074.png"},
    {id:"al075",name:"Corno del Leviatano",rarity:3,value:260,desc:"Produce un suono udibile per miglia",icon:"🦴",img:"img/treasures/al075.png"},
    {id:"al076",name:"Armatura del Corsaro",rarity:4,value:550,desc:"Rende il portatore semi-incorporeo",icon:"🦴",img:"img/treasures/al076.png"},
    {id:"al077",name:"Spada della Tempesta",rarity:4,value:600,desc:"Colpisce con la forza di un fulmine",icon:"🦴",img:"img/treasures/al077.png"},
    {id:"al078",name:"Occhio dell'Abisso",rarity:4,value:580,desc:"Sfera che mostra il fondo del mare",icon:"🦴",img:"img/treasures/al078.png"},
    {id:"al079",name:"Corona del Re del Mare",rarity:4,value:650,desc:"Comanda le creature marine minori",icon:"🦴",img:"img/treasures/al079.png"},
    {id:"al080",name:"Remo Incantato",rarity:4,value:520,desc:"Naviga da solo verso la destinazione",icon:"🦴",img:"img/treasures/al080.png"},
    {id:"al081",name:"Perla del Leviatano",rarity:5,value:1200,desc:"Grande come un pugno, valore inestimabile",icon:"🦴",img:"img/treasures/al081.png"},
    {id:"al082",name:"Tridente del Re del Mare",rarity:5,value:1400,desc:"Comanda le tempeste e i marosi",icon:"🦴",img:"img/treasures/al082.png"},
    {id:"al083",name:"Velo della Sirena Antica",rarity:5,value:1300,desc:"Chi lo indossa può respirare sott'acqua",icon:"🦴",img:"img/treasures/al083.png"},
    {id:"al084",name:"Reliquia del Tempio Sommerso",rarity:5,value:1100,desc:"Idolo di un culto pre-umano",icon:"🦴",img:"img/treasures/al084.png"},
    {id:"al085",name:"Ancora della Nave Fantasma",rarity:5,value:1500,desc:"Fissa qualsiasi imbarcazione immobile",icon:"🦴",img:"img/treasures/al085.png"},
    {id:"al086",name:"Borsa del Marinaio",rarity:1,value:18,desc:"Attrezzi da navigazione di scarso valore",icon:"🦴",img:"img/treasures/al086.png"},
    {id:"al087",name:"Pozione del Mare",rarity:2,value:95,desc:"Dissetante anche in mezzo all'oceano",icon:"🦴",img:"img/treasures/al087.png"},
    {id:"al088",name:"Frammento del Colosso",rarity:3,value:280,desc:"Roccia di corallo dura come il granito",icon:"🦴",img:"img/treasures/al088.png"},
    {id:"al089",name:"Sigillo dell'Ammiraglio",rarity:4,value:700,desc:"Apre porte di porti e fortezze costiere",icon:"🦴",img:"img/treasures/al089.png"},
    {id:"al090",name:"Cristallo dell'Oceano",rarity:5,value:1600,desc:"Contiene l'essenza stessa del mare",icon:"🦴",img:"img/treasures/al090.png"},
  ],
  montagne: [
    {id:"al091",name:"Piuma di Roc",rarity:1,value:25,desc:"Grande come una lancia, leggerissima",icon:"🦴",img:"img/treasures/al091.png"},
    {id:"al092",name:"Neve Eterna",rarity:1,value:15,desc:"Non si scioglie mai, ricercata dagli alchimisti",icon:"🦴",img:"img/treasures/al092.png"},
    {id:"al093",name:"Cristallo di Ghiaccio",rarity:1,value:20,desc:"Ghiaccio di vetta che non si scioglie",icon:"🦴",img:"img/treasures/al093.png"},
    {id:"al094",name:"Corno dello Yeti",rarity:1,value:30,desc:"Strumento per spaventare i predatori",icon:"🦴",img:"img/treasures/al094.png"},
    {id:"al095",name:"Lichene della Vetta",rarity:1,value:12,desc:"Lichene raro con proprietà allucinogene",icon:"🦴",img:"img/treasures/al095.png"},
    {id:"al096",name:"Artiglio di Grifone",rarity:2,value:110,desc:"Afferra con forza sovrumana",icon:"🦴",img:"img/treasures/al096.png"},
    {id:"al097",name:"Cristallo della Tempesta",rarity:2,value:130,desc:"Pulsa con elettricità statica",icon:"🦴",img:"img/treasures/al097.png"},
    {id:"al098",name:"Sangue di Gigante",rarity:2,value:120,desc:"Potenzia temporaneamente la forza",icon:"🦴",img:"img/treasures/al098.png"},
    {id:"al099",name:"Pietra del Vento",rarity:2,value:140,desc:"Chi la porta corre più veloce del vento",icon:"🦴",img:"img/treasures/al099.png"},
    {id:"al100",name:"Occhio del Ciclope",rarity:2,value:150,desc:"Vede nel buio e attraverso i muri",icon:"🦴",img:"img/treasures/al100.png"},
    {id:"al101",name:"Squama della Wyvern",rarity:3,value:300,desc:"Brucia al tatto ma non si consuma",icon:"🦴",img:"img/treasures/al101.png"},
    {id:"al102",name:"Frammento di Fulmine",rarity:3,value:320,desc:"Assorbe e rilascia scariche elettriche",icon:"🦴",img:"img/treasures/al102.png"},
    {id:"al103",name:"Dente del Grifone",rarity:3,value:280,desc:"Taglia il ferro come fosse carta",icon:"🦴",img:"img/treasures/al103.png"},
    {id:"al104",name:"Testa del Gargoyle",rarity:3,value:350,desc:"Ancora capace di pietrificare con lo sguardo",icon:"🦴",img:"img/treasures/al104.png"},
    {id:"al105",name:"Reliquia del Gigante",rarity:3,value:400,desc:"Amuleto delle civiltà dei giganti",icon:"🦴",img:"img/treasures/al105.png"},
    {id:"al106",name:"Armatura del Capitano Gigante",rarity:4,value:750,desc:"Taglia di gigante, protegge da tutto",icon:"🦴",img:"img/treasures/al106.png"},
    {id:"al107",name:"Uovo del Drago della Neve",rarity:4,value:800,desc:"Preziosissimo, potrebbe schiudersi",icon:"🦴",img:"img/treasures/al107.png"},
    {id:"al108",name:"Spada del Guardiano",rarity:4,value:820,desc:"Taglia gli incantesimi come il ferro",icon:"🦴",img:"img/treasures/al108.png"},
    {id:"al109",name:"Corona del Re dei Giganti",rarity:4,value:900,desc:"Chi la porta guida i giganti minori",icon:"🦴",img:"img/treasures/al109.png"},
    {id:"al110",name:"Tomo della Sfinge",rarity:4,value:860,desc:"Risponde a qualsiasi domanda una sola volta",icon:"🦴",img:"img/treasures/al110.png"},
    {id:"al111",name:"Piuma del Roc Antico",rarity:5,value:1700,desc:"Volare senza peso, invisibile di notte",icon:"🦴",img:"img/treasures/al111.png"},
    {id:"al112",name:"Martello del Gigante di Fuoco",rarity:5,value:2000,desc:"Forgia l'acciaio senza fuoco",icon:"🦴",img:"img/treasures/al112.png"},
    {id:"al113",name:"Squama del Drago Antico",rarity:5,value:1800,desc:"Fredda come la morte, indistruttibile",icon:"🦴",img:"img/treasures/al113.png"},
    {id:"al114",name:"Cristallo Eterno della Vetta",rarity:5,value:1900,desc:"Contiene una magia elementale primordiale",icon:"🦴",img:"img/treasures/al114.png"},
    {id:"al115",name:"Occhio della Wyvern",rarity:5,value:2200,desc:"Vede i punti deboli di qualsiasi nemico",icon:"🦴",img:"img/treasures/al115.png"},
    {id:"al116",name:"Mantello del Vento del Nord",rarity:1,value:35,desc:"Ripara dal freddo anche a temperature estreme",icon:"🦴",img:"img/treasures/al116.png"},
    {id:"al117",name:"Pozione del Gigante",rarity:2,value:160,desc:"Aumenta la statura di un metro per un'ora",icon:"🦴",img:"img/treasures/al117.png"},
    {id:"al118",name:"Dente della Banshee",rarity:3,value:420,desc:"Il suo suono scatena piccole valanghe",icon:"🦴",img:"img/treasures/al118.png"},
    {id:"al119",name:"Anello del Signore dei Grifoni",rarity:4,value:950,desc:"I grifoni minori ti ubbidiscono",icon:"🦴",img:"img/treasures/al119.png"},
    {id:"al120",name:"Cuore del Titan di Pietra",rarity:5,value:2500,desc:"Fonte di potere primordiale",icon:"🦴",img:"img/treasures/al120.png"},
  ],
  deserto: [
    {id:"al121",name:"Sabbia d'Oro",rarity:1,value:30,desc:"Granelli d'oro puro mescolati alla sabbia",icon:"🦴",img:"img/treasures/al121.png"},
    {id:"al122",name:"Frammento di Sarcofago",rarity:1,value:25,desc:"Pietra antica con geroglifici",icon:"🦴",img:"img/treasures/al122.png"},
    {id:"al123",name:"Benda Sacra",rarity:1,value:20,desc:"Impregnata di oli rituali",icon:"🦴",img:"img/treasures/al123.png"},
    {id:"al124",name:"Vaso Funerario",rarity:1,value:45,desc:"Urna che contiene organi mummificati",icon:"🦴",img:"img/treasures/al124.png"},
    {id:"al125",name:"Papiro Antico",rarity:1,value:35,desc:"Pergamena con scritture misteriose",icon:"🦴",img:"img/treasures/al125.png"},
    {id:"al126",name:"Amuleto dello Scarabeo",rarity:2,value:170,desc:"Respinge i non-morti minori",icon:"🦴",img:"img/treasures/al126.png"},
    {id:"al127",name:"Sabbia del Miraggio",rarity:2,value:180,desc:"Crea illusioni visive se dispersa",icon:"🦴",img:"img/treasures/al127.png"},
    {id:"al128",name:"Scintilla del Djinn",rarity:2,value:200,desc:"Una piccola scintilla di potere del genio",icon:"🦴",img:"img/treasures/al128.png"},
    {id:"al129",name:"Moneta del Faraone",rarity:2,value:220,desc:"Oro di un regno dimenticato",icon:"🦴",img:"img/treasures/al129.png"},
    {id:"al130",name:"Veleno del Serpente",rarity:2,value:190,desc:"Paralizza il bersaglio per ore",icon:"🦴",img:"img/treasures/al130.png"},
    {id:"al131",name:"Pietra Lunare",rarity:3,value:480,desc:"Brilla di notte, fonte di magia lunare",icon:"🦴",img:"img/treasures/al131.png"},
    {id:"al132",name:"Occhio della Sfinge",rarity:3,value:520,desc:"Vede attraverso illusioni e bugie",icon:"🦴",img:"img/treasures/al132.png"},
    {id:"al133",name:"Cristallo del Djinn",rarity:3,value:560,desc:"Frammento di un genio cristallizzato",icon:"🦴",img:"img/treasures/al133.png"},
    {id:"al134",name:"Maschera del Sacerdote",rarity:3,value:600,desc:"Maschera funeraria d'oro massiccio",icon:"🦴",img:"img/treasures/al134.png"},
    {id:"al135",name:"Sabbia del Tempo",rarity:3,value:650,desc:"Chi la lancia invecchia istantaneamente",icon:"🦴",img:"img/treasures/al135.png"},
    {id:"al136",name:"Scettro del Faraone",rarity:4,value:1100,desc:"Comanda le mummie entro un miglio",icon:"🦴",img:"img/treasures/al136.png"},
    {id:"al137",name:"Bottiglia del Djinn",rarity:4,value:1200,desc:"Contiene ancora residui di potere del genio",icon:"🦴",img:"img/treasures/al137.png"},
    {id:"al138",name:"Armatura del Colosso",rarity:4,value:1300,desc:"Frammenti dell'armatura del guardiano",icon:"🦴",img:"img/treasures/al138.png"},
    {id:"al139",name:"Testa del Naga",rarity:4,value:1150,desc:"Maschera sacra, protegge dai veleni",icon:"🦴",img:"img/treasures/al139.png"},
    {id:"al140",name:"Cuore dello Scarabeo",rarity:4,value:1250,desc:"Pompa che non smette mai di battere",icon:"🦴",img:"img/treasures/al140.png"},
    {id:"al141",name:"Corona del Faraone",rarity:5,value:3000,desc:"Comanda tutti i non-morti del deserto",icon:"🦴",img:"img/treasures/al141.png"},
    {id:"al142",name:"Spada della Dea della Guerra",rarity:5,value:3500,desc:"L'arma forgiata per la guerra divina",icon:"🦴",img:"img/treasures/al142.png"},
    {id:"al143",name:"Bottiglia del Djinn Supremo",rarity:5,value:3200,desc:"Intrappolalo e ottieni fuoco illimitato",icon:"🦴",img:"img/treasures/al143.png"},
    {id:"al144",name:"Occhio del Sole",rarity:5,value:4000,desc:"Il gioiello più sacro del deserto",icon:"🦴",img:"img/treasures/al144.png"},
    {id:"al145",name:"Velo del Guardiano",rarity:5,value:3800,desc:"Permette di camminare tra vivi e morti",icon:"🦴",img:"img/treasures/al145.png"},
    {id:"al146",name:"Veleno dello Scorpione",rarity:1,value:40,desc:"Letale, usato per avvelenare le lame",icon:"🦴",img:"img/treasures/al146.png"},
    {id:"al147",name:"Gemma del Deserto",rarity:2,value:240,desc:"Pietra levigata dall'abrasione della sabbia",icon:"🦴",img:"img/treasures/al147.png"},
    {id:"al148",name:"Occhio del Drago del Deserto",rarity:3,value:700,desc:"Trova l'acqua anche nel deserto più arido",icon:"🦴",img:"img/treasures/al148.png"},
    {id:"al149",name:"Pergamena della Maledizione",rarity:4,value:1400,desc:"Maledice chiunque la legga",icon:"🦴",img:"img/treasures/al149.png"},
    {id:"al150",name:"Sarcofago Portatile",rarity:5,value:4500,desc:"Preserva qualsiasi corpo indefinitamente",icon:"🦴",img:"img/treasures/al150.png"},
  ],
  oltretomba: [
    {id:"al151",name:"Ossidiana Spettrale",rarity:1,value:50,desc:"Pietra dell'aldilà, fredda come il vuoto",icon:"🦴",img:"img/treasures/al151.png"},
    {id:"al152",name:"Moneta di Caronte",rarity:1,value:60,desc:"Valuta del guardiano dei morti",icon:"🦴",img:"img/treasures/al152.png"},
    {id:"al153",name:"Cenere del Condannato",rarity:1,value:40,desc:"Ceneri di chi è bruciato nell'abisso",icon:"🦴",img:"img/treasures/al153.png"},
    {id:"al154",name:"Roccia dell'Ade",rarity:1,value:55,desc:"Frammento del reame dei morti",icon:"🦴",img:"img/treasures/al154.png"},
    {id:"al155",name:"Lacrime di Cristallo",rarity:1,value:45,desc:"Dolore puro condensato in pietra",icon:"🦴",img:"img/treasures/al155.png"},
    {id:"al156",name:"Filo della Parca",rarity:2,value:280,desc:"Tesse destini, non si può tagliare",icon:"🦴",img:"img/treasures/al156.png"},
    {id:"al157",name:"Essenza di Fantasma",rarity:2,value:300,desc:"Versata su un oggetto, lo infesta",icon:"🦴",img:"img/treasures/al157.png"},
    {id:"al158",name:"Veleno della Banshee",rarity:2,value:320,desc:"Causa visioni dell'aldilà",icon:"🦴",img:"img/treasures/al158.png"},
    {id:"al159",name:"Artiglio del Cane Infernale",rarity:2,value:350,desc:"Brucia ancora dopo la morte dell'animale",icon:"🦴",img:"img/treasures/al159.png"},
    {id:"al160",name:"Cuoio del Demone",rarity:2,value:370,desc:"Resistente come l'acciaio, flessibile come la seta",icon:"🦴",img:"img/treasures/al160.png"},
    {id:"al161",name:"Squama del Drago Non-Morto",rarity:3,value:800,desc:"Riluce di un bagliore spettrale",icon:"🦴",img:"img/treasures/al161.png"},
    {id:"al162",name:"Anima Prigioniera",rarity:3,value:900,desc:"Cristallo con un'anima intrappolata dentro",icon:"🦴",img:"img/treasures/al162.png"},
    {id:"al163",name:"Testa del Cavaliere",rarity:3,value:1000,desc:"Vede ancora, profetizza la morte",icon:"🦴",img:"img/treasures/al163.png"},
    {id:"al164",name:"Reliquia del Cavaliere",rarity:3,value:1100,desc:"Frammento di armatura benedetta da Morte",icon:"🦴",img:"img/treasures/al164.png"},
    {id:"al165",name:"Libro delle Anime",rarity:3,value:1200,desc:"Contiene i nomi di migliaia di condannati",icon:"🦴",img:"img/treasures/al165.png"},
    {id:"al166",name:"Bastone del Lich",rarity:4,value:2000,desc:"Comanda i non-morti nelle vicinanze",icon:"🦴",img:"img/treasures/al166.png"},
    {id:"al167",name:"Armatura del Cavaliere",rarity:4,value:2200,desc:"Indistruttibile, pesa il doppio dell'acciaio",icon:"🦴",img:"img/treasures/al167.png"},
    {id:"al168",name:"Sigillo del Principe Demone",rarity:4,value:2400,desc:"Marchio di un nobile dell'inferno",icon:"🦴",img:"img/treasures/al168.png"},
    {id:"al169",name:"Occhio del Re dei Morti",rarity:4,value:2600,desc:"Vede tutte le anime nei dintorni",icon:"🦴",img:"img/treasures/al169.png"},
    {id:"al170",name:"Cuore del Colosso",rarity:4,value:2800,desc:"Motore di migliaia di anime schiavizzate",icon:"🦴",img:"img/treasures/al170.png"},
    {id:"al171",name:"Corona della Morte",rarity:5,value:6000,desc:"Chi la porta è immune alla morte temporaneamente",icon:"🦴",img:"img/treasures/al171.png"},
    {id:"al172",name:"Spada del Divoratore",rarity:5,value:7000,desc:"Distrugge completamente l'anima del colpito",icon:"🦴",img:"img/treasures/al172.png"},
    {id:"al173",name:"Tomo dell'Immortalità",rarity:5,value:6500,desc:"Contiene il segreto della vera immortalità",icon:"🦴",img:"img/treasures/al173.png"},
    {id:"al174",name:"Chiave dell'Oltretomba",rarity:5,value:8000,desc:"Apre e chiude i cancelli dell'aldilà",icon:"🦴",img:"img/treasures/al174.png"},
    {id:"al175",name:"Essenza del Divino",rarity:5,value:10000,desc:"Un frammento di potere divino corrotto",icon:"🦴",img:"img/treasures/al175.png"},
    {id:"al176",name:"Lacrime del Signore",rarity:1,value:65,desc:"Cristalli di tristezza cosmica",icon:"🦴",img:"img/treasures/al176.png"},
    {id:"al177",name:"Pergamena della Resurrezione",rarity:2,value:400,desc:"Riporta in vita per un breve periodo",icon:"🦴",img:"img/treasures/al177.png"},
    {id:"al178",name:"Osso del Demone Antico",rarity:3,value:1300,desc:"Materiale per costruzioni infernali",icon:"🦴",img:"img/treasures/al178.png"},
    {id:"al179",name:"Anello dell'Araldo",rarity:4,value:3200,desc:"Comunica con qualsiasi anima ovunque",icon:"🦴",img:"img/treasures/al179.png"},
    {id:"al180",name:"Reliquia Primordiale",rarity:5,value:15000,desc:"Esisteva prima del mondo, vale più di un regno",icon:"🦴",img:"img/treasures/al180.png"},
  ],
};
/* ══════════════════════════════════════════════════════════
 AREA_QUESTS — Missioni permanenti per area (non settimanali)
 Completare tutte le missioni di un'area sblocca la successiva
══════════════════════════════════════════════════════════ */
export const AREA_QUESTS = {

  foresta: [
    {id:"f01", n:1,  title:"Primo Passo nel Buio",   type:"kills_area",   target:10,   desc:"Sconfiggi 10 nemici nella Foresta Crepuscolare"},
    {id:"f02", n:2,  title:"Caccia al Branco",        type:"kills_name",   target:5,   enemy:"Lupo Grigio",          desc:"Uccidi 5 Lupi Grigi"},
    {id:"f03", n:3,  title:"Pulizia dei Sentieri",    type:"kills_name",   target:5,   enemy:"Goblin Frugatore",     desc:"Uccidi 5 Goblin Frugatori"},
    {id:"f04", n:4,  title:"Erborista Improvvisato",  type:"loot_area",    target:3,   desc:"Ottieni 3 oggetti dalla Foresta Crepuscolare"},
    {id:"f05", n:5,  title:"Il Bosco Chiama",         type:"loot_area",   target:3,   desc:"Trova 3 tesori nella Foresta Crepuscolare"},
    {id:"f06", n:6,  title:"Abbattere il Troll",      type:"kills_name",   target:3,   enemy:"Troll Piccolo",        desc:"Uccidi 3 Troll Piccoli"},
    {id:"f07", n:7,  title:"Ragni e Veleni",          type:"kills_name",   target:5,   enemy:"Ragno Cacciatore",     desc:"Uccidi 5 Ragni Cacciatori"},
    {id:"f08", n:8,  title:"Primo Bottino",           type:"denari_area",  target:1000, desc:'Accumula 1000 <span class="mk-coin"></span> da bottini della Foresta'},
    {id:"f09", n:9,  title:"La Strega del Bosco",     type:"kills_name",   target:2,   enemy:"Strega del Bosco",     desc:"Uccidi 2 Streghe del Bosco"},
    {id:"f10", n:10, title:"Sopravvissuto",           type:"kills_area",   target:40,   desc:"Sconfiggi 40 nemici nella Foresta Crepuscolare"},
    {id:"f11", n:11, title:"Cacciatore di Spiriti",   type:"kills_tag",    target:4,   tag:"spirito",                desc:"Sconfiggi 4 Spiriti nella Foresta"},
    {id:"f12", n:12, title:"Borsa Piena",             type:"loot_area",    target:30,   desc:"Ottieni 30 oggetti dalla Foresta Crepuscolare"},
    {id:"f13", n:13, title:"L'Orso Notturno",         type:"kills_name",   target:3,   enemy:"Orso Notturno",        desc:"Uccidi 3 Orsi Notturni"},
    {id:"f14", n:14, title:"Esploratore del Bosco",   type:"loot_area",   target:20,  desc:"Trova 20 tesori nella Foresta Crepuscolare"},
    {id:"f15", n:15, title:"Il Branco è Spezzato",    type:"kills_name",   target:1,   enemy:"Mannaro Alfa",         desc:"Uccidi il Mannaro Alfa"},
    {id:"f16", n:16, title:"Ricchezze del Bosco",     type:"denari_area",  target:2000, desc:'Accumula 2000 <span class="mk-coin"></span> da bottini della Foresta Crepuscolare'},
    {id:"f17", n:17, title:"Abbattere il Centauro",   type:"kills_name",   target:2,   enemy:"Centauro Selvaggio",   desc:"Uccidi 2 Centauri Selvaggi"},
    {id:"f18", n:18, title:"La Caccia Selvaggia",     type:"kills_name",   target:1,   enemy:"Caccia Selvaggia",     desc:"Sconfiggi la Caccia Selvaggia"},
    {id:"f19", n:19, title:"Veterano del Bosco",      type:"kills_area",   target:70,  desc:"Sconfiggi 70 nemici nella Foresta"},
    {id:"f20", n:20, title:"La Regina Cade",          type:"kills_name",   target:1,   enemy:"Regina delle Streghe", desc:"Sconfiggi la Regina delle Streghe", sblocca:"miniere"},
  ],

  miniere: [
    {id:"m01", n:1,  title:"Discesa nelle Tenebre",    type:"kills_area",  target:10,   desc:"Sconfiggi 10 nemici nelle Miniere Sepolte"},
    {id:"m02", n:2,  title:"Infestazione di Ratti",    type:"kills_name",  target:5,   enemy:"Ratto delle Miniere",   desc:"Uccidi 5 Ratti delle Miniere"},
    {id:"m03", n:3,  title:"Talpe nel Tunnel",       type:"kills_name",  target:5,   enemy:"Talpa Spinata",    desc:"Uccidi 5 Talpe Spinate"},
    {id:"m04", n:4,  title:"Raccolta di Minerali",     type:"loot_area",   target:30,   desc:"Ottieni 30 oggetti dalle Miniere Sepolte"},
    {id:"m05", n:5,  title:"I Tunnel Chiamano",        type:"loot_area",  target:50,   desc:"Trova 50 tesori nelle Miniere Sepolte"},
    {id:"m06", n:6,  title:"Pace ai Caduti",           type:"kills_name",  target:4,   enemy:"Minatore Non-Morto",        desc:"Sconfiggi 4 Minatori Non-Morti"},
    {id:"m07", n:7,  title:"Fermare il Verme",         type:"kills_name",  target:3,   enemy:"Verme Perforatore",     desc:"Uccidi 3 Vermi Perforatori"},
    {id:"m08", n:8,  title:"Oro delle Profondità",     type:"denari_area", target:3000, desc:'Accumula 3000 <span class="mk-coin"></span> da bottini delle Miniere Sepolte'},
    {id:"m09", n:9,  title:"Il Golem di Carbone",      type:"kills_name",  target:2,   enemy:"Golem di Carbone",      desc:"Sconfiggi 2 Golem di Carbone"},
    {id:"m10", n:10, title:"Minatore Temerario",       type:"kills_area",  target:30,   desc:"Sconfiggi 30 nemici nelle Miniere Sepolte"},
    {id:"m11", n:11, title:"Caccia all'Elementale",    type:"kills_name",  target:3,   enemy:"Elementale di Pietra",  desc:"Sconfiggi 3 Elementali di Pietra"},
    {id:"m12", n:12, title:"Vena Preziosa",            type:"loot_area",   target:70,   desc:"Ottieni 70 oggetti dalle Miniere Sepolte"},
    {id:"m13", n:13, title:"Il Basilisco",             type:"kills_name",  target:3,   enemy:"Basilisco",             desc:"Sconfiggi 3 volte un Basilisco"},
    {id:"m14", n:14, title:"Il Labirinto Stregato",     type:"kills_name",  target:1,   enemy:"Amazzone del Labirinto",             desc:"Sconfiggi l'Amazzone del Labirinto"},
    {id:"m15", n:15, title:"Il Drago delle Cave",      type:"kills_name",  target:2,   enemy:"Giovane Drago di Pietra",desc:"Sconfiggi 2 volte un Giovane Drago di Pietra"},
    {id:"m16", n:16, title:"Ricchezze Sotterranee",    type:"denari_area", target:6000,desc:'Accumula 6000 <span class="mk-coin"></span> da bottini delle Miniere Sepolte'},
    {id:"m17", n:17, title:"Il Sovrano del Sottosuolo",         type:"kills_name",  target:1,   enemy:"Re Nanico delle Miniere",         desc:"Sconfiggi il Re Nanico delle Miniere"},
    {id:"m18", n:18, title:"Il Guardiano Golem",       type:"kills_name",  target:1,   enemy:"Colosso di Guardia",       desc:"Sconfiggi il Colosso di Guardia"},
    {id:"m19", n:19, title:"Veterano delle Profondità",type:"kills_area",  target:80,  desc:"Sconfiggi 80 nemici nelle Miniere Sepolte"},
    {id:"m20", n:20, title:"Il Terrore delle Miniere",      type:"kills_name",  target:1,   enemy:"Drago delle Profondità", desc:"Sconfiggi il Drago delle Profondità", sblocca:"isole"},
  ],

  isole: [
    {id:"i01", n:1,  title:"Approdo Maledetto",       type:"kills_area",  target:2,   desc:"Sconfiggi 2 nemici nelle Isole dei Naufraghi"},
    {id:"i02", n:2,  title:"Granchi e Fantasmi",      type:"kills_area",  target:6,   desc:"Uccidi 6 nemici delle Isole"},
    {id:"i03", n:3,  title:"Silenzio delle Sirene",   type:"kills_name",  target:3,   enemy:"Sirena Predatrice",    desc:"Sconfiggi 3 Sirene Predatrici"},
    {id:"i04", n:4,  title:"Perle del Mare",          type:"loot_area",   target:3,   desc:"Ottieni 3 oggetti dalle Isole"},
    {id:"i05", n:5,  title:"Navigatore Coraggioso",   type:"loot_area",  target:3,   desc:"Trova 3 tesori nelle Isole"},
    {id:"i06", n:6,  title:"Tentacoli nell'Ombra",    type:"kills_name",  target:4,   enemy:"Polpo di Scogliera",   desc:"Sconfiggi 4 Polpi di Scogliera"},
    {id:"i07", n:7,  title:"Vichinghi dei Mari",      type:"kills_name",  target:3,   enemy:"Guerriero Vichingo",   desc:"Sconfiggi 3 Guerrieri Vichinghi"},
    {id:"i08", n:8,  title:"Bottino del Naufragio",   type:"denari_area", target:600, desc:'Accumula 600 <span class="mk-coin"></span> da bottini delle Isole'},
    {id:"i09", n:9,  title:"L'Idra Marina",           type:"kills_name",  target:1,   enemy:"Idra Marina",          desc:"Sconfiggi l'Idra Marina"},
    {id:"i10", n:10, title:"Lupo di Mare",            type:"kills_area",  target:8,   desc:"Sconfiggi 8 nemici nelle Isole"},
    {id:"i11", n:11, title:"Spiriti dell'Oceano",     type:"kills_name",  target:3,   enemy:"Elementale d'Acqua",   desc:"Sconfiggi 3 Elementali d'Acqua"},
    {id:"i12", n:12, title:"Seta di Sirena",          type:"loot_area",   target:5,   desc:"Ottieni 5 oggetti dalle Isole"},
    {id:"i13", n:13, title:"Il Capitano Spettrale",   type:"kills_name",  target:1,   enemy:"Capitano Spettrale",   desc:"Sconfiggi il Capitano Spettrale"},
    {id:"i14", n:14, title:"Esploratore dei Mari",    type:"loot_area",  target:6,  desc:"Trova 6 tesori nelle Isole"},
    {id:"i15", n:15, title:"Il Drago del Mare",       type:"kills_name",  target:1,   enemy:"Drago Marino Antico",  desc:"Sconfiggi il Drago Marino Antico"},
    {id:"i16", n:16, title:"Tesori Sommersi",         type:"denari_area", target:2000,desc:'Accumula 2000 <span class="mk-coin"></span> da bottini delle Isole'},
    {id:"i17", n:17, title:"Il Re dei Tritoni",       type:"kills_name",  target:1,   enemy:"Re dei Tritoni",       desc:"Sconfiggi il Re dei Tritoni"},
    {id:"i18", n:18, title:"Il Guardiano di Corallo", type:"kills_name",  target:1,   enemy:"Colosso di Corallo",   desc:"Sconfiggi il Colosso di Corallo"},
    {id:"i19", n:19, title:"Capitano dei Mari",       type:"kills_area",  target:15,  desc:"Sconfiggi 15 nemici nelle Isole"},
    {id:"i20", n:20, title:"Il Sovrano degli Abissi", type:"kills_name",  target:1,   enemy:"Kraken Primordiale",   desc:"Sconfiggi il Kraken Primordiale", sblocca:"montagne"},
  ],

  montagne: [
    {id:"mo01", n:1,  title:"Vetta Proibita",           type:"kills_area",  target:2,   desc:"Sconfiggi 2 nemici nelle Montagne Silenti"},
    {id:"mo02", n:2,  title:"Bestie del Ghiaccio",      type:"kills_name",  target:3,   enemy:"Yeti",                  desc:"Uccidi 3 Yeti"},
    {id:"mo03", n:3,  title:"Goblin d'Alta Quota",      type:"kills_name",  target:5,   enemy:"Goblin di Montagna",    desc:"Uccidi 5 Goblin di Montagna"},
    {id:"mo04", n:4,  title:"Piume del Vento",          type:"loot_area",   target:3,   desc:"Ottieni 3 oggetti dalle Montagne"},
    {id:"mo05", n:5,  title:"Scalatore Temerario",      type:"loot_area",  target:3,   desc:"Trova 3 tesori nelle Montagne"},
    {id:"mo06", n:6,  title:"L'Aquila Gigante",         type:"kills_name",  target:3,   enemy:"Aquila Gigante",        desc:"Sconfiggi 3 Aquile Giganti"},
    {id:"mo07", n:7,  title:"Spiriti del Vento",        type:"kills_name",  target:3,   enemy:"Elementale del Vento",  desc:"Sconfiggi 3 Elementali del Vento"},
    {id:"mo08", n:8,  title:"Oro delle Vette",          type:"denari_area", target:1000,desc:'Accumula 1000 <span class="mk-coin"></span> da bottini delle Montagne'},
    {id:"mo09", n:9,  title:"Il Ciclope Corazzato",     type:"kills_name",  target:1,   enemy:"Ciclope Corazzato",     desc:"Sconfiggi il Ciclope Corazzato"},
    {id:"mo10", n:10, title:"Conquistatore delle Vette",type:"kills_area",  target:8,   desc:"Sconfiggi 8 nemici nelle Montagne"},
    {id:"mo11", n:11, title:"Le Guardiane del Cielo",   type:"kills_name",  target:2,   enemy:"Valchiria",     desc:"Sconfiggi 2 Valchirie"},
    {id:"mo12", n:12, title:"Cristallo della Tempesta", type:"loot_area",   target:5,   desc:"Ottieni 5 oggetti dalle Montagne"},
    {id:"mo13", n:13, title:"La Strega del Gelo",       type:"kills_name",  target:1,   enemy:"Strega del Gelo",       desc:"Sconfiggi la Strega del Gelo"},
    {id:"mo14", n:14, title:"Esploratore delle Vette",  type:"loot_area",  target:6,  desc:"Trova 6 tesori nelle Montagne"},
    {id:"mo15", n:15, title:"Il Drago delle Nevi",      type:"kills_name",  target:1,   enemy:"Drago delle Nevi",      desc:"Sconfiggi il Drago delle Nevi"},
    {id:"mo16", n:16, title:"Ricchezze della Vetta",    type:"denari_area", target:3000,desc:'Accumula 3000 <span class="mk-coin"></span> da bottini delle Montagne'},
    {id:"mo17", n:17, title:"Il Gigante di Fuoco",      type:"kills_name",  target:1,   enemy:"Gigante di Fuoco",      desc:"Sconfiggi il Gigante di Fuoco"},
    {id:"mo18", n:18, title:"Il Drago Antico",          type:"kills_name",  target:1,   enemy:"Drago Antico della Vetta",desc:"Sconfiggi il Drago Antico della Vetta"},
    {id:"mo19", n:19, title:"Veterano delle Vette",     type:"kills_area",  target:15,  desc:"Sconfiggi 15 nemici nelle Montagne"},
    {id:"mo20", n:20, title:"Il Padre Cade",            type:"kills_name",  target:1,   enemy:"Padre dei Giganti",     desc:"Sconfiggi il Padre dei Giganti", sblocca:"deserto"},
  ],

  deserto: [
    {id:"d01", n:1,  title:"Bruciati dalla Sabbia",    type:"kills_area",  target:2,   desc:"Sconfiggi 2 nemici nel Deserto delle Ossa"},
    {id:"d02", n:2,  title:"Veleno nel Sangue",        type:"kills_name",  target:3,   enemy:"Scorpione del Deserto", desc:"Uccidi 3 Scorpioni del Deserto"},
    {id:"d03", n:3,  title:"Mummie sul Cammino",       type:"kills_name",  target:3,   enemy:"Guerriero Mummia",      desc:"Sconfiggi 3 Guerrieri Mummia"},
    {id:"d04", n:4,  title:"Oro della Sabbia",         type:"loot_area",   target:3,   desc:"Ottieni 3 oggetti dal Deserto"},
    {id:"d05", n:5,  title:"Perso nel Deserto",        type:"loot_area",  target:3,   desc:"Trova 3 tesori nel Deserto"},
    {id:"d06", n:6,  title:"Il Djinn del Deserto",     type:"kills_name",  target:2,   enemy:"Genio del Deserto",     desc:"Sconfiggi 2 Geni del Deserto"},
    {id:"d07", n:7,  title:"Tempeste di Sabbia",       type:"kills_name",  target:3,   enemy:"Elementale di Sabbia",  desc:"Sconfiggi 3 Elementali di Sabbia"},
    {id:"d08", n:8,  title:"Oro del Faraone",          type:"denari_area", target:1500,desc:'Accumula 1500 <span class="mk-coin"></span> da bottini del Deserto'},
    {id:"d09", n:9,  title:"La Sfinge",                type:"kills_name",  target:1,   enemy:"Sfinge",                desc:"Sconfiggi la Sfinge"},
    {id:"d10", n:10, title:"Sopravvissuto del Deserto",type:"kills_area",  target:8,   desc:"Sconfiggi 8 nemici nel Deserto"},
    {id:"d11", n:11, title:"Guardiani della Cripta",   type:"kills_name",  target:2,   enemy:"Guardiano della Cripta",desc:"Sconfiggi 2 Guardiani della Cripta"},
    {id:"d12", n:12, title:"Amuleto Sacro",            type:"loot_area",   target:5,   desc:"Ottieni 5 oggetti dal Deserto"},
    {id:"d13", n:13, title:"La Manticora",             type:"kills_name",  target:1,   enemy:"Manticora",             desc:"Sconfiggi la Manticora"},
    {id:"d14", n:14, title:"Esploratore delle Dune",   type:"loot_area",  target:6,  desc:"Trova 6 tesori nel Deserto"},
    {id:"d15", n:15, title:"Il Drago della Tempesta",  type:"kills_name",  target:1,   enemy:"Drago della Tempesta",  desc:"Sconfiggi il Drago della Tempesta"},
    {id:"d16", n:16, title:"Tesori Eterni",            type:"denari_area", target:5000,desc:'Accumula 5000 <span class="mk-coin"></span> da bottini del Deserto'},
    {id:"d17", n:17, title:"Il Genio del Fuoco",       type:"kills_name",  target:1,   enemy:"Genio del Fuoco",       desc:"Sconfiggi il Genio del Fuoco"},
    {id:"d18", n:18, title:"Il Custode della Piramide",type:"kills_name",  target:1,   enemy:"Custode della Piramide",desc:"Sconfiggi il Custode della Piramide"},
    {id:"d19", n:19, title:"Veterano del Deserto",     type:"kills_area",  target:15,  desc:"Sconfiggi 15 nemici nel Deserto"},
    {id:"d20", n:20, title:"Il Re Eterno",             type:"kills_name",  target:1,   enemy:"Faraone Non-Morto",     desc:"Sconfiggi il Faraone Non-Morto", sblocca:"oltretomba"},
  ],

  oltretomba: [
    {id:"o01", n:1,  title:"Oltre la Soglia",          type:"kills_area",  target:2,   desc:"Sconfiggi 2 nemici nell'Oltretomba"},
    {id:"o02", n:2,  title:"Anime Perdute",            type:"kills_name",  target:5,   enemy:"Anima Perduta",         desc:"Sconfiggi 5 Anime Perdute"},
    {id:"o03", n:3,  title:"Guardie dei Morti",        type:"kills_name",  target:3,   enemy:"Guardia dei Morti",     desc:"Sconfiggi 3 Guardie dei Morti"},
    {id:"o04", n:4,  title:"Monete di Caronte",        type:"loot_area",   target:5,   desc:"Ottieni 5 oggetti dall'Oltretomba"},
    {id:"o05", n:5,  title:"Discesa nell'Abisso",      type:"loot_area",  target:3,   desc:"Trova 3 tesori nell'Oltretomba"},
    {id:"o06", n:6,  title:"Il Drago Non-Morto",       type:"kills_name",  target:1,   enemy:"Drago Non-Morto",       desc:"Sconfiggi il Drago Non-Morto"},
    {id:"o07", n:7,  title:"Demoni nell'Oscurità",     type:"kills_name",  target:3,   enemy:"Demone Minore",         desc:"Sconfiggi 3 Demoni Minori"},
    {id:"o08", n:8,  title:"Oro dell'Aldilà",          type:"denari_area", target:3000,desc:'Accumula 3000 <span class="mk-coin"></span> da bottini dell\'Oltretomba'},
    {id:"o09", n:9,  title:"Il Cavaliere Senza Testa", type:"kills_name",  target:1,   enemy:"Cavaliere Senza Testa", desc:"Sconfiggi il Cavaliere Senza Testa"},
    {id:"o10", n:10, title:"Non si Muore qui",         type:"kills_area",  target:8,   desc:"Sconfiggi 8 nemici nell'Oltretomba"},
    {id:"o11", n:11, title:"Il Gran Lich",             type:"kills_name",  target:1,   enemy:"Maestro Lich",             desc:"Sconfiggi il Maestro Lich"},
    {id:"o12", n:12, title:"Reliquie Infernali",       type:"loot_area",   target:5,   desc:"Ottieni 5 oggetti dall'Oltretomba"},
    {id:"o13", n:13, title:"Il Principe Demone",       type:"kills_name",  target:1,   enemy:"Principe Demone",       desc:"Sconfiggi il Principe Demone"},
    {id:"o14", n:14, title:"Signore dell'Aldilà",      type:"loot_area",  target:6,  desc:"Trova 6 tesori nell'Oltretomba"},
    {id:"o15", n:15, title:"Il Signore dei Diavoli",    type:"kills_name",  target:1,   enemy:"Signore dei Diavoli",    desc:"Sconfiggi il Signore dei Diavoli"},
    {id:"o16", n:16, title:"Tesori dell'Eternità",     type:"denari_area", target:10000,desc:'Accumula 10000 <span class="mk-coin"></span> da bottini dell\'Oltretomba'},
    {id:"o17", n:17, title:"Il Mietitore",           type:"kills_name",  target:1,   enemy:"Incarnazione della Morte",desc:"Sconfiggi l'Incarnazione della Morte"},
    {id:"o18", n:18, title:"Il Colosso delle Anime",   type:"kills_name",  target:1,   enemy:"Colosso delle Anime",   desc:"Sconfiggi il Colosso delle Anime"},
    {id:"o19", n:19, title:"Eterno Guerriero",         type:"kills_area",  target:15,  desc:"Sconfiggi 15 nemici nell'Oltretomba"},
    {id:"o20", n:20, title:"Il Divoratore",            type:"kills_name",  target:1,   enemy:"Il Divoratore",         desc:"Sconfiggi Il Divoratore", sblocca:"empireo"},
  ],

  empireo: [
    // 10 uccisioni singole (una per dio)
    {id:"emp01", n:1,  title:"La Caduta di Valeska",  type:"kills_god",  target:1, godId:"e181", desc:"Uccidi Valeska", trophy:true},
    {id:"emp02", n:2,  title:"La Caduta di Thalmos",  type:"kills_god",  target:1, godId:"e182", desc:"Uccidi Thalmos", trophy:true},
    {id:"emp03", n:3,  title:"La Caduta di Sylvaris", type:"kills_god",  target:1, godId:"e183", desc:"Uccidi Sylvaris", trophy:true},
    {id:"emp04", n:4,  title:"La Caduta di Ignaroth", type:"kills_god",  target:1, godId:"e184", desc:"Uccidi Ignaroth", trophy:true},
    {id:"emp05", n:5,  title:"La Caduta di Abyssor",  type:"kills_god",  target:1, godId:"e185", desc:"Uccidi Abyssor", trophy:true},
    {id:"emp06", n:6,  title:"La Caduta di Lunarys",  type:"kills_god",  target:1, godId:"e186", desc:"Uccidi Lunarys", trophy:true},
    {id:"emp07", n:7,  title:"La Caduta di Solarius", type:"kills_god",  target:1, godId:"e187", desc:"Uccidi Solarius", trophy:true},
    {id:"emp08", n:8,  title:"La Caduta di Varos",    type:"kills_god",  target:1, godId:"e188", desc:"Uccidi Varos", trophy:true},
    {id:"emp09", n:9,  title:"La Caduta di Morvath",  type:"kills_god",  target:1, godId:"e189", desc:"Uccidi Morvath", trophy:true},
    {id:"emp10", n:10, title:"La Caduta di Kaelos",   type:"kills_god",  target:1, godId:"e190", desc:"Uccidi Kaelos", trophy:true},
    // missione finale
    {id:"emp11", n:11, title:"L'Empireo è Caduto",    type:"kills_all_gods", target:10, desc:"Uccidi tutte e 10 le divinità dell'Empireo — missione finale di KAIZEN", trophy:true, final:true},
    // 10 raccolte divine
    {id:"emp12", n:12, title:"Il Dono di Valeska",   type:"loot_god", target:1, godId:"e181", lootId:"gl01", desc:"Ottieni le Lacrime di Valeska"},
    {id:"emp13", n:13, title:"Il Dono di Thalmos",   type:"loot_god", target:1, godId:"e182", lootId:"gl02", desc:"Ottieni il Frammento della Mente di Thalmos"},
    {id:"emp14", n:14, title:"Il Dono di Sylvaris",  type:"loot_god", target:1, godId:"e183", lootId:"gl03", desc:"Ottieni la Freccia di Sylvaris"},
    {id:"emp15", n:15, title:"Il Dono di Ignaroth",  type:"loot_god", target:1, godId:"e184", lootId:"gl04", desc:"Ottieni la Cenere di Ignaroth"},
    {id:"emp16", n:16, title:"Il Dono di Abyssor",   type:"loot_god", target:1, godId:"e185", lootId:"gl05", desc:"Ottieni la Goccia dell'Abisso"},
    {id:"emp17", n:17, title:"Il Dono di Lunarys",   type:"loot_god", target:1, godId:"e186", lootId:"gl06", desc:"Ottieni la Scheggia di Luna"},
    {id:"emp18", n:18, title:"Il Dono di Solarius",  type:"loot_god", target:1, godId:"e187", lootId:"gl07", desc:"Ottieni il Raggio Solidificato"},
    {id:"emp19", n:19, title:"Il Dono di Varos",     type:"loot_god", target:1, godId:"e188", lootId:"gl08", desc:"Ottieni la Lama Spezzata di Varos"},
    {id:"emp20", n:20, title:"Il Dono di Morvath",   type:"loot_god", target:1, godId:"e189", lootId:"gl09", desc:"Ottieni il Velo di Morvath"},
    {id:"emp21", n:21, title:"Il Dono di Kaelos",    type:"loot_god", target:1, godId:"e190", lootId:"gl10", desc:"Ottieni la Clessidra di Kaelos"},
  ],
};

/* ══════════════════════════════════════════════════════════
   MATERIALI — Risorse collezionabili per zona (no emoji)
   Utilizzabili per potenziamenti al mercato o vendibili
══════════════════════════════════════════════════════════ */
export const MATERIALS = [
  // Foresta Crepuscolare
  { id: "mat_legno",     name: "Legno",     areaId: "foresta",    rarity: 1, value: 10, desc: "Legname stagionato ricavato dagli alberi secolari." ,img:"img/treasures/mat_legno.png"},
  { id: "mat_ambra",     name: "Ambra",     areaId: "foresta",    rarity: 2, value: 25, desc: "Resina fossile lucente con riflessi dorati." ,img:"img/treasures/mat_ambra.png"},

  // Miniere Sepolte
  { id: "mat_carbone",   name: "Carbone",   areaId: "miniere",    rarity: 2, value: 20, desc: "Minerale combustibile estratto dal cuore della terra." ,img:"img/treasures/mat_carbone.png"},
  { id: "mat_rame",      name: "Rame",      areaId: "miniere",    rarity: 3, value: 45, desc: "Metallo malleabile, eccellente per le prime leghe." ,img:"img/treasures/mat_rame.png"},

  // Isole dei Naufraghi
  { id: "mat_bronzo",    name: "Bronzo",    areaId: "isole",      rarity: 3, value: 40, desc: "Lega solida e resistente alla salsedine marina." ,img:"img/treasures/mat_bronzo.png"},
  { id: "mat_ferro",     name: "Ferro",     areaId: "isole",      rarity: 4, value: 80, desc: "Metallo temprato, base per forgiare lame resistenti." ,img:"img/treasures/mat_ferro.png"},

  // Montagne Silenti
  { id: "mat_granito",   name: "Granito",   areaId: "montagne",   rarity: 4, value: 75, desc: "Roccia vulcanica durissima delle vette più impervie." ,img:"img/treasures/mat_granito.png"},
  { id: "mat_argento",   name: "Argento",   areaId: "montagne",   rarity: 5, value: 140, desc: "Metallo prezioso lucente dalle forti affinità arcane." ,img:"img/treasures/mat_argento.png"},

  // Deserto delle Ossa
  { id: "mat_oro",       name: "Oro",       areaId: "deserto",    rarity: 5, value: 130, desc: "Pepita d'oro puro nascosta tra le dune di sabbia." ,img:"img/treasures/mat_oro.png"},
  { id: "mat_topazio",   name: "Topazio",   areaId: "deserto",    rarity: 6, value: 220, desc: "Gemma solare brillante con bagliori incandescenti." ,img:"img/treasures/mat_topazio.png"},

  // Oltretomba
  { id: "mat_ossidiana", name: "Ossidiana", areaId: "oltretomba", rarity: 6, value: 210, desc: "Vetro vulcanico nerissimo con profili affilati a rasoio." ,img:"img/treasures/mat_ossidiana.png"},
  { id: "mat_rubino",    name: "Rubino",    areaId: "oltretomba", rarity: 7, value: 350, desc: "Pietra preziosa cremisi intrisa del calore dell'abisso." ,img:"img/treasures/mat_rubino.png"},

  // Empireo
  { id: "mat_platino",   name: "Platino",   areaId: "empireo",    rarity: 7, value: 320, desc: "Metallo incorruttibile e tenace, degno degli dei." ,img:"img/treasures/mat_platino.png"},
  { id: "mat_diamante",  name: "Diamante",  areaId: "empireo",    rarity: 8, value: 500, desc: "Il minerale più puro e resistente del firmamento." ,img:"img/treasures/mat_diamante.png"},
];

/* ══════════════════════════════════════════════════════════
   CONFIGURAZIONE RIVESTIMENTI FABBRO (per materiale)
   Definisce requisiti, bonus per slot e formule di costo
══════════════════════════════════════════════════════════ */
export const MATERIAL_COATING_CONFIG = {
  mat_legno: {
    reqQty: 5,
    durabilityRes: 0.25, // -25% usura
    arma:     { attacco: 1 },
    armatura: { difesa: 1, velocita: 1 },
  },
  mat_ambra: {
    reqQty: 5,
    durabilityRes: 0.35, // -35% usura
    arma:     { attacco: 2, velocita: 1 },
    armatura: { difesa: 2, velocita: 1 },
  },
  mat_carbone: {
    reqQty: 5,
    durabilityRes: 0.35, // -35% usura
    arma:     { attacco: 2, critico: 1 },
    armatura: { difesa: 2, critico: 1 },
  },
  mat_rame: {
    reqQty: 4,
    durabilityRes: 0.45, // -45% usura
    arma:     { attacco: 3, difesa: 1 },
    armatura: { difesa: 3, attacco: 1 },
  },
  mat_bronzo: {
    reqQty: 4,
    durabilityRes: 0.45, // -45% usura
    arma:     { attacco: 3, velocita: 2 },
    armatura: { difesa: 3, velocita: 2 },
  },
  mat_ferro: {
    reqQty: 4,
    durabilityRes: 0.55, // -55% usura
    arma:     { attacco: 5, critico: 1 },
    armatura: { difesa: 5, attacco: 1 },
  },
  mat_granito: {
    reqQty: 4,
    durabilityRes: 0.55, // -55% usura
    arma:     { attacco: 4, difesa: 3 },
    armatura: { difesa: 6 },
  },
  mat_argento: {
    reqQty: 3,
    durabilityRes: 0.65, // -65% usura
    arma:     { attacco: 6, velocita: 3, critico: 1 },
    armatura: { difesa: 6, velocita: 3, critico: 1 },
  },
  mat_oro: {
    reqQty: 3,
    durabilityRes: 0.65, // -65% usura
    arma:     { attacco: 7, critico: 3 },
    armatura: { difesa: 7, velocita: 2, critico: 2 },
  },
  mat_topazio: {
    reqQty: 3,
    durabilityRes: 0.75, // -75% usura
    arma:     { attacco: 8, critico: 4 },
    armatura: { difesa: 8, velocita: 3, critico: 2 },
  },
  mat_ossidiana: {
    reqQty: 3,
    durabilityRes: 0.75, // -75% usura
    arma:     { attacco: 10, critico: 3 },
    armatura: { difesa: 9, attacco: 3 },
  },
  mat_rubino: {
    reqQty: 2,
    durabilityRes: 0.85, // -85% usura
    arma:     { attacco: 12, critico: 5 },
    armatura: { difesa: 11, critico: 4, attacco: 2 },
  },
  mat_platino: {
    reqQty: 2,
    durabilityRes: 0.85, // -85% usura
    arma:     { attacco: 14, difesa: 4, velocita: 2 },
    armatura: { difesa: 13, attacco: 4, velocita: 2 },
  },
  mat_diamante: {
    reqQty: 2,
    durabilityRes: 0.90, // -90% usura
    arma:     { attacco: 18, critico: 6, velocita: 3 },
    armatura: { difesa: 16, attacco: 5, critico: 4 },
  },
};

export function getCoatingBonus(matId, slot, piece = null) {
  const cfg = MATERIAL_COATING_CONFIG[matId];
  if (!cfg) return null;
  const isWeapon = slot === "mano_dx" || slot === "arma" || piece?.handType === "1h" || piece?.handType === "2h"; return isWeapon ? cfg.arma : cfg.armatura;
}

export function getCoatingWearReduction(matId) {
  const cfg = MATERIAL_COATING_CONFIG[matId];
  return cfg?.durabilityRes || 0;
}

export function calculateCoatingCost(piece, mat) {
  const cfg = MATERIAL_COATING_CONFIG[mat.id] || { reqQty: 4 };
  const baseCost = Math.round((piece?.prezzo || 50) * 0.15 + (mat?.value || 10) * cfg.reqQty * 0.20);
  return Math.max(10, baseCost);
}



export function getTreasureDef(id) {
  const t = TREASURES.find(x => x.id === id);
  if (t) return { ...t, rarity: t.tier || 1 };
  for (const pool of Object.values(AREA_LOOT_POOL)) {
    const m = pool.find(x => x.id === id);
    if (m) return { ...m, rarity: m.rarity || 1 };
  }
  return null;
}
