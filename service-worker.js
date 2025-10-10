// =========================================================
// SERVICE WORKER: cool-dudes-lessons-cache-v7
// FIX: Aggressive Fallback for Offline PWA Launch
// =========================================================

const CACHE_NAME = 'cool-dudes-lessons-cache-v7'; // *** BUMPED TO V7 ***
const urlsToCache = [
  '/', 
  '/index.html', // Essential for PWA offline launch
  
  // External Resources - MUST be cached for styling to work offline
  'https://cdn.tailwindcss.com', 
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap', 
  'https://fonts.gstatic.com', // Needed by Google Fonts
  
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


// --- INSTALL EVENT: Skip waiting and cache all files ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell (V7)');
        return cache.addAll(urlsToCache).catch((error) => {
          console.error('[Service Worker] Failed to cache resource:', error);
        });
      })
      // FIX 1: Immediately skip the waiting phase and activate
      .then(() => self.skipWaiting()) 
  );
});

// ------------------------------------------------------------------
// *** NEW FETCH EVENT: The Definitive Offline Navigation Fix ***
// This uses an asynchronous fetch with a try/catch to force the index.html fallback
// ------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  // Check if the request is a navigation request (i.e., loading a new HTML page)
  const isNavigation = (event.request.mode === 'navigate' || 
                        (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')));
  
  if (isNavigation) {
    
    event.respondWith(
      (async () => {
        try {
          // 1. Try to get the fresh page from the network first.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // 2. If the network fails (offline), serve the cached index.html
          // Use ignoreSearch: true to ensure the match works regardless of query strings
          const cachedIndex = await caches.match('/index.html', { ignoreSearch: true });
          
          if (cachedIndex) {
             return cachedIndex;
          }
          // Fallback to the original request cache match as a last resort
          return caches.match(event.request, { ignoreSearch: true });
        }
      })()
    );
    
  } else {
    // For non-navigation requests (images, CSS, JS, etc.), use the standard cache-first strategy
    event.respondWith(
      // FIX 3: Still use ignoreSearch: true for general assets to handle cache key differences
      caches.match(event.request, { ignoreSearch: true }) 
        .then((response) => {
          // Cache-First Strategy
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
  // FIX 2: Immediately take control of existing tabs/windows
  event.waitUntil(
    self.clients.claim()
  );

  // Clean up old caches
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old, unused caches
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
