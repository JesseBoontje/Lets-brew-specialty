# Verslag stap 1: account + database + sync (26-11, aannemer)

Branch `functie/account-stap1`. Niets gedeployd, geen migratie uitgevoerd.

## Wat gebouwd
- `account-worker.mjs` (nieuw, geïmporteerd door `site-worker.mjs`): passkeys
  (register/login options + verify, logout, me), `POST /api/sync`, `DELETE /api/account`.
  - rpID = hostname van het verzoek, origin = eigen origin (live en previews).
  - Attestation "none", UV verplicht (flags UP+UV), alleen ES256 (-7) en RS256 (-257).
  - Challenge 32 bytes, eenmalig (`DELETE … RETURNING`), 5 min, tabel `challenges`.
  - Sessie: cookie `lb_s` HttpOnly; Secure; SameSite=Strict; Path=/api/; 90 dagen;
    in D1 alleen SHA-256 (hex) van het token. Elk POST/DELETE: Origin = eigen origin, POST JSON.
  - Handle `^[a-z0-9_]{3,20}$`, uniek (bij options én verify gecontroleerd), visibility 'private'.
  - Sync: kinds bean|brew|gear|recipe|dial, max 500 per verzoek (413), per record max 64 KB
    (wordt in `rejected` teruggemeld), data:-strings worden null, laatste updatedAt wint
    (`ON CONFLICT … WHERE excluded.updated_at>=records.updated_at`); verliest een push,
    dan gaat de serverversie mee terug. Ophalen in pagina's van 500 met `more`.
  - DELETE /api/account wist records, passkeys, sessions, follows, likes, blocks, reports
    (beide kanten), ai_usage, challenges en de user.
  - STEM_LIMITER op alle auth-routes behalve /me (sleutel `auth:<ip>`). Geen logging.
- `migrations/0001_init.sql`: alle tabellen uit docs/infra-account-volgen.md + `challenges`,
  index `records(user_id, updated_at)`.
- `wrangler.jsonc`: `d1_databases` binding `DB` top-level (lets-brew) en in `previews`
  (lets-brew-preview), `migrations_dir: migrations`. Stond er nog niet in; `wrangler deploy
  --dry-run` toont env.DB.
- App: `app/11-account.js` (nieuw, in index.html en service-worker.js), vlag `account`
  (def:false, cat:'people'), kaart "your account" bovenaan profile (scherm 1 van de opzet:
  sign in with Face ID / new here? create an account / not now), daarna handle, sync now,
  laatste sync, privacytekst (Engels), sign out, delete account and everything online
  (twee keer bevestigen). CSS onderaan styles.css onder `#acct-card`. CACHE scc-v121.
- SCHEMA.md: nieuw hoofdstuk "Account en sync".

## Keuzes (met reden)
- **Eigen WebAuthn-controle met WebCrypto, geen bibliotheek.** Voor attestation "none" en
  twee algoritmes is het weinig code (CBOR-lezer, authData, DER→raw voor ECDSA), draait
  zonder bundel-gedoe in Workers en is volledig getest met echte sleutels. Een bibliotheek
  (bv. @simplewebauthn/server) trekt veel afhankelijkheden mee voor wat we niet gebruiken.
- **Extra kolom `records.synced_at`** plus index `records(user_id, synced_at)`: een
  volgnummer per gebruiker (sinds de keuring, zie hieronder). "Sinds de vorige sync" hangt
  zo niet af van een klok; `updated_at` (telefoontijd) blijft alleen voor wie-wint.
- **updatedAt via vingerafdruk in `save()`** in plaats van in elk van de tientallen
  opslagplekken. Elk scherm doet zo vanzelf mee, ook toekomstige. Dit stempelen loopt
  altijd (onzichtbaar, ook met de vlag uit), anders zou een later account wijzigingen van
  vóór het aanzetten missen. Tombstones alleen terwijl je ingelogd bent.
- **dial = één record per boon+methode** (`id` = `<beanId>--<methodId>`, data
  `{key, attempts}`); de pogingen zelf hebben geen id. Tijd in `state.sync.dialAt`.
- Recepten: alleen `state.recipes` (de eigen), de ingebouwde niet.
- Foto's: eruit bij versturen (client én server), bij binnenkomst zet de app de eigen
  `data:`-foto terug op dezelfde plek.
- Primaire knop gevuld met `--accent-soft` en crème tekst (huisstijlregel voor gevulde
  knoppen); alle andere knoppen `color:var(--ink);font:inherit`.

