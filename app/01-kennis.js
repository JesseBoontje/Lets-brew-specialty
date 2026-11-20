/* ---------------- data + opslag ---------------- */
const BREW_GUIDES={
  espresso:{ratio:'1:2',recept:'18 g in · ~36 g uit · 25–30 sec · ~93°C',grind:'fijn (als poedersuiker)',
    steps:['Weeg 18 g vers gemalen koffie in een schone, droge portafilter.',
      'Verdeel het maalsel gelijkmatig (WDT/naaldje) zodat het overal even dicht zit.',
      'Tamp recht en gelijkmatig, oppervlak waterpas.',
      'Spoel kort de groepskop en plaats de portafilter.',
      'Start de shot en de timer; mik op ~36 g uit in 25–30 sec.',
      'Te snel & zuur → maal fijner. Te traag & bitter → maal grover.'],
    tip:'Verander één ding tegelijk (maling, dose of yield), anders weet je niet wat werkte.'},
  aeropress:{ratio:'1:18',recept:'11 g · 200 g water · net van de kook · ~3:00 totaal (Hoffmann)',grind:'medium-fijn',
    steps:['Papierfilter in de dop, niet spoelen en niet voorverwarmen. Dop erop en de AeroPress op je kop.',
      'Doe 11 g koffie erin en schud hem vlak.',
      'Start de timer en giet alle 200 g water erop, net van de kook. Al het maalsel moet nat zijn.',
      'Zet de plunjer er meteen zo’n 1 cm in: dat houdt het druppelen tegen.',
      'Op 2:00 kamer en plunjer samen vasthouden en rustig swirlen. Dan 30 seconden laten zakken.',
      'Op 2:30 rustig helemaal doordrukken, in ongeveer 30 seconden.'],
    tip:'Omgekeerd (inverted) kan ook: dan loopt er niets door tot je omdraait. Het recept "Tay omgekeerd" is dat van de wereldkampioen van 2023.'},
  v60:{ratio:'1:16',recept:'15 g · 250 g water · 92–94°C · 2:30–3:00',grind:'medium (als fijn zand)',
    steps:['Kook water en laat afkoelen tot 92–94°C; verwarm server en mok voor.',
      'Vouw het filter, plaats in de V60 en spoel goed met heet water.',
      'Doe 15 g koffie erin, schud vlak, zet op 0 (tarra).',
      'Bloom: giet ~45–50 g water in cirkels, laat 30–45 sec bloeien.',
      'Giet in rustige cirkels bij tot 250 g, in 2–3 gietbeurten; vermijd de filterrand.',
      'Totale tijd 2:30–3:00. Sneller? Maal fijner. Trager dan 3:30? Maal grover.'],
    tip:'Geeft een heldere, frisse kop — ideaal voor lichtgebrande single origins.'},
  chemex:{ratio:'1:16',recept:'30 g · 500 g water · ~95°C · 3:30–4:30',grind:'medium-grof',
    steps:['Kook water (~95°C). Vouw het dikke Chemex-filter (3 lagen naar de tuit).',
      'Spoel het filter royaal met heet water en giet dat weg.',
      'Doe 30 g koffie erin, schud vlak, zet op 0 (tarra).',
      'Bloom: giet ~60 g water op, laat 30–45 sec bloeien.',
      'Giet in rustige cirkels bij tot 500 g; vul telkens aan als het niveau zakt.',
      'Totale tijd 3:30–4:30. Het dikke filter geeft een heel schone, heldere kop.'],
    tip:'Het dikkere filter houdt meer oliën tegen — schoner en met nadruk op zuren.'},
  perculator:{ratio:'1:12',recept:'grof gemalen · vol mondgevoel · let op overextractie',grind:'grof',
    steps:['Vul het onderste reservoir met water tot net onder het ventiel.',
      'Doe grof gemalen koffie in de filterbak (ca. 1:12 koffie:water).',
      'Zet op middelhoog vuur; laat het water opstijgen en circuleren.',
      'Laat 5–7 minuten percoleren zodra het pruttelt — niet langer.',
      'Haal direct van het vuur; lange hitte = bitter (overextractie).',
      'Schenk uit en proef; korter percoleren of grover malen tegen bitterheid.'],
    tip:'Intens en vol, bijna espresso-achtig van textuur — maar hou de tijd kort.'},
  coldbrew:{ratio:'1:8 concentraat',recept:'grof gemalen · 12–24 u koud trekken',grind:'grof',
    steps:['Maal grof (als die voor French press).',
      'Meng koffie en koud, gefilterd water (ca. 1:8 voor concentraat).',
      'Roer goed door zodat alles nat is.',
      'Laat 12–24 uur trekken op kamertemperatuur of in de koelkast.',
      'Zeef door een filter; bewaar het concentraat in de koelkast.',
      'Verdun naar smaak met water of melk, en ijs.'],
    tip:'Laag in zuren, zacht en zoet. Concentraat blijft enkele dagen goed.'}
};
function guideFor(methodId){
  if(BREW_GUIDES[methodId])return BREW_GUIDES[methodId];
  const n=(methodById(methodId).name||'').toLowerCase();
  for(const k in BREW_GUIDES){if(n.includes(k))return BREW_GUIDES[k];}
  return null;
}
const DEFAULT_METHODS=[
  {id:'espresso',name:'espresso',glyph:'☕',img:'m-espresso.png',tint:'--espresso',on:true,family:'espresso'},
  {id:'aeropress',name:'aeropress',glyph:'⬗',img:'m-aeropress.png',tint:'--aeropress',on:true,family:'filter'},
  {id:'v60',name:'v60',glyph:'◭',img:'m-v60.png',tint:'--v60',on:true,family:'filter'},
  {id:'chemex',name:'chemex',glyph:'⧖',img:'m-chemex.png',tint:'--chemex',on:true,family:'filter'},
  {id:'perculator',name:'moka pot',glyph:'🫖',img:'m-mokkapot.png',tint:'--perculator',on:true,family:'filter'},
  {id:'senseo',name:'senseo',glyph:'⬗',img:'m-senseo.png',tint:'--espresso',on:true,family:'filter'},
];
// bekende familie per standaard-methode (voor migratie van bestaande gebruikers)
const METHOD_FAMILY_DEFAULTS={espresso:'espresso',perculator:'filter',senseo:'filter',aeropress:'filter',v60:'filter',chemex:'filter',coldbrew:'filter'};
// standaard puck-prep-lijst voor espresso (persoonlijk, zelf te beheren). unit -> waarde-veld
const DEFAULT_PREP=[{id:'wdt',name:'WDT'},{id:'puckscreen',name:'puckscreen'},{id:'preinf',name:'pre-infusion',unit:'s'},{id:'temp',name:'water temp',unit:'°C'}];
// vaste dial-in-regels die de AI overal meekrijgt bij espresso-maling (voorkomt omgekeerde adviezen)
const ESPRESSO_RULES=
  'ESPRESSO DIAL-IN REGELS (niet omkeren):\n'+
  '- FIJNER malen = meer weerstand = LANGZAMER doorloop = MINDER opbrengst per seconde.\n'+
  '- GROVER malen = minder weerstand = SNELLER doorloop = MEER opbrengst per seconde.\n'+
  '- Beoordeel met de doorloopsnelheid = opbrengst(g) ÷ tijd(s), vergeleken met het doel (doelopbrengst ÷ doeltijd) — niet met de tijd alleen.\n'+
  '- Te weinig opbrengst voor de tijd / choking / te traag → GROVER malen.\n'+
  '- Te veel of te snelle opbrengst / waterig / te snel → FIJNER malen.\n'+
  '- Verander één ding tegelijk (de maling); houd dose, temperatuur en puck-prep gelijk.\n'+
  '- Versheid telt mee. Vers gebrande bonen (0-6 dagen) zitten vol CO2; dat gas remt het water, de shot loopt trager en schuimt -> iets GROVER en laat ze eerst rusten.\n'+
  '- Tussen ongeveer 7 en 21 dagen is de boon stabiel; dan hoef je niet voor versheid te corrigeren.\n'+
  '- Vanaf ongeveer 25 dagen is het CO2 grotendeels weg en is de boon brozer; de puck geeft minder weerstand en de shot loopt sneller -> iets FIJNER.\n'+
  '- Corrigeer nooit voor versheid tegen de gemeten doorloopsnelheid in: wat je werkelijk meet gaat voor.';
