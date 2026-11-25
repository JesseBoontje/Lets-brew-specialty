# Overdrachtsbon

Laatst bijgewerkt: 2026-11-25 (overdracht naar nieuwe sessie, branch functie/nakijk-en-route)

## Waar Jesse om vroeg
"Zet de skill architect in, bekijk de repository. Zoek uit wat de app is, probeer
te vereenvoudigen en de structuur beter te maken, met behoud van features.
Bedenk nieuwe features of logica. Nieuwe artifacts en bewegende visuals. Doe een
poging om de app heel vet te maken, inclusief database en login en een MCP voor
Claude. Nog ideeën?"

## Wat af is
- Skill architect staat in .claude/skills/architect (actief in deze repo).
  Account-skill: Jesse moet het bestand zelf uploaden op claude.ai.
- app-core.js (8194 regels) is zonder inhoudelijke wijziging opgesplitst in
  app/01-kennis.js t/m app/12-hulp-en-start.js, in dezelfde volgorde.
  Laadvolgorde gecontroleerd op verwijzingen naar latere bestanden: geen.
  Alle 14 node-tests en 15 Playwright-tests (mobiel Chromium) slagen.
  Service worker cache verhoogd naar de volgende versie.

## Wat half is / wacht
- Keurmeester: opsplitsing GOEDGEKEURD (alle 10 punten, webkit alleen via GitHub-check).
- Pull request #12 staat open. GitHub-check (incl. webkit) slaagt. Beide
  Cloudflare Workers Builds falen direct (0 seconden, voor het bouwen); lokaal
  slaagt `wrangler deploy --dry-run`. Oorzaak zit in Cloudflare, logs alleen in
  het dashboard. Geen testlink, dus niet mergen voordat dit is opgelost.
- Twee Cloudflare-accounts aan de repo: 7d5fa36f... (Worker letsbrewspecialty,
  de live app, staat in wrangler.jsonc) en 237620b0... (Worker
  lets-brew-specialty, leeg, aangemaakt 7 nov; dit account ziet de
  Cloudflare-koppeling van Claude). Jesse moet zeggen welke het hoofdaccount is.
- Al bestaand, niet door de opsplitsing: V60 15 g op 1:16 geeft waterveld 240 g,
  maar receptregel en gietschema zeggen 251 g (recept rekent met 1:16,7).
- Inlog + D1 + MCP: wacht op Jesse's keuze voor de inlogmanier.

## Valkuilen
- De cloudomgeving kan workers.dev niet openen: keuren gebeurt lokaal.
- @playwright/test in de repo is 1.64.1, de browser in de omgeving is van 1.63:
  start met executablePath /opt/pw-browsers/chromium-1243/chrome-linux64/chrome,
  alleen het chromium-project (webkit is niet geïnstalleerd).
- Code in app/ deelt globale namen tussen bestanden (klassieke scripts).
  Code die bij het laden draait mag geen naam uit een later bestand gebruiken.

## Besluiten van Jesse (2026-11-19, tweede ronde)
- Hij zet de volledige Cloudflare-koppeling aan op claude.ai (connectors) en
  start daarna een nieuwe sessie. Die sessie zoekt uit waarom beide Workers
  Builds direct falen en welk account het hoofdaccount is.
- Inlog en functies: hij kiest in de keuzelijst
  https://claude.ai/artifact/9rSsUxqiN7tkyGho44H6Q2 (per functie behouden /
  aanpassen / weg, nieuwe ideeën bouwen / aanpassen / weg, inlog Face ID /
  mailcode / koppelcode). Uitlezen met ArtifactData list op collectie
  "keuzes" (doc-id = functie-id, velden keuze en notitie). Bron van de pagina:
  docs/keuzelijst.html (inwikkelen met de mockup-bouwer van nieuwe-feature).
  Werkt bewaren niet, dan plakt hij een tekst die begint met "Keuzes voor Lets Brew".
- Verschil 240/251 g: opgelost in commit c71b071 (gietschema volgt eigen
  verhouding), goedgekeurd. Advies keurmeester verwerkt: een nieuw of bewerkt
  formulier begint weer op de verhouding van het recept.

## Stand 19-11 middag
- Keuzes van Jesse staan in werk/keuzes-2026-11-19.md (inlog: Face ID).
- Gedaan en goedgekeurd: weekoverzicht en nachtstand weg, smaakgeheugen
  standaard uit (commit ec44b71 e.v.).
- Drie opzetten gepubliceerd, wachten op Jesse's oordeel:
  - gietcoach V60/Switch https://claude.ai/artifact/AXJ9DLfCgbvqt3sWB9UAN1 (docs/opzet-gietcoach-v60.html)
  - AeroPress normaal/omgekeerd https://claude.ai/artifact/TVMyY3yJt45oMQw58mtToP (docs/opzet-aeropress.html)
  - shot clock E61 https://claude.ai/artifact/STNHN6rDgvJXxiHnJcLmNQ (docs/opzet-shotclock-e61.html)
  Open vraag shot clock: telt de rust mee in de doeltijd (nu ja: 5+3+28 = 0:31)?
- Inbouwen van de opzetten: app/04 (filter, gietcoach), app/05 (espresso, shot
  clock), recepten in app/01 (AeroPress-recepten van de opzet vervangen het
  bronloze 16 g/240 g-recept; omgekeerd recept toevoegen; pre-infusie en rust
  als recept-instelling). Featurevlaggen houden (pourcoach, shotclock).

