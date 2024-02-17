// Change the version number to update the cache
const INDEXDB_VERSION = 1;

const FILECACHE = 'filecache-v1';
const IMAGECACHE = 'imagecache-v1';

const CURRENT_CACHES = [FILECACHE, IMAGECACHE];

const PRECACHE_URLS = ['/index.html']
const FILESCACHE_EXTENSIONS = ['.css', '.html', '.js', '.woff2', '.svg'];
const IMAGECACHE_EXTENSIONS = ['.webp', '.jpg', '.png'];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(

    // Precahce files
    caches.open(FILECACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })

    // Activate the new service worker immediately
    .then(() => {
      self.skipWaiting()
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    new Promise((resolve, reject) => {
      const openRequest = indexedDB.open('localdb-v1', INDEXDB_VERSION);

      openRequest.onupgradeneeded = event => {
        let db = event.target.result;

        // Create Object Stores: cart
        db.createObjectStore("cart", { keyPath: "id" });
      };

      openRequest.onsuccess = () => resolve();
      openRequest.onerror = () => reject();
    })

    // Delete old caches
    .then(() => {
      caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => {
          if (!CURRENT_CACHES.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }));
      });
    })

    // Take control of all pages under this service worker's scope
    .then(() => {
      self.clients.claim();
    })
)});

// Add item to cart
const addToCart = (item) => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('localdb-v1', INDEXDB_VERSION);

    openRequest.onsuccess = (event) => {
      let db = event.target.result;
      let transaction = db.transaction(["cart"], "readwrite");
      let objectStore = transaction.objectStore("cart");
      let request = objectStore.add(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject();
    };
    openRequest.onerror = () => reject();
  });
}

// Get cart items
const getCartItems = () => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('localdb-v1', INDEXDB_VERSION);

    openRequest.onsuccess = (event) => {
      let db = event.target.result;
      let transaction = db.transaction(["cart"], "readonly");
      let objectStore = transaction.objectStore("cart");
      let request = objectStore.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject();
    };
    openRequest.onerror = () => reject();
  });
}

self.addEventListener('fetch', (event) => {
  
  // Get cart
  if (event.request.url.endsWith('/carts/1') && event.request.url.startsWith('http') && event.request.method === 'GET') {
    event.respondWith(
      getCartItems().then((items) => {
        return new Response(JSON.stringify(items));
      })
    );
  }

  // Add to cart
  else if (event.request.url.endsWith('/carts') && event.request.url.startsWith('http') && event.request.method === 'POST') {
    event.respondWith(
      event.request.json().then((item) => {
        addToCart(item);
        return new Response(null);
      })
    );
  }

  // Files Cache
  else if (FILESCACHE_EXTENSIONS.some(extension => event.request.url.endsWith(extension)) && event.request.url.startsWith('http') && event.request.method === 'GET') {
    event.respondWith(
      caches.open(FILECACHE).then(cache => 
        cache.match(event.request).then(cacheResponse => 
          cacheResponse || fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        )
      )
    );
  }

  // Images Cache
  else if (IMAGECACHE_EXTENSIONS.some(extension => event.request.url.endsWith(extension)) && event.request.url.startsWith('http') && event.request.method === 'GET') {
    event.respondWith(
      caches.open(IMAGECACHE).then(cache => 
        cache.match(event.request).then(cacheResponse => 
          cacheResponse || fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        )
      )
    );
  }
});