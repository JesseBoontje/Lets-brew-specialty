/* ---------------- beans ---------------- */
let expandedBeans=new Set();
let extraKastOpen=false;
function toggleBeanCard(id){ if(expandedBeans.has(id))expandedBeans.delete(id); else expandedBeans.add(id); renderBeans(); }
function toggleExtraKast(){ extraKastOpen=!extraKastOpen; renderBeans(); }
// subtiele versheid op basis van roastdate (YYYY-MM-DD)
function roastDays(b,atTs){
  if(!b||!b.roastdate)return null;
  const d=new Date(b.roastdate+'T00:00:00');if(isNaN(d.getTime()))return null;
  const days=Math.floor(((atTs||Date.now())-d.getTime())/86400000);
  return days<0?null:days;
}
function beanFreshness(b,atTs){
  const days=roastDays(b,atTs);if(days==null)return null;
  const pk=freshPeak(b);
  let label;
  if(days===0)label='roasted today — let it rest';
  else if(days<pk.start)label=days+' days — still resting';
  else if(days<=pk.end)label=days+' days fresh';
  else if(days<=pk.end+14)label=days+' days — past peak';
  else label=days+' days — over the hill';
  return {days,label};
}
/* Wanneer is een boon op z'n best? Eerst wat jouw eigen cijfers zeggen, anders
   de gewone curve (filter rust korter dan espresso).
   Leren: per kop het cijfer min het gemiddelde van die boon (zo telt een
   betere boon niet als "betere dag"), dan per dag na branden een glad
   gemiddelde (gewicht valt weg over ~3 dagen). De piek is de dag met het
   hoogste gemiddelde; het venster loopt zolang het niet meer dan 0,4 punt
   onder die piek zakt. Te weinig cijfers: de gewone curve.            */
const PEAK_MIN_BEAN=5, PEAK_MIN_ALL=8;
function freshPeakDefault(b){return {start:(b&&b.fam==='filter')?4:7,end:21,learned:false,n:0,from:'curve'};}
function freshPeakPunten(beanId){
  const per={},bonen=new Map((state.beans||[]).map(x=>[x.id,x]));
  (state.brews||[]).forEach(br=>{
    if(!br||!br.beanId||br.score==null||br.score==='')return;
    if(beanId&&br.beanId!==beanId)return;
    const bean=bonen.get(br.beanId);
    const d=roastDays(bean,br.ts);const sc=+br.score;
    if(d==null||d>60||!isFinite(sc))return;
    (per[br.beanId]||(per[br.beanId]=[])).push({d,sc});
  });
  const pts=[];
  for(const k in per){const l=per[k],gem=l.reduce((t,x)=>t+x.sc,0)/l.length;
    l.forEach(x=>pts.push({d:x.d,rel:x.sc-gem,bean:k}));}
  return pts;
}
function freshPeakLeer(pts){
  const ds=pts.map(p=>p.d),span=Math.max(...ds)-Math.min(...ds);
  if(span<6)return null;
  const glad=[];
  for(let d=0;d<=45;d++){
    let w=0,t=0;
    pts.forEach(p=>{const g=Math.exp(-((p.d-d)**2)/18);w+=g;t+=g*p.rel;});
    glad[d]=w>=1.5?t/w:null;
  }
  let best=-1;
  glad.forEach((v,d)=>{if(v!=null&&(best<0||v>glad[best]))best=d;});
  if(best<0)return null;
  let a=best,z=best;
  while(a>0&&glad[a-1]!=null&&glad[a-1]>=glad[best]-.4)a--;
  while(z<45&&glad[z+1]!=null&&glad[z+1]>=glad[best]-.4)z++;
  a=Math.max(2,a);
  if(z-a<3)z=a+3;
  return {start:a,end:z,best};
}
function freshPeak(b){
  const def=freshPeakDefault(b);
  if(!b)return def;
  const eigen=freshPeakPunten(b.id);
  if(eigen.length>=PEAK_MIN_BEAN){const r=freshPeakLeer(eigen);
    if(r)return {...r,learned:true,n:eigen.length,from:'bean'};}
  const alle=freshPeakPunten(null);
  if(alle.length>=PEAK_MIN_ALL&&new Set(alle.map(p=>p.bean)).size>=2){const r=freshPeakLeer(alle);
    if(r)return {...r,learned:true,n:alle.length,from:'you'};}
  return def;
}
/* De rustige regel op home: een boon in huis die net op z'n best is, of
   waarvan de beste dagen bijna om zijn. Hoogstens één regel.          */
