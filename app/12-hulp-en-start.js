/* ---------------- util ---------------- */
function jsArg(value){return esc(JSON.stringify(String(value??'')));}
function esc(s){return(s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
let toastT;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),1600);}

const _renderFormTags=renderFormTags;
renderFormTags=function(){_renderFormTags();try{renderTasteWheel();}catch(e){}};
const loadPromise=load();
// vraag de browser om de opslag permanent te maken (beschermt tegen
// automatisch opruimen van lokale data door iOS/Safari bij weinig gebruik)
if(navigator.storage&&navigator.storage.persist){
  navigator.storage.persist().catch(()=>{});
}
loadPromise.then(()=>{if(apiPagina())return;try{applyFeatures();}catch(e){}try{applyAIVisibility();}catch(e){}try{checkReminderOnOpen();}catch(e){}}).catch(()=>toast('Stored data need checking. Export a backup via profile.'));

// app geopend vanuit een melding? -> pas na het laden/splash een nieuwe brew voorstellen
let pendingQuickBrew=/[?&]quickbrew=1/.test(location.search);
let pendingBrewParam=(location.search.match(/[?&]brew=([^&]+)/)||[])[1]||null;
if('serviceWorker'in navigator){
  navigator.serviceWorker.addEventListener('message',e=>{
    if(e&&e.data&&e.data.type==='quick-brew'){
      if(currentPage==='welcome')pendingQuickBrew=true; else quickBrew();
    }
  });
}
// suggestie opnieuw checken wanneer de app naar de voorgrond komt
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){try{checkReminderOnOpen();}catch(e){}}});

// swipe van links naar rechts = terug (iOS-stijl)
(function(){
  let sx=0,sy=0,tracking=false;
  const ph=document.querySelector('.phone');
  if(!ph)return;
  ph.addEventListener('touchstart',e=>{
    if(e.touches.length!==1){tracking=false;return;}
    const t=e.touches[0];
    // alleen starten als de veeg dicht bij de linkerrand begint
    tracking = t.clientX < 45;
    sx=t.clientX;sy=t.clientY;
  },{passive:true});
  ph.addEventListener('touchend',e=>{
    if(!tracking)return;tracking=false;
    const t=e.changedTouches[0];
    const dx=t.clientX-sx, dy=t.clientY-sy;
    // duidelijke horizontale veeg naar rechts, weinig verticaal
    if(dx>70 && Math.abs(dy)<60){
      // niet terug vanaf splash/naam
      if(currentPage!=='welcome')goBack();
    }
  },{passive:true});
})();

// Start after all controllers are loaded; stored data is never replaced on read failure.
/* Het beginscherm: vier tekeningen van 0,35 s en dan het logo 0,6 s (samen
   2 s, zie de keyframes in styles.css). Een tik slaat over. Wie de app via
   een link naar een ander scherm, een snelkoppeling of een melding opent,
   gaat meteen door. Onder automatische tests ook meteen, tenzij een test
   window.__splashTest zet. */
const SPLASH_MS=2000;
function splashWacht(eerst){
  if(eerst!=='home'||pendingQuickBrew||pendingBrewParam)return Promise.resolve();
  if(navigator.webdriver&&!window.__splashTest)return Promise.resolve();
  const rest=SPLASH_MS-performance.now();
  if(rest<=0)return Promise.resolve();
  return new Promise(res=>{
    // op 'click' (na het loslaten), niet op pointerdown: anders landt de klik
    // van dezelfde tik op de knop die op home onder je vinger ligt. Voor de
    // zekerheid slikt de app daarna nog 400 ms elke klik in.
    const el=document.getElementById('page-welcome');let klaar=false;
    const slik=e=>{e.stopPropagation();e.preventDefault();};
    const door=e=>{if(klaar)return;klaar=true;if(el)el.removeEventListener('click',door);
      if(e){document.addEventListener('click',slik,true);setTimeout(()=>document.removeEventListener('click',slik,true),400);}
      res();};
    if(el)el.addEventListener('click',door);
    setTimeout(()=>door(),rest);
  });
}
window.addEventListener('DOMContentLoaded',()=>Promise.resolve(loadPromise).catch(()=>{}).then(async()=>{
  if(lbApiMode)return;
  const eerst=typeof BrewWorkspace!=='undefined'?BrewWorkspace.initialPage():'home';
  await splashWacht(eerst);
  go(eerst);
  try{randStart();}catch(e){}
  if(pendingQuickBrew){pendingQuickBrew=false;try{quickBrew();}catch{}}
  if(pendingBrewParam){const mid=decodeURIComponent(pendingBrewParam);pendingBrewParam=null;try{beginBrew(mid);}catch{}}
}),{once:true});
