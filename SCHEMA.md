# De datalaag van Lets Brew Specialty

Beans, brews en methods met hun koppelingen, in één vaste vorm. Bedoeld om
andere software op te kunnen aansluiten zonder dat die de binnenkant van de app
hoeft te kennen.

De app bewaart alles in IndexedDB op je eigen toestel. Deze laag verandert daar
niets aan: er gaat niets naar een server, en er is **niets van buitenaf te
schrijven**. Wat je hier ophaalt is een kopie — muteren doet niets met je
logboek. Nieuwe gegevens komen alleen binnen via de schermen zelf of via
*profile → add from a friend*.

## Versie

`schema: 2`. Bij een verandering die bestaande lezers breekt gaat dat nummer
omhoog; velden erbij mag binnen dezelfde versie. Controleer `schema` voordat je
de rest leest.

## Waar je erbij kan

### 1. `window.LetsBrew` — op dezelfde pagina

```js
LetsBrew.schema            // 2
LetsBrew.appVersion        // "2026.10-workspace2"

LetsBrew.methods()         // alle zetmethodes
LetsBrew.beans()           // alle bonen
LetsBrew.recipes()         // ingebouwde recepten + die van jou
LetsBrew.gear()            // je molens, machines, brewers

LetsBrew.method(id)
LetsBrew.bean(id)
LetsBrew.brew(id)

LetsBrew.brews(filter)     // filter: {beanId, methodId, since, dialInOnly, limit}
LetsBrew.beanGraph(id)     // één boon met al zijn brews, methodes en dial-log
LetsBrew.graph()           // alles in één keer
```

`since` mag een ISO-string of een timestamp in ms zijn. Brews komen altijd
nieuwste eerst.

### 2. `postMessage` — vanuit een venster op dezelfde origin

```js
frame.contentWindow.postMessage(
  { lb:'query', id:'1', method:'brews', arg:{ beanId:'abc', limit:10 } }, location.origin);

window.addEventListener('message', e => {
  if (e.data && e.data.lb === 'result' && e.data.id === '1') {
    console.log(e.data.schema, e.data.data, e.data.error);
  }
});
```

`method` is een naam uit de lijst hierboven, `arg` het enige argument. Het
antwoord is `{lb:'result', id, schema, data, error}`; bij een onbekende methode
staat `data` op `null` en zegt `error` welke naam niet klopt.

> Veiligheidsgrens: alleen berichten vanaf exact dezelfde origin (schema,
> host én poort) worden beantwoord. Andere websites mogen het logboek niet
> opvragen. Controleer als ontvanger ook `e.origin` en `e.source`. Antwoorden
> gaan naar de gecontroleerde origin, nooit naar `*`. Met de nieuwe
> beveiligingsheaders mag de app niet in een iframe worden ingebed; gebruik
> voor een koppeling op dezelfde origin `window.open` of de bestands-export.

### 3. `?api=graph` — als losse JSON-pagina

`https://<app-url>/?api=graph` toont hetzelfde model als kale JSON. Handig voor
een iOS Shortcut of een script dat de pagina in een browser opent. Ook hier
geldt de opslagscheiding: dit werkt alleen in een browser waar de app zijn
gegevens al heeft staan.

### 4. Bestand

*profile → connect other software* heeft knoppen om dezelfde JSON te kopiëren of
te downloaden (`lets-brew-data.json`). Dat is de weg als de andere software niet
in dezelfde browser draait.

Dit is iets anders dan *export everything*: die maakt een back-up in de interne
vorm van de app, bedoeld om terug te zetten. Voor een koppeling wil je de vorm
van dit document.

## Het model

Alle koppelingen lopen via `id`. Tijden staan er dubbel in: `time` zoals jij het
noteerde (`"0:28"`) en `timeSec` in seconden, zodat je niet hoeft te parsen.
Datums zijn ISO-8601 in UTC. Ontbreekt iets, dan is het `null` — nooit een lege
string of een 0 die iets anders betekent.

### method

| veld | | |
|---|---|---|
| `id` | string | sleutel |
| `name` | string | zoals jij hem noemde |
| `family` | `"espresso"` \| `"filter"` | bepaalt welk scherm de app gebruikt |
| `enabled` | bool | staat aan in de app |
| `gearIds` | string[] | verwijst naar `gear[].id` |

### bean

