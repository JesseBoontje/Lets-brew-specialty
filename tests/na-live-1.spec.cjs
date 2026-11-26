const{test,expect}=require('@playwright/test');
// Na live 1 (26-11): Lets Brew voice via de server, geen zwarte vlakken, AI-knoppen bij de
// coach, geen "wat is er nieuw", tabbalk dicht, Home-knoppen, methode-plaatjes die terugvallen.
const VOICE='AbCdEfGhIj0123456789';
async function open(page,init){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 if(init)await page.addInitScript(init);
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof BrewWorkspace!=='undefined'&&currentPage==='home');
}
const lbAan=()=>page=>page.evaluate(async()=>{
 state.features=state.features||{};state.features.account=true;
 state.sync={user:{handle:'jesse',visibility:'private',ai:true},lastHandle:'jesse',tomb:[],dialAt:{}};await save();
});
const donker=(page,sel)=>page.evaluate(s=>[...document.querySelectorAll(s)].filter(e=>e.offsetParent!==null).map(e=>{
 const m=getComputedStyle(e).backgroundColor.match(/[\d.]+/g).map(Number);return (m.length>3&&m[3]<.5)?255:m[0]*.299+m[1]*.587+m[2]*.114;}),sel);
// contrastverhouding (WCAG) tussen tekst en achtergrond van een element
const contrast=(page,sel)=>page.evaluate(s=>{const e=document.querySelector(s),cs=getComputedStyle(e);
 const L=c=>{const v=c.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.03928?x/12.92:((x+.055)/1.055)**2.4;});return .2126*v[0]+.7152*v[1]+.0722*v[2];};
 const a=L(cs.color),b=L(cs.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);},sel);

test('Lets Brew voice: choice in Settings, no key field, lines go to the server without a key',async({page})=>{
 const zeg=[],auth=[];
 await page.route('**/api/auth/me',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({user:{handle:'jesse',ai:true},ai:{used:0,limit:50}})}));
 await page.route('**/api/stem/voices',r=>{auth.push(r.request().headers()['authorization']||'');r.fulfill({contentType:'application/json',body:JSON.stringify({voices:[{voice_id:VOICE,name:'House',category:'premade'}],server:true,standaard:VOICE})});});
 await page.route('**/api/stem/zeg',r=>{auth.push(r.request().headers()['authorization']||'');zeg.push(JSON.parse(r.request().postData()));r.fulfill({status:200,contentType:'audio/mpeg',body:Buffer.from([0xff,0xfb,0x90,0,1,2,3])});});
 await open(page,()=>{HTMLMediaElement.prototype.play=function(){return Promise.resolve();};});
 await lbAan()(page);
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>{go('profile');setToon('stem-card');});
 await expect(page.locator('#stem-kies-lb')).toHaveClass(/sel/);
 await expect(page.locator('#stem-eigen')).toBeHidden();
 await expect(page.locator('#stem-key')).toBeHidden();
 await expect(page.locator('#stem-w')).toHaveText('Lets Brew voice');
 await page.locator('#stem-laad').click();
 await expect(page.locator('#stem-kies option')).toHaveCount(2);
 await page.locator('#stem-kies').selectOption(VOICE);
 await expect(page.locator('#stem-status')).toContainText('Lets Brew voice on: House');
 await page.getByRole('button',{name:'test the voice'}).click();
 await expect.poll(()=>zeg.length).toBeGreaterThan(0);
 expect(zeg[0].voice_id).toBe(VOICE);
 expect(auth.every(a=>a==='')).toBe(true);
 // own key: het uitlegblok en het sleutelveld komen terug
 await page.locator('#stem-kies-eigen').click();
 await expect(page.locator('#stem-eigen')).toBeVisible();
 await expect(page.locator('#stem-key')).toBeVisible();
 await expect(page.locator('#stem-w')).toHaveText('phone');
 expect(await page.evaluate(()=>BrewStem.stand().bron)).toBe('eigen');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
