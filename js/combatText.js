/* ============================================================
 combatText.js — Narratore del log di combattimento
 Frasi personalizzate per tipologia di nemico (archetipo) e per
 l'equipaggiamento di eroe e nemico: attacco, schivata, critico,
 parata, vittoria e sconfitta. Varianti per stile di combattimento
 (due armi, arma + scudo, arma a due mani, arma singola, mani nude).
 Segnaposto: {E}=nemico  {W}=arma  {O}=arma secondaria  {S}=scudo
 ============================================================ */

/* ── Archetipi: rilevati da tag + parole chiave nel nome ── */
const ARCHETYPES = {
  divinita: {
    atk:   ["{E} solleva una mano e una forza invisibile ti schiaccia.",
            "{E} pronuncia una parola antica e il cielo ti colpisce.",
            "Un raggio di luce accecante scaturisce da {E}."],
    crit:  ["{E} scatena l'ira degli dèi: un'esplosione di luce ti travolge!",
            "Lo sguardo di {E} ti trafigge l'anima!"],
    hurt:  ["La tua arma incrina l'aura divina di {E}.",
            "Per la prima volta {E} sanguina icore dorato."],
    dodge: ["{E} svanisce in un bagliore e ricompare alle tue spalle: il colpo va a vuoto!",
            "Il tuo attacco si infrange contro una barriera eterea attorno a {E}!"],
    whiff: ["Ti getti a terra mentre il fulmine di {E} incenerisce il suolo dove eri!",
            "Il colpo di {E} squarcia l'aria a un palmo dal tuo volto: lo eviti!"],
    win:   ["{E} si dissolve in polvere di stelle: hai abbattuto un dio!",
            "Il corpo divino di {E} si sgretola. Il cielo tace per un istante."],
    lose:  ["{E} ti osserva con indifferenza mentre crolli: i mortali non sfidano gli dèi.",
            "Una luce bianca ti avvolge. {E} ha emesso il suo giudizio."],
  },
  drago: {
    atk:   ["{E} ti investe con una vampata di fuoco.",
            "{E} ti sferza con la coda irta di scaglie.",
            "Gli artigli di {E} ti ghermiscono."],
    crit:  ["{E} spalanca le fauci e ti avvolge nel suo soffio!",
            "{E} ti afferra tra le zanne e ti scaglia lontano!"],
    hurt:  ["Trovi una scaglia scheggiata sul petto di {E}.",
            "Colpisci l'ala membranosa di {E}, che ruggisce di dolore."],
    dodge: ["{E} si solleva con un battito d'ali e il tuo colpo fende il vuoto!",
            "La tua arma rimbalza sulle scaglie impenetrabili di {E}!"],
    whiff: ["Ti ripari dietro una roccia mentre le fiamme di {E} la lambiscono!",
            "Rotoli sotto la coda di {E} appena prima che ti colpisca!"],
    win:   ["{E} crolla con un ultimo ruggito che fa tremare la terra!",
            "Le fiamme negli occhi di {E} si spengono per sempre."],
    lose:  ["Il fuoco di {E} ti avvolge: l'ultima cosa che vedi sono le sue fauci.",
            "{E} ti schiaccia sotto il suo peso colossale."],
  },
  spirito: {
    atk:   ["{E} ti attraversa con un gelo spettrale.",
            "Un lamento straziante di {E} ti perfora la mente.",
            "Le dita evanescenti di {E} ti stringono il cuore."],
    crit:  ["{E} ti strappa un frammento d'anima!",
            "{E} urla nel tuo orecchio e la vista ti si annebbia!"],
    hurt:  ["La tua arma lacera la forma eterea di {E}.",
            "{E} vacilla e si dissolve per un istante."],
    dodge: ["Il tuo colpo attraversa {E} come fosse nebbia!",
            "{E} svanisce nell'aria e ricompare poco più in là!"],
    whiff: ["Senti il gelo di {E} sfiorarti la nuca, ma ti scosti in tempo!",
            "Chiudi la mente al lamento di {E} e ne resisti l'assalto!"],
    win:   ["{E} si dissolve con un ultimo sospiro, finalmente in pace.",
            "La forma di {E} si frantuma in mille scintille pallide."],
    lose:  ["Il gelo di {E} ti penetra nelle ossa: la vista si spegne.",
            "{E} ti trascina con sé nelle nebbie dell'aldilà."],
  },
  demone: {
    atk:   ["{E} ti ustiona con artigli incandescenti.",
            "{E} ti frusta con una catena di fiamme infernali.",
            "{E} ti carica a testa bassa con le corna."],
    crit:  ["{E} ti marchia con un sigillo infernale!",
            "{E} ride mentre ti squarcia con artigli di brace!"],
    hurt:  ["Sangue nero sgorga dalla ferita di {E}.",
            "{E} urla una bestemmia mentre lo colpisci."],
    dodge: ["{E} si avvolge di fumo sulfureo e il tuo colpo va a vuoto!",
            "{E} devia il tuo attacco con un artiglio, sghignazzando!"],
    whiff: ["Le fiamme di {E} ti lambiscono, ma balzi fuori dalla loro portata!",
            "Schivi la catena rovente di {E}, che si abbatte sul terreno!"],
    win:   ["{E} sprofonda in una voragine di zolfo da cui era emerso!",
            "{E} si consuma in fiamme nere, maledicendo il tuo nome."],
    lose:  ["{E} ti trascina verso l'abisso, ridendo.",
            "Le fiamme infernali di {E} hanno la meglio su di te."],
  },
  nonmorto: {
    atk:   ["{E} ti afferra con dita scheletriche.",
            "{E} ti colpisce con una forza che nessun vivo possiede.",
            "Un tocco putrido di {E} ti fa avvizzire la carne."],
    crit:  ["{E} ti morde con denti marci: senti la vita defluire!",
            "{E} ti colpisce con un'energia necrotica!"],
    hurt:  ["Ossa scricchiolano sotto il tuo colpo a {E}.",
            "Bende e polvere volano via da {E}."],
    dodge: ["{E} si piega in modo innaturale e il tuo colpo va a vuoto!",
            "Il tuo attacco si perde tra le vesti lacere di {E}!"],
    whiff: ["Ti scosti dalla presa gelida di {E} appena in tempo!",
            "{E} barcolla in avanti e lo eviti con facilità!"],
    win:   ["{E} si accascia, tornando finalmente al riposo eterno.",
            "Le ossa di {E} si sparpagliano al suolo e la luce nei suoi occhi si spegne."],
    lose:  ["{E} ti sovrasta: presto ti unirai alle sue schiere.",
            "La presa di {E} si chiude su di te e tutto diventa freddo."],
  },
  lich: {
    atk:   ["{E} scaglia un dardo d'ombra.",
            "{E} sussurra una formula proibita e la tua carne si raggrinzisce.",
            "Un teschio fiammeggiante evocato da {E} ti colpisce."],
    crit:  ["{E} ti prosciuga l'energia vitale con un incantesimo!",
            "Un vortice necromantico di {E} ti avvolge!"],
    hurt:  ["Spezzi la barriera arcana di {E} e lo colpisci.",
            "Il filatterio di {E} tremola sotto il tuo colpo."],
    dodge: ["{E} si teletrasporta in un turbine d'ombra!",
            "Uno scudo di ossa evocato da {E} assorbe il tuo colpo!"],
    whiff: ["Il dardo d'ombra di {E} ti sfiora e si dissolve sul muro!",
            "Interrompi la formula di {E} prima che si compia!"],
    win:   ["{E} si sgretola mentre il suo filatterio va in frantumi!",
            "L'ultimo incantesimo di {E} muore sulle sue labbra secche."],
    lose:  ["{E} intona una nenia funebre mentre crolli.",
            "La magia nera di {E} ti consuma completamente."],
  },
  golem: {
    atk:   ["{E} abbatte un pugno di pietra su di te.",
            "{E} ti travolge con il suo peso immenso.",
            "Il braccio massiccio di {E} ti scaraventa via."],
    crit:  ["{E} ti schiaccia sotto un colpo che spacca il terreno!",
            "Le rune di {E} si illuminano e il suo pugno esplode su di te!"],
    hurt:  ["Schegge di pietra volano dal corpo di {E}.",
            "Una crepa si apre sul torso di {E}."],
    dodge: ["La tua arma rimbalza sulla superficie durissima di {E}!",
            "Colpisci {E}, ma non ne scalfisci nemmeno la superficie!"],
    whiff: ["Il pugno lento di {E} si schianta dove eri un attimo prima!",
            "Scivoli sotto il braccio di {E} che fende l'aria pesantemente!"],
    win:   ["{E} si sgretola in un cumulo di macerie!",
            "Le rune di {E} si spengono e il colosso crolla con un boato."],
    lose:  ["{E} ti schiaccia senza alcuna emozione.",
            "Il peso di {E} ti inchioda al suolo."],
  },
  elementale: {
    atk:   ["{E} ti investe con la furia degli elementi.",
            "Un turbine scatenato da {E} ti avvolge.",
            "{E} si scaglia contro di te come una frana."],
    crit:  ["{E} esplode in un'ondata elementale!",
            "Il nucleo di {E} pulsa e ti colpisce con violenza primordiale!"],
    hurt:  ["Disperdi parte della materia di {E}.",
            "Il nucleo di {E} vacilla sotto il tuo colpo."],
    dodge: ["Il corpo di {E} si apre e il colpo lo attraversa senza danno!",
            "{E} si scompone e ricompone altrove!"],
    whiff: ["Ti ripari dall'ondata di {E} che si infrange accanto a te!",
            "Salti oltre il vortice di {E}!"],
    win:   ["{E} si disperde nell'aria, tornando all'elemento da cui è nato.",
            "Il nucleo di {E} si spegne e la sua forma collassa."],
    lose:  ["La furia di {E} ti sommerge completamente.",
            "{E} ti inghiotte nel suo turbine elementale."],
  },
  gigante: {
    atk:   ["{E} ti calpesta con un piede enorme.",
            "{E} ti spazza via con un manrovescio.",
            "{E} scaglia un macigno contro di te."],
    crit:  ["{E} ti afferra e ti sbatte a terra!",
            "Il pugno di {E} ti centra in pieno petto!"],
    hurt:  ["Colpisci {E} al ginocchio e lo fai barcollare.",
            "Ti arrampichi sul braccio di {E} e affondi il colpo."],
    dodge: ["{E} solleva il braccio e para il tuo colpo come fosse niente!",
            "Il tuo colpo si infrange sulla pelle spessa di {E}!"],
    whiff: ["Corri tra le gambe di {E} mentre il suo pugno affonda nel terreno!",
            "Il macigno di {E} si schianta alle tue spalle!"],
    win:   ["{E} cade come un albero abbattuto, facendo tremare la terra!",
            "Con un gemito profondo, {E} crolla e non si rialza."],
    lose:  ["{E} ti solleva come un giocattolo e ti getta via.",
            "L'ombra di {E} ti copre mentre perdi i sensi."],
  },
  ragno: {
    atk:   ["{E} ti morde con cheliceri velenosi.",
            "{E} ti punge con il pungiglione.",
            "{E} scatta dalle ombre e ti ferisce."],
    crit:  ["Il veleno di {E} ti brucia nelle vene!",
            "{E} ti immobilizza e affonda le fauci!"],
    hurt:  ["Tranci una zampa di {E}.",
            "Il carapace di {E} si incrina."],
    dodge: ["{E} si ritrae fulmineo sulle sue zampe!",
            "Il tuo colpo scivola sul carapace lucido di {E}!"],
    whiff: ["Ti divincoli dalla ragnatela di {E} appena in tempo!",
            "Schivi il pungiglione di {E} che si conficca nel terreno!"],
    win:   ["{E} si rovescia, le zampe che si contraggono un'ultima volta.",
            "Il carapace di {E} si spacca e la creatura giace immobile."],
    lose:  ["Il veleno di {E} ti paralizza: non riesci più a muoverti.",
            "{E} ti avvolge nella sua tela mentre perdi i sensi."],
  },
  serpente: {
    atk:   ["{E} scatta e ti morde.",
            "Le spire di {E} ti stringono.",
            "{E} ti sputa addosso un veleno acido."],
    crit:  ["{E} ti avvolge nelle sue spire e stringe!",
            "Le zanne di {E} affondano in profondità!"],
    hurt:  ["Colpisci {E} sotto la testa.",
            "Le squame di {E} si lacerano."],
    dodge: ["{E} si contorce e il tuo colpo va a vuoto!",
            "{E} si ritrae sibilando!"],
    whiff: ["Ti scosti dal morso fulmineo di {E}!",
            "Sfuggi alle spire di {E} prima che si chiudano!"],
    win:   ["{E} si contorce un'ultima volta e giace immobile.",
            "Il sibilo di {E} si spegne per sempre."],
    lose:  ["Il veleno di {E} ti offusca la vista.",
            "Le spire di {E} ti tolgono l'ultimo respiro."],
  },
  marino: {
    atk:   ["{E} ti colpisce con un'ondata di forza.",
            "I tentacoli di {E} ti sferzano.",
            "{E} emerge dai flutti e ti azzanna."],
    crit:  ["{E} ti trascina sott'acqua per un attimo interminabile!",
            "{E} ti stritola con forza abissale!"],
    hurt:  ["Tranci un tentacolo di {E}.",
            "Colpisci {E} tra le scaglie bagnate."],
    dodge: ["{E} si immerge e il tuo colpo affonda nell'acqua!",
            "Il tuo colpo scivola sul corpo viscido di {E}!"],
    whiff: ["Salti all'indietro mentre {E} sferza l'acqua!",
            "Sfuggi alla presa di {E} prima che ti trascini a fondo!"],
    win:   ["{E} affonda negli abissi da cui era venuto.",
            "Il corpo di {E} galleggia immobile tra le onde."],
    lose:  ["{E} ti trascina negli abissi.",
            "L'acqua ti riempie i polmoni mentre {E} ti stringe."],
  },
  volatile: {
    atk:   ["{E} piomba dall'alto e ti artiglia.",
            "{E} ti colpisce con il becco affilato.",
            "Le ali di {E} ti sferzano il viso."],
    crit:  ["{E} ti ghermisce in picchiata e ti lascia cadere!",
            "{E} ti squarcia con gli artigli in volo radente!"],
    hurt:  ["Colpisci un'ala di {E}, piume ovunque.",
            "Intercetti {E} in volo."],
    dodge: ["{E} si alza in volo e il tuo colpo fende l'aria!",
            "{E} vira bruscamente all'ultimo istante!"],
    whiff: ["Ti abbassi mentre {E} sfreccia sopra la tua testa!",
            "Ti getti di lato e la picchiata di {E} va a vuoto!"],
    win:   ["{E} precipita al suolo in un turbine di piume!",
            "Con un ultimo stridio, {E} cade e non si rialza."],
    lose:  ["{E} volteggia su di te mentre perdi i sensi.",
            "Gli artigli di {E} sono l'ultima cosa che senti."],
  },
  lupo: {
    atk:   ["{E} ti azzanna con ferocia.",
            "{E} ti lacera con gli artigli.",
            "{E} ti salta addosso ringhiando."],
    crit:  ["Le fauci di {E} si serrano sulla tua gamba!",
            "{E} ti punta alla gola con un balzo feroce!"],
    hurt:  ["{E} guaisce sotto il tuo colpo.",
            "Colpisci {E} sul fianco."],
    dodge: ["{E} balza di lato con agilità felina!",
            "{E} indietreggia ringhiando e il colpo va a vuoto!"],
    whiff: ["Le fauci di {E} si chiudono sul vuoto a un soffio da te!",
            "Respingi il balzo di {E} con una spallata!"],
    win:   ["{E} guaisce un'ultima volta e si accascia.",
            "Il branco ha perso {E}: l'ululato tace."],
    lose:  ["{E} ulula alla luna sopra il tuo corpo.",
            "Le fauci di {E} si chiudono e tutto diventa buio."],
  },
  goblin: {
    atk:   ["{E} ti colpisce con un attacco scorretto.",
            "{E} ti salta addosso urlando.",
            "{E} ti tira un calcio negli stinchi e colpisce."],
    crit:  ["{E} ti pugnala alle spalle sghignazzando!",
            "{E} ti lancia sabbia negli occhi e colpisce!"],
    hurt:  ["{E} strilla di dolore.",
            "Colpisci {E} sulla testa verdastra."],
    dodge: ["{E} si rotola via ridacchiando!",
            "{E} sguscia tra le tue gambe con un ghigno!"],
    whiff: ["Il goffo assalto di {E} va a vuoto!",
            "{E} inciampa e manca il bersaglio!"],
    win:   ["{E} crolla a terra con un ultimo strillo.",
            "{E} non ruberà più nulla a nessuno."],
    lose:  ["{E} esulta e comincia a frugarti nelle tasche.",
            "{E} ti finisce con un colpo meschino."],
  },
  bandito: {
    atk:   ["{E} ti assale con un colpo di taglio.",
            "{E} ti colpisce con una mossa da tagliagole.",
            "{E} finta a destra e ti colpisce a sinistra."],
    crit:  ["{E} ti colpisce con un trucco sporco!",
            "{E} trova un varco nella tua guardia!"],
    hurt:  ["{E} impreca sotto il tuo colpo.",
            "Colpisci {E}, che arretra sputando sangue."],
    dodge: ["{E} para il colpo con mestiere!",
            "{E} schiva con l'agilità di chi vive di risse!"],
    whiff: ["Prevedi la finta di {E} e lo eviti!",
            "Blocchi il polso di {E} prima che colpisca!"],
    win:   ["{E} cade a terra: la sua carriera di predone finisce qui.",
            "{E} lascia cadere l'arma e crolla nella polvere."],
    lose:  ["{E} ti deruba mentre giaci a terra.",
            "{E} ride e scompare con il tuo bottino."],
  },
  mago: {
    atk:   ["{E} scaglia un dardo arcano.",
            "{E} pronuncia una maledizione e senti un dolore lancinante.",
            "Una sfera di energia evocata da {E} ti colpisce."],
    crit:  ["{E} completa un rituale e un'esplosione magica ti travolge!",
            "Il sortilegio di {E} ti brucia dall'interno!"],
    hurt:  ["Interrompi l'incantesimo di {E} con un colpo.",
            "{E} perde la concentrazione sotto il tuo attacco."],
    dodge: ["{E} si avvolge in uno scudo magico!",
            "{E} svanisce in uno sbuffo di fumo!"],
    whiff: ["Il sortilegio di {E} si infrange contro la tua volontà!",
            "Schivi la sfera arcana di {E}, che esplode lontano!"],
    win:   ["{E} crolla, il suo potere si dissolve nell'aria.",
            "Il bastone di {E} cade a terra, le sue rune si spengono."],
    lose:  ["Il sortilegio di {E} ti avvolge in un sonno senza fine.",
            "{E} sussurra l'ultima formula e cadi."],
  },
  umano: {
    atk:   ["{E} ti colpisce con un attacco deciso.",
            "{E} fende la tua guardia e ti colpisce.",
            "{E} carica con un grido di battaglia."],
    crit:  ["{E} ti sorprende su un punto scoperto!",
            "{E} sfonda la tua guardia con un colpo feroce!"],
    hurt:  ["{E} vacilla sotto il tuo colpo.",
            "Superi la guardia di {E}."],
    dodge: ["{E} para il colpo con abilità!",
            "{E} scarta di lato e il colpo va a vuoto!"],
    whiff: ["Pari l'attacco di {E} all'ultimo istante!",
            "Leggi la mossa di {E} e la eviti!"],
    win:   ["{E} cade in ginocchio e si arrende al destino.",
            "{E} crolla a terra dopo un duello onorevole."],
    lose:  ["{E} ti guarda cadere senza pietà.",
            "{E} abbassa l'arma: il duello è finito."],
  },
  bestia: {
    atk:   ["{E} si scaglia su di te e ti ferisce.",
            "{E} ti carica con violenza.",
            "{E} ti morde con forza."],
    crit:  ["{E} ti travolge con una carica selvaggia!",
            "{E} ti dilania con furia bestiale!"],
    hurt:  ["{E} ruggisce di dolore.",
            "Colpisci {E} sul muso."],
    dodge: ["{E} balza via con istinto animale!",
            "{E} si ritrae e il colpo va a vuoto!"],
    whiff: ["Schivi la carica di {E} con un balzo laterale!",
            "Respingi {E} prima che ti raggiunga!"],
    win:   ["{E} si accascia senza forze e non si rialza.",
            "Con un ultimo rantolo, {E} crolla al suolo."],
    lose:  ["{E} ti sovrasta e ti azzanna un'ultima volta.",
            "La furia di {E} ha avuto la meglio."],
  },
};