| veld | | |
|---|---|---|
| `id` `name` | string | |
| `roaster` `origin` `process` `variety` | string \| null | van de zak |
| `regions` | object[] | de plekken op de kaart die je zelf aanwees, in volgorde: `{land, i}` — `land` is een land-id uit de keuzehulp, `i` de index van de streek binnen dat land, of `null` als alleen het land bekend is. Een single origin heeft er één, een blend meer. Leeg als je niets aanwees; de app leest dan het land uit `origin`. |
| `region` | object \| null | de eerste uit `regions`, of `null`. Alleen voor lezers van vóór deze versie — nieuwe code leest `regions`. |
| `altitudeM` | number \| null | teeltHoogte in meters, uit een bereik het midden |
| `roastLevel` | `light` \| `medium-light` \| `medium` \| `medium-dark` \| `dark` \| null | |
| `roastDate` | `YYYY-MM-DD` \| null | |
| `daysSinceRoast` | number \| null | uitgerekend |
| `roasterNotes` `notes` | string \| null | smaaknoten van de brander, en die van jou |
| `inStock` | bool | |
| `decaf` | bool | afgeleid uit naam en noten |
| `bagLabel` | `espresso` \| `filter` \| `both` \| null | wat de zak zelf zegt |
| `methodIds` | string[] | |
| `lastMethodId` | string \| null | de methode die je de vorige keer bij deze boon koos; staat bovenaan in het keuzescherm "how do you brew it?" |
| `brewIds` | string[] | |
| `dials` | object | per `methodId` de dial die je aftekende, zie hieronder |

`dials[methodId]` = `{grind, dose, yield, time, timeSec, drink, at}`. Dit is wat
je met *dial-in nailed* hebt vastgelegd: de waarden die het deden, niet een
suggestie. Leeg zolang je op die methode niets hebt afgetekend.

### brew

| veld | | |
|---|---|---|
| `id` `at` | string | `at` is ISO |
| `methodId` `beanId` | string \| null | Elke nieuwe brew hoort bij een boon. `beanId` is alleen null bij een oude brew die nog niet gekoppeld is (of waarvan de boon is verwijderd); de app koppelt die zelf op naam als precies één boon zo heet, de rest koppel je in *brews* |
| `beanName` | string \| null | zoals ingetypt, ook als er geen `beanId` is |
| `title` `drink` | string \| null | `drink` is bv. `flat white` |
| `dose` `yield` `ratio` | number \| null | gram in, gram uit |
| `time` `timeSec` | string \| number \| null | |
| `grind` | string \| null | vrije tekst: molens tellen niet hetzelfde |
| `grinder` | string \| null | de naam van de molen waarop `grind` gedraaid is |
| `brewer` | string \| null | waar je in brouwde, zoals ingetypt |
| `temp` `score` | number \| null | score van 0 tot 10 |
| `tags` | string[] | wat je proefde |
| `notes` | string \| null | |
| `isDialIn` | bool | hoort bij de dial-in-lus, niet bij je gewone logboek |
| `target` | object \| null | het doel waar je naartoe werkte |
| `shot` | object \| null | alleen bij espresso uit de shot clock: `{pre, rest, full, total, drop, yieldEstimated}` in seconden. `pre` en `rest` zijn 0 zonder pre-infusie; `full` is de tijd onder volle druk (die telt voor de doeltijd en staat ook in `time`), `total` vanaf de hendel; `drop` de eerste druppel of null; `yieldEstimated` true als het gewicht niet is nagewogen |

### recipe

`{id, name, family, methodId, dose, ratio, temp, grind, targetGrind, own}` —
`own` is `true` voor recepten die je zelf schreef.

Intern heeft een eigen recept ook `houding`: `"normaal"` of `"omgekeerd"` bij een
aeropress, en `null` bij alle andere methodes. Staat hij op omgekeerd, dan zit er
een stap met `k:"keer"` in `stappen` op het moment dat je hem omdraait.

Bij een Hario Switch draagt elke stap in `stappen` daarnaast een `klep`:
`"dicht"` (het water blijft staan — immersie) of `"open"` (het loopt door —
percolatie), en `null` bij elke andere methode. Het is een stand, geen
gebeurtenis: de app laat hem alleen zien op de stap waar hij verandert.

### pre-infusie per recept (intern: `recipePre`)

`{"<recept-id>": {on, s, rust}}` — wat je in de shot clock instelt voor een
espressorecept: pre-infusie aan/uit, de seconden pre-infusie (1–15) en de rust
daarna (0–10). Zonder eigen instelling geldt `pre` van het ingebouwde recept, en
anders 5 s pre en 3 s rust. Zonder gekozen recept heet de sleutel `target`.

