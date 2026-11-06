# Étincelle : mode d'emploi

Étincelle est la suite à la maison des ateliers BRILLE (Main tendue pour les parents, Lueur pour les enfants). Application installable sur téléphone, sans serveur, sans compte : les bilans des familles restent dans leur téléphone.

## 1. Mettre à jour le site sur GitHub

Tous les fichiers sont au même niveau (pas de dossier).

1. Dézippez `etincelle.zip`.
2. Sur la page de votre dépôt GitHub, cliquez sur **Add file**, puis **Upload files**.
3. Glissez **tous les fichiers** du dossier dézippé. GitHub remplace ceux qui portent déjà le même nom et ajoute les nouveaux.
4. Cliquez sur **Commit changes**. Au bout d'une à deux minutes, l'adresse de votre site est mise à jour.

Le fichier `rendezvous.json` n'est plus utilisé : vous pouvez le supprimer sur GitHub (ouvrez-le, puis le menu « ... » en haut à droite, puis **Delete file**), ou le laisser, il ne gêne pas.

## 2. Modifier les contenus (sans coder)

Les textes sont dans trois fichiers (le quatrième, `formes.json`, ne se modifie pas). Sur GitHub, ouvrez le fichier, cliquez sur le crayon, modifiez le texte entre guillemets, puis **Commit changes**.

- `petales.json` : les 7 pétales (titres parent et enfant, explications, pratiques, phrases) et l'activité « À faire ensemble » de chacun.
- `defis.json` : les défis hebdomadaires (un par semaine, en boucle).
- `formes.json` : les contours des pétales, tracés depuis votre fleur. Ne le modifiez pas.
- `config.json` : message d'accueil, coordonnées, et `debutDefis` (la date du lundi où le premier défi commence).

Attention aux virgules et aux guillemets : ne supprimez pas ceux qui entourent les textes.

Si vous modifiez `index.html`, `app.js` ou `style.css`, changez aussi le numéro dans `sw.js` (`etincelle-v10` devient `etincelle-v11`) pour que les téléphones prennent la nouvelle version.

## 3. Les images

Les pictogrammes des pétales (`p-*.png`) sont extraits de votre fleur : vérifiez les droits d'usage de ces illustrations, notamment si elles viennent d'une banque d'images qui demande de citer l'auteur.

## Accès par code famille

- Chaque pétale est chiffré dans `contenu.enc.json` : une famille n'ouvre que les pétales vécus en atelier. Les codes sont gérés avec le fichier PRIVÉ `gestion-des-acces.html` (à garder sur votre ordinateur, jamais sur GitHub).
- Ne publiez JAMAIS `petales.json`, `defis.json` ni le carnet des familles.

## Accès payant (familles hors centre)

La vente est **désactivée** tant que `config.json` contient `"actif": false` dans le bloc `achat`.

**Mise en place (une seule fois)** : suivez le guide « Encaisser les accès Étincelle avec Stripe ».
1. Complétez les passages surlignés en jaune de `legal.html` (SIRET, adresse, médiateur, dates).
2. Dans `config.json`, collez le lien de paiement Stripe de chaque offre dans `"lien"`. Passez `"actif"` à `true`.
3. Changez le numéro de version dans `sw.js` (`etincelle-v15` devient `etincelle-v18`, et ainsi de suite à chaque mise à jour), puis publiez tous les fichiers sur GitHub (y compris `merci.html` et `legal.html`).

**Créer un stock de codes** : espace ingénieure, « Gérer les familles », nom « Achat », nombre 20, tous les pétales cochés, case « pour la vente » cochée, « Créer le code ». Puis « Préparer les fichiers à publier » et déposez les deux fichiers sur GitHub. Faites aussi « Télécharger une copie de mon carnet » et gardez-la en lieu sûr.

**Après chaque paiement (2 minutes)** : vous recevez un e-mail de Stripe. Dans « Gérer les familles », saisissez le nom ou l'e-mail de l'acheteur, cliquez sur « Copier le message du prochain code », collez-le dans un e-mail à l'acheteur. Le code est marqué « envoyé » et le stock se met à jour.

