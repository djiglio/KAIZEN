/* ============================================================
 combatText.js — Narratore del log di combattimento
 Frasi personalizzate per tipologia di nemico (archetipo) e per
 l'equipaggiamento di eroe e nemico: attacco, schivata, critico,
 parata, vittoria e sconfitta.
 Segnaposto: {E}=nemico  {D}=danno  {W}=arma  {S}=scudo/armatura
 ============================================================ */

/* ── Archetipi: rilevati da tag + parole chiave nel nome ── */
const ARCHETYPES = {
  divinita: {
    atk:   ["{E} solleva una mano e una forza invisibile ti schiaccia: subisci {D}",
            "{E} pronuncia una parola antica e il cielo ti colpisce: subisci {D}",
            "Un raggio di luce accecante scaturisce da {E}: subisci {D}"],
    crit:  ["{E} scatena l'ira degli dèi: un'esplosione di luce ti travolge, subisci {D}!",
            "Lo sguardo di {E} ti trafigge l'anima: subisci {D}!"],
    hurt:  ["La tua arma incrina l'aura divina di {E}: infliggi {D}",
            "Per la prima volta {E} sanguina icore dorato: infliggi {D}"],
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
    atk:   ["{E} ti investe con una vampata di fuoco: subisci {D}",
            "{E} ti sferza con la coda irta di scaglie: subisci {D}",
            "Gli artigli di {E} ti ghermiscono: subisci {D}"],
    crit:  ["{E} spalanca le fauci e ti avvolge nel suo soffio: subisci {D}!",
            "{E} ti afferra tra le zanne e ti scaglia lontano: subisci {D}!"],
    hurt:  ["Trovi una scaglia scheggiata sul petto di {E}: infliggi {D}",
            "Colpisci l'ala membranosa di {E}, che ruggisce di dolore: infliggi {D}"],
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
    atk:   ["{E} ti attraversa con un gelo spettrale: subisci {D}",
            "Un lamento straziante di {E} ti perfora la mente: subisci {D}",
            "Le dita evanescenti di {E} ti stringono il cuore: subisci {D}"],
    crit:  ["{E} ti strappa un frammento d'anima: subisci {D}!",
            "{E} urla nel tuo orecchio e la vista ti si annebbia: subisci {D}!"],
    hurt:  ["La tua arma lacera la forma eterea di {E}: infliggi {D}",
            "{E} vacilla e si dissolve per un istante: infliggi {D}"],
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
    atk:   ["{E} ti ustiona con artigli incandescenti: subisci {D}",
            "{E} ti frusta con una catena di fiamme infernali: subisci {D}",
            "{E} ti carica a testa bassa con le corna: subisci {D}"],
    crit:  ["{E} ti marchia con un sigillo infernale: subisci {D}!",
            "{E} ride mentre ti squarcia con artigli di brace: subisci {D}!"],
    hurt:  ["Sangue nero sgorga dalla ferita di {E}: infliggi {D}",
            "{E} urla una bestemmia mentre lo colpisci: infliggi {D}"],
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
    atk:   ["{E} ti afferra con dita scheletriche: subisci {D}",
            "{E} ti colpisce con una forza che nessun vivo possiede: subisci {D}",
            "Un tocco putrido di {E} ti fa avvizzire la carne: subisci {D}"],
    crit:  ["{E} ti morde con denti marci: senti la vita defluire, subisci {D}!",
            "{E} ti colpisce con un'energia necrotica: subisci {D}!"],
    hurt:  ["Ossa scricchiolano sotto il tuo colpo a {E}: infliggi {D}",
            "Bende e polvere volano via da {E}: infliggi {D}"],
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
    atk:   ["{E} scaglia un dardo d'ombra: subisci {D}",
            "{E} sussurra una formula proibita e la tua carne si raggrinzisce: subisci {D}",
            "Un teschio fiammeggiante evocato da {E} ti colpisce: subisci {D}"],
    crit:  ["{E} ti prosciuga l'energia vitale con un incantesimo: subisci {D}!",
            "Un vortice necromantico di {E} ti avvolge: subisci {D}!"],
    hurt:  ["Spezzi la barriera arcana di {E} e lo colpisci: infliggi {D}",
            "Il filatterio di {E} tremola sotto il tuo colpo: infliggi {D}"],
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
    atk:   ["{E} abbatte un pugno di pietra su di te: subisci {D}",
            "{E} ti travolge con il suo peso immenso: subisci {D}",
            "Il braccio massiccio di {E} ti scaraventa via: subisci {D}"],
    crit:  ["{E} ti schiaccia sotto un colpo che spacca il terreno: subisci {D}!",
            "Le rune di {E} si illuminano e il suo pugno esplode su di te: subisci {D}!"],
    hurt:  ["Schegge di pietra volano dal corpo di {E}: infliggi {D}",
            "Una crepa si apre sul torso di {E}: infliggi {D}"],
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
    atk:   ["{E} ti investe con la furia degli elementi: subisci {D}",
            "Un turbine scatenato da {E} ti avvolge: subisci {D}",
            "{E} si scaglia contro di te come una frana: subisci {D}"],
    crit:  ["{E} esplode in un'ondata elementale: subisci {D}!",
            "Il nucleo di {E} pulsa e ti colpisce con violenza primordiale: subisci {D}!"],
    hurt:  ["Disperdi parte della materia di {E}: infliggi {D}",
            "Il nucleo di {E} vacilla sotto il tuo colpo: infliggi {D}"],
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
    atk:   ["{E} ti calpesta con un piede enorme: subisci {D}",
            "{E} ti spazza via con un manrovescio: subisci {D}",
            "{E} scaglia un macigno contro di te: subisci {D}"],
    crit:  ["{E} ti afferra e ti sbatte a terra: subisci {D}!",
            "Il pugno di {E} ti centra in pieno petto: subisci {D}!"],
    hurt:  ["Colpisci {E} al ginocchio e lo fai barcollare: infliggi {D}",
            "Ti arrampichi sul braccio di {E} e affondi il colpo: infliggi {D}"],
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
    atk:   ["{E} ti morde con cheliceri velenosi: subisci {D}",
            "{E} ti punge con il pungiglione: subisci {D}",
            "{E} scatta dalle ombre e ti ferisce: subisci {D}"],
    crit:  ["Il veleno di {E} ti brucia nelle vene: subisci {D}!",
            "{E} ti immobilizza e affonda le fauci: subisci {D}!"],
    hurt:  ["Tranci una zampa di {E}: infliggi {D}",
            "Il carapace di {E} si incrina: infliggi {D}"],
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
    atk:   ["{E} scatta e ti morde: subisci {D}",
            "Le spire di {E} ti stringono: subisci {D}",
            "{E} ti sputa addosso un veleno acido: subisci {D}"],
    crit:  ["{E} ti avvolge nelle sue spire e stringe: subisci {D}!",
            "Le zanne di {E} affondano in profondità: subisci {D}!"],
    hurt:  ["Colpisci {E} sotto la testa: infliggi {D}",
            "Le squame di {E} si lacerano: infliggi {D}"],
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
    atk:   ["{E} ti colpisce con un'ondata di forza: subisci {D}",
            "I tentacoli di {E} ti sferzano: subisci {D}",
            "{E} emerge dai flutti e ti azzanna: subisci {D}"],
    crit:  ["{E} ti trascina sott'acqua per un attimo interminabile: subisci {D}!",
            "{E} ti stritola con forza abissale: subisci {D}!"],
    hurt:  ["Tranci un tentacolo di {E}: infliggi {D}",
            "Colpisci {E} tra le scaglie bagnate: infliggi {D}"],
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
    atk:   ["{E} piomba dall'alto e ti artiglia: subisci {D}",
            "{E} ti colpisce con il becco affilato: subisci {D}",
            "Le ali di {E} ti sferzano il viso: subisci {D}"],
    crit:  ["{E} ti ghermisce in picchiata e ti lascia cadere: subisci {D}!",
            "{E} ti squarcia con gli artigli in volo radente: subisci {D}!"],
    hurt:  ["Colpisci un'ala di {E}, piume ovunque: infliggi {D}",
            "Intercetti {E} in volo: infliggi {D}"],
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
    atk:   ["{E} ti azzanna con ferocia: subisci {D}",
            "{E} ti lacera con gli artigli: subisci {D}",
            "{E} ti salta addosso ringhiando: subisci {D}"],
    crit:  ["Le fauci di {E} si serrano sulla tua gamba: subisci {D}!",
            "{E} ti punta alla gola con un balzo feroce: subisci {D}!"],
    hurt:  ["{E} guaisce sotto il tuo colpo: infliggi {D}",
            "Colpisci {E} sul fianco: infliggi {D}"],
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
    atk:   ["{E} ti colpisce con un attacco scorretto: subisci {D}",
            "{E} ti salta addosso urlando: subisci {D}",
            "{E} ti tira un calcio negli stinchi e colpisce: subisci {D}"],
    crit:  ["{E} ti pugnala alle spalle sghignazzando: subisci {D}!",
            "{E} ti lancia sabbia negli occhi e colpisce: subisci {D}!"],
    hurt:  ["{E} strilla di dolore: infliggi {D}",
            "Colpisci {E} sulla testa verdastra: infliggi {D}"],
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
    atk:   ["{E} ti assale con un colpo di taglio: subisci {D}",
            "{E} ti colpisce con una mossa da tagliagole: subisci {D}",
            "{E} finta a destra e ti colpisce a sinistra: subisci {D}"],
    crit:  ["{E} ti colpisce con un trucco sporco: subisci {D}!",
            "{E} trova un varco nella tua guardia: subisci {D}!"],
    hurt:  ["{E} impreca sotto il tuo colpo: infliggi {D}",
            "Colpisci {E}, che arretra sputando sangue: infliggi {D}"],
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
    atk:   ["{E} scaglia un dardo arcano: subisci {D}",
            "{E} pronuncia una maledizione e senti un dolore lancinante: subisci {D}",
            "Una sfera di energia evocata da {E} ti colpisce: subisci {D}"],
    crit:  ["{E} completa un rituale e un'esplosione magica ti travolge: subisci {D}!",
            "Il sortilegio di {E} ti brucia dall'interno: subisci {D}!"],
    hurt:  ["Interrompi l'incantesimo di {E} con un colpo: infliggi {D}",
            "{E} perde la concentrazione sotto il tuo attacco: infliggi {D}"],
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
    atk:   ["{E} ti colpisce con un attacco deciso: subisci {D}",
            "{E} fende la tua guardia e ti colpisce: subisci {D}",
            "{E} carica con un grido di battaglia: subisci {D}"],
    crit:  ["{E} ti sorprende su un punto scoperto: subisci {D}!",
            "{E} sfonda la tua guardia con un colpo feroce: subisci {D}!"],
    hurt:  ["{E} vacilla sotto il tuo colpo: infliggi {D}",
            "Superi la guardia di {E}: infliggi {D}"],
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
    atk:   ["{E} si scaglia su di te e ti ferisce: subisci {D}",
            "{E} ti carica con violenza: subisci {D}",
            "{E} ti morde con forza: subisci {D}"],
    crit:  ["{E} ti travolge con una carica selvaggia: subisci {D}!",
            "{E} ti dilania con furia bestiale: subisci {D}!"],
    hurt:  ["{E} ruggisce di dolore: infliggi {D}",
            "Colpisci {E} sul muso: infliggi {D}"],
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

/* ── Famiglie d'arma (rilevate dal nome) ── */
const WEAPON_FAMILIES = [
  { id:"falce",       keys:["falce"] },
  { id:"ascia",       keys:["ascia"] },
  { id:"asta",        keys:["alabarda", "forcone", "tridente"] },
  { id:"contundente", keys:["mazza", "bastone", "scettro"] },
  { id:"corta",       keys:["coltello", "zanna", "costola", "pugnale"] },
  { id:"lama",        keys:["spada", "lama", "excalibur"] },
];
function weaponFamily(name) {
  if (!name) return null;
  const n = name.toLowerCase();
  return (WEAPON_FAMILIES.find(f => f.keys.some(k => n.includes(k))) || { id:"lama" }).id;
}

const HERO_WEAPON = {
  lama:        ["Cali {W} con un fendente su {E}: infliggi {D}",
                "Affondi {W} nel fianco di {E}: infliggi {D}",
                "La lama di {W} disegna un arco lucente su {E}: infliggi {D}"],
  ascia:       ["Abbatti {W} su {E} con tutto il tuo peso: infliggi {D}",
                "Il filo di {W} morde la carne di {E}: infliggi {D}"],
  contundente: ["Fai roteare {W} e colpisci {E} in pieno: infliggi {D}",
                "Un colpo sordo di {W} raggiunge {E}: infliggi {D}"],
  asta:        ["Tieni a distanza {E} e affondi {W}: infliggi {D}",
                "La punta di {W} trafigge {E}: infliggi {D}"],
  falce:       ["Descrivi un arco ampio con {W} e falci {E}: infliggi {D}",
                "La lama ricurva di {W} uncina {E}: infliggi {D}"],
  corta:       ["Ti avvicini e colpisci {E} con {W}: infliggi {D}",
                "Pugnali {E} con un colpo rapido di {W}: infliggi {D}"],
  none:        ["Colpisci {E} a mani nude: infliggi {D}",
                "Sferri un pugno deciso a {E}: infliggi {D}",
                "Afferri {E} e lo colpisci con una gomitata: infliggi {D}"],
};
const HERO_WEAPON_CRIT = {
  lama:        ["Trovi un varco e affondi {W} fino all'elsa in {E}: infliggi {D}!",
                "Un fendente perfetto di {W} squarcia {E}: infliggi {D}!"],
  ascia:       ["{W} si abbatte su {E} con un colpo devastante: infliggi {D}!"],
  contundente: ["{W} centra {E} con un colpo che rimbomba: infliggi {D}!"],
  asta:        ["Impali {E} con un affondo preciso di {W}: infliggi {D}!"],
  falce:       ["{W} miete {E} con un colpo micidiale: infliggi {D}!"],
  corta:       ["Pianti {W} in un punto vitale di {E}: infliggi {D}!"],
  none:        ["Un pugno ben assestato manda {E} al tappeto: infliggi {D}!"],
};
const ENEMY_WEAPON = {
  lama:        ["{E} mena un fendente con {W}: subisci {D}",
                "{E} affonda {W} verso di te: subisci {D}"],
  ascia:       ["{E} cala {W} con un grido di guerra: subisci {D}",
                "{E} fa roteare {W} e ti colpisce: subisci {D}"],
  contundente: ["{E} ti percuote con {W}: subisci {D}",
                "{E} abbatte {W} sulla tua spalla: subisci {D}"],
  asta:        ["{E} ti trafigge con un affondo di {W}: subisci {D}",
                "{E} ti tiene a distanza e ti colpisce con {W}: subisci {D}"],
  falce:       ["{E} ti falcia con {W}: subisci {D}",
                "La lama ricurva di {W} impugnata da {E} ti raggiunge: subisci {D}"],
  corta:       ["{E} ti pugnala con {W}: subisci {D}",
                "{E} si avvicina e ti ferisce con {W}: subisci {D}"],
};
const ENEMY_WEAPON_CRIT = {
  lama:        ["{E} ti squarcia con un fendente di {W}: subisci {D}!"],
  ascia:       ["{W} di {E} si abbatte su di te con forza brutale: subisci {D}!"],
  contundente: ["{E} ti centra in pieno con {W}: subisci {D}!"],
  asta:        ["{E} ti trapassa con {W}: subisci {D}!"],
  falce:       ["{E} ti miete con {W}: subisci {D}!"],
  corta:       ["{E} pianta {W} in un punto scoperto: subisci {D}!"],
};

const HERO_CRIT_GENERIC = [
  "Trovi un varco nella guardia di {E} e colpisci un punto vitale: infliggi {D}!",
  "Leggi in anticipo la mossa di {E} e punisci l'errore senza pietà: infliggi {D}!",
  "Un colpo perfetto, nato da anni di disciplina, travolge {E}: infliggi {D}!",
];

const HERO_DOUBLE = [
  "Scatti in velocità e colpisci di nuovo {E}: infliggi {D}",
  "Non dai respiro a {E} e incalzi con un secondo colpo: infliggi {D}",
  "Approfitti dell'apertura e colpisci ancora {E}: infliggi {D}",
];
const ENEMY_DOUBLE = [
  "{E} approfitta della sua rapidità e ti colpisce ancora: subisci {D}",
  "Prima che tu possa reagire, {E} attacca di nuovo: subisci {D}",
  "{E} incalza senza sosta: subisci {D}",
];

/* ── Helper ── */
const strong = s => `<strong>${s}</strong>`;
function fill(tpl, ctx) {
  return tpl
    .replace(/\{E\}/g, ctx.E || "")
    .replace(/\{D\}/g, ctx.D || "")
    .replace(/\{W\}/g, ctx.W || "")
    .replace(/\{S\}/g, ctx.S || "");
}

/* ══════════════════════════════════════════════════════════
 Crea un narratore per un singolo combattimento
 opts: { enemy, enemyEquip, heroWeapon, heroArmor }
══════════════════════════════════════════════════════════ */
export function createCombatNarrator({ enemy, enemyEquip, heroWeapon, heroArmor }) {
  const arch = ARCHETYPES[detectArchetype(enemy)] || ARCHETYPES.bestia;
  const E = strong(enemy.name);
  const heroFam = heroWeapon ? weaponFamily(heroWeapon) : "none";
  const eneWeapon = enemyEquip?.arma?.name || null;
  const eneFam = eneWeapon ? weaponFamily(eneWeapon) : null;
  const eneShield = enemyEquip?.scudo?.name || null;
  const eneArmor = enemyEquip?.corazza?.name || enemyEquip?.elmo?.name ||
                   enemyEquip?.gambali?.name || enemyEquip?.bracciali?.name || null;

  // Evita di ripetere la stessa frase due volte di fila
  const last = {};
  function pick(key, list) {
    if (!list || !list.length) return "";
    let opts = list.length > 1 ? list.filter(p => p !== last[key]) : list;
    const p = opts[Math.floor(Math.random() * opts.length)];
    last[key] = p;
    return p;
  }
  const dmgHero  = t => strong(`-${t.dmg} PV`);

  return {
    archetype: detectArchetype(enemy),

    heroHit(turn) {
      const ctx = { E, D: dmgHero(turn), W: heroWeapon ? strong(heroWeapon) : "" };
      if (turn.isCrit) {
        const pool = Math.random() < 0.5 ? HERO_WEAPON_CRIT[heroFam] : HERO_CRIT_GENERIC;
        return fill(pick("hcrit", pool), ctx);
      }
      if (turn.isDouble) return fill(pick("hdbl", HERO_DOUBLE), ctx);
      const pool = Math.random() < 0.5 ? HERO_WEAPON[heroFam] : arch.hurt;
      return fill(pick("hhit", pool), ctx);
    },

    enemyHit(turn) {
      const ctx = { E, D: dmgHero(turn), W: eneWeapon ? strong(eneWeapon) : "" };
      if (turn.isCrit) {
        const pool = eneFam && Math.random() < 0.5 ? ENEMY_WEAPON_CRIT[eneFam] : arch.crit;
        return fill(pick("ecrit", pool), ctx);
      }
      if (turn.isDouble) return fill(pick("edbl", ENEMY_DOUBLE), ctx);
      const pool = eneFam && Math.random() < 0.6 ? ENEMY_WEAPON[eneFam] : arch.atk;
      return fill(pick("ehit", pool), ctx);
    },

    // Il nemico schiva l'attacco dell'eroe
    enemyDodge() {
      const extra = [];
      if (eneShield) extra.push(`${E} solleva ${strong(eneShield)} e blocca il tuo attacco!`);
      if (eneWeapon) extra.push(`${E} devia il tuo colpo con ${strong(eneWeapon)}!`);
      return pick("edodge", [...arch.dodge.map(s => fill(s, { E })), ...extra]);
    },

    // L'eroe schiva l'attacco del nemico
    heroDodge() {
      const extra = [];
      if (eneWeapon) extra.push(`${strong(eneWeapon)} di ${E} fende l'aria: eviti il colpo all'ultimo istante!`);
      return pick("hdodge", [...arch.whiff.map(s => fill(s, { E })), ...extra]);
    },

    // Danno assorbito dall'equipaggiamento nemico
    enemyDeflect(turn) {
      const n = turn.deflected;
      if (eneShield) return `🛡️ ${eneShield} di ${enemy.name} para -${n}`;
      if (eneArmor)  return `🛡️ ${eneArmor} di ${enemy.name} assorbe -${n}`;
      return `🛡️ -${n} parati dall'armatura nemica`;
    },

    // Danno assorbito dall'equipaggiamento dell'eroe
    heroDeflect(turn) {
      const n = turn.deflected;
      if (heroArmor) return `🛡️ ${heroArmor} assorbe -${n}`;
      return `🛡️ -${n} assorbiti dalla tua difesa`;
    },

    victory() {
      let txt = fill(pick("win", arch.win), { E });
      if (heroWeapon && Math.random() < 0.5) txt += ` Pulisci ${strong(heroWeapon)} e riprendi fiato.`;
      return txt;
    },

    defeat() {
      let txt = fill(pick("lose", arch.lose), { E });
      if (eneWeapon) txt += ` ${strong(eneWeapon)} è l'ultima cosa che vedi.`;
      return txt;
    },
  };
}
