# Kleine klussen (21-11-2026)

Branch functie/kleine-klussen. CACHE scc-v114.

Gebouwd:
1. Versheidsmeter met piekmelding: piek per boon geleerd uit eigen scores
   (anders gewone curve), venster op de meter met uitleg, rustige regel op home.
   Vlag peakalert. Geen zak-teller (besluit Jesse).
2. Surprise me vervangt de brew-now-knop: nieuw recept voor een boon in huis,
   zonder AI berekend, met AI gekeurd door validateRecipe, pas bewaard na
   "brew this". Mokapot en pads doen niet mee. Vlag surprise.
3. AI-budget: prijs per model (peil nov 2026), eigen prijs per model, telling in
   tokens, schattingen met lokale context. Zie werk/keuze-ai-budget-2026-11-21.md.

Keuring: ronde 1 afgekeurd (surprise rekende moka en AeroPress omgekeerd fout:
verhouding naar 1:12 gedwongen, stapteksten schaalden niet mee). Hersteld in
c98c699, ronde 2 GOEDGEKEURD: alles met de hand nagerekend, 40 Playwright
(chromium) + 20 node-tests groen, wrangler dry-run goed, npm audit 0.
Restpunt (klein): bij een verhoudingsdraai op Tay omgekeerd schalen ook de
koffiegrammen in de tekst mee met het water (1 g naast de dosis), net als de
bestaande coach doet.
Bestond al (laag): CSP staat inline-attributen toe (esc() is de verdediging);
/api/stem/zeg begrenst te groot geluid alleen via de Content-Length-header.
