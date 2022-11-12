importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const __v = '0.0.0';
addEventListener('message', event => {
    event.source.postMessage({ version: __v });
});


self.__WB_DISABLE_DEV_LOGS = true


workbox.routing.registerRoute(
    ({ request }) =>
        request.destination === 'image', new workbox.strategies.CacheFirst()
)
workbox.routing.registerRoute(
    new RegExp('.+\\.js$'), new workbox.strategies.NetworkFirst()
)

workbox.routing.registerRoute(
    new RegExp('.+\\.css$'), new workbox.strategies.NetworkFirst()
)

// * Cache all
self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
});
