/**
 * ch-fr-keymap.js
 * Mapping clavier suisse français (CH-FR, QWERTZ) → frappes exactes
 *
 * Chaque entrée décrit comment produire le caractère sur un clavier CH-FR réel.
 * Format d'une entrée :
 *
 *   'X': { sequence: [ step, step, … ] }
 *
 * Un step peut être :
 *   { key: 'a',   type: 'normal',  label: 'a'              }  → touche simple
 *   { key: 'a',   type: 'shift',   label: 'Maj + a'        }  → Shift + touche
 *   { key: 'a',   type: 'altgr',   label: 'AltGr + a'      }  → AltGr + touche
 *   { key: '^',   type: 'dead',    label: '^ (touche morte)' } → touche morte
 *   { key: 'a',   type: 'normal',  label: 'a'              }  → lettre après mort
 *
 * Convention :
 *   - `key`   : la touche physique (valeur en bas sans modificateur)
 *   - `type`  : 'normal' | 'shift' | 'altgr' | 'dead'
 *   - `label` : texte pédagogique affiché à l'apprenant
 *
 * Touches mortes CH-FR :
 *   ^ (accent circonflexe)  → touche physique "^" (à droite de P, sans Shift)
 *   ¨ (tréma)               → touche physique "^" + Shift  (= "¨")
 *   ´ (accent aigu)         → touche physique "´" (à droite de Ü, sans Shift)
 *   ` (accent grave)        → touche physique "^" dans la rangée des chiffres
 *                             OU "´" + Shift selon clavier physique
 *   ~ (tilde)               → AltGr + ^ (ou AltGr + n sur certains claviers)
 *
 * Note : sur le clavier CH-FR standard :
 *   - La touche à gauche de Entrée (row 2, dernière)   = ´  /  !
 *   - La touche en dessous (row 3, avant Entrée)       = £  /  $   (non-morte)
 *   - La touche QWERTY-[  = è / ü  (CH-FR)
 *   - La touche QWERTY-'  = à / ä  (CH-FR)
 *   - La touche QWERTY-;  = é / ö  (CH-FR)
 *   Ces trois lettres (é, è, à) sont des TOUCHES DIRECTES sur CH-FR.
 */

'use strict';

