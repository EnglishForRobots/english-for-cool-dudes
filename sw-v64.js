// =========================================================
// SERVICE WORKER: cool-dudes-lessons-cache-v64
// Optimized: Fast Install (Core only) + Cache-as-you-go
// =========================================================

const CACHE_NAME = 'cool-dudes-lessons-cache-v64'; // Increment this!
const FONT_CACHE_NAME = 'cool-dudes-font-cache-v3';

// Only cache the "Skeleton" of the app immediately.
// Everything else will be cached when the user actually clicks it.
const essentialAssets = [
  '/',
  '/index.html',
  '/styles.css',         // Added: CSS is critical for the offline page
  '/main.js',            // Added: Main logic
  '/tickerData.js',      // Added: Ticker logic
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/icon-180.png',
  '/images/favicon-32x32.png',
  '/favicon.png'
];

// --- INSTALL EVENT: Quick & Light ---
self.addEventListener('install', (event) => {
  console.log('[SW v64] Installing... (Core Assets Only)');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Only cache the critical files. This finishes in milliseconds.
        return cache.addAll(essentialAssets);
      })
      .then(() => {
        console.log('[SW v64] Install complete. Skip waiting...');
        return self.skipWaiting();
      })
  );
});

// --- MESSAGE EVENT: Handle "Skip Waiting" ---
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// --- FETCH EVENT: The "Network First" Logic ---
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);

  // 1. Handle HTML Navigation (Pages) -> Network First, then Cache
  const isNavigation = event.request.mode === 'navigate' || 
                       (event.request.method === 'GET' && 
                        event.request.headers.get('accept') && 
                        event.request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    event.respondWith(
      (async () => {
        try {
          // A. Try Network (Get latest version)
          const networkResponse = await fetch(event.request, { cache: 'no-cache' });
          
          if (networkResponse.ok) {
            // B. If successful, save to cache for next time
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;

        } catch (error) {
          // C. Network failed? Try Cache.
          console.log('[SW v64] Offline mode. Checking cache for:', requestURL.pathname);
          const cache = await caches.open(CACHE_NAME);
          
          // Try to match the exact URL, or directory variations
          let cachedResponse = await cache.match(event.request);
          if (!cachedResponse) {
              cachedResponse = await cache.match(requestURL.pathname + 'index.html');
          }
          if (!cachedResponse) {
              cachedResponse = await cache.match(requestURL.pathname + '/');
          }

          if (cachedResponse) return cachedResponse;
          
          // D. No cache? Show Offline Page
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Offline - Cool Dudes</title>
              <style>
                body { font-family: sans-serif; background: #eef7ff; text-align: center; padding: 40px; }
                h1 { color: #D42426; }
                p { color: #165B33; }
                button { background: #165B33; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; margin-top: 20px;}
              </style>
            </head>
            <body>
              <h1>❄️ Snowed In! (Offline)</h1>
              <p>We couldn't reach the server. This page hasn't been saved to your "Snow Globe" yet.</p>
              <p>Check your internet connection and try again.</p>
              <button onclick="window.location.href='/'">Return to Home Base</button>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
      })()
    );
  } else {
    // 2. Handle Assets (Images, JS, CSS) -> Stale-While-Revalidate
    // This makes the app feel fast but ensures assets update eventually
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Update cache in background
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
        // Return cached version immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
    );
  }
});

// --- ACTIVATE EVENT: Clean old caches ---
self.addEventListener('activate', (event) => {
  console.log('[SW v64] Activating & Cleaning old caches...');
  const cacheWhitelist = [CACHE_NAME, FONT_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[SW v64] Deleting:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
