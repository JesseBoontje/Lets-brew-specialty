/* ---------------- taste wheel ----------------
   Acht smaakfamilies in een ring. Staat het grote wiel aan, dan is elke familie
   een deurtje: je tikt hem open en de ring toont wat eronder zit -- de familie
   zelf voorop, zodat "gewoon berry" een keuze blijft. Eén ring tegelijk, want
   twee ringen op een telefoon lees je niet meer.                            */
const WHEEL_NOTES=['berry','citrus','floral','honey','caramel','choc','nutty','spice'];
const WHEEL_SUB={
  berry:  ['blueberry','raspberry','strawberry','currant','cherry'],
  citrus: ['lemon','orange','grapefruit','lime','bergamot'],
  floral: ['jasmine','rose','chamomile','black tea','hibiscus'],
  honey:  ['brown sugar','maple','malt','syrup'],
  caramel:['toffee','vanilla','praline','cane sugar','burnt sugar'],
  choc:   ['milk choc','dark choc','cocoa','fudge','roasted'],
  nutty:  ['almond','hazelnut','peanut','walnut','biscuit'],
  spice:  ['cinnamon','clove','cardamom','pepper','liquorice'],
};
// de familie zelf staat vooraan: "gewoon berry" moet een keuze blijven
function wheelSubs(fam){return [fam].concat((WHEEL_SUB[fam]||[]).filter(x=>x!==fam));}
// hoort deze smaak bij die familie? (de familie zelf telt mee)
function wheelHoortBij(fam,tag){
  const t=(''+tag).toLowerCase();
  return t===fam||(WHEEL_SUB[fam]||[]).includes(t);
}
let wheelOpen=null;   // welke familie staat open in het grote wiel
/* Één ring tekenen. namen = de segmenten, aan = welke gekleurd zijn,
   klik = de functienaam die een segment aanroept.                          */
function wheelRing(namen,aan,klik,binnen){
  const cx=100,cy=100,r1=binnen?46:40,r2=94,N=namen.length;
  const breedte=r2-r1-6;         // ruimte voor tekst binnen de ring
  let out='';
  namen.forEach((n,i)=>{
    const a0=(i/N)*Math.PI*2-Math.PI/2,a1=((i+1)/N)*Math.PI*2-Math.PI/2,am=(a0+a1)/2;
    const P=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
    const[x0,y0]=P(r2,a0),[x1,y1]=P(r2,a1),[x2,y2]=P(r1,a1),[x3,y3]=P(r1,a0);
    const kl=klik?` onclick="${klik}('${n.replace(/'/g,"\\'")}')"`:'';
    out+=`<path data-n="${esc(n)}" class="${aan(n)?'sel':''}"${kl} d="M${x0} ${y0} A${r2} ${r2} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r1} ${r1} 0 0 0 ${x3} ${y3} Z"/>`;
    // "brown sugar" op twee regels, en een lang woord krimpt tot het past --
    // anders steekt "blackcurrant" dwars door zijn eigen taartpunt heen
    const woorden=n.split(' ');
    const regels=(woorden.length===2&&n.length>8)?woorden:[n];
    const langst=Math.max(...regels.map(r=>r.length));
    const fs=Math.max(6.4,Math.min(N>6?9:10,breedte/(0.5*langst)));
    const[tx,ty]=P((r1+r2)/2,am);
    const y0t=ty+3-(regels.length-1)*fs*0.5;
    out+=`<text x="${tx}" y="${y0t}" text-anchor="middle" style="font-size:${fs.toFixed(1)}px">`+
      regels.map((r,j)=>`<tspan x="${tx}" dy="${j?fs:0}">${esc(r)}</tspan>`).join('')+`</text>`;
  });
  return out;
}
function renderTasteWheel(){
  const wrap=document.getElementById('wheel-wrap');if(!wrap)return;
  wrap.style.display=featOn('wheel')?'block':'none';
  if(!featOn('wheel'))return;
  const svg=document.getElementById('taste-wheel');if(!svg)return;
  const groot=featOn('wheelbig');
  if(!groot)wheelOpen=null;
  let out;
  if(groot&&wheelOpen){
    out=wheelRing(wheelSubs(wheelOpen),n=>formTags.includes(n),'wheelTap',true);
    // het hart is de weg terug naar de families
    out+=`<circle class="wheel-hart" cx="100" cy="100" r="40" onclick="wheelDicht()"/>`;
    out+=`<text class="wheel-hart-t" x="100" y="97" text-anchor="middle">${esc(wheelOpen)}</text>`;
    out+=`<text class="wheel-hart-t" x="100" y="110" text-anchor="middle" style="font-size:8.5px">&#8592; back</text>`;
  }else{
    // een familie kleurt zodra er iets uit die familie gekozen is
    const aan=n=>formTags.some(t=>wheelHoortBij(n,t));
    out=wheelRing(WHEEL_NOTES,aan,groot?'wheelOpenen':'wheelTap',false);
    out+=`<circle cx="100" cy="100" r="34" fill="none" stroke="var(--line)" stroke-width="1.5" filter="url(#wobble-rough)"/>`;
    if(groot)out+=`<text class="wheel-hart-t" x="100" y="103" text-anchor="middle" style="font-size:8.5px">tik een smaak</text>`;
  }
  svg.innerHTML=out;
}
function wheelOpenen(fam){wheelOpen=fam;renderTasteWheel();}
function wheelDicht(){wheelOpen=null;renderTasteWheel();}
function wheelTap(n){
  if(formTags.includes(n))formTags=formTags.filter(x=>x!==n);else formTags.push(n);
  renderFormTags();
}
/* Smaakwiel als plaatje: altijd de acht families, ook als je een subsmaak koos
   -- "blueberry" kleurt gewoon het vak berry. De subsmaak zelf staat er als
   tekstlabel onder, bij de andere smaaknotities.                           */
