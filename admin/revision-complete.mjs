#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const GAMES_DIR = path.join(ROOT_DIR, 'games');
const JS_DIR = path.join(ROOT_DIR, 'js');
const CONFIG_PATH = path.join(JS_DIR, 'exercises-config.js');

const report = {
  errors: [],
  warnings: [],
  infos: []
};

function rel(filePath) {
  return path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
}

function addError(message) {
  report.errors.push(message);
}

function addWarning(message) {
  report.warnings.push(message);
}

function addInfo(message) {
  report.infos.push(message);
}

function listFilesRecursive(rootDir, matcher) {
  const out = [];
  const stack = [rootDir];
  const ignoredDirs = new Set(['.git', 'node_modules']);

  while (stack.length > 0) {
    const current = stack.pop();
    if (!fs.existsSync(current)) continue;

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name)) stack.push(fullPath);
        continue;
      }
      if (!matcher || matcher(fullPath)) out.push(fullPath);
    }
  }

  return out;
}

function loadExerciseConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    addError(`Fichier introuvable: ${rel(CONFIG_PATH)}`);
    return null;
  }

  try {
    const source = fs.readFileSync(CONFIG_PATH, 'utf8').replace(/^\uFEFF/, '');
    const context = { window: {} };
    vm.createContext(context);
    vm.runInContext(source, context, { filename: CONFIG_PATH });
    const config = context.window.EXERCISE_CONFIG;
    if (!config || typeof config !== 'object') {
      addError(`Configuration invalide dans ${rel(CONFIG_PATH)}`);
      return null;
    }
    return config;
  } catch (error) {
    addError(`Lecture config impossible: ${error.message}`);
    return null;
  }
}

function checkExerciseConfig(config) {
  const orderedPages = Array.isArray(config.orderedPages) ? config.orderedPages : [];
  const nonOrderedPages = Array.isArray(config.nonOrderedPages) ? config.nonOrderedPages : [];
  const nonOrderedSet = new Set(nonOrderedPages);
  const meta = config.meta && typeof config.meta === 'object' ? config.meta : {};
  const bonus = Array.isArray(config.bonusExercises) ? config.bonusExercises : [];
  const xpByPage = config.xpRules && config.xpRules.byPage ? config.xpRules.byPage : {};

  if (orderedPages.length === 0) {
    addError('orderedPages est vide.');
    return;
  }

  const duplicates = orderedPages.filter((page, index) => orderedPages.indexOf(page) !== index);
  if (duplicates.length > 0) {
    addError(`Doublons dans orderedPages: ${[...new Set(duplicates)].join(', ')}`);
  }

  for (const page of orderedPages) {
    if (!meta[page]) addError(`Meta manquante pour "${page}".`);
  }

  for (const page of Object.keys(meta)) {
    if (!orderedPages.includes(page) && !nonOrderedSet.has(page)) {
      addWarning(`Meta non referencee dans orderedPages: "${page}".`);
    }
  }

  for (const page of orderedPages) {
    const href = meta[page] && meta[page].href ? meta[page].href : `${page}.html`;
    const target = path.join(GAMES_DIR, href);
    if (!fs.existsSync(target)) {
      addError(`Page HTML manquante pour "${page}": games/${href}`);
    }
  }

  for (const entry of bonus) {
    if (!entry || !entry.page) continue;
    if (!meta[entry.page]) addWarning(`Bonus sans meta: "${entry.page}".`);
  }

  for (const page of orderedPages) {
    if (!xpByPage[page]) addWarning(`Regle XP manquante pour "${page}".`);
  }
}

