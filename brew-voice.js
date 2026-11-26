'use strict';
globalThis.BrewVoice=(()=>{
 let peer=null,channel=null,stream=null,audio=null,timer=null,starting=false,turn=0,seen=new Set(),pendingCalls=Promise.resolve();
 const status=text=>{document.getElementById('ws-voice-status').textContent=text;};
 function send(event){if(channel?.readyState==='open')channel.send(JSON.stringify(event));}
 function stop(message='Conversation stopped. Microphone off.'){
  // alleen een melding als er echt iets liep; weggaan van het scherm zonder gesprek zegt niets
  const liep=!!(peer||stream||starting||channel);
  turn++;clearTimeout(timer);timer=null;channel?.close();channel=null;
  if(peer){peer.onconnectionstatechange=null;peer.close();peer=null;}
  stream?.getTracks().forEach(t=>t.stop());stream=null;
  if(audio){audio.pause();audio.srcObject=null;audio.remove();audio=null;}
  starting=false;seen.clear();document.getElementById('ws-voice-start').disabled=false;document.getElementById('ws-voice-stop').disabled=true;status(liep?message:'');
 }
 async function tool(event,ownTurn){if(ownTurn!==turn)return;
  if(seen.has(event.call_id))return false;seen.add(event.call_id);if(seen.size>100){stop('Conversation finished. Start a new one for more questions.');return;}
  let output;try{if(typeof event.arguments!=='string'||event.arguments.length>20000)throw Error('Ongeldige functieaanvraag.');const args=JSON.parse(event.arguments);output=await BrewWorkspace.voiceTool(event.name,args);}catch{output={error:'Dit voorstel of deze contextaanvraag is ongeldig. Vraag de gebruiker om de juiste gegevens.'};}
  if(ownTurn!==turn)return;send({type:'conversation.item.create',item:{type:'function_call_output',call_id:event.call_id,output:JSON.stringify(output)}});return true;
 }
 function eventMessage(event){let e;try{if(event.data.length>100000)return;e=JSON.parse(event.data);}catch{return;}
  // Wait for the completed response before returning tools. Batch multiple
  // results into one continuation to avoid overlapping paid responses.
  if(e.type==='response.done'&&e.response?.status!=='cancelled'){
   const calls=(e.response?.output||[]).filter(item=>item.type==='function_call');
   if(calls.length){const ownTurn=turn;pendingCalls=pendingCalls.catch(()=>{}).then(async()=>{let returned=false;for(const call of calls)if(await tool(call,ownTurn))returned=true;if(returned&&ownTurn===turn)send({type:'response.create'});});}
  }
  if(['response.output_audio_transcript.delta','response.audio_transcript.delta'].includes(e.type)){const out=document.getElementById('ws-voice-output');out.textContent=(out.textContent+(e.delta||'')).slice(-16000);}
  if(['response.output_audio_transcript.done','response.audio_transcript.done'].includes(e.type))document.getElementById('ws-voice-output').textContent+='\n';
  if(e.type==='error')status('The voice model could not do this step. Check your connection and model access.');
 }
 async function start(){
  if(starting||peer)return;const key=getKey('openai');
  if(!aiEnabled()||!key){setAiProv('openai');go('profile');renderProfile();setToon('ai-card');toast('Talk live uses your own OpenAI API key.');return;}
  if(!isSecureContext||!navigator.mediaDevices?.getUserMedia||!globalThis.RTCPeerConnection){status('Talk live needs HTTPS, microphone access and a browser with WebRTC. You can still type below.');return;}
  if(!confirm('Talk live uses your own OpenAI API credit. Your voice and the chosen coffee context go to OpenAI. The conversation stops after 10 minutes at most. Start?'))return;
  starting=true;const ownTurn=++turn;document.getElementById('ws-voice-start').disabled=true;document.getElementById('ws-voice-stop').disabled=false;status('Starting the microphone and a secure voice session…');
  try{
   const mic=await navigator.mediaDevices.getUserMedia({audio:true});if(ownTurn!==turn){mic.getTracks().forEach(t=>t.stop());return;}stream=mic;
   const response=await fetch('/api/realtime/session',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({model:localStorage.getItem('scc_voice_model')||'gpt-realtime'}),signal:AbortSignal.timeout(25000)});
   if(!response.ok){if(response.status===404)throw Error('Talk live is not installed on this host yet. Typed advice still works.');const body=await response.json().catch(()=>null);throw Error(body?.error||'The voice session could not be started.');}
   const token=await response.json();if(ownTurn!==turn)return;if(typeof token.value!=='string')throw Error('No valid temporary voice key was received.');
   peer=new RTCPeerConnection();audio=document.createElement('audio');audio.autoplay=true;audio.setAttribute('playsinline','');document.querySelector('#page-assistant .screen').append(audio);peer.ontrack=e=>{if(audio){audio.srcObject=e.streams[0];audio.play().catch(()=>{if(audio){audio.controls=true;status('Tap play to hear the voice.');}});}};
   peer.onconnectionstatechange=()=>{if(peer?.connectionState==='connected')status('Conversation on. Ask about your beans, brew ideas or your last result.');if(['failed','disconnected','closed'].includes(peer?.connectionState))stop('Connection lost. Microphone off.');};
   for(const track of stream.getTracks())peer.addTrack(track,stream);
   channel=peer.createDataChannel('oai-events');channel.addEventListener('message',eventMessage);channel.addEventListener('open',()=>{send({type:'conversation.item.create',item:{type:'message',role:'user',content:[{type:'input_text',text:'Begin met get_coffee_context. Vraag daarna kort waarmee je kunt helpen.'}]}});send({type:'response.create'});});
   const offer=await peer.createOffer();await peer.setLocalDescription(offer);
   const answer=await fetch('https://api.openai.com/v1/realtime/calls',{method:'POST',headers:{Authorization:'Bearer '+token.value,'Content-Type':'application/sdp'},body:offer.sdp,signal:AbortSignal.timeout(20000)});
   if(!answer.ok)throw Error('OpenAI could not open the audio connection. Check model access and API credit.');if(ownTurn!==turn)return;
   await peer.setRemoteDescription({type:'answer',sdp:await answer.text()});timer=setTimeout(()=>stop('The 10 minutes are up. Microphone off.'),10*60*1000);
   status('Audio connected. Go ahead and talk; tap Stop talking to finish.');
  }catch(e){if(ownTurn===turn)stop(e.message||'Talk live is not available.');}finally{if(ownTurn===turn)starting=false;}
 }
 window.addEventListener('pagehide',()=>stop());document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&(peer||starting))stop('App in the background. Microphone off.');});
 return{start,stop};
})();