## Onderbreking 19-11
- Om ongeveer 12:00 UTC stopte het natekenen van de Hario-ketel en -server door
  de 5-uurslimiet van het abonnement (reset 12:40 UTC). Om 13:11 UTC hervat.
  Shot clock-opzet (alleen volle druk telt) was al af en gepubliceerd (versie 2).

## Besluit Jesse over volgorde en verbruik (19-11)
- Eerst de kleinere klussen, het grote werk (Face ID + database, Claude-koppeling,
  AI-coach centraal) later. Schatting hele verbouwing ±7 miljoen tokens, 2 tot 4
  keer de 5-uurslimiet. Per klus een nieuwe sessie; één keuring per klus.
- Kleinere klussen, in deze volgorde: brews aan bonen koppelen; gietcoach
  V60/Switch inbouwen; AeroPress-recepten en -coach; shot clock met pre-infusie,
  rust, alleen volle druk telt, tarra-vak en gewichten in my gear; daarna
  versheidsmeter met piekmelding, surprise me, delen als pagina/PDF (brews en
  bonen), AI-budget realistischer.
- V60 en server in de opzet nagetekend naar Jesse's foto (Hario V60 wit
  keramiek op glazen server met rond handvat).

## Eerstvolgende stap
0. (klaar) Hario-tekening in de V60-opzet, opnieuw gepubliceerd op
   https://claude.ai/artifact/AXJ9DLfCgbvqt3sWB9UAN1
1. Cloudflare-koppeling gebruiken: buildlogs van beide Workers Builds lezen,
   oorzaak oplossen, preview-link halen, Jesse testlink geven.
2. Keuzes uitlezen, takenbord vullen, per keuze een klus (aannemers alleen waar
   het loont, max 3, elk eigen deel van app/).
3. Mergen alleen na akkoord van Jesse.

## Stand 20-11
- Jesse besloot: eerst de kleinere klussen; Cloudflare (build, database, inlog,
  Claude-koppeling) later. Volgorde: 1 brews aan bonen, 2 gietcoach V60/Switch,
  3 AeroPress, 4 shot clock met tarra-vak. Eén keuring per klus.
- Klus 1 gebouwd in commit 8bbbe57: BrewModel.linkBeansByName (brew-model.js),
  koppelblok bovenaan brews (unlinkedHTML in app/07, aangeroepen vanuit
  brew-workspace.js renderAll), boon verplicht in saveBrew/saveDialInBrew
  (vraagBoon in app/05), nieuwe boon onderweg (openBeanForm(wens,terug) in
  app/07), demo-brews met boon (app/02). Test: tests/bean-link.spec.cjs.
- Valkuil: brew-workspace.js overschrijft renderAll uit app/03. Wijzigingen
  aan de brews-lijst horen in brew-workspace.js.
- Lokaal testen: maak pw-local.config.cjs (staat in .git/info/exclude) met
  alleen chromium en executablePath; eerst `npm ci`.
- Geen testlink mogelijk zolang de Cloudflare-build faalt.
- 20-11 middag: klus 1 GOEDGEKEURD na 3 keurrondes (zie werk/archief/
  2026-11-20-brews-aan-bonen.md). Laatste commit b6194cc, CACHE scc-v104.
- Eerstvolgende stap: klus 2, gietcoach V60/Switch inbouwen volgens
  docs/opzet-gietcoach-v60.html (tekening ketel > V60/Switch > server, grote
  teller, strook vorige/nu/straks, 3 tellen aftellen, voice onderin, 5 g/s
  gietsnelheid in plaats van 8). Bestaande code: app/04 vanaf "getekende
  zetters" (BREWER_ART, paintBrewer) en "pour coach" (pc, pourStart, pourSteps).
  Daarna klus 3 AeroPress, klus 4 shot clock + tarra-vak. Per klus een sessie.

## Stand 20-11 avond: klus 2 gietcoach V60/Switch
- Gebouwd in commit 530ac5a: nieuw bestand app/04-gietcoach.js (laadt na
  app/04-brew-formulier.js; naam moet passen in de build-regex
  [0-9]{2}-[a-z-]+.js). CSS onderaan styles.css, alles onder #gietcoach, ids
  in de tekening beginnen met gc-. pourToggle opent bij gcPast(mid) (V60 of
  Switch) de grote coach; andere filtermethodes houden de oude klok.
- Coach leest pc.steps (eigen recept, dosis, verhouding), gietsnelheid 5 g/s,
  droogvenster uit de tekst van de laatste stap ("droog rond 3:00 tot 3:30"),
  anders laatste stap +60 s (Switch +45 s). Klaar zet pc.total/draw/marks en
  roept pourFill() aan, net als de oude klok.
- Testhaakjes: gc.snelheid(n), gc.stand(). Test: tests/gietcoach.spec.cjs.
- CACHE scc-v105. Alle 22 Playwright (chromium) en 14 node-tests groen.
- Na akkoord: handleiding bijwerken (skill lets-brew-handleiding).
- Klus 3 (AeroPress) kan dezelfde opbouw volgen: kopieer de aanpak van
  app/04-gietcoach.js naar een eigen bestand (bijv. app/04-aeropress.js) met
  de tekening uit docs/opzet-aeropress.html; gcPast niet uitbreiden maar een
  eigen past-functie in pourToggle.

## Klus 2 GOEDGEKEURD (20-11 avond)
- Na 3 keurrondes goedgekeurd, zie werk/archief/2026-11-20-gietcoach-v60-switch.md.
  Laatste commit e34a805, CACHE scc-v107.
- Valkuil: in #gietcoach geen overflow:hidden op Caveat-tekst; de schuine
  letters steken buiten hun vak en worden dan afgeknipt.
