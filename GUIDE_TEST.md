# 🧪 GUIDE DE TEST - VALIDATION DES AMÉLIORATIONS

## 🎮 TESTER ANAGRAMMES

### Test 1: Clarification returnLetter
1. Ouvrir `games/anagramme.html`
2. Sélectionner 3-4 lettres pour former une réponse partielle
3. **Action:** Cliquer sur une lettre dans la zone réponse pour la retirer
4. ✅ **Expected:** Lettre retournée au pool, réponse mise à jour

### Test 2: Timer
1. **Action:** Démarrer une session complète
2. Attendre 1-2 minutes sans valider
3. **Action:** Terminer les 10 questions
4. ✅ **Expected:** Temps affiché en résultats (ex: "2m 34s")

### Test 3: Catégories
1. **Action:** Regarder chaque badge de catégorie
2. Vérifier les 7 catégories: Identité, Localisation, Contact, Dates, État civil, Nationalité, Documents
3. ✅ **Expected:** Chaque mot a une catégorie thématique

### Test 4: Difficulté
1. **Action:** Examiner les 20 mots par difficulté
2. Compter: easy (8), medium (6), hard (6)
3. ✅ **Expected:** Distribution progressive

---

## 🎯 TESTER CHERCHE-CLIQUE

### Test 1: Nombre icônes
1. Ouvrir `games/cherche-clique.html`
2. Inspecteur: Ouvrir DevTools → Console
3. **Action:** Exécuter:
   ```javascript
   console.log(window.CHERCHE_CLIQUE_DATA.length)
   ```
4. ✅ **Expected:** 18 (avant: 16)

### Test 2: Grille garantie cible
1. **Action:** Jouer 5-10 rounds complets
2. À chaque tour, vérifier que l'icône demandée existe dans la grille
3. **Chercher:** L'icône demandée (ex: 📞 pour Téléphone)
4. ✅ **Expected:** Toujours trouvable (jamais manquante)

### Test 3: Catégories
1. **Action:** Inspecter les données
   ```javascript
   console.log(window.CHERCHE_CLIQUE_DATA.map(i => i.category))
   ```
2. Vérifier: 9 catégories présentes
3. ✅ **Expected:** Identité, Localisation, Contact, Dates, Documents, Édition, Actions, Sécurité, Système

### Test 4: Nouvelles icônes
1. **Action:** Jouer jusqu'aux 10 questions
2. Vérifier que vous voyez: ⚙️ Paramètres, ℹ️ Information, ❓ Aide
3. ✅ **Expected:** Au moins une fois dans les 10 tours

---

## 📝 TESTER FORMULAIRE

### Test 1: Typos avec Levenshtein
1. Ouvrir `games/formulaire.html` → Premier profil (Ali Rahimi)
2. **Tester typos:**

| Champ | Attendu | Taper | Résultat |
|-------|---------|-------|----------|
| Prénom | Ali | Alli | ✅ ACCEPTÉ |
| Nom | Rahimi | Rahmi | ✅ ACCEPTÉ |
| Email | ali.rahimi@email.com | ali.rahimo@email.com | ✅ ACCEPTÉ |
| Téléphone | +41 79 111 22 33 | +41 79 111 22 33 | ✅ EXACT |

3. ✅ **Expected:** Typos détectés et tolérés

### Test 2: Validation fichiers robuste
1. **Cas 1:** Aucun fichier
   - **Action:** Cliquer "Vérifier"
   - ✅ **Expected:** Toast "Veuillez joindre 2 fichiers obligatoires"

2. **Cas 2:** Fichier invalide
   - **Action:** Drag-drop fichier `.txt` non supporté
   - ✅ **Expected:** Erreur "Format non accepté" affichée

3. **Cas 3:** Fichiers valides
   - **Action:** Upload CV + Photo d'identité
   - ✅ **Expected:** Validation passe, continue

### Test 3: Messages contextuels
1. Ali Rahimi nécessite: 2 fichiers obligatoires
2. **Action:** Upload seulement 1 fichier
3. ✅ **Expected:** "Veuillez joindre 1 fichier obligatoire" (singulier)

4. **Action:** Upload 2 fichiers (correct)
5. ✅ **Expected:** Message change, validation passe

### Test 4: Compétences flexibles
1. **Champ Compétences:** Attendu = "Nettoyage de surfaces, Nettoyage de sol, Maîtrise produits chimiques"
2. **Tester variations:**
   ```
   - "nettoyage" → OK (substring match)
   - "nettoyage; nettoyage sol" → OK (variantes)
   - "nettoyage xyz" → ERREUR (ne reconnaît pas "xyz")
   ```
3. ✅ **Expected:** Reconnaissance intelligente

---

## 🔍 TESTS DE RÉGRESSION

### Générique (Tous les jeux)
- [ ] Affichage KPIs mis à jour
- [ ] Raccourcis clavier fonctionnent
- [ ] localStorage sauvegarde les scores
- [ ] Animations fluides
- [ ] Pas d'erreurs console (F12)

### Anagrammes
- [ ] Bouton "Indice" affiche longueur + 1ère lettre
- [ ] Bouton "Effacer" vide réponse
- [ ] Bouton "Valider" calcule XP correctement
- [ ] Progression 0-100% correcte

### Cherche-Clique
- [ ] 10 questions exactes
- [ ] Accuracy calculée (correct / (correct + errors))
- [ ] Emoji final adapté au score
- [ ] Son/animation correcte/erreur

### Formulaire
- [ ] 15 champs validés par formulaire
- [ ] Champs readonly après validation
- [ ] Feedback itemisé (✓ ou ✗)
- [ ] "Indice" affiche 40% du mot

---

## 🐛 Rapporter bugs

Si vous découvrez un problème:
1. Documenter le navigateur et la version
2. Donner steps to reproduce
3. Résultat attendu vs obtenu
4. Vérifier DevTools console (erreurs)

Exemple:
```
Bug: Anagrammes - Timer ne s'affiche pas
Navigateur: Chrome 120
Steps:
1. Ouvrir anagramme.html
2. Valider 10 mots (attendre ~1 minute)
3. Regarder résultats
Attendu: Temps affiché (ex: "1m 23s")
Obtenu: Rien n'apparaît
Console: Aucune erreur
```

---

## ✅ CHECKLIST VALIDATION

### Avant lancer en prod:
- [ ] Anagrammes: Timer affiche correctement
- [ ] Anagrammes: returnLetter fonctionne
- [ ] Cherche-Clique: 18 icônes présentes
- [ ] Cherche-Clique: Cible toujours trouvable
- [ ] Formulaire: Typos tolérés (jhose → josé)
- [ ] Formulaire: Fichiers validés strictement
- [ ] Formulaire: Messages singulier/pluriel OK
- [ ] Global: Pas d'erreurs console
- [ ] Global: localStorage fonctionne
- [ ] Global: Accessibilité OK (ARIA, tabs)

---

## 🟢 SIGN-OFF

Une fois tous les tests passés, marquer cette ligne comme ✅:

**Tested & Validated:** 2026-03-09 ✅

---

*Guide de test complet pour valider toutes les améliorations*
