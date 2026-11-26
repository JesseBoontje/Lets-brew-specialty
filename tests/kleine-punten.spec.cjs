const{test,expect}=require('@playwright/test');
// Kleine punten (26-11): randen volgen een tekstwijziging; met volgen en feed aan staat Learn in de balk
// en Settings als tandwiel op Home (na live 1), en een volgverzoek is een rustige regel op Home.
async function open(page){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof BrewWorkspace!=='undefined'&&currentPage==='home');
}
const zichtbareTabs=page=>page.evaluate(()=>[...document.querySelectorAll('#nav [data-p]')].filter(b=>b.offsetParent!==null).map(b=>b.textContent.trim()));

test('drawn edges redraw when only the text changes (no new element)',async({page})=>{
 await open(page);
 await page.evaluate(()=>{const d=document.createElement('div');d.className='sketch soft';d.id='rand-proef';d.style.cssText='padding:10px;width:200px';d.appendChild(document.createTextNode('kort'));document.querySelector('#page-home .screen').prepend(d);});
 await page.waitForFunction(()=>!!document.querySelector('#rand-proef>svg.rand-svg'));
 const voor=await page.evaluate(()=>+document.querySelector('#rand-proef>svg.rand-svg').getAttribute('height'));
 // alleen de tekst: dat ziet de MutationObserver niet, de ResizeObserver wel
 await page.evaluate(()=>{document.getElementById('rand-proef').firstChild.data='een veel langere tekst die over meerdere regels loopt, zodat het kader hoger wordt dan eerst';});
 await expect.poll(()=>page.evaluate(()=>+document.querySelector('#rand-proef>svg.rand-svg').getAttribute('height'))).toBeGreaterThan(voor+20);
 expect(await page.evaluate(()=>document.querySelectorAll('#rand-proef>svg.rand-svg').length)).toBe(1);
});

test('without social: Learn stays in the tab bar, nothing new on Home',async({page})=>{
 await open(page);
 expect(await zichtbareTabs(page)).toEqual(['Home','Beans','Brews','Learn','Settings']);
 await expect(page.locator('#home-learn')).toBeHidden();
 await expect(page.locator('#volg-melding')).toBeHidden();
});

test('with social and signed in: Home, Beans, Brews, Feed, Learn; Settings as the gear on Home; a follow request as a quiet line',async({page})=>{
 const me={profile:{handle:'jesse',name:'',visibility:'private',counts:{}},requests:[{handle:'sanne'}],followers:[],following:[],blocked:[]};
 await page.route('**/api/**',r=>{
  const u=r.request().url();
  if(u.includes('/api/social/me'))return r.fulfill({contentType:'application/json',body:JSON.stringify(me)});
  if(u.includes('/api/auth/me'))return r.fulfill({contentType:'application/json',body:JSON.stringify({user:{handle:'jesse'}})});
  if(u.includes('/api/social/feed'))return r.fulfill({contentType:'application/json',body:JSON.stringify({items:[],next:null})});
  return r.fulfill({contentType:'application/json',body:'{}'});
 });
 await open(page);
 await page.evaluate(()=>{state.features=state.features||{};state.features.account=true;state.features.social=true;state.sync=state.sync||{};state.sync.user={handle:'jesse',visibility:'private'};state.sync.last=Date.now();go('beans');go('home');});
 await expect(page.locator('#volg-melding')).toBeVisible();
 await expect(page.locator('#volg-melding')).toHaveText('sanne wants to follow you');
 expect(await zichtbareTabs(page)).toEqual(['Home','Beans','Brews','Feed','Learn']);
 // geen Learn-kaart meer op Home; Learn zit weer in de balk
 await expect(page.locator('#home-learn')).toBeHidden();
 await page.locator('#nav [data-p="learn"]').click();
 await expect(page.locator('#page-learn')).toBeVisible();
 await expect(page.locator('#nav [data-p="learn"]')).toHaveClass(/on/);
 // Settings: het getekende tandwiel rechtsboven op Home
 await page.evaluate(()=>go('home'));
 const tandwiel=page.locator('#home-settings');
 await expect(tandwiel).toBeVisible();
 const tb=await tandwiel.boundingBox();
 expect(tb.width).toBeGreaterThanOrEqual(44);expect(tb.x+tb.width).toBeGreaterThan(330);expect(tb.y).toBeLessThan(60);
 expect(await tandwiel.locator('circle,rect,ellipse').count()).toBe(0);
 await tandwiel.click();
 await expect(page.locator('#page-profile')).toBeVisible();
 // social uit: Settings terug in de balk, tandwiel weg
 await page.evaluate(()=>{toggleFeature('social');go('home');});
 expect(await zichtbareTabs(page)).toEqual(['Home','Beans','Brews','Learn','Settings']);
 await expect(page.locator('#home-settings')).toBeHidden();
 await page.evaluate(()=>{toggleFeature('social');go('home');});
 // de regel leidt naar je profiel in Settings, en de grote kaart telt het verzoek
 await page.evaluate(()=>go('home'));
 await page.locator('#volg-melding').click();
 await expect(page.locator('#page-profile')).toBeVisible();
 await expect(page.locator('#volg-card')).toHaveClass(/open/);
 await expect(page.locator('#volg-card')).toContainText('follow requests');
 await expect(page.locator('#set-groot')).toContainText('1 follow request');
 // twee verzoeken
 await page.evaluate(()=>{volg.me.requests.push({handle:'anna'});go('home');});
 await expect(page.locator('#volg-melding')).toHaveText('sanne and 1 more want to follow you');
});
