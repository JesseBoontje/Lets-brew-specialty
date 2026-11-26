/* Stap 3: beheer en de AI van de app (Lets Brew AI).
   /api/admin/*: alleen voor users.is_admin=1. Lijst van accounts met hun AI-vragen van
   vandaag, AI aan/uit, account op slot (users.locked, migratie 0002), meldingen afhandelen.
   /api/ai: doorgeefluik naar Anthropic voor ingelogde accounts met ai_allowed=1. De sleutel
   staat alleen in env.ANTHROPIC_API_KEY. De server bepaalt model en max_tokens, laat alleen
   bekende velden door en telt per gebruiker per dag (Amsterdamse datum), vóór het doorsturen.
   Nooit de sleutel, de berichten of het antwoord loggen. */
import {json,leesBody,gebruiker,wisCookie,AI_LIMIET,aiDag} from './account-worker.mjs';

const ANTHROPIC='https://api.anthropic.com/v1/messages';
// standaard hetzelfde model als de app (app/08-ai.js) voor anthropic gebruikt
export const AI_MODEL_STANDAARD='claude-sonnet-4-6';
const MAX_AI_BODY=6*1024*1024, MAX_TOKENS=4000, MAX_BERICHTEN=60;
const HANDLE=/^[a-z0-9_]{3,20}$/;
const fout=e=>Object.assign(Error(e),{fout:e});

/* vaste lijst: env.AI_MODEL mag er meer noemen, met komma's; de eerste is de standaard */
export function aiModellen(env){
 const l=String(env.AI_MODEL||'').split(',').map(x=>x.trim()).filter(x=>/^[a-z0-9][a-z0-9.-]{1,80}$/.test(x));
 return l.length?l:[AI_MODEL_STANDAARD];
}

/* Alleen model/max_tokens/messages/stream/system, en in een vorm die we kennen. */
export function aiLijf(body,env){
 const modellen=aiModellen(env);
 const model=modellen.includes(body.model)?body.model:modellen[0];
 let mx=Math.floor(Number(body.max_tokens));
 if(!Number.isFinite(mx)||mx<1)mx=1000;
 mx=Math.min(MAX_TOKENS,mx);
 const m=body.messages;
 if(!Array.isArray(m)||!m.length||m.length>MAX_BERICHTEN)throw fout('vorm');
 const messages=m.map(x=>{
  if(!x||typeof x!=='object'||!['user','assistant'].includes(x.role))throw fout('vorm');
  if(typeof x.content==='string')return {role:x.role,content:x.content};
  if(!Array.isArray(x.content)||!x.content.length||x.content.length>40)throw fout('vorm');
  return {role:x.role,content:x.content.map(c=>{
   if(c&&c.type==='text'&&typeof c.text==='string')return {type:'text',text:c.text};
   if(c&&c.type==='image'&&c.source&&c.source.type==='base64'&&/^image\/(jpeg|png|webp|gif)$/.test(c.source.media_type)&&typeof c.source.data==='string')
    return {type:'image',source:{type:'base64',media_type:c.source.media_type,data:c.source.data}};
   throw fout('vorm');
  })};
 });
 const out={model,max_tokens:mx,messages};
 if(body.stream===true)out.stream=true;
 if(typeof body.system==='string')out.system=body.system;
 else if(Array.isArray(body.system)){
  if(!body.system.every(c=>c&&c.type==='text'&&typeof c.text==='string'))throw fout('vorm');
  out.system=body.system.map(c=>({type:'text',text:c.text}));
 }
 return out;
}

/* Eén vraag erbij, alleen als je onder de limiet zit. Eén statement, dus atomair:
   twee verzoeken tegelijk kunnen samen niet over de 50 heen. */
