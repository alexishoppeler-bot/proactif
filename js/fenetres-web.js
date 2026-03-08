'use strict';

(function initFenetresWeb() {
  const DATA = window.FENETRES_WEB_DATA || {};
  const PAGE_ID = DATA.pageId || 'fenetres-web';
  const WINDOWS = DATA.windows || {};
  const TASKS = Array.isArray(DATA.tasks) ? DATA.tasks : [];

  const XP_PER_STEP = 3;

  const session = {
    index: 0,
    done: 0,
    errors: 0,
    xp: 0,
    typed: 0,
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
    return {
      open: Array.isArray(state.open) ? [...state.open] : [],
      minimized: Array.isArray(state.minimized) ? [...state.minimized] : [],
      maximized: Array.isArray(state.maximized) ? [...state.maximized] : [],
      activeTab: state.activeTab || '',
      adOpen: !!state.adOpen,
      activeWindow: Array.isArray(state.open) && state.open.length ? state.open[0] : null
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
      dom.instruction.textContent = task ? task.instruction : 'Session terminee.';
    }
    if (dom.progress) {
      dom.progress.textContent = `Etape ${stepNum} / ${total}`;
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
      if (state.activeWindow === id) state.activeWindow = state.open.length ? state.open[state.open.length - 1] : null;
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
      if (state.activeWindow === id) state.activeWindow = state.open.find((wid) => wid !== id) || null;
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
      if (!isOpen(id) || isMinimized(id)) return;
      state.activeTab = action.value || state.activeTab;
      focusWindow(id);
      return;
    }

    if (action.type === 'focus') {
      if (!isOpen(id) || isMinimized(id)) return;
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
    if (exp.type === 'switch-tab') return `Action attendue: ouvrir l onglet ${exp.value}.`;
    if (exp.type === 'close-ad') return 'Action attendue: fermer la fenetre publicitaire.';
    return `Action attendue: ${exp.type} sur ${exp.target}.`;
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
      setFeedback('Bonne action. Passage a l etape suivante...', 'ok');
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
    updateKPI();
    setFeedback(`Action incorrecte. ${expectedHint(task)}`, 'error');
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

  function buildWindowElement(id) {
    const meta = WINDOWS[id] || { title: id, icon: '🗔', tabs: [] };
    const win = document.createElement('article');
    win.className = 'fw-window';
    win.dataset.id = id;
    if (session.currentState.activeWindow === id) win.classList.add('active');
    if (isMaximized(id)) win.classList.add('maximized');

    const title = document.createElement('div');
    title.className = 'fw-titlebar';

    const titleText = document.createElement('div');
    titleText.className = 'fw-title';
    titleText.textContent = `${meta.icon || '🗔'} ${meta.title || id}`;

    const controls = document.createElement('div');
    controls.className = 'fw-controls';

    const btnMin = document.createElement('button');
    btnMin.type = 'button';
    btnMin.dataset.action = 'minimize';
    btnMin.title = 'Reduire';
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
    if (id === 'browser') {
      content.textContent = `Contenu affiche: ${session.currentState.activeTab || 'Google'}`;
    } else if (id === 'email') {
      content.textContent = 'Boite de reception - cliquez pour prendre le focus.';
    } else {
      content.textContent = 'Popup publicitaire: Cliquez sur fermer.';
    }
    content.addEventListener('click', () => handleAction({ type: 'focus', target: id }));

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
      btn.textContent = `${meta.icon || '🗔'} ${meta.title || id}${minimized ? ' (reduite)' : ''}`;
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
      session.currentState.activeWindow = session.currentState.open.length ? session.currentState.open[0] : null;
    }
  }

  function finishSession() {
    session.finished = true;
    promoteExerciseStatus(PAGE_ID, 'completed');

    const accuracy = calcAccuracy(session.done, session.typed);
    const title = accuracy >= 80 ? 'Parcours valide' : 'Parcours termine';

    if (dom.result) {
      dom.result.classList.remove('fw-hidden');
      dom.result.innerHTML = [
        `<strong>${title}</strong>`,
        `${session.done} etape(s) reussie(s) sur ${TASKS.length}.`,
        `Precision: ${accuracy}% · Erreurs: ${session.errors} · XP: ${session.xp}`
      ].join('<br>');
    }

    setFeedback('Simulation terminee.', 'ok');
    renderDesktop();
  }

  function restart() {
    if (!TASKS.length) {
      setFeedback('Aucune etape disponible.', 'error');
      return;
    }

    session.index = 0;
    session.done = 0;
    session.errors = 0;
    session.xp = 0;
    session.typed = 0;
    session.finished = false;

    if (dom.result) {
      dom.result.classList.add('fw-hidden');
      dom.result.innerHTML = '';
    }

    loadTaskState();
    updateGuide();
    updateKPI();
    setFeedback('Suivez l instruction puis cliquez sur la bonne commande.', 'info');
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

    restart();
  });
})();
