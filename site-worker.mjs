import {VOICE_TOOLS,VOICE_INSTRUCTIONS} from './voice-contract.mjs';
import {accountRoute} from './account-worker.mjs';
import {socialRoute} from './social-worker.mjs';
import {aiRoute} from './ai-worker.mjs';
import {gebruiker,aiDag} from './account-worker.mjs';
const json=(value,status=200,extra={})=>new Response(JSON.stringify(value),{status,headers:{...extra,'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Strict-Transport-Security':'max-age=15552000'}});
export async function realtimeSession(request,env={}){
 if(request.method!=='POST')return json({error:'Only POST is allowed.'},405);
 if(request.headers.get('Origin')!==new URL(request.url).origin)return json({error:'This request does not belong to the app.'},403);
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return json({error:'JSON required.'},415);
 const key=request.headers.get('Authorization')||'';
 if(!/^Bearer sk-[A-Za-z0-9_-]{20,}$/.test(key))return json({error:'Paste your own OpenAI API key in Settings → AI.'},401);
 if(env.RATE_LIMITER){const limit=await env.RATE_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});if(!limit.success)return json({error:'Wait a moment before you start another conversation.'},429);}
 let config;try{const reader=request.body.getReader();let text='',size=0;const dec=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();return json({error:'Request too large.'},413);}text+=dec.decode(value,{stream:true});}config=JSON.parse(text);}catch{return json({error:'Invalid request.'},400);}
 const models=['gpt-realtime','gpt-realtime-2.1','gpt-realtime-mini','gpt-realtime-2.1-mini'];
 if(!models.includes(config?.model))return json({error:'Unknown voice model.'},400);
 try{
  const response=await fetch('https://api.openai.com/v1/realtime/client_secrets',{method:'POST',redirect:'error',headers:{Authorization:key,'Content-Type':'application/json'},body:JSON.stringify({expires_after:{anchor:'created_at',seconds:60},session:{type:'realtime',model:config.model,instructions:VOICE_INSTRUCTIONS,tools:VOICE_TOOLS,max_output_tokens:1000,audio:{input:{turn_detection:{type:'server_vad'}},output:{voice:'marin'}}}}),signal:AbortSignal.timeout(20000)});
  if(!response.ok)return json({error:'OpenAI could not start a voice session. Check your own API key, model access and credit.',providerStatus:response.status},response.status===429?429:502);
  const data=await response.json();if(typeof data.value!=='string'||data.value.length>2000)return json({error:'OpenAI returned no usable voice session.'},502);
  return json({value:data.value,expires_at:data.expires_at});
 }catch{return json({error:'The voice service is not reachable right now.'},502);}
}

/* ElevenLabs-stem (eleven_v4). Twee manieren:
   - eigen sleutel: de app stuurt hem mee (Authorization); de Worker bewaart en logt hem nooit.
   - Lets Brew voice: geen sleutel mee, wel ingelogd, niet op slot en ai_allowed=1. Dan de
     sleutel van de server (env.ELEVENLABS_API_KEY) en max STEM_LIMIET zinnen per dag per
     gebruiker, geteld in ai_usage met dag 'stem:JJJJ-MM-DD' (zelfde tabel als /api/ai, geen
     migratie). Standaardstem optioneel in env.ELEVENLABS_VOICE_ID. */
