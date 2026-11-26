/* Account, passkeys en sync voor Lets Brew (stap 1).
   Eigen kleine WebAuthn-verificatie met WebCrypto: geen bibliotheek nodig, alleen
   ES256 (-7) en RS256 (-257), attestation "none" (de attestatie wordt niet gelezen),
   userVerification verplicht. De telefoon blijft de bron; D1 is de online kopie.
   Nooit tokens, sleutels of challenges loggen. */

const SESSIE_DAGEN=90, CHALLENGE_MS=5*60*1000;
const KINDS=['bean','brew','gear','recipe','dial'];
const MAX_RECORD=64*1024, MAX_CHANGES=500, MAX_SYNC_BODY=10*1024*1024, MAX_PULL=500, MAX_RECORDS=5000;
const enc=new TextEncoder(), dec=new TextDecoder();
const HEADERS={'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Strict-Transport-Security':'max-age=15552000'};
export const json=(value,status=200,extra={})=>new Response(JSON.stringify(value),{status,headers:{...HEADERS,...extra}});

/* ---------- kleine hulpjes ---------- */
const fout=e=>Object.assign(Error(e),{fout:e});
export const b64u={
 enc(bytes){bytes=new Uint8Array(bytes);let s='';for(let i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');},
 dec(str){if(typeof str!=='string'||!/^[A-Za-z0-9_-]*$/.test(str))throw fout('b64');const s=atob(str.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-str.length%4)%4));const out=new Uint8Array(s.length);for(let i=0;i<s.length;i++)out[i]=s.charCodeAt(i);return out;}
};
const rnd=n=>crypto.getRandomValues(new Uint8Array(n));
const sha256=async data=>new Uint8Array(await crypto.subtle.digest('SHA-256',typeof data==='string'?enc.encode(data):data));
const hex=bytes=>[...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');
const gelijk=(a,b)=>{if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a[i]^b[i];return d===0;};
const concat=(...parts)=>{const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let o=0;for(const p of parts){out.set(p,o);o+=p.length;}return out;};
const bytesVan=v=>v instanceof Uint8Array?v:v instanceof ArrayBuffer?new Uint8Array(v):Array.isArray(v)?new Uint8Array(v):null;

/* Minimale CBOR-lezer: genoeg voor attestationObject en COSE-sleutels. */
export function cbor(bytes){
 let p=0;
 const len=info=>{if(info<24)return info;const n={24:1,25:2,26:4,27:8}[info];if(!n)throw fout('cbor');if(p+n>bytes.length)throw fout('cbor');let v=0;for(let i=0;i<n;i++)v=v*256+bytes[p++];return v;};
 const item=(diepte=0)=>{
  if(diepte>16||p>=bytes.length)throw fout('cbor');
  const b=bytes[p++],major=b>>5,info=b&31;
  if(major===7){if(info===20)return false;if(info===21)return true;if(info===22||info===23)return null;throw fout('cbor');}
  const n=len(info);
  if(major===0)return n;
  if(major===1)return -1-n;
  if(major===2||major===3){if(p+n>bytes.length)throw fout('cbor');const s=bytes.slice(p,p+n);p+=n;return major===2?s:dec.decode(s);}
  if(major===4){if(n>1000)throw fout('cbor');const a=[];for(let i=0;i<n;i++)a.push(item(diepte+1));return a;}
  if(major===5){if(n>1000)throw fout('cbor');const m=new Map();for(let i=0;i<n;i++){const k=item(diepte+1);m.set(k,item(diepte+1));}return m;}
  throw fout('cbor');
 };
 const v=item();return {value:v,end:p};
}

/* authenticatorData: rpIdHash(32) flags(1) signCount(4) [aaguid(16) credIdLen(2) credId cose] */
function leesAuthData(ad,metSleutel){
 if(ad.length<37)throw fout('authdata');
 const out={rpIdHash:ad.slice(0,32),flags:ad[32],signCount:((ad[33]<<24)>>>0)+(ad[34]<<16)+(ad[35]<<8)+ad[36]};
 if(metSleutel){
  if(!(out.flags&0x40)||ad.length<55)throw fout('authdata');
  const l=(ad[53]<<8)+ad[54];if(l<16||l>1023||ad.length<55+l)throw fout('authdata');
  out.credId=ad.slice(55,55+l);
  const rest=ad.slice(55+l),{end}=cbor(rest);
  out.cose=rest.slice(0,end);
 }
 return out;
}

/* COSE-sleutel naar WebCrypto. Alleen ES256 (P-256) en RS256. */
async function importeerCose(coseBytes){
 const {value:k}=cbor(coseBytes);
 if(!(k instanceof Map))throw fout('cose');
 const kty=k.get(1),alg=k.get(3);
 if(kty===2&&alg===-7){
  const x=k.get(-2),y=k.get(-3);
  if(k.get(-1)!==1||!(x instanceof Uint8Array)||!(y instanceof Uint8Array)||x.length!==32||y.length!==32)throw fout('cose');
  return {alg,key:await crypto.subtle.importKey('jwk',{kty:'EC',crv:'P-256',x:b64u.enc(x),y:b64u.enc(y),ext:true},{name:'ECDSA',namedCurve:'P-256'},false,['verify'])};
 }
 if(kty===3&&alg===-257){
  const n=k.get(-1),e=k.get(-2);
  if(!(n instanceof Uint8Array)||!(e instanceof Uint8Array)||n.length<256)throw fout('cose');
  return {alg,key:await crypto.subtle.importKey('jwk',{kty:'RSA',n:b64u.enc(n),e:b64u.enc(e),alg:'RS256',ext:true},{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify'])};
 }
 throw fout('alg');
}
/* ECDSA-handtekening van een authenticator is DER; WebCrypto wil r||s (64 bytes). */
function derNaarRaw(der){
 let p=0;if(der[p++]!==0x30)throw fout('sig');let l=der[p++];if(l&0x80)p+=l&0x7f;
 const deel=()=>{if(der[p++]!==0x02)throw fout('sig');const n=der[p++];let v=der.slice(p,p+n);p+=n;while(v.length>32&&v[0]===0)v=v.slice(1);if(v.length>32)throw fout('sig');return concat(new Uint8Array(32-v.length),v);};
 return concat(deel(),deel());
}
async function controleerHandtekening(coseBytes,sig,data){
 const {alg,key}=await importeerCose(coseBytes);
 if(alg===-7)return crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,derNaarRaw(sig),data);
 return crypto.subtle.verify({name:'RSASSA-PKCS1-v1_5'},key,sig,data);
}

/* ---------- verzoek ---------- */
export async function leesBody(request,max){
 const reader=request.body?.getReader();if(!reader)return {};
 const delen=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw fout('groot');}delen.push(value);}
 if(!size)return {};
 const v=JSON.parse(dec.decode(concat(...delen)));
 if(!v||typeof v!=='object'||Array.isArray(v))throw fout('vorm');
 return v;
}
function cookie(request,naam){
 for(const deel of (request.headers.get('Cookie')||'').split(';')){const i=deel.indexOf('=');if(i>0&&deel.slice(0,i).trim()===naam)return deel.slice(i+1).trim();}
 return '';
}
const sessieCookie=token=>`lb_s=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api/; Max-Age=${SESSIE_DAGEN*86400}`;
export const wisCookie='lb_s=; HttpOnly; Secure; SameSite=Strict; Path=/api/; Max-Age=0';

export async function gebruiker(request,env){
 const token=cookie(request,'lb_s');
 if(!/^[A-Za-z0-9_-]{43}$/.test(token))return null;
 const row=await env.DB.prepare('SELECT u.id,u.handle,u.visibility,u.ai_allowed,u.is_admin,u.locked,s.expires_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?').bind(hex(await sha256(token))).first();
 // een account op slot (beheer) telt nergens meer als ingelogd: geen sync, geen volgen, geen AI
 if(!row||row.expires_at<Date.now()||row.locked)return null;
 return row;
}
/* AI van de app (stap 3): een teller per gebruiker per dag, op de Amsterdamse datum. */
export const AI_LIMIET=50;
export const aiDag=(t=Date.now())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Amsterdam',year:'numeric',month:'2-digit',day:'2-digit'}).format(t);
export async function aiGebruikt(env,userId){
 const r=await env.DB.prepare('SELECT count FROM ai_usage WHERE user_id=? AND day=?').bind(userId,aiDag()).first();
 return r?r.count:0;
}
async function ik(env,u){
 const out={user:{handle:u.handle,visibility:u.visibility,admin:!!u.is_admin,ai:!!u.ai_allowed}};
 if(u.ai_allowed)out.ai={used:Math.min(AI_LIMIET,await aiGebruikt(env,u.id)),limit:AI_LIMIET};
 return out;
}
async function nieuweSessie(env,userId){
 const token=b64u.enc(rnd(32));
 await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').bind(hex(await sha256(token)),userId,Date.now()+SESSIE_DAGEN*86400e3).run();
 return token;
}
async function nieuweChallenge(env,kind,extra={}){
 const challenge=b64u.enc(rnd(32)),now=Date.now();
 await env.DB.batch([
  env.DB.prepare('DELETE FROM challenges WHERE expires_at<?').bind(now),
  env.DB.prepare('INSERT INTO challenges(challenge,kind,user_id,handle,expires_at) VALUES(?,?,?,?,?)').bind(challenge,kind,extra.userId||null,extra.handle||null,now+CHALLENGE_MS)
 ]);
 return challenge;
}
/* clientDataJSON lezen, challenge eenmalig opnemen (DELETE ... RETURNING) en origin controleren. */
async function leesClientData(env,request,b64,type){
 const raw=b64u.dec(b64);if(raw.length>4096)throw fout('client');
 const c=JSON.parse(dec.decode(raw));
 if(c.type!==type)throw fout('type');
 if(c.origin!==new URL(request.url).origin)throw fout('origin');
 if(typeof c.challenge!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(c.challenge))throw fout('challenge');
 const ch=await env.DB.prepare('DELETE FROM challenges WHERE challenge=? AND kind=? RETURNING user_id,handle,expires_at').bind(c.challenge,type==='webauthn.create'?'register':'login').first();
 if(!ch||ch.expires_at<Date.now())throw fout('challenge');
 return {raw,ch};
}
async function controleerAuthData(request,ad){
 const rpId=new URL(request.url).hostname;
 if(!gelijk(ad.rpIdHash,await sha256(rpId)))throw fout('rp');
 if(!(ad.flags&0x01)||!(ad.flags&0x04))throw fout('uv');
}

/* ---------- routes ---------- */
const HANDLE=/^[a-z0-9_]{3,20}$/;
async function registerOptions(request,env,body){
 const handle=typeof body.handle==='string'?body.handle.trim().toLowerCase():'';
 if(!HANDLE.test(handle))return json({error:'Pick a name of 3 to 20 letters, digits or _.'},400);
 if(await env.DB.prepare('SELECT 1 FROM users WHERE handle=?').bind(handle).first())return json({error:'That name is taken.'},409);
 const userId=b64u.enc(rnd(16));
 const challenge=await nieuweChallenge(env,'register',{userId,handle});
 return json({publicKey:{challenge,rp:{id:new URL(request.url).hostname,name:'Lets Brew'},user:{id:userId,name:handle,displayName:handle},
  pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],timeout:CHALLENGE_MS,attestation:'none',
  authenticatorSelection:{residentKey:'required',requireResidentKey:true,userVerification:'required'}}});
}
async function registerVerify(request,env,body){
 const cred=body.credential,r=cred?.response;
 if(!cred||cred.type!=='public-key'||typeof cred.id!=='string'||typeof r?.clientDataJSON!=='string'||typeof r?.attestationObject!=='string')return json({error:'Invalid request.'},400);
 const {ch}=await leesClientData(env,request,r.clientDataJSON,'webauthn.create');
 const att=b64u.dec(r.attestationObject);if(att.length>16384)throw fout('att');
 const {value:obj}=cbor(att);
 if(!(obj instanceof Map)||!(obj.get('authData') instanceof Uint8Array))throw fout('att');
 const ad=leesAuthData(obj.get('authData'),true);
 await controleerAuthData(request,ad);
 if(b64u.enc(ad.credId)!==cred.id)throw fout('id');
 await importeerCose(ad.cose); // weigert alles behalve ES256/RS256
 if(!HANDLE.test(ch.handle||'')||!ch.user_id)throw fout('challenge');
 if(await env.DB.prepare('SELECT 1 FROM users WHERE handle=?').bind(ch.handle).first())return json({error:'That name is taken.'},409);
 if(await env.DB.prepare('SELECT 1 FROM passkeys WHERE id=?').bind(cred.id).first())return json({error:'This passkey is already in use.'},409);
 const now=Date.now(),token=b64u.enc(rnd(32));
 await env.DB.batch([
  env.DB.prepare("INSERT INTO users(id,handle,name,visibility,created_at) VALUES(?,?,?,'private',?)").bind(ch.user_id,ch.handle,ch.handle,now),
  env.DB.prepare('INSERT INTO passkeys(id,user_id,public_key,sign_count,created_at) VALUES(?,?,?,?,?)').bind(cred.id,ch.user_id,ad.cose.buffer.slice(ad.cose.byteOffset,ad.cose.byteOffset+ad.cose.length),ad.signCount,now),
  env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').bind(hex(await sha256(token)),ch.user_id,now+SESSIE_DAGEN*86400e3)
 ]);
 return json({user:{handle:ch.handle,visibility:'private'}},200,{'Set-Cookie':sessieCookie(token)});
}
async function loginOptions(request,env){
 const challenge=await nieuweChallenge(env,'login');
 return json({publicKey:{challenge,rpId:new URL(request.url).hostname,timeout:CHALLENGE_MS,userVerification:'required',allowCredentials:[]}});
}
async function loginVerify(request,env,body){
 const cred=body.credential,r=cred?.response;
 if(!cred||cred.type!=='public-key'||typeof cred.id!=='string'||!/^[A-Za-z0-9_-]{16,1400}$/.test(cred.id)||typeof r?.clientDataJSON!=='string'||typeof r?.authenticatorData!=='string'||typeof r?.signature!=='string')return json({error:'Invalid request.'},400);
 const {raw}=await leesClientData(env,request,r.clientDataJSON,'webauthn.get');
 const pk=await env.DB.prepare('SELECT p.user_id,p.public_key,p.sign_count,u.handle,u.visibility,u.locked FROM passkeys p JOIN users u ON u.id=p.user_id WHERE p.id=?').bind(cred.id).first();
 if(!pk)return json({error:'This passkey is not known here. Create an account first.'},401);
 const adBytes=b64u.dec(r.authenticatorData),ad=leesAuthData(adBytes,false);
 await controleerAuthData(request,ad);
 const ok=await controleerHandtekening(bytesVan(pk.public_key),b64u.dec(r.signature),concat(adBytes,await sha256(raw)));
 if(!ok)throw fout('sig');
 // een teller die niet oploopt wijst op een gekloonde sleutel (passkeys in iCloud tellen niet, dan 0)
 if((ad.signCount||pk.sign_count)&&ad.signCount<=pk.sign_count)throw fout('teller');
 // pas na een geldige handtekening zeggen dat het account op slot is (anders verraadt het welke passkeys bestaan)
 if(pk.locked)return json({error:'This account is locked.',code:'locked'},403);
 await env.DB.prepare('UPDATE passkeys SET sign_count=? WHERE id=?').bind(ad.signCount,cred.id).run();
 const token=await nieuweSessie(env,pk.user_id);
 return json({user:{handle:pk.handle,visibility:pk.visibility}},200,{'Set-Cookie':sessieCookie(token)});
}
async function logout(request,env){
 const token=cookie(request,'lb_s');
 if(/^[A-Za-z0-9_-]{43}$/.test(token))await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(hex(await sha256(token))).run();
 return json({ok:true},200,{'Set-Cookie':wisCookie});
}

