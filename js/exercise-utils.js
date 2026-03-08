/* ===== JS/EXERCISE-UTILS.JS - Fonctions utilitaires pour les exercices ===== */
'use strict';

const EXERCISE_COACH_TIPS = {
  default: [
    'Relis la consigne et isole le mot-clé (ouvrir, trier, compléter, etc.).',
    'Fais une seule action à la fois, puis vérifie le retour visuel.',
    'Si tu bloques, recommence la manche et vise d\'abord la précision.'
  ],
  'fenetres-web': [
    'Observe l\'état de la fenêtre (ouverte, réduite, active) avant de cliquer.',
    'Utilise la barre des tâches pour restaurer une fenêtre réduite.',
    'Les raccourcis clavier (? pour aide) peuvent accélérer la bonne action.'
  ],
  'dossiers-explorateur': [
    'Repère d\'abord le dossier source puis le dossier cible.',
    'Fais glisser-déposer un seul élément à la fois pour éviter les erreurs.',
    'Vérifie le chemin affiché avant de valider l\'étape.'
  ],
  formulaire: [
    'Vérifie chaque champ avant validation, surtout e-mail et téléphone.',
    'Copie exactement les valeurs attendues (accents, espaces, ponctuation).',
    'Corrige les champs en erreur un par un au lieu de tout retaper.'
  ],
  'email-ecrire': [
    'Commence par l\'objet puis structure le message en phrases courtes.',
    'Relis la demande et vérifie les éléments obligatoires.',
    'Vérifie la politesse, la clarté et la présence des informations clés.'
  ],
  'email-pro': [
    'Reste formel et précis: objet, demande, délai.',
    'Évite les formulations ambiguës et relis le ton global.',
    'Vérifie les fautes avant d\'envoyer.'
  ],
  clavier: [
    'Regarde la touche attendue avant de taper.',
    'Ralentis légèrement pour réduire les erreurs de frappe.',
    'Concentre-toi sur la régularité plutôt que sur la vitesse.'
  ],
  quiz: [
    'Élimine d\'abord les réponses clairement fausses.',
    'Repère les mots absolus (toujours, jamais) qui piègent souvent.',
    'Reviens à la définition de base si tu hésites.'
  ],
  alphabet: [
    'Récite mentalement la suite avant de répondre.',
    'Concentre-toi sur la lettre juste avant et juste après.',
    'Ralentis pour éviter les inversions de lettres.'
  ],
  ecouter: [
    'Écoute une première fois sans écrire, puis une deuxième fois pour noter.',
    'Focalise-toi sur les mots-clés (noms, dates, actions).',
    'Si un mot manque, complète d\'abord le reste de la phrase.'
  ],
  cliquer: [
    'Lis la cible complète avant de cliquer.',
    'Privilégie la précision à la vitesse sur les premières tentatives.',
    'Balaye l\'écran de gauche à droite pour ne rien oublier.'
  ],
  'cherche-clique': [
    'Repère la forme/couleur de l\'élément recherché avant d\'agir.',
    'Découpe visuellement l\'écran en zones et scanne zone par zone.',
    'Évite les clics impulsifs: confirme la cible puis clique.'
  ],
  completer: [
    'Lis toute la phrase avant de proposer le mot manquant.',
    'Utilise la grammaire de la phrase pour éliminer les mauvaises options.',
    'Vérifie accords et conjugaison avant validation.'
  ],
  anagramme: [
    'Repère les voyelles et place-les d\'abord.',
    'Cherche les préfixes/suffixes fréquents (re-, -tion, -ment, etc.).',
    'Teste des combinaisons courtes puis allonge le mot.'
  ],
  apparier: [
    'Commence par les associations évidentes.',
    'Élimine les paires impossibles pour réduire les choix.',
    'Valide mentalement chaque duo avant de confirmer.'
  ],
  pendu: [
    'Commence par les lettres fréquentes (E, A, S, R, T).',
    'Observe le motif des lettres déjà trouvées pour prédire le mot.',
    'Garde les lettres rares (W, K, X, Z) pour la fin.'
  ],
  'vrai-faux': [
    'Repère les formulations absolues qui sont souvent fausses.',
    'Confronte l\'affirmation aux règles de base du thème.',
    'En cas de doute, choisis l\'option la plus cohérente avec la consigne.'
  ],
  classement: [
    'Identifie d\'abord le critère de tri (ordre, date, catégorie).',
    'Place les extrêmes (plus petit/plus grand) avant le reste.',
    'Refais une vérification finale du 1er au dernier élément.'
  ],
  'mots-croises': [
    'Commence par les définitions les plus simples.',
    'Utilise les lettres déjà posées pour déduire les mots voisins.',
    'Si un mot bloque, passe à une autre case puis reviens.'
  ],
  'mots-meles': [
    'Cherche les mots rares/longs en premier.',
    'Balaye ligne par ligne puis colonne par colonne.',
    'N\'oublie pas les diagonales et les mots à l\'envers.'
  ],
  demeler: [
    'Repère les groupes de lettres qui vont ensemble.',
    'Teste l\'ordre des syllabes plutôt que des lettres isolées.',
    'Lis le mot à voix basse pour vérifier s\'il sonne juste.'
  ],
  trier: [
    'Sépare d\'abord les éléments par grandes catégories.',
    'Applique un seul critère de tri à la fois.',
    'Contrôle chaque groupe avant de valider la manche.'
  ],
  paire: [
    'Mémorise la position de chaque carte retournée.',
    'Joue méthodiquement de gauche à droite.',
    'Privilégie la mémoire visuelle plutôt que le hasard.'
  ],
  'cours-protection-donnees': [
    'Retiens la règle clé de la section avant de passer à la suite.',
    'Associe chaque règle à un exemple concret du quotidien.',
    'Reformule la règle avec tes mots pour la mémoriser.'
  ],
  'cours-vocabulaire-pro': [
    'Note les mots nouveaux et leur définition simple.',
    'Réutilise chaque terme dans une phrase courte.',
    'Vérifie les faux amis et les mots proches.'
  ],
  'cours-joindre-fichiers': [
    'Vérifie le bon document avant de le joindre.',
    'Contrôle le nom du fichier et son format.',
    'Ajoute une mention de pièce jointe dans le message.'
  ],
  'cours-revision-semaine': [
    'Reprends les notions une par une.',
    'Commence par ce qui te pose le plus de difficultés.',
    'Fais une mini-synthèse en fin de session.'
  ],
  accueil: [
    'Choisis un exercice clair plutôt que de sauter entre plusieurs jeux.',
    'Fixe-toi un objectif simple pour la session (précision ou vitesse).',
    'Termine une activité avant d’en ouvrir une autre.'
  ],
  evaluations: [
    'Regarde d’abord la précision globale avant les XP.',
    'Repère les exercices les plus faibles et priorise-les.',
    'Répète une session courte sur un jeu ciblé puis compare.'
  ],
  regles: [
    'Comprends les règles de score avant de viser le maximum XP.',
    'Priorise la précision: elle améliore aussi la progression.',
    'Utilise les règles pour planifier ta séance suivante.'
  ],
  donnees: [
    'Vérifie les indicateurs importants: correct, erreurs, précision.',
    'Observe la tendance sur plusieurs sessions, pas une seule.',
    'Utilise ces données pour choisir l’exercice suivant.'
  ]
};