/* ---------------- waar je maalstand begint ----------------
   Drie dingen op de zak zeggen samen al veel over hoe snel een boon oplost, en
   dus of je fijner of grover moet beginnen dan bij je vorige zak:

   - BRANDING weegt het zwaarst. Donkerder branden maakt de boon brozer en beter
     oplosbaar: hij loopt sneller door, dus grover. Licht gebrand is dichter en
     trager: fijner, en warmer zetten.
   - PROCES verandert de celstructuur. Een natural droogt met vrucht en al en
     houdt een zwakkere structuur over: die extraheert het snelst, dus grover.
     Washed houdt de stevigste structuur en loopt het traagst: fijner. Honey en
     pulped natural zitten ertussenin.
   - HOOGTE staat voor dichtheid. Boven ongeveer 1800 m groeit de boon langzamer
     en wordt hij harder: trager, dus fijner. Onder de 1100 m juist zachter.

   Decaf is een geval apart: het ontcafeïneren tast de celstructuur aan, de boon
   is brozer en geeft meer fijn stof. De praktijk is verdeeld over de richting,
   dus daar zeggen we: opnieuw afstellen in plaats van doorrekenen.

   Alles wordt uitgedrukt in "stappen fijner" (positief) of grover (negatief).
   Het is een startpunt, geen voorspelling — wat je meet gaat altijd voor.     */
function altitudeOf(b){
  const m=(''+(b&&b.altitude||'')).match(/\d{3,4}/g);
  if(!m||!m.length)return null;
  const g=m.map(Number).filter(x=>x>=300&&x<=3000);
  if(!g.length)return null;
  return Math.round(g.reduce((a,c)=>a+c,0)/g.length);
}
function isDecaf(b){
  return /decaf|deca|cafe.?nevrij|caffeine.?free|zonder cafe/i.test(
    [b&&b.name,b&&b.roasternotes,b&&b.notes,b&&b.process].filter(Boolean).join(' '));
}
// hoe traag lost deze boon op? hoger = dichter = fijner malen
function beanDensity(b){
  if(!b)return {score:0,redenen:[]};
  const redenen=[];let score=0;
  const ri=ROAST_LEVELS.indexOf(b.roast||'');
  if(ri>=0){
    const bij=(2-ri)*0.9;                       // light +1.8 ... dark -1.8
    score+=bij;
    if(ri<=1)redenen.push('licht gebrand: dichter en trager oplosbaar');
    else if(ri>=3)redenen.push('donker gebrand: brozer en beter oplosbaar');
  }
  const proc=(b.process||'').toLowerCase();
  if(/natural|dry|anaerob|carbonic/.test(proc)){score-=0.7;redenen.push('natural: zwakkere celstructuur, loopt sneller door');}
  else if(/honey|pulped|semi/.test(proc)){score-=0.3;redenen.push('honey: zit tussen natural en washed in');}
  else if(/washed|wet/.test(proc)){score+=0.4;redenen.push('washed: stevigste structuur, loopt het traagst');}
  const alt=altitudeOf(b);
  if(alt!=null){
    if(alt>=1800){score+=0.6;redenen.push(alt+' m: harde, dichte boon');}
    else if(alt>=1400){score+=0.3;}
    else if(alt<1100){score-=0.4;redenen.push(alt+' m: zachtere boon');}
  }
  return {score,redenen,decaf:isDecaf(b)};
}
// wat is er voor deze boon vastgelegd? per methode, of alles op een rij
function beanDial(bean,methodId){
  const d=bean&&bean.dialed;
  if(!d||typeof d!=='object')return null;
  if(methodId)return (d[methodId]&&d[methodId].grind)?Object.assign({method:methodId},d[methodId]):null;
  const alle=Object.keys(d).filter(k=>d[k]&&d[k].grind)
    .map(k=>Object.assign({method:k},d[k])).sort((a,b)=>(b.ts||0)-(a.ts||0));
  return alle.length?alle:null;
}
// hoe verhoudt de ene methode zich tot de andere? binnen dezelfde familie zit je
// in dezelfde orde van grootte; espresso is en blijft de fijnste kant
function dialOverstap(van,naar){
  const fv=methodFamily(van), fn=methodFamily(naar);
  if(fv===fn)return null;
  return fn==='espresso'?'duidelijk fijner':'duidelijk grover';
}
// "18 g -> 36 g in 0:28", voor de kaart en voor de prompt
function dialCijfers(d){
  const stuk=[];
  if(d.dose&&d.yield)stuk.push(d.dose+' g \u2192 '+d.yield+' g');
  else if(d.dose)stuk.push(d.dose+' g');
  if(d.time)stuk.push(d.time);
  return stuk.join(' in ');
}
/* Het startpunt. Eerst kijken of je zoiets al eens gezet hebt op deze methode;
   dat is jouw molen op jouw machine en verslaat elke vuistregel. Anders reken
   we het verschil met je laatste zak om in stappen.                          */
function grindStart(bean,methodId){
  if(!bean||!methodId)return null;
  const eerder=state.brews.filter(x=>x.method===methodId&&x.grind&&x.beanId)
    .sort((a,b)=>b.ts-a.ts);
  const bonenVan=id=>state.beans.find(y=>y.id===id);
  const zelfde=eerder.find(x=>{
    const o=bonenVan(x.beanId);if(!o||o.id===bean.id)return false;
    return (o.process||'').toLowerCase().slice(0,4)===(bean.process||'').toLowerCase().slice(0,4)
      && (o.roast||'')===(bean.roast||'') && (o.roast||bean.roast);
  });
  const eigen=eerder.find(x=>x.beanId===bean.id);
  const laatste=eerder[0];
  const d=beanDensity(bean);
  // een dial die je zelf hebt afgetekend gaat voor alles
  const vast=beanDial(bean,methodId);
  if(vast)return {stand:vast.grind,bron:'vastgelegd',cijfers:dialCijfers(vast),decaf:d.decaf,
    waarom:['hier stond hij goed op '+vast.grind]};
  // op een andere methode wel afgetekend? dan is dat je ankerpunt
  const anders=beanDial(bean,null);
  if(anders&&anders.length){
    const a=anders[0];
    return {stand:a.grind,bron:'andere methode',vanaf:(methodById(a.method)||{}).name||a.method,
      stap:dialOverstap(a.method,methodId),cijfers:dialCijfers(a),decaf:d.decaf,waarom:[]};
  }
  if(eigen)return {stand:eigen.grind,bron:'deze boon',
    waarom:['je zette hem eerder op '+eigen.grind],decaf:d.decaf};
  if(zelfde){
    const o=bonenVan(zelfde.beanId);
    return {stand:zelfde.grind,bron:'zelfde soort',
      waarom:['je '+[o.roast,o.process].filter(Boolean).join(' ')+' liep goed op '+zelfde.grind],
      decaf:d.decaf};
  }
  if(!laatste)return {stand:null,bron:'niets',score:d.score,waarom:d.redenen.slice(0,2),decaf:d.decaf};
  const o=bonenVan(laatste.beanId);
  const verschil=d.score-beanDensity(o).score;
  return {stand:laatste.grind,bron:'vorige zak',verschil,
    tegenover:(o?o.name:'je vorige zak'),waarom:d.redenen.slice(0,2),decaf:d.decaf};
}
/* Hoe groot is het verschil? Bewust in woorden en niet in klikken: de ene molen
   heeft dertig standen over hetzelfde bereik waar de andere er honderd heeft,
   dus een getal zou een precisie suggereren die we niet hebben. */