- Cloudflare "letsbrewspecialty" faalt sinds cd6ee76 (slaagde bij 530ac5a).
  Niet door de code te verklaren; Jesse heeft Cloudflare naar later geschoven.
  Wel melden bij elke klus.

## Eerstvolgende stap (opvolger)
1. Klus 3: AeroPress normaal en omgekeerd volgens docs/opzet-aeropress.html
   (recepten uit de opzet vervangen het bronloze 16 g/240 g-recept in app/01,
   omgekeerd recept erbij). Zelfde opbouw als app/04-gietcoach.js, eigen
   bestand, eigen past-functie in pourToggle. Eén keuring, dan Jesse melden.
2. Klus 4: shot clock E61 met pre-infusie, rust, alleen volle druk telt,
   tarra-vak en gewichten in my gear, volgens docs/opzet-shotclock-e61.html
   (app/05, recept-instellingen in app/01, my gear in app/06/11).
   Per klus een eigen sessie. Niet mergen zonder akkoord van Jesse.

## Stand 20-11 nacht: klus 3 AeroPress
- Gebouwd in commit 01accb6: app/04-aeropress.js (eigen bestand, laadt na
  04-gietcoach.js, gebruikt diens GC_*-constanten). apPast(mid) in pourToggle
  (alleen echte AeroPress, geen "French press"). Scherm #apcoach met dezelfde
  CSS als de gietcoach (:is(#gietcoach,#apcoach)), tekening-CSS onderaan styles.css.
- Tekening volgt de soort stap; bij "wacht" de tekst (plunjer/lucht/dop, zie
  apActie). Omgekeerd volgt recept.houding; keer-stap = omdraaien.
- Recepten: 'aeropress' is nu Hoffmann (11 g/200 g), nieuw 'aeropress-om' Tay
  (18 g, 100 g, aanvullen 115/155 g). Bij AeroPress staan beide in de recept-rij.
- pourFill vult bloom alleen bij een echte bloom-stap.
- CACHE scc-v108. Lokaal 25 Playwright (chromium) + 14 node-tests groen.
- Testhaakjes: ap.snelheid(n), ap.stand(), ap.scene(t). Test: tests/aeropress.spec.cjs.

## Klus 3 GOEDGEKEURD (20-11 nacht)
- Ronde 2 goedgekeurd, zie werk/archief/2026-11-20-aeropress.md. Laatste
  commit 8f4e698, CACHE scc-v109.
- Valkuil: brewerArtKey maakt van elke naam met "press" een aeropress; voor
  coach en recepten altijd apPast(mid) gebruiken, niet isAeropress.
- Valkuil: poort 4175 kan bezet zijn door een eerdere test-server
  (pkill -f test-server.mjs).
- Na akkoord: handleiding bijwerken (skill lets-brew-handleiding) voor klus 2 en 3.

## Eerstvolgende stap (opvolger)
1. Klus 4: shot clock E61 met pre-infusie (5 s), rust (instelbaar, 3 s), alleen
   volle druk telt voor de doeltijd, tarra-vak en gewichten in my gear, volgens
   docs/opzet-shotclock-e61.html en werk/keuzes-2026-11-19.md (app/05,
   recept-instellingen in app/01, my gear in app/06/11). Zelfde aanpak als
   app/04-gietcoach.js en app/04-aeropress.js: eigen bestand (bijv.
   app/05-shotclock.js), CSS-shell hergebruiken via :is(...). Featurevlag shotclock.
   Eén keuring, dan Jesse melden.
2. Niet mergen zonder akkoord van Jesse. Cloudflare-builds blijven falen (later).

## Stand 20-11: klus 4 shot clock E61
- Gebouwd: app/05-shotclock.js (laadt na 05-espresso-dial-in.js). Volledig
  scherm #shotclock, eigen CSS onderaan styles.css (#shotclock ...), ids sc-.
  De kaart "Shot timer" op het dial-in-scherm opent hem (e61Toggle -> shot.openen).
- Recept: state.lastRecipe[formMethod] (espresso), doel uit pendingTarget.
  Pre-infusie: ESPRESSO_RECIPES[].pre in app/01, eigen instelling in
  state.recipePre[recept-id] ('target' zonder recept). Standaard 5 s + 3 s.
- Alleen volle druk telt: plan() fs = pre+rust, band lo..hi = F±3 s.
  "use" vult di-time met de seconden volle druk, di-yield als nagewogen,
  di-dose uit het tarra-vak, formPrep.preinf, en diShot -> brew.shot
  ({pre,rest,full,total,drop,yieldEstimated}); detail toont "shot clock".
- Tarra: state.tare {naked,spout,ring,ps1,ps2,cup} (profiel > Mijn setup >
  my gear, renderTareGear) en state.tareOn. SCHEMA.md bijgewerkt.
- Valkuil: e61Run bestond niet meer; weegschaal-koppeling (app/09) kijkt nu
  naar shot.loopt().
- Testhaakjes: shot.snelheid(n), shot.stand(). CACHE scc-v110.
- Lokaal 30 Playwright (chromium) + 14 node-tests groen.

## Klus 4 GOEDGEKEURD (20-11)
- Zie werk/archief/2026-11-20-shotclock-e61.md. CACHE scc-v111.
- Wacht op Jesse: testen op zijn telefoon (zodra er een testlink is) en akkoord.
- Volgende klussen (volgorde Jesse): versheidsmeter met piekmelding, surprise me,
  delen als pagina/PDF (brews en bonen), AI-budget realistischer. Per klus een sessie.
- Na akkoord: handleiding bijwerken (skill lets-brew-handleiding) voor klus 2, 3 en 4.

## Nieuwe wens 20-11 middag: stem met ElevenLabs
- Jesse wil de stem in de app met ElevenLabs, "V4" = model `eleven_v4` (nieuwste
  voorleesmodel; kent toontags zoals [warmly], [pause]; geen snelheidsinstelling;
  per teken 2x zo duur als flash/turbo). ElevenLabs is een nieuwe aanbieder; Jesse
  vroeg er zelf om.
- Niet bouwen tot Jesse twee vragen beantwoordt:
  1. Waar komt de stem: stappen hardop in gietcoach/AeroPress/shot clock,
     live spraakcoach (nu OpenAI), en/of AI-coach voorlezen.
  2. Wiens sleutel: eigen ElevenLabs-sleutel per gebruiker via de Worker
     (aanbevolen, zelfde patroon als de spraak-API nu) of één vaste sleutel van
     Jesse in Cloudflare secrets (dan betaalt Jesse voor iedereen; rem nodig).
- Klus 1 t/m 4 zijn alle goedgekeurd (zie archief). Alles in PR #12, niet gemerged.
- Antwoorden doorgegeven via een andere sessie (20-11 13:30 UTC), nog door Jesse
  te bevestigen in deze sessie: vraag 1 "allemaal" (stappen hardop in
  gietcoach/AeroPress/shot clock, live spraakcoach in plaats van OpenAI, AI-coach
  voorlezen); vraag 2 "A" (eigen ElevenLabs-sleutel per gebruiker via de Worker,
  alleen in tabbladgeheugen, nooit in back-up of database). Model eleven_v4.
  Zonder sleutel blijft de huidige stem werken (terugval).
- BEVESTIGD door Jesse (20-11 13:36 UTC, letterlijk via zijn sessie): "Ja
  elevenlabs stem maar die potentiele api verbinding". Dus: bouwen als koppeling
  die klaarstaat zodra een gebruiker zijn eigen ElevenLabs-sleutel invult (via de
  Worker, alleen tabbladgeheugen), op alle drie plekken; zonder sleutel de
  huidige stem. Model eleven_v4. Klus 5, nieuwe sessie, één keuring.
- 20-11 later: Jesse koos in deze sessie optie 2: EERST ALLEEN stappen hardop
  (gietcoach, AeroPress, shot clock) met ElevenLabs. Live spraakcoach en AI-coach
  voorlezen later als aparte klus. Bouwsessie klus 5 is bijgestuurd.

## Klus 5 VERKLEIND (20-11, besluit Jesse in de hoofdsessie, optie 2)
- Letterlijk: "Ja, maar eerst alleen de stappen hardop (kleinere klus)".
- Klus 5 = ALLEEN ElevenLabs (eleven_v4) voor stappen hardop in gietcoach
  V60/Switch, AeroPress-coach en shot clock. NIET de live spraakcoach (blijft
  OpenAI) en NIET de AI-coach laten voorlezen: die komen later als eigen klus.
- Er is niets gebouwd voor spraakcoach of AI-coach (niets weg te halen).

## Stand 20-11: klus 5 stem gebouwd (commit 48e4dca e.v.)
- brew-stem.js (BrewStem, laadt na brew-model.js): zeg/voorbereid/stil/kan,
  zetSleutel, stemmen (eigen lijst), kiesStemId, stand. Sleutel alleen in een
  variabele (tabblad); stem-id in localStorage scc_el_voice(+_naam).
  Komt een zin niet binnen 1,5 s of faalt hij: telefoonstem (speechSynthesis).
  401 van ElevenLabs: rest van het tabblad telefoonstem. Bij de start worden
  alle zinnen van het recept alvast opgehaald, één tegelijk, met cache.
  In de eerste tik wordt een stil blob-geluid gespeeld (iPhone-ontgrendeling).
- Worker: POST /api/stem/voices en /api/stem/zeg in site-worker.mjs (stemRoute).
  Origin moet het eigen adres zijn, JSON, Bearer-sleutel (sk_ + 32-128 tekens),
  body max 2 KB, alleen velden text (1-300, geen stuurtekens) en voice_id
  (10-40 letters/cijfers), rem STEM_LIMITER 40/min per IP (wrangler.jsonc,
  namespace 430284717). Doorsturen met xi-api-key, redirect error, timeout.
  Fouten van ElevenLabs worden niet doorgegeven (geen sleutel, geen details).
- Gietcoach en AeroPress: zeg() via BrewStem; shot clock heeft nu ook stem
  (Pre-infusie / Rust / Volle druk / Hendel omlaag bij X gram), aan/uit in het
  recept-paneel, gedeeld met scc_gc_stem.
- Instellingen > make it smart > "voice for the coaches": sleutel, "load my
  voices", keuzelijst uit eigen account, "test the voice".
- Test: tests/stem.test.mjs (Worker) en tests/stem.spec.cjs (browser).
  tests/app.spec.cjs telt nu twee sleutelvelden (ai-key, stem-key), geen inlog.
- CACHE scc-v112. Lokaal 35 Playwright (chromium) + 20 node-tests groen,
  wrangler dry-run goed, npm audit 0.
- Niet lokaal te testen: echte ElevenLabs (geen sleutel, en eleven_v4 als
  model-id niet zelf nagegaan), geluid op een echte iPhone, Cloudflare-rem.
- Geen testlink: Cloudflare-build faalt nog (Jesse heeft dat naar later geschoven).

## Klus 5 GOEDGEKEURD (20-11)
- Eén keurronde, zie werk/archief/2026-11-20-stem-elevenlabs.md (met 4 kleine
  opruimpunten voor later).
- Bestond al, apart aan Jesse gemeld: observability in wrangler.jsonc kan
  request-headers loggen; onbevestigd of Authorization (eigen OpenAI- en
  ElevenLabs-sleutel) wordt weggelakt. Oplossing: in dashboard nakijken, of
  "logs":{"invocation_logs":false}. Wacht op Jesse.
- Wacht op Jesse: testen met eigen ElevenLabs-sleutel zodra er een testlink is.
- Volgende klussen (volgorde Jesse): versheidsmeter met piekmelding, surprise me,
  delen als pagina/PDF, AI-budget realistischer; later ElevenLabs voor
  spraakcoach en AI-coach. Per klus een sessie. Niet mergen zonder akkoord.

## Stand 21-11: kleine klussen (branch functie/kleine-klussen)
- Opdracht Jesse: alle kleine klussen in één sessie: (1) versheidsmeter met
  piekmelding (geen zak-teller, natuurlijke plek), (2) nu zetten-knop wordt
  surprise me, (3) AI-budget realistischer. Niet: oude app weghalen, vraag
  doorlooptijd/filterkompas/slim invullen.
- Gebouwd (commit op functie/kleine-klussen, CACHE scc-v113):
  - app/07-bonen.js: roastDays, freshPeak (leert uit eigen scores: cijfer min
    gemiddelde van die boon, glad per dag, venster binnen 0,4 van de top;
    ≥5 cijfers van de boon of ≥8 over ≥2 bonen, spreiding ≥6 dagen; anders
    filter dag 4-21, espresso/onbekend dag 7-21), peakLineFor. beanFreshness
    gebruikt nu het venster voor zijn label.
  - Meter (app/11 freshGaugeHTML) tekent het venster en een zin eronder
    (freshPeakText, niet op het brew-detail). Home: #peak-line, renderPeakLine
    in app/03, vlag peakalert. Tik = naar bonen met die boon open.
  - app/04-surprise.js (nieuw, in index.html en service-worker): surpriseOpen,
    surMaak (zonder AI), surpriseAI (BrewModel.validateRecipe, bron 'surprise'),
    surpriseZet bewaart als eigen recept en start via BrewWorkspace.startRecipe.
    Brew-now-knop + brewNow + quickBrew-override in brew-workspace.js weg.
    Vlag surprise (oude vlag brewnow doet niets meer). Senseo doet niet mee;
    recepten met klep-stappen alleen op de Switch.
  - AI-budget: zie werk/keuze-ai-budget-2026-11-21.md.
  - Test: tests/kleine-klussen.spec.cjs. Lokaal 39 Playwright (chromium) + 20 node groen.
- Volgende stap: keurrapport lezen, fouten laten herstellen, PR naar main
  openen, Cloudflare-preview melden (of lokaal getest). Niet mergen zonder Jesse.
- 21-11: ronde 1 afgekeurd, hersteld in c98c699, ronde 2 GOEDGEKEURD
  (werk/archief/2026-11-21-kleine-klussen.md). CACHE scc-v114. PR naar main
  geopend; wacht op Jesse. Na akkoord: mergen en handleiding bijwerken.
- PR #14: https://github.com/JesseBoontje/Lets-brew-specialty/pull/14
  Preview (live account): https://functie-kleine-klussen-lets-brew-specialty.jesseboontje-1aa.workers.dev
- Valkuil: Cloudflare maakt PR-previews met `npx wrangler preview`; die eist een
  "previews"-blok in wrangler.jsonc (toegevoegd, eigen rem-nummers 430284726/728).
- Valkuil: twee oude koppelingen (7d5fa36f letsbrewspecialty, 237620b0
  lets-brew-specialty) blijven rood. GitHub toont bij gelijke checknaam alleen de
  laatste. Echte stand van het live account: Cloudflare API
  /accounts/1aaa91af.../builds/workers/8040b219eaf14594aeb8d1e9841b7bdf/builds
  (preview-trigger) en .../workers/f0e271eb8e4f4062bf24443941d7c835/builds (main).
- GitHub-check `checks` is rood op PR #14 door 6 WebKit-tests (shotclock.spec 2,
  stem.spec 4) die op main (10c3653) precies zo falen. Niet door deze PR;
  eigen klus op het takenbord.

## 24-11: oude app vervangen (besluit Jesse: "Oude app mag vervangen worden back up is gedaan")
- Oude adres https://letsbrewspecialty.jesseboontje.workers.dev (account 7d5fa36f,
  Worker letsbrewspecialty) toont nu een verhuispagina (map oud-adres/, eigen
  wrangler.jsonc, uitrollen met `npx wrangler deploy` in die map; versie 846b2874).
  - Leest de oude gegevens op dezelfde plek (IndexedDB scc_db/kv/scc_state, anders
    localStorage scc_state) en biedt ze als lets-brew-specialty-backup.json aan;
    nieuwe app importeert dat (getest). Er wordt niets gewist: terug te draaien
    door de oude versie 68bcda9b weer uit te rollen in het dashboard.
  - /service-worker.js ruimt de oude service worker en caches op.
  - Bestanden als tekst in het script (assets-upload werkt niet via de proxy:
    die gebruikt een eigen sleutel die de proxy overschrijft).
