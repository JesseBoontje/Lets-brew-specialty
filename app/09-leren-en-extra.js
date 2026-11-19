/* ---------------- learn content ---------------- */
const LESSONS={
  filter:[
    {type:'draw',h:'percolatie of immersie',svg:'<svg viewBox="0 0 300 158"><path d="M18 34 Q60 28 104 34"/><path class="b" d="M21 37 Q60 31 101 37"/><path d="M20 36 Q40 84 54 116"/><path class="b" d="M23 38 Q42 85 56 118"/><path d="M102 36 Q82 84 68 116"/><path class="b" d="M99 38 Q80 85 66 118"/><path d="M54 116 Q61 120 68 116"/><path class="hi" d="M31 54 Q61 49 91 54"/><path class="hi dash" d="M48 60 Q50 88 56 114"/><path class="hi dash" d="M76 60 Q74 88 68 114"/><path class="hi" d="M59 122 Q62 130 60 138"/><path class="hi" d="M55 132 L60 140 L65 131"/><text x="14" y="154">percolatie</text><path d="M198 34 Q240 28 284 34"/><path class="b" d="M201 37 Q240 31 281 37"/><path d="M200 36 Q220 84 234 116"/><path class="b" d="M203 38 Q222 85 236 118"/><path d="M282 36 Q262 84 248 116"/><path class="b" d="M279 38 Q260 85 246 118"/><path d="M234 116 Q241 120 248 116"/><path class="hi" d="M210 50 Q241 45 272 50"/><path class="hi b" d="M220 76 Q241 72 262 76"/><path class="hi b" d="M228 94 Q241 91 254 94"/><path d="M232 122 Q241 118 250 122"/><path class="hi" d="M240 126 Q248 130 240 136"/><text x="214" y="154">immersie</text></svg>',
     c:'de twee families waar elk filterrecept tussenin zit',
     t:'Bij percolatie (V60, Chemex, Kalita) stroomt het water door het bed heen: elke druppel maakt \u00e9\u00e9n reis, en de contacttijd bepaal je met je maling. Bij immersie (French press, cold brew, en een omgekeerde AeroPress) staat alles even lang onder water. Dat is vergevingsgezinder, want een paar seconden meer of minder verandert weinig \u2014 bij percolatie wel.'},
    {type:'p',h:'wat dat met je smaak doet',t:'Bij percolatie is het water dat langs de koffie stroomt steeds vers, dus blijft het gretig oplossen. Je haalt er de vluchtige, lichte dingen het beste uit: bloemig, citrus, thee \u2014 en de kop is helder, met een dunner mondgevoel, want het papier ziet elke druppel \u00e9\u00e9n keer. Bij immersie raakt het water rond de koffie langzaam verzadigd en stopt de extractie zichzelf af. Dat levert minder scherpe randen op en meer zoet, body en rondheid, maar ook minder definitie: het fijne onderscheid tussen twee bloemige bonen vlakt af. Vandaar de vuistregel \u2014 wil je een boon lezen, percoleer; wil je hem lekker en vergevingsgezind, dompel onder.'},
    {type:'p',h:'de Hario Switch: allebei, in \u00e9\u00e9n brouwsel',t:'De Switch is een V60 met een klep onderin, en dat maakt het geen derde methode maar een schuifknop tussen de twee. Klep dicht = immersie: het water blijft staan en je bouwt zoet en body op. Klep open = percolatie: het loopt door en je wint helderheid. Het gangbare recept sluit de klep voor de bloom en een weekfase, en opent hem daarna om leeg te laten lopen \u2014 zo krijg je de zoetheid van een immersie met de helderheid van een dripper. Draai je de volgorde om (eerst open, aan het eind dicht), dan hou je juist de laatste, zwakkere loop vast en wordt het romiger maar minder scherp. Op je Switch is de klep dus een smaakknop, en hij staat in de pour coach bij elke stap.'},
    {type:'p',h:'en je AeroPress heeft dezelfde knop',t:'Wat de klep bij de Switch is, is de stand bij een AeroPress. <b>Normaal</b>, met het filterdopje op je kopje, werkt het water vanaf de eerste seconde door het papier: deels percolatie, dus schoner en dunner, met de lichte smaken voorop \u2014 maar je hebt de weektijd niet in de hand en je zit sneller tegen onderextractie aan. <b>Omgekeerd</b>, op de zuiger, loopt er niets door tot jij hem omdraait: volle immersie, dus meer zoet, meer body en veel beter te herhalen, met wat minder definitie. Zelfde boon, zelfde maling, andere kop. In een aeropress-recept kies je die stand, en de app zet de omkeerstap er dan zelf tussen.'},
    {type:'p',h:'de vier knoppen',t:'Je stuurt een filterkop met vier dingen: maling, ratio, temperatuur en gietschema. De maling is verreweg de sterkste \u2014 begin daar, en verander \u00e9\u00e9n ding tegelijk. Anders weet je achteraf niet wat het deed.'},
    {type:'p',h:'ratio en maling doen niet hetzelfde',t:'De ratio bepaalt hoe sterk je kop is; de maling bepaalt hoe ver je extraheert. Slap maar niet bitter? Dat is de ratio: minder water of meer koffie, richting 1:15. Zuur of juist bitter? Dat is de maling. Het standaardvertrekpunt is 1:16, met 1:15 voor steviger en 1:17 voor helderder.'},
    {type:'draw',h:'waarom je bloomt',svg:'<svg viewBox="0 0 300 160"><path d="M18 40 Q56 34 94 40"/><path class="b" d="M21 43 Q56 37 91 43"/><path d="M20 42 Q36 84 46 112"/><path d="M92 42 Q76 84 66 112"/><path class="hi" d="M28 36 Q38 6 56 4 Q74 5 84 36"/><path class="hi b" d="M32 34 Q42 12 56 10 Q70 11 80 34"/><path class="hi" d="M46 14 Q52 20 48 26"/><text x="16" y="134">vers: bolt op</text><text x="16" y="149">3× dose, 45 s</text><path class="dash" d="M112 66 Q136 62 160 66"/><path d="M153 60 L162 66 L153 72"/><path d="M182 40 Q220 34 258 40"/><path class="b" d="M185 43 Q220 37 255 43"/><path d="M184 42 Q200 84 210 112"/><path d="M256 42 Q240 84 230 112"/><path class="hi" d="M194 34 Q220 26 246 34"/><text x="180" y="134">oud: blijft vlak</text><text x="180" y="149">2× dose, 30 s</text></svg>',
     c:'hetzelfde gas, een ander advies dan bij espresso',
     t:'Vers gebrande bonen zitten vol CO\u2082. Dat gas duwt het water weg, dus laat je het eerst ontsnappen: ongeveer 2 tot 3 keer je dose aan water, 30 tot 45 seconden. Hoe verser de boon, hoe ruimer en langer. Na een week of vier is er nauwelijks gas over en koelt een lange bloom je bed alleen maar af.'},
    {type:'p',h:'gieten: hoogte, cirkels en de rand',t:'Giet van laag en rustig; van hoog slaat de straal het bed open en spoelt fijn stof naar beneden. Blijf van de filterrand af \u2014 water dat langs het papier loopt heeft geen koffie gezien. Swirlen mag, maar roer niet met een lepel \u00ed\u00f1 het bed: dat drijft fijn stof de poriën van het papier in en verstopt je filter.'},
    {type:'draw',h:'het bed lezen',svg:'<svg viewBox="0 0 300 150"><path d="M12 26 Q46 21 80 26"/><path d="M14 28 Q30 66 40 92"/><path d="M78 28 Q62 66 52 92"/><path d="M40 92 Q46 95 52 92"/><path class="hi" d="M24 56 Q46 52 68 56"/><text x="16" y="116">vlak</text><text x="8" y="132">zoals het hoort</text><path d="M112 26 Q146 21 180 26"/><path d="M114 28 Q130 66 140 92"/><path d="M178 28 Q162 66 152 92"/><path d="M140 92 Q146 95 152 92"/><path class="hi" d="M124 52 Q135 68 146 69 Q157 68 168 52"/><text x="116" y="116">krater</text><text x="106" y="132">te hard gegoten</text><path d="M212 26 Q246 21 280 26"/><path d="M214 28 Q230 66 240 92"/><path d="M278 28 Q262 66 252 92"/><path d="M240 92 Q246 95 252 92"/><path class="hi" d="M224 46 Q235 64 246 64 Q257 64 268 46"/><path class="hi b" d="M226 42 Q228 52 231 58"/><path class="hi b" d="M266 42 Q264 52 261 58"/><text x="216" y="116">muurtje</text><text x="216" y="132">droge rand</text></svg>',
     c:'kijk even in je dripper als het water weg is',
     t:'Een vlak bed betekent dat het water overal even hard heeft gewerkt. Een krater betekent dat je te hard of te hoog hebt gegoten. Een droge rand die blijft staan betekent dat een deel van je koffie nooit heeft meegedaan. Allebei gietfouten, geen maalfouten \u2014 corrigeer dus eerst je gieten voordat je aan je molen draait.'},
    {type:'p',h:'de doorlooptijd',t:'Bij espresso lees je de shot af aan de tijd; bij filter is de doorlooptijd het equivalent: vanaf je laatste giet tot het bed droogvalt. Loopt het steeds trager, dan zit je filter verstopt door fijn stof \u2014 grover malen, minder roeren, lager gieten. Loopt het opeens snel, dan is je maling te grof of je bed opengeslagen.'},
    {type:'p',h:'papier en brewer tellen mee',t:'Hetzelfde recept op ander papier verschuift je doorlooptijd makkelijk een halve minuut: de Japanse Hario loopt sneller dan de tabbed versie, Sibarist sneller dan allebei, Cafec Abaca zit ertussenin met wat meer zoetheid. Een conische brewer houdt een dieper bed dan een vlakke, en die twee vragen niet dezelfde maling. Noteer het, anders schrijf je het verschil toe aan je molen.'},
    {type:'p',h:'water',t:'Een kop filter is bijna helemaal water en er staat geen crema of melk overheen, dus je proeft het. Magnesium trekt vooral aroma\u2019s los, calcium meer body en zuren, en bicarbonaat dempt zuren \u2014 te veel daarvan haalt precies het frisse weg waar je een lichte branding om koopt. Zet je waterbasis \u00e9\u00e9n keer vast en vergeet hem daarna.'},
    {type:'tip',t:'Proef je kop nog een keer als hij handwarm is. Bij specialty komen er dan juist m\u00e9\u00e9r smaken naar boven \u2014 en een kop die koud nog lekker is, was goed gezet.'},
    {type:'check',h:'filter check-routine',items:[
      'boon vers (3 dagen tot 4 weken)','water op \u00e9\u00e9n vaste basis','filter gespoeld','dose gewogen','bed vlak geschud',
      'bloom 2\u20133\u00d7 dose, 30\u201345 s','laag en binnen de rand gegoten','doorlooptijd gekeken','bed bekeken','geproefd \u00e9n genoteerd']},
    {type:'link',h:'meteen zetten?',t:'',label:'open de pour coach',action:'learnToPour',feat:'pourcoach'},
  ],
  barista:[
    {type:'p',h:'dose & verdeling',t:'Weeg altijd je dose op 0,1 g nauwkeurig. Verdeel het maalsel gelijkmatig (WDT met een naaldje) zodat water overal even snel doorloopt — ongelijke verdeling = kanaalvorming en een scheve extractie.'},
    {type:'p',h:'tampen',t:'Tamp recht en consistent, niet keihard. Belangrijker dan de kracht is dat je elke keer hetzelfde doet en dat het oppervlak waterpas is.'},
    {type:'p',h:'maling afstellen',t:'De maling is je krachtigste knop. Loopt de shot te snel (waterig, zuur)? Maal fijner. Te traag (bitter, droog)? Maal grover. Stel bij in kleine stapjes.'},
    {type:'tip',t:'Verandert je smaak zonder dat je iets veranderde? Check eerst je maalgraad en versheid van de boon — die schuiven het snelst.'},
    {type:'check',h:'espresso check-routine',items:[
      'boon vers (1–4 weken na branden)','dose gewogen','maalsel verdeeld (WDT)','recht getampt','shot getimed','yield gewogen','geproefd & genoteerd']},
  ],
  academy:[
    {type:'p',h:'wat is specialty coffee?',t:'Specialty coffee scoort 80+ van de 100 punten bij een professionele cupping volgens de Specialty Coffee Association. Geen defecten, een herkenbaar smaakprofiel en traceerbaar tot de producent. Het is een kwaliteitsklasse, geen marketingterm.'},
    {type:'p',h:'arabica vs robusta',t:'Bijna alle specialty is Arabica: complexer en fijner van smaak, maar gevoeliger en lastiger te telen. Robusta is robuuster, bitterder en cafeïnerijker, en wordt zelden als specialty geclassificeerd.'},
    {type:'p',h:'de coffee belt',t:'Koffie groeit rond de evenaar — Midden- en Zuid-Amerika, Afrika en Azië. Hoogtes tussen ~1200 en 2200 m geven langzame rijping en zo complexere smaken. Bodem, zon, regen en nachtkou bepalen mee de aroma\'s.'},
    {type:'p',h:'de koffiekers',t:'Een koffieboon is eigenlijk de pit van een rode koffiekers. Meestal zitten er twee pitten in een kers. Bij specialty wordt met de hand alleen de rijpe kers geplukt.'},
    {type:'p',h:'washed proces',t:'Het vruchtvlees wordt verwijderd (depulpen), daarna fermenteert de boon zodat de slijmlaag loslaat, en wordt hij gewassen en gedroogd. Resultaat: een heldere, schone, vaak fruitig-zure kop. Komt veel uit Afrika.'},
    {type:'p',h:'natural proces',t:'De hele kers droogt in de zon met vruchtvlees en al. Geeft een zoetere, fruitigere, wijnachtige kop met voller mondgevoel en lagere zuren. Ongeveer 70% van de wereldproductie is natural.'},
    {type:'p',h:'honey proces',t:'Een tussenvorm: ontpulpen zoals washed, maar drogen met de zoete slijmlaag er nog omheen (zoals natural). Geeft balans tussen zoetheid en helderheid. Complex en gevoelig om goed te krijgen.'},
    {type:'p',h:'experimentele fermentatie',t:'Anaerobe fermentatie (in afgesloten tanks zonder zuurstof) en carbonic maceration geven heel uitgesproken, soms wilde smaken. Hoger risico en duurder — vandaar de prijs.'},
    {type:'p',h:'branden (roasting)',t:'Bij het branden verandert de groene boon in een aromatische boon. Tijdens het proces hoor je twee "cracks". Licht en medium branden behouden de natuurlijke smaken (citrus, bloem, fruit); donker branden maskeert nuance en wordt bitterder.'},
    {type:'p',h:'ontgassen (degassen)',t:'Net gebrande bonen geven CO₂ af. Daarom is koffie op zijn best tussen ~3 dagen en 6 weken na branden. Te verse koffie geeft belletjes en een onrustige extractie; te oude koffie smaakt vlak.'},
    {type:'p',h:'versheid → maalgraad',t:'Hoe verser de boon, hoe meer CO₂: de extractie remt en de shot loopt trager. Vuistregel: net na de rustperiode iets fijner malen, en naarmate de boon ouder wordt (minder gas) stap voor stap grover. In je bonenkast zie je per boon "X dagen vers" — gebruik dat als hint bij het afstellen.'},
    {type:'link',h:'meteen afstellen?',t:'Open het dial-in scherm en werk met doel vs. jouw shot naar de juiste maalstand toe.',label:'espresso afstellen (dial-in)',action:'learnToDialIn'},
    {type:'p',h:'roast-niveau → maling & temp',t:'Donker gebrande bonen zijn brozer en lossen sneller op: maal iets grover en zet iets koeler om bitterheid te vermijden. Lichte roasts zijn dichter en trager: maal fijner en zet warmer om genoeg zoetheid en body los te maken.'},
    {type:'p',h:'de zak lezen voor je maalt',t:'Drie dingen op de zak vertellen samen al waar je ongeveer moet beginnen. De branding weegt het zwaarst: donkerder is brozer en beter oplosbaar, dus grover. Het proces bepaalt de celstructuur: een natural droogt met vrucht en al, houdt een zwakkere structuur over en extraheert het snelst — grover dus; washed is het stevigst en loopt het traagst, dus fijner; honey zit ertussenin. En de hoogte staat voor dichtheid: boven ongeveer 1800 meter groeit de boon langzaam en hard, wat weer fijner vraagt. Decaf is een geval apart: het ontcafeïneren tast de celstructuur aan, dus stel opnieuw af in plaats van je oude stand door te rekenen.'},
    {type:'tip',t:'Vul branding, proces en hoogte in bij een nieuwe zak. De app rekent dan het verschil met je vorige zak om in stappen fijner of grover — en zodra je iets vergelijkbaars eerder zette, gebruikt hij die stand in plaats van de vuistregel.'},
    {type:'p',h:'extractie',t:'Koffie zetten is oplossen. Te weinig/te grof = onderextractie (zuur, dun, zout). Te veel/te fijn = overextractie (bitter, droog). De zoete balans zit ertussenin.'},
    {type:'p',h:'de vier knoppen',t:'Je stuurt smaak met vier dingen: maalgraad, dose/ratio, watertemperatuur en tijd. Verander er één tegelijk, anders weet je niet wat werkte.'},
    {type:'p',h:'water',t:'Koffie is ~98% water. Te zacht smaakt vlak, te hard maskeert en verkalkt je apparaat. Mineraalgehalte rond 75–150 ppm en gefilterd water werken het best.'},
    {type:'p',h:'cold brew',t:'Grof gemalen koffie 12–24 uur koud laten trekken geeft een zacht, zoet concentraat met heel lage zuren. Verdun met water of melk. Iets anders dan iced coffee, dat warm gezet en daarna gekoeld wordt.'},
    {type:'p',h:'single origin vs blend',t:'Single origin komt van één regio, farm of coöperatie met een uitgesproken karakter. Een blend mengt herkomsten voor een consistente, gebalanceerde smaak — vaak fijn voor espresso met melk.'},
    {type:'p',h:'cupping & smaak',t:'Bij cupping wordt blind geproefd op aroma, zuren, zoetheid, body en nasmaak. Thuis kun je hetzelfde doen: laat je koffie afkoelen — bij specialty komen dan juist méér smaken naar boven.'},
    {type:'tip',t:'Zuur en dun? Maal fijner of zet warmer. Bitter en droog? Maal grover of zet koeler. Eén stap tegelijk.'},
  ],
};
const LESSON_MAP={'barista-content':'barista','filter-content':'filter','academy-content':'academy'};
function lessonBlock(elId,bi){return (LESSONS[LESSON_MAP[elId]]||[])[bi];}
function learnMoreKey(elId,bi){return 'scc_learn_more_'+elId+'_'+bi;}
function renderLearnMore(elId,bi){
  const arr=JSON.parse(localStorage.getItem(learnMoreKey(elId,bi))||'[]');
  return arr.map((item,i)=>`<div class="lm-item"><button class="lm-del" title="delete" onclick="learnMoreDel('${elId}',${bi},${i})">×</button><div class="lm-q hand">${esc(item.q)}</div><div class="lm-a">${esc(item.a).replace(/\n/g,'<br>')}</div></div>`).join('');
}
const AISPARK='<svg viewBox="0 0 24 24" class="acic"><path d="M11.6 4.2 Q12.7 8.2 13.4 9.9 Q15.2 10.7 19.8 11.3 Q15 12.6 13.1 13.4 Q12.4 15.4 11.8 20.8 Q11.2 15 10.6 13.1 Q8.6 12.4 4.2 11.6 Q9.1 10.3 10.9 9.6 Q11.6 7.6 12.3 3.4"/></svg>';
function renderLesson(elId,blocks){
  const el=document.getElementById(elId);
  el.innerHTML=blocks.map((b,bi)=>{
    if(b.type==='p'){
      const key=elId+'_'+bi;
      return `<div class="lesson sketch soft"><h3>${esc(b.h)}</h3><p>${esc(b.t)}</p>
        <div class="lm-saved" id="lm-saved-${key}">${renderLearnMore(elId,bi)}</div>
        <div class="lm-wrap ai-only ${aiReady()?'':'hidden'}">
          <button class="lm-btn" onclick="learnMoreToggle('${key}')">${AISPARK} leer meer</button>
          <div class="lm-panel hidden" id="lm-panel-${key}">
            <input id="lm-input-${key}" placeholder="ask your own question about this…" onkeydown="if(event.key==='Enter')learnMoreAsk('${elId}',${bi},false)">
            <div class="lm-actions">
              <button class="lm-go primary" onclick="learnMoreAsk('${elId}',${bi},true)">verdiep dit</button>
              <button class="lm-go" onclick="learnMoreAsk('${elId}',${bi},false)">vraag</button>
            </div>
          </div>
        </div></div>`;
    }
    if(b.type==='draw')return `<div class="lesson sketch soft"><h3>${esc(b.h)}</h3>
      <div class="ls-draw">${b.svg}</div><div class="ls-cap">${esc(b.c||'')}</div>
      ${b.t?('<p style="margin-top:8px">'+esc(b.t)+'</p>'):''}</div>`;
    if(b.type==='tip')return `<div class="lesson sketch soft" style="background:var(--v60)"><div class="tipbox">💡 ${esc(b.t)}</div></div>`;
    if(b.type==='link'){
      if(b.feat&&!featOn(b.feat))return '';
      return `<button class="lesson-link sketch" onclick="${esc(b.action)}()"><svg viewBox="0 0 24 24" class="acic"><path d="M18.4 9.4 Q21.4 14.4 17.2 18.5 Q12.5 21.3 7.5 18.6 Q3.3 15.3 4.6 10.1 Q6.6 4.9 12.1 3.8 Q16.5 3.9 19 8.3"/><path d="M15 9.3 Q17.2 12.4 14.6 15.2 Q11.5 17 8.8 14.8 Q6.9 12.1 9 9.5 Q11.5 7.2 14.5 8.6"/><path d="M12.9 11.2 Q13.7 12.6 12.2 13.3 Q10.8 13.1 10.9 11.6 Q11.4 10.8 12.6 11.1"/></svg><span>${esc(b.label)}</span><span class="ll-arr">›</span></button>`;
    }
    if(b.type==='check'){
      const key=elId+'_'+bi;
      const done=JSON.parse(localStorage.getItem('scc_check_'+key)||'[]');
      const rows=b.items.map((it,i)=>`<div class="check ${done.includes(i)?'done':''}" onclick="toggleCheck('${key}',${i},this)">
        <div class="box">${done.includes(i)?'✓':''}</div><div class="ctxt">${esc(it)}</div></div>`).join('');
      return `<div class="lesson sketch"><h3>${esc(b.h)}</h3>${rows}</div>`;
    }
    return '';
  }).join('');
}
function learnToGallery(){go('gallery');}
function learnToPour(){
  const f=state.methods.filter(m=>m.on&&methodFamily(m)==='filter')[0];
  if(f){beginBrew(f.id);setTimeout(()=>{const c=document.getElementById('pc-stack');
    if(c&&c.style.display!=='none')c.scrollIntoView({behavior:'smooth',block:'start'});},250);}
  else toast('turn on a filter method first under methods');
}
function learnToDialIn(){
  const esp=state.methods.filter(m=>m.on&&methodFamily(m)==='espresso')[0];
  if(esp)beginBrew(esp.id); else toast('turn on an espresso method first under methods');
}
function learnMoreToggle(key){
  const p=document.getElementById('lm-panel-'+key);if(!p)return;
  p.classList.toggle('hidden');
  if(!p.classList.contains('hidden')){const i=document.getElementById('lm-input-'+key);if(i)i.focus();}
}
async function learnMoreAsk(elId,bi,deepen){
  const block=lessonBlock(elId,bi);if(!block)return;
  const key=elId+'_'+bi;
  const inputEl=document.getElementById('lm-input-'+key);
  const vraag=deepen?'':((inputEl&&inputEl.value.trim())||'');
  if(!deepen&&!vraag){toast('type a question first');return;}
  const savedEl=document.getElementById('lm-saved-'+key);
  const loadId='lm-load-'+Date.now();
  savedEl.insertAdjacentHTML('beforeend','<div class="lm-item" id="'+loadId+'"><span class="spin"></span>the coach is thinking…</div>');
  try{
    const sys="Je bent een specialty-koffiedocent. Onderwerp uit de academy — \""+block.h+"\": "+block.t+"\n\n"+
      (deepen?"Verdiep dit onderwerp met 3–5 concrete, extra inzichten die verder gaan dan de tekst hierboven.":
              ("Beantwoord deze vraag van de lerende: \""+vraag+"\"."))+
      " Schrijf in het Nederlands, kort en praktisch, max 6 zinnen. Geen inleiding — direct de kennis.";
    const txt=await askAI([{role:"user",content:sys}],600,'learn');
    const skey=learnMoreKey(elId,bi);
    const arr=JSON.parse(localStorage.getItem(skey)||'[]');
    arr.push({q:(deepen?'verdieping ✦':vraag),a:(txt||'').trim(),ts:Date.now()});
    localStorage.setItem(skey,JSON.stringify(arr));
    savedEl.innerHTML=renderLearnMore(elId,bi);
    if(inputEl)inputEl.value='';
    toast('✓ added to your academy');
  }catch(e){
    const l=document.getElementById(loadId);if(l)l.remove();
    toast('couldn\'t reach the coach');
  }
}
function learnMoreDel(elId,bi,i){
  const skey=learnMoreKey(elId,bi);
  const arr=JSON.parse(localStorage.getItem(skey)||'[]');
  arr.splice(i,1);localStorage.setItem(skey,JSON.stringify(arr));
  const el=document.getElementById('lm-saved-'+elId+'_'+bi);if(el)el.innerHTML=renderLearnMore(elId,bi);
}
function toggleCheck(key,i,row){
  const k='scc_check_'+key;
  let done=JSON.parse(localStorage.getItem(k)||'[]');
  if(done.includes(i)){done=done.filter(x=>x!==i);row.classList.remove('done');row.querySelector('.box').textContent='';}
  else{done.push(i);row.classList.add('done');row.querySelector('.box').textContent='✓';}
  localStorage.setItem(k,JSON.stringify(done));
}
// maakt een compacte samenvatting van je bonen + recente brews voor de AI
/* Alles wat de app over jou weet, als leesbare tekst voor de coach. Vraag je
   iets over "die boon die ik gisteren dialde", dan moet hij die boon kunnen
   vinden en er de echte cijfers bij hebben -- niet alleen de naam.          */
