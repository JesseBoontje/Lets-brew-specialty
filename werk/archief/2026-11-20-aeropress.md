# Klus 3: AeroPress normaal en omgekeerd (2026-11-20)

Branch claude/architect-skill-jesse-dhw83j (PR #12), commits 01accb6 en 8f4e698.

Gebouwd volgens docs/opzet-aeropress.html:
- Bij de AeroPress opent "start" een volledig scherm (app/04-aeropress.js,
  #apcoach, zelfde opmaak als de gietcoach): tekening met kop, dop, kamer,
  plunjer, ketel, roerstokje en schepje. Omgekeerd staat hij op de kop tot de
  keer-stap; dan daalt de kop en draait alles om (donkere kaart). Na het
  drukken: AeroPress eraf en aanvullen in de kop. Teller, liniaal, strook
  vorige/nu/straks, 3 tellen aftellen, next step, stem, scherm blijft aan.
- Recepten: Hoffmann AeroPress (11 g/200 g, vervangt het bronloze 16 g/240 g)
  en Tay omgekeerd (WK 2023, 18 g, 100 g, aanvullen 115/155 g). Beide in de
  recept-rij bij de AeroPress. Zetgids volgt Hoffmann.
- Geen bloom en geen doorlooptijd meer in het formulier na de AeroPress.
- French press houdt de oude klok en krijgt geen AeroPress-recepten.
- Test: tests/aeropress.spec.cjs. CACHE scc-v109.

Keuring: ronde 1 afgekeurd (French press kreeg AeroPress-recepten in de
keuzerij; doorlooptijd = hele zettijd, gaf dial-in hint "grover malen"),
ronde 2 GOEDGEKEURD. Lokaal 25 Playwright (chromium) + 14 node-tests groen,
GitHub-check (chromium + webkit) geslaagd, npm audit 0, XSS getest.
Cloudflare: beide Workers Builds falen in 0 s (zoals eerdere commits).

Aandachtspunt (bestaand gedrag formulier): wie al AeroPress-brews had, krijgt
Hoffmann met dosis/temperatuur van de laatste brew (bijv. 16 g, 88 °C).
Bestond al: CSP mist upgrade-insecure-requests; Permissions-Policy in
site-worker.mjs mist bluetooth t.o.v. _headers.
