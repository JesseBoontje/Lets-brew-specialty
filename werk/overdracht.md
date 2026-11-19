# Overdrachtsbon

Laatst bijgewerkt: 2026-11-19

## Waar Jesse om vroeg
"Zet de skill architect in, bekijk de repository. Zoek uit wat de app is, probeer
te vereenvoudigen en de structuur beter te maken, met behoud van features.
Bedenk nieuwe features of logica. Nieuwe artifacts en bewegende visuals. Doe een
poging om de app heel vet te maken, inclusief database en login en een MCP voor
Claude. Nog ideeën?"

## Wat af is
- Skill architect staat in .claude/skills/architect (actief in deze repo).
  Account-skill: Jesse moet het bestand zelf uploaden op claude.ai.
- app-core.js (8194 regels) is zonder inhoudelijke wijziging opgesplitst in
  app/01-kennis.js t/m app/12-hulp-en-start.js, in dezelfde volgorde.
  Laadvolgorde gecontroleerd op verwijzingen naar latere bestanden: geen.
  Alle 14 node-tests en 15 Playwright-tests (mobiel Chromium) slagen.
  Service worker cache verhoogd naar de volgende versie.

## Wat half is / wacht
- Keuring door de keurmeester van de opsplitsing.
- Inlog + D1 + MCP: wacht op Jesse's keuze voor de inlogmanier.

## Valkuilen
- De cloudomgeving kan workers.dev niet openen: keuren gebeurt lokaal.
- @playwright/test in de repo is 1.64.1, de browser in de omgeving is van 1.63:
  start met executablePath /opt/pw-browsers/chromium-1243/chrome-linux64/chrome,
  alleen het chromium-project (webkit is niet geïnstalleerd).
- Code in app/ deelt globale namen tussen bestanden (klassieke scripts).
  Code die bij het laden draait mag geen naam uit een later bestand gebruiken.

## Eerstvolgende stap
Keurrapport lezen, pull request openen, Cloudflare-check afwachten, Jesse de
testlink geven.
