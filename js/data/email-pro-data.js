'use strict';

window.EMAIL_PRO_DATA = [
  {
    category: 'ORP',
    received: {
      from: 'De : Mme Dupont (Conseillère ORP)',
      subject: 'Demande de preuves de recherches',
      body: 'Bonjour Monsieur,\n\nMerci de m\'envoyer vos preuves de recherches d\'emploi pour le mois de février avant vendredi 17h.\n\nSalutations,\nMme Dupont',
      request: 'Action attendue : répondre poliment et indiquer la pièce jointe demandée.'
    },
    responses: [
      {
        subject: 'Re: Demande de preuves de recherches',
        body: 'Bonjour Madame Dupont,\n\nJe vous envoie en pièce jointe mes preuves de recherches d’emploi pour février.\n\nJe vous remercie.\n\nCordialement,\nYacine Ben Saad',
        attachment: 'Preuves jointes',
        signature: 'Signature complète',
        reasonIfWrong: ''
      },
      {
        subject: 'Re',
        body: 'Salut,\n\nVoilà.\n\nYacine',
        attachment: 'Pièce jointe non précisée',
        signature: 'Signature incomplète',
        reasonIfWrong: 'Le ton est trop familier et la réponse est trop vague.'
      },
      {
        subject: 'Question ORP',
        body: 'Bonjour,\n\nJe n’ai pas encore fini. Je vous enverrai plus tard.\n\nMerci',
        attachment: 'Aucune pièce jointe',
        signature: 'Pas de signature complète',
        reasonIfWrong: 'La demande n’est pas traitée : la pièce jointe manque.'
      }
    ],
    answer: 0,
    correctFeedback: 'Bonne réponse : politesse, information claire et document joint.'
  },
  {
    category: 'Emploi',
    received: {
      from: 'De : RH Garage Martin',
      subject: 'Disponibilité pour entretien',
      body: 'Bonjour,\n\nNous vous proposons un entretien mardi à 10h. Merci de confirmer votre disponibilité.\n\nCordialement,\nService RH',
      request: 'Action attendue : confirmer clairement la disponibilité.'
    },
    responses: [
      {
        subject: 'Re: Disponibilité pour entretien',
        body: 'Bonjour,\n\nMerci pour votre message. Je confirme ma disponibilité mardi à 10h pour l’entretien.\n\nMeilleures salutations,\nInes Carvalho',
        attachment: 'Aucune pièce jointe nécessaire',
        signature: 'Signature complète',
        reasonIfWrong: ''
      },
      {
        subject: 'Ok',
        body: 'Oui c’est bon.',
        attachment: 'Aucune',
        signature: 'Aucune signature',
        reasonIfWrong: 'La réponse est trop courte et sans formule professionnelle.'
      },
      {
        subject: 'Recrutement',
        body: 'Bonjour,\n\nPouvez-vous me dire le salaire avant l’entretien ?\n\nMerci',
        attachment: 'Aucune',
        signature: 'Signature incomplète',
        reasonIfWrong: 'La réponse est hors sujet : il faut d’abord confirmer le rendez-vous.'
      }
    ],
    answer: 0,
    correctFeedback: 'Correct : la disponibilité est confirmée clairement avec un ton professionnel.'
  },
  {
    category: 'Administratif',
    received: {
      from: 'De : Commune de Nyon',
      subject: 'Attestation demandée',
      body: 'Bonjour Madame,\n\nMerci de nous transmettre votre attestation de domicile en PDF.\n\nCordialement,\nGuichet population',
      request: 'Action attendue : annoncer la pièce jointe PDF dans la réponse.'
    },
    responses: [
      {
        subject: 'Re: Attestation demandée',
        body: 'Bonjour,\n\nVeuillez trouver en pièce jointe mon attestation de domicile au format PDF.\n\nJe vous remercie.\n\nMeilleures salutations,\nLina Messaoudi',
        attachment: 'Attestation PDF jointe',
        signature: 'Signature complète',
        reasonIfWrong: ''
      },
      {
        subject: 'Demande commune',
        body: 'Bonjour,\n\nJe pense que je vous ai déjà envoyé ce document hier.\n\nSalutations',
        attachment: 'Aucune pièce jointe',
        signature: 'Pas de nom',
        reasonIfWrong: 'La réponse est incomplète et la pièce jointe demandée est absente.'
      },
      {
        subject: '(aucun objet)',
        body: 'Bonjour,\n\nPièce jointe.\n\nLina',
        attachment: 'Non précisé',
        signature: 'Signature incomplète',
        reasonIfWrong: 'Objet absent et message trop pauvre pour un contexte administratif.'
      },
      {
        subject: 'URGENT',
        body: 'Hello,\n\nFaites vite svp.\n\nMerci',
        attachment: 'Aucune pièce jointe',
        signature: 'Aucune signature',
        reasonIfWrong: 'Ton inadapté et document demande non fourni.'
      }
    ],
    answer: 0,
    correctFeedback: 'Exact : le message est clair, poli et annonce la pièce jointe PDF.'
  },
  {
    category: 'Emploi',
    received: {
      from: 'De : Mme Renaud, Entreprise CleanPlus',
      subject: 'Merci d’envoyer votre CV mis à jour',
      body: 'Bonjour,\n\nAfin de finaliser votre dossier, merci de répondre à ce message avec votre CV mis à jour en pièce jointe.\n\nCordialement,\nMme Renaud',
      request: 'Action attendue : réponse complète avec mention du CV joint.'
    },
    responses: [
      {
        subject: 'Re: Merci d’envoyer votre CV mis à jour',
        body: 'Bonjour Madame Renaud,\n\nMerci pour votre message. Je vous transmets mon CV mis à jour en pièce jointe.\n\nCordialement,\nJoao Pereira',
        attachment: 'CV joint',
        signature: 'Signature complète',
        reasonIfWrong: ''
      },
      {
        subject: 'Re',
        body: 'Bonjour,\n\nJe vais le faire bientôt.\n\nMerci',
        attachment: 'Aucune pièce jointe',
        signature: 'Pas de nom complet',
        reasonIfWrong: 'La demande n’est pas exécutée : le CV n’est pas joint.'
      },
      {
        subject: 'CV',
        body: 'Salut,\n\nTu trouveras mon CV.\n\nA+',
        attachment: 'CV possiblement joint',
        signature: 'Signature absente',
        reasonIfWrong: 'Le ton est trop familier et la formule de clôture est inadaptée.'
      }
    ],
    answer: 0,
    correctFeedback: 'Bonne pratique : réponse professionnelle avec pièce jointe annoncée.'
  },
  {
    category: 'ORP',
    received: {
      from: 'De : ORP Lausanne',
      subject: 'Convocation entretien ORP',
      body: 'Bonjour,\n\nVous êtes convoqué le jeudi 14 mars à 09h00. Merci de confirmer votre présence.\n\nSalutations,\nORP Lausanne',
      request: 'Action attendue : confirmer sa présence.'
    },
    responses: [
      {
        subject: 'Re: Convocation entretien ORP',
        body: 'Bonjour,\n\nJe confirme ma présence à l’entretien ORP du jeudi 14 mars à 09h00.\n\nMeilleures salutations,\nFatima El Idrissi',
        attachment: 'Aucune pièce jointe nécessaire',
        signature: 'Signature complète',
        reasonIfWrong: ''
      },
      {
        subject: 'Convocation',
        body: 'Bonjour,\n\nJe crois que je peux venir mais pas sûr.\n\nFatima',
        attachment: 'Aucune',
        signature: 'Signature incomplète',
        reasonIfWrong: 'La confirmation n’est pas claire.'
      },
      {
        subject: 'Re',
        body: 'Ok',
        attachment: 'Aucune',
        signature: 'Aucune signature',
        reasonIfWrong: 'Réponse trop courte et non professionnelle.'
      }
    ],
    answer: 0,
    correctFeedback: 'Correct : confirmation claire, ton adapté et signature complète.'
  },
  {
    category: 'Administratif',
    received: {
      from: 'De : Assurance Santé Helvia',
      subject: 'Formulaire à signer',
      body: 'Bonjour,\n\nMerci de nous retourner le formulaire signé en pièce jointe.\n\nCordialement,\nService clients',
      request: 'Action attendue : envoyer le formulaire signé et le mentionner.'
    },
    responses: [
      {
        subject: 'Re: Formulaire à signer',
        body: 'Bonjour,\n\nVeuillez trouver en pièce jointe le formulaire signé demandé.\n\nJe vous remercie de votre confirmation de réception.\n\nCordialement,\nNora Ait Ali',
        attachment: 'Formulaire signé joint',
        signature: 'Signature complète',
        reasonIfWrong: ''
      },
      {
        subject: 'Formulaire',
        body: 'Bonjour,\n\nJe regarderai ce soir.\n\nMerci',
        attachment: 'Aucune pièce jointe',
        signature: 'Signature absente',
        reasonIfWrong: 'Le formulaire signé demandé n’est pas envoyé.'
      },
      {
        subject: 'Hello assurance',
        body: 'Hello,\n\nC’est bon pour moi.\n\nÀ bientôt',
        attachment: 'Aucune pièce jointe',
        signature: 'Pas de signature',
        reasonIfWrong: 'Formulation trop familière et réponse incomplète.'
      }
    ],
    answer: 0,
    correctFeedback: 'Exact : réponse claire, polie, et pièce jointe correctement annoncée.'
  }
];
