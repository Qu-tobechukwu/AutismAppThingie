const cacheName = 'social-ease-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/challenges.html',
  '/social-cues.html',
  '/calm-corner.html',
  '/notes.html',
  '/progress.html',
  '/settings.html',
  '/style.css',
  '/script.js',
  '/assets/logo.svg',
  '/manifest.json'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate service worker
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Fetch cached assets
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
