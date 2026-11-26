# Opdracht stap 2: profiel, volgen, feed (26-11, architect)

Bouwt voort op stap 1 (branch functie/slot-en-sleutel, lees werk/verslag-stap1-account.md,
account-worker.mjs, app/11-account.js). Opzet: docs/opzet-account-en-delen.html (schermen 2 en 3),
basis: docs/infra-account-volgen.md. Lees CLAUDE.md, SCHEMA.md, skill lets-brew-house-style.

## Al geregeld (architect)
- Tabellen follows, likes, blocks, reports bestaan al (migrations/0001). Schemawijziging = nieuwe
  migrations/0002_*.sql; architect voert die uit, jij niet.
- R2 (EU): live `lets-brew-fotos`, preview `lets-brew-fotos-preview`. Binding `FOTOS`, in
  wrangler.jsonc top-level én in "previews" (met "jurisdiction":"eu").

## Bouwen (alles achter nieuwe vlag `social`, def:false, cat:'people'; vereist vlag account)
1. Profiel: handle, naam, visibility private/public (één schakelaar), tellers brews/beans/
   followers/following. Volgverzoeken: bij private status pending, eigenaar accept/decline;
   bij public direct accepted. Ontvolgen, volger verwijderen.
2. Zoeken op handle (exact of begin, max 20), profielpagina van een ander in de app.
3. Feed (tab "Feed"): items (brews en beans) van accounts die je volgt (accepted), nieuwste eerst,
   gepagineerd (cursor). Reels-achtig: één item per scherm, verticaal vegen met CSS scroll-snap,
   in huisstijl (donkere kaart var(--ink), tekst var(--paper), getekende kop/foto, zie scherm 3).
   Knoppen: like (♡ + teller), try (recept naar eigen brew ideas / bean naar wishlist), share
   (link naar het profiel). Tabbalk: Feed erbij; Learn niet weghalen maar voorstellen in verslag
   waar het het best kan (bijv. Learn onder Home of Settings); kies de minst ingrijpende werkende
   oplossing en meld die.
4. Wat gedeeld wordt: alleen records van een account dat de kijker mag zien (public, of accepted
   follower; nooit bij block). Server filtert privévelden weg met een allowlist (geen price,
   notes, bagPrice, wishlist, budget, eigen notities; wel naam, roaster, origin, process,
   methode, dose, yield, ratio, tijd, temp, score, korte smaaknotitie/tags, foto). Controleer
   welke velden SCHEMA.md heeft en maak de allowlist expliciet, met test.
5. Foto's: alleen bij brews/beans met foto; app verkleint (max 1280 px, jpeg ~0.8) en uploadt
   naar /api/foto (max 1 MB, alleen image/jpeg/webp, eigenaar = sessie), sleutel in
   records.photo_key; ophalen via /api/foto/:key met dezelfde zichtrechten als het record.
6. Melden en blokkeren: op een profiel. Blokkeren verbergt over en weer en verbreekt volgen.
   Meldingen naar tabel reports (admin-scherm komt in stap 3).
7. Rate limits op volg/like/zoek/foto-routes (bestaande STEM_LIMITER met eigen key-voorvoegsel).
   Origin-check op elke POST/DELETE, alles met bind, geen tokens loggen.
8. Engelse UI, NL in comments. Nieuwe bestanden in index.html en service-worker.js, CACHE één
   keer ophogen. SCHEMA.md bijwerken.

## Tests
- Node (nep-D1 op node:sqlite, nep-R2 in geheugen): zichtrechten (private/public/pending/block),
  allowlist, feed-cursor, foto-rechten, rate limit niet nodig te testen.
- Playwright chromium (executablePath /opt/pw-browsers/chromium, --trace off): twee accounts,
  volgen + accept, feed toont item, try zet recept in brew ideas, block verbergt.
- Alle bestaande tests groen.

## Werkwijze
- Branch `functie/account-stap2` vanaf origin/functie/slot-en-sleutel (maak hem zelf aan).
  Kleine commits, push `git push -u origin functie/account-stap2`. Niets naar main, geen PR,
  geen Cloudflare-acties, geen deploy.
- Commit-afsluiting:
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XiEucqw1PZLuuXMJGKDUWb
- Klaar = build + tests groen, verslag in werk/verslag-stap2-volgen.md (wat, keuzes, open
  punten, testuitkomst met aantallen), gepusht.