/* ── Determina l'archetipo del nemico ── */
function detectArchetype(enemy) {
  const tags = enemy.tags || [];
  const n = (enemy.name || "").toLowerCase();
  const has = (...t) => t.some(x => tags.includes(x));
  const nm = (...k) => k.some(x => n.includes(x));

  if (enemy.isGod || has("divinita")) return "divinita";
  if (has("lich") || nm("stregone dei morti")) return "lich";
  if (has("drago") || nm("viverna", "idra")) return "drago";
  if (has("demone") || nm("infernale")) return "demone";
  if (has("spirito") && !nm("genio")) return "spirito";
  if (nm("genio")) return "elementale";
  if (has("golem")) return "golem";
  if (has("elementale")) return "elementale";
  if (has("gigante", "troll", "ciclope", "titan") || nm("yeti")) return "gigante";
  if (has("ragno") || nm("scorpione", "scarabeo")) return "ragno";
  if (nm("serpente", "basilisco", "cobra", "salamandra", "verme", "larva")) return "serpente";
  if (nm("squalo", "polpo", "calamaro", "kraken", "granchio", "sirena", "leviatano")) return "marino";
  if (nm("aquila", "grifone", "pipistrello", "manticora")) return "volatile";
  if (has("lupo") || nm("cane")) return "lupo";
  if (has("goblin")) return "goblin";
  if (has("nonmorto", "mummia")) return "nonmorto";
  if (has("bandito")) return "bandito";
  if (nm("strega", "stregone", "druido", "sciamano", "sacerdot", "signora del ghiaccio")) return "mago";
  if (has("umano", "cavaliere")) return "umano";
  return "bestia";
}

