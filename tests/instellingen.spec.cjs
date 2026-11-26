const{test,expect}=require('@playwright/test');
// Settings herindeling (26-11, docs/opzet-instellingen.html): grote kaart bovenaan,
// functies per onderwerp met "x of y on", en er mag geen instelling verdwijnen.
async function open(page){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof BrewWorkspace!=='undefined'&&currentPage==='home');
}
// alles wat vóór de herindeling op Settings stond (id's uit index.html van 25-11)
const OUDE_IDS=['acct-card','acct-body','volg-card','volg-body','beheer-card','beheer-body','gear-card','gear-list','gear-name','gear-kind',
 'gear-cat-pick','tare-gear','pair-card','pair-btn','week-card','tm-card','tm-body','ai-card','ai-toggle','ai-key-wrap','ai-prov-chips','ai-key',
 'ai-model-wrap','ai-bud-wrap','ai-off-note','stem-card','stem-key','stem-kies','stem-status','reminder-card','reminder-toggle','reminder-time',
 'push-url','feat-card','feat-list','shortcut-card','shortcut-list','share-card','backup-card','save-status','api-card','api-stat','adv-card','about-card'];
// zichtbaar als je de rij (en alles waar hij in zit) openklapt; sommige zitten achter een vlag of AI
const ACHTER_VLAG={'acct-card':'account','acct-body':'account','volg-card':'social','volg-body':'social','pair-card':'pairing','pair-btn':'pairing','tm-card':'tastememory','tm-body':'tastememory'};
const ONZICHTBAAR=['reminder-time','push-url','beheer-card','beheer-body','ai-key-wrap','ai-prov-chips','ai-key','ai-model-wrap','ai-bud-wrap','tm-body','gear-list','shortcut-list','save-status','stem-status','api-stat','ai-off-note','tare-gear','acct-body','volg-body','beheer-body','tm-card','tm-body'];

test('no setting is lost: every old card and field is still in Settings, and every feature has its switch',async({page})=>{
 await open(page);
 await page.evaluate(()=>{state.features=state.features||{};for(const id of ['account','social','pairing','tastememory'])state.features[id]=true;go('profile');});
 for(const id of OUDE_IDS){
  const n=await page.locator('#page-profile #'+id).count();
  expect(n,id).toBe(1);
  if(ONZICHTBAAR.includes(id))continue;
  await page.evaluate(i=>setToon(i),id);
  await expect(page.locator('#'+id),id).toBeVisible();
 }
 // elke vlag heeft een schakelaar (account en social: via de grote kaart en hun eigen rij)
 const vlaggen=await page.evaluate(()=>FEATURES.map(f=>f.id));
 for(const id of vlaggen){
  if(id==='account'||id==='social')continue;
  const t=page.locator('#page-profile [data-feat="'+id+'"]').first();
  await expect(t,id).toHaveCount(1);
  await page.evaluate(i=>setToon(document.querySelector('#page-profile [data-feat="'+i+'"]').closest('.settings-card').id),id);
  await expect(t,id).toBeVisible();
 }
 // account en social staan niet meer in de lijst met functies
 await expect(page.locator('#feat-list [data-feat="account"], #feat-list [data-feat="social"]')).toHaveCount(0);
 expect(await page.evaluate(()=>FEATURES.some(f=>f.id==='account')&&FEATURES.some(f=>f.id==='social'))).toBe(true);
 // uitzetten kan in hun eigen rij
 await page.evaluate(()=>setToon('acct-card'));
 await expect(page.locator('#acct-card .acct-uit')).toBeVisible();
 await page.evaluate(()=>setToon('volg-card'));
 await expect(page.locator('#volg-uit')).toBeVisible();
});

