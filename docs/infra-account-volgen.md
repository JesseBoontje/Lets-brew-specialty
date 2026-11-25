# Basis voor account, volgen en feed (opzet 25-11, nog niet gebouwd)

Opzet: https://claude.ai/artifact/JDrq9Y2MouPUdYnGRCR8Mw · docs/opzet-account-en-delen.html

## Keuzes
- Inloggen met passkey (Face ID, WebAuthn) in site-worker.mjs. Geen wachtwoord, geen mail.
- Database Cloudflare D1, foto's in R2 (verkleind op de telefoon). Telefoon blijft de basis
  (IndexedDB, offline), D1 is de online kopie; sync per record op `updatedAt`, laatste wint.
- Delen per account: `visibility` private of public. Private: volgverzoek nodig.
- Feed: alleen accounts die je volgt (geaccepteerd), nieuwste eerst, per scherm één item.
- Altijd privé, ook bij public: prijs, eigen notities, wishlist, budget.
- AI: `ai_allowed` per account, alleen admin (Jesse) zet het; sleutel als Worker-secret; teller per dag.

## Tabellen (D1, SQLite)
```sql
users     (id TEXT PK, handle TEXT UNIQUE, name TEXT, visibility TEXT DEFAULT 'private',
           ai_allowed INT DEFAULT 0, is_admin INT DEFAULT 0, created_at INT)
passkeys  (id TEXT PK, user_id TEXT, public_key BLOB, sign_count INT, created_at INT)
sessions  (token_hash TEXT PK, user_id TEXT, expires_at INT)
records   (user_id TEXT, kind TEXT, id TEXT, data TEXT,          -- kind: bean|brew|gear|recipe
           shareable INT, updated_at INT, deleted INT DEFAULT 0, photo_key TEXT,
           PRIMARY KEY (user_id, kind, id))
follows   (follower_id TEXT, followee_id TEXT, status TEXT,       -- pending|accepted
           created_at INT, PRIMARY KEY (follower_id, followee_id))
likes     (user_id TEXT, owner_id TEXT, kind TEXT, id TEXT, created_at INT,
           PRIMARY KEY (user_id, owner_id, kind, id))
blocks    (user_id TEXT, blocked_id TEXT, PRIMARY KEY (user_id, blocked_id))
reports   (id TEXT PK, by_user TEXT, about_user TEXT, reason TEXT, created_at INT)
ai_usage  (user_id TEXT, day TEXT, count INT, PRIMARY KEY (user_id, day))
```
- `id` van de app (uid(), 7 tekens) is uniek per gebruiker; sleutel is daarom (user_id, kind, id).
- `data` = het record zoals de app het nu heeft (JSON), met privévelden eruit gefilterd bij delen.
- Index: `records(user_id, updated_at)` voor sync en feed.

## Routes (site-worker.mjs, later)
/api/auth/* (passkey registreren/inloggen) · /api/sync · /api/feed · /api/follow · /api/u/:handle
· /api/admin/users (alleen is_admin) · /api/ai (alleen ai_allowed, daglimiet 50)

## Nodig in de app bij stap 1
- `updatedAt` zetten bij elk opslaan (bean, brew, gear, recept). Verder niets.
