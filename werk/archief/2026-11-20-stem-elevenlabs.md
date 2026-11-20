# Klus 5: stem ElevenLabs voor stappen hardop (2026-11-20)

- Verkleind op besluit van Jesse: alleen stappen hardop in gietcoach V60/Switch,
  AeroPress-coach en shot clock (nieuw daar). Spraakcoach en AI-coach later.
- Gebouwd: brew-stem.js, /api/stem/voices en /api/stem/zeg in site-worker.mjs,
  STEM_LIMITER 40/min, instellingenvak "voice for the coaches". Commit 48e4dca.
- PR #12 (niet gemerged). CACHE scc-v112.
- Keuring (1 ronde): GOEDGEKEURD. 35 Playwright + 20 node-tests, dry-run en
  npm audit goed. Niet te keuren: Cloudflare-check (faalt al langer), echte
  ElevenLabs, geluid op een echte iPhone.
- Kleine opruimpunten voor later (geen blokkade):
  1. brew-stem.js stilteUrl maakt per ontgrendeling een nieuwe blob-URL (±1 KB).
  2. Na een 401 lopen klaargezette verzoeken nog door (haal() kan eerst
     `afgewezen` controleren).
  3. site-worker.mjs 2 MB-grens kijkt alleen naar Content-Length.
  4. tests/stem.spec.cjs eist 44 px voor het shot clock-knopje i.p.v. 48.
- Bestond al: observability (wrangler.jsonc) logt request-headers; niet
  bevestigd of Authorization wordt weggelakt (ook de OpenAI-sleutel). Jesse apart gemeld.
