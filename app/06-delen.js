/* ---------------- delen met iemand zonder app (akkoord Jesse 25-11) ----------------
   docs/opzet-delen.html. Op een brew en op een boon hetzelfde menu:
   - send as a page: één los .html-bestand met recept en tekening erin (de tekening als
     data-URL, dus het opent overal zonder app en zonder internet);
   - save as PDF: hetzelfde blad via het printmenu (Bewaar als PDF / Deel);
   - send to a Lets Brew user: het bestaande bestand (shareOneBrew / shareOneBean).
   Geen server: er gaat niets online. Wat mee gaat staat in deelBrew/deelBoon; niet mee:
   je eigen notities, prijs van de zak, AI-sleutels, andere brews. Je naam alleen als je
   hem invulde (state.userName).
   Laadt na 06 en vóór 07; bij het laden draait hier niets.                              */
const DEEL_SITE='letsbrew.djez.app';
function deelDatum(ts){return ts?new Date(ts).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'';}
function deelRegel(b){
  // "V60, 15 g to 250 g, 2:45, 94 °C"
  const m=methodById(b.method);
  return [m?m.name:'',(b.dose&&b.yield)?b.dose+' g to '+b.yield+' g':(b.dose?b.dose+' g':''),b.time||'',b.temp?b.temp+' °C':''].filter(Boolean).join(', ');
}
function deelStappen(b){
  const r=b.recipeSnapshot;
  if(r&&Array.isArray(r.stappen)&&r.stappen.length)
    return r.stappen.filter(s=>s&&s.d).map(s=>({t:Number.isFinite(+s.t)?pourFmt(+s.t):'',d:String(s.d)}));
  if(b.guide)return String(b.guide).split('\n').map(x=>x.trim()).filter(Boolean).slice(0,20).map(d=>({t:'',d}));
  return [];
}
// wat er van een brew op het blad komt (alleen dit; de test kijkt of er niets anders in zit)
function deelBrew(b){
  const m=methodById(b.method),bean=b.beanId?beanById(b.beanId):null;
  const esp=methodFamily(b.method)==='espresso';
  const titel=(b.beans&&b.beans.trim())||(bean&&bean.name)||(b.title&&b.title.trim())||(m?m.name:'brew');
  const naam=(state.userName||'').trim();
  const vak=[
    [b.dose?b.dose+' g':null,esp?'in':'coffee'],
    [b.yield?b.yield+' g':null,esp?'out':'water'],
    [b.temp?b.temp+' °C':null,'water'],
    [b.grind||null,'grind'],
    [b.time||null,esp?'shot time':'total'],
    [(b.score!=null&&b.score!==''&&+b.score)?(+b.score).toFixed(1):null,'score']
  ].filter(v=>v[0]);
  return {soort:'brew',titel,methode:m,
    onder:(naam?'brewed by '+naam+', ':'')+deelDatum(b.ts),
    regel:deelRegel(b),vak,stappen:deelStappen(b),
    smaak:asArr(b.tags).slice(0,12)};
}
function deelBesteBrew(bean){
  return state.brews.filter(x=>x.beanId===bean.id).sort((x,y)=>((+y.score||0)-(+x.score||0))||((y.ts||0)-(x.ts||0)))[0]||null;
}
function deelBoon(bean){
  const best=deelBesteBrew(bean);
  const dosis=best&&+best.dose>0?+best.dose:18;
  const perKop=(bean.price&&bean.bagsize)?'€'+((bean.price/bean.bagsize)*dosis).toFixed(2)+' a cup ('+dosis+' g)':null;
  const vak=[[bean.roaster,'roaster'],[bean.origin,'origin'],[bean.process,'process'],[bean.variety,'variety'],
    [bean.roastdate?deelDatum(new Date(bean.roastdate).getTime()):null,'roasted'],[perKop,'per cup']].filter(v=>v[0]);
  return {soort:'bean',titel:bean.name||'a coffee',methode:best?methodById(best.method):null,
    onder:bean.roasternotes?String(bean.roasternotes):'',
    regel:best?'best with: '+deelRegel(best)+((+best.score)?', '+(+best.score).toFixed(1)+'/10':''):'',
    vak,stappen:best?deelStappen(best):[],smaak:best?asArr(best.tags).slice(0,12):[]};
}
function deelData(kind,id){
  if(kind==='bean'){const b=beanById(id);return b?deelBoon(b):null;}
  const b=state.brews.find(x=>x.id===id);return b?deelBrew(b):null;
}
// het blad zelf; alle stijl hangt onder .lb-blad, zodat hij in de app niets raakt
const DEEL_CSS=
  '.lb-blad{max-width:560px;margin:0 auto;padding:26px 22px 30px;background:#efe9dd;color:#3a302a;font-family:"Patrick Hand","Segoe Print","Comic Sans MS",cursive;}'+
  '.lb-blad h1{font-family:Caveat,"Segoe Print",cursive;font-weight:700;font-size:44px;line-height:1;margin:0;}'+
  '.lb-blad .o{color:#7a6c5e;font-size:17px;margin:4px 0 0;}'+
  '.lb-blad .r{font-size:18px;margin:8px 0 0;}'+
  '.lb-blad .tek{text-align:center;margin:14px 0 6px;}.lb-blad .tek img{max-height:190px;max-width:70%;mix-blend-mode:multiply;}'+
  '.lb-blad .vak{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0;}'+
  '.lb-blad .vak div{border:2px solid #b8a98f;border-radius:16px 13px 17px 12px;padding:8px 6px;text-align:center;}'+
  '.lb-blad .vak b{display:block;font-family:Caveat,cursive;font-size:24px;line-height:1.05;overflow-wrap:anywhere;}'+
  '.lb-blad .vak span{font-size:14px;color:#7a6c5e;}'+
  '.lb-blad ol{list-style:none;padding:0;margin:12px 0;}.lb-blad li{padding:7px 0;border-bottom:1.5px dashed #b8a98f;font-size:17px;}'+
  '.lb-blad li i{font-style:normal;display:inline-block;min-width:46px;color:#7a6c5e;}'+
  '.lb-blad .s{font-size:17px;margin:12px 0;}'+
  '.lb-blad .v{margin-top:22px;font-size:14px;color:#7a6c5e;text-align:center;}'+
  '@media print{.lb-blad{background:#fff;padding:0;}}';
