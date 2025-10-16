const cacheName = "social-ease-v1";
const assetsToCache = [
  "/",
  "/index.html",
  "/challenges.html",
  "/social-cues.html",
  "/calm-corner.html",
  "/notes.html",
  "/progress.html",
  "/settings.html",
  "/style.css",
  "/script.js",
  "/assets/logo.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assetsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