- Git-triggers van account 7d5fa36f verwijderd (geen rode checks meer van
  "letsbrewspecialty"). Account 237620b0: geen toegang, Jesse moet loskoppelen.
- Nog onbekend: of Bart en Ralph hun data al hebben overgezet; de pagina laat
  ze dat zelf doen.

## 24-11: opdracht via hoofdsessie (Jesse): zuinig werken, antislop-ontwerp
- Letterlijk (doorgegeven): "Beperk usage ... Stop bij 95% ... Maar wat uiterlijk en
  startscherm betreft wordt het nu AI-slop. Houd tekenstijl met dubbele
  onafhankelijke lijnen in stand overal rond alle kaders. Zoek antislop design
  skills, voeg toe en maak op die manier de app af."
- 95% kan Claude niet meten (verbruik niet zichtbaar). Zuinig: zelf doen, max één
  aannemer, één keuring per klus, bon na elke klus pushen.
- Skill .claude/skills/frontend-design toegevoegd (uit anthropics/skills) met
  bovenaan: huisstijl Lets Brew gaat voor; elke rand twee eigen paden.
- Opzet startscherm: docs/opzet-startscherm.html, artifact
  https://claude.ai/artifact/8TzG92J7TX7k2xz6NuDnGv . Randen per kader met JS
  uitgerekend (seed per kader, 4 zijden x 2 paden, overschot 5-10 px, kruisen
  bij de hoeken). Valkuil: een algemene svg-regel (.x svg{width}) raakt ook de
  rand-svg; gebruik svg:not(.r). Wacht op akkoord Jesse voor inbouwen.
