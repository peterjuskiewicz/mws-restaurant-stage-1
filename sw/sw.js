//Service worker

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('restaurantsCache').then(function(cache) {
      return cache.addAll([
        '../',
        '../js/main.js',
        '../js/dbhelper.js',
        '../js/restaurant_info.js',
        '../css/styles.css',
        '../data/restaurants.json',
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurants') &&
                 cacheName != 'restaurantsCache';
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', function (event) {
  // TODO: respond to requests for the root page with
  // the page skeleton from the cache
  console.log(event.request.url)
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/restaurantsCache'));
      return;
    }
  }

  event.respondWith(caches.match(event.request)
    .then(function (response) {
      return response || fetch(event.request);
    }));
});