function grindStap(v){
  const a=Math.abs(v);
  if(a<0.5)return null;
  const richting=v>0?'fijner':'grover';
  if(a<1.5)return 'iets '+richting;
  if(a<3)return 'merkbaar '+richting;
  return 'duidelijk '+richting;
}
// heel korte vorm, voor op een dichtgeklapte kaart
function grindStartShort(bean,methodId){
  const g=grindStart(bean,methodId);if(!g)return '';
  if(g.bron==='vastgelegd')return 'staat op '+g.stand;
  if(g.bron==='andere methode')return g.stap?(g.stand+', '+g.stap):('start '+g.stand);
  if(g.decaf)return 'decaf \u2014 opnieuw afstellen';
  if(g.bron==='deze boon'||g.bron==='zelfde soort')return 'start ' + g.stand;
  if(g.bron==='niets')return g.score>=0.8?'begin eerder fijn':g.score<=-0.8?'begin eerder grof':'';
  const stap=grindStap(g.verschil);
  return stap?(g.stand+', '+stap):('start '+g.stand);
}
// één regel om te tonen en om in een prompt te zetten
function grindStartText(bean,methodId){
  const g=grindStart(bean,methodId);if(!g)return '';
  // afgetekend op deze methode: geen gok meer nodig
  if(g.bron==='vastgelegd')
    return 'je tekende deze boon hier af op '+g.stand+
      (g.cijfers?(' ('+g.cijfers+')'):'')+' \u2014 begin daar.';
  if(g.bron==='andere methode')
    return 'je tekende hem af op '+g.vanaf+': '+g.stand+(g.cijfers?(' ('+g.cijfers+')'):'')+
      (g.stap?(' \u2014 hier ga je daar '+g.stap+' dan.')
             :' \u2014 begin daar en stel bij.');
  // decaf: een oude stand doorrekenen heeft geen zin, dus dat zeggen we ook zo
  if(g.decaf){
    return (g.stand?('je vorige stand was '+g.stand+', maar '):'')+
      'decaf lost anders op en geeft meer fijn stof \u2014 stel opnieuw af en ga bij verstopping eerst grover.';
  }
  if(g.bron==='deze boon'||g.bron==='zelfde soort')
    return 'begin op '+g.stand+' \u2014 '+g.waarom[0]+'.';
  if(g.bron==='niets'){
    const kant=g.score>=0.8?'aan de trage kant, dus eerder fijn beginnen'
             :g.score<=-0.8?'aan de snelle kant, dus eerder grof beginnen'
             :'redelijk neutraal';
    return 'nog niets van gezet. Deze zak is '+kant+
      (g.waarom.length?(' \u2014 '+g.waarom.join('; ')):'')+'.';
  }
  const stap=grindStap(g.verschil);
  return 'begin bij je '+g.stand+' van '+g.tegenover+
    (stap?(' en ga '+stap):' \u2014 ongeveer gelijk')+
    (g.waarom.length?(' \u2014 '+g.waarom.join('; ')):'')+'.';
}
/* Vangrails die in élke brouw-prompt meegaan. ESPRESSO_RULES en FILTER_RULES
   gaan over de richting van je maling; dit gaat over de taal van de app: welke
   velden er zijn, in welke eenheden, en wat er nooit verzonnen mag worden. */
const APP_RULES=
  'HUISREGELS (gelden altijd):\n'+
  '- Antwoord in het Nederlands, kort en concreet. Geen slagzinnen, geen voorbehoud, geen herhaling van de vraag.\n'+
  '- Een maalstand is ALTIJD kort: alleen een getal, klikken of \u00e9\u00e9n woord. Nooit een merknaam, nooit uitleg in dat veld.\n'+
  '- Tijden als m:ss. Gewichten in hele grammen. Temperatuur in graden Celsius.\n'+
  '- Ratio betekent bij FILTER water gedeeld door dose (1:14 tot 1:18) en bij ESPRESSO yield gedeeld door dose (1:1,5 tot 1:3). Verwissel die twee nooit.\n'+
  '- Verzin geen gegevens. Weet je iets niet, laat het veld leeg in plaats van te gokken.\n'+
  '- De app kent deze begrippen; gebruik ze zoals ze bedoeld zijn: bloom (gram \u00e9n seconden), doorlooptijd (vanaf de laatste giet tot het bed droogvalt), de bedvorm (vlak, krater of droge rand), TDS met een extractievenster van 18 tot 22 procent, de maalstand per molen, en brewer, filterpapier en water als losse gegevens.\n'+
  '- Een krater of een droge rand is een gietfout, geen maalfout: noem dan eerst het gieten.\n'+
  '- Weeg de versheid mee: 0 tot 4 dagen na branden zit vol CO2, na ongeveer vier weken is dat gas eruit.\n'+
  '- Staat er een brandingsvoorkeur bij de boon (espresso of filter), respecteer die en stel geen methode uit de andere familie voor.\n'+
  '- Geef \u00e9\u00e9n verandering tegelijk, niet drie tegelijk.';
/* Wat de zak zegt over waar je maalstand begint. Deze richtingen mogen nooit
   omgedraaid worden; ze volgen uit hoe snel een boon oplost.               */
const BEAN_GRIND_RULES=
  'ZAK LEZEN \u2192 MAALSTAND (niet omkeren):\n'+
  '- BRANDING weegt het zwaarst. Donkerder gebrand = brozer en beter oplosbaar = loopt sneller = GROVER malen (en koeler zetten). Lichter gebrand = dichter en trager = FIJNER malen en warmer zetten, richting 95-96 graden.\n'+
  '- PROCES: natural (en anaerobic/carbonic) heeft de zwakste celstructuur en extraheert het snelst -> GROVER. Washed heeft de stevigste structuur en loopt het traagst -> FIJNER. Honey en pulped natural zitten ertussenin.\n'+
  '- HOOGTE staat voor dichtheid: boven ongeveer 1800 m is de boon hard en traag -> FIJNER. Onder ongeveer 1100 m zachter en sneller -> GROVER.\n'+
  '- Decaf: het ontcafe\u00efneren tast de celstructuur aan, de boon is brozer en geeft meer fijn stof. Reken een oude stand niet door maar stel opnieuw af, en ga bij verstopping eerst grover.\n'+
  '- Deze drie zijn een STARTPUNT, geen voorspelling. Heeft de gebruiker een gemeten stand van dezelfde boon of van een vergelijkbare zak, dan gaat die altijd voor.\n'+
  '- Noem hooguit twee redenen, en zeg er altijd bij dat het een startpunt is.';
/* Extra regels voor het gietschema, want daar gaat een model het snelst de mist
   in: gewichten die niet oplopen of een schema zonder doorloop. */
