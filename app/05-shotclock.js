/* De E61 uit docs/opzet-shotclock-e61.html (dezelfde lijnen als de oude shot timer). Alle ids beginnen met sc-. */
const SC_TEKENING="<svg viewBox=\"36 -14 214 256\" id=\"sc-svg\" preserveAspectRatio=\"xMidYMid meet\" aria-hidden=\"true\">\n<defs>\n<clipPath id=\"sc-cupclip\"><path d=\"M99 181 Q120 177 141 181 Q139 202 130 210 Q120 214 110 210 Q101 202 99 181 Z\"/></clipPath>\n<clipPath id=\"sc-puckclip\"><path d=\"M92 118 Q120 127 148 118.5 Q146 128 143 136.5 Q120 144 97 135 Q94.5 127 92 118 Z\"/></clipPath>\n</defs>\n<g class=\"sc-in\"><path d=\"M102 58 Q100.5 84 103 110\"/><path d=\"M138 58 Q139.5 84 137 110\"/></g>\n<g class=\"sc-grain\">\n<path d=\"M99 126 l2 .4\"/><path d=\"M106 130 l1.8 -.5\"/><path d=\"M113 125.5 l2 .3\"/><path d=\"M121 132 l1.6 .5\"/>\n<path d=\"M128 126.5 l2 -.3\"/><path d=\"M135.5 130 l1.7 .4\"/><path d=\"M140.5 124 l1.5 .3\"/><path d=\"M116 137 l1.8 -.2\"/>\n</g>\n<rect id=\"sc-wet\" x=\"86\" y=\"114\" width=\"68\" height=\"0\" clip-path=\"url(#sc-puckclip)\"/>\n<g class=\"sc-stream\">\n<path d=\"M105.5 157 Q108.5 172 115.5 208\"/>\n<path d=\"M134.5 157 Q131.5 172 124.5 208\"/>\n</g>\n<g class=\"sc-drops\">\n<path class=\"sc-drop dl\" d=\"M104.5 155.5 Q106.5 158.8 106.1 159.9 Q105.5 161.2 104.5 161.2 Q103.4 161.2 102.9 159.9 Q102.5 158.8 104.5 155.5\"/>\n<path class=\"sc-drop dl d2\" d=\"M104.5 155.5 Q106.5 158.8 106.1 159.9 Q105.5 161.2 104.5 161.2 Q103.4 161.2 102.9 159.9 Q102.5 158.8 104.5 155.5\"/>\n<path class=\"sc-drop dr\" d=\"M135.5 155.5 Q137.5 158.8 137.1 159.9 Q136.5 161.2 135.5 161.2 Q134.4 161.2 133.9 159.9 Q133.5 158.8 135.5 155.5\"/>\n<path class=\"sc-drop dr d2\" d=\"M135.5 155.5 Q137.5 158.8 137.1 159.9 Q136.5 161.2 135.5 161.2 Q134.4 161.2 133.9 159.9 Q133.5 158.8 135.5 155.5\"/>\n</g>\n<rect id=\"sc-fill\" x=\"96\" y=\"213\" width=\"48\" height=\"0\" clip-path=\"url(#sc-cupclip)\"/>\n<rect id=\"sc-crema\" x=\"96\" y=\"213\" width=\"48\" height=\"0\" clip-path=\"url(#sc-cupclip)\"/>\n<g class=\"sc-ink\">\n<path d=\"M64 21 Q120 9 176.5 16\"/>\n<path d=\"M172.5 13.5 Q169 26 163.5 39\"/>\n<path d=\"M168.5 35 Q120 43.5 70 32\"/>\n<path d=\"M75.5 37 Q70 25 65.5 16.5\"/>\n<path class=\"sc-b\" d=\"M68.5 18 Q120 14 172 20.5\"/>\n<path class=\"sc-b\" d=\"M169 18 Q166 27.5 162 35.5\"/>\n<path class=\"sc-b\" d=\"M165 32 Q120 39 74.5 36\"/>\n<path class=\"sc-b\" d=\"M72 31.5 Q69.5 24 67 19\"/>\n<path d=\"M97.5 28.5 Q95 42 92.5 57.5\"/>\n<path class=\"sc-b\" d=\"M99.5 33 Q97.5 43 96 54\"/>\n<path d=\"M143 29 Q145.5 42 148 57\"/>\n<path class=\"sc-b\" d=\"M141 34 Q143.5 44 145 53.5\"/>\n<path d=\"M87.5 45.5 Q77.5 80 82 100.5 Q86 112.5 96 118.5\"/>\n<path d=\"M152.5 46.5 Q162.5 80 158 100 Q154 113 144 119\"/>\n<path d=\"M79.5 52.5 Q120 43.5 160.5 53.5\"/>\n<path d=\"M88 112.5 Q120 124 152.5 111.5\"/>\n<path class=\"sc-b\" d=\"M85 51 Q80.5 82 84 100 Q88 110 95 115\"/>\n<path class=\"sc-b\" d=\"M155 52 Q159.5 82 156 99.5 Q152 110 145 115.5\"/>\n<path class=\"sc-b\" d=\"M84 55.5 Q120 48.5 156.5 56\"/>\n<path class=\"sc-b\" d=\"M91 110 Q120 119.5 149 109.5\"/>\n<path d=\"M129.5 78.5 Q131 91 118 93.5 Q105.5 93 105 81.5 Q105.5 70 118.5 70 Q128 70.5 129.5 78 Q130 82.5 128 88\" opacity=\"0.62\"/>\n<path class=\"sc-b\" d=\"M126.5 81.5 Q127 89.5 118.5 91 Q109.5 90.5 108.5 82 Q109 74.5 117.5 74 Q125 74.5 126.5 81\" opacity=\"0.62\"/>\n<path d=\"M87 113.5 Q120 129.5 153 114\"/>\n<path d=\"M149.5 116.5 Q147 128 143 141.5\"/>\n<path d=\"M146.5 137 Q120 146 92.5 134.5\"/>\n<path d=\"M97 139.5 Q93.5 127 90 115\"/>\n<path class=\"sc-b\" d=\"M92.5 118 Q120 126 148 117.5\"/>\n<path class=\"sc-b\" d=\"M146 120 Q144 129 141.5 136.5\"/>\n<path class=\"sc-b\" d=\"M143.5 134.5 Q120 141.5 97.5 133\"/>\n<path class=\"sc-b\" d=\"M100 135 Q97 127 94.5 119.5\"/>\n<path d=\"M143.5 120.5 Q188 126 207.5 139 Q214.5 145 204.5 154.5\" stroke-width=\"2.2\"/>\n<path class=\"sc-b\" d=\"M150 127.5 Q184 132.5 201 142.5 Q207.5 147 202 150.5\"/>\n<path d=\"M111.5 137.5 Q108 148 104 158\"/>\n<path class=\"sc-b\" d=\"M113.5 143 Q111 149 108.5 154.5\"/>\n<path d=\"M128.5 137.5 Q132 148 136 158\"/>\n<path class=\"sc-b\" d=\"M126.5 143 Q129 149 131.5 154.5\"/>\n<path d=\"M91 175.5 Q120 169.5 149 177\"/>\n<path d=\"M146 173.5 Q142.5 200 132 215\"/>\n<path d=\"M134.5 210 Q120 219.5 105.5 210\"/>\n<path d=\"M109 214 Q97.5 201 93.5 174.5\"/>\n<path class=\"sc-b\" d=\"M97.5 180 Q120 176 143 181\"/>\n<path class=\"sc-b\" d=\"M141.5 178 Q139.5 200 130 210.5\"/>\n<path class=\"sc-b\" d=\"M131.5 208 Q120 214.5 108.5 208.5\"/>\n<path class=\"sc-b\" d=\"M110.5 210 Q100.5 200 98 179\"/>\n<path d=\"M141 181.5 Q162.5 179 164 192.5 Q165 206.5 140.5 207\"/>\n<path class=\"sc-b\" d=\"M144.5 187 Q157 185.5 158 192.5 Q158.5 200.5 146 202\"/>\n<path d=\"M77.5 216.5 Q120 229.5 162.5 216\" opacity=\"0.8\"/>\n<path class=\"sc-b\" d=\"M86 221.5 Q120 229.5 153 220\" opacity=\"0.8\"/>\n<path d=\"M53 228.5 Q120 239 187 229\" opacity=\"0.34\"/>\n<path class=\"sc-b\" d=\"M62 232.5 Q120 240 178 232.5\" opacity=\"0.34\"/>\n</g>\n<g id=\"sc-lever\">\n<path d=\"M153.5 53 Q177 87 200.5 122.5\" stroke-width=\"2.2\"/>\n<path class=\"sc-b\" d=\"M160.5 60.5 Q179 89 194 115.5\"/>\n<path d=\"M207 120 Q208.5 129.5 199 131 Q189.5 130 189 122 Q189.5 114 198.5 113.5 Q206 114 207.5 120.5 Q208 123 206.5 126\"/>\n<path class=\"sc-b\" d=\"M203.8 121.6 Q204.2 127.4 198.6 127.8 Q193.2 127.4 192.8 121.8 Q193.3 117.2 198.4 116.9 Q203.2 117.3 204.1 122.4\"/>\n</g>\n</svg>";
/* ---------------- shot clock E61 (volledig scherm) ----------------
   Volgens docs/opzet-shotclock-e61.html, in dezelfde opbouw als de
   gietcoach (app/04-gietcoach.js) en de AeroPress-coach: bovenaan het
   recept, de tekening, een grote klok, de doelband, de strook vorige / nu /
   volgende en grote knoppen.
   - Pre-infusie (aan/uit, seconden) en rust horen bij het recept. Wat je
     instelt staat in state.recipePre[recept-id]; zonder eigen instelling
     geldt recipe.pre, en anders Jesse's eigen manier: 5 s pre, 3 s rust.
   - Alleen de seconden volle druk tellen voor de doeltijd (keuze Jesse).
     Pre-infusie en rust komen erbovenop; de totale tijd staat er klein bij.
   - Het gewicht in het kopje is een schatting op doeltempo, geen meting.
   - Tarra: het eigen gewicht van je onderdelen staat in state.tare (my gear);
     wat er op de weegschaal ligt in state.tareOn.                         */
