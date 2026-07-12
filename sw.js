/* The Reading Room — offline cache. Textures & libraries download once,
   then load from disk on every launch. */
const CACHE = 'reading-room-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (/\/textures\/|cdn\.jsdelivr\.net/.test(url)) {
    // assets: cache-first (downloaded exactly once)
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      if (res && res.ok) c.put(e.request, res.clone());
      return res;
    }));
  } else if (e.request.mode === 'navigate') {
    // the page itself: network-first so updates arrive, cached copy offline
    e.respondWith(fetch(e.request).then(res => {
      caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res.clone();
    }).catch(() => caches.match(e.request)));
  }
});
