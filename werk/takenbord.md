# Takenbord

Bijgewerkt 2026-11-21. Klussen 1-5 (brews aan bonen, gietcoach, AeroPress, shot clock,
stem) zitten in PR #12 en staan op main (live). Zie werk/archief/.

| Taak | Wie | Branch | Stand | Volgende stap |
|---|---|---|---|---|
| Settings herindelen (wens Jesse 26-11: logische volgorde, grote kaart voor belangrijke dingen, soort bij soort, logische namen) | architect | functie/slot-en-sleutel (docs/opzet-instellingen.html) | AKKOORD Jesse 26-11 ("ziet er goed uit"), bouwen later als Jesse zegt | https://claude.ai/artifact/Q37grtdUDF262nczdgMVNQ ; account/feed-schakelaars naar grote kaart; kaarten met getekende potloodlijnen (huisstijl) |
| Grote klus: account (Face ID) + D1 + volgen/feed + beheer/AI | architect | functie/slot-en-sleutel | stap 1, 2 en 3 gebouwd en gekeurd (stap 1 en 2 elk 1x afgekeurd, stap 3 goed met 2 moet-punten, alles hersteld), gemerged in werkbranch (5d5aab3); 56 node groen; migratie 0001+0002 op beide D1; D1 lets-brew(-preview) met 0001, R2 lets-brew-fotos(-preview) EU. Wacht op test Jesse; daarna PR naar main alleen met akkoord | testlink https://account-lets-brew-specialty.jesseboontje-1aa.workers.dev (vlaggen account + social aan); jesse is admin+AI in preview-D1 (26-11); Jesse: ANTHROPIC_API_KEY als secret (stap 3); opzet https://claude.ai/artifact/JDrq9Y2MouPUdYnGRCR8Mw |
| Kleine klussen: versheidsmeter met piekmelding, surprise me, AI-budget realistischer | architect | functie/kleine-klussen | LIVE 24-11 via #14 | Jesse op iPhone testen |
| Delen als pagina/PDF (brews en bonen) | architect | werk/na-live-2026-11-24 (docs/opzet-delen.html) | akkoord Jesse 25-11 ("bouw later") | https://claude.ai/artifact/791tb3Bh9Y6pEjqxrAx82i ; bouwen in app/06 als Jesse zegt, één keuring |
| Oude app vervangen (letsbrewspecialty.jesseboontje.workers.dev) | architect | functie/kleine-klussen (map oud-adres/) | klaar 24-11: verhuispagina live, Git-koppeling 7d5fa36f weg | Jesse: oude adres op de telefoon openen en kijken |
| Vraag doorlooptijd/filterkompas/slim invullen ("update voor nieuwe app versie") | nog niemand | geen | wacht op Jesse | betekenis navragen |
| Oude Cloudflare-koppeling 237620b0 (lege Worker lets-brew-specialty) loskoppelen | Jesse | geen | wacht op Jesse | Claude heeft geen toegang tot dat account; in dashboard Settings > Builds > Disconnect (7d5fa36f is al weg) |
| 6 WebKit-tests rood op main sinds #12 (shotclock.spec 2, stem.spec 4); aeropress.spec "regular (Hoffmann)" miste in WebKit de 5 s swirl op 30x (testfout, hersteld 24-11: swirl op 1x). Shotclock-tests: zelfde soort timing (WebKit-klok trager, 34 s gemeten bij verwacht 28-30) | nog niemand | geen | wacht | eigen klus; WebKit niet in de cloudomgeving, logs via GitHub-check |
| Logboek Worker: wordt de sleutel-header gelogd? (bestond al) | nog niemand | nog geen | wacht op Jesse | dashboard nakijken of invocation logs uit |
| Later: ElevenLabs voor live spraakcoach en AI-coach voorlezen | nog niemand | nog geen | later (besluit Jesse) | eigen klus |
| Inlog Face ID + D1 + Claude-koppeling (MCP), AI-coach centraal | nog niemand | nog geen | later (besluit Jesse) | grote klus |
| Startscherm + getekende randen overal (oude logo) | architect | main (#14) | LIVE 24-11 | Jesse op iPhone testen |
| Handleiding bijwerken voor klus 2-5 en de kleine klussen | architect | geen | na akkoord | skill lets-brew-handleiding |
| Cloudflare Web Analytics-script wordt door de CSP geweigerd (bestond al) | Jesse | geen | wacht | in dashboard Web Analytics uitzetten, of script-src uitbreiden (static.cloudflareinsights.com) |
| Randen: hertekenen bij alleen tekstwijziging (ResizeObserver) | nog niemand | geen | later | klein |
| Nakijkronde (aanwijzen): 5 punten | architect | functie/nakijk-en-route | gebouwd 25-11 (scc-v117), keuring 1x afgekeurd op NL-resten, hersteld; 42/42 chromium groen; reacties resolved | Jesse test nakijkversie https://claude.ai/artifact/PzUpyt2vkPAcJR9yYk37i7 ; mergen pas na akkoord |
| Route invullen beans -> brews -> dial-in / pour coach (filter, espresso, omni) | architect | functie/nakijk-en-route (docs/opzet-route.html) | opzet klaar 25-11, wacht op akkoord | https://claude.ai/artifact/VcgJSLkRAiirkc3AiNSatN ; voorstel: keuzevel bij omni en bij meerdere methodes, laatste keuze onthouden |
| Eén tab Brews: knoppen 'my brews' en 'brew ideas' (namen akkoord Jesse 25-11) | architect | functie/nakijk-en-route (docs/opzet-brews-tab.html) | schets klaar, wacht op 'bouw' | https://claude.ai/artifact/CgkKmjkyDxmo15kUK8xwy8 |
| Wens Jesse 25-11: AI krijgt via database gesorteerd toegang tot alle brews, beans, gear en koffietheorie via websearch (filter en espresso) voor opbouwende kennis | nog niemand | geen | later | hoort bij klus 'Inlog + D1 + MCP, AI-coach centraal'; websearch via de Worker |
| Login-mailadres letsbrew@djez.app (Jesse schreef djezz.app; gecontroleerd 25-11: domein is djez.app, één z). djez.app staat 2x in Cloudflare (actief + 'pending' in account 7d5f...). Email Routing: token mag het niet lezen/aanzetten | Jesse | geen | wacht | Jesse: dashboard djez.app > Email > Email Routing, letsbrew@ doorsturen naar eigen mailbox; versturen (inloglink) regelen in klus inlog + D1 |
| Bonen lezen: foto verkleind als jpeg, echte foutreden, /api/pagina (link echt lezen, alleen vanuit app, limiet, redirects gekeurd), foto op wishlist | architect | main (#16-#22) | LIVE 25-11 (scc-v120) | Jesse test met Single Estate-zak; singleestatecoffee.nl geeft via /api/pagina bijna geen tekst (waarschijnlijk script-opgebouwd), dan valt de AI terug op raden; echte reden zie je nu in de status |