test('Lets Brew voice: daily limit or no server key falls back to the phone voice',async({page})=>{
 let n=0;
 await page.route('**/api/stem/zeg',r=>{n++;r.fulfill({status:429,contentType:'application/json',body:JSON.stringify({error:'Daily voice limit reached',code:'limit'})});});
 await open(page,()=>{window.__tel=[];const ss={speak:u=>window.__tel.push(u.text),cancel(){},getVoices:()=>[],addEventListener(){}};Object.defineProperty(window,'speechSynthesis',{value:ss,configurable:true});window.SpeechSynthesisUtterance=function(t){this.text=t;};HTMLMediaElement.prototype.play=function(){return Promise.resolve();};});
 await lbAan()(page);
 await page.evaluate(()=>BrewStem.zeg('Nu.'));
 await expect.poll(()=>page.evaluate(()=>window.__tel)).toContain('Nu.');
 expect(await page.evaluate(()=>BrewStem.stand())).toMatchObject({bron:'letsbrew',lbUit:'limit',actief:false});
 // daarna niet blijven proberen
 await page.evaluate(()=>BrewStem.zeg('Stop.'));
 await expect.poll(()=>page.evaluate(()=>window.__tel)).toContain('Stop.');
 expect(n).toBe(1);
 // zonder Lets Brew AI: altijd de eigen-sleutel-weg
 await page.evaluate(()=>{state.sync.user.ai=false;});
 expect(await page.evaluate(()=>BrewStem.stand().bron)).toBe('eigen');
});

test('no black surfaces: Settings card, selected chips and the feed card are brown and readable',async({page})=>{
 await open(page);
 await page.setViewportSize({width:390,height:844});
 const ink=58*.299+48*.587+42*.114;
 for(const p of ['beans','brews','recipes','profile','feed']){
  await page.evaluate(x=>go(x),p);await page.waitForTimeout(350);
  const l=await donker(page,'#page-'+p+' *');
  expect(l.every(v=>v>ink+5),p).toBe(true);
 }
 await page.evaluate(()=>go('profile'));
 expect(await contrast(page,'#set-groot')).toBeGreaterThanOrEqual(4.4);
 await page.evaluate(()=>go('beans'));
 const chip='[data-ws="shelf"].selected';
 await expect(page.locator(chip).first()).toBeVisible();
 expect(await contrast(page,chip)).toBeGreaterThanOrEqual(4.4);
});

test('coffee coach: the ask button follows the provider, drawn icons, English status lines',async({page})=>{
 await open(page);
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>{localStorage.setItem('scc_ai_on','1');localStorage.setItem('scc_ai_prov','openai');go('assistant');});
 await expect(page.locator('#ws-ai-send')).toHaveText('Ask with my AI key');
 await lbAan()(page);
 await page.evaluate(()=>{localStorage.setItem('scc_ai_prov','letsbrew');go('home');go('assistant');});
 await expect(page.locator('#ws-ai-send')).toHaveText('Ask Lets Brew AI');
 // geen emoji op de knoppen, wel getekende iconen zonder cirkels of rechthoeken
 const teksten=await page.locator('#page-assistant .ws-vraag-rij button').allTextContents();
 expect(teksten.join('')).not.toMatch(/[←-⯿\u{1f000}-\u{1faff}]/u);
 expect(await page.locator('#page-assistant .ws-vraag-rij button svg.acic').count()).toBe(3);
 expect(await page.locator('#page-assistant .ws-vraag-rij :is(circle,rect,ellipse)').count()).toBe(0);
 // nette rij: vragen over de hele breedte, praten en stoppen even groot naast elkaar
 const [a,b,c]=await Promise.all(['#ws-ai-send','#ws-voice-start','#ws-voice-stop'].map(s=>page.locator(s).boundingBox()));
 expect(Math.abs(b.y-c.y)).toBeLessThan(2);expect(Math.abs(b.height-c.height)).toBeLessThan(2);expect(Math.abs(b.width-c.width)).toBeLessThan(2);
 expect(a.width).toBeGreaterThan(b.width*1.8);
 // weggaan zonder gesprek zegt niets; een gestopt gesprek in het Engels
 await page.evaluate(()=>{go('home');go('assistant');});
 await expect(page.locator('#ws-voice-status')).toHaveText('');
 expect(await page.evaluate(()=>document.getElementById('page-assistant').innerText)).not.toMatch(/Gesprek|Microfoon|spraak/);
});