function peakLineFor(beans){
  let kandidaat=null;
  (beans||[]).forEach(b=>{
    if(b.inStock===false)return;
    const d=roastDays(b);if(d==null)return;
    const pk=freshPeak(b);
    let t=null,prio=9;
    if(d>=pk.start&&d<=pk.start+2){
      t=b.name+(d===pk.start?' is at its best from today':d===pk.start+1?' reached its best yesterday':' reached its best 2 days ago');prio=d-pk.start;}
    else if(d<=pk.end&&pk.end-d<=2){
      const rest=pk.end-d;
      t=b.name+(rest===0?': last day at its best':': '+(rest+1)+' more days at its best');prio=3+rest;}
    if(t&&(!kandidaat||prio<kandidaat.prio))kandidaat={t,prio,id:b.id,learned:pk.learned};
  });
  return kandidaat;
}
/* Wat versheid met je maling doet.
   Vers gebrande bonen zitten vol CO2. Dat gas komt in de puck vrij en houdt het
   water tegen: de shot loopt traag en schuimt. Na een week of drie is dat gas weg
   en zijn de bonen brozer, dus de puck geeft nauwelijks weerstand meer en loopt de
   shot juist door. Vandaar: jong = grover, oud = fijner. */
function freshGrindHint(days){
  if(days==null)return null;
  if(days<=2)  return {dir:'coarser', s:'too fresh',
    t:'still full of CO₂. The gas holds the water back, so expect a slow, foamy shot. Go a notch coarser — or give the bag a few more days.'};
  if(days<=6)  return {dir:'coarser', s:'still degassing',
    t:'still letting go of gas. If it runs slower than yesterday, go half a step coarser; tomorrow it will be a little quicker again.'};
  if(days<=21) return {dir:'stable', s:'in the window',
    t:'the settled stretch. Yesterday\'s grind should still hold today.'};
  if(days<=32) return {dir:'finer', s:'past peak',
    t:'most of the CO₂ has gone, so the puck offers less resistance and the shot runs faster. A notch finer.'};
  return {dir:'finer', s:'old',
    t:'little gas left, brittle beans, plenty of fines. Grinding finer catches some of it, but there is not much left to save.'};
}
/* Wat versheid met je bloom doet.
   Bij espresso corrigeer je vers gas met de maling, want daar meet je de
   doorloopsnelheid. Bij filter zit de knop eerder bij de bloom: daar laat je
   het gas juist bewust ontsnappen voordat de extractie begint. */
function freshBloomHint(days){
  if(days==null)return null;
  if(days<=4) return {mult:3, sec:45, s:'very fresh',
    t:'full of CO\u2082 — the bed will dome and crackle. Give it a bigger bloom and wait longer, or the gas keeps pushing your water away.'};
  if(days<=21)return {mult:2.5, sec:40, s:'in the window',
    t:'the settled stretch. A normal bloom is all it needs.'};
  if(days<=32)return {mult:2, sec:30, s:'past peak',
    t:'less gas left, so the bloom falls flat sooner. Shorten it and grind a touch finer to keep the sweetness.'};
  return {mult:2, sec:30, s:'old',
    t:'barely any gas. A long bloom only cools the bed now — keep it short and grind finer.'};
}
// start een brew met deze boon (respecteert espresso -> dial-in, filter -> formulier)
// eerst een boon, dan pas de methode: elke rij hergebruikt brewBean() om
// zelf uit te zoeken welk scherm daarbij hoort (dial-in of het formulier)
function renderChooseBean(){
  const el=document.getElementById('choosebean-list');if(!el)return;
  const inBeans=state.beans.filter(b=>b.inStock!==false);
  if(!inBeans.length){
    el.innerHTML='<div class="empty-note">no beans in stock yet.<br>every brew belongs to a bean — add one below.</div>';
    return;
  }
  el.innerHTML=inBeans.map(b=>{
    const mList=(Array.isArray(b.methods)&&b.methods.length?b.methods:(b.method?[b.method]:[])).map(id=>methodById(id)).filter(Boolean);
    const m=mList[0]||null;
    const tint=m?('var('+m.tint+')'):'var(--card)';
    const fresh=beanFreshness(b);
    const bits=[];
    if(m)bits.push('<span class="bean-mic">'+iconHTML(m,18)+'</span> '+esc(m.name));
    if(beanFamLabel(b))bits.push('<span class="bean-fam">'+esc(beanFamLabel(b))+'</span>');
    if(fresh)bits.push('<span class="fresh">'+fresh.label+'</span>');
    return '<div class="bean-card sketch soft collapsed" style="background:'+tint+'" onclick="brewBean(\''+b.id+'\')">'+
      '<div class="brow"><div class="bn hand">'+esc(b.name)+'</div><span class="bchev">›</span></div>'+
      '<div class="bean-meta">'+bits.join(' <span class="dot">·</span> ')+'</div></div>';
  }).join('');
}
function brewBean(beanId){
  const b=beanById(beanId);if(!b)return;
  const mList=(Array.isArray(b.methods)&&b.methods.length?b.methods:(b.method?[b.method]:[]));
  const voorkeur=beanFam(b);
  // heb je zelf methodes gekozen? die gaan voor. Anders beslist de branding.
  let mid=mList.find(id=>state.methods.find(m=>m.id===id&&m.on))||mList[0]||null;
  if(!mid&&voorkeur){
    mid=(state.methods.filter(m=>m.on&&methodFamily(m)===voorkeur)[0]||{}).id||null;
  }
  if(!mid)mid=(state.methods.filter(m=>m.on)[0]||{}).id||null;
  if(methodFamily(mid)==='espresso'){pendingTarget=null;formPrep={};pendingRecipe=null;openDialIn(mid);setTimeout(()=>pickDiBean(beanId),0);}
  else{openForm(mid);setTimeout(()=>pickBean(beanId),0);}
}
/* De dial-in journey van deze boon, per espressomethode. Dezelfde tekening als
   in het dial-in-scherm; de doelzone leggen we om de tijd die je aftekende, of
   anders om het doel van je laatste poging.                                  */
