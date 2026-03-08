'use strict';

const PAGE_ID = 'formulaire';
const CASES = Array.isArray(window.FORMULAIRE_DATA) ? window.FORMULAIRE_DATA : [];

let session = {
  items: [],
  index: 0,
  correct: 0,
  errors: 0,
  typed: 0,
  xp: 0,
  answered: false,
  hintsUsed: 0
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

function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function splitSkillInput(text) {
  return normalize(text)
    .split(/[,;/]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function isSkillMatch(inputSkill, allowedSkill) {
  return (
    inputSkill === allowedSkill ||
    allowedSkill.startsWith(`${inputSkill} `) ||
    inputSkill.startsWith(`${allowedSkill} `)
  );
}

function isSkillsFieldCorrect(actualRaw, round) {
  const allowed = ((round && round.profile && round.profile.skills) || [])
    .map((skill) => normalize(skill))
    .filter((skill) => skill.length > 0);

  const entered = splitSkillInput(actualRaw);
  if (!allowed.length || !entered.length) return false;

  return entered.every((skill) => allowed.some((allowedSkill) => isSkillMatch(skill, allowedSkill)));
}

function isFieldCorrect(field, actualRaw, round) {
  if (field && field.name === 'skills') return isSkillsFieldCorrect(actualRaw, round);
  return normalize(actualRaw) === normalize(field.expected);
}

function expectedValueForField(field, round) {
  if (field && field.name === 'skills') {
    const allSkills = (round && round.profile && Array.isArray(round.profile.skills)) ? round.profile.skills : [];
    return allSkills.join(', ');
  }
  return field.expected;
}

function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  };
}

function getRoundTag(round) {
  return round && round.tag ? round.tag : 'Candidature';
}

function profileRows(round) {
  const p = round.profile || {};
  return [
    ['Nom', p.name || ''],
    ['Age', p.age ? `${p.age} ans` : ''],
    ['E-mail', p.email || ''],
    ['Téléphone', p.phone || ''],
    ['Adresse', p.address || ''],
    ['Formation', p.education || ''],
    ['Expérience', p.experience || ''],
    ['Compétences', Array.isArray(p.skills) ? p.skills.join(', ') : '']
  ].filter(([, value]) => String(value).trim() !== '');
}

function startSession() {
  if (!CASES.length) {
    showToast('Aucun profil disponible.', 'error');
    return;
  }

  session = {
    items: shuffle(CASES),
    index: 0,
    correct: 0,
    errors: 0,
    typed: 0,
    xp: 0,
    answered: false,
    hintsUsed: 0
  };

  const resultZone = document.getElementById('resultZone');
  const gameZone = document.getElementById('gameZone');
  if (resultZone) resultZone.classList.add('hidden');
  if (gameZone) gameZone.classList.remove('hidden');

  renderRound();
}

function renderRound() {
  const round = session.items[session.index];
  if (!round) return;

  session.answered = false;

  document.getElementById('roundNum').textContent = String(session.index + 1);
  document.getElementById('roundTotal').textContent = String(session.items.length);
  document.getElementById('roundTag').textContent = getRoundTag(round);
  document.getElementById('profileTitle').textContent = `Profil: ${(round.profile && round.profile.name) || 'Candidat'}`;
  document.getElementById('profileIntro').textContent = 'Lisez les informations puis remplissez le formulaire avec précision.';
  document.getElementById('formTitle').textContent = 'Formulaire de candidature';
  document.getElementById('formIntro').textContent = 'Tous les champs doivent correspondre aux données du profil.';

  const profileList = document.getElementById('profileList');
  const rows = profileRows(round);
  profileList.innerHTML = rows.map(([label, value]) => `<li><strong>${escapeHTML(label)}:</strong> ${escapeHTML(value)}</li>`).join('');

  const fields = (round.form && Array.isArray(round.form.fields)) ? round.form.fields : [];
  const names = splitName(round.profile && round.profile.name);

  const formFields = document.getElementById('formFields');
  formFields.innerHTML = '';

  fields.forEach((field) => {
    const wrap = document.createElement('div');
    wrap.className = 'form-field';

    const label = document.createElement('label');
    label.setAttribute('for', `field-${field.name}`);
    label.textContent = field.label || field.name;

    const input = document.createElement('input');
    input.className = 'form-input';
    input.id = `field-${field.name}`;
    input.name = field.name;
    input.type = field.type || 'text';
    input.autocomplete = 'off';

    if (field.name === 'firstName') input.placeholder = names.firstName || 'Prénom';
    if (field.name === 'lastName') input.placeholder = names.lastName || 'Nom';

    input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      input.style.borderColor = '';
      input.style.boxShadow = '';
    });

    wrap.appendChild(label);
    wrap.appendChild(input);
    formFields.appendChild(wrap);
  });

  const feedback = document.getElementById('formFeedback');
  feedback.innerHTML = 'Remplissez le formulaire puis cliquez sur Vérifier.';

  const btnValidate = document.getElementById('btnValidate');
  btnValidate.disabled = false;

  const btnNext = document.getElementById('btnNext');
  btnNext.style.display = 'none';
  btnNext.textContent = session.index < session.items.length - 1 ? 'Suivant' : 'Terminer';

  const progress = Math.round((session.index / session.items.length) * 100);
  document.getElementById('progressFill').style.width = `${progress}%`;
  updateKPIs();
}

