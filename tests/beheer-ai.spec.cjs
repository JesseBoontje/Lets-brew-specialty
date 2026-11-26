const{test,expect}=require('@playwright/test');
// Stap 3: de admin zet Lets Brew AI aan voor een account, die kiest "Lets Brew AI" en krijgt
// antwoord. De /api-routes draaien echt (account-worker, social-worker, ai-worker) op een nep-D1;
// alleen Anthropic zelf is nep (globalThis.fetch in dit testproces, alleen naar api.anthropic.com).
let account,social,ai,nep;
test.beforeAll(async()=>{account=await import('../account-worker.mjs');social=await import('../social-worker.mjs');ai=await import('../ai-worker.mjs');nep=await import('./nep-d1.mjs');});
const crypto=require('node:crypto');
const SLEUTEL='sk-ant-test-GEHEIM-0123456789abcdef';

async function gebruiker(env,handle,{admin=0,ai=0}={}){
 const id=(handle+'_'.repeat(22)).slice(0,22),token=crypto.randomBytes(32).toString('base64url');
 env.DB.db.prepare("INSERT INTO users(id,handle,name,visibility,ai_allowed,is_admin,created_at) VALUES(?,?,?,'private',?,?,?)").run(id,handle,handle,ai,admin,Date.now());
 env.DB.db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(crypto.createHash('sha256').update(token).digest('hex'),id,Date.now()+864e5);
 return {id,handle,cookie:'lb_s='+token};
}
async function open(page,env,wie,browserVerzoeken){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.route(/\/api\/(auth\/|sync|account|social\/|foto|ai$|admin\/)/,async route=>{
  const rq=route.request(),h=await rq.allHeaders(),url=new URL(rq.url());
  if(browserVerzoeken)browserVerzoeken.push({path:url.pathname,headers:h});
  const headers={'Content-Type':h['content-type']||'',Cookie:wie.cookie};if(h.origin)headers.Origin=h.origin;
  const body=['GET','HEAD'].includes(rq.method())?undefined:(rq.postDataBuffer()||Buffer.alloc(0));
  const req=new Request(rq.url(),{method:rq.method(),headers,body});
  const p=url.pathname;
  const res=p==='/api/ai'||p.startsWith('/api/admin/')?await ai.aiRoute(req,env):p.startsWith('/api/social/')||p.startsWith('/api/foto')?await social.socialRoute(req,env):await account.accountRoute(req,env);
  const extra={};const left=res.headers.get('X-AI-Left');if(left!=null)extra['X-AI-Left']=left;
  await route.fulfill({status:res.status,headers:{'Content-Type':res.headers.get('Content-Type')||'application/json',...extra},body:Buffer.from(await res.arrayBuffer())});
 });
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>currentPage==='home'&&typeof BrewWorkspace!=='undefined');
 await page.evaluate(async h=>{
  state.features=state.features||{};state.features.account=true;
  state.sync={user:{handle:h,visibility:'private'},lastHandle:h,tomb:[],dialAt:{}};await save();
  localStorage.setItem('scc_ai_on','1');
 },wie.handle);
}

