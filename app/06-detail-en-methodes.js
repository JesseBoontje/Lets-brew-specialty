/* ---------------- detail ---------------- */
let currentDetail=null;
function prepSummaryHTML(b){
  if(!b.prep)return '';
  const items=(state.prepItems||[]);
  const rows=[];
  Object.keys(b.prep).forEach(k=>{
    const st=b.prep[k];if(!st||(!st.on&&!st.val))return;
    const it=items.find(x=>x.id===k);
    const name=it?it.name:k;
    const val=st.val?(' <span class="pd-val">'+esc(st.val)+(it&&it.unit?' '+esc(it.unit):'')+'</span>'):'';
    rows.push('<div class="prep-done">'+esc(name)+val+'</div>');
  });
  return rows.join('');
}
function openDetail(id){
  const b=state.brews.find(x=>x.id===id);if(!b)return;currentDetail=id;
  const m=methodById(b.method);
  const fam=methodFamily(b.method);
  const ratioTxt=b.ratio?('1:'+(+b.ratio).toFixed(1)):'—';
  const bean=b.beanId?beanById(b.beanId):null;
  const advice=(bean&&bean.dialIn&&bean.dialIn.method===b.method&&bean.dialIn.grind)?bean.dialIn:null;
  const prepHtml=prepSummaryHTML(b);
  // maling: eigen invoer, anders (bij filter) de door AI+gear berekende maalstand
  const malingVal=b.grind?esc(b.grind):(advice?esc(advice.grind)+' <small style="color:var(--ink-soft);font-size:15px">✦</small>':'—');
  const beanName=(b.beans&&b.beans.trim())?b.beans.trim():(bean?bean.name:'');
  const scoreTxt=(+b.score).toFixed(1);
  // ondertitel: bij eigen titel de methode + boon, anders (methode staat al als titel) alleen de boon
  const subParts=[];if(b.title&&b.title.trim())subParts.push(esc(m.name));if(beanName)subParts.push(esc(beanName));
  const bloomTxt=b.bloom?[b.bloom.g?b.bloom.g+' g':'',b.bloom.s?b.bloom.s+' s':''].filter(Boolean).join(' · '):'';
  // filter-raster bevat bloom en zet score+ratio klein bovenaan; espresso houdt score in het raster
  const grid = fam==='filter' ? `
      <div class="stat-ratio">ratio ${ratioTxt} · score ${scoreTxt}/10</div>
      <div class="stat-grid">
        <div class="stat"><div class="k">dose in</div><div class="v hand">${b.dose?esc(b.dose)+' g':'—'}</div></div>
        <div class="stat"><div class="k">yield out</div><div class="v hand">${b.yield?esc(b.yield)+' g':'—'}</div></div>
        <div class="stat"><div class="k">bloom</div><div class="v hand">${esc(bloomTxt||'—')}</div></div>
        <div class="stat"><div class="k">time</div><div class="v hand">${esc(b.time||'—')}</div></div>
        ${b.draw?'<div class="stat"><div class="k">drawdown</div><div class="v hand">'+esc(b.draw)+'</div></div>':''}
        ${b.bed?'<div class="stat"><div class="k">bed</div><div class="v hand">'+esc(bedName(b.bed))+'</div></div>':''}
        <div class="stat"><div class="k">grind</div><div class="v hand">${malingVal}</div></div>
        <div class="stat"><div class="k">temp</div><div class="v hand">${b.temp?esc(b.temp)+'°C':'—'}</div></div>
      </div>` : `
      <div class="stat-ratio">ratio ${ratioTxt} · score ${scoreTxt}/10</div>
      <div class="stat-grid">
        <div class="stat"><div class="k">dose in</div><div class="v hand">${b.dose?esc(b.dose)+' g':'—'}</div></div>
        <div class="stat"><div class="k">yield out</div><div class="v hand">${b.yield?esc(b.yield)+' g':'—'}</div></div>
        <div class="stat"><div class="k">shot time</div><div class="v hand">${esc(b.time||'—')}</div></div>
        <div class="stat"><div class="k">grind</div><div class="v hand">${malingVal}</div></div>
        <div class="stat"><div class="k">temp</div><div class="v hand">${b.temp?esc(b.temp)+'°C':'—'}</div></div>
      </div>`;
  document.getElementById('detail-body').innerHTML=`
    <div class="detail-top"><button onclick="goBack('brews')">‹</button>
      <div class="h hand">${esc((b.title&&b.title.trim())?b.title:m.name)}</div><div class="edit hand" onclick="openEdit(state.brews.find(x=>x.id==='${id}'))">edit</div></div>
    ${subParts.length?'<div class="subtitle" style="text-align:center;margin:-8px 0 4px">'+subParts.join(' · ')+'</div>':''}
    <div class="hero-img"><span class="doodle steam" style="top:0;left:50%;">∿ ∿ ∿</span>${iconHTML(m,210)}</div>
    <div class="stat-card sketch" style="background:var(${m.tint});">${grid}</div>
    ${(fam==='espresso'&&b.target&&fmtShot(b.target))?'<div class="notes-card sketch soft"><div class="k">target (dial-in)</div><div class="v">'+esc(fmtShot(b.target))+'</div></div>':''}
    ${advice?'<div class="notes-card sketch soft"><div class="k">grind tip'+(fam==='espresso'?'':' — gear-aware')+'</div><div class="v">next time: grind '+esc(advice.grind)+(advice.reason?' <span style="color:var(--ink-soft)">— '+esc(advice.reason)+'</span>':'')+'</div></div>':''}
    ${prepHtml?'<div class="notes-card sketch soft"><div class="k">'+(fam==='espresso'?'puck-prep & machine':'prep')+'</div>'+prepHtml+'</div>':''}
    ${(b.brewer||b.grinder||b.paper||b.water)?'<div class="notes-card sketch soft"><div class="k">gear</div><div class="v">'+[b.brewer,b.grinder,b.paper,b.water].filter(Boolean).map(esc).join(' · ')+'</div></div>':''}
    <div class="notes-card sketch soft"><div class="k">notes</div><div class="v">${esc(b.notes||(b.tags&&b.tags.length?'':'no notes'))}</div>
      ${asArr(b.tags).length?'<div class="note-tags">'+asArr(b.tags).map(t=>'<span class="nt">'+esc(t)+'</span>').join('')+'</div>':''}
      ${asArr(b.custom).length?'<div style="margin-top:10px">'+asArr(b.custom).map(c=>'<div class="rstep"><span style="color:var(--ink-soft)">'+esc(c.k)+':</span> '+esc(c.v)+'</div>').join('')+'</div>':''}</div>
    ${fam==='filter'?filterCompassHTML(b):''}
    ${tasteWheelStatic(b.tags,'taste')}
    ${freshGaugeHTML(bean,b.ts,'the bean on brew day')}
    ${typeof BrewWorkspace!=='undefined'?BrewWorkspace.historyRecipeHTML(b):(b.guide?customGuideHTML(b.guide):'')}
    <div class="detail-actions sketch soft">
      <button class="act" onclick="delBrew('${id}')"><span class="ic">${ICO.del}</span>delete</button>
      <button class="act primary hand" onclick="brewAgain('${id}')">brew again</button>
      <button class="act" onclick="shareOneBrew('${id}')"><span class="ic">${ICO.send}</span>send</button>
      <button class="act" onclick="shareBrew('${id}')"><span class="ic">${ICO.chat}</span>text</button>
      <button class="act" onclick="printBrew('${id}')"><span class="ic"><svg viewBox="0 0 24 24" class="acic"><path d="M6.9 9.4 Q6.8 4.9 7.2 4.2 Q12 3.8 16.8 4.3 Q17.2 8.2 17.1 9.4 M5.4 9.5 Q4.1 9.1 4.3 11 Q4.1 14.6 4.5 16.6 Q6.1 16.8 8.2 16.6 M18.6 9.5 Q19.9 9.1 19.7 11 Q19.9 14.6 19.5 16.6 Q17.9 16.8 15.8 16.6 M7.3 13.3 Q12 12.8 16.9 13.4 M16.6 13.1 Q16.9 17 16.8 20.3 M17 19.9 Q12 20.6 7.1 20.1 M7.4 20.4 Q7 16.9 7.2 13"/></svg></span>PDF</button>
      ${featOn('sharecards')?`<button class="act" onclick="shareCard('${id}')"><span class="ic"><svg viewBox="0 0 24 24" class="acic"><path d="M4.3 6.2 Q12 5.8 19.8 6.5 M19.5 6.1 Q20.1 12 19.6 17.9 M19.8 17.6 Q12 18.2 4.2 17.6 M4.5 17.9 Q3.8 12 4.4 6"/><path d="M6.8 10 Q9.5 9.6 12.2 10.2 M6.8 13.5 Q10 13.1 13.2 13.7" opacity="0.6"/><path d="M18 11 Q18.5 12.4 17 13 Q15.5 12.8 15.6 11.3 Q16.1 10.2 17.5 10.5" opacity="0.7"/></svg></span>card</button>`:''}
    </div>`;
  go('detail');
}
function customGuideHTML(guide){
  return `<div class="guide-card sketch soft open">
    <button class="guide-toggle" onclick="this.parentElement.classList.toggle('open')">
      <span class="hand">how to brew this?</span><span class="g-arr">▸</span></button>
    <div class="guide-body"><div class="rstep" style="white-space:pre-wrap">${esc(guide)}</div></div></div>`;
}
function guideHTML(methodId){
  const g=guideFor(methodId);if(!g)return'';
  const steps=g.steps.map((st,i)=>`<div class="rstep">${i+1}. ${esc(st)}</div>`).join('');
  return `<div class="guide-card sketch soft">
    <button class="guide-toggle" onclick="this.parentElement.classList.toggle('open')">
      <span class="hand">how to brew this?</span><span class="g-arr">▸</span></button>
    <div class="guide-body">
      <div class="rk">recept</div><div class="rstep">${esc(g.recept)}</div>
      <div class="rk">maling</div><div class="rstep">${esc(g.grind)}</div>
      <div class="rk">stappen</div>${steps}
      ${g.tip?'<div class="rk">tip</div><div class="rstep">💡 '+esc(g.tip)+'</div>':''}
    </div></div>`;
}
function delBrew(id){
  if(!confirm('delete this brew?'))return;
  state.brews=state.brews.filter(x=>x.id!==id);save();toast('🗑 brew deleted');go('home');
}
// één brew als importeerbaar bestand delen
async function shareOneBrew(id){
  const b=state.brews.find(x=>x.id===id);if(!b)return;
  // neem de gekoppelde boon mee, zodat de ontvanger 'm er automatisch bij krijgt
  const brewCopy=Object.assign({},b);
  const bean=b.beanId?beanById(b.beanId):null;
  if(bean)brewCopy.bean=Object.assign({},bean);
  const pakket={type:'lbs-brews',v:1,brews:[brewCopy]};
  const json=JSON.stringify(pakket,null,2);
  const m=methodById(b.method);
  const fname=((m.name||'brew')+'-'+(b.beans||'')).replace(/[^a-z0-9]+/gi,'-').toLowerCase().replace(/^-|-$/g,'')+'.lbsbrew.json';
  const file=new File([json],fname,{type:'application/json'});
  const tekst='A brew from Lets Brew Specialty — open it in the app via profile → add from a friend.';
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:'Brew',text:tekst});return;}
    catch(e){if(e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=fname;a.click();
  URL.revokeObjectURL(url);
  toast('file saved — send it on');
}
// brew-bestand van iemand anders importeren (samenvoegen, niet vervangen)
function importBrewsFile(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  try{BrewSecurity.checkFile(file);}catch(e){toast(e.message);ev.target.value='';return;}
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=BrewSecurity.validateImport(JSON.parse(r.result));
      const inkomend = d.type==='lbs-brews'&&Array.isArray(d.brews) ? d.brews
                     : Array.isArray(d.brews) ? d.brews : null;
      if(!inkomend)throw new Error('geen brews');
      if(!inkomend.length){toast('no brews in file');ev.target.value='';return;}
      let toegevoegd=0;
      inkomend.forEach(nb=>{
        if(!nb||!nb.method)return;
        const kopie=Object.assign({},nb);
        kopie.id=uid();                       // nieuw id
        kopie.ts=Date.now();                  // als 'net toegevoegd'
        kopie.beanId=null;                    // koppeling geldt niet bij de ander
        state.brews.push(kopie);toegevoegd++;
      });
      BrewModel.linkBeansByName(state);     // zelfde naam als een eigen boon: meteen koppelen
      save();
      toast('✓ '+toegevoegd+' brew'+(toegevoegd===1?'':'s')+' added');
      go('brews');
    }catch(e){toast('couldn\'t read the file');}
    ev.target.value='';
  };
  r.readAsText(file);
}
function shareBrew(id){
  const b=state.brews.find(x=>x.id===id);const m=methodById(b.method);
  const txt=`${m.name} · ${b.beans||''}\n`+
    `ratio ${b.ratio?'1:'+(+b.ratio).toFixed(1):'-'} · dose ${b.dose||'-'}g · yield ${b.yield||'-'}g\n`+
    `time ${b.time||'-'} · ${b.temp||'-'}°C · score ${(+b.score).toFixed(1)}/10\n`+
    `${b.notes||''}\n\nMade with Lets Brew Specialty — try it yourself:`;
  const appUrl=location.origin+location.pathname;
  // native deelvenster (deelt tekst + link naar de web-app)
  if(navigator.share){
    navigator.share({title:'Lets Brew Specialty',text:txt,url:appUrl}).catch(()=>{});
  }else{
    const url='https://wa.me/?text='+encodeURIComponent(txt+'\n'+appUrl);
    window.open(url,'_blank');
  }
}
// hele app / bonenlijst delen
function shareApp(){
  const appUrl=location.origin+location.pathname;
  const txt='Check out my coffee app Lets Brew Specialty ☕ — track brews, beans, score flavours:';
  if(navigator.share){
    navigator.share({title:'Lets Brew Specialty',text:txt,url:appUrl}).catch(()=>{});
  }else{
    window.open('https://wa.me/?text='+encodeURIComponent(txt+'\n'+appUrl),'_blank');
  }
}
function shareBeans(){
  const inHuis=state.beans.filter(b=>b.inStock!==false);
  let lijst=inHuis.map(b=>'• '+b.name+(b.roaster?' ('+b.roaster+')':'')).join('\n')||'(no beans in stock yet)';
  const appUrl=location.origin+location.pathname;
  const txt='My bean shelf in Lets Brew Specialty ☕\n\n'+lijst+'\n\nTry the app yourself:';
  if(navigator.share){
    navigator.share({title:'My bean shelf',text:txt,url:appUrl}).catch(()=>{});
  }else{
    window.open('https://wa.me/?text='+encodeURIComponent(txt+'\n'+appUrl),'_blank');
  }
}
// bonen als importeerbaar bestand delen (generiek: 1 of meer bonen)
async function shareBeansList(beans,titel){
  if(!beans.length){toast('nothing to share');return;}
  const pakket={type:'lbs-beans',v:1,from:'',beans:beans};
  const json=JSON.stringify(pakket,null,2);
  const naam=beans.length===1?beans[0].name:'beans';
  const fname=naam.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.lbsbeans.json';
  const file=new File([json],fname,{type:'application/json'});
  const tekst=(beans.length===1?'A coffee bean':'Coffee beans')+' from Lets Brew Specialty — open in the app via profile → add from a friend.';
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:titel||'Bonen',text:tekst});return;}
    catch(e){if(e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=fname;a.click();
  URL.revokeObjectURL(url);
  toast('file saved — send it on');
}
function shareOneBean(id){
  const b=state.beans.find(x=>x.id===id);if(!b)return;
  shareBeansList([b],b.name);
}
// bonen-bestand van iemand anders importeren (samenvoegen, niet vervangen)
function importBeansFile(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  try{BrewSecurity.checkFile(file);}catch(e){toast(e.message);ev.target.value='';return;}
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=BrewSecurity.validateImport(JSON.parse(r.result));
      // accepteer zowel het bonen-pakket als een volledige back-up
      const inkomend = d.type==='lbs-beans'&&Array.isArray(d.beans) ? d.beans
                     : Array.isArray(d.beans) ? d.beans : null;
      if(!inkomend)throw new Error('geen bonen');
      if(!inkomend.length){toast('no beans in file');ev.target.value='';return;}
      let toegevoegd=0, overgeslagen=0;
      inkomend.forEach(nb=>{
        if(!nb||!nb.name)return;
        // duplicaat = zelfde naam + brander (hoofdletterongevoelig)
        const dup=state.beans.some(b=>
          (b.name||'').toLowerCase().trim()===(nb.name||'').toLowerCase().trim() &&
          (b.roaster||'').toLowerCase().trim()===(nb.roaster||'').toLowerCase().trim());
        if(dup){overgeslagen++;return;}
        const kopie=Object.assign({},nb);
        kopie.id=uid();                 // nieuw id, anders botst het
        if(kopie.inStock===undefined)kopie.inStock=true;
        state.beans.push(kopie);toegevoegd++;
      });
      save();renderBeans();
      let msg='✓ '+toegevoegd+' bean'+(toegevoegd===1?'':'s')+' added';
      if(overgeslagen)msg+=' · '+overgeslagen+' already present';
      toast(msg);
      go('beans');
    }catch(e){toast('couldn\'t read the file');}
    ev.target.value='';
  };
  r.readAsText(file);
}
// unieke importer: brews én/of bonen van een vriend (voegt toe, vervangt niet).
// een bij een brew meegestuurde boon komt automatisch mee en blijft gekoppeld.
function importFriend(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  try{BrewSecurity.checkFile(file);}catch(e){toast(e.message);ev.target.value='';return;}
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=normaliseerData(BrewSecurity.validateImport(JSON.parse(r.result)));
      let addedBrews=0,addedBeans=0,skippedBeans=0;
      const idMap={};                         // oud boon-id -> nieuw boon-id
      const addBean=(nb)=>{
        if(!nb||!nb.name)return null;
        const bestaand=state.beans.find(b=>
          (b.name||'').toLowerCase().trim()===(nb.name||'').toLowerCase().trim() &&
          (b.roaster||'').toLowerCase().trim()===(nb.roaster||'').toLowerCase().trim());
        if(bestaand){skippedBeans++;if(nb.id)idMap[nb.id]=bestaand.id;return bestaand.id;}
        const kopie=Object.assign({},nb);
        const oud=kopie.id;kopie.id=uid();
        if(kopie.inStock===undefined)kopie.inStock=true;
        state.beans.push(kopie);addedBeans++;
        if(oud)idMap[oud]=kopie.id;
        return kopie.id;
      };
      // 1) losse bonen in het pakket
      (Array.isArray(d.beans)?d.beans:[]).forEach(addBean);
      // 2) brews (+ eventueel meegestuurde boon)
      (Array.isArray(d.brews)?d.brews:[]).forEach(nb=>{
        if(!nb||!nb.method)return;
        const kopie=Object.assign({},nb);
        kopie.id=uid();kopie.ts=Date.now();
        if(kopie.bean&&kopie.bean.name){kopie.beanId=addBean(kopie.bean);}
        else if(kopie.beanId&&idMap[kopie.beanId]){kopie.beanId=idMap[kopie.beanId];}
        else{kopie.beanId=null;}
        delete kopie.bean;
        state.brews.push(kopie);addedBrews++;
      });
      if(!addedBrews&&!addedBeans&&!skippedBeans){toast('no brews or beans in this file');ev.target.value='';return;}
      BrewModel.linkBeansByName(state);   // zelfde naam als een eigen boon: meteen koppelen
      save();
      const parts=[];
      if(addedBrews)parts.push(addedBrews+' brew'+(addedBrews===1?'':'s'));
      if(addedBeans)parts.push(addedBeans+' bean'+(addedBeans===1?'':'s'));
      let msg='✓ '+(parts.join(' + ')||'nothing new')+' added';
      if(skippedBeans)msg+=' · '+skippedBeans+' bean'+(skippedBeans===1?'':'s')+' already present';
      toast(msg);
      go(addedBrews?'brews':'beans');
    }catch(e){toast('couldn\'t read the file');}
    ev.target.value='';
  };
  r.readAsText(file);
}

