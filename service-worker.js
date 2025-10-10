const CACHE_NAME = 'cool-dudes-lessons-cache-v2'; // Bumped version to v2
const urlsToCache = [
  '/', 
  '/index.html', 
  '/drhammond/',         // Dr Hammond
  '/shopping/',        // Shopping
  '/towns/',        // Towns
  '/nationality/',    // Nationality
  '/greetings/',    // Greetings
  '/germany/',          // Germany
  '/business/',           // Business Page
  '/projectmanagement/',  // Project Management
  '/agilework/',          // Agile Work
  '/negotiations/',      // Negotiations
  '/businessnew/',      // Communication
  '/fintech/',      // FinTech
  '/cbcr/',      // CbCR
  '/taxavoidance/',  // Tax Avoidance
  '/selfassessment/',  // Self Assessment
  '/iplaw/',    // IP Law
  '/legalpros/',    // Legal Pros
  '/legalcontracts/',    // Legal Contracts
  '/travel/',     // Travel
  '/presentperfectpastsimple/',  // Present Perfect Past Simple
  '/tax/',    // Tax
  '/legal/',  // Legal
  '/beginner/',  // Beginner
  '/intermediate/',  // Intermediate
  '/advanced/',  // Advanced
  // Add other essential files below
  '/styles.css',             // If you use a single main CSS file
  '/favicon.png'             // Essential icon
];

// --- INSTALL EVENT: Saving all the core files ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        // This caches all your key HTML files and assets for offline use
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
        // Return the cached file if it exists
        if (response) {
          return response;
        }
        // If not in cache, go to the network
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
