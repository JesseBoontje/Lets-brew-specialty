// Stap 2: profiel, volgen, feed, likes, blokkeren, foto's. Nep-D1 op node:sqlite en
// nep-R2 in geheugen; gebruikers en sessies zetten we hier rechtstreeks in de tabel.
import test from 'node:test';
import assert from 'node:assert/strict';
import {socialRoute,deelVorm,DEEL_VELDEN} from '../social-worker.mjs';
import {accountRoute} from '../account-worker.mjs';
import site from '../site-worker.mjs';
import {nepD1} from './nep-d1.mjs';
import {nepR2} from './nep-r2.mjs';

const ORIGIN='https://letsbrew.djez.app';
const omgeving=()=>({DB:nepD1(),FOTOS:nepR2()});
const hex=async t=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,'0')).join('');
let teller=0;
async function gebruiker(env,handle,visibility='private'){
 const id=(handle+'_'.repeat(22)).slice(0,22).replace(/[^A-Za-z0-9_-]/g,'_');
 const token=(String(++teller)+'t'.repeat(43)).slice(0,43);
 env.DB.db.prepare('INSERT INTO users(id,handle,name,visibility,created_at) VALUES(?,?,?,?,?)').run(id,handle,handle,visibility,Date.now());
 env.DB.db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(await hex(token),id,Date.now()+864e5);
 return {id,handle,cookie:'lb_s='+token};
}
async function vraag(env,wie,method,path,body,headers={}){
 const h={Origin:ORIGIN,...headers};if(wie)h.Cookie=wie.cookie;
 if(body!==undefined&&!(body instanceof Uint8Array))h['Content-Type']='application/json';
 const r=await socialRoute(new Request(ORIGIN+path,{method,headers:h,body:body===undefined?undefined:body instanceof Uint8Array?body:JSON.stringify(body)}),env);
 const type=r.headers.get('Content-Type')||'';
 return {status:r.status,cache:r.headers.get('Cache-Control'),data:type.includes('json')?await r.json():new Uint8Array(await r.arrayBuffer()),type};
}
// records rechtstreeks, zoals sync ze zou zetten
function record(env,wie,kind,id,data,updated=Date.now()){
 env.DB.db.prepare('INSERT OR REPLACE INTO records(user_id,kind,id,data,updated_at,deleted,synced_at) VALUES(?,?,?,?,?,0,1)').run(wie.id,kind,id,JSON.stringify(data),updated);
}
const BEAN={id:'b1',name:'Kenya Nyeri',roaster:'Friedhats',origin:'Kenya',process:'washed',variety:'SL28',roast:'light',
 roasternotes:'blackcurrant, so juicy',notes:'mijn eigen geheime notitie',price:18.5,bagsize:250,url:'https://shop.example/k',roastdate:'2026-11-01',photo:null,inStock:true};
const BREW={id:'w1',method:'v60',title:'morning v60',beans:'Kenya Nyeri',beanId:'b1',dose:15,yield:250,ratio:16.7,time:'3:05',temp:93,score:8.5,
 tags:['blackcurrant','juicy'],notes:'te snel, volgende keer fijner',grind:'22 clicks',grinder:'Comandante',custom:[{k:'water',v:'tap'}],
 beanSnapshot:{id:'b1',name:'Kenya Nyeri',roaster:'Friedhats',origin:'Kenya',process:'washed',roastdate:'2026-11-01',price:18.5},ts:1764150000000};