**À savoir**
- Le tarif solidaire et la fleur complète ouvrent la même chose : ils piochent dans le même stock. Pour un accès de 5 ans, créez le code avec la durée « 5 ans » et écrivez « 5 ANS » devant l'e-mail de l'acheteur, pour le retrouver plus tard.
- Un pétale à l'unité demande un code créé à part (seul le pétale choisi est coché), à publier avant l'envoi.
- Un an après l'ajout d'un code (la date est affichée), retirez-le si la famille ne renouvelle pas, puis republiez.
- Un code peut être partagé : les conditions l'interdisent. En cas d'abus, retirez-le et republiez.
- Remboursement : dans Stripe, puis « Retirer » le code dans « Gérer les familles » et republiez.

## Version jeu (sons, étincelles, missions)

- Nouveaux fichiers à publier avec les autres : `jeu.js` et `jeu.css`. `index.html` et `sw.js` ont été mis à jour (`sw.js` est passé à `etincelle-v18`).
- Le jeu ne modifie ni les codes d'accès ni les contenus chiffrés : il s'ajoute par-dessus ce que l'application affiche.
- Les points, niveaux et badges restent dans le téléphone de la famille (clé `brille-etincelle-jeu`).
- Le dossier `_avant-jeu` contient les anciens `index.html` et `sw.js` : ne le publiez pas, vous pouvez le supprimer quand vous êtes sûre de garder cette version.

## Protection des contenus (ajoutée le 30 oct.)

- Filigrane : sur chaque page, le nom de l'accès (« Accès : … · BRILLE · usage personnel ») apparaît en transparence pour les familles, pas pour votre accès ingénieure. Le nom vient de « Gérer les familles » : il apparaît après une nouvelle publication de `acces.json` et `contenu.enc.json`.
- Copier-coller, clic droit et impression sont bloqués pour les familles (une capture d'écran reste possible).
- « Conditions d'utilisation » dans l'onglet Plus, et « Tous droits réservés » en pied de page.
- Extrait gratuit : créez un groupe « Découverte gratuite » avec un seul pétale, puis collez son code dans `config.json`, ligne `"codeDecouverte"`. Un bouton « Découvrir un extrait gratuit » apparaît sur l'écran d'entrée.
- Version du service worker : `etincelle-v21`. La prochaine sera `etincelle-v22`.

## Fin d'accès automatique (v20)

Dans « Gérer les familles », choisissez une durée à la création du code (sans limite, 12 mois, 5 ans) ou modifiez la date « Fin d'accès » d'une famille, puis « Préparer les fichiers » et déposez-les sur GitHub. À la date, le code cesse d'ouvrir l'application. Ton accès ingénieure n'expire jamais.
Attention : pour un lot de codes « vente », la durée compte à partir de la création du lot.

**Ne déposez plus d'ancien zip par-dessus : cette version contient les jeux.**

## Parcours d'un mois par pétale (v22)

- Chaque pétale propose un parcours de 4 semaines (une mission à vivre à deux par semaine, suivi dans le téléphone) et un « rituel qu'on garde » à la fin.
- Le contenu est dans `parcours-mensuels-PRIVE.json` : fichier PRIVÉ, à garder sur votre ordinateur, jamais sur GitHub.
- Pour l'ajouter : ouvrez l'application avec votre accès ingénieure, onglet Plus, « Gérer les familles », carte « Ajouter les parcours d'un mois », choisissez le fichier. Puis « Préparer les fichiers à publier » et déposez `acces.json` et `contenu.enc.json` sur GitHub avec les fichiers de ce dossier (`app.js`, `style.css`, `sw.js`). Les codes existants continuent de fonctionner.
- Les parcours restent chiffrés : seules les familles ayant le pétale les voient.
- Version du service worker : `etincelle-v22`.
- Jeu : chaque semaine du parcours vécue rapporte 6 étincelles (une seule fois par semaine et par pétale), le mois complet 15 étincelles et le badge « Un mois ensemble ». Publiez aussi `jeu.js`.
- Parcours : une semaine ne s'ouvre que lorsque la précédente a été vécue. Chaque semaine a son bouton « Lancer la mission » (pas à pas) ; la fin du mois déclenche une grande fête (pluie de pétales, médaille, badge) et une carte souvenir avec les prénoms (facultatif). Publiez aussi `jeu.css`.
- Un pétale dont le parcours d'un mois est terminé reçoit une médaille 🏅 et un contour doré sur la fleur d'accueil, et une médaille dans la liste des pétales.

## Version 23 (5 nov. 2026) : accueil, famille, bilan imprimable

- **Où est la version de référence** : le dossier « Étincelle – version finale » sur Google Drive. C'est lui qu'on met à jour, depuis n'importe quel ordinateur, puis qu'on publie sur GitHub.
- Accueil : signature « Rindra Tsiory · Fondatrice de BRILLE » sous le mot de l'ingénieure ; bannière « L'aventure BRILLE commence maintenant ! » (le texte explicatif a été retiré).
- Message secondaire pour les familles qui n'ont pas suivi d'atelier : `messageHorsAtelier` dans `config.json` (modifiable sans coder).
- « Notre famille » : prénom du parent + prénoms des enfants, sans limite. Tous les prénoms apparaissent sur la carte souvenir, le pétale à coller et la fleur d'aventure (la taille s'adapte). Les prénoms restent dans le téléphone.
- Bilan de la semaine : le parent indique combien d'enfants ont répondu (avec la remarque « en groupe, c'est ça aussi une famille épanouie ensemble ») et peut imprimer ou enregistrer en PDF une feuille A4 archivable, avec l'historique des semaines précédentes.
- « À propos d'Étincelle » : reformulé (la QVE est pensée pour l'enfant ; le parent qui revient de Main tendue prolonge à la maison avec son enfant).
- Fichiers modifiés : `app.js`, `style.css`, `config.json`, `sw.js` (`etincelle-v23`), `legal.html`. La prochaine version de `sw.js` sera `etincelle-v24`.
- Les fichiers PRIVÉS (`gestion-des-acces.html`, `petales.json`, `defis.json`, `parcours-mensuels-PRIVE.json`, carnet des familles) ne sont jamais sur GitHub : gardez-les dans le dossier Drive PRIVÉ.

