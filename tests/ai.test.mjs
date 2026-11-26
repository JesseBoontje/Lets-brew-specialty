// Stap 3: beheer (/api/admin/*) en Lets Brew AI (/api/ai). Nep-D1 op node:sqlite,
// en een nep-fetch in plaats van Anthropic: zo zien we precies wat de Worker doorstuurt.
import test from 'node:test';
import assert from 'node:assert/strict';
import {aiRoute,aiLijf,AI_MODEL_STANDAARD} from '../ai-worker.mjs';
import {accountRoute,aiDag} from '../account-worker.mjs';
import {socialRoute} from '../social-worker.mjs';
import site from '../site-worker.mjs';
import {nepD1} from './nep-d1.mjs';

const ORIGIN='https://letsbrew.djez.app',SLEUTEL='sk-ant-test-GEHEIM-0123456789abcdef';
const hex=async t=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,'0')).join('');
let teller=0;
async function gebruiker(env,handle,{admin=0,ai=0,locked=0}={}){
 const id=(handle+'_'.repeat(22)).slice(0,22);
 const token=(String(++teller)+'t'.repeat(43)).slice(0,43);
 env.DB.db.prepare('INSERT INTO users(id,handle,name,visibility,ai_allowed,is_admin,locked,created_at) VALUES(?,?,?,?,?,?,?,?)').run(id,handle,handle,'private',ai,admin,locked,Date.now()+teller);
 env.DB.db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(await hex(token),id,Date.now()+864e5);
 return {id,handle,cookie:'lb_s='+token};
}
function rq(wie,method,path,body,headers={}){
 const h={Origin:ORIGIN,...headers};if(wie)h.Cookie=wie.cookie;
 if(body!==undefined&&!h['Content-Type'])h['Content-Type']='application/json';
 return new Request(ORIGIN+path,{method,headers:h,body:body===undefined?undefined:(typeof body==='string'?body:JSON.stringify(body))});
}
async function vraag(env,wie,method,path,body,headers){
 const r=await aiRoute(rq(wie,method,path,body,headers),env);
 const tekst=await r.text();let data=null;try{data=JSON.parse(tekst);}catch{}
 return {status:r.status,data,tekst,left:r.headers.get('X-AI-Left'),type:r.headers.get('Content-Type')};
}
/* nep-Anthropic: onthoudt wat er binnenkwam en geeft een vast antwoord */
function nepAnthropic(antwoord={status:200}){
 const calls=[];const oud=globalThis.fetch;
 globalThis.fetch=async(url,init)=>{
  calls.push({url:String(url),init,body:JSON.parse(init.body)});
  if(antwoord.gooi)throw Error('netwerk');
  if(JSON.parse(init.body).stream){
   const sse='event: message_start\ndata: {"type":"message_start","message":{"usage":{"input_tokens":10}}}\n\n'+
    'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Grind finer."}}\n\n'+
    'event: message_stop\ndata: {"type":"message_stop"}\n\n';
   return new Response(sse,{status:200,headers:{'Content-Type':'text/event-stream'}});
  }
  if(antwoord.status!==200)return new Response(JSON.stringify({error:{message:'upstream says '+SLEUTEL}}),{status:antwoord.status,headers:{'Content-Type':'application/json'}});
  return new Response(JSON.stringify({content:[{type:'text',text:'Grind finer.'}],usage:{input_tokens:10,output_tokens:4}}),{status:200,headers:{'Content-Type':'application/json'}});
 };
 return {calls,herstel:()=>{globalThis.fetch=oud;}};
}
const omgeving=(extra={})=>({DB:nepD1(),ANTHROPIC_API_KEY:SLEUTEL,...extra});
const VRAAG={model:'claude-sonnet-4-6',max_tokens:500,messages:[{role:'user',content:'Mijn shot loopt te snel'}]};

