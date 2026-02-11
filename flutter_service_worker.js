'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "/": "/",
  "main.dart.js": "main.dart.js",
  "index.html": "index.html",
  "flutter.js": "flutter.js",
  "flutter_bootstrap.js": "flutter_bootstrap.js",
  "assets/AssetManifest.json": "assets/AssetManifest.json",
  "assets/FontManifest.json": "assets/FontManifest.json"
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(Object.values(RESOURCES)))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
            return response;
          }
        );
      })
  );
});