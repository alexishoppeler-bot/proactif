/* ===== JS/DATA/ECOUTER-DATA.JS — Compréhension orale ===== */
/*
  Pour les 'histoire' : champ `transcript` (texte continu, 1 voix).
  Pour les 'dialogue'  : champ `lines` (tableau de répliques).
    Chaque ligne : { speaker: "Nom", gender: "f"|"m", text: "..." }
    Le transcript est généré automatiquement pour l'affichage.
*/
'use strict';

window.ECOUTER_DATA = [

  {
    id: 'ep01',
    type: 'histoire',
    title: 'Le formulaire de Nadia',
    category: 'Remplir un formulaire',
    transcript: `Nadia est dans un centre administratif. Elle doit remplir un formulaire d’inscription. Elle prend un stylo et lit les questions calmement. Dans la première partie, elle écrit son nom, son prénom et sa date de naissance. Ensuite, elle complète son adresse avec la rue, le numéro, le code postal et la ville. Après, elle écrit son numéro de téléphone et son adresse e-mail. Avant de finir, elle relit toutes les informations. Elle voit une petite erreur dans son numéro de téléphone, puis elle la corrige. À la fin, elle signe le document et le remet à l’accueil.`,
    questions: [
      {
        question: 'Que fait Nadia au début ?',
        choices: ['Elle téléphone', 'Elle lit les questions', 'Elle ferme le document', 'Elle imprime une photo'],
        answer: 1,
        explication: 'Nadia commence par lire les questions calmement avant d’écrire.'
      },
      {
        question: 'Quelles informations Nadia écrit-elle dans la première partie ?',
        choices: ['Son pays et son travail', 'Son nom, son prénom et sa date de naissance', 'Son mot de passe et son code PIN', 'Le nom de son médecin'],
        answer: 1,
        explication: 'Dans la première partie, elle écrit son nom, son prénom et sa date de naissance.'
      },
      {
        question: 'Que fait Nadia avant de signer ?',
        choices: ['Elle part', 'Elle appelle quelqu’un', 'Elle relit et corrige une erreur', 'Elle change de formulaire'],
        answer: 2,
        explication: 'Elle relit le formulaire et corrige une erreur dans son numéro de téléphone.'
      },
      {
        question: 'Que fait Nadia à la fin ?',
        choices: ['Elle jette le document', 'Elle signe et remet le document à l’accueil', 'Elle envoie un SMS', 'Elle ouvre son e-mail'],
        answer: 1,
        explication: 'À la fin, elle signe le document et le remet à l’accueil.'
      }
    ]
  },

  {
    id: 'ep02',
    type: 'dialogue',
    title: 'Au guichet',
    category: 'Formulaire papier',
    lines: [
      { speaker: 'Agent', gender: 'f', text: 'Bonjour madame, vous avez le formulaire ?' },
      { speaker: 'Amina', gender: 'f', text: 'Bonjour. Oui, mais je ne comprends pas une question.' },
      { speaker: 'Agent', gender: 'f', text: 'Laquelle ?' },
      { speaker: 'Amina', gender: 'f', text: 'Ici, on demande état civil. Qu’est-ce que ça veut dire ?' },
      { speaker: 'Agent', gender: 'f', text: 'Cela veut dire par exemple célibataire, mariée ou divorcée.' },
      { speaker: 'Amina', gender: 'f', text: 'D’accord. Moi, je suis mariée.' },
      { speaker: 'Agent', gender: 'f', text: 'Très bien. Vous pouvez cocher la case mariée.' },
      { speaker: 'Amina', gender: 'f', text: 'Merci. Et ici, je dois écrire mon adresse complète ?' },
      { speaker: 'Agent', gender: 'f', text: 'Oui, la rue, le numéro, le code postal et la ville.' },
      { speaker: 'Amina', gender: 'f', text: 'Très bien, merci beaucoup.' },
    ],
    questions: [
      {
        question: 'Pourquoi Amina parle-t-elle avec l’agent ?',
        choices: ['Elle a perdu son téléphone', 'Elle ne comprend pas une question', 'Elle cherche un emploi', 'Elle veut envoyer un colis'],
        answer: 1,
        explication: 'Amina demande de l’aide parce qu’elle ne comprend pas une question du formulaire.'
      },
      {
        question: 'Quel mot Amina ne comprend-elle pas ?',
        choices: ['Adresse', 'Téléphone', 'État civil', 'Signature'],
        answer: 2,
        explication: 'Le mot qu’elle ne comprend pas est “état civil”.'
      },
      {
        question: 'Quelle est la situation d’Amina ?',
        choices: ['Célibataire', 'Mariée', 'Divorcée', 'Veuve'],
        answer: 1,
        explication: 'Amina dit clairement : “Moi, je suis mariée.”'
      },
      {
        question: 'Que doit-elle écrire dans son adresse complète ?',
        choices: ['Seulement la ville', 'La rue, le numéro, le code postal et la ville', 'Seulement le pays', 'Le nom du bâtiment uniquement'],
        answer: 1,
        explication: 'L’agent explique qu’il faut écrire la rue, le numéro, le code postal et la ville.'
      }
    ]
  },

  {
    id: 'ep03',
    type: 'histoire',
    title: 'Le formulaire en ligne',
    category: 'Formulaire numérique',
    transcript: `Youssef doit remplir un formulaire en ligne pour une inscription. Il ouvre la page sur l’ordinateur et commence à compléter les champs. Il écrit son nom, son prénom, sa date de naissance et son adresse e-mail. Ensuite, il choisit sa nationalité dans une liste. Puis il coche une case pour confirmer que les informations sont correctes. Quand il clique sur envoyer, un message rouge apparaît : champ obligatoire manquant. Youssef regarde de nouveau le formulaire et voit qu’il a oublié son numéro de téléphone. Il l’ajoute, puis il clique encore une fois sur envoyer. Cette fois, le message dit : votre formulaire a bien été envoyé.`,
    questions: [
      {
        question: 'Sur quoi Youssef remplit-il le formulaire ?',
        choices: ['Sur papier', 'Sur un téléphone cassé', 'Sur un ordinateur', 'Sur une clé USB'],
        answer: 2,
        explication: 'Le texte dit qu’il ouvre la page sur l’ordinateur.'
      },
      {
        question: 'Que choisit-il dans une liste ?',
        choices: ['Sa ville', 'Sa nationalité', 'Son mot de passe', 'Son métier'],
        answer: 1,
        explication: 'Youssef choisit sa nationalité dans une liste.'
      },
      {
        question: 'Pourquoi le message rouge apparaît-il ?',
        choices: ['Le site est fermé', 'Il a oublié un champ obligatoire', 'Il a écrit son nom deux fois', 'Il n’a pas de connexion'],
        answer: 1,
        explication: 'Le message rouge indique qu’un champ obligatoire manque.'
      },
      {
        question: 'Qu’avait-il oublié ?',
        choices: ['Son prénom', 'Sa signature', 'Son numéro de téléphone', 'Son pays'],
        answer: 2,
        explication: 'Il avait oublié son numéro de téléphone.'
      }
    ]
  },

  {
    id: 'ep04',
    type: 'dialogue',
    title: 'Avec le formateur',
    category: 'Aide / Compréhension',
    lines: [
      { speaker: 'Formateur', gender: 'm', text: 'Tu as presque fini ?' },
      { speaker: 'Rosa', gender: 'f', text: 'Pas encore. Je ne sais pas où écrire mon e-mail.' },
      { speaker: 'Formateur', gender: 'm', text: 'Regarde en bas de la page, sous le numéro de téléphone.' },
      { speaker: 'Rosa', gender: 'f', text: 'Ah oui, je vois maintenant.' },
      { speaker: 'Formateur', gender: 'm', text: 'Très bien. Et n’oublie pas la date.' },
      { speaker: 'Rosa', gender: 'f', text: 'Je dois écrire la date d’aujourd’hui ?' },
      { speaker: 'Formateur', gender: 'm', text: 'Oui, la date d’aujourd’hui, puis votre signature à la fin.' },
      { speaker: 'Rosa', gender: 'f', text: 'D’accord. Après, je peux donner le document ?' },
      { speaker: 'Formateur', gender: 'm', text: 'Oui, mais relis avant.' },
      { speaker: 'Rosa', gender: 'f', text: 'Très bien, je vais vérifier.' },
    ],
    questions: [
      {
        question: 'Que cherche Rosa ?',
        choices: ['Le numéro de la salle', 'L’endroit pour écrire son e-mail', 'Son manteau', 'Une photo'],
        answer: 1,
        explication: 'Rosa ne sait pas où écrire son e-mail.'
      },
      {
        question: 'Où se trouve le champ e-mail ?',
        choices: ['En haut de la page', 'Sous le numéro de téléphone', 'À gauche du nom', 'Dans une autre salle'],
        answer: 1,
        explication: 'Le formateur dit : “sous le numéro de téléphone”.'
      },
      {
        question: 'Que doit écrire Rosa après ?',
        choices: ['Le nom du formateur', 'La date d’aujourd’hui', 'Le nom de son voisin', 'Une phrase libre'],
        answer: 1,
        explication: 'Le formateur lui rappelle d’écrire la date d’aujourd’hui.'
      },
      {
        question: 'Que doit-elle faire avant de donner le document ?',
        choices: ['Le plier', 'Le jeter', 'Le relire', 'Le scanner'],
        answer: 2,
        explication: 'Le formateur dit clairement : “relis avant”.'
      }
    ]
  },

  {
    id: 'ep05',
    type: 'histoire',
    title: 'Une erreur dans le formulaire',
    category: 'Vérification',
    transcript: `Samir remplit un formulaire rapidement. Il écrit son nom, son prénom, son adresse et son téléphone. Ensuite, il signe sans relire. Quand l’employée regarde le document, elle remarque un problème : le code postal n’est pas correct. Samir regarde de nouveau son adresse et comprend son erreur. Il barre le mauvais numéro, écrit le bon code postal et vérifie aussi la ville. Après cela, le formulaire est correct. Samir comprend qu’il est important de prendre son temps et de vérifier avant de signer.`,
    questions: [
      {
        question: 'Que fait Samir trop vite ?',
        choices: ['Il téléphone', 'Il signe sans relire', 'Il imprime le document', 'Il envoie un e-mail'],
        answer: 1,
        explication: 'Samir signe trop vite, sans relire le formulaire.'
      },
      {
        question: 'Quel est le problème dans le document ?',
        choices: ['Le prénom manque', 'Le téléphone manque', 'Le code postal est faux', 'La date manque'],
        answer: 2,
        explication: 'L’employée remarque que le code postal n’est pas correct.'
      },
      {
        question: 'Que fait Samir après ?',
        choices: ['Il recommence un nouveau dossier', 'Il corrige le code postal et vérifie la ville', 'Il rentre à la maison', 'Il demande un ordinateur'],
        answer: 1,
        explication: 'Samir corrige le code postal puis vérifie aussi la ville.'
      },
      {
        question: 'Que comprend Samir à la fin ?',
        choices: ['Il faut écrire plus vite', 'Il faut toujours signer en premier', 'Il est important de vérifier avant de signer', 'Les formulaires sont inutiles'],
        answer: 2,
        explication: 'L’histoire montre qu’il faut prendre son temps et vérifier avant de signer.'
      }
    ]
  },

  {
    id: 'ep06',
    type: 'dialogue',
    title: 'Envoyer le formulaire',
    category: 'Fin de tâche',
    lines: [
      { speaker: 'Nora', gender: 'f', text: 'J’ai fini le formulaire.' },
      { speaker: 'Employé', gender: 'm', text: 'Très bien. Vous avez signé ?' },
      { speaker: 'Nora', gender: 'f', text: 'Oui, j’ai signé ici en bas.' },
      { speaker: 'Employé', gender: 'm', text: 'Parfait. Vous avez aussi mis la date ?' },
      { speaker: 'Nora', gender: 'f', text: 'Oui, la date est juste à côté de ma signature.' },
      { speaker: 'Employé', gender: 'm', text: 'Très bien. Alors vous pouvez me donner le document.' },
      { speaker: 'Nora', gender: 'f', text: 'Tenez.' },
      { speaker: 'Employé', gender: 'm', text: 'Merci. Tout est complet.' },
      { speaker: 'Nora', gender: 'f', text: 'Merci, bonne journée.' },
      { speaker: 'Employé', gender: 'm', text: 'Bonne journée madame.' },
    ],
    questions: [
      {
        question: 'Qu’a fait Nora ?',
        choices: ['Elle a fini le formulaire', 'Elle a perdu le document', 'Elle a imprimé un CV', 'Elle a changé de salle'],
        answer: 0,
        explication: 'Nora dit au début : “J’ai fini le formulaire.”'
      },
      {
        question: 'Où a-t-elle signé ?',
        choices: ['En haut', 'En bas', 'Au milieu', 'Sur une autre page'],
        answer: 1,
        explication: 'Nora dit qu’elle a signé en bas.'
      },
      {
        question: 'Où se trouve la date ?',
        choices: ['À côté de la signature', 'Sur la première ligne', 'Dans la marge', 'Sous le prénom'],
        answer: 0,
        explication: 'Elle dit que la date est juste à côté de sa signature.'
      },
      {
        question: 'Que dit l’employé à la fin ?',
        choices: ['Le formulaire n’est pas correct', 'Il manque une page', 'Tout est complet', 'Il faut revenir demain'],
        answer: 2,
        explication: 'À la fin, l’employé confirme que tout est complet.'
      }
    ]
  }

];