const SC_DELEN=[
  {id:'naked', n:'naked',         lang:'naked portafilter',        kort:'naked',    pf:true},
  {id:'spout', n:'double spout',  lang:'double spout portafilter', kort:'spout',    pf:true},
  {id:'ring',  n:'dosing ring',   lang:'dosing ring',              kort:'ring'},
  {id:'ps1',   n:'puck screen 1', lang:'puck screen 1',            kort:'screen 1'},
  {id:'ps2',   n:'puck screen 2', lang:'puck screen 2',            kort:'screen 2'},
  {id:'cup',   n:'dosing cup',    lang:'dosing cup',               kort:'cup'},
];
const SC_PRE_STANDAARD={on:true,s:5,rust:3};

// het recept waar de shot clock op het dial-in-scherm uit leest (of null)
function scReceptNu(){
  const r=recipeById((state.lastRecipe||{})[formMethod]);
  return (r&&recipeFam(r)==='espresso')?r:null;
}
// pre-infusie van een recept: eigen instelling, anders die van het recept
function scPreVan(r){
  const key=r?r.id:'target';
  const eigen=(state.recipePre||{})[key];
  const basis=(r&&r.pre)||SC_PRE_STANDAARD;
  const p=Object.assign({},basis,eigen&&typeof eigen==='object'?eigen:{});
  return {on:!!p.on, s:Math.max(1,Math.min(15,Math.round(+p.s||5))), rust:Math.max(0,Math.min(10,Math.round(+p.rust||0)))};
}
function scPreZet(r,p){
  if(!state.recipePre||typeof state.recipePre!=='object')state.recipePre={};
  state.recipePre[r?r.id:'target']={on:!!p.on,s:p.s,rust:p.rust};
  save();
}
/* Puck-prep: staat pre-infusie aan in het recept, dan is de rij
   "pre-infusion" vooraf aangevinkt met de seconden. Een prep die je al had
   (opnieuw zetten vanaf een oude shot) blijft staan.                       */
function scVulPrep(forceer){
  if(!(state.prepItems||[]).some(x=>x.id==='preinf'))return;
  if(!forceer&&formPrep.preinf)return;
  const p=scPreVan(scReceptNu());
  if(p.on)formPrep.preinf={on:true,val:String(p.s)};
  else if(forceer)formPrep.preinf={on:false,val:''};
}

/* ---- tarra-gewichten in my gear (profiel) ---- */
function scTareG(id){const v=(state.tare||{})[id];return (typeof v==='number'&&isFinite(v)&&v>0)?v:null;}
function scParseG(v){const n=parseFloat(String(v==null?'':v).replace(',','.'));return isFinite(n)?n:null;}
const scG10=x=>Math.round(x*10)/10;
function scZetTare(id,v){
  if(!SC_DELEN.some(d=>d.id===id))return false;
  if(!state.tare||typeof state.tare!=='object')state.tare={};
  if(String(v==null?'':v).trim()===''){delete state.tare[id];return true;}
  const n=scParseG(v);
  if(n==null||n<=0||n>=3000)return false;
  state.tare[id]=scG10(n);return true;
}
function renderTareGear(){
  const el=document.getElementById('tare-gear');if(!el)return;
  el.innerHTML=SC_DELEN.map(d=>{
    const g=scTareG(d.id);
    return '<div class="tg-rij"><label for="tare-'+d.id+'">'+esc(d.lang)+'</label>'+
      '<input id="tare-'+d.id+'" type="text" inputmode="decimal" autocomplete="off" placeholder="—" value="'+(g!=null?g.toFixed(1):'')+'" '+
      'onchange="setTareGear(\''+d.id+'\',this)"><span>g</span></div>';
  }).join('');
}
function setTareGear(id,inp){
  if(scZetTare(id,inp.value)){save();const g=scTareG(id);inp.value=g!=null?g.toFixed(1):'';}
  else{toast('type a weight in grams, e.g. 512.4');const g=scTareG(id);inp.value=g!=null?g.toFixed(1):'';}
}

