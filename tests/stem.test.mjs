import test from 'node:test';
import assert from 'node:assert/strict';
import {stemRoute,EL_MODEL_STANDAARD} from '../site-worker.mjs';
import worker from '../site-worker.mjs';
const origin='https://letsbrewspecialty.jesseboontje.workers.dev';
const KEY='sk_'+'a1'.repeat(24);
const VOICE='AbCdEfGhIj0123456789';
const req=(pad,body={},{key=KEY,bron=origin,type='application/json',method='POST'}={})=>new Request(origin+pad,{method,headers:{Origin:bron,'Content-Type':type,...(key?{Authorization:'Bearer '+key}:{})},body:method==='POST'?(typeof body==='string'?body:JSON.stringify(body)):undefined});
const zeg=(body,opt)=>req('/api/stem/zeg',body,opt);
const met=async(nep,fn)=>{const o=globalThis.fetch;globalThis.fetch=nep;try{return await fn();}finally{globalThis.fetch=o;}};
test('stem: voordeur, invoer en eigen adres worden gecontroleerd voordat ElevenLabs iets ziet',async()=>{
 let geroepen=0;
 await met(async()=>{geroepen++;return new Response('x');},async()=>{
  assert.equal((await stemRoute(zeg({text:'Nu.',voice_id:VOICE},{bron:'https://aanvaller.test'}))).status,403);
  assert.equal((await stemRoute(zeg({text:'Nu.',voice_id:VOICE},{method:'GET'}))).status,405);
  assert.equal((await stemRoute(zeg({text:'Nu.',voice_id:VOICE},{type:'text/plain'}))).status,415);
  assert.equal((await stemRoute(zeg({text:'Nu.',voice_id:VOICE},{key:''}))).status,401);
  assert.equal((await stemRoute(zeg({text:'Nu.',voice_id:VOICE},{key:'sk-openai-'+'x'.repeat(30)}))).status,401);
  assert.equal((await stemRoute(zeg({text:'',voice_id:VOICE}))).status,400);
  assert.equal((await stemRoute(zeg({text:'x'.repeat(301),voice_id:VOICE}))).status,400);
  assert.equal((await stemRoute(zeg({text:'Nu.\u0000',voice_id:VOICE}))).status,400);
  assert.equal((await stemRoute(zeg({text:'Nu.',voice_id:'../v1/user'}))).status,400);
  assert.equal((await stemRoute(zeg({text:'Nu.',voice_id:VOICE,model_id:'duur'}))).status,400);
  assert.equal((await stemRoute(zeg('[1,2]'))).status,400);
  assert.equal((await stemRoute(zeg('{"text":"'+'x'.repeat(3000)+'"}'))).status,413);
  assert.equal((await stemRoute(req('/api/stem/voices',{iets:1}))).status,400);
  assert.equal((await stemRoute(req('/api/stem/anders',{}))).status,404);
 });
 assert.equal(geroepen,0);
});
test('stem: rem op verzoeken',async()=>{
 const env={STEM_LIMITER:{limit:async({key})=>{assert.ok(key.startsWith('stem:'));return {success:false};}}};
 assert.equal((await stemRoute(zeg({text:'Nu.',voice_id:VOICE}),env)).status,429);
});
test('stem: zeg stuurt het standaardmodel met de eigen sleutel en geeft alleen geluid terug',async()=>{
 let gevangen;
 const r=await met(async(url,opt)=>{gevangen={url,opt};return new Response(new Uint8Array([1,2,3]),{headers:{'Content-Type':'audio/mpeg'}});},()=>stemRoute(zeg({text:' Nu: naar 45 gram. ',voice_id:VOICE})));
 assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'audio/mpeg');assert.equal(r.headers.get('cache-control'),'no-store');
 assert.equal(r.headers.get('access-control-allow-origin'),null);
 assert.equal(gevangen.url,'https://api.elevenlabs.io/v1/text-to-speech/'+VOICE+'?output_format=mp3_44100_128');
 assert.equal(gevangen.opt.headers['xi-api-key'],KEY);assert.equal(gevangen.opt.redirect,'error');
 assert.deepEqual(JSON.parse(gevangen.opt.body),{text:'Nu: naar 45 gram.',model_id:'eleven_multilingual_v2'});
 assert.equal(EL_MODEL_STANDAARD,'eleven_multilingual_v2');
 // env.ELEVENLABS_MODEL kiest een ander model; iets vreemds valt terug op de standaard
 for(const [m,verwacht] of [['eleven_flash_v2_5','eleven_flash_v2_5'],['  eleven_v3 ','eleven_v3'],['x"; drop','eleven_multilingual_v2'],['','eleven_multilingual_v2']]){
  await met(async(url,opt)=>{gevangen={url,opt};return new Response(new Uint8Array([1]),{headers:{'Content-Type':'audio/mpeg'}});},()=>stemRoute(zeg({text:'Nu.',voice_id:VOICE}),{ELEVENLABS_MODEL:m}));
  assert.equal(JSON.parse(gevangen.opt.body).model_id,verwacht,m);
 }
 const json=await met(async()=>Response.json({x:1}),()=>stemRoute(zeg({text:'Nu.',voice_id:VOICE})));
 assert.equal(json.status,502);
});
test('stem: fouten van ElevenLabs lekken geen sleutel of details',async()=>{
 for(const [st,verwacht] of [[401,401],[429,429],[500,502]]){
  const r=await met(async()=>Response.json({detail:{message:'bad key '+KEY}},{status:st}),()=>stemRoute(zeg({text:'Nu.',voice_id:VOICE})));
  assert.equal(r.status,verwacht);const t=await r.text();assert.ok(!t.includes(KEY));assert.ok(!t.includes('bad key'));
  assert.equal(JSON.parse(t).providerStatus,st,'alleen het nummer van ElevenLabs gaat mee');
 }
 const weg=await met(async()=>{throw Error('netwerk '+KEY);},()=>stemRoute(zeg({text:'Nu.',voice_id:VOICE})));
 assert.equal(weg.status,502);assert.ok(!(await weg.text()).includes(KEY));
});
test('stem: voices geeft alleen id, naam en soort uit de eigen lijst',async()=>{
 let gevangen;
 const r=await met(async(url,opt)=>{gevangen={url,opt};return Response.json({voices:[{voice_id:VOICE,name:'Mijn stem',category:'cloned',samples:[{x:1}],settings:{}},{voice_id:'<script>',name:'x'}]});},()=>stemRoute(req('/api/stem/voices',{})));
 assert.equal(r.status,200);assert.equal(gevangen.url,'https://api.elevenlabs.io/v1/voices');assert.equal(gevangen.opt.headers['xi-api-key'],KEY);
 assert.deepEqual(await r.json(),{voices:[{voice_id:VOICE,name:'Mijn stem',category:'cloned'}]});
});
test('stem: de Worker stuurt /api/stem/ naar de stemroute',async()=>{
 const r=await worker.fetch(zeg({text:'Nu.',voice_id:VOICE},{bron:'https://aanvaller.test'}),{ASSETS:{fetch:()=>new Response('asset')}});
 assert.equal(r.status,403);
});
