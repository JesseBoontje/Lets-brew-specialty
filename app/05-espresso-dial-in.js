/* ---------------- espresso dial-in (apart scherm) ---------------- */
// kies waar een nieuwe brew begint: espresso -> dial-in-scherm, anders formulier
function beginBrew(methodId){
  formRecipeSnapshot=null;
  const mid=methodId||(state.methods.filter(m=>m.on)[0]?.id);
  if(methodFamily(mid)==='espresso'){pendingTarget=null;formBean=null;formPrep={};pendingRecipe=null;openDialIn(mid);}
  else openForm(mid);
}
function openDialIn(methodId){
  editingId=null;
  const valid=methodId&&state.methods.find(m=>m.id===methodId&&methodFamily(m)==='espresso');
  formMethod=valid?methodId:(state.methods.filter(m=>m.on&&methodFamily(m)==='espresso')[0]?.id||'espresso');
  // geen doel meegekregen? val terug op het recept dat je hier het laatst koos
  const bewaard=(state.lastRecipe||{})[formMethod];
  const rec=recipeById(bewaard);
  if(!pendingTarget&&rec&&recipeFam(rec)==='espresso'){
    pendingTarget={dose:String(rec.dose),yield:String(Math.round(rec.dose*rec.ratio)),
      time:rec.tijd||'',grind:rec.stand||''};
  }
  const t=pendingTarget||{};
  setVal('di-dose',t.dose||'');setVal('di-yield',t.yield||'');setVal('di-time','');
  setVal('di-grind',t.grind||'');   // startpunt: de doel-maalstand, aan te passen
  if(featOn('smartdefaults')&&!pendingTarget){
    const last=state.brews.filter(x=>x.method===formMethod).sort((a,b)=>b.ts-a.ts)[0];
    if(last){setVal('di-dose',last.dose||'');setVal('di-yield',last.yield||'');if(last.grind)setVal('di-grind',last.grind);}
  }
  e61Reset();
  if(typeof scVulPrep==='function')scVulPrep(false);   // pre-infusie uit het recept in de puck-prep
  renderDialIn();go('dialin');
}
function renderDialIn(){renderDiBeans();renderDiGoal();renderPrep();diAdvice();renderDiClock();renderDiJourney();renderStartHint('di-start');
  const laLink=document.getElementById('di-latteart-link');
  if(laLink)laLink.style.display=featOn('latteart')?'flex':'none';
}
/* Wat de zak zegt over waar je maalstand begint. Alleen tonen als er iets te
   zeggen valt -- een lege boon levert geen zinnige gok op.                  */
function renderStartHint(elId){
  const el=document.getElementById(elId);if(!el)return;
  const bean=beanById(formBean);
  const t=bean?grindStartText(bean,formMethod):'';
  if(!t){el.innerHTML='';el.style.display='none';return;}
  el.style.display='block';
  el.innerHTML='<span class="sh-k">starting point</span> '+esc(t);
}
/* --- E61 shot clock: de kaart op het dial-in-scherm opent het volledige
   scherm (app/05-shotclock.js). De kaart zelf toont het doel en of
   pre-infusie aanstaat; de tekening blijft stil.                        */