test('admin turns AI on, the user picks Lets Brew AI, gets an answer and the counter moves; block locks an account',async({browser,browserName})=>{
 test.skip(browserName!=='chromium','one engine is enough for this flow');
 const upstream=[];const oud=globalThis.fetch;
 globalThis.fetch=async(url,init)=>{
  if(!String(url).startsWith('https://api.anthropic.com/'))return oud(url,init);
  const body=JSON.parse(init.body);upstream.push({body,key:init.headers['x-api-key']});
  if(body.stream)return new Response('event: message_start\ndata: {"type":"message_start","message":{"usage":{"input_tokens":9}}}\n\nevent: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Pour a bit slower."}}\n\n',{status:200,headers:{'Content-Type':'text/event-stream'}});
  return new Response(JSON.stringify({content:[{type:'text',text:'Grind two clicks finer.'}],usage:{input_tokens:9,output_tokens:5}}),{status:200,headers:{'Content-Type':'application/json'}});
 };
 try{
  const env={DB:nep.nepD1(),ANTHROPIC_API_KEY:SLEUTEL};
  const jesse=await gebruiker(env,'jesse',{admin:1}),sanne=await gebruiker(env,'sanne'),troll=await gebruiker(env,'troll');
  env.DB.db.prepare("INSERT INTO reports(id,by_user,about_user,reason,created_at) VALUES('r1',?,?,'spam in my feed',?)").run(sanne.id,troll.id,Date.now());
  const cJ=await browser.newContext(),cS=await browser.newContext();
  const pJ=await cJ.newPage(),pS=await cS.newPage();
  const fouten=[];for(const p of [pJ,pS])p.on('pageerror',e=>fouten.push(e.message));
  const verzoekenS=[];
  await open(pJ,env,jesse);await open(pS,env,sanne,verzoekenS);

  // sanne: nog geen Lets Brew AI, dus geen keuze
  await pS.evaluate(()=>go('profile'));
  await expect.poll(()=>pS.evaluate(()=>state.sync.user.ai)).toBe(false);
  await expect(pS.locator('#ai-kies-lb')).toHaveCount(0);
  await expect(pS.locator('#beheer-card')).toBeHidden();

  // jesse (admin): Settings → accounts, AI aan voor sanne
  await pJ.evaluate(()=>{go('profile');setToon('beheer-card');});
  const kaart=pJ.locator('#beheer-card');
  await expect(kaart).toBeVisible();
  await expect(kaart).toContainText('Only you see this card.');
  const rijS=kaart.locator('.bh-rij[data-handle="sanne"]');
  await expect(rijS).toContainText('AI off');
  await rijS.locator('.bh-ai').click();
  await expect(rijS).toContainText('AI on');
  await expect.poll(()=>env.DB.db.prepare("SELECT ai_allowed FROM users WHERE handle='sanne'").get().ai_allowed).toBe(1);
  await expect(kaart).toContainText('Today: 0 AI questions in total.');
  // melding: block account zet troll op slot
  const melding=kaart.locator('.bh-melding[data-id="r1"]');
  await expect(melding).toContainText('@troll');await expect(melding).toContainText('spam in my feed');
  pJ.once('dialog',d=>d.accept());
  await melding.getByRole('button',{name:'block account'}).click();
  await expect(kaart).toContainText('nothing reported');
  await expect(kaart.locator('.bh-rij[data-handle="troll"]')).toContainText('locked');
  expect(env.DB.db.prepare("SELECT locked FROM users WHERE handle='troll'").get().locked).toBe(1);

  // sanne: na het opnieuw openen van Settings is de keuze er
  await pS.evaluate(()=>{go('home');go('profile');const c=document.getElementById('ai-card');setToon('ai-card');});
  await expect(pS.locator('#ai-kies-lb')).toBeVisible();
  await pS.locator('#ai-kies-lb').click();
  await expect(pS.locator('#ai-lb-dag')).toContainText('0 of 50 questions');
  await expect(pS.locator('#ai-eigen')).toBeHidden();
  expect(await pS.evaluate(()=>[aiProv(),aiReady()])).toEqual(['letsbrew',true]);

  // een vraag: antwoord komt via /api/ai, de teller loopt op
  const antwoord=await pS.evaluate(()=>askAI([{role:'user',content:'mijn v60 loopt te snel'}],300,'other'));
  expect(antwoord).toBe('Grind two clicks finer.');
  await expect(pS.locator('#ai-lb-dag')).toContainText('1 of 50 questions');
  await expect(pS.locator('#ai-lb-dag')).toContainText('49 left');
  const stroom=await pS.evaluate(()=>askAIStream([{role:'user',content:'en nu?'}],300,null,'other'));
  expect(stroom).toBe('Pour a bit slower.');
  await expect(pS.locator('#ai-lb-dag')).toContainText('2 of 50 questions');
  expect(upstream.length).toBe(2);
  expect(upstream.every(u=>u.key===SLEUTEL&&u.body.model===ai.AI_MODEL_STANDAARD&&u.body.max_tokens<=4000)).toBe(true);
  // de browser stuurde geen sleutel mee, en de AI-teller voor eigen kosten bleef leeg
  const aiVerzoeken=verzoekenS.filter(v=>v.path==='/api/ai');
  expect(aiVerzoeken.length).toBe(2);
  expect(aiVerzoeken.every(v=>!v.headers['x-api-key']&&!v.headers.authorization)).toBe(true);
  expect(await pS.evaluate(()=>Object.keys((state.ai&&state.ai.bron)||{}).length)).toBe(0);
  expect(await pS.evaluate(()=>document.getElementById('ai-bud-wrap').innerHTML)).toBe('');

  // admin ziet de vragen van vandaag
  await pJ.evaluate(()=>{beheer.geladen=0;go('home');go('profile');});
  await expect(kaart.locator('.bh-rij[data-handle="sanne"]')).toContainText('2 today');
  await expect(kaart).toContainText('Today: 2 AI questions in total.');

  // daglimiet op: met een eigen sleutel in dit tabblad vraagt de app die (reserve), en dat telt wel als eigen kosten
  env.DB.db.prepare('UPDATE ai_usage SET count=50 WHERE user_id=?').run(sanne.id);
  await pS.route('https://api.anthropic.com/**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({content:[{type:'text',text:'own key answer'}],usage:{input_tokens:100,output_tokens:50}})}));
  const reserve=await pS.evaluate(()=>{sessionAiKeys.anthropic='sk-ant-own-key-for-test-1234567890';return askAI([{role:'user',content:'nog een'}],300,'other');});
  expect(reserve).toBe('own key answer');
  await expect(pS.locator('#ai-lb-dag')).toContainText('50 of 50 questions');
  expect(await pS.evaluate(()=>Object.keys(state.ai.bron))).toEqual(['anthropic:other']);
  expect(upstream.length).toBe(2);
  // zonder eigen sleutel: de nette melding van de server
  const limietTekst=await pS.evaluate(()=>{sessionAiKeys.anthropic='';return askAI([{role:'user',content:'nog een'}],300,'other').then(()=>'',e=>e.message);});
  expect(limietTekst).toContain('Daily limit reached (50). Resets at midnight.');

  // AI weer uit: sanne valt terug op de eigen sleutel
  await kaart.locator('.bh-rij[data-handle="sanne"] .bh-ai').click();
  await expect.poll(()=>env.DB.db.prepare("SELECT ai_allowed FROM users WHERE handle='sanne'").get().ai_allowed).toBe(0);
  await pS.evaluate(()=>{go('home');go('profile');});
  await expect.poll(()=>pS.evaluate(()=>aiProv())).toBe('anthropic');
  await expect(pS.locator('#ai-kies-lb')).toHaveCount(0);
  await expect(pS.locator('#ai-eigen')).toBeVisible();
  expect(fouten).toEqual([]);
  await cJ.close();await cS.close();
 }finally{globalThis.fetch=oud;}
});

test('without the account flag there is no Lets Brew AI choice and no accounts card',async({page,browserName})=>{
 test.skip(browserName!=='chromium','one engine is enough');
 const calls=[];
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.route(/\/api\//,r=>{calls.push(r.request().url());r.fulfill({status:404,body:'{}'});});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>currentPage==='home'&&typeof BrewWorkspace!=='undefined');
 await page.evaluate(()=>{localStorage.setItem('scc_ai_on','1');localStorage.setItem('scc_ai_prov','letsbrew');go('profile');const c=document.getElementById('ai-card');setToon('ai-card');});
 await expect(page.locator('#ai-eigen')).toBeVisible();
 await expect(page.locator('#ai-kies-lb')).toHaveCount(0);
 await expect(page.locator('#beheer-card')).toBeHidden();
 expect(await page.evaluate(()=>[aiProv(),aiReady()])).toEqual(['anthropic',false]);
 expect(calls.filter(u=>/\/api\/(auth|ai|admin)/.test(u))).toEqual([]);
});