/* data:-foto's eruit: die komen in stap 2 via R2. */
function zonderFotos(v,d=0){
 if(d>24)throw fout('diep');
 if(typeof v==='string')return v.startsWith('data:')?null:v;
 if(Array.isArray(v))return v.map(x=>zonderFotos(x,d+1));
 if(v&&typeof v==='object'){const o={};for(const [k,x] of Object.entries(v)){if(k==='__proto__')continue;o[k]=zonderFotos(x,d+1);}return o;}
 return v;
}
const ID=/^[A-Za-z0-9_-]{1,100}$/;
async function sync(request,env,user,body){
 const since=Number.isSafeInteger(body.since)&&body.since>=0?body.since:0;
 const changes=body.changes===undefined?[]:body.changes;
 if(!Array.isArray(changes))return json({error:'Invalid request.'},400);
 if(changes.length>MAX_CHANGES)return json({error:'Too many changes at once (max '+MAX_CHANGES+').'},413);
 const schrijf=[],geweigerd=[],sleutels=new Set();
 for(const c of changes){
  if(!c||typeof c!=='object'||!KINDS.includes(c.kind)||typeof c.id!=='string'||!ID.test(c.id)||!Number.isSafeInteger(c.updatedAt)||c.updatedAt<0)return json({error:'Invalid change.'},400);
  const k=c.kind+'/'+c.id;if(sleutels.has(k))return json({error:'Duplicate change.'},400);sleutels.add(k);
  const deleted=c.deleted===true;
  let data=null;
  if(!deleted){
   if(!c.data||typeof c.data!=='object'||Array.isArray(c.data))return json({error:'Invalid change.'},400);
   data=JSON.stringify(zonderFotos(c.data));
   if(enc.encode(data).length>MAX_RECORD){geweigerd.push({kind:c.kind,id:c.id,reason:'too big'});continue;}
  }
  schrijf.push({c,deleted,data});
 }
 // maximum per gebruiker: alleen nieuwe records (geen wisberichten) tellen mee
 if(schrijf.length){
  const {n}=await env.DB.prepare('SELECT COUNT(*) AS n FROM records WHERE user_id=?').bind(user.id).first();
  const kandidaten=schrijf.filter(x=>!x.deleted);
  if(n+kandidaten.length>MAX_RECORDS){
   let nieuw=0;
   for(const {c} of kandidaten)if(!await env.DB.prepare('SELECT 1 FROM records WHERE user_id=? AND kind=? AND id=?').bind(user.id,c.kind,c.id).first())nieuw++;
   if(n+nieuw>MAX_RECORDS)return json({error:'Online storage is full (max '+MAX_RECORDS+' records). Nothing was changed; everything stays on this phone.',code:'full'},413);
  }
 }
 /* synced_at is een volgnummer per gebruiker: MAX+1 binnen dezelfde batch (één
    transactie), dus oplopend in de volgorde waarin het vastligt. Daarna pas
    ophalen, zodat niets tussen twee gelijktijdige verzoeken door glipt; `now` is
    het hoogste gelezen nummer. Eigen schrijfwerk komt ook terug; de telefoon
    slaat dat over (zelfde updatedAt). */
 let verloren=[];
 if(schrijf.length){
  // foto's van records die nu gewist worden: na het schrijven ook uit R2 (stap 2)
  const fotoWeg=[];
  for(const {c,deleted} of schrijf)if(deleted){const r=await env.DB.prepare('SELECT photo_key FROM records WHERE user_id=? AND kind=? AND id=? AND photo_key IS NOT NULL').bind(user.id,c.kind,c.id).first();if(r)fotoWeg.push({c,key:r.photo_key});}
  const stmts=schrijf.map(({c,deleted,data})=>env.DB.prepare(
   `INSERT INTO records(user_id,kind,id,data,shareable,updated_at,deleted,synced_at)
    VALUES(?,?,?,?,0,?,?,(SELECT COALESCE(MAX(synced_at),0)+1 FROM records WHERE user_id=?))
    ON CONFLICT(user_id,kind,id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at,deleted=excluded.deleted,synced_at=excluded.synced_at,
     photo_key=CASE WHEN excluded.deleted=1 THEN NULL ELSE records.photo_key END
    WHERE excluded.updated_at>=records.updated_at`).bind(user.id,c.kind,c.id,deleted?null:data,c.updatedAt,deleted?1:0,user.id));
  const res=await env.DB.batch(stmts);
  verloren=schrijf.filter((_,i)=>!(res[i]?.meta?.changes));
  const weg=fotoWeg.filter(f=>!verloren.some(v=>v.c===f.c)).map(f=>'foto/'+f.key);
  if(weg.length&&env.FOTOS)await env.FOTOS.delete(weg);
 }
 const rows=(await env.DB.prepare('SELECT kind,id,data,updated_at,deleted,synced_at FROM records WHERE user_id=? AND synced_at>? ORDER BY synced_at LIMIT ?').bind(user.id,since,MAX_PULL+1).all()).results||[];
 const more=rows.length>MAX_PULL;if(more)rows.length=MAX_PULL;
 const now=rows.length?rows[rows.length-1].synced_at:since;
 // verloren van een nieuwere versie op de server: die gaat altijd mee terug
 for(const {c} of verloren){
  if(rows.some(x=>x.kind===c.kind&&x.id===c.id))continue;
  const r=await env.DB.prepare('SELECT kind,id,data,updated_at,deleted,synced_at FROM records WHERE user_id=? AND kind=? AND id=?').bind(user.id,c.kind,c.id).first();
  if(r)rows.push(r);
 }
 const uit=rows.map(r=>{const o={kind:r.kind,id:r.id,updatedAt:r.updated_at,deleted:!!r.deleted};if(!r.deleted){try{o.data=JSON.parse(r.data);}catch{o.data=null;}}return o;});
 return json({now,more,changes:uit,rejected:geweigerd});
}
async function wisAccount(env,user){
 const u=user.id;
 if(env.FOTOS){
  const f=(await env.DB.prepare('SELECT photo_key FROM records WHERE user_id=? AND photo_key IS NOT NULL').bind(u).all()).results||[];
  for(let i=0;i<f.length;i+=500)await env.FOTOS.delete(f.slice(i,i+500).map(x=>'foto/'+x.photo_key));
 }
 await env.DB.batch([
  env.DB.prepare('DELETE FROM records WHERE user_id=?').bind(u),
  env.DB.prepare('DELETE FROM passkeys WHERE user_id=?').bind(u),
  env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(u),
  env.DB.prepare('DELETE FROM follows WHERE follower_id=? OR followee_id=?').bind(u,u),
  env.DB.prepare('DELETE FROM likes WHERE user_id=? OR owner_id=?').bind(u,u),
  env.DB.prepare('DELETE FROM blocks WHERE user_id=? OR blocked_id=?').bind(u,u),
  env.DB.prepare('DELETE FROM reports WHERE by_user=? OR about_user=?').bind(u,u),
  env.DB.prepare('DELETE FROM ai_usage WHERE user_id=?').bind(u),
  env.DB.prepare('DELETE FROM challenges WHERE user_id=?').bind(u),
  env.DB.prepare('DELETE FROM users WHERE id=?').bind(u)
 ]);
 return json({ok:true},200,{'Set-Cookie':wisCookie});
}