function tasteWheelStatic(tags,label){
  if(!featOn('wheel'))return '';
  const on=asArr(tags).map(t=>(''+t).toLowerCase());
  const geraakt=nt=>on.some(t=>wheelHoortBij(nt,t));
  if(!WHEEL_NOTES.some(geraakt))return '';
  const cx=100,cy=100,r1=40,r2=94;let out='';
  WHEEL_NOTES.forEach((nt,i)=>{
    const a0=(i/8)*Math.PI*2-Math.PI/2,a1=((i+1)/8)*Math.PI*2-Math.PI/2,am=(a0+a1)/2;
    const P=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
    const[x0,y0]=P(r2,a0),[x1,y1]=P(r2,a1),[x2,y2]=P(r1,a1),[x3,y3]=P(r1,a0);
    out+=`<path class="${geraakt(nt)?'sel':''}" d="M${x0} ${y0} A${r2} ${r2} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r1} ${r1} 0 0 0 ${x3} ${y3} Z"/>`;
    const[tx,ty]=P((r1+r2)/2,am);
    out+=`<text x="${tx}" y="${ty+3}" text-anchor="middle">${nt}</text>`;
  });
  return `<div class="notes-card sketch soft"><div class="k">${esc(label||'taste')}</div>
    <svg class="wheel-ro" viewBox="0 0 200 200">${out}</svg></div>`;
}
/* ---------------- versheidsmeter per boon ---------------- */
function freshGaugeHTML(b,atTs,label){
  if(!featOn('freshgauge'))return '';
  const fr=beanFreshness(b,atTs);if(!fr)return '';
  const hint=freshGrindHint(fr.days);
  const pk=freshPeak(b),ps=Math.min(pk.start,38),pe=Math.min(Math.max(pk.end,ps+3),41);
  const days=Math.min(fr.days,42);
  const cx=150,cy=104,R=78;
  const P=fr2=>[cx+R*Math.cos(Math.PI+fr2*Math.PI),cy+R*Math.sin(Math.PI+fr2*Math.PI)];
  const arc=(d0,d1,col)=>{const[x0,y0]=P(d0/42),[x1,y1]=P(d1/42);
    return `<path class="zone" stroke="${col}" d="M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}"/>`;};
  const[nx,ny]=P(days/42);
  return `<svg class="fgauge" viewBox="0 0 300 118">
    ${arc(0,ps,'#a5673a')}${arc(ps,pe,'#5c7a4f')}${arc(pe,42,'var(--line)')}
    <text x="${P(0.6/42)[0]-7}" y="${P(0.6/42)[1]-9}" text-anchor="end">rest</text>
    <text x="${P((ps+pe)/84)[0]}" y="${P((ps+pe)/84)[1]-12}" text-anchor="middle">${pk.learned?'your peak':'peak'}</text>
    <text x="${P((pe+42)/84)[0]}" y="${P((pe+42)/84)[1]-12}" text-anchor="middle">fading</text>
    <line class="needle" x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}"/>
    <circle cx="${cx}" cy="${cy}" r="4" fill="var(--ink)"/>
    <text class="fd" x="${cx}" y="${cy-22}" text-anchor="middle">day ${fr.days}</text>
  </svg>${label?'<div class="fg-lab">'+esc(label)+'</div>':''}
  ${atTs?'':'<div class="fg-peak">'+esc(freshPeakText(b,pk,fr.days))+'</div>'}
  ${hint?'<div class="fg-hint">'+esc(hint.s)+' — '+esc(hint.t)+'</div>':''}`;
}
// één zin onder de meter: wanneer hij op z'n best is en waar dat vandaan komt
function freshPeakText(b,pk,days){
  const bron=pk.learned?(pk.from==='bean'?'learned from your '+pk.n+' scores of this bean'
    :'learned from your '+pk.n+' scores across beans'):'the usual curve — your scores will refine it';
  const roast=new Date(b.roastdate+'T00:00:00');
  const dag=n=>{const d=new Date(roast.getTime()+n*86400000);return d.toLocaleDateString('en-GB',d.getFullYear()===new Date().getFullYear()?{day:'numeric',month:'short'}:{day:'numeric',month:'short',year:'numeric'});};
  const wanneer=days==null||days<pk.start?'at its best from '+dag(pk.start)+' (day '+pk.start+')'
    :days<=pk.end?'at its best now, until '+dag(pk.end)+' (day '+pk.end+')'
    :'its best days were '+dag(pk.start)+' – '+dag(pk.end);
  return wanneer+' · '+bron;
}
/* ---------------- features: het schakelbord ---------------- */
// alles wat nieuw bijgebouwd wordt staat hier, met eigen aan/uit-knop in profiel.
const FEATURES=[
  {id:'shotclock', n:'E61 shot clock', d:'pull the lever on the dial-in screen — time fills in, stays editable', def:true, cat:'app'},
  {id:'journey', n:'dial-in journey', d:'your attempts drawn as a line walking into the target band', def:true, cat:'app'},
  {id:'pourcoach', n:'pour coach', d:'filter recipes that run with a clock while you pour', def:true, cat:'app'},
  {id:'drawdown', n:'drawdown & bed', d:'log how long it drained and what the bed looked like', def:true, cat:'app'},
  {id:'filtercompass', n:'filter compass', d:'what you tasted, plotted — with one next change', def:true, cat:'app'},
  {id:'wheel', n:'taste wheel', d:'tap flavours on a wheel instead of typing tags', def:true, cat:'app'},
  {id:'finder', n:'taste finder', d:'search the world map by taste, or let five questions narrow it to three regions', def:true, cat:'people'},
  {id:'finderai', n:'ask the finder', d:'ask a real question and get a real answer — on the map, as an explanation, or just in words', def:true, cat:'people'},
  {id:'beanpick', n:'bean chooser', d:'a drawn world map: from a coffee country down to a region, and what to look for on the bag', def:true, cat:'people'},
  {id:'wheelbig', n:'big flavour wheel', d:'tap a family and the wheel opens up — berry becomes blueberry, raspberry, cherry', def:false, cat:'app'},
  {id:'drawnedges', n:'drawn edges', d:'every card and button edged with two loose pencil lines', def:true, cat:'app'},
  {id:'freshgauge', n:'freshness gauge', d:'rest → peak → fading as a dial on each bean', def:true, cat:'app'},
  {id:'smartdefaults', n:'smart defaults', d:'last dose, grind & temp prefilled — never retype', def:true, cat:'app'},
  {id:'peakalert', n:'peak heads-up', d:'a quiet line on home when a bean in stock reaches its best days', def:true, cat:'app'},
  {id:'route', n:'which way?', d:'an omni bean, or a bean with more methods: pick espresso or filter first, your last choice on top', def:true, cat:'app'},
  {id:'surprise', n:'surprise me', d:'a new recipe for a bean on your shelf — you look it over first, AI makes it smarter', def:true, cat:'app'},
  {id:'cost', n:'cost per cup', d:'price & bag size on a bean → what a cup costs you', def:true, cat:'app'},
  {id:'aibudget', n:'AI budget', d:'what the AI cost you this month, and one heads-up at 20% and 10%', def:true, cat:'smart'},
  {id:'sharecards', n:'share cards', d:'any brew as a hand-drawn image card to send to friends', def:true, cat:'app'},
  {id:'shortcuts', n:'home-screen shortcuts', d:'links that start a brew straight from an iOS Shortcut', def:true, cat:'smart'},
  {id:'water', n:'water helper', d:'ppm targets & simple mineral recipes on the learn page', def:true, cat:'people'},
  {id:'cupping', n:'cupping session', d:'blind-taste two beans, score & reveal', def:true, cat:'people'},
  {id:'latteart', n:'pouring shapes & coach', d:'photos of your pours, in order — with AI feedback', def:true, cat:'people'},
  {id:'tastememory', n:'taste memory', d:'what your scores say about your palate', def:false, cat:'smart'},
  {id:'voice', n:'voice logging', d:'say "18 in, 36 out, 27 seconds" — hands stay on the machine', def:false, cat:'smart'},
  {id:'weather', n:'weather-aware suggestions', d:'iced on hot days, cozy moka when it rains (uses location)', def:false, cat:'smart'},
  {id:'account', n:'account & sync', d:'sign in with Face ID and keep a copy of your beans and brews online — the phone stays the source', def:false, cat:'people'},
  {id:'social', n:'follow & feed', d:'a profile, follow people you know and swipe through their brews and beans — needs account & sync', def:false, cat:'people'},
  {id:'pairing', n:'scale & machine pairing', d:'live weight via Bluetooth where the browser allows it', def:false, cat:'smart'},
];
function featOn(id){
  const f=FEATURES.find(x=>x.id===id);if(!f)return false;
  const v=state.features&&state.features[id];
  return v===undefined?f.def:!!v;
}
function toggleFeature(id){
  if(!state.features)state.features={};
  state.features[id]=!featOn(id);
  if(id==='social'&&!featOn('social')&&typeof volgVlagUit==='function')volgVlagUit();
  if(typeof volgNav==='function')volgNav();
  save();applyFeatures();
  if(currentPage==='profile')renderProfile();else renderFeatures();
  const f=FEATURES.find(x=>x.id===id);
  toast((featOn(id)?'✓ ':'○ ')+f.n+(featOn(id)?' on':' off'));
}
function applyFeatures(){
  // de nachtstand is weg (keuze 19-11-2026); een oude instelling mag niets meer doen
  document.documentElement.classList.remove('night');
}
function renderFeatures(){
  const el=document.getElementById('feat-list');if(!el)return;
  const GROUPS=[['app','in the app'],['people','people & learning'],['smart','smart & connected']];
  el.innerHTML=GROUPS.map(([c,label])=>{
    const rows=FEATURES.filter(f=>(f.cat||'app')===c);
    if(!rows.length)return '';
    return `<div class="feat-group">${esc(label)}</div>`+rows.map(f=>`<div class="feat-row">
      <div class="ft"><div class="n">${esc(f.n)}</div><div class="d">${esc(f.d)}</div></div>
      <div class="toggle ${featOn(f.id)?'on':''}" onclick="toggleFeature('${f.id}')"><div class="knob"></div></div>
    </div>`).join('');
  }).join('');
}

