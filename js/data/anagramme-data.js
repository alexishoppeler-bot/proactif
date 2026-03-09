/* ===== JS/DATA/ANAGRAMME-DATA.JS ===== */
‘use strict’;

window.ANAGRAMME_DATA = [
  // Identité (Facile)
  { word: ‘NOM’, hint: “Ce que vous écrivez pour indiquer votre nom de famille”, category: “Identité”, difficulty: ‘easy’ },
  { word: ‘PRENOM’, hint: “Votre nom personnel”, category: “Identité”, difficulty: ‘medium’ },
  { word: ‘SEXE’, hint: “Case à cocher : homme ou femme”, category: “Identité”, difficulty: ‘easy’ },

  // Localisation
  { word: ‘ADRESSE’, hint: “L’endroit où vous habitez”, category: “Localisation”, difficulty: ‘medium’ },
  { word: ‘VILLE’, hint: “La commune où vous habitez”, category: “Localisation”, difficulty: ‘easy’ },
  { word: ‘RUE’, hint: “Nom de la voie dans l’adresse”, category: “Localisation”, difficulty: ‘easy’ },
  { word: ‘NUMERO’, hint: “Chiffre de la maison ou du bâtiment”, category: “Localisation”, difficulty: ‘easy’ },
  { word: ‘CODEPOSTAL’, hint: “Les chiffres de la commune ou du quartier”, category: “Localisation”, difficulty: ‘medium’ },
  { word: ‘PAYS’, hint: “Exemple : Suisse, France, Portugal”, category: “Localisation”, difficulty: ‘easy’ },

  // Contact
  { word: ‘EMAIL’, hint: “Adresse électronique pour recevoir des messages”, category: “Contact”, difficulty: ‘easy’ },
  { word: ‘TELEPHONE’, hint: “Numéro pour vous appeler”, category: “Contact”, difficulty: ‘medium’ },

  // État civil & Dates
  { word: ‘DATE’, hint: “Jour, mois et année”, category: “Dates”, difficulty: ‘easy’ },
  { word: ‘NAISSANCE’, hint: “Mot utilisé dans ‘date de ...’”, category: “Dates”, difficulty: ‘medium’ },
  { word: ‘ETATCIVIL’, hint: “Situation comme célibataire ou marié”, category: “État civil”, difficulty: ‘hard’ },
  { word: ‘MARIÉ’, hint: “Quand on a un mari ou une femme”, category: “État civil”, difficulty: ‘easy’ },
  { word: ‘CELIBATAIRE’, hint: “Quand on n’est pas marié”, category: “État civil”, difficulty: ‘hard’ },

  // Nationalité & Documents
  { word: ‘NATIONALITE’, hint: “Pays auquel vous appartenez”, category: “Nationalité”, difficulty: ‘hard’ },
  { word: ‘SIGNATURE’, hint: “Votre nom écrit à la main à la fin du document”, category: “Documents”, difficulty: ‘medium’ },
  { word: ‘DOCUMENT’, hint: “Papier demandé avec le formulaire”, category: “Documents”, difficulty: ‘easy’ },
  { word: ‘FORMULAIRE’, hint: “Document avec des cases à remplir”, category: “Documents”, difficulty: ‘hard’ }
];
