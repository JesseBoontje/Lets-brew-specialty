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

## Werkwijze: eerst strak, dan overtrekken

Jesse keurde een automatisch overgetrokken foto af ("niet goed genoeg"): de tuit
viel weg en het glimmen van staal gaf losse streepjes. Wat wel werkte: het
voorwerp eerst **strak en juist** tekenen als schone SVG, en daarna door het
script laten overtrekken met de hand-afwijkingen. Dus altijd zo:

1. **Kijk goed.** Bekijk de foto of het voorbeeld met de Read-tool. Schat de
   verhoudingen in pixels van de foto: waar begint de tuit, hoe hoog zit het
   handvat, hoe breed is de bodem tegenover de rand. Tekenen zonder te kijken
   wordt clipart.
2. **Teken schoon.** Schrijf een SVG met de viewBox om het voorwerp heen. Elke
   rand een eigen pad, met absolute `M L Q C`, geen `Z`, geen vulling, geen
   `<circle>` of `<rect>`. Neem op:
   - de buitencontour in losse randen (een rechthoek is vier paden);
   - dikte van dunne delen als twee lijnen (een tuit, een beugel, een buis);
   - een rand bovenaan als twee halve ellipsen plus een binnenrand;
   - één of twee rondingslijnen op een ronde romp, zoals de ribbels van de V60.
     Geen glans of reflecties;
   - kenmerkende details: wijzerplaten, knoppen, een klinkplaatje, een logo-ovaal;
   - donker materiaal als gesloten pad met `class="arceer"`.
   Reken op 12 tot 20 paden voor een eenvoudig voorwerp en 40 tot 60 voor een
   machine.
   Voorbeeld van een goedgekeurde schone SVG: `voorbeelden/schenkkan-schoon.svg`.
3. **Overtrek.**
   ```sh
   python3 scripts/overtrek.py schoon.svg uit.png --svg uit-schets.svg --halen 6 --los 2.8 --kriskras 2
   ```
   Dit zijn de instellingen die Jesse goedkeurde ("losser, meer kriskras zoals
   mijn V60"). Elk pad wordt zes keer overgetrokken: elke haal net scheef, soms
   halverwege gestopt, met doorlopende hoeken en wisselende dikte. Arceerpaden worden losse schuine streepjes.
   `--zaad` met een ander getal geeft een andere hand.
4. **Vergelijk** met een voorbeeld (zie Keuren) en doe hooguit één ronde
   bijstellen: vorm fout, dan de schone SVG aanpassen; te strak, dan `--los` of
   `--kriskras` hoger. Strakker dan deze instellingen niet zonder dat Jesse erom vraagt.

Getest op Jesse's foto van zijn schenkkan: zo kwam de tuit, het handvat en de
open rand er goed uit, in dezelfde lijn als zijn V60-tekening.

**Kleine iconen (24 of 32 units)** teken je direct met de hand met één haal per
rand, zonder het script: op dat formaat lopen meerdere halen in elkaar over.
Overschot 0,5 tot 1 unit op de hoeken, open lussen in plaats van cirkels.

**Losser is beter.** Jesse heeft twee keer gevraagd het losser te maken en nooit
strakker. Overtrek nooit met `<use>` en een verschuiving: twee precies evenwijdige
lijnen lezen als een fotokopie. Dat is eerder afgekeurd.

### Hulpmiddel: schets.py voor een eerste indruk

`scripts/schets.py foto.jpg uit.png` spoort zelf randen op in een foto. Gebruik
het alleen om snel te zien waar de hoofdlijnen liggen of voor een rommelige
achtergrondschets. Als eindresultaat is het niet goed genoeg (afgekeurd).

### Ander hulpmiddel: beeldgenerator (Canva of ElevenLabs)

Alleen als Jesse dat wil: het kost tegoed per afbeelding. Vraag het eerst en
genereer nooit dubbel. Gebruik deze opdrachttekst en vul het voorwerp in:

> Hand-drawn pencil sketch of [voorwerp], front view, drawn with loose dark
> brown ink lines (#3a302a) on a plain white background. Every contour traced
> two to four times with slightly different strokes that cross and overshoot at
> the corners. No shading, no fill, no colour; dark materials shown with dense
> fine parallel hatching. Simplified but recognisable details. Isolated object,
> no text, no background, no shadow.

Een gegenereerd beeld gebruik je als voorbeeld om de schone SVG naar te tekenen
(stap 1 en 2), zodat lijnkleur en dikte gelijk worden aan de rest.

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

- Transparante PNG, langste zijde 1000 px, plus de schone SVG en de geschetste
  SVG, zodat een latere aanpassing bij de schone versie kan beginnen. Bestandsnaam zoals in de app: `m-<methode>.png` voor zetmethodes.
- Voor een app-icoon: dezelfde tekening gecentreerd op het papier `#efe9dd` met
  ruimte eromheen, op 512 en 192 px. Een app-icoon heeft geen transparantie.
- Laat Jesse het resultaat zien als plaatje naast het origineel. Niet de code.
- In een app met de wobble-filter (zoals Lets Brew) mag `filter:url(#wobble-rough)`
  op de afbeelding. Maak Jesse's eigen tekeningen nooit opnieuw: die blijven zoals
  ze zijn.
