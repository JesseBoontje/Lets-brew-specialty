/* De tekening uit docs/opzet-aeropress.html: kop, dop, kamer, plunjer, ketel, roerstokje en schepje als losse delen. Alle ids beginnen met ap-. */
const AP_TEKENING="<svg id=\"ap-tek\" class=\"stil\" viewBox=\"-6 0 272 344\" preserveAspectRatio=\"xMidYMid meet\" role=\"img\" aria-label=\"the AeroPress with kettle and cup\">\n<defs>\n<clipPath id=\"ap-clip-ch\"><rect x=\"102.6\" y=\"141\" width=\"54.8\" height=\"121.4\"/></clipPath>\n<clipPath id=\"ap-clip-cup\"><path d=\"M88 275 L172 275 L166.5 333 L93.5 333\"/></clipPath>\n</defs>\n<path class=\"soft2\" d=\"M8 337.4 Q130 341.6 252 336.4\"/>\n<path class=\"soft2\" d=\"M20 339.8 Q131 343.2 240 338.8\"/>\n<g id=\"ap-G\">\n<g id=\"ap-cupG\">\n<g clip-path=\"url(#ap-clip-cup)\">\n<rect id=\"ap-cupLiq\" class=\"liq\" x=\"80\" y=\"333\" width=\"100\" height=\"0\"/>\n<rect id=\"ap-cupCr\" class=\"crema\" x=\"80\" y=\"333\" width=\"100\" height=\"0\"/>\n</g>\n<path d=\"M82 271.5 Q130 265 178 271\"/><path class=\"b\" d=\"M86 273.5 Q131 268.2 175 272.6\"/>\n<path d=\"M83 273 Q130 280.5 177 272.4\"/><path class=\"b\" d=\"M88 275.6 Q129 281.4 173 274.8\"/>\n<path d=\"M85 268 Q87.5 300 93.5 336.4\"/><path class=\"b\" d=\"M88.6 272 Q90.4 302 95.8 333.4\"/>\n<path d=\"M175.5 268 Q173 300 167 336.4\"/><path class=\"b\" d=\"M172.4 271.5 Q170.8 302 164.6 333.4\"/>\n<path d=\"M88 332.6 Q130 338.6 172 331.6\"/><path class=\"b\" d=\"M93 334.8 Q129 339.2 168 333.4\"/>\n<path d=\"M175 284 Q199 283 198.5 300 Q198 317 171 318.4\"/><path class=\"b\" d=\"M173.5 289.5 Q192 289.6 191.6 301 Q191 312 170.6 312.4\"/>\n</g>\n<g id=\"ap-pressG\">\n<g id=\"ap-bedG\">\n<path class=\"bed\" d=\"M104 0.6 Q114 -6.4 124 -4.2 Q134 -8.6 144 -4 Q151 -2.4 156.4 0.8\"/>\n<path class=\"bed b\" d=\"M106.6 -1 Q117 -4.6 127 -3 Q137 -6.4 146 -2.6 Q152 -1.4 155 -0.4\"/>\n<path class=\"soft2\" d=\"M113 -2.6 l2.4 -1.6\"/><path class=\"soft2\" d=\"M121 -3 l2 1.4\"/>\n<path class=\"soft2\" d=\"M133 -5 l2.4 -1\"/><path class=\"soft2\" d=\"M141 -3.4 l1.8 1.6\"/>\n<path class=\"soft2\" d=\"M148 -1.8 l2.2 -1.2\"/>\n</g>\n<g id=\"ap-chM\">\n<g clip-path=\"url(#ap-clip-ch)\">\n<g id=\"ap-liqT\">\n<rect id=\"ap-chLiq\" class=\"liq\" x=\"70\" y=\"262\" width=\"120\" height=\"0\"/>\n<rect id=\"ap-chCr\" class=\"crema\" x=\"70\" y=\"262\" width=\"120\" height=\"0\"/>\n</g>\n</g>\n<path d=\"M94.5 139.6 Q130 134.6 165.8 139.2\"/><path class=\"b\" d=\"M97.6 141.6 Q131 137.6 162.8 141.4\"/>\n<path class=\"soft2\" d=\"M99 142.4 Q130 147 161.4 142\"/>\n<path d=\"M99.6 134.6 Q97.4 196 100.8 257.6\"/><path class=\"b\" d=\"M102.8 140.4 Q100.6 197 103.4 254.6\"/>\n<path d=\"M160.8 134.4 Q163 196 159.4 257.8\"/><path class=\"b\" d=\"M157.6 140.6 Q159.8 197 156.6 254.4\"/>\n<path d=\"M74 254.4 Q130 249.4 186.6 255\"/><path class=\"b\" d=\"M78.4 256.4 Q129 252 182.4 256.8\"/>\n<path d=\"M73.4 261.4 Q130 265.6 187 260.6\"/><path class=\"b\" d=\"M77.6 262.6 Q131 266.4 183.6 262.2\"/>\n<path d=\"M77 251.8 Q71.6 257.8 76.6 264.2\"/><path d=\"M183.4 251.6 Q189 257.6 184 264\"/>\n<path class=\"soft2\" d=\"M104 166 Q111 165 117 166.4\"/><text class=\"nr\" x=\"120\" y=\"169\">4</text>\n<path class=\"soft2\" d=\"M104 188 Q111 187.2 117 188.4\"/><text class=\"nr\" x=\"120\" y=\"191\">3</text>\n<path class=\"soft2\" d=\"M104 210 Q111 209 117 210.4\"/><text class=\"nr\" x=\"120\" y=\"213\">2</text>\n<path class=\"soft2\" d=\"M104 232 Q111 231.2 117 232.4\"/><text class=\"nr\" x=\"120\" y=\"235\">1</text>\n</g>\n<g id=\"ap-capG\">\n<path class=\"soft2\" d=\"M101 261 Q130 263.4 159 260.6\"/>\n<path d=\"M95 262.4 Q130 258.8 165.6 262\"/><path class=\"b\" d=\"M98.6 264.2 Q131 261.4 162.4 263.8\"/>\n<path d=\"M97 270.4 Q130 273.4 163.4 269.8\"/><path class=\"b\" d=\"M100.4 271.8 Q129 274.4 160.6 271.2\"/>\n<path d=\"M97.4 259.6 Q95.6 266 98.2 273\"/><path d=\"M163 259.4 Q165 266 162 272.8\"/>\n<path class=\"soft2\" d=\"M106 264.5 Q106.5 267.5 106 270.5\"/><path class=\"soft2\" d=\"M114 264.6 Q114.4 267.6 114 270.8\"/>\n<path class=\"soft2\" d=\"M122 264.4 Q122.6 267.6 122 270.9\"/><path class=\"soft2\" d=\"M130 264.3 Q130.4 267.6 130 271\"/>\n<path class=\"soft2\" d=\"M138 264.4 Q138.5 267.6 138 270.9\"/><path class=\"soft2\" d=\"M146 264.5 Q146.4 267.6 146 270.8\"/>\n<path class=\"soft2\" d=\"M154 264.6 Q154.5 267.5 154 270.5\"/>\n</g>\n<g id=\"ap-plG\">\n<path d=\"M100.6 -8.6 Q130 -11.8 159.6 -8.2\"/><path class=\"b\" d=\"M103 -6.8 Q130 -9.4 157.4 -6.4\"/>\n<path class=\"seal\" d=\"M101 0.6 Q130 3.4 159.2 0.2\"/><path class=\"b\" d=\"M103.4 -1.8 Q130 0.8 157 -2\"/>\n<path d=\"M101.4 -11 Q99.8 -4.4 102 2.6\"/><path d=\"M158.8 -11.2 Q160.6 -4.6 158.2 2.4\"/>\n<path d=\"M106 -7 Q104 -62 106.8 -119.4\"/><path class=\"b\" d=\"M108.8 -9.6 Q107 -62 109.4 -116.8\"/>\n<path d=\"M154.2 -7.2 Q156.4 -62 153.4 -119.6\"/><path class=\"b\" d=\"M151.6 -9.4 Q153.6 -62 150.8 -117\"/>\n<path class=\"soft2\" d=\"M118 -14 Q117 -62 118.6 -110\"/>\n<path d=\"M88.4 -115.4 Q130 -119.6 171.4 -114.8\"/><path class=\"b\" d=\"M92.6 -113.6 Q131 -117.4 167.6 -113.2\"/>\n<path d=\"M89.6 -123.4 Q130 -128.2 170.6 -122.8\"/><path class=\"b\" d=\"M93.4 -125.4 Q129 -129.4 166.8 -124.8\"/>\n<path d=\"M91.2 -126.6 Q86.2 -120 90.8 -111.8\"/><path d=\"M168.6 -126.4 Q173.6 -119.8 169.2 -111.6\"/>\n</g>\n</g>\n</g>\n<path id=\"ap-drip\" class=\"stream\" d=\"\"/>\n<g id=\"ap-kettle\">\n<path d=\"M176.6 40.4 Q206 34.2 236 40.8\"/><path class=\"b\" d=\"M180 42.6 Q207 37.4 232.6 42.4\"/>\n<path d=\"M179.6 36.6 Q173.4 62 180.4 89.4\"/><path class=\"b\" d=\"M182.8 41.4 Q177.4 63 183.2 86.6\"/>\n<path d=\"M233 36.4 Q239.6 62 232.6 89.6\"/><path class=\"b\" d=\"M229.8 41.2 Q235.4 63 229.6 86.4\"/>\n<path d=\"M176 86.4 Q206 92.6 236.6 86\"/><path class=\"b\" d=\"M180.6 88.6 Q206 93.6 232 88\"/>\n<path d=\"M196.6 37.4 Q206 26 215.6 37.6\"/><path class=\"b\" d=\"M199.4 36.4 Q206.4 29.4 213 36.8\"/>\n<path d=\"M233.6 45.4 Q254 46.6 252.4 64 Q250.8 81.4 232.4 80.6\"/><path class=\"b\" d=\"M233 50.6 Q246.6 51.6 245.8 64.4 Q245 76 232.2 75.6\"/>\n<path d=\"M181.4 80.6 Q161 86.6 156.6 66 Q152.4 45.4 137.4 35.4\"/><path class=\"b\" d=\"M181.6 75 Q165.4 79.6 162 64.6 Q158.6 48.4 141.2 38.4\"/>\n<path d=\"M140.6 34.2 Q135.6 31.8 133 35.2\"/>\n</g>\n<g id=\"ap-streamG\">\n<path id=\"ap-st1\" class=\"stream\" d=\"\"/>\n<path id=\"ap-st2\" class=\"stream b2\" d=\"\"/>\n</g>\n<g id=\"ap-rodG\" opacity=\"0\">\n<path d=\"M-1 -176 Q1.2 -88 0.2 2\"/><path class=\"b\" d=\"M2.4 -172 Q2.8 -86 1.4 -1\"/>\n<path d=\"M-3.4 -175 Q0.8 -178.4 4.6 -174.6\"/>\n</g>\n<g id=\"ap-ripple\" opacity=\"0\"><path class=\"soft2\" d=\"M114 0 Q122 4 130 0 Q138 -4 146 0\"/></g>\n<g id=\"ap-scoopG\" opacity=\"0\">\n<path d=\"M-24 3.6 Q-14 15 -1.4 6\"/><path class=\"b\" d=\"M-22 6 Q-13 12.6 -3 6.8\"/>\n<path d=\"M-25 2.4 Q-13 -0.6 0.4 5\"/>\n<path d=\"M-0.6 4.6 Q22 -5.6 45 -16.4\"/><path class=\"b\" d=\"M1.4 7.4 Q23 -2.6 45.6 -13\"/>\n</g>\n<g id=\"ap-grounds\" opacity=\"0\">\n<path class=\"korrel\" d=\"M0 0 l1.2 2.4\"/><path class=\"korrel\" d=\"M0 0 l-1 2.2\"/>\n<path class=\"korrel\" d=\"M0 0 l1.4 2\"/><path class=\"korrel\" d=\"M0 0 l-1.2 2.4\"/>\n<path class=\"korrel\" d=\"M0 0 l1 2.2\"/><path class=\"korrel\" d=\"M0 0 l-1.4 2\"/>\n</g>\n<g id=\"ap-rmFlip\" opacity=\"0\" transform=\"translate(188 176) scale(2.6)\" style=\"stroke-width:.85\">\n<path d=\"M5.2 9.4 Q6.4 4.6 11.6 4.1 Q17 3.9 18.7 8.6\"/><path d=\"M18.9 4.6 Q19 7.6 18.8 8.9 Q16.6 9 14.4 8.7\"/>\n<path d=\"M18.8 14.6 Q17.6 19.4 12.4 19.9 Q7 20.1 5.3 15.4\"/><path d=\"M5.1 19.4 Q5 16.4 5.2 15.1 Q7.4 15 9.6 15.3\"/>\n</g>\n<g id=\"ap-rmSwirl\" opacity=\"0\" transform=\"translate(170 150) scale(1.7)\" style=\"stroke-width:1.1\">\n<path d=\"M5.2 9.4 Q6.4 4.6 11.6 4.1 Q17 3.9 18.7 8.6\"/><path d=\"M18.9 4.6 Q19 7.6 18.8 8.9 Q16.6 9 14.4 8.7\"/>\n<path d=\"M18.8 14.6 Q17.6 19.4 12.4 19.9 Q7 20.1 5.3 15.4\"/><path d=\"M5.1 19.4 Q5 16.4 5.2 15.1 Q7.4 15 9.6 15.3\"/>\n</g>\n</svg>";
/* ---------------- AeroPress-coach, normaal en omgekeerd (volledig scherm) ----------------
   Volgens docs/opzet-aeropress.html, in dezelfde opbouw als de gietcoach van
   de V60 (app/04-gietcoach.js): bovenaan de tekening, daaronder de grote
   teller met liniaal, de strook vorige / nu / straks en grote knoppen. Het
   schema komt uit de pour coach (pc.steps), dus je eigen recept, dosis en
   verhouding lopen mee. Normaal of omgekeerd volgt het recept (houding).
   Wat een stap in de tekening doet, volgt uit de soort stap; bij "wacht"
   kijken we naar de tekst (plunjer erop, lucht eruit, dop erop).          */
