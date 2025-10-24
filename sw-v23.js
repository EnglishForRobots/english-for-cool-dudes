// =========================================================
// SERVICE WORKER: cool-dudes-lessons-cache-v23
// Pre-caches ALL pages on first visit for full offline access
// =========================================================

const CACHE_NAME = 'cool-dudes-lessons-cache-v23';
const FONT_CACHE_NAME = 'cool-dudes-font-cache-v2';

// List of all HTML pages to pre-cache
const htmlPages = [
  '/',
  '/business/',
  '/drhammond/',
  '/shopping/',
  '/towns/',
  '/nationality/',
  '/greetings/',
  '/germany/',
  '/projectmanagement/',
  '/agilework/',
  '/negotiations/',
  '/businessnew/',
  '/fintech/',
  '/cbcr/',
  '/taxavoidance/',
  '/selfassessment/',
  '/iplaw/',
  '/legalpros/',
  '/legalcontracts/',
  '/travel/',
  '/presentperfectpastsimple/',
  '/tax/',
  '/legal/',
  '/beginner/',
  '/intermediate/',
  '/advanced/',
  '/chat/',
  '/fortunecookies/',
  '/undeclaredwork/',
  '/crocs/',
  '/changemanagement/',
  '/weather/',
  '/internationaltaxation/',
  '/humming/'
];

// Essential assets
const essentialAssets = [
  '/index.html',
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/icon-180.png',
  '/images/favicon-32x32.png',
  '/favicon.png',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap'
];

// --- INSTALL EVENT: Pre-cache everything ---
self.addEventListener('install', (event) => {
  console.log('[SW v23] Installing and pre-caching ALL pages...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        // First, cache essential assets
        console.log('[SW v23] Caching essential assets...');
        await Promise.all(
          essentialAssets.map(url => 
            cache.add(url).catch(err => 
              console.warn('[SW v23] Failed to cache:', url, err)
            )
          )
        );
        
        // Then, cache all HTML pages
        console.log('[SW v23] Pre-caching all lesson pages...');
        let successCount = 0;
        let failCount = 0;
        
        for (const page of htmlPages) {
          try {
            const response = await fetch(page);
            if (response.ok) {
              // Cache both the directory path and with index.html
              await cache.put(page, response.clone());
              
              // Also cache the explicit index.html version
              if (page.endsWith('/') && page !== '/') {
                await cache.put(page + 'index.html', response.clone());
              }
              
              successCount++;
              console.log(`[SW v23] ✓ Cached: ${page} (${successCount}/${htmlPages.length})`);
            }
          } catch (err) {
            failCount++;
            console.warn(`[SW v23] ✗ Failed: ${page}`, err);
          }
        }
        
        console.log(`[SW v23] Pre-caching complete: ${successCount} success, ${failCount} failed`);
      })
      .then(() => {
        console.log('[SW v23] Installation complete, taking control...');
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
        // Try cache first (since we pre-cached everything)
        let path = requestURL.pathname;
        
        const pathsToTry = [
          path,
          path + 'index.html',
          path.replace(/\/$/, '') + '/index.html',
          path.replace(/\/$/, ''),
          '/index.html'
        ];
        
        const uniquePaths = [...new Set(pathsToTry)];
        
        // Check cache first
        for (const tryPath of uniquePaths) {
          const cached = await caches.match(tryPath, { ignoreSearch: true });
          if (cached) {
            console.log('[SW v23] Serving from cache:', tryPath);
            
            // Update cache in background (stale-while-revalidate)
            fetch(event.request)
              .then(response => {
                if (response.ok) {
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                  });
                }
              })
              .catch(() => {}); // Ignore network errors
            
            return cached;
          }
        }
        
        // Not in cache, try network
        try {
          console.log('[SW v23] Fetching from network:', path);
          const networkResponse = await fetch(event.request);
          
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          console.log('[SW v23] Network failed, no cache available');
          return new Response('Offline - Page not available', {
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
          return fetch(event.request).then((networkResponse) => {
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
  console.log('[SW v23] Activating...');
  const cacheWhitelist = [CACHE_NAME, FONT_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[SW v23] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW v23] Claiming clients');
      return self.clients.claim();
    })
  );
});
