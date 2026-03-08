'use strict';

const PAGE_ID = 'email-pro';
const EMAIL_CASES = Array.isArray(window.EMAIL_PRO_DATA) ? window.EMAIL_PRO_DATA : [];

let session = {
  items: [],
  index: 0,
  correct: 0,
  errors: 0,
  typed: 0,
  xp: 0,
  answered: false
};

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatBody(text) {
  return escapeHTML(text).replace(/\n/g, '<br>');
}

function startSession() {
  if (!EMAIL_CASES.length) {
    showToast('Aucun e-mail disponible.', 'error');
    return;
  }

  session.items = shuffle(EMAIL_CASES);
  session.index = 0;
  session.correct = 0;
  session.errors = 0;
  session.typed = 0;
  session.xp = 0;
  session.answered = false;

  document.getElementById('resultZone').classList.remove('show');
  document.getElementById('gameZone').classList.remove('hidden');
  renderEmailCase();
}

function renderEmailCase() {
  const current = session.items[session.index];
  session.answered = false;

  document.getElementById('sNum').textContent = session.index + 1;
  document.getElementById('sTotal').textContent = session.items.length;
  document.getElementById('sTag').textContent = current.category;
  document.getElementById('rFrom').textContent = current.received.from;
  document.getElementById('rSubject').textContent = current.received.subject;
  document.getElementById('rBody').textContent = current.received.body;
  document.getElementById('rNeed').textContent = current.received.request;

  const feedback = document.getElementById('mailFeedback');
  feedback.className = 'mail-feedback';
  feedback.textContent = '';

  document.getElementById('btnNext').style.display = 'none';
  document.getElementById('btnNext').textContent = 'E-mail suivant';

  const pct = Math.round((session.index / session.items.length) * 100);
  document.getElementById('progressFill').style.width = pct + '%';

  renderResponseChoices(current);
  updateKPIs();
}

function renderResponseChoices(item) {
  const container = document.getElementById('mailChoices');
  const letters = ['A', 'B', 'C', 'D'];
  container.innerHTML = '';

  item.responses.forEach((response, idx) => {
    const button = document.createElement('button');
    button.className = 'mail-choice';
    button.type = 'button';
    button.innerHTML = `
      <div class="mail-choice-head">
        <span class="mail-letter">${letters[idx]}</span>
        <span class="mail-subject"><strong>Objet :</strong> ${escapeHTML(response.subject)}</span>
      </div>
      <div class="mail-body">${formatBody(response.body)}</div>
      <div class="mail-meta">
        <span class="mail-pill">${escapeHTML(response.attachment)}</span>
        <span class="mail-pill">${escapeHTML(response.signature)}</span>
      </div>
    `;
    button.addEventListener('click', () => answer(idx));
    container.appendChild(button);
  });
}

function answer(selectedIndex) {
  if (session.answered) return;

  const current = session.items[session.index];
  if (selectedIndex < 0 || selectedIndex >= current.responses.length) return;

  session.answered = true;
  session.typed += 1;

  const isCorrect = selectedIndex === current.answer;
  const allButtons = document.querySelectorAll('.mail-choice');
  allButtons.forEach(btn => { btn.disabled = true; });

  if (isCorrect) {
    session.correct += 1;
    session.xp += 3;
    allButtons[selectedIndex].classList.add('correct');
    recordExerciseProgress(PAGE_ID, { correct: 1, typed: 1, errors: 0, xp: 3 });
    showFeedback(true, current.correctFeedback);
  } else {
    session.errors += 1;
    allButtons[selectedIndex].classList.add('wrong');
    if (allButtons[current.answer]) allButtons[current.answer].classList.add('correct');
    recordExerciseProgress(PAGE_ID, { correct: 0, typed: 1, errors: 1, xp: 0 });
    showFeedback(false, current.responses[selectedIndex].reasonIfWrong || 'Cette réponse n’est pas adaptée.');
  }

  const nextBtn = document.getElementById('btnNext');
  nextBtn.style.display = 'inline-flex';
  nextBtn.textContent = session.index < session.items.length - 1 ? 'E-mail suivant' : 'Terminer';
  updateKPIs();
}

function showFeedback(isCorrect, message) {
  const feedback = document.getElementById('mailFeedback');
  feedback.className = 'mail-feedback ' + (isCorrect ? 'ok' : 'err');
  feedback.textContent = (isCorrect ? '✅ Réponse correcte. ' : '❌ Réponse incorrecte. ') + message;
}

function nextEmail() {
  if (!session.answered) return;

  session.index += 1;
  if (session.index >= session.items.length) {
    finishSession();
    return;
  }
  renderEmailCase();
}

function finishSession() {
  promoteExerciseStatus(PAGE_ID, 'completed');

  document.getElementById('gameZone').classList.add('hidden');
  document.getElementById('resultZone').classList.add('show');
  document.getElementById('progressFill').style.width = '100%';

  const accuracy = calcAccuracy(session.correct, session.typed);
  let emoji = '📘';
  let title = 'Continuez à vous entraîner';
  if (accuracy >= 90) {
    emoji = '🏆';
    title = 'Excellent résultat';
  } else if (accuracy >= 70) {
    emoji = '👍';
    title = 'Très bon travail';
  } else if (accuracy >= 50) {
    emoji = '📈';
    title = 'Bon début';
  }

  document.getElementById('resEmoji').textContent = emoji;
  document.getElementById('resTitle').textContent = title;
  document.getElementById('resSubtitle').textContent =
    session.correct + ' bonne(s) réponse(s) sur ' + session.items.length + ' e-mails.';
  document.getElementById('resCorrect').textContent = session.correct;
  document.getElementById('resErrors').textContent = session.errors;
  document.getElementById('resXP').textContent = session.xp;
  document.getElementById('resAccuracy').textContent = accuracy + '%';

  if (accuracy >= 80) launchConfetti();
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
    btnNextEx.addEventListener('click', () => {
      window.location.href = nextEx.href;
    });
    btnNextEx.textContent = 'Exercice suivant : ' + nextEx.name;
  } else {
    btnNextEx.style.display = 'none';
  }

  document.getElementById('btnNext').addEventListener('click', nextEmail);
  document.getElementById('btnRestart').addEventListener('click', startSession);

  // Raccourcis clavier : 1-4 pour choisir, Entrée pour passer au prochain e-mail.
  document.addEventListener('keydown', e => {
    if (e.target && e.target.tagName === 'INPUT') return;
    const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
    if (!session.answered && Object.prototype.hasOwnProperty.call(map, e.key)) {
      answer(map[e.key]);
      return;
    }
    if (e.key === 'Enter' && session.answered) nextEmail();
  });

  startSession();
});
