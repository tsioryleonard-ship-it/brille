# Étincelle · version 37 (6 nov. 2026)

## Ce qui change
- **Pionniers** : le mot d'accueil (config.json, `messageAccueil`) dit « vous êtes des pionniers BRILLE ». Sur chaque pétale, une carte « Je transmets » (3 idées + bouton pour envoyer un petit mot à un proche). Dans « Plus », une carte « Pionniers BRILLE ». Le message partagé contient le lien de l'application SANS code : le proche peut tester une semaine.
- **Essai gratuit d'une semaine** pour les familles sans atelier : bouton « Tester gratuitement une semaine » sur l'écran du code, 3 questions, un pétale conseillé, la semaine démarre à la première ouverture et s'arrête toute seule. Un pétale à la fois, un essai par pétale et par téléphone. Questions modifiables dans config.json (`essai.questions`).
- **Reprise libre** : si une famille n'a rien validé depuis 8 jours dans un parcours, un mot « On reprend là où on s'était arrêtés » s'affiche (aucun retard, rien à rattraper). L'ordre des semaines reste le même.

## À faire UNE SEULE FOIS pour activer l'essai
1. Ouvrir l'application avec ton code ingénieure, Plus, « Gérer les familles ».
2. Carte « Codes d'essai gratuit » : « Créer les codes d'essai ». Le bloc des 7 codes est copié.
3. Dans config.json (GitHub, crayon), remplacer tout le bloc `"essai": { ... }` des codes : coller le bloc copié dans `"codes"` (garder `"questions"`).
4. « Préparer les fichiers à publier » : déposer `acces.json` et `contenu.enc.json` sur GitHub, avec les fichiers de ce dossier (`app.js`, `config.json`, `sw.js`).
Tant que les codes sont vides, le bouton d'essai n'apparaît pas.

## Fichiers à publier
`app.js`, `config.json`, `sw.js` (etincelle-v37), puis `acces.json` et `contenu.enc.json` après l'étape ci-dessus. Prochaine version du sw : etincelle-v38.

## À savoir
- Les codes d'essai sont lisibles dans config.json (le site est public) : quelqu'un qui efface les données de son téléphone peut refaire un essai. C'est le prix d'un système sans aucun travail pour toi ; il ne donne qu'un pétale, une semaine.
- Les pétales d'essai restent soumis à la protection (filigrane « Essai BRILLE », pas de copier-coller).
- Testé en navigateur avec de faux codes : essai, questionnaire, fin d'essai, carte « Je transmets », message de reprise. Le bouton de création des codes (côté ingénieure) n'a pas pu être testé sans ton carnet : fais un premier essai avant de publier.
