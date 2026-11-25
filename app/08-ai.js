/* ---------------- welke AI antwoordt --------------------------------------
   De app praat vanuit de browser rechtstreeks met de aanbieder die JIJ kiest.
   Elke aanbieder wil zijn eigen vorm: Anthropic wil `messages` met `max_tokens`
   en geeft `content[]` terug, OpenAI wil chat/completions met een Bearer-token
   en geeft `choices[0].message.content` terug. Binnenin houdt de app één vorm
   aan -- die van Anthropic -- en vertaalt per aanbieder. Wil je er een derde
   bij, dan is dat één regel in deze lijst.                                    */
function naarOpenAI(messages){
  return messages.map(m=>{
    if(typeof m.content==='string')return {role:m.role,content:m.content};
    const delen=(m.content||[]).map(c=>{
      if(!c)return null;
      if(c.type==='text')return {type:'text',text:c.text};
      if(c.type==='image'&&c.source&&c.source.type==='base64')
        return {type:'image_url',image_url:{url:'data:'+c.source.media_type+';base64,'+c.source.data}};
      return null;
    }).filter(Boolean);
    return {role:m.role,content:delen};
  });
}
const AI_AANBIEDERS=[
  {id:'anthropic',naam:'Anthropic',merk:'Claude',hint:'sk-ant-...',
   model:'claude-sonnet-4-6',prijs:{in:3,uit:15},waar:'console.anthropic.com',
   url:()=>'https://api.anthropic.com/v1/messages',
   kop:k=>({'Content-Type':'application/json','anthropic-dangerous-direct-browser-access':'true',
            'x-api-key':k,'anthropic-version':'2023-06-01'}),
   lijf:(m,mx,model,stream)=>{
     const b={model:model,max_tokens:mx,messages:m};
     if(stream)b.stream=true;
     return b;},
   lees:d=>Array.isArray(d.content)
     ?d.content.filter(i=>i&&i.type==='text').map(i=>i.text).join('\n')
     :(typeof d.content==='string'?d.content:''),
   verbruik:d=>d.usage,
   // bij een stream komt het verbruik in twee stukken: de invoer meteen, de uitvoer aan het eind
   stroom:(ev,v)=>{
     if(ev.type==='message_start'&&ev.message&&ev.message.usage)Object.assign(v,ev.message.usage);
     if(ev.type==='message_delta'&&ev.usage&&ev.usage.output_tokens!=null)v.output_tokens=ev.usage.output_tokens;
     return (ev.type==='content_block_delta'&&ev.delta&&ev.delta.text)?ev.delta.text:'';}},

  {id:'openai',naam:'OpenAI',merk:'GPT',hint:'sk-...',
   model:'gpt-4o-mini',prijs:{in:0.15,uit:0.6},waar:'platform.openai.com',
   url:()=>'https://api.openai.com/v1/chat/completions',
   kop:k=>({'Content-Type':'application/json','Authorization':'Bearer '+k}),
   lijf:(m,mx,model,stream,oud)=>{
     const b={model:model,messages:naarOpenAI(m)};
     b[oud?'max_tokens':'max_completion_tokens']=mx;
     if(stream){b.stream=true;b.stream_options={include_usage:true};}
     return b;},
   lees:d=>(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||'',
   verbruik:d=>d.usage&&{input_tokens:d.usage.prompt_tokens,output_tokens:d.usage.completion_tokens},
   stroom:(ev,v)=>{
     if(ev.usage)Object.assign(v,{input_tokens:ev.usage.prompt_tokens,output_tokens:ev.usage.completion_tokens});
     const c=ev.choices&&ev.choices[0];
     return (c&&c.delta&&c.delta.content)||'';}},
];
function aiProv(){return localStorage.getItem('scc_ai_prov')||'anthropic';}
function aiAanbieder(id){return AI_AANBIEDERS.find(x=>x.id===(id||aiProv()))||AI_AANBIEDERS[0];}
// de sleutel van Anthropic stond er al onder de oude naam -- die laten we staan
function aiSleutelNaam(id){id=id||aiProv();return id==='anthropic'?'scc_ai_key':'scc_ai_key_'+id;}
function aiModel(id){id=id||aiProv();return (localStorage.getItem('scc_ai_model_'+id)||'').trim()||aiAanbieder(id).model;}
/* Prijzen per model, in dollar per miljoen tokens (in, uit). Peil: zie
   AI_PRIJZEN_PEIL; Anthropic uit de officiële prijslijst, OpenAI uit de
   bekende lijst (niet live nagekeken, daarom kun je hem in de app
   overschrijven). denkt: dit model denkt altijd eerst na; dat denkwerk wordt
   als uitvoer betaald, dus een schatting vooraf rekent met meer uitvoer.
   Een model met een datum erachter (claude-x-20260101) valt onder zijn naam. */
const AI_PRIJZEN_PEIL='Nov 2026';
const AI_PRIJZEN={
  'claude-fable-5-2':{in:8,uit:40,denkt:true},'claude-fable-5-1':{in:10,uit:50,denkt:true},
  'claude-fable-5':{in:10,uit:50,denkt:true},'claude-opus-5-5':{in:4,uit:20,denkt:true},
  'claude-opus-5':{in:5,uit:25,denkt:true},'claude-opus-4-8':{in:5,uit:25},'claude-opus-4-7':{in:5,uit:25},
  'claude-opus-4-6':{in:5,uit:25},'claude-sonnet-5-5':{in:2,uit:10,denkt:true},
  'claude-sonnet-5':{in:2,uit:10,denkt:true},'claude-sonnet-4-6':{in:3,uit:15},
  'claude-haiku-5-5':{in:0.1,uit:0.5,denkt:true},'claude-haiku-4-5':{in:1,uit:5},
  'gpt-4o-mini':{in:0.15,uit:0.6},'gpt-4o':{in:2.5,uit:10},'gpt-4.1-nano':{in:0.1,uit:0.4},
  'gpt-4.1-mini':{in:0.4,uit:1.6},'gpt-4.1':{in:2,uit:8},'gpt-5-nano':{in:0.05,uit:0.4,denkt:true},
  'gpt-5-mini':{in:0.25,uit:2,denkt:true},'gpt-5':{in:1.25,uit:10,denkt:true},
};
// de langste naam in de lijst waar het model mee begint (gpt-4o-mini voor gpt-4o)
function aiModelPrijs(model){
  model=(model||'').toLowerCase().trim();let best=null;
  for(const k in AI_PRIJZEN)if((model===k||model.startsWith(k+'-'))&&(!best||k.length>best.length))best=k;
  return best?AI_PRIJZEN[best]:null;
}
function aiPrijsSleutel(id,model){return 'scc_ai_prijs_'+id+':'+(model||'').toLowerCase().trim();}
/* dollar per token. Volgorde: wat jij voor dit model invulde, dan de lijst,
   dan wat je vroeger voor de aanbieder invulde (toen gold één prijs voor elk
   model), en anders de standaard van de aanbieder.                       */
function aiTarief(id){
  id=id||aiProv();
  const model=aiModel(id),lees=k=>{try{const t=JSON.parse(localStorage.getItem(k)||'null');
    if(t&&t.in>=0&&t.uit>=0)return t;}catch(e){}return null;};
  const eigen=lees(aiPrijsSleutel(id,model));
  if(eigen)return {in:eigen.in/1e6,uit:eigen.uit/1e6,bron:'own'};
  const lijst=aiModelPrijs(model);
  if(lijst)return {in:lijst.in/1e6,uit:lijst.uit/1e6,bron:'list',denkt:!!lijst.denkt};
  const oud=lees('scc_ai_prijs_'+id);
  if(oud)return {in:oud.in/1e6,uit:oud.uit/1e6,bron:'own'};
  const p=aiAanbieder(id).prijs;
  return {in:p.in/1e6,uit:p.uit/1e6,bron:'guess'};
}

/* ---------------- AI: één aanroep, welke aanbieder er ook staat ---------- */
async function askAI(messages, maxTokens, bron){
  if(!aiEnabled()||!getKey())throw new Error('AI uit of geen sleutel');
  const a=aiAanbieder(),mx=maxTokens||1000;
  if(typeof BrewWorkspace!=='undefined')messages=BrewWorkspace.withContext(messages,undefined,bron);
  let res=await fetch(a.url(),{method:"POST",headers:a.kop(getKey()),signal:AbortSignal.timeout(60000),
    body:JSON.stringify(a.lijf(messages,mx,aiModel(),false,false))});
  if(!res.ok){
    const m=await apiFout(res);
    // sommige modellen willen max_tokens, andere max_completion_tokens -- één keer omdraaien
    if(res.status===400&&/max_(completion_)?tokens/.test(m)){
      res=await fetch(a.url(),{method:"POST",headers:a.kop(getKey()),signal:AbortSignal.timeout(60000),
        body:JSON.stringify(a.lijf(messages,mx,aiModel(),false,true))});
      if(!res.ok)throw new Error(await apiFout(res));
    }else throw new Error(m);
  }
  const data=await res.json();
  try{aiTel(a.verbruik(data),bron);setTimeout(aiMeldNa,900);}catch(e){}
  const out=a.lees(data);
  if(!out)throw new Error('leeg antwoord');
  return out;
}
// streamende variant: roept onDelta(volledigeTekst) aan terwijl het antwoord binnenkomt
async function askAIStream(messages, maxTokens, onDelta, bron){
  if(!aiEnabled()||!getKey())throw new Error('AI uit of geen sleutel');
  const a=aiAanbieder();
  if(typeof BrewWorkspace!=='undefined')messages=BrewWorkspace.withContext(messages,undefined,bron);
  const res=await fetch(a.url(),{method:"POST",headers:a.kop(getKey()),signal:AbortSignal.timeout(60000),
    body:JSON.stringify(a.lijf(messages,maxTokens||600,aiModel(),true,false))});
  if(!res.ok||!res.body)throw new Error(res.body?await apiFout(res):('api '+res.status));
  const reader=res.body.getReader();const dec=new TextDecoder();let buf='',full='';
  const verbruik={input_tokens:0,output_tokens:0};
  while(true){
    const {done,value}=await reader.read();if(done)break;
    buf+=dec.decode(value,{stream:true});
    let nl;
    while((nl=buf.indexOf('\n'))>=0){
      const line=buf.slice(0,nl).trim();buf=buf.slice(nl+1);
      if(!line.startsWith('data:'))continue;
      const payload=line.slice(5).trim();if(!payload||payload==='[DONE]')continue;
      try{const stuk=a.stroom(JSON.parse(payload),verbruik);
        if(stuk){full+=stuk;if(onDelta)onDelta(full);}
      }catch(e){}
    }
  }
  try{aiTel(verbruik,bron);setTimeout(aiMeldNa,900);}catch(e){}
  if(!full)throw new Error('leeg antwoord');
  return full;
}
/* Een aanbieder stuurt bij een fout een gewone zin mee die uitlegt wat er mis
   is -- "Your credit balance is too low", bijvoorbeeld. Die is meer waard dan
   het nummer dat de app tot nu toe liet zien.                                */
async function apiFout(res){
  let m='';
  try{const e=await res.json();
    m=(e&&e.error&&(e.error.message||e.error))||'';
    if(typeof m!=='string')m='';
  }catch(_){}
  return m?(m+' (api '+res.status+')'):('api '+res.status);
}
function extractJSON(txt){
  let t=txt.replace(/```json|```/g,'').trim();
  const a=t.indexOf('{'), b=t.lastIndexOf('}');
  if(a>=0&&b>a)t=t.slice(a,b+1);
  return JSON.parse(t);
}
function setText(id,v){const el=document.getElementById(id);if(el&&v)el.value=v;}
// haal het domein uit een url (bv. https://friedhats.com/... -> friedhats.com)
function domainOf(url){
  if(!url)return '';
  try{
    let u=url.trim();
    if(!/^https?:\/\//i.test(u))u='https://'+u;
    return new URL(u).hostname.replace(/^www\./,'');
  }catch(e){return '';}
}
// maak een gerichte zoeklink: als de brander-website bekend is, zoek binnen die site
// zodat je vrijwel direct op de productpagina van die brander uitkomt
function fillSearchLink(){
  const g=id=>{const el=document.getElementById(id);return el?el.value.trim():'';};
  const naam=g('b-name'),roaster=g('b-roaster'),huidigeUrl=g('b-url');
  if(!naam&&!roaster){toast('enter a name or roaster first');return;}
  // domein uit een al ingevulde (brander-)link halen, mits geen zoeklink
  let domein='';
  if(huidigeUrl && !/google\.[a-z.]+\/search/i.test(huidigeUrl)){
    domein=domainOf(huidigeUrl);
  }
  let q;
  if(domein){
    // gericht binnen de brander-site zoeken -> eerste resultaat is meestal de boon
    q='site:'+domein+' '+naam;
  }else{
    q=(roaster+' '+naam+' coffee').trim();
  }
  document.getElementById('b-url').value='https://www.google.com/search?q='+encodeURIComponent(q);
  toast(domein?'✓ link to '+domein:'✓ search link filled in');
}
let beanPhoto=null;
// een korte, leesbare reden bij een mislukte AI-vraag
function aiFoutKort(e){const m=String((e&&e.message)||e||'unknown').replace(/\s+/g,' ');return m.length>120?m.slice(0,117)+'…':m;}
async function scanLabel(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  const status=document.getElementById('scan-status');
  // 1) altijd: foto verkleinen, tonen en onthouden (ook zonder AI)
  try{
    beanPhoto=await fileToDataURL(file,700,false); // false = achtergrond NIET weghalen
    document.getElementById('label-preview').innerHTML='<img src="'+beanPhoto+'" style="max-height:140px;border-radius:14px;border:2px solid var(--line)">';
  }catch(e){}
  // 2) als AI uit staat of geen sleutel: stop hier, foto is bewaard
  if(!aiEnabled()||!getKey()){
    status.textContent='photo saved. turn on AI in profile to read the label automatically.';
    ev.target.value='';return;
  }
  // 3) AI aan: etiket uitlezen
  status.innerHTML='<span class="spin"></span>reading label…';
  try{
    // verkleind en als jpeg: een iPhone-foto of HEIC is te groot of wordt niet aangenomen
    const b64=(await fileToDataURL(file,1500,false)).split(',')[1];
    const media='image/jpeg';
    const prompt='Dit is een foto van een etiket van een zak specialty koffie. Lees alle informatie en geef ALLEEN een JSON-object terug, zonder uitleg, zonder markdown. Velden (laat leeg als onbekend): {"name":"","roaster":"","origin":"","process":"","variety":"","altitude":"","roasternotes":"","roast":"","fam":"","url":""}. roasternotes = de smaakomschrijving van de brander, komma-gescheiden. url = de officiele website van de brander: als die letterlijk op de zak staat gebruik die, anders geef de meest waarschijnlijke officiele website-URL van deze brander op basis van wat je weet (bv. https://merknaam.com). Laat url alleen leeg als je echt geen idee hebt welke brander het is.\n'+BEAN_RULES;
    const txt=await askAI([{role:"user",content:[
      {type:"image",source:{type:"base64",media_type:media,data:b64}},
      {type:"text",text:prompt}
    ]}],700,'bean');
    const d=extractJSON(txt);
    setText('b-name',d.name);setText('b-roaster',d.roaster);setText('b-origin',d.origin);
    setText('b-process',d.process);setText('b-variety',d.variety);setText('b-altitude',d.altitude);
    setText('b-roasternotes',d.roasternotes);
    // brandingsvoorkeur alleen overnemen als de zak er iets over zegt
    const fam=(d.fam||'').toLowerCase().trim();
    if(fam==='espresso'||fam==='filter'||fam==='both'){beanFormFam=fam;renderBeanFam();}
    const roast=(d.roast||'').toLowerCase().trim();
    if(ROAST_LEVELS.includes(roast)){beanFormRoast=roast;renderBeanRoast();}
    // url: als AI de brander-website vond -> gerichte zoeklink naar de specifieke boon
    // binnen die site. Anders een zoeklink op merknaam + boon.
    if(d.url && d.name){
      const dom=domainOf(d.url);
      if(dom){
        setText('b-url','https://www.google.com/search?q='+encodeURIComponent('site:'+dom+' '+d.name));
      }else{
        setText('b-url',d.url);
      }
    }else if(d.url){
      setText('b-url',d.url);
    }else if(d.roaster){
      const q=encodeURIComponent((d.roaster+' '+(d.name||'')+' coffee').trim());
      setText('b-url','https://www.google.com/search?q='+q);
    }
    status.innerHTML='✓ filled in — check and adjust where needed';
    document.getElementById('enrich-row').style.display='block';
  }catch(e){
    status.textContent='couldn\'t read the label ('+aiFoutKort(e)+') — fill in manually, the photo is saved';
  }
  ev.target.value='';
}
// extra info aanvullen op basis van roaster + boon (modelkennis)
/* ---- de link doet het werk ----
   Plak je de pagina van de brander en staat AI aan, dan haalt de app eruit wat
   erop staat: naam, brander, proces, variëteit, hoogte, smaaknoten -- en de
   plek op de kaart, zodat de zak meteen bij zijn streek hoort. Alleen lege
   velden worden gevuld; wat jij zelf typte blijft staan.                    */
let beanLinkBezig='';
/* De etiketregels gelden voor een foto: daar staat de tekst voor je neus, en
   dan is aanvullen liegen. Bij een link is er juist geen tekst -- dan moet de
   AI wél putten uit wat hij over deze brander en deze boon weet, anders komt
   hij met lege handen terug. Vandaar een eigen set regels.               */
const LINK_RULES=
  'LINK-REGELS:\n'+
  '- Je kunt de pagina niet openen. Werk met twee bronnen: (a) wat er in de URL zelf staat '+
  '(domein = de brander, het pad/de slug = meestal de naam van de boon, soms ook herkomst, proces of variëteit), '+
  'en (b) wat je uit je kennis weet over deze brander en over deze boon.\n'+
  '- Zet slugs om naar leesbare tekst: "ethiopia-guji-natural-250g" -> naam "Ethiopia Guji", origin "Ethiopië, Guji", process "natural".\n'+
  '- Ken je de brander maar niet deze specifieke zak, vul dan in wat voor die brander en die herkomst gebruikelijk is, '+
  'en houd het bij wat je met redelijke zekerheid kunt zeggen.\n'+
  '- Ken je de boon of de streek wel, vul dan ook variety, altitude en roasternotes in: dit is een schatting die de '+
  'gebruiker naloopt, geen etiket dat je overtypt.\n'+
  '- Laat een veld alleen leeg als je er echt niets zinnigs over kunt zeggen. Liever een goede gok die klopt met de '+
  'herkomst dan een leeg veld.\n'+
  '- process en variety in de gangbare term (washed, natural, honey, anaerobic). roasternotes komma-gescheiden.\n'+
  '- roastlevel en fam alleen als de brander of het soort zak daar duidelijk over is.';
/* ---- de link doet het werk ----
   Plak je de pagina van de brander en staat AI aan, dan leidt de app eruit af
   wat er op die zak zit: naam, brander, proces, variëteit, hoogte, smaaknoten
   -- en de plek op de kaart, zodat de zak meteen bij zijn streek hoort. Alleen
   lege velden worden gevuld; wat jij zelf typte blijft staan.             */
async function beanUitLink(){
  const el=document.getElementById('b-url'); if(!el)return;
  const url=el.value.trim();
  if(!url||!/^https?:\/\//i.test(url))return;
  if(/google\.[a-z.]+\/search/i.test(url))return;   // dat is een zoeklink, geen zak
  if(!aiReady()||url===beanLinkBezig)return;
  beanLinkBezig=url;
  const status=document.getElementById('scan-status');
  const get=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};
  const zetLeeg=(id,v)=>{if(v&&!get(id))setText(id,v);};
  if(status)status.innerHTML='<span class="spin"></span>reading the link…';
  try{
    // eerst de pagina zelf ophalen via de eigen server; lukt dat niet, dan werkt de AI met de link alleen
    let pagina=null;
    try{const r=await fetch('/api/pagina?url='+encodeURIComponent(url),{signal:AbortSignal.timeout(12000)});if(r.ok){const p=await r.json();if(p&&(p.tekst||p.beschrijving))pagina=p;}}catch(_){}
    const landen=BP_LANDEN.filter(l=>BP_INFO[l.id]).map(l=>l.naam).join(', ');
    const alIn=['name','roaster','origin','process','variety','altitude']
      .map(k=>k+': '+(get('b-'+k)||'?')).join('; ');
    const prompt='Dit is de webpagina van een zak specialty koffie: '+url+'\n'+
      'Wat de gebruiker al invulde: '+alIn+'.\n'+
      'Vul de zak zo volledig mogelijk in. Geef ALLEEN een JSON-object terug, zonder uitleg, zonder markdown:\n'+
      '{"name":"","roaster":"","origin":"","process":"","variety":"","altitude":"","roastlevel":"","fam":"","roasternotes":"","notes":"","land":"","streek":""}\n'+
      'roastlevel is één van: '+ROAST_LEVELS.join(', ')+'. '+
      'fam is "espresso", "filter" of "both" — alleen als duidelijk is waar de zak voor gebrand is.\n'+
      'notes = twee zinnen over wat deze boon of deze streek bijzonder maakt.\n'+
      'land = het herkomstland; kies het uit deze lijst als het erbij staat: '+landen+'. '+
      'streek = de streek binnen dat land.\n'+
      // genoeg tekst: dat is de bron. Weinig tekst (pagina bouwt zich met scripts op): titel en omschrijving als hint, verder de link-regels
      (pagina&&pagina.tekst.length>300?'TEKST VAN DE PAGINA (dit is de bron; neem over wat er staat, verzin niets wat ermee in strijd is):\n'+
        'Titel: '+pagina.titel+'\nOmschrijving: '+pagina.beschrijving+'\n'+pagina.tekst+'\n'
       :(pagina?'Van de pagina kwam alleen: titel "'+pagina.titel+'", omschrijving "'+pagina.beschrijving+'".\n':'')+LINK_RULES);
    const d=extractJSON(await askAI([{role:"user",content:prompt}],900,'bean'));
    ['name','roaster','origin','process','variety','altitude'].forEach(k=>zetLeeg('b-'+k,d[k]));
    zetLeeg('b-roasternotes',d.roasternotes); zetLeeg('b-notes',d.notes);
    const roast=(d.roastlevel||'').toLowerCase().trim();
    if(!beanFormRoast&&ROAST_LEVELS.includes(roast)){beanFormRoast=roast;renderBeanRoast();}
    const fam=(d.fam||'').toLowerCase().trim();
    if(!beanFormWens&&!beanFormFam&&['espresso','filter','both'].includes(fam)){
      beanFormFam=fam;renderBeanFam();
    }
    // en zet hem op de kaart, als die er nog niet staat
    let plek='';
    if(!beanFormRegions.length&&(d.land||d.origin)){
      const landId=bpLandVanBoon({origin:(d.land||'')+' '+(d.origin||'')});
      if(landId&&BP_INFO[landId]){
        const i=bpStreekVanBoon({origin:(d.streek||'')+' '+(d.origin||'')},landId);
        beanFormRegions=[{land:landId,i:(i!=null?i:null)}];
        renderBeanHerkomst();
        plek=' · '+bpRegioTekst(beanFormRegions[0])+' on the map';
      }
    }
    if(status)status.textContent='✓ filled in from '+(pagina&&pagina.tekst.length>300?'the page':'the link (page gave little text, so partly a guess)')+plek+' — check it';
    const er=document.getElementById('enrich-row'); if(er)er.style.display='block';
  }catch(e){
    beanLinkBezig='';
    if(status)status.textContent='couldn\'t read the link ('+aiFoutKort(e)+')';
  }
}
async function enrichBean(){
  const status=document.getElementById('scan-status');
  const get=id=>{const el=document.getElementById(id);return el?el.value.trim():'';};
  const name=get('b-name'),roaster=get('b-roaster'),origin=get('b-origin'),url=get('b-url');
  if(!name&&!roaster){toast('enter at least a name or roaster first');return;}
  status.innerHTML='<span class="spin"></span>finding extra info…';
  try{
    const known=`naam: ${name||'?'}; roaster: ${roaster||'?'}; origin: ${origin||'?'}; website: ${url||'?'}; proces: ${get('b-process')||'?'}; variëteit: ${get('b-variety')||'?'}; hoogte: ${get('b-altitude')||'?'}`;
    const prompt=`Je bent een specialty-koffie expert. Voor deze specifieke boon van deze roaster, vul de ontbrekende informatie zo volledig mogelijk aan op basis van wat algemeen bekend is over deze boon, roaster en herkomst. Verzin niets: laat een veld leeg als je het echt niet weet. Bekend:\n${known}\nGeef ALLEEN JSON terug zonder markdown: {"origin":"","process":"","variety":"","altitude":"","roasternotes":"","notes":""}. roasternotes = smaakprofiel (komma-gescheiden). notes = korte extra omschrijving (max 2 zinnen) over deze boon/herkomst. Vul alleen velden in waar je iets aan toevoegt.\n${BEAN_RULES}`;
    const txt=await askAI([{role:"user",content:prompt}],700,'bean');
    const d=extractJSON(txt);
    // alleen invullen waar nu nog leeg, behalve notes/roasternotes die mogen aanvullen
    if(d.origin&&!get('b-origin'))setText('b-origin',d.origin);
    if(d.process&&!get('b-process'))setText('b-process',d.process);
    if(d.variety&&!get('b-variety'))setText('b-variety',d.variety);
    if(d.altitude&&!get('b-altitude'))setText('b-altitude',d.altitude);
    if(d.roasternotes)setText('b-roasternotes',d.roasternotes);
    if(d.notes)setText('b-notes',d.notes);
    status.textContent='✓ enriched — please check everything';
  }catch(e){
    status.textContent='couldn\'t fetch extra info — check your AI key in settings';
  }
}

/* ---------------- AI: brew-recept ---------------- */
async function aiRecipe(beanId,methodId){
  const bean=beanById(beanId);if(!bean)return;
  const m=methodById(methodId||bean.method||'v60');
  const box=document.getElementById('recipe-'+beanId);
  if(box)box.innerHTML='<div class="recipe-card sketch soft"><span class="spin"></span>thinking up a recipe for '+esc(m.name)+'…</div>';
  try{
    const info=`boon: ${bean.name}; roaster: ${bean.roaster||'?'}; origin: ${bean.origin||'?'}; proces: ${bean.process||'?'}; variëteit: ${bean.variety||'?'}; hoogte: ${bean.altitude||'?'}; smaaknotities brander: ${bean.roasternotes||'?'}`;
    const espM=methodFamily(m)==='espresso';
    const milk=espM?` Je mag een melkdrank kiezen (espresso, flat white, cappuccino, latte, cortado, macchiato, americano); zet dan de melkstappen in "steps" en de dranknaam in "drink".`:'';
    const prompt=`Je bent een specialty-barista. Geef een concreet zetrecept voor de methode "${m.name}" voor deze boon.\n${info}${beanPromptBlock(bean)}\n${gearPromptBlock(m.id)}${milk}${'\n'+APP_RULES+'\n'+BEAN_GRIND_RULES+'\n'+(espM?ESPRESSO_RULES:FILTER_RULES)+'\n'}Geef ALLEEN JSON terug zonder markdown: {"drink":"","dose":"","yield":"","ratio":"","grind":"","grindNote":"","temp":"","time":"","steps":["",""],"tip":""}. drink = melkdranknaam of "espresso" (leeg bij filter). grind = KORTE maalstand voor het invulveld (alleen getal/klikken of één woord, GEEN uitleg/merknaam). grindNote = korte uitleg over de maling. Houd het kort en praktisch, Nederlands. dose/yield in gram, temp in °C, ratio als 1:x.`;
    const txt=await askAI([{role:"user",content:prompt}],900,'brew');
    const d=extractJSON(txt);
    let html='<div class="recipe-card sketch" style="background:var('+m.tint+')">';
    html+='<div class="hand" style="font-size:26px">recept · '+esc(m.name)+'</div>';
    html+='<div class="rk">parameters</div>';
    html+='<div class="rstep">dose '+esc(d.dose)+' · yield '+esc(d.yield)+' · ratio '+esc(d.ratio)+'</div>';
    html+='<div class="rstep">maling '+esc(conciseGrind(d.grind))+' · '+esc(d.temp)+'° · '+esc(d.time)+'</div>';
    if(d.grindNote)html+='<div class="rstep" style="color:var(--ink-soft)">'+esc(d.grindNote)+'</div>';
    if(d.steps&&d.steps.length){html+='<div class="rk">stappen</div>';d.steps.forEach((st,i)=>html+='<div class="rstep">'+(i+1)+'. '+esc(st)+'</div>');}
    if(d.tip)html+='<div class="rk">tip</div><div class="rstep">'+esc(d.tip)+'</div>';
    window._lastRecipe=window._lastRecipe||{};window._lastRecipe[beanId]={d,methodId:m.id};
    html+='<button class="recipe-btn" onclick="useRecipe(\''+beanId+'\')">＋ use as new brew</button>';
    html+='</div>';
    if(box)box.innerHTML=html;
  }catch(e){
    if(box)box.innerHTML='<div class="recipe-card sketch soft">couldn\'t make a recipe — check your AI key in settings.</div>';
  }
}
function useRecipe(beanId){
  const r=(window._lastRecipe||{})[beanId];if(!r)return;const d=r.d;
  const esp=methodFamily(r.methodId)==='espresso';
  const gShort=conciseGrind(d.grind);
  const gNote=(d.grindNote||'').trim()||((''+(d.grind||'')).trim()!==gShort?(''+d.grind).trim():'');
  let guide='';
  if(d.steps&&d.steps.length)guide=d.steps.map((st,i)=>(i+1)+'. '+st).join('\n');
  if(gNote)guide=(guide?guide+'\n\n':'')+'maling: '+gNote;
  if(d.tip)guide=(guide?guide+'\n':'')+'💡 tip: '+d.tip;
  pendingTarget={dose:numOf(d.dose),grind:gShort,time:cleanTime(d.time),yield:numOf(d.yield)};
  const drink=(d.drink||'').trim();
  pendingRecipe={guide,drink,title:(d.title||'').trim()};
  formBean=beanId;
  if(esp){
    beginBrew(r.methodId);pendingTarget={dose:numOf(d.dose),grind:gShort,time:cleanTime(d.time),yield:numOf(d.yield)};
    formBean=beanId;pendingRecipe={guide,drink,title:(d.title||'').trim()};
    setTimeout(()=>{setVal('di-dose',numOf(d.dose));setVal('di-yield',numOf(d.yield));renderDialIn();toast('✓ '+(drink||'espresso')+' — measure your shot & save');},30);
    return;
  }
  openForm(r.methodId);setTimeout(()=>{
    pickBean(beanId);
    setText('f-dose',numOf(d.dose));setText('f-yield',numOf(d.yield));
    if(d.ratio){const r2=(''+d.ratio).split(':').pop();setText('f-ratio',numOf(r2));}
    setText('f-time',cleanTime(d.time));setText('f-temp',numOf(d.temp));
    if(gShort)setText('f-grind',gShort);
    pendingTarget={dose:numOf(d.dose),grind:gShort,time:cleanTime(d.time),yield:numOf(d.yield)};
    renderDialInHint();
    toast('✓ recipe applied');
  },30);
}