test('allowlist: alleen gedeelde velden, privé eruit (price, notes, url, grind, wishlist...)',()=>{
 assert.deepEqual(Object.keys(DEEL_VELDEN.bean).sort(),['name','origin','process','roast','roaster','roasternotes','variety']);
 assert.deepEqual(Object.keys(DEEL_VELDEN.brew).sort(),['beans','brewer','dose','drink','method','ratio','score','tags','temp','time','title','ts','yield']);
 const b=deelVorm('bean',BEAN),w=deelVorm('brew',BREW);
 for(const k of ['notes','price','bagsize','url','roastdate','photo','inStock','id'])assert.equal(k in b,false,k);
 for(const k of ['notes','grind','grinder','custom','beanId','beanSnapshot','target','prep'])assert.equal(k in w,false,k);
 assert.deepEqual(w.bean,{roaster:'Friedhats',origin:'Kenya',process:'washed'});
 assert.equal(b.roasternotes,'blackcurrant, so juicy');assert.equal(w.score,8.5);assert.deepEqual(w.tags,['blackcurrant','juicy']);
 assert.equal(JSON.stringify(w).includes('geheim')||JSON.stringify(w).includes('fijner')||JSON.stringify(b).includes('geheim'),false);
 assert.equal(deelVorm('gear',{name:'x'}),null);assert.equal(deelVorm('recipe',{naam:'x'}),null);
 // vreemde types worden null, lange tekst ingekort
 const raar=deelVorm('bean',{name:{x:1},roaster:'a'.repeat(500),origin:42});
 assert.equal(raar.name,null);assert.equal(raar.roaster.length,80);assert.equal(raar.origin,null);
});

test('volgen: public meteen accepted, private eerst pending; accept, decline, ontvolgen, volger weg',async()=>{
 const env=omgeving();
 const jesse=await gebruiker(env,'jesse'),sanne=await gebruiker(env,'sanne','public'),piet=await gebruiker(env,'piet');
 assert.equal((await vraag(env,jesse,'POST','/api/social/follow',{handle:'sanne'})).data.status,'accepted');
 assert.equal((await vraag(env,sanne,'POST','/api/social/follow',{handle:'@Jesse'})).data.status,'pending');
 assert.equal((await vraag(env,piet,'POST','/api/social/follow',{handle:'jesse'})).data.status,'pending');
 let me=(await vraag(env,jesse,'GET','/api/social/me')).data;
 assert.deepEqual(me.requests.map(x=>x.handle).sort(),['piet','sanne']);
 assert.equal(me.profile.counts.following,1);assert.equal(me.profile.counts.followers,0);
 me=(await vraag(env,jesse,'POST','/api/social/request',{handle:'sanne',accept:true})).data;
 assert.deepEqual(me.followers.map(x=>x.handle),['sanne']);
 me=(await vraag(env,jesse,'POST','/api/social/request',{handle:'piet',accept:false})).data;
 assert.equal(me.requests.length,0);
 // volger verwijderen en zelf ontvolgen
 me=(await vraag(env,jesse,'DELETE','/api/social/follower',{handle:'sanne'})).data;
 assert.equal(me.followers.length,0);
 await vraag(env,jesse,'DELETE','/api/social/follow',{handle:'sanne'});
 assert.equal((await vraag(env,jesse,'GET','/api/social/me')).data.following.length,0);
 // jezelf of onbekenden volgen kan niet
 assert.equal((await vraag(env,jesse,'POST','/api/social/follow',{handle:'jesse'})).status,404);
 assert.equal((await vraag(env,jesse,'POST','/api/social/follow',{handle:'niemand'})).status,404);
 // private -> public zet wachtende verzoeken op accepted
 await vraag(env,piet,'POST','/api/social/follow',{handle:'jesse'});
 me=(await vraag(env,jesse,'POST','/api/social/profile',{visibility:'public',name:'Jesse B'})).data;
 assert.equal(me.profile.visibility,'public');assert.equal(me.profile.name,'Jesse B');assert.deepEqual(me.followers.map(x=>x.handle),['piet']);
 assert.equal((await vraag(env,jesse,'POST','/api/social/profile',{visibility:'iedereen'})).status,400);
});