let diShot=null;   // fasen van de laatste shot uit de shot clock, gaat mee in de brew
function e61Fmt(sec){const m=Math.floor(sec/60),ss=Math.floor(sec%60);return m+':'+String(ss).padStart(2,'0');}
function renderDiClock(){
  const card=document.getElementById('di-clock-card');if(!card)return;
  card.style.display=featOn('shotclock')?'block':'none';
  const t=pendingTarget||{};
  const tgt=document.getElementById('e61-tgt');
  if(tgt){
    const pre=(typeof scPreVan==='function')?scPreVan(typeof scReceptNu==='function'?scReceptNu():null):null;
    tgt.textContent='full '+(t.time||'0:28')+(pre?(pre.on?' · pre '+pre.s+' s · rest '+pre.rust+' s':' · no pre-infusion'):'');
  }
  const vr=document.getElementById('voice-row');
  if(vr)vr.style.display=featOn('voice')?'block':'none';
}
function e61Reset(){diShot=null;}
function e61Toggle(){
  if(!featOn('shotclock'))return;
  shot.openen();
}
/* --- dial-in journey: elke poging getekend, de lijn wandelt de doelzone in --- */
function renderDiJourney(){
  const card=document.getElementById('di-journey-card');if(!card)return;
  card.style.display=featOn('journey')?'block':'none';
  if(!featOn('journey'))return;
  const key=(formBean||'')+'|'+formMethod;
  const fullLog=(state.dialLog||{})[key]||[];
  const log=fullLog.slice(-6);
  const svg=document.getElementById('di-journey'),note=document.getElementById('di-journey-note');
  const info=document.getElementById('di-journey-info');
  if(log.length<1){svg.innerHTML='';note.textContent='your attempts will be drawn here — every lever pull adds a dot.';if(info)info.innerHTML='';return;}
  note.textContent=log.length===1?'first attempt on paper — pull another to draw the line.':'';
  svg.innerHTML=journeySVG(log,parseTimeSec((pendingTarget||{}).time)||28,key);
  if(info)info.innerHTML=journeyInfoHTML(key,fullLog);
}
/* De tekening zelf: pogingen op volgorde, de doelzone als band. Staat los van
   het dial-in-scherm, zodat de boonkaart hem ook kan laten zien. Met een key
   erbij wordt elke stip klikbaar: aantikken selecteert 'm (zie journeyInfoHTML),
   nog een keer tikken heft de selectie weer op.                              */
