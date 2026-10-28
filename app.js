/* Main tendue · BRILLE
   Application sans serveur : tout ce que la famille saisit reste dans son téléphone. */
(() => {
  'use strict';

  /* ---------- Outils ---------- */
  const $app = document.getElementById('app');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CLE = 'brille-main-tendue-v1';
  const jour = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const debutSemaine = (d = new Date()) => { const x = jour(d); const j = (x.getDay() + 6) % 7; x.setDate(x.getDate() - j); return iso(x); };
  const dateCourte = s => { const [y, m, d] = s.split('-').map(Number); return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`; };
  const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  /* ---------- Stockage local (avec solution de repli si le téléphone le bloque) ---------- */
  let memoire = null;
  const vide = () => ({ v: 1, bilans: {}, defisFaits: {} });
  const charger = () => {
    if (memoire) return memoire;
    try { const brut = localStorage.getItem(CLE); memoire = brut ? Object.assign(vide(), JSON.parse(brut)) : vide(); }
    catch { memoire = vide(); }
    return memoire;
  };
  const sauver = () => { try { localStorage.setItem(CLE, JSON.stringify(memoire)); return true; } catch { return false; } };
  const bilansDe = id => (charger().bilans[id] || []).slice().sort((a, b) => a.w.localeCompare(b.w));
  const dernierBilan = id => { const l = bilansDe(id); return l.length ? l[l.length - 1] : null; };

  /* ---------- Données ---------- */
  let D = { config: {}, petales: [], defis: [], rdv: [] };
  async function chargerDonnees() {
    const lire = async f => { const r = await fetch(`data/${f}.json`, { cache: 'no-cache' }); if (!r.ok) throw new Error(f); return r.json(); };
    const [config, petales, defis, rdv] = await Promise.all([lire('config'), lire('petales'), lire('defis'), lire('rendezvous')]);
    D = { config, petales, defis, rdv };
  }
  const petale = id => D.petales.find(p => p.id === id);

  /* ---------- Icônes des pétales (simples, dans l'esprit de la fleur enfant) ---------- */
  const ICONES = {
    emotions: '<path d="M24 41C8 29 5 18 11 12c5-5 11-2 13 3 2-5 8-8 13-3 6 6 3 17-13 29z" fill="#cf3a45"/><path d="M14 17c1-3 4-4 6-3" stroke="#f08a92" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M33 34c3 0 6-2 6-5s-3-4-4-2c-1-2-5-1-4 2 0 2 1 4 2 5z" fill="#fbe2e4" stroke="#cf3a45" stroke-width="1.2"/>',
    apprentissages: '<rect x="7" y="13" width="10" height="27" rx="2" fill="#fdb27a"/><rect x="18" y="8" width="10" height="32" rx="2" fill="#d98c9f"/><rect x="29" y="11" width="11" height="29" rx="2" transform="rotate(8 34 25)" fill="#6f89b8"/><rect x="21" y="12" width="4" height="12" rx="1" fill="#fff4ee"/>',
    liens: '<path d="M8 8h22a4 4 0 014 4v10a4 4 0 01-4 4H18l-7 6v-6H8a4 4 0 01-4-4V12a4 4 0 014-4z" fill="#9a90c9"/><path d="M18 20h22a4 4 0 014 4v9a4 4 0 01-4 4h-2v6l-7-6H18a4 4 0 01-4-4v-9a4 4 0 014-4z" fill="#f49f4c" opacity=".95"/><circle cx="24" cy="29" r="1.6" fill="#fff"/><circle cx="30" cy="29" r="1.6" fill="#fff"/><circle cx="36" cy="29" r="1.6" fill="#fff"/>',
    droits: '<path d="M24 6L5 22h5v18h28V22h5z" fill="#a4c2e7"/><path d="M24 4L3 22h6L24 9l15 13h6z" fill="#d9877a"/><rect x="20" y="28" width="9" height="12" rx="2" fill="#fff3e6"/><circle cx="26.5" cy="34" r="1" fill="#d9877a"/><rect x="12" y="25" width="6" height="6" rx="1.2" fill="#fff3e6"/>',
    equilibre: '<rect x="5" y="14" width="33" height="22" rx="5" fill="#8fa88a"/><rect x="38" y="21" width="5" height="8" rx="2" fill="#6c6470"/><path d="M25 17l-9 10h6l-2 8 10-12h-6z" fill="#f49f4c"/>',
    briller: '<circle cx="24" cy="24" r="9.5" fill="#ffe08a" stroke="#e8912b" stroke-width="2"/><g stroke="#e8912b" stroke-width="3.2" stroke-linecap="round"><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.6 10.6l4.2 4.2M33.2 33.2l4.2 4.2M10.6 37.4l4.2-4.2M33.2 14.8l4.2-4.2"/></g>',
    organisation: '<rect x="6" y="9" width="36" height="31" rx="5" fill="#e3f3fd" stroke="#9fc6e0" stroke-width="2"/><rect x="6" y="9" width="36" height="9" rx="5" fill="#9fc6e0"/><g><rect x="11" y="22" width="6" height="5" rx="1.2" fill="#e0d68c"/><rect x="21" y="22" width="6" height="5" rx="1.2" fill="#0a8fd0"/><rect x="31" y="22" width="6" height="5" rx="1.2" fill="#e08a92"/><rect x="11" y="31" width="6" height="5" rx="1.2" fill="#a5bd90"/><rect x="21" y="31" width="6" height="5" rx="1.2" fill="#e08a92"/><rect x="31" y="31" width="6" height="5" rx="1.2" fill="#e0d68c"/></g>'
  };
  const icone = (id, taille) => `<svg viewBox="0 0 48 48" ${taille ? `width="${taille}" height="${taille}"` : ''} aria-hidden="true">${ICONES[id] || ''}</svg>`;

  /* ---------- Visages de l'échelle ---------- */
  const VISAGES = [
    { c: '#f5abaf', b: 'M12 29 Q20 21 28 29', t: 'Pas du tout' },
    { c: '#fdd5a5', b: 'M13 28 Q20 24 27 28', t: 'Un peu' },
    { c: '#f8f4b8', b: 'M13 27 L27 27', t: 'Moyen' },
    { c: '#cbe1b6', b: 'M12 25 Q20 32 28 25', t: 'Plutôt oui' },
    { c: '#a8dbeb', b: 'M11 24 Q20 36 29 24', t: 'Tout à fait' }
  ];
  const visage = i => `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="${VISAGES[i].c}" stroke="#000" stroke-width="1.8"/><circle cx="14" cy="16" r="1.9" fill="#000"/><circle cx="26" cy="16" r="1.9" fill="#000"/><path d="${VISAGES[i].b}" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>`;

  /* ---------- Fleur interactive ---------- */
  const FORME = 'M0 -30C20 -38 42 -62 42 -100C42 -138 24 -162 2 -162C-26 -162 -44 -136 -42 -100C-40 -66 -20 -42 0 -30Z';
  const ANGLE0 = 31, PAS = 360 / 7;
  function fleurSVG() {
    const parts = D.petales.map((p, i) => {
      const a = ANGLE0 + i * PAS, r = a * Math.PI / 180;
      const b = dernierBilan(p.id);
      const s = b ? 0.82 + 0.045 * b.s : 0.9;
      const op = b ? 1 : 0.8;
      const ix = 200 + Math.sin(r) * 100 * s, iy = 200 - Math.cos(r) * 100 * s;
      const lab = `${p.titre}${b ? `, dernier bilan ${b.s} sur 5` : ', pas encore de bilan'}`;
      return `<a href="#/petale/${p.id}" class="petale" aria-label="${esc(lab)}">
        <g class="forme" style="transform: translate(200px,200px) rotate(${a}deg) scale(${s}); opacity:${op}"><path d="${FORME}" fill="${p.couleur}"/></g>
        <g transform="translate(${ix - 20} ${iy - 20}) scale(.83)" style="pointer-events:none">${ICONES[p.id]}</g>
      </a>`;
    }).join('');
    return `<svg viewBox="38 38 324 324" role="group" aria-label="Ma fleur : sept pétales à explorer">
      <defs>
        <radialGradient id="halo"><stop offset="55%" stop-color="#fbf8cc"/><stop offset="86%" stop-color="#fbf8cc"/><stop offset="100%" stop-color="#fde3d0" stop-opacity="0"/></radialGradient>
        <linearGradient id="sourire" x1="0" x2="1"><stop offset="0" stop-color="#ffc9a8"/><stop offset=".25" stop-color="#fffaa8"/><stop offset=".5" stop-color="#b8f5c8"/><stop offset=".7" stop-color="#9ef2ff"/><stop offset="1" stop-color="#cdb6ff"/></linearGradient>
      </defs>
      ${parts}
      <g class="centre" style="pointer-events:none">
        <circle cx="200" cy="200" r="52" fill="url(#halo)"/>
        <circle cx="200" cy="200" r="42" fill="#fbf8cc"/>
        <path d="M176 196Q200 232 224 196Q200 216 176 196Z" fill="url(#sourire)"/>
        <path d="M172 188q-2 7 2 12q0-8 7-10q-5-3-9-2z" fill="#f49f4c"/>
        <path d="M228 188q2 7-2 12q0-8-7-10q5-3 9-2z" fill="#f49f4c"/>
      </g>
    </svg>`;
  }

  /* ---------- Vues ---------- */
  function vueAccueil() {
    const defi = defiCourant();
    const lignes = D.petales.map(p => {
      const b = dernierBilan(p.id);
      return `<li><a class="ligne-petale" href="#/petale/${p.id}" style="background:${p.couleur}">
        <span class="pastille">${icone(p.id)}</span>
        <span class="txt"><strong>${esc(p.titre)}</strong><small>${esc(p.sousTitre)}</small></span>
        ${b ? `<span class="score" aria-label="Dernier bilan ${b.s} sur 5">${b.s}/5</span>` : ''}
      </a></li>`;
    }).join('');
    return `<section class="vue">
      <h1>Ma fleur de parent</h1>
      <p class="intro">${esc(D.config.messageAccueil)}</p>
      <div class="fleur-bloc">${fleurSVG()}</div>
      <p class="legende">Touchez un pétale pour l'explorer. Plus un pétale est grand, mieux vous vous y sentez.</p>
      <ul class="liste-petales">${lignes}</ul>
      ${defi ? `<a class="carte teinte" href="#/defi" style="display:block;text-decoration:none;background:${petale(defi.petale)?.couleur || 'var(--jaune)'}">
        <span class="etiquette">Défi de la semaine</span>
        <h3>${esc(defi.titre)}</h3>
        <p style="margin:0">${esc(defi.consigne.split('. ')[0])}.</p></a>` : ''}
    </section>`;
  }

  function vuePetale(id) {
    const p = petale(id);
    if (!p) return vueIntrouvable();
    const i = D.petales.indexOf(p), suivant = D.petales[(i + 1) % D.petales.length];
    const sem = debutSemaine();
    const histo = bilansDe(id);
    const actuel = histo.find(b => b.w === sem);
    const recents = histo.slice(-8);
    const barres = recents.map(b => `<div class="barre" style="height:${b.s * 18}px" title="${dateCourte(b.d)} : ${b.s}/5"><span>${dateCourte(b.d)}</span></div>`).join('');
    const notes = histo.filter(b => b.n).slice(-3).reverse().map(b => `<li><time>${dateCourte(b.d)}</time>${esc(b.n)}</li>`).join('');
    const echelle = VISAGES.map((v, k) => `<button type="button" data-note="${k + 1}" aria-pressed="${actuel && actuel.s === k + 1 ? 'true' : 'false'}" aria-label="${k + 1} sur 5, ${v.t}">${visage(k)}<span>${v.t}</span></button>`).join('');
    return `<section class="vue" style="--puce:${p.couleur}">
      <a class="retour" href="#/">← Ma fleur</a>
      <div class="hero-petale" style="background:${p.couleur}">
        <div class="icone">${icone(p.id)}</div>
        <h1>${esc(p.titre)}</h1>
        <p class="ss">${esc(p.sousTitre)}</p>
        <p class="miroir">Côté enfant, ce pétale s'appelle : « ${esc(p.miroir)} »</p>
      </div>

      <div class="carte"><h2>Pour y voir plus clair</h2><p style="margin:0">${esc(p.intro)}</p></div>

      <div class="carte" id="bilan">
        <h2>Mon bilan de la semaine</h2>
        <p style="margin-bottom:0">${esc(p.question)}</p>
        <div class="echelle" role="group" aria-label="Mon bilan sur 5">${echelle}</div>
        <label for="note" class="aide">Un mot pour moi, si j'en ai envie (facultatif, reste sur mon téléphone)</label>
        <textarea id="note" maxlength="300" placeholder="Ce qui a aidé, ce qui a été difficile…">${esc(actuel?.n || '')}</textarea>
        <button class="btn plein" id="enregistrer" type="button" style="margin-top:12px">Enregistrer mon bilan</button>
        <p class="ok" id="retour-ok" role="status"></p>
        ${recents.length ? `<h3 style="margin-top:14px">Mon évolution</h3><div class="histo-wrap"><div class="historique" aria-label="Historique de mes bilans">${barres}</div></div>` : ''}
        ${notes ? `<ul class="liste-notes">${notes}</ul>` : ''}
      </div>

      <div class="carte"><h2>Petites pratiques à essayer</h2><ul class="pratiques">${p.pratiques.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="carte"><h3>Une phrase à essayer</h3><p class="phrase">${esc(p.phrase)}</p>${p.note ? `<div class="note-soutien">${esc(p.note)}</div>` : ''}</div>
      <a class="btn discret plein" href="#/petale/${suivant.id}">Pétale suivant : ${esc(suivant.titre)} →</a>
    </section>`;
  }

  function lierPetale(id) {
    let choix = null;
    const sem = debutSemaine(), actuel = bilansDe(id).find(b => b.w === sem);
    if (actuel) choix = actuel.s;
    const boutons = [...$app.querySelectorAll('.echelle button')];
    boutons.forEach(b => b.addEventListener('click', () => {
      choix = Number(b.dataset.note);
      boutons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }));
    $app.querySelector('#enregistrer').addEventListener('click', () => {
      const ok = $app.querySelector('#retour-ok');
      if (!choix) { ok.style.color = '#a33'; ok.textContent = 'Choisissez d\'abord un visage de 1 à 5.'; return; }
      const S = charger();
      const liste = (S.bilans[id] || []).filter(b => b.w !== sem);
      liste.push({ w: sem, d: iso(new Date()), s: choix, n: $app.querySelector('#note').value.trim() });
      S.bilans[id] = liste.slice(-52);
      const stocke = sauver();
      ok.style.color = '';
      ok.textContent = stocke ? 'Bilan enregistré sur votre téléphone. Merci !' : 'Enregistré pour cette session seulement : votre navigateur bloque le stockage.';
      setTimeout(() => rendre(), 900);
    });
  }

  /* ----- Défi ----- */
  function indexDefi() {
    const n = D.defis.length; if (!n) return 0;
    const debut = new Date(D.config.debutDefis + 'T00:00:00');
    const sem = Math.floor((jour(new Date()) - debut) / (7 * 864e5));
    return ((sem < 0 ? 0 : sem) % n);
  }
  const defiCourant = () => D.defis[indexDefi()];
  function vueDefi(param) {
    const n = D.defis.length; if (!n) return vueIntrouvable();
    const base = indexDefi();
    const idx = param === undefined || param === '' ? base : Math.min(Math.max(Number(param) || 0, 0), n - 1);
    const d = D.defis[idx], p = petale(d.petale);
    const fait = !!charger().defisFaits[d.id];
    return `<section class="vue">
      <h1>Le défi de la semaine</h1>
      <div class="defi" style="background:${p?.couleur || 'var(--jaune)'}">
        <span class="etiquette">${idx === base ? 'Cette semaine' : `Défi ${idx + 1} sur ${n}`}${p ? ` · ${esc(p.titre)}` : ''}</span>
        <h2 style="margin-top:4px">${esc(d.titre)}</h2>
        <p class="duree">⏱ ${esc(d.duree)}</p>
        <p style="margin:0">${esc(d.consigne)}</p>
        ${d.plus ? `<p class="plus"><b>Pour aller plus loin :</b> ${esc(d.plus)}</p>` : ''}
        <label class="coche"><input type="checkbox" id="fait" ${fait ? 'checked' : ''}> J'ai essayé ce défi</label>
      </div>
      <div class="nav-defis">
        <a class="btn discret" href="#/defi/${(idx - 1 + n) % n}">← Précédent</a>
        ${idx !== base ? `<a class="btn discret" href="#/defi">Cette semaine</a>` : ''}
        <a class="btn discret" href="#/defi/${(idx + 1) % n}">Suivant →</a>
      </div>
      ${p ? `<a class="btn discret plein" href="#/petale/${p.id}">Voir le pétale « ${esc(p.titre)} »</a>` : ''}
      <p class="petit" style="margin-top:14px">Un seul défi à la fois suffit. Si ce n'est pas le bon moment, passez au suivant, sans culpabilité.</p>
    </section>`;
  }
  function lierDefi(param) {
    const c = $app.querySelector('#fait'); if (!c) return;
    const n = D.defis.length, base = indexDefi();
    const idx = param === undefined || param === '' ? base : Math.min(Math.max(Number(param) || 0, 0), n - 1);
    c.addEventListener('change', () => { const S = charger(); if (c.checked) S.defisFaits[D.defis[idx].id] = iso(new Date()); else delete S.defisFaits[D.defis[idx].id]; sauver(); });
  }

  /* ----- Rendez-vous ----- */
  function parseHeure(h) { const m = /(\d{1,2})\s*h\s*(\d{2})?(?:\s*[-–]\s*(\d{1,2})\s*h\s*(\d{2})?)?/i.exec(h || ''); if (!m) return null; return { d: [+m[1], +(m[2] || 0)], f: m[3] ? [+m[3], +(m[4] || 0)] : null }; }
  function fichierICS(r) {
    const [y, mo, d] = r.date.split('-').map(Number), h = parseHeure(r.heure);
    const p2 = n => String(n).padStart(2, '0');
    let debut, fin;
    if (h) {
      debut = `DTSTART:${y}${p2(mo)}${p2(d)}T${p2(h.d[0])}${p2(h.d[1])}00`;
      const f = h.f || [h.d[0] + 1, h.d[1]];
      fin = `DTEND:${y}${p2(mo)}${p2(d)}T${p2(f[0])}${p2(f[1])}00`;
    } else { debut = `DTSTART;VALUE=DATE:${y}${p2(mo)}${p2(d)}`; fin = `DTEND;VALUE=DATE:${y}${p2(mo)}${p2(d + 1)}`; }
    const t = s => String(s || '').replace(/[,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BRILLE//Main tendue//FR', 'BEGIN:VEVENT', `UID:${r.date}-${Math.abs([...r.titre].reduce((a, c) => a * 31 + c.charCodeAt(0) | 0, 7))}@brille`, `DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d+/g, '')}`, debut, fin, `SUMMARY:${t(r.titre)}`, `LOCATION:${t([r.lieu, r.adresse].filter(Boolean).join(', '))}`, `DESCRIPTION:${t(r.description)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  function carteRdv(r, k) {
    const [y, m, d] = r.date.split('-').map(Number), dt = new Date(y, m - 1, d);
    return `<article class="carte"><div class="rdv">
      <div class="date"><small>${MOIS[m - 1]}</small><b>${d}</b><small>${JOURS[dt.getDay()].slice(0, 3)}.</small></div>
      <div style="flex:1;min-width:0">
        ${r.exemple ? '<span class="badge-exemple">Exemple à remplacer</span>' : ''}
        <h3>${esc(r.titre)}</h3>
        <p>${esc(r.heure)}</p>
        <p>${esc(r.lieu)}${r.adresse ? `<br>${esc(r.adresse)}` : ''}</p>
        ${r.description ? `<p class="petit">${esc(r.description)}</p>` : ''}
        <button class="btn discret" type="button" data-ics="${k}" style="min-height:40px;padding:6px 16px;font-size:.9rem">Ajouter à mon agenda</button>
      </div></div></article>`;
  }
  function vueRdv() {
    const auj = iso(new Date());
    const tri = D.rdv.map((r, k) => ({ r, k })).sort((a, b) => a.r.date.localeCompare(b.r.date));
    const venir = tri.filter(x => x.r.date >= auj), passe = tri.filter(x => x.r.date < auj).reverse();
    return `<section class="vue">
      <h1>Nos rendez-vous</h1>
      <p class="intro">Retrouvez-nous au centre social : c'est là que tout se passe, ensemble.</p>
      ${venir.length ? venir.map(x => carteRdv(x.r, x.k)).join('') : '<div class="carte"><p style="margin:0">Aucun rendez-vous à venir pour le moment. Revenez bientôt, ou demandez les prochaines dates à l\'accueil du centre social.</p></div>'}
      ${passe.length ? `<details class="carte"><summary>Rendez-vous passés (${passe.length})</summary>${passe.map(x => `<div style="padding:6px 0;border-top:1px solid var(--trait)"><b>${dateCourte(x.r.date)}</b> · ${esc(x.r.titre)}</div>`).join('')}</details>` : ''}
    </section>`;
  }
  function lierRdv() {
    $app.querySelectorAll('[data-ics]').forEach(b => b.addEventListener('click', () => {
      const r = D.rdv[Number(b.dataset.ics)];
      const blob = new Blob([fichierICS(r)], { type: 'text/calendar;charset=utf-8' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `rendez-vous-${r.date}.ics`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }));
  }

  /* ----- Plus ----- */
  let invitationInstall = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); invitationInstall = e; const b = document.getElementById('btn-install'); if (b) b.hidden = false; });
  function vuePlus() {
    const c = D.config.contact || {};
    return `<section class="vue">
      <h1>Plus</h1>
      <details class="carte" open><summary>Installer l'application sur mon téléphone</summary>
        <p>Pour la retrouver comme une application, sans passer par un magasin d'applications :</p>
        <button class="btn plein" id="btn-install" type="button" hidden>Installer Main tendue</button>
        <p class="petit"><b>iPhone</b> (Safari) : touchez le bouton Partager, puis « Sur l'écran d'accueil ».<br><b>Android</b> (Chrome) : touchez le menu ⋮, puis « Installer l'application » ou « Ajouter à l'écran d'accueil ».</p>
      </details>

      <details class="carte"><summary>Besoin d'un soutien ?</summary>
        <p>Vous n'avez pas à tout porter seul·e. Votre référent famille du centre social peut vous écouter et vous orienter. En cas de besoin immédiat :</p>
        <ul class="numeros">
          <li><span>Enfant en danger ou inquiétude pour un enfant</span><b>119</b></li>
          <li><span>Prévention du suicide, écoute 24h/24</span><b>3114</b></li>
          <li><span>Urgence médicale / urgence en Europe</span><b>15 · 112</b></li>
        </ul>
      </details>

      <details class="carte"><summary>Mes données et ma vie privée</summary>
        <p>Vos bilans et vos notes sont enregistrés <b>uniquement sur ce téléphone</b>. Il n'y a ni compte, ni serveur : BRILLE ne les voit pas et ne peut pas les récupérer. Ne saisissez pas de noms ni d'informations sensibles.</p>
        <p class="petit">Si vous changez de téléphone ou videz les données du navigateur, vous perdez l'historique, sauf si vous l'exportez.</p>
        <button class="btn discret plein" id="exporter" type="button">Enregistrer une copie de mes données</button>
        <label class="btn discret plein" style="margin-top:10px">Récupérer une copie<input type="file" id="importer" accept="application/json,.json" hidden></label>
        <button class="btn alerte plein" id="effacer" type="button" style="margin-top:10px">Effacer toutes mes données</button>
        <p class="ok" id="retour-donnees" role="status"></p>
      </details>

      <details class="carte"><summary>À propos de Main tendue</summary>
        <p>Main tendue est le groupe de parents proposé en centre social par <b>BRILLE</b>, qui accompagne la qualité de vie de l'enfant (QVE) de 6 à 12 ans et de sa famille.</p>
        <p>Cette application prolonge les ateliers : la fleur des parents répond en miroir à la fleur de l'enfant, car le parent joue un rôle essentiel dans la qualité de vie de son enfant.</p>
        <p class="petit">Main tendue accompagne le bien-être familial. Elle ne remplace pas l'avis d'un médecin ou d'un professionnel de la santé ou du soutien psychologique.</p>
      </details>

      <details class="carte"><summary>Contacter BRILLE</summary>
        <p>${esc(c.nom || '')}</p>
        ${c.email ? `<p><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>` : ''}
        ${c.telephone ? `<p><a href="tel:${esc(String(c.telephone).replace(/\s/g, ''))}">${esc(c.telephone)}</a></p>` : ''}
      </details>
      <p class="pied">Conçue et développée par ${esc(c.nom || 'BRILLE')}<br>© BRILLE · Main tendue</p>
    </section>`;
  }
  function lierPlus() {
    const bi = $app.querySelector('#btn-install');
    if (bi && invitationInstall) { bi.hidden = false; bi.addEventListener('click', async () => { invitationInstall.prompt(); await invitationInstall.userChoice; invitationInstall = null; bi.hidden = true; }); }
    const msg = t => { const o = $app.querySelector('#retour-donnees'); o.textContent = t; };
    $app.querySelector('#exporter').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(charger(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `main-tendue-mes-donnees-${iso(new Date())}.json`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      msg('Copie enregistrée dans les fichiers de votre téléphone.');
    });
    $app.querySelector('#importer').addEventListener('change', async e => {
      const f = e.target.files[0]; if (!f) return;
      try {
        const d = JSON.parse(await f.text());
        if (!d || typeof d !== 'object' || typeof d.bilans !== 'object') throw new Error('format');
        memoire = Object.assign(vide(), { bilans: d.bilans || {}, defisFaits: d.defisFaits || {} }); sauver();
        msg('Vos données ont été récupérées.');
      } catch { msg('Ce fichier n\'est pas une copie valide de Main tendue.'); }
    });
    $app.querySelector('#effacer').addEventListener('click', () => {
      if (!confirm('Effacer tous vos bilans, notes et défis ? Cette action est définitive.')) return;
      memoire = vide(); sauver(); msg('Toutes vos données ont été effacées.');
    });
  }

  function vueIntrouvable() {
    return `<section class="vue"><h1>Page introuvable</h1><p>Cette page n'existe pas.</p><a class="btn" href="#/">Retour à ma fleur</a></section>`;
  }

  /* ---------- Routeur ---------- */
  let premiere = true;
  function rendre() {
    const h = location.hash.replace(/^#\/?/, '');
    const [r, param] = h.split('/');
    let html, tab, titre = 'Main tendue · BRILLE', apres = () => { };
    if (!r) { html = vueAccueil(); tab = 'fleur'; }
    else if (r === 'petale') { html = vuePetale(param); tab = 'fleur'; apres = () => lierPetale(param); titre = `${petale(param)?.titre || 'Pétale'} · Main tendue`; }
    else if (r === 'defi') { html = vueDefi(param); tab = 'defi'; apres = () => lierDefi(param); titre = 'Défi de la semaine · Main tendue'; }
    else if (r === 'rendez-vous') { html = vueRdv(); tab = 'rdv'; apres = lierRdv; titre = 'Rendez-vous · Main tendue'; }
    else if (r === 'plus') { html = vuePlus(); tab = 'plus'; apres = lierPlus; titre = 'Plus · Main tendue'; }
    else { html = vueIntrouvable(); tab = ''; }
    $app.innerHTML = html;
    document.title = titre;
    document.querySelectorAll('.tabbar a').forEach(a => { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    apres();
    if (!premiere) { window.scrollTo(0, 0); $app.focus({ preventScroll: true }); }
    premiere = false;
  }
  window.addEventListener('hashchange', rendre);

  /* ---------- Démarrage ---------- */
  chargerDonnees().then(rendre).catch(() => {
    $app.innerHTML = '<section class="vue"><h1>Oups</h1><p>Impossible de charger le contenu. Vérifiez votre connexion et rechargez la page.</p></section>';
  });
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
  }
})();
