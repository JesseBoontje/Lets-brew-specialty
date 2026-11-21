const{test,expect}=require('@playwright/test');
// Kleine klussen (21-11): versheidsmeter met piekmelding, surprise me, realistischer AI-budget.
async function open(page,maak){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.route('https://api.openai.com/**',r=>r.abort());
 if(maak)await page.addInitScript(maak);
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>currentPage==='home'&&typeof BrewWorkspace!=='undefined');
}
// zet een state neer met datums relatief aan vandaag (in de browser uitgerekend)
const metBonen=()=>{if(localStorage.getItem('kkTest'))return;localStorage.setItem('kkTest','1');
 const dag=n=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-n);return d;};
 const iso=n=>{const d=dag(n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
 const brews=[[3,6],[5,7],[8,8.5],[10,9],[12,9],[15,8.5],[18,7],[22,6]].map(([d,s],i)=>({id:'g'+i,method:'v60',beanId:'guji',beans:'Guji',score:s,ts:dag(30-d).getTime(),dose:15,yield:250}));
 localStorage.setItem('scc_state',JSON.stringify({methods:[{id:'v60',name:'V60',family:'filter',on:true}],
  beans:[{id:'guji',name:'Guji',inStock:false,roastdate:iso(30)},{id:'kenya',name:'Kenya',inStock:true,fam:'filter',roast:'light',methods:['v60'],roastdate:iso(4)}],
  brews,gear:[]}));};

test('freshness: peak learned from own scores, otherwise the usual curve, and a quiet line on home',async({page})=>{
 await open(page,metBonen);
 const r=await page.evaluate(()=>({guji:freshPeak(beanById('guji')),kenya:freshPeak(beanById('kenya'))}));
 // Guji: 8 cijfers, best rond dag 10-12 → geleerd venster rond die dagen
 expect(r.guji.learned).toBe(true);expect(r.guji.from).toBe('bean');
 expect(r.guji.start).toBeGreaterThanOrEqual(7);expect(r.guji.start).toBeLessThanOrEqual(10);
 expect(r.guji.end).toBeGreaterThanOrEqual(12);expect(r.guji.end).toBeLessThanOrEqual(16);
 // Kenya: geen eigen cijfers en maar één boon met cijfers → gewone curve (filter vanaf dag 4)
 expect(r.kenya).toMatchObject({learned:false,start:4,end:21});
 const regel=page.locator('#peak-line');
 await expect(regel).toBeVisible();await expect(regel).toHaveText('Kenya is at its best from today');
 const box=await regel.boundingBox();expect(box.height).toBeGreaterThanOrEqual(48);
 await regel.tap();
 await expect(page.locator('#page-beans')).toBeVisible();
 await expect(page.locator('#beans-list .fg-peak').first()).toContainText('at its best now');
 await expect(page.locator('#beans-list .fg-peak').first()).toContainText('the usual curve');
 // uit te zetten
 await page.evaluate(()=>{toggleFeature('peakalert');go('home');});
 await expect(regel).toBeHidden();
});

test('surprise me without AI: a new recipe for a bean in stock, saved only after "brew this"',async({page})=>{
 await open(page,metBonen);
 await page.evaluate(()=>{Math.random=()=>0;});
 const verwacht=await page.evaluate(()=>{const t=recipesFor('v60').filter(r=>!r.eigen)[0];return{naam:t.naam,dose:t.dose+1,temp:Math.min(97,t.temp+2),ratio:t.ratio};});
 const voor=await page.evaluate(()=>state.recipes.length);
 await page.locator('#surprise-btn').tap();
 const pop=page.locator('#surprise-pop');
 await expect(pop).toBeVisible();
 await expect(pop).toContainText('Kenya');
 await expect(pop).toContainText(verwacht.naam);
 await expect(pop).toContainText(verwacht.dose+' g');           // de draai: een gram meer
 await expect(pop).toContainText(verwacht.temp+' °C');         // lichte branding: 2 graden warmer
 await expect(pop).toContainText(Math.round(verwacht.dose*verwacht.ratio)+' g');
 await expect(pop).toContainText('light roast');
 expect(await page.evaluate(()=>state.recipes.length)).toBe(voor);   // nog niets bewaard
 // geen AI: geen AI-knop
 await expect(pop.getByRole('button',{name:'make it smarter with AI'})).toHaveCount(0);
 for(const b of await pop.locator('button').all()){const bb=await b.boundingBox();expect(bb.height).toBeGreaterThanOrEqual(48);}
 await pop.getByRole('button',{name:'brew this'}).tap();
 await expect(pop).toBeHidden();
 const rec=await page.evaluate(()=>state.recipes[state.recipes.length-1]);
 expect(rec).toMatchObject({eigen:true,mid:'v60',beanId:'kenya',source:'surprise',dose:verwacht.dose,temp:verwacht.temp});
 await expect(page.locator('#page-form')).toBeVisible();
 expect(await page.evaluate(()=>formBean)).toBe('kenya');
 // geen zijwaarts scrollen op 390 px
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('surprise me with AI: validated recipe for the same bean, counted as a surprise question',async({page})=>{
 await open(page,metBonen);
 await page.evaluate(()=>{localStorage.setItem('scc_ai_on','1');setAiProv('anthropic');document.getElementById('ai-key').value='sk-ant-synthetic-key-1234567890';saveKey();
  const o=window.fetch;window.fetch=async(u,opt)=>{if(String(u).includes('api.anthropic.com')){window.kkBody=JSON.parse(opt.body);
   const recipe={name:'Kenia helder',methodId:'v60',beanId:'kenya',dose:15,output:250,temperature:95,grind:'medium-fijn',explanation:'Licht gebrand, dus heet en een langere bloom.',steps:[{seconds:0,action:'bloom',grams:45,text:'bloom'},{seconds:45,action:'giet',grams:150,text:'giet'},{seconds:80,action:'giet',grams:250,text:'giet af'},{seconds:120,action:'doorloop',text:'laten zakken'}]};
   return Response.json({content:[{type:'text',text:JSON.stringify(recipe)}],usage:{input_tokens:2000,output_tokens:500}});}return o(u,opt);};});
 await page.locator('#surprise-btn').tap();
 const pop=page.locator('#surprise-pop');
 await pop.getByRole('button',{name:'make it smarter with AI'}).tap();
 await expect(pop).toContainText('a recipe made for this bean');
 await expect(pop).toContainText('Kenia helder');
 const body=await page.evaluate(()=>JSON.stringify(window.kkBody));
 expect(body).toContain('Kenya');expect(body).not.toContain('sk-ant-synthetic');
 // 2000 in × $3/M + 500 uit × $15/M = $0.0135 (claude-sonnet-4-6)
 const tel=await page.evaluate(()=>aiBud().bron['anthropic:surprise']);
 expect(tel.n).toBe(1);expect(tel.ti).toBe(2000);expect(tel.tu).toBe(500);expect(tel.d).toBeCloseTo(0.0135,6);
 await pop.getByRole('button',{name:'brew this'}).tap();
 const rec=await page.evaluate(()=>state.recipes[state.recipes.length-1]);
 expect(rec).toMatchObject({naam:'Kenia helder',beanId:'kenya',mid:'v60',source:'surprise-ai',dose:15,temp:95});
});

test('AI budget: price follows the model, estimates include your own context, old counts keep working',async({page})=>{
 await open(page,()=>{if(localStorage.getItem('kkB'))return;localStorage.setItem('kkB','1');
  localStorage.setItem('scc_ai_prijs_anthropic',JSON.stringify({in:9,uit:9}));});   // oude, ene prijs voor de aanbieder
 const r=await page.evaluate(()=>{localStorage.setItem('scc_ai_on','1');setAiProv('anthropic');
  document.getElementById('ai-key').value='sk-ant-synthetic-key-1234567890';saveKey();
  const uit={};const per=()=>{const t=aiTarief();return [Math.round(t.in*1e8)/100,Math.round(t.uit*1e8)/100,t.bron];};
  setAiModel('claude-opus-5-5');uit.opus=per();
  setAiModel('claude-haiku-5-5');uit.haiku=per();
  setAiModel('claude-sonnet-4-6-20260101');uit.dated=per();
  setAiModel('mijn-eigen-model');uit.onbekendOud=per();     // niet in de lijst: oude eigen prijs
  document.getElementById('ai-prijs-in').value='1';document.getElementById('ai-prijs-uit').value='2';setAiPrijs();uit.eigen=per();
  setAiModel('claude-opus-5-5');uit.terug=per();             // eigen prijs hoort bij dat ene model
  setAiModel('claude-sonnet-4-6');
  const c=aiContextTok();uit.c=c;
  uit.schat=aiPerVraag('brew');uit.hand=(1500+c)*3e-6+450*15e-6;
  state.ai.bron['anthropic:bean']={n:4,d:0.04};uit.oud=aiPerVraag('bean');      // oude telling, alleen dollars
  state.ai.bron['anthropic:learn']={n:3,d:9,tn:3,ti:3000,tu:900};uit.tok=aiPerVraag('learn');
  setAiModel('claude-haiku-5-5');uit.tokHaiku=aiPerVraag('learn');
  return uit;});
 expect(r.opus).toEqual([4,20,'list']);
 expect(r.haiku).toEqual([0.1,0.5,'list']);
 expect(r.dated).toEqual([3,15,'list']);
 expect(r.onbekendOud).toEqual([9,9,'own']);
 expect(r.eigen).toEqual([1,2,'own']);
 expect(r.terug).toEqual([4,20,'list']);
 expect(r.c).toBeGreaterThan(100);
 expect(r.schat).toBeCloseTo(r.hand,10);
 expect(r.oud).toBeCloseTo(0.01,10);
 expect(r.tok).toBeCloseTo((3000*3e-6+900*15e-6)/3,10);       // tokens × huidige prijs
 expect(r.tokHaiku).toBeCloseTo((3000*0.1e-6+900*0.5e-6)/3,10); // na wissel: nieuwe prijs
});

test('surprise me keeps the character of the base recipe: AeroPress inverted scales its steps, moka and pads stay out',async({page})=>{
 await open(page,()=>{if(localStorage.getItem('kkC'))return;localStorage.setItem('kkC','1');
  localStorage.setItem('scc_state',JSON.stringify({methods:[{id:'aeropress',name:'AeroPress',family:'filter',on:true},{id:'perculator',name:'Mokka pot',family:'filter',on:false},{id:'senseo',name:'Senseo',family:'filter',on:false}],
   beans:[{id:'col',name:'Colombia',inStock:true,methods:['aeropress']}],brews:[],gear:[]}));});
 const r=await page.evaluate(()=>{state.methods.forEach(m=>m.on=['aeropress'].includes(m.id));Math.random=()=>0.999999;surpriseOpen();return surprise.voorstel&&surprise.voorstel.recept;});
 // Tay omgekeerd 18 g / 155 g, draai "kortere verhouding" ×0,96 → 1:8,27 → 149 g
 expect(r.naam).toContain('Tay omgekeerd');
 expect(r.dose).toBe(18);expect(r.ratio).toBeCloseTo(8.27,2);
 const uit=Math.round(18*8.27);expect(uit).toBe(149);
 const teksten=r.stappen.map(s=>s.d).join(' | ');
 expect(teksten).toContain('giet '+Math.round(100*149/155)+' g water');   // 96 g
 expect(teksten).toContain('tot '+Math.round(115*149/155)+' g');          // 111 g
 expect(teksten).toContain('tot 149 g');
 await expect(page.locator('#surprise-pop')).toContainText('149 g');
 // alleen mokapot of pads aan: geen recept, wel een melding
 const leeg=await page.evaluate(()=>{surpriseWeg();state.methods.forEach(m=>m.on=['perculator','senseo'].includes(m.id));surpriseOpen();return surprise.voorstel;});
 expect(leeg).toBeNull();await expect(page.locator('#surprise-pop')).toBeHidden();
 // vlag uit: ook een melding of link opent hem niet
 const uit2=await page.evaluate(()=>{state.methods.forEach(m=>m.on=m.id==='aeropress');toggleFeature('surprise');go('home');quickBrew();return surprise.voorstel;});
 expect(uit2).toBeNull();
 await expect(page.locator('#surprise-btn')).toBeHidden();
});
