# Opdracht na live 1 (26-11 avond, architect) — punten van Jesse met screenshots

Branch `functie/na-live-1` vanaf origin/main. Lees CLAUDE.md, SCHEMA.md, skill lets-brew-house-style,
werk/verslag-stap3-ai.md (hoe /api/ai met de server-sleutel werkt), site-worker.mjs stemRoute, brew-stem.js.

1. ElevenLabs via de server, net als Lets Brew AI:
   - Worker-secret `ELEVENLABS_API_KEY` (Jesse zet hem). /api/stem/voices en /api/stem/zeg: als de app
     geen eigen sleutel meestuurt én de gebruiker is ingelogd, niet locked en ai_allowed=1, dan de
     server-sleutel gebruiken. Daglimiet per gebruiker (bijv. 300 zinnen/dag) in ai_usage met dag-key
     'stem:JJJJ-MM-DD' (geen migratie nodig), atomair zoals /api/ai. Eigen sleutel blijft werken.
     Zonder server-sleutel: nette 503 en de app valt terug op de telefoonstem.
   - Standaardstem: optioneel env `ELEVENLABS_VOICE_ID`; anders kiest de gebruiker uit de lijst.
   - App: in Settings > AI & voice > coach voice een keuze "Lets Brew voice" (zoals Lets Brew AI) en
     "own key". Het grote uitlegblok met sleutelveld alleen tonen bij "own key".
2. Geen zwarte vlakken: de donkere kaart bovenaan Settings, geselecteerde chips (zoals "In stock"),
   en andere ink-gevulde knoppen/vlakken krijgen bruintinten uit de huisstijl (bijv. espresso/accent
   tokens), geen var(--ink)-zwart. Tekst blijft goed leesbaar (contrast checken).
3. AI-knoppen bij de coffee coach/vraagscherm: labels kloppen met de gekozen aanbieder ("Ask Lets Brew
   AI" bij letsbrew, "Ask with my AI key" bij eigen sleutel), nette rij-indeling, en getekende iconen
   in huisstijl in plaats van emoji (🎙). Statusregels in het Engels ("Gesprek gestopt. Microfoon uit."
   → Engels). Zoek ook andere Nederlandse UI-resten in die schermen.
4. Het vlak "wat is er nieuw" onderaan (sheet onder de tabbalk) weghalen; mag niet meer verschijnen.
5. Tabbalk: zorg dat er niets onder of half achter de tabbalk uitsteekt (Jesse streepte de tabbalk aan).

Algemeen: Engelse UI, NL comments, CACHE één keer ophogen, tests (node + Playwright chromium,
executablePath /opt/pw-browsers/chromium, --trace off, lokale config niet committen), screenshots
390x844 van Settings, Beans en het AI-vraagscherm in je verslag noemen. Geen Cloudflare-acties, geen
deploy, niets naar main. Push `functie/na-live-1`. Commit-afsluiting:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XiEucqw1PZLuuXMJGKDUWb
Verslag: werk/verslag-na-live-1.md (wat, keuzes, open, tests met aantallen, screenshot-paden).
