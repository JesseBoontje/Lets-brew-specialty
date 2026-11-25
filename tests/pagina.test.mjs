import test from 'node:test';
import assert from 'node:assert/strict';
import {paginaRoute} from '../site-worker.mjs';
const o='https://letsbrew.djez.app';
const vraag=(u,method='GET',site='same-origin')=>new Request(o+'/api/pagina?url='+encodeURIComponent(u),{method,headers:{'Sec-Fetch-Site':site}});
const met=async(nep,fn)=>{const x=globalThis.fetch;globalThis.fetch=nep;try{return await fn();}finally{globalThis.fetch=x;}};
test('pagina: alleen gewone webadressen, nooit eigen netwerk',async()=>{
 let n=0;
 await met(async()=>{n++;return new Response('x');},async()=>{
  for(const u of ['ftp://a.nl/x','http://localhost/x','http://127.0.0.1/x','http://10.0.0.1/x','http://a.local/x','https://u:p@roaster.nl/','https://roaster.nl:8443/','geen link'])
   assert.equal((await paginaRoute(vraag(u))).status,400,u);
  assert.equal((await paginaRoute(vraag('https://roaster.nl/','POST'))).status,405);
 });
 assert.equal(n,0);
});
test('pagina: haalt de tekst eruit zonder scripts',async()=>{
 const html='<html><head><title>Finca Los Angeles</title><meta property="og:description" content="Natural Pacamara"><script>steel()</script></head><body><h1>El Salvador</h1><p>Melon, green grapes &amp; cane sugar</p></body></html>';
 const r=await met(async()=>new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8'}}),()=>paginaRoute(vraag('https://singleestatecoffee.nl/el-salvador')));
 assert.equal(r.status,200);
 const d=await r.json();
 assert.equal(d.titel,'Finca Los Angeles');assert.equal(d.beschrijving,'Natural Pacamara');
 assert.match(d.tekst,/El Salvador/);assert.match(d.tekst,/green grapes & cane sugar/);assert.doesNotMatch(d.tekst,/steel/);
});
test('pagina: alleen vanuit de app, en een doorverwijzing naar binnen wordt geweigerd',async()=>{
 let n=0;
 await met(async()=>{n++;return new Response('x');},async()=>{
  assert.equal((await paginaRoute(vraag('https://roaster.nl/','GET','cross-site'))).status,403);
 });
 assert.equal(n,0);
 const r=await met(async()=>new Response(null,{status:302,headers:{Location:'http://127.0.0.1/admin'}}),()=>paginaRoute(vraag('https://roaster.nl/x')));
 assert.equal(r.status,400);
 let teller=0;
 const r2=await met(async()=>{teller++;return new Response(null,{status:301,headers:{Location:'https://roaster.nl/'+teller}});},()=>paginaRoute(vraag('https://roaster.nl/0')));
 assert.equal(r2.status,502);assert.equal(teller,4);
});
