# Main tendue : mode d'emploi

Application web (installable sur téléphone) pour les parents du groupe Main tendue. Gratuite à héberger, sans serveur, sans compte : les bilans des familles restent dans leur téléphone.

## 1. La mettre en ligne (gratuit, environ 10 minutes)

1. Créez un compte sur https://github.com (gratuit).
2. Cliquez sur **New repository**. Nom : `main-tendue`. Laissez **Public**. Validez avec **Create repository**.
3. Sur la page du dépôt, cliquez sur **uploading an existing file**.
4. Dézippez ce dossier sur votre ordinateur, puis glissez-déposez **tout son contenu** (index.html, app.js, style.css, sw.js, manifest.webmanifest, et les dossiers assets, data, fonts) dans la fenêtre GitHub. Attendez la fin du chargement, puis **Commit changes**.
5. Allez dans **Settings**, puis **Pages**. Dans « Branch », choisissez `main` et `/ (root)`, puis **Save**.
6. Après une à deux minutes, votre adresse apparaît : `https://VOTRE-PSEUDO.github.io/main-tendue/`
7. Créez un QR code de cette adresse (par exemple avec un générateur de QR code gratuit) pour l'imprimer sur vos supports d'atelier.

Le site est public : c'est normal, il ne contient aucune donnée de famille.

## 2. Modifier les contenus (sans coder)

Tous les textes sont dans le dossier `data`. Sur GitHub, ouvrez le fichier, cliquez sur le crayon, modifiez le texte entre guillemets, puis **Commit changes**. Les téléphones se mettent à jour à la prochaine ouverture avec du réseau.

- `rendezvous.json` : vos dates d'ateliers. Copiez un bloc entre accolades pour en ajouter un. Supprimez la ligne `"exemple": true` pour une vraie date. Format de date : `2026-11-12`. Heure : `18h00 - 19h30`.
- `defis.json` : les défis hebdomadaires (un par semaine, en boucle).
- `petales.json` : les 7 pétales (titres, explications, pratiques, phrases). Attention aux virgules et aux guillemets : ne supprimez pas ceux qui entourent les textes.
- `config.json` : message d'accueil, vos coordonnées, et `debutDefis` (la date du lundi où le premier défi commence).

Si vous modifiez `index.html`, `app.js` ou `style.css`, changez aussi le numéro dans `sw.js` (`main-tendue-v1` devient `main-tendue-v2`) pour que les téléphones prennent la nouvelle version.

## 3. À vérifier avant de la diffuser

- Remplacer les rendez-vous d'exemple par vos vraies dates et le vrai lieu.
- Relire les textes des 7 pétales : ils sont une proposition de miroir de la fleur enfant, à adapter à vos mots et à vos ateliers.
- Vérifier les droits d'usage des illustrations de votre fleur si vous les ajoutez : l'application utilise ses propres pictogrammes simples.
