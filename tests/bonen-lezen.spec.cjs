const{test,expect}=require('@playwright/test');
// Bonen lezen (25-11): foto verkleind als jpeg naar de AI, echte foutreden, foto ook op de wishlist.
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
async function open(page){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.addInitScript(()=>{localStorage.setItem('scc_ai_on','1');localStorage.setItem('scc_ai_key','sk-ant-test-'+'x'.repeat(30));});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>currentPage==='home'&&typeof BrewWorkspace!=='undefined');
}
test('label photo goes to the AI as a small jpeg and fills the form',async({page})=>{
 let lijf=null;
 await page.route('https://api.anthropic.com/**',async r=>{lijf=JSON.parse(r.request().postData());await r.fulfill({contentType:'application/json',body:JSON.stringify({content:[{type:'text',text:'{"name":"Finca Los Angeles","roaster":"Single Estate","origin":"El Salvador, Apaneca","process":"natural","variety":"Pacamara"}'}],usage:{input_tokens:10,output_tokens:10}})});});
 await open(page);
 await page.evaluate(()=>openBeanForm(false));
 await page.setInputFiles('#label-file',{name:'zak.png',mimeType:'image/png',buffer:png});
 await expect(page.locator('#b-name')).toHaveValue('Finca Los Angeles');
 const beeld=lijf.messages[0].content.find(c=>c.type==='image');
 expect(beeld.source.media_type).toBe('image/jpeg');
});
test('a failed read shows the reason, and the wishlist can take a photo too',async({page})=>{
 await page.route('https://api.anthropic.com/**',r=>r.fulfill({status:400,contentType:'application/json',body:JSON.stringify({error:{message:'Your credit balance is too low'}})}));
 await open(page);
 await page.evaluate(()=>openBeanForm(true));
 await expect(page.locator('#b-foto-rij')).toBeVisible();
 await page.setInputFiles('#label-file',{name:'zak.png',mimeType:'image/png',buffer:png});
 await expect(page.locator('#scan-status')).toContainText('credit balance is too low');
 await page.fill('#b-name','Wens met foto');
 await page.evaluate(()=>saveBean());
 expect(await page.evaluate(()=>!!(state.wishlist||[]).find(w=>w.naam==='Wens met foto').photo)).toBe(true);
});
