#!/usr/bin/env node
// scripts/css-class-audit.mjs
//
// Contrôle le nommage des classes CSS Modules et leur usage dans le TSX
// (CLAUDE.md §8, ADR-005) :
//
//   1. Format : élément en camelCase (`titleBlock`), modificateur en kebab-case
//      avec un préfixe de MODIFIER_PREFIXES (`variant-primary`, `is-expanded`).
//   2. Un modificateur booléen ne s'écrit pas en camelCase (`hasHoverVisual`).
//   3. Une classe appliquée sous condition dans le TSX (`cond ? styles.x : ''`,
//      `cond && styles.x`, styles[`prefix-${valeur}`]) est un modificateur.
//   4. Toute classe référencée dans le TSX existe dans le CSS Module importé :
//      une classe absente vaut `undefined`, sans aucune erreur ni au build ni
//      aux tests.
//
// Limite connue : un modificateur est reconnu à la façon dont le TSX
// l'applique (ternaire, &&, gabarit). Un modificateur appliqué autrement
// échappe à la règle 3.
//
// Portée : packages/react/src/components et packages/storybook/src/stories/screens.
// Les stories de contenu illustratif (visuels de ProjectBentoCard…) ne sont pas du
// code du DS et restent hors contrôle.

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { dirname, join, relative } from 'path';
import { pathToFileURL } from 'url';

const repoRoot = join(import.meta.dirname, '..');
const SCAN_DIRS = ['packages/react/src/components', 'packages/storybook/src/stories/screens'];

// Familles de modificateurs. En ajouter une est un acte volontaire (ADR-005).
export const MODIFIER_PREFIXES = ['variant', 'size', 'theme', 'mode', 'color-scheme', 'company', 'is', 'has'];

// Écarts connus : signalés à chaque exécution sans faire échouer la CI.
// Chaque entrée a une raison et renvoie au backlog. Une entrée qui ne correspond
// plus à rien fait échouer le contrôle : la retirer.
export const KNOWN_ISSUES = [
  {
    file: 'packages/react/src/components/molecules/DropdownMenuButton/DropdownMenuButton.tsx',
    className: 'is-activated',
    reason: 'état « sélectionné » sans variante Figma — style en attente du design (backlog 012)',
  },
];

const CAMEL = /^[a-z][a-zA-Z0-9]*$/;
const MODIFIER = new RegExp(`^(?:${MODIFIER_PREFIXES.join('|')})-[a-z0-9]+(?:-[a-z0-9]+)*$`);
const CAMEL_BOOLEAN = /^(?:is|has)[A-Z]/;

