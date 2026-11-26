// Nep-D1 op node:sqlite (Node 22) voor tests: prepare/bind/first/all/run en batch in één transactie.
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
const MIGRATIE=readFileSync(new URL('../migrations/0001_init.sql',import.meta.url),'utf8');
export function nepD1(){
 const db=new DatabaseSync(':memory:');db.exec(MIGRATIE);
 const conv=v=>v instanceof ArrayBuffer?new Uint8Array(v):v===undefined?null:typeof v==='boolean'?+v:v;
 const rij=r=>r?{...r}:null;
 const stmt=(sql,args=[])=>({
  bind:(...a)=>stmt(sql,a.map(conv)),
  first:async()=>rij(db.prepare(sql).get(...args)),
  all:async()=>({results:db.prepare(sql).all(...args).map(rij),meta:{}}),
  run:async()=>{const r=db.prepare(sql).run(...args);return {results:[],meta:{changes:Number(r.changes)}};},
  _exec(){if(/^\s*SELECT|RETURNING/i.test(sql))return {results:db.prepare(sql).all(...args).map(rij),meta:{}};const r=db.prepare(sql).run(...args);return {results:[],meta:{changes:Number(r.changes)}};}
 });
 return {db,prepare:sql=>stmt(sql),batch:async list=>{db.exec('BEGIN');try{const out=list.map(s=>s._exec());db.exec('COMMIT');return out;}catch(e){db.exec('ROLLBACK');throw e;}}};
}
