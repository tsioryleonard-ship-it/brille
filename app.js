/* Étincelle · BRILLE
   La suite des ateliers, à la maison, parent et enfant ensemble.
   Application sans serveur : tout ce que la famille saisit reste dans son téléphone. */
(() => {
  'use strict';

  /* ---------- Outils ---------- */
  const $app = document.getElementById('app');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CLE = 'brille-etincelle-v1';
  const jour = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const debutSemaine = (d = new Date()) => { const x = jour(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return iso(x); };
  const dateCourte = s => { const [, m, d] = s.split('-').map(Number); return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`; };

  /* ---------- Stockage local (avec solution de repli si le téléphone le bloque) ---------- */
  let memoire = null;
  const vide = () => ({ v: 1, mode: 'parent', bilans: {}, enfant: {}, defisFaits: {}, ensembleFaits: {} });
  const charger = () => {
    if (memoire) return memoire;
    try { const brut = localStorage.getItem(CLE); memoire = brut ? Object.assign(vide(), JSON.parse(brut)) : vide(); }
    catch { memoire = vide(); }
    return memoire;
  };
  const sauver = () => { try { localStorage.setItem(CLE, JSON.stringify(memoire)); return true; } catch { return false; } };
  const cle = qui => (qui === 'enfant' ? 'enfant' : 'bilans');
  const bilansDe = (id, qui = 'parent') => ((charger()[cle(qui)] || {})[id] || []).slice().sort((a, b) => a.w.localeCompare(b.w));
  const dernierBilan = (id, qui = 'parent') => { const l = bilansDe(id, qui); return l.length ? l[l.length - 1] : null; };

  /* ---------- Données ---------- */
  let D = { config: {}, petales: [], defis: [], formes: {} };
  async function chargerDonnees() {
    const lire = async f => { const r = await fetch(`${f}.json`, { cache: 'no-cache' }); if (!r.ok) throw new Error(f); return r.json(); };
    const [config, petales, defis, formes] = await Promise.all([lire('config'), lire('petales'), lire('defis'), lire('formes')]);
    D = { config, petales, defis, formes };
  }
  const petale = id => D.petales.find(p => p.id === id);

  /* ---------- Visages de l'échelle ---------- */
  const VISAGES = [
    { c: '#f5abaf', b: 'M12 29 Q20 21 28 29', t: 'Pas du tout' },
    { c: '#fdd5a5', b: 'M13 28 Q20 24 27 28', t: 'Un peu' },
    { c: '#f8f4b8', b: 'M13 27 L27 27', t: 'Moyen' },
    { c: '#cbe1b6', b: 'M12 25 Q20 32 28 25', t: 'Plutôt oui' },
    { c: '#a8dbeb', b: 'M11 24 Q20 36 29 24', t: 'Tout à fait' }
  ];
  const visage = i => `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="${VISAGES[i].c}" stroke="#000" stroke-width="1.8"/><circle cx="14" cy="16" r="1.9" fill="#000"/><circle cx="26" cy="16" r="1.9" fill="#000"/><path d="${VISAGES[i].b}" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>`;

  /* ---------- Fleur interactive (les vraies formes de la fleur QVE, tracées depuis l'image d'origine) ---------- */
  function fleurSVG(mode) {
    const qui = mode === 'enfant' ? 'enfant' : 'parent';
    const parts = D.petales.map(p => {
      const f = D.formes[p.id]; if (!f) return '';
      const b = dernierBilan(p.id, qui);
      const s = b ? 0.9 + 0.03 * b.s : 0.97;
      const titre = qui === 'enfant' ? p.miroir : p.titre;
      const lab = `${titre}${b ? `, dernier bilan ${b.s} sur 5` : ', pas encore de bilan'}`;
      const t = f.trou, ic = f.icone;
      return `<a href="#/petale/${p.id}" class="petale" aria-label="${esc(lab)}">
        <g class="forme" transform="translate(${f.cx} ${f.cy}) scale(${s}) translate(${-f.cx} ${-f.cy})">
          <path d="${f.d}" fill="${p.couleur}"/>
          <image href="p-${p.id}.png" x="${ic.x}" y="${ic.y}" width="${ic.w}" height="${ic.h}" style="pointer-events:none"/>
          <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="#fff"/>
          ${b ? `<text x="${t.x}" y="${t.y}" text-anchor="middle" dominant-baseline="central" font-family="Quicksand, sans-serif" font-weight="600" font-size="46" fill="#000" style="pointer-events:none">${b.s}</text>` : ''}
        </g>
      </a>`;
    }).join('');
    return `<svg viewBox="30 238 1380 1392" role="group" aria-label="${qui === 'enfant' ? 'La fleur de l\'enfant' : 'La fleur du parent'} : sept pétales à explorer">
      ${parts}
      <image href="centre.png" x="546" y="734" width="352" height="352" style="pointer-events:none"/>
    </svg>`;
  }

  const etincelleDeco = '<svg class="etincelle-deco" viewBox="0 0 80 80" aria-hidden="true"><path d="M40 4l7 24 24 7-24 7-7 24-7-24-24-7 24-7z" fill="#fff" stroke="#000" stroke-width="2.5" stroke-linejoin="round"/><path d="M64 50l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#cbe1b6" stroke="#000" stroke-width="2" stroke-linejoin="round"/></svg>';

  /* ---------- Vues ---------- */
  function vueAccueil() {
    const S = charger(), mode = S.mode === 'enfant' ? 'enfant' : 'parent';
    const defi = defiCourant();
    const lignes = D.petales.map(p => {
      const b = dernierBilan(p.id, mode);
      const titre = mode === 'enfant' ? p.miroir : p.titre, ss = mode === 'enfant' ? p.miroirSous : p.sousTitre;
      return `<li><a class="ligne-petale" href="#/petale/${p.id}" style="background:${p.couleur}">
        <span class="pastille"><img src="p-${p.id}.png" alt="" width="42" height="42"></span>
        <span class="txt"><strong>${esc(titre)}</strong><small>${esc(ss)}</small></span>
        ${b ? `<span class="score" aria-label="Dernier bilan ${b.s} sur 5">${b.s}</span>` : ''}
      </a></li>`;
    }).join('');
    const pDefi = defi ? petale(defi.petale) : null;
    return `<section class="vue">
      <div class="hero-accueil">
        ${etincelleDeco}
        <span class="etiquette">La suite des ateliers</span>
        <h1>Étincelle</h1>
        <p>${esc(D.config.messageAccueil)}</p>
      </div>

      <div class="grille">
      <div class="fleur-carte">
        <div class="bascule" role="group" aria-label="Choisir la fleur">
          <button type="button" data-mode="parent" aria-pressed="${mode === 'parent'}">Ma fleur de parent</button>
          <button type="button" data-mode="enfant" aria-pressed="${mode === 'enfant'}">Sa fleur d'enfant</button>
        </div>
        <div class="fleur-bloc">${fleurSVG(mode)}</div>
        <p class="legende">${mode === 'enfant' ? 'Voici la fleur de votre enfant. Touchez un pétale pour le vivre avec lui.' : 'Touchez un pétale pour l\'explorer. Plus il est grand, mieux vous vous y sentez.'}</p>
      </div>

      <div class="col-droite">
      ${defi ? `<a class="carte teinte" href="#/semaine" style="display:block;text-decoration:none;background:${pDefi?.couleur || 'var(--jaune)'}">
        <span class="etiquette">Cette semaine</span>
        <h3 style="margin-bottom:.25em">${esc(defi.titre)}</h3>
        <p style="margin:0">${esc(defi.consigne.split('. ')[0])}.</p></a>` : ''}

      <h2 class="titre-section"><span class="surligne" style="--hl:var(--vert)">Les sept pétales</span></h2>
      <ul class="liste-petales">${lignes}</ul>
      </div>
      </div>
    </section>`;
  }
  function lierAccueil() {
    $app.querySelectorAll('.bascule button').forEach(b => b.addEventListener('click', () => {
      charger().mode = b.dataset.mode; sauver(); rendre();
    }));
  }

  function bilanBloc(qui, p, actuel) {
    const parent = qui === 'parent';
    const echelle = VISAGES.map((v, k) => `<button type="button" data-note="${k + 1}" aria-pressed="${actuel && actuel.s === k + 1}" aria-label="${k + 1} sur 5, ${v.t}">${visage(k)}<span>${v.t}</span></button>`).join('');
    return `<div class="bloc-bilan" data-qui="${qui}">
      <span class="etiquette">${parent ? 'Moi, parent' : 'Mon enfant'}</span>
      ${parent ? '' : '<p class="petit" style="margin:0 0 6px">Laissez votre enfant choisir lui-même son visage, ou posez-lui la question.</p>'}
      <p style="margin:0"><b>${esc(parent ? p.question : p.questionEnfant)}</b></p>
      <div class="echelle" role="group" aria-label="${parent ? 'Mon bilan' : 'Bilan de mon enfant'} sur 5">${echelle}</div>
    </div>`;
  }
  function graphique(id, qui, titre) {
    const recents = bilansDe(id, qui).slice(-8);
    if (!recents.length) return '';
    return `<h3 style="margin-top:6px">${titre}</h3><div class="histo-wrap"><div class="historique" aria-label="${titre}">${recents.map(b => `<div class="barre" style="height:${b.s * 17}px" title="${dateCourte(b.d)} : ${b.s}/5"><span>${dateCourte(b.d)}</span></div>`).join('')}</div></div>`;
  }

  function vuePetale(id) {
    const p = petale(id);
    if (!p) return vueIntrouvable();
    const i = D.petales.indexOf(p), suivant = D.petales[(i + 1) % D.petales.length];
    const sem = debutSemaine();
    const actP = bilansDe(id, 'parent').find(b => b.w === sem), actE = bilansDe(id, 'enfant').find(b => b.w === sem);
    const e = p.ensemble;
    const fait = !!charger().ensembleFaits[id];
    const notes = bilansDe(id, 'parent').filter(b => b.n).slice(-3).reverse().map(b => `<li><time>${dateCourte(b.d)}</time>${esc(b.n)}</li>`).join('');
    return `<section class="vue" style="--puce:${p.couleur}">
      <a class="retour" href="#/">← La fleur</a>
      <div class="grille2"><div>
      <div class="hero-petale" style="background:${p.couleur}">
        <div class="icone"><img src="p-${p.id}.png" alt=""></div>
        <h1>${esc(p.titre)}</h1>
        <p class="ss">${esc(p.sousTitre)}</p>
        <p class="miroir">Côté enfant, ce pétale s'appelle : « ${esc(p.miroir)} » (${esc(p.miroirSous.toLowerCase())})</p>
      </div>

      ${e ? `<div class="carte ensemble teinte" style="background:${p.couleur}">
        <span class="etiquette">À faire ensemble</span>
        <h2>${esc(e.titre)}</h2>
        <div class="meta"><span>⏱ ${esc(e.duree)}</span><span>Il vous faut : ${esc(e.materiel)}</span></div>
        <ol class="etapes">${e.etapes.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <div class="parler"><b>Pour en parler ensuite</b><ul>${e.enParler.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <label class="coche"><input type="checkbox" id="fait" ${fait ? 'checked' : ''}> Nous l'avons fait ensemble</label>
      </div>` : ''}

      </div><div>
      <div class="carte" id="bilan">
        <h2>Notre bilan de la semaine</h2>
        ${bilanBloc('parent', p, actP)}
        ${bilanBloc('enfant', p, actE)}
        <label for="note" class="aide">Un mot pour nous, si vous en avez envie (facultatif, il reste sur votre téléphone)</label>
        <textarea id="note" maxlength="300" placeholder="Ce qui a aidé, ce qui a été difficile…">${esc(actP?.n || actE?.n || '')}</textarea>
        <button class="btn plein" id="enregistrer" type="button" style="margin-top:14px">Enregistrer notre bilan</button>
        <p class="ok" id="retour-ok" role="status"></p>
        ${graphique(id, 'parent', 'Mon évolution')}
        ${graphique(id, 'enfant', 'Son évolution')}
        ${notes ? `<ul class="liste-notes">${notes}</ul>` : ''}
      </div>

      <div class="carte"><h2>Pour y voir plus clair</h2><p style="margin:0">${esc(p.intro)}</p></div>
      <div class="carte"><h2>Petites pratiques à essayer</h2><ul class="pratiques">${p.pratiques.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="carte"><h3>Une phrase à essayer</h3><p class="phrase">${esc(p.phrase)}</p>${p.note ? `<div class="note-soutien">${esc(p.note)}</div>` : ''}</div>
      </div></div>
      <a class="btn discret plein" href="#/petale/${suivant.id}">Pétale suivant : ${esc(suivant.titre)} →</a>
    </section>`;
  }

  function lierPetale(id) {
    const sem = debutSemaine();
    const choix = { parent: bilansDe(id, 'parent').find(b => b.w === sem)?.s || null, enfant: bilansDe(id, 'enfant').find(b => b.w === sem)?.s || null };
    $app.querySelectorAll('.bloc-bilan').forEach(bloc => {
      const qui = bloc.dataset.qui, boutons = [...bloc.querySelectorAll('.echelle button')];
      boutons.forEach(b => b.addEventListener('click', () => {
        choix[qui] = Number(b.dataset.note);
        boutons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      }));
    });
    const c = $app.querySelector('#fait');
    if (c) c.addEventListener('change', () => { const S = charger(); if (c.checked) S.ensembleFaits[id] = iso(new Date()); else delete S.ensembleFaits[id]; sauver(); });
    $app.querySelector('#enregistrer').addEventListener('click', () => {
      const ok = $app.querySelector('#retour-ok');
      if (!choix.parent && !choix.enfant) { ok.style.color = '#a33'; ok.textContent = 'Choisissez au moins un visage, pour vous ou pour votre enfant.'; return; }
      const S = charger(), note = $app.querySelector('#note').value.trim(), d = iso(new Date());
      ['parent', 'enfant'].forEach(qui => {
        if (!choix[qui]) return;
        const k = cle(qui);
        const liste = ((S[k] || {})[id] || []).filter(b => b.w !== sem);
        const entree = { w: sem, d, s: choix[qui] };
        if (note && (qui === 'parent' || !choix.parent)) entree.n = note;
        liste.push(entree);
        S[k] = S[k] || {}; S[k][id] = liste.slice(-52);
      });
      const stocke = sauver();
      ok.style.color = '';
      ok.textContent = stocke ? 'Bilan enregistré sur votre téléphone. Merci !' : 'Enregistré pour cette session seulement : votre navigateur bloque le stockage.';
      setTimeout(() => rendre(), 900);
    });
  }

  /* ----- Cette semaine ----- */
  function indexDefi() {
    const n = D.defis.length; if (!n) return 0;
    const debut = new Date(D.config.debutDefis + 'T00:00:00');
    const sem = Math.floor((jour(new Date()) - debut) / (7 * 864e5));
    return ((sem < 0 ? 0 : sem) % n);
  }
  const defiCourant = () => D.defis[indexDefi()];
  const indexDemande = param => { const n = D.defis.length, base = indexDefi(); return param === undefined || param === '' ? base : Math.min(Math.max(Number(param) || 0, 0), n - 1); };
  function vueSemaine(param) {
    const n = D.defis.length; if (!n) return vueIntrouvable();
    const base = indexDefi(), idx = indexDemande(param);
    const d = D.defis[idx], p = petale(d.petale);
    const fait = !!charger().defisFaits[d.id];
    return `<section class="vue">
      <h1><span class="surligne" style="--hl:var(--vert)">Cette semaine</span></h1>
      <div class="grille2"><div>
      <div class="defi" style="background:${p?.couleur || 'var(--jaune)'}">
        <span class="etiquette">${idx === base ? 'Le défi de la semaine' : `Défi ${idx + 1} sur ${n}`}${p ? ` · ${esc(p.titre)}` : ''}</span>
        <h2>${esc(d.titre)}</h2>
        <p class="duree">⏱ ${esc(d.duree)}</p>
        <p style="margin:0">${esc(d.consigne)}</p>
        ${d.plus ? `<p class="plus"><b>Pour aller plus loin :</b> ${esc(d.plus)}</p>` : ''}
        <label class="coche"><input type="checkbox" id="fait" ${fait ? 'checked' : ''}> J'ai essayé ce défi</label>
      </div>
      </div><div>
      <div class="nav-defis">
        <a class="btn discret" href="#/semaine/${(idx - 1 + n) % n}">← Précédent</a>
        ${idx !== base ? '<a class="btn discret" href="#/semaine">Cette semaine</a>' : ''}
        <a class="btn discret" href="#/semaine/${(idx + 1) % n}">Suivant →</a>
      </div>
      ${p && p.ensemble ? `<a class="carte teinte" href="#/petale/${p.id}" style="display:block;text-decoration:none;background:${p.couleur}">
        <span class="etiquette">À faire ensemble</span>
        <h3 style="margin-bottom:.2em">${esc(p.ensemble.titre)}</h3>
        <p style="margin:0">${esc(p.ensemble.duree)} · parent et enfant. Touchez pour voir les étapes.</p></a>` : ''}
      <p class="petit">Un seul défi à la fois suffit. Si ce n'est pas le bon moment, passez au suivant, sans culpabilité.</p>
      </div></div>
    </section>`;
  }
  function lierSemaine(param) {
    const c = $app.querySelector('#fait'); if (!c) return;
    const idx = indexDemande(param);
    c.addEventListener('change', () => { const S = charger(); if (c.checked) S.defisFaits[D.defis[idx].id] = iso(new Date()); else delete S.defisFaits[D.defis[idx].id]; sauver(); });
  }

  /* ----- Plus ----- */
  let invitationInstall = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); invitationInstall = e; const b = document.getElementById('btn-install'); if (b) b.hidden = false; });
  function vuePlus() {
    const c = D.config.contact || {};
    return `<section class="vue">
      <h1><span class="surligne" style="--hl:var(--vert)">Plus</span></h1>
      <div class="grille-cartes">
      <details class="carte" open><summary>Installer Étincelle sur mon téléphone</summary>
        <p>Pour la retrouver comme une application, sans passer par un magasin d'applications :</p>
        <button class="btn plein" id="btn-install" type="button" hidden>Installer Étincelle</button>
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
        <p class="petit">Si vous changez de téléphone ou videz les données du navigateur, vous perdez l'historique, sauf si vous l'enregistrez avant.</p>
        <button class="btn discret plein" id="exporter" type="button">Enregistrer une copie de mes données</button>
        <label class="btn discret plein" style="margin-top:12px">Récupérer une copie<input type="file" id="importer" accept="application/json,.json" hidden></label>
        <button class="btn alerte plein" id="effacer" type="button" style="margin-top:12px">Effacer toutes mes données</button>
        <p class="ok" id="retour-donnees" role="status"></p>
      </details>

      <details class="carte"><summary>À propos d'Étincelle</summary>
        <p>Étincelle est la suite à la maison des ateliers proposés en centre social par <b>BRILLE</b> : Main tendue pour les parents, Lueur pour les enfants. Elle prolonge ce que vous avez vécu en atelier, en famille, avec la qualité de vie de l'enfant (QVE) comme fil conducteur.</p>
        <p>La fleur des parents répond en miroir à la fleur de l'enfant, car le parent joue un rôle essentiel dans la qualité de vie de son enfant.</p>
        <p class="petit">Étincelle accompagne le bien-être familial. Elle ne remplace pas l'avis d'un médecin ou d'un professionnel de la santé ou du soutien psychologique.</p>
      </details>

      <details class="carte"><summary>Contacter BRILLE</summary>
        <p>${esc(c.nom || '')}</p>
        ${c.email ? `<p><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>` : ''}
        ${c.telephone ? `<p><a href="tel:${esc(String(c.telephone).replace(/\s/g, ''))}">${esc(c.telephone)}</a></p>` : ''}
      </details>
      </div>
      <p class="pied">Conçue et développée par ${esc(c.nom || 'BRILLE')}<br>© BRILLE · Étincelle</p>
    </section>`;
  }
  function lierPlus() {
    const bi = $app.querySelector('#btn-install');
    if (bi && invitationInstall) { bi.hidden = false; bi.addEventListener('click', async () => { invitationInstall.prompt(); await invitationInstall.userChoice; invitationInstall = null; bi.hidden = true; }); }
    const msg = t => { $app.querySelector('#retour-donnees').textContent = t; };
    $app.querySelector('#exporter').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(charger(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `etincelle-mes-donnees-${iso(new Date())}.json`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      msg('Copie enregistrée dans les fichiers de votre téléphone.');
    });
    $app.querySelector('#importer').addEventListener('change', async e => {
      const f = e.target.files[0]; if (!f) return;
      try {
        const d = JSON.parse(await f.text());
        if (!d || typeof d !== 'object' || typeof d.bilans !== 'object') throw new Error('format');
        memoire = Object.assign(vide(), { bilans: d.bilans || {}, enfant: d.enfant || {}, defisFaits: d.defisFaits || {}, ensembleFaits: d.ensembleFaits || {}, mode: d.mode === 'enfant' ? 'enfant' : 'parent' }); sauver();
        msg('Vos données ont été récupérées.');
      } catch { msg('Ce fichier n\'est pas une copie valide d\'Étincelle.'); }
    });
    $app.querySelector('#effacer').addEventListener('click', () => {
      if (!confirm('Effacer tous vos bilans, notes et défis ? Cette action est définitive.')) return;
      memoire = vide(); sauver(); msg('Toutes vos données ont été effacées.');
    });
  }

  function vueIntrouvable() {
    return '<section class="vue"><h1>Page introuvable</h1><p>Cette page n\'existe pas.</p><a class="btn" href="#/">Retour à la fleur</a></section>';
  }

  /* ---------- Routeur ---------- */
  let premiere = true;
  function rendre() {
    const [r, param] = location.hash.replace(/^#\/?/, '').split('/');
    let html, tab, titre = 'Étincelle · BRILLE', apres = () => { };
    if (!r) { html = vueAccueil(); tab = 'fleur'; apres = lierAccueil; }
    else if (r === 'petale') { html = vuePetale(param); tab = 'fleur'; apres = () => lierPetale(param); titre = `${petale(param)?.titre || 'Pétale'} · Étincelle`; }
    else if (r === 'semaine' || r === 'defi') { html = vueSemaine(param); tab = 'semaine'; apres = () => lierSemaine(param); titre = 'Cette semaine · Étincelle'; }
    else if (r === 'plus') { html = vuePlus(); tab = 'plus'; apres = lierPlus; titre = 'Plus · Étincelle'; }
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
