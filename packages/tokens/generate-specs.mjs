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

// Valeurs des modes hors base (collection viewport) et breakpoint : écrits par
// style-dictionary.config.js, json/nested ne gardant que $value.
const modesInfo = JSON.parse(readFileSync(resolve(__dirname, 'build/modes.json'), 'utf8'));
const viewportCol = modesInfo.collections.find((c) => c.name === 'viewport') ?? null;
const projectCol = modesInfo.collections.find((c) => c.name === 'project') ?? null;

// source = "primitive" | "semantic" | "viewport" (premier segment)
// category = "color" | "typography" | "spacing" | "border-radius" | "sizing" | "elevation" (deuxième segment)
// cssVarName = même construction que le format css/variables-stripped de style-dictionary.config.js :
//   le chemin sans le premier segment (source), joint par "-"
const grouped = new Map(); // category -> { primitive: [...], semantic: [...], viewport: [...], project: [...] }
let breakpoint = null;

for (const leaf of allLeaves) {
  const [source, category, ...rest] = leaf.path;
  if (!category) continue; // ignore d'éventuelles clés racine sans catégorie
  // Le breakpoint n'est pas une variable CSS : fiche dédiée, voir plus bas.
  if (modesInfo.breakpoint && leaf.path.join('/') === modesInfo.breakpoint.token) {
    breakpoint = { ...modesInfo.breakpoint, value: leaf.value };
    continue;
  }
  const cssVarName = `--${[category, ...rest].join('-')}`;
  const tokenPath = [category, ...rest].join('.');
  const below = viewportCol ? modesInfo.modes[leaf.path.join('/')]?.[viewportCol.belowBreakpointMode] : undefined;
  const byMode = projectCol && source === 'project'
    ? Object.fromEntries(projectCol.modes.map((m, i) => [m, i === 0 ? leaf.value : (modesInfo.modes[leaf.path.join('/')]?.[m] ?? leaf.value)]))
    : undefined;

  if (!grouped.has(category)) grouped.set(category, { primitive: [], semantic: [], viewport: [], project: [] });
  const bucket = grouped.get(category)[source];
  if (bucket) bucket.push({ tokenPath, cssVarName, value: leaf.value, below, byMode });
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

const bp = breakpoint ? `${breakpoint.em} = ${breakpoint.value}` : '';

for (const [category, { primitive, semantic, viewport, project }] of grouped) {
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
  if (viewport.length && viewportCol) {
    foundationLines.push(
      '## Selon le viewport',
      '',
      `Valeur ${viewportCol.baseMode} par défaut ; valeur ${viewportCol.belowBreakpointMode} sous le breakpoint (${bp}). Voir \`specs/foundations/breakpoint.md\`.`,
      '',
      `| Token | ${viewportCol.baseMode} | ${viewportCol.belowBreakpointMode} |`,
      '|---|---|---|',
    );
    for (const t of viewport) foundationLines.push(`| \`${t.tokenPath}\` | \`${t.value}\` | \`${t.below ?? t.value}\` |`);
    foundationLines.push('');
  }
  if (project.length && projectCol) {
    foundationLines.push(
      '## Selon le projet',
      '',
      `Une valeur par projet, appliquée par l'attribut \`${projectCol.modeAttribute}\` posé sur le composant. Aucune valeur par défaut dans \`:root\`.`,
      '',
      `| Token | ${projectCol.modes.join(' | ')} |`,
      `|---|${projectCol.modes.map(() => '---').join('|')}|`,
    );
    for (const t of project) foundationLines.push(`| \`${t.tokenPath}\` | ${projectCol.modes.map((m) => `\`${t.byMode[m]}\``).join(' | ')} |`);
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
  if (viewport.length && viewportCol) {
    cssLines.push(
      '## Selon le viewport',
      '',
      'Émises à la fin de `semantic.css` : la valeur change seule sous le breakpoint, sans media query côté composant.',
      '',
      '```css',
      ':root {',
    );
    for (const t of viewport) cssLines.push(`  ${t.cssVarName}: ${t.value};`);
    cssLines.push('}', '', `@media (width < ${breakpoint?.em}) {`, '  :root {');
    for (const t of viewport) cssLines.push(`    ${t.cssVarName}: ${t.below ?? t.value};`);
    cssLines.push('  }', '}', '```', '');
  }
  if (project.length && projectCol) {
    cssLines.push('## Selon le projet', '', `Émises à la fin de \`semantic.css\`. Le composant pose \`${projectCol.modeAttribute}\`.`, '', '```css');
    for (const m of projectCol.modes) {
      cssLines.push(`[${projectCol.modeAttribute}='${m}'] {`);
      for (const t of project) cssLines.push(`  ${t.cssVarName}: ${t.byMode[m]};`);
      cssLines.push('}');
    }
    cssLines.push('```', '');
  }
  writeFileSync(resolve(tokensDir, `${category}-tokens.md`), cssLines.join('\n'));
}

// ─── Breakpoint : pas une variable CSS, une media query nommée ───────────
if (breakpoint) {
  const lines = [
    HEADER('Breakpoint'),
    '| Token Figma | Valeur | Media query |',
    '|---|---|---|',
    `| \`${breakpoint.token}\` | \`${breakpoint.value}\` → \`${breakpoint.em}\` | \`@custom-media ${breakpoint.customMedia} (width >= ${breakpoint.em})\` |`,
    '',
    "Le breakpoint n'est **jamais** une variable CSS (`var()` est inutilisable dans une media query).",
    'Il produit :',
    '',
    `- le bloc \`@media (width < ${breakpoint.em})\` des tokens « Selon le viewport », à la fin de \`semantic.css\` ;`,
    `- \`@brique-rouge/tokens/css/custom-media\` : \`${breakpoint.customMedia}\`, pour les changements de mise en page dans les CSS Modules.`,
    '',
    '```css',
    "@import '@brique-rouge/tokens/css/custom-media';",
    '',
    `@media not (${breakpoint.customMedia}) {`,
    '  /* mise en page sous le breakpoint */',
    '}',
    '```',
    '',
    'Résolu au build par `postcss-custom-media` (configuré dans chaque consommateur).',
    '',
  ];
  writeFileSync(resolve(foundationsDir, 'breakpoint.md'), lines.join('\n'));
}

console.log(`✅ specs/foundations/ et specs/tokens/ générés (${grouped.size} catégories : ${[...grouped.keys()].join(', ')}${breakpoint ? ', breakpoint' : ''})`);
