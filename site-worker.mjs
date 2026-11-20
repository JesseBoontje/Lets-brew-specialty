import {VOICE_TOOLS,VOICE_INSTRUCTIONS} from './voice-contract.mjs';
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Strict-Transport-Security':'max-age=15552000'}});
export async function realtimeSession(request,env={}){
 if(request.method!=='POST')return json({error:'Alleen POST is toegestaan.'},405);
 if(request.headers.get('Origin')!==new URL(request.url).origin)return json({error:'Deze aanvraag hoort niet bij de app.'},403);
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return json({error:'JSON vereist.'},415);
 const key=request.headers.get('Authorization')||'';
 if(!/^Bearer sk-[A-Za-z0-9_-]{20,}$/.test(key))return json({error:'Voer je eigen OpenAI API-sleutel in bij Instellingen → AI.'},401);
 if(env.RATE_LIMITER){const limit=await env.RATE_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});if(!limit.success)return json({error:'Wacht even voordat je opnieuw een gesprek start.'},429);}
 let config;try{const reader=request.body.getReader();let text='',size=0;const dec=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();return json({error:'Aanvraag te groot.'},413);}text+=dec.decode(value,{stream:true});}config=JSON.parse(text);}catch{return json({error:'Ongeldige aanvraag.'},400);}
 const models=['gpt-realtime','gpt-realtime-2.1','gpt-realtime-mini','gpt-realtime-2.1-mini'];
 if(!models.includes(config?.model))return json({error:'Onbekend spraakmodel.'},400);
 try{
  const response=await fetch('https://api.openai.com/v1/realtime/client_secrets',{method:'POST',redirect:'error',headers:{Authorization:key,'Content-Type':'application/json'},body:JSON.stringify({expires_after:{anchor:'created_at',seconds:60},session:{type:'realtime',model:config.model,instructions:VOICE_INSTRUCTIONS,tools:VOICE_TOOLS,max_output_tokens:1000,audio:{input:{turn_detection:{type:'server_vad'}},output:{voice:'marin'}}}}),signal:AbortSignal.timeout(20000)});
  if(!response.ok)return json({error:'OpenAI kon geen spraaksessie starten. Controleer je eigen API-sleutel, modeltoegang en tegoed.',providerStatus:response.status},response.status===429?429:502);
  const data=await response.json();if(typeof data.value!=='string'||data.value.length>2000)return json({error:'OpenAI gaf geen bruikbare spraaksessie terug.'},502);
  return json({value:data.value,expires_at:data.expires_at});
 }catch{return json({error:'De spraakdienst is tijdelijk niet bereikbaar.'},502);}
}

