/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'Rutas20';
const urlsToCache = [
  './favicon.ico',
  './logo192.png'
];

self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(urlsToCache)
          .then(()=>self.skipWaiting())
      })
      .catch(err=>console.log("fallo registro de cache", err))
    );
  });
  
  // Cache and return requests
  self.addEventListener('fetch', (event) => {
    //responde ya sea con el objeto en caché o continuar y busca la url real
    event.respondWith(
      caches.match(event.request).then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  });
  
  // Update a service worker
  self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          cacheNames.map((cacheName) => {
            //eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
      })
      //le indica al SW activar el cache actual
      .then((self.clients.claim()))
    );
  });