/* ---------------- AI-instellingen ---------------- */
function aiEnabled(){return localStorage.getItem('scc_ai_on')==='1';}
// Keep provider secrets in memory; migrate an old stored key for this tab only.
const sessionAiKeys=Object.create(null);
for(const provider of ['anthropic','openai']){
  try{sessionAiKeys[provider]=localStorage.getItem(aiSleutelNaam(provider))||'';localStorage.removeItem(aiSleutelNaam(provider));}catch{sessionAiKeys[provider]='';}
}
function getKey(id){return sessionAiKeys[id||aiProv()]||'';}
// klaar om te vragen: een eigen sleutel in dit tabblad, of Lets Brew AI voor dit account
function aiSleutelKlaar(id){id=id||aiProv();return aiAanbieder(id).server?(typeof aiLbKan==='function'&&aiLbKan()):!!getKey(id);}
function aiReady(){return aiEnabled()&&aiSleutelKlaar();}
function renderProfile(){
  const on=aiEnabled();
  document.getElementById('ai-toggle').classList.toggle('on',on);
  document.getElementById('ai-key-wrap').classList.toggle('hidden',!on);
  document.getElementById('ai-off-note').classList.toggle('hidden',on);
  try{renderAiProv();}catch(e){}
  const ss=document.getElementById('save-status');
  if(ss)ss.textContent='saved now: '+state.brews.length+' brews · '+state.beans.length+' beans · '+state.methods.length+' methods';
  renderReminder();
  try{acctRender();}catch(e){}
  try{volgRender();}catch(e){}
  try{beheerRender();acctMeHaal();}catch(e){}
  try{renderStem();}catch(e){}
  renderGear();
  renderFeatures();
  renderShortcuts();
  try{apiStat();}catch(e){}
  try{renderAiBudget();}catch(e){}
  const tm=document.getElementById('tm-card');if(tm)tm.style.display=featOn('tastememory')?'block':'none';
  const wk=document.getElementById('week-card');
  if(wk)wk.style.display=featOn('tastememory')?'block':'none';
  renderPairing();
  const pu=document.getElementById('push-url');if(pu)pu.value=localStorage.getItem('scc_push_url')||'';
  const cr=document.getElementById('b-cost-row');if(cr)cr.style.display=featOn('cost')?'flex':'none';
  applyAIVisibility();
}
/* ---------------- mijn uitrusting (gear) ----------------
   Een naam alleen zegt niet wat iets IS: "Eureka Libra" kan voor een mens
   duidelijk een molen zijn, voor de app niet. Daarom een kind erbij (grinder/
   brewer/los) en bij een molen meteen het bereik -- daarmee kan een AI-tip
   straks "+1" vertalen naar wat dat betekent op JOUW schaal.               */
const GEAR_CATS=[['espresso','espresso'],['filter','filter'],['algemeen','espresso + filter']];
const GEAR_KIND_LABEL={grinder:'grinder',brewer:'brewer'};
// welke families staan aan in het toevoegformulier -- een weegschaal gebruik je
// voor allebei, dus beide staan aan totdat je er zelf een uitzet
let gearCatSel={espresso:true,filter:true};
function renderGearCatPick(){
  const el=document.getElementById('gear-cat-pick');if(!el)return;
  el.innerHTML=['espresso','filter'].map(f=>
    '<button type="button" class="lp '+(gearCatSel[f]?'sel':'')+'" onclick="toggleGearCat(\''+f+'\')">'+f+'</button>').join('');
}
// minstens één blijft aan staan -- anders is er niets om op te slaan
function toggleGearCat(f){
  const ander=f==='espresso'?'filter':'espresso';
  if(gearCatSel[f]&&!gearCatSel[ander])return;   // laatste over: mag niet uit
  gearCatSel[f]=!gearCatSel[f];
  renderGearCatPick();
}
function renderGearRangeField(){
  const kind=document.getElementById('gear-kind').value;
  const rij=document.getElementById('gear-range-row'),note=document.getElementById('gear-range-note');
  const aan=kind==='grinder';
  if(rij)rij.style.display=aan?'flex':'none';
  if(note)note.style.display=aan?'block':'none';
}
function addGear(){
  const inp=document.getElementById('gear-name');
  const name=(inp.value||'').trim();if(!name){toast('enter a name');return;}
  // beide aan = voor allebei (algemeen), anders de ene die aanstaat
  const category=(gearCatSel.espresso&&gearCatSel.filter)?'algemeen':(gearCatSel.espresso?'espresso':'filter');
  const kind=document.getElementById('gear-kind').value||'';
  const item={id:uid(),name,category};
  if(kind)item.kind=kind;
  if(kind==='grinder'){
    const lo=parseFloat(document.getElementById('gear-range-min').value);
    const hi=parseFloat(document.getElementById('gear-range-max').value);
    if(isFinite(lo))item.grindMin=lo;
    if(isFinite(hi))item.grindMax=hi;
  }
  if(!Array.isArray(state.gear))state.gear=[];
  state.gear.push(item);
  inp.value='';document.getElementById('gear-kind').value='';
  document.getElementById('gear-range-min').value='';document.getElementById('gear-range-max').value='';
  gearCatSel={espresso:true,filter:true};renderGearCatPick();
  renderGearRangeField();
  save();renderGear();
}
function delGear(id){state.gear=(state.gear||[]).filter(g=>g.id!==id);save();renderGear();}
// naam plus, bij een molen met een ingevuld bereik, dat bereik erachter --
// gebruikt in de gearlijst en in elke AI-prompt die uitrusting noemt
function gearLabel(g){
  if(g.kind==='grinder'&&g.grindMin!=null&&g.grindMax!=null)
    return g.name+' (grind range '+g.grindMin+'–'+g.grindMax+')';
  return g.name;
}
function renderGear(){
  renderGearCatPick();
  if(typeof renderTareGear==='function')renderTareGear();   // tarra-gewichten voor de shot clock
  const el=document.getElementById('gear-list');if(!el)return;
  const g=state.gear||[];
  if(!g.length){el.innerHTML='<div class="set-d" style="margin-bottom:4px">nothing added yet.</div>';return;}
  let html='';
  GEAR_CATS.forEach(([cat,label])=>{
    const items=g.filter(x=>x.category===cat);
    if(!items.length)return;
    html+='<div class="gear-cat-lbl">'+esc(label)+'</div><div class="gear-items">'+
      items.map(it=>{
        const bij=gearMethods(it.id).map(m=>m.name);
        const kindLbl=GEAR_KIND_LABEL[it.kind];
        return '<span class="gear-chip">'+esc(gearLabel(it))+
          (kindLbl?'<span class="gc-kind">'+esc(kindLbl)+'</span>':'')+
          (bij.length?'<span class="gc-bij">'+esc(bij.join(', '))+'</span>':'')+
          '<button onclick="delGear(\''+it.id+'\')" aria-label="delete">×</button></span>';
      }).join('')+'</div>';
  });
  // items met onbekende categorie tonen onder 'algemeen'
  const known=GEAR_CATS.map(c=>c[0]);
  const rest=g.filter(x=>!known.includes(x.category));
  if(rest.length){html+='<div class="gear-cat-lbl">overig</div><div class="gear-items">'+
    rest.map(it=>'<span class="gear-chip">'+esc(gearLabel(it))+'<button onclick="delGear(\''+it.id+'\')">×</button></span>').join('')+'</div>';}
  el.innerHTML=html;
}
// beschrijvend blokje van de uitrusting voor in AI-prompts (leeg als er niets is)
function gearPromptBlock(mid){
  // bij een methode met gekoppelde gear alleen die noemen; scheelt ruis in de prompt
  if(mid){
    const bij=methodGear(mid);
    if(bij.length)return '\nUitrusting voor deze methode: '+bij.map(gearLabel).join(', ')+'.';
  }
  const g=state.gear||[];if(!g.length)return '';
  const cats={espresso:[],filter:[],algemeen:[]};
  g.forEach(it=>{(cats[it.category]||cats.algemeen).push(gearLabel(it));});
  const parts=[];
  if(cats.espresso.length)parts.push('espresso: '+cats.espresso.join(', '));
  if(cats.filter.length)parts.push('filter: '+cats.filter.join(', '));
  if(cats.algemeen.length)parts.push('general: '+cats.algemeen.join(', '));
  if(!parts.length)return '';
  return '\nDe gebruiker heeft deze uitrusting; stem het recept en de tips hierop af (bv. concreet maalgraad-advies voor deze molen, techniek passend bij deze tools/machine):\n- '+parts.join('\n- ')+'\n';
}
/* ---------------- dagelijkse brew-suggestie (melding) ---------------- */
function getReminder(){try{return JSON.parse(localStorage.getItem('scc_reminder'))||{};}catch(e){return{};}}
function setReminder(r){localStorage.setItem('scc_reminder',JSON.stringify(r));}
function renderReminder(){
  const r=getReminder(),on=!!r.on;
  const tg=document.getElementById('reminder-toggle');if(!tg)return;
  tg.classList.toggle('on',on);
  document.getElementById('reminder-wrap').classList.toggle('hidden',!on);
  document.getElementById('reminder-time').value=r.time||'08:00';
  const st=document.getElementById('reminder-status');
  if(st){
    if(!('Notification'in window))st.textContent='notifications aren\'t supported on this device.';
    else if(Notification.permission==='denied')st.textContent='notifications are off in your system settings — turn them on for Lets Brew.';
    else if(on&&Notification.permission==='granted')st.textContent='on — every day around '+(r.time||'08:00')+' we\'ll suggest a brew.';
    else if(on)st.textContent='please allow notifications (tap the button below or turn it on again).';
    else st.textContent='';
  }
}
async function toggleReminder(){
  const r=getReminder();
  if(!r.on){
    if(!('Notification'in window)){toast('notifications not supported on this device');return;}
    let perm=Notification.permission;
    if(perm==='default'){try{perm=await Notification.requestPermission();}catch(e){}}
    if(perm==='denied'){toast('allow notifications in your settings');}
    r.on=true;if(!r.time)r.time='08:00';setReminder(r);
    if(Notification.permission==='granted')syncPushSubscription();   // achtergrond-push (indien server ingesteld)
  }else{r.on=false;setReminder(r);disablePushSubscription();}
  renderReminder();scheduleReminder();
}
function saveReminderTime(){
  const r=getReminder();r.time=document.getElementById('reminder-time').value||'08:00';r.lastShown='';setReminder(r);
  renderReminder();scheduleReminder();
  if(r.on&&('Notification'in window)&&Notification.permission==='granted')syncPushSubscription();
  toast('time saved: '+r.time);
}
function testReminder(){
  if(('Notification'in window)&&Notification.permission!=='granted'){toast('turn on notifications first');return;}
  showBrewSuggestion(true);
}
function todayKey(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
let reminderTimer=null;
function scheduleReminder(){
  if(reminderTimer){clearTimeout(reminderTimer);reminderTimer=null;}
  const r=getReminder();if(!r.on)return;
  const [h,m]=(r.time||'08:00').split(':').map(Number);
  const now=new Date(),t=new Date();t.setHours(h||0,m||0,0,0);
  if(t<=now)t.setTime(t.getTime()+86400000);
  reminderTimer=setTimeout(()=>{showBrewSuggestion();scheduleReminder();},t-now);
}
async function showBrewSuggestion(force){
  const r=getReminder();
  if(!force){if(!r.on)return;if(r.lastShown===todayKey())return;}
  const reco=recommendBrew();
  const body=reco?('today: '+reco.method.name+(reco.bean?' with '+reco.bean.name:'')+' — tap to start')
                 :'time for a fresh cup — tap to start';
  r.lastShown=todayKey();setReminder(r);
  try{
    if('serviceWorker'in navigator&&('Notification'in window)&&Notification.permission==='granted'){
      // niet oneindig wachten als de service worker (nog) niet klaar is
      const reg=await Promise.race([navigator.serviceWorker.ready,new Promise(r=>setTimeout(()=>r(null),1500))]);
      if(reg){await reg.showNotification('time for coffee ☕',{body,icon:'icon-192.png',badge:'icon-192.png',tag:'daily-brew',data:{action:'quickbrew'}});return;}
    }
  }catch(e){}
  if(document.visibilityState==='visible')toast('☕ '+body);
}
// suggestie tonen als het tijdstip vandaag al voorbij is en nog niet getoond
function checkReminderOnOpen(){
  const r=getReminder();if(!r.on)return;
  const [h,m]=(r.time||'08:00').split(':').map(Number);
  const now=new Date(),t=new Date();t.setHours(h||0,m||0,0,0);
  if(now>=t&&r.lastShown!==todayKey())showBrewSuggestion();
  scheduleReminder();
}
/* echte achtergrond-push via de Cloudflare Worker (optioneel).
   laat PUSH_ENDPOINT leeg -> alleen lokale meldingen (app open / bij openen).
   vul de Worker-URL in -> ook een push op je tijd als de app dicht is. */
function PUSH_ENDPOINT_GET(){return (localStorage.getItem('scc_push_url')||'').trim();}
function urlBase64ToUint8Array(base64){
  const pad='='.repeat((4-base64.length%4)%4);
  const b=(base64+pad).replace(/-/g,'+').replace(/_/g,'/');
  const raw=atob(b);const out=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);
  return out;
}
function currentTz(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';}catch(e){return 'UTC';}}
async function syncPushSubscription(){
  const PUSH_ENDPOINT=PUSH_ENDPOINT_GET();
  if(!PUSH_ENDPOINT)return;                       // geen server ingesteld
  if(!('serviceWorker'in navigator)||!('PushManager'in window))return;
  try{
    const reg=await navigator.serviceWorker.ready;
    let sub=await reg.pushManager.getSubscription();
    if(!sub){
      const res=await fetch(PUSH_ENDPOINT.replace(/\/$/,'')+'/vapidPublicKey');
      const {key}=await res.json();
      if(!key)return;
      sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(key)});
    }
    const r=getReminder();
    await fetch(PUSH_ENDPOINT.replace(/\/$/,'')+'/subscribe',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({subscription:sub,time:r.time||'08:00',tz:currentTz()})
    });
  }catch(e){/* stil: lokale meldingen blijven werken */}
}
async function disablePushSubscription(){
  const PUSH_ENDPOINT=PUSH_ENDPOINT_GET();
  if(!PUSH_ENDPOINT)return;
  if(!('serviceWorker'in navigator)||!('PushManager'in window))return;
  try{
    const reg=await navigator.serviceWorker.ready;
    const sub=await reg.pushManager.getSubscription();
    if(!sub)return;
    await fetch(PUSH_ENDPOINT.replace(/\/$/,'')+'/unsubscribe',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({endpoint:sub.endpoint})
    }).catch(()=>{});
    await sub.unsubscribe().catch(()=>{});
  }catch(e){}
}
function toggleAI(){
  localStorage.setItem('scc_ai_on',aiEnabled()?'0':'1');
  renderProfile();
  toast(aiEnabled()?'AI on':'AI off');
}
function saveKey(){
  const v=document.getElementById('ai-key').value.trim();
  sessionAiKeys[aiProv()]=v;
  localStorage.removeItem(aiSleutelNaam());
  applyAIVisibility();
  try{renderAiProv();renderAiBudget();}catch(e){}
  toast(v?'✓ key available in this tab':'key cleared');
}
/* ---------------- stem voor de coaches (ElevenLabs) ----------------
   De sleutel zit alleen in BrewStem (geheugen van dit tabblad). De stem kies
   je uit je eigen ElevenLabs-lijst; de app verzint geen stem-id.            */
