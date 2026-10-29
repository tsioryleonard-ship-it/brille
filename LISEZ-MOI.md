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
