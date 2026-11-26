/* ---------------- formulier + calculator ---------------- */
let editingId=null,formMethod=null,formBean=null,formTags=[],formCustom=[],pendingTarget=null,formPrep={},pendingRecipe=null,formRecipeSnapshot=null;
let formBed=null;   // vlak / krater / muur, zoals het bed erbij lag
let formCup=null;   // hoe de kop smaakte, voor het kompas
let formMolen=null; // de molen waarop je deze maalstand draaide
let molenZelf=false;// zelf gekozen? dan blijft de app eraf
let formOud={};     // velden van een oudere brew die geen invoerveld meer hebben
function setVal(id,v){const el=document.getElementById(id);if(el)el.value=(v==null?'':v);}
// laat een tekstvak meegroeien met de inhoud (geen klein scroll-vakje meer)
function autoGrow(el){if(!el)return;el.style.height='auto';el.style.height=Math.max(el.scrollHeight+4,190)+'px';}
function numOf(v){const m=(''+(v==null?'':v)).match(/[\d.]+/);return m?m[0]:'';}
function cleanTime(v){return (''+(v==null?'':v)).replace(/[^\d:]/g,'');}
// tijd "mm:ss" of "ss" -> seconden
function parseTimeSec(t){if(t==null)return null;const s=(''+t).trim();if(!s)return null;
  if(s.includes(':')){const[m,ss]=s.split(':');return (+m||0)*60+(+ss||0);}const n=+s;return isNaN(n)?null:n;}
