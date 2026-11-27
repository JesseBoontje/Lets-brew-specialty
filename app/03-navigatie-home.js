/* ---------------- navigatie ---------------- */
const pages=['welcome','home','choosebean','form','dialin','recipe','detail','brews','methods','beans','beanform','learn','learn-barista','learn-filter','learn-academy','learn-latte','profile','cupping','gallery','beanpick','finder','feed','person'];
const navMap={home:'home',choosebean:'brews',form:'home',dialin:'home',recipe:'brews',detail:'home',
  cupping:'beans',gallery:'learn',brews:'brews',methods:'home',beans:'beans',beanform:'beans',learn:'learn','learn-barista':'learn','learn-filter':'learn','learn-academy':'learn','learn-latte':'learn',beanpick:'beans',finder:'beans',profile:'profile',feed:'feed',person:'profile'};
let navHistory=[];
let currentPage='welcome';
function go(p,isBack){
  // de getekende boon hoort bij de app, niet bij het beginscherm
  const bgb=document.getElementById('bg-bean');
  if(bgb)bgb.classList.toggle('on',p!=='welcome');
  // geschiedenis bijhouden (niet voor splash/naam, en niet bij terug-navigatie)
  if(!isBack && currentPage && currentPage!==p && currentPage!=='welcome'){
    navHistory.push(currentPage);
    if(navHistory.length>30)navHistory.shift();
  }
  currentPage=p;
  // detail hoort bij de lijst waar je vandaan kwam, niet altijd bij home
  if(p==='detail'&&navHistory.length)navMap.detail=(navHistory[navHistory.length-1]==='brews')?'brews':'home';
  pages.forEach(x=>document.getElementById('page-'+x).classList.add('hidden'));
  document.getElementById('page-'+p).classList.remove('hidden');
  const nav=document.getElementById('nav');
  if(p==='welcome'){nav.classList.add('hidden');}
  else{nav.classList.remove('hidden');
    document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.p===navMap[p]));}
  if(p==='home')renderHome();
  if(p==='brews')renderAll();
  if(p==='methods')renderMethods();
  if(p==='beans')renderBeans();
  if(p==='choosebean')renderChooseBean();
  if(p==='cupping')renderCupping();
  if(p==='gallery'){renderGaHelp();renderGaShapePick();renderGallery();}
  if(p==='learn'){
    const w=document.getElementById('water-card');if(w)w.style.display=featOn('water')?'flex':'none';
    if(featOn('water')){waterPresets();waterCalc();}
    const wb=document.getElementById('water-body');if(wb&&!featOn('water'))wb.classList.add('hidden');
    const bpc=document.getElementById('beanpick-card');
    if(bpc){bpc.style.display=featOn('beanpick')?'flex':'none';if(featOn('beanpick'))bpPaspoortRegel();}
    const cc=document.getElementById('cupping-card');if(cc)cc.style.display=featOn('cupping')?'flex':'none';
    const gc=document.getElementById('gallery-card');if(gc)gc.style.display=featOn('latteart')?'flex':'none';
    const ds=document.getElementById('learn-do-sect');
    if(ds)ds.style.display=(featOn('cupping')||featOn('latteart'))?'flex':'none';
  }
  if(p==='learn-barista')renderLesson('barista-content',LESSONS.barista);
  if(p==='learn-filter')renderLesson('filter-content',LESSONS.filter);
  if(p==='learn-academy')renderLesson('academy-content',LESSONS.academy);
  if(p==='learn-latte')renderLatte();
  if(p==='beanpick')bpTeken();
  if(p==='finder')fdTeken();
  if(p==='profile')renderProfile();
  if(p==='feed'&&typeof renderFeed==='function')renderFeed();
  if(p==='person'&&typeof renderPerson==='function')renderPerson();
  if(typeof volgNav==='function')volgNav();
  applyAIVisibility();
  try{fdPil();}catch(e){}
  document.querySelector('.phone').scrollTop=0;
}
function goBack(){
  if(navHistory.length){
    const prev=navHistory.pop();
    go(prev,true);
  }
}

/* ---------------- home ---------------- */
function timeAgo(ts){ts=+ts;if(!Number.isFinite(ts)||ts<=0)return'';const d=(Date.now()-ts)/86400e3;
  if(d<1)return'today';if(d<2)return'yesterday';return Math.floor(d)+' days ago';}
/* Is dit echt een brew? Elke brew uit de app heeft een methode. Een record zonder
   methode (bijv. een half record dat via sync of een oud bestand binnenkwam) gaf op
   Home "undefined, 18 g to 20 g · NaN days ago": zulke records tonen we niet als brew. */