## Version 24 (5 nov. 2026, soir)

- Mot de l'ingénieure : guillemet seul retiré.
- Tableau « Niveau Graine » : couleurs BRILLE pastel (plus de dégradé), placé sous la fleur.
- Accueil : texte élargi jusqu'au dessin de la famille.
- « Notre famille » : champ prénom et bouton « Ajouter » rééquilibrés.
- Bilan : une ligne de visages par enfant (prénom ou « Enfant 2 »…), enregistrée et imprimée avec le bilan.
- Fichiers modifiés : app.js, jeu.js, jeu.css, style.css, sw.js (etincelle-v25 : l'installation recharge maintenant les fichiers depuis le réseau, plus de vieille copie). Prochaine version du sw : v26.

## Version 26 (5 nov. 2026, nuit)

- En-tête : le titre « Étincelle » à côté du logo BRILLE, une fois le code saisi.
- Accueil : « L'aventure BRILLE continue ici », petite phrase pour les familles sans atelier + logo Étincelle, puis le mot de l'ingénieure. Le bloc « Étincelle / La suite des ateliers » est gardé en entête de la page du code.
- « Notre famille » : nom de famille pour les parents, prénoms pour les enfants.
- Carte « Cette semaine » retirée de l'accueil (l'onglet du bas reste).
- Fichiers modifiés : app.js, style.css, index.html, config.json, legal.html, sw.js (etincelle-v26). Prochaine version du sw : v27.

## Version 27 (5 nov. 2026, nuit)

- « Plus » → bouton « Remettre mes étincelles à zéro » (garde les bilans et notes). « Effacer toutes mes données » remet aussi les étincelles à zéro.
- Avec le code ingénieure, les étincelles de test ne sont jamais enregistrées (bac à sable) : un téléphone de test ne se « remplit » plus.
- Fichiers modifiés : app.js, jeu.js, sw.js (etincelle-v27). Prochaine version du sw : v28.

## Version 28 (5 nov. 2026, nuit)

- Bouton « Installer Étincelle » (Plus) : il répond maintenant même si l'invitation du téléphone arrive après l'ouverture de la page.
- Fichiers modifiés : app.js, sw.js (etincelle-v28). Prochaine version du sw : v29.

## Version 29 (5 nov. 2026, nuit)

- Le bouton « Installer Étincelle » (Plus) n'apparaît plus que si le téléphone propose vraiment l'installation (il restait visible à tort). Sinon, les explications iPhone / Android restent affichées dessous.
- Fichiers modifiés : style.css, sw.js (etincelle-v29). Prochaine version du sw : v30.

