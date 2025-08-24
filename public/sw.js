// Service Worker for Core Web Vitals optimization
// Focuses on caching strategies for better performance

const CACHE_NAME = 'cristoto-dev-v1';
const STATIC_CACHE_NAME = 'cristoto-dev-static-v1';

// Resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/posts/',
  '/about/',
  '/icon.svg',
  '/manifest.webmanifest'
];

// Resources to cache with different strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets (CSS, JS, images)
  CACHE_FIRST: [
    /\.(?:css|js|woff2?|ttf|eot)$/,
    /\/icons?\//,
    /\.(?:png|jpg|jpeg|webp|avif|gif|svg)$/
  ],
  
  // Network first for HTML pages
  NETWORK_FIRST: [
    /\/posts\/.+/,
    /\/series\/.+/,
    /\/notes\/.+/
  ],
  
  // Stale while revalidate for API-like content
  STALE_WHILE_REVALIDATE: [
    /\/rss\.xml/,
    /\/sitemap/,
    /webmention\.io/
  ]
};

// Install event - precache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME;
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control of all pages
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests (except for specific allowed domains)
  if (url.origin !== self.location.origin && 
      !url.hostname.includes('webmention.io') &&
      !url.hostname.includes('googletagmanager.com')) {
    return;
  }

  // Determine caching strategy
  const strategy = getCachingStrategy(request.url);
  
  switch (strategy) {
    case 'CACHE_FIRST':
      event.respondWith(cacheFirst(request));
      break;
      
    case 'NETWORK_FIRST':
      event.respondWith(networkFirst(request));
      break;
      
    case 'STALE_WHILE_REVALIDATE':
      event.respondWith(staleWhileRevalidate(request));
      break;
      
    default:
      // Default to network first for everything else
      event.respondWith(networkFirst(request));
  }
});

// Determine which caching strategy to use
function getCachingStrategy(url) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pattern.test(url))) {
      return strategy;
    }
  }
  return 'NETWORK_FIRST';
}

// Cache First strategy - good for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Network error', { status: 408 });
  }
}

// Network First strategy - good for HTML pages
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page if available
    const offlinePage = await caches.match('/');
    if (offlinePage) {
      return offlinePage;
    }
    
    return new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale While Revalidate - good for frequently changing content
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Fail silently, return cached version
    return cachedResponse;
  });
  
  // Return cached version immediately, update in background
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });
}

async function doBackgroundSync() {
  // Handle offline actions when back online
}

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'cristoto-dev-notification'
    };
    
    event.waitUntil(
      self.registration.showNotification('Cristotodev', options)
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    caches.keys().then(cacheNames => {
      Promise.all(
        cacheNames.map(async cacheName => {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          return { name: cacheName, size: keys.length };
        })
      ).then(stats => {
        event.ports[0].postMessage({
          type: 'CACHE_STATS',
          stats: stats
        });
      });
    });
  }
});