/* ---------------- PDF / print (om te lezen, bibliotheekvrij) ---------------- */
function pesc(s){return esc(s);} // korte alias voor de printvellen
function brewSheetHTML(b){
  const m=methodById(b.method);
  const bean=b.beanId?beanById(b.beanId):null;
  const titel=(b.title&&b.title.trim())?b.title:(m?m.name:'brew');
  const datum=b.ts?new Date(b.ts).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'';
  const metaBits=[m?m.name:'',bean?bean.name:'',datum].filter(Boolean).map(pesc).join(' · ');
  const rows=[
    ['ratio',b.ratio?'1:'+(+b.ratio).toFixed(1):null],
    ['dose',b.dose?b.dose+' g':null],
    ['yield',b.yield?b.yield+' g':null],
    ['bloom',b.bloom?[b.bloom.g?b.bloom.g+' g':'',b.bloom.s?b.bloom.s+' s':''].filter(Boolean).join(' · '):null],
    ['time',b.time||null],
    ['temp',b.temp?b.temp+' °C':null],
    ['grind',b.grind||null],
    ['target',(b.target&&fmtShot(b.target))?fmtShot(b.target):null],
    ['score',(b.score!=null&&b.score!=='')?(+b.score).toFixed(1)+'/10':null]
  ].filter(r=>r[1]).map(r=>'<b>'+pesc(r[0])+':</b> '+pesc(r[1])).join(' &nbsp; ');
  let guideTxt='';
  if(b.guide){guideTxt=b.guide;}
  else{const g=guideFor(b.method);if(g){guideTxt='recept: '+g.recept+'\nmaling: '+g.grind+'\n'+g.steps.map((s,i)=>(i+1)+'. '+s).join('\n');}}
  const tags=asArr(b.tags).length?('taste: '+asArr(b.tags).join(', ')):'';
  return `<div class="p-brew">
    <div class="p-bt"><span class="p-ic">${iconHTML(m,34)}</span>${pesc(titel)}</div>
    <div class="p-meta">${metaBits||''}</div>
    <div class="p-grid">${rows||'—'}</div>
    ${b.notes?'<div class="p-notes">'+pesc(b.notes)+'</div>':''}
    ${tags?'<div class="p-notes">'+pesc(tags)+'</div>':''}
    ${guideTxt?'<div class="p-steps">'+pesc(guideTxt).replace(/\n/g,'<br>')+'</div>':''}
  </div>`;
}
function runPrint(html){
  const area=document.getElementById('print-area');
  area.innerHTML=html;
  const after=()=>{area.innerHTML='';window.removeEventListener('afterprint',after);};
  window.addEventListener('afterprint',after);
  setTimeout(()=>window.print(),60);
}
function printBrew(id){
  const b=state.brews.find(x=>x.id===id);if(!b)return;
  const html='<div class="p-h1">'+pesc((b.title&&b.title.trim())?b.title:(methodById(b.method)?.name||'brew'))+'</div>'+
    '<div class="p-sub">lets brew specialty — brew recipe</div>'+brewSheetHTML(b);
  runPrint(html);
}
function printLogbook(){
  if(!state.brews.length){toast('no brews to save yet');return;}
  const brews=[...state.brews].sort((a,b)=>(b.ts||0)-(a.ts||0));
  const html='<div class="p-h1">mijn brew-logboek</div>'+
    '<div class="p-sub">lets brew specialty · '+brews.length+' brews · '+state.beans.length+' beans · '+
    new Date().toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric'})+'</div>'+
    brews.map(brewSheetHTML).join('');
  runPrint(html);
}