- 24-11 reactie Jesse (via hoofdsessie): "3 idee gaat goede kant op, behoud
  kleurverschillen vanuit originele app, lijnen zijn goed maar maak de hoeken
  rond. En iconen waren enkele versies terug nog veel mooier ... gemaakt met Canva."
  Versie 2 op dezelfde link: de 'Canva-iconen' zijn Jesse's methodetekeningen
  m-*.png (sinds juli ongewijzigd in de repo) + logo.png; methodetinten
  (--v60/--aeropress/--espresso) als achtergrond; randen = per pass één open
  contour rond een afgeronde rechthoek (radius uit CSS), twee passes met eigen
  afwijking. Bouwen (docs-bestand verwijst naar ../m-*.png; bij bouwen van het
  artifact worden die als data-URI ingevuld). Wacht op akkoord Jesse.
- 24-11 Jesse over v2 (via hoofdsessie): "Dit is heel goed. Maak redesign van
  app-icoon/logo in zelfde stijl en maak startscherm iets langer zichtbaar, maak
  die ook met nieuwe logo. Tekening bij surprise me is anders dan pourcoach ...
  Misschien bij surprise me nieuwe logo plaatsen, linksboven weghalen. Graag
  eerst mockup." Versie 3 op dezelfde link:
  - nieuw merk (kop op schotel, open lussen, twee halen per lijn, koffie-arcering
    in accent-soft), als woordmerk, als tegel 512/192/iPhone/klein met ronde
    dubbele rand in --card;
  - splash: splash-1..3 blijven (0,75 s), splash-4 wordt het nieuwe logo dat zich
    tekent (stroke-dashoffset 1,1 s) en 2 s blijft; samen 4,25 s; tik = overslaan;
  - surprise me: GC_TEKENING uit app/04-gietcoach.js (statisch, straal en wat
    koffie in de server), merk erbij; logo linksboven weg.
  - docs/gietcoach-tekening.svg.html = de statische versie van de gietcoach-tekening.
  Wacht op akkoord Jesse. Bij inbouwen: icon-192/512.png en apple-touch-icon uit
  het merk maken (Playwright-screenshot van de tegel), manifest.json bijwerken.

