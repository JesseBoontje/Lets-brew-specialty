const{test,expect}=require('@playwright/test');
// Account & sync achter de vlag 'account'. De /api-routes draaien hier echt
// (account-worker.mjs met een nep-D1), de passkey komt van een virtuele
// authenticator in Chromium. Alleen in Chromium (CDP).
let worker,nep;
test.beforeAll(async()=>{worker=await import('../account-worker.mjs');nep=await import('./nep-d1.mjs');});

async function open(page,context,env){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 const koek={waarde:''};
 // /api/* naar de echte worker; het sessiecookie houden we hier bij (route.fulfill zet geen cookies)
 await page.route(/\/api\/(auth\/|sync|account)/,async route=>{
  const rq=route.request(),h=await rq.allHeaders();
  const headers={'Content-Type':h['content-type']||''};if(h.origin)headers.Origin=h.origin;if(koek.waarde)headers.Cookie=koek.waarde;
  const res=await worker.accountRoute(new Request(rq.url(),{method:rq.method(),headers,body:['GET','HEAD'].includes(rq.method())?undefined:rq.postData()||''}),env);
  const sc=res.headers.get('Set-Cookie');
  if(sc){koek.waarde=/Max-Age=0/.test(sc)?'':sc.split(';')[0];expect(sc).toMatch(/HttpOnly; Secure; SameSite=Strict; Path=\/api\//);}
  await route.fulfill({status:res.status,contentType:'application/json',body:await res.text()});
 });
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>currentPage==='home'&&typeof BrewWorkspace!=='undefined');
 return koek;
}
async function authenticator(context,page){
 const cdp=await context.newCDPSession(page);
 await cdp.send('WebAuthn.enable');
 await cdp.send('WebAuthn.addVirtualAuthenticator',{options:{protocol:'ctap2',transport:'internal',hasResidentKey:true,hasUserVerification:true,isUserVerified:true,automaticPresenceSimulation:true}});
}
const records=(env,where='')=>env.DB.db.prepare('SELECT kind,id,deleted,data FROM records '+where).all();

test('account card hides behind the flag; Face ID account, sync, sign out and in, delete everything',async({page,context,browserName})=>{
 test.skip(browserName!=='chromium','virtual authenticator needs Chromium');
 const env={DB:nep.nepD1()};
 await open(page,context,env);await authenticator(context,page);
 // vlag uit: geen kaart
 await page.evaluate(()=>go('profile'));
 await expect(page.locator('#acct-card')).toBeHidden();
 await page.evaluate(()=>toggleFeature('account'));
 const kaart=page.locator('#acct-card');
 await expect(kaart).toBeVisible();
 await expect(kaart.locator('#acct-login')).toHaveText('sign in with Face ID');
 await expect(kaart).toContainText('not now, keep it on this phone');
 await expect(kaart).toContainText('Cloudflare, in the EU');
 // knoppen in de huisstijl: inkt (of crème op de gevulde), geen blauwe systeemkleur
 const kleur=await page.evaluate(()=>{const c=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();return{knop:getComputedStyle(document.getElementById('acct-nieuw')).color,hoofd:getComputedStyle(document.getElementById('acct-login')).color,ink:c('--ink'),cream:c('--cream')};});
 const rgb=hex=>'rgb('+[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(', ')+')';
 expect(kleur.knop).toBe(rgb(kleur.ink));expect(kleur.hoofd).toBe(rgb(kleur.cream));

 // nieuw account
 await kaart.locator('#acct-nieuw').click();
 await kaart.locator('#acct-handle').fill('Jesse_Test');
 await kaart.locator('#acct-maak').click();
 await expect(kaart).toContainText('signed in as jesse_test');
 await expect(kaart.locator('#acct-status')).toContainText('last sync: just now',{timeout:10000});
 const lokaal=await page.evaluate(()=>({beans:state.beans.length,brews:state.brews.length,stamp:state.beans.every(b=>b.updatedAt>0)}));
 expect(lokaal.stamp).toBe(true);
 expect(records(env,"WHERE kind='bean'").length).toBe(lokaal.beans);
 expect(records(env,"WHERE kind='brew'").length).toBe(lokaal.brews);
 expect(env.DB.db.prepare('SELECT handle,visibility FROM users').get()).toEqual({handle:'jesse_test',visibility:'private'});

 // bewerken, toevoegen en wissen gaan mee
 await page.evaluate(async()=>{state.beans[0].notes='nieuw genoteerd';state.beans.push({id:'pwbean',name:'Kenya AA',inStock:true,photo:'data:image/png;base64,AAAA'});await save();});
 const weg=await page.evaluate(async()=>{const id=state.brews[0].id;state.brews.splice(0,1);await save();return id;});
 expect(await page.evaluate(()=>state.sync.tomb.length)).toBe(1);
 await kaart.locator('#acct-sync').click();
 await expect(page.locator('#toast')).toContainText('synced');
 const kenya=records(env,"WHERE id='pwbean'")[0];
 expect(JSON.parse(kenya.data).photo).toBeNull();
 expect(records(env,`WHERE id='${weg}'`)[0].deleted).toBe(1);
 expect(await page.evaluate(()=>state.sync.tomb.length)).toBe(0);
 // wat online nieuwer is komt binnen; de eigen foto blijft staan
 const t=Date.now()+60000;
 env.DB.db.prepare("UPDATE records SET data=?,updated_at=?,synced_at=? WHERE id='pwbean'").run(JSON.stringify({id:'pwbean',name:'Kenya AA natural',inStock:true,photo:null}),t,Date.now()*1000+5e9);
 await kaart.locator('#acct-sync').click();
 await expect.poll(()=>page.evaluate(()=>{const b=beanById('pwbean');return b.name+'|'+b.photo.slice(0,10)+'|'+b.updatedAt;})).toBe('Kenya AA natural|data:image|'+t);

 // offline breekt niets
 await context.setOffline(true);
 await kaart.locator('#acct-sync').click();
 await expect(kaart.locator('#acct-status')).toContainText('offline');
 await page.evaluate(async()=>{state.beans.push({id:'offbean',name:'Offline bean',inStock:true});await save();});
 await context.setOffline(false);

 // uitloggen en weer inloggen met dezelfde passkey
 await kaart.getByText('sign out on this phone').click();
 await expect(kaart.locator('#acct-login')).toBeVisible();
 expect(await page.evaluate(()=>beanById('offbean')&&state.beans.length>0)).toBeTruthy();
 await kaart.locator('#acct-login').click();
 await expect(kaart).toContainText('signed in as jesse_test');
 await expect.poll(()=>records(env,"WHERE id='offbean'").length).toBe(1);

 // account wissen: twee keer bevestigen, online alles weg, telefoon houdt zijn kopie
 page.on('dialog',d=>d.accept());
 await kaart.locator('#acct-wis').click();
 await expect(kaart.locator('#acct-login')).toBeVisible();
 for(const tabel of ['users','passkeys','sessions','records'])expect(env.DB.db.prepare('SELECT COUNT(*) n FROM '+tabel).get().n).toBe(0);
 expect(await page.evaluate(()=>!!beanById('pwbean'))).toBe(true);
});

test('not now keeps everything on the phone; nothing is sent without an account',async({page,context,browserName})=>{
 test.skip(browserName!=='chromium','virtual authenticator needs Chromium');
 const env={DB:nep.nepD1()};
 let verzoeken=0;
 await page.route('**/api/sync',r=>{verzoeken++;r.abort();});
 await open(page,context,env);
 await page.evaluate(()=>{toggleFeature('account');go('profile');});
 await page.locator('#acct-card').getByText('not now, keep it on this phone').click();
 await expect(page.locator('#acct-card')).toContainText('not signed in. Everything stays on this phone.');
 await page.evaluate(async()=>{state.beans.splice(0,1);await save();});
 expect(await page.evaluate(()=>state.sync.tomb.length)).toBe(0);
 expect(verzoeken).toBe(0);
 // na herladen blijft de keuze staan
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof BrewWorkspace!=='undefined'&&currentPage&&currentPage!=='welcome');
 await page.evaluate(()=>go('profile'));
 await expect(page.locator('#acct-card')).toContainText('not signed in');
});