// korte maalstand voor het maling-veld (knip lange uitleg eraf)
function conciseGrind(v){v=(''+(v==null?'':v)).trim();if(!v)return v;
  let s=v.split(/\s+op\s+|\s*[(,;]/)[0].trim();return s.length<=28?s:s.slice(0,28).trim();}
// tijd altijd als m:ss — je typt alleen cijfers, de dubbelepunt komt vanzelf
function formatTime(el){
  let d=el.value.replace(/\D/g,'').slice(0,4);
  el.value = !d ? '' : (d.length<=2 ? d : d.slice(0,d.length-2)+':'+d.slice(-2));
  try{renderDialInHint();}catch(e){}
}
function normalizeTime(el){
  let d=el.value.replace(/\D/g,'').slice(0,4);
  if(!d){el.value='';return;}
  const ss=d.length<=2?d.padStart(2,'0'):d.slice(-2);
  const mm=d.length<=2?'0':d.slice(0,-2);
  el.value=mm+':'+ss;
  try{renderDialInHint();}catch(e){}
}
// korte weergave van een doel-shot, bv. "18g in · maling 1.3 · 27s · 36g uit"
function fmtShot(t){
  if(!t)return '';
  const parts=[];
  if(t.dose)parts.push(t.dose+'g in');
  if(t.grind)parts.push('grind '+t.grind);
  if(t.time)parts.push(t.time);
  if(t.yield)parts.push(t.yield+'g out');
  return parts.join(' · ');
}
/* ---------------- dial-in: doel, nieuwe poging & AI-maaladvies ---------------- */
// open een nieuwe poging op basis van een eerdere brew (methode, boon, dose,
// maling, doel) — je meet alleen je nieuwe tijd en slaat op
function brewAgain(id){
  const src=state.brews.find(x=>x.id===id);
  if(!src){beginBrew();return;}
  // espresso -> dial-in-scherm met het vorige als doel
  if(methodFamily(src.method)==='espresso'){
    formMethod=src.method;formBean=src.beanId||null;
    pendingTarget=src.target||{dose:src.dose?String(src.dose):'',yield:src.yield?String(src.yield):'',time:src.time||'',grind:src.grind||''};
    formPrep=src.prep?JSON.parse(JSON.stringify(src.prep)):{};
    openDialIn(src.method);
    toast('new attempt — measure your shot time');
    return;
  }
  openForm(src.method);
  setVal('f-dose',src.dose);setVal('f-yield',src.yield);setVal('f-ratio',src.ratio);
  setVal('f-grind',src.grind||'');setVal('f-temp',src.temp);
  formBean=src.beanId||null;renderFormBeans();
  formTags=Array.isArray(src.tags)?[...src.tags]:[];renderFormTags();
  // doel meenemen: de vorige target, anders de vorige brew zelf als richtlijn
  pendingTarget=src.target||{dose:src.dose,grind:src.grind||'',time:src.time||'',yield:src.yield};
  formPrep=src.prep?JSON.parse(JSON.stringify(src.prep)):{};renderPrep();
  renderDialInHint();
  toast('new attempt — measure your time, adjust and save');
}
// toon het doel + een LIVE maaltip (tijd vs doel) + het laatste AI-advies
function renderDialInHint(){
  const el=document.getElementById('dialin-hint');if(!el)return;
  let html='';
  if(pendingTarget && fmtShot(pendingTarget)){
    html+='<div class="di-t">target</div>'+esc(fmtShot(pendingTarget));
  }
  // live: vergelijk je ingevulde tijd met de doel-tijd terwijl je typt
  if(pendingTarget && pendingTarget.time){
    const actual=parseTimeSec(document.getElementById('f-time')?.value);
    const target=parseTimeSec(pendingTarget.time);
    if(actual&&target){
      const diff=actual-target, tol=target<=60?3:Math.max(8,Math.round(target*0.1));
      let tip;
      if(diff>tol)tip='slower than target → grind a bit coarser';
      else if(diff<-tol)tip='faster than target → grind a bit finer';
      else tip='right on target ✓';
      html+='<div class="di-tip">⏱ '+esc(document.getElementById('f-time').value)+' vs target '+esc(pendingTarget.time)+' → '+tip+'</div>';
    }
  }
  // opgeslagen AI-advies van de vorige poging(en)
  const bean=beanById(formBean);
  if(bean&&bean.dialIn&&bean.dialIn.method===formMethod&&bean.dialIn.grind){
    html+='<div class="di-tip">✦ AI tip: try grind '+esc(bean.dialIn.grind)+(bean.dialIn.reason?' — '+esc(bean.dialIn.reason):'')+'</div>';
  }
  el.innerHTML=html;el.style.display=html?'block':'none';
}
// leer op de achtergrond van alle pogingen van deze boon en bereken de volgende maalstand
async function updateDialIn(beanId,method){
  const bean=beanById(beanId);if(!bean)return;
  const attempts=state.brews.filter(b=>b.beanId===beanId&&b.method===method&&(b.time||b.grind))
    .sort((a,b)=>a.ts-b.ts);
  if(!attempts.length||!aiReady())return;   // zonder AI: gewoon opgeslagen, geen berekening
  try{
    const grinder=(state.gear||[]).filter(g=>g.kind==='grinder'&&g.name).map(gearLabel).join(', ');
    // doel afleiden uit de laatste poging (yield/tijd) en de doorloopsnelheid vergelijken
    const last=attempts[attempts.length-1];
    const esp=methodFamily(method)==='espresso';
    const tgt=last.target||{};
    const tY=parseFloat(tgt.yield)||36, tT=parseTimeSec(tgt.time)||28;
    // bij filter is het doel de tijd van het recept, niet een opbrengst per seconde
    const rcp=esp?null:recipeById((state.lastRecipe||{})[method]);
    const fDoel=(rcp&&Array.isArray(rcp.stappen)&&rcp.stappen.length)?(rcp.stappen[rcp.stappen.length-1].t+40):190;
    const fTijd=Math.floor(fDoel/60)+':'+String(fDoel%60).padStart(2,'0');
    const lines=attempts.map((a,i)=>{
      const aY=parseFloat(a.yield)||null, aT=parseTimeSec(a.time)||null;
      if(esp){
        const flow=(aY&&aT)?(aY/aT).toFixed(2):'?';
        return `${i+1}) maling ${a.grind||'?'}: ${a.dose||'?'}g in → ${aY||'?'}g uit in ${a.time||'?'} (doorloop ${flow} g/s)`;
      }
      const smaak=a.cup?(cupById(a.cup)||{}).nl:'';
      return `${i+1}) maling ${a.grind||'?'}: ${a.dose||'?'}g op ${aY||'?'}g water, totaal ${a.time||'?'}`+
        (a.draw?`, doorlooptijd ${a.draw}`:'')+(a.bed?`, bed ${bedNL(a.bed)}`:'')+(smaak?`, geproefd: ${smaak}`:'');
    }).join('\n');
    let richting='onbekend — te weinig data';
    if(esp){
      const laY=parseFloat(last.yield)||null, laT=parseTimeSec(last.time)||null;
      if(laY&&laT){const f=laY/laT, ft=tY/tT;
        richting = f<ft*0.85 ? 'TE LANGZAAM (te weinig opbrengst voor de tijd / choking) → GROVER malen'
                : f>ft*1.15 ? 'TE SNEL (te veel/te snel opbrengst, waterig) → FIJNER malen'
                            : 'op doel — maling ongeveer aanhouden';}
    }else{
      const c=last.cup?cupById(last.cup):null;
      const dw=parseTimeSec(last.draw);
      if(c&&c.id!=='goed')richting=c.nl+' → '+c.fixnl;
      else if(dw&&dw>75)richting='doorlooptijd boven de 75 s: het bed loopt vast → GROVER malen en minder roeren';
      else if(c&&c.id==='goed')richting='op doel — maling aanhouden';
    }
    const prompt=`Je bent een ${esp?'espresso dial-in':'filter'}-expert. Boon "${bean.name}", methode "${methodById(method).name}".`+
      (grinder?` Molen(s) van de gebruiker: ${grinder}. Als je de molen kent, gebruik de juiste getalsrichting (welk getal grover/fijner is); staat er een grind range bij, laat de grootte van je voorgestelde stap in verhouding staan tot die schaal (op een schaal van 1-100 is +1 piepklein, op een schaal van 1-10 is dat al een flinke sprong).`:'')+
      (esp?`\nDOEL: ${tY} g uit in ~${tT} s (ratio ~1:2), doelsnelheid ${(tY/tT).toFixed(2)} g/s.\n`
          :`\nDOEL: een schone kop met een totale tijd rond ${fTijd} en een doorlooptijd onder de minuut.\n`)+
      APP_RULES+`\n`+BEAN_GRIND_RULES+`\n`+(esp?ESPRESSO_RULES:FILTER_RULES)+`\n`+beanPromptBlock(bean)+`\n`+
      `Pogingen (oud→nieuw):\n${lines}\n`+
      `Oordeel over de laatste ${esp?'shot':'kop'}: ${richting}.\n`+
      (esp?'':`De doorlooptijd (van de laatste giet tot het bed droogvalt) weegt zwaarder dan de totale tijd.\n`)+
      `Geef de beste maalstand voor de VOLGENDE poging, in exact die richting. Geef ALLEEN JSON zonder markdown: {"grind":"","reason":""}. grind = KORTE maalstand (getal/klikken of relatief zoals "+1" of "-0.5", passend bij de schaal die de gebruiker gebruikt; GEEN uitleg). reason = één korte zin met de juiste richting (bv. "te weinig opbrengst → grover"). Nederlands.`;
    const txt=await askAI([{role:"user",content:prompt}],250,'brew');
    const d=extractJSON(txt);
    if(d&&d.grind){
      bean.dialIn={method,grind:conciseGrind(d.grind),reason:(d.reason||'').trim(),ts:Date.now()};
      save();
      toast('✦ AI grind tip: next time grind '+bean.dialIn.grind+(bean.dialIn.reason?' — '+bean.dialIn.reason:''));
    }
  }catch(e){/* stil: volgende keer weer proberen */}
}
function openForm(methodId){
  pc.ratio=null;      // een eigen verhouding geldt alleen voor de brew waarin je hem typte
  editingId=null;formRecipeSnapshot=null;const valid=methodId&&state.methods.find(m=>m.id===methodId&&m.on);formMethod=valid?methodId:(state.methods.filter(m=>m.on)[0]?.id||'espresso');
  document.getElementById('form-title').textContent='new brew';
  ['f-title','f-dose','f-yield','f-ratio','f-time','f-temp','f-grind','f-notes','f-tagnew','f-bloom-g','f-bloom-s','f-draw','f-brewer'].forEach(i=>setVal(i,''));
  formBed=null;formCup=null;formMolen=null;molenZelf=false;bloomZelf={g:false,s:false};formOud={};
  setVal('f-score',8);document.getElementById('score-big').textContent='8.0';
  formBean=null;formTags=[];formCustom=[];pendingTarget=null;formPrep={};wheelOpen=null;
  if(featOn('smartdefaults')){
    const last=state.brews.filter(x=>x.method===formMethod).sort((a,b)=>b.ts-a.ts)[0];
    if(last){setVal('f-dose',last.dose||'');setVal('f-yield',last.yield||'');setVal('f-ratio',last.ratio||'');
      setVal('f-temp',last.temp||'');setVal('f-grind',last.grind||'');
      // brewer en molen veranderen zelden: die mogen blijven staan
      setVal('f-brewer',last.brewer||'');formMolen=last.grinder||null;}
  }
  renderFormMethods();renderFormBeans();renderFormTags();renderCustomFields();renderDialInHint();renderFormMolens();applyAIVisibility();go('form');
}
function openEdit(b){
  if(!b)return;
  pc.ratio=null;
  editingId=b.id;formMethod=b.method;
  document.getElementById('form-title').textContent='edit brew';
  setVal('f-title',b.title||'');
  setVal('f-dose',b.dose);setVal('f-yield',b.yield);setVal('f-ratio',b.ratio);
  setVal('f-time',b.time);setVal('f-temp',b.temp);setVal('f-notes',b.notes);
  setVal('f-grind',b.grind||'');
  setVal('f-bloom-g',(b.bloom&&b.bloom.g)||'');setVal('f-bloom-s',(b.bloom&&b.bloom.s)||'');
  setVal('f-draw',b.draw||'');setVal('f-brewer',b.brewer||'');
  formMolen=b.grinder||null;molenZelf=!!b.grinder;bloomZelf={g:!!(b.bloom&&b.bloom.g),s:!!(b.bloom&&b.bloom.s)};
  // papier en water hebben geen veld meer; van oudere brews gooien we ze niet weg
  formOud={paper:b.paper||'',water:b.water||''};
  formBed=b.bed||null;formCup=b.cup||null;
  setVal('f-score',b.score||8);
  document.getElementById('score-big').textContent=(+(b.score||8)).toFixed(1);
  formBean=b.beanId||null;formTags=Array.isArray(b.tags)?[...b.tags]:[];wheelOpen=null;
  formCustom=Array.isArray(b.custom)?JSON.parse(JSON.stringify(b.custom)):[];
  pendingTarget=b.target||null;
  formPrep=b.prep?JSON.parse(JSON.stringify(b.prep)):{};
  renderFormMethods();renderFormBeans();renderFormTags();renderCustomFields();renderDialInHint();renderFormMolens();applyAIVisibility();go('form');
}
function renderCustomFields(){
  const el=document.getElementById('custom-fields');if(!el)return;
  el.innerHTML=formCustom.map((c,i)=>
    `<div class="field-row" style="margin-bottom:8px">
      <input value="${esc(c.k)}" placeholder="name" oninput="formCustom[${i}].k=this.value" style="flex:1">
      <input value="${esc(c.v)}" placeholder="value" oninput="formCustom[${i}].v=this.value" style="flex:1">
      <button class="tag-add-btn" onclick="formCustom.splice(${i},1);renderCustomFields()">×</button>
    </div>`).join('');
}
function addCustomField(){formCustom.push({k:'',v:''});renderCustomFields();}
function renderFormMethods(){
  document.getElementById('form-methods').innerHTML=state.methods.filter(m=>m.on).map(m=>
    `<button class="mp ${m.id===formMethod?'sel':''}" onclick="pickMethod('${m.id}')"><span class="mp-ic">${iconHTML(m,30)}</span> ${esc(m.name)}</button>`
  ).join('');
  applyFamilyToForm();
}
// pas het formulier aan de familie (espresso/filter) aan
function applyFamilyToForm(){
  const fam=methodFamily(formMethod);
  const yl=document.getElementById('f-yield-label');
  if(yl)yl.textContent=(fam==='filter')?'water (g)':'yield (g)';
  const rh=document.getElementById('f-ratio-hint');
  if(rh)rh.textContent=(fam==='filter')?'auto-calculates from dose + water':'auto-calculates from dose + yield';
  // puck-prep alleen bij espresso tonen
  const pf=document.getElementById('prep-field');
  if(pf){pf.style.display=(fam==='espresso')?'block':'none';if(fam==='espresso')renderPrep();}
  // bloom alleen bij filter tonen
  const bf=document.getElementById('bloom-field');
  if(bf)bf.style.display=(fam==='filter')?'flex':'none';
  // doorlooptijd, bedvorm, brewer en papier: alleen bij filter
  const kaarten=(fam==='filter')&&!['perculator','senseo'].includes(formMethod)&&featOn('pourcoach')&&recipesFor(formMethod).length>0;
  if(kaarten)kaartenAan(); else kaartenUit();
  // drawdown en bedvorm horen bij een zichtbaar bed (v60, chemex, kalita...):
  // bij AeroPress pers je het weg, dus is er geen bed dat "droogloopt"
  const fx=document.getElementById('filter-extra');
  if(fx)fx.style.display=(fam==='filter'&&featOn('drawdown')&&formMethod!=='aeropress')?'block':'none';
  // brewer en molen horen bij élke brew: een espressomachine met zijn molen
  // net zo goed als een v60 met de zijne
  const fg=document.getElementById('filter-gear');
  if(fg)fg.style.display='block';
  const gl=document.getElementById('f-gear-lbl');
  if(gl)gl.textContent=(fam==='espresso')?'machine & grinder':'brewer & grinder';
  const brv=document.getElementById('f-brewer');
  if(brv)brv.placeholder=(fam==='espresso')?'machine, e.g. Rocket Appartamento':'brewer, e.g. Hario V60 02';
  const ft=document.getElementById('filter-taste');
  if(ft)ft.style.display=(fam==='filter'&&featOn('filtercompass'))?'block':'none';
  if(fam==='filter'){renderBedPick();renderCupPick();}
  renderGearChips();renderFormMolens();vulGearAuto();vulBloomAuto();
  pourInit();
}
/* ---------------- de waterkaart ----------------
   Twee zouten, twee knoppen. 1 g epsomzout in een liter geeft ~406 ppm hardheid
   (als CaCO3), 1 g baksoda ~596 ppm alkaliniteit. Daar reken je gewoon mee
   terug naar het doel dat je intikt.                                      */
const WATER_PER_G_GH=406, WATER_PER_G_KH=596;
const WATER_PRESETS=[
  {id:'filter', n:'filter', gh:70, kh:40, t:'helder en zoet, laat fruitzuren staan'},
  {id:'espresso', n:'espresso', gh:110, kh:60, t:'iets meer buffer tegen scherpe zuren en ketelsteen'},
  {id:'sca', n:'SCA-midden', gh:68, kh:40, t:'het midden van de SCA-band'},
  {id:'zacht', n:'heel zacht', gh:45, kh:20, t:'maximale helderheid, kan dun worden'},
];
function waterPresets(){
  const el=document.getElementById('wt-presets');if(!el)return;
  el.innerHTML=WATER_PRESETS.map(p=>
    `<button type="button" class="lp" onclick="waterPreset('${p.id}')">${esc(p.n)}</button>`).join('');
}
function waterPreset(id){
  const p=WATER_PRESETS.find(x=>x.id===id);if(!p)return;
  setVal('wt-gh',p.gh);setVal('wt-kh',p.kh);waterCalc();
}
function waterCalc(){
  const el=document.getElementById('wt-out');if(!el)return;
  const gh=parseFloat(document.getElementById('wt-gh').value)||0;
  const kh=parseFloat(document.getElementById('wt-kh').value)||0;
  const l=parseFloat(document.getElementById('wt-l').value)||1;
  const eps=(gh/WATER_PER_G_GH)*l, bic=(kh/WATER_PER_G_KH)*l;
  const g=v=>v<0.1?(Math.round(v*1000)+' mg'):(v.toFixed(2).replace('.',',')+' g');
  let waarschuwing='';
  if(kh>gh)waarschuwing='Meer alkaliniteit dan hardheid dempt je zuren sterker dan dat je aroma lostrekt — bij lichte brandingen wil je dat meestal niet.';
  else if(gh>150)waarschuwing='Boven de 150 ppm gaat hardheid maskeren en kalkt je apparaat sneller aan.';
  else if(gh<40)waarschuwing='Onder de 40 ppm valt de body weg: helder, maar vaak ook dun.';
  el.innerHTML=`<div class="wo-l"><span>epsomzout (magnesiumsulfaat)</span><b>${g(eps)}</b></div>
    <div class="wo-l"><span>baksoda (natriumbicarbonaat)</span><b>${g(bic)}</b></div>
    <div class="wo-l"><span>op</span><b>${(l+'').replace('.',',')} liter demiwater</b></div>
    <div class="wt-note">Los ze apart op, roer tot alles weg is, en gebruik dezelfde basis voor elke brew.
      ${waarschuwing?('<br>'+esc(waarschuwing)):''}</div>`;
}
/* ---------------- het filterkompas ----------------
   Twee assen, geen refractometer nodig. Links-rechts is de extractie (die stel
   je bij met de maling), boven-onder de sterkte (die stel je bij met de ratio).
   Wie wel een refractometer heeft mag zijn TDS invullen voor het echte cijfer. */
const FILTER_CUPS=[
  {id:'goed',   n:'just right', nl:'precies goed', fixnl:'niets veranderen', x:0,    y:0,    fix:'keep everything the same',
   why:'nothing to change. Write down your grind so you can find your way back here.'},
  {id:'zuur',   n:'sour & thin', nl:'zuur en dun', fixnl:'een stap FIJNER malen', x:-0.85, y:-0.45, fix:'grind one step finer',
   why:'sour and thin is the signature of under-extraction: the water was through before it had taken enough with it.'},
  {id:'scherp', n:'sharp but strong', nl:'scherp maar stevig', fixnl:'een stap FIJNER malen', x:-0.7, y:0.55, fix:'grind one step finer',
   why:'enough coffee in the cup, but not enough of it dissolved. Finer, and leave the ratio alone.'},
  {id:'vlak',   n:'flat & watery', nl:'vlak en waterig', fixnl:'minder water of meer koffie (ratio), niet de maling', x:0,   y:-0.85, fix:'use less water, or more coffee',
   why:'this is a strength problem, not an extraction one. Move the ratio toward 1:15 before you touch the grind.'},
  {id:'bitter', n:'bitter & dry', nl:'bitter en droog', fixnl:'een stap GROVER malen', x:0.85, y:0.3,  fix:'grind one step coarser',
   why:'you pulled too much out of it. Coarser is the first move; only then look at temperature.'},
  {id:'droog',  n:'astringent', nl:'droog en samentrekkend', fixnl:'GROVER malen, minder roeren, lager gieten', x:0.9,  y:-0.2, fix:'grind coarser and pour gentler',
   why:'that dry, mouth-puckering edge usually comes from fines clogging the bed. Grind coarser, stir less, pour from lower.'},
];
function cupById(id){return FILTER_CUPS.find(c=>c.id===id)||null;}
function renderCupPick(){
  const el=document.getElementById('f-cup');if(!el)return;
  el.innerHTML=FILTER_CUPS.map(c=>
    `<button type="button" class="cup-opt ${formCup===c.id?'sel':''}" onclick="pickCup('${c.id}')">${esc(c.n)}</button>`).join('');
}
function pickCup(id){formCup=(formCup===id)?null:id;renderCupPick();cardSummaries();}
// echte extractie als je een refractometer hebt: het water dat eruit komt is
// het water dat erin ging min wat het koffiebed vasthoudt (~2 g per gram koffie)
function extractionYield(b){
  const tds=parseFloat(b&&b.tds), dose=parseFloat(b&&b.dose), water=parseFloat(b&&b.yield);
  if(!(tds>0&&dose>0&&water>0))return null;
  const uit=water-dose*2;
  if(uit<=0)return null;
  const ey=(tds*uit)/dose;
  return Math.round(ey*10)/10;
}
function setBrewTds(id,v){
  const b=state.brews.find(x=>x.id===id);if(!b)return;
  const n=parseFloat((v||'').replace(',','.'));
  b.tds=(n>0?n:null);save();openDetail(id);
}
function filterCompassHTML(b){
  if(!featOn('filtercompass'))return '';
  const c=cupById(b.cup);
  const ey=extractionYield(b);
  if(!c&&ey==null&&!b.tds)return '';
  // positie: de smaak is leidend, het meetcijfer mag hem verschuiven
  let x=c?c.x:0, y=c?c.y:0;
  if(ey!=null)x=Math.max(-1,Math.min(1,(ey-20)/3));
  if(b.ratio)y=Math.max(-1,Math.min(1,(16-parseFloat(b.ratio))/2.5));
  const px=170+x*100, py=100-y*60;
  let fix=c?c.fix:'', why=c?c.why:'';
  // een trage doorloop bij bitter wijst eerder op een verstopt bed dan op te fijn
  if(c&&(c.id==='bitter'||c.id==='droog')&&parseTimeSec(b.draw)>60)
    why+=' Your drawdown was over a minute, so the bed was choking — that is the part to fix first.';
  if(c&&c.id==='vlak'&&b.ratio&&parseFloat(b.ratio)>16.5)
    why+=' You brewed at 1:'+(+b.ratio).toFixed(1)+'; try 1:15.5 with the same grind.';
  if(ey!=null)why+=' Measured extraction '+ey+' % (the window is 18 to 22 %).';
  return `<div class="notes-card sketch soft fc-card">
    <div class="k">filter compass</div>
    <svg class="fc-svg" viewBox="0 0 300 200" role="img" aria-label="Kompas: extractie horizontaal, sterkte verticaal">
      <path d="M52 22 Q54 100 52 176"/><path d="M44 170 Q150 172 288 169"/>
      <path d="M48 30 L52 20 L57 31"/><path d="M280 163 L290 169 L280 175"/>
      <path d="M130 68 Q170 65 211 69"/><path d="M212 67 Q214 100 211 133"/>
      <path d="M211 132 Q170 136 130 132"/><path d="M129 134 Q126 100 131 66"/>
      <path class="dot" d="M${(px+6).toFixed(1)} ${(py-6).toFixed(1)} Q${(px+9).toFixed(1)} ${py} ${(px+6).toFixed(1)} ${(py+6).toFixed(1)} Q${px} ${(py+9).toFixed(1)} ${(px-6).toFixed(1)} ${(py+6).toFixed(1)} Q${(px-9).toFixed(1)} ${py} ${(px-6).toFixed(1)} ${(py-6).toFixed(1)} Q${px} ${(py-9).toFixed(1)} ${(px+7).toFixed(1)} ${(py-5).toFixed(1)}"/>
      ${(Math.abs(x)>0.25||Math.abs(y)>0.25)?`<path class="arr" d="M${px.toFixed(1)} ${py.toFixed(1)} L${(170-x*22).toFixed(1)} ${(100+y*14).toFixed(1)}"/>`:''}
      <text x="64" y="42">sour &amp; strong</text><text x="215" y="42">bitter &amp; strong</text>
      <text x="64" y="162">sour &amp; thin</text><text x="215" y="162">bitter &amp; dry</text>
      <text x="140" y="104">on target</text>
      <text x="96" y="190">&#8592; under</text><text x="196" y="190">over &#8594;</text>
      <text x="8" y="56">strong</text><text x="16" y="160">thin</text>
    </svg>
    ${fix?'<div class="fc-fix">next time: '+esc(fix)+'</div>':''}
    ${why?'<div class="fc-why">'+esc(why)+'</div>':''}
    <div class="fc-tds">
      <label>got a refractometer? enter TDS %</label>
      <input value="${b.tds!=null?esc(String(b.tds)):''}" placeholder="1.35" inputmode="decimal"
        onchange="setBrewTds('${b.id}',this.value)">
    </div>
  </div>`;
}
/* ---------------- doorlooptijd & het koffiebed ----------------
   Het bed vertelt je iets wat je in geen enkel getal terugziet: een krater
   betekent te hard gegoten, een droge rand betekent dat een deel van je koffie
   niet heeft meegedaan. Allebei gietfouten, geen maalfouten.            */
const BED_SHAPES=[
  {id:'vlak', n:'flat', nl:'vlak', d:'as it should be',
   svg:'<path d="M6 8 Q22 5 38 8"/><path d="M7 8 Q15 23 20 31"/><path d="M37 8 Q29 23 24 31"/><path d="M20 31 Q22 33 24 31"/><path d="M11 18 Q22 15 33 18"/>'},
  {id:'krater', n:'crater', nl:'krater (te hard gegoten)', d:'poured too hard',
   svg:'<path d="M6 8 Q22 5 38 8"/><path d="M7 8 Q15 23 20 31"/><path d="M37 8 Q29 23 24 31"/><path d="M20 31 Q22 33 24 31"/><path d="M11 15 Q17 23 22 24 Q27 23 33 15"/>'},
  {id:'muur', n:'wall', nl:'droge rand blijven staan', d:'dry rim left standing',
   svg:'<path d="M6 8 Q22 5 38 8"/><path d="M7 8 Q15 23 20 31"/><path d="M37 8 Q29 23 24 31"/><path d="M20 31 Q22 33 24 31"/><path d="M10 12 Q16 21 22 21 Q28 21 34 12"/><path d="M11 11 Q12 15 13 17"/><path d="M33 11 Q32 15 31 17"/>'},
];
function renderBedPick(){
  const el=document.getElementById('f-bed');if(!el)return;
  el.innerHTML=BED_SHAPES.map(b=>
    `<button type="button" class="bed-opt ${formBed===b.id?'sel':''}" onclick="pickBed('${b.id}')">
      <svg viewBox="0 0 44 34">${b.svg}</svg>
      <span class="bo-n">${esc(b.n)}</span><span class="bo-d">${esc(b.d)}</span>
    </button>`).join('');
}
function pickBed(id){formBed=(formBed===id)?null:id;renderBedPick();}
function bedName(id){const b=BED_SHAPES.find(x=>x.id===id);return b?b.n:'';}
function bedNL(id){const b=BED_SHAPES.find(x=>x.id===id);return b?(b.nl||b.n):'';}
// snelkiezers uit je gear-lijst, zodat je een merk niet elke keer overtypt.
// molens staan hier niet tussen: die hebben hun eigen rij, want zij horen bij
// de maalstand en niet bij de brewer.
function renderGearChips(){
  const el=document.getElementById('f-gearchips');if(!el)return;
  el.innerHTML=gearVoor(formMethod).filter(g=>g.kind!=='grinder').map(g=>
    `<button type="button" class="lp" onclick="fillGear(${jsArg(g.name)})">${esc(g.name)}</button>`).join('');
}
function fillGear(naam){
  const br=document.getElementById('f-brewer');
  if(br)br.value=naam;
  cardSummaries();
}
/* De molen bij deze brew. Een maalstand zonder molen zegt niets -- 1.3 op de
   ene molen is grof en op de andere fijn -- dus kies je hem hier aan, en het
   maalbereik uit gear komt onder het maalstandveld te staan.               */
function molensVoor(mid){
  const bij=gearVoor(mid).filter(g=>g.kind==='grinder');
  return bij.length?bij:(state.gear||[]).filter(g=>g.kind==='grinder');
}
function renderFormMolens(){
  const el=document.getElementById('f-molens');if(!el)return;
  const lijst=molensVoor(formMethod), note=document.getElementById('f-molen-note');
  if(formMolen&&!lijst.some(g=>g.name===formMolen))formMolen=null;
  if(!formMolen&&!molenZelf&&lijst.length===1)formMolen=lijst[0].name;
  el.innerHTML=lijst.map(g=>
    `<button type="button" class="lp ${g.name===formMolen?'sel':''}" onclick="pickFormMolen(${jsArg(g.name)})">${esc(g.name)}</button>`).join('');
  if(note)note.textContent=lijst.length?'':
    'no grinder in your gear yet — add one under profile → gear with its grind range';
  renderGrindNote();
}
function pickFormMolen(naam){
  formMolen=(formMolen===naam)?null:naam;molenZelf=true;
  renderFormMolens();cardSummaries();
}
/* ---- de opzet die je al kent ----
   Je kiest een boon en een methode; daarmee ligt de rest grotendeels vast.
   Welke brewer? Die staat er al: v60 is de v60. Welke molen? De enige die
   je aan deze methode hebt gehangen, of die van je vorige brew ermee.
   Alleen lege velden worden gevuld, en zodra je zelf iets kiest houdt de app
   zijn mond -- automatisch invullen mag nooit je eigen keuze overschrijven. */
function laatsteBrewVoor(mid){
  return state.brews.filter(x=>x.method===mid).sort((a,b)=>b.ts-a.ts)[0]||null;
}
function vulGearAuto(){
  const mid=formMethod, m=methodById(mid);
  const laatste=laatsteBrewVoor(mid);
  const br=document.getElementById('f-brewer');
  if(br&&!br.value.trim()){
    const brewers=gearVoor(mid).filter(g=>g.kind==='brewer');
    const eerder=laatste&&laatste.brewer;
    // bij filter is de methode het apparaat: een v60 brouw je in een v60. Bij
    // espresso niet -- "espresso" is geen machine, dus daar blijft het leeg
    const uitMethode=(methodFamily(mid)==='filter'&&m&&m.name)||'';
    br.value=(eerder&&(!brewers.length||brewers.some(g=>g.name===eerder))?eerder:'')
      ||(brewers.length===1?brewers[0].name:'')
      ||uitMethode;
  }
  if(!formMolen&&!molenZelf){
    const molens=molensVoor(mid);
    const eerder=laatste&&laatste.grinder;
    if(eerder&&molens.some(g=>g.name===eerder))formMolen=eerder;
    else if(molens.length===1)formMolen=molens[0].name;
  }
  renderFormMolens();
}
/* De versheid van de boon zegt hoeveel gas erin zit, en dus hoe groot en hoe
   lang je bloom moet zijn. Die stond al als tekst in de bean-kaart; nu staat
   hij ook gewoon in de velden, zodat je hem niet hoeft over te typen.      */
let bloomZelf={g:false,s:false};
function bloomHandmatig(veld){bloomZelf[veld]=true;}
function vulBloomAuto(){
  if(methodFamily(formMethod)!=='filter')return;
  const bean=beanById(formBean);
  const f=bean?beanFreshness(bean):null;
  const h=f?freshBloomHint(f.days):null;
  if(!h)return;
  const dose=parseFloat(document.getElementById('f-dose').value)||0;
  const g=document.getElementById('f-bloom-g'), s=document.getElementById('f-bloom-s');
  if(g&&dose&&!bloomZelf.g)g.value=Math.round(dose*h.mult);
  if(s&&!bloomZelf.s)s.value=h.sec;
}
// het bereik van de gekozen molen, pal onder het maalstandveld
function renderGrindNote(){
  const el=document.getElementById('f-grind-note');if(!el)return;
  const g=(state.gear||[]).find(x=>x.kind==='grinder'&&x.name===formMolen);
  if(!g){el.style.display='none';el.textContent='';return;}
  el.style.display='';
  el.textContent=(g.grindMin!=null&&g.grindMax!=null)
    ? ('on your '+g.name+' — '+g.grindMin+' to '+g.grindMax)
    : ('on your '+g.name);
}
/* ---------------- het receptenboek ----------------
   De klassiekers staan hier, niet in de coach: kiezen doe je vooraf, gieten
   doe je daarna. Aantikken zet het recept klaar en opent New brew.       */
// bij welke van jouw methodes hoort dit recept?
function methodForRecipe(r){
  if(!r)return null;
  const aan=state.methods.filter(m=>m.on&&methodFamily(m)===recipeFam(r));
  if(r.mid&&aan.find(m=>m.id===r.mid))return r.mid;
  for(const v of (r.voor||[])){
    const m=aan.find(x=>x.id===v||(x.name||'').toLowerCase().includes(v));
    if(m)return m.id;
  }
  return (aan[0]||{}).id||null;
}
/* ---------------- eigen recepten ----------------
   Een recept is een lijstje stappen. Je vult ze zelf in of laat de AI een
   voorstel doen; in beide gevallen sta jij erin met de hand. Intern bewaren we
   elk gietdoel als deel van het totaal, zodat het meeschaalt als je een andere
   dose gebruikt dan waarmee je het opschreef.                              */
const STAP_SOORTEN=['bloom','giet','swirl','roer','wacht','keer','pers','doorloop','dose','shot','stop','melk'];
/* Zet je omgekeerd, dan is er precies één moment dat er echt iets gebeurt: het
   omkeren. Dat moet je niet hoeven lezen -- je moet het zien. */
const HOUDINGEN=[
  {v:'normaal', n:'regular',
   u:'kopje eronder, het water werkt meteen door het filter \u2014 deels percolatie: '+
     'schoner en dunner, maar je hebt de weektijd niet in de hand'},
  {v:'omgekeerd', n:'inverted',
   u:'op de zuiger, er loopt niets door tot jij omkeert \u2014 volle immersie: '+
     'meer zoet, body en herhaalbaarheid, iets minder definitie'},
];
function isAeropress(mid){return brewerArtKey(mid)==='aeropress';}
/* Een Hario Switch is een V60 met een klep onderin. Dicht = het water blijft
   staan (immersie: zoet en body), open = het loopt door (percolatie: helderheid).
   De klep is dus geen aparte stap maar een stand die pér stap geldt. */
function isSwitch(mid){return brewerArtKey(mid)==='switch';}
const KLEP_STANDEN=[
  {v:'',      n:'klep —'},
  {v:'dicht', n:'klep dicht'},
  {v:'open',  n:'klep open'},
];
/* dicht = een gesloten poortje met het water erbovenop, open = het poortje
   staat uit elkaar en de druppel valt erdoor. Geen plusje, geen minnetje. */
const KLEP_ICOON={
  dicht:'<svg viewBox="0 0 24 24" aria-hidden="true">'+
    '<path d="M12 3.4 Q16 8.6 12.2 12 Q8.2 8.8 11.9 3.6"/>'+
    '<path d="M3.6 15.4 Q12 14.4 20.4 15.5"/></svg>',
  open:'<svg viewBox="0 0 24 24" aria-hidden="true">'+
    '<path d="M3.6 8.4 Q6.4 7.9 8.8 8.3"/><path d="M15.2 8.3 Q17.8 7.9 20.4 8.4"/>'+
    '<path d="M12 12.4 Q16 17.6 12.2 21 Q8.2 17.8 11.9 12.6"/></svg>',
};
/* een omdraaiend pijltje, met de hand getekend zoals de rest */
const PIJL_OM='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 9.4 Q6.4 4.6 11.6 4.1 Q17 3.9 18.7 8.6"/>'+
  '<path d="M18.9 4.6 Q19 7.6 18.8 8.9 Q16.6 9 14.4 8.7"/>'+
  '<path d="M18.8 14.6 Q17.6 19.4 12.4 19.9 Q7 20.1 5.3 15.4"/>'+
  '<path d="M5.1 19.4 Q5 16.4 5.2 15.1 Q7.4 15 9.6 15.3"/></svg>';
let recBewerk=null;      // {id, mid, stappen:[{t,g,k,d}]}
let recTerug=null;       // waar je vandaan kwam: daar hoor je na het opslaan weer
let recVers=null;        // net geschreven recept; dat mag het formulier overschrijven
function openRecipe(id,mid){
  recTerug=currentPage;
  const best=id?recipeById(id):null;
  const methode=mid||(best&&best.mid)||formMethod||
    (state.methods.filter(m=>m.on&&methodFamily(m)==='filter')[0]||{}).id;
  if(best&&best.eigen){
    const water=Math.round(best.dose*best.ratio);
    recBewerk={id:best.id,mid:best.mid,beanId:best.beanId||null,
      stappen:(Array.isArray(best.stappen)?best.stappen:[]).map(x=>({t:x.t,g:x.p?Math.round(water*x.p):'',k:x.k,klep:x.klep||'',d:x.d}))};
    setVal('rec-naam',best.naam);setVal('rec-dose',best.dose);setVal('rec-water',water);
    setVal('rec-temp',best.temp);setVal('rec-maling',best.maling);setVal('rec-over',best.over||'');
    setVal('rec-stand',best.stand||'');setVal('rec-tijd',best.tijd||'');recBewerk.molen=best.molen||null;
    recBewerk.houding=best.houding||'normaal';
  }else{
    // beginnen vanaf het recept dat nu geselecteerd staat, scheelt overtypen
    const basis=best||recipeById((state.lastRecipe||{})[methode])||recipesFor(methode)[0];
    const water=basis?Math.round(basis.dose*basis.ratio):250;
    recBewerk={id:null,mid:methode,
      stappen:basis?basis.stappen.map(x=>({t:x.t,g:x.p?Math.round(water*x.p):'',k:x.k,klep:x.klep||'',d:x.d})):[]};
    setVal('rec-naam',basis?('my '+basis.naam.toLowerCase()):'my brew idea');
    setVal('rec-dose',basis?basis.dose:15);setVal('rec-water',water);
    setVal('rec-temp',basis?basis.temp:94);setVal('rec-maling',basis?basis.maling:'medium');
    setVal('rec-over','');
    // maalstand overnemen: eerst uit het basisrecept, anders uit je laatste brew
    const vorige=state.brews.filter(x=>x.method===methode&&x.grind).sort((a,b)=>b.ts-a.ts)[0];
    setVal('rec-stand',(basis&&basis.stand)||(vorige?vorige.grind:''));
    setVal('rec-tijd',(basis&&basis.tijd)||'');
    recBewerk.molen=(basis&&basis.molen)||(filterMolens()[0]||{}).name||null;
    recBewerk.houding=(basis&&basis.houding)||'normaal';
  }
  document.getElementById('rec-title').textContent=(best&&best.eigen)?'edit brew idea':'own brew idea';
  document.getElementById('rec-del').style.display=(best&&best.eigen)?'block':'none';
  recOnthoud();
  recMethods();recMolens();recHouding();recSteps();applyAIVisibility();
  const ai=document.getElementById('rec-ai');
  if(ai)ai.style.display='';
  go('recipe');
}
// je filtermolens uit de gear-lijst, zodat de maalstand bij een molen hoort
function filterMolens(){
  const mid=(recBewerk&&recBewerk.mid)||formMethod;
  const bij=gearVoor(mid).filter(g=>g.name);
  return bij.length?bij:(state.gear||[]).filter(g=>g.name&&(g.category==='filter'||g.category==='algemeen'));
}
function recMolens(){
  const el=document.getElementById('rec-molens');if(!el)return;
  const lijst=filterMolens();
  const note=document.getElementById('rec-stand-note');
  if(!lijst.length){
    el.innerHTML='';
    if(note)note.textContent='the number you actually dial \u2014 add your grinder under profile \u2192 gear and the AI can name it';
    return;
  }
  el.innerHTML=lijst.map(g=>
    `<button class="lp ${recBewerk&&recBewerk.molen===g.name?'sel':''}" onclick="recPickMolen(${jsArg(g.name)})">${esc(g.name)}</button>`).join('');
  if(note)note.textContent='the number you actually dial \u2014 tap which grinder it belongs to';
}
function recPickMolen(naam){
  recBewerk.molen=(recBewerk.molen===naam)?null:naam;recMolens();
}
/* Normaal of omgekeerd -- alleen bij een aeropress, want alleen daar bestaat de
   keuze. Kies je omgekeerd, dan hoort er een keer-stap in het schema; die zetten
   we erin als hij er nog niet staat, vlak voor het persen. */
function recHouding(){
  const veld=document.getElementById('rec-houding-veld');if(!veld)return;
  const aan=isAeropress(recBewerk.mid);
  veld.style.display=aan?'block':'none';
  if(!aan)return;
  if(!recBewerk.houding)recBewerk.houding='normaal';
  document.getElementById('rec-houding').innerHTML=HOUDINGEN.map(h=>
    '<button class="lp '+(recBewerk.houding===h.v?'sel':'')+'" onclick="recPickHouding(\''+h.v+'\')">'+
    h.n+'</button>').join('');
  const h=HOUDINGEN.find(x=>x.v===recBewerk.houding)||HOUDINGEN[0];
  document.getElementById('rec-houding-note').textContent=h.u;
}
function recPickHouding(v){
  recBewerk.houding=v;
  const heeft=recBewerk.stappen.some(x=>x.k==='keer');
  if(v==='omgekeerd'&&!heeft){
    // vlak voor de eerste pers, of anders achteraan
    const i=recBewerk.stappen.findIndex(x=>x.k==='pers');
    const t=(i>0)?recBewerk.stappen[i-1].t+10:(recBewerk.stappen.length?
      recBewerk.stappen[recBewerk.stappen.length-1].t+10:60);
    recBewerk.stappen.push({t,g:'',k:'keer',d:'Zet je kopje erop en keer hem in één beweging om.'});
    recBewerk.stappen.sort((a,b)=>a.t-b.t);
  }
  if(v==='normaal')recBewerk.stappen=recBewerk.stappen.filter(x=>x.k!=='keer');
  recHouding();recSteps();
}
function recMethods(){
  const el=document.getElementById('rec-methods');if(!el)return;
  el.innerHTML=state.methods.filter(m=>m.on).map(m=>
    `<button class="lp ${m.id===recBewerk.mid?'sel':''}" onclick="recPickMethod('${m.id}')">${esc(m.name)}</button>`).join('')
    ||'<span class="rec-empty">turn on a method under methods first</span>';
  recFamilie();
}
function recPickMethod(id){
  recBewerk.mid=id;recMethods();recMolens();recHouding();recSteps();
  const ai=document.getElementById('rec-ai');
  if(ai)ai.style.display='';
}
// bij espresso heet het water een yield, en hoort er een doeltijd bij
function recFamilie(){
  const esp=methodFamily(recBewerk.mid)==='espresso';
  const l=document.getElementById('rec-water-lbl');
  if(l)l.textContent=esp?'yield (g)':'water (g)';
  const t=document.getElementById('rec-tijd-veld');
  if(t)t.style.display=esp?'block':'none';
  const note=document.getElementById('rec-stand-note');
  if(note&&esp)note.textContent='the number you actually dial on your espresso grinder';
}
/* Wat bovenaan staat, werkt door in het schema eronder: niets twee keer invullen.
   - dose gewijzigd: het water loopt mee met de verhouding die er stond, en het
     schema schaalt mee (net als "own ratio or yield" in de gietcoach);
   - water gewijzigd: de verhouding volgt, het schema schaalt mee, zodat de
     laatste giet altijd het totale water is;
   - de laatste giet in het schema aangepast: dat is het totale water bovenaan;
   - temp of doeltijd gewijzigd: staat die in een staptekst, dan verandert hij mee. */
const recNum=id=>parseFloat((document.getElementById(id)||{}).value);
// de laatste stap met grammen (in tijdvolgorde): dat is het totale water
function recLaatsteGiet(){
  if(!recBewerk)return -1;
  let best=-1,t=-1;
  recBewerk.stappen.forEach((st,i)=>{if(st.g!==''&&st.g!=null&&+st.g>0&&(st.t||0)>=t){best=i;t=st.t||0;}});
  return best;
}
function recSchaal(water){
  if(!recBewerk||!(water>0))return;
  const i=recLaatsteGiet();if(i<0)return;
  const oud=+recBewerk.stappen[i].g;if(!(oud>0)||oud===water)return;
  const f=water/oud;
  // niet afronden bij het schalen: tikken (2, 25, 250) mag geen grammen kwijtraken; het veld toont afgerond
  recBewerk.stappen.forEach(st=>{if(st.g!==''&&st.g!=null&&+st.g>0)st.g=+st.g*f;});
  recBewerk.stappen[i].g=water;
  recSteps();
}
function recWater(){
  // dose gewijzigd: water mee met de verhouding die er stond
  if(!recBewerk)return;
  const d=recNum('rec-dose');
  if(!(recBewerk.ratio>0)){const w0=recNum('rec-water'),d0=recBewerk.doseWas;if(w0>0&&d0>0)recBewerk.ratio=w0/d0;}
  if(d>0&&recBewerk.ratio>0){const w=Math.round(d*recBewerk.ratio);setVal('rec-water',w);recSchaal(w);}
  if(d>0)recBewerk.doseWas=d;
}
function recRatio(){
  // water gewijzigd: verhouding volgt, schema schaalt mee
  if(!recBewerk)return;
  const d=recNum('rec-dose'),w=recNum('rec-water');
  if(d>0&&w>0)recBewerk.ratio=w/d;
  if(w>0)recSchaal(w);
}
// een waarde die in de staptekst staat (93°C, 0:28) mee laten veranderen
function recTekstMee(veld,oud,nieuw){
  if(!recBewerk||!oud||!nieuw||oud===nieuw)return;
  const esc2=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const re=veld==='temp'?new RegExp('(^|[^\\d.,])'+esc2(oud)+'(\\s?\u00b0\\s?C)','g'):new RegExp('(^|[^\\d:])'+esc2(oud)+'(?![\\d])','g');
  let anders=false;
  recBewerk.stappen.forEach(st=>{if(typeof st.d==='string'){const n=st.d.replace(re,(m,a,b)=>a+nieuw+(b||''));if(n!==st.d){st.d=n;anders=true;}}});
  if(anders)recSteps();
}
function recTemp(){
  if(!recBewerk)return;
  const v=String((document.getElementById('rec-temp')||{}).value||'').trim();
  if(/^\d{2,3}(?:[.,]\d)?$/.test(v)){recTekstMee('temp',recBewerk.tempWas,v);recBewerk.tempWas=v;}
}
function recTijd(){
  if(!recBewerk)return;
  const v=String((document.getElementById('rec-tijd')||{}).value||'').trim();
  if(/^\d{1,2}:\d{2}$/.test(v)){recTekstMee('tijd',recBewerk.tijdWas,v);recBewerk.tijdWas=v;}
}
// beginwaarden onthouden, zodat een wijziging weet wat er eerst stond
function recOnthoud(){
  if(!recBewerk)return;
  const d=recNum('rec-dose'),w=recNum('rec-water');
  recBewerk.doseWas=d>0?d:null;recBewerk.ratio=d>0&&w>0?w/d:null;
  recBewerk.tempWas=String((document.getElementById('rec-temp')||{}).value||'').trim();
  recBewerk.tijdWas=String((document.getElementById('rec-tijd')||{}).value||'').trim();
}
function recSteps(){
  const el=document.getElementById('rec-steps');if(!el)return;
  const klep=isSwitch(recBewerk.mid);   // alleen een Switch heeft een klep
  if(!recBewerk.stappen.length){el.innerHTML='<div class="rec-empty">no steps yet &mdash; add one, or let AI draft it</div>';return;}
  el.innerHTML=recBewerk.stappen.map((st,i)=>`<div class="rec-row">
    <div class="r-t"><input value="${esc(pourFmt(st.t||0))}" inputmode="numeric" placeholder="0:00"
      oninput="formatTime(this)" onblur="recSet(${i},'t',this.value)"></div>
    <div class="r-mid">
      <div class="r-rij">
        <select onchange="recSet(${i},'k',this.value)">
          ${STAP_SOORTEN.map(k=>`<option value="${k}" ${st.k===k?'selected':''}>${k}</option>`).join('')}
        </select>
        ${klep?`<select class="r-klep" onchange="recSet(${i},'klep',this.value)">
          ${KLEP_STANDEN.map(o=>`<option value="${o.v}" ${(st.klep||'')===o.v?'selected':''}>${o.n}</option>`).join('')}
        </select>`:''}
      </div>
      <input value="${esc(st.d||'')}" placeholder="what do you do?" oninput="recSet(${i},'d',this.value)">
    </div>
    <div class="r-g"><input value="${st.g===''||st.g==null?'':Math.round(st.g)}" type="number" inputmode="numeric"
      placeholder="&mdash;" oninput="recSet(${i},'g',this.value)"></div>
    <button class="r-x" onclick="recDel(${i})" title="remove" aria-label="remove step">&times;</button>
  </div>`).join('');
}
function recSet(i,veld,v){
  const st=recBewerk.stappen[i];if(!st)return;
  if(veld==='t')st.t=parseTimeSec(v)||0;
  else if(veld==='g'){
    const laatste=recLaatsteGiet()===i;
    st.g=(v===''?'':(parseFloat(v)||0));
    // de laatste giet is het totale water: bovenaan meeschrijven, niet twee keer vragen
    if(laatste&&st.g>0){setVal('rec-water',st.g);const d=recNum('rec-dose');if(d>0)recBewerk.ratio=st.g/d;}
  }
  else st[veld]=v;
  if(veld==='t')recSteps();   // opnieuw tekenen zodat de tijd netjes staat
}
function recAdd(){
  const laatste=recBewerk.stappen[recBewerk.stappen.length-1];
  recBewerk.stappen.push({t:(laatste?laatste.t+30:0),g:'',k:'giet',d:''});
  recSteps();
}
function recDel(i){recBewerk.stappen.splice(i,1);recSteps();}
function cancelRecipe(){const t=recTerug;recBewerk=null;recTerug=null;goBack(t||'recipes');}
/* Terug naar het formulier met dit recept in de hand: pc.mid leegmaken laat
   pourInit opnieuw opbouwen, en recVers zorgt dat de getallen die je net
   opschreef het formulier ook echt vullen. Dat is het hele punt -- wat in de
   receptkaart staat, staat daarna in the pour.                            */
function terugNaarBrew(rid){
  pc.mid=null;recVers=rid||null;
  go('form');renderFormMethods();
  pcOpen={recipe:false,bean:false,gear:false,pour:true,log:false};renderCards();
}
function saveRecipe(){
  const naam=(document.getElementById('rec-naam').value||'').trim();
  const dose=parseFloat(document.getElementById('rec-dose').value);
  const water=parseFloat(document.getElementById('rec-water').value);
  if(!naam){toast('give it a name');return;}
  if(!(dose>0&&water>0)){toast('fill in dose and water');return;}
  if(!recBewerk.stappen.length){toast('add at least one step');return;}
  const stappen=recBewerk.stappen.slice().sort((a,b)=>a.t-b.t).map(st=>({
    t:st.t||0, p:(st.g===''||st.g==null)?0:Math.max(0,Math.min(1.5,st.g/water)),
    k:st.k||'giet', klep:(isSwitch(recBewerk.mid)&&st.klep)||null,
    d:(st.d||'').trim()||st.k||'giet'}));
  const r={id:recBewerk.id||('r_'+uid().slice(0,6)),eigen:true,mid:recBewerk.mid,
    fam:methodFamily(recBewerk.mid),
    tijd:(document.getElementById('rec-tijd').value||'').trim(),
    beanId:recBewerk.beanId||null,naam,dose,ratio:water/dose,temp:parseFloat(document.getElementById('rec-temp').value)||94,
    maling:(document.getElementById('rec-maling').value||'').trim()||'medium',
    stand:(document.getElementById('rec-stand').value||'').trim(),
    molen:recBewerk.molen||null,
    houding:isAeropress(recBewerk.mid)?(recBewerk.houding||'normaal'):null,
    over:(document.getElementById('rec-over').value||'').trim()||'your own schedule',
    voor:[recBewerk.mid],stappen};
  if(!Array.isArray(state.recipes))state.recipes=[];
  const i=state.recipes.findIndex(x=>x.id===r.id);
  if(i>=0)state.recipes[i]=r;else state.recipes.push(r);
  if(!state.lastRecipe)state.lastRecipe={};
  state.lastRecipe[r.mid]=r.id;
  save();toast('\u2713 brew idea saved');
  const terug=recTerug;recBewerk=null;recTerug=null;
  if(terug==='form')terugNaarBrew(r.id);
  else if(terug==='dialin'){pendingTarget={dose:String(r.dose),yield:String(Math.round(r.dose*r.ratio)),time:r.tijd||'',grind:r.stand||''};go('dialin');renderDiGoal();}
  else{pc.mid=null;go('recipes');}
}
function delRecipe(){
  if(!recBewerk||!recBewerk.id)return;
  if(!confirm('delete this brew idea?'))return;
  state.recipes=(state.recipes||[]).filter(x=>x.id!==recBewerk.id);
  const mid=recBewerk.mid;
  if(state.lastRecipe&&state.lastRecipe[mid]===recBewerk.id)delete state.lastRecipe[mid];
  const terug=recTerug;
  save();toast('brew idea deleted');recBewerk=null;recTerug=null;pc.mid=null;
  if(terug==='form')terugNaarBrew(null);else go('recipes');
}
/* De AI schrijft het schema, jij houdt de pen. Alles komt in dezelfde lijst
   terecht, dus elke regel blijft daarna aan te passen.                     */
async function aiRecipeSchema(){
  const btn=document.getElementById('rec-ai');
  const m=methodById(recBewerk.mid);
  const bean=beanById(formBean);
  const dose=parseFloat(document.getElementById('rec-dose').value)||15;
  const water=parseFloat(document.getElementById('rec-water').value)||Math.round(dose*16);
  const molen=recBewerk.molen||((filterMolens()[0]||{}).name)||'';
  const oud=btn.textContent;
  btn.textContent='AI is thinking\u2026';btn.disabled=true;
  try{
    const prompt='Je bent een specialty-barista. Maak een giet-schema voor de filtermethode "'+
      (m?m.name:'v60')+'" met '+dose+' g koffie en '+water+' g water'+
      (bean?(' voor de boon '+bean.name+' ('+[bean.origin,bean.process,bean.roasternotes].filter(Boolean).join(', ')+')'):'')+
      '.'+gearPromptBlock(recBewerk.mid)+beanPromptBlock(bean)+'\n'+APP_RULES+'\n'+FILTER_RULES+'\n'+SCHEMA_RULES+'\n'+
      (molen?('De gebruiker maalt met: '+molen+'. Geef de maalstand in de schaal van die molen (klikken of getal) en noem geen andere molen.\n'):'')+
      'Geef ALLEEN JSON zonder markdown: {"temp":93,"maling":"medium","stand":"","over":"","stappen":[{"t":"0:00","k":"bloom","g":45,"d":""}]}. '+
      (isSwitch(recBewerk.mid)?'Zet bij ELKE stap ook "klep":"dicht" of "klep":"open". ':'')+
      'maling = omschrijving in woorden (bijvoorbeeld medium-grof). stand = KORTE maalstand voor het invulveld'+
      (molen?(' op de '+molen):'')+' (alleen een getal of klikken, GEEN uitleg en GEEN merknaam). '+
      't = tijd vanaf start als mm:ss. k = een van: '+STAP_SOORTEN.join(', ')+'. '+
      'g = het TOTAAL aan water dat er na die stap in zit (dus oplopend, laatste giet = '+water+'); '+
      'laat g weg bij een stap waarbij je niet giet. d = korte instructie in het Nederlands, max 12 woorden, '+
      'ZONDER gramgetallen -- het aantal gram staat al in g en wordt ernaast getoond. '+
      'Vier tot zeven stappen, eindig met een doorloop-stap. over = \u00e9\u00e9n korte zin over dit recept.'+
      (isSwitch(recBewerk.mid)?('\nDeze zetter is een Hario Switch: een V60 met een klep onderin. '+
        'Klep DICHT = het water blijft staan (immersie: meer zoet, meer body, vergevingsgezinder). '+
        'Klep OPEN = het loopt door (percolatie: meer helderheid en definitie). De klep is een stand, '+
        'geen aparte stap: geef bij elke stap de stand die er tijdens die stap geldt. Het gangbare '+
        'recept houdt hem dicht voor de bloom en een weekfase en opent hem daarna om leeg te laten '+
        'lopen; open beginnen en aan het eind sluiten mag ook, dat wordt romiger maar minder scherp. '+
        'Zorg dat hij aan het eind OPEN staat, anders loopt de koffie nooit in de kop.'):'')+
      (isAeropress(recBewerk.mid)?('\nDeze zetter staat '+
        (recBewerk.houding==='omgekeerd'?'OMGEKEERD':'NORMAAL')+'. '+
        (recBewerk.houding==='omgekeerd'
          ? 'Bij omgekeerd staat hij op de zuiger en loopt er niets door tot jij hem omdraait: dat is '+
            'volle IMMERSIE. Alle koffie krijgt precies dezelfde contacttijd, wat meer zoet, meer body '+
            'en een herhaalbaarder kop geeft, maar iets minder definitie \u2014 het fijne onderscheid '+
            'vlakt af. Speel dus met de weektijd in plaats van met het gietschema, en houd de maling '+
            'aan de grovere kant om bitterheid te voorkomen. Zet \u00e9\u00e9n stap met k="keer" op '+
            'het moment dat het filterdopje erop gaat en hij op het kopje wordt omgekeerd, en laat het '+
            'persen daarna volgen. Geef die stap geen g.'
          : 'Bij normaal staat hij op het kopje en werkt het water vanaf de eerste seconde door het '+
            'filter: deels PERCOLATIE. De kop wordt schoner en dunner, met meer nadruk op de lichte, '+
            'vluchtige smaken, maar je hebt de weektijd minder in de hand en onderextractie ligt op de '+
            'loer. Houd het daarom kort en werk liever met een iets fijnere maling dan met lang wachten. '+
            'Gebruik GEEN keer-stap.')):'');
    const d=extractJSON(await askAI([{role:'user',content:prompt}],900,'brew'));
    if(d.temp)setVal('rec-temp',d.temp);
    if(d.maling)setVal('rec-maling',d.maling);
    if(d.stand)setVal('rec-stand',conciseGrind(d.stand));
    if(d.over)setVal('rec-over',d.over);
    const rijen=(Array.isArray(d.stappen)?d.stappen:[]).map(x=>({
      t:parseTimeSec(String(x.t||'0:00'))||0,
      g:(x.g==null||x.g==='')?'':Math.round(parseFloat(x.g)||0),
      k:STAP_SOORTEN.includes(x.k)?x.k:'giet',
      klep:(isSwitch(recBewerk.mid)&&['open','dicht'].includes(x.klep))?x.klep:'',
      d:(x.d||'').trim()}));
    if(!rijen.length)throw new Error('geen stappen');
    recBewerk.stappen=rijen.sort((a,b)=>a.t-b.t);
    recSteps();toast('\u2713 draft filled in \u2014 change what you want');
  }catch(e){
    toast('AI not available \u2014 enter your key under profile');
  }
  btn.textContent=oud;btn.disabled=false;
}
/* ---------------- getekende zetters ----------------
   Wat de E61 voor espresso doet, doet dit voor filter: je ziet het water
   stijgen terwijl de klok loopt. De vulling zit in een eigen groep buiten het
   dubbel getrokken lijnwerk, zodat animatie en tekening elkaar niet raken. */
const BREWER_ART={
  /* Jesse's eigen tekening (m-v60.png) als masker in de inktkleur; waterstand in de clip */
  v60:{h:32,l:110,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M59 32 L181 32 L138 110 L107 110 Z"/></clipPath><mask id="bw-m" style="mask-type:alpha"><image href="m-v60.png" x="41.9" y="5" width="174.2" height="214.0"/></mask></defs><g id="bw-stream" class="bw-stream"><path d="M120 -4 Q122 16 120 30"/><path class="b" d="M123 0 Q121 16 123 28"/></g><rect id="bw-fill" x="40" y="110" width="160" height="0" clip-path="url(#bw-clip)"/><rect class="inkt" x="40.9" y="4" width="176.2" height="216.0" mask="url(#bw-m)"/></svg>'},
  /* Jesse's eigen tekening (m-chemex.png) als masker in de inktkleur; waterstand in de clip */
  chemex:{h:50,l:89,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M70 50 L170 50 L148 89 L103 89 Z"/></clipPath><mask id="bw-m" style="mask-type:alpha"><image href="m-chemex.png" x="62.6" y="5" width="120.7" height="214.0"/></mask></defs><g id="bw-stream" class="bw-stream"><path d="M120 -4 Q122 25 120 48"/><path class="b" d="M123 0 Q121 25 123 46"/></g><rect id="bw-fill" x="40" y="89" width="160" height="0" clip-path="url(#bw-clip)"/><rect class="inkt" x="61.6" y="4" width="122.7" height="216.0" mask="url(#bw-m)"/></svg>'},
  kalita:{h:58,l:142,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M56 58 L184 58 L150 142 L90 142 Z"/></clipPath></defs><g id="bw-stream" class="bw-stream"><path d="M120 6 Q122 26 120 44"/><path class="b" d="M123 10 Q121 28 123 42"/></g><rect id="bw-fill" x="50" y="142" width="140" height="0" clip-path="url(#bw-clip)"/><path d="M46 52 Q120 43 194 53"/><path class="b" d="M50 56 Q120 48 190 57"/><path d="M52 55 Q68 102 86 146"/><path class="b" d="M56 57 Q71 103 88 148"/><path d="M188 56 Q172 102 154 146"/><path class="b" d="M184 58 Q169 103 152 148"/><path d="M84 146 Q120 152 156 146"/><path class="b" d="M88 149 Q120 154 152 149"/><path class="soft2" d="M62 68 Q70 104 82 140"/><path class="soft2" d="M92 64 Q94 102 98 140"/><path class="soft2" d="M148 64 Q146 102 142 140"/><path class="soft2" d="M178 68 Q170 104 158 140"/><path class="bed" d="M74 94 Q120 87 166 95"/><path d="M72 164 Q120 157 168 165"/><path class="b" d="M76 168 Q120 162 164 168"/><path d="M74 166 Q78 194 88 206"/><path d="M166 166 Q162 194 152 206"/><path d="M86 205 Q120 213 154 205"/><path class="b" d="M92 208 Q120 213 148 208"/></svg>'},
  /* Jesse's eigen tekening (m-aeropress.png) als masker in de inktkleur; waterstand in de clip */
  aeropress:{h:79,l:195,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M90 79 L150 79 L150 195 L90 195 Z"/></clipPath><mask id="bw-m" style="mask-type:alpha"><image href="m-aeropress.png" x="69.5" y="5" width="103.5" height="214.0"/></mask></defs><g id="bw-stream" class="bw-stream"><path d="M120 -4 Q122 39 120 77"/><path class="b" d="M123 0 Q121 39 123 75"/></g><rect id="bw-fill" x="40" y="195" width="160" height="0" clip-path="url(#bw-clip)"/><rect class="inkt" x="68.5" y="4" width="105.5" height="216.0" mask="url(#bw-m)"/></svg>'},
  /* de omgekeerde aeropress: de zuiger staat op het aanrecht, de kamer erboven,
     de open kant naar boven. Het water zit dus op de rubber, niet op het filter. */
  aeropress_om:{h:56,l:156,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M84 56 L156 56 L156 156 L84 156 Z"/></clipPath></defs><g id="bw-stream" class="bw-stream"><path d="M120 4 Q122 24 120 42"/><path class="b" d="M123 8 Q121 26 123 40"/></g><rect id="bw-fill" x="80" y="156" width="80" height="0" clip-path="url(#bw-clip)"/><path d="M78 50 Q120 43 162 51"/><path class="b" d="M82 54 Q120 48 158 55"/><path d="M80 52 Q78 106 82 160"/><path class="b" d="M84 56 Q82 106 85 157"/><path d="M160 52 Q162 106 158 160"/><path class="b" d="M156 56 Q158 106 155 157"/><path class="soft2" d="M84 74 Q94 72 104 74"/><path class="soft2" d="M84 98 Q94 96 104 98"/><path class="soft2" d="M84 122 Q94 120 104 122"/><path class="bed" d="M88 146 Q120 141 152 147"/><path d="M80 160 Q120 167 160 160"/><path class="b" d="M84 164 Q120 170 156 164"/><path d="M84 172 Q120 178 156 172"/><path class="b" d="M88 176 Q120 181 152 176"/><path d="M104 176 Q102 188 104 198"/><path class="b" d="M108 178 Q106 188 108 197"/><path d="M136 176 Q138 188 136 198"/><path class="b" d="M132 178 Q134 188 132 197"/><path d="M92 198 Q120 205 148 198"/><path d="M86 207 Q120 214 154 207"/><path class="b" d="M92 210 Q120 215 148 210"/><path class="soft2" d="M50 216 Q120 221 190 216"/></svg>'},
  switch:{h:58,l:150,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M54 58 L186 58 L131 150 L109 150 Z"/></clipPath></defs><g id="bw-stream" class="bw-stream"><path d="M120 6 Q122 26 120 44"/><path class="b" d="M123 10 Q121 28 123 42"/></g><rect id="bw-fill" x="50" y="150" width="140" height="0" clip-path="url(#bw-clip)"/><path d="M44 52 Q120 43 196 53"/><path class="b" d="M48 56 Q120 48 192 57"/><path d="M50 55 Q82 106 112 156"/><path class="b" d="M54 57 Q85 107 114 158"/><path d="M190 56 Q158 106 128 156"/><path class="b" d="M186 58 Q155 107 126 158"/><path d="M110 152 Q120 157 130 152"/><path class="soft2" d="M56 62 Q120 55 184 63"/><path class="soft2" d="M120 64 Q120 106 120 150"/><path class="bed" d="M74 96 Q120 89 166 97"/><g id="bw-valve"><path d="M132 148 Q152 142 158 130"/><path class="b" d="M134 152 Q154 146 160 134"/><path d="M160 122 Q168 128 162 136 Q153 133 157 124"/></g><path d="M188 66 Q214 74 210 96 Q206 114 184 116"/><path d="M72 168 Q120 161 168 169"/><path class="b" d="M76 172 Q120 166 164 172"/><path d="M74 170 Q78 198 88 210"/><path d="M166 170 Q162 198 152 210"/><path d="M86 209 Q120 217 154 209"/><path class="b" d="M92 212 Q120 217 148 212"/></svg>'},
};
// welke tekening hoort bij deze methode?
function brewerArtKey(methodId){
  const m=methodById(methodId); const naam=((m&&m.name)||'').toLowerCase();
  for(const k of ['chemex','kalita','aeropress','switch'])
    if(methodId===k||naam.includes(k))return k;
  if(naam.includes('press'))return 'aeropress';
  return 'v60';
}
/* Staat hij omgekeerd, dan blijft dat zo tot de keer-stap geweest is. Daarna
   staat hij gewoon rechtop -- en dat verschil zie je gebeuren. */
/* Op welke stappen draai jij de klep om? Alleen daar hoort hij in beeld -- een
   badge op elke stap zou alleen maar ruis zijn. */
function pourKlepDraait(){
  let vorige=null;
  return pc.steps.map(st=>{
    const k=st.klep||'';
    if(!k)return '';
    const wissel=(k!==vorige); vorige=k;
    return wissel?k:'';
  });
}
/* De stand op stap i: de laatst vastgelegde klep vanaf hier terugkijkend. */
function pourKlepStand(i){
  for(let j=Math.min(i,pc.steps.length-1);j>=0;j--)
    if(pc.steps[j].klep)return pc.steps[j].klep;
  return '';
}
function pourOmgekeerd(){
  const r=recipeById(pc.rid);
  if(!r||r.houding!=='omgekeerd')return false;
  const i=pc.steps.findIndex(x=>x.k==='keer');
  if(i<0)return true;
  return pourCur()<=i;      // vanaf de keer-stap zelf staat hij weer rechtop
}
function renderBrewerArt(){
  const el=document.getElementById('pc-art');if(!el)return;
  let k=brewerArtKey(pc.mid);
  if(k==='aeropress'&&pourOmgekeerd())k='aeropress_om';
  if(el.dataset.k!==k){
    const draai=(el.dataset.k==='aeropress'||el.dataset.k==='aeropress_om')&&
                (k==='aeropress'||k==='aeropress_om');
    el.innerHTML=BREWER_ART[k].art;el.dataset.k=k;
    if(draai){                       // de omslag: je ziet hem kantelen
      el.classList.remove('kantelt');void el.offsetWidth;el.classList.add('kantelt');
    }
  }
  paintBrewer();
}
// waterstand + straal bijwerken
function paintBrewer(){
  const el=document.getElementById('pc-art');if(!el)return;
  const k=el.dataset.k;if(!k||!BREWER_ART[k])return;
  const {h,l}=BREWER_ART[k];
  const fill=el.querySelector('#bw-fill');
  const stream=el.querySelector('#bw-stream');
  const totaal=pc.steps.length?pc.steps[pc.steps.length-1].water:0;
  const gedaan=pourPouredAt(pc.el);
  const deel=totaal?Math.max(0,Math.min(1,gedaan/totaal)):0;
  if(fill){
    const hoogte=deel*(l-h), y=l-hoogte;
    fill.setAttribute('y',y);fill.setAttribute('height',hoogte);
  }
  // de straal loopt precies zolang de giet zelf duurt
  if(stream)stream.classList.toggle('on',!!(pc.run&&pourGieten(pc.el)));
  const st=pc.steps[pourCur()];
  const v=el.querySelector('#bw-valve');
  if(v){
    // staat de klep in het recept, dan is dat leidend; anders de oude gok
    const stand=pourKlepStand(pourCur());
    v.classList.toggle('dicht',stand?(stand==='dicht'):!!(st&&st.k==='wacht'));
  }
}
/* ---------------- de kaartenstapel ----------------
   Bij filter wordt het formulier een stapel kaarten: dicht is elke kaart één
   regel met de kern erop, open is het hele blok. De velden zelf blijven precies
   dezelfde elementen -- ze verhuizen alleen naar de kaart waar ze horen, en bij
   espresso weer terug naar hun oorspronkelijke plek.                       */
const KAART_INHOUD={
  recipe:['fb-doserow','fb-ratio','fb-temp','fb-grind','bloom-field'],
  bean:['fb-beans'],
  gear:['filter-gear'],
  pour:[],
  log:['fb-time','filter-extra','filter-taste','fb-score','fb-tastenotes','fb-custom'],
};
const ALLE_BLOKKEN=[].concat(...Object.values(KAART_INHOUD));
let pcOpen={recipe:false,bean:false,gear:false,pour:true,log:false};
let formHerkomst=null;
// waar stond elk blok oorspronkelijk? één keer onthouden, voor de weg terug
function bewaarHerkomst(){
  if(formHerkomst)return;
  formHerkomst={};
  ALLE_BLOKKEN.forEach(id=>{
    const el=document.getElementById(id);if(!el||!el.parentNode)return;
    formHerkomst[id]={p:el.parentNode,i:[...el.parentNode.children].indexOf(el)};
  });
}
function kaartenAan(){
  bewaarHerkomst();
  Object.keys(KAART_INHOUD).forEach(k=>{
    const doel=document.getElementById('pcb-'+k);if(!doel)return;
    KAART_INHOUD[k].forEach(id=>{const el=document.getElementById(id);if(el)doel.appendChild(el);});
  });
  // de tijd-rij is leeg zolang zijn twee velden in de kaarten hangen
  const tr=document.getElementById('fb-timerow');if(tr)tr.style.display='none';
  const st=document.getElementById('pc-stack');if(st)st.style.display='block';
}
function kaartenUit(){
  if(!formHerkomst)return;
  // in oorspronkelijke volgorde terugzetten, anders schuift de index onder je weg
  ALLE_BLOKKEN.slice().sort((a,b)=>(formHerkomst[a]?.i||0)-(formHerkomst[b]?.i||0)).forEach(id=>{
    const el=document.getElementById(id),h=formHerkomst[id];
    if(!el||!h)return;
    h.p.insertBefore(el,[...h.p.children][h.i]||null);
  });
  const tr=document.getElementById('fb-timerow');if(tr)tr.style.display='';
  const st=document.getElementById('pc-stack');if(st)st.style.display='none';
}
function cardToggle(k){pcOpen[k]=!pcOpen[k];renderCards();}
function renderCards(){
  Object.keys(pcOpen).forEach(k=>{
    const c=document.getElementById('pcard-'+k);if(!c)return;
    c.classList.toggle('op',!!pcOpen[k]);
  });
  cardSummaries();
}
// de regel die je ziet als een kaart dicht is
function cardSummaries(){
  const zet=(k,t)=>{const el=document.getElementById('sum-'+k);if(el)el.textContent=t;};
  const r=recipeById(pc.rid);
  const dose=document.getElementById('f-dose').value;
  const water=document.getElementById('f-yield').value;
  const stand=document.getElementById('f-grind').value;
  zet('recipe',r?([r.naam,(dose&&water)?(dose+' g \u2192 '+water+' g'):'',stand]
    .filter(Boolean).join('  \u00b7  ')):'write how you brew this');

  const bean=beanById(formBean);
  const f=bean?beanFreshness(bean):null;
  const h=f?freshBloomHint(f.days):null;
  const dz=parseFloat(dose)||0;
  const start=bean?grindStartShort(bean,pc.mid):'';
  zet('bean',bean?([bean.name,f?f.label:'',(h&&dz)?('bloom '+Math.round(dz*h.mult)+' g, '+h.sec+' s'):'',start]
    .filter(Boolean).join('  \u00b7  ')):'pick a bean \u2014 every brew needs one');

  const g=[document.getElementById('f-brewer').value.trim(),formMolen].filter(Boolean);
  zet('gear',g.length?g.join('  \u00b7  '):'brewer & grinder \u2014 nothing set');

  if(pc.total!=null)zet('pour','total '+pourFmt(pc.total)+(pc.draw!=null?(' \u00b7 drawdown '+pourFmt(pc.draw)):''));
  else if(pc.run)zet('pour',pourFmt(pc.el)+' \u00b7 '+((pc.steps[pourCur()]||{}).k||''));
  else zet('pour',r?('not started \u2014 '+((r.stappen||[]).length)+' steps'):'no brew idea');

  const score=document.getElementById('f-score').value;
  const cup=formCup?(cupById(formCup)||{}).n:'';
  const tijd=document.getElementById('f-time').value;
  zet('log',(pc.total!=null||tijd)?[tijd?('time '+tijd):'',cup,'score '+(+score).toFixed(1)].filter(Boolean).join('  \u00b7  ')
    :'opens by itself when you stop the clock');
}
/* ---------------- pour coach (filter) ----------------
   Een recept is een tijdlijn. De klok loopt, de stap die aan de beurt is licht
   op, en tik je hem later aan dan gepland dan schuift al het volgende mee -- zo
   val je niet uit het recept als je een keer te laat bent.                */
let pc={mid:null,rid:null,steps:[],hendels:{zoet:0.5,sterk:0.5},
        run:false,t0:0,el:0,timer:null,done:0,shift:0,marks:[],total:null,draw:null,live:-1};
/* Welke stap is volgens de klok aan de beurt? De laatste waarvan de tijd
   verstreken is. Tik je er zelf een aan, dan loop je voor op het schema en
   telt die (pc.done) zwaarder.                                            */
function pourAuto(){
  let i=0;
  for(let k=0;k<pc.steps.length;k++)if(pc.el>=pc.steps[k].t+pc.shift)i=k;
  return i;
}
function pourCur(){return Math.min(pc.steps.length-1,Math.max(pourAuto(),pc.done||0));}
/* Hoeveel water zit er op tijdstip el in de brewer? Een giet gaat niet in
   één klap: reken met ongeveer 8 gram per seconde, dan stijgt het niveau
   terwijl je giet en staat het stil terwijl je wacht.                     */
function pourPouredAt(el){
  let g=0;
  for(const st of pc.steps){
    if(!st.g)continue;
    const start=st.t+pc.shift;
    const duur=Math.max(3,Math.min(25,(st.g-g)/8));
    if(el<=start)break;
    if(el>=start+duur){g=st.g;continue;}
    g=g+(st.g-g)*((el-start)/duur);
    break;
  }
  return g;
}
function pourGieten(el){
  let g=0;
  for(const st of pc.steps){
    if(!st.g)continue;
    const start=st.t+pc.shift;
    const duur=Math.max(3,Math.min(25,(st.g-g)/8));
    if(el>=start&&el<start+duur)return true;
    if(el<start)return false;
    g=st.g;
  }
  return false;
}
function pourFmt(sec){const m=Math.floor(sec/60),ss=Math.floor(sec%60);return m+':'+String(ss).padStart(2,'0');}
// de coach klaarzetten voor de methode die nu in het formulier staat
function pourInit(){
  const stack=document.getElementById('pc-stack');if(!stack)return;
  const aan=(methodFamily(formMethod)==='filter')&&!['perculator','senseo'].includes(formMethod)&&featOn('pourcoach')&&recipesFor(formMethod).length>0;
  if(!aan){pourStop(true);return;}
  if(pc.mid===formMethod&&pc.steps.length){   // niet resetten bij hertekenen
    if(!pc.run){const r=recipeById(pc.rid);const dose=parseFloat(document.getElementById('f-dose').value)||(r?r.dose:15);pc.steps=recipeSteps(r,dose,pc.hendels,pc.ratio);}
    renderPour();renderCards();return;}
  pourStop(true);
  const lijst=recipesFor(formMethod);
  const bewaard=(state.lastRecipe||{})[formMethod];
  pc={mid:formMethod,rid:(lijst.find(r=>r.id===bewaard)||lijst[0]||{}).id||null,steps:[],
      hendels:{zoet:0.5,sterk:0.5},run:false,t0:0,el:0,timer:null,idx:0,shift:0,
      marks:[],total:null,draw:null,live:-1};
  // de eerste kaart die nog iets van je wil staat open: geen boon? boon.
  // geen recept? recept. Verder ben je klaar om te gieten.
  const eerst=!formBean?'bean':(!pc.rid?'recipe':'pour');
  pcOpen={bean:eerst==='bean',recipe:eerst==='recipe',gear:false,pour:eerst==='pour',log:false};
  if(pc.rid)pourVulUitRecept(pc.rid,pc.rid===recVers);
  recVers=null;
  pourBuild();renderCards();
}
/* ---- van de receptkaart naar the pour ----
   Alles wat in het recept staat is meteen de opzet van deze brew: de dose, het
   water, de temperatuur en de maalstand. Zo hoef je niets over te typen en
   loopt de gietklok op precies de getallen die je hebt opgeschreven.       */
function pourVulUitRecept(id,overschrijf){
  const r=recipeById(id);if(!r)return;
  const leeg=i=>!String(document.getElementById(i).value||'').trim();
  if(overschrijf||leeg('f-dose'))setVal('f-dose',r.dose);
  if(overschrijf||leeg('f-temp'))setVal('f-temp',r.temp);
  // wat de app voor deze boon heeft geleerd gaat voor de maalstand uit het
  // recept: die is op jouw molen gemeten
  const bean=beanById(formBean);
  const geleerd=(bean&&bean.dialIn&&bean.dialIn.method===pc.mid&&bean.dialIn.grind)?bean.dialIn.grind:null;
  const stand=geleerd||r.stand;
  if(stand&&(overschrijf||leeg('f-grind')))setVal('f-grind',stand);
  // de molen waarop het recept geschreven is, als je er nog geen koos
  if(r.molen&&(overschrijf||!formMolen)){formMolen=r.molen;renderFormMolens();}
}
// het schema opnieuw uitrekenen voor de huidige dose en hendelstand.
// Zette je zelf een verhouding of eindgewicht (pc.ratio), dan rekent het
// schema daarmee, anders met die van het recept. bron = het veld waarin je nu
// typt: dat wordt niet overschreven, anders springt "16" naar "16.0".
function pourBuild(bron){
  const r=recipeById(pc.rid);
  const dose=parseFloat(document.getElementById('f-dose').value)||(r?r.dose:15);
  pc.steps=recipeSteps(r,dose,pc.hendels,pc.ratio);
  // het water uit het schema is meteen je doelgewicht in het formulier
  const w=pc.steps.length?pc.steps[pc.steps.length-1].water:'';
  if(w){if(bron!=='yield')setVal('f-yield',w);if(dose&&bron!=='ratio')setVal('f-ratio',(w/dose).toFixed(1));}
  renderPour();
  cardSummaries();
}
function pourRecalc(bron){
  const stack=document.getElementById('pc-stack');
  if(!stack||stack.style.display==='none')return;
  cardSummaries();
  if(pc.run)return;
  pourBuild(bron);
}
/* Verhouding of eindgewicht zelf aangepast terwijl er een recept loopt: dan
   moet het gietschema meeschalen. Eerder bleef het schema op de verhouding van
   het recept staan (15 g op 1:16 = 240 g in het veld, maar 251 g in het schema)
   en sprong de verhouding terug zodra je de dose aanpaste.                  */
function pourEigenRatio(bron){
  if(!pc||!pc.rid||pc.mid!==formMethod)return;
  const dose=parseFloat(document.getElementById('f-dose').value);
  const ratio=parseFloat(document.getElementById('f-ratio').value);
  const yld=parseFloat(document.getElementById('f-yield').value);
  const nieuw=bron==='yield'?(dose>0&&yld>0?yld/dose:0):(ratio>0?ratio:0);
  if(!(nieuw>0))return;
  pc.ratio=nieuw;
  pourRecalc(bron);
}
function renderPour(){
  pourRecipes();pourLevers();renderBrewerArt();pourBloom();pourSteps();pourSchema();
  const t=document.getElementById('pc-time');if(t)t.textContent=pourFmt(pc.el);
  const n=document.getElementById('pc-note');
  if(n)n.textContent=((typeof gcPast==='function'&&gcPast(pc.mid))||(typeof apPast==='function'&&apPast(pc.mid)))
    ?'start opens the big pour coach: the drawing, a big clock and what comes next. Off schedule? Tap next step when you actually do it.'
    :'the recipe runs with the clock. Off schedule? Tap the step when you actually do it and the rest shifts with you. Stop when the bed runs dry.';
  cardSummaries();
}
// het gietschema zoals het in het receptenboek staat, in de receptkaart
function pourSchema(){
  const el=document.getElementById('pc-schema');if(!el)return;
  if(!pc.steps.length){el.innerHTML='';return;}
  const draait=pourKlepDraait();
  el.innerHTML='<div class="pcs-h"></div>'+pc.steps.map((st,i)=>
    '<div class="pcs'+(st.k==='keer'?' keer':'')+(draait[i]?' klept':'')+'"><span class="t">'+
    pourFmt(st.t)+'</span><span class="k">'+
    (draait[i]?('<b>klep '+draait[i]+'</b> \u00b7 '):'')+esc(st.k)+
    ' \u2014 '+esc(st.d)+'</span><span class="g">'+(st.g?st.g+' g':'')+'</span></div>').join('');
}
const PICK_LABEL={aeropress:'standard','aeropress-om':'inverted'};
// welk recept staat er geladen -- en de rij om een ander te kiezen
function pourRecipes(){
  const r=recipeById(pc.rid);
  const eigen=eigenRecepten(pc.mid);
  // bij de AeroPress staan normaal (Hoffmann) en omgekeerd (Tay) er altijd tussen
  const keus=(typeof apPast==='function'&&apPast(pc.mid))?eigen.concat(FILTER_RECIPES.filter(x=>x.voor.includes('aeropress'))):eigen;
  const pick=document.getElementById('pc-pick');
  // de vaste AeroPress-recepten heten op de knop in het Engels; eigen recepten houden hun eigen naam
  // stilstaand: alleen opnieuw opbouwen als de rij echt anders is. Anders krijgt elke
  // nieuwe knop nieuwe getekende randen en lijkt de rij bij elke wijziging te wiebelen.
  if(pick){
    const lijst=keus.length>1?keus:[],sleutel=lijst.map(x=>x.id+'|'+((!x.eigen&&PICK_LABEL[x.id])||x.naam)).join('\n');
    if(pick.dataset.k!==sleutel){
      pick.dataset.k=sleutel;
      pick.innerHTML=lijst.map(x=>
        '<button type="button" class="lp" data-rid="'+esc(x.id)+'" onclick="pourPickRecipe(\''+x.id+'\')">'+esc((!x.eigen&&PICK_LABEL[x.id])||x.naam)+'</button>').join('');
    }
    pick.querySelectorAll('.lp').forEach(b=>b.classList.toggle('sel',b.dataset.rid===pc.rid));
  }
  const naam=document.getElementById('pc-naam');
  if(naam)naam.textContent=r?r.naam:'no brew idea yet';
  const o=document.getElementById('pc-over');
  if(o){
    const stand=r&&r.stand?('  \u00b7  '+esc(r.stand)+(r.molen?(' on your '+esc(r.molen)):'')):'';
    o.innerHTML=r?((r.over?esc(r.over)+'  \u00b7  ':'')+esc(r.maling)+', '+esc(String(r.temp))+'\u00b0C'+stand)
                 :'write down how you brew this and the pour runs it with you';
  }
  const l=document.getElementById('pc-links');
  if(l){
    l.innerHTML=(r?('<a onclick="openRecipe(\''+r.id+'\')">edit this one</a>'+
                    '<a onclick="openRecipe(null,pc.mid)">write another</a>')
                  :('<a onclick="openRecipe(null,pc.mid)">write your own brew idea</a>'));
  }
}
function pourPickRecipe(id){
  if(pc.run){toast('the clock is running \u2014 stop it first');return;}
  pc.rid=id;pc.ratio=null;          // een ander recept: zijn eigen verhouding
  if(!state.lastRecipe)state.lastRecipe={};
  state.lastRecipe[pc.mid]=id;save();
  pourVulUitRecept(id,true);
  pourBuild();
}
// de twee hendels van de 4:6 (alleen bij recepten die ze hebben)
function pourLevers(){
  const el=document.getElementById('pc-levers');if(!el)return;
  const r=recipeById(pc.rid);
  if(!r||!r.hendels){el.innerHTML='';return;}
  el.innerHTML=`<div class="pc-lever">
      <div class="pl-t"><span>sharper</span><span>first 40 % \u2192 taste</span><span>sweeter</span></div>
      <input type="range" min="0" max="1" step="0.05" value="${pc.hendels.zoet}" oninput="pourLever('zoet',this.value)">
    </div>
    <div class="pc-lever">
      <div class="pl-t"><span>lighter</span><span>last 60 % \u2192 strength</span><span>stronger</span></div>
      <input type="range" min="0" max="1" step="0.05" value="${pc.hendels.sterk}" oninput="pourLever('sterk',this.value)">
    </div>`;
}
function pourLever(k,v){
  if(pc.run)return;
  pc.hendels[k]=parseFloat(v);
  const r=recipeById(pc.rid);
  const dose=parseFloat(document.getElementById('f-dose').value)||(r?r.dose:15);
  pc.steps=recipeSteps(r,dose,pc.hendels,pc.ratio);
  pourSteps();
}
// versheid -> bloom (de filterkant van de versheidsmeter)
function pourBloom(){
  renderStartHint('pc-start');
  const el=document.getElementById('pc-bloom');if(!el)return;
  const bean=beanById(formBean);
  const f=bean?beanFreshness(bean):null;
  const h=f?freshBloomHint(f.days):null;
  if(!h){el.innerHTML='';return;}
  const dose=parseFloat(document.getElementById('f-dose').value)||0;
  const g=dose?Math.round(dose*h.mult):null;
  el.innerHTML='<b>'+esc(h.s)+'</b> \u2014 '+esc(h.t)+(g?(' <b>'+g+' g bloom, '+h.sec+' s</b>'):'');
}
function pourSteps(){
  const el=document.getElementById('pc-steps');if(!el)return;
  const of0=document.getElementById('pc-of');
  if(!pc.steps.length){
    el.innerHTML='<div class="rec-empty">no schedule yet — open <b>brew idea</b> above and write '+
      'how you brew this. Every step you put there lands here, and the clock runs it with you.</div>';
    if(of0)of0.textContent='';
    return;
  }
  const cur=pourCur();
  const draait=pourKlepDraait();
  el.innerHTML=pc.steps.map((st,i)=>{
    const at=st.t+pc.shift;
    const klaar=i<cur;
    // alles wat verder terug ligt dan de vorige stap wordt een streepje,
    // zodat de tekening in beeld blijft terwijl je giet
    if(i<cur-1&&st.k!=='keer'&&!draait[i])
      return '<div class="pc-mini" title="'+esc(st.k)+' \u2014 done"></div>';
    const nu=(i===cur)&&pc.run;
    const cls=klaar?'klaar':(nu?'nu':'straks');
    const tijd=(klaar&&pc.marks[i]!=null)?pourFmt(pc.marks[i]):pourFmt(Math.max(0,at));
    const g=st.g?('<div class="ps-g">'+st.g+' g</div>'):'';
    const tik=nu?(' onclick="pourTick('+i+')"'):'';
    const keer=st.k==='keer';
    const kl=draait[i];
    const klepBadge=kl?('<div class="ps-klep '+kl+'">'+KLEP_ICOON[kl]+
      (kl==='dicht'?'klep dicht':'klep open')+'</div>'):'';
    return '<div class="pc-step '+cls+(keer?' keer':'')+(kl?' klept':'')+'"'+tik+
      '><div class="ps-t">'+tijd+'</div>'+
      '<div class="ps-b">'+klepBadge+'<div class="ps-k">'+(keer?(PIJL_OM+'turn it over'):esc(st.k))+'</div>'+
      '<div class="ps-d">'+esc(st.d)+'</div></div>'+g+'</div>';
  }).join('');
  const of=document.getElementById('pc-of');
  if(!of)return;
  if(pc.total!=null){
    of.textContent='total '+pourFmt(pc.total)+(pc.draw!=null?(' \u00b7 drawdown '+pourFmt(pc.draw)):'');
  }else if(!pc.run){
    const eerste=pc.steps[0];
    of.textContent=eerste?('starts with '+eerste.k+(eerste.g?(', '+eerste.g+' g'):'')):'';
  }else{
    const volgende=pc.steps[cur+1];
    of.textContent=volgende
      ? ('next: '+volgende.k+' at '+pourFmt(Math.max(0,volgende.t+pc.shift)))
      : 'stop the clock when the bed runs dry';
  }
}
// bij de V60 en de Switch opent start de grote gietcoach (app/04-gietcoach.js),
// bij de AeroPress de AeroPress-coach (app/04-aeropress.js)
function pourToggle(){
  if(!pc.run&&typeof gcPast==='function'&&gcPast(pc.mid)){gcOpen();return;}
  if(!pc.run&&typeof apPast==='function'&&apPast(pc.mid)){apOpen();return;}
  pc.run?pourStop():pourStart();
}
function pourStart(){
  if(!pc.steps.length)pourBuild();
  pc.run=true;pc.t0=performance.now();pc.el=0;pc.done=0;pc.shift=0;pc.marks=[];pc.total=null;pc.draw=null;pc.live=-1;
  document.getElementById('pc-btn').textContent='stop';
  pc.timer=setInterval(pourTickClock,200);
  pcOpen.pour=true;pcOpen.log=false;renderCards();
  pourSteps();paintBrewer();toast('\u23f1 running \u2014 tap a step if you drift');
}
function pourTickClock(){
  pc.el=(performance.now()-pc.t0)/1000;
  const t=document.getElementById('pc-time');if(t)t.textContent=pourFmt(pc.el);
  const cur=pourCur();
  // een stap die voorbijgaat zonder dat je hem aantikte krijgt zijn geplande tijd
  for(let k=0;k<cur;k++)if(pc.marks[k]==null)pc.marks[k]=pc.steps[k].t+pc.shift;
  // de lijst alleen hertekenen als er iets verschuift; het water elke tik
  if(cur!==pc.live){pc.live=cur;pourSteps();}
  paintBrewer();cardSummaries();
}
function pourStop(stil){
  if(pc.timer){clearInterval(pc.timer);pc.timer=null;}
  if(!pc.run){if(!stil)pourSteps();return;}
  pc.run=false;pc.total=Math.round(pc.el);
  // doorlooptijd = vanaf de laatste giet tot nu; niet aangetikt = geplande tijd
  let laatste=null;
  pc.steps.forEach((st,i)=>{if(st.g)laatste=(pc.marks[i]!=null)?pc.marks[i]:(st.t+pc.shift);});
  if(laatste!=null&&pc.el>laatste)pc.draw=Math.max(0,Math.round(pc.el-laatste));
  const b=document.getElementById('pc-btn');if(b)b.textContent='start again';
  pourFill();
  // klaar met gieten: het oordeel-deel gaat vanzelf open, de coach vouwt dicht
  pcOpen.log=true;pcOpen.pour=false;
  if(!stil){pourSteps();paintBrewer();renderCards();}
}
// wat de klok zag landt meteen in de velden eronder
function pourFill(){
  if(pc.total!=null){const t=document.getElementById('f-time');if(t){t.value=pourFmt(pc.total);normalizeTime(t);}}
  if(pc.draw!=null)setVal('f-draw',pourFmt(pc.draw));
  // alleen een echte bloom-stap is een bloom (de AeroPress giet alles in één keer)
  if(!pc.steps.length||pc.steps[0].k!=='bloom'||!pc.steps[0].g)return;
  setVal('f-bloom-g',pc.steps[0].g);
  const bs=(pc.marks[0]!=null&&pc.marks[1]!=null)?Math.round(pc.marks[1]-pc.marks[0])
          :(pc.steps.length>1?(pc.steps[1].t-pc.steps[0].t):null);
  if(bs)setVal('f-bloom-s',bs);
}
// "ik doe hem nu" -- het schema schuift mee met het moment waarop je tikt
function pourTick(i){
  if(!pc.run||i!==pourCur())return;
  pc.marks[i]=pc.el;
  pc.shift=pc.el-pc.steps[i].t;
  pc.done=i+1;pc.live=-1;
  if(i>=pc.steps.length-1){pourStop();toast('\u2713 that is the brew \u2014 the times are filled in below');}
  else {pourSteps();paintBrewer();}
}
/* ---------------- puck-prep (espresso) ---------------- */
function renderPrep(){
  const items=state.prepItems||[];
  const html=items.map(it=>{
    const st=formPrep[it.id]||{};
    return `<div class="prep-row">
      <span class="prep-cb ${st.on?'on':''}" onclick="togglePrep('${it.id}')">✓</span>
      <span class="prep-name">${esc(it.name)}</span>
      ${it.unit?`<input class="prep-val" value="${esc(st.val||'')}" placeholder="${esc(it.unit)}" oninput="setPrepVal('${it.id}',this.value)">`:''}
      <button class="prep-x" title="delete" onclick="removePrepItem('${it.id}')">×</button>
    </div>`;
  }).join('');
  ['prep-list','di-prep-list'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML=html;});
}
function togglePrep(id){const st=formPrep[id]||(formPrep[id]={});st.on=!st.on;renderPrep();}
function setPrepVal(id,v){const st=formPrep[id]||(formPrep[id]={});st.val=v;if(v&&!('on'in st))st.on=true;}
function addPrepItem(){
  const name=(prompt('name of the step (e.g. "distribution tool")')||'').trim();
  if(!name)return;
  if(!Array.isArray(state.prepItems))state.prepItems=[];
  state.prepItems.push({id:'p_'+uid().slice(0,5),name});
  save();renderPrep();
}
function removePrepItem(id){
  state.prepItems=(state.prepItems||[]).filter(x=>x.id!==id);
  delete formPrep[id];save();renderPrep();
}
