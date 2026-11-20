import {mkdir,copyFile,readdir,rm} from 'node:fs/promises';
const root=new URL('../',import.meta.url),out=new URL('../dist/',import.meta.url);
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const name of await readdir(root))if(/^(index\.html|security\.js|pwa\.js|styles\.css|brew-(model|workspace|voice|stem)\.js|voice-contract\.mjs|service-worker\.js|manifest\.json|_headers|.*\.png)$/.test(name))await copyFile(new URL(name,root),new URL(name,out));
await mkdir(new URL('app/',out),{recursive:true});
for(const name of await readdir(new URL('app/',root)))if(/^[0-9]{2}-[a-z-]+\.js$/.test(name))await copyFile(new URL('app/'+name,root),new URL('app/'+name,out));
console.log('Built public app assets only; no worker source, tests or credentials.');
