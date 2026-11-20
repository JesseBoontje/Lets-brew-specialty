const{test,expect}=require('@playwright/test');
// Stem voor de coaches: zonder eigen ElevenLabs-sleutel de telefoonstem; met
// sleutel en een stem uit de eigen lijst gaat elke zin via /api/stem/zeg.
// De sleutel staat nooit in localStorage, sessionStorage of de back-up.
const KEY='sk_'+'a1'.repeat(24), VOICE='AbCdEfGhIj0123456789';
const data={methods:[{id:'v60',name:'V60',family:'filter',on:true},{id:'aeropress',name:'AeroPress',family:'filter',on:true},{id:'espresso',name:'Espresso',family:'espresso',on:true}],
 beans:[{id:'b1',name:'Ethiopia Guji',inStock:true}],brews:[],gear:[],lastRecipe:{espresso:'e-classic'}};
async function boot(page,{stemAan=true,el=200}={}){
 const log={zeg:[],voices:0,auth:[]};
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.route('**/api/stem/voices',async r=>{log.voices++;log.auth.push(r.request().headers()['authorization']);
  await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({voices:[{voice_id:VOICE,name:'Mijn stem',category:'cloned'}]})});});
 await page.route('**/api/stem/zeg',async r=>{const b=JSON.parse(r.request().postData());log.zeg.push(b);log.auth.push(r.request().headers()['authorization']);
  if(el!==200)return r.fulfill({status:el,contentType:'application/json',body:'{"error":"nee"}'});
  await r.fulfill({status:200,contentType:'audio/mpeg',body:Buffer.from([0xff,0xfb,0x90,0x00,1,2,3,4])});});
 await page.addInitScript(([d,aan])=>{
  if(!localStorage.getItem('stTest')){localStorage.setItem('stTest','1');localStorage.setItem('scc_state',JSON.stringify(d));if(aan)localStorage.setItem('scc_gc_stem','1');}
  window.__tel=[];window.__play=[];
  const ss={speak:u=>window.__tel.push(u.text),cancel(){},getVoices:()=>[],addEventListener(){}};
  Object.defineProperty(window,'speechSynthesis',{value:ss,configurable:true});
  window.SpeechSynthesisUtterance=function(t){this.text=t;};
  HTMLMediaElement.prototype.play=function(){window.__play.push(this.src);return Promise.resolve();};
 },[data,stemAan]);
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home'&&typeof BrewStem!=='undefined');
 return log;
}
async function sleutelEnStem(page){
 await page.evaluate(()=>{go('profile');renderProfile();});
 await page.locator('#stem-card .adv-head').tap();
 await page.locator('#stem-key').fill(KEY);await page.locator('#stem-key').dispatchEvent('change');
 await expect(page.locator('#stem-key')).toHaveValue('');
 await page.getByRole('button',{name:'load my voices'}).tap();
 await expect(page.locator('#stem-kies option')).toHaveCount(2);
 await page.locator('#stem-kies').selectOption(VOICE);
 await expect(page.locator('#stem-status')).toContainText('ElevenLabs voice on: Mijn stem');
}
async function v60(page){
 await page.evaluate(()=>beginBrew('v60'));
 await expect(page.locator('#page-form')).toBeVisible();
 if(!(await page.locator('#pc-btn').isVisible()))await page.locator('#pcard-pour .pc-head').tap();
 await page.locator('#pc-btn').tap();
 await expect(page.locator('#gietcoach')).toBeVisible();
}
test('zonder sleutel: de telefoon zegt de stap, er gaat niets naar ElevenLabs',async({page})=>{
 const log=await boot(page);
 await v60(page);
 await page.locator('#gc-b-start').tap();
 await expect.poll(()=>page.evaluate(()=>window.__tel)).toContain('Over drie tellen bloom, naar 30 gram.');
 expect(log.zeg.length).toBe(0);
 await page.evaluate(()=>gc.snelheid(1));
});
test('met sleutel: instellingen, eigen stemmenlijst, en de gietcoach praat via ElevenLabs',async({page})=>{
 const log=await boot(page);
 await page.setViewportSize({width:390,height:844});
 await sleutelEnStem(page);
 // velden groot genoeg, geen zijwaarts scrollen
 for(const sel of ['#stem-key','#stem-kies']){const b=await page.locator(sel).boundingBox();expect(b.height).toBeGreaterThanOrEqual(48);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
 expect(log.auth.every(a=>a==='Bearer '+KEY)).toBe(true);
 // sleutel nergens bewaard, stem-id wel
 const opslag=await page.evaluate(()=>JSON.stringify({...localStorage})+JSON.stringify({...sessionStorage}));
 expect(opslag).not.toContain(KEY);expect(opslag).toContain(VOICE);
 // test-knop
 await page.getByRole('button',{name:'test the voice'}).tap();
 await expect.poll(()=>log.zeg.map(z=>z.text)).toContain('Over drie tellen bloom, naar 45 gram.');
 // gietcoach
 await v60(page);
 await page.locator('#gc-b-start').tap();
 await expect.poll(()=>log.zeg.map(z=>z.text)).toContain('Over drie tellen bloom, naar 30 gram.');
 await expect.poll(()=>log.zeg.map(z=>z.text)).toContain('Nu.');           // alvast opgehaald
 expect(log.zeg.every(z=>z.voice_id===VOICE)).toBe(true);
 await expect.poll(()=>page.evaluate(()=>window.__play.filter(s=>s.startsWith('blob:')).length)).toBeGreaterThanOrEqual(2);
 // de telefoon zei geen stap (alleen het stille wakker-maken)
 expect((await page.evaluate(()=>window.__tel)).filter(t=>t.trim())).not.toContain('Over drie tellen bloom, naar 30 gram.');
 // elke zin maar één keer opgehaald
 const teksten=log.zeg.map(z=>z.text);expect(new Set(teksten).size).toBe(teksten.length);
});
test('ElevenLabs weigert de sleutel: terug naar de telefoonstem',async({page})=>{
 const log=await boot(page,{el:401});
 await page.evaluate(([k,v])=>{BrewStem.zetSleutel(k);BrewStem.kiesStemId(v,'Mijn stem');},[KEY,VOICE]);
 await v60(page);
 await page.locator('#gc-b-start').tap();
 await expect.poll(()=>page.evaluate(()=>window.__tel)).toContain('Over drie tellen bloom, naar 30 gram.');
 expect(log.zeg.length).toBeGreaterThan(0);
 expect(await page.evaluate(()=>BrewStem.stand().afgewezen)).toBe(true);
});
test('AeroPress-coach praat via ElevenLabs',async({page})=>{
 const log=await boot(page);
 await page.evaluate(([k,v])=>{BrewStem.zetSleutel(k);BrewStem.kiesStemId(v,'Mijn stem');},[KEY,VOICE]);
 await page.evaluate(()=>beginBrew('aeropress'));
 if(!(await page.locator('#pc-btn').isVisible()))await page.locator('#pcard-pour .pc-head').tap();
 await page.locator('#pc-btn').tap();
 await expect(page.locator('#apcoach')).toBeVisible();
 await page.locator('#apcoach').getByRole('button',{name:/start/}).first().tap();
 await expect.poll(()=>log.zeg.length).toBeGreaterThan(1);
 expect(log.zeg[0].text).toMatch(/^Over drie tellen/);
});
test('shot clock: stappen hardop aan in het paneel, pre-infusie wordt gezegd',async({page})=>{
 const log=await boot(page,{stemAan:false});
 await page.evaluate(([k,v])=>{BrewStem.zetSleutel(k);BrewStem.kiesStemId(v,'Mijn stem');},[KEY,VOICE]);
 await page.evaluate(()=>{beginBrew('espresso');pickDiBean('b1');});
 await page.locator('#e61-btn').tap();
 await expect(page.locator('#shotclock')).toBeVisible();
 await page.locator('#sc-recbtn').tap();
 const tog=page.locator('#sc-sheet [data-a="stem"]');
 await expect(tog).toHaveAttribute('aria-pressed','false');
 const b=await tog.boundingBox();expect(b.height).toBeGreaterThanOrEqual(44);
 await tog.tap();
 await expect(tog).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#sc-sheet')).toContainText('ElevenLabs voice');
 await page.locator('#sc-sheet [data-a="sheet-dicht"]').tap();
 await page.locator('#sc-btns [data-a="start"]').tap();
 await expect.poll(()=>log.zeg.map(z=>z.text)).toContain('Pre-infusie.');
 await expect.poll(()=>log.zeg.map(z=>z.text)).toContain('Volle druk.');
 await page.evaluate(()=>shot.snelheid(10));
 await expect.poll(()=>page.evaluate(()=>shot.stand().fase)).toBe('full');
 await page.locator('#sc-btns [data-a="stop"]').tap();
});
