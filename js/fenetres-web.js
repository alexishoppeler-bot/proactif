'use strict';

(function initFenetresWeb() {
  const DATA = window.FENETRES_WEB_DATA || {};
  const PAGE_ID = DATA.pageId || 'fenetres-web';
  const WINDOWS = DATA.windows || {};
  const TASKS = Array.isArray(DATA.tasks) ? DATA.tasks : [];

  const XP_PER_STEP = 3;
  const SHORTCUTS_HELP = 'Raccourcis: B Chrome, E Messagerie, M réduire, X agrandir, R restaurer, Échap fermer, 1-3 onglets, ? ou / aide.';

  const session = {
    index: 0,
    done: 0,
    errors: 0,
    xp: 0,
    typed: 0,
    stepErrors: {},
    currentState: null,
    finished: false
  };

  const dom = {};

  function normalize(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function cloneState(state) {
    const open = Array.isArray(state.open) ? [...state.open] : [];
    const minimized = Array.isArray(state.minimized) ? [...state.minimized] : [];
    const topVisible = [...open].reverse().find((id) => !minimized.includes(id)) || null;
    return {
      open,
      minimized,
      maximized: Array.isArray(state.maximized) ? [...state.maximized] : [],
      activeTab: state.activeTab || '',
      adOpen: !!state.adOpen,
      activeWindow: topVisible
    };
  }

  function isOpen(id) {
    return session.currentState.open.includes(id);
  }

  function isMinimized(id) {
    return session.currentState.minimized.includes(id);
  }

  function isMaximized(id) {
    return session.currentState.maximized.includes(id);
  }

  function canInteractWithWindow(id) {
    return isOpen(id) && !isMinimized(id);
  }

  function setFeedback(text, type) {
    if (!dom.feedback) return;
    dom.feedback.textContent = text;
    dom.feedback.style.color = type === 'ok'
      ? 'var(--success)'
      : (type === 'error' ? 'var(--danger)' : 'var(--text2)');
  }

  function updateKPI() {
    if (dom.done) dom.done.textContent = String(session.done);
    if (dom.errors) dom.errors.textContent = String(session.errors);
    if (dom.xp) dom.xp.textContent = `${session.xp} XP`;
  }

  function updateGuide() {
    const total = TASKS.length || 1;
    const stepNum = Math.min(session.index + 1, total);
    const task = TASKS[session.index];

    if (dom.instruction) {
      dom.instruction.textContent = task ? task.instruction : 'Session terminée.';
    }
    if (dom.progress) {
      dom.progress.textContent = `Étape ${stepNum} / ${total}`;
    }
  }

  function addUnique(arr, value) {
    if (!arr.includes(value)) arr.push(value);
  }

  function removeValue(arr, value) {
    const idx = arr.indexOf(value);
    if (idx >= 0) arr.splice(idx, 1);
  }

  function focusWindow(id) {
    session.currentState.activeWindow = id;
    const open = session.currentState.open;
    removeValue(open, id);
    open.push(id);
  }

  function getTopVisibleWindow(excludeId) {
    const open = session.currentState.open;
    return [...open].reverse().find((wid) => wid !== excludeId && !isMinimized(wid)) || null;
  }

  function applyActionToState(action) {
    const state = session.currentState;
    const id = action.target;

    if (action.type === 'open') {
      addUnique(state.open, id);
      removeValue(state.minimized, id);
      focusWindow(id);
      if (id === 'ad') state.adOpen = true;
      return;
    }

    if (action.type === 'close' || action.type === 'close-ad') {
      removeValue(state.open, id);
      removeValue(state.minimized, id);
      removeValue(state.maximized, id);
      if (state.activeWindow === id) state.activeWindow = getTopVisibleWindow();
      if (id === 'ad') state.adOpen = false;
      return;
    }

    if (action.type === 'maximize') {
      if (!isOpen(id)) return;
      removeValue(state.minimized, id);
      addUnique(state.maximized, id);
      focusWindow(id);
      return;
    }

    if (action.type === 'minimize') {
      if (!isOpen(id)) return;
      addUnique(state.minimized, id);
      removeValue(state.maximized, id);
      if (state.activeWindow === id) state.activeWindow = getTopVisibleWindow(id);
      return;
    }

    if (action.type === 'restore') {
      if (!isOpen(id)) return;
      removeValue(state.minimized, id);
      removeValue(state.maximized, id);
      focusWindow(id);
      return;
    }

    if (action.type === 'switch-tab') {
      if (!canInteractWithWindow(id)) return;
      state.activeTab = action.value || state.activeTab;
      focusWindow(id);
      return;
    }

    if (action.type === 'focus') {
      if (!canInteractWithWindow(id)) return;
      focusWindow(id);
    }
  }

  function matchAction(expected, action) {
    if (!expected || !action) return false;

    const expType = expected.type;
    const actType = action.type;
    const sameTarget = normalize(expected.target) === normalize(action.target);

    if (!sameTarget) return false;

    if (expType === 'close-ad') {
      if (actType !== 'close-ad' && actType !== 'close') return false;
    } else if (normalize(expType) !== normalize(actType)) {
      return false;
    }

    if (expected.value != null) {
      return normalize(expected.value) === normalize(action.value);
    }

    return true;
  }

  function expectedHint(task) {
    if (!task || !task.expected) return '';
    const exp = task.expected;
    const meta = WINDOWS[exp.target] || {};
    const title = meta.title || exp.target;

    if (exp.type === 'switch-tab') return `Action attendue: cliquer sur l'onglet ${exp.value}.`;
    if (exp.type === 'close-ad') return 'Action attendue: fermer la fenêtre publicitaire.';
    if (exp.type === 'open') return `Action attendue: ouvrir ${title}.`;
    if (exp.type === 'close') return `Action attendue: fermer ${title}.`;
    if (exp.type === 'maximize') return `Action attendue: agrandir ${title}.`;
    if (exp.type === 'minimize') return `Action attendue: réduire ${title}.`;
    if (exp.type === 'restore') return `Action attendue: restaurer ${title}.`;
    if (exp.type === 'focus') return `Action attendue: mettre ${title} au premier plan.`;
    return 'Action attendue: exécuter la commande demandée.';
  }

  function windowTitle(id) {
    const meta = WINDOWS[id] || {};
    return meta.title || id;
  }

  function smartHint(task, action, errorCount) {
    if (!task || !task.expected) return expectedHint(task);
    const exp = task.expected;
    const target = exp.target;
    const title = windowTitle(target);

    if (errorCount <= 1) {
      return expectedHint(task);
    }

    if (exp.type === 'open') {
      if (isOpen(target) && isMinimized(target)) {
        return `${expectedHint(task)} Indice: ${title} est déjà ouverte mais réduite, restaurez-la depuis la barre des tâches.`;
      }
      if (isOpen(target) && !isMinimized(target)) {
        return `${expectedHint(task)} Indice: ${title} est déjà visible, mettez-la au premier plan.`;
      }
      return `${expectedHint(task)} Indice: utilisez le lanceur en haut ou le raccourci clavier associé.`;
    }

    if (exp.type === 'close' || exp.type === 'close-ad') {
      if (!isOpen(target)) {
        return `${expectedHint(task)} Indice: ${title} n'est pas ouverte dans cet état.`;
      }
      if (isMinimized(target)) {
        return `${expectedHint(task)} Indice: restaurez d'abord ${title}, puis utilisez Fermer (✕).`;
      }
      return `${expectedHint(task)} Indice: activez ${title}, puis cliquez sur Fermer (✕).`;
    }

    if (exp.type === 'maximize') {
      if (!isOpen(target)) return `${expectedHint(task)} Indice: ouvrez d'abord ${title}.`;
      if (isMinimized(target)) return `${expectedHint(task)} Indice: restaurez ${title} avant de l'agrandir.`;
      if (isMaximized(target)) return `${expectedHint(task)} Indice: ${title} est déjà agrandie.`;
      return `${expectedHint(task)} Indice: cliquez sur le bouton Agrandir (□).`;
    }

    if (exp.type === 'minimize') {
      if (!isOpen(target)) return `${expectedHint(task)} Indice: ouvrez d'abord ${title}.`;
      if (isMinimized(target)) return `${expectedHint(task)} Indice: ${title} est déjà réduite.`;
      return `${expectedHint(task)} Indice: cliquez sur le bouton Réduire (–).`;
    }

    if (exp.type === 'restore') {
      if (!isOpen(target)) return `${expectedHint(task)} Indice: ouvrez d'abord ${title}.`;
      if (!isMinimized(target)) return `${expectedHint(task)} Indice: ${title} n'est pas réduite; passez par la barre des tâches si besoin.`;
      return `${expectedHint(task)} Indice: cliquez sur ${title} dans la barre des tâches pour la restaurer.`;
    }

    if (exp.type === 'focus') {
      if (!isOpen(target)) return `${expectedHint(task)} Indice: ouvrez d'abord ${title}.`;
      if (isMinimized(target)) return `${expectedHint(task)} Indice: restaurez ${title} avant de la mettre au premier plan.`;
      if (session.currentState.activeWindow === target) {
        return `${expectedHint(task)} Indice: ${title} est déjà active.`;
      }
      return `${expectedHint(task)} Indice: cliquez dans la fenêtre ou sur sa barre de titre.`;
    }

    if (exp.type === 'switch-tab') {
      if (!isOpen(target)) return `${expectedHint(task)} Indice: ouvrez d'abord ${title}.`;
      if (isMinimized(target)) return `${expectedHint(task)} Indice: restaurez ${title} avant de changer d'onglet.`;
      const tabName = exp.value || '';
      const tabShortcut = ['1', '2', '3'].find((k, idx) => {
        const tabs = (WINDOWS[target] && Array.isArray(WINDOWS[target].tabs)) ? WINDOWS[target].tabs : [];
        return normalize(tabs[idx]) === normalize(tabName);
      });
      if (tabShortcut) {
        return `${expectedHint(task)} Indice: cliquez sur l'onglet "${tabName}" ou utilisez la touche ${tabShortcut}.`;
      }
      return `${expectedHint(task)} Indice: cliquez directement sur l'onglet "${tabName}".`;
    }

    if (action && action.target && normalize(action.target) !== normalize(target)) {
      return `${expectedHint(task)} Indice: vous avez agi sur ${windowTitle(action.target)} au lieu de ${title}.`;
    }

    return expectedHint(task);
  }

  function registerAttempt(isCorrect) {
    session.typed += 1;
    if (isCorrect) {
      recordExerciseProgress(PAGE_ID, { correct: 1, typed: 1, errors: 0, xp: XP_PER_STEP });
      return;
    }
    recordExerciseProgress(PAGE_ID, { correct: 0, typed: 1, errors: 1, xp: 0 });
  }

  function handleAction(action) {
    if (session.finished) return;

    const task = TASKS[session.index];
    if (!task) return;

    const ok = matchAction(task.expected, action);

    if (ok) {
      registerAttempt(true);
      session.done += 1;
      session.xp += XP_PER_STEP;
      setFeedback('Bonne action. Passage à l’étape suivante...', 'ok');
      applyActionToState(action);
      updateKPI();
      renderDesktop();

      window.setTimeout(() => {
        session.index += 1;
        if (session.index >= TASKS.length) {
          finishSession();
          return;
        }
        loadTaskState();
        updateGuide();
        setFeedback('', 'info');
        renderDesktop();
      }, 450);
      return;
    }

    registerAttempt(false);
    session.errors += 1;
    session.stepErrors[session.index] = (session.stepErrors[session.index] || 0) + 1;
    updateKPI();
    setFeedback(`Action incorrecte. ${smartHint(task, action, session.stepErrors[session.index])}`, 'error');
    loadTaskState();
    renderDesktop();
  }

  function renderLaunchers() {
    if (!dom.launchers) return;
    dom.launchers.innerHTML = '';

    Object.keys(WINDOWS)
      .filter((id) => id !== 'ad')
      .forEach((id) => {
        const meta = WINDOWS[id];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'fw-launch';
        btn.textContent = `${meta.icon || '🗔'} ${meta.title || id}`;
        btn.addEventListener('click', () => handleAction({ type: 'open', target: id }));
        dom.launchers.appendChild(btn);
      });
  }

  function bindKeyboardActivation(node, callback) {
    if (!node || typeof callback !== 'function') return;
    node.addEventListener('keydown', (event) => {
      if (event.target !== event.currentTarget) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.repeat) return;
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;
      event.preventDefault();
      callback();
    });
  }

  function buildWindowElement(id) {
    const meta = WINDOWS[id] || { title: id, icon: '🗔', tabs: [] };
    const win = document.createElement('article');
    win.className = 'fw-window';
    win.dataset.id = id;
    if (session.currentState.activeWindow === id) win.classList.add('active');
    if (isMaximized(id)) win.classList.add('maximized');

    const title = document.createElement('div');
    title.className = 'fw-titlebar';
    title.tabIndex = 0;
    title.setAttribute('role', 'button');
    title.setAttribute('aria-label', `Activer la fenêtre ${meta.title || id}`);

    const titleText = document.createElement('div');
    titleText.className = 'fw-title';
    titleText.textContent = `${meta.icon || '🗔'} ${meta.title || id}`;

    const controls = document.createElement('div');
    controls.className = 'fw-controls';

    const btnMin = document.createElement('button');
    btnMin.type = 'button';
    btnMin.dataset.action = 'minimize';
    btnMin.title = 'Réduire';
    btnMin.textContent = '–';
    btnMin.addEventListener('click', (e) => {
      e.stopPropagation();
      handleAction({ type: 'minimize', target: id });
    });

    const btnMax = document.createElement('button');
    btnMax.type = 'button';
    btnMax.dataset.action = 'maximize';
    btnMax.title = 'Agrandir';
    btnMax.textContent = '□';
    btnMax.addEventListener('click', (e) => {
      e.stopPropagation();
      handleAction({ type: 'maximize', target: id });
    });

    const btnClose = document.createElement('button');
    btnClose.type = 'button';
    btnClose.dataset.action = 'close';
    btnClose.title = 'Fermer';
    btnClose.textContent = '✕';
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      handleAction({ type: id === 'ad' ? 'close-ad' : 'close', target: id });
    });

    controls.appendChild(btnMin);
    controls.appendChild(btnMax);
    controls.appendChild(btnClose);

    title.appendChild(titleText);
    title.appendChild(controls);
    title.addEventListener('click', () => handleAction({ type: 'focus', target: id }));
    bindKeyboardActivation(title, () => handleAction({ type: 'focus', target: id }));

    win.appendChild(title);

    const tabs = Array.isArray(meta.tabs) ? meta.tabs : [];
    if (tabs.length) {
      const tabsEl = document.createElement('div');
      tabsEl.className = 'fw-tabs';
      tabs.forEach((tabName) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'fw-tab';
        if (id === 'browser' && normalize(session.currentState.activeTab) === normalize(tabName)) {
          tab.classList.add('active');
        }
        tab.textContent = tabName;
        tab.addEventListener('click', (e) => {
          e.stopPropagation();
          handleAction({ type: 'switch-tab', target: id, value: tabName });
        });
        tabsEl.appendChild(tab);
      });
      win.appendChild(tabsEl);
    }

    const content = document.createElement('div');
    content.className = 'fw-content';
    content.tabIndex = 0;
    content.setAttribute('role', 'button');
    content.setAttribute('aria-label', `Activer le contenu de la fenêtre ${meta.title || id}`);
    if (id === 'browser') {
      content.textContent = `Contenu affiché: ${session.currentState.activeTab || 'Google'}`;
    } else if (id === 'email') {
      content.textContent = 'Boîte de réception - cliquez pour prendre le focus.';
    } else {
      content.textContent = 'Popup publicitaire: cliquez sur fermer.';
    }
    content.addEventListener('click', () => handleAction({ type: 'focus', target: id }));
    bindKeyboardActivation(content, () => handleAction({ type: 'focus', target: id }));

    win.appendChild(content);
    return win;
  }

  function renderTaskbar() {
    if (!dom.taskbar) return;
    dom.taskbar.innerHTML = '';

    session.currentState.open.forEach((id) => {
      const meta = WINDOWS[id] || { title: id, icon: '🗔' };
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fw-task';

      const minimized = isMinimized(id);
      btn.textContent = `${meta.icon || '🗔'} ${meta.title || id}${minimized ? ' (réduite)' : ''}`;
      btn.addEventListener('click', () => {
        const type = minimized ? 'restore' : 'focus';
        handleAction({ type, target: id });
      });

      dom.taskbar.appendChild(btn);
    });
  }

  function renderDesktop() {
    if (!dom.desktop) return;

    dom.desktop.querySelectorAll('.fw-window').forEach((node) => node.remove());

    const visibleWindows = session.currentState.open.filter((id) => !isMinimized(id));
    visibleWindows.forEach((id) => {
      const el = buildWindowElement(id);
      dom.desktop.appendChild(el);
    });

    renderTaskbar();
  }

  function getActiveWindowId() {
    const id = session.currentState && session.currentState.activeWindow;
    if (!id) return null;
    if (!canInteractWithWindow(id)) return null;
    return id;
  }

  function isTypingContext(target) {
    if (!target) return false;
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (target.isContentEditable) return true;
    return target.getAttribute && target.getAttribute('role') === 'textbox';
  }

  function handleShortcut(event) {
    if (session.finished || !session.currentState) return;
    const target = event.target;
    const tag = target && target.tagName;
    if (isTypingContext(target)) return;
    if (tag === 'BUTTON' || tag === 'A') return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.repeat) return;

    const key = String(event.key || '').toLowerCase();
    const active = getActiveWindowId();
    const browserTabs = (WINDOWS.browser && Array.isArray(WINDOWS.browser.tabs)) ? WINDOWS.browser.tabs : [];

    if (key === 'b') {
      event.preventDefault();
      handleAction({ type: 'open', target: 'browser' });
      return;
    }
    if (key === 'e') {
      event.preventDefault();
      handleAction({ type: 'open', target: 'email' });
      return;
    }
    if (key === 'escape' && active) {
      event.preventDefault();
      handleAction({ type: active === 'ad' ? 'close-ad' : 'close', target: active });
      return;
    }
    if (key === 'm' && active) {
      event.preventDefault();
      handleAction({ type: 'minimize', target: active });
      return;
    }
    if (key === 'x' && active) {
      event.preventDefault();
      handleAction({ type: 'maximize', target: active });
      return;
    }
    if (key === 'r' && active) {
      event.preventDefault();
      handleAction({ type: 'restore', target: active });
      return;
    }
    if (key === '?' || key === '/') {
      event.preventDefault();
      setFeedback(SHORTCUTS_HELP, 'info');
      return;
    }

    if ((key === '1' || key === '2' || key === '3') && canInteractWithWindow('browser')) {
      const index = Number(key) - 1;
      const tab = browserTabs[index];
      if (tab) {
        event.preventDefault();
        handleAction({ type: 'switch-tab', target: 'browser', value: tab });
      }
    }
  }

  function loadTaskState() {
    const task = TASKS[session.index];
    if (!task) return;

    session.currentState = cloneState(task.state || {});

    if (session.currentState.adOpen) addUnique(session.currentState.open, 'ad');
    if (!session.currentState.adOpen) {
      removeValue(session.currentState.open, 'ad');
      removeValue(session.currentState.minimized, 'ad');
      removeValue(session.currentState.maximized, 'ad');
    }

    if (!session.currentState.activeWindow || !session.currentState.open.includes(session.currentState.activeWindow)) {
      session.currentState.activeWindow = getTopVisibleWindow();
    }
  }

  function finishSession() {
    session.finished = true;
    promoteExerciseStatus(PAGE_ID, 'completed');

    const accuracy = calcAccuracy(session.done, session.typed);
    const title = accuracy >= 80 ? 'Parcours validé' : 'Parcours terminé';

    if (dom.result) {
      dom.result.classList.remove('fw-hidden');
      dom.result.innerHTML = [
        `<strong>${title}</strong>`,
        `${session.done} étape(s) réussie(s) sur ${TASKS.length}.`,
        `Précision: ${accuracy}% · Erreurs: ${session.errors} · XP: ${session.xp}`
      ].join('<br>');
    }

    setFeedback('Simulation terminée.', 'ok');
    renderDesktop();
  }

  function restart() {
    if (!TASKS.length) {
      setFeedback('Aucune étape disponible.', 'error');
      return;
    }

    session.index = 0;
    session.done = 0;
    session.errors = 0;
    session.xp = 0;
    session.typed = 0;
    session.stepErrors = {};
    session.finished = false;

    if (dom.result) {
      dom.result.classList.add('fw-hidden');
      dom.result.innerHTML = '';
    }

    loadTaskState();
    updateGuide();
    updateKPI();
    setFeedback('Suivez l’instruction puis cliquez sur la bonne commande.', 'info');
    renderLaunchers();
    renderDesktop();
  }

  document.addEventListener('DOMContentLoaded', () => {
    dom.instruction = document.getElementById('fw-instruction');
    dom.progress = document.getElementById('fw-progress');
    dom.feedback = document.getElementById('fw-feedback');
    dom.done = document.getElementById('fw-done');
    dom.errors = document.getElementById('fw-errors');
    dom.xp = document.getElementById('fw-xp');
    dom.desktop = document.getElementById('fw-desktop');
    dom.launchers = document.getElementById('fw-launchers');
    dom.taskbar = document.getElementById('fw-taskbar');
    dom.restart = document.getElementById('fw-restart');
    dom.result = document.getElementById('fw-result');

    if (dom.restart) dom.restart.addEventListener('click', restart);
    document.addEventListener('keydown', handleShortcut);

    restart();
  });
})();
