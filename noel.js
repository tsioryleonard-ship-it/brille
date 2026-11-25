/* Étincelle · BRILLE — habillage de Noël (automatique)
   Visible du 25 novembre 2026 au 6 janvier 2027, puis disparaît tout seul. Aucune publication à refaire.
   Pour l'essayer à tout moment : ajoutez ?noel=1 à l'adresse de l'application (?noel=0 pour le cacher).
   Le vert Étincelle (#cbe1b6) reste la couleur principale : on ajoute seulement des guirlandes, de la neige et un petit mot. */
(() => {
  'use strict';
  const DEBUT = '2026-11-25', FIN = '2027-01-06';
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  let force = null;
  try { const m = location.search.match(/[?&]noel=([01])/); if (m) force = m[1] === '1'; } catch { }
  const auj = iso(new Date());
  const actif = force !== null ? force : (auj >= DEBUT && auj <= FIN);
  if (!actif) return;

  const sobre = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('noel');

  const st = document.createElement('style');
  st.textContent = `
  /* Guirlande sous l'en-tête : fil vert Étincelle + petites lumières aux couleurs des pétales */
  .noel .topbar::after{content:"";position:absolute;left:0;right:0;bottom:-12px;height:18px;pointer-events:none;z-index:2;
    background:
      radial-gradient(circle at 12px 11px,#f49f4c 0 4px,transparent 5px),
      radial-gradient(circle at 36px 13px,#f5abaf 0 4px,transparent 5px),
      radial-gradient(circle at 60px 11px,#f8f4b8 0 4px,transparent 5px),
      radial-gradient(circle at 84px 13px,#a4c2e7 0 4px,transparent 5px),
      linear-gradient(#8fb674,#8fb674) 0 4px/100% 2px no-repeat;
    background-size:96px 18px,96px 18px,96px 18px,96px 18px,100% 18px;
    animation:noel-lueur 2.6s ease-in-out infinite}
  @keyframes noel-lueur{0%,100%{opacity:1}50%{opacity:.62}}
  .noel .hero-accueil{box-shadow:0 0 0 3px #fff inset,0 0 0 5px #cbe1b6 inset}
  .noel-mot{display:flex;gap:10px;align-items:center;margin:0 0 14px;padding:12px 16px;border-radius:22px;background:#cbe1b6;color:#261f2b;font-weight:600;line-height:1.35;border:2px dashed #fff;outline:2px solid #cbe1b6}
  .noel-mot .sap{font-size:1.7rem;flex:none}
  .noel-mot small{display:block;font-weight:500;opacity:.85}
  #noel-neige{position:fixed;inset:0;width:100%;height:100%;z-index:9;pointer-events:none}
  @media print{#noel-neige,.noel-mot{display:none}.noel .topbar::after{display:none}}
  @media (prefers-reduced-motion:reduce){.noel .topbar::after{animation:none}}`;
  document.head.appendChild(st);

  /* Petit mot de fêtes, placé en haut de l'écran d'accueil (écran de code et fleur) */
  const app = document.getElementById('app');
  const poser = () => {
    if (!app || app.querySelector('.noel-mot')) return;
    const h = app.querySelector('.hero-accueil'); if (!h) return;
    const m = document.createElement('div'); m.className = 'noel-mot'; m.setAttribute('role', 'note');
    m.innerHTML = '<span class="sap" aria-hidden="true">🎄</span><span>Joyeuses fêtes en famille !<small>Un petit moment ensemble, c\'est le plus beau des cadeaux.</small></span>';
    h.before(m);
  };
  if (app) { poser(); new MutationObserver(poser).observe(app, { childList: true, subtree: true }); }

  /* Neige douce (désactivée si l'appareil demande moins d'animations) */
  if (sobre) return;
  const cv = document.createElement('canvas'); cv.id = 'noel-neige'; cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d'); let L = 0, H = 0, flocons = [], enCours = true;
  const dim = () => { const r = window.devicePixelRatio || 1; L = innerWidth; H = innerHeight; cv.width = L * r; cv.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0); };
  const N = () => Math.min(46, Math.round(L / 11));
  const neuf = haut => ({ x: Math.random() * L, y: haut ? -10 : Math.random() * H, r: 2 + Math.random() * 3.2, v: .35 + Math.random() * .75, d: Math.random() * Math.PI * 2 });
  dim(); flocons = Array.from({ length: N() }, () => neuf(false));
  addEventListener('resize', () => { dim(); flocons = Array.from({ length: N() }, () => neuf(false)); });
  document.addEventListener('visibilitychange', () => { enCours = !document.hidden; if (enCours) boucle(); });
  function boucle() {
    if (!enCours) return;
    ctx.clearRect(0, 0, L, H);
    ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.strokeStyle = 'rgba(111,156,86,.55)'; ctx.lineWidth = 1;   // contour vert : visible aussi sur fond blanc
    flocons.forEach((f, i) => {
      f.y += f.v; f.d += .012; f.x += Math.sin(f.d) * .35;
      if (f.y > H + 10) flocons[i] = neuf(true);
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.2832); ctx.fill(); ctx.stroke();
    });
    requestAnimationFrame(boucle);
  }
  boucle();
})();
