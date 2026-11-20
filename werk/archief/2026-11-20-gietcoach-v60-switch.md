# Klus 2: gietcoach V60/Switch (2026-11-20)

Branch claude/architect-skill-jesse-dhw83j (PR #12), commits 530ac5a, cd6ee76, e34a805.

Gebouwd volgens docs/opzet-gietcoach-v60.html:
- Bij V60 en Switch opent "start" in de pour-kaart een volledig scherm
  (app/04-gietcoach.js, CSS onder #gietcoach in styles.css): ketel giet in
  V60/Switch, server vult, Switch-klep dicht/open, grote teller met liniaal,
  strook vorige/nu/straks, 3 tellen aftellen, next step schuift de rest mee,
  stem (Nederlands) onderin, scherm blijft aan, gietsnelheid 5 g/s.
- Werkt met eigen recepten, dosis en verhouding (leest pc.steps).
- Klaar zet totale tijd, doorlooptijd, bloom-gewicht en -tijd in het
  formulier. Sluiten halverwege vraagt eerst. Andere methodes: oude klok.
- Test: tests/gietcoach.spec.cjs. CACHE scc-v107.

Keuring: ronde 1 afgekeurd (test vergeleek kommagetallen exact; doel liep
zonder handschriftlettertype uit de kaart), ronde 2 afgekeurd (reparatie knipte
laatste cijfer af met Caveat), ronde 3 GOEDGEKEURD. Lokaal 22 Playwright
(chromium) + 14 node-tests groen; GitHub-check 44 passed. npm audit 0. XSS met
eigen receptteksten getest: ge-escaped.

Cloudflare: "letsbrewspecialty"-build slaagde bij 530ac5a, faalt bij cd6ee76 en
e34a805 (alleen CSS/test/cacheversie gewijzigd; oorzaak alleen in dashboard).
"lets-brew-specialty" faalt al langer. Geen testlink.

Apart gemeld (bestond al): CSP staat script-src-attr 'unsafe-inline' toe;
esc() escapet ' niet; Permissions-Policy in _headers wijkt af van site-worker.mjs.
