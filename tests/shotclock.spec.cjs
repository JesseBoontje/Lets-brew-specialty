const{test,expect}=require('@playwright/test');
// Shot clock E61 (docs/opzet-shotclock-e61.html): pre-infusie 5 s, rust 3 s,
// daarna volle druk; alleen de volle druk telt voor de doeltijd (classic:
// 0:28, goed van 0:25 tot 0:31). Tarra-vak rekent met de eigen gewichten uit
// my gear: naked 512.4 + ring 38.6 + 18.0 = 569.0 g; toont de weegschaal
// 569.4, dan is de dosis 18.4 g (+0.4).
const data={methods:[{id:'espresso',name:'Espresso',family:'espresso',on:true}],
 beans:[{id:'b1',name:'Ethiopia Guji',inStock:true}],brews:[],gear:[],lastRecipe:{espresso:'e-classic'}};
async function open(page,extra){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.addInitScript(d=>{if(!localStorage.getItem('scTest')){localStorage.setItem('scTest','1');localStorage.setItem('scc_state',JSON.stringify(d));}},Object.assign({},data,extra||{}));
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home'&&typeof shot!=='undefined');
 await page.evaluate(()=>{beginBrew('espresso');pickDiBean('b1');});
 await expect(page.locator('#page-dialin')).toBeVisible();
}
const stand=page=>page.evaluate(()=>shot.stand());
async function shotTot(page,t){await page.waitForFunction(x=>shot.stand().t>=x,t);await page.locator('#sc-btns [data-a="stop"]').tap();}

