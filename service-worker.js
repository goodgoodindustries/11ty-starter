// establish version number to control when the cache should be cleared
// set limits for how many of a certain type of asset should be cached
const version = 1;
const serviceWorkerCaches = {
  static: {
    name: `v${version}-static`,
  },
  dynamic: {
    name: `v${version}-dynamic`,
    limit: 100,
  },
};

function trimCache(cacheName, maxItems) {
  // Open the cache
  caches.open(cacheName)
  .then((cache) => {
    // Get the keys and count them
    cache.keys()
    .then((keys) => {
      // Do we have more than we should?
      if (keys.length > maxItems) {
        // Delete the oldest item and run trim again
        cache.delete(keys[0])
        .then( () => {
          trimCache(cacheName, maxItems)
        });
      }
    });
  });
}

function cacheThenUpdate(event) {
  return caches.match(event.request).then(function (response) {
    return response || fetch(event.request).then(function(response) {
      return caches.open(`v${version}-dynamic`).then(function(cache) {
        cache.put(event.request, response.clone());
        return response;
      });
    });
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(serviceWorkerCaches.static.name).then(function(cache) {
      // cache the items that would be included in a typical app install
      return cache.addAll([
        '/',
        '/styles/styles.css',
        '/images/icon_128.png',
        '/images/icon_192.png',
        '/images/icon_512.png',
        '/images/icon.png',
        '/images/icon_dark_mode.png',
        '/scripts/home.js',
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        // clear old version of the cache - anything that doesn't match the
        // current version number gets dumped
        cacheNames.filter(function(cacheName) {
          if (cacheName === serviceWorkerCaches.static.name) {
            return false;
          }

          if (cacheName === serviceWorkerCaches.dynamic.name) {
            return false;
          }

          return true;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  // try cache, fallback to network, update cache with response
  event.respondWith(cacheThenUpdate(event));
});

addEventListener("message", (messageEvent) => {
  if (messageEvent.data === "clean up") {
    // loop though the caches
    for (let key in serviceWorkerCaches) {
      // if the cache has a limit
      if (serviceWorkerCaches[key].limit != null) {
        // trim it to that limit
        trimCache(serviceWorkerCaches[key].name, serviceWorkerCaches[key].limit);
      }
    }
  }
});
