'use strict';

window.FORMULAIRE_DATA = [
  {
    id: 'form-1',
    tag: 'Nettoyage',
    profile: {
      name: 'Ali Rahimi',
      birthDate: '1990-03-15',
      maritalStatus: 'Marié',
      age: 34,
      email: 'ali.rahimi@email.com',
      phone: '+41 79 111 22 33',
      address: 'Rue de Lausanne 12',
      npa: '1800',
      city: 'Vevey',
      education: 'École obligatoire',
      experience: '3 ans dans le nettoyage',
      drivingLicense: 'Oui',
      residencePermit: 'Établissement',
      availability: 'Immédiate',
      qualities: ['Ponctualité', 'Fiabilité', 'Travail en équipe'],
      skills: ['Nettoyage de surfaces', 'Nettoyage de sol', 'Maîtrise produits chimiques']
    },
    form: {
      fields: [
        { name: 'firstName', label: 'Prénom', expected: 'Ali', type: 'text' },
        { name: 'lastName', label: 'Nom', expected: 'Rahimi', type: 'text' },
        { name: 'birthDate', label: 'Date de naissance', expected: '15.03.1990', type: 'text' },
        { name: 'maritalStatus', label: 'État civil', expected: 'Marié', type: 'text' },
        { name: 'email', label: 'E-mail', expected: 'ali.rahimi@email.com', type: 'email' },
        { name: 'phone', label: 'Téléphone', expected: '+41 79 111 22 33', type: 'tel' },
        { name: 'address', label: 'Adresse', expected: 'Rue de Lausanne 12', type: 'text' },
        { name: 'npa', label: 'NPA', expected: '1800', type: 'text' },
        { name: 'city', label: 'Ville', expected: 'Vevey', type: 'text' },
        { name: 'drivingLicense', label: 'Permis de conduire', expected: 'Oui', type: 'text' },
        { name: 'residencePermit', label: 'Permis de séjour', expected: 'Établissement', type: 'text' },
        { name: 'availability', label: 'Disponibilité', expected: 'Immédiate', type: 'text' },
        { name: 'experience', label: 'Années d\'expérience', expected: '3', type: 'number' },
        { name: 'qualities', label: 'Qualités personnelles (savoir-être)', expected: 'Ponctualité, Fiabilité, Travail en équipe', type: 'text' },
        { name: 'skills', label: 'Compétences (savoir-faire)', expected: 'Nettoyage de surfaces, Nettoyage de sol, Maîtrise produits chimiques', type: 'text' }
      ]
    },
    requiredFiles: [
      { type: 'cv', label: 'Curriculum Vitae (CV)', formats: ['pdf', 'doc', 'docx'], required: true },
      { type: 'photo', label: 'Photo d\'identité', formats: ['jpg', 'jpeg', 'png'], required: true }
    ]
  },
  {
    id: 'form-2',
    tag: 'Cuisine',
    profile: {
      name: 'Fatima El Idrissi',
      birthDate: '1995-07-22',
      maritalStatus: 'Célibataire',
      age: 29,
      email: 'fatima.elidrissi@email.com',
      phone: '+41 78 222 33 44',
      address: 'Avenue Général-Guisan 8',
      npa: '1009',
      city: 'Pully',
      education: 'Formation de base',
      experience: '2 ans comme aide de cuisine',
      drivingLicense: 'Non',
      residencePermit: 'Courte durée',
      availability: '1 mois de préavis',
      qualities: ['Hygiène', 'Rapidité', 'Apprentissage rapide'],
      skills: ['Préparation des plats', 'Cuisine au feu', 'Gestion mise en place']
    },
    form: {
      fields: [
        { name: 'firstName', label: 'Prénom', expected: 'Fatima', type: 'text' },
        { name: 'lastName', label: 'Nom', expected: 'El Idrissi', type: 'text' },
        { name: 'birthDate', label: 'Date de naissance', expected: '22.07.1995', type: 'text' },
        { name: 'maritalStatus', label: 'État civil', expected: 'Célibataire', type: 'text' },
        { name: 'email', label: 'E-mail', expected: 'fatima.elidrissi@email.com', type: 'email' },
        { name: 'phone', label: 'Téléphone', expected: '+41 78 222 33 44', type: 'tel' },
        { name: 'address', label: 'Adresse', expected: 'Avenue Général-Guisan 8', type: 'text' },
        { name: 'npa', label: 'NPA', expected: '1009', type: 'text' },
        { name: 'city', label: 'Ville', expected: 'Pully', type: 'text' },
        { name: 'drivingLicense', label: 'Permis de conduire', expected: 'Non', type: 'text' },
        { name: 'residencePermit', label: 'Permis de séjour', expected: 'Courte durée', type: 'text' },
        { name: 'availability', label: 'Disponibilité', expected: '1 mois de préavis', type: 'text' },
        { name: 'experience', label: 'Années d\'expérience', expected: '2', type: 'number' },
        { name: 'qualities', label: 'Qualités personnelles (savoir-être)', expected: 'Hygiène, Rapidité, Apprentissage rapide', type: 'text' },
        { name: 'skills', label: 'Compétences (savoir-faire)', expected: 'Préparation des plats, Cuisine au feu, Gestion mise en place', type: 'text' }
      ]
    },
    requiredFiles: [
      { type: 'cv', label: 'Curriculum Vitae (CV)', formats: ['pdf', 'doc', 'docx'], required: true },
      { type: 'photo', label: 'Photo d\'identité', formats: ['jpg', 'jpeg', 'png'], required: true },
      { type: 'letter', label: 'Lettre de motivation', formats: ['pdf', 'doc', 'docx'], required: false }
    ]
  },
  {
    id: 'form-3',
    tag: 'Construction',
    profile: {
      name: 'João Silva',
      birthDate: '1983-11-08',
      maritalStatus: 'Marié',
      age: 41,
      email: 'joao.silva@email.com',
      phone: '+41 77 333 44 55',
      address: 'Chemin du Midi 5',
      npa: '1020',
      city: 'Renens',
      education: 'École obligatoire',
      experience: '5 ans sur chantier',
      drivingLicense: 'Oui',
      residencePermit: 'Établissement',
      availability: 'Immédiate',
      qualities: ['Sécurité', 'Responsabilité', 'Rigueur'],
      skills: ['Manutention', 'Ferraillage', 'Coffrage béton']
    },
    form: {
      fields: [
        { name: 'firstName', label: 'Prénom', expected: 'João', type: 'text' },
        { name: 'lastName', label: 'Nom', expected: 'Silva', type: 'text' },
        { name: 'birthDate', label: 'Date de naissance', expected: '08.11.1983', type: 'text' },
        { name: 'maritalStatus', label: 'État civil', expected: 'Marié', type: 'text' },
        { name: 'email', label: 'E-mail', expected: 'joao.silva@email.com', type: 'email' },
        { name: 'phone', label: 'Téléphone', expected: '+41 77 333 44 55', type: 'tel' },
        { name: 'address', label: 'Adresse', expected: 'Chemin du Midi 5', type: 'text' },
        { name: 'npa', label: 'NPA', expected: '1020', type: 'text' },
        { name: 'city', label: 'Ville', expected: 'Renens', type: 'text' },
        { name: 'drivingLicense', label: 'Permis de conduire', expected: 'Oui', type: 'text' },
        { name: 'residencePermit', label: 'Permis de séjour', expected: 'Établissement', type: 'text' },
        { name: 'availability', label: 'Disponibilité', expected: 'Immédiate', type: 'text' },
        { name: 'experience', label: 'Années d\'expérience', expected: '5', type: 'number' },
        { name: 'qualities', label: 'Qualités personnelles (savoir-être)', expected: 'Sécurité, Responsabilité, Rigueur', type: 'text' },
        { name: 'skills', label: 'Compétences (savoir-faire)', expected: 'Manutention, Ferraillage, Coffrage béton', type: 'text' }
      ]
    },
    requiredFiles: [
      { type: 'cv', label: 'Curriculum Vitae (CV)', formats: ['pdf', 'doc', 'docx'], required: true },
      { type: 'certif', label: 'Certificat de sécurité', formats: ['pdf'], required: true }
    ]
  },
  {
    id: 'form-4',
    tag: 'Vente',
    profile: {
      name: 'Sara Costa',
      birthDate: '1998-05-10',
      maritalStatus: 'Célibataire',
      age: 26,
      email: 'sara.costa@email.com',
      phone: '+41 76 444 55 66',
      address: 'Rue Centrale 20',
      npa: '1400',
      city: 'Yverdon-les-Bains',
      education: 'CFC non terminé',
      experience: '1 an dans un magasin',
      drivingLicense: 'Oui',
      residencePermit: 'Établissement',
      availability: 'Immédiate',
      qualities: ['Accueil', 'Sourire', 'Écoute client'],
      skills: ['Caisse enregistreuse', 'Conseil produit', 'Mise en rayon']
    },
    form: {
      fields: [
        { name: 'firstName', label: 'Prénom', expected: 'Sara', type: 'text' },
        { name: 'lastName', label: 'Nom', expected: 'Costa', type: 'text' },
        { name: 'birthDate', label: 'Date de naissance', expected: '10.05.1998', type: 'text' },
        { name: 'maritalStatus', label: 'État civil', expected: 'Célibataire', type: 'text' },
        { name: 'email', label: 'E-mail', expected: 'sara.costa@email.com', type: 'email' },
        { name: 'phone', label: 'Téléphone', expected: '+41 76 444 55 66', type: 'tel' },
        { name: 'address', label: 'Adresse', expected: 'Rue Centrale 20', type: 'text' },
        { name: 'npa', label: 'NPA', expected: '1400', type: 'text' },
        { name: 'city', label: 'Ville', expected: 'Yverdon-les-Bains', type: 'text' },
        { name: 'drivingLicense', label: 'Permis de conduire', expected: 'Oui', type: 'text' },
        { name: 'residencePermit', label: 'Permis de séjour', expected: 'Établissement', type: 'text' },
        { name: 'availability', label: 'Disponibilité', expected: 'Immédiate', type: 'text' },
        { name: 'experience', label: 'Années d\'expérience', expected: '1', type: 'number' },
        { name: 'qualities', label: 'Qualités personnelles (savoir-être)', expected: 'Accueil, Sourire, Écoute client', type: 'text' },
        { name: 'skills', label: 'Compétences (savoir-faire)', expected: 'Caisse enregistreuse, Conseil produit, Mise en rayon', type: 'text' }
      ]
    },
    requiredFiles: [
      { type: 'cv', label: 'Curriculum Vitae (CV)', formats: ['pdf', 'doc', 'docx'], required: true },
      { type: 'photo', label: 'Photo d\'identité', formats: ['jpg', 'jpeg', 'png'], required: true }
    ]
  },
  {
    id: 'form-5',
    tag: 'Logistique',
    profile: {
      name: 'Mamadou Diallo',
      birthDate: '1986-09-20',
      maritalStatus: 'Marié',
      age: 38,
      email: 'mamadou.diallo@email.com',
      phone: '+41 79 555 66 77',
      address: 'Route de Genève 14',
      npa: '1004',
      city: 'Lausanne',
      education: 'Formation de base',
      experience: '4 ans en logistique',
      drivingLicense: 'Oui',
      residencePermit: 'Établissement',
      availability: 'Immédiate',
      qualities: ['Organisation', 'Ponctualité', 'Rigueur'],
      skills: ['Préparation de commandes', 'Gestion stocks', 'Manutention cariste']
    },
    form: {
      fields: [
        { name: 'firstName', label: 'Prénom', expected: 'Mamadou', type: 'text' },
        { name: 'lastName', label: 'Nom', expected: 'Diallo', type: 'text' },
        { name: 'birthDate', label: 'Date de naissance', expected: '20.09.1986', type: 'text' },
        { name: 'maritalStatus', label: 'État civil', expected: 'Marié', type: 'text' },
        { name: 'email', label: 'E-mail', expected: 'mamadou.diallo@email.com', type: 'email' },
        { name: 'phone', label: 'Téléphone', expected: '+41 79 555 66 77', type: 'tel' },
        { name: 'address', label: 'Adresse', expected: 'Route de Genève 14', type: 'text' },
        { name: 'npa', label: 'NPA', expected: '1004', type: 'text' },
        { name: 'city', label: 'Ville', expected: 'Lausanne', type: 'text' },
        { name: 'drivingLicense', label: 'Permis de conduire', expected: 'Oui', type: 'text' },
        { name: 'residencePermit', label: 'Permis de séjour', expected: 'Établissement', type: 'text' },
        { name: 'availability', label: 'Disponibilité', expected: 'Immédiate', type: 'text' },
        { name: 'experience', label: 'Années d\'expérience', expected: '4', type: 'number' },
        { name: 'qualities', label: 'Qualités personnelles (savoir-être)', expected: 'Organisation, Ponctualité, Rigueur', type: 'text' },
        { name: 'skills', label: 'Compétences (savoir-faire)', expected: 'Préparation de commandes, Gestion stocks, Manutention cariste', type: 'text' }
      ]
    },
    requiredFiles: [
      { type: 'cv', label: 'Curriculum Vitae (CV)', formats: ['pdf', 'doc', 'docx'], required: true }
    ]
  }
];