function beanJourneyHTML(b){
  if(!featOn('journey'))return '';
  const log=state.dialLog||{};
  const delen=Object.keys(log).filter(k=>{
    const [bid,mid]=k.split('|');
    return bid===b.id && methodFamily(mid)==='espresso' && (log[k]||[]).length;
  }).map(k=>{
    const mid=k.split('|')[1], m=methodById(mid);
    const rij=log[k].slice(-6);
    const vast=(b.dialed||{})[mid];
    const laatste=state.brews.filter(x=>x.beanId===b.id&&x.method===mid&&x.target)
      .sort((a,c)=>c.ts-a.ts)[0];
    const doel=parseTimeSec(vast&&vast.time)||parseTimeSec(laatste&&laatste.target.time)||28;
    const kop=((m&&m.name)||mid)+' \u00b7 '+rij.length+' attempt'+(rij.length===1?'':'s');
    return '<div class="bean-journey"><div class="bj-h">'+esc(kop)+'</div>'+
      '<svg class="journey" viewBox="0 0 360 185">'+journeySVG(rij,doel,k)+'</svg>'+
      journeyInfoHTML(k,log[k])+'</div>';
  });
  return delen.join('');
}
// wat je op deze boon hebt afgetekend, per methode
function dialLineHTML(b){
  const vast=beanDial(b,null);
  if(!vast)return '';
  return '<br>your dial: '+vast.map(d=>{
    const m=methodById(d.method);
    const c=dialCijfers(d);
    return '<b>'+esc((m&&m.name)||d.method)+'</b> '+esc(d.grind)+(c?(' \u00b7 '+esc(c)):'')+
      (d.drink?(' \u00b7 '+esc(d.drink)):'');
  }).join('<br>\u2003');
}
function beanCardHTML(b){
  const expanded=expandedBeans.has(b.id);
  const mList=(Array.isArray(b.methods)&&b.methods.length?b.methods:(b.method?[b.method]:[])).map(id=>methodById(id)).filter(Boolean);
  const m=mList[0]||null;
  const cnt=state.brews.filter(x=>x.beanId===b.id).length;
  const tint=m?('var('+m.tint+')'):'var(--card)';
  const inStock=b.inStock!==false; // standaard: in huis
  const fresh=beanFreshness(b);
  if(!expanded){
    const bits=[];
    if(m)bits.push('<span class="bean-mic">'+iconHTML(m,18)+'</span> '+esc(m.name));
    bits.push(inStock?'✓ in stock':'○ empty');
    if(beanFamLabel(b))bits.push('<span class="bean-fam">'+esc(beanFamLabel(b))+'</span>');
    if(fresh)bits.push('<span class="fresh">'+fresh.label+'</span>');
    const vast=beanDial(b,null);
    if(vast)bits.push('dial '+esc(vast[0].grind));
    return `<div class="bean-card sketch soft collapsed" data-bean="${b.id}" style="background:${tint};${inStock?'':'opacity:.7'}" onclick="toggleBeanCard('${b.id}')">
      <div class="brow"><div class="bn hand">${esc(b.name)}</div><span class="bchev">▸</span></div>
      <div class="bean-meta">${bits.join(' <span class="dot">·</span> ')}</div>
    </div>`;
  }
  const methodLine=mList.length?('<br>method'+(mList.length>1?'s':'')+': '+mList.map(x=>'<span class="bean-method"><span class="bean-method-ic">'+iconHTML(x,18)+'</span>'+esc(x.name)+'</span>').join(' ')):'';
  return `<div class="bean-card sketch soft" data-bean="${b.id}" style="background:${tint};${inStock?'':'opacity:.7'}">
    <div class="brow">
      <div class="bean-head" onclick="toggleBeanCard('${b.id}')"><div class="bn hand">${esc(b.name)}</div><span class="bchev">▾</span></div>
      <div class="brow-btns">
        <button class="icon-btn" title="send this bean" onclick="shareOneBean('${b.id}')">${ICO.send}</button>
        <button class="icon-btn" title="edit" onclick="editBean('${b.id}')">${ICO.edit}</button>
        <button class="icon-btn" title="delete" onclick="delBean('${b.id}')">${ICO.del}</button>
      </div></div>
    ${b.photo?'<img src="'+esc(BrewSecurity.imageUrl(b.photo))+'" style="width:100%;max-height:160px;object-fit:cover;border-radius:14px;border:2px solid var(--line);margin:6px 0">':''}
    <div class="bm">${[b.roaster,b.origin,b.process,b.variety].filter(Boolean).map(esc).join(' · ')||'—'}
      ${b.altitude?'<br>altitude: '+esc(b.altitude)+' m':''}
      ${b.roastdate?'<br>roast: '+esc(b.roastdate)+(fresh?' · '+esc(fresh.label):''):''}
      ${b.roasternotes?'<br>roaster: '+esc(b.roasternotes):''}
      ${methodLine}
      ${dialLineHTML(b)}
      ${b.notes?'<br>'+esc(b.notes):''}
      ${BrewSecurity.safeLink(b.url)?'<br>🔗 <a class="bean-link" href="'+esc(BrewSecurity.safeLink(b.url))+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">view online</a>':''}
      ${(featOn('cost')&&b.price&&b.bagsize)?'<br>≈ €'+((b.price/b.bagsize)*18).toFixed(2)+' per cup (18 g) · €'+(+b.price).toFixed(2)+' / '+b.bagsize+' g':''}
      <br>${cnt} brew${cnt===1?'':'s'} linked</div>
    ${freshGaugeHTML(b)}
    ${beanJourneyHTML(b)}
    ${tasteWheelStatic([].concat(...state.brews.filter(x=>x.beanId===b.id).map(x=>x.tags||[])),
      'what you tasted in this bean')}
    <button class="stock-btn ${inStock?'in':'out'}" onclick="toggleStock('${b.id}')">
      ${inStock?'✓ in stock':'○ empty — no longer in stock'}</button>
    ${bpHerkomstBlok(b)}
    <div style="margin-top:10px"><button class="lp sel" onclick="brewBean('${b.id}')">brew this bean →</button></div>
    <button class="recipe-btn ai-only ${aiReady()?'':'hidden'}" onclick="aiRecipe('${b.id}')"><svg viewBox="0 0 24 24" class="acic btn-svg"><path d="M11.6 4.2 Q12.7 8.2 13.4 9.9 Q15.2 10.7 19.8 11.3 Q15 12.6 13.1 13.4 Q12.4 15.4 11.8 20.8 Q11.2 15 10.6 13.1 Q8.6 12.4 4.2 11.6 Q9.1 10.3 10.9 9.6 Q11.6 7.6 12.3 3.4"/><path d="M18.4 4.4 Q18.9 5.5 19.1 6.1 Q19.9 6.4 21.2 6.5 Q19.6 7.1 18.9 7.4 Q18.6 8.2 18.4 9.4 Q18.1 8 17.9 7.2 Q17 6.9 15.8 6.5 Q17.4 6.1 18.1 5.9 Q18.4 5 18.7 3.8" opacity="0.7"/></svg> ask AI for a brew recipe</button>
    <div id="recipe-${b.id}"></div>
  </div>`;
}
function renderBeans(){
  const el=document.getElementById('beans-list');
  const inBeans=state.beans.filter(b=>b.inStock!==false);
  const outBeans=state.beans.filter(b=>b.inStock===false);
  const sub=document.getElementById('beans-sub');
  if(sub)sub.textContent=state.beans.length?('your bean shelf · in stock ('+inBeans.length+')'):'your bean shelf — linked to your brews.';
  if(!state.beans.length){el.innerHTML='<div class="empty-note">no beans yet.<br>tap New Bean to add your first bean.</div>';return;}
  let html=bpPlankKaartHTML()+bpWensHTML();
  html+=inBeans.length?inBeans.map(beanCardHTML).join(''):'<div class="empty-note">no beans in stock.<br>tap New Bean or check your empty bags.</div>';
  // cupping hoort bij je bonen, niet alleen achterin learn
  if(featOn('cupping')&&inBeans.length>=2){
    html+=`<button class="shelf-do" onclick="go('cupping')"><svg viewBox="0 0 24 24" class="acic"><path d="M3.8 8.6 Q3.6 15.2 7 16.9 Q9.6 18.4 12.1 16.7 Q14.6 18.4 17.2 16.8 Q20.5 15 20.2 8.4 M3.6 9.2 Q8 7.7 12.2 9.1 Q16.2 7.7 20.5 9.2"/><path d="M6.8 12.3 Q9.5 13.6 12.2 12.4 Q14.7 13.6 17.3 12.3" opacity="0.5"/></svg><span>proef er twee blind — cuppingsessie</span><span class="ll-arr">›</span></button>`;
  }
  if(outBeans.length){
    html+=`<button class="extra-kast" onclick="toggleExtraKast()"><svg viewBox="0 0 24 24" class="acic"><path d="M6.4 8.7 Q6.1 6.8 7.8 6.6 Q12 6.2 16.2 6.6 Q17.9 6.8 17.6 8.6 M17.5 8.2 Q17.1 13.7 16.6 19.3 M16.8 19 Q12 19.7 7.2 19.1 M7.4 19.4 Q6.9 13.7 6.5 8.1"/><path d="M7.8 6.8 Q7.1 5.3 7.5 4.2 Q12 3.9 16.5 4.3 Q16.9 5.4 16.2 6.9" opacity="0.85"/><path d="M8.5 11.9 Q12 11.5 15.6 12.1" opacity="0.4"/></svg> empty bags · ${outBeans.length} bean${outBeans.length===1?'':'s'} finished ${extraKastOpen?'▾':'▸'}</button>`;
    if(extraKastOpen){
      html+='<div class="kast-head">no longer in stock — tap ✓ in stock to put it back</div>';
      html+=outBeans.map(beanCardHTML).join('');
    }
  }
  el.innerHTML=html;
}
function toggleStock(id){
  const b=state.beans.find(x=>x.id===id);if(!b)return;
  const nowIn=(b.inStock!==false);      // huidige status (undefined = in huis)
  b.inStock=!nowIn;                       // omdraaien
  save();renderBeans();
  toast(b.inStock?'✓ back in stock':'○ marked as empty');
}
let editingBean=null;
/* Eén formulier voor allebei: een zak die op je plank staat, en een zak die je
   nog wilt hebben. De keuze bovenin bepaalt waar hij heen gaat -- en welke
   velden er iets toe doen. Van gedachten veranderen mag: sla je een wens op
   als "op mijn plank", dan verhuist hij gewoon mee.                        */