test('no "what is new" sheet, and nothing shows through or under the tab bar',async({page})=>{
 await open(page,()=>{try{localStorage.setItem('scc_seen_version','oud');}catch(e){}});
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(1200);
 await expect(page.locator('#whatsnew')).toHaveCount(0);
 const nav=await page.evaluate(()=>{const n=document.getElementById('nav'),cs=getComputedStyle(n);return {bg:cs.backgroundColor,z:+cs.zIndex,bd:cs.backdropFilter};});
 expect(nav.bg).not.toMatch(/rgba\(.*,\s*0?\.\d+\)/);
 expect(nav.z).toBeGreaterThanOrEqual(40);
 // op de tabbalk is de tabbalk zelf het bovenste element, ook op het randje en met een lange lijst
 const boven=await page.evaluate(()=>{const n=document.getElementById('nav').getBoundingClientRect(),uit=[];
  for(const x of [10,100,195,290,380])for(const y of [n.top+2,n.top+n.height/2,n.bottom-3]){const el=document.elementFromPoint(x,y);if(!el||!el.closest('#nav'))uit.push(x+','+Math.round(y)+' '+(el&&el.className));}return uit;});
 expect(boven).toEqual([]);
 // de pagina past boven de balk: het laatste element kan helemaal boven de balk komen
 await page.evaluate(()=>{const s=document.querySelector('#page-home .screen');s.scrollTop=s.scrollHeight;});
 const vrij=await page.evaluate(()=>{const s=document.querySelector('#page-home .screen'),kids=[...s.children].filter(k=>k.offsetParent!==null),laatst=kids[kids.length-1].getBoundingClientRect();return document.getElementById('nav').getBoundingClientRect().top-laatst.bottom;});
 expect(vrij).toBeGreaterThanOrEqual(0);
});

test('Home: no intro line, "＋ new brew" and "brew ideas" side by side, brew ideas opens Brews → brew ideas',async({page})=>{
 await open(page);
 await page.setViewportSize({width:390,height:844});
 await expect(page.locator('#page-home')).not.toContainText('Choose a recipe');
 await expect(page.locator('#page-home .ws-note')).toHaveCount(0);
 const nb=page.locator('#page-home [data-ws="new-brew"]'),bi=page.locator('#page-home [data-ws="library"]');
 await expect(nb).toHaveText('＋ new brew');await expect(bi).toHaveText('brew ideas');
 const [x,y]=await Promise.all([nb.boundingBox(),bi.boundingBox()]);
 expect(Math.abs(x.y-y.y)).toBeLessThan(1);expect(Math.abs(x.height-y.height)).toBeLessThan(1);expect(Math.abs(x.width-y.width)).toBeLessThan(2);
 const st=await page.evaluate(()=>[...document.querySelectorAll('#page-home [data-ws="new-brew"],#page-home [data-ws="library"]')].map(b=>{const c=getComputedStyle(b);return [c.fontSize,c.fontFamily,c.backgroundColor,c.borderRadius,c.paddingTop].join('|');}));
 expect(st[0]).toBe(st[1]);
 await bi.click();
 await expect(page.locator('#page-recipes')).toBeVisible();
 await expect(page.locator('#page-recipes [data-ws="brews-kant"][data-value="ideas"]')).toHaveClass(/selected/);
 await expect(page.locator('#nav [data-p="brews"]')).toHaveClass(/on/);
 // terug naar Brews via de tab houdt brew ideas vast
 await page.evaluate(()=>go('home'));await page.locator('#nav [data-p="brews"]').click();
 await expect(page.locator('#page-recipes')).toBeVisible();
});

test('method drawings fall back: unknown method on a synced brew, a broken path in an old state',async({page})=>{
 await open(page,()=>{
  if(localStorage.getItem('mtTest'))return;localStorage.setItem('mtTest','1');
  localStorage.setItem('scc_state',JSON.stringify({methods:[{id:'v60',name:'v60',glyph:'◭',img:'oud/v60-tekening.png',tint:'--v60',on:true,family:'filter'},{id:'espresso',name:'espresso',glyph:'☕',img:'m-espresso.png',tint:'--espresso',on:true,family:'espresso'}],
   beans:[{id:'b1',name:'Guji',inStock:true}],gear:[],
   brews:[{id:'x1',method:'v60',beanId:'b1',beans:'Guji',dose:15,yield:250,score:8,ts:Date.now()-1000},{id:'x2',method:'aeropress',beanId:'b1',beans:'Guji',dose:11,yield:200,score:7,ts:Date.now()-2000},{id:'x3',method:'lelit_x9',beanId:'b1',beans:'Guji',dose:18,yield:36,score:7,ts:Date.now()-3000}]}));
 });
 await page.evaluate(()=>go('home'));
 const imgs=page.locator('#recent-list .brew-thumb img');
 await expect(imgs).toHaveCount(3);
 // aeropress (niet in state.methods) en de onbekende krijgen een standaardtekening
 const src=await imgs.evaluateAll(l=>l.map(i=>i.getAttribute('src')));
 expect(src[1]).toBe('m-aeropress.png');
 expect(src[2]).toMatch(/^m-(v60|espresso)\.png$/);
 // het kapotte pad laadt niet en valt terug op m-v60.png
 await expect.poll(()=>imgs.first().evaluate(i=>i.getAttribute('src'))).toBe('m-v60.png');
 await expect.poll(()=>imgs.evaluateAll(l=>l.every(i=>!i.hidden&&i.complete&&i.naturalWidth>0))).toBe(true);
});

