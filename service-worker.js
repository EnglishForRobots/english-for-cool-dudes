const CACHE_NAME = 'cool-dudes-lessons-cache-v4'; // *** IMPORTANT: BUMPED TO V4 ***
const urlsToCache = [
  '/', 
  '/index.html', 
  
  // External Resources - MUST be cached for styling to work offline
  'https://cdn.tailwindcss.com', // Tailwind CSS Framework
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap', // Nunito Font CSS Link
  'https://fonts.gstatic.com', // Needed by Google Fonts to load the font files themselves
  
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

// --- INSTALL EVENT: Saving all the core files ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache).catch((error) => {
          console.error('[Service Worker] Failed to cache resource:', error);
        });
      })
  );
});

// --- FETCH EVENT: Serving the cached files first ---
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// --- ACTIVATE EVENT: Cleaning up old caches (important for updates) ---
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old, unused caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
