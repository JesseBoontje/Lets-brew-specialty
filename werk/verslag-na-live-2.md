# Verslag na live 2 (27-11, aannemer)

Branch `functie/na-live-2` (vanaf origin/main). Opdracht: `werk/opdracht-na-live-2.md`.
Niets gedeployd, geen Cloudflare-acties, niets naar main. CACHE `scc-v127` naar `scc-v128`.

## Wat er gedaan is

1. **Lets Brew AI**
   - `AI_MODEL_STANDAARD` in `ai-worker.mjs` is nu `claude-sonnet-5-5`. In `app/08-ai.js` is het standaardmodel
     van Anthropic ook `claude-sonnet-5-5`. De prijs gaat van 3/15 naar 2/10 $/M. Dat tarief stond al in de
     prijslijst van de app (`AI_MODELPRIJZEN`). Ik heb het overgenomen en geen tarief verzonnen.
   - De server gaf al `providerStatus` mee. Dat is nu streng: alleen een geheel getal tussen 100 en 599, nooit
     de body of de sleutel. Bij een netwerkfout komt er `code:'unreachable'` bij.
   - De app (`apiFout`) toont bij `providerStatus` de melding **"Lets Brew AI: the AI service said 404"**.
   - `env.AI_MODEL` werkt zoals eerst: als die live gezet is, gaat het eerste model daarin voor.
     **Controleer dus in Cloudflare of `AI_MODEL` daar nog `claude-sonnet-4-6` noemt.** Zo ja, dan helpt
     deze wijziging pas als die variabele aangepast of weggehaald is.
2. **Lets Brew voice**
   - Bij elke fout die ElevenLabs teruggeeft, bij `/voices` en `/zeg`, stuurt de server alleen `providerStatus`
     mee. De status die de app ziet blijft zoals hij was.
   - De app toont bij de stemmenlijst "Lets Brew voice: the voice service said 401." (met een eigen sleutel:
     "ElevenLabs said 401."). Bij `/zeg` verschijnt eenmalig een melding met het nummer, daarna valt de app
     terug op de telefoonstem.
   - `eleven_v4` stond alleen als aanname in de code en tests, en de overdracht noemde het al onzeker. Ik ken
     geen ElevenLabs-model met dat id. Het model is nu instelbaar via **env `ELEVENLABS_MODEL`** (alleen
     `[a-z0-9_]`, 3 tot 60 tekens). Standaard is **`eleven_multilingual_v2`**. De tekst "(model eleven_v4)" in
     Settings is weg.
   - Over de 502 op `/api/stem/voices` met de server-sleutel: de server maakt van een 401/403 van ElevenLabs
     voor ingelogde gebruikers bewust een 502. Het model doet bij `/voices` niet mee. De oorzaak is dus
     waarschijnlijk de server-sleutel zelf: hij is ongeldig, of hij mist de rechten om stemmen te lezen. Met
     deze versie laat de app het nummer zien, en dan weet je het zeker.
3. **Splash**: het vijfde beeld (`logo.png`, het logo met alleen het kopje) is uit de splash gehaald. De
   tekening bouwt zich op in vier beelden (`splash-1` tot en met `-4`). Vanaf 1,05 s blijft `splash-4` staan
   (schenkkan, kopje en "Lets Brew Specialty"). De splash duurt nog steeds 2 s. `logo.png` blijft in de
   service-worker ASSETS, omdat de surprise-me-kaart op Home hem gebruikt.
