/* Het oude adres van Lets Brew: alleen de verhuispagina (zie wrangler.jsonc).
   De bestanden staan in public/ en worden als tekst meegebundeld. */
import html from './public/index.html';
import js from './public/verhuisd.txt';
import sw from './public/service-worker.txt';
const H={'cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer','x-frame-options':'DENY',
  'content-security-policy':"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'strict-transport-security':'max-age=31536000'};
export default {
  async fetch(request){
    if(request.method!=='GET'&&request.method!=='HEAD')return new Response('method not allowed',{status:405,headers:H});
    const p=new URL(request.url).pathname;
    if(p==='/verhuisd.js')return new Response(js,{headers:{...H,'content-type':'text/javascript; charset=utf-8'}});
    // de oude app registreerde /service-worker.js (en ./service-worker.js): dit bestand ruimt hem op
    if(p==='/service-worker.js'||p==='/sw.js')return new Response(sw,{headers:{...H,'content-type':'text/javascript; charset=utf-8'}});
    return new Response(html,{headers:{...H,'content-type':'text/html; charset=utf-8'}});
  }
};