async function telErbij(env,userId){
 const r=await env.DB.prepare('INSERT INTO ai_usage(user_id,day,count) VALUES(?,?,1) ON CONFLICT(user_id,day) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(userId,aiDag(),AI_LIMIET).first();
 return r?r.count:null;
}
// mislukt het bij de aanbieder, dan telt de vraag niet
async function telTerug(env,userId,day){
 await env.DB.prepare('UPDATE ai_usage SET count=count-1 WHERE user_id=? AND day=? AND count>0').bind(userId,day).run();
}

async function ai(request,env){
 if(request.method!=='POST')return json({error:'Method not allowed.'},405);
 const url=new URL(request.url);
 if(request.headers.get('Origin')!==url.origin)return json({error:'This request does not belong to the app.'},403);
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return json({error:'JSON required.'},415);
 const user=await gebruiker(request,env);
 if(!user)return json({error:'Sign in first.'},401,{'Set-Cookie':wisCookie});
 if(!user.ai_allowed)return json({error:'Lets Brew AI is not on for this account.',code:'not_allowed'},403);
 if(env.STEM_LIMITER){
  const l=await env.STEM_LIMITER.limit({key:'ai:'+user.id});
  if(!l.success)return json({error:'Too many questions at once. Wait a minute.'},429);
 }
 const sleutel=typeof env.ANTHROPIC_API_KEY==='string'?env.ANTHROPIC_API_KEY.trim():'';
 if(!sleutel)return json({error:'AI is not set up yet.',code:'not_set_up'},503);
 let lijf;
 try{lijf=aiLijf(await leesBody(request,MAX_AI_BODY),env);}
 catch(e){
  if(e?.fout==='groot')return json({error:'Request too large.'},413);
  return json({error:'Invalid request.'},400);
 }
 const day=aiDag(),n=await telErbij(env,user.id);
 if(n==null)return json({error:`Daily limit reached (${AI_LIMIET}). Resets at midnight.`,code:'limit'},429,{'X-AI-Left':'0'});
 const left=String(Math.max(0,AI_LIMIET-n));
 let res;
 try{
  res=await fetch(ANTHROPIC,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json','x-api-key':sleutel,'anthropic-version':'2023-06-01'},body:JSON.stringify(lijf)});
 }catch{
  await telTerug(env,user.id,day);
  return json({error:'The AI service is not reachable right now.'},502,{'X-AI-Left':String(AI_LIMIET-n+1)});
 }
 if(!res.ok){
  await telTerug(env,user.id,day);
  try{await res.body?.cancel();}catch{}
  // geen tekst van de aanbieder doorgeven: alleen een eigen zin en de status
  const druk=res.status===429||res.status===529;
  return json({error:druk?'Lets Brew AI is busy. Try again in a minute.':'Lets Brew AI could not answer this time.',providerStatus:res.status},druk?503:502,{'X-AI-Left':String(AI_LIMIET-n+1)});
 }
 const kop={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-AI-Left':left};
 if(lijf.stream&&res.body)return new Response(res.body,{status:200,headers:{...kop,'Content-Type':'text/event-stream; charset=utf-8'}});
 let data;
 try{data=await res.json();}catch{return json({error:'Lets Brew AI gave an answer the app cannot read.'},502,{'X-AI-Left':left});}
 return json(data,200,{'X-AI-Left':left});
}

/* ---------- beheer ---------- */
async function lijst(env){
 const day=aiDag();
 const rows=(await env.DB.prepare('SELECT u.handle,u.name,u.created_at,u.ai_allowed,u.locked,u.is_admin,COALESCE(a.count,0) AS today FROM users u LEFT JOIN ai_usage a ON a.user_id=u.id AND a.day=? ORDER BY u.created_at').bind(day).all()).results||[];
 const users=rows.map(r=>({handle:r.handle,name:r.name||'',created:r.created_at,ai_allowed:!!r.ai_allowed,locked:!!r.locked,admin:!!r.is_admin,ai_today:r.today}));
 return json({users,total_today:users.reduce((t,u)=>t+u.ai_today,0),limit:AI_LIMIET,day});
}
async function opSlot(env,id){
 await env.DB.batch([
  env.DB.prepare('UPDATE users SET locked=1 WHERE id=?').bind(id),
  env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(id)
 ]);
}
async function zet(env,ik,body){
 if(typeof body.handle!=='string'||!HANDLE.test(body.handle))return json({error:'Invalid request.'},400);
 const heeftAi=typeof body.ai_allowed==='boolean',heeftSlot=typeof body.locked==='boolean';
 if(!heeftAi&&!heeftSlot)return json({error:'Invalid request.'},400);
 const u=await env.DB.prepare('SELECT id FROM users WHERE handle=?').bind(body.handle).first();
 if(!u)return json({error:'No account with that name.'},404);
 if(heeftSlot&&body.locked&&u.id===ik.id)return json({error:'You cannot lock your own account.'},400);
 if(heeftAi)await env.DB.prepare('UPDATE users SET ai_allowed=? WHERE id=?').bind(body.ai_allowed?1:0,u.id).run();
 if(heeftSlot){if(body.locked)await opSlot(env,u.id);else await env.DB.prepare('UPDATE users SET locked=0 WHERE id=?').bind(u.id).run();}
 const r=await env.DB.prepare('SELECT handle,ai_allowed,locked FROM users WHERE id=?').bind(u.id).first();
 return json({user:{handle:r.handle,ai_allowed:!!r.ai_allowed,locked:!!r.locked}});
}
async function meldingen(env){
 const rows=(await env.DB.prepare('SELECT r.id,r.reason,r.created_at,b.handle AS by_handle,a.handle AS about_handle,a.locked AS about_locked FROM reports r LEFT JOIN users b ON b.id=r.by_user LEFT JOIN users a ON a.id=r.about_user ORDER BY r.created_at DESC LIMIT 200').all()).results||[];
 return json({reports:rows.map(r=>({id:r.id,reason:r.reason||'',at:r.created_at,by:r.by_handle||null,about:r.about_handle||null,about_locked:!!r.about_locked}))});
}
async function handelAf(env,ik,body){
 if(typeof body.id!=='string'||!/^[A-Za-z0-9_-]{1,64}$/.test(body.id)||!['dismiss','block'].includes(body.action))return json({error:'Invalid request.'},400);
 const r=await env.DB.prepare('SELECT about_user FROM reports WHERE id=?').bind(body.id).first();
 if(!r)return json({error:'That report is gone already.'},404);
 if(body.action==='dismiss'){
  await env.DB.prepare('DELETE FROM reports WHERE id=?').bind(body.id).run();
  return json({ok:true});
 }
 if(r.about_user===ik.id)return json({error:'You cannot lock your own account.'},400);
 // blokkeren = account op slot; alle meldingen over dat account zijn daarmee afgehandeld
 await opSlot(env,r.about_user);
 await env.DB.prepare('DELETE FROM reports WHERE about_user=?').bind(r.about_user).run();
 return json({ok:true,locked:true});
}
async function admin(request,env){
 const url=new URL(request.url),path=url.pathname,m=request.method;
 const routes={'GET /api/admin/users':1,'POST /api/admin/user':1,'GET /api/admin/reports':1,'POST /api/admin/reports':1};
 if(!['/api/admin/users','/api/admin/user','/api/admin/reports'].includes(path))return json({error:'Not found.'},404);
 if(!routes[m+' '+path])return json({error:'Method not allowed.'},405);
 if(m!=='GET'){
  if(request.headers.get('Origin')!==url.origin)return json({error:'This request does not belong to the app.'},403);
  if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return json({error:'JSON required.'},415);
 }
 const ik=await gebruiker(request,env);
 if(!ik)return json({error:'Sign in first.'},401,{'Set-Cookie':wisCookie});
 if(!ik.is_admin)return json({error:'Only for the admin.'},403);
 const body=m==='POST'?await leesBody(request,4096):{};
 if(path==='/api/admin/users')return await lijst(env);
 if(path==='/api/admin/user')return await zet(env,ik,body);
 if(m==='GET')return await meldingen(env);
 return await handelAf(env,ik,body);
}

export async function aiRoute(request,env={}){
 if(!env.DB)return json({error:'Accounts are not available here.'},503);
 const path=new URL(request.url).pathname;
 try{
  if(path==='/api/ai')return await ai(request,env);
  if(path.startsWith('/api/admin/'))return await admin(request,env);
 }catch(e){
  if(e?.fout==='groot')return json({error:'Request too large.'},413);
  if(e?.fout||e instanceof SyntaxError)return json({error:'Invalid request.'},400);
  return json({error:'Something went wrong on the server.'},500);
 }
 return json({error:'Not found.'},404);
}
