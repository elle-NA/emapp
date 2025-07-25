// Променете версията тук, за да задействате актуализация!
const CACHE_NAME = 'emotion-mixer-v3';

// Файлове, които ще бъдат запазени за офлайн работа.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Инсталиране на service worker-а и кеширане на файловете.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кешът е отворен');
        return cache.addAll(urlsToCache);
      })
  );
});

// Прихващане на заявки и връщане от кеша, ако е възможно.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Ако заявката е намерена в кеша, я връщаме.
        if (response) {
          return response;
        }
        // В противен случай я изпращаме към мрежата.
        return fetch(event.request);
      }
    )
  );
});

// Изтриване на стари кешове при активиране на нова версия.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Изтриване на стар кеш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
