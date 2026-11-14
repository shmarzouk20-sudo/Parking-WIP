const C = 'cars-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const same = new URL(r.url).origin === location.origin;
  const save = res => {
    if (res.ok || res.type === 'opaque') { const c = res.clone(); caches.open(C).then(x => x.put(r, c)); }
    return res;
  };
  e.respondWith(
    same
      ? fetch(r).then(save).catch(() => caches.match(r).then(h => h || caches.match('./index.html')))
      : caches.match(r).then(h => h || fetch(r).then(save))
  );
});