function beanRegel(b){
  const p=[b.name];
  if(b.roaster)p.push('van '+b.roaster);
  if(b.origin)p.push(b.origin);
  if(b.process)p.push(b.process);
  if(b.variety)p.push('variëteit '+b.variety);
  if(b.roast)p.push('branding '+b.roast);
  if(altitudeOf(b))p.push(altitudeOf(b)+' m');
  const f=beanFreshness(b);
  if(f)p.push(f.days+' dagen na branden');
  if(b.fam)p.push('zak zegt: '+(b.fam==='both'?'omni':b.fam));
  if(isDecaf(b))p.push('DECAF');
  if(b.roasternotes)p.push('smaaknotities: '+b.roasternotes);
  const ms=(Array.isArray(b.methods)&&b.methods.length?b.methods:(b.method?[b.method]:[]))
    .map(id=>(methodById(id)||{}).name).filter(Boolean);
  if(ms.length)p.push('methodes: '+ms.join('/'));
  // wat er echt is afgetekend weegt het zwaarst -- dat zijn gemeten waarden
  const vast=beanDial(b,null);
  if(vast)p.push('AFGETEKEND: '+vast.map(d=>
    ((methodById(d.method)||{}).name||d.method)+' op maalstand '+d.grind+
    (dialCijfers(d)?(' ('+dialCijfers(d)+')'):'')).join(' | '));
  if(b.dialIn&&b.dialIn.grind)p.push('laatste AI-maaltip: '+b.dialIn.grind+
    (b.dialIn.reason?(' — '+b.dialIn.reason):''));
  if(b.notes)p.push('jouw notitie: '+b.notes);
  return '- '+p.join(', ');
}
function brewRegel(b){
  const m=methodById(b.method);
  const bits=[(m&&m.name)||b.method];
  bits.push(timeAgo(b.ts));
  if(b.drink)bits.push(b.drink);
  if(b.beans)bits.push('boon: '+b.beans);
  if(b.dose)bits.push(b.dose+'g in');
  if(b.yield)bits.push(b.yield+'g uit');
  if(b.ratio)bits.push('ratio 1:'+(+b.ratio).toFixed(1));
  if(b.time)bits.push('tijd '+b.time);
  if(b.grind)bits.push('maalstand '+b.grind+(b.grinder?(' op '+b.grinder):''));
  if(b.temp)bits.push(b.temp+'°C');
  if(b.draw)bits.push('doorlooptijd '+b.draw);
  if(b.bed)bits.push('bed '+bedNL(b.bed));
  if(b.cup)bits.push('geproefd: '+((cupById(b.cup)||{}).nl||b.cup));
  if(b.score!=null&&b.score!=='')bits.push('score '+(+b.score).toFixed(1)+'/10');
  if(asArr(b.tags).length)bits.push('smaak: '+asArr(b.tags).join('/'));
  if(b.notes)bits.push('notitie: '+b.notes);
  if(isDialInBrew(b))bits.push('(dial-in)');
  return '- '+bits.join(', ');
}
function myCoffeeContext(){
  let ctx='';
  const inHuis=state.beans.filter(b=>b.inStock!==false);
  const op=state.beans.filter(b=>b.inStock===false);
  if(inHuis.length){
    ctx+='=== BONEN IN KAST (nu in huis — gebruik dit als eerste) ===\n';
    inHuis.slice(0,20).forEach(b=>{ctx+=beanRegel(b)+'\n';});
  }else{
    ctx+='=== BONEN IN KAST ===\n(geen bonen als "in huis" gemarkeerd)\n';
  }
  if(op.length){
    ctx+='\n=== ZAKKEN DIE OP ZIJN (niet meer te zetten, wel om naar te verwijzen) ===\n';
    op.slice(0,10).forEach(b=>{ctx+=beanRegel(b)+'\n';});
  }
  const recent=[...state.brews].sort((a,b)=>b.ts-a.ts).slice(0,16);
  if(recent.length){
    ctx+='\n=== BREW-GESCHIEDENIS, nieuwste eerst (gebruik dit als tweede) ===\n';
    recent.forEach(b=>{ctx+=brewRegel(b)+'\n';});
  }
  // de dial-in-reeksen: hoe hij naar een stand toe werkte, niet alleen het eindpunt
  const log=state.dialLog||{};
  const keys=Object.keys(log).filter(k=>(log[k]||[]).length>1);
  if(keys.length){
    ctx+='\n=== DIAL-IN POGINGEN (oud → nieuw, per boon en methode) ===\n';
    keys.slice(0,6).forEach(k=>{
      const i=k.indexOf('|'), bean=beanById(k.slice(0,i)), mid=k.slice(i+1);
      const naam=(bean&&bean.name)||'onbekende boon';
      ctx+='- '+naam+' op '+((methodById(mid)||{}).name||mid)+': '+
        log[k].slice(-8).map(a=>'maling '+(a.g||'?')+' → '+(a.t||'?')+
          (a.y?(' / '+a.y+'g'):'')).join(' ; ')+'\n';
    });
  }
  const gear=state.gear||[];
  if(gear.length){
    ctx+='\n=== UITRUSTING ===\n';
    gear.forEach(g=>{
      const soort=g.kind==='grinder'?'molen':(g.kind==='brewer'?'brewer/machine':'tool');
      ctx+='- '+gearLabel(g)+' ('+soort+', voor '+
        (g.category==='algemeen'?'espresso én filter':g.category)+')\n';
    });
  }
  const aan=state.methods.filter(m=>m.on);
  if(aan.length)ctx+='\n=== METHODES DIE AANSTAAN ===\n'+
    aan.map(m=>'- '+m.name+' ('+methodFamily(m)+')').join('\n')+'\n';
  const eigen=(state.recipes||[]).filter(r=>r.eigen);
  if(eigen.length)ctx+='\n=== EIGEN RECEPTEN ===\n'+
    eigen.map(r=>'- '+r.naam+' ('+((methodById(methodForRecipe(r))||{}).name||recipeFam(r))+
      ', '+r.dose+'g, 1:'+r.ratio+', '+r.temp+'°C'+(r.stand?', maalstand '+r.stand:'')+')').join('\n')+'\n';
  const shots=(state.latteShots||[]).filter(x=>x.shape||x.fb);
  if(shots.length)ctx+='\n=== LATTE ART, laatste gieten ===\n'+
    shots.slice(0,5).map(x=>'- '+timeAgo(x.ts)+(x.shape?', doel: '+x.shape:'')+
      (x.fb?', feedback: '+x.fb:'')).join('\n')+'\n';
  // waar hij al geweest is op de kaart, en wat er nog op zijn lijstje staat:
  // daarmee kan de coach een volgende zak voorstellen die hij nog niet kent
  if(typeof bpGehad==='function'&&featOn('beanpick')){
    const gehad=[...bpGehad()].map(id=>(BP_LAND[id]||{}).naam).filter(Boolean);
    if(gehad.length)ctx+='\n=== LANDEN DIE HIJ AL HAD ===\n'+gehad.join(', ')+'\n';
    const wens=state.wishlist||[];
    if(wens.length)ctx+='\n=== OP ZIJN LIJSTJE, NOG NIET GEKOCHT ===\n'+
      wens.map(w=>'- '+w.streek+', '+w.land+' ('+w.proces+', '+w.brand+')').join('\n')+'\n';
  }
  return ctx;
}
async function askCoach(){
  const q=document.getElementById('coach-q').value.trim();
  if(!q){toast('type a question first');return;}
  const a=document.getElementById('coach-a');
  a.innerHTML='<div class="recipe-card sketch soft"><span class="spin"></span>the coach is thinking…</div>';
  try{
    const ctx=myCoffeeContext();
    const sys=APP_RULES+"\n\nJe bent een ervaren, vriendelijke specialty-barista en koffiecoach. "+
      "Beantwoord de vraag kort en praktisch in het Nederlands, max 5 zinnen, concreet en bruikbaar. "+
      "Gaat het over espresso-maling of dial-in, houd je strikt aan deze regels:\n"+ESPRESSO_RULES+"\n"+
      "Gaat het over filter, dan gelden deze:\n"+FILTER_RULES+"\n"+
      (ctx?("Hieronder staat alles wat de app van deze gebruiker weet: hun bonen (in kast én op), "+
        "brew-geschiedenis, dial-in-pogingen, uitrusting, methodes, eigen recepten en latte art.\n"+
        "Noemt de vraag een boon, een methode of een moment ('gisteren', 'die zak van vorige week'), "+
        "zoek die dan op in de gegevens hieronder en antwoord met de ECHTE cijfers die erbij staan — "+
        "maalstand, dose, opbrengst, tijd, score. Dat is de kern van je nut.\n"+
        "Verder deze volgorde:\n"+
        "1) Kijk EERST naar de bonen die IN KAST staan — dat is wat ze nu echt kunnen zetten.\n"+
        "2) Kijk DAARNA naar de brew-geschiedenis en de dial-in-pogingen: wat deden ze, wat scoorde goed.\n"+
        "3) Noem pas als LAATSTE andere opties als kast en geschiedenis geen antwoord geven.\n"+
        "Een AFGETEKENDE maalstand is gemeten op hun eigen molen en gaat vóór elke vuistregel. "+
        "Ken je hun molen mét bereik, houd een voorgestelde stap dan in verhouding tot die schaal.\n"+
        "Verzin nooit gegevens die er niet staan; staat iets er niet, zeg dat dan.\n\n"+ctx+"\n"):"")+
      "\nVraag: "+q;
    const txt=await askAI([{role:"user",content:sys}],600,'brew');
    a.innerHTML='<div class="recipe-card sketch" style="background:var(--v60)">'+esc(txt).replace(/\n/g,'<br>')+'</div>';
  }catch(e){
    a.innerHTML='<div class="recipe-card sketch soft">couldn’t reach the coach — check your AI key in settings.</div>';
  }
}