function deelBladHTML(d,beeld){
  const e=esc;
  return '<div class="lb-blad">'+
    '<h1>'+e(d.titel)+'</h1>'+(d.onder?'<div class="o">'+e(d.onder)+'</div>':'')+
    (d.regel?'<div class="r">'+e(d.regel)+'</div>':'')+
    (beeld?'<div class="tek"><img alt="" src="'+e(beeld)+'"></div>':'')+
    (d.vak.length?'<div class="vak">'+d.vak.map(v=>'<div><b>'+e(v[0])+'</b><span>'+e(v[1])+'</span></div>').join('')+'</div>':'')+
    (d.stappen.length?'<ol>'+d.stappen.map(s=>'<li>'+(s.t?'<i>'+e(s.t)+'</i> ':'')+e(s.d)+'</li>').join('')+'</ol>':'')+
    (d.smaak.length?'<div class="s">taste: '+e(d.smaak.join(', '))+'</div>':'')+
    '<div class="v">made with Lets Brew Specialty, '+DEEL_SITE+'</div></div>';
}
function deelPaginaHTML(d,beeld){
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">'+
    '<meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>'+esc(d.titel)+' · Lets Brew</title>'+
    '<style>html,body{margin:0;background:#efe9dd;}'+DEEL_CSS+'</style></head><body>'+
    deelBladHTML(d,beeld)+'</body></html>';
}
// de tekening van de methode als kleine jpg (papierkleur eronder), zodat het bestand klein blijft
function deelTekening(m){
  return new Promise(klaar=>{
    const src=m?BrewSecurity.imageUrl(methodImg(m)):'';
    if(!src){klaar('');return;}
    const img=new Image();
    const t=setTimeout(()=>klaar(''),4000);
    img.onload=()=>{
      clearTimeout(t);
      try{
        const k=Math.min(1,380/Math.max(img.naturalWidth||1,img.naturalHeight||1));
        const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.naturalWidth*k));c.height=Math.max(1,Math.round(img.naturalHeight*k));
        const x=c.getContext('2d');x.fillStyle='#efe9dd';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);
        klaar(c.toDataURL('image/jpeg',.82));
      }catch(e){klaar('');}
    };
    img.onerror=()=>{clearTimeout(t);klaar('');};
    img.src=src;
  });
}
function deelBestandsnaam(d){return (String(d.titel).replace(/[^a-z0-9]+/gi,'-').toLowerCase().replace(/^-|-$/g,'')||'lets-brew')+'.html';}
async function deelPagina(kind,id){
  const d=deelData(kind,id);if(!d)return;
  deelWeg();
  const html=deelPaginaHTML(d,await deelTekening(d.methode));
  const naam=deelBestandsnaam(d);
  window.__deelLaatste={naam,html};                     // voor de test
  const file=new File([html],naam,{type:'text/html'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:d.titel});return;}
    catch(e){if(e&&e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(new Blob([html],{type:'text/html'}));
  const a=document.createElement('a');a.href=url;a.download=naam;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('page saved — send it on');
}
async function deelPdf(kind,id){
  const d=deelData(kind,id);if(!d)return;
  deelWeg();
  runPrint('<style>'+DEEL_CSS+'</style>'+deelBladHTML(d,await deelTekening(d.methode)));
}
function deelApp(kind,id){deelWeg();if(kind==='bean')shareOneBean(id);else shareOneBrew(id);}
function deelOpen(kind,id){
  const el=document.getElementById('deel-pop'),d=deelData(kind,id);
  if(!el||!d){if(kind==='bean')shareOneBean(id);else shareOneBrew(id);return;}
  const k=(tekst,sub,actie,ic)=>'<button type="button" class="route-knop" onclick="'+actie+'(\''+kind+'\',\''+esc(id)+'\')">'+
    '<span class="route-ic">'+ic+'</span><span><b>'+tekst+'</b><span>'+sub+'</span></span></button>';
  const icPagina='<svg viewBox="0 0 24 24" class="acic"><path d="M6.2 3.6 Q11 3.2 14.6 3.5 Q17 5.8 18.6 7.8 Q18.9 13.6 18.4 20.3 M18.7 20 Q12 20.6 5.9 20.2 M6.1 20.5 Q5.6 12 6 3.3"/><path d="M14.4 3.4 Q14.2 6 14.6 8 Q16.6 8.2 18.8 7.9" opacity="0.7"/><path d="M8.6 12.2 Q12 11.8 15.8 12.3 M8.6 15.6 Q11.4 15.2 14.2 15.7" opacity="0.6"/></svg>';
  const icPdf='<svg viewBox="0 0 24 24" class="acic"><path d="M6.9 9.4 Q6.8 4.9 7.2 4.2 Q12 3.8 16.8 4.3 Q17.2 8.2 17.1 9.4 M5.4 9.5 Q4.1 9.1 4.3 11 Q4.1 14.6 4.5 16.6 Q6.1 16.8 8.2 16.6 M18.6 9.5 Q19.9 9.1 19.7 11 Q19.9 14.6 19.5 16.6 Q17.9 16.8 15.8 16.6 M7.3 13.3 Q12 12.8 16.9 13.4 M16.6 13.1 Q16.9 17 16.8 20.3 M17 19.9 Q12 20.6 7.1 20.1 M7.4 20.4 Q7 16.9 7.2 13"/></svg>';
  el.innerHTML='<div class="aib-pop route-pop" role="dialog" aria-modal="true" aria-labelledby="deel-k">'+
    '<div class="k" id="deel-k">share this '+(kind==='bean'?'bean':'brew')+'</div>'+
    '<div class="sur-wie">'+esc(d.titel)+(d.regel?' <span>· '+esc(d.regel)+'</span>':'')+'</div>'+
    k('send as a page','one file anyone can open, no app needed','deelPagina',icPagina)+
    k('save as PDF','to print or attach to a mail','deelPdf',icPdf)+
    k('send to a Lets Brew user','they can add it to their own app','deelApp',ICO.send)+
    '<div class="aib-knoppen"><button class="naar" onclick="deelWeg()">close</button></div></div>';
  el.classList.remove('hidden');
}
function deelWeg(){const el=document.getElementById('deel-pop');if(el){el.classList.add('hidden');el.innerHTML='';}}