/** Classes définies dans un CSS Module (sélecteurs seulement, commentaires ignorés). */
export function extractCssClasses(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const classes = new Set();
  for (const [, prelude] of clean.matchAll(/([^{};]+)\{/g)) {
    if (prelude.trim().startsWith('@')) continue;
    for (const [, name] of prelude.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) classes.add(name);
  }
  return classes;
}

/** Usages de `styles` dans un fichier TSX : références et modificateurs appliqués sous condition. */
export function extractTsxUsage(tsx, varName = 'styles') {
  const v = varName.replace(/\$/g, '\\$');
  const refs = new Set();
  const conditional = new Set();
  const templatePrefixes = new Set();
  for (const [, n] of tsx.matchAll(new RegExp(`\\b${v}\\.([A-Za-z_]\\w*)`, 'g'))) refs.add(n);
  for (const [, n] of tsx.matchAll(new RegExp(`\\b${v}\\[\\s*['"]([^'"]+)['"]\\s*\\]`, 'g'))) refs.add(n);
  for (const [, , n] of tsx.matchAll(new RegExp(`(\\?|&&)\\s*${v}\\.([A-Za-z_]\\w*)`, 'g'))) conditional.add(n);
  for (const [, , n] of tsx.matchAll(new RegExp(`(\\?|&&)\\s*${v}\\[\\s*['"]([^'"]+)['"]\\s*\\]`, 'g'))) conditional.add(n);
  for (const [, p] of tsx.matchAll(new RegExp(`\\b${v}\\[\\s*\`([a-z][a-z-]*?)-\\$\\{`, 'g'))) templatePrefixes.add(p);
  return { refs, conditional, templatePrefixes };
}

/**
 * Contrôle un CSS Module et, s'il y en a, les fichiers TSX qui l'importent.
 * @param {{ cssPath: string, css: string, users: { path: string, tsx: string, varName: string }[] }} mod
 * @param {typeof KNOWN_ISSUES} known
 * @returns {{ errors: string[], warnings: string[], matchedKnown: Set<string> }}
 */
export function auditModule(mod, known = []) {
  const errors = [];
  const warnings = [];
  const matchedKnown = new Set();
  const defined = extractCssClasses(mod.css);
  for (const c of defined) {
    if (CAMEL_BOOLEAN.test(c)) errors.push(`${mod.cssPath} : .${c} — modificateur booléen en camelCase, écrire is-… / has-… en kebab-case`);
    else if (!CAMEL.test(c) && !MODIFIER.test(c)) errors.push(`${mod.cssPath} : .${c} — ni élément camelCase, ni modificateur ${MODIFIER_PREFIXES.join('|')}-…`);
  }
  for (const u of mod.users) {
    const { refs, conditional, templatePrefixes } = extractTsxUsage(u.tsx, u.varName);
    for (const c of conditional) {
      if (!MODIFIER.test(c)) errors.push(`${u.path} : ${u.varName}.${c} appliqué sous condition — un modificateur s'écrit en kebab-case préfixé (${MODIFIER_PREFIXES.join('|')}-…)`);
    }
    for (const p of templatePrefixes) {
      if (!MODIFIER_PREFIXES.includes(p)) errors.push(`${u.path} : préfixe de modificateur « ${p}- » hors liste (${MODIFIER_PREFIXES.join(', ')})`);
      else if (![...defined].some((c) => c.startsWith(p + '-'))) errors.push(`${u.path} : aucune classe ${p}-… définie dans ${mod.cssPath}`);
    }
    for (const c of refs) {
      if (defined.has(c)) continue;
      const k = known.find((e) => e.file === u.path && e.className === c);
      if (k) {
        matchedKnown.add(`${k.file}#${k.className}`);
        warnings.push(`${u.path} : ${c} référencée mais non définie — écart connu : ${k.reason}`);
      } else errors.push(`${u.path} : ${c} référencée mais non définie dans ${mod.cssPath} (la classe vaut undefined)`);
    }
  }
  return { errors, warnings, matchedKnown };
}

function walk(dir, pred) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true })
    .map((e) => join(dir, e))
    .filter((f) => statSync(f).isFile() && pred(f));
}

function main() {
  const rel = (f) => relative(repoRoot, f);
  const modules = new Map();
  for (const d of SCAN_DIRS.map((s) => join(repoRoot, s))) {
    for (const f of walk(d, (f) => f.endsWith('.module.css'))) modules.set(f, { cssPath: rel(f), css: readFileSync(f, 'utf8'), users: [] });
    for (const f of walk(d, (f) => f.endsWith('.tsx') && !/\.(test|stories|figma)\.tsx$/.test(f))) {
      const tsx = readFileSync(f, 'utf8');
      for (const [, varName, spec] of tsx.matchAll(/import\s+(\w+)\s+from\s+['"](\.{1,2}\/[^'"]+\.module\.css)['"]/g)) {
        const m = modules.get(join(dirname(f), spec));
        if (m) m.users.push({ path: rel(f), tsx, varName });
      }
    }
  }
  const errors = [];
  const warnings = [];
  const matched = new Set();
  for (const m of modules.values()) {
    const r = auditModule(m, KNOWN_ISSUES);
    errors.push(...r.errors);
    warnings.push(...r.warnings);
    r.matchedKnown.forEach((k) => matched.add(k));
  }
  for (const k of KNOWN_ISSUES) {
    if (!matched.has(`${k.file}#${k.className}`)) errors.push(`écart connu résolu ou introuvable : ${k.className} dans ${k.file} — retirer l'entrée de KNOWN_ISSUES`);
  }
  for (const w of warnings) console.warn(`⚠️  ${w}`);
  if (errors.length) {
    console.error(`❌ css-class-audit : ${errors.length} erreur(s)\n  ` + errors.join('\n  '));
    return 1;
  }
  console.log(`✅ css-class-audit : ${modules.size} CSS Modules conformes (CLAUDE.md §8, ADR-005).`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main();
}