function isBrew(b){return !!(b&&typeof b==='object'&&typeof b.method==='string'&&b.method.trim());}
function zichtbareBrews(){return (Array.isArray(state.brews)?state.brews:[]).filter(isBrew);}
// de naam van de boon: wat er bij de brew staat, anders de gekoppelde boon
function brewBoonNaam(b){const n=String(b.beans||'').trim();if(n)return n;const bean=b.beanId&&typeof beanById==='function'?beanById(b.beanId):null;return (bean&&bean.name)||'';}
// een brew als gewone zin: "V60 with Kenya, 15 g to 250 g, 2:45"
function brewZin(b,m){
  const naam=(m&&m.name)||'brew',boon=brewBoonNaam(b);
  const delen=[(b.title&&b.title.trim()?naam+' with ':'')+(boon||naam)];
  if(b.dose)delen.push(b.dose+' g'+(b.yield?' to '+b.yield+' g':''));
  if(b.time)delen.push(b.time);
  if(b.temp)delen.push(b.temp+' °C');
  return delen.join(', ');
}
function brewCard(b){
  const m=methodById(b.method);
  const heading=(b.title&&b.title.trim())?b.title:(m.name||'brew');
  return `<div class="card sketch row" style="background:var(${m.tint});cursor:pointer" onclick="openDetail('${b.id}')">
    <div class="brew-thumb">${iconHTML(m,44)}</div>
    <div class="brew-main"><div class="name hand">${esc(heading)}</div>
      <div class="meta">${esc(brewZin(b,m))}</div></div>
    <div class="brew-side"><div class="when">${timeAgo(b.ts)}</div>
      <div class="score hand">${(+b.score||0).toFixed(1)}<span>/10</span></div></div></div>`;
}
function renderHome(){
  const g=document.getElementById('home-greeting');
  if(g)g.textContent=state.userName?('hi '+state.userName):'hi there';
  // recente brews: bonen-die-op-zijn niet prominent tonen (tenzij er niets anders is)
  const alle=zichtbareBrews(),pool=alle.filter(b=>!brewBeanGone(b));
  const recent=[...(pool.length?pool:alle)].sort((a,b)=>(+b.ts||0)-(+a.ts||0)).slice(0,3);
  document.getElementById('recent-list').innerHTML =
    recent.length?recent.map(brewCard).join(''):'<div class="empty-note">no brews yet.<br>tap ＋ new brew to get started.</div>';
  try{refreshWeather();}catch(e){}
  renderPeakLine();
  // volgen aan: een rustige regel bij een volgverzoek (profiel laden als dat nog niet gebeurd is)
  try{volgNav();volgHomeRegel();if(volgAan()&&!volg.me&&!volg.meLaden&&!volg.fout)volgLaadMij();}catch(e){}
  const sb=document.getElementById('surprise-btn');if(sb)sb.style.display=featOn('surprise')?'':'none';
  const ms=document.getElementById('methods-scroll');
  ms.innerHTML=state.methods.filter(m=>m.on).map(m=>
    `<button class="method" onclick="showMethodBrews('${m.id}')"><div class="ic">${iconHTML(m,46)}</div><div class="nm">${esc(m.name)}</div></button>`
  ).join('');
}
// rustige regel: welke boon in huis is net op z'n best (of bijna voorbij)
function renderPeakLine(){
  const el=document.getElementById('peak-line');if(!el)return;
  const k=featOn('peakalert')?peakLineFor(state.beans):null;
  if(!k){el.style.display='none';el.innerHTML='';el.onclick=null;return;}
  el.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 17.5 Q8 6.5 12 6.8 Q16 6.6 20.5 17.3"/><path d="M12 6.8 L12.2 3.2"/><path d="M8.6 20.6 Q12 19.9 15.4 20.5"/></svg><span>'+esc(k.t)+'</span>';
  el.onclick=()=>{expandedBeans.add(k.id);go('beans');};
  el.style.display='flex';
}
// beveel een zetmethode (die aanstaat) + boon uit voorraad aan, op basis van
// je eigen brews: de methode met het hoogste gemiddelde cijfer wint
function recommendBrew(){
  const onMethods=state.methods.filter(m=>m.on);
  if(!onMethods.length)return null;
  const stats={};
  state.brews.forEach(b=>{
    if(!b.method||b.score==null)return;
    const s=stats[b.method]||(stats[b.method]={sum:0,n:0});
    s.sum+=(+b.score||0);s.n++;
  });
  let method=onMethods[0],best=-1;
  onMethods.forEach(m=>{
    const s=stats[m.id];
    const avg=s&&s.n?s.sum/s.n:-1;   // methodes zonder brews belanden achteraan
    if(avg>best){best=avg;method=m;}
  });
  const inStock=state.beans.filter(b=>b.inStock);
  const bean=inStock.find(b=>Array.isArray(b.methods)&&b.methods.includes(method.id))
          || inStock.find(b=>b.method===method.id)
          || inStock[0] || null;
  return {method,bean};
}
// surprise me: een nieuw recept voor een boon uit je kast (app/04-surprise.js)
function quickBrew(){surpriseOpen();}
let brewSort='date', filterMethod='all';
/* Sorteren van je brews. De volgorde waarin je ze zette is de standaard; op
   methode groepeert per zetter, op score zet je beste bovenaan.            */