test('four feature groups count what is on, a switch updates the count, AI budget and drawn edges live elsewhere',async({page})=>{
 await open(page);
 await page.evaluate(()=>go('profile'));
 const tel=g=>page.locator('#feat-n-'+g);
 const verwacht=await page.evaluate(()=>Object.fromEntries(Object.entries(FEAT_GROEPEN).map(([g,l])=>[g,l.filter(featOn).length+' of '+l.length+' on'])));
 for(const g of ['brewing','beans','tasting','sharing'])await expect(tel(g)).toHaveText(verwacht[g]);
 expect(await page.evaluate(()=>FEAT_GROEPEN.brewing.length+FEAT_GROEPEN.beans.length+FEAT_GROEPEN.tasting.length+FEAT_GROEPEN.sharing.length)).toBe(22);
 // dicht: geen schakelaars te zien; open: wel, met de nieuwe namen
 await expect(page.locator('#feat-g-brewing [data-feat="shotclock"]')).toBeHidden();
 await page.locator('#feat-g-brewing .adv-head').click();
 await expect(page.locator('#feat-g-brewing')).toContainText('shot clock (E61)');
 await expect(page.locator('#feat-g-brewing')).toContainText('espresso or filter first');
 await page.locator('#feat-g-brewing [data-feat="voice"]').click();
 await expect(tel('brewing')).toHaveText('8 of 8 on');
 await expect(page.locator('#feat-g-brewing')).toHaveClass(/open/);
 expect(await page.evaluate(()=>featOn('voice'))).toBe(true);
 await expect(page.locator('#ai-card [data-feat="aibudget"]')).toHaveCount(1);
 await expect(page.locator('#more-card [data-feat="drawnedges"]')).toHaveCount(1);
 await expect(page.locator('#feat-list [data-feat="aibudget"], #feat-list [data-feat="drawnedges"]')).toHaveCount(0);
 // de nieuwe namen van de onderwerpen
 const koppen=await page.locator('#page-profile .sect .hand').allTextContents();
 expect(koppen).toEqual(['you','your coffee','AI & voice','features','reminders & shortcuts','your data','more']);
});

test('big card: off shows "turn on account", which turns the flag on and opens sign-in; rows are drawn and buttons in ink',async({page})=>{
 await open(page);
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>go('profile'));
 const groot=page.locator('#set-groot');
 await expect(groot).toBeVisible();
 await expect(groot).toContainText('your account');
 await expect(page.locator('#acct-card')).toBeHidden();
 await page.locator('#groot-aan').click();
 expect(await page.evaluate(()=>featOn('account'))).toBe(true);
 await expect(page.locator('#acct-card')).toHaveClass(/open/);
 await expect(page.locator('#acct-login')).toBeVisible();
 await expect(groot).toContainText('not signed in');
 // ingelogd (nagebootst): handle, sync, privé en de knop voor volgen en feed
 await page.evaluate(()=>{acctIngelogd=()=>true;state.sync.user={handle:'jesse',visibility:'private',ai:true};state.sync.last=Date.now();aiLbKan=()=>true;aiLb.used=12;aiLb.limit=50;renderSetGroot();});
 await expect(groot).toContainText('@jesse');
 await expect(groot).toContainText('signed in · synced just now · private');
 await expect(groot).toContainText('AI 12 / 50 today');
 await expect(page.locator('#groot-volg')).toHaveText('turn on follow & feed');
 // getekende potloodlijnen op de grote kaart en op de rijen
 await page.waitForTimeout(400);
 expect(await page.evaluate(()=>!!document.querySelector('#set-groot>svg.rand-svg')&&!!document.querySelector('#gear-card>svg.rand-svg')&&!!document.querySelector('#feat-g-beans>svg.rand-svg'))).toBe(true);
 // op de donkere kaart lichte lijnen (papierkleur), anders vallen ze weg
 expect(await page.evaluate(()=>{const c=getComputedStyle(document.querySelector('#set-groot>svg.rand-svg'));return c.stroke===getComputedStyle(document.getElementById('set-groot')).color&&+c.opacity<1;})).toBe(true);
 // knoppen: inkt en lettertype van de app, geen systeemblauw
 const k=await page.evaluate(()=>{const b=document.getElementById('groot-volg'),c=getComputedStyle(b),d=getComputedStyle(document.body);return{kleur:c.color,ink:getComputedStyle(document.documentElement).getPropertyValue('--ink').trim(),font:c.fontFamily,bodyFont:d.fontFamily};});
 const rgb=hex=>'rgb('+[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(', ')+')';
 expect(k.kleur).toBe(rgb(k.ink));expect(k.font).toBe(k.bodyFont);
 if(process.env.SHOT_DIR){
  await page.evaluate(()=>{try{sluitNieuws();}catch(e){}document.getElementById('toast').classList.remove('show');document.getElementById('acct-card').classList.remove('open');renderProfile();document.querySelector('#page-profile .screen').scrollTop=0;});
  await page.waitForTimeout(400);
  await page.screenshot({path:process.env.SHOT_DIR+'/settings-390x844.png'});
  await page.evaluate(()=>{document.querySelector('#page-profile .screen').scrollTop=560;});
  await page.waitForTimeout(400);
  await page.screenshot({path:process.env.SHOT_DIR+'/settings-390x844-2.png'});
 }
});
