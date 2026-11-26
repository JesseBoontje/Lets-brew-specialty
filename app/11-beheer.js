/* ---------------- beheer en Lets Brew AI (stap 3, valt onder vlag 'account') ----------------
   /api/auth/me vertelt of dit account admin is en of Lets Brew AI aan staat (ai_allowed);
   dat staat in state.sync.user (admin, ai) zodat de keuze ook meteen na het openen klopt.
   De server beslist altijd zelf: een vlag hier opent niets wat de server dichthoudt.
   Het aantal vragen van vandaag komt uit /me en daarna uit de kop X-AI-Left van /api/ai. */
const aiLb={used:null,limit:50};
let acctMeBezig=false;
function aiLbKan(){
  return featOn('account')&&acctIngelogd()&&!!state.sync.user.ai;
}
function aiLbLinks(left){
  const n=parseInt(left,10);if(!Number.isFinite(n))return;
  aiLb.used=Math.max(0,aiLb.limit-n);
  if(currentPage==='profile'){try{renderAiProv();}catch(e){}}
}
async function acctMeHaal(){
  if(!featOn('account')||!acctIngelogd()||acctMeBezig)return;
  acctMeBezig=true;
  try{
    const d=await acctApi('/api/auth/me',{method:'GET'});
    const u=state.sync.user,ai=!!(d.user&&d.user.ai),admin=!!(d.user&&d.user.admin);
    if(d.ai){aiLb.used=d.ai.used;aiLb.limit=d.ai.limit||50;}else aiLb.used=null;
    if(u.ai!==ai||u.admin!==admin){u.ai=ai;u.admin=admin;save();}
    if(!ai&&localStorage.getItem('scc_ai_prov')==='letsbrew')applyAIVisibility();
  }catch(e){
    if(e.status===401)acctUitgelogd();
  }finally{
    acctMeBezig=false;
    if(currentPage==='profile'){try{renderAiProv();renderAiBudget();}catch(e){}beheerRender();}
  }
}
/* het kaartje in Settings → AI als Lets Brew AI gekozen is */
function aiLbHtml(){
  const used=aiLb.used,lim=aiLb.limit||50;
  const deel=used==null?0:Math.max(0,Math.min(1,used/lim));
  return '<div class="lb-kaart" id="ai-lb-dag"><div class="k">today</div>'+
      '<div class="n">'+(used==null?'counting…':'<b>'+used+'</b> of '+lim+' questions')+'</div>'+
      '<div class="aib-meter"><i'+(deel>=.9?' class="op"':'')+' style="right:'+Math.round((1-deel)*100)+'%"></i></div>'+
      '<div class="set-d">'+(used==null?'':(Math.max(0,lim-used))+' left · ')+'Resets at midnight.</div></div>'+
    '<div class="lb-kaart"><div class="k">no key on this phone</div>'+
      '<div class="set-d">The key lives on the server. Nothing to paste here. Your own key stays as a spare: when today’s questions are used up, the app asks your own key if one is in this tab.</div></div>';
}

