const{test,expect}=require('@playwright/test');
// Startscherm (24-11): splash 3 tekeningen + logo (4,25 s, tik = overslaan),
// getekende dubbele randen overal (vlag drawnedges), surprise me met de gietcoach-tekening.
async function open(page,splash){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 if(splash)await page.addInitScript(()=>{window.__splashTest=true;});
 await page.goto('/',{waitUntil:'domcontentloaded'});
}
test('splash: drawings then the old logo, about 4 s, a tap skips it',async({page})=>{
 await open(page,true);
 await expect(page.locator('#page-welcome')).toBeVisible();
 await expect(page.locator('#sf4')).toHaveAttribute('src','logo.png');
 await page.waitForTimeout(2500);
 expect(await page.evaluate(()=>currentPage)).toBe('welcome');   // na 2,5 s nog op de splash
 await page.waitForFunction(()=>currentPage==='home',null,{timeout:4000});
 const t=await page.evaluate(()=>performance.now());
 expect(t).toBeGreaterThan(4200);
 // opnieuw laden en tikken: meteen door
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof currentPage!=='undefined'&&document.getElementById('page-welcome'));
 await page.waitForTimeout(300);
 await page.locator('#page-welcome').tap();
 await page.waitForFunction(()=>currentPage==='home',null,{timeout:1500});
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
   dubbeleIds:[...document.querySelectorAll('[id]')].map(e=>e.id).filter((v,i,a)=>a.indexOf(v)!==i)};
 });
 expect(r.n).toBe(2);expect(r.verschillend).toBe(true);expect(r.open).toBe(true);
 expect(r.methodes.length).toBeGreaterThan(0);
 expect(r.methodes.every(m=>m.rand&&/var\(--/.test(m.bg))).toBe(true);   // elke methode in zijn eigen kleur
 expect(r.logoBoven).toBe(false);expect(r.tekening).toBe(true);expect(r.logo).toBe('logo.png');
 expect(r.dubbeleIds).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.evaluate(()=>toggleFeature('drawnedges'));
 await page.waitForFunction(()=>document.querySelectorAll('svg.rand-svg').length===0);
 expect(await page.evaluate(()=>document.documentElement.classList.contains('randen'))).toBe(false);
});
