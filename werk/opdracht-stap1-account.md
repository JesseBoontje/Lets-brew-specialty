# Opdracht stap 1: account + database + sync (26-11, architect)

Besluit Jesse 25-11: "Ga alles bouwen". Opzet: docs/opzet-account-en-delen.html (scherm 1),
basis: docs/infra-account-volgen.md. Lees CLAUDE.md, SCHEMA.md, skill lets-brew-house-style.

## Al geregeld (architect)
- D1 live `lets-brew` id b737aed4-ac22-4e08-9c79-d315802777aa, preview `lets-brew-preview`
  id 4f37078c-71e1-4aa1-9837-a37c1ef83dd3 (account 1aaa91af61ee9076f80653f8a1a554d7, eu).
  Binding-naam `DB`, in wrangler.jsonc bij top-level én in "previews". Migraties schrijf je in
  `migrations/0001_init.sql`; de architect voert ze uit via de API (jij niet).

## Bouwen
1. Worker (`site-worker.mjs`, mag een nieuw bestand `account-worker.mjs` importeren):
   - Passkeys (WebAuthn) zonder wachtwoord: /api/auth/register/options, /register/verify,
     /login/options, /login/verify, /logout, /me. rpID = hostname van het verzoek (live én
     previews werken). Attestation "none", userVerification "required", alleen ES256 (-7) en
     RS256 (-257). Challenge eenmalig, 5 min geldig, in D1. Eigen kleine verificatie met
     WebCrypto mag, of een vastgepinde, kleine npm-bibliotheek die in Workers draait; motiveer.
   - Sessie: cookie `lb_s`, HttpOnly, Secure, SameSite=Strict, Path=/api/, 90 dagen; in D1 alleen
     de SHA-256 van het token. Elk POST: Origin moet gelijk zijn aan eigen origin (zoals stemRoute).
   - Handle bij registreren: ^[a-z0-9_]{3,20}$, uniek. visibility standaard 'private'.
   - /api/sync POST {since, changes:[{kind,id,data,updatedAt,deleted}]}: kind in bean|brew|gear|
     recipe|dial; per record max 64 KB (data:-foto's eruit, die komen in stap 2); laatste
     updatedAt wint; antwoord {now, changes van server sinds `since`}. Max 500 per verzoek.
   - DELETE /api/account: alles van die gebruiker weg (records, passkeys, sessies, follows...).
   - Rate limit met bestaande STEM_LIMITER op auth-routes. Nooit tokens of sleutels loggen.
   - Tabellen volgens docs/infra-account-volgen.md (alle tabellen nu al aanmaken, ook follows,
     likes, blocks, reports, ai_usage, plus `challenges`), met index records(user_id, updated_at).
2. App:
   - Featurevlag `account` in FEATURES (app/11), def:false, cat:'people'. Alles erachter.
   - `updatedAt` bij elk opslaan van bean, brew, gear, recept, dial-in-poging; bij wissen een
     tombstone (lijst in state) zodat sync het wissen doorgeeft. Bestaande data zonder updatedAt
     krijgt bij eerste sync ts of nu.
   - Settings > Account: scherm zoals opzet scherm 1 (sign in with Face ID / not now), daarna
     handle, "sync now", laatste sync, privacytekst (kort, Engels: wat er bewaard wordt, waar
     (Cloudflare, EU), dat prijs/notities privé blijven, hoe wissen), knop "delete account and
     everything online" met bevestiging. Huisstijl volgen, knoppen color:var(--ink);font:inherit.
   - Sync automatisch na opslaan (debounce 5 s) en bij openen, alleen als ingelogd en online.
     Offline mag niets breken. Telefoon blijft de bron; merge op updatedAt.
   - Nieuwe bestanden ook in index.html en service-worker.js; CACHE één keer ophogen.
   - SCHEMA.md bijwerken (updatedAt, tombstones, account).
3. Tests: node-test voor de worker-routes met een nep-D1 op `node:sqlite` (Node 22) en een
   echte WebAuthn-registratie/login met een in de test gemaakte ES256-sleutel; Playwright (chromium)
   voor het accountscherm achter de vlag (virtual authenticator via CDP mag). Bestaande tests groen.
   Lokaal: pw-local.config.cjs met executablePath /opt/pw-browsers/chromium (zie werk/overdracht.md).

## Werkwijze
- Branch `functie/account-stap1` vanaf functie/slot-en-sleutel. Kleine commits, push met
  `git push -u origin functie/account-stap1`. Commit-afsluiting: zie architect.
- Niets naar main, geen PR. Geen secrets in code of chat.
- Klaar = `npm run build` en tests groen. Lever een kort verslag in werk/verslag-stap1-account.md:
  wat gebouwd, keuzes, wat niet af, hoe getest (met uitkomst).