const EL_API='https://api.elevenlabs.io';
const EL_MODEL='eleven_v4';
export const STEM_LIMIET=300;
const STEM_ID=/^[A-Za-z0-9]{10,40}$/;
export const stemDag=(t=Date.now())=>'stem:'+aiDag(t);
async function leesJson(request,max){
 const reader=request.body?.getReader();if(!reader)throw Error('leeg');let text='',size=0;const dec=new TextDecoder();
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();const e=Error('groot');e.groot=true;throw e;}text+=dec.decode(value,{stream:true});}
 return JSON.parse(text);
}
// één zin erbij, alleen onder de limiet: één statement, dus atomair (zoals /api/ai)
async function stemTel(env,userId,day){
 const r=await env.DB.prepare('INSERT INTO ai_usage(user_id,day,count) VALUES(?,?,1) ON CONFLICT(user_id,day) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(userId,day,STEM_LIMIET).first();
 return r?r.count:null;
}
async function stemTerug(env,userId,day){
 try{await env.DB.prepare('UPDATE ai_usage SET count=count-1 WHERE user_id=? AND day=? AND count>0').bind(userId,day).run();}catch{}
}
/* wie betaalt: {key, gebruiker|null} of een Response met de fout */
async function stemSleutel(request,env){
 const auth=request.headers.get('Authorization')||'';
 if(auth){
  const m=/^Bearer ((?:sk_)?[A-Za-z0-9]{32,128})$/.exec(auth);
  if(!m)return json({error:'That does not look like an ElevenLabs key.'},401);
  return {key:m[1],user:null};
 }
 if(!env.DB)return json({error:'Paste your own ElevenLabs key in Settings, or sign in for the Lets Brew voice.',code:'no_key'},401);
 const user=await gebruiker(request,env);
 if(!user)return json({error:'Sign in for the Lets Brew voice, or use your own key.',code:'sign_in'},401);
 if(!user.ai_allowed)return json({error:'The Lets Brew voice is not on for this account.',code:'not_allowed'},403);
 const key=typeof env.ELEVENLABS_API_KEY==='string'?env.ELEVENLABS_API_KEY.trim():'';
 if(!key)return json({error:'The Lets Brew voice is not set up yet. The app uses the phone voice.',code:'not_set_up'},503);
 return {key,user};
}
export async function stemRoute(request,env={}){
 const url=new URL(request.url),soort=url.pathname==='/api/stem/voices'?'voices':url.pathname==='/api/stem/zeg'?'zeg':null;
 if(!soort)return json({error:'Not found.'},404);
 if(request.method!=='POST')return json({error:'Only POST is allowed.'},405);
 if(request.headers.get('Origin')!==url.origin)return json({error:'This request does not belong to the app.'},403);
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return json({error:'JSON required.'},415);
 let wie;
 try{wie=await stemSleutel(request,env);}catch{return json({error:'Something went wrong on the server.'},500);}
 if(wie instanceof Response)return wie;
 const {key,user}=wie;
 const rem=env.STEM_LIMITER||env.RATE_LIMITER;
 if(rem){const limit=await rem.limit({key:'stem:'+(user?user.id:(request.headers.get('CF-Connecting-IP')||'unknown'))});if(!limit.success)return json({error:'Wait a moment: too many voice requests in a row.'},429);}
 let body;try{body=await leesJson(request,2048);}catch(e){return e.groot?json({error:'Request too large.'},413):json({error:'Invalid request.'},400);}
 if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'Invalid request.'},400);
 const standaard=user&&typeof env.ELEVENLABS_VOICE_ID==='string'&&STEM_ID.test(env.ELEVENLABS_VOICE_ID.trim())?env.ELEVENLABS_VOICE_ID.trim():'';
 const fout=status=>status===401||status===403?(user?json({error:'The Lets Brew voice is not available right now. The app uses the phone voice.'},502):json({error:'ElevenLabs does not accept this key. Check your own key.'},401)):status===429?json({error:'ElevenLabs is slowing down: too many requests or no credit left.'},429):json({error:'ElevenLabs gave an error. The app uses the phone voice.'},502);
 try{
  if(soort==='voices'){
   if(Object.keys(body).length)return json({error:'Invalid request.'},400);
   const r=await fetch(EL_API+'/v1/voices',{method:'GET',redirect:'error',headers:{'xi-api-key':key,Accept:'application/json'},signal:AbortSignal.timeout(15000)});
   if(!r.ok)return fout(r.status);
   const data=await r.json();
   const lijst=(Array.isArray(data?.voices)?data.voices:[]).filter(v=>typeof v?.voice_id==='string'&&STEM_ID.test(v.voice_id)).slice(0,200)
    .map(v=>({voice_id:v.voice_id,name:String(v.name||v.voice_id).slice(0,60),category:String(v.category||'').slice(0,20)}));
   return json(user?{voices:lijst,server:true,standaard:standaard||null}:{voices:lijst});
  }
  const keys=Object.keys(body);
  if(keys.some(k=>k!=='text'&&k!=='voice_id'))return json({error:'Invalid request.'},400);
  const text=typeof body.text==='string'?body.text.trim():'';
  if(!text||text.length>300||/[\u0000-\u001f\u007f]/.test(text))return json({error:'Text is missing or too long.'},400);
  let voice=body.voice_id;
  if(voice===undefined&&standaard)voice=standaard;
  if(typeof voice!=='string'||!STEM_ID.test(voice))return json({error:'Pick a voice from the list first.'},400);
  // Lets Brew voice: tellen vóór het doorsturen; mislukt het, dan telt de zin niet
  let day='',n=0;
  if(user){
   day=stemDag();n=await stemTel(env,user.id,day);
   if(n==null)return json({error:`Daily voice limit reached (${STEM_LIMIET} lines). The app uses the phone voice until midnight.`,code:'limit'},429,{'X-Stem-Left':'0'});
  }
  const left=user?{'X-Stem-Left':String(Math.max(0,STEM_LIMIET-n))}:{};
  let r;
  try{r=await fetch(EL_API+'/v1/text-to-speech/'+voice+'?output_format=mp3_44100_128',{method:'POST',redirect:'error',headers:{'xi-api-key':key,'Content-Type':'application/json',Accept:'audio/mpeg'},body:JSON.stringify({text,model_id:EL_MODEL}),signal:AbortSignal.timeout(20000)});}
  catch(e){if(user)await stemTerug(env,user.id,day);throw e;}
  const terug=async res=>{if(user)await stemTerug(env,user.id,day);try{await r.body?.cancel();}catch{}return res;};
  if(!r.ok)return terug(fout(r.status));
  if(!/^audio\//i.test(r.headers.get('Content-Type')||''))return terug(json({error:'ElevenLabs returned no audio.'},502));
  const len=+(r.headers.get('Content-Length')||0);if(len>2000000)return terug(json({error:'Audio too large.'},502));
  return new Response(r.body,{status:200,headers:{'Content-Type':'audio/mpeg','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Strict-Transport-Security':'max-age=15552000',...left}});
 }catch{return json({error:'The voice service is not reachable right now. The app uses the phone voice.'},502);}
}
/* Pagina van een brander ophalen, zodat de AI echt leest wat er op de zak staat in plaats van te gokken.
   Alleen GET, alleen https/http naar een gewone domeinnaam, max 1,5 MB, 8 s; terug gaat platte tekst. */
