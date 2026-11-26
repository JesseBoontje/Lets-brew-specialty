// Worker-routes voor account en sync, met een nep-D1 op node:sqlite en echte
// WebAuthn-handtekeningen van een sleutel die de test zelf maakt.
import test from 'node:test';
import assert from 'node:assert/strict';
import {accountRoute,cbor,b64u} from '../account-worker.mjs';
import site from '../site-worker.mjs';
import {nepD1} from './nep-d1.mjs';

const ORIGIN='https://letsbrew.djez.app',RP='letsbrew.djez.app';

const omgeving=()=>({DB:nepD1()});
const tel=(env,tabel)=>env.DB.db.prepare('SELECT COUNT(*) n FROM '+tabel).get().n;

/* ---- kleine CBOR-schrijver voor de nep-authenticator ---- */
const kop=(major,n)=>n<24?[major<<5|n]:n<256?[major<<5|24,n]:n<65536?[major<<5|25,n>>8,n&255]:[major<<5|26,(n>>>24)&255,(n>>16)&255,(n>>8)&255,n&255];
function cborEnc(v){
 if(typeof v==='number')return Uint8Array.from(v>=0?kop(0,v):kop(1,-1-v));
 if(typeof v==='string'){const b=new TextEncoder().encode(v);return cat(Uint8Array.from(kop(3,b.length)),b);}
 if(v instanceof Uint8Array)return cat(Uint8Array.from(kop(2,v.length)),v);
 if(v instanceof Map){const delen=[Uint8Array.from(kop(5,v.size))];for(const[k,x]of v)delen.push(cborEnc(k),cborEnc(x));return cat(...delen);}
 throw Error('cbor-enc');
}
const cat=(...p)=>{const o=new Uint8Array(p.reduce((n,x)=>n+x.length,0));let i=0;for(const x of p){o.set(x,i);i+=x.length;}return o;};
const sha=async x=>new Uint8Array(await crypto.subtle.digest('SHA-256',typeof x==='string'?new TextEncoder().encode(x):x));
function rawNaarDer(raw){
 const int=b=>{let i=0;while(i<b.length-1&&b[i]===0)i++;b=b.slice(i);if(b[0]&0x80)b=cat(Uint8Array.of(0),b);return cat(Uint8Array.of(2,b.length),b);};
 const body=cat(int(raw.slice(0,32)),int(raw.slice(32)));return cat(Uint8Array.of(0x30,body.length),body);
}

async function maakSleutel(alg=-7){
 const credId=crypto.getRandomValues(new Uint8Array(32));
 if(alg===-7){
  const kp=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
  const jwk=await crypto.subtle.exportKey('jwk',kp.publicKey);
  const cose=cborEnc(new Map([[1,2],[3,-7],[-1,1],[-2,b64u.dec(jwk.x)],[-3,b64u.dec(jwk.y)]]));
  return {alg,credId,cose,teken:async d=>rawNaarDer(new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},kp.privateKey,d)))};
 }
 if(alg===-257){
  const kp=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:Uint8Array.of(1,0,1),hash:'SHA-256'},true,['sign','verify']);
  const jwk=await crypto.subtle.exportKey('jwk',kp.publicKey);
  const cose=cborEnc(new Map([[1,3],[3,-257],[-1,b64u.dec(jwk.n)],[-2,b64u.dec(jwk.e)]]));
  return {alg,credId,cose,teken:async d=>new Uint8Array(await crypto.subtle.sign({name:'RSASSA-PKCS1-v1_5'},kp.privateKey,d))};
 }
 // EdDSA: mag niet
 return {alg,credId,cose:cborEnc(new Map([[1,1],[3,-8],[-1,6],[-2,new Uint8Array(32)]])),teken:async()=>new Uint8Array(64)};
}