test('beheer: alleen voor admin (niet-admin 403, zonder sessie 401), Origin en JSON verplicht',async()=>{
 const env=omgeving();
 const baas=await gebruiker(env,'jesse',{admin:1}),sanne=await gebruiker(env,'sanne');
 for(const [m,p,b] of [['GET','/api/admin/users'],['POST','/api/admin/user',{handle:'sanne',ai_allowed:true}],['GET','/api/admin/reports'],['POST','/api/admin/reports',{id:'x',action:'dismiss'}]]){
  assert.equal((await vraag(env,sanne,m,p,b)).status,403,m+' '+p);
  assert.equal((await vraag(env,null,m,p,b)).status,401,m+' '+p);
 }
 assert.equal(env.DB.db.prepare("SELECT ai_allowed FROM users WHERE handle='sanne'").get().ai_allowed,0,'niet-admin veranderde niets');
 assert.equal((await vraag(env,baas,'POST','/api/admin/user',{handle:'sanne',ai_allowed:true},{Origin:'https://evil.example'})).status,403);
 assert.equal((await vraag(env,baas,'POST','/api/admin/user','handle=sanne',{'Content-Type':'text/plain'})).status,415);
 assert.equal((await vraag(env,baas,'DELETE','/api/admin/users')).status,405);
 assert.equal((await vraag(env,baas,'GET','/api/admin/iets')).status,404);
 // via de site-worker komt het ook hier
 assert.equal((await site.fetch(rq(sanne,'GET','/api/admin/users'),env)).status,403);
});

test('beheer: lijst met AI-vragen van vandaag, AI aan/uit, totaal',async()=>{
 const env=omgeving();
 const baas=await gebruiker(env,'jesse',{admin:1,ai:1});await gebruiker(env,'sanne');await gebruiker(env,'coffeefan_22',{ai:1});
 env.DB.db.prepare('INSERT INTO ai_usage(user_id,day,count) VALUES(?,?,?)').run(baas.id,aiDag(),7);
 env.DB.db.prepare('INSERT INTO ai_usage(user_id,day,count) VALUES(?,?,?)').run(baas.id,'2020-01-01',40);
 let r=await vraag(env,baas,'GET','/api/admin/users');
 assert.equal(r.status,200);
 assert.deepEqual(r.data.users.map(u=>[u.handle,u.ai_allowed,u.ai_today]),[['jesse',true,7],['sanne',false,0],['coffeefan_22',true,0]]);
 assert.equal(r.data.total_today,7);assert.equal(r.data.limit,50);
 assert.ok(r.data.users.every(u=>typeof u.created==='number'&&'name' in u&&u.id===undefined),'geen interne id naar buiten');
 r=await vraag(env,baas,'POST','/api/admin/user',{handle:'sanne',ai_allowed:true});
 assert.equal(r.status,200);assert.deepEqual(r.data.user,{handle:'sanne',ai_allowed:true,locked:false});
 assert.equal(env.DB.db.prepare("SELECT ai_allowed FROM users WHERE handle='sanne'").get().ai_allowed,1);
 assert.equal((await vraag(env,baas,'POST','/api/admin/user',{handle:'niemand',ai_allowed:true})).status,404);
 assert.equal((await vraag(env,baas,'POST','/api/admin/user',{handle:'sanne'})).status,400);
 assert.equal((await vraag(env,baas,'POST','/api/admin/user',{handle:'jesse',locked:true})).status,400,'jezelf op slot: nee');
});