4. **Kapotte brew-kaart**
   - De oorzaak is een record in `state.brews` zonder `method`, `ts` en `beans`. `methodById(undefined)` geeft
     dan een naam `undefined`, en `timeAgo(undefined)` geeft "NaN days ago".
   - Elke brew die de app zelf maakt (brew-formulier, dial-in, import) heeft een methode. Zo'n record komt dus
     van buiten: sync of een oud bestand. Welk record live precies kapot is, kon ik niet nagaan (geen D1).
   - Oplossing:
     - Met `isBrew` en `zichtbareBrews()` tonen Home, de Brews-lijst (ook de versie in `brew-workspace.js`) en
       de methodefilter alleen records met een methode.
     - `timeAgo` geeft bij een ongeldige tijd een lege tekst in plaats van "NaN".
     - De boonnaam valt terug op de gekoppelde boon (`brewBoonNaam`). Een kop zonder naam wordt "brew".
     - Bij het laden krijgt een brew zonder geldige `ts` zijn `updatedAt` of `at` (`brewTijdHerstel`, in 02).
       Bij sync krijgt hij `updatedAt` (in `acctToepassen`).
5. **Opmerking 11 (recepteditor)**: de uitlegregel kwam uit `brew-workspace.js`. Hij luidt nu "One layout for
   espresso and filter. A brew idea is a plan; what you actually brewed is under my brews." Mijn lezing: het
   verwijzende woord "Brews" wordt "my brews", de naam van de knop. Als Jesse echt alleen de tekst "my brews"
   wil, is dat één regel aanpassen. De kop ("own brew idea") en de knop "Cancel" heb ik niet veranderd. Deze
   pagina is de editor van een brew idea, niet van "my brews", en een andere kop zou verwarren.
6. **Locatie**: de app vraagt niet meer zomaar om de locatie. Bij het openen gebeurt dat alleen als de
   toestemming er al is (`scc_weather_ok` of `permissions.query` = granted). Anders staat er op Home een rustige
   regel: "tap for weather-aware tips". Pas bij een tik op die regel, of bij het aanzetten van het onderdeel in
   Settings, vraagt de app om de locatie. Wordt de toestemming geweigerd, dan wordt `scc_weather_ok` gewist.

## Tests
- Node: 58 van 58 geslaagd. Nieuw:
  - het standaardmodel;
  - `providerStatus` bij 401/403/404/429/529, met alleen de velden `error` en `providerStatus`;
  - de stem: `providerStatus` bij zeg en voices, nooit de tekst van ElevenLabs, `code:'unreachable'` en
    `ELEVENLABS_MODEL` met terugval.
- Playwright (alleen chromium, executablePath `/opt/pw-browsers/chromium`, `--trace off`): 79 van 79 geslaagd.
  - Nieuw is `tests/na-live-2.spec.cjs` met 5 tests: de AI-foutmelding met nummer, de stemfout met nummer,
    Home en Brews met kapotte records en sync-ts, de regel "my brews" en de locatie pas na een tik of na
    aanzetten.
  - Aangepast: `startscherm.spec.cjs` (geen sf5 en geen logo.png in de splash) en `kleine-klussen.spec.cjs`
    (de kosten volgen het nieuwe standaardmodel: 2000 in en 500 uit kost $0,009).
- `npm run build` werkt.
- De lokale Playwright-config en een kopie van de testserver op een andere poort staan buiten de repo, in de
  scratchpad. Er is niets van gecommit.

## Niet af of onzeker
- Live kan ik niets controleren:
  - of `claude-sonnet-5-5` het werkelijke id is (ik heb het overgenomen uit de opdracht);
  - of `env.AI_MODEL` live het oude model forceert;
  - wat ElevenLabs precies teruggeeft.
- `eleven_multilingual_v2` als standaard is een veilige keuze, geen bevestigde keuze. Wil Jesse een ander
  model (bijvoorbeeld `eleven_v3` of `eleven_flash_v2_5`), dan kan dat met `ELEVENLABS_MODEL` in Cloudflare.
- Welk record live de kapotte kaart gaf, is niet vastgesteld. De app is nu robuust, maar het record zelf staat
  nog in de data. Het blijft verborgen en wordt niet gewist.
- Op een iPhone die als app geïnstalleerd is, kan Safari na een herstart opnieuw om toestemming vragen, ook als
  `scc_weather_ok` er al staat. Dat bepaalt het systeem, niet de app.
- De handleiding is niet bijgewerkt.
