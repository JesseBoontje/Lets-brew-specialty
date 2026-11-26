# Opdracht "takenbord afmaken" (26-11, architect)

Jesse: "Laat alles op het takenbord afmaken ... zet live". Eén aannemer doet deze klussen na elkaar,
daarna één keuring. Branch `functie/afmaken` vanaf origin/functie/slot-en-sleutel.
Lees CLAUDE.md, SCHEMA.md, skill lets-brew-house-style (en wat die zegt te lezen), skill
nieuwe-feature references/inbouwen.md.

## A. Settings herindelen (akkoord Jesse 26-11)
Volg docs/opzet-instellingen.html precies (tabel "Waar alles heen gaat" + "Features per onderwerp").
- Grote kaart bovenaan (donker, handle, sync-status, privé/openbaar, volgverzoeken, AI vandaag).
  Niet ingelogd / vlag uit: kaart met knop "turn on account" (zet vlag account aan en opent
  inloggen). Volgen en feed aanzetten wordt een knop in die kaart / in "profile & following".
- Vlaggen account en social uit de features-lijst halen (blijven bestaan in FEATURES, alleen niet
  in de lijst getoond).
- Features in 4 onderwerpen (brewing, beans, tasting, learning & sharing) als inklapbare rijen met
  "x of y on"; AI budget onder AI & voice › AI; drawn edges onder more › look.
- Nieuwe namen zoals in de opzet. Er mag geen instelling verdwijnen: maak een test die elke
  bestaande instelling/kaart (oude id's) nog vindt.
- Huisstijl: grote kaart en alle rijen met de getekende potloodlijnen (app/11-randen.js, drawn
  edges), knoppen color:var(--ink);font:inherit.
## B. Kleine punten
- Randen hertekenen bij alleen tekstwijziging: ResizeObserver in app/11-randen.js (zuinig, geen lus).
- Als vlag social aan en ingelogd: Learn als kaart bovenaan Home en uit de tabbalk, zodat er
  weer 5 tabs zijn (Home, Beans, Brews, Feed, Settings). Zonder social blijft alles zoals nu.
- Melding volgverzoek: een rustige regel op Home ("sanne wants to follow you" → naar profiel).
## C. Delen als pagina/PDF (akkoord Jesse 25-11)
Volg docs/opzet-delen.html. Lees eerst wat al bestaat (share cards, app/06 print, app/09 delen).
Geen server nodig tenzij de opzet dat vraagt; als een gedeelde link nodig is: gebruik bestaande
social-routes niet voor niet-ingelogden zonder rechten. Meld keuzes.

## Algemeen
- Engelse UI, NL comments. CACHE één keer ophogen voor het geheel. SCHEMA.md/CLAUDE.md bijwerken
  waar nodig. Nieuwe bestanden in index.html en service-worker.js.
- Tests: bestaande groen + nieuwe voor A (geen instelling kwijt, grote kaart, vlaggen), B (5 tabs
  met social, melding), C. Playwright alleen chromium, executablePath /opt/pw-browsers/chromium,
  --trace off, lokale config niet committen. Screenshot van Settings op 390x844 maken en zelf
  beoordelen tegen de opzet.
- Geen Cloudflare-acties, geen deploy, niets naar main. Push `git push -u origin functie/afmaken`.
- Commit-afsluiting:
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XiEucqw1PZLuuXMJGKDUWb
- Verslag werk/verslag-afmaken-26-11.md (per klus: wat, keuzes, open, tests met aantallen).