/* ElevenLabs-stem (eleven_v4): de gebruiker stuurt zijn eigen sleutel mee; de Worker bewaart en logt hem nooit. */
const EL_API='https://api.elevenlabs.io';
const EL_MODEL='eleven_v4';
async function leesJson(request,max){
 const reader=request.body?.getReader();if(!reader)throw Error('leeg');let text='',size=0;const dec=new TextDecoder();
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();const e=Error('groot');e.groot=true;throw e;}text+=dec.decode(value,{stream:true});}
 return JSON.parse(text);
}
export async function stemRoute(request,env={}){
 const url=new URL(request.url),soort=url.pathname==='/api/stem/voices'?'voices':url.pathname==='/api/stem/zeg'?'zeg':null;
 if(!soort)return json({error:'Niet gevonden.'},404);
 if(request.method!=='POST')return json({error:'Alleen POST is toegestaan.'},405);
 if(request.headers.get('Origin')!==url.origin)return json({error:'Deze aanvraag hoort niet bij de app.'},403);
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return json({error:'JSON vereist.'},415);
 const auth=request.headers.get('Authorization')||'';
 const m=/^Bearer ((?:sk_)?[A-Za-z0-9]{32,128})$/.exec(auth);
 if(!m)return json({error:'Vul je eigen ElevenLabs-sleutel in bij Instellingen.'},401);
 const key=m[1];
 const rem=env.STEM_LIMITER||env.RATE_LIMITER;
 if(rem){const limit=await rem.limit({key:'stem:'+(request.headers.get('CF-Connecting-IP')||'unknown')});if(!limit.success)return json({error:'Even wachten: te veel stemverzoeken achter elkaar.'},429);}
 let body;try{body=await leesJson(request,2048);}catch(e){return e.groot?json({error:'Aanvraag te groot.'},413):json({error:'Ongeldige aanvraag.'},400);}
 if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'Ongeldige aanvraag.'},400);
 const fout=status=>status===401||status===403?json({error:'ElevenLabs accepteert deze sleutel niet. Controleer je eigen sleutel.'},401):status===429?json({error:'ElevenLabs remt: te veel verzoeken of tegoed op.'},429):json({error:'ElevenLabs gaf een fout. De app gebruikt de gewone stem.'},502);
 try{
  if(soort==='voices'){
   if(Object.keys(body).length)return json({error:'Ongeldige aanvraag.'},400);
   const r=await fetch(EL_API+'/v1/voices',{method:'GET',redirect:'error',headers:{'xi-api-key':key,Accept:'application/json'},signal:AbortSignal.timeout(15000)});
   if(!r.ok)return fout(r.status);
   const data=await r.json();
   const lijst=(Array.isArray(data?.voices)?data.voices:[]).filter(v=>typeof v?.voice_id==='string'&&/^[A-Za-z0-9]{10,40}$/.test(v.voice_id)).slice(0,200)
    .map(v=>({voice_id:v.voice_id,name:String(v.name||v.voice_id).slice(0,60),category:String(v.category||'').slice(0,20)}));
   return json({voices:lijst});
  }
  const keys=Object.keys(body);
  if(keys.some(k=>k!=='text'&&k!=='voice_id'))return json({error:'Ongeldige aanvraag.'},400);
  const text=typeof body.text==='string'?body.text.trim():'';
  if(!text||text.length>300||/[\u0000-\u001f\u007f]/.test(text))return json({error:'Tekst ontbreekt of is te lang.'},400);
  if(typeof body.voice_id!=='string'||!/^[A-Za-z0-9]{10,40}$/.test(body.voice_id))return json({error:'Kies eerst een stem uit je eigen lijst.'},400);
  const r=await fetch(EL_API+'/v1/text-to-speech/'+body.voice_id+'?output_format=mp3_44100_128',{method:'POST',redirect:'error',headers:{'xi-api-key':key,'Content-Type':'application/json',Accept:'audio/mpeg'},body:JSON.stringify({text,model_id:EL_MODEL}),signal:AbortSignal.timeout(20000)});
  if(!r.ok)return fout(r.status);
  if(!/^audio\//i.test(r.headers.get('Content-Type')||''))return json({error:'ElevenLabs gaf geen geluid terug.'},502);
  const len=+(r.headers.get('Content-Length')||0);if(len>2000000)return json({error:'Geluid te groot.'},502);
  return new Response(r.body,{status:200,headers:{'Content-Type':'audio/mpeg','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Strict-Transport-Security':'max-age=15552000'}});
 }catch{return json({error:'De stemdienst is tijdelijk niet bereikbaar. De app gebruikt de gewone stem.'},502);}
}
export default{async fetch(request,env){
 const path=new URL(request.url).pathname;
 if(path==='/api/realtime/session')return realtimeSession(request,env);
 if(path.startsWith('/api/stem/'))return stemRoute(request,env);
 if(path.startsWith('/api/'))return json({error:'Niet gevonden.'},404);
 const response=await env.ASSETS.fetch(request),headers=new Headers(response.headers);
 headers.set('X-Content-Type-Options','nosniff');headers.set('X-Frame-Options','DENY');headers.set('Referrer-Policy','strict-origin-when-cross-origin');
 headers.set('Permissions-Policy','microphone=(self), camera=(self), geolocation=(self), payment=(), usb=()');
 headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; script-src-attr 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' https:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; frame-src 'none'; manifest-src 'self'; worker-src 'self'");
 return new Response(response.body,{status:response.status,headers});
}};
