// ==========================================
// 📱 Service Worker — مجمع طلاب BIS (PWA)
// ==========================================

const CACHE_NAME = 'bis-hub-v6';

const STATIC_ASSETS = [
  './',
  'index.html',
  'courses.html',
  'course.html',
  'lecture.html',
  'about.html',
  'contact.html',
  'ask.html',
  'login.html',
  'signup.html',
  'css/style.css',
  'css/responsive.css',
  'css/login.css',
  'css/ask.css',
  'css/chatbot.css',
  'js/data.js',
  'js/main.js',
  'js/courses.js',
  'js/course.js',
  'js/lecture.js',
  'js/ask.js',
  'js/chatbot.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-512-maskable.png',
  'apple-touch-icon.png',
  'assets/icons/logo.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-cache warning:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Don't intercept cross-origin requests (e.g. Firebase, Google Fonts, YouTube, docs.google.com)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Config file (js/config.js): Always fetch live from network, never cache
  if (url.pathname.endsWith('/js/config.js') || url.pathname.endsWith('/config.js')) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' }).catch(() => caches.match(request))
    );
    return;
  }

  // Navigation (HTML pages): Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((res) => res || caches.match('./') || caches.match('index.html'));
        })
    );
    return;
  }

  // Static Assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
