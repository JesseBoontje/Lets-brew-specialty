# Lets Brew Specialty

Werkwijze: skill `architect` (in .claude/skills) bovenop jesse-werkwijze en
functie-bouwen. Lopend werk staat in werk/takenbord.md, overdracht in
werk/overdracht.md.

## Waar wat staat
- `index.html` schermen, `styles.css` opmaak, huisstijl volgens skill lets-brew-house-style.
- `app/01..12-*.js` de app zelf, in laadvolgorde (klassieke scripts, gedeelde
  globale namen). Code die bij het laden draait mag niets uit een later bestand
  gebruiken. Een nieuw bestand ook toevoegen aan index.html en service-worker.js.
  - 01 kennis (zetgidsen, maalstand, recepten, iconen) · 02 opslag (IndexedDB)
  - 03 navigatie en home · 04 brew-formulier, gietcoach, recepten
  - 05 espresso dial-in · 06 detail, print, methodes en gear
  - 07 bonen · 08 AI · 09 leren, latte art, cupping, delen
  - 10 bonenkeuzehulp en kaart · 11 profiel, instellingen, budget, export
    (11-account account en sync, 11-volgen profiel, volgen en feed, 11-beheer accounts-beheer en Lets Brew AI,
    11-instellingen indeling van Settings: grote kaart, functies per onderwerp)
  - 12 hulpfuncties en het starten van de app (moet als laatste)
- `security.js`, `brew-model.js`, `brew-workspace.js`, `brew-voice.js` losse modules.
  `brew-stem.js` stem voor de coaches (ElevenLabs met eigen sleutel, anders telefoonstem).
- `site-worker.mjs` Cloudflare Worker (assets + spraak-API + /api/stem/ voor ElevenLabs; account in
  `account-worker.mjs`, volgen/feed/foto's in `social-worker.mjs`, beheer en /api/ai in `ai-worker.mjs`),
  `worker/` push-worker (niet actief).
- Bij elke wijziging aan app-bestanden: CACHE-versie in service-worker.js ophogen.

## Testen
`npm run build` en `npm test`. In de cloudomgeving alleen het chromium-project,
met executablePath van de voorgeïnstalleerde browser (zie werk/overdracht.md).