test('zichtrechten: private, pending, accepted, public en block; profiel en items',async()=>{
 const env=omgeving();
 const jesse=await gebruiker(env,'jesse'),sanne=await gebruiker(env,'sanne'),open=await gebruiker(env,'open_bar','public');
 record(env,sanne,'bean','b1',BEAN);record(env,sanne,'brew','w1',BREW);
 record(env,sanne,'brew','d1',{...BREW,id:'d1',dialIn:true,kind:'dial-in'});
 record(env,sanne,'gear','g1',{id:'g1',name:'Comandante'});record(env,sanne,'recipe','r1',{id:'r1',naam:'geheim'});
 record(env,open,'bean','o1',{...BEAN,id:'o1',name:'Open bean'});
 // private, niet gevolgd: profiel zichtbaar, items niet
 let p=(await vraag(env,jesse,'GET','/api/social/u/sanne')).data;
 assert.equal(p.profile.canView,false);assert.equal(p.items.length,0);assert.equal(p.profile.counts,null);assert.equal(p.profile.handle,'sanne');
 assert.equal((await vraag(env,jesse,'GET','/api/social/u/sanne/items')).status,403);
 // pending: nog steeds niet
 await vraag(env,jesse,'POST','/api/social/follow',{handle:'sanne'});
 p=(await vraag(env,jesse,'GET','/api/social/u/sanne')).data;
 assert.equal(p.profile.status,'pending');assert.equal(p.profile.canView,false);
 // accepted: brews en beans, geen dial-in, gear of recepten, geen privévelden
 await vraag(env,sanne,'POST','/api/social/request',{handle:'jesse',accept:true});
 p=(await vraag(env,jesse,'GET','/api/social/u/sanne')).data;
 assert.equal(p.profile.canView,true);assert.equal(p.profile.counts.brews,1);assert.equal(p.profile.counts.beans,1);
 // een dial-in-poging is niet te liken
 assert.equal((await vraag(env,jesse,'POST','/api/social/like',{handle:'sanne',kind:'brew',id:'d1'})).status,404);
 assert.equal((await vraag(env,jesse,'POST','/api/social/like',{handle:'sanne',kind:'brew',id:'w1'})).status,200);
 assert.deepEqual(p.items.map(i=>i.kind+'/'+i.id).sort(),['bean/b1','brew/w1']);
 const tekst=JSON.stringify(p);
 for(const s of ['geheim','fijner','18.5','shop.example','Comandante','22 clicks'])assert.equal(tekst.includes(s),false,s);
 // public: iedereen die ingelogd is ziet items, ook zonder te volgen
 p=(await vraag(env,jesse,'GET','/api/social/u/open_bar')).data;
 assert.equal(p.profile.canView,true);assert.equal(p.items[0].data.name,'Open bean');
 // zonder sessie niets
 assert.equal((await vraag(env,null,'GET','/api/social/u/open_bar')).status,401);
 // block: over en weer onzichtbaar, volgen verbroken
 await vraag(env,sanne,'POST','/api/social/block',{handle:'jesse'});
 assert.equal((await vraag(env,jesse,'GET','/api/social/u/sanne')).status,404);
 assert.equal((await vraag(env,sanne,'GET','/api/social/u/jesse')).status,404);
 assert.equal(env.DB.db.prepare('SELECT COUNT(*) n FROM follows').get().n,0);
 assert.equal((await vraag(env,jesse,'POST','/api/social/follow',{handle:'sanne'})).status,404);
 assert.equal((await vraag(env,jesse,'GET','/api/social/search?q=san')).data.results.length,0);
 assert.equal((await vraag(env,sanne,'GET','/api/social/search?q=jes')).data.results.length,0);
 assert.deepEqual((await vraag(env,sanne,'GET','/api/social/me')).data.blocked.map(x=>x.handle),['jesse']);
 // deblokkeren: weer te vinden, maar volgen moet opnieuw
 await vraag(env,sanne,'DELETE','/api/social/block',{handle:'jesse'});
 assert.equal((await vraag(env,jesse,'GET','/api/social/u/sanne')).data.profile.status,null);
});

