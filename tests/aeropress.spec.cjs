const{test,expect}=require('@playwright/test');
// De AeroPress-coach, normaal en omgekeerd (docs/opzet-aeropress.html): zelfde
// scherm als de gietcoach, met de tekening van kop, dop, kamer en plunjer.
// Normaal = Hoffmann (11 g, 200 g, drukken op 2:30), omgekeerd = Tay
// Wipvasutt (16 + 2 g, 100 g, omdraaien op 1:35, aanvullen tot 115 en 155 g).
const data={methods:[{id:'aeropress',name:'AeroPress',family:'filter',on:true},{id:'fp',name:'French press',family:'filter',on:true}],
 beans:[{id:'b1',name:'Ethiopia Guji',inStock:true}],brews:[],gear:[]};
async function open(page,mid){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.addInitScript(d=>{if(!localStorage.getItem('apTest')){localStorage.setItem('apTest','1');localStorage.setItem('scc_state',JSON.stringify(d));}},data);
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home'&&typeof ap!=='undefined');
 await page.evaluate(m=>{beginBrew(m);},mid);
 await expect(page.locator('#page-form')).toBeVisible();
 if(!(await page.locator('#pc-btn').isVisible()))await page.locator('#pcard-pour .pc-head').tap();
}
const stand=page=>page.evaluate(()=>ap.stand());
test('regular (Hoffmann): one pour, plunger, swirl, press; done fills the brew',async({page})=>{
 await open(page,'aeropress');
 // beide recepten staan klaar om te kiezen
 await expect(page.locator('#pc-pick')).toContainText('Hoffmann AeroPress');
 await expect(page.locator('#pc-pick')).toContainText('Tay omgekeerd');
 await page.locator('#pc-btn').tap();
 const coach=page.locator('#apcoach');
 await expect(coach).toBeVisible();
 await expect(page.locator('#gietcoach')).toHaveCount(0);
 await expect(page.locator('#ap-naam')).toHaveText('Hoffmann AeroPress');
 await expect(page.locator('#ap-info-l')).toContainText('regular');
 await expect(page.locator('#ap-r-nu')).toContainText('pour to');
 await expect(page.locator('#ap-r-nu')).toContainText('200 g');
 await expect(page.locator('#ap-r-volg')).toContainText('plunger in');
 let s=await stand(page);
 expect(s.om).toBe(false);
 expect(s.S.filter(x=>x.g).map(x=>x.g)).toEqual([200]);
 expect(s.S[0].dur).toBe(10);                      // 200 g op 5 g/s past niet in 10 s: dan 10 s
 expect(s.S.map(x=>x.actie)).toEqual(['giet','plunjer','wacht','swirl','wacht','pers']);
 expect(s.eind).toBe(180);                         // drukken 2:30 + 30 s
 expect(s.uit).toBe(185);                          // 200 g min 1,4 g per gram koffie
 for(const id of ['#ap-b-stem','#ap-b-start','#ap-b-volg','#ap-b-dicht']){
  const b=await page.locator(id).boundingBox();expect(b.height).toBeGreaterThanOrEqual(48);expect(b.width).toBeGreaterThanOrEqual(48);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
 // de tekening: plunjer zakt pas bij het drukken, de kop vult dan
 const sc=await page.evaluate(()=>[ap.scene(5),ap.scene(60),ap.scene(165),ap.scene(181)]);
 expect(sc[0].pour).toBe(true);
 expect(sc[0].plA).toBe(0);
 expect(sc[1].plA).toBe(1);
 expect(sc[1].cupG).toBe(0);
 expect(sc[2].cupG).toBeGreaterThan(20);
 expect(sc[2].cupG).toBeLessThan(185);
 expect(sc[3].cupG).toBeCloseTo(185,0);
 // start: eerst 3 tellen af
 await page.locator('#ap-b-start').tap();
 await expect(page.locator('#ap-tijd')).toHaveText(/^[123]$/);
 // de swirl duurt 5 s; op 30x is dat 0,17 s en mist een trage browser (WebKit)
 // hem. Rond de swirl dus even op gewone snelheid, daarna weer snel.
 await page.evaluate(()=>ap.snelheid(30));
 await page.waitForFunction(()=>ap.stand().t>=115);
 await page.evaluate(()=>ap.snelheid(1));
 await page.waitForFunction(()=>ap.stand().t>=121);
 await expect(page.locator('#ap-r-nu')).toContainText('swirl');
 await page.evaluate(()=>ap.snelheid(30));
 await page.waitForFunction(()=>ap.stand().t>=151);
 await expect(page.locator('#ap-r-nu')).toContainText('press');
 await page.waitForFunction(()=>ap.stand().eindOp!=null);
 await expect(page.locator('#ap-b-volg')).toHaveText('done');
 await page.locator('#ap-b-volg').tap();
 await expect(page.locator('#ap-r-nu')).toContainText('done');
 const uit=await page.evaluate(()=>({total:pc.total,time:document.getElementById('f-time').value,bg:document.getElementById('f-bloom-g').value,dr:document.getElementById('f-draw').value,draw:pc.draw}));
 expect(uit.total).toBe(Math.round((await stand(page)).eindT));
 expect(uit.total).toBeGreaterThanOrEqual(180);
 expect(uit.time).toBe(Math.floor(uit.total/60)+':'+String(uit.total%60).padStart(2,'0'));
 expect(uit.bg).toBe('');
 expect(uit.dr).toBe('');                           // geen doorlooptijd bij een AeroPress
 expect(uit.draw).toBe(null);                           // geen bloom bij deze AeroPress
 await page.locator('#ap-b-start').tap();
 await expect(coach).toBeHidden();
 await expect(page.locator('#pc-btn')).toHaveText('start again');
});
test('inverted (Tay): upside down until the flip, then press and top up; next step shifts the rest',async({page})=>{
 await open(page,'aeropress');
 await page.locator('#pcard-recipe .pc-head').tap();
 await page.locator('#pc-pick .lp',{hasText:'Tay omgekeerd'}).tap();
 if(!(await page.locator('#pc-btn').isVisible()))await page.locator('#pcard-pour .pc-head').tap();
 await page.locator('#pc-btn').tap();
 await expect(page.locator('#ap-naam')).toHaveText('Tay omgekeerd');
 await expect(page.locator('#ap-info-l')).toContainText('inverted');
 await expect(page.locator('#ap-r-vorige')).toContainText('upside down');
 let s=await stand(page);
 expect(s.om).toBe(true);
 expect(s.S.filter(x=>x.g).map(x=>x.g)).toEqual([100,115,155]);
 expect(s.S.filter(x=>x.g).map(x=>x.na)).toEqual([false,true,true]);
 expect(s.uit).toBe(75);                            // 100 g min 1,4 × 18 g, de bron zegt ~75 g
 expect(s.S.filter(x=>x.g).map(x=>x.van)).toEqual([0,75,115]);
 expect(s.S.map(x=>x.actie)).toEqual(['giet','wacht','roer','wacht','dose','wacht','roer','lucht','dop','wacht','keer','pers','giet','giet']);
 expect(s.eind).toBe(148);                          // 138 + 40 g op 5 g/s + 2 s
 const sc=await page.evaluate(()=>[ap.scene(32),ap.scene(46.5),ap.scene(80),ap.scene(100),ap.scene(124),ap.scene(146)]);
 expect(sc[0].rodA).toBeGreaterThan(0);              // roeren
 expect(sc[1].scA).toBeGreaterThan(0);               // de laatste 2 g
 expect(sc[2].theta).toBe(180);                      // nog omgekeerd, lucht eruit, dop erop
 expect(sc[2].off).toBe(0);
 expect(sc[2].capOff).toBe(0);
 expect(sc[3].theta).toBe(360);                      // omgedraaid
 expect(sc[4].cupG).toBeGreaterThan(65);
 expect(sc[5].cupG).toBeCloseTo(155,0);
 await page.locator('#ap-b-start').tap();
 await page.evaluate(()=>ap.snelheid(30));
 await page.waitForFunction(()=>ap.stand().cur===9);
 await page.evaluate(()=>ap.snelheid(1));
 // next step: omdraaien begint nu, met een donkere kaart
 await page.locator('#ap-b-volg').tap();
 await expect(page.locator('#ap-r-nu')).toContainText('flip');
 await expect(page.locator('#ap-r-nu')).toHaveClass(/keer/);
 // pauze houdt de klok stil
 await page.locator('#ap-b-start').tap();
 const t1=(await stand(page)).t;await page.waitForTimeout(400);
 expect((await stand(page)).t).toBe(t1);
 await page.locator('#ap-b-start').tap();
 // en nog eens: drukken begint nu, de rest schuift mee
 await page.locator('#ap-b-volg').tap();
 s=await stand(page);
 expect(s.cur).toBe(11);
 expect(s.starts[12]-s.starts[11]).toBeCloseTo(27,5);
 expect(s.starts[13]-s.starts[11]).toBeCloseTo(40,5);
 await expect(page.locator('#ap-r-nu')).toContainText('press');
 // sluiten halverwege: eerst vragen
 page.once('dialog',d=>d.dismiss());
 await page.locator('#ap-b-dicht').tap();
 await expect(page.locator('#apcoach')).toBeVisible();
 page.once('dialog',d=>d.accept());
 await page.locator('#ap-b-dicht').tap();
 await expect(page.locator('#apcoach')).toBeHidden();
 expect(await page.evaluate(()=>pc.total)).toBeGreaterThan(60);   // wat de klok zag, ook na het overslaan
});
test('a French press keeps the clock in the card',async({page})=>{
 await open(page,'fp');
 await expect(page.locator('#pc-pick')).not.toContainText('AeroPress');
 await expect(page.locator('#pc-pick')).not.toContainText('Tay');
 await page.locator('#pc-btn').tap();
 await expect(page.locator('#apcoach')).toHaveCount(0);
 await expect(page.locator('#pc-btn')).toHaveText('stop');
 await page.locator('#pc-btn').tap();
});