test('names and labels: brew ideas wording, English pick buttons that stay still, no people in recipe names',async({page})=>{
 await open(page);
 const namen=await page.evaluate(()=>ALLE_RECEPTEN().filter(r=>!r.eigen).map(r=>r.naam).join(' | '));
 expect(namen).not.toMatch(/omgekeerd|klassiek|hybride|melkbasis/i);
 const alles=await page.evaluate(()=>JSON.stringify(ALLE_RECEPTEN().filter(r=>!r.eigen).map(r=>[r.naam,r.over,(r.stappen||[]).map(x=>x.d)]))+JSON.stringify(BREW_GUIDES));
 expect(alles).not.toMatch(/hoffmann|kasuya|\brao\b|\btay\b|wipvasutt/i);
 await page.evaluate(()=>beginBrew('aeropress'));
 if(!(await page.locator('#pc-pick').isVisible()))await page.locator('#pcard-recipe .pc-head').tap();
 await expect(page.locator('#pcard-recipe .pc-n')).toHaveText('brew idea');
 await expect(page.locator('#pc-pick .lp')).toHaveText(['standard','inverted']);
 await expect(page.locator('#pc-over')).not.toContainText('Hoffmann');
 // stilstaand: een nieuwe render houdt dezelfde knoppen (en dus dezelfde getekende randen)
 const voor=await page.evaluate(()=>{const b=document.querySelector('#pc-pick .lp');b.dataset.merk='1';return getComputedStyle(b).transitionDuration+'|'+getComputedStyle(b).animationName;});
 await page.evaluate(()=>{pourRecipes();pourRecipes();});
 expect(await page.evaluate(()=>document.querySelector('#pc-pick .lp').dataset.merk)).toBe('1');
 expect(voor).toBe('0s|none');
 await page.locator('#pc-pick .lp',{hasText:'inverted'}).tap();
 await expect(page.locator('#pc-pick .lp.sel')).toHaveText('inverted');
 // lege wishlist: geen uitlegtekst
 await page.evaluate(()=>{state.features=state.features||{};state.features.beanpick=true;state.wishlist=[];state.wensDicht=false;go('beans');});
 await expect(page.locator('#page-beans')).not.toContainText('nothing on your list yet');
});

test('brew idea editor: dose, water and temp at the top flow into the schedule, nothing typed twice',async({page})=>{
 await open(page);
 await page.evaluate(()=>openRecipe(null,'v60'));
 await expect(page.locator('#page-recipe')).toBeVisible();
 const gram=()=>page.evaluate(()=>recBewerk.stappen.map(s=>s.g===''?'':Math.round(s.g)));
 // het invulveld van de laatste giet (de stap met het totale water)
 const veld=async()=>page.locator('#rec-steps .r-g input').nth(await page.evaluate(()=>recLaatsteGiet()));
 const voor=await gram();const water0=+(await page.locator('#rec-water').inputValue()),dose0=+(await page.locator('#rec-dose').inputValue());
 expect(Math.max(...voor.filter(x=>x!==''))).toBe(water0);
 // andere dose: water loopt mee met de verhouding, schema schaalt mee
 await page.locator('#rec-dose').fill('20');
 const water1=Math.round(20*water0/dose0);
 await expect(page.locator('#rec-water')).toHaveValue(String(water1));
 await expect(await veld()).toHaveValue(String(water1));
 // ander water, cijfer voor cijfer getikt: laatste giet = totale water, geen grammen kwijt
 await page.locator('#rec-water').fill('');
 await page.locator('#rec-water').pressSequentially('300');
 await expect(await veld()).toHaveValue('300');
 const na=await gram();
 voor.forEach((g,i)=>{if(g!=='')expect(Math.abs(na[i]-g*300/water0)).toBeLessThanOrEqual(1);});
 // de laatste giet aanpassen schrijft het totale water bovenaan
 await (await veld()).fill('320');
 await expect(page.locator('#rec-water')).toHaveValue('320');
 // temp in een staptekst verandert mee
 await page.evaluate(()=>{recBewerk.stappen[0].d='bloom with water at '+document.getElementById('rec-temp').value+'°C';recSteps();});
 const t0=await page.locator('#rec-temp').inputValue();
 await page.locator('#rec-temp').fill(String(+t0-3));
 expect(await page.evaluate(()=>recBewerk.stappen[0].d)).toBe('bloom with water at '+(+t0-3)+'°C');
 // opslaan: de laatste giet is 100 % van het water
 await page.locator('#rec-naam').fill('Mijn v60');
 await page.locator('#page-recipe button[onclick="saveRecipe()"]').click();
 const r=await page.evaluate(()=>state.recipes.find(x=>x.naam==='Mijn v60'));
 expect(Math.round(r.dose*r.ratio)).toBe(320);
 expect(r.stappen.filter(s=>s.p>0).at(-1).p).toBeCloseTo(1,5);
});

