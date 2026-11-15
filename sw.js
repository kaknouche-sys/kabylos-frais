/* Kabylos Notes de frais : l'appli s'ouvre même sans Internet */
const VERSION = "kcm-1.0.42";
const FICHIERS = ["./", "index.html", "apple-touch-icon.png", "app.js", "faceid.js", "fichiers.js", "secours.js", "config.js", "manifest.webmanifest", "vendor/supabase.js", "vendor/591.supabase.js", "vendor/jspdf.umd.min.js", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(L => Promise.all(L.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // la base (Supabase) passe toujours par Internet
  // réseau d'abord (pour recevoir les mises à jour), mémoire si pas de réseau
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
