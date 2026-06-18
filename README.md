# KAIZEN v6.1 — Dark Fantasy RPG

## Struttura del progetto

```
kaizen/
├── index.html
├── README.md
├── css/
│   ├── base.css          — variabili CSS, reset, body
│   ├── animations.css    — keyframes, particelle, aure
│   ├── layout.css        — header, sidebar, pagine, modal
│   └── components.css    — tutti i componenti UI
├── js/
│   ├── main.js           — entry point, API globale
│   ├── data.js           — dati statici (bestiario, equip, quest…)
│   ├── state.js          — stato app, localStorage, backup
│   ├── engine.js         — XP, livelli, statistiche, quest
│   ├── world.js          — Mondo Esterno, combattimento, PV/PA
│   ├── shop.js           — negozio, equipaggiamento, reliquie
│   ├── render.js         — rendering DOM di tutte le pagine
│   ├── navigation.js     — sidebar, cambio pagina, tab
│   ├── avatar.js         — avatar SVG procedurale per ogni titolo
│   ├── img.js            — gestione immagini con fallback
│   └── ui.js             — toast, timer, particelle, utility
└── img/
    ├── enemies/          — immagini nemici (PNG, JPG)
    │   ├── bestia_piccola.png
    │   ├── bestia_media.png
    │   ├── bestia_grande.png
    │   ├── goblin.png
    │   ├── bandito.png
    │   ├── scheletro.png
    │   ├── nonmorto.png
    │   ├── lupo.png
    │   ├── ragno.png
    │   ├── troll.png
    │   ├── spettro.png
    │   ├── golem.png
    │   ├── elementale.png
    │   ├── vampiro.png
    │   ├── demone.png
    │   ├── drago.png
    │   └── boss.png
    └── hero/
        └── avatar.png    — avatar personalizzato del giocatore (opzionale)
```

---

## Immagini dei nemici

### Formato e dimensioni consigliate
- **Formato**: PNG con sfondo trasparente (preferito) o JPG/WebP
- **Dimensioni**: 256×256 px oppure 512×512 px
- **Stile**: dark fantasy, ritratto su sfondo scuro/trasparente
- **Peso**: max 100 KB per immagine (idealmente 30-60 KB)

### Come funziona il sistema
Ogni nemico nel bestiario ha un campo `imgCat` che indica la categoria:

| imgCat | Nemici tipici |
|--------|---------------|
| `bestia_piccola` | Ratti, pipistrelli, serpenti (Lv 1-10) |
| `bestia_media`   | Cani, cinghiali, rane (Lv 1-20) |
| `bestia_grande`  | Orsi, arpie, licantropi (Lv 21+) |
| `goblin`         | Goblin deboli, guerrieri, sciamani |
| `bandito`        | Banditi, mercenari, cultisti |
| `scheletro`      | Scheletri e non-morti semplici |
| `nonmorto`       | Ghoul, zombie, cavalieri non-morti |
| `lupo`           | Lupi, licantropi |
| `ragno`          | Ragni velenosi |
| `troll`          | Troll e ogre |
| `spettro`        | Spiriti, fantasmi, spettri |
| `golem`          | Golem di ogni materiale |
| `elementale`     | Elementali (fuoco, acqua, terra, aria) |
| `vampiro`        | Vampiri di ogni grado |
| `demone`         | Demoni e angeli corrotti |
| `drago`          | Draghi e idre |
| `boss`           | Boss unici di alto livello |

Il file viene cercato in `img/enemies/<imgCat>.png`.
**Se il file non esiste**, il gioco mostra automaticamente il simbolo/icona testuale — nessun errore visibile.

### Personalizzare un nemico specifico
Per dare a un nemico un'immagine unica (invece di quella della categoria), modifica il campo `img` in `data.js`:

```js
// In data.js, nel bestiario:
npc("e150", 150, "Drago Primordiale", "🐉", 0,
    1935, 72, 58, 100, 7600,
    "Oltre ogni comprensione", ["drago"],
    "drago"   // ← imgCat (usa img/enemies/drago.png)
)

// Per immagine unica:
// aggiungi nella funzione npc un override manuale in data.js:
// { ...npc(...), img: "img/enemies/e150_drago_primordiale.png" }
```

### Avatar del giocatore
Metti un file `img/hero/avatar.png` (o JPG) nella cartella — verrà sovrapposto all'avatar SVG procedurale nella scheda Eroe. Se il file non esiste, viene mostrato solo l'avatar SVG generato automaticamente dal titolo corrente.

- **Dimensioni consigliate**: 160×200 px
- **Formato**: PNG con sfondo trasparente per integrarsi meglio con l'aura

---

## Deploy su Cloudflare Pages

1. Carica la cartella su un repo GitHub (o GitLab)
2. In Cloudflare Pages → "Create a project" → connetti il repo
3. **Build settings**: nessun build command, output directory = `/` (root)
4. Deploy — Cloudflare serve tutti i file statici automaticamente

Gli ES Modules (`import`/`export`) funzionano nativamente su Cloudflare Pages perché i file `.js` vengono serviti con `Content-Type: application/javascript`.

---

## Aggiornare la versione

Modifica le costanti in `js/data.js`:
```js
export const APP_VERSION = "6.0.1";
export const APP_RELEASE = "01/06/2026";
export const APP_DEV     = "DJIGLIO";
```

---

## Backup e ripristino dati

I dati di gioco sono salvati in `localStorage` con la chiave `kaizenV6_0`.
Usa la funzione **Esporta Sigillo** in Impostazioni per ottenere una stringa base64 — conservala come backup. Usa **Importa Sigillo** per ripristinare.
