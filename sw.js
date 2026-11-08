// Einhorn-Blockwelt Service Worker – network-first für die Seite, cache-first für große statische Dateien
const CACHE='einhornwelt-v20261108s';
const STATIC=['./three.min.js','./postfx.js','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./art/kap1.svg','./art/kap2.svg','./art/kap3.svg','./art/kap4.svg','./art/kap5.svg','./art/kap6.svg','./art/finale.svg','./art/nacht.svg'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC.concat(['./index.html','./']))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const req=e.request; if(req.method!=='GET') return; const url=new URL(req.url); if(url.origin!==location.origin) return;
  const isPage = req.mode==='navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html') || url.pathname.endsWith('sw.js') || url.pathname.endsWith('manifest.json');
  if(isPage){ e.respondWith(fetch(req,{cache:'no-store'}).then(res=>{ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return res; }).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html')))); return; }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(res=>{ if(res.ok){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); } return res; }))); });