/* ---------------- methodes beheren ---------------- */
let mmNewImg=null;
function renderMethods(){
  document.getElementById('mm-list').innerHTML=state.methods.map(m=>{
    const cnt=state.brews.filter(b=>b.method===m.id).length;
    return `<div class="mm-item sketch soft" style="background:var(${m.tint});">
      <span class="mm-glyph">${iconHTML(m,40)}</span>
      <div style="flex:1">
        <div class="mm-name hand">${esc(m.name)}</div>
        <div style="font-size:14px;color:var(--ink-soft)">
          ${cnt>0?`<a class="bean-link" onclick="showMethodBrews('${m.id}')">${cnt} brew${cnt===1?'':'s'} →</a>`:'no brews yet'}
          · <a class="bean-link" onclick="openImgPicker('${m.id}')">drawing</a>
        </div>
        <div style="font-size:14px;color:var(--ink-soft);margin-top:2px">family: <a class="bean-link" onclick="toggleMethodFamily('${m.id}')">${esc(methodFamily(m))} ⇄</a></div>
        ${gearRowHTML(m)}
        <input type="file" id="mm-edit-img-${m.id}" accept="image/*" style="display:none" onchange="replaceMethodImg('${m.id}',event)">
      </div>
      <div class="toggle ${m.on?'on':''}" onclick="toggleMethod('${m.id}')"><div class="knob"></div></div>
    </div>`;}).join('');
}
/* ---------------- methodes en gear aan elkaar ----------------
   Twee losse lijsten die niets van elkaar wisten. Hang je gear aan een methode
   en de coach vult zich vanzelf, en de AI krijgt alleen wat er bij die methode
   hoort in plaats van je hele kast.                                        */
