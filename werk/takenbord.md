# Takenbord

Bijgewerkt 2026-11-21. Klussen 1-5 (brews aan bonen, gietcoach, AeroPress, shot clock,
stem) zitten in PR #12 en staan op main (live). Zie werk/archief/.

| Taak | Wie | Branch | Stand | Volgende stap |
|---|---|---|---|---|
| Kleine klussen: versheidsmeter met piekmelding, surprise me, AI-budget realistischer | architect | functie/kleine-klussen | goedgekeurd (ronde 2), PR #14 met preview | Jesse testen en akkoord, dan mergen |
| Delen als pagina/PDF (brews en bonen) | nog niemand | nog geen | wacht | volgende klus (volgorde Jesse) |
| Oude app vervangen (letsbrewspecialty.jesseboontje.workers.dev) | architect | functie/kleine-klussen (map oud-adres/) | klaar 24-11: verhuispagina live, Git-koppeling 7d5fa36f weg | Jesse: oude adres op de telefoon openen en kijken |
| Vraag doorlooptijd/filterkompas/slim invullen ("update voor nieuwe app versie") | nog niemand | geen | wacht op Jesse | betekenis navragen |
| Oude Cloudflare-koppeling 237620b0 (lege Worker lets-brew-specialty) loskoppelen | Jesse | geen | wacht op Jesse | Claude heeft geen toegang tot dat account; in dashboard Settings > Builds > Disconnect (7d5fa36f is al weg) |
| 6 WebKit-tests rood op main sinds #12 (shotclock.spec 2, stem.spec 4); aeropress.spec "regular (Hoffmann)" faalt in WebKit soms (2 van 4 runs, ook op commits zonder app-wijziging) | nog niemand | geen | wacht | eigen klus; WebKit niet in de cloudomgeving, logs via GitHub-check |
| Logboek Worker: wordt de sleutel-header gelogd? (bestond al) | nog niemand | nog geen | wacht op Jesse | dashboard nakijken of invocation logs uit |
| Later: ElevenLabs voor live spraakcoach en AI-coach voorlezen | nog niemand | nog geen | later (besluit Jesse) | eigen klus |
| Inlog Face ID + D1 + Claude-koppeling (MCP), AI-coach centraal | nog niemand | nog geen | later (besluit Jesse) | grote klus |
| Ontwerpronde startscherm (frontend-design + dubbele lijnen overal) | architect | functie/kleine-klussen (docs/opzet-startscherm.html) | wacht op Jesse | opzet https://claude.ai/artifact/8TzG92J7TX7k2xz6NuDnGv ; na akkoord inbouwen op eigen branch, één keuring |
| Handleiding bijwerken voor klus 2-5 en de kleine klussen | architect | geen | na akkoord | skill lets-brew-handleiding |