/* ---------------- Settings → Accounts (alleen voor de admin) ---------------- */
const beheer={users:null,reports:null,total:0,fout:'',bezig:false,geladen:0};
function beheerKan(){return featOn('account')&&acctIngelogd()&&!!state.sync.user.admin;}
async function beheerLaad(){
  if(beheer.bezig)return;
  beheer.bezig=true;beheer.fout='';
  try{
    const [u,r]=await Promise.all([acctApi('/api/admin/users',{method:'GET'}),acctApi('/api/admin/reports',{method:'GET'})]);
    beheer.users=u.users||[];beheer.total=u.total_today||0;beheer.reports=r.reports||[];beheer.geladen=Date.now();
  }catch(e){
    beheer.fout=e.status===403?'Only for the admin.':'could not load the accounts. try again when online';
    if(e.status===403&&state.sync.user){state.sync.user.admin=false;save();}
  }finally{beheer.bezig=false;beheerRender(true);}
}
function beheerDatum(t){return t?new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'';}
function beheerRender(alGeladen){
  const card=document.getElementById('beheer-card');if(!card)return;
  const aan=beheerKan();card.style.display=aan?'block':'none';
  const body=document.getElementById('beheer-body');if(!aan||!body)return;
  if(!alGeladen&&!beheer.bezig&&Date.now()-beheer.geladen>15000)beheerLaad();
  if(!beheer.users){body.innerHTML='<div class="set-d">'+esc(beheer.fout||'loading…')+'</div>';return;}
  const rij=u=>'<div class="volg-rij bh-rij" data-handle="'+esc(u.handle)+'">'+
    '<div class="bh-wie"><b class="hand">'+esc(u.handle)+'</b>'+(u.admin?' <span class="volg-st">admin</span>':'')+
      '<span>'+esc([u.name&&u.name!==u.handle?u.name:'','since '+beheerDatum(u.created),u.ai_today+' today'].filter(Boolean).join(' · '))+'</span></div>'+
    '<div class="volg-acties">'+(u.locked
      ?'<span class="volg-st">locked</span><button class="volg-k" onclick="beheerSlot(\''+u.handle+'\',false)">unlock</button>'
      :'<span class="volg-st">AI '+(u.ai_allowed?'on':'off')+'</span><div class="toggle bh-ai'+(u.ai_allowed?' on':'')+'" role="switch" aria-checked="'+(u.ai_allowed?'true':'false')+'" aria-label="Lets Brew AI for '+esc(u.handle)+'" onclick="beheerAi(\''+u.handle+'\','+(!u.ai_allowed)+')"><div class="knob"></div></div>')+
    '</div></div>';
  const melding=r=>'<div class="bh-melding" data-id="'+esc(r.id)+'">'+
    '<div><b>@'+esc(r.about||'gone')+'</b> <span class="volg-st">reported by @'+esc(r.by||'gone')+' · '+esc(beheerDatum(r.at))+'</span></div>'+
    (r.reason?'<div class="bh-reden">'+esc(r.reason)+'</div>':'')+
    '<div class="volg-acties"><button class="volg-k" onclick="beheerMelding(\''+r.id+'\',\'dismiss\')">dismiss</button>'+
      (r.about&&!r.about_locked?'<button class="volg-k bh-blok" onclick="beheerMelding(\''+r.id+'\',\'block\',\''+esc(r.about)+'\')">block account</button>':'<span class="volg-st">locked</span>')+'</div></div>';
  body.innerHTML='<div class="set-d">Only you see this card.</div>'+
    beheer.users.map(rij).join('')+
    '<div class="set-d bh-totaal">Today: <b>'+beheer.total+'</b> AI question'+(beheer.total===1?'':'s')+' in total.</div>'+
    '<div class="volg-kop2">reports ('+beheer.reports.length+')</div>'+
    (beheer.reports.length?beheer.reports.map(melding).join(''):'<div class="set-d">nothing reported</div>')+
    (beheer.fout?'<div class="set-d">'+esc(beheer.fout)+'</div>':'');
}
async function beheerZet(body,ok){
  try{await acctApi('/api/admin/user',{body});toast(ok);}
  catch(e){toast(e.message||'that did not work');}
  await beheerLaad();
}
function beheerAi(h,aan){
  // meteen tonen, de server bevestigt bij het herladen
  const u=(beheer.users||[]).find(x=>x.handle===h);if(u){u.ai_allowed=aan;beheerRender(true);}
  if(state.sync.user&&state.sync.user.handle===h){state.sync.user.ai=aan;save();}
  beheerZet({handle:h,ai_allowed:aan},'Lets Brew AI '+(aan?'on':'off')+' for @'+h).then(()=>{if(state.sync.user&&state.sync.user.handle===h)acctMeHaal();});
}
function beheerSlot(h,dicht){
  if(dicht&&!confirm('Lock @'+h+'? They cannot sign in, sync or use Lets Brew AI until you unlock.'))return;
  beheerZet({handle:h,locked:dicht},dicht?'@'+h+' locked':'@'+h+' unlocked');
}
async function beheerMelding(id,actie,h){
  if(actie==='block'&&!confirm('Block @'+h+'? The account is locked: no sign-in, no sync, no AI. All reports about @'+h+' are cleared.'))return;
  try{await acctApi('/api/admin/reports',{body:{id,action:actie}});toast(actie==='block'?'@'+h+' locked':'report dismissed');}
  catch(e){toast(e.message||'that did not work');}
  await beheerLaad();
}
