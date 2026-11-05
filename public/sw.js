/* سرویس‌ورکر ساده: اول شبکه، اگه اینترنت نبود از کش نشون بده */
const CACHE = 'karlist-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  // فقط GET و فقط همون سایت خودمون
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // درخواست‌های API همیشه مستقیم به سرور — کش نمی‌شن
  if (url.pathname.startsWith('/api/')) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone()
        caches
          .open(CACHE)
          .then((cache) => cache.put(request, copy))
          .catch(() => {})
        return response
      })
      .catch(() =>
        caches
          .match(request)
          .then((cached) => cached || caches.match('/'))
      )
  )
})
