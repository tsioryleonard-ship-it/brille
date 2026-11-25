/* Étincelle · BRILLE — habillage de Noël (automatique)
   Visible du 25 novembre 2026 au 6 janvier 2027, puis disparaît tout seul. Aucune publication à refaire.
   Pour l'essayer à tout moment : ajoutez ?noel=1 à l'adresse de l'application (?noel=0 pour le cacher).
   Le vert Étincelle (#cbe1b6) reste la couleur principale : on ajoute seulement de la neige et un petit mot. */
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
  /* Fond : un léger dégradé vert Étincelle pour que les flocons blancs se voient bien */
  .noel .fond{background:linear-gradient(180deg,#d9ebc8 0%,#e9f3df 45%,#fbfdf8 100%)}
  .noel .hero-accueil{box-shadow:0 0 0 3px #fff inset,0 0 0 5px #cbe1b6 inset}
  .noel-mot{display:flex;gap:10px;align-items:center;margin:0 0 14px;padding:12px 16px;border-radius:22px;background:#cbe1b6;color:#261f2b;font-weight:600;line-height:1.35;border:2px dashed #fff;outline:2px solid #cbe1b6}
  .noel-mot .sap{font-size:1.7rem;flex:none}
  .noel-mot small{display:block;font-weight:500;opacity:.85}
  #noel-neige{position:fixed;inset:0;width:100%;height:100%;z-index:9;pointer-events:none}
  @media print{#noel-neige,.noel-mot{display:none}}`;
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
  const N = () => Math.min(34, Math.round(L / 14));
  const neuf = haut => ({ x: Math.random() * L, y: haut ? -20 : Math.random() * H, r: 5 + Math.random() * 7, v: .35 + Math.random() * .7, d: Math.random() * 6.28, a: Math.random() * 6.28, w: (Math.random() - .5) * .012 });
  dim(); flocons = Array.from({ length: N() }, () => neuf(false));
  addEventListener('resize', () => { dim(); flocons = Array.from({ length: N() }, () => neuf(false)); });
  document.addEventListener('visibilitychange', () => { enCours = !document.hidden; if (enCours) boucle(); });
  /* Vrai flocon : 6 branches avec de petites barbes */
  function flocon(f) {
    ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.a);
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      ctx.save(); ctx.rotate(k * Math.PI / 3);
      ctx.moveTo(0, 0); ctx.lineTo(0, -f.r);
      ctx.moveTo(0, -f.r * .55); ctx.lineTo(-f.r * .3, -f.r * .8);
      ctx.moveTo(0, -f.r * .55); ctx.lineTo(f.r * .3, -f.r * .8);
      ctx.restore();
    }
    ctx.stroke(); ctx.restore();
  }
  function boucle() {
    if (!enCours) return;
    ctx.clearRect(0, 0, L, H);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.7; ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(70,110,50,.45)'; ctx.shadowBlur = 3;   // petite ombre verte : le blanc reste visible
    flocons.forEach((f, i) => {
      f.y += f.v; f.d += .012; f.x += Math.sin(f.d) * .35; f.a += f.w;
      if (f.y > H + 20) flocons[i] = neuf(true);
      flocon(f);
    });
    requestAnimationFrame(boucle);
  }
  boucle();
})();
