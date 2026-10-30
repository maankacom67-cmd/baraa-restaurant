// BARAA RESTAURANT - Production Progressive Web App Service Worker (sw.js)
const CACHE_VERSION = 'baraa-v3.0.0';
const STATIC_CACHE = `baraa-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `baraa-dynamic-${CACHE_VERSION}`;

const isDevHost = Boolean(
  self.location.hostname.includes('run.app') ||
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1' ||
  self.location.hostname.includes('webcontainer')
);

// If running in development / preview environment, unregister immediately and bypass all caching
if (isDevHost) {
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.claim())
    );
  });
  self.addEventListener('fetch', () => {
    // Pass through to network unconditionally
  });
} else {
  const CORE_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.svg',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/favicon-192x192.png',
    '/favicon-512x512.png',
    '/pwa-192x192.png',
    '/pwa-512x512.png',
    '/pwa-maskable-512x512.png',
    '/apple-touch-icon.png',
    '/hero-food.jpg',
    '/bariis.jpg',
    '/sambuus.jpg',
    '/juice.jpg'
  ];

  // Install: Precache essential assets and immediately activate
  self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
      caches.open(STATIC_CACHE).then((cache) => {
        return Promise.allSettled(
          CORE_ASSETS.map((url) =>
            fetch(url, { cache: 'reload' })
              .then((res) => {
                if (res.ok) {
                  return cache.put(url, res);
                }
              })
              .catch((err) => {
                console.warn('[SW] Precache item skipped:', url, err);
              })
          )
        );
      })
    );
  });

  // Activate: Take control immediately and delete old caches for instant updates
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      Promise.all([
        self.clients.claim(),
        caches.keys().then((keys) => {
          return Promise.all(
            keys.map((key) => {
              if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
                console.log('[SW] Purging outdated cache:', key);
                return caches.delete(key);
              }
            })
          );
        })
      ])
    );
  });

  // Message listener for immediate update command from client
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  // Fetch Strategy:
  self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
      return;
    }

    // Skip dev and HMR requests entirely
    if (
      url.pathname.startsWith('/@') ||
      url.pathname.includes('/node_modules/') ||
      url.pathname.startsWith('/src/') ||
      url.searchParams.has('v') ||
      url.searchParams.has('t') ||
      url.pathname.includes('hot-update')
    ) {
      return;
    }

    // 1. HTML / Page Navigation: Always try Network first so updates reflect instantly
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(async () => {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
              return cachedResponse;
            }
            const indexResponse = await caches.match('/index.html');
            return indexResponse || new Response('Offline - BARAA RESTAURANT', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
          })
      );
      return;
    }

    // 2. API Routes: Network-First
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => caches.match(request))
      );
      return;
    }

    // 3. Static Assets & Images: Stale-While-Revalidate
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  });
}
