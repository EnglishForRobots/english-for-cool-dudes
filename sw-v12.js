// =========================================================
// SERVICE WORKER: cool-dudes-lessons-cache-v12
// Optimized for GitHub Pages structure
// =========================================================

const CACHE_NAME = 'cool-dudes-lessons-cache-v12';
const FONT_CACHE_NAME = 'cool-dudes-font-cache-v2';

const urlsToCache = [
  '/',
  '/index.html',
  
  // External CSS (these will be cached on first visit)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap',
  
  // ALL LESSON PAGES - Cache both the directory AND index.html
  '/business/',
  '/business/index.html',
  '/drhammond/',
  '/drhammond/index.html',
  '/shopping/',
  '/shopping/index.html',
  '/towns/',
  '/towns/index.html',
  '/nationality/',
  '/nationality/index.html',
  '/greetings/',
  '/greetings/index.html',
  '/germany/',
  '/germany/index.html',
  '/projectmanagement/',
  '/projectmanagement/index.html',
  '/agilework/',
  '/agilework/index.html',
  '/negotiations/',
  '/negotiations/index.html',
  '/businessnew/',
  '/businessnew/index.html',
  '/fintech/',
  '/fintech/index.html',
  '/cbcr/',
  '/cbcr/index.html',
  '/taxavoidance/',
  '/taxavoidance/index.html',
  '/selfassessment/',
  '/selfassessment/index.html',
  '/iplaw/',
  '/iplaw/index.html',
  '/legalpros/',
  '/legalpros/index.html',
  '/legalcontracts/',
  '/legalcontracts/index.html',
  '/travel/',
  '/travel/index.html',
  '/presentperfectpastsimple/',
  '/presentperfectpastsimple/index.html',
  '/tax/',
  '/tax/index.html',
  '/legal/',
  '/legal/index.html',
  '/beginner/',
  '/beginner/index.html',
  '/intermediate/',
  '/intermediate/index.html',
  '/advanced/',
  '/advanced/index.html',
  '/chat-landing-page.html',
  
  // Essential files
  '/favicon.png',
  '/manifest.json'
];

// --- INSTALL EVENT ---
self.addEventListener('install', (event) => {
  console.log('[SW v12] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW v12] Caching app shell');
        // Cache files one by one to see which ones fail
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.warn('[SW v12] Failed to cache:', url, err);
            });
          })
        );
      })
      .then(() => {
        console.log('[SW v12] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// --- FETCH EVENT ---
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);

  // 1. EXTERNAL FONT CACHING
  if (requestURL.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => null);
        });
      })
    );
    return;
  }

  // 2. HANDLE NAVIGATION REQUESTS (HTML pages)
  const isNavigation = event.request.mode === 'navigate' || 
                       (event.request.method === 'GET' && 
                        event.request.headers.get('accept') && 
                        event.request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          console.log('[SW v12] Fetching from network:', requestURL.pathname);
          const networkResponse = await fetch(event.request);
          
          // Cache successful response
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
          
          return networkResponse;
        } catch (error) {
          // OFFLINE - try cache with multiple path variations
          console.log('[SW v12] OFFLINE - Checking cache for:', requestURL.pathname);
          
          let path = requestURL.pathname;
          
          // Try different path combinations
          const pathsToTry = [
            path,                                          // e.g., /business/
            path + 'index.html',                          // e.g., /business/index.html
            path.replace(/\/$/, '') + '/index.html',      // e.g., /business/index.html
            path.replace(/\/$/, ''),                      // e.g., /business
            '/index.html'                                 // fallback to home
          ];
          
          // Remove duplicates
          const uniquePaths = [...new Set(pathsToTry)];
          
          for (const tryPath of uniquePaths) {
            console.log('[SW v12] Trying cache path:', tryPath);
            const cached = await caches.match(tryPath, { ignoreSearch: true });
            if (cached) {
              console.log('[SW v12] ✓ Cache HIT:', tryPath);
              return cached;
            }
          }
          
          // Last resort - return home page
          console.log('[SW v12] Returning fallback: /index.html');
          const fallback = await caches.match('/index.html');
          if (fallback) {
            return fallback;
          }
          
          // If even that fails, show an error
          return new Response('Offline - Page not cached', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        }
      })()
    );
  } else {
    // 3. HANDLE STATIC ASSETS (CSS, JS, images, etc.)
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true })
        .then((response) => {
          if (response) {
            return response;
          }
          // Not in cache, try network
          return fetch(event.request).then((networkResponse) => {
            // Cache successful responses
            if (event.request.method === 'GET' && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
            }
            return networkResponse;
          });
        })
    );
  }
});

// --- ACTIVATE EVENT ---
self.addEventListener('activate', (event) => {
  console.log('[SW v12] Activating...');
  const cacheWhitelist = [CACHE_NAME, FONT_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[SW v12] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW v12] Claiming clients');
      return self.clients.claim();
    })
  );
});
