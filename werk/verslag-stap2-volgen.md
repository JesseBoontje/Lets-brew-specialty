# Verslag stap 2: profiel, volgen, feed (26-11, aannemer)

Branch `functie/account-stap2` (vanaf origin/functie/slot-en-sleutel). Niets gedeployd,
geen migratie uitgevoerd, geen Cloudflare-acties.

## Wat gebouwd
- **`social-worker.mjs`** (nieuw, via `site-worker.mjs` voor `/api/social/*` en `/api/foto*`):
  profiel (naam, private/public, tellers brews/beans/followers/following), volgverzoeken
  (private → pending, public → accepted; bij omzetten naar public worden wachtenden
  geaccepteerd), accept/decline, ontvolgen, volger verwijderen, zoeken op begin van de
  handle (exacte treffer bovenaan, max 20), profiel van een ander met items, feed met
  cursor (10 per pagina), likes, blokkeren/deblokkeren, melden (tabel reports), foto's.
  Alle routes vragen een sessie; Origin-check op elke POST/DELETE; JSON verplicht behalve
  bij de foto-upload; alles met bind; niets gelogd.
- **Zichtrechten op één plek** (`magZien`/`relatie`): eigen account, public, of accepted
  volger; nooit bij een block (beide kanten). Block: profiel, zoeken, feed en foto's
  onzichtbaar over en weer, volgen beide kanten verbroken, likes op elkaars records weg.
- **Allowlist** `DEEL_VELDEN` (expliciet, getest): bean `name roaster origin process
  variety roast roasternotes`; brew `title drink beans method brewer dose yield ratio
  time temp score tags ts` + uit beanSnapshot alleen `roaster origin process`. Tekst
  ingekort en zonder stuurtekens, getallen alleen als eindig getal. Gear, recepten,
  dial-in-pogingen nooit.
- **Foto's (R2, binding FOTOS)**: `POST /api/foto?kind=&id=` (alleen image/jpeg of
  image/webp, magic bytes gecontroleerd, max 1 MB, record moet van de sessie zijn),
  sleutel `<user-id>.<random>` in `records.photo_key`, oude foto weg; `GET
  /api/foto/<sleutel>` met dezelfde rechten als het record; `DELETE /api/foto`.
  `account-worker.mjs`: een gewist record via sync wist ook zijn foto (photo_key NULL +
  R2), account wissen wist alle foto's van die gebruiker.
