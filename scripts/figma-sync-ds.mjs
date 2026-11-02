#!/usr/bin/env node
// scripts/figma-sync-ds.mjs
//
// Détection des changements Figma pour le skill /sync-ds. Sans dépendance.
//
// Principe : on garde dans le repo l'empreinte de chaque composant Figma tel
// qu'il était lors de la dernière synchro (scripts/figma/components-snapshot.json).
// Un export frais, produit par scripts/figma/snapshot-components.js via
// `use_figma`, est comparé à ce snapshot : seuls les composants dont
// l'empreinte a changé sont à analyser. Le script ne décide rien — il liste.
//
// Usage :
//   node scripts/figma-sync-ds.mjs prepare [--out <fichier>]
//       Écrit le snippet use_figma prêt à l'emploi (registre des composants lu
//       dans specs/{atoms,molecules,organisms}/*.md, ligne « **Node Figma :** »).
//       Défaut : $TMPDIR/figma-sync-ds/snippet.js
//   node scripts/figma-sync-ds.mjs diff --from <export.json>
//       Vérifie l'export et affiche le rapport de détection.
//   node scripts/figma-sync-ds.mjs update --from <export.json> [--only A,B]
//       Met à jour le snapshot (tous les composants, ou seulement ceux listés).
//
// Codes de sortie :
//   0  rien à synchroniser (diff) / snapshot écrit (update)
//   1  erreur — export refusé, registre invalide, rien n'a été écrit
//   3  changements détectés (diff)

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { tmpdir } from 'os';
import { pathToFileURL } from 'url';

const repoRoot = join(import.meta.dirname, '..');
const SPECS_DIR = join(repoRoot, 'specs');
const TEMPLATE_PATH = join(repoRoot, 'scripts/figma/snapshot-components.js');
export const SNAPSHOT_PATH = join(repoRoot, 'scripts/figma/components-snapshot.json');
export const TIERS = ['atoms', 'molecules', 'organisms'];
const REGISTRY_MARKER = '/*__REGISTRY__*/ {}';

// ─── Empreinte — identique à celle du snippet Figma ──────────────────────────
export function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

// ─── Registre : composant → tier + node(s) Figma, depuis les fiches specs ────
// `files` : { atoms: { 'Tag.md': string, … }, molecules: {…}, organisms: {…} }
export function parseRegistry(files) {
  const registry = {};
  const errors = [];
  for (const tier of TIERS) {
    for (const [file, content] of Object.entries(files[tier] ?? {})) {
      const name = file.replace(/\.md$/, '');
      const line = content.split(/\r?\n/).find((l) => l.startsWith('**Node Figma :**'));
      const ids = line ? [...line.matchAll(/`(\d+:\d+)`/g)].map((m) => m[1]) : [];
      if (ids.length === 0) errors.push(`${tier}/${file} : aucune ligne « **Node Figma :** » avec un node \`1234:5678\``);
      else registry[name] = { tier, ids };
    }
  }
  return { registry, errors };
}

export function buildSnippet(template, registry) {
  if (!template.includes(REGISTRY_MARKER)) throw new Error('marqueur __REGISTRY__ absent du modèle');
  const compact = Object.fromEntries(Object.entries(registry).map(([n, r]) => [n, { ids: r.ids }]));
  return template.replace(REGISTRY_MARKER, JSON.stringify(compact));
}

// ─── Lecture et vérification de l'export ─────────────────────────────────────
export function readExport(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { errors: [`export illisible (JSON) : ${e.message}`] };
  }
  const { checksum, payload } = data ?? {};
  if (!payload || typeof checksum !== 'string') return { errors: ['export incomplet : `checksum` et `payload` attendus'] };
  const actual = fnv1a(JSON.stringify(payload));
  if (actual !== checksum) {
    return { errors: [`empreinte invalide (attendue ${checksum}, obtenue ${actual}) : l'export a été altéré pendant la recopie — réexporter`] };
  }
  for (const key of ['tokens', 'components', 'missing', 'inventory']) {
    if (!(key in payload)) return { errors: [`export incomplet : \`payload.${key}\` absent`] };
  }
  return { payload, errors: [] };
}

