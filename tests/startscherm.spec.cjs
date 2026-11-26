const{test,expect}=require('@playwright/test');
// Startscherm: splash 4 tekeningen + logo (samen 2 s sinds 26-11, tik = overslaan),
// getekende dubbele randen overal (vlag drawnedges), surprise me met de gietcoach-tekening.
async function open(page,splash){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 if(splash)await page.addInitScript(()=>{window.__splashTest=true;});
 await page.goto('/',{waitUntil:'domcontentloaded'});
}
test('splash: drawings then the old logo, about 2 s, a tap skips it',async({page})=>{
 await open(page,true);
 await expect(page.locator('#page-welcome')).toBeVisible();
 await expect(page.locator('#sf4')).toHaveAttribute('src','splash-4.png');
 await expect(page.locator('#sf5')).toHaveAttribute('src','logo.png');
 await page.waitForTimeout(1000);
 expect(await page.evaluate(()=>currentPage)).toBe('welcome');   // na 1 s nog op de splash
 await page.waitForFunction(()=>currentPage==='home',null,{timeout:2500});
 const t=await page.evaluate(()=>performance.now());
 expect(t).toBeGreaterThan(1950);
 expect(t).toBeLessThan(3200);
 // opnieuw laden en tikken: meteen door
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof currentPage!=='undefined'&&document.getElementById('page-welcome'));
 await page.waitForTimeout(300);
 // tik precies waar straks de surprise-kaart ligt: die mag niet mee-opengaan
 const kaart={x:195,y:206};
 await page.evaluate(()=>{window.__qb=0;const o=window.quickBrew;window.quickBrew=function(){window.__qb++;return o.apply(this,arguments);};});
 await page.touchscreen.tap(kaart.x,kaart.y);
 await page.waitForFunction(()=>currentPage==='home',null,{timeout:1500});
 await page.waitForTimeout(500);
 expect(await page.evaluate(()=>window.__qb)).toBe(0);
 await expect(page.locator('#surprise-pop')).toBeHidden();
 // en op de plek van een methodeknop: blijft op home
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof currentPage!=='undefined'&&currentPage==='welcome');
 await page.waitForTimeout(300);
 await page.touchscreen.tap(79,557);
 await page.waitForFunction(()=>currentPage==='home',null,{timeout:1500});
 await page.waitForTimeout(500);
 expect(await page.evaluate(()=>currentPage)).toBe('home');
});
test('drawn edges: two separate passes per frame, off switch removes them',async({page})=>{
 await open(page,false);
 await page.waitForFunction(()=>currentPage==='home');
 await page.waitForFunction(()=>document.querySelectorAll('svg.rand-svg').length>3);
 const r=await page.evaluate(()=>{
  const kaart=document.getElementById('surprise-btn');
  const svg=kaart.querySelector(':scope>svg.rand-svg');
  const d=[...svg.querySelectorAll('path')].map(p=>p.getAttribute('d'));
  const methodes=[...document.querySelectorAll('#methods-scroll .method')].map(m=>({rand:!!m.querySelector(':scope>svg.rand-svg'),bg:m.style.background}));
  return{n:d.length,verschillend:d[0]!==d[1],open:!/Z/i.test(d.join('')),methodes,
   logoBoven:!!document.querySelector('#page-home .home-logo'),
   tekening:!!kaart.querySelector('.sur-gc .lijn'),logo:kaart.querySelector('.sur-logo').getAttribute('src'),
   dubbeleIds:[...document.querySelectorAll('[id]')].map(e=>e.id).filter((v,i,a)=>a.indexOf(v)!==i),
   rijY:getComputedStyle(document.getElementById('methods-scroll')).overflowY,
   knopLetter:getComputedStyle(document.querySelector('#methods-scroll .method')).fontFamily,
   systeem:[...document.querySelectorAll('button,input,select,textarea')].filter(e=>/system-ui|-apple-system|Arial|Helvetica/i.test(getComputedStyle(e).fontFamily)).length};
 });
 expect(r.n).toBe(2);expect(r.verschillend).toBe(true);expect(r.open).toBe(true);
 expect(r.methodes.length).toBeGreaterThan(0);
 expect(r.methodes.every(m=>m.rand&&/var\(--/.test(m.bg))).toBe(true);   // elke methode in zijn eigen kleur
 expect(r.logoBoven).toBe(false);expect(r.tekening).toBe(false);   // nakijkronde 25-11: tekening weg, logo blijft
 expect(r.rijY).toBe('hidden');expect(r.knopLetter).toMatch(/Patrick Hand|Caveat/);expect(r.systeem).toBe(0);
 expect(r.logo).toBe('logo.png');
 expect(r.dubbeleIds).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.evaluate(()=>toggleFeature('drawnedges'));
 await page.waitForFunction(()=>document.querySelectorAll('svg.rand-svg').length===0);
 expect(await page.evaluate(()=>document.documentElement.classList.contains('randen'))).toBe(false);
});
