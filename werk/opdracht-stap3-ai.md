# Opdracht stap 3: beheer + Lets Brew AI (26-11, architect)

Bouwt voort op stap 1 en 2 (branch functie/slot-en-sleutel na merge van stap 2; lees
werk/verslag-stap1-account.md, werk/verslag-stap2-volgen.md). Opzet: docs/opzet-account-en-delen.html
(scherm 4). Lees CLAUDE.md, SCHEMA.md, skill lets-brew-house-style, app/08-ai.js.

## Bouwen
1. Beheer (alleen users.is_admin=1; architect zet dat in D1 voor Jesse):
   - /api/admin/users GET (handle, naam, aangemaakt, ai_allowed, AI-vragen vandaag) en
     /api/admin/user POST {handle, ai_allowed}. /api/admin/reports GET + afhandelen (wissen).
   - App: Settings > Accounts (zichtbaar alleen als /api/auth/me is_admin zegt), zoals scherm 4:
     lijst met AI on/off-schakelaar, totaal vandaag, meldingen met "dismiss" en "block account"
     (admin-blokkeren = account op slot: nieuwe kolom users.locked via migrations/0002_*.sql,
     gelockt account kan niet inloggen/syncen; architect voert de migratie uit).
2. Lets Brew AI:
   - Worker-route /api/ai POST: alleen ingelogd en ai_allowed=1 (en niet locked). Sleutel uit
     env.ANTHROPIC_API_KEY (secret; Jesse zet hem zelf). Ontbreekt hij: nette 503 "AI is not set up yet".
   - Body in Anthropic Messages-vorm uit de app; server forceert: model uit vaste allowlist
     (env.AI_MODEL, standaard het model dat app/08 voor anthropic gebruikt), max_tokens <= 4000,
     alleen velden model/max_tokens/messages/stream/system; max 6 MB body (foto's van zakken).
     Stream doorgeven (SSE) als stream=true.
   - Daglimiet 50 per gebruiker per dag (Europe/Amsterdam-datum) in ai_usage, atomair ophogen
     vóór het doorsturen; boven de limiet 429 met "Daily limit reached (50). Resets at midnight."
     Antwoordkop `X-AI-Left` met resterend aantal. Rate limit (STEM_LIMITER, eigen voorvoegsel).
   - Nooit de sleutel of berichten loggen.
   - App (app/08): derde aanbieder `letsbrew` ("Lets Brew AI"), url '/api/ai', geen sleutel,
     credentials same-origin, zelfde lees/stroom als anthropic. Alleen kiesbaar als vlag account
     aan, ingelogd en ai_allowed. In Settings > AI: keuze zoals opzet slot-en-sleutel scherm 3
     ("12 of 50 questions today", balk). Eigen sleutel blijft werken als reserve. AI-budget
     (aibudget) telt Lets Brew AI niet als eigen kosten.
   - Featurevlag: valt onder vlag `account`; geen nieuwe vlag nodig.
3. Engelse UI, huisstijl, CACHE één keer ophogen, SCHEMA.md bijwerken, nieuwe bestanden in
   index.html en service-worker.js.

## Tests
- Node: admin-rechten (niet-admin 403), ai_allowed/locked, limiet 50 (51e = 429), model/
  max_tokens geforceerd, geen sleutel = 503, sleutel nooit in antwoord. Nep-fetch naar Anthropic.
- Playwright chromium (executablePath /opt/pw-browsers/chromium, --trace off): admin zet AI aan,
  gebruiker kiest Lets Brew AI en krijgt antwoord (gemockte /api/ai of nep-upstream), teller zakt.
- Alle bestaande tests groen.

## Werkwijze
- Branch `functie/account-stap3` vanaf origin/functie/slot-en-sleutel. Kleine commits, push.
  Niets naar main, geen PR, geen Cloudflare-acties, geen deploy, geen secrets.
- Commit-afsluiting:
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XiEucqw1PZLuuXMJGKDUWb
- Klaar = build + tests groen, verslag werk/verslag-stap3-ai.md (wat, keuzes, open, tests met
  aantallen, of er migratie 0002 is), gepusht.