## 24-11 avond: startscherm ingebouwd (besluit Jesse via hoofdsessie)
- Letterlijk: "Nieuwe logo is lelijk, ga terug naar oude logo en bouw app, zet live."
  Nieuw logo vervalt; oude logo.png en app-iconen blijven.
- Gebouwd (CACHE scc-v115):
  - app/11-randen.js (nieuw, in index.html en SW): getekende dubbele randen met
    ronde hoeken op .sketch, .ws-card, .ws-actions>button, .ws-filters>button,
    .lp, home-methodes, .btn-reco, .peak-line; vlag drawnedges; hertekent alleen
    als de maat verandert, hooguit 4x per seconde (MutationObserver).
    Niet op <details> (dichtgeklapt toont alleen summary).
  - Splash: splash-1..3 elk 0,75 s, daarna logo.png 2 s (4,25 s); tik = overslaan;
    meteen door bij een link naar een ander scherm, quickbrew of brew-parameter,
    en onder webdriver (tests) tenzij window.__splashTest. Daarvoor sprong de app
    direct naar home zodra de data geladen was.
  - Home: logo linksboven weg; surprise me = statische gietcoach-tekening (zonder
    id's, anders vindt de gietcoach dubbele id's) + logo.png; methodeknoppen in
    hun eigen tint; kop "start with"; brew-kaart als zin (brewZin).
  - Tests: tests/startscherm.spec.cjs. Lokaal 42 Playwright (chromium) + 20 node groen.
- Volgende stap: één keuring, dan (na akkoord) mergen PR #14, live controleren.

## 24-11 21:50 UTC: LIVE
- Jesse koos in de bouwsessie "Ja, zet live". PR #14 squash-merged (main 4394164),
  Workers Builds account 1aaa91af geslaagd; letsbrew.djez.app geeft scc-v116.
- Live doorgeklikt (chromium, iPhone 13): splash, home, randen, surprise me,
  methodeknop naar dial-in, bonen. Console: alleen Cloudflare Web Analytics-
  beacon door CSP geweigerd (bestond al).