### tarra-gewichten (intern: `tare` en `tareOn`)

`tare` is `{naked, spout, ring, ps1, ps2, cup}`: het eigen gewicht in gram van
naked portafilter, double spout portafilter, dosing ring, puck screen 1 en 2 en
dosing cup, één keer gewogen op een lege, genulde weegschaal (*profile → my
gear*). Een onderdeel zonder gewicht ontbreekt. `tareOn` onthoudt welke
onderdelen er in het tarra-vak van de shot clock op de weegschaal liggen
(`{naked:true, ring:true}`); naked en double spout sluiten elkaar uit.

### dialLog

Elke poging apart, in de volgorde waarin je ze deed. Per boon + methode, laatste
twaalf.

```json
{ "beanId":"…", "methodId":"espresso",
  "attempts":[{"at":"…","grind":"4.2","time":"0:28","timeSec":28,"yield":36,"dose":18}] }
```

### wishlist

Bonen die je via de keuzehulp koos maar nog niet gekocht hebt. Ze staan boven
je bonenplank, en "gekocht" opent het bonenformulier met alles al ingevuld.

Een wens komt uit de keuzehulp, of je vult hem zelf in (*beans → op mijn
lijstje → zelf een zak toevoegen*). `regions` werkt hetzelfde als bij een boon,
dus een blend verschijnt op de kaart bij elk van zijn herkomsten.

```json
{ "id":"…", "naam":"Kirinyaga AA", "name":"Kirinyaga AA",
  "brander":"Friedhats", "url":"https://…", "origin":"Kirinyaga · Kenia",
  "regions":[{"land":"kenia","i":0}], "proces":"washed", "altitude":"1700-1900",
  "variety":"SL28, SL34, Ruiru 11", "brand":"light",
  "roasternotes":"tomaat-zoet, rode appel",
  "smaak":["tomaat-zoet","rode appel"], "notitie":"", "zoek":"…",
  "at":1234567890 }
```

Een wens en een boon komen uit hetzelfde formulier (*beans → ＋ add*, met de
keuze *op mijn plank* of *op mijn lijstje*), dus de velden lopen parallel:
`naam`/`name`, `brander` ↔ `roaster`, `proces` ↔ `process`, `brand` ↔
`roastLevel`, `notitie` ↔ `notes`. Sla je een wens op als *op mijn plank*, dan
verdwijnt hij hier en verschijnt hij als bean.

Wensen van vóór deze versie bewaarden hun herkomst als losse namen (`land`,
`streek`). Die worden bij het laden één keer omgezet naar `regions`.

### gear

`{id, name, category, kind, grindMin, grindMax}` — `category` is de methodefamilie
waar het bij hoort (`espresso` / `filter` / `algemeen`). `kind` zegt wat het
ding zelf is: `"grinder"`, `"brewer"`, of `null` voor een los accessoire (tamper,
WDT-tool, puckscreen). Alleen bij `kind:"grinder"` zijn `grindMin`/`grindMax`
ooit ingevuld — het volledige bereik van die molen, in wat voor eenheid hij
ook gebruikt (klikken, een schaal 1–100, noem het). Zonder opgegeven bereik
zijn beide `null`.

## Account en sync (vlag `account`, stap 1)

Een account is optioneel en staat standaard uit (*profile → features → account &
sync*). Zonder account verandert er niets: alles blijft op de telefoon.

### `updatedAt` en tombstones

- Elke bean, brew, gear en eigen recept krijgt bij elk opslaan waarin hij
  veranderde een `updatedAt` (ms sinds 1970, klok van de telefoon). De app ziet
  zelf welke records veranderden (vingerafdruk per record in `save()`), dus elk
  scherm doet mee zonder eigen code. Dat stempelen loopt altijd, ook zonder
  account, zodat een later account niets mist.
- De dial-in-pogingen (`dialLog`) zijn lijsten zonder eigen veld; hun tijd staat
  in `sync.dialAt["<beanId>--<methodId>"]`.
- Bestaande data zonder `updatedAt` krijgt bij de eerste sync zijn eigen tijd
  (`ts` of `at`), anders het moment van syncen.
- Wat je wist terwijl je ingelogd bent, komt als tombstone in `sync.tomb`:
  `{kind, id, at}`. Na een geslaagde sync verdwijnt de tombstone weer.

### `sync` (intern, in de back-up)

