# Démo votes (mise à jour)

## État de la fonctionnalité
La démo interactive de vote (boutons 👍👎 sur chaque jeu) n'est pas active dans cette version.

Ce qui fonctionne:
- le schéma de données `votes` existe dans `ScoreManager`
- la page `games/evaluations.html` sait agréger des votes existants avec `getVotesStats(...)`

Ce qui ne fonctionne pas (actuellement):
- capture d'un vote utilisateur en direct depuis une page de jeu

## Vérification rapide

1. Ouvrir `games/evaluations.html`.
2. Vérifier la section `Avis sur les jeux`.
3. Constater que les compteurs restent à `0` tant qu'aucune donnée `votes` n'est injectée dans le store.

## Test manuel (console)

```javascript
const m = ScoreManager.readMetrics('clavier');
ScoreManager.writeMetrics('clavier', {
  ...m,
  votes: { like: 3, dislike: 1 }
});
```

Ensuite, recharger `games/evaluations.html` pour voir la mise à jour des totaux.

## Stockage

- clé locale: `ah:scores:v1`
- format: `{ scores: { [page]: { ..., votes: { like, dislike } } }, sessions: [] }`
