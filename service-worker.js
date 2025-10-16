const CACHE_NAME = 'social-ease-cache-v1';
const urlsToCache = [
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
  '/manifest.json',
  '/assets/logo.svg'
];

// Install service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if(key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch from cache first, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