const EXERCISE_COACH_TIPS_BY_CATEGORY = {
  Navigation: [
    'Repère d\'abord où tu veux aller, puis fais une action unique.',
    'Observe l\'état visuel (élément actif, fenêtre ouverte, dossier courant).',
    'Si tu hésites, reviens à l\'écran stable précédent puis recommence.'
  ],
  Langue: [
    'Lis/écoute la consigne en entier avant de répondre.',
    'Privilégie précision et orthographe avant la vitesse.',
    'Valide mentalement la réponse avant de confirmer.'
  ],
  Compétences: [
    'Décompose la tâche en micro-actions.',
    'Vérifie un résultat à la fois avant de passer au suivant.',
    'Corrige immédiatement la première erreur repérée.'
  ],
  Jeu: [
    'Identifie le pattern avant d\'agir.',
    'Élimine les options peu probables pour réduire l\'incertitude.',
    'Garde un rythme régulier pour limiter les fautes.'
  ],
  Communication: [
    'Structure d\'abord ton message, puis affine la formulation.',
    'Vérifie la clarté et le ton avant validation.',
    'Relis les points obligatoires une dernière fois.'
  ],
  Candidature: [
    'Vérifie chaque champ sensible (mail, téléphone, date).',
    'Reste cohérent entre toutes les informations saisies.',
    'Corrige les erreurs une à une avant de soumettre.'
  ],
  Cours: [
    'Retiens une idée clé à la fois.',
    'Associe la règle à un exemple concret.',
    'Fais une mini-récapitulation en fin d\'activité.'
  ],
  Suivi: [
    'Regarde la tendance avant la valeur brute.',
    'Priorise les exercices au plus faible score de précision.',
    'Lance une courte session de correction ciblée.'
  ]
};

