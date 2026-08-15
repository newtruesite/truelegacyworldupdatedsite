const CACHE = 'true-legacy-app-v2'
const STATIC_ASSETS = ['/offline.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png']
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC_ASSETS))))
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())))
self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting() })
self.addEventListener('fetch', event => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline.html')))
    return
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok && ['style', 'script', 'font', 'image'].includes(request.destination)) {
      const copy = response.clone()
      caches.open(CACHE).then(cache => cache.put(request, copy))
    }
    return response
  })))
})