test('beheer: meldingen, dismiss wist, block zet het account op slot (niet meer inloggen, syncen, volgen)',async()=>{
 const env=omgeving();
 const baas=await gebruiker(env,'jesse',{admin:1}),sanne=await gebruiker(env,'sanne'),troll=await gebruiker(env,'troll',{ai:1});
 // twee meldingen via de echte route
 for(const reason of ['spam','rude']){
  const r=await socialRoute(rq(sanne,'POST','/api/social/report',{handle:'troll',reason}),env);assert.equal(r.status,200);
 }
 let r=await vraag(env,baas,'GET','/api/admin/reports');
 assert.equal(r.status,200);assert.equal(r.data.reports.length,2);
 assert.deepEqual(r.data.reports.map(x=>[x.by,x.about]).sort(),[['sanne','troll'],['sanne','troll']]);
 const [een,twee]=r.data.reports;
 assert.equal((await vraag(env,baas,'POST','/api/admin/reports',{id:een.id,action:'dismiss'})).status,200);
 assert.equal((await vraag(env,baas,'GET','/api/admin/reports')).data.reports.length,1);
 assert.equal((await vraag(env,baas,'POST','/api/admin/reports',{id:een.id,action:'dismiss'})).status,404);
 assert.equal((await vraag(env,baas,'POST','/api/admin/reports',{id:twee.id,action:'nuke'})).status,400);
 r=await vraag(env,baas,'POST','/api/admin/reports',{id:twee.id,action:'block'});
 assert.equal(r.status,200);assert.equal(r.data.locked,true);
 assert.equal(env.DB.db.prepare("SELECT locked FROM users WHERE handle='troll'").get().locked,1);
 assert.equal(env.DB.db.prepare('SELECT COUNT(*) n FROM sessions WHERE user_id=?').get(troll.id).n,0,'sessies weg');
 assert.equal((await vraag(env,baas,'GET','/api/admin/reports')).data.reports.length,0);
 // ook met een (nog) geldige sessie telt een gelockt account niet: zet er een terug
 env.DB.db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(await hex(troll.cookie.slice(5)),troll.id,Date.now()+864e5);
 assert.equal((await accountRoute(rq(troll,'GET','/api/auth/me'),env)).status,401);
 assert.equal((await accountRoute(rq(troll,'POST','/api/sync',{since:0,changes:[]}),env)).status,401);
 assert.equal((await socialRoute(rq(troll,'GET','/api/social/me'),env)).status,401);
 assert.equal((await vraag(env,troll,'POST','/api/ai',VRAAG)).status,401);
 // de lijst toont het slot, en de admin kan het eraf halen
 r=await vraag(env,baas,'GET','/api/admin/users');
 assert.equal(r.data.users.find(u=>u.handle==='troll').locked,true);
 r=await vraag(env,baas,'POST','/api/admin/user',{handle:'troll',locked:false});
 assert.deepEqual(r.data.user,{handle:'troll',ai_allowed:true,locked:false});
 assert.equal((await accountRoute(rq(troll,'GET','/api/auth/me'),env)).status,200);
});

test('auth/me vertelt admin, ai en het aantal vragen van vandaag',async()=>{
 const env=omgeving();
 const baas=await gebruiker(env,'jesse',{admin:1,ai:1}),sanne=await gebruiker(env,'sanne');
 env.DB.db.prepare('INSERT INTO ai_usage(user_id,day,count) VALUES(?,?,?)').run(baas.id,aiDag(),12);
 let r=await accountRoute(rq(baas,'GET','/api/auth/me'),env);
 assert.deepEqual(await r.json(),{user:{handle:'jesse',visibility:'private',admin:true,ai:true},ai:{used:12,limit:50}});
 r=await accountRoute(rq(sanne,'GET','/api/auth/me'),env);
 assert.deepEqual(await r.json(),{user:{handle:'sanne',visibility:'private',admin:false,ai:false}});
});

