# Verslag na live 1 (26-11, aannemer)

Branch `functie/na-live-1` vanaf origin/main. Opdracht: `werk/opdracht-na-live-1.md` (punt 1-5)
plus de extra punten 6-15 van de architect. Niets gedeployd, geen Cloudflare-acties, geen secrets,
niets naar main. CACHE `scc-v126` → `scc-v127` (één keer).

## Wat er gedaan is

1. **ElevenLabs via de server (Lets Brew voice)** — `site-worker.mjs` `stemRoute`:
   - Geen `Authorization` mee → sessie nodig (ingelogd, niet op slot, `ai_allowed=1`), dan de
     server-sleutel `env.ELEVENLABS_API_KEY`. Zonder sessie 401, zonder AI-recht 403
     `not_allowed`, zonder secret 503 `not_set_up` (app valt terug op de telefoonstem).
   - Daglimiet 300 zinnen per gebruiker in `ai_usage` met `day='stem:JJJJ-MM-DD'` (geen migratie),
     één `INSERT … ON CONFLICT … WHERE count<? RETURNING` (atomair, zoals /api/ai). Fout bij
     ElevenLabs of netwerk → teller terug. Kop `X-Stem-Left`. De AI-teller ziet deze rijen niet
     (andere `day`).
   - Optioneel `env.ELEVENLABS_VOICE_ID` als standaardstem; `/voices` geeft `{voices, server:true,
     standaard}`. Rem (STEM_LIMITER) op gebruiker-id i.p.v. IP bij de server-sleutel.
   - Eigen sleutel werkt als voorheen (en telt niets, ook niet als je ingelogd bent).
   - Alle foutzinnen van de stem- en realtime-route in het Engels.
   - App (`brew-stem.js`, `app/11-profiel-en-instellingen.js`, `index.html`): in Settings → AI & voice
     → coach voice chips **Lets Brew voice / own key** (alleen als Lets Brew AI voor dit account
     aan staat, standaard Lets Brew voice). Het uitlegblok met sleutelveld (`#stem-eigen`) alleen bij
     own key. Stemkeuze apart per bron (`scc_el_voice_lb`), keuze in `scc_stem_bron`. Bij limit /
     not_set_up / 401 / 403 / 400 stopt de app met proberen en gebruikt de telefoonstem (toast +
     status). Rij-waarde toont "Lets Brew voice"; shot clock toont "on · Lets Brew voice".
   - SCHEMA.md bijgewerkt.
