# Startscherm, getekende randen en oude adres (24-11-2026)

Branch functie/kleine-klussen (PR #14). CACHE scc-v116.

Gebouwd:
- app/11-randen.js: elk kader, elke kaart en knop twee eigen getekende lijnen met
  ronde hoeken (vlag drawnedges). Niet op <details>.
- Splash: drie tekeningen van Jesse elk 0,75 s, dan het oude logo 2 s (4,25 s);
  overslaan bij loslaten, daarna 400 ms klikken inslikken.
- Home: logo linksboven weg, surprise me met de gietcoach-tekening en logo.png,
  methodes in eigen kleur, brew als zin.
- Oude adres letsbrewspecialty.jesseboontje.workers.dev: verhuispagina met download
  van de oude gegevens (map oud-adres/), Git-triggers van account 7d5fa36f weg.
- Test AeroPress: swirl op 1x (WebKit miste hem op 30x).

Keuring: ronde 1 afgekeurd (splash-tik ging door naar de knop eronder), hersteld in
ecca897, ronde 2 GOEDGEKEURD. Lokaal 42 Playwright (chromium) + 20 node; in GitHub
78 WebKit-tests groen, de 6 bekende (shotclock/stem) rood zoals op main.
Restpunt: rand groeit niet mee als alleen tekst in een kaart verandert (zonder
nieuw element of class); kan met een ResizeObserver. Niet gezien in de app.
Niet te keuren hier: iOS Safari zelf (zelf testen).
