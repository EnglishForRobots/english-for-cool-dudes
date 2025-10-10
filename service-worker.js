// =========================================================
// SERVICE WORKER: cool-dudes-lessons-cache-v6
// FIXES: Forced Update, Immediate Activation, Offline Launch
// =========================================================

const CACHE_NAME = 'cool-dudes-lessons-cache-v6'; // *** BUMPED TO V6 ***
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
        console.log('[Service Worker] Caching app shell (V6)');
        return cache.addAll(urlsToCache).catch((error) => {
          console.error('[Service Worker] Failed to cache resource:', error);
        });
      })
      // FIX 1: Immediately skip the waiting phase and activate
      .then(() => self.skipWaiting()) 
  );
});

// --- FETCH EVENT: Serving the cached files first (with ignoreSearch fix) ---
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // *** FIX 3: Ignore query strings (like ?pwa=1) for cache matching. ***
    caches.match(event.request, { ignoreSearch: true }) 
      .then((response) => {
        // Cache-First Strategy
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
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