- Zelf testen door Jesse: iPhone Safari (splash-tik, randen, beginschermicoon).
- Deze bon staat op branch werk/na-live-2026-11-24 (vanaf main); meenemen in de
  volgende PR.

## 25-11 02:10 UTC: wekker, volgende klus "delen als pagina/PDF"
- Opzet docs/opzet-delen.html, artifact https://claude.ai/artifact/791tb3Bh9Y6pEjqxrAx82i
  Menu op brew en boon: "send as a page" (los HTML-bestand met tekening, via
  navigator.share als bestand), "save as PDF" (bestaand printBrew/runPrint, nu ook
  voor bonen), "send to a Lets Brew user" (bestaand .lbsbrew/.lbsbeans).
  Bestaande code: app/06 shareOneBrew, shareOneBean, brewSheetHTML, runPrint.
- Wacht op akkoord Jesse; daarna bouwen (zelf, geen aannemer), één keuring.

## 25-11: Jesse "1 bouw later" (delen als pagina/PDF: akkoord, later bouwen) en
   "Kan je me een pagina geven waar ik weer aanpassingen aan kan noteren"
- Nakijkversie opnieuw gebouwd en gepubliceerd op een NIEUWE link:
  https://claude.ai/artifact/PzUpyt2vkPAcJR9yYk37i7 (de oude bestond niet meer).
- Bouwer gerepareerd: build-preview.py plakt nu styles.css en alle lokale scripts
  (app/01..12, brew-*.js) in de pagina en haalt de CSP-meta en manifest weg;
  build-review.py zet SPLASH_MS op 300. Zonder dit was de nakijkversie sinds de
  opsplitsing kapot.
- Wacht op: Jesse's geplakte "Opdracht voor Lets Brew" (deel B van de skill).
- Nakijkpunten van Jesse (opmerkingen op de nakijkpagina, 25-11), nog te bouwen in
  één release:
  1. Lettertypes: in de nakijkversie ontbraken ze (bouwerfout, hersteld). Jesse wil
     "1 lettertype": vraag in de chat, advies Patrick Hand overal.
  2. Surprise-me-kaart: "Verwijder deze tekening" (gietcoach-tekening weg, logo en
     tekst blijven).
  3. Methoderij op home: "mag alleen links rechts swipen, gaat nu ook naar boven
     beneden". Oorzaak: padding-top/-bottom op #methods-scroll (overflow-x:auto maakt
     overflow-y ook auto). Oplossing: overflow-y:hidden + touch-action:pan-x
     (verticaal scrollen van de pagina moet blijven werken: pan-x pan-y? test).
  4. Methodeknoppen op home: namen in systeemletter (button zonder font:inherit).
     Oplossing: .method{font:inherit} (en nalopen: andere knoppen zonder font).
  5. Home-knop "Nieuwe kop" -> "New brew" (in brew-workspace.js addAction). Gevraagd
     of de andere Nederlandse home-teksten (Recepten kiezen, Koffiecoach, zin
     erboven, tabnamen) ook Engels worden.

## 25-11: OVERDRACHT naar een nieuwe sessie (Jesse: "Maak hierna een nieuwe branch ivm context, archiveer deze")
Branch: functie/nakijk-en-route (vanaf main 4394164 + werk-commits). Live = main.

Besluiten van Jesse (25-11), letterlijk:
- "Kan je de lettertypen laten zien ik weet niet welke welke is" -> vergelijking:
  https://claude.ai/artifact/SH4cuV5SsUXuR4TSwSs2Tr (Caveat vs Patrick Hand, en
  'alles Patrick Hand' / 'alles Caveat'). WACHT op zijn keuze (advies Patrick Hand).
- "Alle titels in het engels" -> alle vaste titels/knoppen/zinnen in het Engels
  (ook home: Nieuwe kop -> New brew, Recepten kiezen -> Choose a recipe,
  Koffiecoach -> Coffee coach, de zin "Kies een recept...", tabnamen onderin
  Zetten/Bonen/Recepten/Logboek/Leren/Instellingen, en de Nederlandse UI-teksten in
  brew-workspace.js). Receptinhoud, lessen en AI-tekst blijven Nederlands (huisstijl).

Nakijkpunten (opmerkingen op https://claude.ai/artifact/PzUpyt2vkPAcJR9yYk37i7),
samen bouwen in één release, één keuring:
  1. één lettertype (keuze Jesse afwachten);
  2. surprise-me-kaart: gietcoach-tekening weg (logo + tekst blijven);
  3. methoderij home alleen zijwaarts: #methods-scroll overflow-y:hidden (padding
     voor de randen laten), touch-action pan-x pan-y testen;
  4. .method{font:inherit} en andere <button>s zonder font nalopen;
  5. alle titels Engels (zie boven).
  Opmerkingen-threads zijn beantwoord, nog niet 'resolved': na bouwen resolven
  (ArtifactComments resolve, url hierboven).

NIEUWE KLUS (Jesse, letterlijk): "Maak in de nieuwe een route hoe ik en de ai moet
invullen om bij de pourcoach en dial in pagina te komen vanaf beans naar brews naar
dial in en pour coach let op filter espresso en beide"
  -> eerst een opzet (skill nieuwe-feature, mockup-artifact), niets inbouwen:
     de stappen beans -> brews -> dial-in (espresso) of pour coach (filter), en wat
     bij een boon met fam 'both' (omni) gebeurt; per stap wat Jesse invult en wat de
     AI invult/voorstelt (zonder AI ook bruikbaar). Bestaande code: beanFam/b.fam
     (app/07), surMethodes (app/04-surprise.js), beginBrew/openDialIn (app/05),
     pourToggle/gcPast/apPast (app/04), brewBean, renderChooseBean (app/07),
     BrewWorkspace.startRecipe. Laten zien, akkoord vragen.