let beanFormWens=false, editingWens=null;
const BEAN_MODES=[{w:false,n:'Bean shelf',u:'een zak die je in huis hebt — hij komt bij je bonen te staan en je kunt erop brouwen.'},
                  {w:true, n:'Bean wishlist',u:'een zak die je nog wilt kopen — hij komt op je lijstje en op de wereldkaart.'}];
function renderBeanMode(){
  const el=document.getElementById('b-mode'); if(!el)return;
  // staat de keuzehulp uit, dan is er geen lijstje om iets op te zetten
  if(!featOn('beanpick'))beanFormWens=false;
  const veld=el.closest('.field'); if(veld)veld.style.display=featOn('beanpick')?'':'none';
  el.innerHTML=BEAN_MODES.map(m=>'<button type="button" class="bp-chip'+(m.w===beanFormWens?' sel':'')+
    '" onclick="beanZetMode('+m.w+')">'+m.n+'</button>').join('');
  const u=document.getElementById('b-mode-uitleg');
  if(u)u.textContent=(BEAN_MODES.find(m=>m.w===beanFormWens)||BEAN_MODES[0]).u;
  const t=document.getElementById('beanform-title');
  if(t)t.textContent=(editingBean||editingWens)?'Edit Bean':'New Bean';
  const sv=document.getElementById('b-save');
  if(sv)sv.textContent=beanFormWens?'Save on wishlist':'Save on shelf';
  // wat je pas weet als de zak er echt is, vraagt de app pas als hij er is
  [['b-foto-rij',!beanFormWens],['label-preview',!beanFormWens],['b-roastdate-veld',!beanFormWens],
   ['b-cost-row',!beanFormWens&&featOn('cost')],['b-fam-veld',!beanFormWens],
   ['b-methods-veld',!beanFormWens]].forEach(([id,aan])=>{
    const e=document.getElementById(id); if(e)e.style.display=aan?'':'none';
  });
}
function beanZetMode(w){beanFormWens=!!w;renderBeanMode();}
/* Vanuit een brew een nieuwe boon maken: na opslaan ga je terug naar die brew,
   met de nieuwe boon al gekozen. 'choosebean', 'form' of 'dialin'; anders null. */
