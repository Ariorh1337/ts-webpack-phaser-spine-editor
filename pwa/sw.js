/**
 * You should only modify this, if you know what you are doing.
 * This phaser template is using workbox (https://developers.google.com/web/tools/workbox/)
 * to precache all assets.
 * It uses the InjectManifest function from 'workbox-webpack-plugin' inside
 * webpack/webpack.common.js
 */
import { precacheAndRoute } from 'workbox-precaching';

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

const cacheName = 'js13kPWA-v1';

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request);

        if (r) return r;

        const response = await fetch(e.request);

        if (e.request.url.startsWith("http")) {
            const cache = await caches.open(cacheName);
            cache.put(e.request, response.clone());
        }

        return response;
    })());
});