function methodGear(mid){
  const m=methodById(mid);
  const ids=(m&&Array.isArray(m.gear))?m.gear:[];
  return (state.gear||[]).filter(g=>ids.includes(g.id));
}
function gearMethods(gid){
  return (state.methods||[]).filter(m=>Array.isArray(m.gear)&&m.gear.includes(gid));
}
function toggleMethodGear(mid,gid){
  const m=state.methods.find(x=>x.id===mid);if(!m)return;
  if(!Array.isArray(m.gear))m.gear=[];
  const i=m.gear.indexOf(gid);
  if(i>=0)m.gear.splice(i,1);else m.gear.push(gid);
  save();renderMethods();renderGear();
}
// welke gear stel je voor bij deze methode? gekoppeld eerst, anders op categorie
function gearVoor(mid){
  const gekoppeld=methodGear(mid);
  if(gekoppeld.length)return gekoppeld;
  const fam=methodFamily(mid);
  return (state.gear||[]).filter(g=>g.category===fam||g.category==='algemeen');
}
function toggleMethod(id){const m=state.methods.find(x=>x.id===id);m.on=!m.on;save();renderMethods();toast(m.on?'✓ '+m.name+' on':'○ '+m.name+' off');}
// de gear-knopjes onder een methode: aan = gekoppeld
function gearRowHTML(m){
  const alles=state.gear||[];
  if(!alles.length)return '<div class="mm-gear-leeg">no gear yet \u2014 add it under profile</div>';
  const gekoppeld=(Array.isArray(m.gear)?m.gear:[]);
  return '<div class="mm-gear">'+alles.map(g=>
    '<button type="button" class="mg '+(gekoppeld.includes(g.id)?'sel':'')+
    '" onclick="toggleMethodGear(\''+m.id+'\',\''+g.id+'\')">'+esc(g.name)+'</button>').join('')+'</div>';
}
function toggleMethodFamily(id){
  const m=state.methods.find(x=>x.id===id);if(!m)return;
  m.family=(methodFamily(m)==='espresso')?'filter':'espresso';
  save();renderMethods();toast(m.name+' → '+m.family);
}

