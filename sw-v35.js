// =========================================================
// SERVICE WORKER: cool-dudes-lessons-cache-v35
// Pre-caches ALL pages on first visit for full offline access
// =========================================================

const CACHE_NAME = 'cool-dudes-lessons-cache-v35';
const FONT_CACHE_NAME = 'cool-dudes-font-cache-v3';

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
  '/humming/',
  '/bazaar/',
  '/britishfood/',
  '/herring/',
  '/weirdeurofoods/',
  '/slicedbread/',
  '/be/',
  '/timeandnumbers/'
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
  console.log('[SW v35] Installing and pre-caching ALL pages...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        // First, cache essential assets
        console.log('[SW v35] Caching essential assets...');
        await Promise.all(
          essentialAssets.map(url => 
            cache.add(url).catch(err => 
              console.warn('[SW v35] Failed to cache:', url, err)
            )
          )
        );
        
        // Then, cache all HTML pages
        console.log('[SW v35] Pre-caching all lesson pages...');
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
              console.log(`[SW v35] ✓ Cached: ${page} (${successCount}/${htmlPages.length})`);
            }
          } catch (err) {
            failCount++;
            console.warn(`[SW v35] ✗ Failed: ${page}`, err);
          }
        }
        
        console.log(`[SW v35] Pre-caching complete: ${successCount} success, ${failCount} failed`);
      })
      .then(() => {
        console.log('[SW v35] Installation complete, taking control...');
        return self.skipWaiting();
      })
  );
});

// --- FETCH EVENT ---
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);

  // 1. EXTERNAL FONT FILES CACHING (fonts.gstatic.com)
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

  // 2. GOOGLE FONTS CSS CACHING (fonts.googleapis.com)
  if (requestURL.origin === 'https://fonts.googleapis.com') {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW v35] Serving Google Fonts CSS from cache');
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            console.log('[SW v35] Caching Google Fonts CSS');
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            console.warn('[SW v35] Failed to fetch Google Fonts CSS');
            return null;
          });
        });
      })
    );
    return;
  }

  // 3. HANDLE NAVIGATION REQUESTS (HTML pages)
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
            console.log('[SW v35] Serving from cache:', tryPath);
            
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
          console.log('[SW v35] Fetching from network:', path);
          const networkResponse = await fetch(event.request);
          
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          console.log('[SW v35] Network failed, no cache available for:', path);
          
          // Return a more helpful offline page
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Offline - Cool Dudes</title>
              <style>
                body {
                  font-family: 'Nunito', sans-serif;
                  background: #F8F9FB;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  padding: 20px;
                  text-align: center;
                }
                .offline-box {
                  background: white;
                  padding: 40px;
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  max-width: 400px;
                }
                h1 { color: #3498DB; margin-bottom: 10px; }
                p { color: #4A5568; line-height: 1.6; }
                button {
                  background: #3498DB;
                  color: white;
                  border: none;
                  padding: 12px 24px;
                  border-radius: 8px;
                  font-size: 16px;
                  cursor: pointer;
                  margin-top: 20px;
                }
                button:hover { background: #2980B9; }
              </style>
            </head>
            <body>
              <div class="offline-box">
                <h1>📵 You're Offline</h1>
                <p>This page hasn't been cached yet. Please connect to the internet and visit this page first, then it will be available offline!</p>
                <button onclick="window.location.href='/'">← Back to Home</button>
              </div>
            </body>
            </html>`,
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/html'
              })
            }
          );
        }
      })()
    );
  } else {
    // 4. HANDLE STATIC ASSETS (CSS, JS, images, etc.)
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
          }).catch(() => {
            // Return null for failed asset requests
            console.warn('[SW v35] Failed to fetch asset:', event.request.url);
            return new Response('', { status: 404 });
          });
        })
    );
  }
});

// --- ACTIVATE EVENT ---
self.addEventListener('activate', (event) => {
  console.log('[SW v35] Activating...');
  const cacheWhitelist = [CACHE_NAME, FONT_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[SW v35] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW v35] Claiming clients');
      return self.clients.claim();
    })
  );
});
