// Service worker : permet d'ouvrir l'application même sans réseau.
// Quand vous modifiez des fichiers, changez simplement le numéro de VERSION ci-dessous.
const VERSION = 'main-tendue-v1';
const FICHIERS = [
  './', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest',
  'data/config.json', 'data/petales.json', 'data/defis.json', 'data/rendezvous.json',
  'assets/logo-brille.png', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/favicon.png', 'assets/apple-touch-icon.png',
  'fonts/gruppo-latin-400-normal.woff2',
  'fonts/quicksand-latin-300-normal.woff2', 'fonts/quicksand-latin-400-normal.woff2',
  'fonts/quicksand-latin-500-normal.woff2', 'fonts/quicksand-latin-600-normal.woff2',
  'fonts/quicksand-latin-700-normal.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n !== VERSION).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Les données (rendez-vous, défis...) : on essaie le réseau d'abord pour avoir la version à jour,
// sinon on retombe sur la copie enregistrée. Le reste : copie enregistrée d'abord.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const estDonnee = req.url.includes('/data/');
  if (estDonnee) {
    e.respondWith(
      fetch(req).then(r => { const copie = r.clone(); caches.open(VERSION).then(c => c.put(req, copie)); return r; })
        .catch(() => caches.match(req))
    );
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req)));
  }
});