/* ── Famiglie d'arma (rilevate dal nome; l'ordine conta) ── */
const WEAPON_FAMILIES = [
  { id:"spadone",     keys:["spadone", "claymore", "zweih", "excalibur"] },
  { id:"falce",       keys:["falce"] },
  { id:"asta",        keys:["picca", "alabarda", "berdica", "lancia", "glaive", "forcone", "tridente", "arpione"] },
  { id:"ascia",       keys:["ascia"] },
  { id:"contundente", keys:["maglio", "martello", "mazza", "randello", "scettro", "bastone"] },
  { id:"stocco",      keys:["stocco", "rapiera"] },
  { id:"curva",       keys:["sciabola", "scimitarra", "khopesh", "wakizashi"] },
  { id:"artiglio",    keys:["artiglio", "katar"] },
  { id:"corta",       keys:["coltello", "pugnale", "daga", "stiletto", "cinquedea", "kriss", "manosinistra", "trincia", "zanna", "costola"] },
  { id:"lama",        keys:["spada", "brando", "lama"] },
];
function weaponFamily(name) {
  if (!name) return null;
  const n = name.toLowerCase();
  return (WEAPON_FAMILIES.find(f => f.keys.some(k => n.includes(k))) || { id:"lama" }).id;
}
const famPool = (dict, fam) => dict[fam] || dict.lama;

