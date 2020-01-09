const staticCacheName = 'v1';
const filesToCache = [
  './',
  './css/styles.css',
  'index.html',
  'restaurant.html',
  // './restaurants.json',
  // './img/1.jpg',
  // './img/2.jpg',
  // './img/3.jpg',
  // './img/4.jpg',
  // './img/5.jpg',
  // './img/6.jpg',
  // './img/7.jpg',
  // './img/8.jpg',
  // './img/9.jpg',
  // './img/10.jpg',
  './js/dbhelper.js',
  './js/main.js',
  './js/restaurant_info.js',
];


self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(filesToCache))
      .then(() => self.skipWaiting())
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== staticCacheName) {
            console.log('[Service Worker] Removing old cache.', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      } else {
        return fetch(event.request)
          .then(res => {
            return caches.open(staticCacheName)
              .then(cache => {
                cache.put(event.request.url, res.clone());
                return res;
              })
          })
          .catch(err => console.log(err));
      }
    })
  );
});