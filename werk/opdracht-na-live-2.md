# Opdracht na live 2 (27-11, architect)

Branch `functie/na-live-2` vanaf origin/main. Lees CLAUDE.md, ai-worker.mjs, site-worker.mjs (stem), app/08-ai.js,
brew-stem.js, werk/verslag-na-live-1.md, skill lets-brew-house-style.

1. **Lets Brew AI werkt niet live.** Bevinding: in live-D1 staat ai_usage voor vandaag met count 0, dus de vraag kwam
   aan, werd geteld en teruggedraaid: Anthropic gaf een fout. Waarschijnlijke oorzaak: het standaardmodel
   `claude-sonnet-4-6` (AI_MODEL_STANDAARD in ai-worker.mjs en standaard in app/08) bestaat niet meer. De actuele
   modellen zijn claude-sonnet-5-5, claude-opus-5-5, claude-haiku-5-5, claude-fable-5-2. Zet de standaard op
   `claude-sonnet-5-5` (server en app/08, ook de prijs in de prijslijst als die er is; zoek de juiste tarieven niet
   te verzinnen: laat bestaande prijsregel staan als je het niet weet en meld het). Laat de server bij een fout van
   Anthropic een veilige foutcode meegeven (bijv. `providerStatus` 401/403/404/429/529, nooit de body of sleutel), en
   laat de app die tonen ("Lets Brew AI: the AI service said 404"). Test met nep-upstream.
2. **Lets Brew voice werkt niet live**: /api/stem/voices gaf 502 met de server-sleutel. Zelfde aanpak: veilige
   providerStatus meegeven en tonen. Controleer of `eleven_v4` een geldig model-id is volgens de code/tests; zo niet,
   maak het instelbaar via env `ELEVENLABS_MODEL` met een geldige standaard (bijv. eleven_multilingual_v2) en meld je keuze.
3. **Splash**: alleen nog de splash met de nieuwe tekening (schenkkan + kopje + "Lets Brew Specialty"). De andere
   splash (alleen logo met kopje) weg, ook uit service-worker ASSETS als het plaatje nergens meer gebruikt wordt.
4. **Kapotte brew-kaart** op Home bij recente brews: "undefined · 18 g to 20 · NaN days ago" (zie screenrecording van
   Jesse). Vind welke records zo'n kaart maken (vermoedelijk via sync binnengekomen records, bijv. kind 'dial' of een
   brew zonder ts/beans) en maak brewCard en de lijsten robuust: zulke records niet als brew tonen, of netjes met
   bean-naam en datum. Test.
5. **Opmerking 11 Jesse**: in de recepteditor (#page-recipe, uitlegregel "One recipe layout for espresso and filter…")
   die tekst vervangen door "my brews" (zoals de knop in de Brews-tab heet). Kijk of de kop/terugknop daar ook
   "my brews" moet zijn; meld je keuze.
6. Locatievraag: de app vraagt direct bij opstarten om locatie (weer). Pas vragen als de gebruiker het weer-onderdeel
   aanzet of erop tikt, niet automatisch bij de eerste start. (Zag ik in de screenrecording.)

Algemeen: Engelse UI, NL comments, CACHE één keer ophogen, tests (node + Playwright chromium, executablePath
/opt/pw-browsers/chromium, --trace off, lokale config niet committen). Geen Cloudflare-acties, geen deploy, niets naar main.
Push `functie/na-live-2`. Commit-afsluiting:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XiEucqw1PZLuuXMJGKDUWb
Verslag: werk/verslag-na-live-2.md.