/* ── Colpi dell'eroe per famiglia d'arma ── */
const HERO_WEAPON = {
  lama:        ["Cali {W} con un fendente su {E}.",
                "Affondi {W} nel fianco di {E}.",
                "La lama di {W} disegna un arco lucente su {E}."],
  spadone:     ["Il pesante {W} si abbatte su {E} come una ghigliottina.",
                "Un fendente orizzontale di {W} spazza via la guardia di {E}.",
                "Sollevi {W} sopra la testa e lo cali su {E}."],
  ascia:       ["Abbatti {W} su {E} con tutto il tuo peso.",
                "Il filo di {W} morde la carne di {E}.",
                "Agganci la guardia di {E} con la barba di {W} e colpisci."],
  contundente: ["Fai roteare {W} e colpisci {E} in pieno.",
                "Un colpo sordo di {W} raggiunge {E}.",
                "{W} si schianta sulla spalla di {E} con un rumore di ossa."],
  asta:        ["Tieni a distanza {E} e affondi {W}.",
                "La punta di {W} trafigge {E}.",
                "Fai scorrere {W} tra le mani e colpisci {E} di punta."],
  falce:       ["Descrivi un arco ampio con {W} e falci {E}.",
                "La lama ricurva di {W} uncina {E}."],
  stocco:      ["Un affondo fulmineo di {W} trova un varco nella difesa di {E}.",
                "Finti alto e colpisci {E} di punta con {W}.",
                "La punta sottile di {W} punge {E} con precisione chirurgica."],
  curva:       ["La lama ricurva di {W} scivola lungo il fianco di {E}.",
                "Un fendente tirato di {W} apre un taglio su {E}.",
                "Fai sibilare {W} in un arco rapido contro {E}."],
  artiglio:    ["Le lame di {W} graffiano {E} da cima a fondo.",
                "Sferri un pugno armato di {W} nello stomaco di {E}."],
  corta:       ["Ti avvicini e colpisci {E} con {W}.",
                "Pugnali {E} con un colpo rapido di {W}.",
                "Scivoli sotto la guardia di {E} e affondi {W}."],
};
const HERO_WEAPON_CRIT = {
  lama:        ["Trovi un varco e affondi {W} fino all'elsa in {E}!",
                "Un fendente perfetto di {W} squarcia {E}!"],
  spadone:     ["{W} spezza la difesa di {E} e lo fende quasi in due!"],
  ascia:       ["{W} si abbatte su {E} con un colpo devastante!"],
  contundente: ["{W} centra {E} con un colpo che rimbomba!"],
  asta:        ["Impali {E} con un affondo preciso di {W}!"],
  falce:       ["{W} miete {E} con un colpo micidiale!"],
  stocco:      ["{W} penetra tra le giunture dell'armatura di {E}!"],
  curva:       ["Un fendente ricurvo di {W} recide i tendini di {E}!"],
  artiglio:    ["Pianti {W} sotto le costole di {E}!"],
  corta:       ["Pianti {W} in un punto vitale di {E}!"],
};