const shot=(()=>{
const $=id=>document.getElementById('sc-'+id);
const RMQ=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const TOL=3;                 // zelfde marge als diAdvice: 3 s naar elke kant
const VEILIG=60;             // na een minuut stopt hij zelf
const LEVER={down:0, rest:-46, pre:-66, full:-100};
const MIN='<svg viewBox="0 0 24 24" class="acic" style="width:26px;height:26px;stroke-width:2.4"><path d="M5.2 12.4 Q12 11.5 18.9 12.1"/></svg>';
const PLUS='<svg viewBox="0 0 24 24" class="acic" style="width:26px;height:26px;stroke-width:2.4"><path d="M5.2 12.4 Q12 11.5 18.9 12.1"/><path d="M12.3 5.1 Q11.7 12 12.1 19"/></svg>';
const SCHUIF='<svg viewBox="0 0 24 24" class="acic" aria-hidden="true"><path d="M3.6 8.1 Q12 7.5 20.6 8.3"/><path d="M3.4 16 Q12 15.6 20.5 16.2"/><path d="M10.6 6 Q12.3 6.3 12.1 8.1 Q11.9 9.9 10.2 9.8 Q8.5 9.5 8.7 7.8 Q8.9 6.1 11 6.3"/><path d="M15.4 14.1 Q17.1 14.4 16.9 16.2 Q16.7 18 15 17.9 Q13.3 17.6 13.5 15.9 Q13.7 14.2 15.8 14.4"/></svg>';
const KRUIS='<svg viewBox="0 0 24 24" class="acic" aria-hidden="true"><path d="M6.2 6.4 Q12 12.2 17.8 17.6"/><path d="M17.6 6.2 Q12 12 6.4 17.8"/></svg>';

const sc={open:false,dose:null,speed:1,run:false,t:0,last:0,stand:'ready',stopT:null,drop:null,yOut:null,
          phase:null,sheet:false,gear:false,raf:0,tareOpen:false,check:''};
let R=null;                  // het recept waar deze shot uit leest
const cl=x=>Math.max(0,Math.min(1,x));
function mss(sec){sec=Math.max(0,sec);const m=Math.floor(sec/60),s=Math.floor(sec%60);return m+':'+String(s).padStart(2,'0');}
function mssUp(sec){return mss(Math.ceil(sec-1e-6));}
function tenth(sec){return mss(sec)+'.'+Math.floor((sec*10+1e-6)%10);}

/* ---- het plan van de shot, uit recept en doel van het dial-in-scherm ---- */
function receptInfo(){
  const r=scReceptNu(), t=pendingTarget||{};
  const veld=parseFloat((document.getElementById('di-dose')||{}).value);
  const dose=parseFloat(t.dose)||(r&&r.dose)||(veld>0?veld:18);
  const Y=Math.round(parseFloat(t.yield)||(r?r.dose*r.ratio:dose*2));
  const F=parseTimeSec(t.time)||(r&&parseTimeSec(r.tijd))||28;
  return {r,naam:r?r.naam:'your target',dose,Y,F,pre:scPreVan(r)};
}
function plan(){
  const p0=R||receptInfo(),on=p0.pre.on,P=on?p0.pre.s:0,Rr=on?p0.pre.rust:0,fs=P+Rr;
  const Y=p0.Y, F=p0.F;                       // doel: seconden onder volle druk
  const Tc=fs+F;                               // geschat moment van het doelgewicht, vanaf de hendel
  const ts=on?fs+1.5:5.5;                      // eerste straal: natte puck snel, droge puck traag
  const ph=[];
  if(on){ph.push({id:'pre',a:0,b:P});if(Rr>0)ph.push({id:'rest',a:P,b:P+Rr});}
  ph.push({id:'full',a:fs,b:Tc});
  ph.push({id:'stop',a:Tc,b:Infinity});
  return {on,P,R:Rr,fs,Y,F,Tc,ts,lo:Math.max(1,F-TOL),hi:F+TOL,ph,dose:p0.dose};
}
/* geschat gewicht op doeltempo -- géén meting */
function weight(t,p){
  let w=0;
  if(p.on){w+=0.5*cl((t-0.6*p.P)/(0.4*p.P+0.8));w+=0.4*cl((t-p.fs)/(p.ts-p.fs));}
  else w+=0.9*cl((t-3.5)/(p.ts-3.5));
  if(t>p.ts){const x=(t-p.ts)/(p.Tc-p.ts);w+=(p.Y-0.9)*(x<=1?Math.pow(x,1.2):1+1.2*(x-1));}
  return w;
}
function wetAt(t,p){
  if(!p.on)return cl(t/4);
  if(t<p.P)return 0.75*t/p.P;
  if(t<p.fs)return 0.75+0.25*Math.sqrt((t-p.P)/Math.max(0.01,p.R));   // de puck trekt in
  return Math.min(1,0.75+0.25*(t-p.fs)/1);
}
function dripAt(t,p){
  if(t>=p.ts)return false;
  if(p.on)return (t>0.6*p.P&&t<p.P+0.8)||(t>p.fs&&t<p.ts);
  return t>3.5;
}
function phaseAt(t,p){let i=0;p.ph.forEach((x,k)=>{if(t>=x.a)i=k;});return i;}
function naam(id,p){return {pre:'pre-infusion',rest:'rest',full:'full pressure',stop:'lever down at '+p.Y+' g'}[id];}
function zone(f,p){return f<p.lo?'fast':f>p.hi?'slow':'good';}   // f = seconden volle druk
function fullS(t,p){return Math.max(0,t-p.fs);}
// de tijd die telt: seconden volle druk (zonder volle druk: de tijd vanaf de hendel)
function shotTime(p){return sc.stopT>p.fs?sc.stopT-p.fs:sc.stopT;}

/* ---------- tekening ---------- */
function setLever(a){$('lever').style.transform='rotate('+a+'deg)';}
function paintArt(t,p,running){
  const svg=$('svg');
  const i=running?phaseAt(t,p):-1, id=i>=0?p.ph[i].id:null;
  const water=running&&(id==='pre'||id==='full'||id==='stop');
  svg.classList.toggle('water',water);
  svg.classList.toggle('slow',water&&id==='pre');
  svg.classList.toggle('flow',running&&t>=p.ts);
  svg.classList.toggle('thin',running&&t>p.Tc-4);
  if(running)svg.classList.toggle('drip',dripAt(t,p));
  const wet=(running||sc.stand==='done')?wetAt(sc.stand==='done'?sc.stopT:t,p):0;
  $('wet').setAttribute('height',(wet*30).toFixed(1));
  const w=(sc.stand==='ready')?0:weight(sc.stand==='done'?sc.stopT:t,p);
  const top=181,bot=213,h=cl(w/p.Y)*0.9*(bot-top),y=bot-h;
  $('fill').setAttribute('y',y.toFixed(2));$('fill').setAttribute('height',h.toFixed(2));
  const ch=Math.min(h,2+3*cl(w/p.Y));
  $('crema').setAttribute('y',y.toFixed(2));$('crema').setAttribute('height',ch.toFixed(2));
  return w;
}

/* ---------- doelband ---------- */
function bandMax(p){return Math.ceil((p.hi+10)/5)*5;}
function renderBand(){
  const p=plan(),S=bandMax(p),W=Math.round($('band').clientWidth)||330,X=t=>4/100*W+cl(t/S)*(W*0.92);
  let s='<svg viewBox="0 0 '+W+' 26">';
  s+='<rect x="'+X(p.lo)+'" y="3" width="'+(X(p.hi)-X(p.lo))+'" height="18" fill="var(--card-2)" stroke="none"/>';
  s+='<path d="M'+(X(0)-5)+' 3.5 Q'+W/2+' 1.6 '+(X(S)+6)+' 3"  stroke-width="1.7"/>';
  s+='<path d="M'+(X(0)-6)+' 21 Q'+W/2+' 22.6 '+(X(S)+5)+' 20.6" stroke-width="1.7"/>';
  s+='<path d="M'+(X(0)-3)+' 2.4 Q'+W/2+' 4.4 '+(X(S)+3)+' 4.2" stroke-width="1.2" opacity=".55"/>';
  s+='<path d="M'+X(0)+' -1.5 Q'+(X(0)-1.2)+' 12 '+(X(0)+.6)+' 25" stroke-width="1.7"/>';
  s+='<path d="M'+X(S)+' -1 Q'+(X(S)+1.3)+' 12 '+(X(S)-.4)+' 25.5" stroke-width="1.7"/>';
  s+='<path d="M'+X(p.lo)+' -2 Q'+(X(p.lo)+1.2)+' 12 '+(X(p.lo)-.5)+' 26" stroke-width="1.5"/>';
  s+='<path d="M'+X(p.hi)+' -1.5 Q'+(X(p.hi)-1)+' 12 '+(X(p.hi)+.6)+' 26.5" stroke-width="1.5"/>';
  s+='<g id="sc-mark" style="display:none"><path d="M0 -5 Q.8 12 -.4 30" stroke-width="2.8"/><path d="M-4.5 -6.5 Q0 -4 4.6 -6.8" stroke-width="2.2"/></g>';
  s+='</svg>';
  const L=(t)=>(X(t)/W*100).toFixed(1)+'%';
  s+='<span class="sc-bn" style="left:2px;top:-3px;transform:none;font-size:13px">full pressure</span>';
  s+='<span class="sc-bn" style="left:'+L(p.lo)+'">'+mss(p.lo)+'</span>';
  s+='<span class="sc-bn" style="left:'+L(p.hi)+'">'+mss(p.hi)+'</span>';
  s+='<span class="sc-bl" data-z="fast" style="left:0">too fast</span>';
  s+='<span class="sc-bl" data-z="good" style="left:'+L((p.lo+p.hi)/2)+';transform:translateX(-50%)">good</span>';
  s+='<span class="sc-bl" data-z="slow" style="right:0">too slow</span>';
  $('band').innerHTML=s;
  $('band').dataset.w=W;
}
function paintBand(t,p,show,oordeel){
  const m=$('mark');if(!m)return;
  const S=bandMax(p),W=+$('band').dataset.w||330,x=4/100*W+cl(t/S)*(W*0.92);
  m.style.display=show?'':'none';
  m.setAttribute('transform','translate('+x.toFixed(1)+' 0)');
  const z=(show&&oordeel)?zone(t,p):null;
  document.querySelectorAll('#sc-band .sc-bl').forEach(el=>el.classList.toggle('on',el.dataset.z===z));
}

/* ---------- strook vorige / nu / volgende ---------- */
let stripHTML='';
function setStrip(h){if(h!==stripHTML){$('strip').innerHTML=h;stripHTML=h;}}
function cur(k,d,v,u,cls){
  return '<div class="sc-cur '+(cls||'')+'"><div><div class="k">'+k+'</div><div class="d">'+d+'</div></div>'+
    (v!=null?'<div class="r"><div class="v'+(cls==='rust'?' sc-pulse':'')+'">'+v+'</div><div class="u">'+u+'</div></div>':'')+'</div>';
}
function prepZin(){
  const l=(state.prepItems||[]).filter(x=>x.id!=='preinf'&&x.id!=='temp'&&formPrep[x.id]&&formPrep[x.id].on).map(x=>x.name);
  return 'puck prep: '+(l.length?l.map(esc).join(' · '):'WDT · puckscreen · tamp');
}
function renderStrip(t,p){
  if(sc.stand==='ready'){
    const eerst=p.on?('pre-infusion '+mss(p.P)+(p.R?', rest '+mss(p.R):'')):'full pressure';
    setStrip('<div class="sc-prev">'+prepZin()+'</div>'+
      cur('pull the lever','cup on the scale, portafilter locked in')+
      '<div class="sc-next"><span>next</span><b>'+eerst+'</b></div>');
    return;
  }
  if(sc.stand==='done'){renderResult(p);return;}
  const i=phaseAt(t,p),x=p.ph[i],id=x.id;
  let prev;
  if(i===0)prev='lever pulled · 0:00';
  else{const v=p.ph[i-1];prev=naam(v.id,p)+' · '+tenth(v.b-v.a)+' done';}
  let c,n,nc='';
  if(id==='pre'){
    c=cur('pre-infusion','lever half up · the puck gets wet',mssUp(x.b-t),'left');
    n='<span>next</span><b>'+naam(p.ph[i+1].id,p)+' in '+mssUp(x.b-t)+'</b>';
  }else if(id==='rest'){
    c=cur('rest — wait','lever back to the middle · no pump · the puck soaks it up',mssUp(x.b-t),'left','rust');
    n='<span>next</span><b>full pressure in '+mssUp(x.b-t)+'</b>';nc=' sterk';
  }else if(id==='full'){
    c=cur('full pressure','lever all the way up · two streams into the cup',mss(p.F),'target');
    n='<span>next</span><b>lever down at '+p.Y+' g in ≈ '+mssUp(p.Tc-t)+'</b>';
  }else{
    c=cur('lever down','when your scale says '+p.Y+' g — the estimate is there','+'+mss(t-x.a),'past target');
    n='<span>next</span><b>done — as soon as you stop</b>';
  }
  setStrip('<div class="sc-prev">'+prev+'</div>'+c+'<div class="sc-next'+nc+'">'+n+'</div>');
}
// het oordeel na de shot: de maalregel uit diAdvice, op de seconden volle druk
function verdict(p){
  const t=sc.stopT;
  if(t<p.fs+1)return {k:'stopped early',d:'before full pressure — no read on the grind'};
  const drop=sc.drop!=null?'first drop '+tenth(sc.drop)+' · ':'';
  const F=t-p.fs;
  if(sc.yOut==null){
    const z=zone(F,p);
    const k=z==='fast'?'too fast — grind finer':z==='slow'?'too slow — grind coarser':'good — keep this grind';
    return {k,d:drop+'judged on full-pressure time'};
  }
  const f=sc.yOut/F,ft=p.Y/p.F;
  let k;
  if(f<ft*0.85)k='too slow — grind coarser';
  else if(f>ft*1.15)k='too fast — grind finer';
  else k=Math.abs(sc.yOut-p.Y)>2?'good flow — stop at '+p.Y+' g':'good — keep this grind';
  return {k,d:drop+'flow '+f.toFixed(2)+' g/s · target '+ft.toFixed(2)+' g/s'};
}
function renderResult(p){
  const v=verdict(p);
  const y=sc.yOut==null?p.Y:sc.yOut;
  const full=(sc.stopT-p.fs).toFixed(1);
  const prev=sc.stopT<=p.fs?'lever down before full pressure':
    (p.on?(p.P+' s pre + '+p.R+' s rest + '+full+' s full · total '+mss(sc.stopT)):(full+' s full pressure'));
  setStrip('<div class="sc-prev">'+prev+'</div>'+
    '<div class="sc-cur uitslag"><div><div class="k">'+v.k+'</div><div class="d">'+v.d+'</div></div></div>'+
    '<div class="sc-next gewicht"><span>on your scale</span>'+
      '<span style="display:flex;align-items:center;gap:6px">'+
      '<button type="button" class="sc-step" aria-label="less" data-a="w-">'+MIN+'</button>'+
      '<span class="sc-val" id="sc-yout" style="min-width:64px'+(sc.yOut==null?';color:var(--ink-soft)':'')+'">'+y+' g</span>'+
      '<button type="button" class="sc-step" aria-label="more" data-a="w+">'+PLUS+'</button></span></div>');
}

/* ---------- knoppen ---------- */
let btnKey='';
function renderBtns(){
  const key=sc.stand+'|'+(sc.drop!=null)+'|'+(sc.stand==='done'?Math.round(sc.stopT*10):'');
  if(key===btnKey)return;btnKey=key;
  let h;
  if(sc.stand==='ready')h='<button type="button" class="sc-btn pri" data-a="start">pull the lever</button>';
  else if(sc.stand==='run')h=
    '<button type="button" class="sc-btn" '+(sc.drop!=null?'disabled':'')+' data-a="drop">'+
      (sc.drop!=null?'drop '+tenth(sc.drop):'first drop')+'</button>'+
    '<button type="button" class="sc-btn pri" data-a="stop">stop</button>';
  else h='<button type="button" class="sc-btn" data-a="again">again</button>'+
    '<button type="button" class="sc-btn pri" data-a="use">use '+mss(shotTime(plan()))+'</button>';
  $('btns').innerHTML=h;
}

/* ---------- kop en paneel ---------- */
function renderHead(){
  const p=plan();
  $('rn').textContent=R.naam;
  $('rd').textContent=(sc.dose!=null?sc.dose.toFixed(1):p.dose)+' → '+p.Y+' g · '+(p.on?('pre '+p.P+' s · rest '+p.R+' s'):'no pre-infusion')+' · full '+mss(p.F);
  $('recbtn').disabled=sc.stand==='run';
  const wk=sc.stand==='run'?(wakeStatus==='aan'?'screen stays on':(wakeStatus?'screen may dim':'')):'';
  $('info').textContent=[wk,sc.speed>1?sc.speed+'× demo':''].filter(Boolean).join(' · ');
  renderTareRow();
}
function renderSheet(){
  const p=plan(),pre=R.pre,on=pre.on;
  const lijst=recipesFor(formMethod).filter(x=>recipeFam(x)==='espresso');
  let h='<h3>recipe</h3><div class="zacht">Pre-infusion and rest belong to the recipe: set them once and every '+
    esc(R.naam)+' shot starts this way. The puck-prep row "pre-infusion" is ticked and filled from it.</div>';
  h+='<div class="sc-chips">'+lijst.map(x=>'<button type="button" class="sc-chip'+(R.r&&x.id===R.r.id?' sel':'')+
    '" data-a="pick" data-id="'+esc(x.id)+'">'+esc(x.naam)+'</button>').join('')+'</div>';
  h+='<div class="sc-row"><div class="sc-rl">pre-infusion<small>'+(on?'on in this recipe':'off in this recipe')+
    '</small></div><button type="button" class="sc-tog" aria-label="pre-infusion" aria-pressed="'+on+'" data-a="preon"><span class="knob"></span></button></div>';
  h+='<div class="sc-row'+(on?'':' uit')+'"><div class="sc-rl">pre-infusion<small>lever half up</small></div>'+
    '<button type="button" class="sc-step" aria-label="shorter pre-infusion" '+(on?'':'disabled')+' data-a="s-">'+MIN+'</button>'+
    '<span class="sc-val" id="sc-v-s">'+mss(pre.s)+'</span>'+
    '<button type="button" class="sc-step" aria-label="longer pre-infusion" '+(on?'':'disabled')+' data-a="s+">'+PLUS+'</button></div>';
  h+='<div class="sc-row'+(on?'':' uit')+'"><div class="sc-rl">rest<small>lever to the middle, no pump</small></div>'+
    '<button type="button" class="sc-step" aria-label="shorter rest" '+(on?'':'disabled')+' data-a="r-">'+MIN+'</button>'+
    '<span class="sc-val" id="sc-v-r">'+mss(pre.rust)+'</span>'+
    '<button type="button" class="sc-step" aria-label="longer rest" '+(on?'':'disabled')+' data-a="r+">'+PLUS+'</button></div>';
  h+='<div class="sc-op">target: <b>'+mss(p.F)+'</b> of full pressure, good '+mss(p.lo)+'–'+mss(p.hi)+
    (p.on?' · pre-infusion and rest come on top, total about '+mss(p.Tc):'')+'</div>';
  h+='<button type="button" class="sc-btn pri" data-a="sheet-dicht">done</button>';
  $('sheet').innerHTML=h;
}
function scSheet(open){
  if(open&&sc.stand==='run')return;
  if(open&&sc.tareOpen)scTare(false);
  sc.sheet=open;
  if(open)renderSheet();
  $('sheet').classList.toggle('open',open);$('scrim').classList.toggle('open',open||sc.gear);
  $('sheet').setAttribute('aria-hidden',String(!open));
}
function scPick(id){
  const r=recipeById(id);if(!r||recipeFam(r)!=='espresso')return;
  if(!state.lastRecipe)state.lastRecipe={};
  state.lastRecipe[formMethod]=id;
  const oud=pendingTarget||{};
  pendingTarget={dose:String(r.dose),yield:String(Math.round(r.dose*r.ratio)),time:r.tijd||'',grind:r.stand||oud.grind||''};
  setVal('di-dose',pendingTarget.dose);setVal('di-yield',pendingTarget.yield);
  save();
  sc.yOut=null;sc.dose=null;
  R=receptInfo();scVulPrep(true);
  try{renderDiGoal();renderPrep();renderDiClock();diAdvice();}catch(e){}
  afterSettings();
}
function scPreOn(){const p=Object.assign({},R.pre);p.on=!p.on;if(p.on&&p.s<1)p.s=5;bewaarPre(p);}
function scSet(k,d){
  const p=Object.assign({},R.pre);if(!p.on)return;
  if(k==='s')p.s=Math.max(1,Math.min(15,p.s+d));
  else p.rust=Math.max(0,Math.min(10,p.rust+d));
  bewaarPre(p);
}
function bewaarPre(p){
  scPreZet(R.r,p);R=receptInfo();scVulPrep(true);
  try{renderPrep();renderDiClock();}catch(e){}
  afterSettings();
}
function afterSettings(){if(sc.stand==='done')scAgain();else renderAll();renderSheet();}

/* ---------- de klok ---------- */
function setClock(t){
  $('time').textContent=mss(t);
  $('dec').textContent='.'+Math.floor((t*10+1e-6)%10);
}
function zoem(){try{if(navigator.vibrate)navigator.vibrate(60);}catch(e){}}
function tick(now){
  if(!sc.run||!sc.open){sc.raf=0;return;}
  const dt=Math.min(0.25,Math.max(0,(now-sc.last)/1000));sc.last=now;
  sc.t+=dt*sc.speed;
  if(sc.t>=VEILIG){scStop(true);return;}
  frame(plan());
  sc.raf=requestAnimationFrame(tick);
}
function frame(p){
  const t=sc.t,running=sc.stand==='run';
  if(running){
    const i=phaseAt(t,p),id=p.ph[i].id;
    if(id!==sc.phase){
      if(sc.phase)zoem();
      sc.phase=id;
      setLever(id==='pre'?LEVER.pre:id==='rest'?LEVER.rest:LEVER.full);
    }
    $('read').classList.toggle('wacht',id==='rest');
  }
  const tt=sc.stand==='done'?sc.stopT:t;
  const vol=sc.stand!=='ready'&&tt>=p.fs&&!(sc.stand==='done'&&sc.stopT<=p.fs);
  setClock(vol?tt-p.fs:tt);
  if(vol)$('tlbl').textContent=p.on?'full pressure · total '+mss(tt):'full pressure · from the lever';
  else if(running&&sc.phase==='rest')$('tlbl').textContent='waiting · from the lever';
  else $('tlbl').textContent='from the lever';
  const w=paintArt(t,p,running);
  if(sc.stand==='done'){
    $('w').textContent=(sc.yOut==null?p.Y:sc.yOut)+' g';
    $('wlbl').textContent=sc.yOut==null?'on your scale? set below':'on your scale';
  }else{
    $('w').textContent=sc.stand==='ready'?'0 g':'≈ '+Math.round(w)+' g';
    $('wlbl').textContent='of '+p.Y+' g · estimate';
  }
  const inFull=sc.stand==='done'?sc.stopT>p.fs+1:tt>=p.fs;
  paintBand(fullS(tt,p),p,sc.stand!=='ready',inFull);
  renderStrip(t,p);
  renderBtns();
}
function renderAll(){renderHead();renderBand();frame(plan());}

function scStart(){
  if(sc.stand!=='ready')return;
  scSheet(false);scTare(false);
  sc.stand='run';sc.t=0;sc.phase=null;sc.drop=null;sc.yOut=null;sc.stopT=null;
  sc.last=performance.now();sc.run=true;
  wakeAan();
  renderHead();frame(plan());
  if(!sc.raf)sc.raf=requestAnimationFrame(tick);
}
function scStop(vanzelf){
  if(sc.stand!=='run')return;
  sc.run=false;if(sc.raf){cancelAnimationFrame(sc.raf);sc.raf=0;}
  sc.stopT=sc.t;sc.stand='done';sc.phase=null;
  wakeUit();
  setLever(LEVER.down);
  const svg=$('svg');
  svg.classList.remove('flow','water','slow','thin');
  if(!RMQ.matches){
    svg.classList.add('drip');                                // nog een paar laatste druppels
    setTimeout(()=>{if(sc.stand==='done')svg.classList.remove('drip');},1800);
  }else svg.classList.remove('drip');
  $('read').classList.remove('wacht');
  renderHead();frame(plan());
  if(vanzelf===true)meld('stopped by itself after a minute — you stop the shot at your weight');
}
function scAgain(){
  sc.run=false;if(sc.raf){cancelAnimationFrame(sc.raf);sc.raf=0;}
  sc.stand='ready';sc.t=0;sc.stopT=null;sc.drop=null;sc.yOut=null;sc.phase=null;
  sc.dose=null;sc.check='';const ci=$('chkin');if(ci)ci.value='';   // nieuwe shot: opnieuw afwegen
  wakeUit();
  setLever(LEVER.down);
  $('svg').classList.remove('flow','water','slow','thin','drip');
  $('read').classList.remove('wacht');
  btnKey='';renderAll();
}
function scDrop(){if(sc.stand==='run'&&sc.drop==null){sc.drop=sc.t;renderBtns();}}
function scWeight(d){
  if(sc.stand!=='done')return;
  const p=plan();
  sc.yOut=Math.max(1,Math.min(99,(sc.yOut==null?p.Y:sc.yOut)+d));
  frame(p);
}
/* De shot naar het dial-in-scherm: de tijd die telt (volle druk), het
   gewicht als je het instelde, de dosis uit het tarra-vak, en de pre-infusie
   in de puck-prep. Alles blijft daar met de hand aan te passen.            */
function scUse(){
  if(sc.stand!=='done')return;
  const p=plan(), tijd=shotTime(p);
  const inp=document.getElementById('di-time');
  if(inp){inp.value=mss(Math.round(tijd));normalizeTime(inp);}
  if(sc.yOut!=null)setVal('di-yield',sc.yOut);
  if(sc.dose!=null)setVal('di-dose',sc.dose.toFixed(1));
  if((state.prepItems||[]).some(x=>x.id==='preinf'))
    formPrep.preinf=p.on?{on:true,val:String(p.P)}:{on:false,val:''};
  diShot={pre:p.on?p.P:0,rest:p.on?p.R:0,
    full:sc.stopT>p.fs?Math.round((sc.stopT-p.fs)*10)/10:0,
    total:Math.round(sc.stopT*10)/10,
    drop:sc.drop!=null?Math.round(sc.drop*10)/10:null,
    yieldEstimated:sc.yOut==null};
  try{renderPrep();diAdvice();}catch(e){}
  const tekst=mss(Math.round(tijd))+(p.on&&sc.stopT>p.fs?' full pressure (total '+mss(sc.stopT)+')':'')+
    (sc.yOut!=null?' and '+sc.yOut+' g':'')+' filled in — still editable';
  sluit();
  toast(tekst);
}
let meldT=null;
function meld(s){
  const el=$('toast');el.textContent=s;el.classList.add('show');
  clearTimeout(meldT);meldT=setTimeout(()=>el.classList.remove('show'),2600);
}

/* ---------- tarra ---------- */
function deelAan(id){return !!((state.tareOn||{})[id])&&scTareG(id)!=null;}
function partsSum(){return scG10(SC_DELEN.filter(x=>deelAan(x.id)).reduce((a,x)=>a+scTareG(x.id),0));}
function partsName(){const l=SC_DELEN.filter(x=>deelAan(x.id)).map(x=>x.kort);return l.length?l.join(' + '):'nothing';}
function heeftGewichten(){return SC_DELEN.some(x=>scTareG(x.id)!=null);}
function aimG(){return scG10(partsSum()+plan().dose);}
function realDose(){const v=scParseG(sc.check);return v==null?null:scG10(v-partsSum());}
function signed(d){return (d>0?'+':d<0?'−':'±')+Math.abs(d).toFixed(1)+' g';}
function renderTareRow(){
  $('tsum').textContent=!heeftGewichten()?'set the weight of your parts in my gear':
    partsName()+': '+partsSum().toFixed(1)+' g · '+(sc.dose!=null?'dose '+sc.dose.toFixed(1)+' g':'aim '+aimG().toFixed(1)+' g');
  $('tarerow').disabled=sc.stand==='run';
}
function renderTare(){
  $('parts').innerHTML=SC_DELEN.map(x=>{
    const g=scTareG(x.id);
    return '<button type="button" class="sc-part" aria-pressed="'+deelAan(x.id)+'" data-a="part" data-id="'+x.id+'">'+
      '<span class="pn">'+x.n+'</span><span class="pg'+(g==null?' leeg':'')+'">'+(g!=null?g.toFixed(1)+' g':'not set')+'</span></button>';
  }).join('');
  const dose=plan().dose;
  $('aiml').innerHTML='at '+dose.toFixed(1)+' g dose the scale should read<br>'+partsSum().toFixed(1)+' g parts + '+dose.toFixed(1)+' g coffee';
  $('aim').textContent=aimG().toFixed(1)+' g';
  const d=realDose();let h,ok=false;
  if(String(sc.check).trim()==='')h='type what the scale shows: the parts come off and you see your real dose.';
  else if(d==null||d<=0||d>40)h='that doesn\'t add up — check what is on the scale.';
  else{
    const diff=scG10(d-dose);ok=true;
    const w=Math.abs(diff)<0.05?'spot on':diff>0?Math.abs(diff).toFixed(1)+' g too much':Math.abs(diff).toFixed(1)+' g short';
    h='real dose <b id="sc-real">'+d.toFixed(1)+' g</b> · <b id="sc-diff">'+signed(diff)+'</b> — '+w;
  }
  $('res').innerHTML=h;
  $('usedose').disabled=!ok;
  renderTareRow();
}
function scTare(open){
  if(open===undefined)open=!sc.tareOpen;
  if(open&&sc.stand==='run')return;
  if(open)scCloseSheets();
  sc.tareOpen=open;
  const row=$('tarerow');
  if(open){
    const top=row.offsetTop+row.offsetHeight+6;
    $('tp').style.top=top+'px';
    $('tp').style.maxHeight=Math.max(200,document.getElementById('shotclock').clientHeight-top-12)+'px';
  }
  $('tp').classList.toggle('open',open);
  row.setAttribute('aria-expanded',String(open));
  if(open)renderTare();
}
function scPart(id){
  const x=SC_DELEN.find(g=>g.id===id);if(!x)return;
  if(scTareG(id)==null){scGear(true,id);return;}            // nog geen gewicht: eerst invullen
  if(!state.tareOn||typeof state.tareOn!=='object')state.tareOn={};
  const aan=!state.tareOn[id];
  if(aan&&x.pf)SC_DELEN.filter(g=>g.pf).forEach(g=>{state.tareOn[g.id]=false;});   // één portafilter tegelijk
  state.tareOn[id]=aan;save();renderTare();
}
function scUseDose(){
  const d=realDose();if(d==null||d<=0||d>40)return;
  sc.dose=d;scTare(false);renderHead();
  meld('dose '+d.toFixed(1)+' g for this shot — target stays '+plan().Y+' g out');
}
/* my gear in de coach: dezelfde gewichten als onder profile -> my gear */
function renderGear(){
  let h='<div class="sc-crumb">also under profile → my gear</div><h3>my gear · weights</h3>'+
    '<div class="zacht">Weigh each part once on an empty, zeroed scale. One decimal is enough.</div>';
  h+=SC_DELEN.map(x=>{const g=scTareG(x.id);return '<div class="sc-grow"><label for="sc-g-'+x.id+'">'+x.lang+'</label>'+
    '<input class="sc-num klein" id="sc-g-'+x.id+'" type="text" inputmode="decimal" autocomplete="off" placeholder="—" data-in="gear" data-id="'+x.id+'" value="'+
    (g!=null?g.toFixed(1):'')+'"><span class="u">g</span></div>';}).join('');
  h+='<button type="button" class="sc-btn pri" data-a="gear-dicht">done</button>';
  $('gear').innerHTML=h;
}
function scGear(open,focus){
  sc.gear=open;
  if(open){renderGear();$('scrim').classList.add('hoog');}
  $('gear').classList.toggle('open',open);
  $('gear').setAttribute('aria-hidden',String(!open));
  $('scrim').classList.toggle('open',open||sc.sheet);
  if(open&&focus){const i=$('g-'+focus);if(i)setTimeout(()=>{try{i.focus();}catch(e){}},320);}
  if(!open){
    $('scrim').classList.remove('hoog');
    save();renderTareGear();
    if(sc.tareOpen)renderTare();else renderTareRow();
  }
}
function scCloseSheets(){if(sc.gear)scGear(false);if(sc.sheet)scSheet(false);}

/* ---- scherm aan houden tijdens de shot ---- */
let wake=null, wakeStatus='';
function wakeAan(){
  if(!('wakeLock' in navigator)){wakeStatus='nee';return;}
  try{
    navigator.wakeLock.request('screen').then(w=>{
      if(sc.stand!=='run'||!sc.open){try{w.release();}catch(e){}return;}
      wake=w; wakeStatus='aan';
      w.addEventListener('release',()=>{wake=null;if(sc.stand==='run')wakeStatus='los';});
    }).catch(()=>{wakeStatus='nee';});
  }catch(e){wakeStatus='nee';}
}
function wakeUit(){try{if(wake)wake.release();}catch(e){}wake=null;wakeStatus='';}
document.addEventListener('visibilitychange',()=>{
  if(sc.open&&document.visibilityState==='visible'&&sc.stand==='run'&&!wake)wakeAan();
});

/* ---- de hendel aantikken: klaar = overhalen, loopt = omlaag en stop ---- */
function leverTap(){if(sc.sheet||sc.gear||sc.tareOpen)return;if(sc.stand==='ready')scStart();else if(sc.stand==='run')scStop();}

/* ---- openen en sluiten ---- */
function maak(){
  if(document.getElementById('shotclock'))return;
  const e=document.createElement('div');
  e.id='shotclock'; e.hidden=true;
  e.setAttribute('role','dialog'); e.setAttribute('aria-modal','true'); e.setAttribute('aria-label','shot clock');
  e.innerHTML=
    '<div class="sc-head">'+
      '<button type="button" class="sc-recbtn sc-dicht" id="sc-dicht" aria-label="close" data-a="dicht">'+KRUIS+'</button>'+
      '<div class="sc-headtxt"><div class="sc-rn hand" id="sc-rn"></div><div class="sc-rd" id="sc-rd"></div></div>'+
      '<button type="button" class="sc-recbtn" id="sc-recbtn" aria-label="recipe settings" data-a="sheet">'+SCHUIF+'</button></div>'+
    '<div class="sc-info" id="sc-info"></div>'+
    '<button type="button" class="sc-tarerow" id="sc-tarerow" aria-expanded="false" aria-controls="sc-tp" data-a="tare">'+
      '<span class="tk">tare</span><span class="ts" id="sc-tsum"></span><span class="ta">&rsaquo;</span></button>'+
    '<div class="sc-art" id="sc-art" role="button" tabindex="0" aria-label="the lever: tap to start or stop the shot">'+SC_TEKENING+'</div>'+
    '<div class="sc-read" id="sc-read">'+
      '<div class="sc-clock"><span class="sc-big hand" id="sc-time">0:00</span><span class="sc-dec hand" id="sc-dec">.0</span>'+
        '<div class="sc-lbl" id="sc-tlbl">from the lever</div></div>'+
      '<div class="sc-wt"><div class="sc-wv hand" id="sc-w">0 g</div><div class="sc-lbl" id="sc-wlbl">in the cup · estimate</div></div></div>'+
    '<div class="sc-band" id="sc-band"></div>'+
    '<div class="sc-strip" id="sc-strip"></div>'+
    '<div class="sc-btns" id="sc-btns"></div>'+
    '<div class="sc-tp" id="sc-tp" role="region" aria-label="tare">'+
      '<div class="sc-tl"><span>on the scale — tap what\'s on it</span></div>'+
      '<div class="sc-parts" id="sc-parts"></div>'+
      '<div class="sc-aim"><div class="al" id="sc-aiml"></div><div class="av" id="sc-aim"></div></div>'+
      '<div class="sc-chk"><label for="sc-chkin">the scale reads<br><span class="zacht">type it, in g</span></label>'+
        '<input class="sc-num" id="sc-chkin" type="text" inputmode="decimal" autocomplete="off" placeholder="0.0" data-in="check"></div>'+
      '<div class="sc-res" id="sc-res"></div>'+
      '<div class="sc-tbtns">'+
        '<button type="button" class="sc-btn" data-a="gear">my gear</button>'+
        '<button type="button" class="sc-btn pri" id="sc-usedose" data-a="usedose">use as dose</button></div></div>'+
    '<div class="sc-scrim" id="sc-scrim" data-a="scrim"></div>'+
    '<div class="sc-sheet" id="sc-sheet" aria-hidden="true"></div>'+
    '<div class="sc-sheet" id="sc-gear" aria-hidden="true"></div>'+
    '<div class="sc-toast" id="sc-toast" role="status"></div>';
  document.body.appendChild(e);
  e.addEventListener('click',ev=>{
    const b=ev.target.closest('[data-a]');
    if(!b){if(ev.target.closest('#sc-art'))leverTap();return;}
    if(b.disabled)return;
    const a=b.dataset.a;
    ({dicht:dichtKnop,sheet:()=>scSheet(true),'sheet-dicht':()=>scSheet(false),tare:()=>scTare(),
      start:scStart,stop:()=>scStop(),drop:scDrop,again:scAgain,use:scUse,
      'w-':()=>scWeight(-1),'w+':()=>scWeight(1),pick:()=>scPick(b.dataset.id),preon:scPreOn,
      's-':()=>scSet('s',-1),'s+':()=>scSet('s',1),'r-':()=>scSet('rust',-1),'r+':()=>scSet('rust',1),
      part:()=>scPart(b.dataset.id),gear:()=>scGear(true),'gear-dicht':()=>scGear(false),
      usedose:scUseDose,scrim:scCloseSheets}[a]||(()=>{}))();
  });
  e.addEventListener('input',ev=>{
    const i=ev.target;if(!i.dataset)return;
    if(i.dataset.in==='check'){sc.check=i.value;renderTare();}
    else if(i.dataset.in==='gear'){if(scZetTare(i.dataset.id,i.value)){if(sc.tareOpen)renderTare();else renderTareRow();}}
  });
  e.addEventListener('focusout',ev=>{
    const i=ev.target;
    if(i.dataset&&i.dataset.in==='gear'){const g=scTareG(i.dataset.id);i.value=g!=null?g.toFixed(1):'';save();}
  });
  $('art').addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();leverTap();}});
  window.addEventListener('resize',()=>{if(sc.open){renderBand();frame(plan());}});
}
function openen(){
  if(!featOn('shotclock'))return;
  maak();
  R=receptInfo();
  sc.open=true;
  const e=document.getElementById('shotclock');
  e.hidden=false; document.body.classList.add('gc-open');
  scAgain();
}
function dichtKnop(){
  if(sc.stand==='run'){
    if(!confirm('stop this shot? the time so far is not filled in'))return;
  }
  sluit();
}
function sluit(){
  sc.open=false;sc.run=false;if(sc.raf){cancelAnimationFrame(sc.raf);sc.raf=0;}
  if(sc.stand==='run'){sc.stand='ready';}
  wakeUit();scCloseSheets();if(sc.tareOpen)scTare(false);
  const e=document.getElementById('shotclock'); if(e)e.hidden=true;
  document.body.classList.remove('gc-open');
}
return {openen,sluit,isOpen:()=>sc.open,loopt:()=>sc.open&&sc.stand==='run',snelheid:n=>{sc.speed=n>1?n:1;},
  stand:()=>{const p=plan();return {stand:sc.stand,t:sc.t,stopT:sc.stopT,drop:sc.drop,yOut:sc.yOut,dose:sc.dose,
    fase:sc.stand==='run'?p.ph[phaseAt(sc.t,p)].id:null,plan:{on:p.on,P:p.P,R:p.R,fs:p.fs,Y:p.Y,F:p.F,Tc:p.Tc,lo:p.lo,hi:p.hi,dose:p.dose},
    tare:{som:partsSum(),aim:aimG(),echt:realDose()}};},
  gewicht:(tt)=>weight(tt,plan())};
})();
function scOpen(){shot.openen();}