let beanFormTerug=null;
function beanFormWeg(){const t=beanFormTerug;beanFormTerug=null;editingBean=null;editingWens=null;go(t||'beans');}
function openBeanForm(wens,terug){
  editingBean=null; editingWens=null; beanFormWens=!!wens;
  beanFormTerug=(!wens&&['choosebean','form','dialin'].includes(terug))?terug:null;
  ['b-name','b-roaster','b-origin','b-process','b-variety','b-altitude','b-roastdate','b-roasternotes','b-url','b-notes','b-price','b-bagsize'].forEach(i=>{const el=document.getElementById(i);if(el)el.value='';});
  document.getElementById('scan-status').textContent='';
  const er=document.getElementById('enrich-row');if(er)er.style.display='none';
  beanPhoto=null;const lp=document.getElementById('label-preview');if(lp)lp.innerHTML='';
  beanFormMethods=[];beanFormFam=null;beanFormRoast=null;beanFormRegions=[];
  renderBeanFormMethods();renderBeanFam();renderBeanRoast();renderBeanHerkomst();
  renderBeanMode();go('beanform');applyAIVisibility();
}
function editBean(id){
  const b=state.beans.find(x=>x.id===id);if(!b)return;
  beanFormTerug=null;
  editingBean=id; editingWens=null; beanFormWens=false;
  const set=(f,v)=>{const el=document.getElementById(f);if(el)el.value=v||'';};
  set('b-name',b.name);set('b-roaster',b.roaster);set('b-origin',b.origin);
  set('b-process',b.process);set('b-variety',b.variety);set('b-altitude',b.altitude);
  beanFormRegions=bpRegios(b).filter(r=>r.zelf).map(r=>({land:r.land,i:r.i}));
  renderBeanHerkomst();
  set('b-roastdate',b.roastdate);set('b-roasternotes',b.roasternotes);
  set('b-url',b.url);set('b-notes',b.notes);set('b-price',b.price);set('b-bagsize',b.bagsize);
  document.getElementById('scan-status').textContent='';
  const er=document.getElementById('enrich-row');if(er)er.style.display='none';
  beanPhoto=null; // alleen nieuwe foto vervangt de bestaande
  const lp=document.getElementById('label-preview');
  if(lp)lp.innerHTML=b.photo?'<img src="'+esc(BrewSecurity.imageUrl(b.photo))+'" style="max-height:140px;border-radius:14px;border:2px solid var(--line)">':'';
  beanFormMethods=(Array.isArray(b.methods)&&b.methods.length?[...b.methods]:(b.method?[b.method]:[]));
  beanFormFam=b.fam||null;renderBeanFam();
  beanFormRoast=b.roast||null;renderBeanRoast();
  renderBeanFormMethods();renderBeanMode();go('beanform');applyAIVisibility();
}
let beanFormMethods=[];
/* Sommige branders branden een zak bewust voor espresso of juist voor filter,
   en zetten dat op de zak. Dat is geen smaakje maar een branding: espresso mag
   iets donkerder en oplosbaarder, filter blijft lichter en dichter. */