## Version 30 (5 nov. 2026, nuit)

- Parcours du mois : chaque semaine vécue affiche un petit mot (la graine est plantée / la tige pousse / le bourgeon se prépare / la fleur s'ouvre), dans la liste et en message à la validation.
- L'évolution des bilans semaine par semaine existait déjà (graphique en barres sur chaque pétale, 8 dernières semaines) : inchangée.
- Fichiers modifiés : app.js, jeu.js, style.css, sw.js (etincelle-v30). Prochaine version du sw : v31.

## Version 31 (5 nov. 2026, nuit)

- « Cette semaine » : avec « La fleur des enfants », l'onglet montre maintenant le défi pensé pour l'enfant (l'activité « à faire ensemble » du pétale, avec ses étapes, les questions pour en parler et la question de fin de semaine), et plus le défi du parent. Un bouton permet de passer au défi du parent. Case « fait » séparée pour parent et enfant.
- Fichiers modifiés : app.js, sw.js (etincelle-v31). Prochaine version du sw : v32.

## Version 32 : une seule fleur pour toute la famille

- Fin du choix « fleur parent / fleur enfant » : une seule fleur de famille. La taille de chaque pétale = la moyenne du dernier bilan du parent et de celui des enfants.
- « Cette semaine » : un seul défi pour toute la famille (défi + activité à vivre ensemble, étapes, questions pour en parler).
- Fichiers modifiés : app.js, sw.js (etincelle-v32). Prochaine version du sw : etincelle-v33.

## Version 33 : filigrane plus discret

- Le filigrane est moins dense (une mention par grand carreau), plus petit et plus léger, avec un message simple : « Accès personnel de [famille] · merci de ne pas partager ». Toujours visible sur les pages.
- Fichiers modifiés : app.js, sw.js (etincelle-v33). Prochaine version du sw : etincelle-v34.

## Version 34 : textes valables pour tout lieu d'atelier

- Plus de mention de « centre social » dans les textes visibles par les familles : « Vous n'avez pas suivi d'atelier BRILLE ? Votre aventure BRILLE commence ici. » et formulations équivalentes (écran de code, accès, à propos, aide, mentions légales).
- Fichiers modifiés : app.js, config.json, legal.html, sw.js (etincelle-v34). Prochaine version du sw : etincelle-v35.

## Version 35

- Message hors atelier : « Vous n'avez pas suivi d'atelier BRILLE ? Votre aventure commence ici. » (BRILLE une seule fois).
- Tarif solidaire (legal.html) : « centre social » remplacé par « structure ».
- Fichiers modifiés : config.json, legal.html, sw.js (etincelle-v35). Prochaine version du sw : etincelle-v36.

## Version 36

- Page « Plus » (grand écran) : la carte « Conditions d'utilisation » n'est plus collée aux cartes du dessus.
- Fichiers modifiés : style.css, sw.js (etincelle-v36). Prochaine version du sw : etincelle-v37.

## Version 37 (6 nov. 2026) : pionniers, essai d'une semaine, reprise libre

### Ce qui change
- **Pionniers** : le mot d'accueil (`config.json`, `messageAccueil`) dit « vous êtes des pionniers BRILLE ». Sur chaque pétale, une carte « Je transmets » (3 idées + bouton pour envoyer un petit mot à un proche). Dans « Plus », une carte « Pionniers BRILLE ». Le message partagé contient le lien de l'application SANS code : le proche peut tester une semaine.
- **Essai gratuit d'une semaine** pour les familles sans atelier : bouton « Tester gratuitement une semaine » sur l'écran du code, 3 questions, un pétale conseillé. La semaine démarre à la première ouverture et s'arrête toute seule. Un pétale à la fois, un essai par pétale et par téléphone. Questions modifiables dans `config.json` (`essai.questions`).
- **Reprise libre** : si une famille n'a rien validé depuis 8 jours dans un parcours, un mot « On reprend là où on s'était arrêtés » s'affiche (aucun retard, rien à rattraper). L'ordre des semaines reste le même.

### À faire UNE SEULE FOIS pour activer l'essai
1. Ouvrir l'application avec votre code ingénieure, Plus, « Gérer les familles ».
2. Carte « Codes d'essai gratuit » : « Créer les codes d'essai ». Le bloc des 7 codes est copié.
3. Dans `config.json` (GitHub, crayon), coller ce bloc à la place du bloc `"essai"` des codes (garder `"questions"`).
4. « Préparer les fichiers à publier » : déposer `acces.json` et `contenu.enc.json` sur GitHub, avec `app.js`, `config.json` et `sw.js`.

Tant que les codes sont vides, le bouton d'essai n'apparaît pas.

### À savoir
- Les codes d'essai sont lisibles dans `config.json` (le site est public) : quelqu'un qui efface les données de son téléphone peut refaire un essai. Cela ne donne qu'un pétale, une semaine.
- Les pétales d'essai restent protégés (filigrane « Essai BRILLE », pas de copier-coller).
- Défis réécrits (`defis.json`, fichier PRIVÉ) : plus courts, ludiques, « Et si… ? ». À recharger dans `gestion-des-acces.html`, puis republier `acces.json` et `contenu.enc.json`.
- Fichiers modifiés : `app.js`, `config.json`, `sw.js` (etincelle-v37). Prochaine version du sw : etincelle-v38.


## Version 39 : un essai à la fois, avec une pause d'un mois

- Une famille sans atelier peut essayer **un seul pétale à la fois, pendant 7 jours**. Ensuite, un **nouvel essai n'est possible qu'après 30 jours** (réglable dans `config.json`, ligne `"pause": 30`).
- Cela marche même si la famille répond autrement au petit test : le blocage est lié au téléphone, pas au pétale choisi.
- La date du dernier essai est gardée à deux endroits du téléphone, donc vider l'historique ne suffit pas à le recommencer. En revanche, « effacer toutes les données du site », un autre navigateur ou un autre téléphone permettent de recommencer : sans serveur, c'est impossible à empêcher complètement.
- Semaine 1 de chaque parcours d'un mois : repensée pour ne plus reprendre l'activité « À faire ensemble » (observer et remarquer, sans dessiner).

## Version 40 : essai verrouillé par e-mail (facultatif)

- Si tu mets l'adresse de ton script Google dans `config.json` (ligne `"serveur"`), l'essai exige un **e-mail vérifié** (code à 6 chiffres) : un essai par adresse, sur n'importe quel téléphone. Les codes d'essai sortent alors de `config.json`.
- Si la ligne `"serveur"` est vide, le bouton « Tester gratuitement » **n'apparaît pas** (sauf si des codes sont dans `config.json` : l'ancien verrou sur le téléphone s'applique alors).
- La mise en place est expliquée dans `SERVEUR-ESSAI.md` (fichier privé, à garder dans le Drive).

## Version 41 : essai sans parcours d'un mois, mentions légales à jour

- Pendant l'essai, le **parcours d'un mois n'est pas accessible** : une petite carte 🔒 explique qu'il est réservé à l'accès complet. Il reste ouvert pour les familles qui ont un code (atelier ou achat).
- `legal.html` (conditions et mentions légales) : ajout de l'article « 3 bis. Essai gratuit de 7 jours », de l'adresse e-mail dans les données collectées (consentement, 12 mois maximum, conservée sous forme chiffrée) et de Google dans les prestataires.
- La phrase « Pour les enfants, ce pétale se dit… » est retirée : le titre du pétale est déjà celui de l'enfant.

## Version 42 : liens vers les conditions et mentions légales

Les liens « Conditions générales · Confidentialité · Mentions légales » sont maintenant visibles sur l'écran d'accueil, sur l'écran e-mail de l'essai gratuit et en bas de l'onglet Plus (avant, ils n'apparaissaient que si l'achat était activé).

## Version 43 : accueil pour tous, mise en page, carte admin

- L'écran d'accueil parle aussi aux familles sans atelier : « Pas encore venus en atelier ? Testez gratuitement un pétale pendant 7 jours, en famille. » (visible seulement quand l'essai est actif).
- La famille illustrée passe en haut à droite et le texte l'épouse en s'étirant (texte justifié), sans espace vide.
- Dans « Gérer les familles », la carte « Codes d'essai gratuit » disparaît quand le serveur d'essai est branché (ligne `"serveur"` de `config.json`) : les codes sont alors gérés dans le script Google.
