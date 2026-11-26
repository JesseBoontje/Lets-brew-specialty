/* ---------------- profiel, volgen en feed (stap 2, vlag 'social') ----------------
   Vereist de vlag 'account' en een ingelogde sessie. De server (social-worker.mjs)
   beslist wat je mag zien en filtert privévelden weg; de app laat alleen zien wat
   binnenkomt. "try" zet een brew als eigen recept in state.recipes, of een boon op
   je wishlist. Foto's: na een geslaagde sync verkleint de app de eigen foto's
   (max 1280 px, jpeg 0.8) en zet ze online, alleen als deze vlag aan staat. */
const VOLG_H=/^[a-z0-9_]{3,20}$/, VOLG_ID=/^[A-Za-z0-9_-]{1,100}$/, VOLG_FOTO=/^\/api\/foto\/[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{22}$/;
const volg={me:null,meLaden:false,fout:'',feed:[],next:null,klaar:false,bezig:false,geladen:false,persoon:null,zoek:[],zoekQ:'',items:new Map(),fotoBezig:false};
let volgZoekTimer=null;
function volgAan(){return featOn('social')&&featOn('account')&&acctIngelogd();}
// met volgen en feed aan: Feed in de balk en Learn als kaart op Home, zo blijven het 5 tabs
function volgNav(){
  const aan=volgAan(),b=document.getElementById('nav-feed');if(b)b.style.display=aan?'':'none';
  const l=document.querySelector('#nav [data-p="learn"]');if(l)l.style.display=aan?'none':'';
  const k=document.getElementById('home-learn');if(k)k.style.display=aan?'':'none';
}
// "sanne wants to follow you" op Home; tik = naar je profiel in Settings
function volgHomeRegel(){
  const el=document.getElementById('volg-melding');if(!el)return;
  const r=volgAan()&&volg.me&&Array.isArray(volg.me.requests)?volg.me.requests:[];
  if(!r.length){el.style.display='none';el.innerHTML='';return;}
  const h=esc(volgH(r[0].handle));
  el.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.6 7.4 Q15.9 10 13.6 11.9 Q11.2 13.2 9 11.5 Q7.4 9.3 9.3 7 Q11.8 5 14.2 6.8 Q14.8 7.3 15.1 8.2"/><path d="M4.6 19.8 Q4.8 14.4 11.6 14.3 Q15.3 14.4 16.6 16.4"/><path d="M19.2 12.6 Q19.4 15.3 19.1 18.1 M17.7 15.4 Q19.3 15.2 21 15.5"/></svg>'+
    '<span><b>'+h+'</b> '+(r.length===1?'wants':'and '+(r.length-1)+' more want')+' to follow you</span>';
  el.style.display='flex';
}
function volgMeldingOpen(){go('profile');setToon('volg-card');}
const volgH=h=>typeof h==='string'&&VOLG_H.test(h)?h:'';
const volgSleutel=it=>it.owner.handle+'/'+it.kind+'/'+it.id;
function volgGet(path){return acctApi(path,{method:'GET'});}

/* ---- iconen (getekend, geen emoji) ---- */
const VOLG_IC={
  hart:'<svg viewBox="0 0 24 24" class="acic"><path d="M12 20.2 Q5.3 15.6 4.2 11 Q3.6 6.9 7.4 6.2 Q10.4 5.9 12 8.9 Q13.7 5.8 16.7 6.1 Q20.6 6.8 19.9 11.1 Q18.6 15.8 11.6 20.6"/></svg>',
  try:'<svg viewBox="0 0 24 24" class="acic"><path d="M5.2 9.3 Q5 14 5.6 17.2 Q6.3 19.8 9.7 19.7 Q12.6 19.9 14.3 19.5 Q16.8 18.8 16.9 15.6 Q17.2 12.2 16.8 9.1"/><path d="M4.6 9.5 Q11 8.8 17.4 9.4"/><path d="M16.9 11.2 Q20.2 11 20.1 13.6 Q20 16 16.6 15.8"/><path d="M9.2 6.8 Q8.6 5.2 9.6 3.6"/><path d="M12.6 6.8 Q12 5.1 13 3.5"/></svg>',
  share:'<svg viewBox="0 0 24 24" class="acic"><path d="M12.2 15.3 Q12 9.5 12.3 3.8"/><path d="M8.6 7.2 Q10.4 5.2 12.4 3.4 Q14.3 5.3 16 7.4"/><path d="M7.4 10.8 Q4.9 10.7 5 13 Q4.8 17 5.2 20.3 Q12 20.8 19 20.2 Q19.4 16.5 19 12.8 Q19 10.7 16.8 10.9"/></svg>',
  op:'<svg viewBox="0 0 24 24" class="acic"><path d="M12 19 Q11.8 12 12.2 5"/><path d="M8 9 Q10 6.8 12.2 4.8 Q14.2 6.9 16 9.2"/></svg>'
};
// grotere tekening als er geen foto is: twee keer overgetrokken, per lijn een eigen afwijking
const VOLG_KOP='<svg viewBox="0 0 120 120" class="feed-teken"><path d="M22 44 Q55 41.5 90 44.5"/><path d="M25 42 Q27 70 31 94"/><path d="M87.5 42.5 Q85 70 80 95"/><path d="M28 92 Q30 104 42 104.5 Q56 105.5 69 104.2 Q80 103.5 82.5 92"/><path d="M86 55 Q101 52.5 101.5 66 Q101 80 84 81.5"/><path d="M46 34 Q40 25 47 18 Q50 14 47 9"/><path d="M59 35 Q53 25 60 17.5"/><path d="M72 34 Q66 25 73 18 Q76 14 73.5 10"/>'+
  '<path class="b" d="M24.5 46 Q56 43.8 88 46.2"/><path class="b" d="M27.8 44 Q29 71 33 95.5"/><path class="b" d="M89.4 44.6 Q86.6 71.2 82.4 93.4"/><path class="b" d="M30.4 94.4 Q32.6 102 43.4 102.6 Q57 103.2 70.4 102.6 Q79.2 101.6 80.6 94.8"/><path class="b" d="M88.4 57.6 Q99 56 99.2 66.8 Q98.8 77.8 85.4 79.4"/></svg>';
const VOLG_BOON='<svg viewBox="0 0 120 120" class="feed-teken"><path d="M60 20 Q88 24 92 58 Q94 92 62 100 Q30 104 26 66 Q23 28 56 20.5 Q62 19.4 67 21.5"/><path d="M58 24 Q48 44 60 60 Q72 76 62 97"/>'+
  '<path class="b" d="M62.6 23 Q86 28.4 89 59.4 Q90.6 89 61.4 97 Q33.4 99.4 29.6 65.4 Q27.8 31 57 23.8"/><path class="b" d="M61 25.6 Q51.8 45 62.4 59.4 Q73.8 75.6 64.6 95.4"/></svg>';

/* ---- wat er op een kaart staat ---- */
function volgMethodeNaam(id,brewer){
  const m=DEFAULT_METHODS.find(x=>x.id===id);
  return m?m.name:(brewer||'');
}
function volgRegels(it){
  const d=it.data||{};
  if(it.kind==='bean'){
    return {titel:d.name||'a bean',regel:[d.roaster,d.origin,d.process,d.roast].filter(Boolean).join(' · '),smaak:d.roasternotes||''};
  }
  const m=volgMethodeNaam(d.method,d.brewer);
  const titel=[d.beans||d.title||'a brew',m].filter(Boolean).join(', ');
  const delen=[];
  if(d.dose)delen.push(d.dose+' g'+(d.yield?' → '+d.yield+' g':''));
  else if(d.yield)delen.push(d.yield+' g');
  if(d.temp)delen.push(d.temp+' °C');
  if(d.time)delen.push(d.time);
  if(d.score)delen.push('score '+d.score);
  return {titel,regel:delen.join(' · '),smaak:(d.tags||[]).join(', ')};
}
function volgFotoHtml(it,klasse){
  if(it.photo&&VOLG_FOTO.test(it.photo))return '<img class="'+klasse+'" src="'+esc(it.photo)+'" alt="" loading="lazy">';
  return it.kind==='bean'?VOLG_BOON:VOLG_KOP;
}
function volgKnoppen(it){
  const k=volgSleutel(it);
  return '<button class="feed-knop'+(it.liked?' aan':'')+'" data-like="'+esc(k)+'" onclick="volgLike(\''+k+'\')" aria-label="like">'+VOLG_IC.hart+'<span>'+(it.likes||0)+'</span></button>'+
    '<button class="feed-knop" onclick="volgTry(\''+k+'\')" aria-label="try">'+VOLG_IC.try+'<span>try</span></button>'+
    '<button class="feed-knop" onclick="volgDeel(\''+volgH(it.owner.handle)+'\')" aria-label="share">'+VOLG_IC.share+'<span>share</span></button>';
}
function volgOnthoud(lijst){
  for(const it of lijst||[])if(it&&it.owner&&volgH(it.owner.handle)&&VOLG_ID.test(it.id||'')&&['bean','brew'].includes(it.kind))volg.items.set(volgSleutel(it),it);
  return (lijst||[]).filter(it=>volg.items.has(it&&it.owner?volgSleutel(it):''));
}

/* ---------------- feed ---------------- */
function feedKaart(it,i){
  const r=volgRegels(it),h=volgH(it.owner.handle);
  return '<div class="feed-plek"><section class="feed-kaart" data-k="'+esc(volgSleutel(it))+'">'+
    '<div class="feed-boven hand">following</div>'+
    '<div class="feed-foto">'+volgFotoHtml(it,'feed-img')+'</div>'+
    (i===0?'<div class="feed-veeg">'+VOLG_IC.op+'swipe up</div>':'')+
    '<div class="feed-onder"><button class="feed-wie" onclick="volgOpen(\''+h+'\')">@'+esc(h)+' · '+esc(acctWanneer(it.at))+'</button>'+
      '<b class="hand">'+esc(r.titel)+'</b><span>'+esc(r.regel)+(r.smaak?'<br>"'+esc(r.smaak)+'"':'')+'</span></div>'+
    '<div class="feed-zij">'+volgKnoppen(it)+'</div>'+
  '</section></div>';
}
function feedLeeg(tekst,knop){
  return '<div class="feed-plek"><section class="feed-kaart feed-leeg"><div class="feed-boven hand">feed</div>'+
    '<div class="feed-foto">'+VOLG_KOP+'</div><div class="feed-onder"><b class="hand">'+esc(tekst)+'</b>'+(knop||'')+'</div></section></div>';
}
function renderFeed(){
  const el=document.getElementById('feed-reel');if(!el)return;
  if(!volgAan()){el.innerHTML=feedLeeg('Sign in and turn on follow & feed in Settings.');return;}
  if(!volg.geladen&&!volg.bezig){volgFeedLaad(true);}
  if(!volg.feed.length){
    el.innerHTML=volg.bezig?feedLeeg('loading…'):feedLeeg(volg.fout||'Nothing here yet. Follow people to see their brews and beans.',
      '<button class="feed-zoek" onclick="go(\'profile\');setTimeout(()=>{const z=document.getElementById(\'volg-zoek\');if(z)z.focus();},50)">find people</button>');
    return;
  }
  el.innerHTML=volg.feed.map(feedKaart).join('')+(volg.next?'<div class="feed-plek feed-meer">loading more…</div>':'');
}
async function volgFeedLaad(opnieuw){
  if(volg.bezig||!volgAan())return;
  if(!opnieuw&&!volg.next)return;
  volg.bezig=true;volg.fout='';
  try{
    const res=await volgGet('/api/social/feed'+(!opnieuw&&volg.next?'?cursor='+encodeURIComponent(volg.next):''));
    const nieuw=volgOnthoud(res.items);
    volg.feed=opnieuw?nieuw:volg.feed.concat(nieuw);volg.next=res.next||null;volg.geladen=true;
  }catch(e){volg.fout=e.status===401?'Signed out. Sign in again in Settings.':'The feed did not load. Try again later.';volg.geladen=true;}
  finally{volg.bezig=false;}
  if(currentPage==='feed'){
    const el=document.getElementById('feed-reel'),top=el?el.scrollTop:0;
    renderFeed();if(el&&!opnieuw)el.scrollTop=top;
  }
}
function volgFeedScroll(){
  const el=document.getElementById('feed-reel');if(!el)return;
  if(el.scrollTop+el.clientHeight*2>=el.scrollHeight)volgFeedLaad(false);
}

/* ---------------- like, try, share ---------------- */
async function volgLike(k){
  const it=volg.items.get(k);if(!it)return;
  const aan=!it.liked;
  try{
    const res=await acctApi('/api/social/like',{method:aan?'POST':'DELETE',body:{handle:it.owner.handle,kind:it.kind,id:it.id}});
    it.liked=!!res.liked;it.likes=res.likes|0;
    document.querySelectorAll('[data-like="'+k+'"]').forEach(b=>{b.classList.toggle('aan',it.liked);const s=b.querySelector('span');if(s)s.textContent=it.likes;});
  }catch(e){toast(e.status===429?'slow down a little':'that did not work');}
}
function volgTry(k){
  const it=volg.items.get(k);if(!it)return;
  const d=it.data||{},h=it.owner.handle;
  if(!Array.isArray(state.recipes))state.recipes=[];
  if(!Array.isArray(state.wishlist))state.wishlist=[];
  if(state.recipes.some(r=>r.van===k)||state.wishlist.some(w=>w.van===k)){toast('already tried this one');return;}
  if(it.kind==='bean'){
    const naam=d.name||'a bean';
    const smaak=d.roasternotes?d.roasternotes.split(',').map(x=>x.trim()).filter(Boolean):[];
    state.wishlist.push({id:uid(),naam,name:naam,brander:d.roaster||'',origin:d.origin||'',url:'',regions:[],
      proces:d.process||'',variety:d.variety||'',altitude:'',brand:d.roast||'light',roasternotes:d.roasternotes||'',
      smaak,notitie:'from @'+h,at:Date.now(),van:k});
    save();toast('✓ on your list: '+naam);return;
  }
  // brew -> eigen recept: dezelfde methode als je die hebt, anders een uit dezelfde familie
  const esp=d.method==='espresso'||(!(d.ratio>=5)&&d.dose>0&&d.yield>0&&d.yield/d.dose<5);
  let mid=d.method&&state.methods.some(m=>m.id===d.method)?d.method:null;
  if(!mid){const fam=esp?'espresso':'filter';const m=state.methods.find(x=>x.on!==false&&methodFamily(x.id)===fam)||state.methods.find(x=>methodFamily(x.id)===fam);mid=m?m.id:null;}
  if(!mid){toast('turn on a method first under methods');return;}
  const fam=methodFamily(mid);
  const dose=d.dose>0?d.dose:(fam==='espresso'?18:15);
  const ratio=d.ratio>0?d.ratio:(d.yield>0&&d.dose>0?Math.round(d.yield/d.dose*10)/10:(fam==='espresso'?2:16));
  const naam=((d.beans||d.title||'brew')+' · @'+h).slice(0,60);
  const r={id:'r_'+uid().slice(0,6),eigen:true,mid,fam,tijd:d.time||'',beanId:null,naam,dose,ratio,
    temp:d.temp>0?d.temp:(fam==='espresso'?93:94),maling:fam==='espresso'?'fijn':'medium',stand:'',molen:null,
    houding:(typeof isAeropress==='function'&&isAeropress(mid))?'normaal':null,
    over:'Uit de feed van @'+h+(d.tags&&d.tags.length?': '+d.tags.join(', '):''),voor:[mid],van:k};
  if(fam==='espresso'){
    // zoals het ingebouwde e-classic: dose, tamp, shot, stop op de doeltijd
    const tSec=(typeof parseTimeSec==='function'&&parseTimeSec(d.time))||28;
    r.pre={on:false,s:5,rust:3};
    r.stappen=[{t:0,p:0,k:'dose',klep:null,d:'weeg '+dose+' g en verdeel het maalsel (WDT)'},
      {t:0,p:0,k:'tamp',klep:null,d:'tamp recht en waterpas'},
      {t:0,p:0,k:'shot',klep:null,d:'start de shot en de klok'},
      {t:tSec,p:0,k:'stop',klep:null,d:'stop op '+Math.round(dose*ratio)+' g uit en proef meteen'}];
  }else{
    const klep=(typeof isSwitch==='function'&&isSwitch(mid))?'open':null;
    r.stappen=[{t:0,p:Math.min(0.2,2/ratio),k:'bloom',klep,d:'bloom: giet 2× je dose tot alles nat is'},
      {t:45,p:1,k:'giet',klep,d:'giet in rustige cirkels tot je eindgewicht'}];
  }
  state.recipes.push(r);save();
  toast('✓ in your recipes: '+naam);
}
async function volgDeel(h){
  h=volgH(h);if(!h)return;
  const url=location.origin+location.pathname+'?u='+h;
  try{
    if(navigator.share){await navigator.share({title:'@'+h+' on Lets Brew',url});return;}
    await navigator.clipboard.writeText(url);toast('✓ link copied');
  }catch(e){if(!(e&&e.name==='AbortError'))toast(url);}
}

/* ---------------- je eigen profiel (kaart op profile) ---------------- */
async function volgLaadMij(){
  if(!volgAan()||volg.meLaden)return;
  volg.meLaden=true;
  try{volg.me=await volgGet('/api/social/me');volg.fout='';}
  catch(e){volg.fout=e.status===401?'signed out — sign in again above':'could not load your profile';}
  finally{volg.meLaden=false;volgRender();}
}
function volgRij(p,knoppen){
  const h=volgH(p.handle);
  return '<div class="volg-rij"><button class="volg-naam" onclick="volgOpen(\''+h+'\')"><b class="hand">@'+esc(h)+'</b>'+(p.name&&p.name!==h?' <span>'+esc(p.name)+'</span>':'')+'</button><span class="volg-acties">'+knoppen(h)+'</span></div>';
}
function volgTellers(c){
  c=c||{};
  return '<div class="volg-tel">'+[['brews',c.brews],['beans',c.beans],['followers',c.followers],['following',c.following]]
    .map(([n,v])=>'<span><b class="hand">'+(v|0)+'</b>'+n+'</span>').join('')+'</div>';
}
function volgRender(){
  volgNav();
  try{renderSetGroot();setWaarden();volgHomeRegel();}catch(e){}
  const card=document.getElementById('volg-card');if(!card)return;
  const aan=featOn('social');card.style.display=aan?'block':'none';
  const body=document.getElementById('volg-body');if(!aan||!body)return;
  if(!featOn('account')||!acctIngelogd()){body.innerHTML='<div class="set-d">Turn on account & sync and sign in above to follow people.</div>'+'<button class="profile-btn" id="volg-uit" onclick="toggleFeature(\'social\')">turn off follow &amp; feed</button>';return;}
  const me=volg.me;
  if(!me){body.innerHTML='<div class="set-d">'+esc(volg.fout||'loading…')+'</div>';if(!volg.meLaden&&!volg.fout)volgLaadMij();return;}
  const p=me.profile,pub=p.visibility==='public';
  const lijst=(titel,rows,knoppen,leeg)=>'<div class="volg-kop2">'+esc(titel)+' ('+rows.length+')</div>'+(rows.length?rows.map(x=>volgRij(x,knoppen)).join(''):'<div class="set-d">'+esc(leeg)+'</div>');
  body.innerHTML='<div class="acct-wie"><b class="hand">@'+esc(p.handle)+'</b></div>'+volgTellers(p.counts)+
    '<div class="field"><label for="volg-naam">your name</label><input id="volg-naam" maxlength="40" value="'+esc(p.name||'')+'" onchange="volgNaam(this.value)"></div>'+
    '<div class="volg-keus" role="group" aria-label="account"><button id="volg-prive" class="'+(pub?'':'sel')+'" onclick="volgZicht(\'private\')">private</button><button id="volg-open" class="'+(pub?'sel':'')+'" onclick="volgZicht(\'public\')">public</button></div>'+
    '<div class="set-d">Private: people ask to follow you, you say yes or no. Public: anyone can follow and look.</div>'+
    (me.requests.length?'<div class="volg-kop2">follow requests</div>'+me.requests.map(x=>volgRij(x,h=>'<button class="volg-k vol" onclick="volgVerzoek(\''+h+'\',true)">accept</button><button class="volg-k" onclick="volgVerzoek(\''+h+'\',false)">decline</button>')).join(''):'')+
    '<div class="volg-kop2">find people</div>'+
    '<div class="field"><input id="volg-zoek" autocapitalize="none" spellcheck="false" maxlength="20" placeholder="search by name, e.g. sanne" value="'+esc(volg.zoekQ)+'" oninput="volgZoek(this.value)"></div>'+
    '<div id="volg-zoek-uit">'+volgZoekHtml()+'</div>'+
    lijst('followers',me.followers,h=>'<button class="volg-k" onclick="volgVolgerWeg(\''+h+'\')">remove</button>','nobody yet')+
    lijst('following',me.following,h=>{const f=me.following.find(x=>x.handle===h);return (f&&f.status==='pending'?'<span class="volg-st">requested</span>':'')+'<button class="volg-k" onclick="volgOntvolg(\''+h+'\')">'+(f&&f.status==='pending'?'cancel':'unfollow')+'</button>';},'nobody yet')+
    (me.blocked.length?lijst('blocked',me.blocked,h=>'<button class="volg-k" onclick="volgDeblok(\''+h+'\')">unblock</button>',''):'')+
    '<div class="set-d acct-privacy"><b>what others see:</b> bean name, roaster, origin, process, method, dose, yield, ratio, time, temperature, score, taste tags and the photo. <b>never:</b> price, your own notes, wishlist, budget, gear and grind. Turning follow & feed off makes your account private again; photos already online stay until you delete the bean or brew, or your account.</div>'+'<button class="profile-btn" id="volg-uit" onclick="toggleFeature(\'social\')">turn off follow &amp; feed</button>';
}
function volgZoekHtml(){
  if(!volg.zoekQ)return '';
  if(!volg.zoek.length)return '<div class="set-d">nobody found</div>';
  return volg.zoek.map(x=>volgRij(x,h=>x.status==='accepted'?'<span class="volg-st">following</span>':x.status==='pending'?'<span class="volg-st">requested</span>':'<button class="volg-k vol" onclick="volgVolg(\''+h+'\')">'+(x.visibility==='public'?'follow':'ask')+'</button>')).join('');
}
function volgZoek(q){
  volg.zoekQ=String(q||'').trim().toLowerCase().replace(/^@/,'');
  clearTimeout(volgZoekTimer);
  if(!volg.zoekQ){volg.zoek=[];const u=document.getElementById('volg-zoek-uit');if(u)u.innerHTML='';return;}
  volgZoekTimer=setTimeout(async()=>{
    const q0=volg.zoekQ;
    try{const res=await volgGet('/api/social/search?q='+encodeURIComponent(q0));if(q0!==volg.zoekQ)return;volg.zoek=res.results||[];}
    catch(e){volg.zoek=[];if(e.status===429)toast('slow down a little');}
    const u=document.getElementById('volg-zoek-uit');if(u)u.innerHTML=volgZoekHtml();
  },300);
}
async function volgPost(path,body,method='POST'){
  try{return await acctApi(path,{method,body});}
  catch(e){toast(e.status===429?'slow down a little':(e.message||'that did not work'));return null;}
}
async function volgNaam(v){const r=await volgPost('/api/social/profile',{name:v});if(r){volg.me=r;toast('✓ name saved');volgRender();}}
/* vlag uit: je account gaat online terug naar private (ook als het nu niet lukt: bij de volgende sync) */
async function volgVlagUit(){
  if(!featOn('account')||!acctIngelogd())return;
  const s=acctSync0();s.socialUit=true;
  try{await acctApi('/api/social/profile',{body:{visibility:'private'}});s.socialUit=false;if(s.user)s.user.visibility='private';}catch(e){}
  volg.me=null;volg.feed=[];volg.geladen=false;save();
}
async function volgZicht(v){const r=await volgPost('/api/social/profile',{visibility:v});if(r){volg.me=r;state.sync.user.visibility=v;save();volgRender();toast(v==='public'?'✓ public: anyone can follow':'✓ private: you decide who follows');}}
async function volgVerzoek(h,ja){const r=await volgPost('/api/social/request',{handle:h,accept:ja});if(r){volg.me=r;volgRender();toast(ja?'✓ @'+h+' follows you now':'declined');}}
async function volgVolgerWeg(h){if(!confirm('Remove @'+h+' as a follower?'))return;const r=await volgPost('/api/social/follower',{handle:h},'DELETE');if(r){volg.me=r;volgRender();}}
async function volgNaVolg(){volg.geladen=false;volg.feed=[];volg.next=null;await volgLaadMij();if(currentPage==='person'&&volg.persoon)volgLaadPersoon(volg.persoon.handle);}
async function volgVolg(h){
  const r=await volgPost('/api/social/follow',{handle:h});if(!r)return;
  toast(r.status==='accepted'?'✓ following @'+h:'✓ asked @'+h);
  const z=volg.zoek.find(x=>x.handle===h);if(z){z.status=r.status;const u=document.getElementById('volg-zoek-uit');if(u)u.innerHTML=volgZoekHtml();}
  volgNaVolg();
}
async function volgOntvolg(h){const r=await volgPost('/api/social/follow',{handle:h},'DELETE');if(r){toast('unfollowed @'+h);volgNaVolg();}}
async function volgDeblok(h){const r=await volgPost('/api/social/block',{handle:h},'DELETE');if(r){volg.me=r;volgRender();toast('unblocked @'+h);}}

/* ---------------- profiel van een ander ---------------- */
function volgOpen(h){
  h=volgH(h);if(!h)return;
  if(!volgAan()){toast('sign in and turn on follow & feed in Settings');return;}
  navMap.person=currentPage==='feed'?'feed':'profile';
  volg.persoon={handle:h,laden:true};
  go('person');volgLaadPersoon(h);
}
async function volgLaadPersoon(h){
  try{
    const res=await volgGet('/api/social/u/'+h);
    volg.persoon={handle:h,profile:res.profile,items:volgOnthoud(res.items),next:res.next||null};
  }catch(e){volg.persoon={handle:h,fout:e.status===404?'This account is not here.':'Could not load this profile.'};}
  if(currentPage==='person')renderPerson();
}
async function volgPersoonMeer(){
  const p=volg.persoon;if(!p||!p.next)return;
  try{const res=await volgGet('/api/social/u/'+p.handle+'/items?cursor='+encodeURIComponent(p.next));p.items=p.items.concat(volgOnthoud(res.items));p.next=res.next||null;}
  catch(e){toast('could not load more');}
  renderPerson();
}
function volgItemHtml(it){
  const r=volgRegels(it);
  return '<div class="volg-item sketch soft">'+(it.photo&&VOLG_FOTO.test(it.photo)?'<img class="volg-img" src="'+esc(it.photo)+'" alt="" loading="lazy">':'')+
    '<div class="volg-it-t hand">'+esc(r.titel)+'</div><div class="set-d">'+esc(acctWanneer(it.at))+(r.regel?' · '+esc(r.regel):'')+'</div>'+
    (r.smaak?'<div class="set-d">"'+esc(r.smaak)+'"</div>':'')+
    '<div class="volg-it-k">'+volgKnoppen(it)+'</div></div>';
}
function renderPerson(){
  const el=document.getElementById('person-body');if(!el)return;
  const p=volg.persoon;
  const kop=document.getElementById('person-kop');if(kop)kop.textContent=p?'@'+p.handle:'profile';
  if(!p||p.laden){el.innerHTML='<div class="set-d">loading…</div>';return;}
  if(p.fout){el.innerHTML='<div class="set-d">'+esc(p.fout)+'</div>';return;}
  const pr=p.profile,h=volgH(pr.handle);
  let knop='';
  if(!pr.self){
    if(pr.status==='accepted')knop='<button class="profile-btn" id="person-volg" onclick="volgOntvolg(\''+h+'\')">following · unfollow</button>';
    else if(pr.status==='pending')knop='<button class="profile-btn" id="person-volg" onclick="volgOntvolg(\''+h+'\')">requested · cancel</button>';
    else knop='<button class="profile-btn acct-hoofd" id="person-volg" onclick="volgVolg(\''+h+'\')">'+(pr.visibility==='public'?'follow':'ask to follow')+'</button>';
    if(pr.followsYou==='pending')knop+='<div class="volg-rij"><span>@'+esc(h)+' wants to follow you</span><span class="volg-acties"><button class="volg-k vol" onclick="volgVerzoek(\''+h+'\',true).then(()=>volgLaadPersoon(\''+h+'\'))">accept</button><button class="volg-k" onclick="volgVerzoek(\''+h+'\',false).then(()=>volgLaadPersoon(\''+h+'\'))">decline</button></span></div>';
  }
  el.innerHTML='<div class="subtitle">'+esc(pr.name||h)+' · '+(pr.visibility==='public'?'public':'private')+'</div>'+(pr.counts?volgTellers(pr.counts):'')+knop+
    (pr.canView
      ?(p.items.length?p.items.map(volgItemHtml).join(''):'<div class="set-d">No brews or beans yet.</div>')+(p.next?'<button class="profile-btn" onclick="volgPersoonMeer()">more</button>':'')
      :'<div class="settings-card sketch soft"><div class="set-d">This account is private. Ask to follow to see their brews and beans.</div></div>')+
    (pr.self?'':'<div class="volg-onder"><button class="profile-btn acct-wis" onclick="volgMeld(\''+h+'\')">report @'+esc(h)+'</button><button class="profile-btn acct-wis" id="person-blok" onclick="volgBlok(\''+h+'\')">block @'+esc(h)+'</button></div>');
}
async function volgMeld(h){
  const reden=prompt('What is wrong with @'+h+'? (this goes to the app owner)');
  if(reden===null)return;
  const r=await volgPost('/api/social/report',{handle:h,reason:reden.slice(0,500)});
  if(r)toast('✓ reported. Thank you');
}
async function volgBlok(h){
  if(!confirm('Block @'+h+'? You will not see each other any more, and following stops both ways.'))return;
  const r=await volgPost('/api/social/block',{handle:h});if(!r)return;
  volg.me=r;volg.feed=volg.feed.filter(it=>it.owner.handle!==h);volg.geladen=false;
  toast('blocked @'+h);goBack();
}

/* ---------------- foto's online (na een geslaagde sync) ---------------- */
async function volgVerklein(src){
  try{
    const img=new Image();img.src=src;await img.decode();
    for(const [max,q] of [[1280,.8],[1024,.7],[800,.6]]){
      const sc=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight,1));
      const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.naturalWidth*sc));c.height=Math.max(1,Math.round(img.naturalHeight*sc));
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      const b=await new Promise(r=>c.toBlob(r,'image/jpeg',q));
      if(b&&b.size<=1024*1024)return b;
    }
  }catch(e){}
  return null;
}
async function volgFotos(){
  if(!volgAan()||volg.fotoBezig||navigator.onLine===false)return;
  volg.fotoBezig=true;
  const s=acctSync0();if(!s.fotos||typeof s.fotos!=='object')s.fotos={};
  let veranderd=false;
  try{
    const nu=new Set();
    for(const [kind,veld] of [['bean','beans'],['brew','brews']])for(const rec of state[veld]||[]){
      if(!rec||!BrewSecurity.identifier(String(rec.id)))continue;
      const f=typeof rec.photo==='string'&&rec.photo.startsWith('data:image/')?rec.photo:null;if(!f)continue;
      const k=kind+'/'+rec.id,h=f.length+':'+f.slice(-64);nu.add(k);
      if(s.fotos[k]&&s.fotos[k].h===h)continue;
      const blob=await volgVerklein(f);if(!blob)continue;
      const r=await fetch('/api/foto?kind='+kind+'&id='+encodeURIComponent(rec.id),{method:'POST',credentials:'same-origin',headers:{'Content-Type':'image/jpeg'},body:blob});
      if(r.status===429||r.status===401)break;
      if(r.ok){s.fotos[k]={h};veranderd=true;}
    }
    for(const k of Object.keys(s.fotos))if(!nu.has(k)){
      const [kind,id]=k.split('/');
      const r=await fetch('/api/foto?kind='+kind+'&id='+encodeURIComponent(id),{method:'DELETE',credentials:'same-origin'});
      if(r.ok||r.status===400){delete s.fotos[k];veranderd=true;}
    }
  }catch(e){/* offline of iets anders: volgende sync opnieuw */}
  finally{volg.fotoBezig=false;if(veranderd)save();}
}

/* ---------------- starten ---------------- */
// een recept zonder stappen (van vóór de keuring) breekt de lijsten: herstel met een lege lijst
function volgHerstelRecepten(){
  let n=0;for(const r of state.recipes||[])if(r&&!Array.isArray(r.stappen)){r.stappen=[];n++;}
  if(n)save();
}
function volgStart(){
  try{volgHerstelRecepten();}catch(e){}
  volgNav();
  const reel=document.getElementById('feed-reel');if(reel)reel.addEventListener('scroll',volgFeedScroll,{passive:true});
  // een gedeelde link: ?u=<handle>
  let h='';try{h=volgH(new URLSearchParams(location.search).get('u')||'');}catch(e){}
  if(!h)return;
  try{const u=new URL(location.href);u.searchParams.delete('u');history.replaceState(null,'',u.pathname+u.search+u.hash);}catch(e){}
  let n=0;const t=setInterval(()=>{
    if(currentPage==='welcome'&&++n<40)return;
    clearInterval(t);
    if(volgAan())volgOpen(h);else toast('sign in and turn on follow & feed in Settings to see @'+h);
  },250);
}