let imgPickerMethod=null;
function openImgPicker(id){
  imgPickerMethod=id;
  const m=state.methods.find(x=>x.id===id);if(!m)return;
  const lib=libraryFor(m);
  const cur=methodImg(m);
  const grid=document.getElementById('img-picker-grid');
  grid.innerHTML=lib.map(o=>
    `<div class="img-opt ${cur===o.src?'sel':''}" onclick="chooseLibImg('${o.src}')">
      <img src="${o.src}"><span class="lbl">${esc(o.label)}</span></div>`
  ).join('')||'<div style="grid-column:1/3;color:var(--ink-soft);font-size:16px">no built-in drawings — upload your own.</div>';
  document.getElementById('img-picker').classList.remove('hidden');
}
function closeImgPicker(){document.getElementById('img-picker').classList.add('hidden');imgPickerMethod=null;}
function chooseLibImg(src){
  const m=state.methods.find(x=>x.id===imgPickerMethod);if(!m)return;
  m.img=src;delete m.customImg;  // ingebouwde tekening, eigen upload weg
  save();renderMethods();closeImgPicker();toast('✓ drawing chosen');
}
async function pickerUpload(ev){
  const f=ev.target.files&&ev.target.files[0];if(!f||!imgPickerMethod)return;
  try{const d=await fileToDataURL(f,500);
    const m=state.methods.find(x=>x.id===imgPickerMethod);m.customImg=d;
    save();renderMethods();closeImgPicker();toast('✓ your drawing set');
  }catch(e){toast('couldn\'t load image');}
  ev.target.value='';
}
function showMethodBrews(id){ filterMethod=id; go('brews'); }
function fileToDataURL(file,maxW,removeBg){
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const scale=Math.min(1,(maxW||500)/img.width);
        const c=document.createElement('canvas');
        c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
        const ctx=c.getContext('2d');
        ctx.drawImage(img,0,0,c.width,c.height);
        if(removeBg!==false){
          try{
            const d=ctx.getImageData(0,0,c.width,c.height);
            const p=d.data;
            for(let i=0;i<p.length;i+=4){
              const a=p[i+3];
              const lum=(p[i]+p[i+1]+p[i+2])/3;
              if(a<10){continue;}
              if(lum>150){ p[i+3]=0; }            // lichte achtergrond weg
              else { p[i]=58;p[i+1]=48;p[i+2]=42; // inkt -> huisstijl bruin
                     p[i+3]=lum<110?255:Math.round((175-lum)/175*255); }
            }
            ctx.putImageData(d,0,0);
            // bijsnijden op zichtbare inhoud
            const cropped=cropTransparent(c);
            res(cropped.toDataURL('image/png'));
            return;
          }catch(e){/* val terug op ruwe afbeelding */}
        }
        // foto's zonder transparantie als JPEG bewaren: ~10x kleiner dan PNG
        res(c.toDataURL('image/jpeg',0.72));
      };
      img.onerror=rej;img.src=r.result;
    };
    r.onerror=rej;r.readAsDataURL(file);
  });
}
function cropTransparent(canvas){
  const ctx=canvas.getContext('2d');
  const {width:w,height:h}=canvas;
  const d=ctx.getImageData(0,0,w,h).data;
  let minX=w,minY=h,maxX=0,maxY=0,found=false;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    if(d[(y*w+x)*4+3]>10){found=true;
      if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}
  }
  if(!found)return canvas;
  const m=8;
  minX=Math.max(0,minX-m);minY=Math.max(0,minY-m);maxX=Math.min(w-1,maxX+m);maxY=Math.min(h-1,maxY+m);
  const cw=maxX-minX+1,ch=maxY-minY+1;
  const out=document.createElement('canvas');out.width=cw;out.height=ch;
  out.getContext('2d').drawImage(canvas,minX,minY,cw,ch,0,0,cw,ch);
  return out;
}
async function pickMethodImg(ev){
  const f=ev.target.files&&ev.target.files[0];if(!f)return;
  try{mmNewImg=await fileToDataURL(f,500);
    document.getElementById('mm-img-preview').innerHTML='<img src="'+mmNewImg+'" style="max-height:80px;mix-blend-mode:multiply">';
    document.getElementById('mm-img-label').textContent='drawing chosen ✓';
  }catch(e){toast('couldn\'t load image');}
  ev.target.value='';
}
async function replaceMethodImg(id,ev){
  const f=ev.target.files&&ev.target.files[0];if(!f)return;
  try{const d=await fileToDataURL(f,500);
    const m=state.methods.find(x=>x.id===id);m.customImg=d;save();renderMethods();toast('✓ drawing updated');
  }catch(e){toast('couldn\'t load image');}
  ev.target.value='';
}
let mmFamily='filter';
function pickFamily(f){
  mmFamily=(f==='espresso')?'espresso':'filter';
  const e=document.getElementById('mm-fam-espresso'),fi=document.getElementById('mm-fam-filter');
  if(e)e.classList.toggle('sel',mmFamily==='espresso');
  if(fi)fi.classList.toggle('sel',mmFamily==='filter');
}
function addMethod(){
  const name=document.getElementById('mm-new').value.trim();
  if(!name){toast('enter a name');return;}
  const id=name.toLowerCase().replace(/[^a-z0-9]/g,'')+'_'+uid().slice(0,3);
  const tint=TINTS[state.methods.length%TINTS.length];
  const m={id,name:name.toLowerCase(),glyph:'☕',tint,on:true,family:mmFamily};
  if(mmNewImg)m.customImg=mmNewImg;
  state.methods.push(m);
  document.getElementById('mm-new').value='';mmNewImg=null;mmFamily='filter';pickFamily('filter');
  document.getElementById('mm-img-preview').innerHTML='';
  document.getElementById('mm-img-label').textContent='add a drawing (optional)';
  save();renderMethods();toast('✓ method added');
}