/* ── Colpi del nemico per famiglia d'arma ── */
const ENEMY_WEAPON = {
  lama:        ["{E} mena un fendente con {W}.",
                "{E} affonda {W} verso di te."],
  spadone:     ["{E} cala il pesante {W} su di te.",
                "{E} spazza l'aria con {W} e ti travolge."],
  ascia:       ["{E} cala {W} con un grido di guerra.",
                "{E} fa roteare {W} e ti colpisce."],
  contundente: ["{E} ti percuote con {W}.",
                "{E} abbatte {W} sulla tua spalla."],
  asta:        ["{E} ti trafigge con un affondo di {W}.",
                "{E} ti tiene a distanza e ti colpisce con {W}."],
  falce:       ["{E} ti falcia con {W}.",
                "La lama ricurva di {W} impugnata da {E} ti raggiunge."],
  stocco:      ["{E} ti punge con un affondo rapidissimo di {W}.",
                "{E} finta e ti colpisce di punta con {W}."],
  curva:       ["{E} ti taglia con un arco sibilante di {W}.",
                "{E} fa scivolare {W} lungo il tuo braccio."],
  artiglio:    ["{E} ti graffia con {W}.",
                "{E} ti colpisce con un pugno armato di {W}."],
  corta:       ["{E} ti pugnala con {W}.",
                "{E} si avvicina e ti ferisce con {W}."],
};
const ENEMY_WEAPON_CRIT = {
  lama:        ["{E} ti squarcia con un fendente di {W}!"],
  spadone:     ["{W} di {E} ti travolge con forza spaventosa!"],
  ascia:       ["{W} di {E} si abbatte su di te con forza brutale!"],
  contundente: ["{E} ti centra in pieno con {W}!"],
  asta:        ["{E} ti trapassa con {W}!"],
  falce:       ["{E} ti miete con {W}!"],
  stocco:      ["{E} infila {W} tra le giunture della tua armatura!"],
  curva:       ["{E} ti apre uno squarcio profondo con {W}!"],
  artiglio:    ["{E} ti dilania con {W}!"],
  corta:       ["{E} pianta {W} in un punto scoperto!"],
};