```json
{ "user":{"handle":"jesse","visibility":"private"}, "lastHandle":"jesse",
  "since":1764150000000000, "sentUpTo":1764150000000, "last":1764150000000,
  "tomb":[{"kind":"brew","id":"abc1234","at":1764150000000}],
  "dialAt":{"abc1234--espresso":1764150000000}, "later":false }
```

`user` is `null` als je niet (meer) ingelogd bent. `since` is de servertijd van
de vorige sync (in microseconden), `sentUpTo` de telefoontijd tot waar alles al
online staat. `later` onthoudt "not now, keep it on this phone". De sessie zelf
zit in een HttpOnly-cookie (`lb_s`) en is voor de app onzichtbaar.

### Wat online staat

Cloudflare D1 (EU), tabel `records`: per gebruiker `(kind, id)` met
`kind` = `bean` | `brew` | `gear` | `recipe` | `dial` en `data` = het record zoals
de telefoon het heeft, zonder `data:`-foto's (bij binnenkomst zet de app de eigen foto terug; met de
vlag `social` gaat een verkleinde kopie apart naar R2, zie hieronder). Max 64 KB per record.
Een `dial`-record is `{key:"<beanId>|<methodId>", attempts:[…]}`. Merge per record
op `updatedAt`: de nieuwste wint, op de server en op de telefoon. Prijs en eigen
notities gaan wel mee naar je eigen online kopie, maar worden nooit aan anderen
getoond. *delete account and everything online* wist alles van je account in één
keer; de telefoon houdt zijn eigen kopie.

Routes (alleen voor de app zelf, `Origin` moet kloppen): `/api/auth/register/*`,
`/api/auth/login/*`, `/api/auth/logout`, `/api/auth/me`, `POST /api/sync`
`{since, changes:[{kind,id,data,updatedAt,deleted}]}` → `{now, more, changes,
rejected}`, en `DELETE /api/account`.

## Volgen en feed (vlag `social`, stap 2)

Staat standaard uit (*Settings → features → follow & feed*) en werkt alleen met
een account. Zonder de vlag gaat er niets extra's online.

### Zichtrechten