window.CH_FR_KEYMAP = (function () {

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /** Touche simple */
  function normal(key, label) {
    return { key, type: 'normal', label: label || key };
  }

  /** Shift + touche */
  function shift(key, label) {
    return { key, type: 'shift', label: label || ('Maj + ' + key) };
  }

  /** AltGr + touche */
  function altgr(key, label) {
    return { key, type: 'altgr', label: label || ('AltGr + ' + key) };
  }

  /** Touche morte (ne produit rien seule, attend la frappe suivante) */
  function dead(key, label) {
    return { key, type: 'dead', label: label || (key + ' (touche morte)') };
  }

  // ─── Séquences réutilisables (touches mortes + lettre) ─────────────────────

  // ^ mort (sans Shift) + lettre
  function deadCirc(letter) {
    return [
      dead('^', '^ (accent circonflexe – touche morte)'),
      normal(letter, letter),
    ];
  }

  // ¨ mort (Shift + ^) + lettre
  function deadUmlaut(letter) {
    return [
      shift('^', 'Maj + ^ (tréma – touche morte)'),
      normal(letter, letter),
    ];
  }

  // ´ mort (sans Shift, touche à droite de è/ü) + lettre
  function deadAcute(letter) {
    return [
      dead('´', '´ (accent aigu – touche morte)'),
      normal(letter, letter),
    ];
  }

  // ` mort (Shift + ´) + lettre
  function deadGrave(letter) {
    return [
      shift('´', 'Maj + ´ (accent grave – touche morte)'),
      normal(letter, letter),
    ];
  }

  // ~ mort (AltGr + ^) + lettre
  function deadTilde(letter) {
    return [
      altgr('^', 'AltGr + ^ (tilde – touche morte)'),
      normal(letter, letter),
    ];
  }

  // ─── Table de mapping ──────────────────────────────────────────────────────

  const MAP = {};

  // ── Lettres minuscules (QWERTZ CH-FR) ──────────────────────────────────────
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => {
    MAP[c] = { sequence: [normal(c, c)] };
  });
  // Sur CH-FR QWERTZ, y et z sont inversés par rapport à QWERTY :
  //   la touche physique "z" produit 'z', "y" produit 'y' (géré ci-dessus)
  // (Le remapping QWERTY↔QWERTZ est géré par l'OS – le label suffit.)

  // ── Lettres majuscules ──────────────────────────────────────────────────────
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(c => {
    MAP[c] = { sequence: [shift(c.toLowerCase(), 'Maj + ' + c.toLowerCase())] };
  });

  // ── Chiffres (rangée du haut, sans Shift) ───────────────────────────────────
  '0123456789'.split('').forEach(c => {
    MAP[c] = { sequence: [normal(c, c)] };
  });

  // ── Caractères Shift + chiffre (rangée du haut) ─────────────────────────────
  // Touche 1 → + (Shift+1)  mais la touche "+" existe aussi directement
  Object.assign(MAP, {
    '+':  { sequence: [shift('1', 'Maj + 1')] },
    '"':  { sequence: [shift('2', 'Maj + 2')] },
    '*':  { sequence: [shift('3', 'Maj + 3')] },
    'ç':  { sequence: [shift('4', 'Maj + 4')] },
    '%':  { sequence: [shift('5', 'Maj + 5')] },
    '&':  { sequence: [shift('6', 'Maj + 6')] },
    '/':  { sequence: [shift('7', 'Maj + 7')] },
    '(':  { sequence: [shift('8', 'Maj + 8')] },
    ')':  { sequence: [shift('9', 'Maj + 9')] },
    '=':  { sequence: [shift('0', 'Maj + 0')] },
    '?':  { sequence: [shift("'", "Maj + '")] },
    '`':  { sequence: [shift('^', 'Maj + ^ (rangée chiffres, 1re position)')] },
    // Note: '`' ici est le caractère littéral backtick comme touche morte
    //       Si vous voulez insérer ` directement, c'est sur la touche ° / §
  });

  // ── Lettres spéciales directes (sans modificateur) ─────────────────────────
  // Sur CH-FR, é, è, à sont des touches directes.
  Object.assign(MAP, {
    'é': { sequence: [normal('é', 'é (touche directe)')] },
    'è': { sequence: [normal('è', 'è (touche directe)')] },
    'à': { sequence: [normal('à', 'à (touche directe)')] },
    'ü': { sequence: [shift('è', 'Maj + è → ü')] },
    'ö': { sequence: [shift('é', 'Maj + é → ö')] },
    'ä': { sequence: [shift('à', 'Maj + à → ä')] },
    'É': { sequence: [shift('é', 'Maj + é → É')] },
    'È': { sequence: [shift('è', 'Maj + è → È')] },
    'À': { sequence: [shift('à', 'Maj + à → À')] },
    'Ü': { sequence: [shift('è', 'Maj + è → Ü')] },
    'Ö': { sequence: [shift('é', 'Maj + é → Ö')] },
    'Ä': { sequence: [shift('à', 'Maj + à → Ä')] },
  });

  // ── Accent circonflexe ( ^ ) – touche morte + voyelle ──────────────────────
  // La touche ^ est à droite de P (rangée 2), sans Shift
  Object.assign(MAP, {
    'â': { sequence: deadCirc('a') },
    'ê': { sequence: deadCirc('e') },
    'î': { sequence: deadCirc('i') },
    'ô': { sequence: deadCirc('o') },
    'û': { sequence: deadCirc('u') },
    'Â': { sequence: [dead('^', '^ (accent circonflexe – touche morte)'), shift('a', 'Maj + a')] },
    'Ê': { sequence: [dead('^', '^ (accent circonflexe – touche morte)'), shift('e', 'Maj + e')] },
    'Î': { sequence: [dead('^', '^ (accent circonflexe – touche morte)'), shift('i', 'Maj + i')] },
    'Ô': { sequence: [dead('^', '^ (accent circonflexe – touche morte)'), shift('o', 'Maj + o')] },
    'Û': { sequence: [dead('^', '^ (accent circonflexe – touche morte)'), shift('u', 'Maj + u')] },
  });

  // ── Tréma ( ¨ ) – Shift + ^ (touche morte) + voyelle ──────────────────────
  Object.assign(MAP, {
    'ë': { sequence: deadUmlaut('e') },
    'ï': { sequence: deadUmlaut('i') },
    'ÿ': { sequence: deadUmlaut('y') },
    // ä, ö, ü ont leurs propres touches directes sur CH-FR (voir ci-dessus),
    // mais peuvent aussi être produits via tréma :
    // 'ä': deadUmlaut('a')  ← doublon, on garde la version touche directe
    'Ë': { sequence: [shift('^', 'Maj + ^ (tréma – touche morte)'), shift('e', 'Maj + e')] },
    'Ï': { sequence: [shift('^', 'Maj + ^ (tréma – touche morte)'), shift('i', 'Maj + i')] },
  });

  // ── Accent aigu ( ´ ) – touche morte + voyelle ─────────────────────────────
  // Sur CH-FR, la touche "´" est à droite de la touche è/ü (rangée 2, avant Entrée)
  Object.assign(MAP, {
    'á': { sequence: deadAcute('a') },
    'í': { sequence: deadAcute('i') },
    'ó': { sequence: deadAcute('o') },
    'ú': { sequence: deadAcute('u') },
    'ý': { sequence: deadAcute('y') },
    'Á': { sequence: [dead('´', '´ (accent aigu – touche morte)'), shift('a', 'Maj + a')] },
    'Í': { sequence: [dead('´', '´ (accent aigu – touche morte)'), shift('i', 'Maj + i')] },
    'Ó': { sequence: [dead('´', '´ (accent aigu – touche morte)'), shift('o', 'Maj + o')] },
    'Ú': { sequence: [dead('´', '´ (accent aigu – touche morte)'), shift('u', 'Maj + u')] },
    'Ý': { sequence: [dead('´', '´ (accent aigu – touche morte)'), shift('y', 'Maj + y')] },
  });

  // ── Accent grave ( ` ) – Shift + ´ (touche morte) + voyelle ───────────────
  Object.assign(MAP, {
    'ù': { sequence: deadGrave('u') },
    // à a une touche directe sur CH-FR ; doublon omis
    'Ù': { sequence: [shift('´', 'Maj + ´ (accent grave – touche morte)'), shift('u', 'Maj + u')] },
  });

  // ── Tilde ( ~ ) – AltGr + ^ (touche morte) + voyelle ──────────────────────
  Object.assign(MAP, {
    'ã': { sequence: deadTilde('a') },
    'õ': { sequence: deadTilde('o') },
    'ñ': { sequence: deadTilde('n') },
    'Ã': { sequence: [altgr('^', 'AltGr + ^ (tilde – touche morte)'), shift('a', 'Maj + a')] },
    'Õ': { sequence: [altgr('^', 'AltGr + ^ (tilde – touche morte)'), shift('o', 'Maj + o')] },
    'Ñ': { sequence: [altgr('^', 'AltGr + ^ (tilde – touche morte)'), shift('n', 'Maj + n')] },
  });

  // ── Symboles ponctuation directs ────────────────────────────────────────────
  Object.assign(MAP, {
    '.':  { sequence: [normal('.', '.')] },
    ',':  { sequence: [normal(',', ',')] },
    '-':  { sequence: [normal('-', '-')] },
    '_':  { sequence: [shift('-', 'Maj + -')] },
    ':':  { sequence: [shift('.', 'Maj + .')] },
    ';':  { sequence: [shift(',', 'Maj + ,')] },
    '!':  { sequence: [shift('´', 'Maj + ´')] },
    "'":  { sequence: [normal("'", "' (apostrophe)")] },
    '’':  { sequence: [normal("'", "' (apostrophe typographique)")] },
    '<':  { sequence: [normal('<', '<')] },
    '>':  { sequence: [shift('<', 'Maj + <')] },
    '$':  { sequence: [normal('$', '$')] },
    '£':  { sequence: [shift('$', 'Maj + $')] },
    '°':  { sequence: [normal('°', '°')] },
    '§':  { sequence: [shift('°', 'Maj + °')] },
  });

  // ── Caractères AltGr ────────────────────────────────────────────────────────
  Object.assign(MAP, {
    '@':  { sequence: [altgr('2', 'AltGr + 2')] },
    '#':  { sequence: [altgr('3', 'AltGr + 3')] },
    '¼':  { sequence: [altgr('4', 'AltGr + 4')] },
    '½':  { sequence: [altgr('5', 'AltGr + 5')] },
    '¬':  { sequence: [altgr('6', 'AltGr + 6')] },
    '|':  { sequence: [altgr('7', 'AltGr + 7')] },
    '¢':  { sequence: [altgr('8', 'AltGr + 8')] },
    '´':  { sequence: [altgr('9', 'AltGr + 9')] },  // accent aigu visible (non-mort)
    '`':  { sequence: [altgr('°', 'AltGr + °')] },  // backtick
    '[':  { sequence: [altgr('è', 'AltGr + è')] },
    ']':  { sequence: [altgr('´', 'AltGr + ´')] },  // (position clavier)
    '{':  { sequence: [altgr('à', 'AltGr + à')] },
    '}':  { sequence: [altgr('$', 'AltGr + $')] },
    '\\': { sequence: [altgr('<', 'AltGr + <')] },
    '~':  { sequence: [altgr('^', 'AltGr + ^')] },  // tilde direct (non-mort)
    '€':  { sequence: [altgr('e', 'AltGr + e')] },
    'æ':  { sequence: [altgr('a', 'AltGr + a')] },
    'œ':  { sequence: [altgr('o', 'AltGr + o')] },
  });

  // ── Espace et touches spéciales ─────────────────────────────────────────────
  Object.assign(MAP, {
    ' ':  { sequence: [normal(' ', 'Espace')] },
    '\n': { sequence: [normal('Enter', 'Entrée')] },
    '\t': { sequence: [normal('Tab', 'Tab')] },
  });

  // ─── API publique ──────────────────────────────────────────────────────────

  /**
   * Retourne les informations de frappe pour un caractère donné.
   * @param {string} char – le caractère à produire (longueur 1)
   * @returns {{ sequence: Array }|null}
   *   null si le caractère n'est pas dans le mapping.
   */
  function lookup(char) {
    return MAP[char] || null;
  }

  /**
   * Génère un texte pédagogique court pour un caractère donné.
   * Ex : "Maj + ^ (accent circonflexe) puis a"
   * @param {string} char
   * @returns {string}
   */
  function describe(char) {
    const entry = lookup(char);
    if (!entry) return char + ' (non mappé)';
    if (entry.sequence.length === 1) return entry.sequence[0].label;
    return entry.sequence.map(s => s.label).join(' → puis → ');
  }

  /**
   * Retourne les types de modificateurs nécessaires.
   * @param {string} char
   * @returns {{ needsShift: boolean, needsAltGr: boolean, needsDead: boolean }}
   */
  function modifiers(char) {
    const entry = lookup(char);
    if (!entry) return { needsShift: false, needsAltGr: false, needsDead: false };
    const types = entry.sequence.map(s => s.type);
    return {
      needsShift:  types.includes('shift'),
      needsAltGr:  types.includes('altgr'),
      needsDead:   types.includes('dead'),
    };
  }

  /**
   * Surligne les touches virtuelles correspondant à un caractère.
   * Appelable à chaque nouveau caractère attendu.
   *
   * @param {string} char – le caractère attendu
   * @param {Element} [keyboardEl] – conteneur #virtual-keyboard (optionnel)
   */
  function highlightKeys(char, keyboardEl) {
    const kb = keyboardEl || document.getElementById('virtual-keyboard');
    if (!kb) return;

    // Nettoyer les surlignages précédents
    kb.querySelectorAll('.key').forEach(k => {
      k.classList.remove('highlight', 'highlight-shift', 'highlight-altgr', 'highlight-dead');
    });

    const hintEl = document.getElementById('shift-hint');
    if (hintEl) hintEl.textContent = '';

    const entry = lookup(char);
    if (!entry) return;

    const steps = entry.sequence;

    // Surligner selon le premier step (la vraie touche à presser maintenant)
    // Si c'est une séquence (touche morte), on surligne l'étape 1 d'abord
    const firstStep = steps[0];

    // Surligner la touche physique
    kb.querySelectorAll('.key').forEach(k => {
      const dk = (k.dataset.key || '').toLowerCase();
      const ds = (k.dataset.shift || '').toLowerCase();
      const da = (k.dataset.altgr || '').toLowerCase();
      const fk = firstStep.key.toLowerCase();

      let match = false;
      if (firstStep.type === 'normal' && dk === fk) match = true;
      if (firstStep.type === 'shift'  && (dk === fk || ds === fk)) match = true;
      if (firstStep.type === 'altgr'  && (dk === fk || da === fk)) match = true;
      if (firstStep.type === 'dead'   && dk === fk) match = true;

      // Espace
      if (firstStep.key === ' ' && dk === ' ') match = true;

      if (match) {
        k.classList.add('highlight');
        if (firstStep.type === 'dead') k.classList.add('highlight-dead');
      }
    });

    // Surligner Shift si nécessaire
    if (firstStep.type === 'shift') {
      kb.querySelectorAll('.key[data-key="Shift"]').forEach(k => k.classList.add('highlight', 'highlight-shift'));
    }

    // Surligner AltGr si nécessaire
    if (firstStep.type === 'altgr') {
      kb.querySelectorAll('.key[data-key="AltGr"], .key').forEach(k => {
        if ((k.dataset.key || '').toLowerCase() === 'altgr' ||
            (k.textContent || '').trim().toLowerCase() === 'alt gr') {
          k.classList.add('highlight', 'highlight-altgr');
        }
      });
    }

    // Afficher le texte pédagogique
    if (hintEl) {
      hintEl.textContent = describe(char);
    }
  }

  // ─── Export ────────────────────────────────────────────────────────────────
  return { lookup, describe, modifiers, highlightKeys, _map: MAP };

})();