## Hoe getest (uitkomst)
- `npm run build`: groen.
- Node: `node --test` security, workspace, stem, account → **35 groen, 0 rood**
  (nieuw `tests/account.test.mjs`, 15 tests: nep-D1 op node:sqlite in `tests/nep-d1.mjs`,
  echte registratie + login met in de test gemaakte ES256- en RS256-sleutels, replay,
  verlopen challenge, verkeerde origin/rpID, zonder UV, EdDSA geweigerd, teller, sync heen
  en terug, last-wins, tombstone, foto eruit, 64 KB, 500, paginering, account wissen,
  rate limit, routering via site-worker).
- Playwright chromium (pw-local.config.cjs, executablePath chromium-1243, `--trace off`):
  **50 groen, 0 rood** (incl. nieuw `tests/account.spec.cjs`, 3 tests: vlag, account maken
  met virtuele authenticator via CDP tegen de echte worker-routes op een nep-D1, sync,
  wissen, binnenkomst nieuwere versie met behoud van foto, offline, uit- en inloggen,
  account wissen; en "not now" stuurt niets).
- `wrangler deploy --dry-run`: bundelt, toont binding env.DB.
- Webkit niet lokaal (niet geïnstalleerd); de account-spec slaat webkit over (CDP).

## Niet af / onzeker
- Migratie moet de architect nog uitvoeren op beide D1's (`migrations/0001_init.sql`).
- Niet op een echte iPhone getest: Face ID/iCloud-passkeys en het cookie op het echte
  domein zijn alleen via de virtuele authenticator gecontroleerd.
- Previews: rpID = hostname van de preview-URL, dus een passkey van live werkt niet op een
  preview (en andersom). Zo bedoeld, maar goed om te weten bij het keuren.
- Na binnenkomst van online wijzigingen wordt het huidige scherm niet opnieuw getekend;
  het verschijnt bij de volgende navigatie.
- Een back-up terugzetten terwijl je ingelogd bent telt als wijziging van alles: dat wordt
  de nieuwste versie online, en wat niet in de back-up zat wordt online gewist.
- `/api/sync` heeft geen eigen rate limit (opdracht vroeg alleen auth-routes); body max 10 MB,
  de app stuurt in stukken van 200 records / 2 MB.
- Na "delete account" blijft de passkey in de sleutelhanger; de app zegt dat je hem bij
  Instellingen → Wachtwoorden weghaalt.

## Herstel na keuring (26-11, afgekeurd op 2 moet + 4 mag)
1. **Sync-cursor** (`account-worker.mjs`, sync): `synced_at` is nu een volgnummer per
   gebruiker, `(SELECT COALESCE(MAX(synced_at),0)+1 FROM records WHERE user_id=?)` in elk
   statement van dezelfde `DB.batch` (één transactie, dus oplopend in commitvolgorde). Pull
   gebeurt ná het schrijven; `now` = hoogste gelezen nummer (zonder nieuws: `since`). Eigen
   schrijfwerk komt dus terug; de telefoon slaat het over (zelfde updatedAt). Test:
   "sync-cursor: volgnummer per gebruiker…" (achterlopende klok, drie gelijktijdige
   verzoeken, uniek en oplopend, niets van een ander).
2. **Tombstone bij binnenkomst** (`acctToepassen`): staat er een tombstone met `at >=
   updatedAt`, dan wordt het record overgeslagen (ook dial, via de id uit `data.key`);
   is online nieuwer, dan komt het terug en verdwijnt de tombstone. Test in account.spec.cjs.
3. Client meet de recordgrootte in bytes (TextEncoder, grens 64 KB zoals de server);
   `sentUpTo` schuift niet voorbij records die de server in `rejected` teruggaf. Melding
   "N too big to sync" in de status.
4. Vingerafdrukken worden na elk binnengekomen stuk en in `finally` ververst; wordt er
   tijdens een sync opgeslagen, dan volgt na afloop een nieuwe ronde (`acctOpnieuw`).
5. Tombstones ook na uitloggen, zolang `sync.lastHandle` gezet is (na account wissen niet).
6. Maximaal 5000 records per gebruiker: `COUNT` vóór het schrijven; alleen echt nieuwe
   records tellen (bijwerken en wissen mag altijd). Anders 413 `{code:'full'}` en er wordt
   niets geschreven; de app toont de melding. Test: "maximum aantal records per gebruiker".

**Geen schemawijziging nodig**: geen 0002-migratie. `synced_at` bestond al; alleen de
betekenis veranderde (volgnummer in plaats van µs-tijd). Let op: stonden er al testrijen in
D1 met µs-waarden, dan telt het volgnummer daarboven verder (blijft oplopend), maar een
telefoon met een oude µs-cursor zou nieuwe rijen missen. Live gebruikt nog niemand het; leeg
het testaccount (delete account in de app) of de testrijen in `records` als ze er zijn.