function journeySVG(log,doelSec,key){
  const tT=doelSec||28, lo=Math.max(1,tT-2), hi=tT+2;
  const times=log.map(a=>parseTimeSec(a.t)||0);
  const ymin=Math.min(lo-4,...times)-2, ymax=Math.max(hi+4,...times)+2;
  const W=360,H=185,L=40,R=14,T=14,B=36;
  const X=i=>log.length===1?(L+(W-L-R)/2):(L+(W-L-R)*(i/(log.length-1)));
  const Y=v=>T+(H-T-B)*(1-(v-ymin)/(ymax-ymin));
  const selTs=key?journeySel[key]:null;
  let out='';
  out+=`<rect class="band" x="${L-6}" y="${Y(hi)}" width="${W-L-R+12}" height="${Y(lo)-Y(hi)}" rx="6"/>`;
  out+=`<text x="${L-8}" y="${Y(tT)+4}" text-anchor="end">${lo}–${hi}s</text>`;
  out+=`<path class="axis" d="M${L} ${T} L${L} ${H-B} L${W-R} ${H-B}"/>`;
  /* de verwachte volgende maalstand: tussen je laatste twee pogingen zoeken we
     waar de trend de doeltijd zou raken, en zetten daar een stippellijn met
     het cijfer erbij. Alleen zolang je nog niet in de zone zit -- ben je er
     al, dan heeft een volgende gok niets meer te voorspellen.              */
  if(log.length>=2){
    const a1=log[log.length-2], a2=log[log.length-1];
    const y1=parseTimeSec(a1.t)||0, y2=parseTimeSec(a2.t)||0;
    const g1=parseFloat(a1.g), g2=parseFloat(a2.g);
    const laatsteHit=y2>=lo&&y2<=hi;
    if(!laatsteHit&&y1!==y2&&isFinite(g1)&&isFinite(g2)){
      const f=(tT-y1)/(y2-y1);
      if(f>0&&f<1){
        const xf=X(log.length-2)+f*(X(log.length-1)-X(log.length-2));
        const gf=g1+f*(g2-g1), gr=Math.round(gf*10)/10;
        const gTxt=Number.isInteger(gr)?String(gr):gr.toFixed(1);
        out+=`<line class="exp" x1="${xf-0.6}" y1="${T}" x2="${xf+0.6}" y2="${H-B}"/>`;
        out+=`<text class="exp-lbl" x="${xf}" y="${T+15}" text-anchor="middle">try ${gTxt}</text>`;
      }
    }
  }
  if(log.length>1)out+=`<polyline class="ln" points="${log.map((a,i)=>X(i)+','+Y(parseTimeSec(a.t)||0)).join(' ')}"/>`;
  log.forEach((a,i)=>{
    const tv=parseTimeSec(a.t)||0,hit=tv>=lo&&tv<=hi;
    const sel=key&&a.ts&&a.ts===selTs;
    const klik=key?` onclick="journeyPick('${key}',${a.ts||0})"`:'';
    out+=`<circle class="dot${hit?' hit':''}${sel?' sel':''}" cx="${X(i)}" cy="${Y(tv)}" r="6.5"${klik}/>`;
    out+=`<text class="val" x="${X(i)}" y="${Y(tv)-12}" text-anchor="middle">${tv}s</text>`;
    out+=`<text x="${X(i)}" y="${H-B+16}" text-anchor="middle">${esc(a.g||'?')}</text>`;
  });
  out+=`<text x="${W-R}" y="${H-B+30}" text-anchor="end">grind per attempt →</text>`;
  return out;
}
// welke poging staat er aangetikt? key -> ts. Weg = niets geselecteerd.
let journeySel={};
// "18 g → 36 g in 0:28 · grind 4.2", voor onder de tekening
function journeyAttemptLine(a){
  const stuk=[];
  if(a.d&&a.y)stuk.push(a.d+' g \u2192 '+a.y+' g');
  else if(a.d)stuk.push(a.d+' g');
  if(a.t)stuk.push('in '+a.t);
  const cijfers=stuk.join(' ');
  return (cijfers?cijfers+' \u00b7 ':'')+'grind '+(a.g||'?');
}
function journeyInfoHTML(key,log){
  const ts=journeySel[key];if(!ts)return '';
  const a=(log||[]).find(x=>x.ts===ts);if(!a)return '';
  return '<div class="journey-info"><span>'+esc(journeyAttemptLine(a))+'</span>'+
    '<button type="button" class="ji-del" title="remove this attempt" aria-label="remove this attempt" '+
    'onclick="journeyRemove(\''+key+'\','+ts+')">'+ICO.del+'</button></div>';
}
// aantikken selecteert of heft de selectie op; nooit twee tegelijk voor dezelfde key
function journeyPick(key,ts){
  journeySel[key]=(journeySel[key]===ts)?null:ts;
  journeyRefresh();
}
function journeyRemove(key,ts){
  if(!confirm('remove this attempt from the journey?'))return;
  const log=state.dialLog||{};
  if(Array.isArray(log[key]))log[key]=log[key].filter(a=>a.ts!==ts);
  journeySel[key]=null;
  save();toast('attempt removed');
  journeyRefresh();
}
// dezelfde tekening staat mogelijk op het dial-in-scherm én op een boonkaart
function journeyRefresh(){
  try{if(currentPage==='dialin')renderDiJourney();}catch(e){}
  try{if(currentPage==='beans')renderBeans();}catch(e){}
}