/* ─────────────────────────────────────────────────────────────────────────────
 * EXEMPLE D'UTILISATION (à coller dans la console ou dans clavier.html)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  // 1) Décrire comment taper 'Â'
 *  console.log(CH_FR_KEYMAP.describe('Â'));
 *  // → "^ (accent circonflexe – touche morte) → puis → Maj + a"
 *
 *  // 2) Savoir si Shift est nécessaire
 *  console.log(CH_FR_KEYMAP.modifiers('ê'));
 *  // → { needsShift: false, needsAltGr: false, needsDead: true }
 *
 *  // 3) Surligner les touches dans le clavier virtuel
 *  //    (appelé automatiquement dans clavier.html à chaque nouveau caractère)
 *  CH_FR_KEYMAP.highlightKeys('€');
 *  // → surligne la touche 'e' et la touche 'AltGr' en bleu
 *
 *  // 4) Accéder à la séquence brute
 *  console.log(CH_FR_KEYMAP.lookup('ñ'));
 *  // → {
 *  //     sequence: [
 *  //       { key: '^', type: 'altgr', label: 'AltGr + ^ (tilde – touche morte)' },
 *  //       { key: 'n', type: 'normal', label: 'n' }
 *  //     ]
 *  //   }
 * ─────────────────────────────────────────────────────────────────────────────
 */