2. **Geen zwarte vlakken**: grote kaart bovenaan Settings `--accent-soft` met `--cream` tekst
   (opacity-dimming weg, contrast ±4,5:1), geselecteerde chips (`.ws-filters .selected`: In stock,
   my brews/brew ideas, All …) `--accent-soft`/`--cream`, feed-kaart `--accent` (donkerbruin, achter
   foto's). Scan over home, beans, brews, brew ideas, settings, feed: geen achtergrond meer op of onder
   inkt-donker.
3. **Coffee coach**: knop "Ask Lets Brew AI" bij aanbieder letsbrew, anders "Ask with my AI key";
   rij: vragen over de hele breedte (bruin gevuld), Talk live | Stop talking even groot ernaast;
   getekende iconen (tekstballon, microfoon, stop) i.p.v. 🎙. Alle statusregels van `brew-voice.js` in
   het Engels; weggaan van het scherm zonder gesprek zet geen "stopped"-regel meer. Foutmeldingen van
   recept-voorstellen (`brew-model.js`) in het Engels. Uitleg: "goes to the AI you picked in Settings".
4. **"Wat is er nieuw"** helemaal weg (HTML, CSS, `toonNieuws/sluitNieuws/nieuwsMisschien`).
5. **Tabbalk**: dichte achtergrond `--card-2` (geen doorschijnende blur meer) en `z-index:40`, zodat
   niets (ook kaarten met eigen z-index) erdoor of erachter uitsteekt. Toast/overlays liggen erboven.
6. **Home**: de zin "Choose a recipe, brew your coffee and save the result under Brews." is weg.
7. **Tabbalk met social** (ingelogd + follow & feed): Home, Beans, Brews, Feed, Learn. Settings is dan
   een getekend tandwiel (44×44, open paden) rechtsboven op Home naast ▤ ◗ ▮; Learn-kaart op Home weg.
   Zonder social blijft het Home, Beans, Brews, Learn, Settings. In Settings via het tandwiel licht
   Home op in de balk.
8. **Methode-plaatjes**: zie "Oorzaak" hieronder. Fix: `methodById` valt voor een onbekende id terug op
   de standaardmethode met die id (met tekening en kleur), anders een neutrale met een standaardtekening;
   `methodImg` slaat een pad/upload over dat `BrewSecurity.imageUrl` afkeurt en neemt dan de
   standaardtekening; `iconHTML` probeert bij een laadfout eerst de standaardtekening (`data-std`),
   pas daarna de glyph.
9. **Home-knoppen**: "＋ new brew" | "brew ideas" in twee gelijke kolommen (zelfde opmaak/hoogte),
   Coffee coach eronder over de volle breedte. "brew ideas" opent Brews → brew ideas (en onthoudt die kant).
10. **Naamgeving brew ideas** (alleen waar het een recept uit brew ideas bedoelt):
    - brew-formulier kaart "recipe" → "brew idea"; "no recipe (yet)" → "no brew idea (yet)";
      "write your recipe" → "write your own brew idea"; "open recipe above" → "open brew idea above"
    - recepteditor: "own recipe/edit recipe" → "own/edit brew idea", "save recipe" → "save brew idea",
      "delete this recipe(?)" → "delete this brew idea(?)", "…when you pick this recipe" → "…this brew idea",
      standaardnaam "my recipe" → "my brew idea", toasts "brew idea saved/deleted"
    - Brews → brew ideas: "Search a recipe" → "Search brew ideas", "＋ Own recipe" → "＋ Own brew idea",
      "All/Base/Own recipes" → "All/Base/Own brew ideas", labels "Base/Own brew idea",
      "Brew with this recipe" → "Brew with this idea", "No recipes for this choice." → "No brew ideas …"
    - brew-detail: "Recipe for this brew" → "Brew idea for this brew", "Make this my own recipe" →
      "Make this my own brew idea", "No full recipe was kept…" → "No brew idea was kept…"
    - coach: "Recipe proposal" → "Brew idea proposal", "Save as own recipe" → "Save as own brew idea",
      "Recipe saved. Find it under Recipes → Own recipes." → "Brew idea saved. Find it under Brews → brew ideas.",
      "Selected recipe" → "Selected brew idea"; feed-try toast "in your recipes" → "in your brew ideas";
      Home "Choose a recipe" → "brew ideas"; subtitel recepteditor aangepast.
    - Bewust gelaten: "surprise me — a new recipe for a bean", "Ask for a recipe" (AI), "the recipe runs
      with the clock" (gietcoach), learn/water-teksten ("simple recipes per method"), AI-instellingen.
11. **Bean wishlist leeg**: de uitlegtekst eronder is weg; alleen de kop met "still empty".
12. **#pc-pick AeroPress**: knoppen "standard" en "inverted" (eigen recepten houden hun naam). De rij
    wordt alleen opnieuw opgebouwd als de inhoud verandert (anders kregen de knoppen bij elke render
    nieuwe getekende randen = wiebelen); selectie wisselt via de class. `#pc-pick .lp` zonder
    transition/animation/transform.
13. **Geen personen in namen/uitleg** (id's ongewijzigd, opgeslagen recepten en brews breken niet):
    Hoffmann V60 → "two-pour V60", Kasuya 4:6 → "4:6 method", Rao spin → "one pour + spin",
    Chemex klassiek → "classic Chemex", Switch hybride → "Switch hybrid", Hoffmann AeroPress →
    "standard AeroPress", Tay omgekeerd → "inverted AeroPress", melkbasis → "milk base".
    AeroPress-uitleg "James Hoffmann: …" weg (lege `over`, `#pc-over` toont dan alleen maling/temp);
    uitleg inverted zonder naam en grinder; BREW_GUIDES aeropress "(Hoffmann)" weg en tip zonder
    "Tay"/wereldkampioen. Alleen code-comments noemen nog namen.
14. **Recepteditor: bovenaan werkt door in het schema** (`app/04-brew-formulier.js`):
    dose → water loopt mee met de verhouding en het schema schaalt mee; water → verhouding volgt en
    het schema schaalt mee (laatste giet = totale water; zonder afronden tijdens het tikken, het veld
    toont afgerond); de laatste giet in het schema aanpassen schrijft het totale water bovenaan (dus
    niet twee keer invullen); temp en doeltijd veranderen mee in staptekst ("93°C", "0:28").
    Beginwaarden worden bij focus vastgelegd, zodat ook een AI-voorstel dat de velden zet klopt.
15. **Recepteditor, methode-rij** (`#rec-methods`): één rij, alleen zijwaarts scrollen
    (`flex-wrap:nowrap; overflow-x:auto; overflow-y:hidden; touch-action:pan-x`); alleen methodes met
    `on`. Bij een V60 een schakelaar **with Switch · valve per step** als je een Switch als methode of in
    je gear hebt (zelfde klep-per-stap als de vaste Switch-recepten bij de V60 in de gietcoach);
    aan = klep-kolom in het schema en de klep wordt opgeslagen. Opent een recept met klep-stappen,
    dan staat hij vanzelf aan. Verborgen omdat ze voor de gekozen methode nergens toe doen:
    - "let AI draft the schedule" + uitlegregel bij espresso (de AI schrijft alleen giet-schema's);
    - de klep-kolom behalve bij Switch / V60 met Switch;
    - stap-soorten die niet bij de methode horen (filter: geen shot/milk, flip/press alleen AeroPress;
      espresso: geen bloom/pour/swirl/stir/drawdown); een opgeslagen andere soort blijft wel staan;
    - bij "grind setting" stonden ook drippers/weegschalen uit je gear als molen-knop: nu alleen molens.
    Stap-soorten en klep staan nu in het Engels in de keuzelijst (pour, stir, wait, drawdown, valve
    closed/open …); de opgeslagen waarden blijven gelijk.

## Oorzaak methode-plaatjes (punt 8)

Live kon ik niet bekijken (de omgeving liet geen bezoek aan de live site toe), dus dit is uit de code
afgeleid. `brewCard` → `methodById(b.method)` → `iconHTML`. Methodes worden **niet** gesynct
(`KINDS` in account-worker: bean, brew, gear, recipe, dial), brews wel. Een brew met een methode die op
dit toestel niet in `state.methods` staat (gesynct van een ander toestel, of een oude state) kreeg de
nood-methode `{name:id, glyph:'☕'}` zonder `img` → geen plaatje. Daarnaast: een opgeslagen `img`/
`customImg` die `BrewSecurity.imageUrl` afkeurt of die niet laadt, gaf alleen de glyph. In de
nakijkversie draait een verse demo-state met alle standaardmethodes (en ingebedde plaatjes), daarom
daar wel. Beide wegen vallen nu terug op de standaardtekening; test bootst beide na. Onzeker: als Jesse's
toestel een heel andere oorzaak heeft (bv. Safari en `mix-blend-mode` + filter), lost dit dat niet op.

## Tests

- `npm run build` ok.
- Node (lijst uit package.json): **57/57** groen (was 53; +4 in `tests/stem-server.test.mjs`:
  toegang/503, server-sleutel + telling + standaardstem, atomaire daglimiet + terugtellen + geen lek,
  eigen sleutel telt niets).
- Playwright chromium (executablePath /opt/pw-browsers/chromium, --trace off, lokale config niet
  gecommit): **73/73** groen (was 63; +10 in `tests/na-live-1.spec.cjs`).
- Aangepaste bestaande tests: kleine-punten (tabbalk met social, tandwiel), aeropress/gietcoach/
  kleine-klussen (nieuwe receptnamen, standard/inverted), volgen (feedkleur `--accent`, toast
  "in your brew ideas"), workspace (Engelse statusregel).

## Screenshots (390×844, @2x, fonts niet geladen in de testomgeving)

- `werk/screens-na-live-1/settings.png` — Settings met bruine grote kaart
- `werk/screens-na-live-1/settings-coach-voice.png` — coach voice met Lets Brew voice / own key (social aan: tandwiel-modus)
- `werk/screens-na-live-1/recepteditor.png` — recepteditor: methode-rij, with Switch, dose/water
- `werk/screens-na-live-1/beans.png` — Beans, "In stock" bruin, lege wishlist zonder tekst
- `werk/screens-na-live-1/ai-vraagscherm.png` — Coffee coach met "Ask Lets Brew AI" en getekende iconen
- `werk/screens-na-live-1/home.png`, `home-social.png` — Home zonder intro, knoppen, tabbalk met/zonder social

## Keuzes

- Contrast cream op `--accent-soft` is ±4,5:1 (net AA); dat is de huisstijlvulling voor knoppen.
  Feed bleef donker (achter foto's nodig) maar nu bruin `--accent`.
- Stemlimiet 300 vast in code (`STEM_LIMIET`), niet in env.
- Standaard bij Lets Brew voice zonder gekozen stem en zonder `ELEVENLABS_VOICE_ID`: de server geeft
  400 → app valt terug op telefoonstem met de melding "pick a voice from the list first".
- "＋" in "＋ new brew" is hetzelfde teken dat de app al overal gebruikt (geen emoji-icoon).

## Open / onzeker

- Jesse moet `ELEVENLABS_API_KEY` (en eventueel `ELEVENLABS_VOICE_ID`) als Worker-secret/var zetten;
  zonder werkt alles met de telefoonstem.
- Punt 8: oorzaak niet live bevestigd (zie boven).
- Recept-uitleg en stappen blijven Nederlands (huisstijlregel: BREW_GUIDES/recepten), alleen de namen
  zijn Engels. Opgeslagen eigen recepten die ooit "my hoffmann v60" heetten houden die naam (eigen inhoud).
- De handleiding (skill lets-brew-handleiding) is niet bijgewerkt.
