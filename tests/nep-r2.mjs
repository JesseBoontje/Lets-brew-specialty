// Nep-R2 in geheugen voor tests: put/get/delete zoals de Workers-binding.
export function nepR2(){
 const m=new Map();
 return {m,
  async put(key,value,opts={}){const b=value instanceof Uint8Array?value:new Uint8Array(await new Response(value).arrayBuffer());m.set(key,{b:b.slice(),httpMetadata:opts.httpMetadata||{}});return {key};},
  async get(key){const o=m.get(key);if(!o)return null;return {body:new Blob([o.b]).stream(),httpMetadata:o.httpMetadata,arrayBuffer:async()=>o.b.buffer.slice(0)};},
  async delete(keys){for(const k of [].concat(keys))m.delete(k);}
 };
}
