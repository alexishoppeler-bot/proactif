# Système de votes (état actuel)

## Résumé
Le projet conserve un modèle de votes dans `ScoreManager` (champs `votes.like` et `votes.dislike` par exercice), mais l'interface de vote n'est pas active dans les pages de jeux.

## Implémentation réelle

- Stockage principal: `localStorage['ah:scores:v1']`
- Structure: `scores[page].votes = { like, dislike }`
- API disponible:
  - `ScoreManager.getVotesStats(pages)`
  - `ScoreManager.readMetrics(page)` / `writeMetrics(page, data)` / `updateMetrics(page, delta)`

## Ce qui n'est pas actif

- Pas de boutons de vote fonctionnels injectés automatiquement.
- `js/vote-system.js` contient actuellement un placeholder de compatibilité.

## Où c'est affiché

- `games/evaluations.html` affiche des compteurs globaux `J'aime / Je n'aime pas` via `ScoreManager.getVotesStats(...)`.

## Exemple de données

```json
{
  "scores": {
    "clavier": {
      "correct": 10,
      "typed": 12,
      "errors": 2,
      "xp": 14,
      "status": "in_progress",
      "votes": { "like": 0, "dislike": 0 }
    }
  },
  "sessions": []
}
```

## Note
Si vous souhaitez réactiver un vrai vote utilisateur (toggle like/dislike), il faut implémenter une UI et une écriture explicite des champs `votes` par page.
