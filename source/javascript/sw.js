const VERSION = `KRYPTO-${serviceWorkerOption.version}`;

addEventListener('install', event => {
  skipWaiting();
});

addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key))))
  );
});

addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.host !== location.host) { return }
  
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) { return cached }

      return fetch(request).then(resp => caches.open(VERSION).then(cache => {
        cache.put(request, resp.clone());
        return resp;
      }));
    })
  );
}); 