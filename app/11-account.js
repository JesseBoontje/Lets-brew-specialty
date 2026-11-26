/* ---------------- account en sync (stap 1, vlag 'account') ----------------
   De telefoon blijft de bron. Bij elk opslaan krijgt een gewijzigd record een
   updatedAt, en wat verdwijnt wordt een tombstone in state.sync.tomb, zodat de
   sync het wissen doorgeeft. Dat stempelen gebeurt altijd (onzichtbaar, zodat een
   later account niets mist); inloggen, het scherm en de sync zelf zitten achter
   featOn('account'). Online (D1) staat een kopie; merge per record op updatedAt,
   laatste wint. Foto's (data:) gaan niet mee, die blijven op de telefoon. */
const ACCT_LIJST={bean:'beans',brew:'brews',gear:'gear',recipe:'recipes'};
const ACCT_MAX_REC=64*1024,ACCT_BATCH=200,ACCT_BATCH_BYTES=2*1024*1024,ACCT_TOMB_MAX=5000;
let acctFp=null,acctBezig=false,acctTimer=null,acctMelding='',acctOpnieuw=false;
const acctBytes=t=>new TextEncoder().encode(t).length;
const acctDialId=key=>String(key).replace(/\|/g,'--');
function acctSync0(){if(!state.sync||typeof state.sync!=='object')state.sync={};const s=state.sync;if(!Array.isArray(s.tomb))s.tomb=[];if(!s.dialAt||typeof s.dialAt!=='object')s.dialAt={};return s;}
function acctIngelogd(){return !!(state.sync&&state.sync.user&&state.sync.user.handle);}
// vingerafdruk zonder updatedAt; lange tekst (foto's) ingekort, dat is genoeg om een wijziging te zien
function acctVinger(o){return JSON.stringify(o,(k,v)=>k==='updatedAt'?undefined:(typeof v==='string'&&v.length>300?v.length+':'+v.slice(0,80)+v.slice(-80):v));}
function acctRecords(){
  const out=[];
  for(const [kind,veld] of Object.entries(ACCT_LIJST)){const l=state[veld];if(Array.isArray(l))for(const r of l)if(r&&r.id!=null&&BrewSecurity.identifier(String(r.id)))out.push({kind,id:String(r.id),rec:r});}
  const dl=state.dialLog&&typeof state.dialLog==='object'?state.dialLog:{};
  for(const key of Object.keys(dl))if(Array.isArray(dl[key])&&BrewSecurity.identifier(acctDialId(key)))out.push({kind:'dial',id:acctDialId(key),key,rec:dl[key]});
  return out;
}
function acctVingers(){const m=new Map();for(const x of acctRecords())m.set(x.kind+'/'+x.id,acctVinger(x.rec));return m;}
function acctAt(x){return x.kind==='dial'?(acctSync0().dialAt[x.id]||0):(x.rec.updatedAt||0);}
function acctZetAt(x,t){if(x.kind==='dial')acctSync0().dialAt[x.id]=t;else x.rec.updatedAt=t;}
/* Aangeroepen vanuit save(), vóór de kopie naar IndexedDB. */
function acctStamp(){
  if(!acctFp){acctFp=acctVingers();return;}
  const now=Date.now(),nieuw=new Map(),s=acctSync0();let veranderd=false;
  for(const x of acctRecords()){
    const k=x.kind+'/'+x.id,f=acctVinger(x.rec);nieuw.set(k,f);
    if(acctFp.get(k)!==f){acctZetAt(x,now);veranderd=true;
      const i=s.tomb.findIndex(t=>t.kind===x.kind&&t.id===x.id);if(i>=0)s.tomb.splice(i,1);}
  }
  for(const k of acctFp.keys())if(!nieuw.has(k)){
    const [kind,id]=k.split('/');veranderd=true;
    if(kind==='dial')delete s.dialAt[id];
    // ook na uitloggen, zolang dit toestel bij een account hoorde: anders komt het gewiste terug
    if((acctIngelogd()||s.lastHandle)&&!s.tomb.some(t=>t.kind===kind&&t.id===id))s.tomb.push({kind,id,at:now});
  }
  if(s.tomb.length>ACCT_TOMB_MAX)s.tomb.splice(0,s.tomb.length-ACCT_TOMB_MAX);
  acctFp=nieuw;
  if(veranderd)acctPlan();
}
function acctPlan(){
  if(!featOn('account')||!acctIngelogd())return;
  if(acctBezig){acctOpnieuw=true;return;}
  clearTimeout(acctTimer);acctTimer=setTimeout(()=>acctSync(),5000);
}
/* data:-foto's eruit voor online; bij binnenkomst de eigen foto terugzetten */
function acctZonderFotos(v,d=0){
  if(d>24)return null;
  if(typeof v==='string')return v.startsWith('data:')?null:v;
  if(Array.isArray(v))return v.map(x=>acctZonderFotos(x,d+1));
  if(v&&typeof v==='object'){const o={};for(const [k,x] of Object.entries(v))o[k]=acctZonderFotos(x,d+1);return o;}
  return v;
}
function acctMetFotos(nieuw,oud,d=0){
  if(d>24)return nieuw;
  if(nieuw===null&&typeof oud==='string'&&oud.startsWith('data:'))return oud;
  if(Array.isArray(nieuw))return nieuw.map((x,i)=>acctMetFotos(x,Array.isArray(oud)?oud[i]:undefined,d+1));
  if(nieuw&&typeof nieuw==='object'){
    const o={};for(const [k,x] of Object.entries(nieuw))o[k]=acctMetFotos(x,oud&&typeof oud==='object'?oud[k]:undefined,d+1);
    if(oud&&typeof oud==='object'&&!Array.isArray(oud))for(const [k,x] of Object.entries(oud))if(!(k in o)&&typeof x==='string'&&x.startsWith('data:'))o[k]=x;
    return o;
  }
  return nieuw;
}
/* wat de server stuurde in state zetten, alleen als het nieuwer is */
function acctToepassen(changes){
  const s=acctSync0();let n=0;
  for(const c of changes||[]){
    if(!c||typeof c.id!=='string'||!Number.isFinite(c.updatedAt))continue;
    // hier gewist en nog niet doorgegeven: een oudere versie van online mag niet terugkomen
    const ti=s.tomb.findIndex(t=>t.kind===c.kind&&t.id===c.id);
    if(ti>=0){if(s.tomb[ti].at>=c.updatedAt)continue;s.tomb.splice(ti,1);}
    try{
      if(c.kind==='dial'){
        if(!state.dialLog||typeof state.dialLog!=='object')state.dialLog={};
        const key=(c.data&&typeof c.data.key==='string')?c.data.key:Object.keys(state.dialLog).find(k=>acctDialId(k)===c.id);
        if(!key||acctDialId(key)!==c.id||(s.dialAt[c.id]||0)>=c.updatedAt)continue;
        if(c.deleted){delete state.dialLog[key];delete s.dialAt[c.id];n++;continue;}
        if(!Array.isArray(c.data.attempts))continue;
        BrewSecurity.validateImport({dialLog:{x:c.data.attempts}});
        state.dialLog[key]=c.data.attempts;s.dialAt[c.id]=c.updatedAt;n++;continue;
      }
      const veld=ACCT_LIJST[c.kind];if(!veld)continue;
      if(!Array.isArray(state[veld]))state[veld]=[];
      const lijst=state[veld],i=lijst.findIndex(r=>r&&String(r.id)===c.id),lokaal=i>=0?lijst[i]:null;
      if(lokaal&&(lokaal.updatedAt||0)>=c.updatedAt)continue;
      if(c.deleted){if(i>=0){lijst.splice(i,1);n++;}continue;}
      if(!c.data||typeof c.data!=='object'||Array.isArray(c.data))continue;
      const rec=acctMetFotos(c.data,lokaal);rec.id=c.id;rec.updatedAt=c.updatedAt;
      BrewSecurity.validateImport({[veld]:[rec]});
      if(i>=0)lijst[i]=rec;else lijst.push(rec);n++;
    }catch(e){/* ongeldig record van de server: overslaan, de telefoon houdt het zijne */}
  }
  return n;
}
async function acctApi(path,{method='POST',body}={}){
  const r=await fetch(path,{method,credentials:'same-origin',headers:method==='GET'?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  let data=null;try{data=await r.json();}catch(e){}
  if(!r.ok){const e=new Error((data&&data.error)||('error '+r.status));e.status=r.status;throw e;}
  return data||{};
}
function acctUitgelogd(){const s=acctSync0();s.user=null;clearTimeout(acctTimer);save();}
/* Eén sync: alles sinds de vorige keer heen, en wat er online nieuw is terug. */
async function acctSync(handmatig){
  if(!featOn('account')||!acctIngelogd()||acctBezig)return false;
  if(navigator.onLine===false){acctMelding='offline, will sync later';acctRender();return false;}
  acctBezig=true;acctMelding='syncing…';acctRender();
  const s=acctSync0(),merk=Date.now();
  try{
    acctStamp();
    // bestaande data zonder updatedAt: de eigen tijd van het record, anders nu
    for(const x of acctRecords())if(!acctAt(x)){
      const r=x.rec,t=x.kind==='dial'?Math.max(0,...r.map(a=>+a.ts||0)):(+r.ts||Date.parse(r.at||'')||0);
      acctZetAt(x,t>0&&t<=merk?t:merk);
    }
    const vanaf=s.sentUpTo||0,uit=[];let teGroot=0,tot=merk;
    for(const x of acctRecords())if(acctAt(x)>vanaf){
      const data=x.kind==='dial'?{key:x.key,attempts:acctZonderFotos(x.rec)}:acctZonderFotos(x.rec);
      const n=acctBytes(JSON.stringify(data));if(n>ACCT_MAX_REC){teGroot++;continue;}
      uit.push({c:{kind:x.kind,id:x.id,updatedAt:acctAt(x),data},n});
    }
    for(const t of s.tomb)if(t.at>vanaf)uit.push({c:{kind:t.kind,id:t.id,updatedAt:t.at,deleted:true},n:60});
    // in stukjes van max 200 records of 2 MB; daarna doorvragen zolang de server "more" zegt
    const stukken=[];let stuk=[],bytes=0;
    for(const u of uit){if(stuk.length&&(stuk.length>=ACCT_BATCH||bytes+u.n>ACCT_BATCH_BYTES)){stukken.push(stuk);stuk=[];bytes=0;}stuk.push(u.c);bytes+=u.n;}
    stukken.push(stuk);
    let since=s.since||0,binnen=0;
    for(let i=0;i<stukken.length||i<60;i++){
      const res=await acctApi('/api/sync',{body:{since,changes:stukken[i]||[]}});
      binnen+=acctToepassen(res.changes);acctFp=acctVingers();
      // door de server geweigerd: sentUpTo blijft ervoor staan, zodat het opnieuw mee kan
      for(const r of res.rejected||[]){const u=(stukken[i]||[]).find(c=>c.kind===r.kind&&c.id===r.id);if(u)tot=Math.min(tot,u.updatedAt-1);teGroot++;}
      since=res.now;
      if(i>=stukken.length-1&&!res.more)break;
    }
    s.since=since;s.sentUpTo=Math.max(vanaf,tot);s.last=Date.now();
    s.tomb=s.tomb.filter(t=>t.at>tot);
    acctMelding=(binnen?binnen+' change'+(binnen===1?'':'s')+' from online':'')+(teGroot?(binnen?' · ':'')+teGroot+' too big to sync':'');
    await save();
    if(handmatig)toast('✓ synced');
    return true;
  }catch(e){
    if(e.status===401){acctMelding='signed out — sign in again to sync';acctUitgelogd();}
    else acctMelding=navigator.onLine===false?'offline, will sync later':e.status===413?e.message:'sync did not work, will try again later';
    if(handmatig)toast(acctMelding);
    return false;
  }finally{
    acctBezig=false;
    // binnengekomen records niet als eigen wijziging zien; was er tussendoor opgeslagen, dan nog een ronde
    acctFp=acctVingers();
    if(acctOpnieuw){acctOpnieuw=false;acctPlan();}
    acctRender();
  }
}
/* ---- passkeys ---- */
const acctB64={
  enc(buf){const b=new Uint8Array(buf);let s='';for(const x of b)s+=String.fromCharCode(x);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');},
  dec(str){const s=atob(str.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-str.length%4)%4));return Uint8Array.from(s,c=>c.charCodeAt(0));}
};
function acctKan(){return !!(window.PublicKeyCredential&&navigator.credentials&&window.isSecureContext);}
function acctNaInloggen(user){
  const s=acctSync0();
  // een ander account op deze telefoon: online begint dan bij nul
  if(s.lastHandle!==user.handle){s.since=0;s.sentUpTo=0;s.tomb=[];}
  s.user={handle:user.handle,visibility:user.visibility||'private'};s.lastHandle=user.handle;s.later=false;
  save();acctRender();acctSync();
}
async function acctLogin(){
  if(!acctKan()){toast('Face ID sign-in is not available in this browser');return;}
  try{
    const o=await acctApi('/api/auth/login/options',{body:{}});
    const pk=o.publicKey;
    const cred=await navigator.credentials.get({publicKey:{challenge:acctB64.dec(pk.challenge),rpId:pk.rpId,timeout:pk.timeout,userVerification:pk.userVerification,allowCredentials:[]}});
    if(!cred)return;
    const r=cred.response;
    const res=await acctApi('/api/auth/login/verify',{body:{credential:{id:cred.id,rawId:acctB64.enc(cred.rawId),type:cred.type,response:{clientDataJSON:acctB64.enc(r.clientDataJSON),authenticatorData:acctB64.enc(r.authenticatorData),signature:acctB64.enc(r.signature),userHandle:r.userHandle?acctB64.enc(r.userHandle):null}}}});
    acctNaInloggen(res.user);toast('✓ signed in as '+res.user.handle);
  }catch(e){
    if(e&&e.name==='NotAllowedError'){acctMelding='no passkey picked. New here? Create an account below.';acctNieuw=true;acctRender();return;}
    toast(e&&e.message?e.message:'sign-in did not work');
  }
}
let acctNieuw=false;
async function acctRegister(){
  if(!acctKan()){toast('Face ID sign-in is not available in this browser');return;}
  const inp=document.getElementById('acct-handle');
  const handle=((inp&&inp.value)||'').trim().toLowerCase();
  if(!/^[a-z0-9_]{3,20}$/.test(handle)){toast('pick a name of 3 to 20 letters, digits or _');return;}
  try{
    const o=await acctApi('/api/auth/register/options',{body:{handle}});
    const pk=o.publicKey;
    const cred=await navigator.credentials.create({publicKey:{...pk,challenge:acctB64.dec(pk.challenge),user:{...pk.user,id:acctB64.dec(pk.user.id)}}});
    if(!cred)return;
    const r=cred.response;
    const res=await acctApi('/api/auth/register/verify',{body:{credential:{id:cred.id,rawId:acctB64.enc(cred.rawId),type:cred.type,response:{clientDataJSON:acctB64.enc(r.clientDataJSON),attestationObject:acctB64.enc(r.attestationObject)}}}});
    acctNieuw=false;acctNaInloggen(res.user);toast('✓ account made: '+res.user.handle);
  }catch(e){
    if(e&&e.name==='NotAllowedError'){toast('cancelled');return;}
    toast(e&&e.message?e.message:'that did not work');
  }
}
async function acctLogout(){
  try{await acctApi('/api/auth/logout',{body:{}});}catch(e){}
  acctMelding='';acctUitgelogd();acctRender();toast('signed out. everything stays on this phone');
}
async function acctWis(){
  if(!acctIngelogd())return;
  if(!confirm('Delete your account and everything online? Your beans and brews stay on this phone.'))return;
  if(!confirm('Sure? This cannot be undone.'))return;
  try{
    await acctApi('/api/account',{method:'DELETE'});
    state.sync={tomb:[],dialAt:{}};acctMelding='';save();acctRender();
    toast('account deleted. remove the passkey in Settings → Passwords too');
  }catch(e){toast(e&&e.message?e.message:'deleting did not work. try again when online');}
}
function acctLater(){acctSync0().later=true;save();acctRender();}
function acctWanneer(t){
  if(!t)return 'not yet';
  const s=Math.round((Date.now()-t)/1000);
  if(s<60)return 'just now';if(s<3600)return Math.round(s/60)+' min ago';
  if(s<86400)return Math.round(s/3600)+' h ago';
  return new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
}
const ACCT_PRIVACY='<b>what is online:</b> a copy of your beans, brews, gear, own recipes and dial-in attempts. Photos stay on this phone for now. '+
  '<b>where:</b> Cloudflare, in the EU. '+
  '<b>private:</b> price and your own notes are never shown to anyone else — also not later, when you share. No password and no email: your iPhone keeps the key in iCloud Keychain. '+
  '<b>delete:</b> the button below removes your account and everything online at once. This phone keeps its own copy.';
function acctRender(){
  const card=document.getElementById('acct-card');if(!card)return;
  const aan=featOn('account');card.style.display=aan?'block':'none';
  const body=document.getElementById('acct-body');if(!aan||!body)return;
  const s=state.sync||{};
  if(acctIngelogd()){
    body.innerHTML='<div class="acct-wie">signed in as <b class="hand">'+esc(s.user.handle)+'</b></div>'+
      '<div class="set-d" id="acct-status">last sync: '+esc(acctWanneer(s.last))+(acctMelding?' · '+esc(acctMelding):'')+'</div>'+
      '<button class="profile-btn acct-hoofd" id="acct-sync" onclick="acctSync(true)"'+(acctBezig?' disabled':'')+'>sync now</button>'+
      '<div class="set-d acct-privacy">'+ACCT_PRIVACY+'</div>'+
      '<button class="profile-btn" onclick="acctLogout()">sign out on this phone</button>'+
      '<button class="profile-btn acct-wis" id="acct-wis" onclick="acctWis()">delete account and everything online</button>';
    return;
  }
  if(s.later&&!acctNieuw){
    body.innerHTML='<div class="set-d">not signed in. Everything stays on this phone.</div>'+
      '<button class="profile-btn" onclick="acctSync0().later=false;acctRender()">sign in with Face ID</button>';
    return;
  }
  body.innerHTML='<div class="set-d" style="margin:2px 0 10px">Keep your beans and brews safe, on every device.</div>'+
    '<button class="profile-btn acct-hoofd" id="acct-login" onclick="acctLogin()">sign in with Face ID</button>'+
    (acctNieuw
      ?'<div class="field" style="margin-top:6px"><label for="acct-handle">pick a name (3–20: a–z, 0–9, _)</label><input id="acct-handle" autocomplete="username webauthn" autocapitalize="none" spellcheck="false" maxlength="20" placeholder="e.g. jesse_brews" onkeydown="if(event.key===\'Enter\')acctRegister()"></div>'+
       '<button class="profile-btn" id="acct-maak" onclick="acctRegister()">create account with Face ID</button>'
      :'<button class="profile-btn" id="acct-nieuw" onclick="acctNieuw=true;acctRender()">new here? create an account</button>')+
    '<button class="profile-btn acct-later" onclick="acctNieuw=false;acctLater()">not now, keep it on this phone</button>'+
    (acctMelding?'<div class="set-d">'+esc(acctMelding)+'</div>':'')+
    '<div class="set-d" style="font-size:14px">No password. Your iPhone keeps the key in iCloud Keychain.</div>'+
    '<div class="set-d acct-privacy">'+ACCT_PRIVACY+'</div>';
}
/* bij openen: vingerafdrukken vastleggen en, als je ingelogd bent, meteen syncen */
function acctStart(){
  if(!acctFp)acctFp=acctVingers();
  if(featOn('account')&&acctIngelogd())acctSync();
}
window.addEventListener('online',()=>{if(featOn('account')&&acctIngelogd())acctSync();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&featOn('account')&&acctIngelogd()&&Date.now()-((state.sync||{}).last||0)>60000)acctSync();});
