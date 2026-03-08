# Formulaire - Plateforme d'exercices

Projet web statique pour entraîner des compétences numériques et linguistiques (navigation, e-mails, formulaires, jeux pédagogiques) avec suivi de progression local.

## Structure

- `index.html` : redirection vers l'accueil
- `games/` : pages des exercices et cours
- `js/` : logique applicative, données des exercices, score, UI
- `css/` : thème, layout, composants et styles par page
- `admin/revision-complete.mjs` : script de vérification globale

## Démarrage rapide

1. Ouvrir `index.html` (ou `games/accueil.html`) dans le navigateur.
2. Lancer les exercices depuis l'accueil.
3. Consulter la progression et les résultats sur `games/evaluations.html`.

## Vérification cohérence

Exécuter :

```bash
node admin/revision-complete.mjs
```

Le script contrôle notamment :

- cohérence de `js/exercises-config.js`
- existence des références HTML (`src` / `href`)
- syntaxe JavaScript
- artefacts d'encodage
- fichiers parasites

## Documentation complémentaire

- `QUICK_START.md`
- `VOTE_SYSTEM.md`
- `DEMO_VOTES.md`
