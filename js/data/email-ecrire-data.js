'use strict';

window.EMAIL_ECRIRE_DATA = [
  {
    category: 'Candidature',
    situation: 'Vous postulez pour un poste de vendeuse. Vous devez envoyer votre CV et votre lettre de motivation.',
    choices: [
      {
        subject: 'Candidature - Vendeuse - Sara Martin',
        body: 'Bonjour Madame,\n\nJe vous envoie ma candidature pour le poste de vendeuse. Vous trouverez mon CV et ma lettre de motivation en pièces jointes.\n\nJe vous remercie pour votre retour.\n\nCordialement,\nSara Martin',
        attachment: 'CV + Lettre',
        signature: 'Signature complète',
        reasonIfWrong: ''
      },
      {
        subject: '(aucun objet)',
        body: 'Bonjour,\n\nJe veux travailler chez vous. Répondez vite.\n\nSara',
        attachment: 'Aucune pièce jointe',
        signature: 'Signature incomplète',
        reasonIfWrong: 'Il manque un objet clair et les pièces jointes demandées.'
      },
      {
        subject: 'Salut',
        body: 'Salut,\n\nTu peux regarder mon profil et me dire ?\n\nMerci',
        attachment: 'Aucune pièce jointe',
        signature: 'Pas de signature',
        reasonIfWrong: 'Le ton est trop familier pour une candidature professionnelle.'
      }
    ],
    answer: 0,
    correctFeedback: 'Cet e-mail est correct : objet précis, politesse, pièces jointes et signature claire.'
  },
  {
    category: 'ORP',
    situation: 'Votre conseiller ORP demande un justificatif de recherche d’emploi. Vous répondez par e-mail.',
    choices: [
      {
        subject: 'Document',
        body: 'Bonjour,\n\nJe vous envoie un truc.\n\nMerci',
        attachment: 'Pièce jointe non précisée',
        signature: 'Pas de nom complet',
        reasonIfWrong: 'L’objet et le contenu sont trop vagues.'
      },
      {
        subject: 'Envoi justificatif ORP - Malik Ben Ali',
        body: 'Bonjour Madame Dupont,\n\nSuite à votre demande, je vous transmets en pièce jointe mon justificatif de recherche d’emploi pour ce mois.\n\nJe reste à disposition.\n\nCordialement,\nMalik Ben Ali',
        attachment: 'Justificatif joint',
        signature: 'Signature complète',
        reasonIfWrong: ''
      },
      {
        subject: 'Re: ORP',
        body: 'Bonjour,\n\nJe n’ai pas eu le temps. Je verrai plus tard.\n\nSalutations',
        attachment: 'Aucune pièce jointe',
        signature: 'Signature absente',
        reasonIfWrong: 'La pièce jointe manque et le message ne répond pas à la demande.'
      }
    ],
    answer: 1,
    correctFeedback: 'Bonne réponse : message clair, poli, et pièce jointe annoncée.'
  },
  {
    category: 'Administratif',
    situation: 'Vous devez envoyer votre attestation de domicile à la commune.',
    choices: [
      {
        subject: 'Attestation de domicile - Lea Dubois',
        body: 'Bonjour,\n\nVeuillez trouver en pièce jointe mon attestation de domicile.\n\nJe vous remercie pour votre confirmation de réception.\n\nMeilleures salutations,\nLea Dubois',
        attachment: 'Attestation jointe',
        signature: 'Signature complète',
        reasonIfWrong: ''
      },
      {
        subject: 'Demande',
        body: 'Bonjour,\n\nPouvez-vous faire le nécessaire ?\n\nMerci',
        attachment: 'Aucune pièce jointe',
        signature: 'Pas de nom complet',
        reasonIfWrong: 'Le document demandé n\'est pas joint.'
      },
      {
        subject: '(aucun objet)',
        body: 'Bonjour,\n\nJe vous écris pour la commune.\n\nLea',
        attachment: 'Aucune pièce jointe',
        signature: 'Signature incomplète',
        reasonIfWrong: 'Il manque un objet et le document administratif.'
      },
      {
        subject: 'URGENT !!!',
        body: 'Salut,\n\nJ’ai déjà tout envoyé hier, merci.\n\nBye',
        attachment: 'Aucune pièce jointe',
        signature: 'Pas de signature',
        reasonIfWrong: 'Le ton est inadapté et l’objet ne correspond pas à la demande.'
      }
    ],
    answer: 0,
    correctFeedback: 'Exact : objet adapté, message professionnel, pièce jointe et signature.'
  }
];