let beanFormFam=null;
const BEAN_FAMS=[['espresso','espresso'],['filter','filter'],['both','omni \u2014 both']];
const ROAST_LEVELS=['light','medium-light','medium','medium-dark','dark'];
let beanFormRoast=null;
function renderBeanRoast(){
  const el=document.getElementById('b-roast');if(!el)return;
  el.innerHTML=ROAST_LEVELS.map(v=>
    '<button class="lp '+(beanFormRoast===v?'sel':'')+'" onclick="pickBeanRoast(\''+v+'\')">'+esc(v)+'</button>').join('');
}
function pickBeanRoast(v){beanFormRoast=(beanFormRoast===v)?null:v;renderBeanRoast();}
function renderBeanFam(){
  const el=document.getElementById('b-fam');if(!el)return;
  el.innerHTML=BEAN_FAMS.map(([v,label])=>
    '<button class="lp '+(beanFormFam===v?'sel':'')+'" onclick="pickBeanFam(\''+v+'\')">'+esc(label)+'</button>').join('');
}
function pickBeanFam(v){beanFormFam=(beanFormFam===v)?null:v;renderBeanFam();}
// welke familie past bij deze boon? (both en leeg leggen niets vast)
function beanFam(b){
  const f=b&&b.fam;
  return (f==='espresso'||f==='filter')?f:null;
}
function beanFamLabel(b){
  const f=b&&b.fam;
  if(f==='espresso')return 'espresso roast';
  if(f==='filter')return 'filter roast';
  if(f==='both')return 'omni roast';
  return '';
}
function renderBeanFormMethods(){
  document.getElementById('beanform-methods').innerHTML=
    state.methods.filter(m=>m.on).map(m=>'<button class="lp '+(beanFormMethods.includes(m.id)?'sel':'')+'" onclick="toggleBeanMethod(\''+m.id+'\')"><span class="mp-ic">'+iconHTML(m,26)+'</span> '+esc(m.name)+'</button>').join('')
    || '<span class="subtitle">no methods on — turn them on under methods.</span>';
}
function toggleBeanMethod(id){
  if(beanFormMethods.includes(id))beanFormMethods=beanFormMethods.filter(x=>x!==id);
  else beanFormMethods.push(id);
  renderBeanFormMethods();
}
function saveBean(){
  const name=document.getElementById('b-name').value.trim();
  if(!name){toast(beanFormWens?'geef hem een naam':'give the bean a name');return;}
  if(beanFormWens)return saveBeanAlsWens(name);
  const data={name,
    roaster:document.getElementById('b-roaster').value.trim(),
    origin:document.getElementById('b-origin').value.trim(),
    process:document.getElementById('b-process').value.trim(),
    variety:document.getElementById('b-variety').value.trim(),
    altitude:document.getElementById('b-altitude').value.trim(),
    regions:beanFormRegions.slice(),
    region:beanFormRegions[0]||null,
    roastdate:document.getElementById('b-roastdate').value,
    roasternotes:document.getElementById('b-roasternotes').value.trim(),
    url:document.getElementById('b-url').value.trim(),
    price:parseFloat(document.getElementById('b-price').value)||null,
    bagsize:parseFloat(document.getElementById('b-bagsize').value)||null,
    methods:[...beanFormMethods],
    method:beanFormMethods[0]||null,
    fam:beanFormFam||null,
    roast:beanFormRoast||null,
    notes:document.getElementById('b-notes').value.trim()};
  if(editingBean){
    const ex=state.beans.find(b=>b.id===editingBean);
    if(ex){Object.assign(ex,data);if(beanPhoto)ex.photo=beanPhoto;}
    toast('✓ bean updated');
  }else{
    data.id=uid();data.photo=beanPhoto||null;data.inStock=true;
    state.beans.push(data);
    // stond hij nog op je lijstje, dan is hij daar nu vanaf
    if(editingWens){state.wishlist=(state.wishlist||[]).filter(w=>w.id!==editingWens);
      toast('✓ van je lijstje naar je plank');}
    else toast('✓ bean saved');
    const terug=beanFormTerug;beanFormTerug=null;
    if(terug){editingWens=null;save();beanPhoto=null;naNieuweBoon(terug,data.id);return;}
  }
  beanFormTerug=null;editingWens=null;save();beanPhoto=null;go('beans');
}
// terug naar de brew waar je vandaan kwam, met de nieuwe boon gekozen
function naNieuweBoon(terug,id){
  if(terug==='choosebean'){brewBean(id);return;}
  go(terug);
  if(terug==='dialin')pickDiBean(id);else pickBean(id);
}
/* Dezelfde velden, maar dan als wens. Wat een zak pas heeft als hij er is --
   branddatum, prijs, waar je hem op zet -- slaan we niet op.               */
