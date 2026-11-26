# Verslag stap 3: beheer + Lets Brew AI (26-11, aannemer)

Branch `functie/account-stap3` (vanaf origin/functie/slot-en-sleutel). Niets gedeployd,
geen migratie uitgevoerd, geen Cloudflare-acties, geen secrets.

## Wat gebouwd
- **`ai-worker.mjs`** (nieuw, via `site-worker.mjs` voor `/api/ai` en `/api/admin/*`):
  - Beheer, alleen `users.is_admin=1` (anders 403, zonder sessie 401; Origin + JSON bij POST):
    `GET /api/admin/users` (handle, naam, aangemaakt, ai_allowed, locked, admin, AI-vragen
    vandaag + totaal), `POST /api/admin/user {handle, ai_allowed?, locked?}`,
    `GET /api/admin/reports`, `POST /api/admin/reports {id, action:dismiss|block}`.
    Dismiss wist de melding; block zet het gemelde account op slot, wist zijn sessies en
    alle meldingen over hem. Jezelf op slot zetten kan niet. Alleen handles naar buiten.
  - `POST /api/ai`: ingelogd, `ai_allowed=1`, niet op slot. Sleutel uit
    `env.ANTHROPIC_API_KEY`; ontbreekt hij: 503 "AI is not set up yet." (en er wordt niet
    geteld). Server bouwt het lijf opnieuw op: alleen model/max_tokens/messages/stream/system,
    binnen berichten alleen `text` en base64-`image`; model uit `env.AI_MODEL` (komma-lijst,
    eerste = standaard; zonder: dezelfde standaard als app/08 voor anthropic), max_tokens
    ≤ 4000 (standaard 1000), max 60 berichten, body max 6 MB. `stream:true` → SSE door.
  - Daglimiet 50 per gebruiker per Amsterdamse dag: één statement
    `INSERT … ON CONFLICT DO UPDATE SET count=count+1 WHERE count<50 RETURNING count`
    vóór het doorsturen; daarboven 429 "Daily limit reached (50). Resets at midnight."
    (`code:"limit"`). Kop `X-AI-Left` op elk antwoord. Mislukt het bij Anthropic (netwerk of
    niet-2xx), dan gaat de teller één terug en komt er een eigen zin (geen tekst van de
    aanbieder). Rate limit `STEM_LIMITER` sleutel `ai:<user-id>`. Niets gelogd.