function renderStem(){
  const st=BrewStem.stand(),el=document.getElementById('stem-status');if(!el)return;
  const sel=document.getElementById('stem-kies');
  if(sel&&st.stem&&!Array.from(sel.options).some(o=>o.value===st.stem)){
    const o=document.createElement('option');o.value=st.stem;o.textContent=st.naam||'your chosen voice';sel.appendChild(o);
  }
  if(sel)sel.value=st.stem||'';
  el.textContent=st.actief?('ElevenLabs voice on: '+(st.naam||'your chosen voice')+'.')
    :st.afgewezen?'ElevenLabs refused this key — the coaches use the phone voice.'
    :!st.sleutel?(st.stem?'voice '+(st.naam||'chosen')+' is remembered; paste your key in this tab to use it. until then: phone voice.':'no key — the coaches use the phone voice.')
    :'key in this tab — load your voices and pick one. until then: phone voice.';
}
function stemSleutel(){
  const i=document.getElementById('stem-key'),v=i.value.trim();
  if(!BrewStem.zetSleutel(v)){toast('that does not look like an ElevenLabs key');return;}
  i.value='';                      // niet in het veld laten staan; de status zegt dat hij er is
  renderStem();toast(v?'✓ key available in this tab':'key cleared');
}
async function stemLaad(){
  const el=document.getElementById('stem-status');
  if(!BrewStem.stand().sleutel){toast('paste your ElevenLabs key first');return;}
  el.textContent='loading your voices…';
  try{
    const lijst=await BrewStem.stemmen(),sel=document.getElementById('stem-kies');
    sel.textContent='';
    const leeg=document.createElement('option');leeg.value='';leeg.textContent=lijst.length?'— pick one of your voices —':'— no voices in your account —';sel.appendChild(leeg);
    lijst.forEach(v=>{const o=document.createElement('option');o.value=v.voice_id;o.textContent=v.name+(v.category?' · '+v.category:'');o.dataset.naam=v.name;sel.appendChild(o);});
    renderStem();
    if(lijst.length)toast('✓ '+lijst.length+' voices — pick one');
  }catch(e){el.textContent=(e&&e.message)||'could not load your voices';}
}
function stemKies(){
  const sel=document.getElementById('stem-kies'),o=sel.selectedOptions[0];
  BrewStem.kiesStemId(sel.value,o&&o.dataset.naam||'');
  renderStem();
}
function stemTest(){BrewStem.zeg('Over drie tellen bloom, naar 45 gram.');}