Later (akkoord, "bouw later"): delen als pagina/PDF (opzet
  https://claude.ai/artifact/791tb3Bh9Y6pEjqxrAx82i).

Valkuilen deze sessie:
- Preview/nakijkversie: build-preview.py plakt nu styles.css, scripts en fonts in
  (fonts in eigen <style> vooraan); build-review.py zet SPLASH_MS op 300.
  Nakijk-artifact publiceren vanuit een kopie in de scratchpad.
- Force-push wordt geweigerd: na een merge een nieuwe branch vanaf main maken.
- Werk zuinig: max één aannemer, één keuring per klus, bon na elke klus pushen.

## 25-11 middag: stand na nakijkronde, route en Brews-tab
Branch functie/nakijk-en-route, laatste app-commit 8e1c999, CACHE scc-v118. 45/45 chromium groen.
Gebouwd (Jesse akkoord): nakijkpunten 1-5 (beide lettertypes houden, geen system-ui meer,
surprise-tekening weg, methoderij alleen zijwaarts, alles Engels); route boon -> dial-in/pour coach
(keuzescherm #route-pop bij omni of meer eigen methodes, b.lastMethod, feature 'route'); vijf tabs
Home·Beans·Brews·Learn·Settings; tab Brews met knoppen "my brews" (=page-brews) en "brew ideas"
(=page-recipes), keuze in localStorage scc_brews_kant.
Jesse 25-11 letterlijk: "Bouw eerst de kleine klussen zet die live laat mij structuur controleren
daarna grote klussen." -> na keuring mergen naar main (PR), Jesse controleert, dan pas grote klussen.
Grote klussen later: inlog + D1 + AI-coach centraal (AI met database van alle brews/beans/gear en
koffietheorie via websearch in de Worker); login-mail letsbrew@djez.app (EEN z; Email Routing zet
Jesse zelf aan, token mag dat niet); delen als pagina/PDF.
Schetsen: route https://claude.ai/artifact/VcgJSLkRAiirkc3AiNSatN , Brews-tab
https://claude.ai/artifact/CgkKmjkyDxmo15kUK8xwy8 , nakijkversie https://claude.ai/artifact/PzUpyt2vkPAcJR9yYk37i7
Jesse vraagt: let op verbruik en context; bij volle context overdracht + nieuwe branch, deze archiveren.

## 25-11 13:30: OVERDRACHT naar een nieuwe sessie (context vol, Jesse: "maak nieuwe branch en archiveer deze")
Live op main (scc-v120): release #15 (nakijkpunten, route, 5 tabs, Brews met my brews/brew ideas),
#16-#22 bonen lezen (foto verkleind als jpeg, echte foutreden, /api/pagina in site-worker.mjs:
alleen Sec-Fetch-Site same-origin, STEM_LIMITER, redirects zelf gekeurd, tekst gefilterd; foto op wishlist).
Jesse heeft de foto/link-fix NOG NIET getest op de iPhone. singleestatecoffee.nl geeft via /api/pagina
bijna geen tekst (waarschijnlijk script-opgebouwd); de app valt dan terug op raden ("partly a guess").

VOLGENDE: de grote klus, stap 1 "slot en sleutel" (branch functie/slot-en-sleutel):
- Cloudflare Access als slot op letsbrew.djez.app (inlog met code per mail), zodat een AI-sleutel
  veilig als Worker-secret kan; app stuurt AI-vragen dan via eigen Worker-route met daglimiet.
- Jesse plakt de sleutel zelf in het dashboard, nooit in de chat.
- Daarna: D1-database (brews, beans, gear) + AI-coach centraal, websearch via de Worker
  (wens Jesse: opbouwende kennis voor filter en espresso). Login-mail letsbrew@djez.app (EEN z);
  Email Routing zet Jesse zelf aan (token mag dat niet).
- Eerst opzet/schets (skill nieuwe-feature) en akkoord, niets inbouwen zonder akkoord.
Werkwijze Jesse: zuinig, max één aannemer, één keuring per klus, kleine stappen pushen, let op
verbruik en context; bij volle context weer overdracht + nieuwe branch + sessie archiveren.
Cloudflare-token in deze omgeving: zones lezen gaat, Email Routing niet; Access-rechten onbekend (eerst
met één GET proberen).

## 25-11 avond: Jesse "Ga alles bouwen", wakker om 2:00
Besluit Jesse: bouw de hele klus account + volgen + feed + AI (opzet https://claude.ai/artifact/JDrq9Y2MouPUdYnGRCR8Mw,
basis docs/infra-account-volgen.md). Plan Access-slot vervalt (docs/opzet-slot-en-sleutel.html blijft als archief).
Volgorde, elk een eigen stap met push en keuring vóór testlink, alles achter featurevlag, niets naar main zonder akkoord:
1. account (passkey/Face ID in site-worker.mjs) + D1 + sync (+updatedAt in app), privacytekst, account wissen
2. profiel privé/openbaar, volgen (verzoek bij privé), feed als Reels in huisstijl, try -> brew ideas, foto's R2, melden/blokkeren
3. beheerscherm (alleen admin Jesse), ai_allowed per account, /api/ai met sleutel als Worker-secret, 50/dag
Jesse moet zelf: AI-sleutel als secret plakken in het dashboard (nooit in de chat). Eerst checken of het token D1/R2 mag aanmaken.
Feed staat in de schets op de plek van Learn: bij bouwen voorstel doen waar Learn komt.