test('classic: pre 5 s, rest 3 s, full pressure counts; use fills the dial-in and the brew',async({page})=>{
 await open(page);
 // puck-prep: pre-infusie uit het recept staat al aan met 5 s
 expect(await page.evaluate(()=>formPrep.preinf)).toEqual({on:true,val:'5'});
 await expect(page.locator('#e61-tgt')).toHaveText('full 0:28 · pre 5 s · rest 3 s');
 await page.locator('#e61-btn').tap();
 const sc=page.locator('#shotclock');
 await expect(sc).toBeVisible();
 await expect(page.locator('#sc-rn')).toHaveText('classic 1:2');
 await expect(page.locator('#sc-rd')).toHaveText('18 → 36 g · pre 5 s · rest 3 s · full 0:28');
 let s=await stand(page);
 expect(s.plan).toMatchObject({on:true,P:5,R:3,fs:8,Y:36,F:28,Tc:36,lo:25,hi:31});
 await expect(page.locator('#sc-strip')).toContainText('pull the lever');
 await expect(page.locator('#sc-strip')).toContainText('pre-infusion 0:05, rest 0:03');
 // knoppen groot genoeg, niets zijwaarts
 for(const sel of ['#sc-dicht','#sc-recbtn','#sc-btns [data-a="start"]','#sc-tarerow']){
  const b=await page.locator(sel).boundingBox();expect(b.height).toBeGreaterThanOrEqual(48);expect(b.width).toBeGreaterThanOrEqual(48);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
 // hendel overhalen
 await page.evaluate(()=>shot.snelheid(6));
 await page.locator('#sc-btns [data-a="start"]').tap();
 await expect(page.locator('#sc-strip')).toContainText('pre-infusion');
 await page.waitForFunction(()=>shot.stand().fase==='rest');
 await expect(page.locator('#sc-strip')).toContainText('rest — wait');
 await expect(page.locator('#sc-read')).toHaveClass(/wacht/);
 await page.waitForFunction(()=>shot.stand().fase==='full');
 await expect(page.locator('#sc-tlbl')).toContainText('full pressure · total');
 await expect(page.locator('#sc-strip')).toContainText('lever down at 36 g');
 // de grote klok telt de seconden volle druk: 0:00 op het moment van volle druk
 const klok=await page.evaluate(()=>{const s=shot.stand();return {t:s.t,txt:document.getElementById('sc-time').textContent};});
 expect(klok.txt).toBe('0:'+String(Math.floor(klok.t-8)).padStart(2,'0'));
 await page.locator('#sc-btns [data-a="drop"]').tap();
 await shotTot(page,36.3);
 s=await stand(page);
 expect(s.stand).toBe('done');
 const vol=s.stopT-8;
 expect(vol).toBeGreaterThan(28);expect(vol).toBeLessThan(30);
 await expect(page.locator('#sc-strip')).toContainText('good — keep this grind');
 await expect(page.locator('#sc-strip')).toContainText('5 s pre + 3 s rest + '+vol.toFixed(1)+' s full');
 // gewicht nawegen: 35 g, oordeel op doorloop (35/vol tegen 36/28)
 await page.locator('#sc-strip [data-a="w-"]').tap();
 await expect(page.locator('#sc-yout')).toHaveText('35 g');
 const ft=36/28,f=35/vol;
 await expect(page.locator('#sc-strip')).toContainText('flow '+f.toFixed(2)+' g/s · target '+ft.toFixed(2)+' g/s');
 const tijd=Math.round(vol);
 await expect(page.locator('#sc-btns [data-a="use"]')).toHaveText('use 0:'+String(tijd).padStart(2,'0'));
 await page.locator('#sc-btns [data-a="use"]').tap();
 await expect(sc).toBeHidden();
 await expect(page.locator('#di-time')).toHaveValue('0:'+String(tijd).padStart(2,'0'));
 await expect(page.locator('#di-yield')).toHaveValue('35');
 await expect(page.locator('#di-advice')).toContainText('on target');
 // opslaan: de fasen gaan mee in de brew
 await page.evaluate(()=>saveDialInBrew(false));
 const b=await page.evaluate(()=>state.brews[state.brews.length-1]);
 expect(b.beanId).toBe('b1');
 expect(b.shot).toMatchObject({pre:5,rest:3,yieldEstimated:false});
 expect(b.shot.full).toBeCloseTo(vol,0);
 expect(b.shot.drop).not.toBeNull();
 expect(b.prep.preinf).toEqual({on:true,val:'5'});
 // het detail laat de fasen zien
 await page.evaluate(id=>openDetail(id),b.id);
 await expect(page.locator('#detail-body')).toContainText('5 s pre + 3 s rest');
});

test('too fast and stopped early: the grind rule from the dial-in, judged on full pressure',async({page})=>{
 await open(page);
 await page.locator('#e61-btn').tap();
 await page.evaluate(()=>shot.snelheid(6));
 await page.locator('#sc-btns [data-a="start"]').tap();
 await shotTot(page,8+20);                       // 20 s volle druk < 25 s
 await expect(page.locator('#sc-strip')).toContainText('too fast — grind finer');
 await page.locator('#sc-btns [data-a="again"]').tap();
 await expect(page.locator('#sc-time')).toHaveText('0:00');
 await page.locator('#sc-btns [data-a="start"]').tap();
 await shotTot(page,3);
 await expect(page.locator('#sc-strip')).toContainText('stopped early');
 // de hendel in de tekening start en stopt ook
 await page.locator('#sc-btns [data-a="again"]').tap();
 await page.locator('#sc-art').tap();
 expect((await stand(page)).stand).toBe('run');
 await page.locator('#sc-art').tap();
 expect((await stand(page)).stand).toBe('done');
});

test('recipe sheet: rest and pre-infusion belong to the recipe and are kept',async({page})=>{
 await open(page);
 await page.locator('#e61-btn').tap();
 await page.locator('#sc-recbtn').tap();
 await expect(page.locator('#sc-sheet')).toHaveClass(/open/);
 const chip=await page.locator('#sc-sheet [data-a="pick"]').first().boundingBox();expect(chip.height).toBeGreaterThanOrEqual(48);
 await page.locator('#sc-sheet [data-a="r+"]').tap();
 await expect(page.locator('#sc-v-r')).toHaveText('0:04');
 await expect(page.locator('#sc-rd')).toContainText('pre 5 s · rest 4 s');
 expect((await stand(page)).plan.fs).toBe(9);
 expect(await page.evaluate(()=>state.recipePre['e-classic'])).toEqual({on:true,s:5,rust:4});
 // ander recept: light roast heeft 7 + 4 s en een eigen doel
 await page.locator('#sc-sheet [data-a="pick"][data-id="e-light"]').tap();
 await expect(page.locator('#sc-rn')).toHaveText('light roast 1:2.5');
 expect((await stand(page)).plan).toMatchObject({P:7,R:4,F:31,Y:45});
 expect(await page.evaluate(()=>formPrep.preinf)).toEqual({on:true,val:'7'});
 // lungo: geen pre-infusie, alles is volle druk
 await page.locator('#sc-sheet [data-a="pick"][data-id="e-lungo"]').tap();
 expect((await stand(page)).plan).toMatchObject({on:false,fs:0,F:33,Y:54});
 await expect(page.locator('#sc-rd')).toContainText('no pre-infusion');
 expect(await page.evaluate(()=>formPrep.preinf)).toEqual({on:false,val:''});
 await page.locator('#sc-sheet [data-a="preon"]').tap();
 expect((await stand(page)).plan).toMatchObject({on:true,P:5,R:3});
 await page.locator('#sc-sheet [data-a="sheet-dicht"]').tap();
 await expect(page.locator('#sc-sheet')).not.toHaveClass(/open/);
 // na herladen nog bewaard
 await page.waitForTimeout(300);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>currentPage==='home'&&typeof shot!=='undefined');
 expect(await page.evaluate(()=>[state.recipePre['e-classic'],state.recipePre['e-lungo'],state.lastRecipe.espresso]))
  .toEqual([{on:true,s:5,rust:4},{on:true,s:5,rust:3},'e-lungo']);
});

