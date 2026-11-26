const{test,expect}=require('@playwright/test');
// Stap 2: twee accounts (twee browsercontexten) op één nep-D1 en nep-R2. De /api-routes
// draaien echt (account-worker.mjs en social-worker.mjs); de sessies zetten we hier
// rechtstreeks in de tabel, het inloggen zelf is al getest in account.spec.cjs.
let account,social,nep,r2;
test.beforeAll(async()=>{account=await import('../account-worker.mjs');social=await import('../social-worker.mjs');nep=await import('./nep-d1.mjs');r2=await import('./nep-r2.mjs');});
const crypto=require('node:crypto');

async function gebruiker(env,handle){
 const id=(handle+'_'.repeat(22)).slice(0,22),token=crypto.randomBytes(32).toString('base64url');
 env.DB.db.prepare("INSERT INTO users(id,handle,name,visibility,created_at) VALUES(?,?,?,'private',?)").run(id,handle,handle,Date.now());
 env.DB.db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(crypto.createHash('sha256').update(token).digest('hex'),id,Date.now()+864e5);
 return {id,handle,cookie:'lb_s='+token};
}
async function open(page,env,wie){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.route(/\/api\/(auth\/|sync|account|social\/|foto)/,async route=>{
  const rq=route.request(),h=await rq.allHeaders(),url=new URL(rq.url());
  const headers={'Content-Type':h['content-type']||'',Cookie:wie.cookie};if(h.origin)headers.Origin=h.origin;
  const body=['GET','HEAD'].includes(rq.method())?undefined:(rq.postDataBuffer()||Buffer.alloc(0));
  const req=new Request(rq.url(),{method:rq.method(),headers,body});
  const res=url.pathname.startsWith('/api/social/')||url.pathname.startsWith('/api/foto')?await social.socialRoute(req,env):await account.accountRoute(req,env);
  await route.fulfill({status:res.status,contentType:res.headers.get('Content-Type')||'application/json',body:Buffer.from(await res.arrayBuffer())});
 });
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>currentPage==='home'&&typeof BrewWorkspace!=='undefined');
 await page.evaluate(async h=>{
  state.features=state.features||{};state.features.account=true;state.features.social=true;
  state.sync={user:{handle:h,visibility:'private'},lastHandle:h,tomb:[],dialAt:{}};await save();
 },wie.handle);
}