test('brew idea editor: methods in one sideways row, only active ones, V60 can run on a Switch, nothing irrelevant',async({page})=>{
 await open(page);
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>{state.methods.find(m=>m.id==='chemex').on=false;state.gear=[{id:'g1',kind:'brewer',name:'Hario Switch',category:'filter'}];openRecipe(null,'v60');});
 const rij=page.locator('#rec-methods');
 // alleen actieve methodes
 const namen=await rij.locator('.lp').allTextContents();
 const aan=await page.evaluate(()=>state.methods.filter(m=>m.on).map(m=>m.name));
 expect(namen).toEqual(aan);expect(namen).not.toContain('chemex');
 // één rij, alleen zijwaarts
 const st=await rij.evaluate(e=>{const c=getComputedStyle(e),tops=[...e.querySelectorAll('.lp')].map(b=>Math.round(b.offsetTop));return {wrap:c.flexWrap,y:c.overflowY,x:c.overflowX,rijen:new Set(tops).size,sh:e.scrollHeight,ch:e.clientHeight};});
 expect(st).toMatchObject({wrap:'nowrap',y:'hidden',x:'auto',rijen:1});
 expect(st.sh).toBeLessThanOrEqual(st.ch+1);
 // V60 met Switch: schakelaar zichtbaar, zet de klep per stap aan
 const sw=page.locator('#rec-switch');
 await expect(sw).toBeVisible();
 await expect(page.locator('#rec-steps .r-klep')).toHaveCount(0);
 // een dripper is geen molen: niet bij de maalstand
 await expect(page.locator('#rec-molens')).not.toContainText('Hario Switch');
 await sw.click();
 await expect(sw).toHaveAttribute('aria-pressed','true');
 expect(await page.locator('#rec-steps .r-klep').count()).toBeGreaterThan(0);
 await expect(page.locator('#rec-steps .r-klep').first().locator('option')).toHaveText(['valve —','valve closed','valve open']);
 // stap-soorten in het Engels en passend bij filter
 const soorten=await page.locator('#rec-steps .r-rij select').first().locator('option').allTextContents();
 expect(soorten).toContain('pour');expect(soorten).not.toContain('giet');expect(soorten).not.toContain('shot');expect(soorten).not.toContain('flip');
 // espresso: geen Switch, geen AI-giet-schema-knop, geen filter-soorten
 await page.locator('#rec-methods .lp',{hasText:'espresso'}).click();
 await expect(sw).toBeHidden();
 await expect(page.locator('#rec-ai')).toBeHidden();
 await expect(page.locator('#rec-steps .r-klep')).toHaveCount(0);
 const esp=await page.locator('#rec-steps .r-rij select').first().locator('option').allTextContents();
 expect(esp).toContain('shot');expect(esp).not.toContain('swirl');expect(esp).not.toContain('pour');
 // zonder Switch in gear of methodes: geen schakelaar bij V60
 await page.evaluate(()=>{state.gear=[];openRecipe(null,'v60');});
 await expect(page.locator('#rec-switch')).toBeHidden();
});