/* ══════════════════════════════════════════════════════════
 STILI DI COMBATTIMENTO (impugnatura)
 dual = due armi · shield = arma + scudo · twohand = arma a due mani
 single = arma singola con mano libera · shieldOnly = solo scudo
 unarmed = mani nude · natural = creature (armi naturali)
 Segnaposto extra: {O}=arma secondaria  {S}=scudo
══════════════════════════════════════════════════════════ */
const HERO_STANCE_HIT = {
  dual:       ["Incroci {W} e {O} in una forbice d'acciaio su {E}.",
               "Pari con {O} e affondi subito {W} in {E}.",
               "Una raffica alternata di {W} e {O} travolge {E}.",
               "Fingi con {W} e colpisci {E} di rovescio con {O}."],
  shield:     ["Avanzi coperto da {S} e colpisci {E} con {W}.",
               "Spingi {E} con il bordo di {S} e lo ferisci con {W}.",
               "Da dietro {S} sferri un colpo secco di {W} a {E}.",
               "Urti {E} con {S} sbilanciandolo, poi affondi {W}."],
  twohand:    ["Stringi {W} a due mani e lo abbatti su {E}.",
               "Fai roteare {W} in un ampio arco che investe {E}.",
               "Carichi tutto il peso del corpo su {W} e travolgi {E}."],
  single:     ["Con la mano libera afferri {E} e lo colpisci con {W}.",
               "Ti muovi agile, senza scudo, e raggiungi {E} con {W}.",
               "Bilanci il corpo con il braccio libero e colpisci {E} con {W}."],
  shieldOnly: ["Senz'arma, colpisci {E} con il bordo di {S}.",
               "Ti scagli contro {E} facendo di {S} un ariete."],
  unarmed:    ["Colpisci {E} a mani nude.",
               "Sferri un pugno deciso a {E}.",
               "Afferri {E} e lo colpisci con una gomitata.",
               "Colpisci {E} con un calcio al ginocchio.",
               "Ti avventi su {E} e lo tempesti di pugni."],
};
const HERO_STANCE_CRIT = {
  dual:       ["{W} e {O} colpiscono {E} nello stesso istante, da due lati!",
               "Blocchi {E} con {O} e lo trafiggi con {W}!"],
  shield:     ["Stordisci {E} con un colpo di {S} e lo finisci con {W}!",
               "{E} sbatte contro {S} e {W} trova il varco!"],
  twohand:    ["Un colpo a due mani di {W} sfonda ogni difesa di {E}!"],
  single:     ["Afferri {E} per il bavero e lo trafiggi con {W}!"],
  shieldOnly: ["Schianti {S} sul volto di {E}!"],
  unarmed:    ["Un pugno ben assestato manda {E} al tappeto!",
               "Proietti {E} a terra e lo colpisci alla gola!"],
};
// L'eroe evita/para l'attacco nemico
const HERO_STANCE_PARRY = {
  dual:       ["Incroci {W} e {O} e blocchi l'attacco di {E} nella forbice delle lame!",
               "Devii il colpo di {E} con {O} e rispondi con una finta di {W}!"],
  shield:     ["Sollevi {S} e l'attacco di {E} vi si infrange contro!",
               "Il colpo di {E} rimbomba su {S}: nessun danno!"],
  twohand:    ["Usi il manico di {W} per deviare l'assalto di {E}!",
               "Pari il colpo di {E} con il piatto di {W}!"],
  single:     ["Devii l'attacco di {E} con {W} e ti scosti!",
               "Pari con {W} e scivoli fuori dalla portata di {E}!"],
  shieldOnly: ["Ti ripari dietro {S}: {E} non trova varchi!"],
  unarmed:    ["Senza armi né scudo, ti affidi ai riflessi: schivi {E} con una piroetta!",
               "Afferri il polso di {E} e devii il colpo!"],
};

const ENEMY_STANCE_HIT = {
  dual:       ["{E} ti incalza con {W} e {O} in una raffica alternata.",
               "{E} para con {O} e ti ferisce con {W}.",
               "{E} ti stringe tra {W} e {O} come una tenaglia."],
  shield:     ["{E} avanza dietro {S} e ti colpisce con {W}.",
               "{E} ti urta con {S} e affonda {W}."],
  twohand:    ["{E} solleva {W} a due mani e lo cala su di te.",
               "{E} fa roteare {W} in un ampio arco."],
  single:     ["{E} ti afferra con la mano libera e ti colpisce con {W}.",
               "{E} danza leggero e ti raggiunge con {W}."],
  shieldOnly: ["{E} ti colpisce col bordo di {S}."],
  unarmed:    ["{E} ti colpisce con un pugno al volto.",
               "{E} ti afferra e ti rifila una testata.",
               "{E} ti assesta un calcio al fianco."],
};
const ENEMY_STANCE_CRIT = {
  dual:       ["{E} ti colpisce con {W} e {O} insieme!"],
  shield:     ["{E} ti stordisce con {S} e ti ferisce con {W}!"],
  twohand:    ["{E} ti investe con un colpo a due mani di {W}!"],
  single:     ["{E} ti tira a sé e ti trafigge con {W}!"],
  shieldOnly: ["{E} ti schianta {S} sul volto!"],
  unarmed:    ["{E} ti colpisce alla tempia con un pugno!"],
};
// Il nemico evita/para l'attacco dell'eroe
const ENEMY_STANCE_PARRY = {
  dual:       ["{E} incrocia {W} e {O} e blocca il tuo colpo!",
               "{E} devia il tuo attacco con {O} e ti minaccia con {W}!"],
  shield:     ["{E} alza {S} e il tuo attacco vi rimbalza contro!",
               "Il tuo colpo si schianta su {S} di {E}!"],
  twohand:    ["{E} devia il tuo colpo con il manico di {W}!"],
  single:     ["{E} para con {W} e scivola di lato!"],
  shieldOnly: ["{E} si rannicchia dietro {S}!"],
  unarmed:    ["{E} si abbassa e il tuo colpo fende l'aria!",
               "{E} ti blocca il braccio e devia l'attacco!"],
};

/* ── Scontri tra stili (situazioni specifiche) ── */
const MATCHUP_HERO_HIT = {
  "twohand>shield": ["{W} si abbatte su {S} di {E} e glielo strappa quasi di mano."],
  "any>unarmed":    ["{E} è disarmato e {W} trova facilmente la carne."],
  "unarmed>armed":  ["Eviti {X} di {E} e lo colpisci a pugni nudi."],
  "dual>shield":    ["Mentre {E} si copre con {S}, {O} lo aggira e colpisce."],
};
const MATCHUP_ENEMY_HIT = {
  "twohand>shield": ["{E} cala {W} sul tuo {Z} con tanta forza che il braccio ti si intorpidisce."],
  "armed>unarmed":  ["Disarmato, non puoi parare {W} di {E}."],
  "dual>shield":    ["{E} impegna {Z} con {W} e ti colpisce di lato con {O}."],
};

const HERO_CRIT_GENERIC = [
  "Trovi un varco nella guardia di {E} e colpisci un punto vitale!",
  "Leggi in anticipo la mossa di {E} e punisci l'errore senza pietà!",
  "Un colpo perfetto, nato da anni di disciplina, travolge {E}!",
];

const HERO_DOUBLE = [
  "Scatti in velocità e colpisci di nuovo {E}.",
  "Non dai respiro a {E} e incalzi con un secondo colpo.",
  "Approfitti dell'apertura e colpisci ancora {E}.",
];
const HERO_DOUBLE_DUAL = [
  "Non hai finito: anche {O} si abbatte su {E}.",
  "Il secondo colpo arriva da {O}, prima che {E} possa reagire.",
];
const ENEMY_DOUBLE = [
  "{E} approfitta della sua rapidità e ti colpisce ancora.",
  "Prima che tu possa reagire, {E} attacca di nuovo.",
  "{E} incalza senza sosta.",
];
const ENEMY_DOUBLE_DUAL = [
  "{E} ti colpisce ancora, questa volta con {O}.",
];

