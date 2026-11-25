/* ---------------- opslag: IndexedDB (grote quota) i.p.v. localStorage (~5MB) ---------------- */
const IDB_DB='scc_db', IDB_STORE='kv', IDB_KEY='scc_state';
let idbConn=null;
function idbOpen(){
  if(idbConn)return Promise.resolve(idbConn);   // verbinding hergebruiken i.p.v. telkens heropenen
  return new Promise((res,rej)=>{
    let rq;
    try{rq=indexedDB.open(IDB_DB,1);}catch(e){return rej(e);}
    rq.onupgradeneeded=()=>{const db=rq.result;if(!db.objectStoreNames.contains(IDB_STORE))db.createObjectStore(IDB_STORE);};
    rq.onsuccess=()=>{idbConn=rq.result;
      idbConn.onclose=()=>{idbConn=null;};
      idbConn.onversionchange=()=>{try{idbConn.close();}catch(e){}idbConn=null;};
      res(idbConn);};
    rq.onerror=()=>rej(rq.error);
  });
}
function idbGet(key){
  return idbOpen().then(db=>new Promise((res,rej)=>{
    const rq=db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).get(key);
    rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error);
  }));
}
function idbSet(key,val){
  return idbOpen().then(db=>new Promise((res,rej)=>{
    const tx=db.transaction(IDB_STORE,'readwrite');
    tx.objectStore(IDB_STORE).put(val,key);
    tx.oncomplete=()=>res();tx.onerror=tx.onabort=()=>rej(tx.error||new Error('idb-set'));
  }));
}
let storageBlocked=false;
let hadOpgeslagenData=false;   // draaide deze telefoon de app al eerder?
async function load(){
  let s=null;
  try{s=await idbGet(IDB_KEY);}catch(e){storageBlocked=true;throw e;}
  if(s!=null&&!(s&&s.methods&&s.brews)){storageBlocked=true;throw new Error('Unsupported stored data; export a backup before changing anything.');}
  // eenmalige migratie vanuit oude localStorage-opslag; daarna localStorage
  // leegmaken zodat de ~5MB-limiet daar geen schrijfacties meer blokkeert
  if(!(s&&s.methods&&s.brews)){
    try{
      const ls=JSON.parse(localStorage.getItem('scc_state'));
      if(ls&&ls.methods&&ls.brews){
        s=ls;
        try{await idbSet(IDB_KEY,s);localStorage.removeItem('scc_state');}catch(e){}
      }
    }catch(e){}
  }
  if(s&&s.methods&&s.brews){try{BrewSecurity.validateImport(s,{backup:true});}catch(e){storageBlocked=true;throw e;}hadOpgeslagenData=true;state=s;if(!state.beans)state.beans=[];if(!state.gear)state.gear=[];const gekoppeld=n=>(n.brews||[]).filter(b=>b&&b.beanId&&(n.beans||[]).some(x=>x.id===b.beanId)).length;const voor=gekoppeld(state);state=BrewModel.migrate(state);mergeMethodImages();try{bpMigreerWensen();}catch(e){}if((s.dataVersion||0)<2||gekoppeld(state)>voor)await save();return;}
  const demoB=demoBeans();
  state=BrewModel.migrate({methods:JSON.parse(JSON.stringify(DEFAULT_METHODS)),brews:demoBrews(demoB),beans:demoB,gear:[],prepItems:JSON.parse(JSON.stringify(DEFAULT_PREP))});
  save();
}
// vul standaard-afbeeldingen aan voor methodes die al opgeslagen waren zonder img
function mergeMethodImages(){
  let changed=false;
  state.methods.forEach(m=>{
    if(!m.img&&!m.customImg){
      // match op id, anders op naam (espresso/v60/aeropress/chemex/perculator/senseo)
      let def=DEFAULT_METHODS.find(d=>d.id===m.id);
      if(!def){const n=(m.name||'').toLowerCase();def=DEFAULT_METHODS.find(d=>n.includes(d.name)||d.name.includes(n));}
      if(def&&def.img){m.img=def.img;changed=true;}
    }
  });
  // perculator -> mokka pot: naam + tekening bijwerken bij bestaande gebruikers
  const perc=state.methods.find(m=>m.id==='perculator');
  if(perc){
    if(perc.name==='perculator'){perc.name='mokka pot';changed=true;}
    if(perc.img==='m-perculator.png'){perc.img='m-mokkapot.png';changed=true;}
  }
  if(!state.methods.find(m=>m.id==='senseo')){
    const sd=DEFAULT_METHODS.find(d=>d.id==='senseo');
    if(sd){state.methods.push(JSON.parse(JSON.stringify(sd)));changed=true;}
  }
  // senseo eenmalig aanzetten voor bestaande gebruikers (respecteert latere eigen keuze)
  if(!state.senseoDefaulted){
    const se=state.methods.find(m=>m.id==='senseo');
    if(se&&!se.on){se.on=true;}
    state.senseoDefaulted=true;changed=true;
  }
  // familie (espresso/filter) invullen waar die nog ontbreekt
  state.methods.forEach(m=>{
    if(!m.family){m.family=METHOD_FAMILY_DEFAULTS[m.id]||'filter';changed=true;}
  });
  if(!state.features){state.features={};changed=true;}
  normaliseerData(state);
  if(!Array.isArray(state.latteShots)){state.latteShots=[];changed=true;}
  // persoonlijke puck-prep-lijst aanmaken als die er nog niet is
  if(!Array.isArray(state.prepItems)){state.prepItems=JSON.parse(JSON.stringify(DEFAULT_PREP));changed=true;}
  // Historical attempts are facts: never collapse or remove them.
  state.dialInCollapsed=true;
  if(changed)save();
}
// een dial-in-recept: precies één per boon+methode+drank (pogingen overschrijven, geen kopieën)
/* Lijstvelden uit een back-up of een bestand van een vriend kunnen van alles zijn.
   Een tekenreeks komt door een `x && x.length`-controle heen en klapt daarna om op
   .map(). Alles wat binnenkomt gaat daarom eerst hierlangs. */
