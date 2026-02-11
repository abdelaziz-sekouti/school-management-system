'use strict';
const CACHE_NAME = 'flutter-app-cache-v1';
const urlsToCache = [
  '/school-management-system/',
  '/school-management-system/index.html',
  '/school-management-system/flutter.js',
  '/school-management-system/flutter_bootstrap.js',
  '/school-management-system/main.dart.js',
  '/school-management-system/version.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});