const BREW_SORTS=[['date','brew order'],['method','method'],['score','score']];
function setSort(s){brewSort=s;renderAll();}
function renderSortChips(){
  const el=document.getElementById('sort-chips');if(!el)return;
  el.innerHTML=BREW_SORTS.map(([v,label])=>
    '<button class="sortc '+(brewSort===v?'on':'')+'" onclick="setSort(\''+v+'\')">'+esc(label)+'</button>').join('');
}
// de vergelijker die bij de gekozen volgorde hoort
function brewSorter(){
  const t=(a,b)=>(+b.ts||0)-(+a.ts||0);
  if(brewSort==='score')return (a,b)=>(b.score||0)-(a.score||0)||t(a,b);
  if(brewSort==='method')return (a,b)=>{
    const na=(methodById(a.method)||{}).name||'', nb=(methodById(b.method)||{}).name||'';
    return na.localeCompare(nb)||t(a,b);
  };
  return t;
}
function setFilter(m){filterMethod=m;renderAll();}
function renderFilterChips(){
  // alleen de zetters waarmee je echt gezet hebt; anders staat de balk vol met
  // knoppen die niets filteren
  const used=[...new Set(zichtbareBrews().map(b=>b.method))];
  const methodChips=state.methods.filter(m=>used.includes(m.id));
  let html=`<button class="fc ${filterMethod==='all'?'sel':''}" onclick="setFilter('all')">all</button>`;
  html+=methodChips.map(m=>
    `<button class="fc ${m.id===filterMethod?'sel':''}" onclick="setFilter('${m.id}')"><span class="fc-ic">${iconHTML(m,22)}</span>${esc(m.name)}</button>`).join('');
  document.getElementById('filter-methods').innerHTML=html;
  // een balk met alleen "all" erin valt niets te kiezen; die laten we weg
  const fb=document.querySelector('#page-brews .filter-bar');
  if(fb)fb.style.display=methodChips.length?'':'none';
}
// een brew hoort in de "reservekast" als zijn boon niet meer in de kast staat
function brewBeanGone(b){
  if(!b.beanId)return false;
  const bean=beanById(b.beanId);
  if(!bean)return true;              // boon is verwijderd
  return bean.inStock===false;       // boon is op
}
let reserveOpen=false;
function toggleReserve(){reserveOpen=!reserveOpen;renderAll();}
/* ---------------- je brews, in dezelfde kaartstijl ----------------
   Zelfde jasje als de receptkaarten: tekening, titel, inklapbaar, prullenbakje
   rechtsboven. Open zie je de cijfers van die kop en kun je door naar het
   volledige detail.                                                        */