test('tare: weights in my gear, aim and check; use as dose',async({page})=>{
 await open(page);
 // in het profiel invullen
 await page.evaluate(()=>go('profile'));
 await page.getByRole('button',{name:/my gear/}).tap();
 await page.locator('#tare-naked').fill('512,4');await page.locator('#tare-naked').blur();
 await page.locator('#tare-ring').fill('38.6');await page.locator('#tare-ring').blur();
 await page.locator('#tare-ps1').fill('abc');await page.locator('#tare-ps1').blur();
 expect(await page.evaluate(()=>state.tare)).toEqual({naked:512.4,ring:38.6});
 await expect(page.locator('#tare-naked')).toHaveValue('512.4');
 await expect(page.locator('#tare-ps1')).toHaveValue('');
 const ib=await page.locator('#tare-naked').boundingBox();expect(ib.height).toBeGreaterThanOrEqual(48);
 await page.evaluate(()=>{go('dialin');});
 await page.locator('#e61-btn').tap();
 // nog niets aangetikt
 await expect(page.locator('#sc-tsum')).toContainText('nothing: 0.0 g · aim 18.0 g');
 await page.locator('#sc-tarerow').tap();
 await expect(page.locator('#sc-tp')).toHaveClass(/open/);
 await page.locator('#sc-parts [data-id="naked"]').tap();
 await page.locator('#sc-parts [data-id="ring"]').tap();
 await expect(page.locator('#sc-aim')).toHaveText('569.0 g');
 await expect(page.locator('#sc-tsum')).toHaveText('naked + ring: 551.0 g · aim 569.0 g');
 // double spout heeft nog geen gewicht: dan opent my gear
 await page.locator('#sc-parts [data-id="spout"]').tap();
 await expect(page.locator('#sc-gear')).toHaveClass(/open/);
 await page.locator('#sc-g-spout').fill('548');
 await page.locator('#sc-gear [data-a="gear-dicht"]').tap();
 expect(await page.evaluate(()=>state.tare.spout)).toBe(548);
 // naked en double spout sluiten elkaar uit
 await page.locator('#sc-parts [data-id="spout"]').tap();
 await expect(page.locator('#sc-parts [data-id="naked"]')).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('#sc-aim')).toHaveText('604.6 g');
 await page.locator('#sc-parts [data-id="naked"]').tap();
 await expect(page.locator('#sc-parts [data-id="spout"]')).toHaveAttribute('aria-pressed','false');
 // controle
 await expect(page.locator('#sc-usedose')).toBeDisabled();
 await page.locator('#sc-chkin').fill('569,4');
 await expect(page.locator('#sc-real')).toHaveText('18.4 g');
 await expect(page.locator('#sc-diff')).toHaveText('+0.4 g');
 await expect(page.locator('#sc-res')).toContainText('0.4 g too much');
 await page.locator('#sc-chkin').fill('9999');
 await expect(page.locator('#sc-res')).toContainText("doesn't add up");
 await page.locator('#sc-chkin').fill('568.8');
 await expect(page.locator('#sc-diff')).toHaveText('−0.2 g');
 await page.locator('#sc-chkin').fill('569.4');
 await page.locator('#sc-usedose').tap();
 await expect(page.locator('#sc-tp')).not.toHaveClass(/open/);
 await expect(page.locator('#sc-rd')).toHaveText('18.4 → 36 g · pre 5 s · rest 3 s · full 0:28');
 await expect(page.locator('#sc-tsum')).toContainText('dose 18.4 g');
 // de shot gebruikt die dosis in het dial-in-scherm
 await page.evaluate(()=>shot.snelheid(8));
 await page.locator('#sc-btns [data-a="start"]').tap();
 await shotTot(page,36);
 await page.locator('#sc-btns [data-a="use"]').tap();
 await expect(page.locator('#di-dose')).toHaveValue('18.4');
 await expect(page.locator('#di-yield')).toHaveValue('36');   // doel blijft, gewicht niet nagewogen
 // de keuze van onderdelen is bewaard
 expect(await page.evaluate(()=>state.tareOn)).toMatchObject({naked:true,ring:true,spout:false});
});

test('closing while running asks first; feature off hides the card',async({page})=>{
 await open(page);
 await page.locator('#e61-btn').tap();
 await page.locator('#sc-btns [data-a="start"]').tap();
 page.once('dialog',d=>d.dismiss());
 await page.locator('#sc-dicht').tap();
 await expect(page.locator('#shotclock')).toBeVisible();
 page.once('dialog',d=>d.accept());
 await page.locator('#sc-dicht').tap();
 await expect(page.locator('#shotclock')).toBeHidden();
 await expect(page.locator('#di-time')).toHaveValue('');
 await page.evaluate(()=>{state.features=state.features||{};state.features.shotclock=false;renderDiClock();e61Toggle();});
 await expect(page.locator('#di-clock-card')).toBeHidden();
 await expect(page.locator('#shotclock')).toBeHidden();
});
