/* Fetch live event information; only the offline notice is cached. */
const CACHE = 'sia-offline-v1';
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.add('./offline.html')));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('sia-offline-') && key !== CACHE)
      .map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate' ||
      new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).catch(async () =>
    (await caches.match('./offline.html')) ||
    new Response('Please reconnect to view Sia’s Arangetram.', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  ));
});