function saveBeanAlsWens(naam){
  const g=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};
  if(!Array.isArray(state.wishlist))state.wishlist=[];
  const noten=g('b-roasternotes');
  const w={id:editingWens||uid(),naam,name:naam,brander:g('b-roaster'),
    origin:g('b-origin'),url:g('b-url'),
    regions:beanFormRegions.slice(),proces:g('b-process'),variety:g('b-variety'),
    altitude:g('b-altitude'),brand:beanFormRoast||'light',
    roasternotes:noten,smaak:noten?noten.split(',').map(x=>x.trim()).filter(Boolean):[],
    notitie:g('b-notes'),at:Date.now()};
  const i=state.wishlist.findIndex(x=>x.id===w.id);
  if(i>=0)state.wishlist[i]=Object.assign({},state.wishlist[i],w);
  else state.wishlist.push(w);
  // van je plank terug naar je lijstje: dan hoort hij niet meer bij je bonen
  if(editingBean){
    state.beans=state.beans.filter(b=>b.id!==editingBean);
    state.brews.forEach(b=>{if(b.beanId===editingBean)b.beanId=null;});
    toast('✓ terug op je lijstje');
  }else toast('✓ op je lijstje');
  beanFormTerug=null;editingBean=null;editingWens=null;save();beanPhoto=null;go('beans');
}
function delBean(id){
  if(!confirm('delete this bean?'))return;
  state.beans=state.beans.filter(b=>b.id!==id);
  state.brews.forEach(b=>{if(b.beanId===id){b.beanId=null;}});
  save();renderBeans();toast('🗑 bean deleted');
}


/* ---------------- brews zonder boon ----------------
   Elke brew hoort bij een boon. Oude brews waarvan de ingetypte naam precies
   één boon raakt, koppelt de app zelf (BrewModel.linkBeansByName). De rest
   staat hier: per ingetypte naam één regel om te koppelen aan een bestaande
   boon of om van die naam een boon te maken. Er gaat nooit iets weg; de
   ingetypte naam blijft op de brew staan.                                  */