test('two accounts: ask, accept, feed shows the brew and photo, try fills recipes and wishlist, like, block hides',async({browser,browserName})=>{
 test.skip(browserName!=='chromium','one engine is enough for this flow');
 const env={DB:nep.nepD1(),FOTOS:r2.nepR2()};
 const jesse=await gebruiker(env,'jesse'),sanne=await gebruiker(env,'sanne');
 const cS=await browser.newContext(),cJ=await browser.newContext();
 const pS=await cS.newPage(),pJ=await cJ.newPage();
 await open(pS,env,sanne);await open(pJ,env,jesse);

 // sanne: een brew en een boon met foto, dan syncen (foto gaat verkleind mee)
 await pS.evaluate(async()=>{
  const c=document.createElement('canvas');c.width=1600;c.height=900;const g=c.getContext('2d');g.fillStyle='#7d6650';g.fillRect(0,0,1600,900);
  state.beans=[];state.brews=[];
  state.beans.push({id:'sbean',name:'Kenya Nyeri',roaster:'Friedhats',origin:'Kenya',process:'washed',roasternotes:'blackcurrant, juicy',
   notes:'mijn geheime boonnotitie',price:21.5,inStock:true,photo:c.toDataURL('image/jpeg',.9)});
  state.brews.push({id:'sbrew',method:'v60',title:'sunday v60',beans:'Kenya Nyeri',beanId:'sbean',dose:15,yield:250,ratio:16.7,time:'3:05',temp:93,score:8.5,
   tags:['blackcurrant'],notes:'te snel gelopen, privé',grind:'22 clicks',ts:Date.now()});
  await save();await acctSync(true);
 });
 await expect.poll(()=>env.FOTOS.m.size,{timeout:10000}).toBe(1);
 const foto=[...env.FOTOS.m.values()][0];
 expect(foto.httpMetadata.contentType).toBe('image/jpeg');expect(foto.b.length).toBeLessThanOrEqual(1024*1024);
 expect(env.DB.db.prepare("SELECT photo_key FROM records WHERE id='sbean'").get().photo_key).toMatch(/^sanne_{17}\./);

 // jesse: profielkaart, zoeken en volgverzoek
 await pJ.evaluate(()=>{go('profile');setToon('volg-card');});
 const kaart=pJ.locator('#volg-card');
 await expect(kaart).toBeVisible();
 await expect(kaart).toContainText('@jesse');
 await expect(pJ.locator('#nav-feed')).toBeVisible();
 await kaart.locator('#volg-zoek').fill('san');
 await kaart.getByRole('button',{name:'ask'}).click();
 await expect(pJ.locator('#toast')).toContainText('asked @sanne');
 await expect(kaart).toContainText('requested');

 // sanne accepteert
 await pS.evaluate(()=>{go('profile');setToon('volg-card');});
 const kaartS=pS.locator('#volg-card');
 await expect(kaartS).toContainText('follow requests');
 await kaartS.getByRole('button',{name:'accept'}).click();
 await expect(pS.locator('#toast')).toContainText('@jesse follows you now');
 await expect(kaartS.locator('.volg-tel')).toContainText('1followers');

 // jesse: feed met beide items, nieuwste eerst, zonder privévelden
 await pJ.locator('#nav-feed').click();
 const reel=pJ.locator('#feed-reel');
 await expect(reel.locator('.feed-kaart')).toHaveCount(2);
 await expect(reel).toContainText('@sanne');
 await expect(reel.locator('.feed-kaart').first()).toContainText('Kenya Nyeri, v60');
 await expect(reel.locator('.feed-kaart').first()).toContainText('15 g → 250 g · 93 °C · 3:05 · score 8.5');
 for(const geheim of ['geheime','privé','21.5','22 clicks'])await expect(reel).not.toContainText(geheim);
 const snap=await pJ.evaluate(()=>{const r=document.getElementById('feed-reel'),k=r.querySelector('.feed-plek');return {snap:getComputedStyle(r).scrollSnapType,align:getComputedStyle(k).scrollSnapAlign,h:k.getBoundingClientRect().height,rh:r.clientHeight,bg:getComputedStyle(r.querySelector('.feed-kaart')).backgroundColor,ink:getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()};});
 expect(snap.snap).toContain('y mandatory');expect(snap.align).toContain('start');expect(Math.abs(snap.h-snap.rh)).toBeLessThan(2);
 expect(snap.bg).toBe('rgb('+[1,3,5].map(i=>parseInt(snap.ink.slice(i,i+2),16)).join(', ')+')');
 const img=reel.locator('img.feed-img');
 await expect(img).toHaveCount(1);
 await expect.poll(()=>img.evaluate(i=>i.complete&&i.naturalWidth)).toBe(1280);
 // geen emoji op de knoppen
 expect(await reel.locator('.feed-knop').evaluateAll(bs=>bs.every(b=>!/[←-￿]/.test(b.textContent)&&b.querySelector('svg')))).toBe(true);

 // try: de brew wordt een eigen recept, de boon gaat op de wishlist
 const brewKaart=reel.locator('.feed-kaart',{hasText:'Kenya Nyeri, v60'});
 await brewKaart.getByRole('button',{name:'try'}).click();
 await expect(pJ.locator('#toast')).toContainText('in your recipes');
 const rec=await pJ.evaluate(()=>state.recipes.find(r=>r.van==='sanne/brew/sbrew'));
 expect(rec).toMatchObject({eigen:true,mid:'v60',dose:15,ratio:16.7,temp:93,tijd:'3:05'});
 expect(rec.stappen.length).toBeGreaterThan(0);
 expect(await pJ.evaluate(()=>recipesFor('v60').some(r=>r.van==='sanne/brew/sbrew'))).toBe(true);
 await brewKaart.getByRole('button',{name:'try'}).click();
 await expect(pJ.locator('#toast')).toContainText('already tried');
 await reel.locator('.feed-kaart',{hasText:'Friedhats'}).getByRole('button',{name:'try'}).click();
 expect(await pJ.evaluate(()=>state.wishlist.filter(w=>w.van==='sanne/bean/sbean').map(w=>w.brander+'|'+w.notitie))).toEqual(['Friedhats|from @sanne']);

 // like met teller
 await brewKaart.getByRole('button',{name:'like'}).click();
 await expect(brewKaart.getByRole('button',{name:'like'})).toHaveText('1');
 expect(env.DB.db.prepare('SELECT COUNT(*) n FROM likes').get().n).toBe(1);

 // het recept staat bij de brew ideas (pagina recipes)
 await pJ.evaluate(()=>go('recipes'));
 await expect(pJ.locator('#ws-recipe-list')).toContainText('Kenya Nyeri · @sanne');
 await pJ.locator('#nav-feed').click();
 await expect(reel.locator('.feed-kaart')).toHaveCount(2);

 // profiel van sanne openen en blokkeren: weg uit de feed en uit zoeken, over en weer
 await brewKaart.locator('.feed-wie').click();
 await expect(pJ.locator('#page-person')).toBeVisible();
 await expect(pJ.locator('#person-body')).toContainText('following · unfollow');
 await expect(pJ.locator('#person-body .volg-item')).toHaveCount(2);
 pJ.once('dialog',d=>d.accept());
 await pJ.locator('#person-blok').click();
 await expect(pJ.locator('#toast')).toContainText('blocked @sanne');
 await pJ.evaluate(()=>go('feed'));
 await expect(reel.locator('.feed-kaart')).toHaveCount(1);
 await expect(reel).toContainText('Nothing here yet');
 expect(env.DB.db.prepare('SELECT COUNT(*) n FROM follows').get().n).toBe(0);
 await pS.evaluate(()=>{volg.zoekQ='';volgLaadMij();});
 await pS.locator('#volg-zoek').fill('jes');
 await expect(pS.locator('#volg-zoek-uit')).toContainText('nobody found');
 await cS.close();await cJ.close();
});

