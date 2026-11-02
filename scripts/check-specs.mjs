#!/usr/bin/env node
// scripts/check-specs.mjs
//
// CI — vérifie la cohérence entre les composants React et leurs fiches specs.
// Sans dépendance. Lancé dans le job Lint.
//
// Erreurs (code de sortie 1) :
//   - fiche sans en-tête YAML, ou en-tête illisible
//   - `component` ≠ nom du fichier, `tier` ≠ dossier de la fiche
//   - `figma.node` absent ou mal formé (attendu `1234:5678`), `figma.type` inconnu
//   - composant React sans fiche, ou fiche sans composant React
// Avertissements (n'échouent pas) :
//   - `figma.type: frame` : le node n'est pas un composant Figma
//   - plusieurs fiches pointent vers le même node Figma

import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { FIGMA_TYPES, NODE_ID, loadConfig, readComponentSpecs } from './lib/specs.mjs';

const repoRoot = join(import.meta.dirname, '..');

// `components` : { atom: ['Button', …], … } — dossiers de packages/react/src/components
export function checkSpecs(specs, components) {
  const errors = [];
  const warnings = [];
  const byNode = new Map();

  for (const s of specs) {
    if (s.error) { errors.push(`${s.path} : ${s.error}`); continue; }
    if (!s.data) { errors.push(`${s.path} : en-tête YAML absent (voir scripts/lib/specs.mjs)`); continue; }
    const name = s.file.replace(/\.md$/, '');
    const { component, tier, figma } = s.data;
    if (component !== name) errors.push(`${s.path} : component « ${component} » ≠ nom du fichier « ${name} »`);
    if (tier !== s.folderTier) errors.push(`${s.path} : tier « ${tier} » ≠ dossier « ${s.dir} » (attendu ${s.folderTier})`);
    if (!figma || typeof figma !== 'object') { errors.push(`${s.path} : bloc figma absent`); continue; }
    if (!NODE_ID.test(figma.node ?? '')) errors.push(`${s.path} : figma.node « ${figma.node ?? ''} » invalide (attendu "1234:5678")`);
    if (!FIGMA_TYPES.includes(figma.type)) errors.push(`${s.path} : figma.type « ${figma.type ?? ''} » invalide (${FIGMA_TYPES.join(' | ')})`);
    if (figma.type === 'frame') warnings.push(`${s.path} : figma.node est un cadre, pas un composant Figma — à convertir en composant`);
    if (figma.node) byNode.set(figma.node, [...(byNode.get(figma.node) ?? []), name]);
  }
  for (const [node, names] of byNode) {
    if (names.length > 1) warnings.push(`node ${node} partagé par ${names.join(', ')} — un composant React devrait correspondre à un composant Figma`);
  }

  const specNames = new Map(specs.map((s) => [`${s.folderTier}/${s.file.replace(/\.md$/, '')}`, s]));
  for (const [tier, names] of Object.entries(components)) {
    for (const n of names) if (!specNames.has(`${tier}/${n}`)) errors.push(`composant ${tier} « ${n} » sans fiche specs`);
  }
  for (const key of specNames.keys()) {
    const [tier, n] = key.split('/');
    if (!(components[tier] ?? []).includes(n)) errors.push(`fiche ${key} sans composant React correspondant`);
  }
  return { errors, warnings };
}

function main() {
  const tiers = loadConfig(repoRoot).specs.componentTiers;
  const components = {};
  for (const [tier, dir] of Object.entries(tiers)) {
    const abs = join(repoRoot, 'packages/react/src/components', dir);
    components[tier] = existsSync(abs) ? readdirSync(abs, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];
  }
  const { errors, warnings } = checkSpecs(readComponentSpecs(repoRoot, tiers), components);
  for (const w of warnings) console.warn(`⚠️  ${w}`);
  if (errors.length) {
    console.error(`❌ check-specs : ${errors.length} erreur(s)\n  ` + errors.join('\n  '));
    return 1;
  }
  console.log('✅ check-specs : fiches et composants cohérents.');
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main();
}