const pagOk=raw=>{let u;try{u=new URL(raw);}catch{return null;}
 if(!/^https?:$/.test(u.protocol)||u.username||u.password||(u.port&&!['80','443'].includes(u.port)))return null;
 const h=u.hostname.toLowerCase();
 if(!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(h)||/(^|\.)(localhost|local|internal|lan)$/.test(h))return null;
 return u;};
export async function paginaRoute(request,env={}){
 if(request.method!=='GET')return json({error:'Alleen GET.'},405);
 // alleen vanuit de app zelf, en niet eindeloos: anders is dit een open proxy op ons domein
 if(request.headers.get('Sec-Fetch-Site')!=='same-origin')return json({error:'Deze aanvraag hoort niet bij de app.'},403);
 if(env.STEM_LIMITER){const l=await env.STEM_LIMITER.limit({key:'pagina:'+(request.headers.get('CF-Connecting-IP')||'unknown')});if(!l.success)return json({error:'Even wachten.'},429);}
 let u=pagOk(new URL(request.url).searchParams.get('url')||'');
 if(!u)return json({error:'Deze link kan niet.'},400);
 try{
  // doorverwijzingen zelf volgen en elk nieuw adres opnieuw keuren, max 3 stappen
  let r;
  for(let stap=0;;stap++){
   r=await fetch(u.toString(),{redirect:'manual',signal:AbortSignal.timeout(8000),headers:{'User-Agent':'Mozilla/5.0 (compatible; LetsBrew/1.0)','Accept':'text/html'}});
   if(r.status<300||r.status>=400)break;
   if(stap>=3)return json({error:'Te veel doorverwijzingen.'},502);
   const volgende=pagOk(new URL(r.headers.get('Location')||'',u).toString());
   if(!volgende)return json({error:'Deze link kan niet.'},400);
   u=volgende;
  }
  if(!r.ok)return json({error:'De pagina gaf een fout ('+r.status+').'},502);
  if(!/text\/html|application\/xhtml/i.test(r.headers.get('Content-Type')||''))return json({error:'Dat is geen webpagina.'},415);
  const reader=r.body.getReader();const dec=new TextDecoder();let html='',size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;html+=dec.decode(value,{stream:true});if(size>1500000){await reader.cancel();break;}}
  const meta=(n)=>{const m=html.match(new RegExp('<meta[^>]+(?:property|name)=["\']'+n+'["\'][^>]*content=["\']([^"\']*)','i'));return m?m[1]:'';};
  const titel=(html.match(/<title[^>]*>([^<]*)/i)||[])[1]||'';
  const tekst=html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>|<svg[\s\S]*?<\/svg>/gi,' ').replace(/<head[\s>][\s\S]*?<\/head>/i,' ').replace(/<!--[\s\S]*?-->/g,' ')
   .replace(/\/\*[\s\S]*?\*\//g,' ')
   // losse CSS-regels (selector { ... }), ook genest in @media: twee rondes
   .replace(/[^{}<>\n]{0,300}\{[^{}]*\}/g,' ').replace(/[^{}<>\n]{0,300}\{[^{}]*\}/g,' ')
   .replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr)>/gi,'\n').replace(/<[^>]+>/g,' ')
   .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"')
   .replace(/[{}]/g,'\n').replace(/[ \t]+/g,' ').split('\n')
   // regels vol code-tekens (CSS-selectors, scripts) weg; gewone zinnen blijven
   .map(l=>{const w=l.trim().split(' ').filter(Boolean);if(!w.length)return '';
     // een woord met code-tekens (selector, declaratie, script) telt als code
     const code=x=>/[{}();>#\[\]=*_\\|@$]|^[.:]|\.[a-z-]+\.|^-{1,2}[a-z]|:[a-z0-9'"!-]/i.test(x);
     const goed=w.filter(x=>!code(x));
     return goed.length>=Math.max(1,w.length*0.6)?goed.join(' '):'';})
   .filter(Boolean).join('\n').trim().slice(0,12000);
  return json({titel:titel.trim().slice(0,200),beschrijving:(meta('og:description')||meta('description')).slice(0,600),tekst});
 }catch{return json({error:'De pagina was niet bereikbaar.'},502);}
}
export default{async fetch(request,env){
 const path=new URL(request.url).pathname;
 if(path==='/api/realtime/session')return realtimeSession(request,env);
 if(path.startsWith('/api/stem/'))return stemRoute(request,env);
 if(path==='/api/pagina')return paginaRoute(request,env);
 if(path.startsWith('/api/auth/')||path==='/api/sync'||path==='/api/account')return accountRoute(request,env);
 if(path.startsWith('/api/social/')||path==='/api/foto'||path.startsWith('/api/foto/'))return socialRoute(request,env);
 if(path==='/api/ai'||path.startsWith('/api/admin/'))return aiRoute(request,env);
 if(path.startsWith('/api/'))return json({error:'Niet gevonden.'},404);
 const response=await env.ASSETS.fetch(request),headers=new Headers(response.headers);
 headers.set('X-Content-Type-Options','nosniff');headers.set('X-Frame-Options','DENY');headers.set('Referrer-Policy','strict-origin-when-cross-origin');
 headers.set('Permissions-Policy','microphone=(self), camera=(self), geolocation=(self), payment=(), usb=()');
 headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; script-src-attr 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' https:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; frame-src 'none'; manifest-src 'self'; worker-src 'self'");
 return new Response(response.body,{status:response.status,headers});
}};
