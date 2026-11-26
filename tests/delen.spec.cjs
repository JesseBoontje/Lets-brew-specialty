const{test,expect}=require('@playwright/test');
// Delen met iemand zonder app (25-11, docs/opzet-delen.html): een brew of boon als los
// html-bestand, als PDF via het printmenu, of als bestand voor een andere Lets Brew-gebruiker.
async function open(page){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof BrewWorkspace!=='undefined'&&currentPage==='home');
 await page.evaluate(()=>{
  Object.defineProperty(navigator,'canShare',{configurable:true,value:undefined});
  state.userName='Jesse';localStorage.setItem('scc_ai_key','sk-ant-geheim');
  state.beans.push({id:'kny',name:'Kenya Nyeri',roaster:'Friedhats',origin:'Kenya',process:'washed',roastdate:'2026-11-10',
   roasternotes:'blackcurrant, lime',notes:'MIJN EIGEN NOTITIE',price:16,bagsize:250,inStock:true,methods:['v60']});
  state.brews.push({id:'bk1',method:'v60',beanId:'kny',beans:'Kenya Nyeri',dose:15,yield:250,temp:94,grind:'medium',time:'2:45',score:8.5,
   ts:new Date('2026-11-24T08:00:00').getTime(),notes:'PRIVE BREW NOTITIE',tags:['blackcurrant','lime','sweet'],
   recipeSnapshot:{naam:'V60 basis',stappen:[{t:0,d:'bloom tot 45 g, swirl'},{t:45,d:'giet tot 150 g'},{t:75,d:'giet tot 250 g'},{t:165,d:'droog, klaar'}]}});
  state.brews.push({id:'bk2',method:'v60',beanId:'kny',beans:'Kenya Nyeri',dose:15,yield:240,score:6,ts:Date.now(),notes:'ANDERE BREW'});
 });
}
test('a brew: one share menu with page, PDF and app file; the page holds the recipe and drawing, nothing private',async({page})=>{
 await open(page);
 await page.evaluate(()=>openDetail('bk1'));
 await page.locator('#detail-body .act',{hasText:'share'}).click();
 const pop=page.locator('#deel-pop');
 await expect(pop).toBeVisible();
 await expect(pop).toContainText('share this brew');
 for(const t of ['send as a page','save as PDF','send to a Lets Brew user'])await expect(pop.getByRole('button',{name:new RegExp(t)})).toBeVisible();
 const dl=page.waitForEvent('download');
 await pop.getByRole('button',{name:/send as a page/}).click();
 expect((await dl).suggestedFilename()).toBe('kenya-nyeri.html');
 await expect(pop).toBeHidden();
 const html=await page.evaluate(()=>window.__deelLaatste.html);
 expect(html.startsWith('<!doctype html>')).toBe(true);
 for(const t of ['Kenya Nyeri','brewed by Jesse, 24 Nov 2026','v60, 15 g to 250 g, 2:45, 94 °C','<b>15 g</b><span>coffee</span>','<b>8.5</b><span>score</span>',
  '<i>0:45</i> giet tot 150 g','taste: blackcurrant, lime, sweet','made with Lets Brew Specialty, letsbrew.djez.app','src="data:image/jpeg'])expect(html,t).toContain(t);
 for(const t of ['PRIVE BREW NOTITIE','ANDERE BREW','MIJN EIGEN NOTITIE','sk-ant','<script','http://','https://'])expect(html,t).not.toContain(t);
 // de pagina opent op zichzelf, zonder app
 const p2=await page.context().newPage();await p2.setContent(html);
 await expect(p2.locator('h1')).toHaveText('Kenya Nyeri');await p2.close();
 // PDF: hetzelfde blad in het printvak
 await page.evaluate(()=>{window.__geprint=0;window.print=()=>{window.__geprint++;};});
 await page.locator('#detail-body .act',{hasText:'share'}).click();
 await pop.getByRole('button',{name:/save as PDF/}).click();
 await expect.poll(()=>page.evaluate(()=>window.__geprint)).toBe(1);
 await expect(page.locator('#print-area .lb-blad h1')).toHaveText('Kenya Nyeri');
 // naar een Lets Brew-gebruiker: het bestaande bestand
 await page.evaluate(()=>{window.__app=null;shareOneBrew=id=>{window.__app=id;};});
 await page.locator('#detail-body .act',{hasText:'share'}).click();
 await pop.getByRole('button',{name:/send to a Lets Brew user/}).click();
 expect(await page.evaluate(()=>window.__app)).toBe('bk1');
});
test('a bean: the same menu; the page shows the bag, price per cup and the best recipe, not your notes',async({page})=>{
 await open(page);
 const d=await page.evaluate(()=>{deelOpen('bean','kny');return document.getElementById('deel-pop').textContent;});
 expect(d).toContain('share this bean');
 const dl=page.waitForEvent('download');
 await page.locator('#deel-pop').getByRole('button',{name:/send as a page/}).click();
 await dl;
 const html=await page.evaluate(()=>window.__deelLaatste.html);
 for(const t of ['Kenya Nyeri','blackcurrant, lime','<b>Friedhats</b><span>roaster</span>','<b>washed</b><span>process</span>','10 Nov 2026',
  '€0.96 a cup (15 g)','best with: v60, 15 g to 250 g, 2:45, 94 °C, 8.5/10','bloom tot 45 g'])expect(html,t).toContain(t);
 for(const t of ['MIJN EIGEN NOTITIE','PRIVE BREW NOTITIE','ANDERE BREW','€16','sk-ant'])expect(html,t).not.toContain(t);
 // de verzendknop op de bonenkaart opent hetzelfde menu
 await page.evaluate(()=>{expandedBeans.add('kny');go('beans');});
 await page.locator('[data-bean="kny"] .icon-btn[title="share this bean"]').click();
 await expect(page.locator('#deel-pop')).toContainText('share this bean');
});