function asArr(v){return Array.isArray(v)?v:(v==null||v==='')?[]:[v];}
function normaliseerData(st){
  if(!st||typeof st!=='object')return st;
  ['brews','beans','methods','gear','prepItems','latteShots','recipes'].forEach(k=>{
    if(k in st && !Array.isArray(st[k]))st[k]=[];
  });
  (st.brews||[]).forEach(b=>{
    if(!b||typeof b!=='object')return;
    b.tags=asArr(b.tags).filter(t=>t!=null).map(t=>(''+t));
    b.custom=asArr(b.custom).filter(c=>c&&typeof c==='object');
    if(b.prep&&typeof b.prep!=='object')b.prep={};
  });
  (st.beans||[]).forEach(b=>{
    if(!b||typeof b!=='object')return;
    b.methods=asArr(b.methods).filter(m=>typeof m==='string');
    if(b.dialIn&&typeof b.dialIn!=='object')b.dialIn=null;
  });
  return st;
}
function isDialInBrew(x){
  if(!x)return false;
  if(typeof x.dialIn==='boolean')return x.dialIn;
  // oudere pogingen (van vóór de dialIn-vlag): espresso-familie, geen score, geen eigen titel
  return methodFamily(x.method)==='espresso' && !x.score && (!x.title || x.title===(x.drink||''));
}
let saveQueue=Promise.resolve(),pendingSaves=0,lastSaveError=null;
function save(){
  if(storageBlocked){toast('Stored data need checking. Export a backup before changing anything.');return Promise.resolve(false);}
  const snapshot=structuredClone(state);pendingSaves++;
  const task=saveQueue.catch(()=>{}).then(()=>idbSet(IDB_KEY,snapshot)).then(()=>{lastSaveError=null;document.getElementById('ws-save-error')?.remove();return true;}).catch(()=>{
    lastSaveError=true;let el=document.getElementById('ws-save-error');if(!el){el=document.createElement('div');el.id='ws-save-error';el.setAttribute('role','alert');el.style.cssText='position:fixed;z-index:9999;top:0;left:0;right:0;background:#fff3d6;color:#6d321d;padding:12px;font-size:14px';document.body.append(el);}el.textContent='Saving failed. Keep this app open and make a backup via Settings → Data and sharing.';return false;
  }).finally(()=>pendingSaves--);saveQueue=task;return task;
}
window.addEventListener('beforeunload',e=>{if(pendingSaves||lastSaveError){e.preventDefault();e.returnValue='';}});
// "✓ opgeslagen" label bewust uitgezet: op verzoek niet meer tonen op het
// startscherm/splash noch op andere pagina's. Opslaan gebeurt nog steeds
// automatisch (zie save()), alleen zonder zichtbaar label.
let savedT;
function showSaved(){
  return;
}
// demo-brews horen, net als echte brews, elk bij een demo-boon
function demoBrews(beans){
  const id=naam=>((beans||[]).find(b=>b.name===naam)||{}).id||null;
  return [
    {id:uid(),method:'v60',beanId:id('Ethiopia Guji'),beans:'Ethiopia Guji',dose:18,yield:300,ratio:16.7,time:'3:42',temp:92,score:8.6,notes:'balanced & smooth. great clarity.',ts:Date.now()-3600e3},
    {id:uid(),method:'aeropress',beanId:id('Guatemala Huehuetenango'),beans:'Guatemala Huehuetenango',dose:17,yield:270,ratio:15.9,time:'2:15',temp:85,score:8.2,notes:'clean & sweet. soft finish.',ts:Date.now()-9e7},
    {id:uid(),method:'senseo',beanId:id('Classic Red'),beans:'Classic Red',dose:15,yield:180,ratio:12,time:'0:30',temp:90,score:5.5,notes:'quick cup. does the job.',guide:'1. place pad in holder\n2. fill reservoir with water\n3. press the button\n4. done',ts:Date.now()-18e7},
  ];
}
function demoBeans(){return [
  {id:uid(),name:'Ethiopia Guji',roaster:'Friedhats',origin:'Guji, Ethiopia',process:'washed',variety:'heirloom',altitude:'1900-2100',roastdate:'',roasternotes:'jasmine, peach, black tea',method:'v60',methods:['v60'],inStock:true,notes:''},
  {id:uid(),name:'Guatemala Huehuetenango',roaster:'Friedhats',origin:'Huehuetenango, Guatemala',process:'washed',variety:'bourbon, caturra',altitude:'1700-1900',roastdate:'',roasternotes:'red apple, caramel, cocoa',method:'aeropress',methods:['aeropress'],inStock:true,notes:''},
  {id:uid(),name:'Classic Red',roaster:'Senseo',origin:'Brazil',process:'ground',variety:'',altitude:'',roastdate:'',roasternotes:'chocolate, nuts, full-bodied',method:'senseo',methods:['senseo'],inStock:true,notes:'everyday coffee. always in stock.'},
];}
function uid(){return Math.random().toString(36).slice(2,9);}
function beanById(id){return state.beans.find(b=>b.id===id);}
function methodById(id){return state.methods.find(m=>m.id===id)||{name:id,glyph:'☕',tint:'--card'};}

