# Verslag "takenbord afmaken" (26-11, aannemer)

Branch `functie/afmaken` (vanaf origin/functie/slot-en-sleutel). Niets gedeployd, niets naar main.
CACHE één keer opgehoogd: scc-v124 → scc-v125.

## A. Settings herindeeld (commit 53a0b6d)
Wat:
- Bovenaan een donkere kaart `#set-groot`: handle, "signed in · synced … · private/public",
  knoppen/pillen voor volgverzoeken, "turn on follow & feed" en "AI 12 / 50 today".
  Vlag uit: "turn on account" (zet de vlag aan en opent de inlogrij). Niet ingelogd: "sign in with Face ID".
- Rijen per onderwerp die openklappen: you (account & sync, profile & following, accounts),
  your coffee (my gear, my taste), AI & voice (AI, coach voice), features (brewing, beans, tasting,
  learning & sharing met "x of y on"), reminders & shortcuts, your data (back-up & restore,
  connect apps), more (look · advanced · about). Korte waarde rechts op elke rij.
- Vlaggen account en social staan niet meer in de lijst (wel nog in FEATURES); aanzetten via de
  grote kaart, uitzetten met een knop onderaan hun eigen rij.
- AI budget bij AI, drawn edges bij more › look, shortcuts in zijn eigen rij, weather bij daily
  brew suggestion, pairing bij my gear, taste memory ook in my taste.
- Nieuwe namen: "shot clock (E61)", "espresso or filter first".
- Alle oude id's blijven (acct-card … about-card); de oude groepering in brew-workspace.js
  (details "My setup" / "App settings" / "Data and sharing") is eruit.
Bestanden: app/11-instellingen.js (nieuw), app/11-profiel-en-instellingen.js, app/11-account.js,
app/11-volgen.js, app/09-leren-en-extra.js, brew-workspace.js, brew-voice.js, index.html, styles.css,
service-worker.js, SCHEMA.md (`scc_last_backup`), CLAUDE.md, tests/instellingen.spec.cjs (nieuw),
aangepast: tests/beheer-ai, shotclock, volgen, workspace (openen via `setToon` i.p.v. de oude details).
Keuzes:
- account & sync klapt vanzelf open als je niet ingelogd bent (inloggen is dan het enige wat er is);
  ingelogd begint hij dicht.
- Grote kaart: knoppen papierkleur met inkt-tekst (color:var(--ink);font:inherit), de AI-teller als omlijnde pil.
- weather en pairing staan niet in de opzet; ik zette ze bij de rij waar ze over gaan.
- "last: today" bij back-up komt uit localStorage `scc_last_backup` (alleen dit toestel).
Screenshot: /tmp/claude-0/-home-user-Lets-brew-specialty/1fbf26ef-8ce0-543f-b14b-2055f69be17e/scratchpad/settings-390x844.png
(en -2.png verder naar beneden). Klopt met de opzet; getekende lijnen op kaart en rijen.

## B. Kleine punten (commit 6eb7737)
- app/11-randen.js: ResizeObserver per kader (ook verborgen kaders, die tekenen zodra ze maat krijgen).
  randTeken tekent alleen bij een andere maat, de svg staat absoluut: geen lus. Vlag uit = disconnect.
- Volgen en feed aan + ingelogd: Learn als kaart `#home-learn` bovenaan Home en weg uit de balk
  (Home, Beans, Brews, Feed, Settings). Learn openen houdt Home gemarkeerd. Zonder social: als nu.
- Volgverzoek: regel `#volg-melding` op Home ("sanne wants to follow you", bij meer "sanne and 1 more
  want to follow you"); tik opent profile & following in Settings.
Bestanden: app/11-randen.js, app/11-volgen.js, app/03-navigatie-home.js, brew-workspace.js, index.html,
styles.css, tests/kleine-punten.spec.cjs (nieuw).

## C. Delen als pagina/PDF (commit b6950f8)
- Eén menu (`#deel-pop`) op een brew (knop "share") en een boon (verzendknop): send as a page,
  save as PDF, send to a Lets Brew user.
- Pagina: één los html-bestand, methodetekening als kleine jpg-data-URL, geen scripts en geen links naar
  buiten. PDF: hetzelfde blad in het printvak (runPrint). App-bestand: het bestaande shareOneBrew/shareOneBean.
- Boon: brander, herkomst, proces, ras, branddatum, smaaknoten van de brander, prijs per kop en de beste
  brew met die boon (hoogste score) met stappen.
Keuzes: geen server en geen gedeelde link (niets online, dus ook geen social-routes voor
niet-ingelogden). Niet mee: eigen notities (brew en boon), prijs van de zak, AI-sleutels, andere brews;
naam alleen als `state.userName` is ingevuld. De losse PDF-knop op de brew-detail zit nu in het menu
(printBrew weg; printLogbook voor het hele logboek blijft). Stappen en recepttekst blijven Nederlands
(receptinhoud), de vaste tekst is Engels. Methodenaam zoals in de app ("v60").
Bestanden: app/06-delen.js (nieuw), app/06-detail-en-methodes.js, app/07-bonen.js, index.html,
service-worker.js, CLAUDE.md, tests/delen.spec.cjs (nieuw).

## Tests
- node: 53 van 53 groen.
- Playwright (alleen chromium, /opt/pw-browsers/chromium, --trace off): 63 van 63 groen (ook na herstel)
  (was 55; nieuw 3 voor A, 3 voor B, 2 voor C). Webkit niet gedraaid (niet in deze omgeving).

## Herstel na keuring (GOEDGEKEURD met vier punten)
1. Blad: lettertypes eindigen op -apple-system, system-ui, sans-serif (geen cursive, Segoe Print of
   Comic Sans). Geen fonts ingebakken; met Caveat/Patrick Hand op het toestel worden die gebruikt.
2. Tekening op het blad: png zonder vulling; het papier van de tekening wordt doorzichtig
   (licht weg, donker blijft inkt). Geen donker vlak meer achter de tekening.
3. De tekening wordt al klaargezet als het deelmenu opent (`deelBeeld`), zodat navigator.share
   zonder await direct uit de tik draait (iOS user activation). Wie razendsnel tikt wacht even.
4. #set-groot: potloodlijnen in papierkleur, opacity .65, zichtbaar op de donkere kaart.
Ook: waarden in de vakjes van het blad breken niet meer midden in een woord ("medium").
Stappen op het blad blijven Nederlands: dat is receptinhoud (zoals BREW_GUIDES), bewust zo gelaten.
Tests na herstel: node 53/53, Playwright 63/63 (chromium); delen- en instellingen-test controleren
de punten 1 t/m 4.

## Open / onzeker
- iPhone-gedrag van "send as a page" (deelvenster met .html-bestand) en "save as PDF" alleen in Chromium
  getest; de keurmeester moet dit op een echte iPhone nalopen.
- Handleiding nog niet bijgewerkt (skill lets-brew-handleiding) voor de nieuwe Settings en het deelmenu.
