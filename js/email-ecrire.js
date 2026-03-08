'use strict';

const PAGE_ID = 'email-ecrire';
const CASES = Array.isArray(window.EMAIL_ECRIRE_DATA) ? window.EMAIL_ECRIRE_DATA : [];

let session = { items: [], index: 0, correct: 0, errors: 0, typed: 0, xp: 0, answered: false };

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function escapeHTML(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function formatBody(text) {
  return escapeHTML(text).replace(/\n/g, '<br>');
}

function startSession() {
  if (!CASES.length) {
    showToast('Aucune situation disponible.', 'error');
    return;
  }
  session = { items: shuffle(CASES), index: 0, correct: 0, errors: 0, typed: 0, xp: 0, answered: false };
  document.getElementById('resultZone').classList.remove('show');
  document.getElementById('gameZone').classList.remove('hidden');
  renderCase();
}

function renderCase() {
  const current = session.items[session.index];
  session.answered = false;
  document.getElementById('sNum').textContent = session.index + 1;
  document.getElementById('sTotal').textContent = session.items.length;
  document.getElementById('sTag').textContent = current.category;
  document.getElementById('sText').textContent = current.situation;
  document.getElementById('btnNext').style.display = 'none';

  const feedback = document.getElementById('mailFeedback');
  feedback.className = 'mail-feedback';
  feedback.textContent = '';

  const pct = Math.round((session.index / session.items.length) * 100);
  document.getElementById('progressFill').style.width = pct + '%';

  const box = document.getElementById('mailChoices');
  box.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  current.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'mail-choice';
    btn.type = 'button';
    btn.innerHTML = `
      <div class="mail-choice-head">
        <span class="mail-letter">${letters[idx]}</span>
        <span class="mail-subject"><strong>Objet :</strong> ${escapeHTML(choice.subject)}</span>
      </div>
      <div class="mail-body">${formatBody(choice.body)}</div>
      <div class="mail-meta">
        <span class="mail-pill">${escapeHTML(choice.attachment)}</span>
        <span class="mail-pill">${escapeHTML(choice.signature)}</span>
      </div>`;
    btn.addEventListener('click', () => answer(idx));
    box.appendChild(btn);
  });

  updateKPIs();
}

function answer(idx) {
  if (session.answered) return;
  const current = session.items[session.index];
  if (idx < 0 || idx >= current.choices.length) return;

  session.answered = true;
  session.typed += 1;
  const ok = idx === current.answer;
  const buttons = document.querySelectorAll('.mail-choice');
  buttons.forEach(b => { b.disabled = true; });

  if (ok) {
    session.correct += 1;
    session.xp += 3;
    buttons[idx].classList.add('correct');
    recordExerciseProgress(PAGE_ID, { correct: 1, typed: 1, errors: 0, xp: 3 });
    showFeedback(true, current.correctFeedback);
  } else {
    session.errors += 1;
    buttons[idx].classList.add('wrong');
    if (buttons[current.answer]) buttons[current.answer].classList.add('correct');
    recordExerciseProgress(PAGE_ID, { correct: 0, typed: 1, errors: 1, xp: 0 });
    showFeedback(false, current.choices[idx].reasonIfWrong || 'Cette proposition contient des erreurs.');
  }

  const btn = document.getElementById('btnNext');
  btn.style.display = 'inline-flex';
  btn.textContent = session.index < session.items.length - 1 ? 'Situation suivante' : 'Terminer';
  updateKPIs();
}

function showFeedback(ok, text) {
  const feedback = document.getElementById('mailFeedback');
  feedback.className = 'mail-feedback ' + (ok ? 'ok' : 'err');
  feedback.textContent = (ok ? '✅ Réponse correcte. ' : '❌ Réponse incorrecte. ') + text;
}

function nextCase() {
  if (!session.answered) return;
  session.index += 1;
  if (session.index >= session.items.length) return finish();
  renderCase();
}

function finish() {
  promoteExerciseStatus(PAGE_ID, 'completed');
  document.getElementById('gameZone').classList.add('hidden');
  document.getElementById('resultZone').classList.add('show');
  document.getElementById('progressFill').style.width = '100%';

  const accuracy = calcAccuracy(session.correct, session.typed);
  document.getElementById('resEmoji').textContent = accuracy >= 80 ? '🏆' : '✉️';
  document.getElementById('resTitle').textContent = accuracy >= 80 ? 'Très bon travail' : 'Continuez';
  document.getElementById('resSubtitle').textContent = `${session.correct} bonne(s) réponse(s) sur ${session.items.length} situations.`;
  document.getElementById('resCorrect').textContent = session.correct;
  document.getElementById('resErrors').textContent = session.errors;
  document.getElementById('resXP').textContent = session.xp;
  document.getElementById('resAccuracy').textContent = accuracy + '%';
}

function updateKPIs() {
  const total = session.items.length || 1;
  const progress = Math.round((session.index / total) * 100);
  document.getElementById('kpiCorrect').textContent = session.correct;
  document.getElementById('kpiErrors').textContent = session.errors;
  document.getElementById('kpiXP').textContent = session.xp;
  document.getElementById('kpiProgress').textContent = progress + '%';
}

document.addEventListener('DOMContentLoaded', () => {
  const btnNextEx = document.getElementById('btnNextExercise');
  const nextEx = getNextExercise(PAGE_ID);
  if (nextEx && nextEx.name && nextEx.href) {
    btnNextEx.addEventListener('click', () => { window.location.href = nextEx.href; });
    btnNextEx.textContent = 'Exercice suivant : ' + nextEx.name;
  } else {
    btnNextEx.style.display = 'none';
  }

  document.getElementById('btnNext').addEventListener('click', nextCase);
  document.getElementById('btnRestart').addEventListener('click', startSession);

  document.addEventListener('keydown', e => {
    if (e.target && e.target.tagName === 'INPUT') return;
    const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
    if (!session.answered && Object.prototype.hasOwnProperty.call(map, e.key)) answer(map[e.key]);
    if (e.key === 'Enter' && session.answered) nextCase();
  });

  startSession();
});
