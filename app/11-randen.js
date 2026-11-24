/* ---------------- getekende randen ----------------------------------------
   Keuze Jesse (24-11): "Houd tekenstijl met dubbele onafhankelijke lijnen in
   stand overal rond alle kaders", met ronde hoeken. Elk kader krijgt een eigen
   svg met twee passes: elke pass is één open contour rond een afgeronde
   rechthoek, die ergens op de bovenrand begint en 8-14 px voorbij zijn begin
   doorloopt. Hoeken en randen wijken per pass anders af, dus de twee lijnen
   lopen nooit evenwijdig (geen <use> met een verschuiving, zie
   lets-brew-house-style). De seed hangt aan het kader, dus een kader houdt
   zijn eigen lijnen zolang zijn maat niet verandert.
   Niet op <details>: dichtgeklapt toont die alleen zijn <summary>, dus ook
   geen svg; die houden hun gewone ronde rand.
   Laadt na 11 (featOn) en vóór 12; bij het laden draait hier niets.       */
const RAND_SEL='.sketch,.ws-card,.ws-actions>button,.ws-filters>button,.lp,#page-home .method,.btn-reco,.peak-line';
let randTimer=null, randSeedTeller=0;
function randRng(seed){let s=(seed>>>0)||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function randPass(r,x,y,w,h,R,ver){
  const j=()=>(r()-.5)*2*ver, rr=()=>Math.max(5,Math.min(R+(r()-.5)*R*.5,w/2-2,h/2-2));
  const a=rr(),b=rr(),c=rr(),d=rr();
  const sx=x+a+Math.max(0,w-a-b)*(.15+r()*.5), f=v=>v.toFixed(1);
  let p='M'+f(sx)+' '+f(y+j());
  p+=' Q'+f(x+w*.75)+' '+f(y+j()*1.4)+' '+f(x+w-b+j())+' '+f(y+j());
  p+=' Q'+f(x+w+j()*.6)+' '+f(y+j()*.6)+' '+f(x+w+j())+' '+f(y+b+j());
  p+=' Q'+f(x+w+j()*1.4)+' '+f(y+h/2)+' '+f(x+w+j())+' '+f(y+h-c+j());
  p+=' Q'+f(x+w+j()*.6)+' '+f(y+h+j()*.6)+' '+f(x+w-c+j())+' '+f(y+h+j());
  p+=' Q'+f(x+w/2)+' '+f(y+h+j()*1.4)+' '+f(x+d+j())+' '+f(y+h+j());
  p+=' Q'+f(x+j()*.6)+' '+f(y+h+j()*.6)+' '+f(x+j())+' '+f(y+h-d+j());
  p+=' Q'+f(x+j()*1.4)+' '+f(y+h/2)+' '+f(x+j())+' '+f(y+a+j());
  p+=' Q'+f(x+j()*.6)+' '+f(y+j()*.6)+' '+f(x+a+j())+' '+f(y+j());
  p+=' Q'+f((x+a+sx)/2)+' '+f(y+j())+' '+f(sx+8+r()*6)+' '+f(y+j()*1.6);
  return p;
}
function randTeken(el){
  const w=el.offsetWidth,h=el.offsetHeight;
  if(!w||!h||!el.getClientRects().length)return;       // verborgen: later
  const maat=w+'x'+h, oud=el.querySelector(':scope>svg.rand-svg');
  if(oud&&el.dataset.randMaat===maat)return;            // niets veranderd
  if(oud)oud.remove();
  if(!el.dataset.randSeed)el.dataset.randSeed=String(7+(++randSeedTeller)*7919);
  const r=randRng(+el.dataset.randSeed),p=8;
  const R=parseFloat(getComputedStyle(el).borderTopLeftRadius)||14;
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.setAttribute('class','rand-svg');svg.setAttribute('aria-hidden','true');
  svg.setAttribute('width',w+2*p);svg.setAttribute('height',h+2*p);
  svg.setAttribute('viewBox','0 0 '+(w+2*p)+' '+(h+2*p));
  for(let k=0;k<2;k++){
    const path=document.createElementNS(ns,'path');
    path.setAttribute('d',k?randPass(r,p-1.5,p-1.2,w+3,h+2.4,R+2,2.4):randPass(r,p,p,w,h,R,1.1));
    if(k)path.setAttribute('class','b');
    svg.appendChild(path);
  }
  el.classList.add('rand-on');
  el.appendChild(svg);
  el.dataset.randMaat=maat;
}
function randAlles(){
  randTimer=null;
  const aan=featOn('drawnedges');
  document.documentElement.classList.toggle('randen',aan);
  if(!aan){
    document.querySelectorAll('svg.rand-svg').forEach(s=>s.remove());
    document.querySelectorAll('.rand-on').forEach(el=>{el.classList.remove('rand-on');delete el.dataset.randMaat;});
    return;
  }
  document.querySelectorAll(RAND_SEL).forEach(randTeken);
}
// hooguit vier keer per seconde: de coaches veranderen hun tekst elke tik
function randStraks(){if(!randTimer)randTimer=setTimeout(randAlles,250);}
function randStart(){
  randAlles();
  try{new MutationObserver(ms=>{
    // alleen reageren op wat er écht bijkomt, niet op onze eigen svg's
    if(ms.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&!(n.classList&&n.classList.contains('rand-svg')))||m.type==='attributes'))randStraks();
  }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});}catch(e){}
  addEventListener('resize',randStraks);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(randStraks).catch(()=>{});
}
