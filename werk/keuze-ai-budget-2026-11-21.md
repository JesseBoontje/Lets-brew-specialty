# Keuze: AI-budget realistischer (21-11-2026)

Wat er onrealistisch was:
1. Eén prijs per aanbieder. Wisselde je van model (bijv. Sonnet 4.6 naar Haiku 5.5),
   dan rekende de app door met de oude prijs (30× te hoog in dat voorbeeld).
2. Schattingen per vraag te laag. Een brew-vraag stuurt drie regelblokken mee
   (~1000 tokens) en vaak je eigen bonen/recepten/brews (lokale context); de app
   schatte 600 tokens in.
3. Eigen gemiddelden in dollars: na een modelwissel bleven ze de oude prijs dragen.
4. De melding "nog ~N vragen" rekende altijd met een finder-vraag.
5. Nieuwere modellen denken eerst na; dat wordt als uitvoer betaald.

Gekozen:
- Prijslijst per model in app/08-ai.js (AI_PRIJZEN, peil nov 2026). Anthropic uit de
  officiële lijst (o.a. Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Sonnet 4.6 $3/$15,
  Haiku 5.5 $0,10/$0,50). OpenAI uit de bekende lijst, niet live nagekeken.
  Model met datum erachter valt onder zijn naam. Onbekend model: de app zegt dat
  het een gok is en vraagt de echte prijs.
- Eigen prijs geldt per model (sleutel scc_ai_prijs_<aanbieder>:<model>). Een oude
  eigen prijs voor de aanbieder telt alleen nog voor modellen die niet in de lijst staan.
- Telling per soort vraag ook in tokens (ti/tu/tn), gerekend tegen de prijs van
  het huidige model. Oude tellingen (alleen dollars) blijven werken.
- Schatting = nagemeten prompt + gemeten lokale context (tekens/3,2) +
  uitvoer ×1,8 voor modellen die altijd nadenken.
- Melding rekent met de soort vraag die je net stelde.
- Zichtbaar gemaakt: spraakcoach en ElevenLabs-stem tellen niet mee.
- Standaardmodel NIET veranderd (blijft claude-sonnet-4-6): een nieuwer model
  denkt altijd na en kan de korte antwoordlimieten in de app overschrijden.
  Dat is een eigen klus als Jesse een ander standaardmodel wil.