const SCHEMA_RULES=
  'SCHEMA-REGELS:\n'+
  '- De eerste stap staat op 0:00 en is de bloom: 2 tot 3 keer de dose aan water, en 30 tot 45 seconden voordat de volgende giet komt.\n'+
  '- t loopt altijd op.\n'+
  '- g is het TOTAAL aan water dat er n\u00e1 die stap in zit, dus cumulatief en altijd hoger dan de vorige; de laatste gietstap is exact het eindgewicht.\n'+
  '- Laat g weg bij een stap waarbij je niet giet (swirl, roer, wacht, pers, doorloop).\n'+
  '- Sluit altijd af met een doorloop-stap zonder g.\n'+
  '- Vier tot zeven stappen. Elke instructie is \u00e9\u00e9n zin van hoogstens twaalf woorden.';
/* En voor het uitlezen van een zak: overschrijven wat er staat, niet aanvullen
   met wat je hoopt dat er staat. */
const BEAN_RULES=
  'ETIKET-REGELS:\n'+
  '- Neem alleen over wat er letterlijk staat. Verzin geen herkomst, hoogte, vari\u00eb'+'teit of smaaknotities.\n'+
  '- roasternotes exact overnemen zoals ze op de zak staan, komma-gescheiden, niet vertalen en niet aanvullen.\n'+
  '- process en variety in de gangbare term (washed, natural, honey, anaerobic).\n'+
  '- roast alleen invullen als de zak een brandingsniveau noemt; gebruik dan exact een van: light, medium-light, medium, medium-dark, dark.\n'+
  '- fam alleen invullen als de zak het zelf zegt: staat er espresso -> "espresso", staat er filter of pour over -> "filter", staat er omni of espresso & filter -> "both". Staat er niets over, laat fam leeg.';
// korte regel over de boon zelf, voor in elke prompt waar een boon bij hoort
function beanPromptBlock(bean){
  if(!bean)return '';
  const f=beanFreshness(bean);
  const stukken=[];
  if(f)stukken.push(f.days+' dagen na branden');
  if(bean.fam)stukken.push('op de zak staat: '+(bean.fam==='both'?'omni (espresso \u00e9n filter)':bean.fam+'branding'));
  if(bean.roast)stukken.push('branding '+bean.roast);
  if(bean.process)stukken.push('proces '+bean.process);
  if(altitudeOf(bean))stukken.push(altitudeOf(bean)+' m');
  if(bean.dialIn&&bean.dialIn.grind)stukken.push('eerder gebruikte maalstand '+bean.dialIn.grind+' bij '+(methodById(bean.dialIn.method)||{}).name);
  // wat je zelf hebt afgetekend weegt zwaarder dan elke vuistregel
  const vast=beanDial(bean,null);
  if(vast)stukken.push('door jou afgetekend: '+vast.map(d=>
    ((methodById(d.method)||{}).name||d.method)+' op maalstand '+d.grind+
    (dialCijfers(d)?(' ('+dialCijfers(d)+')'):'')).join(', '));
  let uit=stukken.length?('\nOver deze boon: '+stukken.join('; ')+'.'):'';
  const start=grindStartText(bean,formMethod);
  if(start)uit+='\nStartpunt maalstand volgens de app: '+start.replace(/\.$/,'')+'.';
  return uit;
}
// vaste filterregels die de AI overal meekrijgt (spiegelbeeld van ESPRESSO_RULES)
const FILTER_RULES=
  'FILTER-REGELS (niet omkeren):\n'+
  '- FIJNER malen = meer weerstand = TRAGER doorlopen = MEER extractie (minder zuur, meer body; te ver = bitter en droog).\n'+
  '- GROVER malen = minder weerstand = SNELLER doorlopen = MINDER extractie (zuur, dun, zoutig).\n'+
  '- De RATIO bepaalt de STERKTE, de MALING bepaalt de EXTRACTIE. Slap maar niet bitter -> minder water of meer koffie. Zuur of bitter -> aan de maling draaien, niet aan de ratio.\n'+
  '- Beoordeel met de totale tijd en met de doorlooptijd (vanaf de laatste giet tot het bed droogvalt), niet met de tijd alleen.\n'+
  '- Te snel doorgelopen en zuur/dun -> FIJNER. Te traag of verstopt en bitter/droog -> GROVER, en minder roeren of van lager gieten.\n'+
  '- Een krater of een droge rand in het bed is een GIETfout, geen maalfout: corrigeer eerst het gieten.\n'+
  '- Bloom hoort ongeveer 2 tot 3 keer de dose te zijn en 30 tot 45 seconden te duren. Hoe verser de boon, hoe meer CO2, hoe ruimer en langer de bloom.\n'+
  '- Temperatuur is de fijnafstelling: koeler = minder extractie, warmer = meer.\n'+
  '- Verander één ding tegelijk.';
// welke familie hoort bij een methode? espresso of filter (val terug op filter)
function methodFamily(idOrMethod){
  const m=(typeof idOrMethod==='object'&&idOrMethod)?idOrMethod:methodById(idOrMethod);
  if(m&&m.family)return m.family;
  const id=(m&&m.id)||(typeof idOrMethod==='string'?idOrMethod:null);
  if(id&&METHOD_FAMILY_DEFAULTS[id])return METHOD_FAMILY_DEFAULTS[id];
  return 'filter';
}
/* ---------------- filterrecepten met een stappenschema ----------------
   Elke stap: t = seconden vanaf start, p = deel van het totale water (0-1),
   k = soort stap, d = wat je doet (inhoud, dus Nederlands).
   Het water schaalt mee met je eigen dose: water = dose * ratio.        */
