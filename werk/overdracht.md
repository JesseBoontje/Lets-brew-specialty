# Overdrachtsbon

Laatst bijgewerkt: 2026-11-20

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