test('ai: alleen ingelogd en ai_allowed; zonder sleutel een nette 503; Origin/JSON/methode',async()=>{
 const nep=nepAnthropic();
 try{
  const env=omgeving();
  const sanne=await gebruiker(env,'sanne'),jesse=await gebruiker(env,'jesse',{ai:1});
  assert.equal((await vraag(env,null,'POST','/api/ai',VRAAG)).status,401);
  const r=await vraag(env,sanne,'POST','/api/ai',VRAAG);
  assert.equal(r.status,403);assert.equal(r.data.code,'not_allowed');
  assert.equal((await vraag(env,jesse,'POST','/api/ai',VRAAG,{Origin:'https://evil.example'})).status,403);
  assert.equal((await vraag(env,jesse,'POST','/api/ai','{}',{'Content-Type':'text/plain'})).status,415);
  assert.equal((await vraag(env,jesse,'GET','/api/ai')).status,405);
  assert.equal(nep.calls.length,0,'niets doorgestuurd');
  const zonder={...env,ANTHROPIC_API_KEY:undefined};
  const z=await vraag(zonder,jesse,'POST','/api/ai',VRAAG);
  assert.equal(z.status,503);assert.equal(z.data.error,'AI is not set up yet.');
  assert.equal(nep.calls.length,0);
  assert.equal(env.DB.db.prepare('SELECT COUNT(*) n FROM ai_usage').get().n,0,'niet geteld zonder sleutel');
 }finally{nep.herstel();}
});

test('ai: model en max_tokens geforceerd, alleen bekende velden, sleutel nooit in het antwoord',async()=>{
 const nep=nepAnthropic();
 try{
  const env=omgeving();const jesse=await gebruiker(env,'jesse',{ai:1});
  const r=await vraag(env,jesse,'POST','/api/ai',{model:'duur-model-x',max_tokens:999999,messages:[{role:'user',content:[{type:'text',text:'hoi',cache_control:{type:'ephemeral'}},{type:'image',source:{type:'base64',media_type:'image/jpeg',data:'AAAA'}}]}],
   system:'Je bent een barista.',stream:false,tools:[{name:'x'}],metadata:{user_id:'x'},temperature:2});
  assert.equal(r.status,200);assert.equal(r.data.content[0].text,'Grind finer.');assert.equal(r.left,'49');
  assert.equal(nep.calls.length,1);
  const c=nep.calls[0];
  assert.equal(c.url,'https://api.anthropic.com/v1/messages');
  assert.equal(c.init.headers['x-api-key'],SLEUTEL);assert.equal(c.init.redirect,'error');
  assert.deepEqual(Object.keys(c.body).sort(),['max_tokens','messages','model','system']);
  assert.equal(c.body.model,AI_MODEL_STANDAARD);assert.equal(c.body.max_tokens,4000);
  assert.deepEqual(c.body.messages[0].content[0],{type:'text',text:'hoi'},'onbekende velden binnen een blok ook weg');
  assert.ok(!r.tekst.includes(SLEUTEL),'sleutel niet in het antwoord');
  // een upstream-fout geeft geen tekst van de aanbieder door (en zeker de sleutel niet), en telt niet
  const nep2=nepAnthropic({status:401});
  try{
   const f=await vraag(env,jesse,'POST','/api/ai',VRAAG);
   assert.equal(f.status,502);assert.ok(!f.tekst.includes(SLEUTEL));assert.ok(!f.tekst.includes('upstream says'));assert.equal(f.left,'49');
  }finally{nep2.herstel();}
  assert.equal(env.DB.db.prepare('SELECT count FROM ai_usage').get().count,1,'mislukte vraag telt niet');
  // een toegestaan ander model uit env.AI_MODEL mag wel
  const env2={...env,AI_MODEL:AI_MODEL_STANDAARD+',ander-model-1'};
  await vraag(env2,jesse,'POST','/api/ai',{...VRAAG,model:'ander-model-1',max_tokens:300});
  assert.equal(nep.calls.at(-1).body.model,'ander-model-1');assert.equal(nep.calls.at(-1).body.max_tokens,300);
  // ongeldige vorm: 400, niets doorgestuurd, niet geteld
  const n0=nep.calls.length;
  for(const b of [{messages:[]},{messages:'hoi'},{messages:[{role:'system',content:'x'}]},{messages:[{role:'user',content:[{type:'document'}]}]}])
   assert.equal((await vraag(env,jesse,'POST','/api/ai',b)).status,400,JSON.stringify(b));
  assert.equal(nep.calls.length,n0);
  assert.deepEqual(aiLijf({messages:[{role:'user',content:'x'}]},{}),{model:AI_MODEL_STANDAARD,max_tokens:1000,messages:[{role:'user',content:'x'}]});
 }finally{nep.herstel();}
});