function vraag(path,{method='POST',body,cookie,origin=ORIGIN,type='application/json',ip='1.2.3.4'}={}){
 const headers={'CF-Connecting-IP':ip};
 if(origin)headers.Origin=origin;if(type&&method!=='GET')headers['Content-Type']=type;if(cookie)headers.Cookie=cookie;
 return new Request(ORIGIN+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
}
const lees=async r=>({status:r.status,body:await r.json(),cookie:r.headers.get('Set-Cookie')});
const koekje=setCookie=>setCookie.split(';')[0];

async function registreer(env,handle='jesse',sleutel,opties={}){
 sleutel=sleutel||await maakSleutel();
 const o=await lees(await accountRoute(vraag('/api/auth/register/options',{body:{handle}}),env));
 assert.equal(o.status,200,JSON.stringify(o.body));
 const cd=new TextEncoder().encode(JSON.stringify({type:'webauthn.create',challenge:o.body.publicKey.challenge,origin:opties.origin||ORIGIN,crossOrigin:false}));
 const flags=opties.flags??0x45,len=Uint8Array.of(sleutel.credId.length>>8,sleutel.credId.length&255);
 const authData=cat(await sha(opties.rp||RP),Uint8Array.of(flags,0,0,0,0),new Uint8Array(16),len,sleutel.credId,sleutel.cose);
 const att=cborEnc(new Map([['fmt','none'],['attStmt',new Map()],['authData',authData]]));
 const body={credential:{id:b64u.enc(sleutel.credId),rawId:b64u.enc(sleutel.credId),type:'public-key',response:{clientDataJSON:b64u.enc(cd),attestationObject:b64u.enc(att)}}};
 const r=await lees(await accountRoute(vraag('/api/auth/register/verify',{body}),env));
 return {...r,sleutel,verzoek:body,opties:o.body};
}
async function login(env,sleutel,{teller=0,flags=0x05,knoei=false}={}){
 const o=await lees(await accountRoute(vraag('/api/auth/login/options',{body:{}}),env));
 assert.equal(o.status,200);
 const cd=new TextEncoder().encode(JSON.stringify({type:'webauthn.get',challenge:o.body.publicKey.challenge,origin:ORIGIN}));
 const ad=cat(await sha(RP),Uint8Array.of(flags,(teller>>>24)&255,(teller>>16)&255,(teller>>8)&255,teller&255));
 const sig=await sleutel.teken(cat(ad,await sha(cd)));if(knoei)sig[sig.length-5]^=1;
 const body={credential:{id:b64u.enc(sleutel.credId),rawId:b64u.enc(sleutel.credId),type:'public-key',response:{clientDataJSON:b64u.enc(cd),authenticatorData:b64u.enc(ad),signature:b64u.enc(sig),userHandle:null}}};
 return lees(await accountRoute(vraag('/api/auth/login/verify',{body}),env));
}
const sync=async(env,cookie,body)=>lees(await accountRoute(vraag('/api/sync',{body,cookie}),env));

test('cbor-lezer leest kaarten, tekst en bytes',()=>{
 const m=cbor(cborEnc(new Map([['a',1],[-2,Uint8Array.of(1,2)],[3,-7]]))).value;
 assert.equal(m.get('a'),1);assert.deepEqual([...m.get(-2)],[1,2]);assert.equal(m.get(3),-7);
});

test('register options: naamregel, uniek, alleen ES256 en RS256, attestation none, UV verplicht',async()=>{
 const env=omgeving();
 for(const h of ['ab','Jesse!','a'.repeat(21),'met spatie'])assert.equal((await accountRoute(vraag('/api/auth/register/options',{body:{handle:h}}),env)).status,400,h);
 const o=await lees(await accountRoute(vraag('/api/auth/register/options',{body:{handle:'jesse_b'}}),env));
 assert.equal(o.status,200);
 const pk=o.body.publicKey;
 assert.equal(pk.rp.id,RP);assert.equal(pk.attestation,'none');assert.equal(pk.authenticatorSelection.userVerification,'required');
 assert.deepEqual(pk.pubKeyCredParams.map(x=>x.alg),[-7,-257]);
 assert.match(pk.challenge,/^[A-Za-z0-9_-]{43}$/);
 assert.equal(tel(env,'challenges'),1);
});

test('registreren met ES256 geeft sessiecookie; me kent de gebruiker; privé als standaard',async()=>{
 const env=omgeving();
 const r=await registreer(env,'jesse');
 assert.equal(r.status,200,JSON.stringify(r.body));
 assert.deepEqual(r.body.user,{handle:'jesse',visibility:'private'});
 assert.match(r.cookie,/^lb_s=[A-Za-z0-9_-]{43}; HttpOnly; Secure; SameSite=Strict; Path=\/api\/; Max-Age=7776000$/);
 const token=koekje(r.cookie).slice(5);
 const opgeslagen=env.DB.db.prepare('SELECT token_hash FROM sessions').get().token_hash;
 assert.notEqual(opgeslagen,token);assert.match(opgeslagen,/^[0-9a-f]{64}$/);
 const me=await lees(await accountRoute(vraag('/api/auth/me',{method:'GET',cookie:koekje(r.cookie),origin:null}),env));
 assert.equal(me.status,200);assert.equal(me.body.user.handle,'jesse');
 assert.equal(tel(env,'challenges'),0,'challenge is opgebruikt');
 // dezelfde naam nog eens: bezet
 assert.equal((await accountRoute(vraag('/api/auth/register/options',{body:{handle:'jesse'}}),env)).status,409);
});

test('challenge is eenmalig en 5 minuten geldig',async()=>{
 const env=omgeving();
 const r=await registreer(env,'eerste');
 assert.equal(r.status,200);
 const nogmaals=await accountRoute(vraag('/api/auth/register/verify',{body:r.verzoek}),env);
 assert.equal(nogmaals.status,401,'zelfde antwoord twee keer');
 // verlopen challenge
 const o=await lees(await accountRoute(vraag('/api/auth/login/options',{body:{}}),env));
 env.DB.db.prepare('UPDATE challenges SET expires_at=? WHERE challenge=?').run(Date.now()-1,o.body.publicKey.challenge);
 const s=r.sleutel,cd=new TextEncoder().encode(JSON.stringify({type:'webauthn.get',challenge:o.body.publicKey.challenge,origin:ORIGIN}));
 const ad=cat(await sha(RP),Uint8Array.of(5,0,0,0,0));
 const body={credential:{id:b64u.enc(s.credId),type:'public-key',response:{clientDataJSON:b64u.enc(cd),authenticatorData:b64u.enc(ad),signature:b64u.enc(await s.teken(cat(ad,await sha(cd))))}}};
 assert.equal((await accountRoute(vraag('/api/auth/login/verify',{body}),env)).status,401);
});

test('registreren weigert verkeerde origin, verkeerde rpID, geen UV en EdDSA',async()=>{
 const env=omgeving();
 assert.equal((await registreer(env,'oorsprong',null,{origin:'https://evil.example'})).status,401);
 assert.equal((await registreer(env,'rpfout',null,{rp:'evil.example'})).status,401);
 assert.equal((await registreer(env,'zonderuv',null,{flags:0x41})).status,401);
 assert.equal((await registreer(env,'eddsa',await maakSleutel(-8))).status,401);
 assert.equal(tel(env,'users'),0);
});

test('POST zonder eigen Origin of zonder JSON wordt geweigerd; verkeerde methode 405',async()=>{
 const env=omgeving();
 assert.equal((await accountRoute(vraag('/api/auth/register/options',{body:{handle:'abc'},origin:'https://evil.example'}),env)).status,403);
 assert.equal((await accountRoute(vraag('/api/auth/register/options',{body:{handle:'abc'},origin:null}),env)).status,403);
 assert.equal((await accountRoute(vraag('/api/auth/register/options',{body:{handle:'abc'},type:'text/plain'}),env)).status,415);
 assert.equal((await accountRoute(vraag('/api/sync',{method:'GET'}),env)).status,405);
 assert.equal((await accountRoute(vraag('/api/account',{method:'DELETE',origin:'https://evil.example'}),env)).status,403);
});

test('inloggen met ES256: geldige handtekening werkt, geknoeide niet, teller moet oplopen',async()=>{
 const env=omgeving();
 const r=await registreer(env,'login_es');
 const ok=await login(env,r.sleutel,{teller:0});
 assert.equal(ok.status,200,JSON.stringify(ok.body));assert.equal(ok.body.user.handle,'login_es');assert.match(ok.cookie,/^lb_s=/);
 assert.equal((await login(env,r.sleutel,{knoei:true})).status,401);
 assert.equal((await login(env,r.sleutel,{flags:0x01})).status,401,'zonder UV');
 assert.equal((await login(env,r.sleutel,{teller:5})).status,200);
 assert.equal((await login(env,r.sleutel,{teller:5})).status,401,'teller liep niet op');
 const onbekend=await login(env,await maakSleutel());
 assert.equal(onbekend.status,401);
});

test('inloggen met RS256',async()=>{
 const env=omgeving();
 const r=await registreer(env,'login_rs',await maakSleutel(-257));
 assert.equal(r.status,200,JSON.stringify(r.body));
 assert.equal((await login(env,r.sleutel)).status,200);
});

test('uitloggen wist de sessie',async()=>{
 const env=omgeving();
 const c=koekje((await registreer(env,'uit')).cookie);
 const r=await lees(await accountRoute(vraag('/api/auth/logout',{body:{},cookie:c}),env));
 assert.equal(r.status,200);assert.match(r.cookie,/Max-Age=0/);
 assert.equal(tel(env,'sessions'),0);
 assert.equal((await accountRoute(vraag('/api/auth/me',{method:'GET',cookie:c}),env)).status,401);
});

test('sync: heen en terug, laatste updatedAt wint, wissen gaat mee, fotos eruit',async()=>{
 const env=omgeving();
 const r=await registreer(env,'sync');
 const c1=koekje(r.cookie),c2=koekje((await login(env,r.sleutel)).cookie);
 assert.equal((await sync(env,null,{since:0,changes:[]})).status,401);
 const eerst=await sync(env,c1,{since:0,changes:[
  {kind:'bean',id:'b1',updatedAt:1000,data:{id:'b1',name:'Guji',photo:'data:image/png;base64,AAAA',notes:'zoet'}},
  {kind:'brew',id:'w1',updatedAt:1000,data:{id:'w1',dose:18}},
  {kind:'dial',id:'b1--espresso',updatedAt:1000,data:{key:'b1|espresso',attempts:[{g:'4'}]}}]});
 assert.equal(eerst.status,200,JSON.stringify(eerst.body));
 // eigen schrijfwerk komt terug met dezelfde updatedAt; now is het hoogste volgnummer
 assert.equal(eerst.body.changes.length,3);assert.equal(eerst.body.now,3);
 const opgeslagen=JSON.parse(env.DB.db.prepare("SELECT data FROM records WHERE id='b1'").get().data);
 assert.equal(opgeslagen.photo,null,'data:-foto niet online');assert.equal(opgeslagen.notes,'zoet');
 // tweede toestel haalt alles op
 const twee=await sync(env,c2,{since:0});
 assert.equal(twee.body.changes.length,3);
 assert.ok(twee.body.now>0);
 // ouder record verliest; server stuurt de nieuwere terug
 const oud=await sync(env,c2,{since:twee.body.now,changes:[{kind:'bean',id:'b1',updatedAt:500,data:{id:'b1',name:'oud'}}]});
 assert.equal(oud.status,200);
 const terug=oud.body.changes.find(x=>x.id==='b1');
 assert.equal(terug.data.name,'Guji');assert.equal(terug.updatedAt,1000);
 // nieuwer record wint en komt bij het andere toestel aan; wissen ook
 await sync(env,c2,{since:oud.body.now,changes:[{kind:'bean',id:'b1',updatedAt:2000,data:{id:'b1',name:'Guji natural'}},{kind:'brew',id:'w1',updatedAt:2000,deleted:true}]});
 const bij1=await sync(env,c1,{since:eerst.body.now});
 const b1=bij1.body.changes.find(x=>x.id==='b1'),w1=bij1.body.changes.find(x=>x.id==='w1');
 assert.equal(b1.data.name,'Guji natural');assert.equal(w1.deleted,true);assert.equal(w1.data,undefined);
 // andere gebruiker ziet niets hiervan
 const ander=koekje((await registreer(env,'ander')).cookie);
 assert.deepEqual((await sync(env,ander,{since:0})).body.changes,[]);
});

test('sync: grenzen (soort, id, 64 KB, 500 per verzoek)',async()=>{
 const env=omgeving();
 const c=koekje((await registreer(env,'grens')).cookie);
 assert.equal((await sync(env,c,{changes:[{kind:'wishlist',id:'x',updatedAt:1,data:{}}]})).status,400);
 assert.equal((await sync(env,c,{changes:[{kind:'bean',id:'a|b',updatedAt:1,data:{}}]})).status,400);
 assert.equal((await sync(env,c,{changes:[{kind:'bean',id:'a',updatedAt:1.5,data:{}}]})).status,400);
 const groot=await sync(env,c,{changes:[{kind:'bean',id:'g',updatedAt:1,data:{notes:'x'.repeat(70000)}},{kind:'bean',id:'k',updatedAt:1,data:{notes:'kort'}}]});
 assert.equal(groot.status,200);assert.deepEqual(groot.body.rejected,[{kind:'bean',id:'g',reason:'too big'}]);
 assert.equal(tel(env,'records'),1);
 const veel=Array.from({length:501},(_,i)=>({kind:'brew',id:'w'+i,updatedAt:1,data:{i}}));
 assert.equal((await sync(env,c,{changes:veel})).status,413);
 assert.equal((await sync(env,c,{changes:veel.slice(0,500)})).status,200);
 // ophalen gaat in pagina's van 500
 const p1=await sync(env,c,{since:0});assert.equal(p1.body.changes.length,500);assert.equal(p1.body.more,true);
 const p2=await sync(env,c,{since:p1.body.now});assert.equal(p2.body.changes.length,1);assert.equal(p2.body.more,false);
});

test('sync-cursor: volgnummer per gebruiker, niets gemist bij gelijktijdige verzoeken of een achterlopende klok',async()=>{
 const env=omgeving();
 const r=await registreer(env,'cursor');
 const a=koekje(r.cookie),b=koekje((await login(env,r.sleutel)).cookie);
 const ander=koekje((await registreer(env,'cursor2')).cookie);
 const start=await sync(env,a,{since:0});assert.equal(start.body.now,0);
 // B schrijft met een klok die jaren achterloopt; A ziet het toch
 await sync(env,b,{since:0,changes:[{kind:'bean',id:'oud',updatedAt:5,data:{name:'oude klok'}}]});
 const na=await sync(env,a,{since:start.body.now});
 assert.deepEqual(na.body.changes.map(x=>x.id),['oud']);
 // gelijktijdig: A en B en een andere gebruiker tegelijk; daarna mist A niets van B
 const veel=p=>Array.from({length:20},(_,i)=>({kind:'brew',id:p+i,updatedAt:100+i,data:{i}}));
 const [ra,rb]=await Promise.all([sync(env,a,{since:na.body.now,changes:veel('a')}),sync(env,b,{since:na.body.now,changes:veel('b')}),sync(env,ander,{since:0,changes:veel('x')})]);
 assert.equal(ra.status,200);assert.equal(rb.status,200);
 const nummers=env.DB.db.prepare("SELECT synced_at FROM records r JOIN users u ON u.id=r.user_id WHERE u.handle='cursor' ORDER BY synced_at").all().map(x=>x.synced_at);
 assert.equal(new Set(nummers).size,nummers.length,'uniek');assert.equal(nummers.at(-1),41);
 const gezien=new Set([...ra.body.changes,...rb.body.changes].map(x=>x.id));
 const rest=await sync(env,a,{since:Math.min(ra.body.now,rb.body.now)});
 for(const x of rest.body.changes)gezien.add(x.id);
 for(const id of [...veel('a'),...veel('b')].map(x=>x.id))assert.ok(gezien.has(id),id);
 assert.ok(![...gezien].some(id=>id.startsWith('x')),'niets van een andere gebruiker');
 // now is het hoogste gelezen nummer; zonder nieuws blijft hij staan
 const leeg=await sync(env,a,{since:41});assert.equal(leeg.body.now,41);assert.deepEqual(leeg.body.changes,[]);
});

test('maximum aantal records per gebruiker',async()=>{
 const env=omgeving();
 const c=koekje((await registreer(env,'vol')).cookie);
 const uid=env.DB.db.prepare("SELECT id FROM users WHERE handle='vol'").get().id;
 const ins=env.DB.db.prepare("INSERT INTO records(user_id,kind,id,data,updated_at,synced_at) VALUES(?,'brew',?,'{}',1,?)");
 for(let i=0;i<4999;i++)ins.run(uid,'v'+i,i+1);
 const twee=await sync(env,c,{changes:[{kind:'bean',id:'n1',updatedAt:2,data:{}},{kind:'bean',id:'n2',updatedAt:2,data:{}}]});
 assert.equal(twee.status,413);assert.equal(twee.body.code,'full');
 assert.equal(tel(env,'records'),4999,'niets geschreven');
 // bestaande bijwerken en wissen mag altijd, één nieuwe past nog
 assert.equal((await sync(env,c,{changes:[{kind:'brew',id:'v1',updatedAt:3,data:{x:1}},{kind:'brew',id:'v2',updatedAt:3,deleted:true},{kind:'bean',id:'n1',updatedAt:2,data:{}}]})).status,200);
 assert.equal((await sync(env,c,{changes:[{kind:'bean',id:'n3',updatedAt:2,data:{}}]})).status,413);
});

test('account wissen haalt alles van die gebruiker weg, de rest blijft',async()=>{
 const env=omgeving();
 const r=await registreer(env,'weg'),c=koekje(r.cookie);
 const blijft=koekje((await registreer(env,'blijft')).cookie);
 await sync(env,c,{changes:[{kind:'bean',id:'b',updatedAt:1,data:{}}]});
 await sync(env,blijft,{changes:[{kind:'bean',id:'b',updatedAt:1,data:{}}]});
 const uid=env.DB.db.prepare("SELECT id FROM users WHERE handle='weg'").get().id;
 const ander=env.DB.db.prepare("SELECT id FROM users WHERE handle='blijft'").get().id;
 env.DB.db.prepare("INSERT INTO follows VALUES(?,?,'accepted',1)").run(uid,ander);
 env.DB.db.prepare('INSERT INTO likes VALUES(?,?,?,?,1)').run(ander,uid,'bean','b');
 env.DB.db.prepare('INSERT INTO blocks VALUES(?,?)').run(ander,uid);
 env.DB.db.prepare("INSERT INTO reports VALUES('r',?,?,'x',1)").run(uid,ander);
 env.DB.db.prepare("INSERT INTO ai_usage VALUES(?,'2026-11-26',3)").run(uid);
 const w=await lees(await accountRoute(vraag('/api/account',{method:'DELETE',cookie:c}),env));
 assert.equal(w.status,200);assert.match(w.cookie,/Max-Age=0/);
 for(const [t,k] of [['users','id'],['passkeys','user_id'],['sessions','user_id'],['records','user_id'],['ai_usage','user_id']])
  assert.equal(env.DB.db.prepare(`SELECT COUNT(*) n FROM ${t} WHERE ${k}=?`).get(uid).n,0,t);
 assert.equal(tel(env,'follows')+tel(env,'likes')+tel(env,'blocks')+tel(env,'reports'),0);
 assert.equal(tel(env,'users'),1);assert.equal(tel(env,'records'),1);
 assert.equal((await accountRoute(vraag('/api/auth/me',{method:'GET',cookie:c}),env)).status,401);
});

test('auth-routes gebruiken de STEM_LIMITER; site-worker stuurt door; zonder DB 503',async()=>{
 const env={...omgeving(),STEM_LIMITER:{limit:async({key})=>({success:!key.startsWith('auth:9.9.9.9')})}};
 assert.equal((await accountRoute(vraag('/api/auth/login/options',{body:{},ip:'9.9.9.9'}),env)).status,429);
 assert.equal((await accountRoute(vraag('/api/auth/login/options',{body:{}}),env)).status,200);
 assert.equal((await site.fetch(vraag('/api/auth/me',{method:'GET'}),env)).status,401);
 assert.equal((await site.fetch(vraag('/api/sync',{body:{}}),env)).status,401);
 assert.equal((await site.fetch(vraag('/api/auth/me',{method:'GET'}),{})).status,503);
 assert.equal((await site.fetch(vraag('/api/auth/nope',{method:'GET'}),env)).status,404);
});
