# Klus 1: elke brew hoort bij een boon (2026-11-20)

Branch claude/architect-skill-jesse-dhw83j (PR #12), commits 8bbbe57, 351f0ad, b6194cc.

Gebouwd:
- Oude brews zonder boon koppelen zichzelf als de ingetypte naam precies één
  boon raakt (BrewModel.linkBeansByName, ook na import). Opgeslagen.
- Rest bovenaan brews: per naam koppelen aan een boon of "make bean" (boon als
  finished). Ingetypte naam blijft staan, er verdwijnt niets.
- Nieuwe brews en shots vragen een boon; "+ new bean" onderweg, terug met die
  boon gekozen. Kiesscherm: "+ add a new bean" in plaats van "no bean".
- Bewerken: ingetypte naam blijft tenzij je een andere boon kiest.
- Demo-brews horen bij een demo-boon. Test: tests/bean-link.spec.cjs.

Keuring: eerste ronde 4 fouten (naam weg bij bewerken, keuzelijst buiten kaart,
delBean-tekst dood door brew-workspace.js, knopnaam ≠ boonnaam), hersteld; tweede
ronde 1 nieuw punt (naam volgde andere boon niet), hersteld; derde ronde alles
GOED. Build, 14 node-tests, 19 Playwright (chromium) groen. Cloudflare-check niet
te keuren (faalt al langer). npm audit 0.

Apart gemeld (bestond al): esc() escapet de enkele quote niet; ids gaan
onge-escapet in onclick. Eigen ids zijn veilig. Annuleren-knop kiesscherm 30 px.