function validateRound() {
  if (session.answered) return;

  const round = session.items[session.index];
  if (!round) return;

  const fields = (round.form && Array.isArray(round.form.fields)) ? round.form.fields : [];
  if (!fields.length) return;

  let okCount = 0;
  let wrongCount = 0;
  const messages = [];

  fields.forEach((field) => {
    const input = document.getElementById(`field-${field.name}`);
    if (!input) return;

    const actualRaw = input.value;
    const expectedRaw = expectedValueForField(field, round);
    const isOk = isFieldCorrect(field, actualRaw, round);

    if (isOk) {
      okCount += 1;
      input.setAttribute('aria-invalid', 'false');
      input.style.borderColor = 'var(--success)';
      input.style.boxShadow = '0 0 0 3px rgba(52, 211, 153, 0.12)';
      messages.push(`<div class="feedback-item success">✓ ${escapeHTML(field.label)} correct.</div>`);
    } else {
      wrongCount += 1;
      input.setAttribute('aria-invalid', 'true');
      input.style.borderColor = 'var(--danger)';
      input.style.boxShadow = '0 0 0 3px rgba(248, 113, 113, 0.12)';
      messages.push(`<div class="feedback-item error">✗ ${escapeHTML(field.label)}: attendu "${escapeHTML(expectedRaw)}".</div>`);
    }

    input.readOnly = true;
  });

  session.answered = true;
  session.typed += 1;

  const isRoundCorrect = wrongCount === 0;
  if (isRoundCorrect) {
    session.correct += 1;
    session.xp += 3;
    recordExerciseProgress(PAGE_ID, { correct: 1, typed: 1, errors: 0, xp: 3 });
  } else {
    session.errors += 1;
    session.xp += okCount;
    recordExerciseProgress(PAGE_ID, { correct: 0, typed: 1, errors: 1, xp: okCount });
  }

  const feedback = document.getElementById('formFeedback');
  const summary = isRoundCorrect
    ? '<div class="feedback-item success">Formulaire valide. Excellent travail.</div>'
    : `<div class="feedback-item error">${wrongCount} erreur(s) à corriger sur ce formulaire.</div>`;

  feedback.innerHTML = summary + messages.join('');

  const btnValidate = document.getElementById('btnValidate');
  const btnNext = document.getElementById('btnNext');

  btnValidate.disabled = true;
  btnNext.style.display = 'inline-flex';
  btnNext.textContent = session.index < session.items.length - 1 ? 'Suivant' : 'Terminer';

  updateKPIs();
}