const AP_NAAM={bloom:'bloom',giet:'pour',swirl:'swirl',roer:'stir',wacht:'steep',keer:'flip',pers:'press',
  doorloop:'drawdown',dose:'add coffee',plunjer:'plunger in',lucht:'push out air',dop:'cap on'};

/* Alleen bij een echte AeroPress: een eigen methode die "French press" heet
   krijgt wel het AeroPress-plaatje in de kaart, maar niet deze coach.     */
function apPast(mid){
  if(typeof isAeropress!=='function'||!isAeropress(mid))return false;
  const m=methodById(mid); const naam=((m&&m.name)||'').toLowerCase();
  return mid==='aeropress'||naam.includes('aero');
}
// wat doet deze stap in de tekening?
function apActie(s){
  const k=s.k||'giet', d=String(s.d||'').toLowerCase();
  if(k==='dose')return 'dose';
  if(k!=='wacht')return k;
  if(/lucht/.test(d))return 'lucht';
  if(/\bdop\b|\bdeksel\b/.test(d))return 'dop';
  if(/plunjer|zuiger|plunger/.test(d)&&/cm|erop|erin/.test(d))return 'plunjer';
  return 'wacht';
}

const ap=(()=>{
const $=id=>document.getElementById('ap-'+id);
const RMQ=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};

/* ---- maten van de tekening (zie de opzet) ---- */
const CX=130, CY=212.5, FILTER=262, CUPBODEM=333, PERS_DUUR=30;
const rmp=(t,a,b)=>t<=a?0:t>=b?1:(t-a)/(b-a);
const ez=x=>x*x*(3-2*x);
const lerp=(a,b,x)=>a+(b-a)*x;
const env=(t,a,b,f)=>Math.min(rmp(t,a,a+f),1-rmp(t,b-f,b));
const klem=(x,a,b)=>Math.max(a,Math.min(b,x));
const f2=n=>n.toFixed(2);
function rot(px,py,cx,cy,deg){
  const a=deg*Math.PI/180,dx=px-cx,dy=py-cy;
  return [cx+dx*Math.cos(a)-dy*Math.sin(a), cy+dx*Math.sin(a)+dy*Math.cos(a)];
}

/* ---- toestand ---- */
let R=null, S=[], starts=[], open=false, raf=0;
let fase='klaar', pauzeVan='loopt';
let t=0, speed=1, stem=false, gezegd={}, eindT=null, eindOp=null, terug=false, vorigeCur=-1, cache={};
try{stem=localStorage.getItem('scc_gc_stem')==='1';}catch(e){}

function bouw(){
  const r=recipeById(pc.rid)||{};
  const dose=parseFloat(document.getElementById('f-dose').value)||r.dose||15;
  const temp=document.getElementById('f-temp').value||r.temp||'';
  const maling=(document.getElementById('f-grind').value||r.maling||'').trim();
  const water=pc.steps.length?(pc.steps[pc.steps.length-1].water||0):0;
  const om=r.houding==='omgekeerd';
  S=pc.steps.map(x=>({t:+x.t||0,k:x.k||'giet',d:x.d||'',g:x.g?Math.round(+x.g):0,actie:apActie(x)}));
  const pi=S.findIndex(s=>s.k==='pers');
  const ki=om?S.findIndex(s=>s.k==='keer'):-1;
  // water in de kamer (voor het drukken) en wat er in de kop komt (erna)
  let wk=0, vorige=0;
  S.forEach((s,j)=>{if(s.g&&(pi<0||j<pi)){s.na=false;s.van=vorige;s.a=Math.max(0,s.g-vorige);vorige=Math.max(vorige,s.g);wk=vorige;}});
  const uit=Math.max(0,Math.round(wk-1.4*dose));          // gemalen koffie houdt water vast
  let kop=uit, eerstNa=-1;
  S.forEach((s,j)=>{if(s.g&&pi>=0&&j>pi){s.na=true;if(eerstNa<0)eerstNa=j;s.van=kop;s.a=Math.max(0,s.g-kop);kop=Math.max(kop,s.g);}});
  S.forEach((s,j)=>{
    if(!s.g)return;
    s.lift=(j===eerstNa)?1.2:0;          // eerst de AeroPress eraf, dan aanvullen
    const gat=(S[j+1]?S[j+1].t:Infinity)-s.t-s.lift;
    s.dur=Math.max(3,Math.min(gat,s.a/GC_TEMPO));
  });
  const perg=wk>0?Math.min(0.5,104/wk):0.5;
  R={naam:r.naam||'AeroPress',om,dose,temp,maling,water,pi,ki,eerstNa,wk,uit,perg,
     cupg:Math.min(0.3,56/Math.max(1,kop,uit)),
     pj:S.findIndex((s,j)=>s.actie==='plunjer'&&(pi<0||j<pi)),
     lj:S.findIndex(s=>s.actie==='lucht'), dj:S.findIndex(s=>s.actie==='dop'),
     seal0:Math.min(212,FILTER-wk*perg)};
  R.sealIn=Math.min(151,FILTER-wk*perg-6);
  zet('naam',esc(R.naam));
  reset();
}
function reset(){
  fase='klaar'; t=0; gezegd={}; eindT=null; eindOp=null; vorigeCur=-1; terug=false;
  starts=S.map(x=>x.t);
  BrewStem.stil();
  wakeUit(); linBouw();
}

/* ---- de klok ---- */
function cur(){let i=0;for(let j=0;j<S.length;j++)if(t>=starts[j])i=j;return i;}
function w0(j){return starts[j]+(S[j].lift||0);}
function w1(j){return w0(j)+S[j].dur;}
function stapEind(j){return j<S.length-1?starts[j+1]:Infinity;}
function flipOp(){
  if(!R.om)return Infinity;
  if(R.ki>=0)return starts[R.ki];
  return R.pi>=0?starts[R.pi]:Infinity;
}
// het omdraaien zelf: eerst (zonder dop-stap) de dop erop, dan daalt de kop, dan draait alles
function flipBasis(){return flipOp()+(R.dj>=0?0:0.8);}
function persBegin(){
  if(R.pi<0)return Infinity;
  let b=starts[R.pi];
  if(R.om)b=Math.max(b,flipBasis()+3);
  else if(R.pj<0)b+=1.5;                 // de plunjer moet er eerst op
  return b;
}
function persEind(){
  if(R.pi<0)return Infinity;
  const e=stapEind(R.pi);
  return isFinite(e)?Math.max(e,persBegin()+3):persBegin()+PERS_DUUR;
}
function eindVerwacht(){
  const l=S.length-1, s=S[l];
  if(s.g)return w1(l)+2;
  if(s.k==='pers')return persEind();
  if(s.k==='keer')return starts[l]+6;
  return starts[l]+(s.k==='swirl'||s.k==='roer'?5:10);
}
function fmt(s){s=Math.max(0,Math.floor(s+1e-6));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
const fmtIn=s=>fmt(Math.ceil(Math.max(0,s)-1e-6));

/* ---- de stand van de tekening op tijd tt ----
   Assenstelsel: de AeroPress rechtop op de kop. Omgekeerd is datzelfde
   plaatje 180 graden gedraaid rond (130, 212.5); omdraaien is die hoek naar
   360. Water in de kamer is een rechthoek tussen top en bot.              */
function scene(tt){
  const RM=RMQ.matches;
  const ov=(a,b)=>RM?(tt>=a?1:0):ez(rmp(tt,a,b));
  const Z={theta:0,cupD:0,cupA:1,lift:0,pressA:1,swA:0,swX:0,tilt:0,off:0,capOff:0,capA:1,capW:0,
    seal:91,plA:0,top:FILTER,bot:FILTER,crTop:false,crBot:false,bedY:261,bedS:1,cupG:0,
    kShow:0,kTilt:0,pour:false,pourY:0,drip:false,rodA:0,rodX:CX,rodY:195,rodR:7,rip:0,ripX:0,ripY:0,
    scA:0,scR:0,grA:0,grPh:0,rmFlip:0,rmSwirl:0};
  // water in de kamer, tot nu toe gegoten
  let gK=0;
  S.forEach((s,j)=>{if(s.g&&!s.na)gK+=s.a*rmp(tt,w0(j),w1(j));});
  const L=gK*R.perg;
  const pb=persBegin(), pe_=persEind();
  const p=rmp(tt,pb,pe_), pe=0.7*p+0.3*ez(p);
  let opp;                                    // het wateroppervlak, in schermcoordinaten
  if(!R.om){
    const niveau=FILTER-L;
    if(R.pj>=0){
      const a=starts[R.pj]+0.6, ins=ov(a,a+3);
      Z.plA=RM?(tt>=a?1:0):ins; Z.seal=lerp(91,R.sealIn,ins);
    }
    if(R.pi>=0&&tt>=starts[R.pi]&&R.pj<0){
      const ins=ov(starts[R.pi],starts[R.pi]+1.5);
      Z.plA=RM?1:ins; Z.seal=lerp(91,R.sealIn,ins);
    }
    if(tt>=pb)Z.seal=lerp(R.sealIn,250,pe);
    Z.top=Math.max(niveau,Z.seal); Z.bot=FILTER;
    if(L<=0)Z.top=Z.bot;
    Z.crTop=(L>4&&Z.seal<niveau);
    if(tt>=pb)Z.cupG=R.uit*klem((Z.seal-niveau)/Math.max(1,250-niveau),0,1);
    Z.drip=tt>pb&&tt<pe_+1&&Z.seal>niveau;
    Z.bedS=1-0.45*p;
    opp=niveau;
  }else{
    const fb=flipBasis();
    if(RM){
      Z.theta=tt<fb+1.8?180:360; Z.cupA=tt>=fb?1:0;
      Z.rmFlip=(tt>=fb&&tt<fb+3)?1:0;
    }else{
      Z.theta=180+180*ez(rmp(tt,fb+1,fb+2.8));
      Z.cupD=70*(1-ez(rmp(tt,fb,fb+0.9)));
      Z.cupA=tt<fb?0:rmp(tt,fb,fb+0.5);
    }
    // lucht eruit: de kamer zakt over de plunjer
    let la, lb;
    if(R.lj>=0){la=starts[R.lj];lb=Math.min(la+6,stapEind(R.lj));}
    else if(R.dj>=0){la=starts[R.dj];lb=la+0.8;}
    else{la=flipOp();lb=la+0.7;}
    Z.off=58*(1-ov(la,Math.max(la+0.1,lb)));
    // de dop
    const ca=R.dj>=0?starts[R.dj]:flipOp(), cb=ca+(R.dj>=0?2.4:0.7);
    Z.capOff=46*(1-ov(ca,cb));
    Z.capA=tt<ca?0:(RM?1:rmp(tt,ca,ca+0.6));
    if(!RM&&tt>cb&&tt<cb+1.6)Z.capW=5*Math.sin(2*Math.PI*(tt-cb)/0.8)*(1-rmp(tt,cb,cb+1.6));
    Z.plA=1;
    Z.seal=tt>=pb?lerp(R.seal0,250,pe):R.seal0;
    Z.top=Z.seal; Z.bot=R.seal0+L;
    if(L<=0)Z.bot=Z.top;
    Z.crBot=(L>4&&Z.off>2);
    // het maalsel: eerst op de plunjer, na het draaien zakt het op het filter
    const z=ov(fb+2.9,fb+4.4);
    Z.bedY=lerp(R.seal0,261,z);
    Z.bedS=lerp(-1,1,z)*(1-0.45*p);
    if(tt>=pb)Z.cupG=R.uit*p;
    Z.drip=tt>pb+0.4&&tt<pe_;
    opp=2*CY-(R.seal0+L);
  }
  // na het drukken: AeroPress eraf en aanvullen in de kop
  if(R.eerstNa>=0){
    const a=starts[R.eerstNa];
    Z.lift=150*ov(a,a+1.5);
    Z.pressA=1-rmp(tt,a+0.4,a+1.5);
    if(tt>=a)Z.cupG=R.uit;
    S.forEach((s,j)=>{if(s.g&&s.na)Z.cupG+=s.a*rmp(tt,w0(j),w1(j));});
  }
  // de ketel: hij komt erbij voor een giet en gaat daarna weer weg
  S.forEach((s,j)=>{
    if(!s.g)return;
    const a=w0(j), b=w1(j);
    const show=RM?((tt>=a-0.8&&tt<b+0.8)?1:0):ez(Math.max(0,env(tt,a-0.8,b+0.8,0.8)));
    if(show>Z.kShow)Z.kShow=show;
    const tilt=RM?((tt>=a&&tt<b)?1:0):ez(Math.max(0,env(tt,a-0.5,b,0.5)));
    if(tilt>Z.kTilt)Z.kTilt=tilt;
    if(tt>a&&tt<b){Z.pour=true;Z.pourY=s.na?(CUPBODEM-Z.cupG*R.cupg):opp;}
  });
  // swirlen, roeren en de laatste koffie erbij
  S.forEach((s,j)=>{
    const a=starts[j], b=Math.min(a+5,stapEind(j));
    if(tt<a||tt>=b)return;
    if(s.k==='swirl'){
      const e=Math.sin(Math.PI*rmp(tt,a,b));
      if(!RM){Z.swA=e*3.2*Math.sin(2*Math.PI*(tt-a)/1.3);Z.swX=e*2*Math.cos(2*Math.PI*(tt-a)/1.3);Z.tilt=-Z.swA*1.9;}
      else Z.rmSwirl=1;
    }else if(s.k==='roer'){
      const ph=2*Math.PI*(tt-a)/0.9;
      Z.rodA=RM?1:env(tt,a,b,0.4);
      Z.rodX=RM?CX:CX+13*Math.sin(ph);
      Z.rodR=RM?8:7+3*Math.sin(ph+0.8);
      Z.rodY=Math.min(250,opp+32);
      Z.rip=RM?0:Z.rodA; Z.ripX=RM?0:4*Math.sin(ph); Z.ripY=opp;
    }else if(s.actie==='dose'){
      Z.scA=RM?1:env(tt,a,b,0.5);
      Z.scR=RM?-38:-38*ez(rmp(tt,a+0.6,a+1.6));
      Z.grA=(tt>a+1.4&&tt<b-1)?1:0;
      Z.grPh=(tt-a-1.4)/0.9;
    }
  });
  return Z;
}

/* ---- tekenen ---- */
let el=null, korrels=[];
function teken(Z){
  if(!el){
    el={};
    ['G','cupG','cupLiq','cupCr','pressG','bedG','chM','liqT','chLiq','chCr','capG','plG','drip',
     'kettle','st1','st2','rodG','ripple','scoopG','grounds','rmFlip','rmSwirl','tek'].forEach(k=>el[k]=$(k));
    korrels=[...el.grounds.querySelectorAll('path')];
  }
  el.G.setAttribute('transform','rotate('+f2(Z.theta)+' '+CX+' '+CY+')');
  el.cupG.setAttribute('transform','translate(0 '+f2(Z.cupD)+')');
  el.cupG.setAttribute('opacity',Z.cupA);
  el.pressG.setAttribute('transform','translate('+f2(Z.swX)+' '+f2(-Z.lift)+') rotate('+f2(Z.swA)+' 130 262)');
  el.pressG.setAttribute('opacity',Z.pressA);
  el.chM.setAttribute('transform','translate(0 '+f2(Z.off)+')');
  const h=Math.max(0,Z.bot-Z.top);
  el.chLiq.setAttribute('y',f2(Z.top-Z.off)); el.chLiq.setAttribute('height',f2(h));
  if(Z.crTop&&h>0){el.chCr.setAttribute('y',f2(Z.top-Z.off));el.chCr.setAttribute('height',3);}
  else if(Z.crBot&&h>0){el.chCr.setAttribute('y',f2(Z.bot-Z.off-3));el.chCr.setAttribute('height',3);}
  else el.chCr.setAttribute('height',0);
  el.liqT.setAttribute('transform','rotate('+f2(Z.tilt)+' 130 '+f2(Z.top-Z.off)+')');
  el.capG.setAttribute('transform','translate(0 '+f2(Z.capOff)+') rotate('+f2(Z.capW)+' 130 266)');
  el.capG.setAttribute('opacity',Z.capA);
  el.plG.setAttribute('transform','translate(0 '+f2(Z.seal)+')');
  el.plG.setAttribute('opacity',Z.plA);
  el.bedG.setAttribute('transform','translate(0 '+f2(Z.bedY)+') scale(1 '+Z.bedS.toFixed(3)+')');
  const ch=Z.cupG*R.cupg, cy=CUPBODEM-ch;
  el.cupLiq.setAttribute('y',f2(cy)); el.cupLiq.setAttribute('height',f2(ch));
  el.cupCr.setAttribute('y',f2(cy)); el.cupCr.setAttribute('height',Z.cupG>3?2.6:0);
  const RM=RMQ.matches;
  const kt=-22*Z.kTilt, kx=(RM?(Z.kShow>0.5?0:70):(1-Z.kShow)*70);
  el.kettle.setAttribute('transform','translate('+f2(kx)+' 0) rotate('+f2(kt)+' 206 58)');
  el.kettle.setAttribute('opacity',RM?(Z.kShow>0.5?1:0):Z.kShow);
  if(Z.pour){
    const [tx,ty]=rot(134,35,206,58,kt);
    const x=tx+kx, my=(ty+Z.pourY)/2;
    el.st1.setAttribute('d','M'+x.toFixed(1)+' '+ty.toFixed(1)+' Q'+(x-0.6).toFixed(1)+' '+my.toFixed(1)+' 130 '+Z.pourY.toFixed(1));
    el.st2.setAttribute('d','M'+(x+2.2).toFixed(1)+' '+(ty+3).toFixed(1)+' Q'+(x+1.6).toFixed(1)+' '+my.toFixed(1)+' 131.4 '+(Z.pourY-2).toFixed(1));
  }else{el.st1.setAttribute('d','');el.st2.setAttribute('d','');}
  el.drip.setAttribute('d',Z.drip?('M130 272 Q130.8 '+((272+cy)/2).toFixed(1)+' 130 '+cy.toFixed(1)):'');
  el.rodG.setAttribute('opacity',Z.rodA);
  el.rodG.setAttribute('transform','translate('+f2(Z.rodX)+' '+f2(Z.rodY)+') rotate('+f2(Z.rodR)+')');
  el.ripple.setAttribute('opacity',Z.rip*0.9);
  el.ripple.setAttribute('transform','translate('+f2(Z.ripX)+' '+f2(Z.ripY)+')');
  el.scoopG.setAttribute('opacity',Z.scA);
  el.scoopG.setAttribute('transform','translate(156 70) rotate('+f2(Z.scR)+')');
  el.grounds.setAttribute('opacity',Z.grA);
  korrels.forEach((k,i)=>{
    const f=((Z.grPh+i/6)%1+1)%1;
    k.setAttribute('transform','translate('+(126+(i%3)*4)+' '+(88+f*70).toFixed(1)+')');
  });
  el.rmFlip.setAttribute('opacity',Z.rmFlip);
  el.rmSwirl.setAttribute('opacity',Z.rmSwirl);
  el.tek.classList.toggle('stil',fase!=='loopt');
  el.tek.style.setProperty('--snel',speed);
}

/* ---- de knoppen ---- */
function start(){
  if(fase==='af')reset();
  fase='aftel'; t=-GC_VOORAF; gezegd={}; vorigeCur=-1;
  zeg(tekstVooraf(0)); gezegd.v0=true;     // in de tik zelf, anders praat een iPhone niet
  if(stem)BrewStem.voorbereid(stemZinnen());   // de rest alvast ophalen (alleen met ElevenLabs)
  wakeAan();
}
function startKnop(){
  if(fase==='klaar')start();
  else if(fase==='af')sluit();
  else if(fase==='aftel'||fase==='loopt'){
    pauzeVan=fase; fase='pauze'; wakeUit();
    BrewStem.stil();
  }
  else if(fase==='pauze'){fase=pauzeVan; wakeAan();}
}
// "next step": de volgende stap begint nu, en alles daarna schuift mee
function volgende(){
  if(fase==='klaar'||fase==='af')return;
  if(t<0){t=0; if(fase==='aftel')fase='loopt'; else pauzeVan='loopt'; return;}
  const i=cur();
  if(i>=S.length-1){klaar();return;}
  starts[i+1]=t;
  for(let k=i+2;k<S.length;k++)starts[k]=starts[k-1]+(S[k].t-S[k-1].t);
  for(let m=i+1;m<S.length;m++){delete gezegd['v'+m];delete gezegd['n'+m];}
  gezegd['v'+(i+1)]='overgeslagen';
  linBouw();
}
function klaar(){
  const i=cur();
  for(let k=i+1;k<S.length;k++)starts[k]=Infinity;
  fase='af'; eindT=Math.round(Math.max(0,t));
  wakeUit(); zeg('Klaar.');
  linBouw();
  naarFormulier();
}
// wat de klok zag landt in het formulier, net als bij de gewone klok
function naarFormulier(){
  if(terug)return; terug=true;
  pc.marks=S.map((s,j)=>(isFinite(starts[j])&&starts[j]<=eindT)?Math.round(starts[j]*10)/10:null);
  pc.total=Math.round(eindT);
  // een AeroPress heeft geen doorlooptijd: dat veld blijft leeg (anders
  // denkt de dial-in hulp dat het bed vastloopt)
  pc.draw=null;
  pc.el=eindT; pc.run=false;
  pourFill(); setVal('f-draw','');
  pcOpen.log=true; pcOpen.pour=false;
  const b=document.getElementById('pc-btn'); if(b)b.textContent='start again';
  pourSteps(); renderCards();
}

/* ---- hardop zeggen (zelfde stem en knop als de gietcoach) ---- */
function zeg(tekst){
  if(!stem||!tekst)return;
  toonZegt(tekst);
  BrewStem.zeg(tekst);      // ElevenLabs met eigen sleutel, anders de stem van de telefoon
}
let zegtT=0;
function toonZegt(tekst){
  const e=$('zegt'); e.querySelector('span').textContent='“'+tekst+'”';
  e.classList.add('op'); clearTimeout(zegtT);
  zegtT=setTimeout(()=>e.classList.remove('op'),3400);
}
function zin(d){
  const x=String(d).replace(/\s*[—;]\s*/g,', ').replace(/×/g,' keer ')
    .replace(/(\d+):(\d\d)/g,'$1 minuut $2').replace(/\s+/g,' ').trim();
  return x?(x.charAt(0).toUpperCase()+x.slice(1)+'.'):'';
}
const KORT={swirl:'Swirlen.',roer:'Roeren.',wacht:'Laten trekken.',keer:'Kop erop, en omdraaien.',pers:'Drukken, rustig.',
  dose:'Koffie erbij.',plunjer:'Plunjer erop.',lucht:'Lucht eruit.',dop:'Dop erop.',doorloop:'Laten zakken.'};
const VOORAF={swirl:'swirlen',roer:'roeren',wacht:'laten trekken',keer:'omdraaien',pers:'drukken',dose:'koffie erbij',
  plunjer:'plunjer erop',lucht:'lucht eruit',dop:'dop erop',doorloop:'laten zakken'};
// alle zinnen die de stem in dit recept kan zeggen, in volgorde
function stemZinnen(){
  const l=[];
  for(let j=0;j<S.length;j++)l.push(tekstVooraf(j),tekstNu(j,true));
  for(let j=0;j<S.length;j++)l.push(tekstNu(j,false));
  return l.concat(['Klaar. Tik op klaar en proef.','Klaar.']);
}
function tekstVooraf(j){
  const s=S[j];
  if(s.g)return 'Over drie tellen '+(s.na?'aanvullen ':'')+'naar '+s.g+' gram.';
  return 'Over drie tellen: '+(VOORAF[s.actie]||s.actie)+'.';
}
function tekstNu(j,vooraf){
  const s=S[j];
  if(speed!==1||vooraf==='kort'){
    if(s.g)return 'Naar '+s.g+' gram.';
    return KORT[s.actie]||'';
  }
  if(s.g)return vooraf===true?'Nu.':('Nu: naar '+s.g+' gram.');
  if(s.k==='keer'||s.k==='pers')return KORT[s.k];
  return zin(s.d);
}
function stemCheck(){
  if(fase!=='loopt')return;
  for(let j=1;j<S.length;j++){
    if(!gezegd['v'+j]&&t>=starts[j]-GC_VOORAF&&t<starts[j]){
      if(speed===1){gezegd['v'+j]=true;zeg(tekstVooraf(j));}else gezegd['v'+j]='kort';
    }
  }
  for(let k=0;k<S.length;k++){
    if(!gezegd['n'+k]&&t>=starts[k]){gezegd['n'+k]=true;zeg(tekstNu(k,gezegd['v'+k]));}
  }
  if(eindOp!=null&&!gezegd.eind){gezegd.eind=true;zeg('Klaar. Tik op klaar en proef.');}
}
function stemKnop(){
  stem=!stem;
  try{localStorage.setItem('scc_gc_stem',stem?'1':'0');}catch(e){}
  if(stem){
    if(!BrewStem.kan())meld('no voice in this browser — the screen still shows every step');
    else zeg('Stem aan.');
  }else{
    BrewStem.stil();
    $('zegt').classList.remove('op');
  }
}
let meldT=0;
function meld(m){
  const e=$('toast'); e.textContent=m; e.classList.add('op');
  clearTimeout(meldT); meldT=setTimeout(()=>e.classList.remove('op'),2800);
}

/* ---- het scherm blijft aan zolang je zet ---- */
let wake=null, wakeStatus='';
function wakeAan(){
  if(!('wakeLock' in navigator)){wakeStatus='nee';return;}
  try{
    navigator.wakeLock.request('screen').then(w=>{
      if(!(fase==='loopt'||fase==='aftel')){try{w.release();}catch(e){}return;}
      wake=w; wakeStatus='aan';
      w.addEventListener('release',()=>{wake=null;if(fase==='loopt'||fase==='aftel')wakeStatus='los';});
    }).catch(()=>{wakeStatus='nee';});
  }catch(e){wakeStatus='nee';}
}
function wakeUit(){
  try{if(wake)wake.release();}catch(e){}
  wake=null; wakeStatus='';
}
document.addEventListener('visibilitychange',()=>{
  if(open&&document.visibilityState==='visible'&&(fase==='loopt'||fase==='aftel')&&!wake)wakeAan();
});

/* ---- de liniaal onder de teller ---- */
let linEls=[];
function linBouw(){
  const lin=$('lin');
  lin.querySelectorAll('.lin-giet,.lin-tik').forEach(e=>e.remove());
  linEls=[];
  S.forEach((s,j)=>{
    if(!isFinite(starts[j]))return;
    if(s.g||s.k==='pers'){const e=document.createElement('i');e.className='lin-giet';lin.insertBefore(e,$('lin-nu'));linEls.push({e,j,giet:true});}
    if(j>0){const b=document.createElement('b');b.className='lin-tik';lin.insertBefore(b,$('lin-nu'));linEls.push({e:b,j,giet:false});}
  });
}
function blok(j){return S[j].k==='pers'?[persBegin(),persEind()]:[w0(j),w1(j)];}
function linUpdate(){
  const span=fase==='af'?Math.max(eindT,1):Math.max(eindVerwacht(),Math.max(0,t)+3);
  const nu=fase==='af'?eindT:Math.max(0,t);
  linEls.forEach(o=>{
    if(o.giet){
      const [a,b]=blok(o.j);
      o.e.style.left=(a/span*100)+'%';
      o.e.style.width=Math.max(1.2,(b-a)/span*100)+'%';
      o.e.classList.toggle('gedaan',nu>=b);
    }else{o.e.style.left=(starts[o.j]/span*100)+'%';o.e.classList.toggle('gedaan',nu>=starts[o.j]);}
  });
  const p=Math.min(100,nu/span*100);
  $('lin-nu').style.left=p+'%'; $('lin-ged').style.width=p+'%';
  zet('lin-eind',fase==='af'?fmt(eindT):'~'+fmt(eindVerwacht()));
}

/* ---- de woorden op het scherm ---- */
function zet(id,html){if(cache[id]!==html){cache[id]=html;$(id).innerHTML=html;}}
function label(s){
  if(s.g)return (s.na?'top up to ':'pour to ')+s.g+' g';
  return esc(AP_NAAM[s.actie]||s.actie);
}
function doelVan(i){
  const s=S[i];
  if(s.g)return [s.g+' g',''];
  if(s.k==='pers')return [R.uit?('~'+R.uit+' g'):('~'+PERS_DUUR+' s'),''];
  if(s.k==='keer')return ['now',''];
  if(s.k==='swirl'||s.k==='roer')return ['5 s','stil'];
  if(s.actie==='dose'){const m=String(s.d).match(/(\d+(?:[.,]\d+)?)\s*g\b/);return [m?(m[1]+' g'):'','stil'];}
  if(s.actie==='plunjer')return ['~1 cm','stil'];
  if(s.actie==='wacht'&&i<S.length-1)return ['until '+fmt(starts[i+1]),'lang'];
  return ['',''];
}
function grootGetal(txt){
  return txt.split('').map(ch=>ch===':'?'<span class="dp">:</span>':'<span class="c">'+ch+'</span>').join('');
}
function render(){
  const i=cur(), s=S[i], bezig=(fase==='loopt'||fase==='pauze'||fase==='aftel');
  const tel=(t<0&&bezig);
  zet('tijd',grootGetal(tel?String(Math.max(1,Math.ceil(-t-1e-6))):fmt(fase==='af'?eindT:Math.max(0,t))));
  $('tijd').classList.toggle('tel',tel);
  linUpdate();

  zet('info-l',esc([R.om?'inverted':'regular',R.dose+' g',R.water+' g water',R.temp?(R.temp+' °C'):'',R.maling].filter(Boolean).join(' · ')));
  const wk=bezig&&fase!=='pauze'?(wakeStatus==='aan'?'screen stays on':(wakeStatus?'screen may dim':'')):'';
  zet('info-r',[wk,speed>1?speed+'× demo':''].filter(Boolean).join(' · '));

  // vorige
  const prep=R.om?('upside down on the plunger, paper rinsed, '+R.dose+' g in'):('paper in the cap, on your cup, '+R.dose+' g in');
  let v;
  if(fase==='klaar')v='<span class="tt">before</span><span class="v-wat">'+prep+'</span>';
  else if(fase==='af')v='<span class="tt">'+fmt(starts[i])+'</span>'+GC_VINK+'<s>'+label(S[i])+'</s>';
  else if(i===0)v='<span class="tt">before</span>'+GC_VINK+'<s>'+prep+'</s>';
  else v='<span class="tt">'+fmt(starts[i-1])+'</span>'+GC_VINK+'<s>'+label(S[i-1])+'</s>';
  zet('r-vorige',v);

  // nu
  let wat, doel='', dcls='', d, balk=0, tl='', tr='', keer=false;
  if(fase==='af'){
    wat='done'; doel=fmt(eindT); d='Taste it. The times are in your brew below.'; balk=1;
  }else{
    wat=s.g?(s.na?'top up to':'pour to'):esc(AP_NAAM[s.actie]||s.actie);
    [doel,dcls]=doelVan(i);
    keer=s.k==='keer'&&t>=0&&fase!=='klaar';
    d=(s.k==='keer'?PIJL_OM:'')+esc(s.d);
    if(fase==='klaar')tl=S[0].g?'tap start, then pick up the kettle':'tap start';
    else if(t<0)tl=S[0].g?'pick up the kettle':'get ready';
    else if(eindOp!=null){balk=1;tl='all done — tap done';}
    else if(s.g){
      const f=klem((t-w0(i))/s.dur,0,1); balk=f;
      if(t<w0(i))tl='lift the AeroPress off the cup';
      else if(f<1){tl='~'+Math.round(s.van+s.a*f)+' g by now';tr=fmtIn(w1(i)-t)+' left';}
      else tl='at '+s.g+' g, '+(s.na?'taste it':'let it steep');
    }else if(s.k==='pers'){
      const a=persBegin(), b=persEind(); balk=klem((t-a)/Math.max(1,b-a),0,1);
      if(t<a)tl=R.om?'turning over…':'plunger on first';
      else{tl='slow and steady, all the way';tr=fmtIn(b-t)+' left';}
    }else if(s.k==='keer'){
      balk=klem((t-starts[i])/3,0,1); tl='hold cup and chamber together';
    }else{
      const e=i<S.length-1?starts[i+1]:eindVerwacht();
      balk=klem((t-starts[i])/Math.max(1,e-starts[i]),0,1);
      tl={swirl:'a few gentle turns',roer:'one side of the stick',dose:'sprinkle it on top',lucht:'slowly, until the coffee reaches the top',dop:'twist it tight'}[s.actie]||'hands off';
      if(i<S.length-1)tr=fmtIn(starts[i+1]-t)+' left';
    }
  }
  zet('r-nu','<div class="nu-kop"><span class="nu-wat">'+wat+'</span><span class="nu-doel '+dcls+'">'+doel+'</span></div>'+
    '<div class="nu-d">'+d+'</div><div class="nu-balk"><i style="width:'+(balk*100).toFixed(1)+'%"></i></div>'+
    '<div class="nu-tempo"><span>'+tl+'</span><span>'+tr+'</span></div>');
  $('r-nu').classList.toggle('keer',keer);
  const sleutel=fase==='af'?'af':i;
  if(sleutel!==vorigeCur){
    if(vorigeCur!==-1&&!RMQ.matches){const nu=$('r-nu');nu.classList.remove('land');void nu.offsetWidth;nu.classList.add('land');}
    vorigeCur=sleutel;
  }

  // straks
  let n, bijna=false;
  if(fase==='af')n='<span class="n-lbl">next</span><span class="n-wat">taste it, then log the brew</span>';
  else if(i<S.length-1){
    const over=starts[i+1]-Math.max(0,t);
    bijna=(fase==='loopt'||fase==='pauze')&&over<=GC_VOORAF;
    n='<span class="n-lbl">next</span><span class="n-wat">'+label(S[i+1])+'</span><span class="n-in">in '+fmtIn(over)+'</span>';
  }else n='<span class="n-lbl">next</span><span class="n-wat">'+(eindOp!=null?'tap done':'tap done when you are done')+'</span>';
  zet('r-volg',n);
  $('r-volg').classList.toggle('bijna',bijna);

  zet('b-start',{klaar:'start',aftel:'pause',loopt:'pause',pauze:'resume',af:'log it'}[fase]);
  const bv=$('b-volg');
  bv.disabled=(fase==='klaar'||fase==='af');
  zet('b-volg',(!bv.disabled&&t>=0&&i===S.length-1)?'done':'next step');
  bv.classList.toggle('nadruk',eindOp!=null&&fase!=='af');
  const bs=$('b-stem');
  zet('b-stem',(stem?GC_STEM_AAN:GC_STEM_UIT)+'<span>'+(stem?'voice on':'voice off')+'</span>');
  bs.classList.toggle('aan',stem); bs.setAttribute('aria-pressed',stem?'true':'false');
}

/* ---- de lus: alleen zolang de coach open is ---- */
let last=0;
function frame(now){
  if(!open){raf=0;return;}
  const ruw=Math.max(0,(now-last)/1000); last=now;
  if(fase==='aftel'||fase==='loopt'){
    t+=ruw*speed;
    if(fase==='aftel'&&t>=0)fase='loopt';
  }
  if((fase==='loopt'||fase==='pauze')&&eindOp==null&&cur()===S.length-1&&t>=eindVerwacht())eindOp=t;
  stemCheck();
  teken(scene(fase==='klaar'?-1:(fase==='af'?eindT:t)));
  render();
  raf=requestAnimationFrame(frame);
}

/* ---- openen en sluiten ---- */
function maak(){
  if(document.getElementById('apcoach'))return;
  const e=document.createElement('div');
  e.id='apcoach'; e.className='gc'; e.hidden=true;
  e.setAttribute('role','dialog'); e.setAttribute('aria-modal','true'); e.setAttribute('aria-label','AeroPress coach');
  e.innerHTML=
    '<div class="gc-top"><div class="gc-naam" id="ap-naam"></div>'+
    '<button type="button" class="ik rand" id="ap-b-dicht" aria-label="close">'+GC_KRUIS+'</button></div>'+
    '<div class="gc-info"><span id="ap-info-l"></span><span class="r" id="ap-info-r"></span></div>'+
    '<div class="gc-tek">'+AP_TEKENING+
      '<div class="gc-zegt rand" id="ap-zegt" aria-hidden="true">'+GC_STEM_AAN+'<span></span></div></div>'+
    '<div class="gc-klok"><div class="gc-tijd" id="ap-tijd" aria-live="off"></div>'+
      '<div class="lin-rij"><span>0:00</span><div class="lin" id="ap-lin"><div class="lin-as"></div>'+
      '<div class="lin-ged" id="ap-lin-ged"></div><div class="lin-nu" id="ap-lin-nu"></div></div>'+
      '<span id="ap-lin-eind"></span></div></div>'+
    '<div class="gc-strook"><div class="r-vorige" id="ap-r-vorige"></div>'+
      '<div class="r-nu rand" id="ap-r-nu"></div><div class="r-volg rand" id="ap-r-volg"></div></div>'+
    '<div class="gc-knoppen">'+
      '<button type="button" class="kn kn-stem rand" id="ap-b-stem" aria-pressed="false"></button>'+
      '<button type="button" class="kn kn-start rand" id="ap-b-start">start</button>'+
      '<button type="button" class="kn kn-volg rand" id="ap-b-volg" disabled>next step</button></div>'+
    '<div class="gc-toast rand" id="ap-toast" role="status"></div>';
  document.body.appendChild(e);
  el=null;
  $('b-dicht').addEventListener('click',dichtKnop);
  $('b-stem').addEventListener('click',stemKnop);
  $('b-start').addEventListener('click',startKnop);
  $('b-volg').addEventListener('click',volgende);
}
function openen(){
  if(!pc.steps.length)pourBuild();
  if(!pc.steps.length){toast('no schedule yet — write a recipe first');return;}
  maak(); cache={};
  try{stem=localStorage.getItem('scc_gc_stem')==='1';}catch(e){}   // gedeeld met de andere coaches
  bouw();
  const e=document.getElementById('apcoach');
  e.hidden=false; document.body.classList.add('gc-open'); open=true;
  last=performance.now();
  if(!raf)raf=requestAnimationFrame(frame);
}
function dichtKnop(){
  if(fase==='aftel'||fase==='loopt'||fase==='pauze'){
    if(!confirm('stop this brew? the times so far go into your brew'))return;
    if(t>0)klaar(); else reset();
  }
  sluit();
}
function sluit(){
  open=false; wakeUit();
  BrewStem.stil();
  const e=document.getElementById('apcoach'); if(e)e.hidden=true;
  document.body.classList.remove('gc-open');
  if(raf){cancelAnimationFrame(raf);raf=0;}
}
return {openen,sluit,isOpen:()=>open,snelheid:n=>{speed=n>1?n:1;},
  stand:()=>({fase,t,eindT,eindOp,cur:cur(),starts:starts.slice(),om:R&&R.om,uit:R&&R.uit,eind:R?eindVerwacht():null,
    S:S.map(x=>({t:x.t,g:x.g,k:x.k,actie:x.actie,dur:x.dur,na:!!x.na,van:x.van}))}),
  scene:tt=>scene(tt)};
})();
function apOpen(){ap.openen();}
