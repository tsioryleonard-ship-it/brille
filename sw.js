// Service worker : permet d'ouvrir l'application même sans réseau.
// Quand vous modifiez des fichiers, changez simplement le numéro de VERSION ci-dessous.
const VERSION = 'main-tendue-v2';
const FICHIERS = [
  './', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest',
  'config.json', 'petales.json', 'defis.json', 'rendezvous.json',
  'logo-brille.png', 'icon-192.png', 'icon-512.png', 'favicon.png', 'apple-touch-icon.png',
  'gruppo-latin-400-normal.woff2',
  'quicksand-latin-300-normal.woff2', 'quicksand-latin-400-normal.woff2',
  'quicksand-latin-500-normal.woff2', 'quicksand-latin-600-normal.woff2',
  'quicksand-latin-700-normal.woff2'
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
  const estDonnee = /\/(config|petales|defis|rendezvous)\.json/.test(req.url);
  if (estDonnee) {
    e.respondWith(
      fetch(req).then(r => { const copie = r.clone(); caches.open(VERSION).then(c => c.put(req, copie)); return r; })
        .catch(() => caches.match(req))
    );
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req)));
  }
});
