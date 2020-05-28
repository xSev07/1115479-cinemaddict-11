const CACHE_PREFIX = `cinemaddict--cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

const ResponseStatus = {
  OK: 200
};

const ResponseType = {
  BASIC: `basic`
}

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/bundle.js`,
          `/css/normalize.css`,
          `/css/style.css`,
          `/images/background.png`,
          `/images/bitmap.png`,
          `/images/bitmap@2x.png`,
          `/images/bitmap@3x.png`,
          `/images/emoji/angry.png`,
          `/images/emoji/puke.png`,
          `/images/emoji/sleeping.png`,
          `/images/emoji/smile.png`,
          `/images/icons/icon-favorite.svg`,
          `/images/icons/icon-favorite-active.svg`,
          `/images/icons/icon-watched.svg`,
          `/images/icons/icon-watched-active.svg`,
          `/images/icons/icon-watchlist.svg`,
          `/images/icons/icon-watchlist-active.svg`
        ]);
      })
      .catch((err) => console.log(err))
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((key) => {
          if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
            return caches.delete(key);
          }

          return null;
        })
          .filter((key) => key !== null)
      ))
      .catch((err) => console.log(err))
  );
});

self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(
    caches.match(request)
      .then((cacheResponse) => {
        if (cacheResponse) {
          return cacheResponse;
        }

        return fetch(request)
          .then((response) => {
            if (!response || response.status !== ResponseStatus.OK || response.type !== ResponseType.BASIC) {
              return response;
            }

            const clonedResponse = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, clonedResponse));
            return response;
          });
      })
      .catch((err) => console.log(err))
  );
});