function restoreImages(){
  state.methods.forEach(m=>{
    const n=(m.name||'').toLowerCase();
    let def=DEFAULT_METHODS.find(d=>d.id===m.id)||DEFAULT_METHODS.find(d=>n.includes(d.name)||d.name.includes(n));
    if(def&&def.img&&!m.customImg){m.img=def.img;}
  });
  save();toast('✓ drawings restored');go('home');
}

/* ---------------- weekly brewsletter (canvas-kaart) ---------------- */
async function brewsletter(){
  const week=state.brews.filter(b=>Date.now()-b.ts<7*864e5);
  if(!week.length){toast('no brews this week yet — go make one ☕');return;}
  const scored=week.filter(b=>+b.score>0);
  const avg=scored.length?(scored.reduce((a,b)=>a+(+b.score),0)/scored.length):0;
  const perM={};week.forEach(b=>perM[b.method]=(perM[b.method]||0)+1);
  const topM=methodById(Object.entries(perM).sort((a,b)=>b[1]-a[1])[0][0]);
  const best=scored.slice().sort((a,b)=>b.score-a.score)[0];
  const beansUsed=[...new Set(week.map(b=>b.beans).filter(Boolean))];
  let line='';
  if(aiReady()){try{line=(await askAI([{role:"user",content:
    `Schrijf één warme, korte zin (Nederlands, max 14 woorden) als afsluiter van iemands koffieweek: ${week.length} brews, favoriete methode ${topM?topM.name:'?'}, gemiddeld ${avg.toFixed(1)}/10.`}],80,'recap')).trim();}catch(e){}}
  try{await document.fonts.load('700 60px Caveat');await document.fonts.load('30px "Patrick Hand"');}catch(e){}
  const W=900,H=1100,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const paper='#efe9dd',ink='#3a302a',soft='#7a6c5e',accent='#4a3b30';
  x.fillStyle=paper;x.fillRect(0,0,W,H);
  x.strokeStyle=ink;x.lineWidth=5;x.lineCap='round';x.beginPath();
  const jig=(x0,y0,x1,y1)=>{const n=14;for(let i=0;i<=n;i++){const t=i/n;const px=x0+(x1-x0)*t+(Math.random()-.5)*5,py=y0+(y1-y0)*t+(Math.random()-.5)*5;i?x.lineTo(px,py):x.moveTo(px,py);}};
  jig(46,46,W-46,46);jig(W-46,46,W-46,H-46);jig(W-46,H-46,46,H-46);jig(46,H-46,46,46);x.stroke();
  x.textAlign='center';x.fillStyle=ink;x.font='700 84px Caveat';x.fillText('my week in coffee',W/2,170);
  x.fillStyle=soft;x.font='34px "Patrick Hand"';
  x.fillText(new Date(Date.now()-6*864e5).toLocaleDateString('en-GB',{day:'numeric',month:'short'})+' — '+new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'}),W/2,224);
  const stats=[[String(week.length),'brews'],[avg?avg.toFixed(1)+'/10':'—','avg score'],[topM?topM.name:'—','top method'],[String(beansUsed.length),'beans']];
  stats.forEach((st,i)=>{
    const cx0=i%2?W*0.72:W*0.28,cy0=380+Math.floor(i/2)*190;
    x.fillStyle=ink;x.font='700 96px Caveat';x.fillText(st[0],cx0,cy0);
    x.fillStyle=soft;x.font='30px "Patrick Hand"';x.fillText(st[1],cx0,cy0+44);
  });
  if(best){x.fillStyle=soft;x.font='30px "Patrick Hand"';x.fillText('best cup',W/2,830);
    x.fillStyle=accent;x.font='700 56px Caveat';x.fillText(((best.title&&best.title.trim())||methodById(best.method).name)+' · '+(+best.score).toFixed(1),W/2,886,W-160);}
  if(line){x.fillStyle=ink;x.font='36px "Patrick Hand"';x.fillText(line,W/2,H-140,W-160);}
  x.fillStyle=accent;x.font='700 40px Caveat';x.fillText('lets brew specialty ☕',W/2,H-70);
  const blob=await new Promise(res=>c.toBlob(res,'image/png'));
  const file=new File([blob],'brewsletter.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:'my week in coffee'});return;}catch(e){if(e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='brewsletter.png';a.click();
  URL.revokeObjectURL(url);toast('brewsletter saved');
}
/* ---------------- taste memory: wat je scores verraden ---------------- */
async function tasteMemory(){
  const el=document.getElementById('tm-body');if(!el)return;
  const rows=state.brews.filter(b=>+b.score>0);
  if(rows.length<3){el.textContent='score a few more brews first — your palate needs at least 3 data points.';return;}
  const group=key=>{const g={};rows.forEach(b=>{const bean=b.beanId?beanById(b.beanId):null;const k=key(b,bean);if(!k)return;(g[k]=g[k]||[]).push(+b.score);});
    return Object.entries(g).filter(([,v])=>v.length>=2).map(([k,v])=>[k,v.reduce((a,c)=>a+c,0)/v.length,v.length]).sort((a,b)=>b[1]-a[1]);};
  const byM=group(b=>methodById(b.method)?.name);
  const byP=group((b,bean)=>bean&&bean.process?bean.process.toLowerCase():null);
  const byO=group((b,bean)=>bean&&bean.origin?bean.origin.split(',')[0].trim():null);
  let html='';
  if(byM.length)html+='methods: '+byM.map(([k,a,n])=>esc(k)+' '+a.toFixed(1)).join(' · ')+'<br>';
  if(byP.length)html+='process: '+byP.map(([k,a])=>esc(k)+' '+a.toFixed(1)).join(' · ')+'<br>';
  if(byO.length)html+='origins: '+byO.map(([k,a])=>esc(k)+' '+a.toFixed(1)).join(' · ')+'<br>';
  el.innerHTML=html||'not enough linked bean data yet.';
  if(aiReady()&&html){
    try{const txt=await askAI([{role:"user",content:
      'Dit zijn iemands gemiddelde koffiescores. Trek er in het Nederlands één vriendelijk, concreet inzicht uit (max 2 zinnen) en één aanrader:\n'+el.innerText}],250,'recap');
      el.innerHTML=html+'<br>✦ '+esc((txt||'').trim()).replace(/\n/g,'<br>');
    }catch(e){}
  }
}
/* ---------------- voice logging ---------------- */
function voiceParse(){
  const t=(document.getElementById('voice-text').value||'').toLowerCase();
  const getal=m=>m?parseFloat(m[1].replace(',','.')):null;
  // eerst op woorden, zodat de volgorde niet uitmaakt
  let dose=getal(t.match(/(\d+[.,]?\d*)\s*(?:gram\s*)?(?:erin|in)\b/));
  let yld =getal(t.match(/(\d+[.,]?\d*)\s*(?:gram\s*)?(?:eruit|uit)\b/));
  let sec =getal(t.match(/(\d+[.,]?\d*)\s*(?:seconden|seconde|sec|s)\b/));
  // wat niet benoemd is, in de gewone volgorde uit de overgebleven getallen halen
  const rest=(t.match(/\d+[.,]?\d*/g)||[]).map(v=>parseFloat(v.replace(',','.')))
    .filter(v=>v!==dose&&v!==yld&&v!==sec);
  if(dose==null)dose=rest.shift()??null;
  if(yld==null) yld =rest.shift()??null;
  if(sec==null) sec =rest.shift()??null;
  if(dose==null&&yld==null&&sec==null){toast('zeg het zo: 18 in, 36 uit, 27 seconden');return;}
  if(dose)setVal('di-dose',dose);
  if(yld)setVal('di-yield',yld);
  if(sec){const inp=document.getElementById('di-time');if(inp){inp.value=String(Math.round(sec));normalizeTime(inp);}}
  diAdvice();toast('✓ ingevuld — kijk de getallen even na');
}
let luisteraar=null;
function micStand(aan){
  const b=document.getElementById('voice-mic');
  if(b)b.setAttribute('aria-pressed',aan?'true':'false');
}
function voiceListen(){
  // tweede keer indrukken zet hem weer uit
  if(luisteraar){try{luisteraar.stop();}catch(e){}luisteraar=null;micStand(false);return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast('geen spraakherkenning hier — gebruik de microfoon op je toetsenbord');
    document.getElementById('voice-text').focus();return;}
  try{
    const r=new SR();r.lang='nl-NL';r.interimResults=false;
    r.onresult=e=>{document.getElementById('voice-text').value=e.results[0][0].transcript;voiceParse();};
    r.onerror=()=>toast('niet verstaan — probeer het nog eens');
    // hoe het ook eindigt, de knop gaat altijd terug naar zijn rustkleur
    r.onend=()=>{luisteraar=null;micStand(false);};
    r.start();luisteraar=r;micStand(true);toast('ik luister…');
  }catch(e){luisteraar=null;micStand(false);toast('microfoon niet beschikbaar');}
}
/* ---------------- weer-bewuste suggestie ---------------- */
async function refreshWeather(){
  const el=document.getElementById('weather-line');if(!el)return;
  if(!featOn('weather')){el.style.display='none';return;}
  const cached=JSON.parse(localStorage.getItem('scc_weather')||'null');
  if(cached&&Date.now()-cached.ts<36e5){weatherLine(cached);return;}
  if(!navigator.geolocation){el.style.display='none';return;}
  navigator.geolocation.getCurrentPosition(async pos=>{
    try{
      const{latitude:la,longitude:lo}=pos.coords;
      const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&current=temperature_2m,precipitation`);
      const d=await res.json();
      const w={ts:Date.now(),t:d.current.temperature_2m,rain:d.current.precipitation>0};
      localStorage.setItem('scc_weather',JSON.stringify(w));weatherLine(w);
    }catch(e){}
  },()=>{el.style.display='none';},{timeout:6000,maximumAge:36e5});
}
function weatherLine(w){
  const el=document.getElementById('weather-line');if(!el)return;
  let tip='';
  if(w.t>=25)tip='iced coffee weather — cold brew or flash-chilled V60?';
  else if(w.rain)tip='rain outside — a slow, cozy moka kind of day.';
  else if(w.t<=8)tip='crisp out there — something warm and syrupy?';
  else tip='fine brewing weather.';
  el.textContent=Math.round(w.t)+'° — '+tip;
  el.style.display='block';
}
/* ---------------- pairing: smart scale via Web Bluetooth ---------------- */
let scaleDevice=null;
function renderPairing(){
  const card=document.getElementById('pair-card');if(!card)return;
  card.style.display=featOn('pairing')?'block':'none';
  const st=document.getElementById('pair-status'),btn=document.getElementById('pair-btn');
  if(!st)return;
  if(!navigator.bluetooth){
    st.textContent='this browser (iPhone Safari included) doesn\'t allow Web Bluetooth — pairing works on Android/Chrome. your gear profiles below still power every AI tip.';
    if(btn)btn.style.opacity=.55;
  }else{
    st.textContent=scaleDevice?('paired: '+(scaleDevice.name||'scale')+' — live weight shows in the shot timer.'):'pair an Acaia/Felicita/generic BLE scale for live weight in the shot timer.';
  }
}
async function pairScale(){
  if(!featOn('pairing'))return;
  if(!navigator.bluetooth){toast('Web Bluetooth isn\'t available on this device');return;}
  try{
    const dev=await navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:[0x181d,'0000ffe0-0000-1000-8000-00805f9b34fb','0000fff0-0000-1000-8000-00805f9b34fb']});
    scaleDevice=dev;renderPairing();
    const server=await dev.gatt.connect();
    let ch=null;
    for(const sid of [0x181d,'0000ffe0-0000-1000-8000-00805f9b34fb','0000fff0-0000-1000-8000-00805f9b34fb']){
      try{const sv=await server.getPrimaryService(sid);const chars=await sv.getCharacteristics();
        ch=chars.find(c=>c.properties.notify);if(ch)break;}catch(e){}
    }
    if(!ch){toast('connected, but no readable weight channel found');return;}
    await ch.startNotifications();
    ch.addEventListener('characteristicvaluechanged',e=>{
      const dv=e.target.value;let g=null;
      try{
        if(dv.byteLength>=3&&dv.getUint8(0)!==undefined){
          const ascii=new TextDecoder().decode(dv);const m=ascii.match(/-?\d+\.?\d*/);
          if(m)g=parseFloat(m[0]);
          if(g===null||isNaN(g))g=dv.getInt16(1,true)/10;
        }
      }catch(e2){}
      if(g!=null&&!isNaN(g)){
        const el=document.getElementById('e61-live');
        if(el)el.textContent='⚖ live: '+g.toFixed(1)+' g';
        const y=document.getElementById('di-yield');
        if(y&&e61Run)y.value=g.toFixed(1);
      }
    });
    toast('⚖ scale connected');
  }catch(e){if(e.name!=='NotFoundError')toast('pairing failed — try again');}
}

/* ---------------- latte art ---------------- */
/* Melk: volle melk schuimt het best door de verhouding vet/eiwit (±3,5% / 3,4%);
   eiwitten vangen de luchtbellen en houden het schuim overeind. Luchtfase 2-5 s,
   daarna rollen; stoppen tussen 55 en 65 °C. Gieten in drie hoogtes.
   De patronen staan op moeilijkheid, van hartje tot feniks. */

/* Beweeglijnen: elke beweging krijgt een eigen nummer en een pijl.
   Stippellijn = gieten of wiebelen, doorgetrokken lijn = optillen en doortrekken. */
function laRing(x,y,r){
  const n=(a,b)=>(x+r*a).toFixed(1)+' '+(y+r*b).toFixed(1);
  return 'M'+n(0.9,-0.5)+' C'+n(1.3,0.4)+' '+n(0.5,1.25)+' '+n(-0.35,1.05)+
         ' C'+n(-1.25,0.6)+' '+n(-1.3,-0.5)+' '+n(-0.3,-1.1)+
         ' C'+n(0.65,-1.3)+' '+n(1.2,-0.85)+' '+n(1.05,-0.15);
}
function laMv(m){
  let h='<path class="la-mo-bg" d="'+m.d+'"/><path class="'+(m.solid?'la-mo2':'la-mo')+'" d="'+m.d+'"/>';
  if(m.h)h+='<path class="la-mo-bg" d="'+m.h+'"/><path class="la-mo-h" d="'+m.h+'"/>';
  if(m.n){
    const r=laRing(m.x,m.y,6.4);
    h+='<path class="la-num-bg" d="'+r+'"/><path class="la-num" d="'+r+'"/>'+
       '<text class="la-numt" x="'+m.x+'" y="'+(m.y+3.6)+'">'+m.n+'</text>';
  }
  return h;
}
function laMoves(list){return (list||[]).map(laMv).join('');}

const LA_CUP='<path class="la-cup" d="M50 6 C75 6 94 25 94 50 C94 75 75 94 50 94 C25 94 6 75 6 50 C6 25 25 6 50 6"/>';

/* rozet: zeven bladparen, groot bij je toe en kleiner naar de punt */
const LA_LEAF=[
  'M48 86 C32 85 18 77 11 65 C24 72 38 76 48 77',
  'M48 75 C33 74 20 67 14 56 C26 62 39 66 48 67',
  'M48 65 C34 64 22 58 17 48 C28 53 40 57 48 58',
  'M48 56 C36 55 25 50 20 41 C30 46 41 49 48 50',
  'M48 47 C37 46 28 42 24 35 C33 39 42 42 48 43',
  'M48 39 C39 38 31 35 28 29 C35 32 43 35 48 36',
  'M48 32 C41 31 35 29 32 24 C38 26 44 29 48 30',
];
function laRosetta(){
  return LA_LEAF.map(d=>'<path class="la-milk" d="'+d+'"/>').join('')+
    LA_LEAF.map(d=>'<path class="la-milk" d="'+d+'" transform="translate(100,0) scale(-1,1)"/>').join('')+
    '<path class="la-milk" d="M46 16 C47 44 47 70 45 92 C49 94 52 94 55 92 C57 70 57 44 55 16"/>'+
    '<path class="la-milk" d="M50 8 C58 8 63 13 62 19 C61 25 55 30 50 34 C45 30 39 25 38 19 C37 13 42 8 50 8"/>';
}

const LA_PATTERNS=[
  {lvl:0,n:'de plas',en:'monk’s head',
   d:'Nog geen vorm — alleen leren wanneer je zakt. Giet hoog tot de kop halfvol is, zak dan tot de tuit het oppervlak bijna raakt en laat één ronde witte vlek opkomen.',
   tip:'Komt er geen wit boven? Je zit te hoog of je giet te snel.',
   svg:'<path class="la-milk" d="M50 30 C67 30 78 41 78 54 C78 67 65 76 50 76 C35 76 22 67 22 54 C22 41 33 30 50 30"/>'},

  {lvl:0,n:'hartje',en:'heart',
   d:'Dezelfde plas, maar afgemaakt. Als het wit staat, til je de kan iets op en trek je in één beweging door het midden naar je toe — dwars door de vlek tot over de rand.',
   tip:'De punt ontstaat waar je de streep beëindigt. Stoppen vóór het doortrekken maakt er een rondje van.',
   svg:'<path class="la-milk" d="M50 23 C69 23 81 35 80 49 C79 63 66 74 50 91 C34 74 21 63 20 49 C19 35 31 23 50 23"/>'+
       '<path class="la-line" d="M28 41 C37 35 63 35 72 41 M31 52 C39 47 61 47 69 52 M36 62 C42 58 58 58 64 62"/>'},

  {lvl:1,n:'tulp',en:'tulip',
   d:'Drie hartjes op een rij. Giet een vlek, stop, schuif iets naar achter en duw een tweede vlek ín de eerste, dan een derde. Trek er aan het eind in één keer doorheen.',
   tip:'Elke stop moet écht een stop zijn. Blijf je doorgieten, dan lopen de lagen in elkaar.',
   svg:'<path class="la-milk" d="M20 70 C22 62 34 56 50 56 C66 56 78 62 80 70 C76 80 62 90 50 96 C38 90 24 80 20 70"/>'+
       '<path class="la-milk" d="M26 50 C28 44 37 39 50 39 C63 39 72 44 74 50 C70 58 60 65 50 69 C40 65 30 58 26 50"/>'+
       '<path class="la-milk" d="M33 31 C35 25 42 21 50 21 C58 21 65 25 67 31 C64 38 56 43 50 47 C44 43 36 38 33 31"/>'},

  {lvl:1,n:'rozet',en:'rosetta',
   d:'De varen. Zak dicht op het oppervlak en wiebel met je pols heen en weer terwijl je langzaam naar je toe komt. De blaadjes worden vanzelf kleiner. Til op en trek door.',
   tip:'Wiebel klein en snel, en beweeg tegelijk mee — de meeste mensen wiebelen te groot en te traag.',
   svg:laRosetta()},

  {lvl:2,n:'gevleugelde tulp',en:'wing tulip',
   d:'Een tulp waarvan elke laag ook wiebelt. Duw een laag, wiebel hem breed uit, stop, en zet de volgende erin. Zo krijgt elke laag vleugels.',
   tip:'Werkt alleen met echt strakke microfoam — losse melk zakt tussen de lagen weg.',
   svg:'<path class="la-milk" d="M22 72 C24 64 36 58 50 58 C64 58 76 64 78 72 C74 82 62 92 50 97 C38 92 26 82 22 72"/>'+
       '<path class="la-milk" d="M24 68 C14 66 7 60 3 52 C12 58 20 62 26 64 M76 68 C86 66 93 60 97 52 C88 58 80 62 74 64"/>'+
       '<path class="la-milk" d="M29 50 C31 44 39 39 50 39 C61 39 69 44 71 50 C67 58 58 65 50 69 C42 65 33 58 29 50"/>'+
       '<path class="la-milk" d="M30 46 C21 44 15 39 11 32 C19 37 26 41 32 43 M70 46 C79 44 85 39 89 32 C81 37 74 41 68 43"/>'+
       '<path class="la-milk" d="M36 28 C38 22 43 18 50 18 C57 18 62 22 64 28 C61 35 55 40 50 44 C45 40 39 35 36 28"/>'},

  {lvl:2,n:'omgekeerde rozet',en:'reverse rosetta',
   d:'Dezelfde varen, maar je giet van je af in plaats van naar je toe. Je pols moet het spiegelbeeld doen en je ziet minder van wat je maakt.',
   tip:'Begin dicht bij je eigen rand en wiebel weg. De punt komt nu aan jouw kant te liggen.',
   svg:'<g transform="rotate(180 50 50)">'+laRosetta()+'</g>'},

  {lvl:3,n:'zwaan',en:'swan',
   d:'Een rozet als lichaam, dan een dunne hoge sliert als hals, en een klein duwtje voor de kop. De hals giet je hoog en heel langzaam.',
   tip:'De hals is een haarlijn: bijna dichtknijpen en zonder haperen doorgieten.',
   svg:'<path class="la-milk" d="M42 88 C28 86 16 78 10 67 C22 74 34 78 42 79"/>'+
       '<path class="la-milk" d="M43 78 C30 76 19 69 14 59 C25 65 36 69 43 70"/>'+
       '<path class="la-milk" d="M44 68 C32 66 22 60 17 51 C27 56 37 60 44 61"/>'+
       '<path class="la-milk" d="M45 59 C34 57 25 52 21 44 C30 49 39 52 45 53"/>'+
       '<path class="la-milk" d="M46 50 C37 48 30 44 26 37 C34 41 41 44 46 45"/>'+
       '<path class="la-milk" d="M40 92 C44 70 50 50 58 34 C62 36 65 39 66 43 C58 58 50 74 47 93"/>'+
       '<path class="la-milk" d="M64 40 C71 29 77 20 76 14 C75 9 69 9 66 14 C62 22 59 30 57 37 C59 39 62 40 64 40"/>'+
       '<path class="la-milk" d="M74 8 C80 7 84 12 82 17 C79 22 72 21 70 15 C69 10 71 8 74 8"/>'+
       '<path class="la-milk" d="M83 13 C88 12 92 14 94 17 C90 18 86 17 83 16"/>'},

  {lvl:3,n:'feniks',en:'phoenix',
   d:'De zwaan met gespreide vleugels en een staart. Twee rozetten links en rechts van het lichaam, dan pas de hals. Meerdere kanten op wiebelen in één kop.',
   tip:'De lastigste vrije giet die er is. Reken op honderden koppen — en zet je espresso extra strak, want je hebt alle crema nodig.',
   svg:'<path class="la-milk" d="M46 92 C32 90 20 83 14 73 C26 79 38 83 46 84"/>'+
       '<path class="la-milk" d="M47 82 C34 80 23 73 18 64 C29 70 40 74 47 75"/>'+
       '<path class="la-milk" d="M48 72 C36 70 26 64 22 56 C32 61 42 65 48 66"/>'+
       '<path class="la-milk" d="M54 92 C68 90 80 83 86 73 C74 79 62 83 54 84"/>'+
       '<path class="la-milk" d="M53 82 C66 80 77 73 82 64 C71 70 60 74 53 75"/>'+
       '<path class="la-milk" d="M52 72 C64 70 74 64 78 56 C68 61 58 65 52 66"/>'+
       '<path class="la-milk" d="M48 62 C38 60 30 55 26 48 C35 53 43 56 48 57"/>'+
       '<path class="la-milk" d="M52 62 C62 60 70 55 74 48 C65 53 57 56 52 57"/>'+
       '<path class="la-milk" d="M47 95 C48 72 50 54 54 40 C58 42 61 45 62 49 C56 64 51 79 51 96"/>'+
       '<path class="la-milk" d="M56 42 C50 30 42 20 34 15 C29 12 23 14 24 20 C25 25 31 27 36 30 C44 35 51 42 55 48"/>'+
       '<path class="la-milk" d="M26 12 C31 11 35 14 34 19 C32 24 25 24 22 19 C21 14 23 12 26 12"/>'},
];

const LA_MOVES={
  'de plas':[
    {n:1,x:22,y:16,d:'M16 18 C27 30 38 41 46 50',
     h:'M40 40 C44 44 46 47 48 52 C44 51 41 51 37 51'},
  ],
  'hartje':[
    {n:1,x:16,y:14,d:'M16 18 C27 30 38 41 46 50',
     h:'M40 40 C44 44 46 47 48 52 C44 51 41 51 37 51'},
    {n:2,x:72,y:34,solid:true,d:'M50 32 C51 56 49 74 50 92',
     h:'M44 86 C47 90 49 92 50 95 C51 92 53 90 56 86'},
  ],
  'tulp':[
    {n:1,x:16,y:88,d:'M30 84 C30 80 30 78 30 74 M30 62 C30 58 30 56 30 52 M30 42 C30 38 30 36 30 32',
     h:'M26 78 C28 76 29 75 30 72 C31 75 32 76 34 78 M26 56 C28 54 29 53 30 50 C31 53 32 54 34 56 M26 36 C28 34 29 33 30 30 C31 33 32 34 34 36'},
    {n:2,x:74,y:90,solid:true,d:'M50 92 C51 62 49 38 50 14',
     h:'M44 22 C47 18 49 15 50 11 C51 15 53 18 56 22'},
  ],
  'rozet':[
    {n:1,x:17,y:22,d:'M50 34 C40 38 60 43 50 48 C38 52 62 58 50 63 C36 67 64 74 50 79 C38 83 62 88 50 92',
     h:'M44 85 C47 89 49 91 50 94 C51 91 53 89 56 85'},
    {n:2,x:74,y:90,solid:true,d:'M50 94 C51 64 49 38 50 12',
     h:'M44 20 C47 16 49 13 50 9 C51 13 53 16 56 20'},
  ],
  'gevleugelde tulp':[
    {n:1,x:16,y:90,d:'M50 86 C26 82 74 76 50 72 M50 64 C29 60 71 54 50 50 M50 42 C33 38 67 33 50 29',
     h:'M54 68 C52 70 51 71 49 73 C50 70 50 68 49 66 M54 46 C52 48 51 49 49 51 C50 48 50 46 49 44 M54 25 C52 27 51 28 49 30 C50 27 50 25 49 23'},
    {n:2,x:76,y:92,solid:true,d:'M50 93 C51 64 49 38 50 12',
     h:'M44 20 C47 16 49 13 50 9 C51 13 53 16 56 20'},
  ],
  'omgekeerde rozet':[
    {n:1,x:24,y:70,d:'M50 66 C40 62 60 57 50 52 C38 48 62 42 50 37 C36 33 64 26 50 21 C38 17 62 12 50 8',
     h:'M44 15 C47 11 49 9 50 6 C51 9 53 11 56 15'},
    {n:2,x:74,y:12,solid:true,d:'M50 6 C49 36 51 62 50 88',
     h:'M44 81 C47 85 49 88 50 91 C51 88 53 85 56 81'},
  ],
  'zwaan':[
    {n:1,x:20,y:92,d:'M42 86 C24 82 52 76 38 72 C24 68 50 61 38 57 C28 53 46 48 40 44',
     h:'M45 49 C43 47 41 46 39 42 C39 46 38 48 36 50'},
    {n:2,x:44,y:54,d:'M56 48 C63 35 71 23 76 14',
     h:'M70 20 C73 16 75 14 77 11 C77 15 78 18 80 21'},
  ],
  'feniks':[
    {n:1,x:22,y:94,d:'M46 90 C28 86 54 79 42 75 C30 71 52 65 44 61',
     h:'M49 66 C47 64 45 63 43 59 C43 63 42 65 40 67'},
    {n:2,x:78,y:94,d:'M54 90 C72 86 46 79 58 75 C70 71 48 65 56 61',
     h:'M51 66 C53 64 55 63 57 59 C57 63 58 65 60 67'},
    {n:3,x:62,y:52,d:'M52 48 C45 35 36 24 27 16',
     h:'M33 21 C30 19 27 17 25 14 C25 18 24 21 22 23'},
  ],
};

const LA_LEVELS=[
  {n:'beginner',d:'eerst de hoogte leren voelen'},
  {n:'gevorderd',d:'stoppen, stapelen en wiebelen'},
  {n:'ervaren',d:'meerdere bewegingen in één kop'},
  {n:'advanced',d:'jaren, geen weken'},
];
const LA_FIX=[
  {p:'grote bellen in het schuim',c:'te lang lucht getrokken, of de tuit zat te diep tijdens het rollen',f:'kort lucht (2–5 s), daarna de pijp net onder het oppervlak houden zodat de melk blijft draaien'},
  {p:'de melk zakt weg, geen wit',c:'te hoog gegoten, of te snel',f:'zak tot de tuit het oppervlak bijna raakt en giet rustiger'},
  {p:'wit komt te vroeg boven',c:'te laag begonnen — het schuim ligt op de crema in plaats van erdoorheen',f:'begin hoog tot de kop halfvol is, zak dan pas'},
  {p:'het hartje wordt een rondje',c:'gestopt met wiebelen vóór het doortrekken',f:'trek zonder pauze door: de beweging naar voren volgt direct op de wiebel'},
  {p:'schuim en melk scheiden in de kan',c:'te lang gewacht tussen opschuimen en gieten',f:'giet binnen ±20 seconden; anders opnieuw swirlen tot het weer glanst'},
  {p:'niets te zien op de espresso',c:'te weinig of te lichte crema',f:'verse bonen en een strakke shot — zonder crema is er geen doek om op te tekenen'},
];

function renderLatte(){
  const el=document.getElementById('latte-content');if(!el)return;
  let h=`
  <div class="la-intro">Latte art is voor tachtig procent melk en voor twintig procent hand.
    Krijg je de microfoam goed, dan tekent hij bijna vanzelf. Zit er lucht in, dan helpt geen enkele beweging.</div>

  <div class="sect"><span class="hand">The milk</span><span class="sd">waar het mee staat of valt</span></div>
  <div class="lesson sketch soft">
    <p>Volle melk schuimt het best: ongeveer 3,5% vet en 3,4% eiwit. De eiwitten vangen de
      luchtbellen en houden ze overeind, het vet maakt het glanzend en romig. Halfvol werkt
      ook, maar zakt sneller in.</p>
    <p>Plantaardig is lastiger — minder eiwit, minder vet, en per merk anders. Neem een
      barista-versie: daar zitten extra eiwitten en plantaardige olie in die precies dat
      samenspel nabootsen. Haver schuimt traag en heeft langer nodig; amandel is het
      moeilijkst.</p>
    <p>Start koud, met een schone kan. Schenk zoveel in dat de tuit-onderkant net onder staat
      — te vol en je kunt niet meer draaien.</p>
  </div>

  <div class="sect"><span class="hand">Steaming</span><span class="sd">lucht erin, dan glad draaien</span></div>
  ${laSteamBenchHTML()}

  <div class="sect"><span class="hand">Pouring</span><span class="sd">drie hoogtes, één beweging</span></div>
  ${laPourBenchHTML()}

  <div class="sect"><span class="hand">The shapes</span><span class="sd">van makkelijk naar levenswerk</span></div>
  <div class="la-key">
    <span><svg viewBox="0 0 34 12"><path class="la-mo" d="M2 6 C10 4 24 8 32 6"/></svg> gieten of wiebelen</span>
    <span><svg viewBox="0 0 34 12"><path class="la-mo2" d="M2 6 C10 4 24 8 32 6"/></svg> optillen en doortrekken</span>
    <span><svg viewBox="0 0 16 16"><path class="la-num" d="M14.2 3.3 C15.6 7.4 12.6 12 8 11.7 C2.9 11.1 1.4 6.2 4.1 2.5 C7.2 -0.5 12 0.6 13.7 4.6"/></svg> volgorde · de pijl wijst waarheen</span>
  </div>`;

  LA_LEVELS.forEach((lv,i)=>{
    h+=`<div class="la-lvl"><span class="hand">${lv.n}</span><span class="lv-d">${lv.d}</span>
      <span class="lv-dots">${'●'.repeat(i+1)}${'○'.repeat(3-i)}</span></div>`;
    LA_PATTERNS.filter(p=>p.lvl===i).forEach(p=>{
      h+=`<div class="la-pat sketch">
        <div class="lp-draw"><svg viewBox="0 0 100 100" role="img" aria-label="${esc(p.n)}">${LA_CUP}${p.svg}${laMoves(LA_MOVES[p.n])}</svg></div>
        <div class="lp-body">
          <div class="lp-t hand">${esc(p.n)} <span class="lp-en">${esc(p.en)}</span></div>
          <div class="lp-d">${esc(p.d)}</div>
          <div class="lp-tip">${esc(p.tip)}</div>
        </div></div>`;
    });
  });

  h+=`<div class="sect"><span class="hand">When it goes wrong</span><span class="sd">wat je ziet, en wat je eraan doet</span></div>`;
  LA_FIX.forEach(f=>{
    h+=`<div class="la-fix sketch soft">
      <div class="lf-p hand">${esc(f.p)}</div>
      <div class="lf-c">komt door: ${esc(f.c)}</div>
      <div class="lf-f">→ ${esc(f.f)}</div></div>`;
  });

  if(featOn('latteart')){
    h+=`<button class="lesson-link sketch" onclick="learnToGallery()">
      <svg viewBox="0 0 24 24" class="acic"><path d="M4.4 5.8 Q12 5.2 19.8 5.6 M19.5 5.1 Q20.1 12 19.6 18.9 M19.9 18.5 Q12 19.1 4.2 18.6 M4.6 19 Q4 12 4.4 5.2"/><path d="M7.7 14.2 Q10 10.4 12.1 12.6 Q14.5 8.9 16.8 13.2" opacity="0.8"/><path d="M10.3 8.7 Q10.7 10.4 9 10.5 Q7.5 10.4 7.7 8.9 Q8 7.5 9.6 7.7 Q10.3 7.9 10.6 8.4" opacity="0.6"/></svg>
      <span>leg je giet vast bij pouring shapes</span><span class="ll-arr">›</span></button>`;
  }
  el.innerHTML=h;
  laInit();
}

/* kan met stoompijp: de luchtfase en de draaikolk */
function laSteamBenchHTML(){
  return `<div class="la-steam sketch">
    ${laPitcherSVG()}
    <div class="la-scrub">
      <span class="la-clock">0 s</span>
      <input type="range" class="la-sc" min="0" max="40" step="1" value="0"
             aria-label="Seconden opschuimen" oninput="laSteam(this)">
    </div>
    <div class="la-phases">${laPhasesHTML()}</div>
  </div>`;
}
function laPourBenchHTML(){
  return `<div class="la-pour sketch">
    ${laPourSVG()}
    <div class="la-heights" role="group" aria-label="Giethoogte">
      ${LA_HEIGHTS.map((h,i)=>'<button type="button" aria-pressed="'+(i===0?'true':'false')+
        '" onclick="laSetHeight(this,'+i+')">'+esc(h.lab)+'</button>').join('')}
    </div>
    <div class="la-hexpl"></div>
  </div>`;
}
function laPitcherSVG(){
  return `<div class="la-draw"><svg viewBox="0 0 260 175" role="img" aria-label="Melkkan met stoompijp in de melk">
    <path d="M83 42 C107 31 163 31 181 37 C194 33 208 36 217 41"/>
    <path d="M217 41 C207 45 195 46 184 44 C163 52 107 52 83 42" opacity="0.8"/>
    <path d="M87 38 C110 30 158 30 178 34" opacity="0.5"/>
    <path d="M186 46 C189 57 190 67 190 77" opacity="0.5"/>
    <path d="M195 45 C197 56 198 65 198 73" opacity="0.35"/>
    <path d="M83 44 C78 74 75 110 77 138"/>
    <path d="M187 44 C192 74 195 110 193 138"/>
    <path d="M77 138 C82 152 105 159 135 159 C165 159 188 152 193 138"/>
    <path d="M88 148 C106 155 164 155 182 148" opacity="0.45"/>
    <path d="M83 53 C73 52 64 52 58 54"/>
    <path d="M58 54 C50 58 45 65 43 73"/>
    <path d="M43 73 C42 82 45 90 51 96"/>
    <path d="M51 96 C58 102 66 105 74 107"/>
    <path d="M74 107 C78 105 80 101 80 96"/>
    <path d="M66 60 C57 65 53 73 55 82 C57 90 65 97 74 100" opacity="0.5"/>
    <g class="la-wand"><path d="M215 2 C200 22 176 48 152 74"/>
      <path d="M164 60 C170 66 171 72 166 77"/></g>
    <g class="la-swirl la-foam"></g>
    <g class="la-swirl la-vortex" style="display:none">
      <path d="M96 90 C118 98 152 98 174 88" opacity="0.5"/>
      <path d="M108 80 C122 74 148 74 162 79" opacity="0.35"/>
    </g>
    <path class="la-jet la-hiss" d="M152 84 C150 91 154 96 152 103 M166 86 C164 92 168 97 166 104"/>
  </svg></div>`;
}
/* De vier fasen van opschuimen. De schuifbalk loopt van 0 tot 40 seconden en
   zet de tekening in de stand die bij dat moment hoort -- lucht erin zie je de
   schuimlaag groeien, daarna alleen nog draaien.                            */
const LA_PHASES=[
  {t:0, n:'lucht', d:'Tuit n\u00e9t onder het oppervlak. Je hoort een rustige «tsss». Elke tel is ongeveer een centimeter schuim — voor een flat white heb je er weinig nodig.'},
  {t:5, n:'rollen', d:'Zak een centimeter dieper en zet de kan schuin. De draaikolk slaat de grote bellen kapot tot microfoam. Geen geluid meer, alleen draaiing.'},
  {t:28,n:'stop', d:'De kan is te heet om vast te houden: dat is je thermometer, ergens tussen 55 en 65 \u00b0C. Warmer en de melk verliest zijn zoetheid.'},
  {t:34,n:'tik & swirl', d:'Tik de kan op tafel, draai tot de melk glanst als natte verf. Vanaf nu heb je ongeveer twintig seconden voordat schuim en melk scheiden.'},
];
function laPhasesHTML(){
  return LA_PHASES.map((p,i)=>{
    const eind=LA_PHASES[i+1];
    const label=eind?(p.t+'\u2013'+eind.t+' s'):(p.t+' s +');
    return '<div class="la-phase" data-on="0"><div class="pt">'+label+'</div>'+
      '<div><div class="pn">'+esc(p.n)+'</div><div class="pd">'+esc(p.d)+'</div></div></div>';
  }).join('');
}
/* De schuifbalk uitlezen en alles wat meebeweegt op die stand zetten. Alles
   binnen de eigen kaart opzoeken: dezelfde tekening staat ook op de
   gieterij-pagina, en die twee mogen elkaar niet besturen.                  */
function laSteam(sc){
  const box=sc&&sc.closest?sc.closest('.la-steam'):null;if(!box)return;
  const t=+sc.value;
  const q=c=>box.querySelector('.'+c);
  const clk=q('la-clock');if(clk)clk.textContent=t+' s';
  let cur=0;LA_PHASES.forEach((p,i)=>{if(t>=p.t)cur=i;});
  box.querySelectorAll('.la-phase').forEach((el,i)=>el.dataset.on=(i===cur?'1':'0'));
  // de schuimlaag groeit alleen tijdens de luchtfase
  const lucht=Math.min(t,5)/5, y=73-lucht*13;
  const foam=q('la-foam');
  if(foam)foam.innerHTML='<path d="M88 '+y+' C114 '+(y-10)+' 156 '+(y-10)+' 182 '+(y+1)+
    ' C156 '+(y+12)+' 112 '+(y+12)+' 86 '+(y+1)+'"/>';
  const hiss=q('la-hiss');
  if(hiss)hiss.style.display=(t>0&&t<5)?'':'none';
  const vort=q('la-vortex');
  if(vort)vort.style.display=(t>=5&&t<28)?'':'none';
  // de pijp zakt na de luchtfase dieper, en gaat er aan het eind uit
  const wand=q('la-wand');
  if(wand){
    wand.style.transition='transform .35s ease';
    wand.style.transform=(t>=5&&t<28)?'translateY(8px)':(t>=28?'translate(34px,-34px)':'');
  }
}
/* kop met de drie giethoogtes */
function laPourSVG(){
  return `<div class="la-draw"><svg viewBox="0 0 200 150" role="img" aria-label="De kan boven de kop, op de gekozen giethoogte">
    <path d="M30 88 C54 78 102 80 108 90"/>
    <path d="M108 89 C86 97 54 97 30 89" opacity="0.7"/>
    <path d="M31 90 C34 114 46 130 68 133 C92 135 105 124 108 104 C109 97 109 93 108 89"/>
    <path d="M108 98 C126 94 135 105 129 116 C123 123 112 122 106 117"/>
    <path d="M38 143 C68 150 104 149 122 142" opacity="0.45"/>
    <g class="la-pool"><path d="M40 91 C64 83 96 83 106 91 C92 98 56 98 38 91" opacity="0.5"/></g>
    <path class="la-milkline la-stream" d="M68 18 C70 38 67 62 68 86"/>
    <g class="la-jug">
      <path d="M50 4 C68 -1 88 2 92 8"/>
      <path d="M92 8 C89 16 85 23 79 27"/>
      <path d="M50 4 C49 13 53 21 58 26"/>
      <path d="M57 25 C65 29 74 29 80 26"/>
      <path d="M78 24 C83 25 85 28 82 30 C79 31 77 29 77 27"/>
      <path d="M49 8 C39 9 35 18 43 22"/>
      <path d="M52 2 C70 -2 88 1 91 6" opacity="0.5"/>
    </g>
    <g class="la-mark la-ticks"><path d="M84 20 C94 21 102 21 112 20"/></g>
  </svg></div>`;
}
/* De drie giethoogtes. Aantikken verplaatst de kan, verlengt de straal en zet
   de streep op die hoogte -- zo zie je het verschil in plaats van te lezen. */
const LA_HEIGHTS=[
  {lab:'hoog', y:20, jug:0,
   d:'Ongeveer een handbreedte boven de kop, in het diepste punt van de espresso. De melk duikt eronder en mengt zich met de crema in plaats van erop te blijven liggen. Blijf hier tot de kop halfvol is.'},
  {lab:'laag', y:64, jug:46,
   d:'Zak tot de tuit het oppervlak bijna raakt. Nu blijft het schuim bovenop drijven en verschijnt het wit. Alles wat je van je patroon ziet, ontstaat in deze stand.'},
  {lab:'doortrekken', y:46, jug:28,
   d:'Til de kan iets op zodat de straal dun wordt, en trek in \u00e9\u00e9n doorlopende beweging door je vorm heen naar je toe. Geen pauze tussen de wiebel en de streep — daar sneuvelen de meeste hartjes.'},
];
function laSetHeight(btn,i){
  const box=btn&&btn.closest?btn.closest('.la-pour'):null;if(!box)return;
  const h=LA_HEIGHTS[i];if(!h)return;
  const q=c=>box.querySelector('.'+c);
  box.querySelectorAll('.la-heights button').forEach((b,j)=>
    b.setAttribute('aria-pressed',j===i?'true':'false'));
  const ex=q('la-hexpl');if(ex)ex.textContent=h.d;
  const jug=q('la-jug');
  if(jug){jug.style.transition='transform .4s ease';jug.style.transform='translateY('+h.jug+'px)';}
  const st=q('la-stream');
  if(st)st.setAttribute('d','M68 '+(h.y+4)+' C70 '+(h.y+22)+' 67 62 68 86');
  const tk=q('la-ticks');
  if(tk)tk.innerHTML='<path d="M84 '+h.y+' C94 '+(h.y+1)+' 102 '+(h.y+1)+' 112 '+h.y+'"/>';
  const pool=q('la-pool');
  if(pool)pool.style.opacity=(i===0?'0.35':'0.75');
}
// elke tekening op de pagina in zijn beginstand zetten, nadat hij in de DOM staat
function laInit(){
  document.querySelectorAll('.la-steam .la-sc').forEach(sc=>{try{laSteam(sc);}catch(e){}});
  document.querySelectorAll('.la-pour .la-heights button:first-child')
    .forEach(b=>{try{laSetHeight(b,0);}catch(e){}});
}

/* ---------------- cupping session ---------------- */
/* Mechanica volgt SCA-102 (sample preparation & cupping mechanics):
   8,25 g per 150 ml, medium-grof gemalen, water van 93 °C, vier minuten
   staan, korst breken met drie roerbewegingen, afschuimen, slurpen vanaf
   ~71 °C en nog eens terwijl het afkoelt.
   De acht scoresecties volgen de CVA affective assessment (SCA-104, 2024),
   die sinds november 2024 de 100-puntsvorm uit 2004 vervangt. */
const CUP_SECTIONS=[
  {k:'fragrance', n:'geur',          e:'fragrance', d:'de droge maling, vóór het water'},
  {k:'aroma',     n:'aroma',         e:'aroma',     d:'de natte geur, precies bij het breken'},
  {k:'flavour',   n:'smaak',         e:'flavour',   d:'wat je proeft als je slurpt'},
  {k:'aftertaste',n:'nasmaak',       e:'aftertaste',d:'wat achterblijft, en hoe lang'},
  {k:'acidity',   n:'zuur',          e:'acidity',   d:'de helderheid — de kwaliteit, niet de hoeveelheid'},
  {k:'sweetness', n:'zoet',          e:'sweetness', d:'rijpheid, de volheid van de suiker'},
  {k:'mouthfeel', n:'mondgevoel',    e:'mouthfeel', d:'gewicht en textuur op je tong'},
  {k:'overall',   n:'totaalindruk',  e:'overall',   d:'je eigen indruk, als geheel'},
];
const CUP_STEPS=[
  {t:null,n:'ruik de droge maling',   d:'neus in de kom vóór het water. dit is fragrance — scoor het nu, het komt niet meer terug.'},
  {t:0,   n:'giet alle kommen tegelijk vol', d:'93 °C, recht op de maling, tot de rand. start de klok.'},
  {t:240, n:'breek de korst',         d:'neus vlak boven de kom, drie keer roeren, diep inademen. dit is aroma.'},
  {t:270, n:'schuim af',              d:'twee lepels, van weerszijden over het oppervlak. schuim en drijvende maling eraf.'},
  {t:480, n:'eerste slurp · ~71 °C',  d:'slurp hard, zodat het verneveld over je hele tong slaat. smaak, zuur en mondgevoel lezen hier het best.'},
  {t:720, n:'proef opnieuw, lauwer',  d:'zoet en eventuele fouten komen pas nu boven. nasmaak en totaalindruk horen bij deze ronde.'},
];
const CUP_LABELS=['A','B','C','D'];
let cup={picks:[],order:[],stage:0,scores:{},notes:{},size:200,t0:0,timer:null,el:0,open:false};

function cupReset(){
  cupStopClock();
  cup={picks:[],order:[],stage:0,scores:{},notes:{},size:cup.size||200,t0:0,timer:null,el:0,open:false};
}
function cupDose(){return Math.round(cup.size*8.25/150*10)/10;}
function cupFmt(s){s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}

/* --- de tekening: kom met korst, lepel en stoom --- */
function cupBowlSVG(){
  return `<div class="cup-draw"><svg viewBox="0 0 240 150">
    <g class="cup-steam">
      <path d="M92 34 C86 26 96 21 90 11"/>
      <path d="M120 30 C114 21 124 16 118 6"/>
      <path d="M148 34 C142 26 152 21 146 11"/>
    </g>
    <g id="cup-crust">
      <path d="M62 60 C73 44 95 37 120 37 C147 37 169 45 180 59"/>
      <path d="M180 58 C161 72 78 72 61 58" opacity="0.8"/>
      <path d="M74 53 C79 49 84 52 89 47 M97 45 C102 41 107 44 112 40 M122 42 C127 38 132 41 137 38 M147 44 C152 40 157 44 162 41 M84 62 C89 58 94 61 99 57 M110 60 C115 56 120 59 125 56 M136 61 C141 57 146 60 151 57 M162 55 C167 51 171 54 175 51" opacity="0.5"/>
    </g>
    <g id="cup-liquid" style="display:none">
      <path d="M64 62 C84 55 156 55 177 61 C156 70 82 70 63 61"/>
      <path d="M80 64 C100 68 140 68 160 63" opacity="0.4"/>
    </g>
    <g class="cup-rim">
      <path d="M60 54 C78 44 162 44 180 54 C188 62 176 74 120 78 C64 79 52 70 57 59 C59 55 64 52 71 49"/>
      <path d="M66 51 C88 42 156 43 178 52 C186 61 170 73 118 77 C66 77 50 68 56 57" opacity="0.6"/>
      <path d="M55 63 C60 92 74 112 96 120 M185 63 C180 92 166 112 144 120 M93 118 C112 125 131 125 148 117"/>
      <path d="M72 128 C110 135 153 134 174 126" opacity="0.5"/>
      <path d="M78 131 C112 137 150 136 168 130" opacity="0.3"/>
    </g>
    <g id="cup-spoon">
      <path d="M199 20 C188 33 173 48 159 61"/>
      <path d="M159 58 C167 55 172 62 166 69 C158 73 149 69 152 62 C154 58 156 57 160 59"/>
    </g>
  </svg></div>`;
}

/* --- uitleg: wat cupping is en waarom het zo gaat --- */
function cupExplainHTML(){
  return `<button class="cup-ex-t" onclick="cup.open=!cup.open;renderCupping()">
      <svg viewBox="0 0 24 24" class="acic"><path d="M11.5 3.4 Q17.2 3.2 17.8 8.4 Q18.2 11.6 15.7 13.8 Q15 14.4 14.9 16.3 M15 16 Q12 16.6 9.1 16.1 M9.3 16.3 Q9 14.2 8.3 13.6 Q5.8 11.4 6.2 8.2 Q6.8 3.3 12.5 3.6"/><path d="M9.7 18.4 Q12 18.9 14.3 18.4 M10.3 20.5 Q12 21 13.8 20.5" opacity="0.7"/></svg>
      <span>How cupping works</span><span class="ll-arr">${cup.open?'▾':'▸'}</span></button>
    <div class="cup-ex ${cup.open?'':'hidden'}">
      <div class="lesson sketch soft"><h3>Why cup?</h3>
        <p>Bij cupping zet je koffie zonder techniek. Geen filter, geen druk, geen giettechniek — alleen maling, water en tijd, voor elke kom exact hetzelfde. Daardoor is het enige verschil dat je proeft de boon zelf. Dat is precies waarom de hele keten het zo doet: de boer, de brander en de inkoper vergelijken langs dezelfde lat.</p>
        <p>Thuis is de winst dubbel. Je leert je bonen kennen, én je leert je eigen tong kennen. Blind proeven haalt het etiket weg: geen prijs, geen herkomst, geen verwachting. Wat overblijft is wat je werkelijk lekker vindt.</p></div>
      <div class="lesson sketch"><h3>The recipe (SCA-102)</h3>
        <p>De verhouding is <b>8,25 g per 150 ml</b> — ongeveer 1:18. Maal <b>medium-grof</b>, iets grover dan filter, en voor alle kommen op precies dezelfde stand. Water van <b>93 °C</b>, vers en zacht. Weeg alles, ook het water: de hele oefening staat of valt met gelijke omstandigheden.</p>
        <p>Professioneel zet men vijf kommen per koffie, om te zien of de partij overal hetzelfde smaakt. Thuis is één kom per boon genoeg; twee als je wilt controleren of je eigen werk consistent is.</p></div>
      <div class="lesson sketch soft"><h3>How it runs</h3>
        <p><b>Voor het water</b> ruik je de droge maling. Dat is <i>fragrance</i>, en die is daarna weg.</p>
        <p><b>0:00</b> giet je alle kommen tegelijk vol en start je de klok. De koffie drijft boven en vormt een korst.</p>
        <p><b>4:00</b> breek je de korst: neus vlak boven de kom, drie keer roeren, diep inademen. Die stoot geur is <i>aroma</i>, het mooiste moment van de sessie.</p>
        <p><b>Daarna</b> schuim je af met twee lepels, van weerszijden over het oppervlak.</p>
        <p><b>Vanaf ±8 minuten</b>, rond 71 °C, slurp je. Hard, zodat de koffie verneveld over je hele tong slaat. Proef opnieuw terwijl het afkoelt: zuur en zoet laten zich op verschillende temperaturen zien, en fouten komen pas lauw boven.</p></div>
      <div class="lesson sketch"><h3>Scoring</h3>
        <p>De SCA verving in november 2024 het oude 100-puntsformulier uit 2004 door de <b>Coffee Value Assessment</b>. Die splitst beschrijven (wát je proeft) van waarderen (hoe goed je het vindt). Dit scherm volgt het waarderende deel: acht secties, elk van 1 tot 9, waarbij 5 neutraal is — niet lekker, niet vies.</p>
        <p>De officiële omrekening naar honderd punten doet de SCA met een eigen rekenhulp; <b>80 punten of meer</b> heet specialty, 85+ excellent, 90+ outstanding. Het cijfer dat je hier ziet is je eigen voorkeursscore, geen SCA-keuring. Voor thuis is dat ook het enige dat telt: welke boon wil jij morgen weer.</p></div>
    </div>`;
}

function renderCupping(){
  const el=document.getElementById('cupping-body');if(!el)return;
  const beans=state.beans.filter(b=>b.inStock!==false);

  /* --- 0. opzet --- */
  if(cup.stage===0){
    let h=cupExplainHTML();
    if(beans.length<2){
      h+='<div class="empty-note">je hebt twee bonen in huis nodig om te cuppen.<br>voeg nog een zak toe en kom terug.</div>';
      el.innerHTML=h;return;
    }
    h+=`<div class="k" style="margin:18px 2px 6px">kies twee tot vier bonen</div><div class="link-pick">`+
      beans.map(b=>`<button class="lp ${cup.picks.includes(b.id)?'sel':''}" onclick="cupPick('${b.id}')">${esc(b.name)}</button>`).join('')+'</div>';
    h+=`<div class="cup-recipe sketch">
        <div class="cr-h hand">Your recipe</div>
        <div class="cr-row"><span>komformaat</span><span class="cr-in"><input type="number" min="100" max="400" step="10" value="${cup.size}" oninput="cupSize(this.value)"> ml</span></div>
        <div class="cr-row"><span>koffie per kom</span><b>${String(cupDose()).replace('.',',')} g</b></div>
        <div class="cr-row"><span>water</span><b>${cup.size} ml · 93 °C</b></div>
        <div class="cr-row"><span>maling</span><b>medium-grof</b></div>
        <div class="cr-row"><span>kommen te vullen</span><b>${cup.picks.length||'—'}</b></div>
        <div class="cr-note">8,25 g per 150 ml — de SCA-verhouding, omgerekend naar jouw kom. dezelfde maling, hetzelfde water en dezelfde tijd voor elke kom.</div>
      </div>`;
    h+=cup.picks.length>=2
      ? '<button class="save-btn" style="margin-top:14px" onclick="cupStart()">start de sessie →</button>'
      : '<div class="cup-hint">kies er minstens twee.</div>';
    el.innerHTML=h;return;
  }

  /* --- 1. het verloop, met klok --- */
  if(cup.stage===1){
    const t=cup.el;
    let h=`<div class="cup-clock sketch">
        ${cupBowlSVG()}
        <div class="cc-row">
          <div class="cc-t hand" id="cup-t">${cupFmt(t)}</div>
          <button class="save-btn cc-btn" onclick="cupToggleClock()">${cup.timer?'pauze':(t?'verder':'giet &amp; start')}</button>
        </div>
      </div><div class="cup-proto">`;
    CUP_STEPS.forEach((s,i)=>{
      const started=s.t===null?true:(cup.timer||t>0)&&t>=s.t;
      const next=CUP_STEPS[i+1];
      const now=started&&(!next||next.t===null||t<next.t);
      h+=`<div class="cup-step ${now?'now':''} ${started&&!now?'past':''}">
        <div class="cs-t hand">${s.t===null?'vooraf':cupFmt(s.t)}</div>
        <div class="cs-b"><div class="cs-n hand">${s.n}</div><div class="cs-d">${s.d}</div></div></div>`;
    });
    h+=`</div><button class="save-btn" onclick="cupToScore()">scoor de kommen →</button>
        <button class="profile-btn" onclick="cupReset();renderCupping()">opnieuw beginnen</button>`;
    el.innerHTML=h;cupPaint();return;
  }

  /* --- 2. scoren, blind --- */
  if(cup.stage===2){
    let h='<div class="cup-hint" style="text-align:left;margin:0 0 12px">scoor elke kom vóór je onthult. 5 is neutraal — niet lekker, niet vies.</div>';
    cup.order.forEach((id,i)=>{
      const L=CUP_LABELS[i], sc=cup.scores[L]||{};
      const tot=CUP_SECTIONS.reduce((a,s)=>a+(sc[s.k]||5),0);
      h+=`<div class="cup-card sketch">
        <div class="cc-h"><span class="cc-l hand">kom ${L}</span><span class="cc-tot hand" id="cup-tot-${L}">${tot}<span class="cc-of">/72</span></span></div>`;
      CUP_SECTIONS.forEach(s=>{
        const v=sc[s.k]||5;
        h+=`<div class="cup-sec">
          <div class="cs-lab"><span class="hand">${s.n}</span><span class="cs-en">${s.e}</span><span class="cs-hint">${s.d}</span></div>
          <div class="cs-in"><input type="range" min="1" max="9" step="1" value="${v}" oninput="cupScore('${L}','${s.k}',this.value)">
            <span class="cs-v hand" id="cup-v-${L}-${s.k}">${v}</span></div></div>`;
      });
      h+=`<textarea class="cup-note" placeholder="wat proef je? schrijf het op zoals het bij je opkomt…" oninput="cup.notes['${L}']=this.value">${esc(cup.notes[L]||'')}</textarea>
        </div>`;
    });
    h+='<button class="save-btn" onclick="cupReveal()">onthul wat wat was →</button>';
    el.innerHTML=h;return;
  }

  /* --- 3. onthulling --- */
  const rows=cup.order.map((id,i)=>{
    const L=CUP_LABELS[i], b=beanById(id), sc=cup.scores[L]||{};
    const tot=CUP_SECTIONS.reduce((a,s)=>a+(sc[s.k]||5),0);
    return {L,b,sc,tot,ten:Math.round(tot/72*100)/10};
  }).sort((a,b)=>b.tot-a.tot);
  const top=rows[0], tie=rows.length>1&&rows[1].tot===top.tot;
  let h=`<div class="settings-card sketch" style="background:var(--v60)">
      <div class="set-t hand">The reveal</div>
      <div class="cup-rev">`;
  rows.forEach(r=>{
    h+=`<div class="cr-line"><span class="cr-l hand">${r.L}</span>
      <span class="cr-n">${esc(r.b?r.b.name:'?')}</span>
      <span class="cr-s hand">${r.tot}<span class="cc-of">/72</span></span></div>`;
    if(cup.notes[r.L])h+=`<div class="cr-note-b">${esc(cup.notes[r.L])}</div>`;
  });
  h+=`</div><div class="set-d" style="margin-top:8px">${tie
      ? 'gelijkspel — je tong kon ze niet uit elkaar houden.'
      : 'je tong kiest <b style="font-weight:400;color:var(--ink)">'+esc(top.b?top.b.name:'?')+'</b>'}</div></div>`;
  /* per sectie waar het verschil zat */
  if(rows.length>1){
    h+='<div class="cup-card sketch"><div class="cc-h"><span class="cc-l hand">Where they differed</span></div>';
    const byLabel=cup.order.map((id,i)=>({L:CUP_LABELS[i],b:beanById(id),sc:cup.scores[CUP_LABELS[i]]||{}}));
    CUP_SECTIONS.forEach(s=>{
      const vals=byLabel.map(r=>(r.sc[s.k]||5));
      const hi=Math.max(...vals), lo=Math.min(...vals);
      const win=byLabel[vals.indexOf(hi)];
      h+=`<div class="cup-diff ${hi-lo>=2?'big':''}"><span class="hand">${s.n}</span>
        <span class="cd-v">${byLabel.map((r,i)=>r.L+' '+vals[i]).join(' · ')}</span>
        <span class="cd-w">${hi===lo?'gelijk':esc((win.b&&win.b.name)||'?')}</span></div>`;
    });
    h+='</div>';
  }
  h+=`<button class="profile-btn" onclick="cupSaveNotes()"><svg viewBox="0 0 24 24" class="acic btn-svg"><path d="M4.8 4.2 Q11 3.8 16.6 4.4 Q18.3 6.2 19.8 8.1 M19.6 7.7 Q20.1 13.5 19.7 19.7 M19.9 19.3 Q12 20.1 4.4 19.5 M4.7 19.8 Q4 12 4.9 4 M7.9 4.4 Q7.8 7 7.9 8.7 Q11.8 9.2 15.5 8.6 Q15.7 6.6 15.6 4.5"/><path d="M7.9 19.5 Q7.8 15 8.1 12.8 Q12 12.4 16.1 12.9 M16 12.6 Q16.3 16.1 16.2 19.5" opacity="0.7"/></svg> bewaar het resultaat bij elke boon</button>
    <button class="profile-btn" onclick="cupReset();renderCupping()">nieuwe sessie</button>`;
  el.innerHTML=h;
}

function cupPick(id){
  const i=cup.picks.indexOf(id);
  if(i>=0)cup.picks.splice(i,1);
  else if(cup.picks.length<4)cup.picks.push(id);
  else toast('vier kommen is het meeste dat je tong aankan');
  renderCupping();
}
function cupSize(v){const n=parseInt(v,10);if(n>=100&&n<=400){cup.size=n;const d=document.querySelector('.cup-recipe');if(d)renderCupping();}}
function cupStart(){
  cup.order=cup.picks.slice().sort(()=>Math.random()-0.5);   // blind: volgorde door elkaar
  cup.scores={};cup.notes={};cup.el=0;cup.stage=1;renderCupping();
}
function cupToggleClock(){cup.timer?cupStopClock():cupStartClock();renderCupping();}
function cupStartClock(){
  cup.t0=Date.now()-cup.el*1000;
  cup.timer=setInterval(()=>{
    cup.el=(Date.now()-cup.t0)/1000;
    const t=document.getElementById('cup-t');if(t)t.textContent=cupFmt(cup.el);
    cupPaint();
    const cur=CUP_STEPS.filter(s=>s.t!==null&&Math.abs(cup.el-s.t)<0.5)[0];
    if(cur&&cur.t>0)toast(cur.n);
  },250);
}
function cupStopClock(){if(cup.timer){clearInterval(cup.timer);cup.timer=null;}}
/* korst tot 4:00, daarna vloeistof; de lepel duikt in bij het breken */
function cupPaint(){
  const cr=document.getElementById('cup-crust'), lq=document.getElementById('cup-liquid'), sp=document.getElementById('cup-spoon');
  if(!cr||!lq)return;
  const broken=cup.el>=240;
  cr.style.display=broken?'none':'';
  lq.style.display=broken?'':'none';
  if(sp)sp.style.transform=(cup.el>=240&&cup.el<270)?'rotate(-14deg)':'';
  document.querySelectorAll('.cup-step').forEach((n,i)=>{
    const s=CUP_STEPS[i],next=CUP_STEPS[i+1];
    const started=s.t===null?true:cup.el>=s.t;
    const now=started&&(!next||next.t===null||cup.el<next.t);
    n.classList.toggle('now',now);n.classList.toggle('past',started&&!now);
  });
}
function cupToScore(){cupStopClock();cup.stage=2;renderCupping();}
function cupScore(L,k,v){
  if(!cup.scores[L])cup.scores[L]={};
  cup.scores[L][k]=+v;
  const el=document.getElementById('cup-v-'+L+'-'+k);if(el)el.textContent=v;
  const tot=CUP_SECTIONS.reduce((a,s)=>a+(cup.scores[L][s.k]||5),0);
  const t=document.getElementById('cup-tot-'+L);if(t)t.innerHTML=tot+'<span class="cc-of">/72</span>';
}
function cupReveal(){cupStopClock();cup.stage=3;renderCupping();}
function cupSaveNotes(){
  const d=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'});
  const rows=cup.order.map((id,i)=>({b:beanById(id),L:CUP_LABELS[i],
    tot:CUP_SECTIONS.reduce((a,s)=>a+((cup.scores[CUP_LABELS[i]]||{})[s.k]||5),0),n:cup.notes[CUP_LABELS[i]]||''}));
  const field=rows.map(r=>(r.b?r.b.name:'?')+' '+r.tot).join(' · ');
  rows.forEach(r=>{
    if(!r.b)return;
    r.b.notes=((r.b.notes||'')+`\ncupping ${d}: ${r.tot}/72 (blind ${r.L}) — ${field}${r.n?'\n  '+r.n:''}`).trim();
  });
  save();toast('✓ bewaard bij elke boon');
}
/* ---------------- latte-art gallery + AI coach ---------------- */
async function addLatteShot(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  try{
    const img=await fileToDataURL(file,520,false);
    if(!Array.isArray(state.latteShots))state.latteShots=[];
    const nieuw={id:uid(),ts:Date.now(),img,fb:'',shape:gaShape||''};
    state.latteShots.unshift(nieuw);
    latteOpen[nieuw.id]=true;   // je eigen nieuwe giet zie je meteen, niet dichtgeklapt
    save();renderGallery();toast('✓ giet toegevoegd');
  }catch(e){toast('kon de foto niet laden');}
  ev.target.value='';
}
/* Welke vorm was je van plan? Dat is de helft van bruikbare feedback: zonder
   het doel kan de coach alleen zeggen wat hij ziet, niet of het gelukt is.  */
let gaShape=null;
function gaPickShape(naam){
  gaShape=(gaShape===naam)?null:naam;
  renderGaShapePick();
}
function renderGaShapePick(){
  const el=document.getElementById('ga-shapepick');if(!el)return;
  el.innerHTML=LA_PATTERNS.map(p=>
    '<button type="button" aria-pressed="'+(gaShape===p.n?'true':'false')+
    '" onclick="gaPickShape(\''+p.n.replace(/'/g,"\\'")+'\')">'+
    '<svg viewBox="0 0 100 100" role="img" aria-label="'+esc(p.n)+'">'+LA_CUP+p.svg+'</svg>'+
    '<span class="sp-n">'+esc(p.n)+'</span></button>').join('');
}
// de uitleg boven de galerij: dezelfde twee bewegende tekeningen als bij learn
function renderGaHelp(){
  const el=document.getElementById('ga-help-body');if(!el)return;
  if(el.dataset.vol==='1')return;          // maar één keer opbouwen
  el.innerHTML='<div class="set-d" style="margin:8px 0 10px">de melk bepaalt of het lukt; '+
    'de hoogte bepaalt wat je ziet. Schuif door het opschuimen en tik de drie giethoogtes aan.</div>'+
    laSteamBenchHTML()+laPourBenchHTML();
  el.dataset.vol='1';
  laInit();
}
// welke gieten staan open? dichtgeklapt is de standaard -- zo blijft een lange
// reeks pogingen overzichtelijk in plaats van een eindeloze scroll van foto's
let latteOpen={};
function latteToggle(id){latteOpen[id]=!latteOpen[id];renderGallery();}
function renderGallery(){
  const el=document.getElementById('gallery-list');if(!el)return;
  const shots=state.latteShots||[];
  if(!shots.length){el.innerHTML='<div class="empty-note">nog geen gieten.<br>fotografeer je volgende flat white en zie jezelf vooruitgaan.</div>';return;}
  el.innerHTML=shots.map(sh=>{
    const open=!!latteOpen[sh.id];
    const kop=timeAgo(sh.ts);
    if(!open)return `<div class="settings-card sketch soft">
      <div class="lshot-row" onclick="latteToggle('${sh.id}')">
        <img class="lshot-thumb" src="${esc(BrewSecurity.imageUrl(sh.img))}">
        <div class="lshot-main">
          <div class="lshot-when">${esc(kop)}${sh.shape?' <span class="lshot-shape">· '+esc(sh.shape)+'</span>':''}</div>
          <div class="lshot-fb">${sh.fb?'✦ '+esc(sh.fb):'no feedback yet'}</div>
        </div>
        <span class="bchev">▸</span>
      </div>
    </div>`;
    return `<div class="settings-card sketch soft">
      <div class="lshot-row" onclick="latteToggle('${sh.id}')">
        <div class="lshot-main"><div class="lshot-when">${esc(kop)}${sh.shape?' <span class="lshot-shape">· '+esc(sh.shape)+'</span>':''}</div></div>
        <span class="bchev">▾</span>
      </div>
      <img src="${esc(BrewSecurity.imageUrl(sh.img))}" style="width:100%;border-radius:14px;border:2px solid var(--line);margin-top:8px">
      ${sh.fb?'<div class="set-d" style="margin-top:6px;color:var(--ink)">✦ '+esc(sh.fb).replace(/\n/g,'<br>')+'</div>':''}
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="recipe-btn ai-only ${aiReady()?'':'hidden'}" style="margin-top:0;flex:1" onclick="latteCoach('${sh.id}')">✦ laat de coach kijken</button>
        <button class="icon-btn" title="delete" onclick="delLatteShot('${sh.id}')">${ICO.del}</button>
      </div>
    </div>`;
  }).join('');
}
function delLatteShot(id){
  if(!confirm('deze giet verwijderen?'))return;
  state.latteShots=(state.latteShots||[]).filter(x=>x.id!==id);save();renderGallery();
}
async function latteCoach(id){
  const sh=(state.latteShots||[]).find(x=>x.id===id);if(!sh)return;
  if(!aiReady()){toast('turn on AI in profile first');return;}
  toast('✦ de coach kijkt mee…');
  try{
    const b64=sh.img.split(',')[1];
    const media=(sh.img.match(/^data:([^;]+)/)||[])[1]||'image/jpeg';
    // wist je wat je wilde gieten? dan gaat het over dat doel, niet over "een vorm"
    const pat=sh.shape?LA_PATTERNS.find(p=>p.n===sh.shape):null;
    const doel=sh.shape
      ? ' De barista probeerde bewust een "'+sh.shape+'"'+(pat?' ('+pat.en+')':'')+' te gieten.'+
        (pat?' Zo hoort die te ontstaan: '+pat.d+(pat.tip?' Bekend struikelblok: '+pat.tip:''):'')+
        ' Beoordeel het resultaat tegen dat doel: is de vorm herkenbaar geworden, en zo niet, waar ging het mis?'
      : ' De barista gaf niet op welke vorm het moest worden; beschrijf dan wat je ziet.';
    const prompt='Dit is een foto van latte art van een thuisbarista.'+doel+
      ' Geef vriendelijke, concrete feedback in het Nederlands (max 4 zinnen): wat gaat goed, en \u00e9\u00e9n duidelijk verbeterpunt over melktextuur, giethoogte of trekbeweging.';
    const txt=await askAI([{role:"user",content:[{type:"image",source:{type:"base64",media_type:media,data:b64}},{type:"text",text:prompt}]}],400,'pour');
    sh.fb=(txt||'').trim();latteOpen[sh.id]=true;save();renderGallery();
  }catch(e){toast("couldn't reach the coach");}
}

/* ---------------- shortcuts: start vanaf je beginscherm ---------------- */
function renderShortcuts(){
  const card=document.getElementById('shortcut-card');if(!card)return;
  card.style.display=featOn('shortcuts')?'block':'none';
  if(!featOn('shortcuts'))return;
  const base=location.origin+location.pathname;
  document.getElementById('shortcut-list').innerHTML=
    state.methods.filter(m=>m.on).map(m=>`<button class="profile-btn ic-btn" onclick="copyShortcut('${m.id}')">${iconHTML(m,22)} copy link: start ${esc(m.name)}</button>`).join('')+
    `<button class="profile-btn ic-btn" onclick="copyShortcut('surprise')"><svg viewBox="0 0 24 24" class="acic"><path d="M4.7 9.7 Q4.6 16.2 8 18.3 Q12 20.6 16.2 18.1 Q19.4 16.1 19.3 9.6 M4.3 10.2 Q12 8.3 19.7 10.1 M19.1 10.9 Q22.4 10.7 22.3 13.5 Q22.2 16.4 18.8 16.1 M3 21.4 Q12 22.1 21.1 21.3"/><path d="M8.9 5.9 Q8.1 7.6 9.5 8.8 M12.4 5.1 Q11.4 6.9 12.8 8.1 M15.7 5.9 Q14.8 7.6 16.2 8.8" opacity="0.7"/></svg> copy link: surprise me</button>`;
}
function copyShortcut(id){
  const base=location.origin+location.pathname;
  const url=id==='surprise'?(base+'?quickbrew=1'):(base+'?brew='+encodeURIComponent(id));
  (navigator.clipboard&&navigator.clipboard.writeText)?
    navigator.clipboard.writeText(url).then(()=>toast('link copied — paste it in an iOS Shortcut'),()=>prompt('copy this link:',url))
    :prompt('copy this link:',url);
}
/* ---------------- share card: brew als tekenkaart-afbeelding ---------------- */
async function shareCard(id){
  const b=state.brews.find(x=>x.id===id);if(!b)return;
  const m=methodById(b.method);const fam=methodFamily(b.method);
  try{await document.fonts.load('700 60px Caveat');await document.fonts.load('30px "Patrick Hand"');}catch(e){}
  const W=900,H=1100,c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d');
  const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'#3a302a';
  const paper='#efe9dd',ink='#3a302a',soft='#7a6c5e',accent='#4a3b30';
  x.fillStyle=paper;x.fillRect(0,0,W,H);
  // wiebelige kaderlijn
  x.strokeStyle=ink;x.lineWidth=5;x.lineCap='round';x.beginPath();
  const jig=(x0,y0,x1,y1)=>{const n=14;for(let i=0;i<=n;i++){const t=i/n,px=x0+(x1-x0)*t+(Math.random()-.5)*5,py=y0+(y1-y0)*t+(Math.random()-.5)*5;i?x.lineTo(px,py):x.moveTo(px,py);}};
  jig(46,46,W-46,46);jig(W-46,46,W-46,H-46);jig(W-46,H-46,46,H-46);jig(46,H-46,46,46);x.stroke();
  x.fillStyle=ink;x.font='700 84px Caveat';x.textAlign='center';
  x.fillText((b.title&&b.title.trim())?b.title:m.name,W/2,180,W-160);
  x.fillStyle=soft;x.font='36px "Patrick Hand"';
  x.fillText([m.name,b.beans].filter(Boolean).join(' · '),W/2,236,W-160);
  // grote koffieboon-tekening
  x.save();x.translate(W/2,430);x.rotate(.32);x.strokeStyle=accent;x.lineWidth=6;
  x.beginPath();x.ellipse(0,0,105,150,0,0,Math.PI*2);x.stroke();
  x.beginPath();x.moveTo(-52,-120);x.quadraticCurveTo(40,-20,52,124);x.stroke();x.restore();
  const rows=[['dose in',b.dose?b.dose+' g':'—'],[fam==='espresso'?'yield out':'yield out',b.yield?b.yield+' g':'—'],
    [fam==='espresso'?'shot time':'time',b.time||'—'],['grind',b.grind||'—'],['temp',b.temp?b.temp+'°C':'—'],
    ['ratio',b.ratio?'1:'+(+b.ratio).toFixed(1):'—']];
  x.textAlign='left';
  rows.forEach((r2,i)=>{
    const cx0=i%2?W/2+40:120,cy0=680+Math.floor(i/2)*110;
    x.fillStyle=soft;x.font='30px "Patrick Hand"';x.fillText(r2[0],cx0,cy0);
    x.fillStyle=ink;x.font='700 58px Caveat';x.fillText(String(r2[1]),cx0,cy0+56);
  });
  x.textAlign='center';x.fillStyle=soft;x.font='30px "Patrick Hand"';
  const tags=asArr(b.tags).length?asArr(b.tags).join(' · '):'';
  if(tags)x.fillText(tags,W/2,H-120,W-200);
  x.font='700 40px Caveat';x.fillStyle=accent;
  x.fillText('lets brew specialty ☕',W/2,H-70);
  const blob=await new Promise(res=>c.toBlob(res,'image/png'));
  const file=new File([blob],'brew-card.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:'my brew'});return;}catch(e){if(e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='brew-card.png';a.click();
  URL.revokeObjectURL(url);toast('card saved — share it on');
}
function savePushUrl(){
  const v=document.getElementById('push-url').value.trim();
  localStorage.setItem('scc_push_url',v);
  toast(v?'✓ push server saved':'push server cleared');
}