const FILTER_RECIPES=[
  {id:'hoffmann', naam:'Hoffmann V60', voor:['v60'], dose:15, ratio:16.7, temp:95, maling:'medium-fijn',
   over:'Twee gietbeurten en twee keer swirlen. Weinig stappen, maar je pols bepaalt het resultaat.',
   stappen:[
     {t:0,   p:0.12, k:'bloom', d:'giet 2× je dose in cirkels tot alles nat is'},
     {t:10,  p:0,    k:'swirl', d:'swirl de dripper rustig rond — het bed moet vlak liggen'},
     {t:45,  p:0.60, k:'giet',  d:'giet in rustige cirkels tot 60 % van je water'},
     {t:75,  p:1.00, k:'giet',  d:'vul in cirkels aan tot je eindgewicht'},
     {t:105, p:0,    k:'swirl', d:'nog één zachte swirl om het bed vlak te leggen'},
     {t:120, p:0,    k:'doorloop', d:'laten zakken — droog rond 3:00 tot 3:30'}]},

  {id:'kasuya', naam:'Kasuya 4:6', voor:['v60'], dose:20, ratio:15, temp:92, maling:'grof',
   over:'Vijf kleine gietbeurten. De eerste 40 % stuurt zuur tegenover zoet, de laatste 60 % de sterkte. Werkt ook zonder zwanenhals.',
   hendels:true,
   stappen:[
     {t:0,   p:0.20, k:'bloom', d:'eerste giet — recht in het midden'},
     {t:45,  p:0.40, k:'giet',  d:'tweede giet — hiermee is de smaakbalans klaar'},
     {t:90,  p:0.60, k:'giet',  d:'derde giet — vanaf hier bouw je de sterkte'},
     {t:130, p:0.80, k:'giet',  d:'vierde giet'},
     {t:170, p:1.00, k:'giet',  d:'vijfde giet'},
     {t:200, p:0,    k:'doorloop', d:'laten zakken — droog rond 3:30'}]},

  {id:'rao', naam:'Rao spin', voor:['v60'], dose:20, ratio:16, temp:96, maling:'medium',
   over:'Eén doorlopende giet en een swirl aan het eind. Vlak bed, weinig kans om te knoeien.',
   stappen:[
     {t:0,   p:0.15, k:'bloom', d:'giet 3× je dose op, alles moet nat zijn'},
     {t:10,  p:0,    k:'swirl', d:'swirl tot het bed vlak ligt'},
     {t:45,  p:1.00, k:'giet',  d:'giet in één rustige doorlopende stroom tot je eindgewicht'},
     {t:100, p:0,    k:'swirl', d:'één zachte swirl — de rand spoelt terug het bed in'},
     {t:110, p:0,    k:'doorloop', d:'laten zakken — droog rond 3:00'}]},

  {id:'chemex', naam:'Chemex klassiek', voor:['chemex'], dose:30, ratio:16.7, temp:95, maling:'medium-grof',
   over:'Het dikke filter houdt oliën tegen: heel schoon in de kop, maar het duurt langer.',
   stappen:[
     {t:0,   p:0.12, k:'bloom', d:'giet ~2× je dose op en laat het gas eruit'},
     {t:45,  p:0.50, k:'giet',  d:'giet in cirkels tot de helft — blijf van de filterrand af'},
     {t:105, p:0.80, k:'giet',  d:'vul aan zodra het niveau zakt'},
     {t:165, p:1.00, k:'giet',  d:'laatste giet tot je eindgewicht'},
     {t:210, p:0,    k:'doorloop', d:'laten zakken — droog rond 4:00 tot 4:30'}]},

  {id:'kalita', naam:'Kalita pulse', voor:['kalita','v60'], dose:20, ratio:16, temp:93, maling:'medium',
   over:'Vlakke bodem, ondiep bed. Kleine gietjes om het niveau gelijk te houden.',
   stappen:[
     {t:0,   p:0.16, k:'bloom', d:'giet 2,5× je dose op'},
     {t:45,  p:0.40, k:'giet',  d:'klein gietje in het midden'},
     {t:75,  p:0.60, k:'giet',  d:'weer een klein gietje'},
     {t:105, p:0.80, k:'giet',  d:'en nog een'},
     {t:135, p:1.00, k:'giet',  d:'laatste gietje tot je eindgewicht'},
     {t:170, p:0,    k:'doorloop', d:'laten zakken — droog rond 3:30'}]},

  {id:'switch', naam:'Switch hybride', voor:['switch','v60'], dose:15, ratio:16.7, temp:94, maling:'medium',
   over:'Eerst dicht laten weken voor zoet en body, daarna open laten lopen voor helderheid.',
   stappen:[
     {t:0,   p:0.20, k:'bloom', klep:'dicht', d:'giet 3× je dose op en laat bloeien'},
     {t:45,  p:0.60, k:'giet',  klep:'dicht', d:'giet in cirkels bij, alles blijft staan'},
     {t:80,  p:1.00, k:'giet',  klep:'dicht', d:'vul aan tot je eindgewicht'},
     {t:100, p:0,    k:'wacht', klep:'dicht', d:'laat het staan en trekken'},
     {t:150, p:0,    k:'doorloop', klep:'open', d:'laten leeglopen tot het bed droogvalt'}]},

  /* Normaal: James Hoffmann, "The Ultimate AeroPress Technique" (video, 2021,
     https://youtu.be/j6VlT_jUVPc). Omgekeerd: Tay Wipvasutt, wereldkampioen
     AeroPress 2023 (worldaeropresschampionship.com). Zie docs/opzet-aeropress.html.
     De tijden van schenken, swirlen, lucht eruit en aanvullen zijn aangenomen. */
  {id:'aeropress', naam:'Hoffmann AeroPress', voor:['aeropress'], dose:11, ratio:200/11, temp:99, maling:'medium-fijn',
   houding:'normaal',
   over:'James Hoffmann: alles in één keer erop, plunjer erop tegen het druppelen, swirlen en rustig doordrukken. Niet roeren, niet spoelen.',
   stappen:[
     {t:0,   p:1.00, k:'giet',  d:'giet alle 200 g water erop en maak al het maalsel nat'},
     {t:10,  p:0,    k:'wacht', d:'zet de plunjer er zo’n 1 cm in, dat houdt het druppelen tegen'},
     {t:14,  p:0,    k:'wacht', d:'laten trekken tot 2:00'},
     {t:120, p:0,    k:'swirl', d:'houd kamer en plunjer samen vast en swirl hem rustig rond'},
     {t:125, p:0,    k:'wacht', d:'dertig seconden laten zakken'},
     {t:150, p:0,    k:'pers',  d:'druk rustig helemaal door, in ongeveer 30 seconden'}]},

  {id:'aeropress-om', naam:'Tay omgekeerd', voor:['aeropress'], dose:18, ratio:155/18, temp:89, maling:'fijn tot medium',
   houding:'omgekeerd',
   over:'Tay Wipvasutt, wereldkampioen 2023: omgekeerd, 16 g en later 2 g, twee keer roeren, na het drukken aanvullen tot 155 g. Hij maalde op een ZP6, 65 klikken.',
   stappen:[
     {t:0,   p:100/155, k:'giet', d:'giet 100 g water op de eerste 16 g koffie (houd 2 g apart)'},
     {t:10,  p:0,  k:'wacht', d:'even laten staan'},
     {t:30,  p:0,  k:'roer',  d:'roer 5 seconden met één kant van een eetstokje'},
     {t:35,  p:0,  k:'wacht', d:'laten staan'},
     {t:45,  p:0,  k:'dose',  d:'strooi de laatste 2 g koffie erbij'},
     {t:50,  p:0,  k:'wacht', d:'laten staan'},
     {t:55,  p:0,  k:'roer',  d:'roer nog 5 seconden'},
     {t:60,  p:0,  k:'wacht', d:'duw de kamer omlaag tot de lucht eruit is'},
     {t:66,  p:0,  k:'wacht', d:'draai de dop met het gespoelde filter erop'},
     {t:70,  p:0,  k:'wacht', d:'laten trekken en zet je kop alvast klaar'},
     {t:95,  p:0,  k:'keer',  d:'kop op de dop, alles samen vasthouden en in één beweging omdraaien'},
     {t:98,  p:0,  k:'pers',  d:'druk rustig, ongeveer 30 seconden; er komt zo’n 75 g uit'},
     {t:125, p:115/155, k:'giet', d:'AeroPress eraf en aanvullen met water op kamertemperatuur tot 115 g'},
     {t:138, p:1.00, k:'giet', d:'aanvullen met heet water tot 155 g en proeven'}]},
];
/* Espressorecepten hebben dezelfde vorm als de filterrecepten, zodat dezelfde
   kaart ze kan tonen. Het verschil: ratio betekent hier yield-uit-dose, en de
   stappen zijn je routine in plaats van een gietschema. tijd = de doeltijd
   waar het dial-in-scherm naartoe werkt: de seconden onder volle druk.
   pre = pre-infusie (aan/uit, seconden) en rust daarna, voor de shot clock
   (app/05-shotclock.js); eigen instellingen staan in state.recipePre.     */
