const CACHE='einhornwelt-v1';
const FILES=['./','./index.html','./three.min.js','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{ try{ const copy=res.clone(); if(res.ok && new URL(e.request.url).origin===location.origin) caches.open(CACHE).then(c=>c.put(e.request,copy)); }catch(_){ } return res; }).catch(()=>caches.match('./index.html')))); });