/* ---------------- AI-budget: wat de AI deze maand kostte -------------------
   Anthropic geeft met een gewone sleutel nergens terug hoeveel tegoed er nog op
   je account staat -- dat kan alleen met een aparte beheerderssleutel, en die
   heeft de app niet. Wat wel bij elk antwoord meekomt, is een `usage`-blok met
   het aantal tekens erin en eruit. Daarmee telt de app precies wat ZIJ uitgeeft,
   en zet dat af tegen een plafond dat jij zelf kiest. De lijn loopt dus naar jouw
   plafond, niet naar je echte saldo -- dat laatste zou verzonnen zijn.        */
const AI_BRONNEN=[['finder','ask the finder'],['bean','beans & labels'],
  ['brew','brew tips & recipes'],['surprise','surprise recipes'],['learn','learn: tell me more'],
  ['pour','pour photos'],['recap','weekly recap'],['other','other answers']];
const AI_KORT={finder:'finder<br>questions',bean:'label<br>scans',brew:'brew<br>tips',surprise:'surprise<br>recipes',
  learn:'learn<br>answers',pour:'pour<br>photos',recap:'recaps',other:'other<br>answers'};
/* hoe groot zo'n vraag ongeveer is (tokens in, tokens uit), zolang je er zelf
   nog te weinig van gedaan hebt om een gemiddelde te vertrouwen. Nagemeten op
   de prompts in de app (nov 2026): een brew-vraag stuurt drie regelblokken
   mee (~1000 tokens) plus de vraag; een foto is ~1600 tokens. De oude
   schatting (600 in voor een brew-vraag) vergat die blokken. Bij finder,
   brew, recap en surprise komt je eigen lokale context (bonen, recepten,
   brews) er nog bij: die meet aiContextTok() op het moment zelf.         */
const AI_SCHAT={finder:[4000,900],bean:[2200,450],brew:[1500,450],learn:[900,450],
  pour:[2000,600],recap:[900,400],surprise:[1700,700],other:[1000,400]};
const AI_MET_CONTEXT=['finder','brew','recap','surprise'];
// ongeveer 3,2 tekens per token voor Nederlandse tekst en JSON
function aiContextTok(){
  try{return Math.round(JSON.stringify(BrewModel.context(state,ALLE_RECEPTEN(),{})).length/3.2)+60;}
  catch(e){return 0;}
}
const AI_PLAFONDS=[2,5,10];

