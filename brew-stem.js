'use strict';
/* Stem voor "stappen hardop" (gietcoach, AeroPress-coach, shot clock).
   - Met een eigen ElevenLabs-sleutel én een gekozen stem uit de eigen
     voices-lijst: geluid van ElevenLabs (model eleven_v4) via de Worker.
   - Anders, of als iets misgaat: de stem van de telefoon (speechSynthesis).
   De sleutel staat alleen in dit tabblad (een variabele), nooit in
   localStorage, back-up, export of database. De gekozen stem-id (geen geheim)
   staat in localStorage onder scc_el_voice.                                  */
globalThis.BrewStem=(()=>{
 let sleutel='';                 // alleen in het geheugen van dit tabblad
 let afgewezen=false;            // ElevenLabs gaf 401: niet blijven proberen
 let audio=null,ontgrendeld=false,beurt=0,huidigeUrl='';
 const cache=new Map();          // tekst|stem -> Promise<blob-url>
 const MAX_CACHE=60;
 const TE_LAAT=1500;              // ms
 let wachtrij=Promise.resolve();
 let stemNL=null;

 const stemId=()=>{try{const v=localStorage.getItem('scc_el_voice')||'';return /^[A-Za-z0-9]{10,40}$/.test(v)?v:'';}catch(e){return '';}};
 const stemNaam=()=>{try{return (localStorage.getItem('scc_el_voice_naam')||'').slice(0,60);}catch(e){return '';}};
 const actief=()=>!!sleutel&&!!stemId()&&!afgewezen;

 /* ---- telefoonstem ---- */
 function kiesStem(){
  try{const vs=speechSynthesis.getVoices()||[];stemNL=vs.find(v=>/^nl[-_]NL/i.test(v.lang))||vs.find(v=>/^nl/i.test(v.lang))||null;}catch(e){stemNL=null;}
 }
 if(globalThis.speechSynthesis){try{speechSynthesis.addEventListener('voiceschanged',kiesStem);}catch(e){}}
 function telefoon(tekst){
  try{
   const ss=globalThis.speechSynthesis;if(!ss)return;
   ss.cancel();
   const u=new SpeechSynthesisUtterance(tekst);
   u.lang='nl-NL';if(!stemNL)kiesStem();if(stemNL)u.voice=stemNL;
   ss.speak(u);
  }catch(e){}
 }

 /* ---- ElevenLabs ---- */
 // een stil stukje geluid als blob: speelt in de tik zelf, daarna mag een iPhone dit audio-element later afspelen
 function stilteUrl(){
  const n=800,b=new ArrayBuffer(44+n),d=new DataView(b);
  const w=(o,s)=>{for(let i=0;i<s.length;i++)d.setUint8(o+i,s.charCodeAt(i));};
  w(0,'RIFF');d.setUint32(4,36+n,true);w(8,'WAVE');w(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,1,true);
  d.setUint32(24,8000,true);d.setUint32(28,8000,true);d.setUint16(32,1,true);d.setUint16(34,8,true);w(36,'data');d.setUint32(40,n,true);
  for(let i=0;i<n;i++)d.setUint8(44+i,128);
  return URL.createObjectURL(new Blob([b],{type:'audio/wav'}));
 }
 function element(){
  if(!audio){audio=new Audio();audio.setAttribute('playsinline','');audio.preload='auto';}
  return audio;
 }
 function ontgrendel(){
  if(ontgrendeld||!actief())return;
  try{const a=element();a.src=stilteUrl();const p=a.play();ontgrendeld=true;if(p&&p.catch)p.catch(()=>{ontgrendeld=false;});}catch(e){}
  // ook de telefoonstem in dezelfde tik wakker maken, voor als ElevenLabs straks niet antwoordt
  try{if(globalThis.speechSynthesis){const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}}catch(e){}
 }
 async function haal(tekst){
  const r=await fetch('/api/stem/zeg',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+sleutel},
   body:JSON.stringify({text:tekst,voice_id:stemId()}),signal:AbortSignal.timeout(8000)});
  if(r.status===401){afgewezen=true;try{if(typeof toast==='function')toast('ElevenLabs refused your key — using the phone voice');}catch(e){}}
  if(!r.ok)throw Error('stem '+r.status);
  if(!/^audio\//i.test(r.headers.get('Content-Type')||''))throw Error('geen geluid');
  const blob=await r.blob();
  if(!blob.size||blob.size>2000000)throw Error('geluid');
  return URL.createObjectURL(blob);
 }
 function geluidVoor(tekst){
  const k=stemId()+'|'+tekst;
  if(cache.has(k))return cache.get(k);
  // één verzoek tegelijk: zo blijft de rem in de Worker heel
  const p=wachtrij.catch(()=>{}).then(()=>haal(tekst));
  wachtrij=p.catch(()=>{});
  p.catch(()=>{if(cache.get(k)===p)cache.delete(k);});
  cache.set(k,p);
  if(cache.size>MAX_CACHE){
   const oud=cache.keys().next().value,po=cache.get(oud);cache.delete(oud);
   po.then(u=>{if(u!==huidigeUrl)URL.revokeObjectURL(u);}).catch(()=>{});
  }
  return p;
 }
 function stopAudio(){if(audio){try{audio.pause();}catch(e){}}}

 /* ---- wat de coaches gebruiken ---- */
 function zeg(tekst){
  tekst=String(tekst||'').trim().slice(0,300);
  if(!tekst)return;
  const mijn=++beurt;
  try{if(globalThis.speechSynthesis)speechSynthesis.cancel();}catch(e){}
  stopAudio();
  if(!actief()){telefoon(tekst);return;}
  ontgrendel();
  // komt het geluid niet snel genoeg, dan zegt de telefoon het: een stap moet op tijd klinken
  let telaat=false;
  const klok=setTimeout(()=>{telaat=true;if(mijn===beurt)telefoon(tekst);},TE_LAAT);
  geluidVoor(tekst).then(url=>{
   clearTimeout(klok);
   if(mijn!==beurt||telaat)return;
   const a=element();huidigeUrl=url;a.src=url;
   const p=a.play();if(p&&p.catch)p.catch(()=>{if(mijn===beurt)telefoon(tekst);});
  }).catch(()=>{clearTimeout(klok);if(mijn===beurt&&!telaat)telefoon(tekst);});
 }
 // zinnen alvast ophalen, zodat "nu" ook echt op tijd klinkt
 function voorbereid(teksten){
  if(!actief())return;
  const uniek=[...new Set((teksten||[]).map(t=>String(t||'').trim().slice(0,300)).filter(Boolean))].slice(0,30);
  uniek.forEach(t=>{geluidVoor(t).catch(()=>{});});
 }
 function stil(){beurt++;try{if(globalThis.speechSynthesis)speechSynthesis.cancel();}catch(e){}stopAudio();}
 const kan=()=>actief()||('speechSynthesis' in globalThis);

 /* ---- instellingen ---- */
 function zetSleutel(v){
  v=String(v||'').trim();
  if(v&&!/^(?:sk_)?[A-Za-z0-9]{32,128}$/.test(v))return false;
  sleutel=v;afgewezen=false;ontgrendeld=false;
  return true;
 }
 async function stemmen(){
  if(!sleutel)throw Error('Paste your ElevenLabs key first.');
  const r=await fetch('/api/stem/voices',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+sleutel},body:'{}',signal:AbortSignal.timeout(15000)});
  const b=await r.json().catch(()=>null);
  if(r.status===404&&!b?.error)throw Error('The voice route is not on this host yet.');
  if(!r.ok)throw Error((b&&typeof b.error==='string'&&b.error.slice(0,160))||'Could not load your voices.');
  afgewezen=false;
  return (Array.isArray(b?.voices)?b.voices:[]).filter(v=>v&&/^[A-Za-z0-9]{10,40}$/.test(v.voice_id||''));
 }
 function kiesStemId(id,naam){
  try{
   if(!id){localStorage.removeItem('scc_el_voice');localStorage.removeItem('scc_el_voice_naam');}
   else if(/^[A-Za-z0-9]{10,40}$/.test(id)){localStorage.setItem('scc_el_voice',id);localStorage.setItem('scc_el_voice_naam',String(naam||'').slice(0,60));}
   else return false;
  }catch(e){return false;}
  return true;
 }
 const stand=()=>({sleutel:!!sleutel,stem:stemId(),naam:stemNaam(),afgewezen,actief:actief()});

 globalThis.addEventListener?.('pagehide',stil);
 return {zeg,voorbereid,stil,kan,ontgrendel,zetSleutel,stemmen,kiesStemId,stand};
})();
