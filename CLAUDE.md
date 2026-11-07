# Lets Brew Specialty

## Wat het is
Een koffie-brew tracker ("brew. record. share.") in een handgetekende, beige stijl: bonen, zetmethodes, recepten, logboek en een koffiecoach. Geen inlog en geen gedeelde server. Elke gebruiker voert zijn eigen Anthropic- of OpenAI-sleutel in.

## Gebruikers
Jesse en zijn vrienden Bart en Ralph, op de iPhone, als app op het beginscherm.

## Live
- Productie (nieuw): Worker `lets-brew-specialty` in het nieuwe Cloudflare-account van jesseboontje@protonmail.com. De workers.dev-URL volgt na de eerste geslaagde deploy.
- Oude versie: https://letsbrewspecialty.jesseboontje.workers.dev in het oude Cloudflare-account. Die blijft online tot Jesse, Bart en Ralph hun data hebben overgezet, en wordt pas daarna verwijderd.
- Deploy: Workers Builds. `main` gaat met `npx wrangler deploy` live. Andere branches gaan met `npx wrangler versions upload` en vervangen de liveversie niet.

## Techniek
- Statische app (`index.html`, `app-core.js`, `styles.css`, `brew-*.js`) plus een service worker. `site-worker.mjs` handelt `/api/*` af, met rate limiting.
- Bouwen: `npm run build`, dat `dist/` maakt. Testen: `npm test` (node-tests en Playwright op Chromium en WebKit). GitHub Actions draait beide bij elke pull request.
- Data staat op de telefoon (IndexedDB/localStorage). `SCHEMA.md` beschrijft het datamodel. README.md is leidend als iets in een skill of document anders zegt.

## Vaste regels
- Nooit direct op `main`. Volg de skill functie-bouwen: branch, pull request, preview, pas na akkoord van Jesse mergen.
- **Verander de Worker-naam of de URL nooit zonder verhuisplan voor de data.** Opgeslagen data hoort bij de URL. Een nieuwe URL heeft eerder tot dataverlies geleid; gebruikers moeten dan eerst exporteren in de oude app en importeren in de nieuwe. `storage.persist()` en export/import (`.lbsbeans.json`, `.lbsbrew.json`) zijn de vangnetten en moeten blijven werken.
- Geen geheime sleutels in de repo. Gebruikerssleutels blijven alleen in het tabbladgeheugen.
- Bij een nieuwe versie het cacheversienummer van de service worker ophogen, anders zien gebruikers de oude app.
- Bestaande data nooit overschrijven bij een migratie. Een onbekende opslagvorm blokkeert opslaan, en export blijft mogelijk.

## Werkinstructies in deze repo
In `.claude/skills/` staan instructies voor deze app. In een Claude-project worden ze niet automatisch geladen, dus lees het passende bestand zelf voordat je begint:
- uiterlijk of stijl aanpassen → `.claude/skills/lets-brew-house-style/SKILL.md`
- nieuwe functie bedenken of mockup → `.claude/skills/nieuwe-feature/SKILL.md`
- nakijkversie of "Opdracht voor Lets Brew" → `.claude/skills/wijzigingen-aanwijzen/SKILL.md`
- handleiding bijwerken → `.claude/skills/lets-brew-handleiding/SKILL.md`

## Beslissingen
- 2026-10-24: overgezet naar een Cloudflare Worker op de bestaande workers.dev-URL.
- 2026-11-07: repo verhuist naar het GitHub-account JesseBoontje. Overstap naar een nieuw Cloudflare-account: de Worker heet nu `lets-brew-specialty`, de account-id is uit `wrangler.jsonc` gehaald (het account volgt uit de build-token).