const ESPRESSO_RECIPES=[
  {id:'e-classic', fam:'espresso', naam:'classic 1:2', voor:['espresso'], dose:18, ratio:2, temp:93,
   tijd:'0:28', pre:{on:true, s:5, rust:3}, maling:'fijn',
   over:'Het moderne uitgangspunt. Werkt op vrijwel elke boon en is het eerlijkste vertrekpunt om vanaf te dial-innen.',
   stappen:[
     {t:0,p:0,k:'dose',  d:'weeg 18 g en verdeel het maalsel met een naaldje (WDT)'},
     {t:0,p:0,k:'tamp',  d:'tamp recht en waterpas, kracht maakt minder uit dan gelijkheid'},
     {t:0,p:0,k:'spoel', d:'spoel de groepskop en zet de portafilter erin'},
     {t:0,p:0,k:'shot',  d:'start de shot en de klok'},
     {t:28,p:0,k:'stop', d:'stop op 36 g uit en proef meteen'}]},

  {id:'e-ristretto', fam:'espresso', naam:'ristretto 1:1.5', voor:['espresso'], dose:18, ratio:1.5, temp:94,
   tijd:'0:28', pre:{on:true, s:5, rust:3}, maling:'fijner dan classic',
   over:'Korter getrokken: dikker, zoeter en minder zuur. Mooi op donkerdere brandingen en in kleine melkdranken.',
   stappen:[
     {t:0,p:0,k:'dose', d:'zelfde dose, maar maal een stap fijner'},
     {t:0,p:0,k:'shot', d:'start en let op: hij loopt trager op gang'},
     {t:28,p:0,k:'stop',d:'stop al op 27 g uit — daarna wordt het snel bitter'}]},

  {id:'e-lungo', fam:'espresso', naam:'lungo 1:3', voor:['espresso'], dose:18, ratio:3, temp:92,
   tijd:'0:33', pre:{on:false,s:5, rust:3}, maling:'grover dan classic',
   over:'Langer doorgetrokken voor meer aroma en een lichtere kop. Maal grover, anders haal je de bittere staart mee.',
   stappen:[
     {t:0,p:0,k:'dose', d:'maal een stap grover dan je classic'},
     {t:0,p:0,k:'shot', d:'start; hij hoort vlot maar niet snel te lopen'},
     {t:33,p:0,k:'stop',d:'stop op 54 g uit'}]},

  {id:'e-light', fam:'espresso', naam:'light roast 1:2.5', voor:['espresso'], dose:18, ratio:2.5, temp:95,
   tijd:'0:31', pre:{on:true, s:7, rust:4}, maling:'fijn',
   over:'Lichte brandingen zijn dichter en lossen trager op. Een langere ratio en hetere zet halen de zoetheid eruit in plaats van alleen het zuur.',
   stappen:[
     {t:0,p:0,k:'temp', d:'zet zo warm als je machine toelaat, richting 95–96 °C'},
     {t:0,p:0,k:'dose', d:'18 g, fijn gemalen en goed verdeeld'},
     {t:0,p:0,k:'shot', d:'start; de eerste druppels mogen best laat komen'},
     {t:31,p:0,k:'stop',d:'stop op 45 g uit'}]},

  {id:'e-turbo', fam:'espresso', naam:'turbo shot', voor:['espresso'], dose:20, ratio:2.5, temp:93,
   tijd:'0:18', pre:{on:false,s:3, rust:0}, maling:'grof voor espresso',
   over:'Grover malen en snel doorlopen. Weinig weerstand, dus vergevingsgezind — en verrassend zoet op lichte brandingen.',
   stappen:[
     {t:0,p:0,k:'dose', d:'20 g, duidelijk grover dan je normale espresso'},
     {t:0,p:0,k:'shot', d:'start; hij komt vrijwel meteen op gang'},
     {t:18,p:0,k:'stop',d:'stop op 50 g uit, ergens tussen 15 en 22 seconden'}]},

  {id:'e-milk', fam:'espresso', naam:'melkbasis', voor:['espresso'], dose:20, ratio:1.8, temp:94,
   tijd:'0:29', pre:{on:true, s:5, rust:3}, maling:'fijn',
   over:'Iets korter en met een hogere dose, zodat de koffie door de melk heen komt in een flat white of cappuccino.',
   stappen:[
     {t:0,p:0,k:'dose', d:'20 g in je mand — meer koffie, kortere ratio'},
     {t:0,p:0,k:'shot', d:'start en mik op 36 g uit'},
     {t:29,p:0,k:'melk', d:'schuim ondertussen je melk op tot 55–65 °C'}]},
];
/* Alleen jouw eigen recepten kun je kiezen. De ingebouwde schema's hieronder
   zijn geen keuze meer maar een startpunt: ze vullen de recepteditor voor als
   je er zelf een schrijft. Een kant-en-klaar recept in de coach maakte het
   scherm druk en het was niet van jou.                                     */
function eigenRecepten(methodId){
  return (state.recipes||[]).filter(r=>r.mid===methodId);
}
// welke recepten passen bij deze methode? eerst je eigen, dan de ingebouwde
function recipesFor(methodId){
  const m=methodById(methodId); const naam=((m&&m.name)||'').toLowerCase();
  const eigen=(state.recipes||[]).filter(r=>r.mid===methodId);
  if(methodFamily(methodId)==='espresso')return eigen.concat(ESPRESSO_RECIPES);
  let hit=FILTER_RECIPES.filter(r=>r.voor.some(v=>v===methodId||naam.includes(v)));
  // een methode die we niet kennen (je eigen brewer) krijgt toch een startpunt
  if(!hit.length)hit=FILTER_RECIPES.filter(r=>r.id==='rao'||r.id==='hoffmann');
  return eigen.concat(hit);
}
function recipeById(id){
  return (state.recipes||[]).find(r=>r.id===id)
    ||FILTER_RECIPES.find(r=>r.id===id)||ESPRESSO_RECIPES.find(r=>r.id===id)||null;
}
function recipeFam(r){return (r&&r.fam)||'filter';}
const ALLE_RECEPTEN=()=>FILTER_RECIPES.concat(ESPRESSO_RECIPES);
// gewichten uitrekenen voor jouw dose; hendels verschuiven de 4:6-verdeling
/* Staat er een gramgetal in de omschrijving van een stap, dan is dat geschreven
   voor de dosis waarmee het recept gemaakt is. Zet je met een andere dosis, dan
   schuift de kolom mee maar de zin niet -- en dan zegt "giet 33 g" iets anders
   dan de 54 g ernaast. Dus schalen we de getallen in de tekst met dezelfde
   factor als de kolom. */