/* ── Helper ── */
const strong = s => `<strong>${s}</strong>`;
function fill(tpl, ctx) {
  return tpl
    .replace(/\{E\}/g, ctx.E || "")
    .replace(/\{D\}/g, ctx.D || "")
    .replace(/\{W\}/g, ctx.W || "")
    .replace(/\{O\}/g, ctx.O || "")
    .replace(/\{S\}/g, ctx.S || "")
    .replace(/\{X\}/g, ctx.X || "")
    .replace(/\{Z\}/g, ctx.Z || "");
}

/* ── Ricava la dotazione da un oggetto { slot: piece } ── */
function getLoadout(equip, { isHuman = true } = {}) {
  const lo = { stance: "unarmed", main: null, off: null, shield: null, armor: null };
  if (!equip) {
    lo.stance = isHuman ? "unarmed" : "natural";
    return lo;
  }
  const dx = equip.mano_dx || equip.arma || null;
  const sx = equip.mano_sx || equip.scudo || null;
  let main = dx && dx.handType !== "shield" ? dx : null;
  let off = null, shield = null;
  if (sx) {
    if (sx.handType === "shield" || (!sx.handType && equip.scudo)) shield = sx;
    else off = sx;
  }
  if (main?.handType === "2h") { off = null; shield = null; }
  if (!main && off) { main = off; off = null; }

  lo.main = main; lo.off = off; lo.shield = shield;
  lo.armor = equip.torace || equip.testa || equip.braccia || equip.gambe ||
             equip.corazza || equip.elmo || equip.gambali || equip.bracciali || null;

  if (main?.handType === "2h") lo.stance = "twohand";
  else if (main && off) lo.stance = "dual";
  else if (main && shield) lo.stance = "shield";
  else if (main) lo.stance = "single";
  else if (shield) lo.stance = "shieldOnly";
  else lo.stance = isHuman ? "unarmed" : "natural";
  return lo;
}

const isArmed = lo => !!lo.main;

