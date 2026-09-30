#!/usr/bin/env node
// scripts/token-audit.js
//
// Détecte les couleurs hexadécimales codées en dur dans les CSS Modules
// (packages/react/src, packages/storybook/src), hors fallback
// `var(--token, #hex)` qui est un usage légitime.
//
// Portée volontairement limitée aux couleurs : un audit des valeurs px aurait
// une vingtaine de faux positifs sans rapport (border-width, line-height,
// offsets de calc()/transform, bleed -1px) qui n'ont pas d'équivalent dans les
// catégories de tokens existantes (color, typography, spacing, border-radius,
// sizing, elevation) — voir specs/foundations/. Les couleurs, elles, ont
// quasiment toujours un token correspondant : une seule exception existe
// aujourd'hui dans tout le repo (contenu illustratif bespoke), via le
// mécanisme d'exception ci-dessous.

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const repoRoot = join(import.meta.dirname, '..');
const SCAN_DIRS = ['packages/react/src', 'packages/storybook/src'];
const IGNORE_MARKER = '/* token-audit-ignore */';
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/g;

function findModuleCssFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { recursive: true })) {
    const full = join(dir, entry);
    if (entry.endsWith('.module.css') && statSync(full).isFile()) {
      results.push(full);
    }
  }
  return results;
}

// Retire le contenu des appels var(...) pour ignorer les fallbacks
// var(--token, #hexFallback) — seules les couleurs EN DEHORS d'un var()
// sont de vraies valeurs arbitraires. Suppose que chaque appel var() tient
// sur une seule ligne (cas constant dans ce repo) ; sinon le numéro de ligne
// rapporté peut être légèrement décalé.
function stripVarCalls(css) {
  let result = '';
  let depth = 0;
  for (let i = 0; i < css.length; i++) {
    if (css.slice(i, i + 4) === 'var(') {
      depth++;
      i += 3;
      continue;
    }
    if (depth > 0) {
      if (css[i] === '(') depth++;
      if (css[i] === ')') depth--;
      continue;
    }
    result += css[i];
  }
  return result;
}

// Ne garde que les retours à la ligne du commentaire supprimé, pour que les
// numéros de ligne restent alignés avec le fichier original.
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ''));
}

const violations = [];

for (const dir of SCAN_DIRS) {
  const absDir = join(repoRoot, dir);
  for (const file of findModuleCssFiles(absDir)) {
    const content = readFileSync(file, 'utf8');
    if (content.includes(IGNORE_MARKER)) continue;

    const stripped = stripVarCalls(stripComments(content));
    const originalLines = content.split('\n');
    const strippedLines = stripped.split('\n');

    strippedLines.forEach((line, i) => {
      const matches = line.match(HEX_PATTERN);
      if (matches) {
        violations.push({
          file: relative(repoRoot, file),
          line: i + 1,
          matches,
          context: (originalLines[i] ?? line).trim(),
        });
      }
    });
  }
}

if (violations.length > 0) {
  console.error('❌ token-audit : couleurs hexadécimales codées en dur détectées (hors fallback var()) :\n');
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} — ${v.matches.join(', ')}`);
    console.error(`    ${v.context}`);
  }
  console.error(
    `\n${violations.length} violation(s). Utiliser un token de couleur existant (voir specs/tokens/color-tokens.md), ` +
      `ou si la valeur est du contenu illustratif bespoke (ex: assets Figma composés à la main, sans équivalent DS), ` +
      `ajouter "${IGNORE_MARKER}" en tête du fichier .module.css pour l'exclure explicitement.`
  );
  process.exit(1);
}

console.log('✅ token-audit : aucune couleur hexadécimale codée en dur hors fallback var().');