function renderDiBeans(){
  const el=document.getElementById('di-beans');if(!el)return;
  // elke shot hoort bij een boon: geen "none" meer, wel meteen een nieuwe maken
  let html=state.beans.filter(b=>b.inStock!==false||b.id===formBean)
    .map(b=>'<button class="lp '+(b.id===formBean?'sel':'')+'" onclick="pickDiBean(\''+b.id+'\')">'+esc(b.name)+'</button>').join('');
  html+='<button class="lp" onclick="openBeanForm(false,\'dialin\')">＋ new bean</button>';
  el.innerHTML=html;
}
function pickDiBean(id){formBean=id;renderDiBeans();renderDiGoal();diAdvice();renderStartHint('di-start');}
function renderDiGoal(){
  const el=document.getElementById('di-goal');if(!el)return;
  const t=pendingTarget||{};
  const bean=beanById(formBean);
  const aiGrind=(bean&&bean.dialIn&&bean.dialIn.method===formMethod)?bean.dialIn.grind:'';
  const shownGrind=t.grind||aiGrind||'';
  const isAI=aiGrind&&shownGrind===aiGrind;
  el.innerHTML=`<div class="di-t"><span><svg class="acic" viewBox="0 0 24 24" style="width:19px;height:19px;vertical-align:-3px"><path d="M18.4 9.4 Q21.4 14.4 17.2 18.5 Q12.5 21.3 7.5 18.6 Q3.3 15.3 4.6 10.1 Q6.6 4.9 12.1 3.8 Q16.5 3.9 19 8.3"/><path d="M15 9.3 Q17.2 12.4 14.6 15.2 Q11.5 17 8.8 14.8 Q6.9 12.1 9 9.5 Q11.5 7.2 14.5 8.6"/><path d="M12.9 11.2 Q13.7 12.6 12.2 13.3 Q10.8 13.1 10.9 11.6 Q11.4 10.8 12.6 11.1"/></svg> target</span><span>ratio 1:${(t.dose&&t.yield)?(parseFloat(t.yield)/parseFloat(t.dose)).toFixed(1).replace('.0',''):'2'}</span></div>
    <div class="di-grid">
      <div><div class="k">dose in</div><div class="v hand">${t.dose?esc(t.dose)+' <small>g</small>':'18 <small>g</small>'}</div></div>
      <div><div class="k">yield out</div><div class="v hand">${t.yield?esc(t.yield)+' <small>g</small>':'36 <small>g</small>'}</div></div>
      <div><div class="k">shot time</div><div class="v hand">${t.time?esc(t.time):'26–30 <small>s</small>'}</div></div>
      <div><div class="k">grind</div><input class="v-edit hand" id="di-target-grind" value="${esc(shownGrind)}" placeholder="—" inputmode="text" onchange="setTargetGrind(this.value)">${isAI?'<div class="di-ai">✦ AI tip</div>':''}</div>
    </div>`;
}
// pas de doel-maalstand aan voor een realistischer startpunt
function setTargetGrind(v){if(!pendingTarget)pendingTarget={};pendingTarget.grind=(v||'').trim();renderDiGoal();}
function diAdvice(){
  const el=document.getElementById('di-advice');if(!el)return;
  const t=pendingTarget||{};
  const aT=parseTimeSec(document.getElementById('di-time')?.value);
  const aY=parseFloat(document.getElementById('di-yield')?.value)||null;
  const tT=parseTimeSec(t.time)||28;
  const tY=parseFloat(t.yield)||36;
  const grinder=(state.gear||[]).filter(g=>g.kind==='grinder'&&g.name).map(gearLabel)[0];
  const bean=beanById(formBean);
  const clock='<svg class="acic" viewBox="0 0 24 24" style="width:18px;height:18px;vertical-align:-3px"><path d="M18.3 9.6 Q21 14.3 17 18.3 Q12.4 21 7.6 18.4 Q3.6 15.2 4.8 10.2 Q6.8 5.2 12 4.1 Q16.3 4.2 18.8 8.5"/><path d="M12 6.9 Q12.2 9.6 12.1 12.3 Q13.8 13.2 15.7 14.3"/></svg> ';
  const shot=document.getElementById('di-time')?.value||'';
  let html='';
  if(aT&&aY){
    // vergelijk de doorloopsnelheid (g/s), niet alleen de tijd — zo weet je of hij te snel of te traag liep
    const f=aY/aT, ft=tY/tT;
    let dir;
    if(f<ft*0.85)dir='slow — only '+aY+'g out in '+shot+' (target '+tY+'g) → grind coarser';
    else if(f>ft*1.15)dir='fast — '+aY+'g out in '+shot+' (target '+tY+'g) → grind finer';
    else dir='on target ✓';
    html+=clock+dir+((grinder&&!/on target/.test(dir))?' on your '+esc(grinder):'');
  }else if(aT){
    const diff=aT-tT, tol=3;
    let dir=diff>tol?'slower than target → grind coarser':diff<-tol?'faster than target → grind finer':'on target so far ✓';
    html+=clock+esc(shot)+' vs target '+esc(t.time||('0:'+String(tT).padStart(2,'0')))+' → '+dir+' (also enter yield for a better read)';
  }
  const fr=beanFreshness(bean),hint=fr?freshGrindHint(fr.days):null;
  if(hint&&hint.dir!=='stable'){
    html+=(html?'<br>':'')+'day '+fr.days+' — '+esc(hint.s)+': '+
      (hint.dir==='coarser'?'expect it to run slow, lean coarser':'expect it to run fast, lean finer');
  }
  if(bean&&bean.dialIn&&bean.dialIn.method===formMethod&&bean.dialIn.grind){
    html+=(html?'<br>':'')+'✦ AI tip: try grind '+esc(bean.dialIn.grind)+(bean.dialIn.reason?' — '+esc(bean.dialIn.reason):'');
  }
  el.innerHTML=html;el.style.display=html?'block':'none';
}
async function saveDialInBrew(next){
  if(!beanById(formBean)){vraagBoon('di-beans');return;}
  const dose=parseFloat(document.getElementById('di-dose').value)||null;
  const yld=parseFloat(document.getElementById('di-yield').value)||null;
  const usedGrind=(document.getElementById('di-grind').value||'').trim();
  const t=pendingTarget||{};
  const prep={};Object.keys(formPrep).forEach(k=>{const s=formPrep[k];if(s&&(s.on||s.val))prep[k]={on:!!s.on,val:s.val||''};});
  const rec=pendingRecipe||{};
  const b={id:uid(),method:formMethod,dialIn:!!next,title:(rec.title||rec.drink||''),drink:(rec.drink||''),
    dose,yield:yld,ratio:(dose&&yld)?+(yld/dose).toFixed(1):null,
    time:document.getElementById('di-time').value.trim(),
    temp:(formPrep.temp&&formPrep.temp.val)?(parseFloat(formPrep.temp.val)||null):null,
    score:0,notes:'',grind:usedGrind||t.grind||'',
    beanId:formBean,beans:(beanById(formBean)?.name)||'',
    tags:[],custom:[],guide:(rec.guide||''),target:pendingTarget||null,
    prep:Object.keys(prep).length?prep:null,shot:diShot||null,ts:Date.now()};
  BrewModel.attachBrew(state,b,formRecipeSnapshot||recipeById((state.lastRecipe||{})[formMethod]));
  state.brews.push(b);
  // journey-log: elke poging apart bewaren (het brew-record blijft er één)
  if(!state.dialLog)state.dialLog={};
  const lk=(b.beanId||'')+'|'+b.method;
  (state.dialLog[lk]=state.dialLog[lk]||[]).push({ts:b.ts,g:b.grind||'',t:b.time||'',y:b.yield||null,d:b.dose||null});
  // Keep all measured attempts; the chart can limit its visible points.
  // "nailed" is een feit, geen suggestie: dat leggen we vast op de bóón, per
  // methode. Een andere drank met dezelfde boon begint daar dan vanaf.
  if(!next&&b.beanId&&(b.grind||b.time)){
    const bn=beanById(b.beanId);
    if(bn){
      if(!bn.dialed||typeof bn.dialed!=='object')bn.dialed={};
      bn.dialed[b.method]={grind:b.grind||'',dose:b.dose||null,yield:b.yield||null,
        time:b.time||'',drink:b.drink||'',ts:b.ts};
    }
  }
  save();
  // Paid AI advice is requested explicitly through the coffee coach.
  if(next){
    const bean=beanById(b.beanId);
    const newGrind=(bean&&bean.dialIn&&bean.dialIn.method===b.method)?bean.dialIn.grind:(b.grind||'');
    // het DOEL blijft het doel (yield/tijd niet overschrijven met je gemeten waarden); alleen de maalstand wordt bijgesteld
    pendingTarget={dose:t.dose||(dose?String(dose):''),yield:t.yield||'',time:t.time||'',grind:newGrind};
    openDialIn(b.method);
    // als de AI net een maaltip gaf, laat die toast staan (met reden); anders eigen bericht
    const gotAiTip=bean&&bean.dialIn&&bean.dialIn.method===b.method&&aiReady();
    if(!gotAiTip)toast('attempt saved — adjust the grind and try again');
  }else{toast('✓ dial-in saved');go('home');}
}
function pickMethod(id){formMethod=id;renderFormMethods();renderDialInHint();}
function renderFormBeans(){
  const el=document.getElementById('form-beans');
  // alleen wat er nog in de kast staat. Een boon die op is blijft staan zolang
  // hij bij deze brew hoort, anders raak je hem kwijt zodra je iets bewerkt.
  const kiesbaar=state.beans.filter(b=>b.inStock!==false||b.id===formBean);
  // elke brew hoort bij een boon. Alleen een oude brew die nog nergens aan hangt
  // laat dat zien, zodat je hem bij het bewerken kunt koppelen.
  const oud=editingId&&!beanById(formBean)?state.brews.find(x=>x.id===editingId):null;
  let html=oud?'<button class="lp sel" onclick="pickBean(null)">not linked'+(oud.beans?' ('+esc(oud.beans)+')':'')+'</button>':'';
  html+=kiesbaar.map(b=>'<button class="lp '+(b.id===formBean?'sel':'')+'" onclick="pickBean(\''+b.id+'\')">'+esc(b.name)+'</button>').join('');
  html+='<button class="lp" onclick="openBeanForm(false,\'form\')">＋ new bean</button>';
  el.innerHTML=html;
}
function pickBean(id){formBean=id;renderFormBeans();cardSummaries();
  // de boon is het beginpunt: hij kiest de methode, en daarmee liggen de
  // brewer, de molen en de bloom die bij zijn versheid past ook al vast
  const b=beanById(id);
  if(b&&b.method&&state.methods.find(m=>m.id===b.method&&m.on)){
    formMethod=b.method;renderFormMethods();   // roept applyFamilyToForm en dus het invullen aan
  }else{vulGearAuto();vulBloomAuto();}
  renderDialInHint();pourBloom();
}
function renderFormTags(){
  const el=document.getElementById('form-tags');
  const all=[...new Set([...PRESET_TAGS,...formTags])];
  el.innerHTML=all.map(t=>'<button class="tag-pick '+(formTags.includes(t)?'sel':'')+'" onclick="toggleTag(\''+esc(t).replace(/'/g,"")+'\')">'+esc(t)+'</button>').join('');
}
function toggleTag(t){const i=formTags.indexOf(t);if(i>=0)formTags.splice(i,1);else formTags.push(t);renderFormTags();}
function addTag(){const v=document.getElementById('f-tagnew').value.trim().toLowerCase();
  if(!v)return;if(!formTags.includes(v))formTags.push(v);document.getElementById('f-tagnew').value='';renderFormTags();}
function calc(changed){
  const dose=parseFloat(document.getElementById('f-dose').value);
  const yld=parseFloat(document.getElementById('f-yield').value);
  const ratio=parseFloat(document.getElementById('f-ratio').value);
  if(changed==='ratio'&&dose>0&&ratio>0){document.getElementById('f-yield').value=(dose*ratio).toFixed(1);}
  else if(changed==='dose'&&dose>0&&yld>0){document.getElementById('f-ratio').value=(yld/dose).toFixed(1);}
  else if(changed==='yield'&&dose>0&&yld>0){document.getElementById('f-ratio').value=(yld/dose).toFixed(1);}
  else if(changed==='dose'&&dose>0&&ratio>0&&!yld){document.getElementById('f-yield').value=(dose*ratio).toFixed(1);}
}
// Zonder boon geen nieuwe brew: zeg het, en zet de bonenkiezer in beeld.
function vraagBoon(elId){
  toast('pick a bean first — every brew belongs to a bean');
  if(elId==='form-beans'&&typeof pcOpen==='object'&&!pcOpen.bean){pcOpen.bean=true;renderCards();}
  const el=document.getElementById(elId);
  if(el){try{el.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}
    el.classList.remove('needs-pick');void el.offsetWidth;el.classList.add('needs-pick');}
}
function saveBrew(){
  // nieuwe brews altijd met boon; een oude brew zonder boon mag je wel bewerken
  if(!beanById(formBean)&&!(editingId&&!beanById(state.brews.find(x=>x.id===editingId)?.beanId))){vraagBoon('form-beans');return;}
  const b={
    id:editingId||uid(),method:formMethod,
    title:document.getElementById('f-title').value.trim(),
    drink:editingId?(state.brews.find(x=>x.id===editingId)?.drink||''):'',
    dose:parseFloat(document.getElementById('f-dose').value)||null,
    yield:parseFloat(document.getElementById('f-yield').value)||null,
    ratio:parseFloat(document.getElementById('f-ratio').value)||null,
    time:document.getElementById('f-time').value.trim(),
    temp:parseFloat(document.getElementById('f-temp').value)||null,
    score:parseFloat(document.getElementById('f-score').value)||0,
    notes:document.getElementById('f-notes').value.trim(),
    grind:document.getElementById('f-grind').value.trim(),
    bloom:(function(){const g=document.getElementById('f-bloom-g').value.trim();const s=document.getElementById('f-bloom-s').value.trim();return (g||s)?{g,s}:null;})(),
    draw:document.getElementById('f-draw').value.trim(),
    bed:formBed||null,
    cup:formCup||null,
    tds:editingId?(state.brews.find(x=>x.id===editingId)?.tds??null):null,
    brewer:document.getElementById('f-brewer').value.trim(),
    grinder:formMolen||'',
    paper:formOud.paper||'',
    water:formOud.water||'',
    beanId:formBean,
    // de ingetypte naam blijft staan zolang de boon niet verandert (of er geen
    // boon gekozen is); kies je bij bewerken een andere boon, dan diens naam
    beans:(function(){const o=editingId?state.brews.find(x=>x.id===editingId):null;
      const oud=String(o?.beans||'').trim();const nb=beanById(formBean);
      if(oud&&(!nb||o.beanId===formBean))return o.beans;return nb?nb.name:'';})(),
    tags:[...formTags],
    custom:formCustom.filter(c=>c.k.trim()||c.v.trim()),
    guide:editingId?(state.brews.find(x=>x.id===editingId)?.guide||''):'',
    target:editingId?(state.brews.find(x=>x.id===editingId)?.target||null):(pendingTarget||null),
    prep:(function(){const p={};Object.keys(formPrep).forEach(k=>{const s=formPrep[k];if(s&&(s.on||s.val))p[k]={on:!!s.on,val:s.val||''};});return Object.keys(p).length?p:null;})(),
    ts:editingId?(state.brews.find(x=>x.id===editingId)?.ts||Date.now()):Date.now()
  };
  const previous=editingId?state.brews.find(x=>x.id===editingId):null;
  if(previous){b.recipeId=previous.recipeId||null;b.recipeSnapshot=previous.recipeSnapshot||null;b.beanSnapshot=previous.beanId===b.beanId?(previous.beanSnapshot||null):null;}
  BrewModel.attachBrew(state,b,previous?null:(formRecipeSnapshot||recipeById(pc.mid===formMethod?pc.rid:(state.lastRecipe||{})[formMethod])));
  if(editingId){const i=state.brews.findIndex(x=>x.id===editingId);state.brews[i]=b;}
  else state.brews.push(b);
  save();toast(editingId?'✓ brew updated':'✓ brew saved');
  pendingTarget=null;
  // op de achtergrond: leer van deze poging en bereken de volgende maalstand
  // AI advice is requested explicitly in the coffee coach, never billed by saving.
  go('brews');
}
function cancelForm(){goBack(editingId?'detail':'home');}