const aiGeld=v=>'$'+(Math.round(v*100)/100).toFixed(2);
function aiMaand(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');}
// haalt de teller op, en rolt hem om zodra er een nieuwe maand begonnen is
function aiBud(){
  if(!state.ai)state.ai={budget:5,maand:aiMaand(),dagen:{},bron:{},gemeld:{}};
  if(state.ai.maand!==aiMaand()){
    state.ai.maand=aiMaand();state.ai.dagen={};state.ai.bron={};state.ai.gemeld={};
  }
  // toen er nog maar één aanbieder was stond de bron er zonder naam voor
  for(const k in state.ai.bron)if(k.indexOf(':')<0){
    state.ai.bron['anthropic:'+k]=state.ai.bron[k];delete state.ai.bron[k];
  }
  return state.ai;
}
function aiBesteed(){const d=aiBud().dagen;let t=0;for(const k in d)t+=d[k];return t;}
function aiOver(){const a=aiBud();return a.budget==null?null:Math.max(0,a.budget-aiBesteed());}
/* de prijs van zo'n vraag: eerst je eigen cijfers, en pas een schatting zolang
   je er nog te weinig gedaan hebt om een gemiddelde te vertrouwen. Je eigen
   cijfers staan in tokens, zodat ze na een modelwissel tegen de nieuwe prijs
   gerekend worden. Oude tellingen (alleen dollars) tellen tot er tokens zijn. */
function aiPerVraag(bron){
  const b=aiBud().bron[aiProv()+':'+bron],t=aiTarief();
  if(b&&b.tn>=3&&b.ti>0)return (b.ti*t.in+b.tu*t.uit)/b.tn;
  if(b&&b.n>=3&&b.d>0&&!b.tn)return b.d/b.n;
  const g=AI_SCHAT[bron]||AI_SCHAT.other;
  const inTok=g[0]+(AI_MET_CONTEXT.includes(bron)?aiContextTok():0);
  return inTok*t.in+g[1]*(t.denkt?1.8:1)*t.uit;
}
function aiTel(usage,bron,id){
  id=id||aiProv();
  // Lets Brew AI kost jou niets: niet als eigen uitgave tellen
  if(!usage||aiAanbieder(id).server)return;
  const a=aiBud();
  // de app gebruikt geen prompt-caching, dus die twee velden zijn nul -- ze staan
  // erbij zodat een gecachete aanroep later niet per ongeluk gratis lijkt
  const inTok=(usage.input_tokens||0)+(usage.cache_creation_input_tokens||0)+
              (usage.cache_read_input_tokens||0);
  const t=aiTarief(id);
  const d=inTok*t.in+(usage.output_tokens||0)*t.uit;
  if(!(d>0))return;
  const dag=new Date().getDate();
  a.dagen[dag]=(a.dagen[dag]||0)+d;
  // per aanbieder apart bijhouden: een vraag aan de een kost iets heel anders
  // dan dezelfde vraag aan de ander
  const naam=AI_BRONNEN.some(x=>x[0]===bron)?bron:'other';
  const k=id+':'+naam;
  if(!a.bron[k])a.bron[k]={n:0,d:0};
  const r=a.bron[k];
  r.n++;r.d+=d;
  r.tn=(r.tn||0)+1;r.ti=(r.ti||0)+inTok;r.tu=(r.tu||0)+(usage.output_tokens||0);
  a.laatste=naam;
  save();
  if(currentPage==='profile'){try{renderAiBudget();}catch(e){}}
}
/* de melding: precies twee keer per maand, bij 20% en bij 10%. Daarna zwijgt de
   app tot de 1e -- ook als je doorgaat tot nul. De kaart in instellingen staat
   er altijd voor wie wil kijken.                                              */
function aiMeldNa(){
  if(!featOn('aibudget')||aiAanbieder().server)return;
  const a=aiBud();
  if(a.budget==null||!(a.budget>0))return;
  const deel=aiOver()/a.budget;
  let n=0;
  if(deel<=.10&&!a.gemeld.p10)n=10;
  else if(deel<=.20&&!a.gemeld.p20)n=20;
  if(!n)return;
  a.gemeld.p20=true;                     // 20 is altijd voorbij als 10 dat is
  if(n===10)a.gemeld.p10=true;
  save();aiPop(n);
}
function aiPop(n){
  const el=document.getElementById('aibud-pop');if(!el)return;
  const a=aiBud(),over=aiOver(),deel=a.budget?over/a.budget:0;
  const v=Math.max(0,Math.round(over/aiPerVraag(a.laatste||'finder')));
  const e=new Date();e.setDate(1);e.setMonth(e.getMonth()+1);
  const nieuw=e.toLocaleDateString('en-GB',{day:'numeric',month:'short'});
  el.innerHTML='<div class="aib-pop">'+
    '<div class="k">'+(n===20?'a fifth of your AI budget left':'a tenth left — last word on it')+'</div>'+
    '<div class="m"><b>'+aiGeld(over)+'</b> of your '+aiGeld(a.budget)+
      ' is left this month — about <b>'+v+' question'+(v===1?'':'s')+'</b> like that one.</div>'+
    '<div class="aib-meter"><i'+(n===10?' class="op"':'')+' style="right:'+
      Math.max(0,Math.min(100,Math.round((1-deel)*100)))+'%"></i></div>'+
    '<div class="aib-schaal"><span>$0</span><span>'+aiGeld(a.budget)+' · resets '+nieuw+'</span></div>'+
    '<div class="m zacht">'+(n===20
      ?'You’ll hear this once more at 10%, then not again this month.'
      :'From here the app stays quiet, whether you stop or spend the rest. Settings → AI has the full picture.')+'</div>'+
    '<div class="aib-knoppen">'+
      '<button class="naar" onclick="aiPopWeg();go(\'profile\')">settings</button>'+
      '<button class="ok" onclick="aiPopWeg()">ok</button></div></div>';
  el.classList.remove('hidden');
}
function aiPopWeg(){const el=document.getElementById('aibud-pop');if(el)el.classList.add('hidden');}
function renderAiProv(){
  const c=document.getElementById('ai-prov-chips');if(!c)return;
  const nu=aiProv(),a=aiAanbieder(),lb=typeof aiLbKan==='function'&&aiLbKan();
  // met Lets Brew AI voor dit account eerst de keuze: de sleutel van de app, of je eigen
  const lw=document.getElementById('ai-lb-wrap'),eigen=document.getElementById('ai-eigen');
  if(lw)lw.innerHTML=lb?'<div class="aib-chips lb-keus" role="group" aria-label="who answers">'+
      '<button class="lp'+(a.server?' sel':'')+'" id="ai-kies-lb" onclick="setAiProv(\'letsbrew\')">Lets Brew AI</button>'+
      '<button class="lp'+(a.server?'':' sel')+'" id="ai-kies-eigen" onclick="setAiProv(aiEigenProv())">own key</button></div>'+
      (a.server?aiLbHtml():''):'';
  if(eigen)eigen.classList.toggle('hidden',!!a.server);
  c.innerHTML=AI_AANBIEDERS.filter(x=>!x.server).map(x=>'<button class="lp'+(x.id===nu?' sel':'')+
    '" onclick="setAiProv(\''+x.id+'\')">'+esc(x.naam)+'</button>').join('');
  const k=document.getElementById('ai-key');
  if(k){k.placeholder=a.hint;k.value=getKey();}
  const st=document.getElementById('ai-key-status');
  if(st)st.textContent=getKey()?('✓ '+a.naam+' key in this tab only'):('no '+a.naam+' key yet');
  const m=document.getElementById('ai-model-wrap');
  if(!m)return;
  if(a.server||!getKey()){m.innerHTML='';return;}
  const t=aiTarief();
  const herkomst=t.bron==='list'?'from the app’s price list ('+AI_PRIJZEN_PEIL+') for this model'
    :t.bron==='own'?'your own numbers for this model'
    :'the app doesn’t know this model — these are a guess, please fill in the real price';
  m.innerHTML='<div class="set-d" style="margin:13px 0 4px">which model answers</div>'+
    '<input class="ai-veld" id="ai-model" value="'+esc(aiModel())+'" placeholder="'+
      esc(a.model)+'" onchange="setAiModel(this.value)">'+
    '<div class="set-d" style="margin:13px 0 4px">what that model costs per million tokens — '+
      esc(herkomst)+'. The app counts your spending with these two numbers; check them at '+esc(a.waar)+
      ' and correct them here.'+(t.denkt?' This model thinks before it answers; that thinking is billed as output and is counted.':'')+'</div>'+
    '<div class="aib-prijs">'+
      '<label>in <input class="ai-veld" id="ai-prijs-in" type="number" inputmode="decimal" '+
        'step="0.01" min="0" value="'+(t.in*1e6)+'" onchange="setAiPrijs()"></label>'+
      '<label>out <input class="ai-veld" id="ai-prijs-uit" type="number" inputmode="decimal" '+
        'step="0.01" min="0" value="'+(t.uit*1e6)+'" onchange="setAiPrijs()"></label></div>';
}
function setAiProv(id){
  const x=AI_AANBIEDERS.find(y=>y.id===id);if(!x)return;
  if(x.server&&!(typeof aiLbKan==='function'&&aiLbKan()))return;
  localStorage.setItem('scc_ai_prov',id);
  if(!x.server)localStorage.setItem('scc_ai_prov_eigen',id);
  renderAiProv();renderAiBudget();applyAIVisibility();
  toast(x.server?'Lets Brew AI — no key needed':aiAanbieder().naam+(getKey()?' — key in this tab':' — paste a key'));
}
function setAiModel(v){
  localStorage.setItem('scc_ai_model_'+aiProv(),(v||'').trim());
  renderAiProv();renderAiBudget();toast('✓ model: '+aiModel());
}
function setAiPrijs(){
  const i=document.getElementById('ai-prijs-in'),u=document.getElementById('ai-prijs-uit');
  if(!i||!u)return;
  const a=parseFloat(i.value),b=parseFloat(u.value);
  if(!(a>=0)||!(b>=0)){toast('those need to be numbers');return;}
  localStorage.setItem(aiPrijsSleutel(aiProv(),aiModel()),JSON.stringify({in:a,uit:b}));
  renderAiProv();renderAiBudget();toast('✓ rate saved for '+aiModel());
}
function setAiBudget(v){
  const a=aiBud();
  a.budget=(v==null?null:+v);
  a.gemeld={};                            // een nieuw plafond, dus opnieuw waarschuwen
  save();renderAiBudget();
  toast(v==null?'no ceiling — just counting':'ceiling set to '+aiGeld(+v));
}
/* de aflopende lijn. Elke dag van de maand een punt; vanaf vandaag een
   stippellijn die doortrekt in het tempo waarin je tot nu toe uitgaf.         */
function aiLijnSVG(){
  const a=aiBud(),nu=new Date();
  const inMaand=new Date(nu.getFullYear(),nu.getMonth()+1,0).getDate();
  const vandaag=nu.getDate(),bud=a.budget,besteed=aiBesteed();
  const X=d=>6+(d-1)*(268/Math.max(1,inMaand-1));
  const top=bud!=null?bud:Math.max(besteed*1.3,.5);
  const Y=v=>88-(Math.max(0,Math.min(top,v))/top)*80;
  let loop=0,pad='';
  for(let d=1;d<=vandaag;d++){
    loop+=a.dagen[d]||0;
    pad+=(d===1?'M':' L')+X(d).toFixed(1)+','+Y(bud!=null?bud-loop:loop).toFixed(1);
  }
  const lx=X(vandaag).toFixed(1), ly=Y(bud!=null?bud-besteed:besteed).toFixed(1);
  const op=bud!=null&&besteed>=bud*.8;
  let svg='<svg viewBox="0 0 280 108" aria-hidden="true">';
  if(bud!=null)svg+='<rect class="band" x="6" y="'+Y(bud*.2).toFixed(1)+'" width="268" height="'+
    (88-Y(bud*.2)).toFixed(1)+'"/>';
  svg+='<line class="as" x1="6" y1="8" x2="6" y2="88"/>'+
       '<line class="nul" x1="6" y1="88" x2="274" y2="88"/>'+
       '<path class="weg'+(op?' op':'')+'" d="'+(pad||('M6,'+Y(bud!=null?bud:0)))+'"/>';
  // vooruitblik: alleen als er iets te voorspellen valt
  let bij='';
  if(vandaag>=2&&besteed>0){
    const tempo=besteed/vandaag, eind=besteed+tempo*(inMaand-vandaag);
    svg+='<path class="straks" d="M'+lx+','+ly+' L'+X(inMaand).toFixed(1)+','+
      Y(bud!=null?Math.max(0,bud-eind):eind).toFixed(1)+'"/>';
    if(bud!=null){
      if(eind<bud){
        bij='<text class="eind" x="272" y="'+Math.min(84,(+Y(bud-eind)+16)).toFixed(1)+
          '">≈ '+aiGeld(bud-eind)+' left</text>';
      }else{
        const dOp=Math.ceil(bud/tempo);
        if(dOp<=inMaand)bij='<text class="eind" x="272" y="80">empty around '+dOp+' '+
          nu.toLocaleDateString('en-GB',{month:'short'})+'</text>';
      }
    }
  }
  svg+='<circle class="nu'+(op?' op':'')+'" cx="'+lx+'" cy="'+ly+'" r="4.4"/>'+
       '<text x="6" y="102">1 '+nu.toLocaleDateString('en-GB',{month:'short'})+'</text>'+
       '<text x="'+lx+'" y="102" text-anchor="middle">today</text>'+
       (vandaag<inMaand-2?'<text class="eind" x="274" y="102">'+inMaand+'</text>':'')+
       bij+'</svg>';
  return svg;
}
function renderAiBudget(){
  const el=document.getElementById('ai-bud-wrap');if(!el)return;
  if(!featOn('aibudget')||!aiReady()||aiAanbieder().server){el.innerHTML='';return;}
  const a=aiBud(),bud=a.budget,besteed=aiBesteed(),over=aiOver(),nu=new Date();
  const dag=nu.getDate();
  const op=bud!=null&&besteed>=bud*.8;
  let h='<div class="set-d" style="margin-bottom:2px">this month, so far · '+
    esc(aiModel())+'</div>';
  h+='<div class="aib-groot'+(op?' op':'')+'">'+(bud!=null
      ?aiGeld(over)+' <span class="van">of '+aiGeld(bud)+'</span>'
      :aiGeld(besteed)+' <span class="van">spent</span>')+'</div>';
  h+='<div class="set-d">'+nu.toLocaleDateString('en-GB',{day:'numeric',month:'long'})+
     ' · '+aiGeld(besteed)+' spent in '+dag+' day'+(dag===1?'':'s')+'</div>';
  h+='<div class="aib-lijn">'+aiLijnSVG()+'</div>';
  // hoeveel is dat nog in vragen? Eerst de knoppen die je zelf het meest gebruikt
  if(bud!=null){
    const gebruikt=AI_BRONNEN.filter(b=>a.bron[aiProv()+':'+b[0]])
      .sort((x,y)=>a.bron[aiProv()+':'+y[0]].n-a.bron[aiProv()+':'+x[0]].n).map(b=>b[0]);
    const toon=(gebruikt.concat(['finder','bean','brew']).filter((v,i,z)=>z.indexOf(v)===i)).slice(0,3);
    h+='<div class="aib-vert">'+toon.map(k=>'<div><div class="n">'+
      Math.round(over/aiPerVraag(k))+'</div><div class="l">'+AI_KORT[k]+'</div></div>').join('')+'</div>';
  }
  // waar het heen ging
  // over alle aanbieders bij elkaar: het gaat om waar JIJ het aan uitgaf
  const tel={};
  for(const k in a.bron){const n=k.split(':')[1];
    if(!tel[n])tel[n]={n:0,d:0};tel[n].n+=a.bron[k].n;tel[n].d+=a.bron[k].d;}
  const rijen=AI_BRONNEN.filter(b=>tel[b[0]]&&tel[b[0]].d>0)
    .sort((x,y)=>tel[y[0]].d-tel[x[0]].d);
  if(rijen.length){
    const max=tel[rijen[0][0]].d;
    h+='<div class="eyebrow" style="margin-top:14px"><span>where it went</span></div>'+
       '<div class="aib-bron">'+rijen.map(b=>{
      const r=tel[b[0]];
      return '<div class="r"><div class="w">'+esc(b[1])+' <span class="set-d" style="display:inline">'+
        r.n+'×</span><div class="b" style="width:'+Math.max(6,Math.round(r.d/max*100))+
        '%"></div></div><div class="g">'+aiGeld(r.d)+'</div></div>';
    }).join('')+'</div>';
  }
  // het plafond zelf
  h+='<div class="eyebrow" style="margin-top:14px"><span>what may it cost you per month?</span></div>'+
     '<div class="aib-chips">'+AI_PLAFONDS.map(v=>'<button class="lp'+(bud===v?' sel':'')+
       '" onclick="setAiBudget('+v+')">$'+v+'</button>').join('')+
     '<button class="lp'+(bud==null?' sel':'')+'" onclick="setAiBudget(null)">no ceiling</button></div>';
  const naamA=aiAanbieder().naam;
  h+='<div class="set-d" style="margin-top:8px">Resets on the 1st. Counted on this device only, '+
     'from the token counts '+esc(naamA)+' sends back with each answer, priced at the rate above — '+
     'your real credit at '+esc(naamA)+' can’t be read with an ordinary key. '+
     'The live voice coach and the ElevenLabs voice are billed separately and are not in this count.</div>';
  el.innerHTML=h;
}

/* toont/verbergt alle AI-knoppen door .ai-only klassen */
function applyAIVisibility(){
  document.querySelectorAll('.ai-only').forEach(el=>el.classList.toggle('hidden',!aiReady()));
}

/* ---------------- export / import ---------------- */
const APP_VERSION='2026.10-workspace2';
/* ================= de datalaag =================================================
   Binnen in de app is `state` gegroeid zoals het uitkwam. Dat is prima om mee te
   werken, maar niets om andere software aan vast te knopen: verandert er iets aan
   de binnenkant, dan breekt alles wat meekijkt.

   Daarom ligt hier een tweede, vaste vorm eroverheen. Beans, brews en methods met
   hun koppelingen expliciet als ids, één versienummer, en alles alleen te lezen.
   De binnenkant mag daaronder blijven schuiven.                                */
const LB_SCHEMA=2;
// kopie zonder verbinding met state: wat je hier krijgt kun je niet stukmaken
const lbKopie=v=>JSON.parse(JSON.stringify(v==null?null:v));
const lbIso=ts=>{const d=new Date(ts||0);return isNaN(d.getTime())?null:d.toISOString();};

function lbMethod(m){
  return {id:m.id,name:m.name||'',family:methodFamily(m),enabled:m.on!==false,
    gearIds:Array.isArray(m.gear)?m.gear.slice():[]};
}
function lbBean(b){
  const f=beanFreshness(b);
  const dials={};
  Object.keys((b.dialed&&typeof b.dialed==='object')?b.dialed:{}).forEach(mid=>{
    const d=b.dialed[mid];if(!d||!d.grind)return;
    dials[mid]={grind:d.grind,dose:d.dose==null?null:d.dose,yield:d.yield==null?null:d.yield,
      time:d.time||null,timeSec:parseTimeSec(d.time),drink:d.drink||null,at:lbIso(d.ts)};
  });
  return {id:b.id,name:b.name||'',roaster:b.roaster||null,origin:b.origin||null,
    process:b.process||null,variety:b.variety||null,altitudeM:altitudeOf(b),
    roastLevel:b.roast||null,roastDate:b.roastdate||null,daysSinceRoast:f?f.days:null,
    roasterNotes:b.roasternotes||null,notes:b.notes||null,inStock:b.inStock!==false,
    decaf:isDecaf(b),bagLabel:b.fam||null,lastMethodId:b.lastMethod||null,
    regions:(Array.isArray(b.regions)?b.regions:(b.region?[b.region]:[]))
      .map(r=>({land:r.land,i:r.i==null?null:r.i})),
    region:(Array.isArray(b.regions)&&b.regions[0])||b.region||null,
    methodIds:(Array.isArray(b.methods)&&b.methods.length?b.methods:(b.method?[b.method]:[])).slice(),
    dials,
    brewIds:state.brews.filter(x=>x.beanId===b.id).map(x=>x.id)};
}
function lbBrew(x){
  return {id:x.id,at:lbIso(x.ts),methodId:x.method||null,beanId:x.beanId||null,
    beanName:x.beans||null,title:x.title||null,drink:x.drink||null,
    dose:x.dose==null?null:x.dose,yield:x.yield==null?null:x.yield,
    ratio:x.ratio==null?null:x.ratio,time:x.time||null,timeSec:parseTimeSec(x.time),
    grind:x.grind||null,temp:x.temp==null?null:x.temp,
    score:x.score==null?null:x.score,tags:asArr(x.tags).slice(),notes:x.notes||null,
    kind:x.kind||(x.dialIn?'dial-in':'brew'),recipeId:x.recipeId||null,recipeSnapshot:x.recipeSnapshot?lbKopie(x.recipeSnapshot):null,beanSnapshot:x.beanSnapshot?lbKopie(x.beanSnapshot):null,isDialIn:isDialInBrew(x),target:x.target?lbKopie(x.target):null,shot:x.shot?lbKopie(x.shot):null};
}
function lbRecipe(r){
  return {id:r.id,name:r.naam||'',family:recipeFam(r),methodId:methodForRecipe(r),
    dose:r.dose==null?null:r.dose,ratio:r.ratio==null?null:r.ratio,
    temp:r.temp==null?null:r.temp,grind:r.maling||null,targetGrind:r.stand||null,
    own:!!r.eigen};
}
// alle pogingen per boon+methode, in de volgorde waarin je ze deed
function lbDialLog(){
  const log=state.dialLog||{};
  return Object.keys(log).map(k=>{
    const i=k.indexOf('|');
    return {beanId:k.slice(0,i)||null,methodId:k.slice(i+1),
      attempts:(log[k]||[]).map(a=>({at:lbIso(a.ts),grind:a.g||null,time:a.t||null,
        timeSec:parseTimeSec(a.t),yield:a.y==null?null:a.y,dose:a.d==null?null:a.d}))};
  }).filter(x=>x.attempts.length);
}
// het hele model in één keer, koppelingen als ids
function lbGraph(){
  return {
    app:'lets-brew-specialty', schema:LB_SCHEMA, appVersion:APP_VERSION,
    generatedAt:new Date().toISOString(),
    methods:(state.methods||[]).map(lbMethod),
    beans:(state.beans||[]).map(lbBean),
    brews:(state.brews||[]).slice().sort((a,b)=>b.ts-a.ts).map(lbBrew),
    recipes:(state.recipes||[]).concat(ALLE_RECEPTEN()).map(lbRecipe),
    dialLog:lbDialLog(),
    gear:(state.gear||[]).map(g=>({id:g.id,name:g.name||'',category:g.category||null,kind:g.kind||null,
      grindMin:g.grindMin==null?null:g.grindMin,grindMax:g.grindMax==null?null:g.grindMax}))
  };
}
/* De leeskant voor andere software op dit toestel. Alleen lezen, en alles komt er
   als kopie uit -- een koppeling mag nooit je logboek kunnen wijzigen. Schrijven
   loopt via de schermen zelf en via "add from a friend".                       */
window.LetsBrew=Object.freeze({
  schema:LB_SCHEMA,
  appVersion:APP_VERSION,
  methods:()=>lbGraph().methods,
  beans:()=>lbGraph().beans,
  recipes:()=>lbGraph().recipes,
  gear:()=>lbGraph().gear,
  method:id=>{const m=methodById(id);return m?lbMethod(m):null;},
  bean:id=>{const b=beanById(id);return b?lbBean(b):null;},
  brew:id=>{const x=(state.brews||[]).find(y=>y.id===id);return x?lbBrew(x):null;},
  // filter: {beanId, methodId, since (ISO of ms), dialInOnly, limit}
  brews:(f)=>{
    f=f||{};
    const sinds=f.since?(typeof f.since==='number'?f.since:Date.parse(f.since)):null;
    let uit=(state.brews||[]).filter(x=>
      (!f.beanId||x.beanId===f.beanId)&&
      (!f.methodId||x.method===f.methodId)&&
      (!sinds||(x.ts||0)>=sinds)&&
      (!f.dialInOnly||isDialInBrew(x)));
    uit=uit.sort((a,b)=>b.ts-a.ts);
    if(f.limit>0)uit=uit.slice(0,f.limit);
    return uit.map(lbBrew);
  },
  // alles wat aan één boon hangt, in één keer
  beanGraph:id=>{
    const b=beanById(id);if(!b)return null;
    const bean=lbBean(b);
    return {bean,
      brews:(state.brews||[]).filter(x=>x.beanId===id).sort((a,c)=>c.ts-a.ts).map(lbBrew),
      methods:bean.methodIds.map(m=>methodById(m)).filter(Boolean).map(lbMethod),
      dialLog:lbDialLog().filter(d=>d.beanId===id)};
  },
  graph:()=>lbGraph()
});
/* Meekijken van buiten het venster: wie de app in een iframe zet of met
   window.open opent, kan hem hetzelfde vragen. Vraag erin, antwoord eruit. */
window.addEventListener('message',ev=>{
  const q=ev.data;
  if(ev.origin!==location.origin||!q||q.lb!=='query'||!ev.source)return;
  let data=null,fout=null;
  try{
    const api=window.LetsBrew;
    const fn=Object.hasOwn(api,q.method)?api[q.method]:undefined;
    data=(typeof fn==='function')?fn(q.arg):(fn===undefined?null:fn);
    if(fn===undefined)fout='unknown method: '+q.method;
  }catch(e){fout=e.message;}
  ev.source.postMessage({lb:'result',id:q.id||null,schema:LB_SCHEMA,
    data:fout?null:data,error:fout},ev.origin);
});
function apiStat(){
  const el=document.getElementById('api-stat');if(!el)return;
  const g=lbGraph();
  el.textContent='schema v'+g.schema+' \u00b7 '+g.beans.length+' bean'+(g.beans.length===1?'':'s')+
    ', '+g.brews.length+' brew'+(g.brews.length===1?'':'s')+', '+
    g.methods.filter(m=>m.enabled).length+' method'+(g.methods.filter(m=>m.enabled).length===1?'':'s')+'.';
}
function apiCopy(){
  const t=JSON.stringify(lbGraph(),null,2);
  (navigator.clipboard&&navigator.clipboard.writeText)
    ? navigator.clipboard.writeText(t).then(()=>toast('\u2713 data copied as JSON'),()=>toast('couldn\u2019t copy \u2014 use the download instead'))
    : toast('couldn\u2019t copy \u2014 use the download instead');
}
function apiDownload(){
  const blob=new Blob([JSON.stringify(lbGraph(),null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='lets-brew-data.json';a.click();
  URL.revokeObjectURL(url);toast('data file downloaded');
}
function apiCopyLink(){
  const url=location.origin+location.pathname+'?api=graph';
  (navigator.clipboard&&navigator.clipboard.writeText)
    ? navigator.clipboard.writeText(url).then(()=>toast('read link copied'),()=>prompt('copy this link:',url))
    : prompt('copy this link:',url);
}
/* ?api=graph -- de data als kale JSON, zodat een Shortcut of een ander programma
   hem kan ophalen zonder de app te hoeven kennen.                            */
let lbApiMode=false;
function apiPagina(){
  const q=/[?&]api=([a-z]+)/.exec(location.search);
  if(!q)return false;
  lbApiMode=true;
  const data=(q[1]==='graph')?lbGraph():{error:'unknown api: '+q[1],schema:LB_SCHEMA};
  document.open();
  document.write('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>lets brew \u00b7 data</title><pre style="white-space:pre-wrap;word-break:break-word;'+
    'font:13px ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px;margin:0">'+
    JSON.stringify(data,null,2).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</pre>');
  document.close();
  return true;
}
async function exportData(){
  await saveQueue;
  const original=storageBlocked?await idbGet(IDB_KEY):state;
  const blob=new Blob([JSON.stringify(original,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='lets-brew-specialty-backup.json';a.click();
  URL.revokeObjectURL(url);toast('back-up downloaded');
}
function importData(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  try{BrewSecurity.checkFile(file);}catch(e){toast(e.message);ev.target.value='';return;}
  const r=new FileReader();
  r.onload=()=>{
    try{const d=BrewSecurity.validateImport(JSON.parse(r.result),{backup:true});
      if(!d.methods||!d.brews)throw new Error('ongeldig');
      if(!d.beans)d.beans=[];
      if(!confirm('this replaces your current data. continue?')){ev.target.value='';return;}
      state=BrewModel.migrate(normaliseerData(d));storageBlocked=false;
      mergeMethodImages();          // dezelfde opschoning als bij het opstarten
      save();toast('✓ data imported');renderAll();go('home');
    }catch(e){toast('couldn\'t read the file');}
    ev.target.value='';
  };
  r.readAsText(file);
}

/* ---------------- wat is er nieuw ---------------- */
const NIEUWS=[
  ['pour coach','filterrecepten lopen mee met de klok'],
  ['zeven recepten','Hoffmann, 4:6, Rao en meer, op jouw dose'],
  ['filterkompas','wat je proefde \u2192 \u00e9\u00e9n vervolgstap'],
  ['doorlooptijd','plus hoe het bed erbij lag'],
  ['waterkaart','reken je eigen recept uit'],
  ['filter skills','een eigen leerspoor bij learn'],
];
function toonNieuws(){
  const el=document.getElementById('wn-list');if(!el)return;
  const bolletje='<svg viewBox="0 0 16 16"><path d="M12.6 5.2 C14 8.6 11.4 12.6 7.6 12 C3.6 11 3 6 6 3.6 C8.6 1.8 12 3.4 12.8 6.4"/></svg>';
  el.innerHTML=NIEUWS.map(([k,t])=>
    `<div class="wn-i">${bolletje}<span><b>${esc(k)}</b> — ${esc(t)}</span></div>`).join('');
  const p=document.getElementById('whatsnew');
  p.classList.add('on');p.setAttribute('aria-hidden','false');
}
function sluitNieuws(){
  const p=document.getElementById('whatsnew');if(!p)return;
  p.classList.remove('on');p.setAttribute('aria-hidden','true');
  try{localStorage.setItem('scc_seen_version',APP_VERSION);}catch(e){}
}
/* Alleen tonen aan wie de vorige versie al draaide. Een verse installatie
   krijgt niets te zien — die heeft immers niets gemist. */
function nieuwsMisschien(){
  let seen=null;
  try{seen=localStorage.getItem('scc_seen_version');}catch(e){}
  if(seen===APP_VERSION)return;
  if(!seen && !hadOpgeslagenData){
    try{localStorage.setItem('scc_seen_version',APP_VERSION);}catch(e){}
    return;
  }
  setTimeout(toonNieuws,900);
}
