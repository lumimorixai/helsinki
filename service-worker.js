const CACHE_NAME = "helsinki-family-guide-v3-971ecae227f5";
const PRECACHE = [
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/icon-1024.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-96.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./images/guide/design_details.svg",
  "./images/guide/oldhall_details.svg",
  "./images/guide/oodi_floors.svg",
  "./images/guide/route_courtyards.svg",
  "./images/guide/route_design.svg",
  "./images/guide/route_suomenlinna.svg",
  "./images/guide/route_toolo.svg",
  "./images/img_01_238bd9de3b6d.jpg",
  "./images/img_02_5456a07face0.jpg",
  "./images/img_03_878840d65107.jpg",
  "./images/img_04_e18555136b06.jpg",
  "./images/img_05_a07e567ce429.jpg",
  "./images/img_06_e6454f1b97ff.jpg",
  "./images/img_07_9a0d3fc838ec.jpg",
  "./images/img_08_2490fcb31d05.jpg",
  "./images/img_09_c94569878544.jpg",
  "./images/img_10_541588be78fe.jpg",
  "./images/img_11_d09fcd7ada44.jpg",
  "./images/img_12_a2122d9eca0c.svg",
  "./images/img_13_0addb091827a.svg",
  "./images/img_14_00f362ed61b3.svg",
  "./images/img_15_a29c6744fcb1.svg",
  "./images/img_16_232e33eabce9.svg",
  "./images/img_17_9797c282a262.svg",
  "./images/img_18_5fc1b9f9ff9a.svg",
  "./images/img_19_a982058df927.svg",
  "./images/img_20_d34d66238350.svg",
  "./images/img_21_64fb7d5ca4a1.svg",
  "./index.html",
  "./manifest.webmanifest",
  "./offline.html"
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('helsinki-family-guide-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

async function networkFirstNavigation(request) {
  try {
    const freshRequest = new Request(request, { cache: 'no-store' });
    const response = await fetch(freshRequest);
    if (response?.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put('./index.html', response.clone());
    }
    return response;
  } catch (error) {
    return (await caches.match('./index.html')) || (await caches.match('./offline.html'));
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response?.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  })());
});
