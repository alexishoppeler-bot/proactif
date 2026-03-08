'use strict';

window.FENETRES_WEB_DATA = {
  pageId: 'fenetres-web',
  name: 'Gestion des fenêtres internet',
  windows: {
    browser: { title: 'Google Chrome', icon: '🌐', tabs: ['Google', 'YouTube', 'Gmail'] },
    email: { title: 'Messagerie', icon: '📧', tabs: ['Inbox', 'Important'] },
    ad: { title: 'Publicité', icon: '📢', tabs: ['Offre spéciale'] }
  },
  tasks: [
    {
      instruction: 'Ouvrez la fenêtre Google Chrome.',
      expected: { type: 'open', target: 'browser' },
      state: { open: [], minimized: [], maximized: [], activeTab: 'Google', adOpen: false }
    },
    {
      instruction: 'Agrandissez la fenêtre Google Chrome.',
      expected: { type: 'maximize', target: 'browser' },
      state: { open: ['browser'], minimized: [], maximized: [], activeTab: 'Google', adOpen: false }
    },
    {
      instruction: 'Réduisez Google Chrome dans la barre des tâches.',
      expected: { type: 'minimize', target: 'browser' },
      state: { open: ['browser'], minimized: [], maximized: ['browser'], activeTab: 'Google', adOpen: false }
    },
    {
      instruction: 'Restaurez Google Chrome depuis la barre des tâches.',
      expected: { type: 'restore', target: 'browser' },
      state: { open: ['browser'], minimized: ['browser'], maximized: [], activeTab: 'Google', adOpen: false }
    },
    {
      instruction: 'Cliquez sur l’onglet Gmail dans Chrome.',
      expected: { type: 'switch-tab', target: 'browser', value: 'Gmail' },
      state: { open: ['browser'], minimized: [], maximized: [], activeTab: 'Google', adOpen: false }
    },
    {
      instruction: 'Une publicité apparaît: fermez la fenêtre publicitaire.',
      expected: { type: 'close-ad', target: 'ad' },
      state: { open: ['browser', 'ad'], minimized: [], maximized: [], activeTab: 'Gmail', adOpen: true }
    },
    {
      instruction: 'Ouvrez la fenêtre Messagerie.',
      expected: { type: 'open', target: 'email' },
      state: { open: ['browser'], minimized: [], maximized: [], activeTab: 'Gmail', adOpen: false }
    },
    {
      instruction: 'Cliquez dans la fenêtre Messagerie pour la mettre au premier plan.',
      expected: { type: 'focus', target: 'email' },
      state: { open: ['browser', 'email'], minimized: [], maximized: [], activeTab: 'Gmail', adOpen: false }
    },
    {
      instruction: 'Fermez la fenêtre Messagerie.',
      expected: { type: 'close', target: 'email' },
      state: { open: ['browser', 'email'], minimized: [], maximized: [], activeTab: 'Gmail', adOpen: false }
    },
    {
      instruction: 'Fermez Google Chrome.',
      expected: { type: 'close', target: 'browser' },
      state: { open: ['browser'], minimized: [], maximized: [], activeTab: 'Gmail', adOpen: false }
    }
  ]
};