const EXERCISE_COACH = {
  byPage: {},
  minToastGapMs: 5000,
  accuracyToastEveryAttempts: 8,
  accuracyToastStartAtAttempts: 6
};
const EXERCISE_COACH_STORAGE_KEY = 'exerciseCoachOptions';

function getExerciseName(page) {
  const meta = (window.EXERCISE_CONFIG || {}).meta || {};
  return (meta[page] && meta[page].name) || page;
}

function getExerciseCategory(page) {
  const meta = (window.EXERCISE_CONFIG || {}).meta || {};
  return (meta[page] && meta[page].cat) || null;
}

function getCoachTips(page) {
  if (EXERCISE_COACH_TIPS[page]) return EXERCISE_COACH_TIPS[page];
  const category = getExerciseCategory(page);
  if (category && EXERCISE_COACH_TIPS_BY_CATEGORY[category]) {
    return EXERCISE_COACH_TIPS_BY_CATEGORY[category];
  }
  return EXERCISE_COACH_TIPS.default;
}

function getCoachContextLabel(page) {
  const category = getExerciseCategory(page);
  return category || 'Général';
}

function getCoachState(page) {
  if (!EXERCISE_COACH.byPage[page]) {
    EXERCISE_COACH.byPage[page] = {
      attempts: 0,
      correctTotal: 0,
      errorTotal: 0,
      errorStreak: 0,
      successStreak: 0,
      lastToastAt: 0,
      lastAccuracyToastAttempt: 0
    };
  }
  return EXERCISE_COACH.byPage[page];
}

function getCoachLevel(errorStreak) {
  if (errorStreak >= 6) return 3;
  if (errorStreak >= 3) return 2;
  return 1;
}

function pickCoachTip(page, errorStreak) {
  const tips = getCoachTips(page);
  const tier = Math.max(1, Math.floor(errorStreak / 2));
  const index = Math.min(tips.length - 1, tier - 1);
  return {
    tip: tips[index],
    level: getCoachLevel(errorStreak)
  };
}

function maybeShowCoachToast(page, delta) {
  const state = getCoachState(page);
  const typed = Math.max(1, Number(delta.typed) || 0);
  state.attempts += typed;

  const errors = Math.max(0, Number(delta.errors) || 0);
  const correct = Math.max(0, Number(delta.correct) || 0);
  state.errorTotal += errors;
  state.correctTotal += correct;

  if (errors > 0) {
    state.errorStreak += errors;
    state.successStreak = 0;
  } else if (correct > 0) {
    state.successStreak += correct;
    if (state.errorStreak >= 2 && state.successStreak >= 1) {
      state.errorStreak = 0;
      const now = Date.now();
      if (now - state.lastToastAt >= EXERCISE_COACH.minToastGapMs) {
        state.lastToastAt = now;
        showToast(`Bonne reprise sur ${getExerciseName(page)}. Continue comme ça.`, 'success');
      }
      return;
    }
    state.errorStreak = 0;
    return;
  }

  const now = Date.now();
  const thresholdReached = state.errorStreak === 2 || state.errorStreak === 4 || (state.errorStreak > 4 && state.errorStreak % 3 === 0);
  if (!thresholdReached) return;
  if (now - state.lastToastAt < EXERCISE_COACH.minToastGapMs) return;

  state.lastToastAt = now;
  const choice = pickCoachTip(page, state.errorStreak);
  const context = getCoachContextLabel(page);
  showToast(`Indice ${getExerciseName(page)} (${context}, N${choice.level}): ${choice.tip}`, 'info');
}

function maybeShowAccuracyToast(page, state, now) {
  if (state.attempts < EXERCISE_COACH.accuracyToastStartAtAttempts) return;
  const cadence = EXERCISE_COACH.accuracyToastEveryAttempts;
  const isMilestone = state.attempts % cadence === 0;
  if (!isMilestone) return;
  if (state.lastAccuracyToastAttempt === state.attempts) return;
  if (now - state.lastToastAt < EXERCISE_COACH.minToastGapMs) return;

  state.lastAccuracyToastAttempt = state.attempts;
  const accuracy = calcAccuracy(state.correctTotal, state.correctTotal + state.errorTotal);

  if (accuracy >= 85) {
    state.lastToastAt = now;
    showToast(`Précision ${getExerciseName(page)}: ${accuracy}% (excellent).`, 'success');
    return;
  }
  if (accuracy >= 65) {
    state.lastToastAt = now;
    showToast(`Précision ${getExerciseName(page)}: ${accuracy}% (solide).`, 'info');
    return;
  }
  state.lastToastAt = now;
  showToast(`Précision ${getExerciseName(page)}: ${accuracy}%. Ralentis pour sécuriser tes réponses.`, 'info');
}

