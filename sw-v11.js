// =========================================================
// SERVICE WORKER: cool-dudes-lessons-cache-v11
// FIX: Aggressive Fallback, Runtime Caching, and PATH NORMALIZATION
// =========================================================

const CACHE_NAME = 'cool-dudes-lessons-cache-v11'; // *** BUMPED TO V11 ***
const FONT_CACHE_NAME = 'cool-dudes-font-cache'; 

const urlsToCache = [
  '/', 
  '/index.html', 
  
  // External CSS
  'https://cdn.tailwindcss.com', 
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap', 
  
  // ALL LESSON & TOPIC PAGES
  '/drhammond/',
  '/shopping/',
  '/towns/',
  '/nationality/',
  '/greetings/',
  '/germany/',
  '/business/',
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
  
  // Essential files
  '/styles.css',
  '/favicon.png'
];


// --- INSTALL EVENT: Skip waiting and cache all internal files ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell (V11)');
        return cache.addAll(urlsToCache).catch((error) => {
          console.error('[Service Worker] Failed to cache resource:', error);
        });
      })
      .then(() => self.skipWaiting()) 
  );
});


// --- FETCH EVENT: Handles all requests (with Path Normalization Fix) ---
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);

  // 1. EXTERNAL FONT CACHING (RUNTIME CACHING)
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
          }).catch(() => {
            return null; 
          });
        });
      })
    );
    return;
  }


  // 2. INTERNAL NAVIGATION/ASSET CACHING (OFFLINE-FIRST)
  const isNavigation = (event.request.mode === 'navigate' || 
                        (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')));
  
  if (isNavigation) {
    
    event.respondWith(
      (async () => {
        try {
          // Try network for fresh page first
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // Network failed (offline).
          
          let path = requestURL.pathname;
          
          // *** FIX: PATH NORMALIZATION *** if (path.endsWith('/') && path !== '/') {
              path += 'index.html'; 
          }
          
          // 1. Try to match the normalized path (e.g., /business/index.html)
          const cachedFile = await caches.match(path, { ignoreSearch: true });

          if (cachedFile) {
             return cachedFile;
          }
          
          // 2. Fallback to the root index.html if the specific page wasn't found
          const cachedRootIndex = await caches.match('/index.html', { ignoreSearch: true });
          
          if (cachedRootIndex) {
             return cachedRootIndex;
          }

          // Fallback to original request as last resort
          return caches.match(event.request, { ignoreSearch: true });
        }
      })()
    );
    
  } else {
    // For non-HTML assets (CSS, JS, etc.)
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }) 
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});


// --- ACTIVATE EVENT: Cleaning up old caches and claiming clients ---
self.addEventListener('activate', (event) => {
  self.clients.claim(); 
  
  // Clean up old caches (both main and font caches)
  const cacheWhitelist = [CACHE_NAME, FONT_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
