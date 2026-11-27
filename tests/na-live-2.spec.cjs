const{test,expect}=require('@playwright/test');
// Na live 2 (27-11): foutnummer van de AI- en stemdienst zichtbaar, kapotte brew-kaart op Home,
// "my brews" in de recepteditor, locatie pas vragen als je er zelf om vraagt.
async function open(page,init){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 if(init)await page.addInitScript(init);
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof BrewWorkspace!=='undefined'&&currentPage==='home');
}
const lbAan=page=>page.evaluate(async()=>{
 state.features=state.features||{};state.features.account=true;
 state.sync={user:{handle:'jesse',visibility:'private',ai:true},lastHandle:'jesse',tomb:[],dialAt:{}};await save();
});

test('Lets Brew AI: a provider error shows only its number ("the AI service said 404")',async({page})=>{
 await page.route('**/api/auth/me',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({user:{handle:'jesse',ai:true},ai:{used:0,limit:50}})}));
 const lijven=[];
 await page.route('**/api/ai',r=>{lijven.push(JSON.parse(r.request().postData()));r.fulfill({status:502,contentType:'application/json',headers:{'X-AI-Left':'50'},body:JSON.stringify({error:'Lets Brew AI could not answer this time.',providerStatus:404})});});
 await open(page);
 await lbAan(page);
 await page.evaluate(()=>{localStorage.setItem('scc_ai_on','1');localStorage.setItem('scc_ai_prov','letsbrew');});
 expect(await page.evaluate(()=>aiProv())).toBe('letsbrew');
 const fout=await page.evaluate(()=>askAI([{role:'user',content:'hoi'}],100,'other').then(()=>'geen fout',e=>e.message));
 expect(fout).toBe('Lets Brew AI: the AI service said 404');
 // de app vraagt standaard om het actuele model
 expect(lijven[0].model).toBe('claude-sonnet-5-5');
 expect(await page.evaluate(()=>aiAanbieder('anthropic').model)).toBe('claude-sonnet-5-5');
 // zonder providerStatus blijft de gewone tekst
 expect(await page.evaluate(()=>apiFout(new Response(JSON.stringify({error:'Daily limit reached (50).',code:'limit'}),{status:429})))).toBe('Daily limit reached (50). (api 429)');
});

test('Lets Brew voice: a provider error on the voice list shows its number',async({page})=>{
 await page.route('**/api/auth/me',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({user:{handle:'jesse',ai:true},ai:{used:0,limit:50}})}));
 await page.route('**/api/stem/voices',r=>r.fulfill({status:502,contentType:'application/json',body:JSON.stringify({error:'The Lets Brew voice is not available right now. The app uses the phone voice.',providerStatus:401})}));
 await open(page);
 await lbAan(page);
 expect(await page.evaluate(()=>BrewStem.stand().bron)).toBe('letsbrew');
 await page.evaluate(()=>{go('profile');setToon('stem-card');});
 await page.locator('#stem-laad').click();
 await expect(page.locator('#stem-status')).toHaveText('Lets Brew voice: the voice service said 401.');
});

test('Home: a record without method or time is not shown as a brew; a brew without time shows no "NaN"',async({page})=>{
 await open(page);
 await page.evaluate(async()=>{
  state.brews=[
   {id:'kapot1',dose:18,yield:20,score:0},                                   // geen methode, geen ts, geen boon
   {id:'zonderts',method:'v60',dose:15,yield:250,beanId:state.beans[0].id,score:7},  // geen ts, wel boon
   {id:'goed',method:'v60',beans:'Kenya',dose:15,yield:250,ts:Date.now()-3*864e5,score:8}
  ];
  await save();renderHome();renderAll();
 });
 const home=page.locator('#recent-list');
 await expect(home.locator('.card')).toHaveCount(2);
 const tekst=await home.innerText();
 expect(tekst).not.toMatch(/undefined|NaN/);
 expect(tekst).toContain('Kenya');
 expect(tekst).toContain('3 days ago');
 // zonder bean-naam: de naam van de gekoppelde boon
 const boon=await page.evaluate(()=>state.beans[0].name);
 expect(tekst).toContain(boon);
 // ook de lijst in Brews
 const lijst=await page.locator('#all-list').innerText();
 expect(lijst).not.toMatch(/undefined|NaN/);
 expect(await page.locator('#all-list [data-ws="brew"]').count()).toBe(2);
 // na herladen krijgt een brew zonder ts zijn updatedAt
 await page.evaluate(async()=>{state.brews.push({id:'oud',method:'v60',beans:'Ethiopia',updatedAt:Date.now()-2*864e5,score:6});await save();});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof BrewWorkspace!=='undefined'&&currentPage==='home');
 expect(await page.evaluate(()=>state.brews.find(b=>b.id==='oud').ts>0)).toBe(true);
 // via sync: een brew zonder ts krijgt de tijd van de wijziging
 const ts=await page.evaluate(()=>{const t=Date.now()-5*864e5;acctToepassen([{kind:'brew',id:'vansync',updatedAt:t,data:{method:'espresso',beans:'Brazil',dose:18,yield:36}}]);return [t,state.brews.find(b=>b.id==='vansync').ts];});
 expect(ts[1]).toBe(ts[0]);
});

test('brew idea editor: the line points to "my brews"',async({page})=>{
 await open(page);
 await expect(page.locator('#page-recipe .subtitle')).toHaveText(/under my brews\.$/);
 expect(await page.locator('#page-recipe .subtitle').textContent()).not.toMatch(/under Brews/);
});

test('weather: no location request at start; only after turning it on or tapping the line',async({page,context})=>{
 await page.addInitScript(()=>{
  window.__geo=0;
  Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:(ok)=>{window.__geo++;ok({coords:{latitude:52.1,longitude:5.1}});}}});
  // de browser kent nog geen toestemming
  if(navigator.permissions)navigator.permissions.query=async()=>({state:'prompt'});
 });
 await page.route('https://api.open-meteo.com/**',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({current:{temperature_2m:27,precipitation:0}})}));
 await open(page);
 // weer stond al aan (bijv. uit een back-up): bij het openen geen vraag
 await page.evaluate(async()=>{state.features=state.features||{};state.features.weather=true;await save();localStorage.removeItem('scc_weather');localStorage.removeItem('scc_weather_ok');});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof BrewWorkspace!=='undefined'&&currentPage==='home');
 await page.waitForTimeout(300);
 expect(await page.evaluate(()=>window.__geo)).toBe(0);
 const regel=page.locator('#weather-line');
 await expect(regel).toBeVisible();
 await expect(regel).toContainText('tap for weather-aware tips');
 await regel.click();
 await expect(regel).toContainText('27°');
 expect(await page.evaluate(()=>window.__geo)).toBe(1);
 // daarna (toestemming gegeven) mag het bij openen weer vanzelf
 await page.evaluate(()=>localStorage.removeItem('scc_weather'));
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof BrewWorkspace!=='undefined'&&currentPage==='home');
 await expect(regel).toContainText('27°');
 // aanzetten in Settings vraagt meteen (met jouw tik)
 await page.evaluate(async()=>{state.features.weather=false;await save();localStorage.removeItem('scc_weather');localStorage.removeItem('scc_weather_ok');window.__geo=0;toggleFeature('weather');});
 await expect.poll(()=>page.evaluate(()=>window.__geo)).toBe(1);
});