function setExerciseCoachOptions(options) {
  const opts = options || {};
  if (Number.isFinite(opts.minToastGapMs) && opts.minToastGapMs >= 500) {
    EXERCISE_COACH.minToastGapMs = Math.round(opts.minToastGapMs);
  }
  if (Number.isFinite(opts.accuracyToastEveryAttempts) && opts.accuracyToastEveryAttempts >= 2) {
    EXERCISE_COACH.accuracyToastEveryAttempts = Math.round(opts.accuracyToastEveryAttempts);
  }
  if (Number.isFinite(opts.accuracyToastStartAtAttempts) && opts.accuracyToastStartAtAttempts >= 1) {
    EXERCISE_COACH.accuracyToastStartAtAttempts = Math.round(opts.accuracyToastStartAtAttempts);
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(EXERCISE_COACH_STORAGE_KEY, JSON.stringify(getExerciseCoachOptions()));
    } catch (err) {
      // ignore storage errors (private mode / quota)
    }
  }
}

function getExerciseCoachOptions() {
  return {
    minToastGapMs: EXERCISE_COACH.minToastGapMs,
    accuracyToastEveryAttempts: EXERCISE_COACH.accuracyToastEveryAttempts,
    accuracyToastStartAtAttempts: EXERCISE_COACH.accuracyToastStartAtAttempts
  };
}

function initExerciseCoachOptionsFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const raw = window.localStorage.getItem(EXERCISE_COACH_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;
    setExerciseCoachOptions(parsed);
  } catch (err) {
    // ignore malformed data
  }
}

if (typeof window !== 'undefined') {
  window.setExerciseCoachOptions = setExerciseCoachOptions;
  window.getExerciseCoachOptions = getExerciseCoachOptions;
  initExerciseCoachOptionsFromStorage();
}

/**
 * Enregistrer une progression (delta) pour un exercice
 * Appelle ScoreManager.updateMetrics + met a jour le statut in_progress
 * @param {string} page  - identifiant ex: 'clavier'
 * @param {object} delta - {correct, typed, errors, xp}
 */
function recordExerciseProgress(page, delta) {
  ScoreManager.updateMetrics(page, delta);
  ScoreManager.promoteStatus(page, 'in_progress');
  maybeShowCoachToast(page, delta);
  maybeShowAccuracyToast(page, getCoachState(page), Date.now());
}

/**
 * Enregistrer un snapshot complet (ecrase les donnees)
 * @param {string} page
 * @param {object} data - {correct, typed, errors, xp, status}
 */
function recordExerciseSnapshot(page, data) {
  ScoreManager.writeMetrics(page, data);
}

/**
 * Changer le statut d'un exercice
 * @param {string} page
 * @param {string} status - 'not_started' | 'in_progress' | 'completed'
 */
function promoteExerciseStatus(page, status) {
  ScoreManager.promoteStatus(page, status);
  if (status === 'not_started') {
    delete EXERCISE_COACH.byPage[page];
  }
}

/**
 * Demarrer explicitement une session d'exercice
 * @param {string} page
 */
function startExerciseSession(page) {
  ScoreManager.promoteStatus(page, 'in_progress');
  delete EXERCISE_COACH.byPage[page];
}

/**
 * Terminer explicitement une session d'exercice
 * @param {string} page
 */
function endExerciseSession(page) {
  ScoreManager.promoteStatus(page, 'completed');
  // Enregistrer dans l'historique des sessions
  const metrics = ScoreManager.readMetrics(page);
  const meta = (window.EXERCISE_CONFIG || {}).meta || {};
  const gameName = (meta[page] && meta[page].name) || page;
  const accuracy = metrics.typed > 0 ? Math.round((metrics.correct / metrics.typed) * 100) : 0;
  ScoreManager.pushSessionHistory({
    page,
    name: gameName,
    xp: metrics.xp,
    correct: metrics.correct,
    errors: metrics.errors,
    accuracy,
    completedAt: Date.now()
  });
  delete EXERCISE_COACH.byPage[page];
}

/**
 * Calculer la precision (en %)
 * @param {number} correct
 * @param {number} typed
 * @returns {number}
 */
function calcAccuracy(correct, typed) {
  if (!typed) return 0;
  return Math.round((correct / typed) * 100);
}

/**
 * Calculer les XP gagnes pour un exercice (formule simple)
 * 1 correct = 1 XP, bonus si accuracy > 80%
 * @param {number} correct
 * @param {number} typed
 * @returns {number}
 */
