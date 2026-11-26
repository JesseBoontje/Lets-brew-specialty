const{test,expect}=require('@playwright/test');
// Route (25-11): boon -> brew -> dial-in of pour coach. Omni vraagt de weg, vorige keuze bovenaan.
async function open(page,maak){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.route('https://api.openai.com/**',r=>r.abort());
 if(maak)await page.addInitScript(maak);
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>currentPage==='home'&&typeof BrewWorkspace!=='undefined');
}
const zet=()=>{if(localStorage.getItem('rtTest'))return;localStorage.setItem('rtTest','1');
 localStorage.setItem('scc_state',JSON.stringify({methods:[
   {id:'espresso',name:'Espresso',family:'espresso',on:true},{id:'v60',name:'V60',family:'filter',on:true},{id:'aeropress',name:'AeroPress',family:'filter',on:true}],
  beans:[{id:'omni',name:'Guji omni',inStock:true,fam:'both',roast:'light'},
   {id:'esp',name:'Brazil',inStock:true,fam:'espresso'},
   {id:'fil',name:'Kenya',inStock:true,fam:'filter'},
   {id:'twee',name:'Duo',inStock:true,methods:['v60','aeropress']}],
  brews:[{id:'b1',method:'espresso',beanId:'omni',dose:18,yield:45,grind:'11',ts:Date.now()-86400000}],gear:[]}));};

test('omni bean asks the way, last choice on top, espresso lands on dial-in prefilled from the last shot',async({page})=>{
 await open(page,zet);
 await page.evaluate(()=>brewBean('omni'));
 const pop=page.locator('#route-pop');
 await expect(pop).toBeVisible();
 await expect(pop.locator('.route-knop')).toHaveCount(3);
 await expect(pop).toContainText('last time 18 g → 45 g');
 await expect(pop).toContainText('light roast');
 // kies V60: naar het formulier, en die keuze komt de volgende keer bovenaan
 await pop.locator('.route-knop[data-m="v60"]').tap();
 await expect(pop).toBeHidden();
 await expect(page.locator('#page-form')).toBeVisible();
 expect(await page.evaluate(()=>beanById('omni').lastMethod)).toBe('v60');
 await page.evaluate(()=>{go('home');brewBean('omni');});
 await expect(pop.locator('.route-knop').first()).toHaveAttribute('data-m','v60');
 // espresso: dial-in met dosis, yield en maalstand van het vorige shot met deze boon
 await pop.locator('.route-knop[data-m="espresso"]').tap();
 await expect(page.locator('#page-dialin')).toBeVisible();
 await page.waitForFunction(()=>document.getElementById('di-yield').value==='45');
 expect(await page.evaluate(()=>[document.getElementById('di-dose').value,document.getElementById('di-grind').value,formBean])).toEqual(['18','11','omni']);
});

test('espresso and filter beans go straight on; two own methods ask; switch off skips the question',async({page})=>{
 await open(page,zet);
 await page.evaluate(()=>brewBean('esp'));
 await expect(page.locator('#page-dialin')).toBeVisible();
 await expect(page.locator('#route-pop')).toBeHidden();
 await page.evaluate(()=>{go('home');brewBean('fil');});
 await expect(page.locator('#page-form')).toBeVisible();
 await expect(page.locator('#route-pop')).toBeHidden();
 await page.evaluate(()=>{go('home');brewBean('twee');});
 await expect(page.locator('#route-pop .route-knop')).toHaveCount(2);
 await page.evaluate(()=>{routeWeg();toggleFeature('route');go('home');brewBean('omni');});
 await expect(page.locator('#route-pop')).toBeHidden();
 await expect(page.locator('#page-dialin')).toBeVisible();
});

test('one Brews tab: five tabs, my brews and brew ideas, last choice remembered',async({page})=>{
 await open(page,zet);
 await expect(page.locator('#nav [data-p]:visible')).toHaveCount(5); // feed alleen met vlag social
 await expect(page.locator('#nav')).toContainText('Home');
 await page.locator('#nav [data-p="brews"]').tap();
 await expect(page.locator('#page-brews')).toBeVisible();
 await page.locator('#page-brews [data-ws="brews-kant"][data-value="ideas"]').tap();
 await expect(page.locator('#page-recipes')).toBeVisible();
 await expect(page.locator('#nav [data-p="brews"]')).toHaveClass(/on/);
 await expect(page.locator('#page-recipes [data-ws="brews-kant"][data-value="ideas"]')).toHaveClass(/selected/);
 await page.locator('#nav [data-p="home"]').tap();
 await page.locator('#nav [data-p="brews"]').tap();
 await expect(page.locator('#page-recipes')).toBeVisible();   // onthouden: brew ideas
 await page.locator('#page-recipes [data-ws="brews-kant"][data-value="my"]').tap();
 await expect(page.locator('#page-brews')).toBeVisible();
});