test('ai: daglimiet 50, de 51e is 429, X-AI-Left telt af, ook bij gelijktijdige vragen',async()=>{
 const nep=nepAnthropic();
 try{
  const env=omgeving();const jesse=await gebruiker(env,'jesse',{ai:1}),sanne=await gebruiker(env,'sanne',{ai:1});
  const lefts=[];
  for(let i=0;i<45;i++){const r=await vraag(env,jesse,'POST','/api/ai',VRAAG);assert.equal(r.status,200);lefts.push(+r.left);}
  assert.deepEqual(lefts.slice(0,3),[49,48,47]);assert.equal(lefts.at(-1),5);
  // tien tegelijk: precies vijf komen erdoor
  const tegelijk=await Promise.all(Array.from({length:10},()=>vraag(env,jesse,'POST','/api/ai',VRAAG)));
  assert.equal(tegelijk.filter(r=>r.status===200).length,5);
  const r=await vraag(env,jesse,'POST','/api/ai',VRAAG);
  assert.equal(r.status,429);assert.equal(r.data.error,'Daily limit reached (50). Resets at midnight.');assert.equal(r.left,'0');
  assert.equal(nep.calls.length,50);
  assert.equal(env.DB.db.prepare('SELECT count FROM ai_usage WHERE user_id=?').get(jesse.id).count,50);
  // een ander heeft zijn eigen teller
  assert.equal((await vraag(env,sanne,'POST','/api/ai',VRAAG)).status,200);
  // de dag is de Amsterdamse datum
  assert.equal(aiDag(Date.UTC(2026,10,26,23,30)),'2026-11-27');assert.equal(aiDag(Date.UTC(2026,6,1,21,59)),'2026-07-01');assert.equal(aiDag(Date.UTC(2026,6,1,22,1)),'2026-07-02');
  // me geeft het aantal ook
  const me=await (await accountRoute(rq(jesse,'GET','/api/auth/me'),env)).json();
  assert.deepEqual(me.ai,{used:50,limit:50});
 }finally{nep.herstel();}
});

test('ai: stream wordt als SSE doorgegeven; rate limit met eigen sleutel; 6 MB-grens',async()=>{
 const nep=nepAnthropic();
 try{
  const sleutels=[];
  const env=omgeving({STEM_LIMITER:{limit:async({key})=>{sleutels.push(key);return {success:sleutels.length<3};}}});
  const jesse=await gebruiker(env,'jesse',{ai:1});
  const r=await vraag(env,jesse,'POST','/api/ai',{...VRAAG,stream:true});
  assert.equal(r.status,200);assert.match(r.type,/^text\/event-stream/);assert.match(r.tekst,/Grind finer\./);assert.equal(r.left,'49');
  assert.equal(nep.calls[0].body.stream,true);
  assert.deepEqual(sleutels,['ai:'+jesse.id]);
  const groot=JSON.stringify({...VRAAG,messages:[{role:'user',content:'x'.repeat(6*1024*1024)}]});
  assert.equal((await vraag(env,jesse,'POST','/api/ai',groot)).status,413);
  assert.equal((await vraag(env,jesse,'POST','/api/ai',VRAAG)).status,429,'derde keer: rate limit');
  // netwerkfout naar de aanbieder: 502, telt niet
  const nep2=nepAnthropic({gooi:true});
  try{
   const env2=omgeving();const j2=await gebruiker(env2,'jesse',{ai:1});
   assert.equal((await vraag(env2,j2,'POST','/api/ai',VRAAG)).status,502);
   assert.equal(env2.DB.db.prepare('SELECT count FROM ai_usage').get().count,0);
  }finally{nep2.herstel();}
 }finally{nep.herstel();}
});

