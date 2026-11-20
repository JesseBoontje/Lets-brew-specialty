const{test,expect}=require('@playwright/test');
// Elke brew hoort bij een boon: oude brews worden op naam gekoppeld als dat eenduidig kan,
// de rest is zelf te koppelen, en nieuwe brews vragen altijd een boon. Er gaat niets verloren.
const legacy={methods:[{id:'v60',name:'V60',family:'filter',on:true},{id:'espresso',name:'espresso',family:'espresso',on:true}],
 beans:[{id:'b1',name:'Ethiopia Guji',inStock:true},{id:'b2',name:'Kenya',inStock:true},{id:'b3',name:'Kenya',inStock:false}],
 brews:[{id:'r1',method:'v60',beans:' ethiopia GUJI ',ts:1,dose:15,yield:250},
  {id:'r2',method:'v60',beans:'Kenya',ts:2},
  {id:'r3',method:'v60',beans:"O'Brien blend",ts:3},{id:'r4',method:'espresso',beans:"o'brien blend",ts:4},{id:'r5',method:'espresso',beans:"O'Brien Blend",ts:5},
  {id:'r6',method:'v60',beans:'',ts:6},
  {id:'r7',method:'v60',beanId:'b2',beans:'Kenya',ts:7}],gear:[]};
async function open(page,data){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 if(data)await page.addInitScript(d=>{if(!localStorage.getItem('linkTest')){localStorage.setItem('linkTest','1');localStorage.setItem('scc_state',JSON.stringify(d));}},data);
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home'&&typeof BrewWorkspace!=='undefined');
}
test('old brews link by exact name, the rest can be linked or turned into a bean, nothing is lost',async({page})=>{
 await open(page,legacy);
 const link=()=>page.evaluate(()=>Object.fromEntries(state.brews.map(b=>[b.id,b.beanId||null])));
 let l=await link();
 expect(l.r1).toBe('b1');            // precies één boon met die naam
 expect(l.r2).toBeNull();            // twee bonen heten Kenya: niet raden
 expect(l.r7).toBe('b2');            // bestaande koppeling blijft
 // de automatische koppeling is opgeslagen en overleeft herladen
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home');
 expect((await link()).r1).toBe('b1');
 await page.locator('#nav [data-p="brews"]').tap();
 const knop=page.locator('#all-list .unl-open');
 await expect(knop).toContainText('5 brews without a bean');
 await knop.tap();
 const rijen=page.locator('#all-list .unl-row');
 await expect(rijen).toHaveCount(3);  // Kenya, O'Brien blend (3 samen), zonder naam
 // Kenya koppelen aan de volle zak
 const kenya=rijen.filter({has:page.locator('.unl-n',{hasText:'Kenya'})});
 await kenya.locator('select').selectOption('b2');await kenya.getByRole('button',{name:'link'}).tap();
 expect((await link()).r2).toBe('b2');
 // van O'Brien blend een boon maken: alle drie de brews met die naam gaan mee
 await rijen.filter({has:page.locator('.unl-n',{hasText:"O'Brien"})}).getByRole('button',{name:/make bean/}).tap();
 const nieuw=await page.evaluate(()=>state.beans.find(b=>b.name==="O'Brien Blend"));   // naam van de nieuwste brew, zoals op de knop
 expect(nieuw.inStock).toBe(false);
 l=await link();expect([l.r3,l.r4,l.r5]).toEqual([nieuw.id,nieuw.id,nieuw.id]);
 await expect(knop).toContainText('1 brew without a bean');
 // een oude brew bewerken houdt de ingetypte naam
 await page.evaluate(()=>{state.brews.find(b=>b.id==='r6').beans='Nergens';openEdit(state.brews.find(b=>b.id==='r6'));});
 await expect(page.locator('#form-beans')).toContainText('not linked (Nergens)');
 await page.locator('#page-form .save-btn').tap();
 expect(await page.evaluate(()=>state.brews.find(b=>b.id==='r6').beans)).toBe('Nergens');
 await page.evaluate(()=>{state.brews.find(b=>b.id==='r6').beans='';});
 // niets weg: alle brews en hun ingetypte namen staan er nog
 const na=await page.evaluate(()=>state.brews.map(b=>b.id+'='+b.beans).sort());
 expect(na).toEqual(legacy.brews.map(b=>b.id+'='+b.beans).sort());
});
test('a new brew and a new shot cannot be saved without a bean; a new bean can be made on the way',async({page})=>{
 await open(page,legacy);
 const n0=await page.evaluate(()=>state.brews.length);
 await page.evaluate(()=>beginBrew('v60'));await expect(page.locator('#page-form')).toBeVisible();
 await expect(page.locator('#form-beans')).not.toContainText('none');
 await page.locator('#page-form .save-btn').tap();
 await expect(page.locator('#toast')).toContainText('pick a bean first');
 expect(await page.evaluate(()=>state.brews.length)).toBe(n0);
 await page.locator('#form-beans .lp',{hasText:'Ethiopia Guji'}).tap();
 await page.locator('#page-form .save-btn').tap();
 expect(await page.evaluate(()=>state.brews.length)).toBe(n0+1);
 expect(await page.evaluate(()=>state.brews[state.brews.length-1].beanId)).toBe('b1');
 // espresso: ook geen shot zonder boon
 await page.evaluate(()=>beginBrew('espresso'));await expect(page.locator('#page-dialin')).toBeVisible();
 await page.locator('#page-dialin .save-btn').tap();
 await expect(page.locator('#toast')).toContainText('pick a bean first');
 expect(await page.evaluate(()=>state.brews.length)).toBe(n0+1);
 // nieuwe boon vanuit het kiesscherm: na opslaan sta je bij je brew, met die boon gekozen
 await page.evaluate(()=>go('choosebean'));
 await page.getByRole('button',{name:'＋ add a new bean'}).tap();
 await expect(page.locator('#page-beanform')).toBeVisible();
 await page.locator('#b-name').fill('Rwanda Nyamasheke');
 await page.locator('#b-save').tap();
 const id=await page.evaluate(()=>state.beans.find(b=>b.name==='Rwanda Nyamasheke')?.id);
 expect(id).toBeTruthy();
 await expect.poll(()=>page.evaluate(()=>formBean)).toBe(id);
 expect(await page.evaluate(()=>['form','dialin'].includes(currentPage))).toBeTruthy();
});
test('a fresh install has demo brews that each belong to a demo bean',async({page})=>{
 await open(page);
 expect(await page.evaluate(()=>state.brews.every(b=>beanById(b.beanId)))).toBeTruthy();
});
