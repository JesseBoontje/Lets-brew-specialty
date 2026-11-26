// Lets Brew voice: /api/stem/ met de sleutel van de server voor ingelogde accounts met ai_allowed.
// Nep-D1 op node:sqlite en een nep-fetch in plaats van ElevenLabs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {stemRoute,STEM_LIMIET,stemDag} from '../site-worker.mjs';
import {nepD1} from './nep-d1.mjs';
const origin='https://letsbrew.djez.app';
const KEY='sk_'+'a1'.repeat(24),SERVER_KEY='sk_'+'b2'.repeat(24);
const VOICE='AbCdEfGhIj0123456789';
const met=async(nep,fn)=>{const o=globalThis.fetch;globalThis.fetch=nep;try{return await fn();}finally{globalThis.fetch=o;}};
const hex=async t=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,'0')).join('');
let nr=0;
async function account(env,handle,{ai=1,locked=0}={}){
 const id=(handle+'_'.repeat(22)).slice(0,22),token=(String(++nr)+'s'.repeat(43)).slice(0,43);
 env.DB.db.prepare('INSERT INTO users(id,handle,name,visibility,ai_allowed,is_admin,locked,created_at) VALUES(?,?,?,?,?,?,?,?)').run(id,handle,handle,'private',ai,0,locked,Date.now()+nr);
 env.DB.db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(await hex(token),id,Date.now()+864e5);
 return {id,cookie:'lb_s='+token};
}
const lbReq=(pad,body,wie,extra={})=>new Request(origin+pad,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(wie?{Cookie:wie.cookie}:{}),...extra},body:JSON.stringify(body)});
const calls=[];
const geluid=async(url,opt)=>{calls.push({url,opt});return new Response(new Uint8Array([1,2,3]),{headers:{'Content-Type':'audio/mpeg'}});};
const telling=(env,id)=>env.DB.db.prepare('SELECT count FROM ai_usage WHERE user_id=? AND day=?').get(id,stemDag())?.count||0;

test('Lets Brew voice: alleen ingelogd, niet op slot en met ai_allowed; zonder server-sleutel 503',async()=>{
 const env={DB:nepD1(),ELEVENLABS_API_KEY:SERVER_KEY};
 const ok=await account(env,'anna'),nee=await account(env,'bram',{ai:0}),slot=await account(env,'cees',{locked:1});
 calls.length=0;
 await met(geluid,async()=>{
  assert.equal((await stemRoute(lbReq('/api/stem/zeg',{text:'Nu.',voice_id:VOICE}),env)).status,401);
  assert.equal((await stemRoute(lbReq('/api/stem/zeg',{text:'Nu.',voice_id:VOICE},nee),env)).status,403);
  assert.equal((await stemRoute(lbReq('/api/stem/zeg',{text:'Nu.',voice_id:VOICE},slot),env)).status,401);
  const r=await stemRoute(lbReq('/api/stem/zeg',{text:'Nu.',voice_id:VOICE},ok),{DB:env.DB});
  assert.equal(r.status,503);assert.equal((await r.json()).code,'not_set_up');
 });
 assert.equal(calls.length,0);
 assert.equal(telling(env,ok.id),0);
});
test('Lets Brew voice: server-sleutel naar ElevenLabs, telt per zin, standaardstem uit env',async()=>{
 const env={DB:nepD1(),ELEVENLABS_API_KEY:SERVER_KEY,ELEVENLABS_VOICE_ID:VOICE};
 const ok=await account(env,'anna');
 calls.length=0;
 const r=await met(geluid,()=>stemRoute(lbReq('/api/stem/zeg',{text:'Nu.'},ok),env));
 assert.equal(r.status,200);assert.equal(r.headers.get('X-Stem-Left'),String(STEM_LIMIET-1));
 assert.equal(calls[0].opt.headers['xi-api-key'],SERVER_KEY);
 assert.ok(calls[0].url.includes('/v1/text-to-speech/'+VOICE+'?'));
 assert.equal(telling(env,ok.id),1);
 // de AI-teller (dag zonder 'stem:') blijft los
 assert.equal(env.DB.db.prepare("SELECT COUNT(*) AS n FROM ai_usage WHERE day NOT LIKE 'stem:%'").get().n,0);
 const v=await met(async()=>Response.json({voices:[{voice_id:VOICE,name:'Huis'}]}),()=>stemRoute(lbReq('/api/stem/voices',{},ok),env));
 assert.deepEqual(await v.json(),{voices:[{voice_id:VOICE,name:'Huis',category:''}],server:true,standaard:VOICE});
 // zonder standaardstem moet er een gekozen stem mee
 assert.equal((await met(geluid,()=>stemRoute(lbReq('/api/stem/zeg',{text:'Nu.'},ok),{DB:env.DB,ELEVENLABS_API_KEY:SERVER_KEY}))).status,400);
});
test('Lets Brew voice: daglimiet atomair, een fout bij ElevenLabs telt niet, de sleutel lekt niet',async()=>{
 const env={DB:nepD1(),ELEVENLABS_API_KEY:SERVER_KEY};
 const ok=await account(env,'anna');
 env.DB.db.prepare('INSERT INTO ai_usage(user_id,day,count) VALUES(?,?,?)').run(ok.id,stemDag(),STEM_LIMIET-2);
 const rs=await met(geluid,()=>Promise.all([1,2,3,4].map(()=>stemRoute(lbReq('/api/stem/zeg',{text:'Nu.',voice_id:VOICE},ok),env))));
 assert.deepEqual(rs.map(r=>r.status).sort(),[200,200,429,429]);
 assert.equal(telling(env,ok.id),STEM_LIMIET);
 assert.equal((await rs.find(r=>r.status===429).json()).code,'limit');
 env.DB.db.prepare('UPDATE ai_usage SET count=5 WHERE user_id=? AND day=?').run(ok.id,stemDag());
 for(const st of [401,500]){
  const r=await met(async()=>Response.json({detail:'bad '+SERVER_KEY},{status:st}),()=>stemRoute(lbReq('/api/stem/zeg',{text:'Nu.',voice_id:VOICE},ok),env));
  assert.equal(r.status,502);assert.ok(!(await r.text()).includes(SERVER_KEY));
 }
 const weg=await met(async()=>{throw Error('netwerk '+SERVER_KEY);},()=>stemRoute(lbReq('/api/stem/zeg',{text:'Nu.',voice_id:VOICE},ok),env));
 assert.equal(weg.status,502);assert.ok(!(await weg.text()).includes(SERVER_KEY));
 assert.equal(telling(env,ok.id),5);
});
test('eigen sleutel blijft werken, ook ingelogd: dan telt er niets',async()=>{
 const env={DB:nepD1(),ELEVENLABS_API_KEY:SERVER_KEY};
 const ok=await account(env,'anna');
 calls.length=0;
 const r=await met(geluid,()=>stemRoute(lbReq('/api/stem/zeg',{text:'Nu.',voice_id:VOICE},ok,{Authorization:'Bearer '+KEY}),env));
 assert.equal(r.status,200);assert.equal(calls[0].opt.headers['xi-api-key'],KEY);assert.equal(r.headers.get('X-Stem-Left'),null);
 assert.equal(telling(env,ok.id),0);
});