test('zoeken: exact of begin, max 20, jezelf niet, LIKE-tekens tellen niet',async()=>{
 const env=omgeving();
 const ik=await gebruiker(env,'jesse');
 for(let i=0;i<25;i++)await gebruiker(env,'brewer'+String(i).padStart(2,'0'));
 await gebruiker(env,'brew');await gebruiker(env,'abrew');
 let r=(await vraag(env,ik,'GET','/api/social/search?q=brew')).data.results;
 assert.equal(r.length,20);assert.equal(r[0].handle,'brew');assert.ok(r.every(x=>x.handle.startsWith('brew')));
 assert.equal((await vraag(env,ik,'GET','/api/social/search?q=jesse')).data.results.length,0);
 assert.equal((await vraag(env,ik,'GET','/api/social/search?q=%25')).data.results.length,0);
 r=(await vraag(env,ik,'GET','/api/social/search?q=@BREWER0')).data.results;
 assert.equal(r.length,10);
});

test('feed: alleen accepted, nieuwste eerst, cursor zonder gaten of dubbelen, likes',async()=>{
 const env=omgeving();
 const ik=await gebruiker(env,'jesse'),a=await gebruiker(env,'anna','public'),b=await gebruiker(env,'bram'),c=await gebruiker(env,'cor','public');
 const t0=1764000000000;
 for(let i=0;i<14;i++)record(env,a,'brew','a'+i,{...BREW,id:'a'+i,title:'anna '+i},t0+i*1000);
 for(let i=0;i<9;i++)record(env,b,'bean','b'+i,{...BEAN,id:'b'+i,name:'bram '+i},t0+i*1000+500);
 record(env,b,'brew','same',{...BREW,id:'same'},t0+3000); // zelfde tijd als a3
 record(env,c,'bean','c0',{...BEAN,id:'c0'},t0+99999); // niet gevolgd
 record(env,a,'brew','dial',{...BREW,id:'dial',dialIn:true},t0+50000);
 await vraag(env,ik,'POST','/api/social/follow',{handle:'anna'});
 await vraag(env,ik,'POST','/api/social/follow',{handle:'bram'}); // pending
 let f=(await vraag(env,ik,'GET','/api/social/feed')).data;
 assert.equal(f.items.length,10);assert.ok(f.items.every(i=>i.owner.handle==='anna'));
 await vraag(env,b,'POST','/api/social/request',{handle:'jesse',accept:true});
 const alles=[];let cursor=null,rondes=0;
 do{f=(await vraag(env,ik,'GET','/api/social/feed'+(cursor?'?cursor='+cursor:''))).data;alles.push(...f.items);cursor=f.next;rondes++;}while(cursor&&rondes<10);
 assert.equal(alles.length,14+9+1);assert.equal(rondes,3);
 assert.equal(new Set(alles.map(i=>i.owner.handle+'/'+i.id)).size,alles.length);
 const tijden=alles.map(i=>env.DB.db.prepare('SELECT updated_at FROM records WHERE id=?').get(i.id).updated_at);
 assert.deepEqual(tijden,[...tijden].sort((x,y)=>y-x));
 assert.equal(alles.some(i=>i.id==='c0'||i.id==='dial'),false);
 assert.equal((await vraag(env,ik,'GET','/api/social/feed?cursor=!!kapot')).status,400);
 // like + teller; geen like op iets wat je niet mag zien
 let l=(await vraag(env,ik,'POST','/api/social/like',{handle:'anna',kind:'brew',id:'a13'})).data;
 assert.deepEqual(l,{liked:true,likes:1});
 l=(await vraag(env,ik,'POST','/api/social/like',{handle:'anna',kind:'brew',id:'a13'})).data;assert.equal(l.likes,1);
 f=(await vraag(env,ik,'GET','/api/social/feed')).data;
 const a13=f.items.find(i=>i.id==='a13');assert.equal(a13.likes,1);assert.equal(a13.liked,true);
 const vreemd=await gebruiker(env,'vreemd');
 assert.equal((await vraag(env,vreemd,'POST','/api/social/like',{handle:'bram',kind:'bean',id:'b1'})).status,404);
 assert.equal((await vraag(env,ik,'POST','/api/social/like',{handle:'anna',kind:'gear',id:'a1'})).status,404);
 l=(await vraag(env,ik,'DELETE','/api/social/like',{handle:'anna',kind:'brew',id:'a13'})).data;assert.deepEqual(l,{liked:false,likes:0});
 // block haalt een account uit de feed en wist likes
 await vraag(env,ik,'POST','/api/social/like',{handle:'bram',kind:'bean',id:'b8'});
 await vraag(env,ik,'POST','/api/social/block',{handle:'bram'});
 f=(await vraag(env,ik,'GET','/api/social/feed')).data;
 assert.equal(f.items.some(i=>i.owner.handle==='bram'),false);
 assert.equal(env.DB.db.prepare("SELECT COUNT(*) n FROM likes WHERE owner_id=?").get(b.id).n,0);
});