export async function accountRoute(request,env={}){
 const url=new URL(request.url),path=url.pathname,m=request.method;
 if(!env.DB)return json({error:'Accounts are not available here.'},503);
 const auth=path.startsWith('/api/auth/');
 const routes={'/api/auth/register/options':'POST','/api/auth/register/verify':'POST','/api/auth/login/options':'POST','/api/auth/login/verify':'POST','/api/auth/logout':'POST','/api/auth/me':'GET','/api/sync':'POST','/api/account':'DELETE'};
 if(!routes[path])return json({error:'Not found.'},404);
 if(routes[path]!==m)return json({error:'Method not allowed.'},405);
 if(m!=='GET'){
  if(request.headers.get('Origin')!==url.origin)return json({error:'This request does not belong to the app.'},403);
  if(m==='POST'&&!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return json({error:'JSON required.'},415);
 }
 if(auth&&path!=='/api/auth/me'&&env.STEM_LIMITER){
  const l=await env.STEM_LIMITER.limit({key:'auth:'+(request.headers.get('CF-Connecting-IP')||'unknown')});
  if(!l.success)return json({error:'Too many tries. Wait a minute.'},429);
 }
 try{
  if(path==='/api/auth/me'){const u=await gebruiker(request,env);return u?json(await ik(env,u)):json({user:null},401);}
  if(path==='/api/auth/logout')return await logout(request,env);
  if(path==='/api/auth/login/options')return await loginOptions(request,env);
  const body=m==='POST'?await leesBody(request,path==='/api/sync'?MAX_SYNC_BODY:32768):{};
  if(path==='/api/auth/register/options')return await registerOptions(request,env,body);
  if(path==='/api/auth/register/verify')return await registerVerify(request,env,body);
  if(path==='/api/auth/login/verify')return await loginVerify(request,env,body);
  const user=await gebruiker(request,env);
  if(!user)return json({error:'Sign in first.'},401,{'Set-Cookie':wisCookie});
  if(path==='/api/sync')return await sync(request,env,user,body);
  if(path==='/api/account')return await wisAccount(env,user);
 }catch(e){
  if(e?.fout==='groot')return json({error:'Request too large.'},413);
  if(e?.fout||e instanceof SyntaxError||e?.name==='InvalidCharacterError')return json({error:auth?'Face ID check failed. Try again.':'Invalid request.'},auth?401:400);
  return json({error:'Something went wrong on the server.'},500);
 }
 return json({error:'Not found.'},404);
}