function calcXP(correct, typed) {
  const base = correct;
  const bonus = calcAccuracy(correct, typed) >= 80 ? Math.floor(correct * 0.2) : 0;
  return base + bonus;
}

/**
 * Creer un effet de confetti (succes)
 */
function launchConfetti() {
  const colors = ['#4f8ef7','#7c5ff5','#34d399','#f59e0b','#f87171'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '0';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width  = (Math.random() * 8 + 4) + 'px';
      el.style.height = (Math.random() * 8 + 4) + 'px';
      el.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }, i * 20);
  }
}

/**
 * Formater un nombre pour affichage
 * @param {number} n
 * @returns {string}
 */
function fmt(n) {
  return (n || 0).toString();
}

/**
 * Afficher un toast de notification
 * @param {string} msg
 * @param {string} type - 'success' | 'error' | 'info'
 */
function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const colors = { success: '#34d399', error: '#f87171', info: '#4f8ef7' };
  toast.style.cssText = `background:var(--surface);border:1px solid ${colors[type] || colors.info}40;color:var(--text);padding:12px 18px;border-radius:12px;font-size:13px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,0.4);animation:fadeUp 0.3s ease;max-width:280px;border-left:3px solid ${colors[type] || colors.info};`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

/**
 * Les regles XP sont desormais centralisees sur games/regles.html.
 * Cette fonction reste en no-op pour compatibilite avec les pages existantes.
 */
function showXPRules() {
  return;
}

/**
 * Obtenir l'exercice suivant recommande dans le parcours pedagogique
 * @param {string} currentPage - page actuelle (ex: 'clavier')
 * @returns {object} {name: string, href: string} ou {name: null, href: null} si fin du cycle
 */
function getNextExercise(currentPage) {
  const config = window.EXERCISE_CONFIG || {};
  const pages = config.orderedPages || [];
  const meta = config.meta || {};
  const sequence = pages.map(page => ({
    page,
    name: (meta[page] && meta[page].name) ? meta[page].name.replace(/^[^\s]+\s/, '') : page,
    href: (meta[page] && meta[page].href) ? meta[page].href : `${page}.html`
  }));

  const currentIndex = sequence.findIndex(ex => ex.page === currentPage);
  if (currentIndex === -1) return { name: null, href: null };

  const nextIndex = (currentIndex + 1) % sequence.length;
  const nextEx = sequence[nextIndex];
  return { name: nextEx.name, href: nextEx.href };
}

/**
 * Obtenir l'exercice precedent dans le parcours pedagogique
 * @param {string} currentPage - page actuelle (ex: 'clavier')
 * @returns {object} {name: string, href: string}
 */
function getPrevExercise(currentPage) {
  const config = window.EXERCISE_CONFIG || {};
  const pages = config.orderedPages || [];
  const meta = config.meta || {};
  const currentIndex = pages.indexOf(currentPage);
  if (currentIndex === -1) return { name: null, href: null };

  const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
  const prevPage = pages[prevIndex];
  const metaData = (meta[prevPage] && meta[prevPage].name) ? meta[prevPage] : {};
  return {
    name: metaData.name || prevPage,
    href: metaData.href || `${prevPage}.html`
  };
}

/**
 * Copier un résumé de session dans le presse-papiers
 * @param {string} pageName - nom du jeu
 * @param {object} stats - {correct, errors, xp, accuracy}
 */
function copyResultSummary(pageName, stats) {
  const date = new Date().toLocaleDateString('fr-CH');
  const text = [
    `Plateforme Autonomie numérique — ${date}`,
    `Jeu : ${pageName}`,
    `Correctes : ${stats.correct} | Erreurs : ${stats.errors}`,
    `Précision : ${stats.accuracy}% | XP : ${stats.xp}`,
    `---`,
    `Résultats générés sur la plateforme locale`
  ].join('\n');

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Résumé copié dans le presse-papiers !', 'success'))
      .catch(() => showToast('Impossible de copier automatiquement. Assurez-vous que le site est en HTTPS ou localhost.', 'error'));
    return;
  }

  const helper = document.createElement('textarea');
  helper.value = text;
  helper.setAttribute('readonly', '');
  helper.style.position = 'absolute';
  helper.style.left = '-9999px';
  document.body.appendChild(helper);
  helper.select();
  try {
    document.execCommand('copy');
    showToast('Résumé copié dans le presse-papiers !', 'success');
  } catch (err) {
    showToast('Impossible de copier automatiquement. Assurez-vous que le site est en HTTPS ou localhost.', 'error');
  } finally {
    helper.remove();
  }
}