function schaalGrammen(t,s){
  if(!t||!(s>0)||Math.abs(s-1)<0.01)return t;
  return String(t).replace(/(\d+(?:[.,]\d+)?)\s*(gram\b|g\b)/gi,(m,n,e)=>
    Math.round(parseFloat(String(n).replace(',','.'))*s)+' '+e);
}
// ratio: optioneel, de verhouding die je zelf in het formulier zette; anders die van het recept
function recipeSteps(r,dose,hendels,ratio){
  if(!r)return [];
  const water=Math.round((dose||r.dose)*(ratio>0?ratio:r.ratio));
  const basis=Math.round((r.dose||dose||1)*r.ratio);   // waar de tekst voor geschreven is
  const schaal=basis?water/basis:1;
  let st=r.stappen.map(x=>Object.assign({},x,{d:schaalGrammen(x.d,schaal)}));
  if(r.hendels&&hendels){
    // eerste 40 %: zoeter = een kleiner eerste gietje, zuurder = een groter
    const zoet=Math.max(0,Math.min(1,hendels.zoet==null?0.5:hendels.zoet));
    const eerste=0.40*(0.35+zoet*0.30);        // tussen 14 % en 26 % van het totaal
    st[0].p=eerste; st[1].p=0.40;
    // laatste 60 %: meer gietjes = steviger
    const sterk=Math.max(0,Math.min(1,hendels.sterk==null?0.5:hendels.sterk));
    if(sterk<0.5){ st=st.filter(x=>x!==st[3]); st[2].p=0.70; st[3].p=1.00; }
  }
  return st.map(x=>Object.assign({},x,{g:x.p?Math.round(water*x.p):0, water}));
}
const TINTS=['--espresso','--aeropress','--v60','--chemex','--perculator'];
// ingebouwde tekeningen om uit te kiezen per methode-soort
const IMG_LIBRARY={
  espresso:[
    {src:'m-espresso.png',label:'ECM'},
    {src:'m-espresso-2.png',label:'classic'},
    {src:'m-espresso-3.png',label:'with grinder'},
  ],
  senseo:[{src:'m-senseo.png',label:'senseo'}],
  aeropress:[{src:'m-aeropress.png',label:'aeropress'}],
  v60:[{src:'m-v60.png',label:'v60'}],
  chemex:[{src:'m-chemex.png',label:'chemex'}],
  perculator:[{src:'m-mokkapot.png',label:'moka pot'}],
};
function libraryFor(m){
  // match op id, anders op naam
  if(IMG_LIBRARY[m.id])return IMG_LIBRARY[m.id];
  const n=(m.name||'').toLowerCase();
  for(const k in IMG_LIBRARY){if(n.includes(k))return IMG_LIBRARY[k];}
  return [];
}
// geeft de bron voor een methode-afbeelding: custom upload > standaard img > leeg
function methodImg(m){ return (m&&(m.customImg||m.img))||''; }
// render een methode-icoon (afbeelding met glyph-fallback), grootte px
function iconHTML(m,size){
  const src=BrewSecurity.imageUrl(methodImg(m)),glyph=esc((m&&m.glyph)||'☕');
  if(src)return `<img src="${esc(src)}" style="max-height:${size}px;max-width:100%;mix-blend-mode:multiply" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="glyph" hidden>${glyph}</span>`;
  return `<span class="glyph">${glyph}</span>`;
}
// handgetekende huisstijl-actie-icoontjes (inline SVG, losse schetsstijl)
const ICO={
  // versturen: pijl omhoog uit een doosje — met dubbele, kromme streken
  send:'<svg viewBox="0 0 24 24" class="acic"><path d="M12.1 3 Q12.5 9 11.9 14.4 M8 7.2 Q10.1 4.5 12.1 2.9 Q14.1 4.9 16 7.2 M3.8 12.6 Q3.6 16.6 4.2 20.3 M4 20 Q12 20.8 20 20.1 M19.8 20.4 Q20.4 16.5 20.1 12.6"/><path d="M4.3 19.5 Q11.5 20.1 19.7 19.4" opacity="0.5"/></svg>',
  // toevoegen: pijl omlaag in een doosje
  add:'<svg viewBox="0 0 24 24" class="acic"><path d="M12.1 14 Q12.4 8 11.9 2.8 M7.8 9.8 Q10 12.5 12.1 14.4 Q14.1 12.1 16.2 9.3 M3.8 12.6 Q3.6 16.6 4.2 20.3 M4 20 Q12 20.8 20 20.1 M19.8 20.4 Q20.4 16.5 20.1 12.6"/><path d="M4.3 19.5 Q11.5 20.1 19.7 19.4" opacity="0.5"/></svg>',
  // bewerken: potlood met losse lijnen
  edit:'<svg viewBox="0 0 24 24" class="acic"><path d="M3.8 20.5 Q3.6 17.9 4.1 15.7 M4 16 Q9.5 10.4 15.2 4.9 M14.8 5.1 Q17.3 6.9 19.3 9.3 M19 9 Q13.5 14.6 7.8 20.3 M8.1 20 Q5.8 20.6 3.7 20.3"/><path d="M12.6 7 Q15 9 17.4 11.3" opacity="0.6"/><path d="M4.8 19.2 Q5.4 17.4 6.4 16.2" opacity="0.5"/></svg>',
  // verwijderen: prullenbak met losse strepen
  del:'<svg viewBox="0 0 24 24" class="acic"><path d="M4.2 6.9 Q11.5 6.5 19.8 7.2 M8.9 7 Q8.8 5.1 9.1 3.7 Q12 3.4 15.1 3.8 Q15.3 5.3 15.1 7.1 M6 7 Q6.7 13.6 7.3 20.4 M7.1 20 Q12 20.8 17 20.1 M16.8 20.4 Q17.5 13.5 18.2 6.9"/><path d="M9.9 10.3 Q10.3 13.6 10.1 17.1 M14.1 10.3 Q13.7 13.6 13.9 17.1" opacity="0.6"/></svg>',
  // berichtje: tekstballon met een klein staartje en twee regeltjes
  chat:'<svg viewBox="0 0 24 24" class="acic"><path d="M3.8 6.3 Q3.4 4.3 5.3 4.1 Q12 3.6 18.7 4.1 Q20.6 4.3 20.1 6.2 M20.2 5.7 Q20.4 10 20.1 14.2 Q20.3 15.8 18.4 16 Q13 16.3 8.9 16.1 Q6.8 18.2 4.6 20 Q5.3 17.6 5.3 15.9 Q3.5 15.7 3.9 14.1 Q3.5 9.8 4.1 5.5"/><path d="M7.3 8.3 Q11.5 7.9 16.2 8.5 M7.3 11.6 Q10.6 11.2 13.8 11.8" opacity="0.6"/></svg>',
  // koffiemolen: trechter + slinger (voor barista skills)
  grinder:'<svg viewBox="0 0 24 24" class="acic"><path d="M6.7 4.2 Q12 3.9 17.3 4.3 M17.1 4.6 Q16.4 8.1 15.7 11.3 M15.9 11 Q12 11.6 8.1 11.2 M8.3 11.4 Q7.5 8 6.8 4.3 M8.8 11 Q8.6 15.6 8.9 19.9 M8.6 19.5 Q12 20.2 15.4 19.6 M15.2 19.9 Q15.4 15.4 15.1 11"/><path d="M16.6 4.8 Q19.7 4.3 20.8 6.6 Q21.2 8.2 19.6 8.8" opacity="0.8"/><path d="M10.3 13.4 Q12 13.1 13.8 13.6" opacity="0.5"/></svg>',
  // open boek (voor coffee academy)
  book:'<svg viewBox="0 0 24 24" class="acic"><path d="M12.1 5.4 Q8.4 3.4 4.2 4.5 M4.5 4.2 Q3.8 11.5 4.3 18.7 M4.2 18.2 Q8.6 17.3 12.2 19.7 M11.9 19.4 Q15.4 17.3 19.8 18.5 M19.5 18.8 Q20.2 11.5 19.7 4.3 M19.9 4.7 Q15.5 3.4 11.8 5.7 M12.1 5.1 Q12.3 12.6 11.9 19.9"/><path d="M6.4 8.1 Q9 7.4 10.7 8.3 M6.4 11.1 Q9 10.4 10.7 11.3 M13.4 8.3 Q15.6 7.4 17.7 8.1 M13.4 11.3 Q15.6 10.4 17.7 11.1" opacity="0.5"/></svg>',
  // melkkannetje (voor latte art)
  pitcher:'<svg viewBox="0 0 24 24" class="acic"><path d="M6.8 5.7 Q11.5 5.3 16.2 5.9 M16.1 5.6 Q16.7 12.6 16.1 19.3 M16.3 19 Q11.6 19.8 7.3 19.1 M7.5 19.4 Q6.5 12.6 6.9 5.4 M7.1 7.3 Q4.8 8.4 4.4 11 Q4.2 13.2 6.1 13.7 M16.1 6.8 Q17.7 5.8 18.9 7.1 Q19.8 8.5 18.3 9.4"/><path d="M9.3 8.9 Q11.5 8.5 14 9.1" opacity="0.5"/></svg>',
  // sparkle/AI: schetsmatige vonk
  spark:'<svg viewBox="0 0 24 24" class="acic"><path d="M11.6 4.2 Q12.7 8.2 13.4 9.9 Q15.2 10.7 19.8 11.3 Q15 12.6 13.1 13.4 Q12.4 15.4 11.8 20.8 Q11.2 15 10.6 13.1 Q8.6 12.4 4.2 11.6 Q9.1 10.3 10.9 9.6 Q11.6 7.6 12.3 3.4"/><path d="M18.4 4.4 Q18.9 5.5 19.1 6.1 Q19.9 6.4 21.2 6.5 Q19.6 7.1 18.9 7.4 Q18.6 8.2 18.4 9.4 Q18.1 8 17.9 7.2 Q17 6.9 15.8 6.5 Q17.4 6.1 18.1 5.9 Q18.4 5 18.7 3.8" opacity="0.7"/></svg>',
  // download-pijl (exporteren)
  down:'<svg viewBox="0 0 24 24" class="acic"><path d="M11.9 3.1 Q12.4 8.6 12 13.5 M8.2 9.4 Q10.2 11.7 12.1 13.8 Q13.9 11.4 15.8 9 M4.6 17.1 Q12 17.8 19.4 16.9 M5.2 20 Q12 20.7 18.9 19.9" /></svg>',
  // upload-pijl (importeren)
  up:'<svg viewBox="0 0 24 24" class="acic"><path d="M12.1 13.4 Q12.5 7.9 11.9 3.1 M8.2 7.6 Q10.2 5.3 12.1 3 Q13.9 5.6 15.8 8 M4.6 17.1 Q12 17.8 19.4 16.9 M5.2 20 Q12 20.7 18.9 19.9"/></svg>',
  // diskette (opslaan)
  disk:'<svg viewBox="0 0 24 24" class="acic"><path d="M4.8 4.2 Q11 3.8 16.6 4.4 Q18.3 6.2 19.8 8.1 M19.6 7.7 Q20.1 13.5 19.7 19.7 M19.9 19.3 Q12 20.1 4.4 19.5 M4.7 19.8 Q4 12 4.9 4 M7.9 4.4 Q7.8 7 7.9 8.7 Q11.8 9.2 15.5 8.6 Q15.7 6.6 15.6 4.5"/><path d="M7.9 19.5 Q7.8 15 8.1 12.8 Q12 12.4 16.1 12.9 M16 12.6 Q16.3 16.1 16.2 19.5" opacity="0.7"/></svg>',
  // afbeelding/tekening (galerij, tekeningen herstellen)
  img:'<svg viewBox="0 0 24 24" class="acic"><path d="M4.4 5.8 Q12 5.2 19.8 5.6 M19.5 5.1 Q20.1 12 19.6 18.9 M19.9 18.5 Q12 19.1 4.2 18.6 M4.6 19 Q4 12 4.4 5.2"/><path d="M5.2 15.8 Q8 12 10.1 13.7 Q13 9.4 15.6 12.1 Q17.6 14.1 19.1 16.7" opacity="0.8"/><path d="M9.9 8.7 Q10.3 10.4 8.6 10.5 Q7.1 10.4 7.3 8.9 Q7.6 7.5 9.2 7.7 Q9.9 7.9 10.2 8.4" opacity="0.7"/></svg>',
  // camera (foto maken)
  cam:'<svg viewBox="0 0 24 24" class="acic"><path d="M4.3 8.2 Q6.9 7.6 8.5 7.7 Q9.3 6.3 10.1 5.4 Q12 5.1 13.9 5.4 Q14.7 6.5 15.5 7.9 Q17.4 7.6 19.7 8.1 M19.4 7.6 Q20.1 13 19.6 18.3 M19.9 17.9 Q12 18.6 4.2 18.1 M4.6 18.5 Q3.9 13 4.4 7.7"/><path d="M15.2 11.8 Q16 14.4 13.4 15.8 Q10.6 16.7 9 14.6 Q8.1 12.2 10.3 10.2 Q12.8 8.9 14.8 10.7 Q15.4 11.4 15.5 12.4"/><path d="M13.1 12.2 Q13.5 13.7 12 13.9 Q10.6 13.9 10.7 12.5 Q10.9 11.3 12.3 11.4" opacity="0.5"/></svg>',
  // loep (zoeken)
  search:'<svg viewBox="0 0 24 24" class="acic"><path d="M14.4 8.1 Q17 11.6 14.2 14.6 Q11.1 16.9 7.6 14.9 Q4.8 12.3 6.5 8.5 Q9 5.3 12.6 6.3 Q14.2 7 15 8.7"/><path d="M14.6 14.9 Q17.4 17.6 20.4 20.5"/><path d="M7.6 8.9 Q8.6 7.1 10.7 7" opacity="0.5"/></svg>',
  // sleutel (API-sleutel)
  key:'<svg viewBox="0 0 24 24" class="acic"><path d="M11.4 7.4 Q13.1 10.4 10.4 12.7 Q7.4 14 5 11.6 Q3.3 8.7 5.7 6.1 Q8.7 4.2 11.1 6.4 Q11.7 7 11.9 8.1"/><path d="M10.9 11.6 Q14.6 15.6 20 20.8 M15.8 16.9 Q17.2 15.6 18.6 14.4 M18.1 19.2 Q19.2 17.9 20.3 16.9"/><path d="M8 8.6 Q8.3 9.8 7.1 9.7 Q6.1 9.4 6.5 8.3 Q7.3 7.8 8.1 8.5" opacity="0.5"/></svg>',
  // link/ketting
  link:'<svg viewBox="0 0 24 24" class="acic"><path d="M9.7 7.7 Q11.7 5.2 14.1 5.2 Q17.2 4.9 18.8 7.6 Q20.1 10.1 18.1 12.3 Q16.5 14.1 14.1 14.4 M14.2 16.3 Q12.1 18.8 9.8 18.8 Q6.7 19.1 5.2 16.4 Q3.9 13.9 5.9 11.7 Q7.5 9.9 9.8 9.6"/><path d="M9.2 14.9 Q12 12 15 9.1" opacity="0.6"/></svg>',
  // waarschuwing (driehoek met !)
  warn:'<svg viewBox="0 0 24 24" class="acic"><path d="M11.8 3.6 Q13 5.6 17.1 12.6 Q19.6 17.1 20.8 19.3 M20.4 19 Q12 19.8 3.3 19.1 M3.7 19.4 Q4.5 17 7 12.4 Q11 5.4 12.2 3.5"/><path d="M11.9 9.3 Q12.3 12 11.9 14.8 M12 16.5 L12 17.2" opacity="0.8"/></svg>',
  // gloeilamp (tip)
  bulb:'<svg viewBox="0 0 24 24" class="acic"><path d="M11.5 3.4 Q17.2 3.2 17.8 8.4 Q18.2 11.6 15.7 13.8 Q15 14.4 14.9 16.3 M15 16 Q12 16.6 9.1 16.1 M9.3 16.3 Q9 14.2 8.3 13.6 Q5.8 11.4 6.2 8.2 Q6.8 3.3 12.5 3.6"/><path d="M9.7 18.4 Q12 18.9 14.3 18.4 M10.3 20.5 Q12 21 13.8 20.5" opacity="0.7"/></svg>',
};
let state={methods:[],brews:[],beans:[],gear:[]};
const PRESET_TAGS=['fruity','chocolate','floral','nutty','caramel','citrus','berry','sweet','clean','juicy','balanced'];

