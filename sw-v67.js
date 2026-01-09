const CACHE_NAME = 'cool-dudes-lessons-cache-v67'; // Increment version
const FONT_CACHE_NAME = 'cool-dudes-font-cache-v3';

const essentialAssets = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/tickerData.js',
  '/manifest.json',
  '/login/', 
  
  '/dashboard/',
  
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/icon-180.png',
  '/images/favicon-32x32.png',
  '/favicon.png'
];

// --- INSTALL EVENT ---
self.addEventListener('install', (event) => {
  console.log('[SW v67] Installing... (Core Assets Only)');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache assets individually to handle failures
        return Promise.allSettled(
          essentialAssets.map(asset => 
            cache.add(asset).catch(err => {
              console.warn(`[SW v67] Failed to cache ${asset}:`, err.message);
            })
          )
        );
      })
      .then(() => {
        console.log('[SW v67] Install complete. Skip waiting...');
        return self.skipWaiting();
      })
  );
});

// --- MESSAGE EVENT ---
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW v67] Received SKIP_WAITING, activating now...');
    self.skipWaiting();
  }
});

// --- FETCH EVENT ---
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  // Skip Supabase API calls - CRITICAL!
if (event.request.url.includes('supabase.co')) {
    return; // Let browser handle it normally
}

  // Skip Supabase API calls - always go to network
  if (requestURL.hostname.includes('supabase.co')) {
    return;
  }

  // Handle HTML Navigation
  const isNavigation = event.request.mode === 'navigate' || 
                       (event.request.headers.get('accept') && 
                        event.request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    event.respondWith(
      (async () => {
        try {
          // Try Network First
          const networkResponse = await fetch(event.request, { cache: 'no-cache' });
          
          // Clone BEFORE checking or using the response
          if (networkResponse && networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            
            // Cache in background
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache).catch(err => {
                console.warn('[SW v67] Cache put failed:', err);
              });
            });
          }
          
          return networkResponse;

        } catch (error) {
          // Network failed - try cache
          console.log('[SW v67] Offline mode. Checking cache for:', requestURL.pathname);
          const cache = await caches.open(CACHE_NAME);
          
          // Try exact match first
          let cachedResponse = await cache.match(event.request);
          
          // Try variations
          if (!cachedResponse) {
            cachedResponse = await cache.match(requestURL.pathname + 'index.html');
          }
          if (!cachedResponse && !requestURL.pathname.endsWith('/')) {
            cachedResponse = await cache.match(requestURL.pathname + '/');
          }

          if (cachedResponse) {
            console.log('[SW v67] Serving from cache:', requestURL.pathname);
            return cachedResponse;
          }
          
          // Offline fallback page
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Offline - English For Cool Dudes</title>
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                  color: white;
                  text-align: center; 
                  padding: 60px 20px;
                  margin: 0;
                }
                .container {
                  max-width: 500px;
                  margin: 0 auto;
                  background: rgba(255,255,255,0.1);
                  padding: 40px;
                  border-radius: 20px;
                  backdrop-filter: blur(10px);
                }
                h1 { font-size: 48px; margin: 0 0 20px 0; }
                p { font-size: 18px; line-height: 1.6; opacity: 0.9; }
                button { 
                  background: white;
                  color: #667EEA;
                  border: none;
                  padding: 15px 30px;
                  border-radius: 10px;
                  font-size: 16px;
                  font-weight: 600;
                  margin-top: 30px;
                  cursor: pointer;
                  transition: transform 0.2s;
                }
                button:hover { transform: scale(1.05); }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>😎 Offline, Dude!</h1>
                <p>Looks like you're offline and this page hasn't been cached yet.</p>
                <p>Check your connection and try again!</p>
                <button onclick="window.location.href='/'">← Back to Home</button>
              </div>
            </body>
            </html>`,
            { 
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/html' } 
            }
          );
        }
      })()
    );
  } else {
    // Handle Assets (stale-while-revalidate)
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        
        // Fetch in background
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Clone before caching
          if (networkResponse && networkResponse.ok) {
            cache.put(event.request, networkResponse.clone()).catch(err => {
              console.warn('[SW v67] Background cache failed:', err);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Network failed, return cached or null
          return cachedResponse;
        });
        
        // Return cached immediately if available
        return cachedResponse || fetchPromise;
      })()
    );
  }
});

// --- ACTIVATE EVENT ---
self.addEventListener('activate', (event) => {
  console.log('[SW v67] Activating & cleaning old caches...');
  const cacheWhitelist = [CACHE_NAME, FONT_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[SW v67] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW v67] Claiming clients...');
      return self.clients.claim();
    })
  );
});
