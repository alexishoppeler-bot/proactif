/* ===== JS/DATA/COMPLETER-DATA.JS ===== */
'use strict';

window.COMPLETER_DATA = [
  {
    category: 'Formulaire',
    text: 'J’écris mon ___ de famille dans la première case.',
    answer: 'nom',
    choices: ['nom', 'pays', 'mail', 'document'],
    hint: 'Exemple : Dupont.'
  },

  {
    category: 'Formulaire',
    text: 'J’écris mon ___ personnel après le nom.',
    answer: 'prénom',
    choices: ['prénom', 'âge', 'numéro', 'titre'],
    hint: 'Exemple : Nadia.'
  },

  {
    category: 'Adresse',
    text: 'J’écris mon ___ complète avec la rue et le numéro.',
    answer: 'adresse',
    choices: ['adresse', 'signature', 'photo', 'question'],
    hint: 'C’est l’endroit où vous habitez.'
  },

  {
    category: 'Contact',
    text: 'J’écris mon numéro de ___ pour être contacté.',
    answer: 'téléphone',
    choices: ['téléphone', 'passeport', 'clavier', 'papier'],
    hint: 'Il commence souvent par 07 en Suisse.'
  },

  {
    category: 'Contact',
    text: 'J’écris mon ___ pour recevoir un message électronique.',
    answer: 'e-mail',
    choices: ['e-mail', 'nom', 'pays', 'stylo'],
    hint: 'Exemple : nom@email.ch'
  },

  {
    category: 'Identité',
    text: 'J’écris ma date de ___ : jour, mois, année.',
    answer: 'naissance',
    choices: ['naissance', 'ville', 'réponse', 'case'],
    hint: 'Exemple : 12.05.1990'
  },

  {
    category: 'Adresse',
    text: 'J’écris le code ___ de ma commune.',
    answer: 'postal',
    choices: ['postal', 'civil', 'numérique', 'simple'],
    hint: 'Exemple : 1003.'
  },

  {
    category: 'Adresse',
    text: 'J’écris le nom de ma ___ après le code postal.',
    answer: 'ville',
    choices: ['ville', 'date', 'ligne', 'page'],
    hint: 'Exemple : Lausanne.'
  },

  {
    category: 'Document',
    text: 'À la fin du formulaire, je mets ma ___.',
    answer: 'signature',
    choices: ['signature', 'photo', 'copie', 'fenêtre'],
    hint: 'Je signe avec mon nom.'
  },

  {
    category: 'Action',
    text: 'Je ___ la case correcte si la réponse est oui.',
    answer: 'coche',
    choices: ['coche', 'range', 'ferme', 'charge'],
    hint: 'Action avec une case ☑'
  },

  {
    category: 'Action',
    text: 'Je ___ le formulaire avant de l’envoyer.',
    answer: 'vérifie',
    choices: ['vérifie', 'dessine', 'coupe', 'branche'],
    hint: 'Je contrôle les informations.'
  },

  {
    category: 'Action',
    text: 'Quand tout est fini, je clique sur ___.',
    answer: 'envoyer',
    choices: ['envoyer', 'effacer', 'imprimer', 'ouvrir'],
    hint: 'Bouton final sur un formulaire en ligne.'
  },
];
