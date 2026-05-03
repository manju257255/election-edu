const CACHE_NAME = 'election-edu-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/vite.svg',
  // Vite assets will be added here dynamically or handled by a more advanced SW
  // For a simple demo, we cache the entry points.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Don't cache API calls to Google
  if (event.request.url.includes('googleapis.com')) return;
  
  // Only cache http/https schemes (fixes chrome-extension error)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Cache the new resource if it's a valid response
          if (fetchResponse.status === 200) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      });
    }).catch(() => {
      // Fallback for index.html if offline and not in cache
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