// ─── Comparaison export ↔ snapshot ───────────────────────────────────────────
// `snapshot` : null au premier lancement.
export function diffSnapshot(snapshot, payload, registry) {
  const tierOf = (name) => registry[name]?.tier ?? 'organisms';
  const byTier = (a, b) => TIERS.indexOf(tierOf(a.name)) - TIERS.indexOf(tierOf(b.name)) || a.name.localeCompare(b.name);
  const firstRun = !snapshot;
  const prev = snapshot?.components ?? {};

  const changed = [];
  const unchanged = [];
  for (const [name, cur] of Object.entries(payload.components)) {
    const old = prev[name];
    if (old && old.hash === cur.hash && old.nodes.join() === cur.nodes.join()) { unchanged.push(name); continue; }
    const oldV = old?.variants ?? {};
    const entry = {
      name,
      tier: tierOf(name),
      reason: firstRun ? 'premier lancement' : !old ? 'absent du snapshot' : 'empreinte modifiée',
      variantsChanged: Object.keys(cur.variants).filter((v) => v in oldV && oldV[v] !== cur.variants[v]).sort(),
      variantsAdded: old ? Object.keys(cur.variants).filter((v) => !(v in oldV)).sort() : [],
      variantsRemoved: Object.keys(oldV).filter((v) => !(v in cur.variants)).sort(),
      propsChanged: !!old && old.variants && Object.keys(cur.variants).every((v) => oldV[v] === cur.variants[v]) && Object.keys(oldV).length === Object.keys(cur.variants).length,
      nodesChanged: !!old && old.nodes.join() !== cur.nodes.join(),
      deps: cur.deps,
    };
    changed.push(entry);
  }
  const changedNames = new Set(changed.map((c) => c.name));
  // Au premier lancement tout est « modifié » : l'indication n'apporterait rien.
  for (const c of changed) c.changedDeps = firstRun ? [] : c.deps.filter((d) => changedNames.has(d));
  changed.sort(byTier);

  const registryNodes = new Set(Object.values(payload.components).flatMap((c) => c.nodes));
  const knownInventory = snapshot?.inventory ?? payload.inventory;
  const newInFigma = Object.entries(payload.inventory)
    .filter(([id]) => !(id in knownInventory) && !registryNodes.has(id))
    .map(([id, name]) => ({ id, name }));

  return {
    firstRun,
    tokensChanged: firstRun ? null : snapshot.tokens.hash !== payload.tokens.hash,
    changed,
    unchanged: unchanged.sort(),
    missing: [...payload.missing].sort(),
    newInFigma,
  };
}

export function formatReport(diff) {
  const lines = [];
  lines.push(diff.firstRun
    ? '⚠️  Premier lancement : aucun snapshot — tous les composants sont à analyser.'
    : `Tokens : ${diff.tokensChanged ? '⚠️  Figma Variables modifiées → lancer /sync-tokens d\'abord' : 'aucun changement'}`);
  lines.push('');
  lines.push(`Composants à analyser (${diff.changed.length}) — ordre de traitement :`);
  for (const c of diff.changed) {
    lines.push(`  [${c.tier}] ${c.name} — ${c.reason}`);
    if (c.propsChanged) lines.push('      propriétés du composant modifiées (variantes inchangées)');
    if (c.nodesChanged) lines.push('      node(s) Figma de la fiche modifié(s)');
    if (c.variantsChanged.length) lines.push(`      variantes modifiées : ${c.variantsChanged.join(' · ')}`);
    if (c.variantsAdded.length) lines.push(`      variantes ajoutées : ${c.variantsAdded.join(' · ')}`);
    if (c.variantsRemoved.length) lines.push(`      variantes supprimées : ${c.variantsRemoved.join(' · ')}`);
    if (c.changedDeps.length) lines.push(`      ⓘ utilise ${c.changedDeps.join(', ')}, aussi modifié(s) — le changement peut venir de là`);
  }
  if (diff.missing.length) lines.push('', `❌ Introuvables dans Figma (node supprimé ?) : ${diff.missing.join(', ')}`);
  if (diff.newInFigma.length) {
    lines.push('', 'Nouveaux dans Figma (page « Design system », sans fiche specs) :');
    for (const n of diff.newInFigma) lines.push(`  ${n.name} (${n.id})`);
  }
  lines.push('', `Inchangés (${diff.unchanged.length}) : ${diff.unchanged.join(', ') || '—'}`);
  return lines.join('\n');
}

