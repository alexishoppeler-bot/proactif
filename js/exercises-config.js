'use strict';

(function initExerciseConfig() {
  const nonOrderedPages = ['accueil', 'evaluations', 'regles', 'donnees'];
  const entries = [
    { page: 'accueil', name: 'Accueil', icon: '🏠', cat: 'Navigation' },
    { page: 'cours-protection-donnees', name: 'Cours: Protection des données', icon: '🔒', cat: 'Cours' },
    { page: 'cours-vocabulaire-pro', name: 'Cours: Vocabulaire pro', icon: '🧠', cat: 'Cours' },
    { page: 'cours-joindre-fichiers', name: 'Cours: Joindre des fichiers', icon: '📎', cat: 'Cours' },
    { page: 'cours-revision-semaine', name: 'Cours: Révision semaine', icon: '📚', cat: 'Cours' },
    { page: 'formulaire', name: 'Formulaire', icon: '📝', cat: 'Candidature' },
    { page: 'email-ecrire', name: 'Écrire un e-mail', icon: '✉️', cat: 'Communication' },
    { page: 'email-pro', name: 'E-mails professionnels', icon: '📧', cat: 'Communication' },
    { page: 'fenetres-web', name: 'Fenêtres internet', icon: '🪟', cat: 'Navigation' },
    { page: 'dossiers-explorateur', name: 'Explorateur de dossiers', icon: '📁', cat: 'Navigation' },
    { page: 'alphabet', name: 'Alphabet', icon: '🔤', cat: 'Langue' },
    { page: 'clavier', name: 'Clavier', icon: '⌨️', cat: 'Langue' },
    { page: 'ecouter', name: 'Écouter', icon: '🎧', cat: 'Langue' },
    { page: 'cliquer', name: 'Cliquer', icon: '🖱️', cat: 'Compétences' },
    { page: 'cherche-clique', name: 'Cherche & clique', icon: '🔎', cat: 'Compétences' },
    { page: 'completer', name: 'Compléter', icon: '🧩', cat: 'Compétences' },
    { page: 'anagramme', name: 'Anagramme', icon: '🔀', cat: 'Jeu' },
    { page: 'apparier', name: 'Apparier', icon: '🔗', cat: 'Jeu' },
    { page: 'pendu', name: 'Pendu', icon: '🪢', cat: 'Jeu' },
    { page: 'vrai-faux', name: 'Vrai / Faux', icon: '✅', cat: 'Jeu' },
    { page: 'classement', name: 'Classement', icon: '📊', cat: 'Jeu' },
    { page: 'mots-croises', name: 'Mots croisés', icon: '🧱', cat: 'Jeu' },
    { page: 'mots-meles', name: 'Mots mêlés', icon: '🔠', cat: 'Jeu' },
    { page: 'demeler', name: 'Démêler', icon: '🧶', cat: 'Jeu' },
    { page: 'quiz', name: 'Quiz', icon: '❓', cat: 'Jeu' },
    { page: 'trier', name: 'Trier', icon: '🗂️', cat: 'Jeu' },
    { page: 'paire', name: 'Paires', icon: '🃏', cat: 'Jeu' },
    { page: 'evaluations', name: 'Évaluations', icon: '📈', cat: 'Suivi' },
    { page: 'regles', name: 'Règles XP', icon: '📏', cat: 'Suivi' },
    { page: 'donnees', name: 'Données', icon: '💾', cat: 'Suivi' }
  ];

  const meta = {};
  const orderedPages = [];
  const xpByPage = {};
  for (const e of entries) {
    meta[e.page] = {
      name: e.name,
      icon: e.icon,
      cat: e.cat,
      href: e.page + '.html'
    };
    if (!nonOrderedPages.includes(e.page)) {
      orderedPages.push(e.page);
      xpByPage[e.page] = { perCorrect: 1, perAttempt: 0, completionBonus: 3 };
    }
  }

  window.EXERCISE_CONFIG = {
    meta,
    orderedPages,
    nonOrderedPages,
    bonusExercises: [],
    xpRules: { byPage: xpByPage }
  };
})();
