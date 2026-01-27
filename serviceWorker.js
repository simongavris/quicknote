const cacheName = 'quicknote-v3';
const assetsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/registerServiceWorker.js',
  '/serviceWorker.js',
  // Add more assets here
];

self.addEventListener('install', (event) => {
self.addEventListener('install', (event) => {
  // Force waiting service worker to become active
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => cache.addAll(assetsToCache))
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== cacheName).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});