Een ander ziet jouw brews en beans alleen als jouw account `public` is, of als
hij een geaccepteerde volger is. Nooit als een van jullie de ander blokkeerde.
Private: een volgverzoek staat op `pending` tot jij accepteert; public: meteen
`accepted` (en wie wachtte, wordt bij omzetten naar public geaccepteerd).
Blokkeren verbergt over en weer (profiel, zoeken, feed, foto's), verbreekt
volgen beide kanten op en wist de likes op elkaars records. Gear, eigen
recepten en dial-in-pogingen (`dialIn`/`kind:"dial-in"`) worden nooit gedeeld.

### Wat een ander krijgt (allowlist, `DEEL_VELDEN` in social-worker.mjs)

| kind | velden |
|---|---|
| bean | `name` `roaster` `origin` `process` `variety` `roast` `roasternotes` (max 140 tekens) |
| brew | `title` `drink` `beans` (naam van de boon) `method` (id) `brewer` `dose` `yield` `ratio` `time` `temp` `score` `tags` (max 12) `ts`, en uit `beanSnapshot` alleen `roaster` `origin` `process` |

Alles daarbuiten gaat nooit naar een ander: `price`, `bagsize`, `notes`, `url`,
`roastdate`, `grind`, `grinder`, `custom`, `prep`, `target`, wishlist, budget.
Een item in feed of profiel is `{kind, id, owner:{handle,name}, at, data,
photo, likes, liked}`; `photo` is `/api/foto/<sleutel>` of `null`.

### Foto's (R2, binding `FOTOS`)

Na een geslaagde sync verkleint de app de eigen `data:`-foto van een bean of brew
(max 1280 px, jpeg 0.8, max 1 MB) en zet hem online; `sync.fotos["bean/<id>"] =
{h}` onthoudt wat er al staat. Online heet hij `foto/<user-id>.<willekeurig>` en
staat de sleutel in `records.photo_key`. Ophalen kan alleen met dezelfde
zichtrechten als het record. Wissen via sync, `DELETE /api/foto` of account
wissen haalt hem ook uit R2. De telefoon houdt zijn eigen foto. Zet je de vlag
`social` uit, dan gaat je account online terug naar `private` (lukt dat niet, dan bij de
volgende sync: `sync.socialUit`), maar foto's die al online staan blijven daar tot je het
record of je account wist. Opgehaald worden ze met `Cache-Control: private, no-store`.
Een private profiel zonder geaccepteerd volgen toont alleen handle en naam (`counts:null`).

### Routes (sessie nodig, `Origin` moet kloppen bij POST/DELETE)

`GET /api/social/me` (profiel, tellers, verzoeken, volgers, gevolgd, geblokkeerd) ·
`POST /api/social/profile {name?, visibility?}` · `GET /api/social/search?q=`
(begin van de handle, max 20) · `GET /api/social/u/<handle>` en
`/api/social/u/<handle>/items?cursor=` · `POST|DELETE /api/social/follow {handle}` ·
`POST /api/social/request {handle, accept}` · `DELETE /api/social/follower {handle}` ·
`GET /api/social/feed?cursor=` (10 per pagina, nieuwste `updated_at` eerst) ·
`POST|DELETE /api/social/like {handle, kind, id}` · `POST|DELETE /api/social/block {handle}` ·
`POST /api/social/report {handle, reason}` · `POST /api/foto?kind=&id=` (body = jpeg/webp) ·
`DELETE /api/foto?kind=&id=` · `GET /api/foto/<sleutel>`.
Rate limit via `STEM_LIMITER` met sleutel `social:<soort>:<user-id>` op zoeken,
volgen, likes, blokkeren, melden en foto's opladen/wissen.

### In de app

"try" op een brew maakt een eigen recept (`state.recipes`, bij *brew ideas*) met
`van:"<handle>/brew/<id>"`; op een bean een wens in `wishlist` met hetzelfde
`van`-veld. Een gedeelde link is `/?u=<handle>`.

## Beheer en Lets Brew AI (vlag `account`, stap 3)

Geen eigen vlag: valt onder `account`. De server beslist; de app toont alleen wat
`/api/auth/me` zegt.

### Wat erbij kwam in D1

- `users.locked` (migratie `0002_locked.sql`, `INTEGER NOT NULL DEFAULT 0`): een account
  op slot kan niet inloggen (403 `{code:"locked"}`), en een bestaande sessie telt nergens
  meer (sync, volgen, feed, foto's, AI: 401). Op slot zetten wist ook de sessies.
- `users.is_admin` en `users.ai_allowed` bestonden al (0001). `is_admin` zet de beheerder
  zelf in D1; er is geen route voor.
- `ai_usage(user_id, day, count)` bestond al: `day` is de datum in Europe/Amsterdam
  (`YYYY-MM-DD`), dus de teller begint om middernacht Nederlandse tijd opnieuw.

### `/api/auth/me`

`{user:{handle, visibility, admin, ai}, ai:{used, limit}}`; `ai` alleen als het account
Lets Brew AI mag. De app bewaart `admin` en `ai` in `state.sync.user`, zodat de keuze na
het openen meteen klopt; bij elke keer Settings openen wordt het opnieuw gevraagd.

### Routes voor de beheerder (`is_admin=1`, anders 403; `Origin` en JSON bij POST)

`GET /api/admin/users` → `{users:[{handle, name, created, ai_allowed, locked, admin,
ai_today}], total_today, limit, day}` · `POST /api/admin/user {handle, ai_allowed?,
locked?}` (jezelf op slot zetten kan niet) · `GET /api/admin/reports` → `{reports:[{id,
reason, at, by, about, about_locked}]}` (nieuwste eerst, max 200) · `POST
/api/admin/reports {id, action:"dismiss"|"block"}`: dismiss wist de melding; block zet het
gemelde account op slot en wist alle meldingen over dat account. Interne user-id's gaan
nooit naar buiten, alleen handles.

### `POST /api/ai`

Alleen ingelogd, `ai_allowed=1` en niet op slot (anders 401/403 `{code:"not_allowed"}`).
De sleutel staat alleen in de Worker-secret `ANTHROPIC_API_KEY`; ontbreekt hij: 503
`{error:"AI is not set up yet.", code:"not_set_up"}`. Het lijf heeft de vorm van de
Anthropic Messages-API; de server laat alleen `model`, `max_tokens`, `messages`,
`stream` en `system` door (ook binnen een bericht alleen `text` en base64-`image`), kiest
het model uit een vaste lijst (`AI_MODEL`, komma's toegestaan, de eerste is de standaard;
zonder `AI_MODEL` hetzelfde model als de app voor Anthropic gebruikt), en zet
`max_tokens` op hoogstens 4000. Lijf max 6 MB (foto's van zakken). `stream:true` komt
terug als `text/event-stream`. Per gebruiker per dag 50 vragen: de teller gaat in één
statement omhoog vóór het doorsturen (boven de 50: 429 `{error:"Daily limit reached (50).
Resets at midnight.", code:"limit"}`); mislukt het bij Anthropic, dan telt de vraag niet.
Elk antwoord heeft de kop `X-AI-Left` met wat er vandaag nog over is. Rate limit:
`STEM_LIMITER` met sleutel `ai:<user-id>`. Fouttekst van Anthropic gaat niet door naar de
app, de sleutel en de berichten worden nergens gelogd.

### In de app

Aanbieder `letsbrew` ("Lets Brew AI") in `AI_AANBIEDERS`: url `/api/ai`, geen sleutel,
`credentials:"same-origin"`, verder dezelfde vorm als Anthropic. Kiesbaar in *Settings →
AI* (keuze "Lets Brew AI" / "own key") alleen met vlag `account`, ingelogd en `ai`.
`scc_ai_prov` kan nu ook `letsbrew` zijn; `scc_ai_prov_eigen` onthoudt welke
eigen-sleutel-aanbieder je daarnaast had. Mag het account het niet (meer), dan valt de
keuze vanzelf terug op die eigen aanbieder. Is de daglimiet op (of staat AI op de server
uit), en staat er een eigen sleutel in dit tabblad, dan vraagt de app die (reserve).
Lets Brew AI telt niet mee in `state.ai` (AI-budget): het kost jou niets.
De kaart *accounts* in Settings is er alleen voor `admin`.

## Waar de maalstand vandaan komt

`grind` en `dials[].grind` zijn vrije tekst, met opzet. De ene molen heeft
dertig standen over hetzelfde bereik waar de andere er honderd heeft, dus een
getal betekent alleen iets samen met de molen erachter (`gear`). Reken er niet
mee alsof het een eenheid is.

## Wat er met opzet niet in zit

De sleutels van de AI staan niet in de back-up en niet in deze laag. Elke
aanbieder heeft zijn eigen plek in `localStorage`: `scc_ai_key` voor Anthropic
(die naam stond er al) en `scc_ai_key_<aanbieder>` voor de rest. Welke aanbieder
actief is staat in `scc_ai_prov`, met daarnaast per aanbieder een modelnaam
(`scc_ai_model_<aanbieder>`) en het tarief dat jij invulde
(`scc_ai_prijs_<aanbieder>`, dollar per miljoen tekens).

De ElevenLabs-sleutel voor de stem van de coaches staat nergens op schijf: alleen
in het geheugen van het tabblad (`BrewStem` in `brew-stem.js`). Wel bewaard, in
`localStorage` en niet in de back-up: de gekozen stem uit je eigen
ElevenLabs-lijst (`scc_el_voice`, de stem-id, en `scc_el_voice_naam`) en of de
stappen hardop gaan (`scc_gc_stem`, gedeeld door gietcoach, AeroPress-coach en
shot clock).

Hetzelfde geldt voor de AI-teller onder `state.ai`. Die houdt per maand bij wat
de app zelf aan Claude uitgaf — `{budget, maand, dagen:{dag:dollars},
bron:{"aanbieder:naam":{n,d}}, gemeld:{p20,p10}}`, waarbij `budget` het plafond in dollars is
dat je zelf koos (`null` = geen plafond). Het is geen koffiegegeven en het geldt
alleen voor dít toestel, dus het hoort niet in een graaf die je doorstuurt.

Het bedrag komt uit het `usage`-blok dat de aanbieder bij elk antwoord
meestuurt, tegen het tarief dat bij die aanbieder staat ingevuld. Je werkelijke
tegoed staat er níét in: dat is met een gewone API-sleutel nergens op te
vragen.

## Scheiding vanaf versie 2

Bonen, zetmethodes, recepten en gemeten brews zijn aparte entiteiten. Iedere
nieuwe dial-in-poging heeft een eigen brew-id; oude brews verdwijnen niet als
een zak leeg is. `kind` onderscheidt een poging van een afgeronde kop.
`recipeId`, `recipeSnapshot` en `beanSnapshot` leggen de relatie en de toenmalige
gegevens vast. Geen recept bij een historisch record betekent onbekend, niet
‘het huidige standaardrecept’. De interne staat heeft `dataVersion: 2`.

De koffiecoach gebruikt een kleinere read-only context van dit model. Er is
geen extern schrijftoegankelijke databrug of SQL-tool. AI-voorstellen gaan via
dezelfde receptenbibliotheek en worden alleen na gebruikersbevestiging bewaard.