function showHint() {
  if (session.answered) return;

  const round = session.items[session.index];
  if (!round) return;

  const fields = (round.form && Array.isArray(round.form.fields)) ? round.form.fields : [];
  const pending = fields.filter((field) => {
    const input = document.getElementById(`field-${field.name}`);
    return input && !isFieldCorrect(field, input.value, round);
  });

  if (!pending.length) {
    showToast('Tous les champs semblent corrects.', 'success');
    return;
  }

  const target = pending[Math.floor(Math.random() * pending.length)];
  const preview = String(expectedValueForField(target, round) || '').slice(0, 3);
  const feedback = document.getElementById('formFeedback');
  feedback.innerHTML = `<div class="feedback-item">Indice: le champ <strong>${escapeHTML(target.label)}</strong> commence par <strong>${escapeHTML(preview)}</strong>.</div>`;

  session.hintsUsed += 1;
}

function nextRound() {
  if (!session.answered) {
    showToast('Validez d’abord le formulaire.', 'info');
    return;
  }

  session.index += 1;
  if (session.index >= session.items.length) {
    finishSession();
    return;
  }

  renderRound();
}

function finishSession() {
  promoteExerciseStatus(PAGE_ID, 'completed');

  const gameZone = document.getElementById('gameZone');
  const resultZone = document.getElementById('resultZone');
  if (gameZone) gameZone.classList.add('hidden');
  if (resultZone) resultZone.classList.remove('hidden');

  document.getElementById('progressFill').style.width = '100%';

  const accuracy = calcAccuracy(session.correct, session.typed);
  document.getElementById('resEmoji').textContent = accuracy >= 80 ? '🏆' : '📝';
  document.getElementById('resTitle').textContent = accuracy >= 80 ? 'Très bon travail' : 'Continuez';
  document.getElementById('resSubtitle').textContent = `${session.correct} formulaire(s) juste(s) sur ${session.items.length}.`;

  document.getElementById('resCorrect').textContent = String(session.correct);
  document.getElementById('resErrors').textContent = String(session.errors);
  document.getElementById('resXP').textContent = String(session.xp);
  document.getElementById('resAccuracy').textContent = `${accuracy}%`;
}

function updateKPIs() {
  const total = session.items.length || 1;
  const progress = Math.round((session.index / total) * 100);

  document.getElementById('kpiCorrect').textContent = String(session.correct);
  document.getElementById('kpiErrors').textContent = String(session.errors);
  document.getElementById('kpiXP').textContent = String(session.xp);
  document.getElementById('kpiProgress').textContent = `${progress}%`;
}

document.addEventListener('DOMContentLoaded', () => {
  const btnNextEx = document.getElementById('btnNextExercise');
  const nextEx = getNextExercise(PAGE_ID);
  if (nextEx && nextEx.name && nextEx.href) {
    btnNextEx.textContent = `Exercice suivant : ${nextEx.name}`;
    btnNextEx.addEventListener('click', () => {
      window.location.href = nextEx.href;
    });
  } else {
    btnNextEx.style.display = 'none';
  }

  document.getElementById('btnHint').addEventListener('click', showHint);
  document.getElementById('btnValidate').addEventListener('click', validateRound);
  document.getElementById('btnNext').addEventListener('click', nextRound);
  document.getElementById('btnRestart').addEventListener('click', startSession);

  document.addEventListener('keydown', (event) => {
    const tag = event.target && event.target.tagName;

    if (event.key === 'Enter' && tag === 'INPUT' && !session.answered) {
      event.preventDefault();
      validateRound();
      return;
    }

    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (event.key.toLowerCase() === 'h') showHint();
    if (event.key === 'Enter' && session.answered) nextRound();
  });

  startSession();
});