// ─── Mise à jour du snapshot ─────────────────────────────────────────────────
// `only` : liste de composants à mettre à jour, ou null pour tout.
export function updateSnapshot(snapshot, payload, only) {
  // Mise à jour partielle : tokens et inventaire restent ceux du snapshot, pour
  // qu'un changement de Variables ou un nouveau composant non traité continue
  // d'être signalé au prochain /sync-ds.
  const partial = !!only && !!snapshot;
  const next = {
    tokens: partial ? snapshot.tokens : payload.tokens,
    components: { ...(snapshot?.components ?? {}) },
    inventory: partial ? snapshot.inventory : payload.inventory,
  };
  const names = only ?? Object.keys(payload.components);
  const unknown = names.filter((n) => !(n in payload.components));
  if (unknown.length) throw new Error(`composant(s) absent(s) de l'export : ${unknown.join(', ')}`);
  for (const n of names) next.components[n] = payload.components[n];
  // Une fiche supprimée ne doit pas laisser d'entrée orpheline
  if (!only) for (const n of Object.keys(next.components)) if (!(n in payload.components)) delete next.components[n];
  next.components = Object.fromEntries(Object.keys(next.components).sort().map((k) => [k, next.components[k]]));
  return next;
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
function readSpecs() {
  const files = {};
  for (const tier of TIERS) {
    const dir = join(SPECS_DIR, tier);
    files[tier] = Object.fromEntries(
      readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => [f, readFileSync(join(dir, f), 'utf8')]),
    );
  }
  return files;
}

function arg(args, name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

function main(argv) {
  const [command, ...args] = argv;
  const { registry, errors } = parseRegistry(readSpecs());
  if (errors.length) {
    console.error('❌ Registre invalide :\n  ' + errors.join('\n  '));
    return 1;
  }

  if (command === 'prepare') {
    const out = arg(args, '--out') ?? join(tmpdir(), 'figma-sync-ds', 'snippet.js');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, buildSnippet(readFileSync(TEMPLATE_PATH, 'utf8'), registry));
    console.log(`Snippet écrit : ${out} (${Object.keys(registry).length} composants)`);
    return 0;
  }

  const from = arg(args, '--from');
  if (!from || !existsSync(from)) {
    console.error('❌ --from <export.json> requis (résultat de use_figma recopié tel quel)');
    return 1;
  }
  const { payload, errors: exportErrors } = readExport(readFileSync(from, 'utf8'));
  if (exportErrors.length) {
    console.error('❌ Export refusé :\n  ' + exportErrors.join('\n  '));
    return 1;
  }
  const snapshot = existsSync(SNAPSHOT_PATH) ? JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) : null;

  if (command === 'diff') {
    const diff = diffSnapshot(snapshot, payload, registry);
    console.log(formatReport(diff));
    const anything = diff.firstRun || diff.tokensChanged || diff.changed.length || diff.missing.length || diff.newInFigma.length;
    return anything ? 3 : 0;
  }

  if (command === 'update') {
    const onlyArg = arg(args, '--only');
    const only = onlyArg ? onlyArg.split(',').map((s) => s.trim()).filter(Boolean) : null;
    try {
      writeFileSync(SNAPSHOT_PATH, JSON.stringify(updateSnapshot(snapshot, payload, only), null, 2) + '\n');
    } catch (e) {
      console.error(`❌ ${e.message}`);
      return 1;
    }
    console.log(`Snapshot mis à jour : ${only ? only.join(', ') : 'tous les composants + tokens'}`);
    return 0;
  }

  console.error('Usage : figma-sync-ds.mjs prepare [--out f] | diff --from f | update --from f [--only A,B]');
  return 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main(process.argv.slice(2));
}