test('try on an espresso brew gives a recipe with steps; brew ideas open without errors, also with an old recipe without steps; flag off makes the account private',async({browser,browserName})=>{
 test.skip(browserName!=='chromium','one engine is enough for this flow');
 const env={DB:nep.nepD1(),FOTOS:r2.nepR2()};
 const jesse=await gebruiker(env,'jesse'),anna=await gebruiker(env,'anna');
 env.DB.db.prepare("UPDATE users SET visibility='public' WHERE id=?").run(anna.id);
 env.DB.db.prepare("INSERT INTO records(user_id,kind,id,data,updated_at,deleted,synced_at) VALUES(?,'brew','e1',?,?,0,1)").run(anna.id,JSON.stringify({id:'e1',method:'espresso',beans:'Brazil Cerrado',dose:18,yield:40,ratio:2.2,time:'0:30',temp:94,score:7}),Date.now());
 const c=await browser.newContext(),page=await c.newPage();
 const fouten=[];page.on('pageerror',e=>fouten.push(e.message));
 await open(page,env,jesse);
 // oude kapotte data: een eigen recept zonder stappen
 await page.evaluate(async()=>{state.recipes=state.recipes||[];state.recipes.push({id:'r_oud',eigen:true,mid:'espresso',fam:'espresso',naam:'oud zonder stappen',dose:18,ratio:2,temp:93});await save();});
 await page.evaluate(async()=>{await acctApi('/api/social/follow',{body:{handle:'anna'}});});
 await page.evaluate(()=>go('feed'));
 const kaart=page.locator('#feed-reel .feed-kaart',{hasText:'Brazil Cerrado'});
 await kaart.getByRole('button',{name:'try'}).click();
 await expect(page.locator('#toast')).toContainText('in your recipes');
 const rec=await page.evaluate(()=>state.recipes.find(r=>r.van==='anna/brew/e1'));
 expect(rec.mid).toBe('espresso');
 expect(rec.stappen.map(x=>x.k)).toEqual(['dose','tamp','shot','stop']);
 expect(rec.stappen[3].t).toBe(30);
 await page.evaluate(()=>go('recipes'));
 await expect(page.locator('#ws-recipe-list')).toContainText('Brazil Cerrado · @anna');
 await expect(page.locator('#ws-recipe-list')).toContainText('oud zonder stappen');
 // het herstel bij het starten geeft het oude recept een lege lijst
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>currentPage!=='welcome'&&typeof BrewWorkspace!=='undefined');
 expect(await page.evaluate(()=>Array.isArray(state.recipes.find(r=>r.id==='r_oud').stappen))).toBe(true);
 await page.evaluate(()=>go('recipes'));
 await expect(page.locator('#ws-recipe-list')).toContainText('Brazil Cerrado · @anna');
 // vlag uit: online weer private
 await page.evaluate(async()=>{await acctApi('/api/social/profile',{body:{visibility:'public'}});});
 expect(env.DB.db.prepare('SELECT visibility FROM users WHERE id=?').get(jesse.id).visibility).toBe('public');
 await page.evaluate(()=>toggleFeature('social'));
 await expect.poll(()=>env.DB.db.prepare('SELECT visibility FROM users WHERE id=?').get(jesse.id).visibility).toBe('private');
 await expect(page.locator('#nav-feed')).toBeHidden();
 expect(fouten).toEqual([]);
 await c.close();
});

test('flag off: no feed tab, no profile card, no social calls',async({page})=>{
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 const calls=[];await page.route(/\/api\/social\//,r=>{calls.push(r.request().url());r.fulfill({status:401,body:'{}'});});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>currentPage==='home');
 await expect(page.locator('#nav-feed')).toBeHidden();
 await page.evaluate(()=>go('profile'));
 await expect(page.locator('#volg-card')).toBeHidden();
 await expect(page.locator('#nav button[data-p="learn"]')).toBeVisible();
 expect(calls).toEqual([]);
});