/* ══════════════════════════════════════════════════════════
 Crea un narratore per un singolo combattimento
 opts: { enemy, enemyEquip, heroEquip, heroWeapon, heroArmor }
══════════════════════════════════════════════════════════ */
export function createCombatNarrator({ enemy, enemyEquip, heroEquip, heroWeapon, heroArmor }) {
  const archId = detectArchetype(enemy);
  const arch = ARCHETYPES[archId] || ARCHETYPES.bestia;
  const E = strong(enemy.name);

  // Dotazione eroe (retro-compatibile con heroWeapon/heroArmor)
  const hero = heroEquip
    ? getLoadout(heroEquip, { isHuman: true })
    : getLoadout(heroWeapon ? { mano_dx: { name: heroWeapon, handType: "1h" } } : {}, { isHuman: true });
  // Dotazione nemico: le creature senza equipaggiamento usano armi naturali
  const ene = getLoadout(enemyEquip, { isHuman: !!enemy.human });

  const heroWeaponName = hero.main?.name || null;
  const heroFam = heroWeaponName ? weaponFamily(heroWeaponName) : null;
  const heroArmorName = hero.shield?.name || hero.armor?.name || heroArmor || null;
  const eneWeapon = ene.main?.name || null;
  const eneFam = eneWeapon ? weaponFamily(eneWeapon) : null;
  const eneShield = ene.shield?.name || null;
  const eneArmor = ene.armor?.name || null;

  // Contesti base per i segnaposto
  const heroCtx = {
    E,
    W: heroWeaponName ? strong(heroWeaponName) : "",
    O: hero.off ? strong(hero.off.name) : "",
    S: hero.shield ? strong(hero.shield.name) : "",
    X: eneWeapon ? strong(eneWeapon) : "",
  };
  const eneCtx = {
    E,
    W: eneWeapon ? strong(eneWeapon) : "",
    O: ene.off ? strong(ene.off.name) : "",
    S: eneShield ? strong(eneShield) : "",
    Z: hero.shield ? strong(hero.shield.name) : "",
  };
  // Per i matchup in cui il nemico colpisce, {S} deve riferirsi allo scudo nemico
  const heroVsShieldCtx = { ...heroCtx, S: eneShield ? strong(eneShield) : "" };

  // Evita di ripetere la stessa frase due volte di fila
  const last = {};
  function pick(key, list) {
    if (!list || !list.length) return "";
    let opts = list.length > 1 ? list.filter(p => p !== last[key]) : list;
    const p = opts[Math.floor(Math.random() * opts.length)];
    last[key] = p;
    return p;
  }
  const chance = p => Math.random() < p;

  // Matchup eroe → nemico
  function heroMatchup() {
    if (hero.stance === "twohand" && ene.stance === "shield") return MATCHUP_HERO_HIT["twohand>shield"];
    if (hero.stance === "dual" && ene.stance === "shield") return MATCHUP_HERO_HIT["dual>shield"];
    if (isArmed(hero) && ene.stance === "unarmed") return MATCHUP_HERO_HIT["any>unarmed"];
    if (hero.stance === "unarmed" && isArmed(ene)) return MATCHUP_HERO_HIT["unarmed>armed"];
    return null;
  }
  // Matchup nemico → eroe
  function enemyMatchup() {
    if (ene.stance === "twohand" && hero.shield) return MATCHUP_ENEMY_HIT["twohand>shield"];
    if (ene.stance === "dual" && hero.shield) return MATCHUP_ENEMY_HIT["dual>shield"];
    if (isArmed(ene) && hero.stance === "unarmed") return MATCHUP_ENEMY_HIT["armed>unarmed"];
    return null;
  }

  return {
    archetype: archId,
    heroStance: hero.stance,
    enemyStance: ene.stance,

    // Riga introduttiva: come si presentano i duellanti
    intro() {
      const W = heroCtx.W, O = heroCtx.O, S = heroCtx.S;
      const heroTxt = {
        dual:       `Sguaini ${W} e ${O}: combatterai a due armi.`,
        shield:     `Imbracci ${S} e stringi ${W}.`,
        twohand:    `Afferri ${W} saldamente a due mani.`,
        single:     `Impugni ${W}, lasciando libera la mano sinistra.`,
        shieldOnly: `Imbracci ${S}, senza un'arma da impugnare.`,
        unarmed:    `Non hai armi: combatterai a mani nude.`,
      }[hero.stance] || "";
      const eW = eneCtx.W, eO = eneCtx.O, eS = eneCtx.S;
      const eneTxt = {
        dual:       `${E} estrae ${eW} e ${eO}, una per mano.`,
        shield:     `${E} si copre con ${eS} e brandisce ${eW}.`,
        twohand:    `${E} solleva ${eW} a due mani.`,
        single:     `${E} punta ${eW} verso di te.`,
        shieldOnly: `${E} si ripara dietro ${eS}.`,
        unarmed:    `${E} alza i pugni: è disarmato.`,
      }[ene.stance] || "";
      return [heroTxt, eneTxt].filter(Boolean).join(" ");
    },

    heroHit(turn) {
      const ctx = heroCtx;
      if (turn.isCrit) {
        const pools = [HERO_CRIT_GENERIC, HERO_STANCE_CRIT[hero.stance]];
        if (heroFam) pools.push(famPool(HERO_WEAPON_CRIT, heroFam));
        return fill(pick("hcrit", pools[Math.floor(Math.random() * pools.length)] || HERO_CRIT_GENERIC), ctx);
      }
      if (turn.isDouble) {
        const pool = hero.stance === "dual" && chance(0.6) ? HERO_DOUBLE_DUAL : HERO_DOUBLE;
        return fill(pick("hdbl", pool), ctx);
      }
      const mu = heroMatchup();
      if (mu && chance(0.25)) {
        return fill(pick("hmu", mu), heroVsShieldCtx);
      }
      const r = Math.random();
      let pool;
      if (r < 0.4) pool = HERO_STANCE_HIT[hero.stance];
      else if (r < 0.75 && heroFam) pool = famPool(HERO_WEAPON, heroFam);
      else pool = arch.hurt;
      return fill(pick("hhit", pool || arch.hurt), ctx);
    },

    enemyHit(turn) {
      const ctx = eneCtx;
      const hasStance = ene.stance !== "natural";
      if (turn.isCrit) {
        const pools = [arch.crit];
        if (hasStance) pools.push(ENEMY_STANCE_CRIT[ene.stance]);
        if (eneFam) pools.push(famPool(ENEMY_WEAPON_CRIT, eneFam));
        return fill(pick("ecrit", pools[Math.floor(Math.random() * pools.length)] || arch.crit), ctx);
      }
      if (turn.isDouble) {
        const pool = ene.stance === "dual" && chance(0.6) ? ENEMY_DOUBLE_DUAL : ENEMY_DOUBLE;
        return fill(pick("edbl", pool), ctx);
      }
      const mu = enemyMatchup();
      if (mu && chance(0.25)) return fill(pick("emu", mu), ctx);
      const r = Math.random();
      let pool;
      if (hasStance && r < 0.4) pool = ENEMY_STANCE_HIT[ene.stance];
      else if (eneFam && r < 0.75) pool = famPool(ENEMY_WEAPON, eneFam);
      else pool = arch.atk;
      return fill(pick("ehit", pool || arch.atk), ctx);
    },

    // Il nemico schiva/para l'attacco dell'eroe
    enemyDodge() {
      const pool = arch.dodge.map(s => fill(s, { E }));
      if (ene.stance !== "natural") {
        const stanceLines = (ENEMY_STANCE_PARRY[ene.stance] || []).map(s => fill(s, eneCtx));
        pool.push(...stanceLines, ...stanceLines); // peso doppio alle parate di stile
      }
      return pick("edodge", pool);
    },

    // L'eroe schiva/para l'attacco del nemico
    heroDodge() {
      const pool = arch.whiff.map(s => fill(s, { E }));
      const stanceLines = (HERO_STANCE_PARRY[hero.stance] || []).map(s => fill(s, heroCtx));
      pool.push(...stanceLines, ...stanceLines);
      if (eneWeapon) pool.push(`${strong(eneWeapon)} di ${E} fende l'aria: eviti il colpo all'ultimo istante!`);
      return pick("hdodge", pool);
    },

    // Danno assorbito dall'equipaggiamento nemico
    enemyDeflect(turn) {
      const n = turn.deflected;
      if (eneShield) return `${eneShield} di ${enemy.name} para -${n}`;
      if (ene.stance === "dual") return `${enemy.name} intercetta con ${ene.off.name} -${n}`;
      if (eneArmor)  return `${eneArmor} di ${enemy.name} assorbe -${n}`;
      return `-${n} parati dall'armatura nemica`;
    },

    // Danno assorbito dall'equipaggiamento dell'eroe
    heroDeflect(turn) {
      const n = turn.deflected;
      if (hero.shield) return `${hero.shield.name} para -${n}`;
      if (hero.stance === "dual") return `${hero.off.name} intercetta -${n}`;
      if (heroArmorName) return `${heroArmorName} assorbe -${n}`;
      return `-${n} assorbiti dalla tua difesa`;
    },

    victory() {
      let txt = fill(pick("win", arch.win), { E });
      if (chance(0.5)) {
        const tail = {
          dual:       ` Rinfoderi ${heroCtx.W} e ${heroCtx.O}, ancora gocciolanti.`,
          shield:     ` Abbassi ${heroCtx.S}, ammaccato ma integro, e pulisci ${heroCtx.W}.`,
          twohand:    ` Pianti ${heroCtx.W} nel terreno e ti appoggi per riprendere fiato.`,
          single:     ` Pulisci ${heroCtx.W} e riprendi fiato.`,
          shieldOnly: ` Abbassi ${heroCtx.S}, ammaccato ma integro.`,
          unarmed:    ` Ti massaggi le nocche sbucciate: hai vinto a mani nude.`,
        }[hero.stance];
        if (tail) txt += tail;
      }
      return txt;
    },

    defeat() {
      let txt = fill(pick("lose", arch.lose), { E });
      if (eneWeapon) txt += ` ${strong(eneWeapon)} è l'ultima cosa che vedi.`;
      else if (ene.stance === "unarmed") txt += ` ${E} ti ha battuto a mani nude.`;
      return txt;
    },
  };
}