- **Rate limits**: STEM_LIMITER, sleutel `social:<soort>:<user-id>` (zoek, volg, like,
  blok, meld, foto) op zoeken, volgen/verzoek/volger, like, blokkeren, melden, foto
  op/weg. Feed, profiel en foto ophalen niet (een feed laadt veel foto's).
- **`wrangler.jsonc`**: `r2_buckets` FOTOS stond er nog niet in; toegevoegd top-level
  (`lets-brew-fotos`) en in `previews` (`lets-brew-fotos-preview`), beide `jurisdiction:"eu"`.
- **App `app/11-volgen.js`** (nieuw, in index.html en service-worker.js), vlag `social`
  (def:false, cat:'people', werkt alleen met vlag account + ingelogd):
  - Kaart "your profile" op Settings onder "your account": @handle, tellers, naam,
    private/public-schakelaar, volgverzoeken (accept/decline), find people, followers
    (remove), following (unfollow/cancel), blocked (unblock), wat anderen zien.
  - Pagina `person`: profiel van een ander, follow/ask to follow/requested/unfollow,
    hun verzoek accepteren, items met like/try/share, "more", report en block.
  - Pagina `feed`: één kaart per scherm, `scroll-snap-type:y mandatory`, donkere kaart
    var(--ink) met var(--paper)-tekst, foto of getekende kop/boon (overgetrokken lijnen),
    "swipe up", zijknoppen like (getekend hart + teller), try, share — alle als inline SVG,
    geen emoji. Laadt door bij het naar beneden vegen.
  - try: brew → eigen recept in `state.recipes` (staat in brew ideas), zelfde methode of
    een uit dezelfde familie, met twee eenvoudige stappen bij filter; bean → wishlist.
    Dubbel proberen wordt herkend (`van`-veld).
  - share: `/?u=<handle>` via het deelmenu, anders klembord; zo'n link opent het profiel.
  - Foto's: na elke geslaagde sync verkleint de app eigen foto's (1280 px, jpeg 0.8,
    zo nodig kleiner tot ≤1 MB) en zet ze online; weggehaalde foto's gaan ook online weg.
  - Privacytekst van de accountkaart aangepast (foto's gaan alleen mee met follow & feed).
- CACHE `scc-v123` (main staat al op v122). SCHEMA.md: hoofdstuk "Volgen en feed".
  CLAUDE.md: bestanden bijgewerkt.

## Keuze Learn en de tabbalk
**Gekozen (minst ingrijpend):** Feed komt als **zesde tab** tussen Learn en Settings, en
alleen als de vlag `social` aan staat en je ingelogd bent. Zonder vlag blijft de balk
precies zoals hij was (vijf tabs, getest). De balk wordt gebouwd in `brew-workspace.js`;
daar staat `feed` nu in de lijst, verborgen tot `volgNav()` hem toont.
**Voorstel voor later:** als Feed vaste tab wordt, Learn verhuizen naar een kaart
bovenaan Home ("learn & do"), zodat de balk weer vijf tabs heeft zoals in de schets.
Zes tabs passen op een iPhone 13 (390 px), maar de labels staan krap.

## Migratie
**Geen migratie 0002 nodig.** Alles past in 0001 (follows, likes, blocks, reports,
records.photo_key, users.name/visibility). De feed sorteert op `records.updated_at`
(index `records(user_id, updated_at)` bestaat) en filtert dial-ins met `json_extract`.

## Tests (uitkomst)
- `npm run build`: groen.
- Node: **42 groen, 0 rood** (was 35; nieuw `tests/social.test.mjs` met 7 tests en
  `tests/nep-r2.mjs`): allowlist, volgen/verzoeken, zichtrechten private/pending/
  accepted/public/block, zoeken, feed-cursor (24 items over 3 pagina's, geen gaten of
  dubbelen, gelijke tijd), likes, foto-rechten en opruimen, Origin/JSON/405, rate-limit-
  sleutels, routering via site-worker.
- Playwright chromium (lokale config, executablePath /opt/pw-browsers/chromium,
  `--trace off`): **52 groen, 0 rood** (nieuw `tests/volgen.spec.cjs`, 2 tests: twee
  accounts, foto verkleind naar R2, zoeken + ask, accept, feed toont brew en bean zonder
  privévelden, scroll-snap en kleur, foto 1280 px geladen, try → recept in brew ideas en
  boon op wishlist, like-teller, block verbergt over en weer; en vlag uit = geen tab/kaart
  /calls). `tests/route.spec.cjs` telt nu de *zichtbare* tabs (verborgen feed-knop).

## Niet af / onzeker
- R2-binding staat in wrangler.jsonc maar is niet tegen echte buckets geprobeerd
  (geen `wrangler deploy --dry-run` gedraaid); controleer bucketnamen bij deploy.
- Feed-volgorde is `updated_at`: een oude boon die je bewerkt (bv. op op voorraad zetten)
  schuift weer naar boven. Volgorde op aanmaaktijd vraagt een kolom + index (dan wél 0002).
- Foto's: alleen bonen hebben nu een foto in de app; brews kunnen het al als `photo` er is.
  Een foto komt pas online na een sync terwijl de vlag aan staat; zet je de vlag uit, dan
  blijven bestaande online foto's staan (tot record of account gewist wordt).
- Geen pushmelding bij een volgverzoek; je ziet het op Settings. Geen admin-scherm voor
  meldingen (stap 3).
- Likes van iemand die je later blokkeert worden gewist, maar tellers van derden niet herteld
  (ze tellen live).
- Webkit niet lokaal getest; niet op een echte iPhone (deelmenu, scroll-snap-gevoel).
- In de Playwright-test komen sessies rechtstreeks in de tabel (inloggen zelf is in stap 1
  getest).
