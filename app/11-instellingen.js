/* ---------------- Settings: indeling en de grote kaart (akkoord Jesse 26-11) ----------------
   Volgt docs/opzet-instellingen.html. Bovenaan één donkere kaart met wie je bent, of alles
   bewaard is, privé of openbaar, volgverzoeken en de AI-vragen van vandaag. Daaronder rijen
   per onderwerp die openklappen (class 'open' op de .settings-card, zoals altijd).
   De schakelaars van FEATURES staan per onderwerp; een paar staan bij de rij waar ze over
   gaan (zie FEAT_ELDERS). account en social staan niet in de lijst: die zet je aan met de
   knop in de grote kaart en uit met de knop onderaan hun eigen rij.
   Laadt na 11-beheer en vóór 12; bij het laden draait hier niets.                          */
const FEAT_GROEPEN={
  brewing:['shotclock','journey','pourcoach','drawdown','smartdefaults','route','surprise','voice'],
  beans:['freshgauge','peakalert','cost','beanpick','finder','finderai'],
  tasting:['filtercompass','wheel','wheelbig','tastememory','cupping'],
  sharing:['water','latteart','sharecards']
};
// waar de overige schakelaars staan (de test controleert dat elke vlag ergens te vinden is)
const FEAT_ELDERS={aibudget:'ai-card',drawnedges:'more-card',shortcuts:'shortcut-card',weather:'reminder-card',pairing:'gear-card',account:'set-groot',social:'set-groot'};
function featRijHTML(f){
  const aan=featOn(f.id);
  return '<div class="feat-row"><div class="ft"><div class="n">'+esc(f.n)+'</div><div class="d">'+esc(f.d)+'</div></div>'+
    '<div class="toggle'+(aan?' on':'')+'" role="switch" aria-checked="'+aan+'" aria-label="'+esc(f.n)+'" data-feat="'+esc(f.id)+'" onclick="toggleFeature(\''+f.id+'\')"><div class="knob"></div></div></div>';
}
function renderFeatures(){
  const pg=document.getElementById('page-profile');if(!pg)return;
  pg.querySelectorAll('.feat-plek').forEach(el=>{
    const ids=el.dataset.groep?(FEAT_GROEPEN[el.dataset.groep]||[]):String(el.dataset.feats||'').split(',');
    el.innerHTML=ids.map(id=>FEATURES.find(f=>f.id===id)).filter(Boolean).map(featRijHTML).join('');
  });
  for(const g in FEAT_GROEPEN){
    const n=document.getElementById('feat-n-'+g),l=FEAT_GROEPEN[g];
    if(n)n.textContent=l.filter(featOn).length+' of '+l.length+' on';
  }
}
/* een rij open- of dichtklappen, en een rij (met alles waar hij in zit) openen en tonen */
function setKlap(id){const el=document.getElementById(id);if(el)el.classList.toggle('open');}
function setToon(id){
  const el=document.getElementById(id);if(!el)return null;
  for(let p=el;p&&p.id!=='page-profile';p=p.parentElement)if(p.classList&&p.classList.contains('settings-card'))p.classList.add('open');
  try{el.scrollIntoView({block:'start',behavior:'smooth'});}catch(e){}
  return el;
}
/* ---- de grote kaart ---- */
function setGrootTik(){if(featOn('account'))setToon('acct-card');else setAccountAan();}
function setAccountAan(){
  if(!featOn('account'))toggleFeature('account');
  setToon('acct-card');
}
function setSocialAan(){
  if(!featOn('account'))toggleFeature('account');
  if(!featOn('social'))toggleFeature('social');
  setToon(acctIngelogd()?'volg-card':'acct-card');
}
function setZicht(){
  if(typeof volg!=='undefined'&&volg.me&&volg.me.profile)return volg.me.profile.visibility==='public'?'public':'private';
  const u=state.sync&&state.sync.user;return u&&u.visibility==='public'?'public':'private';
}
function renderSetGroot(){
  const el=document.getElementById('set-groot');if(!el)return;
  const knop=(id,tekst,actie)=>'<button type="button" class="groot-knop" id="'+id+'" onclick="event.stopPropagation();'+actie+'">'+tekst+'</button>';
  let h;
  if(!featOn('account')){
    h='<b class="hand">your account</b><span>off · everything stays on this phone</span>'+
      '<div class="rij2">'+knop('groot-aan','turn on account','setAccountAan()')+'</div>';
  }else if(!acctIngelogd()){
    h='<b class="hand">not signed in</b><span>everything stays on this phone</span>'+
      '<div class="rij2">'+knop('groot-in','sign in with Face ID','setToon(\'acct-card\')')+'</div>';
  }else{
    const s=state.sync,pils=[];
    const verz=(typeof volg!=='undefined'&&volgAan()&&volg.me&&Array.isArray(volg.me.requests))?volg.me.requests.length:0;
    if(verz)pils.push(knop('groot-verz',verz+' follow request'+(verz===1?'':'s'),'setToon(\'volg-card\')'));
    if(!featOn('social'))pils.push(knop('groot-volg','turn on follow &amp; feed','setSocialAan()'));
    if(typeof aiLbKan==='function'&&aiLbKan()&&aiLb.used!=null)pils.push('<span class="pil">AI '+(aiLb.used|0)+' / '+(aiLb.limit|0)+' today</span>');
    h='<b class="hand">@'+esc(s.user.handle)+'</b><span>signed in · '+(s.last?'synced '+esc(acctWanneer(s.last)):'not synced yet')+' · '+setZicht()+'</span>'+
      (pils.length?'<div class="rij2">'+pils.join('')+'</div>':'');
  }
  el.innerHTML=h;
}
/* ---- de korte waarde rechts op elke rij ---- */
function setLaatsteBackup(){
  let t=0;try{t=+localStorage.getItem('scc_last_backup')||0;}catch(e){}
  if(!t)return 'no back-up yet';
  const d=new Date(t),nu=new Date();
  return 'last: '+(d.toDateString()===nu.toDateString()?'today':d.toLocaleDateString('en-GB',{day:'numeric',month:'short'}));
}
function setWaarden(){
  const zet=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v||'';};
  const s=state.sync||{};
  zet('acct-w',acctIngelogd()?(s.last?'synced '+acctWanneer(s.last):'signed in'):'not signed in');
  zet('volg-w',acctIngelogd()?setZicht():'');
  zet('beheer-w','admin only');
  const n=(state.gear||[]).length;zet('gear-w',n?n+' item'+(n===1?'':'s'):'none yet');
  zet('week-w',featOn('tastememory')?'':'off');
  zet('ai-w',aiEnabled()?aiAanbieder().naam:'off');
  let st=null;try{st=BrewStem.stand();}catch(e){}
  zet('stem-w',st&&st.actief?(st.bron==='letsbrew'?'Lets Brew voice':'ElevenLabs'):'phone');
  zet('shortcut-w',featOn('shortcuts')?'':'off');
  zet('backup-w',setLaatsteBackup());
}
function instRender(){renderSetGroot();setWaarden();}