let brewOpen={};
function brewToggle(id){brewOpen[id]=!brewOpen[id];renderAll();}
function brewDelete(id){
  const b=state.brews.find(x=>x.id===id);if(!b)return;
  if(!confirm('delete this brew?'))return;
  state.brews=state.brews.filter(x=>x.id!==id);save();toast('\ud83d\uddd1 brew deleted');renderAll();
}
function brewCardNew(b){
  const m=methodById(b.method);
  const fam=methodFamily(b.method);
  const titel=(b.title&&b.title.trim())?b.title:m.name;
  const open=!!brewOpen[b.id];
  const meta=[(b.title&&b.title.trim())?m.name:'',brewBoonNaam(b)||'\u2014',
    b.dose?b.dose+' g':'',b.time||''].filter(Boolean).join(' \u00b7 ');
  const cel=(k,v)=>v?('<div class="bc-cel"><div class="k">'+esc(k)+'</div><div class="v hand">'+esc(v)+'</div></div>'):'';
  const cijfers=cel('dose',b.dose?b.dose+' g':'')+
    cel(fam==='filter'?'water':'yield',b.yield?b.yield+' g':'')+
    cel('ratio',b.ratio?('1:'+(+b.ratio).toFixed(1)):'')+
    cel(fam==='filter'?'time':'shot time',b.time)+
    cel('drawdown',b.draw)+cel('grind',b.grind)+
    cel('temp',b.temp?b.temp+'\u00b0C':'')+cel('bed',b.bed?bedName(b.bed):'')+
    cel('tasted',b.cup?(cupById(b.cup)||{}).n:'');
  return `<div class="card sketch rcard bcard ${open?'op':''}" style="background:var(${m.tint})">
    <button type="button" class="rc-del" title="delete" aria-label="delete brew"
      onclick="event.stopPropagation();brewDelete('${b.id}')">${ICO.del}</button>
    <div class="row rc-head" onclick="brewToggle('${b.id}')">
      <div class="brew-thumb">${iconHTML(m,44)}</div>
      <div class="brew-main">
        <div class="name hand">${esc(titel)}</div>
        <div class="meta">${esc(meta)}</div>
      </div>
      <div class="bc-side"><div class="when">${timeAgo(b.ts)}</div>
        <div class="sc hand">${(+b.score||0).toFixed(1)}<span>/10</span></div></div>
      <div class="rc-arr">${open?'\u25be':'\u25b8'}</div>
    </div>
    <div class="rc-body">
      <div class="bc-grid">${cijfers}</div>
      ${asArr(b.tags).length?'<div class="note-tags">'+asArr(b.tags).map(t=>'<span class="nt">'+esc(t)+'</span>').join('')+'</div>':''}
      ${b.notes?'<div class="rc-over" style="margin-top:8px">'+esc(b.notes)+'</div>':''}
      <button class="rb-go" onclick="openDetail('${b.id}')">open this brew \u2192</button>
      <button class="rb-edit" onclick="brewAgain('${b.id}')">brew it again</button>
    </div>
  </div>`;
}
function renderAll(){
  renderFilterChips();renderSortChips();
  const sb=document.getElementById('sort-bar');
  if(sb)sb.style.display=(state.brews.length>=2)?'flex':'none';
  const sw=document.getElementById('brew-search-wrap');
  const zoekbaar=state.brews.length>=6;
  if(sw)sw.style.display=zoekbaar?'flex':'none';
  const q=(zoekbaar?(document.getElementById('brew-search')?.value||''):'').toLowerCase().trim();
  let uit='';

  // --- je geschiedenis, met de zoekterm en de methodefilters erboven ---
  const brews=zichtbareBrews().filter(b=>{
    if(filterMethod!=='all'&&b.method!==filterMethod)return false;
    if(!q)return true;
    const m=methodById(b.method);
    return [m.name,b.beans,b.notes,b.title,asArr(b.tags).join(' ')].join(' ').toLowerCase().includes(q);
  });
  const sorter=brewSorter();
  const actief=brews.filter(b=>!brewBeanGone(b)).sort(sorter);
  const kast=brews.filter(brewBeanGone).sort(sorter);
  // de titel boven de pagina zegt al "brews", dus hier alleen een regel als je zoekt
  if(q)uit+='<div class="list-note">what matches "'+esc(q)+'"</div>';
  uit+=actief.length?actief.map(brewCardNew).join('')
      :(kast.length?''
        :(state.brews.length?'<div class="empty-note">no brews found.</div>'
          :'<div class="empty-note">no brews yet.<br>tap ＋ new brew to start.</div>'));
  if(kast.length){
    uit+='<button class="extra-kast" onclick="toggleReserve()"><svg viewBox="0 0 24 24" class="acic"><path d="M5.8 9.3 Q5.4 7.2 7.3 7 Q12 6.6 16.7 7 Q18.6 7.2 18.2 9.2 M18.1 8.7 Q18.4 13 18.1 17.1 Q18.3 18.8 16.4 19 Q12 19.4 7.4 19 Q5.5 18.8 5.9 17 Q5.4 12.9 6.1 8.5"/><path d="M9.4 7.1 Q9.2 5.3 9.5 3.8 Q12 3.5 14.5 3.9 Q14.8 5.5 14.6 7.2" opacity="0.6"/><path d="M8.8 12.4 Q12 12 15.3 12.6" opacity="0.5"/></svg> the vault \u00b7 '+
      kast.length+' brew'+(kast.length===1?'':'s')+' with a bean that\u2019s gone '+(reserveOpen?'\u25be':'\u25b8')+'</button>';
    if(reserveOpen){
      uit+='<div class="kast-head">the bean is no longer in stock \u2014 your recipe stays saved</div>';
      uit+=kast.map(brewCardNew).join('');
    }
  }
  document.getElementById('all-list').innerHTML=uit;
}
function renderStats_DISABLED(){
}



