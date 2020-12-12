const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "index.js",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// to install 
self.addEventListener("install", function (evt){
    evt.waitUntil (
        caches.open(CACHE_NAME).then (cache => {
            console.log("Files have been cached.");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// to activate
self.addEventListener("activate", function (evt) {
    evt.waitUntil (
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("deleting cache data.", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim()
});

// todo finish fetch below.