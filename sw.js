// imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
  // '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js'
];

const APP_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js'
];

self.addEventListener('install', e => {

  const cacheStaticProm = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));
  const cacheInmutableProm = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_INMUTABLE));

  e.waitUntil(Promise.all([cacheStaticProm, cacheInmutableProm]));
});

self.addEventListener('activate', e => {
  const checkCacheProm = caches.keys().then(
    keys => {
      keys.forEach(key => {
        if (key !== STATIC_CACHE && key.includes('static')) {
          return caches.delete(key);
        }
      });
    }
  );
  e.waitUntil(checkCacheProm);
});

self.addEventListener('fetch', e => {
  const resourceProm = caches.match(e.request.url).then(
    res => {
      if (res) {
        return res;
      } else {
        return fetch(e.request).then(
          fetchRes => {
            return updateDynamicCache(DYNAMIC_CACHE, e.request, fetchRes);
          }
        );
      }
    }
  );
  e.waitUntil(resourceProm);
});