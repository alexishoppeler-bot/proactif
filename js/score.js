'use strict';

(function initScoreManager() {
  const STORAGE_KEY = 'ah:scores:v1';
  const STATUS_ORDER = { not_started: 0, in_progress: 1, completed: 2 };

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function defaultMetrics() {
    return {
      correct: 0,
      typed: 0,
      errors: 0,
      xp: 0,
      status: 'not_started',
      votes: { like: 0, dislike: 0 }
    };
  }

  function readStore() {
    if (!window.localStorage) return { scores: {}, sessions: [] };
    const parsed = safeParse(localStorage.getItem(STORAGE_KEY), { scores: {}, sessions: [] });
    if (!parsed || typeof parsed !== 'object') return { scores: {}, sessions: [] };
    if (!parsed.scores || typeof parsed.scores !== 'object') parsed.scores = {};
    if (!Array.isArray(parsed.sessions)) parsed.sessions = [];
    return parsed;
  }

  function writeStore(store) {
    if (!window.localStorage) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function emitUpdate() {
    document.dispatchEvent(new CustomEvent('score:updated'));
  }

  function ensureMetrics(store, page) {
    if (!store.scores[page] || typeof store.scores[page] !== 'object') {
      store.scores[page] = defaultMetrics();
    }
    return store.scores[page];
  }

  const ScoreManager = {
    readMetrics(page) {
      const store = readStore();
      return Object.assign(defaultMetrics(), ensureMetrics(store, page));
    },

    writeMetrics(page, data) {
      const store = readStore();
      const current = ensureMetrics(store, page);
      const next = Object.assign({}, current, data || {});
      next.correct = Math.max(0, Number(next.correct) || 0);
      next.typed = Math.max(0, Number(next.typed) || 0);
      next.errors = Math.max(0, Number(next.errors) || 0);
      next.xp = Math.max(0, Number(next.xp) || 0);
      next.status = STATUS_ORDER[next.status] !== undefined ? next.status : 'not_started';
      if (!next.votes || typeof next.votes !== 'object') next.votes = { like: 0, dislike: 0 };
      next.votes.like = Math.max(0, Number(next.votes.like) || 0);
      next.votes.dislike = Math.max(0, Number(next.votes.dislike) || 0);
      store.scores[page] = next;
      writeStore(store);
      emitUpdate();
    },

    updateMetrics(page, delta) {
      const current = this.readMetrics(page);
      this.writeMetrics(page, {
        correct: current.correct + (Number(delta && delta.correct) || 0),
        typed: current.typed + (Number(delta && delta.typed) || 0),
        errors: current.errors + (Number(delta && delta.errors) || 0),
        xp: current.xp + (Number(delta && delta.xp) || 0)
      });
    },

    promoteStatus(page, status) {
      if (STATUS_ORDER[status] === undefined) return;
      const current = this.readMetrics(page);
      if (STATUS_ORDER[status] >= STATUS_ORDER[current.status]) {
        this.writeMetrics(page, { status });
      }
    },

    getAllData() {
      return readStore().scores;
    },

    getGlobalSummary(pages) {
      const all = this.getAllData();
      const targets = Array.isArray(pages) && pages.length ? pages : Object.keys(all);
      let totalCorrect = 0;
      let totalTyped = 0;
      let totalErrors = 0;
      let totalXp = 0;
      let completed = 0;
      let inProgress = 0;

      for (const p of targets) {
        const m = Object.assign(defaultMetrics(), all[p] || {});
        totalCorrect += m.correct;
        totalTyped += m.typed;
        totalErrors += m.errors;
        totalXp += m.xp;
        if (m.status === 'completed') completed += 1;
        if (m.status === 'in_progress') inProgress += 1;
      }

      return {
        totalCorrect,
        totalTyped,
        totalErrors,
        totalXp,
        accuracy: totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 0,
        completed,
        inProgress,
        level: Math.floor(totalXp / 100) + 1
      };
    },

    pushSessionHistory(session) {
      const store = readStore();
      store.sessions.unshift({
        timestamp: Date.now(),
        gameName: session && session.name ? session.name : (session && session.page) || 'Exercice',
        xp: Number(session && session.xp) || 0,
        correct: Number(session && session.correct) || 0,
        typed: Number(session && session.typed) || 0,
        errors: Number(session && session.errors) || 0,
        page: (session && session.page) || ''
      });
      store.sessions = store.sessions.slice(0, 200);
      writeStore(store);
      emitUpdate();
    },

    getSessionHistory() {
      return readStore().sessions.slice(0, 5);
    },

    getDailyXP(days) {
      const count = Math.max(1, Number(days) || 7);
      const now = new Date();
      const sessions = readStore().sessions;
      const byDay = new Map();
      for (const s of sessions) {
        const d = new Date(s.timestamp || 0);
        const key = d.toISOString().slice(0, 10);
        byDay.set(key, (byDay.get(key) || 0) + (Number(s.xp) || 0));
      }
      const result = [];
      for (let i = count - 1; i >= 0; i -= 1) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        result.push({
          key,
          label: d.toLocaleDateString('fr-CH', { weekday: 'short' }),
          xp: byDay.get(key) || 0
        });
      }
      return result;
    },

    getStreakData() {
      const sessions = readStore().sessions;
      const daysWithXp = new Set();
      for (const s of sessions) {
        if ((Number(s.xp) || 0) > 0) {
          daysWithXp.add(new Date(s.timestamp || 0).toISOString().slice(0, 10));
        }
      }
      const sorted = Array.from(daysWithXp).sort();
      let best = 0;
      let run = 0;
      let prev = null;
      for (const day of sorted) {
        if (!prev) {
          run = 1;
        } else {
          const a = new Date(prev + 'T00:00:00Z').getTime();
          const b = new Date(day + 'T00:00:00Z').getTime();
          run = (b - a === 86400000) ? run + 1 : 1;
        }
        if (run > best) best = run;
        prev = day;
      }

      let current = 0;
      const today = new Date().toISOString().slice(0, 10);
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().slice(0, 10);
      if (daysWithXp.has(today) || daysWithXp.has(yesterday)) {
        let cursor = daysWithXp.has(today) ? new Date() : yesterdayDate;
        while (true) {
          const key = cursor.toISOString().slice(0, 10);
          if (!daysWithXp.has(key)) break;
          current += 1;
          cursor.setDate(cursor.getDate() - 1);
        }
      }

      return { current, best };
    },

    getVotesStats(pages) {
      const all = this.getAllData();
      const targets = Array.isArray(pages) && pages.length ? pages : Object.keys(all);
      let totalLikes = 0;
      let totalDislikes = 0;
      for (const p of targets) {
        const v = (all[p] && all[p].votes) || {};
        totalLikes += Number(v.like) || 0;
        totalDislikes += Number(v.dislike) || 0;
      }
      return { totalLikes, totalDislikes };
    },

    exportStore() {
      const store = readStore();
      return {
        scores: store.scores,
        sessions: store.sessions
      };
    },

    importStore(data) {
      if (!data || typeof data !== 'object') return false;
      const payload = {
        scores: (data.scores && typeof data.scores === 'object') ? data.scores : {},
        sessions: Array.isArray(data.sessions) ? data.sessions : []
      };
      writeStore(payload);
      emitUpdate();
      return true;
    },

    reset() {
      writeStore({ scores: {}, sessions: [] });
      emitUpdate();
    }
  };

  window.ScoreManager = ScoreManager;
})();