function checkHtmlReferences() {
  const htmlFiles = listFilesRecursive(GAMES_DIR, (file) => file.toLowerCase().endsWith('.html'));
  const assetRegex = /\b(?:src|href)=["']([^"']+)["']/g;

  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    let match;
    while ((match = assetRegex.exec(content)) !== null) {
      const refPath = match[1].trim();
      if (
        !refPath ||
        refPath.includes('${') ||
        refPath.startsWith('#') ||
        /^(https?:|mailto:|tel:|data:|javascript:)/i.test(refPath)
      ) {
        continue;
      }

      const resolved = path.resolve(path.dirname(htmlFile), refPath);
      if (!fs.existsSync(resolved)) {
        addError(`Reference manquante dans ${rel(htmlFile)}: ${refPath}`);
      }
    }
  }
}

function checkJsSyntax() {
  const jsFiles = listFilesRecursive(JS_DIR, (file) => file.toLowerCase().endsWith('.js'));

  for (const jsFile of jsFiles) {
    try {
      const source = fs.readFileSync(jsFile, 'utf8').replace(/^\uFEFF/, '');
      new vm.Script(source, { filename: jsFile });
    } catch (error) {
      const details = (error && error.message) ? error.message.split(/\r?\n/)[0] : 'Erreur de syntaxe JS';
      addError(`Syntaxe invalide (${rel(jsFile)}): ${details}`);
    }
  }

  addInfo(`Verification syntaxe JS: ${jsFiles.length} fichier(s) controle(s).`);
}

function checkSuspiciousEncoding() {
  const textExtensions = new Set(['.js', '.css', '.html', '.md']);
  const suspiciousPattern = /Ã.|Â.|â€|â€“|â€”|â€™|â€œ|â€¢|�/;
  const ignoredFiles = new Set(['js/data/ch-fr-keymap.js']);

  const files = listFilesRecursive(ROOT_DIR, (file) => {
    const ext = path.extname(file).toLowerCase();
    if (!textExtensions.has(ext)) return false;
    const normalized = rel(file);
    if (normalized.startsWith('.git/')) return false;
    return !ignoredFiles.has(normalized);
  });

  const badFiles = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (suspiciousPattern.test(text)) badFiles.push(rel(file));
  }

  if (badFiles.length > 0) {
    addWarning(`Encodage suspect detecte dans ${badFiles.length} fichier(s): ${badFiles.slice(0, 6).join(', ')}${badFiles.length > 6 ? ', ...' : ''}`);
  } else {
    addInfo('Aucun artefact d encodage detecte (hors fichiers ignores).');
  }
}

function checkJunkFiles() {
  const junkPatterns = [
    /(^|\/)\.DS_Store$/i,
    /(^|\/)Thumbs\.db$/i,
    /\.bak$/i,
    /\.tmp$/i
  ];

  const files = listFilesRecursive(ROOT_DIR, (file) => {
    const normalized = rel(file);
    if (normalized.startsWith('.git/')) return false;
    return true;
  });

  const junk = files
    .map((file) => rel(file))
    .filter((file) => junkPatterns.some((pattern) => pattern.test(file)));

  if (junk.length > 0) {
    addWarning(`Fichiers parasites detectes: ${junk.join(', ')}`);
  } else {
    addInfo('Aucun fichier parasite detecte.');
  }
}

function printList(title, items) {
  if (items.length === 0) return;
  console.log(`\n${title}`);
  for (const item of items) {
    console.log(`- ${item}`);
  }
}

function main() {
  console.log('=== Revision Complete du Dossier ===');
  console.log(`Racine: ${ROOT_DIR}`);

  const config = loadExerciseConfig();
  if (config) checkExerciseConfig(config);
  checkHtmlReferences();
  checkJsSyntax();
  checkSuspiciousEncoding();
  checkJunkFiles();

  printList('Erreurs', report.errors);
  printList('Avertissements', report.warnings);
  printList('Infos', report.infos);

  const status = report.errors.length === 0 ? 'OK' : 'ECHEC';
  console.log(`\nResultat: ${status}`);
  console.log(`- erreurs: ${report.errors.length}`);
  console.log(`- avertissements: ${report.warnings.length}`);
  console.log(`- infos: ${report.infos.length}`);

  if (report.errors.length > 0) process.exitCode = 1;
}

main();