const JPEG=Uint8Array.from([0xff,0xd8,0xff,0xe0,1,2,3,4,5,6,7,8]);
test('fotos: alleen eigenaar uploadt, jpeg/webp, max 1 MB; ophalen met de rechten van het record; wissen ruimt op',async()=>{
 const env=omgeving();
 const sanne=await gebruiker(env,'sanne'),jesse=await gebruiker(env,'jesse'),piet=await gebruiker(env,'piet');
 record(env,sanne,'bean','b1',BEAN);
 const op=(wie,body,type='image/jpeg',q='?kind=bean&id=b1')=>vraag(env,wie,'POST','/api/foto'+q,body,{'Content-Type':type});
 assert.equal((await op(sanne,JPEG,'image/png')).status,415);
 assert.equal((await op(sanne,Uint8Array.from([1,2,3,4]))).status,415);
 assert.equal((await op(sanne,new Uint8Array(1024*1024+10).fill(0xff))).status,413);
 assert.equal((await op(sanne,JPEG,'image/jpeg','?kind=gear&id=b1')).status,400);
 assert.equal((await op(jesse,JPEG)).status,404); // jesse heeft geen record b1
 assert.equal((await vraag(env,sanne,'POST','/api/foto?kind=bean&id=b1',JPEG,{'Content-Type':'image/jpeg',Origin:'https://evil.example'})).status,403);
 const eerste=(await op(sanne,JPEG)).data;
 assert.match(eerste.key,/^[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{22}$/);assert.ok(eerste.key.startsWith(sanne.id+'.'));
 const tweede=(await op(sanne,JPEG)).data;
 assert.equal(env.FOTOS.m.has('foto/'+eerste.key),false);assert.equal(env.FOTOS.m.has('foto/'+tweede.key),true);
 // eigenaar ziet hem; een ander pas als volger; het item draagt de url
 let r=await vraag(env,sanne,'GET',tweede.url);
 assert.equal(r.status,200);assert.equal(r.type,'image/jpeg');assert.equal(r.cache,'private, no-store');assert.deepEqual([...r.data],[...JPEG]);
 assert.equal((await vraag(env,jesse,'GET',tweede.url)).status,404);
 assert.equal((await vraag(env,jesse,'GET','/api/foto/'+eerste.key)).status,404);
 await vraag(env,jesse,'POST','/api/social/follow',{handle:'sanne'});
 assert.equal((await vraag(env,jesse,'GET',tweede.url)).status,404); // pending
 await vraag(env,sanne,'POST','/api/social/request',{handle:'jesse',accept:true});
 assert.equal((await vraag(env,jesse,'GET',tweede.url)).status,200);
 assert.equal((await vraag(env,jesse,'GET','/api/social/feed')).data.items[0].photo,tweede.url);
 assert.equal((await vraag(env,piet,'GET',tweede.url)).status,404);
 await vraag(env,sanne,'POST','/api/social/block',{handle:'jesse'});
 assert.equal((await vraag(env,jesse,'GET',tweede.url)).status,404);
 // foto weghalen door de eigenaar
 await vraag(env,sanne,'DELETE','/api/foto?kind=bean&id=b1');
 assert.equal(env.FOTOS.m.size,0);
 // gewist via sync: foto ook weg
 const derde=(await op(sanne,JPEG)).data;assert.ok(env.FOTOS.m.has('foto/'+derde.key));
 const s=await accountRoute(new Request(ORIGIN+'/api/sync',{method:'POST',headers:{Origin:ORIGIN,'Content-Type':'application/json',Cookie:sanne.cookie},body:JSON.stringify({since:0,changes:[{kind:'bean',id:'b1',updatedAt:Date.now()+1000,deleted:true}]})}),env);
 assert.equal(s.status,200);assert.equal(env.FOTOS.m.size,0);
 assert.equal(env.DB.db.prepare("SELECT photo_key FROM records WHERE id='b1'").get().photo_key,null);
 // account wissen: alle foto's van die gebruiker weg
 record(env,sanne,'bean','b2',{...BEAN,id:'b2'});await op(sanne,JPEG,'image/jpeg','?kind=bean&id=b2');
 const webp=Uint8Array.from([...new TextEncoder().encode('RIFF'),0,0,0,0,...new TextEncoder().encode('WEBP'),1,2]);
 record(env,jesse,'bean','j1',{...BEAN,id:'j1'});
 assert.equal((await vraag(env,jesse,'POST','/api/foto?kind=bean&id=j1',webp,{'Content-Type':'image/webp'})).status,200);
 await accountRoute(new Request(ORIGIN+'/api/account',{method:'DELETE',headers:{Origin:ORIGIN,Cookie:sanne.cookie}}),env);
 assert.equal(env.FOTOS.m.size,1);
});

test('melden en origin; routering via site-worker; rate limit met eigen voorvoegsel',async()=>{
 const env=omgeving();
 const jesse=await gebruiker(env,'jesse'),sanne=await gebruiker(env,'sanne');
 assert.equal((await vraag(env,jesse,'POST','/api/social/report',{handle:'sanne',reason:'spam spam'})).status,200);
 const rep=env.DB.db.prepare('SELECT by_user,about_user,reason FROM reports').get();
 assert.deepEqual({...rep},{by_user:jesse.id,about_user:sanne.id,reason:'spam spam'});
 assert.equal((await vraag(env,jesse,'POST','/api/social/follow',{handle:'sanne'},{Origin:'https://evil.example'})).status,403);
 const zonderJson=await socialRoute(new Request(ORIGIN+'/api/social/follow',{method:'POST',headers:{Origin:ORIGIN,Cookie:jesse.cookie,'Content-Type':'text/plain'},body:'{}'}),env);
 assert.equal(zonderJson.status,415);
 assert.equal((await vraag(env,jesse,'GET','/api/social/follow')).status,405);
 assert.equal((await vraag(env,jesse,'POST','/api/social/u/sanne',{})).status,405);
 const sleutels=[];
 env.STEM_LIMITER={limit:async({key})=>{sleutels.push(key);return {success:sleutels.length<3};}};
 assert.equal((await vraag(env,jesse,'GET','/api/social/search?q=san')).status,200);
 assert.equal((await vraag(env,jesse,'POST','/api/social/follow',{handle:'sanne'})).status,200);
 assert.equal((await vraag(env,jesse,'POST','/api/social/like',{handle:'sanne',kind:'bean',id:'x'})).status,429);
 assert.deepEqual(sleutels,['social:zoek:'+jesse.id,'social:volg:'+jesse.id,'social:like:'+jesse.id]);
 const viaSite=await site.fetch(new Request(ORIGIN+'/api/social/me',{headers:{Cookie:jesse.cookie}}),env);
 assert.equal(viaSite.status,200);assert.equal((await viaSite.json()).profile.handle,'jesse');
 assert.equal((await site.fetch(new Request(ORIGIN+'/api/foto/abc'),{DB:env.DB})).status,503);
});
