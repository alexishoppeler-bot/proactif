'use strict';

(function () {
  const PAGE_ID = 'dossiers-explorateur';
  const DATA = window.DOSSIERS_EXPLORATEUR_DATA || {};

  const STORAGE_STATE_KEY = 'explorer_game_state_v1';
  const STORAGE_PROGRESS_KEY = 'explorer_game_progress_v1';

  const XP_PER_MISSION = 6;

  let seq = 0;
  let tree = null;
  let progress = null;
  let selectedFolderId = 'documents';
  let selectedIds = new Set();
  let clipboard = { mode: null, ids: [] };
  let dragIds = [];
  let helpOpen = false;
  let lastClickedIndex = -1;
  let contextTargetId = null;
  let focusedRowIndex = 0;
  let sortState = { key: 'name', dir: 'asc' };

  const dom = {};

  /* =========================================================
     FONCTION D'ACCESSIBILITÉ CLAVIER
  ========================================================= */
  function makeKeyboardAccessible(el, clickHandler) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickHandler();
      }
    });
  }

  function normalizeName(v) {
    return String(v || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function uid(prefix) {
    seq += 1;
    return prefix + '-' + Date.now() + '-' + seq;
  }

  function cloneNode(node) {
    const copy = {
      id: uid(node.type || 'node'),
      type: node.type,
      name: node.name
    };
    if (node.originalParentId) copy.originalParentId = node.originalParentId;
    if (node.originalParentPath) copy.originalParentPath = [...node.originalParentPath];
    if (node.type === 'folder') {
      copy.children = (node.children || []).map(cloneNode);
    }
    return copy;
  }

  function getTopFolders() {
    return tree && tree.children ? tree.children : [];
  }

  function walkFolder(folder, cb, parent) {
    cb(folder, parent);
    if (!folder.children) return;
    folder.children.forEach((child) => {
      if (child.type === 'folder') walkFolder(child, cb, folder);
      else cb(child, folder);
    });
  }

  function findNodeById(id) {
    let found = null;
    walkFolder(tree, (node, parent) => {
      if (node.id === id) found = { node, parent };
    }, null);
    return found;
  }

  function isDescendant(folderId, possibleChildId) {
    const target = findNodeById(folderId);
    if (!target || target.node.type !== 'folder') return false;
    let hit = false;
    walkFolder(target.node, (n) => {
      if (n.id === possibleChildId) hit = true;
    }, null);
    return hit;
  }

  function buildPathById(id) {
    const chain = [];
    let current = findNodeById(id);
    while (current && current.node && current.node.id !== 'root') {
      chain.push(current.node.name);
      current = current.parent ? findNodeById(current.parent.id) : null;
    }
    chain.reverse();
    return chain;
  }

  function buildPathMetaById(id) {
    const chain = [];
    let current = findNodeById(id);
    while (current && current.node && current.node.id !== 'root') {
      chain.push({ id: current.node.id, name: current.node.name });
      current = current.parent ? findNodeById(current.parent.id) : null;
    }
    chain.reverse();
    return chain;
  }

  function pathText(arr) {
    return arr.join(' > ');
  }

  function findChildByName(folder, name) {
    if (!folder || !folder.children) return null;
    const key = normalizeName(name);
    return folder.children.find((n) => normalizeName(n.name) === key) || null;
  }

  function findFolderByPath(pathArr) {
    let current = tree;
    for (let i = 0; i < pathArr.length; i += 1) {
      const next = findChildByName(current, pathArr[i]);
      if (!next || next.type !== 'folder') return null;
      current = next;
    }
    return current;
  }

  function findNodeInFolderByName(folder, name) {
    if (!folder || !folder.children) return null;
    const key = normalizeName(name);
    return folder.children.find((n) => normalizeName(n.name) === key) || null;
  }

  function nodeExistsInPath(name, pathArr) {
    const folder = findFolderByPath(pathArr);
    return !!findNodeInFolderByName(folder, name);
  }

  function findNodeLooseByNameInPath(name, pathArr) {
    const folder = findFolderByPath(pathArr);
    if (!folder || !folder.children) return null;
    const base = normalizeName(name);
    return folder.children.find((n) => normalizeName(n.name).startsWith(base)) || null;
  }

  function getCurrentFolder() {
    const found = findNodeById(selectedFolderId);
    if (!found || found.node.type !== 'folder') return null;
    return found.node;
  }

  function getParentFolderId(folderId) {
    const found = findNodeById(folderId);
    if (!found || !found.parent) return null;
    return found.parent.id === 'root' ? null : found.parent.id;
  }

  function getVisibleItems() {
    const folder = getCurrentFolder();
    if (!folder) return [];
    const items = [...(folder.children || [])];
    items.sort((a, b) => {
      const dir = sortState.dir === 'desc' ? -1 : 1;
      let cmp = 0;
      if (sortState.key === 'type') {
        cmp = normalizeName(a.type).localeCompare(normalizeName(b.type));
      } else if (sortState.key === 'path') {
        cmp = normalizeName(pathText(buildPathById(selectedFolderId)) + ' ' + a.name)
          .localeCompare(normalizeName(pathText(buildPathById(selectedFolderId)) + ' ' + b.name));
      } else {
        cmp = normalizeName(a.name).localeCompare(normalizeName(b.name));
      }
      if (cmp === 0) {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        cmp = normalizeName(a.name).localeCompare(normalizeName(b.name));
      }
      return cmp * dir;
    });
    return items;
  }

  function dedupeName(folder, rawName) {
    const name = String(rawName || '').trim();
    if (!name) return 'Nouveau dossier';
    if (!findChildByName(folder, name)) return name;

    const dot = name.lastIndexOf('.');
    const hasExt = dot > 0 && dot < name.length - 1;
    const base = hasExt ? name.slice(0, dot) : name;
    const ext = hasExt ? name.slice(dot) : '';

    let i = 1;
    while (i < 999) {
      const next = base + ' (copie ' + i + ')' + ext;
      if (!findChildByName(folder, next)) return next;
      i += 1;
    }
    return base + ' (copie)' + ext;
  }

  function createFolder(parentId, inputName) {
    const parentFound = findNodeById(parentId);
    if (!parentFound || parentFound.node.type !== 'folder') return false;

    const parent = parentFound.node;
    const raw = String(inputName || '').trim() || 'Nouveau dossier';
    const safeName = dedupeName(parent, raw);
    parent.children = parent.children || [];
    parent.children.push({
      id: uid('folder'),
      type: 'folder',
      name: safeName,
      children: []
    });
    saveState();
    return true;
  }

  function renameNode(id, newName) {
    const found = findNodeById(id);
    if (!found || !found.parent) return false;
    if (normalizeName(found.node.name) === normalizeName('Corbeille')) return false;

    const trimmed = String(newName || '').trim();
    if (!trimmed) return false;
    const parent = found.parent;
    const duplicate = parent.children.some((n) => n.id !== id && normalizeName(n.name) === normalizeName(trimmed));
    if (duplicate) return false;
    found.node.name = trimmed;
    saveState();
    return true;
  }

  function removeFromParent(nodeId) {
    const found = findNodeById(nodeId);
    if (!found || !found.parent) return null;
    const idx = found.parent.children.findIndex((n) => n.id === nodeId);
    if (idx < 0) return null;
    const removed = found.parent.children.splice(idx, 1)[0];
    return { removed, parent: found.parent };
  }

  function moveNode(nodeId, targetFolderId) {
    if (nodeId === targetFolderId) return false;
    const targetFound = findNodeById(targetFolderId);
    if (!targetFound || targetFound.node.type !== 'folder') return false;
    if (isDescendant(nodeId, targetFolderId)) return false;

    const pulled = removeFromParent(nodeId);
    if (!pulled) return false;

    const target = targetFound.node;
    pulled.removed.name = dedupeName(target, pulled.removed.name);
    target.children = target.children || [];
    target.children.push(pulled.removed);
    saveState();
    return true;
  }

  function copyNode(nodeId, targetFolderId) {
    const sourceFound = findNodeById(nodeId);
    const targetFound = findNodeById(targetFolderId);
    if (!sourceFound || !targetFound || targetFound.node.type !== 'folder') return false;
    const copy = cloneNode(sourceFound.node);
    copy.name = dedupeName(targetFound.node, copy.name);
    targetFound.node.children = targetFound.node.children || [];
    targetFound.node.children.push(copy);
    saveState();
    return true;
  }

  function getRecycleFolder() {
    return findFolderByPath(['Corbeille']);
  }

  function deleteNode(nodeId) {
    const found = findNodeById(nodeId);
    if (!found || !found.parent) return false;
    if (found.node.id === 'recycle') return false;
    if (normalizeName(found.node.name) === normalizeName('Corbeille')) return false;

    const recycle = getRecycleFolder();
    if (!recycle) return false;
    const pulled = removeFromParent(nodeId);
    if (!pulled) return false;

    pulled.removed.originalParentId = pulled.parent.id;
    pulled.removed.originalParentPath = buildPathById(pulled.parent.id);
    pulled.removed.name = dedupeName(recycle, pulled.removed.name);
    recycle.children = recycle.children || [];
    recycle.children.push(pulled.removed);
    saveState();
    return true;
  }

  function restoreNode(nodeId) {
    const recycle = getRecycleFolder();
    if (!recycle || !recycle.children) return false;
    if (nodeId === recycle.id) return false;
    const targetFound = findNodeById(nodeId);
    if (!targetFound || !targetFound.parent) return false;
    if (!isDescendant(recycle.id, nodeId)) return false;

    const pulled = removeFromParent(nodeId);
    if (!pulled) return false;
    const node = pulled.removed;

    let targetParent = null;
    if (node.originalParentId) {
      const parent = findNodeById(node.originalParentId);
      if (parent && parent.node && parent.node.type === 'folder') {
        targetParent = parent.node;
      }
    }
    if (!targetParent && Array.isArray(node.originalParentPath)) {
      targetParent = findFolderByPath(node.originalParentPath);
    }
    if (!targetParent) {
      targetParent = findFolderByPath(['Documents']) || tree;
    }

    node.name = dedupeName(targetParent, node.name);
    delete node.originalParentId;
    delete node.originalParentPath;
    targetParent.children = targetParent.children || [];
    targetParent.children.push(node);
    saveState();
    return true;
  }

  function emptyRecycleBin() {
    const recycle = getRecycleFolder();
    if (!recycle) return false;
    recycle.children = [];
    saveState();
    return true;
  }

  function setClipboard(mode, ids) {
    clipboard = { mode, ids: [...ids] };
    renderClipboardInfo();
    renderStatusBar();
  }

  function pasteIntoCurrent() {
    const folder = getCurrentFolder();
    if (!folder) return false;
    if (!clipboard.mode || !clipboard.ids.length) return false;

    let ok = 0;
    if (clipboard.mode === 'copy') {
      clipboard.ids.forEach((id) => {
        if (copyNode(id, folder.id)) ok += 1;
      });
    } else if (clipboard.mode === 'cut') {
      clipboard.ids.forEach((id) => {
        if (moveNode(id, folder.id)) ok += 1;
      });
      clipboard = { mode: null, ids: [] };
    }
    renderClipboardInfo();
    return ok > 0;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify({
        tree,
        selectedFolderId
      }));
    } catch (e) { /* ignore */ }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) { /* ignore */ }
  }

  function resetAll() {
    tree = cloneNode(DATA.initialTree || { id: 'root', type: 'folder', name: 'Ordinateur', children: [] });
    progress = {
      missionIndex: 0,
      doneCount: 0,
      errors: 0,
      xp: 0,
      completedIds: []
    };
    selectedFolderId = 'documents';
    selectedIds = new Set();
    clipboard = { mode: null, ids: [] };
    dragIds = [];
    saveState();
    saveProgress();
    renderAll();
    showFeedback('info', 'Etat reinitialise.');
  }

  function loadAll() {
    let loadedTree = null;
    let loadedSel = null;
    let loadedProgress = null;

    try {
      const raw = localStorage.getItem(STORAGE_STATE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        loadedTree = parsed.tree || null;
        loadedSel = parsed.selectedFolderId || null;
      }
    } catch (e) { /* ignore */ }

    try {
      const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (raw) loadedProgress = JSON.parse(raw);
    } catch (e) { /* ignore */ }

    tree = loadedTree || cloneNode(DATA.initialTree || { id: 'root', type: 'folder', name: 'Ordinateur', children: [] });
    progress = loadedProgress || {
      missionIndex: 0,
      doneCount: 0,
      errors: 0,
      xp: 0,
      completedIds: []
    };

    selectedFolderId = loadedSel || 'documents';
    if (!findNodeById(selectedFolderId)) selectedFolderId = 'documents';
  }

  function missionDone(id) {
    return progress.completedIds.includes(id);
  }

  function getMission() {
    const missions = DATA.missions || [];
    if (progress.missionIndex >= missions.length) return null;
    return missions[progress.missionIndex];
  }

  function validateMission(mission) {
    if (!mission || !mission.check) return false;
    const c = mission.check;

    if (c.type === 'folder_exists') {
      const folder = findFolderByPath(c.parentPath || []);
      if (!folder) return false;
      const node = findNodeInFolderByName(folder, c.name);
      return !!node && node.type === 'folder';
    }

    if (c.type === 'node_in_path') {
      const inTarget = nodeExistsInPath(c.name, c.targetPath || []);
      if (!inTarget) return false;
      if (Array.isArray(c.sourcePathMustNotContain)) {
        return !nodeExistsInPath(c.name, c.sourcePathMustNotContain);
      }
      return true;
    }

    if (c.type === 'copy_vs_move') {
      const targetHas = !!findNodeLooseByNameInPath(c.name, c.targetPath || []);
      const sourceHas = !!findNodeInFolderByName(findFolderByPath(c.sourcePath || []), c.name);
      return targetHas && (c.expectInSource ? sourceHas : !sourceHas);
    }

    if (c.type === 'multi_nodes_in_path') {
      const allInTarget = (c.names || []).every((n) => nodeExistsInPath(n, c.targetPath || []));
      if (!allInTarget) return false;
      if (Array.isArray(c.sourcePathMustNotContain)) {
        const stillInSource = (c.names || []).some((n) => nodeExistsInPath(n, c.sourcePathMustNotContain));
        return !stillInSource;
      }
      return true;
    }

    if (c.type === 'recycle_contains') {
      return nodeExistsInPath(c.name, ['Corbeille']);
    }

    if (c.type === 'restored_from_recycle') {
      const inTarget = !!findNodeLooseByNameInPath(c.name, c.targetPath || []);
      const inRecycle = !!findNodeLooseByNameInPath(c.name, ['Corbeille']);
      return inTarget && !inRecycle;
    }

    if (c.type === 'delete_and_empty_recycle') {
      const stillExists = nodeExistsInPath(c.deletedName, ['Telechargements']);
      if (stillExists) return false;
      const recycle = getRecycleFolder();
      return recycle && Array.isArray(recycle.children) && recycle.children.length === 0;
    }

    return false;
  }

  function tryValidateCurrentMission() {
    const mission = getMission();
    if (!mission) return;

    const ok = validateMission(mission);
    if (ok) {
      progress.doneCount += 1;
      progress.xp += XP_PER_MISSION;
      progress.completedIds.push(mission.id);
      progress.missionIndex += 1;

      recordExerciseProgress(PAGE_ID, {
        correct: 1,
        typed: 1,
        errors: 0,
        xp: XP_PER_MISSION
      });

      if (!getMission()) {
        promoteExerciseStatus(PAGE_ID, 'completed');
        showFeedback('ok', 'Mission réussie. Toutes les missions sont terminées.');
      } else {
        showFeedback('ok', 'Mission réussie. ' + mission.title + ' validée.');
      }
      saveProgress();
      renderAll();
    } else {
      progress.errors += 1;
      recordExerciseProgress(PAGE_ID, {
        correct: 0,
        typed: 1,
        errors: 1,
        xp: 0
      });
      saveProgress();
      const hint = mission && mission.hint ? mission.hint : 'Regardez la mission en haut.';
      showFeedback('err', 'Pas encore. Indice: ' + hint);
      renderKpis();
    }
  }

  function iconForNode(node) {
    if (node.type === 'folder') {
      if (normalizeName(node.name) === normalizeName('Corbeille')) return '\uD83D\uDDD1\uFE0F';
      return '\uD83D\uDCC1';
    }
    return '\uD83D\uDCC4';
  }

  function getTypeLabel(node) {
    return node.type === 'folder' ? 'Dossier' : 'Fichier';
  }

  function renderSortHeads() {
    const heads = [
      { el: dom.headName, key: 'name', label: 'Nom' },
      { el: dom.headType, key: 'type', label: 'Type' },
      { el: dom.headPath, key: 'path', label: 'Emplacement' }
    ];

    heads.forEach((h) => {
      const active = h.key === sortState.key;
      const arrow = active ? (sortState.dir === 'asc' ? ' \u2191' : ' \u2193') : '';
      h.el.textContent = h.label + arrow;
      h.el.setAttribute('aria-sort', active ? (sortState.dir === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  function toggleSort(key) {
    if (sortState.key === key) {
      sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
    } else {
      sortState.key = key;
      sortState.dir = 'asc';
    }
    renderAll();
  }

  function renderTree() {
    dom.treeBody.innerHTML = '';
    const tops = getTopFolders();
    tops.forEach((folder) => renderTreeItem(folder, 0, dom.treeBody));
  }

  function renderTreeItem(folder, depth, host) {
    if (folder.type !== 'folder') return;
    const item = document.createElement('div');
    item.className = 'tree-item' + (folder.id === selectedFolderId ? ' active' : '');
    item.dataset.folderId = folder.id;
    item.tabIndex = 0;
    item.setAttribute('role', 'treeitem');

    item.innerHTML = '<span class="tree-indent" style="margin-left:' + (depth * 14) + 'px"></span>' +
      '<span>' + iconForNode(folder) + '</span>' +
      '<span>' + escapeHTML(folder.name) + '</span>';

    item.addEventListener('click', () => {
      selectedFolderId = folder.id;
      selectedIds = new Set();
      lastClickedIndex = -1;
      focusedRowIndex = 0;
      saveState();
      closeContextMenu();
      renderAll();
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      item.classList.add('drop-target');
    });
    item.addEventListener('dragleave', () => item.classList.remove('drop-target'));
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drop-target');
      handleDropToFolder(folder.id);
    });

    host.appendChild(item);

    (folder.children || []).forEach((child) => {
      if (child.type === 'folder') renderTreeItem(child, depth + 1, host);
    });
  }

  function renderList() {
    dom.listBody.innerHTML = '';
    const items = getVisibleItems();
    if (!items.length) {
      focusedRowIndex = 0;
      return;
    }
    if (focusedRowIndex >= items.length) focusedRowIndex = items.length - 1;
    if (focusedRowIndex < 0) focusedRowIndex = 0;

    items.forEach((node, index) => {
      const row = document.createElement('div');
      row.className = 'list-row' + (selectedIds.has(node.id) ? ' selected' : '');
      row.draggable = true;
      row.dataset.nodeId = node.id;
      row.tabIndex = index === focusedRowIndex ? 0 : -1;
      row.setAttribute('role', 'option');
      row.setAttribute('aria-selected', selectedIds.has(node.id) ? 'true' : 'false');
      row.innerHTML =
        '<div>' + (selectedIds.has(node.id) ? '\u2611' : '\u2610') + '</div>' +
        '<div class="row-name"><span>' + iconForNode(node) + '</span><span class="row-label">' + escapeHTML(node.name) + '</span></div>' +
        '<div class="list-type">' + getTypeLabel(node) + '</div>' +
        '<div class="list-path">' + escapeHTML(pathText(buildPathById(selectedFolderId))) + '</div>';

      row.addEventListener('click', (e) => {
        const multi = e.ctrlKey || e.metaKey;
        if (e.shiftKey && lastClickedIndex >= 0) {
          const start = Math.min(lastClickedIndex, index);
          const end = Math.max(lastClickedIndex, index);
          selectedIds = new Set(items.slice(start, end + 1).map((n) => n.id));
        } else if (!multi) {
          selectedIds = new Set([node.id]);
          lastClickedIndex = index;
          focusedRowIndex = index;
        } else if (selectedIds.has(node.id)) {
          selectedIds.delete(node.id);
          lastClickedIndex = index;
          focusedRowIndex = index;
        } else {
          selectedIds.add(node.id);
          lastClickedIndex = index;
          focusedRowIndex = index;
        }
        renderList();
        renderStatusBar();
      });

      row.addEventListener('dblclick', () => {
        if (node.type === 'folder') {
          selectedFolderId = node.id;
          selectedIds = new Set();
          lastClickedIndex = -1;
          focusedRowIndex = 0;
          saveState();
          renderAll();
        } else {
          showFeedback('info', 'Fichier selectionne: ' + node.name);
        }
      });

      row.addEventListener('dragstart', () => {
        dragIds = selectedIds.has(node.id) ? [...selectedIds] : [node.id];
      });

      row.addEventListener('focus', () => {
        focusedRowIndex = index;
      });

      row.addEventListener('keydown', (e) => {
        if (!items.length) return;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          focusedRowIndex = Math.min(items.length - 1, index + 1);
          renderList();
          const next = dom.listBody.querySelector('.list-row[tabindex="0"]');
          if (next) next.focus();
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          focusedRowIndex = Math.max(0, index - 1);
          renderList();
          const prev = dom.listBody.querySelector('.list-row[tabindex="0"]');
          if (prev) prev.focus();
          return;
        }
        if (e.key === 'Home') {
          e.preventDefault();
          focusedRowIndex = 0;
          renderList();
          const first = dom.listBody.querySelector('.list-row[tabindex="0"]');
          if (first) first.focus();
          return;
        }
        if (e.key === 'End') {
          e.preventDefault();
          focusedRowIndex = items.length - 1;
          renderList();
          const last = dom.listBody.querySelector('.list-row[tabindex="0"]');
          if (last) last.focus();
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          row.dispatchEvent(new MouseEvent('dblclick'));
          return;
        }
        if (e.key === ' ') {
          e.preventDefault();
          row.dispatchEvent(new MouseEvent('click', { ctrlKey: true }));
        }
      });

      row.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!selectedIds.has(node.id)) {
          selectedIds = new Set([node.id]);
          lastClickedIndex = index;
          focusedRowIndex = index;
          renderList();
          renderStatusBar();
        }
        openContextMenu(e.clientX, e.clientY, node.id);
      });

      if (node.type === 'folder') {
        row.addEventListener('dragover', (e) => {
          e.preventDefault();
          row.classList.add('drop-target');
        });
        row.addEventListener('dragleave', () => row.classList.remove('drop-target'));
        row.addEventListener('drop', (e) => {
          e.preventDefault();
          row.classList.remove('drop-target');
          handleDropToFolder(node.id);
        });
      }

      dom.listBody.appendChild(row);
    });
  }
  function handleDropToFolder(folderId) {
    if (!dragIds.length) return;
    let moved = 0;
    dragIds.forEach((id) => {
      if (moveNode(id, folderId)) moved += 1;
    });
    dragIds = [];
    selectedIds = new Set();
    if (moved > 0) {
      showFeedback('ok', 'Deplacement effectue.');
      renderAll();
      tryValidateCurrentMission();
    } else {
      showFeedback('err', 'Deplacement impossible ici.');
    }
  }

  function renderMission() {
    const mission = getMission();
    if (!mission) {
      dom.missionTitle.textContent = 'Termine';
      dom.missionText.textContent = 'Toutes les missions sont completees. Bravo.';
      dom.btnValidate.disabled = true;
      dom.btnNextExercise.style.display = '';
      return;
    }
    dom.missionTitle.textContent = mission.title;
    dom.missionText.textContent = mission.instruction;
    dom.btnValidate.disabled = false;
    dom.btnNextExercise.style.display = 'none';
  }

  function renderKpis() {
    const total = (DATA.missions || []).length;
    dom.kpiDone.textContent = progress.doneCount + '/' + total;
    dom.kpiErrors.textContent = progress.errors;
    dom.kpiXp.textContent = progress.xp;
    dom.kpiProgress.textContent = total > 0 ? Math.round((progress.doneCount / total) * 100) + '%' : '0%';
  }

  function renderPath() {
    const parts = buildPathMetaById(selectedFolderId);
    dom.breadcrumb.innerHTML = '';
    parts.forEach((part, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'crumb';
      btn.textContent = part.name;
      btn.addEventListener('click', () => {
        selectedFolderId = part.id;
        selectedIds = new Set();
        closeContextMenu();
        renderAll();
      });
      dom.breadcrumb.appendChild(btn);

      if (idx < parts.length - 1) {
        const sep = document.createElement('span');
        sep.className = 'crumb sep';
        sep.textContent = '>';
        dom.breadcrumb.appendChild(sep);
      }
    });
  }

  function renderStatusBar() {
    const folder = getCurrentFolder();
    const totalItems = folder && folder.children ? folder.children.length : 0;
    const selected = selectedIds.size;
    const clip = clipboard.mode ? (clipboard.mode + ' ' + clipboard.ids.length) : 'vide';
    dom.statusBar.textContent =
      'Elements: ' + totalItems + ' | Selection: ' + selected + ' | Presse-papiers: ' + clip;
  }

  function renderClipboardInfo() {
    let txt = 'Presse-papiers: vide';
    if (clipboard.mode && clipboard.ids.length) {
      txt = 'Presse-papiers: ' + clipboard.mode + ' (' + clipboard.ids.length + ' element(s))';
    }
    dom.clipboardInfo.textContent = txt;
  }

  function renderAll() {
    renderMission();
    renderKpis();
    renderSortHeads();
    renderPath();
    renderTree();
    renderList();
    renderClipboardInfo();
    renderStatusBar();
    saveState();
  }

  function showFeedback(type, text) {
    dom.feedback.className = 'feedback ' + (type === 'ok' ? 'ok' : type === 'err' ? 'err' : '');
    dom.feedback.textContent = text;
  }

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function bindButtons() {
    dom.btnUp.addEventListener('click', () => {
      const parentId = getParentFolderId(selectedFolderId);
      if (!parentId) return;
      selectedFolderId = parentId;
      selectedIds = new Set();
      closeContextMenu();
      renderAll();
    });

    dom.btnNewFolder.addEventListener('click', () => {
      const name = prompt('Nom du nouveau dossier:', 'Nouveau dossier');
      if (name === null) return;
      if (createFolder(selectedFolderId, name)) {
        showFeedback('ok', 'Dossier cree.');
        renderAll();
        tryValidateCurrentMission();
      } else {
        showFeedback('err', 'Impossible de creer ce dossier.');
      }
    });

    dom.btnRename.addEventListener('click', () => {
      if (selectedIds.size !== 1) {
        showFeedback('err', 'Selectionnez 1 element a renommer.');
        return;
      }
      const id = [...selectedIds][0];
      const found = findNodeById(id);
      if (!found) return;
      const name = prompt('Nouveau nom:', found.node.name);
      if (name === null) return;
      if (renameNode(id, name)) {
        showFeedback('ok', 'Element renomme.');
        renderAll();
        tryValidateCurrentMission();
      } else {
        showFeedback('err', 'Renommage impossible.');
      }
    });

    dom.btnCopy.addEventListener('click', () => {
      if (!selectedIds.size) {
        showFeedback('err', 'Selectionnez au moins 1 element.');
        return;
      }
      setClipboard('copy', [...selectedIds]);
      showFeedback('ok', 'Copie en memoire.');
    });

    dom.btnCut.addEventListener('click', () => {
      if (!selectedIds.size) {
        showFeedback('err', 'Selectionnez au moins 1 element.');
        return;
      }
      setClipboard('cut', [...selectedIds]);
      showFeedback('ok', 'Couper en memoire.');
    });

    dom.btnPaste.addEventListener('click', () => {
      if (pasteIntoCurrent()) {
        showFeedback('ok', 'Collage effectue.');
        selectedIds = new Set();
        closeContextMenu();
        renderAll();
        tryValidateCurrentMission();
      } else {
        showFeedback('err', 'Rien a coller ici.');
      }
    });

    dom.btnDelete.addEventListener('click', () => {
      if (!selectedIds.size) {
        showFeedback('err', 'Selectionnez au moins 1 element.');
        return;
      }
      if (!confirm('Supprimer les elements selectionnes ?')) return;
      let removed = 0;
      [...selectedIds].forEach((id) => {
        if (deleteNode(id)) removed += 1;
      });
      selectedIds = new Set();
      if (removed > 0) {
        showFeedback('ok', 'Element(s) deplace(s) dans Corbeille.');
        closeContextMenu();
        renderAll();
        tryValidateCurrentMission();
      } else {
        showFeedback('err', 'Suppression impossible.');
      }
    });

    dom.btnRestore.addEventListener('click', () => {
      if (!selectedIds.size) {
        showFeedback('err', 'Selectionnez au moins 1 element.');
        return;
      }
      let restored = 0;
      [...selectedIds].forEach((id) => {
        if (restoreNode(id)) restored += 1;
      });
      selectedIds = new Set();
      if (restored > 0) {
        showFeedback('ok', 'Restauration effectuee.');
        closeContextMenu();
        renderAll();
        tryValidateCurrentMission();
      } else {
        showFeedback('err', 'Restauration impossible.');
      }
    });

    dom.btnEmptyRecycle.addEventListener('click', () => {
      if (!confirm('Vider la corbeille ?')) return;
      if (emptyRecycleBin()) {
        showFeedback('ok', 'Corbeille vide.');
        closeContextMenu();
        renderAll();
        tryValidateCurrentMission();
      }
    });

    dom.btnValidate.addEventListener('click', () => {
      tryValidateCurrentMission();
    });

    dom.headName.addEventListener('click', () => toggleSort('name'));
    dom.headType.addEventListener('click', () => toggleSort('type'));
    dom.headPath.addEventListener('click', () => toggleSort('path'));

    dom.btnHelp.addEventListener('click', () => {
      helpOpen = !helpOpen;
      dom.helpBox.classList.toggle('show', helpOpen);
    });

    dom.btnReset.addEventListener('click', () => {
      if (!confirm('Réinitialiser le jeu et la progression ?')) return;
      resetAll();
    });

    dom.ctxOpen.addEventListener('click', () => {
      closeContextMenu();
      if (!contextTargetId) return;
      const found = findNodeById(contextTargetId);
      if (!found || found.node.type !== 'folder') return;
      selectedFolderId = found.node.id;
      selectedIds = new Set();
      renderAll();
    });

    dom.ctxRename.addEventListener('click', () => {
      closeContextMenu();
      if (!selectedIds.size) return;
      dom.btnRename.click();
    });

    dom.ctxCopy.addEventListener('click', () => {
      closeContextMenu();
      if (!selectedIds.size) return;
      dom.btnCopy.click();
    });

    dom.ctxCut.addEventListener('click', () => {
      closeContextMenu();
      if (!selectedIds.size) return;
      dom.btnCut.click();
    });

    dom.ctxDelete.addEventListener('click', () => {
      closeContextMenu();
      if (!selectedIds.size) return;
      dom.btnDelete.click();
    });

    dom.ctxRestore.addEventListener('click', () => {
      closeContextMenu();
      if (!selectedIds.size) return;
      dom.btnRestore.click();
    });

    document.addEventListener('click', () => closeContextMenu());
    document.addEventListener('keydown', (e) => {
      const key = String(e.key || '').toLowerCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      if (key === 'escape') {
        closeContextMenu();
        return;
      }

      if (ctrlOrMeta && key === 'c') {
        e.preventDefault();
        dom.btnCopy.click();
        return;
      }
      if (ctrlOrMeta && key === 'x') {
        e.preventDefault();
        dom.btnCut.click();
        return;
      }
      if (ctrlOrMeta && key === 'v') {
        e.preventDefault();
        dom.btnPaste.click();
        return;
      }
      if (key === 'delete') {
        e.preventDefault();
        dom.btnDelete.click();
        return;
      }
      if (e.key === 'F2') {
        e.preventDefault();
        dom.btnRename.click();
      }
    });

    const nextEx = getNextExercise(PAGE_ID);
    if (nextEx && nextEx.name && nextEx.href) {
      dom.btnNextExercise.addEventListener('click', () => {
        window.location.href = nextEx.href;
      });
      dom.btnNextExercise.textContent = 'Exercice suivant: ' + nextEx.name;
    } else {
      dom.btnNextExercise.style.display = 'none';
    }
  }

  function initDom() {
    dom.missionTitle = document.getElementById('missionTitle');
    dom.missionText = document.getElementById('missionText');
    dom.pathBox = document.getElementById('pathBox');
    dom.breadcrumb = document.getElementById('breadcrumb');
    dom.treeBody = document.getElementById('treeBody');
    dom.listBody = document.getElementById('listBody');
    dom.headName = document.getElementById('headName');
    dom.headType = document.getElementById('headType');
    dom.headPath = document.getElementById('headPath');
    dom.feedback = document.getElementById('feedback');
    dom.statusBar = document.getElementById('statusBar');
    dom.helpBox = document.getElementById('helpBox');
    dom.clipboardInfo = document.getElementById('clipboardInfo');

    dom.kpiDone = document.getElementById('kpiDone');
    dom.kpiErrors = document.getElementById('kpiErrors');
    dom.kpiXp = document.getElementById('kpiXp');
    dom.kpiProgress = document.getElementById('kpiProgress');

    dom.btnUp = document.getElementById('btnUp');
    dom.btnNewFolder = document.getElementById('btnNewFolder');
    dom.btnRename = document.getElementById('btnRename');
    dom.btnCopy = document.getElementById('btnCopy');
    dom.btnCut = document.getElementById('btnCut');
    dom.btnPaste = document.getElementById('btnPaste');
    dom.btnDelete = document.getElementById('btnDelete');
    dom.btnRestore = document.getElementById('btnRestore');
    dom.btnEmptyRecycle = document.getElementById('btnEmptyRecycle');
    dom.btnValidate = document.getElementById('btnValidate');
    dom.btnHelp = document.getElementById('btnHelp');
    dom.btnReset = document.getElementById('btnReset');
    dom.btnNextExercise = document.getElementById('btnNextExercise');

    dom.contextMenu = document.getElementById('contextMenu');
    dom.ctxOpen = document.getElementById('ctxOpen');
    dom.ctxRename = document.getElementById('ctxRename');
    dom.ctxCopy = document.getElementById('ctxCopy');
    dom.ctxCut = document.getElementById('ctxCut');
    dom.ctxDelete = document.getElementById('ctxDelete');
    dom.ctxRestore = document.getElementById('ctxRestore');

    dom.treeBody.setAttribute('role', 'tree');
    dom.listBody.setAttribute('role', 'listbox');
    dom.listBody.setAttribute('aria-label', 'Contenu du dossier');
  }

  function openContextMenu(x, y, nodeId) {
    contextTargetId = nodeId;
    dom.contextMenu.classList.add('show');

    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const menuW = dom.contextMenu.offsetWidth || 180;
    const menuH = dom.contextMenu.offsetHeight || 230;

    const left = Math.max(6, Math.min(x, vw - menuW - 6));
    const top = Math.max(6, Math.min(y, vh - menuH - 6));

    dom.contextMenu.style.left = left + 'px';
    dom.contextMenu.style.top = top + 'px';

    const found = findNodeById(nodeId);
    const isFolder = !!(found && found.node.type === 'folder');
    const recycle = getRecycleFolder();
    const inRecycle = !!(recycle && found && found.node && found.node.id !== recycle.id && isDescendant(recycle.id, found.node.id));
    dom.ctxOpen.disabled = !isFolder;
    dom.ctxRestore.disabled = !inRecycle;
  }

  function closeContextMenu() {
    contextTargetId = null;
    dom.contextMenu.classList.remove('show');
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDom();
    loadAll();
    promoteExerciseStatus(PAGE_ID, progress.doneCount > 0 ? 'in_progress' : 'not_started');
    bindButtons();
    renderAll();
    showFeedback('ok', 'Mission en cours. Suivez les consignes en haut.');
  });
})();