let unlOpen=false,unlLaatst=[];
function brewsZonderBoon(){return state.brews.filter(b=>!beanById(b.beanId));}
// groepen: brews met dezelfde ingetypte naam samen; zonder naam elk apart
function unlGroepen(){
  const g=new Map();
  brewsZonderBoon().sort((a,c)=>(c.ts||0)-(a.ts||0)).forEach(b=>{
    const naam=String(b.beans||'').trim()||String((b.beanSnapshot&&b.beanSnapshot.name)||'').trim();
    const k=naam?('n:'+BrewModel.nameKey(naam)):('b:'+b.id);
    if(!g.has(k))g.set(k,{k,naam,brews:[]});
    g.get(k).brews.push(b);
  });
  return [...g.values()];
}
function unlBrewsVan(k){
  if(k.startsWith('b:'))return state.brews.filter(b=>b.id===k.slice(2)&&!beanById(b.beanId));
  const key=k.slice(2);
  return brewsZonderBoon().filter(b=>BrewModel.nameKey(String(b.beans||'').trim()||(b.beanSnapshot&&b.beanSnapshot.name))===key);
}
function toggleUnlinked(){unlOpen=!unlOpen;renderAll();}
function unlinkedHTML(){
  const groepen=unlGroepen();unlLaatst=groepen.map(g=>g.k);
  if(!groepen.length){unlOpen=false;return '';}
  const n=brewsZonderBoon().length;
  let h='<button class="unl-open" onclick="toggleUnlinked()">'+n+' brew'+(n===1?'':'s')+' without a bean \u2014 link '+(n===1?'it':'them')+' '+(unlOpen?'\u25be':'\u25b8')+'</button>';
  if(!unlOpen)return h;
  const opties=state.beans.slice().sort((a,c)=>(c.inStock!==false)-(a.inStock!==false)||String(a.name).localeCompare(String(c.name)))
    .map(b=>'<option value="'+esc(b.id)+'">'+esc(b.name)+(b.inStock===false?' (finished)':'')+'</option>').join('');
  h+='<div class="unl-box">';
  groepen.forEach((g,i)=>{
    const datums=g.brews.map(b=>b.ts).filter(Boolean);
    const methodes=[...new Set(g.brews.map(b=>methodById(b.method).name))].join(', ');
    const wanneer=datums.length?new Date(Math.min(...datums)).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'';
    const kid='unl-sel-'+i;
    h+='<div class="unl-row"><div class="unl-n hand">'+(g.naam?esc(g.naam):'no name typed')+'</div>'+
      '<div class="unl-m">'+g.brews.length+' brew'+(g.brews.length===1?'':'s')+' \u00b7 '+esc(methodes)+(wanneer?(' \u00b7 '+(g.brews.length>1?'since ':'')+esc(wanneer)):'')+'</div>'+
      '<div class="unl-act">'+
      (opties?'<select id="'+kid+'" aria-label="pick a bean">'+opties+'</select><button onclick="unlKoppel('+i+')">link</button>':'')+
      (g.naam?'<button onclick="unlMaakBoon('+i+')">\uff0b make bean \u201c'+esc(g.naam)+'\u201d</button>':'')+
      '</div></div>';
  });
  return h+'</div>';
}
function unlKoppel(i){
  const k=unlLaatst[i];if(!k)return;
  const sel=document.getElementById('unl-sel-'+i);const bean=sel?beanById(sel.value):null;if(!bean)return;
  const lijst=unlBrewsVan(k);
  lijst.forEach(b=>{b.beanId=bean.id;if(!b.beanSnapshot)b.beanSnapshot=BrewModel.beanSnapshot(bean);});
  save();toast('\u2713 '+lijst.length+' brew'+(lijst.length===1?'':'s')+' linked to '+bean.name);renderAll();
}
// van de ingetypte naam een boon maken. Het gaat om oude brews, dus de zak is
// waarschijnlijk op: hij komt als "finished" in je bonen, aanvullen kan daar.
function unlMaakBoon(i){
  const k=unlLaatst[i];if(!k)return;
  const lijst=unlBrewsVan(k);if(!lijst.length)return;
  // dezelfde naam als op de knop: die van de nieuwste brew in de groep
  const nieuwste=lijst.slice().sort((a,c)=>(c.ts||0)-(a.ts||0))[0];
  const naam=String(nieuwste.beans||'').trim()||String((nieuwste.beanSnapshot&&nieuwste.beanSnapshot.name)||'').trim();if(!naam)return;
  const tel={};lijst.forEach(b=>{if(b.method)tel[b.method]=(tel[b.method]||0)+1;});
  const mid=Object.keys(tel).sort((a,c)=>tel[c]-tel[a])[0]||null;
  const bean={id:uid(),name:naam,roaster:'',origin:'',process:'',variety:'',altitude:'',roastdate:'',roasternotes:'',
    url:'',notes:'',photo:null,methods:mid?[mid]:[],method:mid,inStock:false};
  state.beans.push(bean);
  lijst.forEach(b=>{b.beanId=bean.id;if(!b.beanSnapshot)b.beanSnapshot=BrewModel.beanSnapshot(bean);});
  save();toast('\u2713 bean \u201c'+naam+'\u201d made (marked finished) \u2014 '+lijst.length+' brew'+(lijst.length===1?'':'s')+' linked');renderAll();
}
