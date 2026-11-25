---
name: schetsstijl-natekenen
description: Teken een foto, product, apparaat, logo of icoon na in Jesse's eigen schetsstijl, de bruine potloodlijnen van Lets Brew (espressomachines, mokkapot, V60 en het Lets Brew-logo). Gebruik deze skill zodra Jesse vraagt om iets "na te tekenen", "in mijn stijl", "in de tekenstijl", "als schets", "zoals de andere tekeningen", om een nieuw icoon, logo of methodetekening voor een app, of een foto stuurt met de vraag er een tekening van te maken, ook als hij het woord skill niet noemt.
---

# Natekenen in Jesse's schetsstijl

In de map `voorbeelden/` naast dit bestand staan vijf tekeningen van Jesse: twee
espressomachines, een mokkapot, een V60 op een server en het Lets Brew-logo. Dat
is de maatstaf. Bekijk er minstens één met de Read-tool voordat je begint, en leg
je resultaat er aan het eind naast. Wat in deze skill staat, is uit die vijf
gehaald.

## De stijl, precies

**Inkt en papier**
- Eén kleur: bruinzwart `#3a302a` (gemeten in alle vijf de voorbeelden). Geen
  grijs, geen tweede kleur, geen kleurvlakken.
- Achtergrond transparant. Op een scherm komt de tekening op het papier van de
  app (`#efe9dd`) te liggen.
- Geen schaduw en geen verloop. Donker materiaal wordt **arcering**, niet
  ingekleurd (zie hieronder).

**Lijnen: elke rand twee tot vijf keer**
- Elke contour is met de hand twee tot vijf keer overgetrokken. De halen liggen
  2 tot 6 px uit elkaar op een tekening van 800 px, en dat verschil wisselt langs
  de lijn: op de ene plek bijna op elkaar, verderop duidelijk los.
- Eén haal per rand, niet één pad per vorm. Een rechthoek bestaat uit vier losse
  lijnen die elkaar in de hoeken **kruisen** en met een staartje doorlopen (5 tot
  15 px). Zo lijkt het op een hand die de pen niet neerlegt op de hoek.
- Lijnen sluiten niet netjes: een ellips is een lus die voorbij zijn begin
  doorloopt, met een tweede, iets kleinere lus erin (de wijzerplaten, de knoppen,
  de rand van de V60).
- Rechte lijnen buigen licht. Lijndikte varieert: de eerste haal stevig (ongeveer
  2 px op 800 px), de volgende dunner en lichter.
- Hulplijnen mogen blijven staan: een tweede ellips op de bodem van de server, de
  zijlijnen van de mokkapot die net te ver doorlopen.

**Vorm en detail**
- Recht van voren of licht schuin, rustig en herkenbaar. De espressomachines
  staan recht van voren en symmetrisch; de mokkapot en V60 staan net een beetje
  gedraaid zodat je de vorm ziet.
- Vereenvoudigen, maar het kenmerkende houden: drie wijzerplaten met een naaldje,
  de lekbak als rij horizontale lijntjes, de facetten van de mokkapot als lange
  verticale lijnen, de ribbels van de V60 als een paar lange schuine lijnen, de
  E61-groep met zijn gekartelde vorm.
- Een merklogo dat bij het apparaat hoort (het ECM-ovaal) wordt netjes en leesbaar
  overgenomen. Verder geen merknamen erbij verzinnen.
- Reflecties van glas en staal tekenen we **niet**: die maken lijnen die nergens
  bij horen. Glas is een dunne buitenlijn, meer niet.

**Arcering voor donker materiaal**
- Bakeliet (handvat mokkapot), koffie in de kop van het logo, donkere openingen:
  dicht op elkaar liggende streepjes, bijna evenwijdig, licht scheef (5 tot 15
  graden), elk streepje met een eigen kleine afwijking. Geen vlakvulling.