- **`account-worker.mjs`**: `gebruiker()` leest ook ai_allowed/is_admin/locked en geeft
  `null` bij een account op slot (dus sync, social, foto's, AI: 401). Inloggen met een
  account op slot: 403 `{code:"locked"}`, geen sessie. `/api/auth/me` geeft nu
  `{user:{handle,visibility,admin,ai}, ai:{used,limit}}` (`ai` alleen bij ai_allowed).
  `AI_LIMIET` en `aiDag()` (Europe/Amsterdam) staan hier en worden gedeeld.
- **Migratie `migrations/0002_locked.sql`**: `ALTER TABLE users ADD COLUMN locked INTEGER
  NOT NULL DEFAULT 0;`. `tests/nep-d1.mjs` voert nu alle migraties op volgorde uit.
- **App**:
  - `app/08-ai.js`: derde aanbieder `letsbrew` ("Lets Brew AI"), zelfde vorm als anthropic
    (gedeeld object `AI_ANTHROPIC`), url `/api/ai`, geen sleutel, `credentials:'same-origin'`.
    `aiProv()` valt terug op de eigen-sleutel-aanbieder (`scc_ai_prov_eigen`) als het account
    Lets Brew AI niet (meer) mag. `askAI`/`askAIStream` lezen `X-AI-Left`; bij limiet/niet
    toegestaan/niet ingesteld en een eigen sleutel in dit tabblad vraagt de app die (reserve,
    met toast). AI-budget: `aiTel` telt Lets Brew AI niet; budgetkaart en meldingen zwijgen
    zolang Lets Brew AI gekozen is.
  - `app/11-profiel-en-instellingen.js`: `aiSleutelKlaar()`/`aiReady()` kennen Lets Brew AI;
    Settings → AI toont (alleen met vlag account, ingelogd en ai) de keuze
    "Lets Brew AI" / "own key" zoals scherm 3: kaart "today · 12 of 50 questions", balk,
    "38 left · Resets at midnight.", en "no key on this phone". Bij own key de oude
    aanbieders + sleutelveld. De sleutel-uitleg uit `brew-workspace.js` staat nu alleen bij
    own key.
  - `app/11-beheer.js` (nieuw, in index.html en service-worker.js): `aiLbKan()`, `/me`
    ophalen (bij start, na inloggen en bij elke keer Settings openen) en kaart **accounts**
    (Settings, onder "your profile", alleen als `/me` admin zegt), zoals scherm 4: per
    account een AI-schakelaar ("AI on/off"), "N today", locked + unlock; "Today: N AI
    questions in total."; meldingen met **dismiss** en **block account** (bevestigen).
  - `app/11-account.js`: `acctMeHaal()` bij start en na inloggen.
  - CSS onderaan `styles.css` (`.lb-kaart`, `#beheer-card`), alles met tokens; geen emoji,
    Engelse UI. CACHE `scc-v124` (één keer opgehoogd).
- SCHEMA.md: hoofdstuk "Beheer en Lets Brew AI". CLAUDE.md: nieuwe bestanden.

## Keuzes (met reden)
- **Eigen module `ai-worker.mjs`** naast account/social, zelfde patroon (importeert
  `json`, `leesBody`, `gebruiker` uit account-worker). Geen nieuwe vlag (valt onder account).
- **Lijf opnieuw opbouwen** in plaats van velden wegstrepen: ook geneste extra's
  (cache_control, tools, metadata, temperature) gaan zo nooit mee.
- **Teller terug bij een mislukte aanvraag**: anders kost een storing bij Anthropic iemand
  zijn dagvragen. Vóór het doorsturen ophogen blijft (atomair, ook bij gelijktijdige vragen).
- **Locked = nergens ingelogd**: in `gebruiker()` zelf, dus elke huidige en toekomstige route
  doet vanzelf mee. Op slot zetten wist de sessies; unlock via de kaart (`locked:false`).
- **`admin` en `ai` in `state.sync.user`**: dan klopt de keuze in Settings meteen na het
  openen (ook offline); de server beslist altijd zelf.
- **Reserve**: alleen bij de drie eigen foutcodes van /api/ai (limit, not_allowed,
  not_set_up) en alleen als er al een eigen sleutel in het tabblad staat.

## Tests (uitkomst)
- `npm run build`: groen. `wrangler deploy --dry-run`: bundelt (bindings DB, FOTOS, limiters).
- Node: **51 groen, 0 rood** (was 42): nieuw `tests/ai.test.mjs` (8 tests: admin-rechten
  niet-admin 403/401/Origin/JSON/405/404; lijst + AI aan/uit + totaal; meldingen dismiss/block
  → gelockt kan niet syncen/social/AI/me, unlock; /me met admin/ai/used; ai_allowed en geen
  sleutel = 503 zonder telling; model/max_tokens geforceerd, onbekende velden weg, sleutel
  nooit in antwoord of foutmelding, mislukte vraag telt niet, ongeldige vorm 400; limiet 50 →
  51e 429, X-AI-Left 49…0, 10 gelijktijdig → precies 5 door, eigen teller per gebruiker,
  Amsterdamse datum rond middernacht/zomertijd; SSE, rate-limit-sleutel, 6 MB → 413,
  netwerkfout 502 zonder telling) en in `tests/account.test.mjs` 1 test (inloggen op slot:
  403, geen sessie, oude sessie telt niet). Nep-fetch voor Anthropic.
- Playwright chromium (lokale config, executablePath /opt/pw-browsers/chromium, `--trace off`):
  **55 groen, 0 rood** (was 53). Nieuw `tests/beheer-ai.spec.cjs` (2 tests): admin ziet
  kaart, zet AI aan voor sanne (D1), blokkeert een gemeld account; sanne kiest Lets Brew AI,
  krijgt antwoord (gewoon en stream) via de echte /api/ai met nep-Anthropic, teller
  0 → 1 → 2 of 50, geen sleutel uit de browser, AI-budget leeg; admin ziet "2 today";
  limiet op → eigen sleutel als reserve (telt wel als eigen kosten), zonder eigen sleutel de
  limietmelding; AI uit → keuze weg, terug naar own key; geen paginafouten. En: zonder vlag
  account geen keuze, geen kaart, geen /api-calls.

## Migratie
**Ja: `migrations/0002_locked.sql`** (één regel, zie boven). Moet de architect uitvoeren op
beide D1's (lets-brew en lets-brew-preview) **vóór** deploy: zonder de kolom faalt elke
query in `gebruiker()` (dus inloggen/sync/social) met een 500.

## Niet af / onzeker
- `ANTHROPIC_API_KEY` moet Jesse zelf als Worker-secret zetten (ook voor previews); `AI_MODEL`
  is optioneel. `is_admin=1` voor Jesse zet de architect in D1.
- Niet tegen de echte Anthropic-API of echte D1 geprobeerd; `RETURNING` bij een upsert met
  `WHERE` is SQLite ≥ 3.35 (D1 ondersteunt dat, alleen lokaal op node:sqlite getest).
- Een vraag die wel bij Anthropic aankwam maar halverwege een stream afbreekt, telt (de
  teller gaat alleen terug bij een niet-2xx of netwerkfout vóór het antwoord).
- Geen AI-verbruik in tokens per gebruiker; alleen het aantal vragen per dag.
- Webkit niet lokaal getest; niet op een echte iPhone. Handleiding niet bijgewerkt.
