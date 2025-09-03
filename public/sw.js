// Simple service worker for caching fonts and shell
const CACHE_NAME = 'odia-dev-v1';
const urlsToCache = [
  '/',
  '/fonts/inter-latin-400-normal.woff2',
  '/fonts/inter-latin-600-normal.woff2',
  '/fonts/inter-latin-700-normal.woff2',
  '/fonts/space-grotesk-latin-600-normal.woff2',
  '/fonts/space-grotesk-latin-700-normal.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Don't cache audio files or API requests
  if (event.request.url.includes('/api/') || 
      event.request.headers.get('accept').includes('audio')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});