**Tekst**
- Tekst in een tekening of logo: lettertype Patrick Hand (zoals "Lets Brew
  Specialty" in het logo), in dezelfde inktkleur. Letters niet natrekken, dat
  wordt rommelig; zet de tekst als tekst of als omgezette letterpaden.

## Welke route

Kies er één. Twijfel je, begin dan met route B en werk hem af zoals bij A.

| Wat Jesse aanlevert | Route |
|---|---|
| Een icoon, logo, simpel voorwerp, of "teken een ..." zonder foto | A: met de hand als SVG |
| Een foto of tekening van een apparaat of product | B: script als onderlegger, daarna met de hand af |
| Hij wil veel varianten of een fotorealistische basis | C: beeldgenerator, alleen na zijn akkoord |

### Route A: met de hand als SVG

Werkt voor iconen van 24 px tot tekeningen van 800 px. Regels per formaat:

- **Groot (tekening, 240 tot 1000 units):** schrijf elke contour twee keer zelf
  uit, met eigen controlepunten per haal. Nooit kopiëren met `<use>` en een
  verschuiving: dan krijg je twee precies evenwijdige lijnen, en dat leest als
  een fotokopie in plaats van een pen. Dat is eerder afgekeurd.
  ```html
  <path d="M67.5 19.5 Q120 10.8 172 17.5 Q168.5 26 166 35"/>
  <path class="b" d="M70 17.4 Q118.5 13.2 169.5 19.4 Q167 27 164.8 33.6"/>
  ```
  ```css
  svg{fill:none;stroke:#3a302a;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
  .b{opacity:.62;stroke-width:1.35}
  ```
  Reken op ongeveer 50 tot 60 paden voor een machine; met 11 paden wordt het
  clipart.
- **Klein (icoon 24 of 32 units):** dezelfde regels, maar met één haal, want twee
  lijnen op 2 units afstand lopen op 20 px in elkaar over. Overschot 0,5 tot 1
  unit op de hoeken. Ook hier geen `<circle>`, `<rect>` of `Z`: een cirkel is een
  open lus die voorbij zijn begin loopt.
- **Losser is beter:** Jesse heeft twee keer gevraagd het losser te maken en nooit
  strakker. Ga bij twijfel voor meer overschot en meer verschil tussen de halen.

### Route B: script als onderlegger

`scripts/schets.py` zoekt de randen in een foto en trekt elke rand drie of vier
keer over met eigen afwijkingen, doorlopende hoeken en arcering op donkere delen.
Uit komt een transparante PNG in `#3a302a` en desgewenst een SVG.

```sh
python3 scripts/schets.py foto.jpg uit.png --svg uit.svg
python3 scripts/schets.py logo.png uit.png --modus lijn --arcering 0
```

Instellingen die ertoe doen:
- `--modus foto` voor foto's (standaard), `--modus lijn` voor bestaande lijntekeningen.
- `--detail 0.6` als een foto vol reflecties of achtergrond staat; `1.2` als er
  te weinig lijnen komen.
- `--arcering 0` als er geen donker materiaal in zit, anders laten staan.
- `--zaad 3` (ander getal) geeft een andere hand in dezelfde stijl.

Het script is een **onderlegger, geen eindresultaat**. Getest op Jesse's foto
van zijn schenkkan en van de V60 op de glazen server: de vorm staat goed en het
voelt als potlood, maar dunne delen (een tuit) vallen soms weg en glas en staal
geven losse lijnen van reflecties. Werk het daarom af:
1. Open de SVG en haal losse reflectielijnen en ruis weg (paden korter dan een
   paar procent van de tekening, en lijnen midden in een vlak glas of staal).
2. Teken ontbrekende contouren erbij volgens route A, met twee eigen halen.
3. Zet merklogo's en tekst er netjes in (zie Tekst).
4. Zet de SVG om naar PNG op het gewenste formaat (met Playwright of `rsvg-convert`
   als die er is), transparant.

### Route C: beeldgenerator (Canva of ElevenLabs)

Alleen als Jesse dat wil: het kost tegoed per afbeelding. Vraag het eerst en
genereer nooit dubbel. Gebruik deze opdrachttekst en vul het voorwerp in:

> Hand-drawn pencil sketch of [voorwerp], front view, drawn with loose dark
> brown ink lines (#3a302a) on a plain white background. Every contour traced
> two to four times with slightly different strokes that cross and overshoot at
> the corners. No shading, no fill, no colour; dark materials shown with dense
> fine parallel hatching. Simplified but recognisable details. Isolated object,
> no text, no background, no shadow.

Een gegenereerd beeld haal je daarna altijd door route B (`--modus lijn`) zodat de
lijnen dezelfde kleur en dikte krijgen als de rest.

## Keuren voor je oplevert

Leg je tekening naast een voorbeeld uit `voorbeelden/` (op hetzelfde formaat, op
papier `#efe9dd`) en loop dit na:
- [ ] Is elke rand meer dan één keer getrokken, met verschil tussen de halen?
- [ ] Kruisen de lijnen in de hoeken en lopen ze een stukje door?
- [ ] Alleen `#3a302a`, geen grijs, geen vulling buiten arcering?
- [ ] Is het voorwerp herkenbaar op 64 px (het formaat van een knop in de app)?
- [ ] Geen reflectielijnen, geen losse vlekjes, geen strak geometrisch figuur?
- [ ] Tekst in Patrick Hand, leesbaar?

Lijkt het strakker of netter dan de voorbeelden, maak het dan losser en kijk
opnieuw. Eén verbeterronde, daarna laten zien.

## Opleveren

- Transparante PNG, langste zijde 1000 px, plus de SVG als je die met de hand
  maakte. Bestandsnaam zoals in de app: `m-<methode>.png` voor zetmethodes.
- Voor een app-icoon: dezelfde tekening gecentreerd op het papier `#efe9dd` met
  ruimte eromheen, op 512 en 192 px. Een app-icoon heeft geen transparantie.
- Laat Jesse het resultaat zien als plaatje naast het origineel. Niet de code.
- In een app met de wobble-filter (zoals Lets Brew) mag `filter:url(#wobble-rough)`
  op de afbeelding. Maak Jesse's eigen tekeningen nooit opnieuw: die blijven zoals
  ze zijn.
