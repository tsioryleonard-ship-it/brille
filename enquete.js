/* Étincelle · BRILLE — petit questionnaire d'avis (lancement)
   Affiché seulement entre les dates « debut » et « fin » de enquete.json (incluses), puis il disparaît tout seul.
   Réponses anonymes (ni nom, ni e-mail), envoyées vers la feuille Google de BRILLE.
   Sans « serveur » dans enquete.json, le questionnaire n'apparaît pas. */
(() => {
  'use strict';
  const app = document.getElementById('app');
  if (!app) return;
  const CLE = 'brille-etincelle-enquete', CLE_APP = 'brille-etincelle-v1';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const dateLongue = s => { const [a, m, j] = s.split('-').map(Number); return new Date(a, m - 1, j).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); };

  const QUESTIONS = [
    { id: 'ouvrir', q: 'Avez-vous réussi à ouvrir l\'application avec votre code ?', choix: ['Oui, facilement', 'Oui, avec un petit souci', 'Non, je n\'ai pas réussi'] },
    { id: 'activite', q: 'Avez-vous fait l\'activité de la semaine en famille ?', choix: ['Oui', 'En partie', 'Pas encore'] },
    { id: 'temps', q: 'Le temps demandé vous a semblé…', choix: ['Trop court', 'Juste bien', 'Trop long'] },
    { id: 'suite', q: 'Avez-vous envie de continuer avec la suite ?', choix: ['Oui', 'Peut-être', 'Non'] },
    { id: 'prix', q: 'Pour un pétale à 12 € (prix de lancement), vous trouveriez ça…', choix: ['Trop cher', 'Correct', 'Pas cher'] }
  ];

  let cfg = null;
  const lireEtat = () => { try { return JSON.parse(localStorage.getItem(CLE) || '{}') || {}; } catch { return {}; } };
  const ecrireEtat = o => { try { localStorage.setItem(CLE, JSON.stringify(o)); } catch { } };
  const estAdmin = () => document.body.dataset.admin === '1';
  const aCommence = () => {                       // la famille a déjà fait quelque chose dans l'application
    try {
      const S = JSON.parse(localStorage.getItem(CLE_APP) || '{}') || {};
      return ['bilans', 'enfant', 'ensembleFaits', 'defisFaits', 'parcours'].some(k => S[k] && Object.keys(S[k]).length);
    } catch { return false; }
  };
  const actif = () => {
    if (!cfg || cfg.actif === false || !String(cfg.serveur || '').trim()) return false;
    const auj = iso(new Date());
    if (auj > (cfg.fin || '2026-12-18')) return false;       // après la date de fin : plus rien ne s'affiche
    if (cfg.debut && auj < cfg.debut) return false;           // avant la date de début : rien non plus
    const e = lireEtat();
    if (e.fait || e.plusTard === auj) return false;
    return !estAdmin() && aCommence();
  };

  /* Style ajouté ici pour ne pas toucher aux autres fichiers */
  const st = document.createElement('style');
  st.textContent = `
  .enquete .opt{display:block;margin:6px 0;padding:11px 14px;border:2px solid #e7e2ea;border-radius:16px;cursor:pointer;font-weight:500;background:#fff;min-height:44px}
  .enquete .opt input{position:absolute;opacity:0;pointer-events:none}
  .enquete .opt.sel{border-color:#f49f4c;background:#fff3e2}
  .enquete .opt:focus-within{outline:3px solid #a4c2e7}
  .enquete fieldset{border:0;margin:14px 0 0;padding:0}
  .enquete legend{font-weight:600;margin-bottom:4px;padding:0}
  .enquete textarea{width:100%;min-height:80px;border:2px solid #e7e2ea;border-radius:16px;padding:10px;font:inherit;box-sizing:border-box}
  .enquete .rang{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}
  .enquete .rang .btn{flex:1;min-width:140px}
  .enquete .err{color:#a33;margin:8px 0 0}`;
  document.head.appendChild(st);

  const html = () => `
    <span class="etiquette">💬 Votre avis compte</span>
    <h2>Aidez-moi à améliorer Étincelle</h2>
    <p class="petit" style="margin:0 0 6px">5 petites questions, environ 1 minute. Réponses anonymes : je ne demande ni nom ni adresse e-mail. Ce questionnaire disparaît après le ${esc(dateLongue(cfg.fin || '2026-12-18'))}.</p>
    <button type="button" class="btn plein" data-enq="ouvrir">Je réponds</button>
    <form data-enq="form" hidden novalidate>
      ${QUESTIONS.map(x => `<fieldset><legend>${esc(x.q)}</legend>${x.choix.map(c => `<label class="opt"><input type="radio" name="${x.id}" value="${esc(c)}"> ${esc(c)}</label>`).join('')}</fieldset>`).join('')}
      <fieldset><legend>Un mot pour m'aider (facultatif)</legend>
        <label for="enq-libre" class="aide">Ce qui vous a plu, ce qui vous a perdus… Merci de ne pas écrire de prénom ni de nom.</label>
        <textarea id="enq-libre" maxlength="400"></textarea></fieldset>
      <p class="err" role="alert" data-enq="err"></p>
      <div class="rang"><button type="button" class="btn plein" data-enq="envoyer">Envoyer mes réponses</button><button type="button" class="btn" data-enq="plus-tard">Plus tard</button></div>
    </form>`;

  const envoyer = async carte => {
    const err = carte.querySelector('[data-enq="err"]'), form = carte.querySelector('form');
    const rep = {}; QUESTIONS.forEach(x => { const c = form.querySelector(`input[name="${x.id}"]:checked`); if (c) rep[x.id] = c.value; });
    const libre = form.querySelector('#enq-libre').value.trim().slice(0, 400);
    if (!Object.keys(rep).length && !libre) { err.textContent = 'Répondez à au moins une question, ou cliquez sur « Plus tard ».'; return; }
    err.textContent = ''; const b = carte.querySelector('[data-enq="envoyer"]'); b.disabled = true; b.textContent = 'Envoi…';
    try {
      const r = await fetch(String(cfg.serveur).trim(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'enquete', v: 1, d: iso(new Date()), reponses: rep, libre }) });
      if (!r.ok) throw new Error('reseau');
      const j = await r.json().catch(() => ({})); if (j && j.ok === false) throw new Error('refus');
      ecrireEtat({ fait: iso(new Date()) });
      carte.innerHTML = `<span class="etiquette">💬 Merci !</span><h2>Merci beaucoup 🌟</h2><p style="margin:0">Vos réponses m'aident à améliorer Étincelle pour toutes les familles.</p>`;
    } catch { err.textContent = 'Impossible d\'envoyer pour le moment. Vérifiez votre connexion et réessayez.'; b.disabled = false; b.textContent = 'Envoyer mes réponses'; }
  };

  const brancher = carte => {
    carte.addEventListener('click', ev => {
      const t = ev.target.closest('[data-enq]'); if (!t) return;
      const a = t.dataset.enq;
      if (a === 'ouvrir') { t.hidden = true; carte.querySelector('form').hidden = false; try { carte.querySelector('form legend').scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch { } }
      else if (a === 'plus-tard') { ecrireEtat(Object.assign(lireEtat(), { plusTard: iso(new Date()) })); carte.remove(); }
      else if (a === 'envoyer') envoyer(carte);
    });
    carte.addEventListener('change', ev => {
      const i = ev.target; if (!i.matches('input[type=radio]')) return;
      carte.querySelectorAll(`input[name="${i.name}"]`).forEach(o => o.closest('.opt').classList.toggle('sel', o.checked));
    });
  };

  const poser = () => {
    const bilan = document.getElementById('bilan');
    if (!bilan || document.getElementById('enquete') || !actif()) return;
    const carte = document.createElement('div');
    carte.className = 'carte enquete'; carte.id = 'enquete'; carte.innerHTML = html();
    bilan.after(carte); brancher(carte);
  };

  fetch('enquete.json', { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).then(c => { cfg = c; poser(); }).catch(() => { });
  new MutationObserver(poser).observe(app, { childList: true });
})();
