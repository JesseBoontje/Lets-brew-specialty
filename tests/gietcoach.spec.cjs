const{test,expect}=require('@playwright/test');
// De grote gietcoach voor de V60 en de Switch (docs/opzet-gietcoach-v60.html):
// start telt 3 tellen af, de stappen lopen met de klok mee, "next step" laat de
// volgende stap nu beginnen en schuift de rest mee, en klaar zet de tijden in
// het formulier. Andere filtermethodes houden de klok in de kaart.
const data={methods:[{id:'v60',name:'V60',family:'filter',on:true},{id:'switch',name:'Hario Switch',family:'filter',on:true},{id:'chemex',name:'Chemex',family:'filter',on:true}],
 beans:[{id:'b1',name:'Ethiopia Guji',inStock:true}],brews:[],gear:[]};
async function open(page,mid){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.addInitScript(d=>{if(!localStorage.getItem('gcTest')){localStorage.setItem('gcTest','1');localStorage.setItem('scc_state',JSON.stringify(d));}},data);
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home'&&typeof gc!=='undefined');
 await page.evaluate(m=>{beginBrew(m);},mid);
 await expect(page.locator('#page-form')).toBeVisible();
 if(!(await page.locator('#pc-btn').isVisible()))await page.locator('#pcard-pour .pc-head').tap();
}
const stand=page=>page.evaluate(()=>gc.stand());
test('V60: countdown, steps follow the clock, next step shifts the rest, done fills the brew',async({page})=>{
 await open(page,'v60');
 await page.locator('#pc-btn').tap();
 const coach=page.locator('#gietcoach');
 await expect(coach).toBeVisible();
 await expect(page.locator('#gc-naam')).toHaveText('Hoffmann V60');
 await expect(page.locator('#gc-r-nu')).toContainText('bloom');
 await expect(page.locator('#gc-r-nu')).toContainText('30 g');
 await expect(page.locator('#gc-r-volg')).toContainText('swirl');
 // 15 g op 1:16,7: 30 / 151 / 251 g, gietsnelheid 5 g/s
 let s=await stand(page);
 expect(s.S.filter(x=>x.g).map(x=>x.g)).toEqual([30,151,251]);
 expect(s.S[2].dur).toBeCloseTo(24.2,1);          // (151-30)/5
 expect(s.S[3].dur).toBeCloseTo(20,1);            // (251-151)/5
 expect(s.droog).toEqual([180,210]);              // uit "droog rond 3:00 tot 3:30"
 // knoppen groot genoeg voor handschoenen, geen zijwaarts scrollen
 for(const id of ['#gc-b-stem','#gc-b-start','#gc-b-volg','#gc-b-dicht']){
  const b=await page.locator(id).boundingBox();expect(b.height).toBeGreaterThanOrEqual(48);expect(b.width).toBeGreaterThanOrEqual(48);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
 // start: eerst 3 tellen af
 await page.locator('#gc-b-start').tap();
 await expect(page.locator('#gc-tijd')).toHaveText(/^[123]$/);
 await expect(page.locator('#gc-b-start')).toHaveText('pause');
 await page.evaluate(()=>gc.snelheid(20));
 await page.waitForFunction(()=>gc.stand().t>=12);
 await expect(page.locator('#gc-r-nu')).toContainText('swirl');
 await expect(page.locator('#gc-r-vorige')).toContainText('bloom');
 // pauze houdt de klok stil
 await page.locator('#gc-b-start').tap();
 const t1=(await stand(page)).t;await page.waitForTimeout(400);
 expect((await stand(page)).t).toBe(t1);
 await page.locator('#gc-b-start').tap();
 // next step: de giet naar 151 g begint nu, de rest schuift mee
 await page.evaluate(()=>gc.snelheid(1));
 await page.locator('#gc-b-volg').tap();
 s=await stand(page);
 expect(s.cur).toBe(2);
 const schuif=s.starts[2]-45;
 expect(schuif).toBeLessThan(0);
 expect(s.starts[3]-s.starts[2]).toBeCloseTo(30,5);
 expect(s.starts[5]-s.starts[2]).toBeCloseTo(75,5);
 await expect(page.locator('#gc-r-nu')).toContainText('151 g');
 // door naar het eind en klaar
 await page.evaluate(()=>gc.snelheid(30));
 await page.waitForFunction(()=>gc.stand().cur===5);
 await expect(page.locator('#gc-b-volg')).toHaveText('done');
 await page.locator('#gc-b-volg').tap();
 await expect(page.locator('#gc-r-nu')).toContainText('done');
 await expect(page.locator('#gc-b-start')).toHaveText('log it');
 const uit=await page.evaluate(()=>({total:pc.total,draw:pc.draw,marks:pc.marks,time:document.getElementById('f-time').value,
   dr:document.getElementById('f-draw').value,bg:document.getElementById('f-bloom-g').value}));
 const eind=(await stand(page)).eindT;
 expect(uit.total).toBe(Math.round(eind));
 expect(uit.draw).toBe(Math.round(uit.total-uit.marks[3]));   // vanaf de start van de laatste giet
 expect(uit.time).toBe(Math.floor(uit.total/60)+':'+String(uit.total%60).padStart(2,'0'));
 expect(uit.bg).toBe('30');
 await page.locator('#gc-b-start').tap();
 await expect(coach).toBeHidden();
 await expect(page.locator('#pc-btn')).toHaveText('start again');
});
test('Switch: valve closed until the drawdown, then open; closing mid-brew asks first',async({page})=>{
 await open(page,'switch');
 await page.locator('#pc-btn').tap();
 await expect(page.locator('#gc-naam')).toHaveText('Switch hybride');
 await expect(page.locator('#gc-klep-tag')).toBeVisible();
 await expect(page.locator('#gc-v60-lijn')).toBeHidden();
 await expect(page.locator('#gc-r-vorige')).toContainText('valve closed');
 await page.locator('#gc-b-start').tap();
 await page.evaluate(()=>gc.snelheid(30));
 await page.waitForFunction(()=>gc.stand().t>120);
 await expect(page.locator('#gc-klep-tag')).toHaveText('valve closed');
 expect((await stand(page)).serverG).toBeLessThan(0.5);      // dicht: niets in de server
 await page.waitForFunction(()=>gc.stand().t>165);
 await expect(page.locator('#gc-klep-tag')).toHaveText('valve open');
 expect((await stand(page)).serverG).toBeGreaterThan(5);
 // sluiten halverwege: eerst vragen; nee = blijft open
 page.once('dialog',d=>d.dismiss());
 await page.locator('#gc-b-dicht').tap();
 await expect(page.locator('#gietcoach')).toBeVisible();
 page.once('dialog',d=>d.accept());
 await page.locator('#gc-b-dicht').tap();
 await expect(page.locator('#gietcoach')).toBeHidden();
 expect(await page.evaluate(()=>pc.total)).toBeGreaterThan(160);
});
test('other filter methods keep the clock in the card',async({page})=>{
 await open(page,'chemex');
 await page.locator('#pc-btn').tap();
 await expect(page.locator('#gietcoach')).toHaveCount(0);
 await expect(page.locator('#pc-btn')).toHaveText('stop');
 await page.locator('#pc-btn').tap();
});
