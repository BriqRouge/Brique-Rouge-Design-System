// generate-specs.mjs
// Génère specs/foundations/{catégorie}.md et specs/tokens/{catégorie}-tokens.md
// à la racine du repo, à partir de build/tokens.json (valeurs déjà résolues par
// style-dictionary.config.js — aucune logique de résolution dupliquée ici).
//
// Exécuté après style-dictionary.config.js (voir le script "build" de package.json).
// Les fichiers generés sont commités : ils doivent être lisibles par un LLM sans
// lancer de build, au même titre que CLAUDE.md.

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');

const tokensPath = resolve(__dirname, 'build/tokens.json');
const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));

// ─── Aplatit l'arbre { primitive: { color: { neutral: { 50: "#fafafa" } } } } ───
// en une liste de { source, category, path, cssVarName, value }.
function collectLeaves(node, path, leaves) {
  for (const key of Object.keys(node)) {
    const value = node[key];
    const nextPath = [...path, key];
    if (value !== null && typeof value === 'object') {
      collectLeaves(value, nextPath, leaves);
    } else {
      leaves.push({ path: nextPath, value });
    }
  }
}

const allLeaves = [];
collectLeaves(tokens, [], allLeaves);

// source = "primitive" | "semantic" (premier segment)
// category = "color" | "typography" | "spacing" | "border-radius" | "sizing" | "elevation" (deuxième segment)
// cssVarName = même construction que le format css/variables-stripped de style-dictionary.config.js :
//   le chemin sans le premier segment (source), joint par "-"
const grouped = new Map(); // category -> { primitive: [...], semantic: [...] }

for (const leaf of allLeaves) {
  const [source, category, ...rest] = leaf.path;
  if (!category) continue; // ignore d'éventuelles clés racine sans catégorie
  const cssVarName = `--${[category, ...rest].join('-')}`;
  const tokenPath = [category, ...rest].join('.');

  if (!grouped.has(category)) grouped.set(category, { primitive: [], semantic: [] });
  const bucket = grouped.get(category)[source];
  if (bucket) bucket.push({ tokenPath, cssVarName, value: leaf.value });
}

const foundationsDir = resolve(repoRoot, 'specs/foundations');
const tokensDir = resolve(repoRoot, 'specs/tokens');
mkdirSync(foundationsDir, { recursive: true });
mkdirSync(tokensDir, { recursive: true });

const HEADER = (title) =>
  [
    `# ${title}`,
    '',
    '> Généré automatiquement par `packages/tokens/generate-specs.mjs` depuis',
    '> `packages/tokens/tokens.json`. Ne pas modifier à la main — modifier la',
    '> source (Figma Variables) puis relancer `pnpm --filter @brique-rouge/tokens build`.',
    '',
  ].join('\n');

function titleCase(category) {
  return category
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

for (const [category, { primitive, semantic }] of grouped) {
  // ─── specs/foundations/{category}.md — lisible humain/LLM ───
  const foundationLines = [HEADER(titleCase(category))];

  if (primitive.length) {
    foundationLines.push('## Primitives', '', '| Token | Valeur |', '|---|---|');
    for (const t of primitive) foundationLines.push(`| \`${t.tokenPath}\` | \`${t.value}\` |`);
    foundationLines.push('');
  }
  if (semantic.length) {
    foundationLines.push('## Sémantiques', '', '| Token | Valeur |', '|---|---|');
    for (const t of semantic) foundationLines.push(`| \`${t.tokenPath}\` | \`${t.value}\` |`);
    foundationLines.push('');
  }
  writeFileSync(resolve(foundationsDir, `${category}.md`), foundationLines.join('\n'));

  // ─── specs/tokens/{category}-tokens.md — catalogue CSS à copier-coller ───
  const cssLines = [HEADER(`${titleCase(category)} — Variables CSS`)];

  if (primitive.length) {
    cssLines.push('## Primitives', '', '```css');
    for (const t of primitive) cssLines.push(`${t.cssVarName}: ${t.value};`);
    cssLines.push('```', '');
  }
  if (semantic.length) {
    cssLines.push('## Sémantiques', '', '```css');
    for (const t of semantic) cssLines.push(`${t.cssVarName}: ${t.value};`);
    cssLines.push('```', '');
  }
  writeFileSync(resolve(tokensDir, `${category}-tokens.md`), cssLines.join('\n'));
}

console.log(`✅ specs/foundations/ et specs/tokens/ générés (${grouped.size} catégories : ${[...grouped.keys()].join(', ')})`);
