#!/usr/bin/env node
// scripts/figma-sync-ds.mjs
//
// Détection des changements de composants Figma pour le skill /sync-ds et la
// CI nocturne. Sans dépendance.
//
// Principe : on garde dans le repo l'empreinte de chaque composant Figma tel
// qu'il était lors de la dernière synchro (scripts/figma/components-snapshot.json).
// Le script lit Figma directement par l'API REST (lecture seule), recalcule les
// empreintes et les compare au snapshot : seuls les composants dont l'empreinte
// a changé sont à analyser. Il ne décide rien — il liste.
//
// Les Figma Variables ne sont PAS couvertes : leur API REST est réservée au plan
// Enterprise. Elles se vérifient avec /sync-tokens (`figma-sync-tokens.mjs --check`).
//
// Configuration :
//   ds.config.json           figma.fileKey, figma.designSystemPageId, figma.iconNamePattern
//   specs/**/*.md            registre des composants (en-tête YAML, figma.node)
//   FIGMA_TOKEN              variable d'environnement, ou ligne FIGMA_TOKEN=… du
//                            fichier .env à la racine (jamais committé).
//                            Token personnel Figma, scope file_content:read.
//
// Usage :
//   node scripts/figma-sync-ds.mjs detect [--report <fichier.md>]
//       Affiche le rapport de détection (et l'écrit en Markdown si --report).
//   node scripts/figma-sync-ds.mjs update [--only A,B]
//       Met à jour le snapshot (tous les composants, ou seulement ceux listés).
//   node scripts/figma-sync-ds.mjs lint
//       Vérifie dans Figma les conventions décidées (CLAUDE.md « Conventions
//       Figma des composants ») — voir lintNodes().
//
// Codes de sortie :
//   0  rien n'a changé (detect) / snapshot écrit (update) / aucune erreur (lint)
//   1  erreur — token absent, Figma injoignable, registre invalide ; rien n'est écrit
//   3  changements détectés (detect) / conventions non respectées (lint)

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { loadConfig, readComponentSpecs } from './lib/specs.mjs';

const repoRoot = join(import.meta.dirname, '..');
export const SNAPSHOT_PATH = join(repoRoot, 'scripts/figma/components-snapshot.json');
export const TIERS = ['atom', 'molecule', 'organism'];
const API = 'https://api.figma.com/v1';

// ─── Empreinte ───────────────────────────────────────────────────────────────
export function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

// Champs REST sans valeur de design : identifiants de calques (changent si un
// calque est recréé à l'identique), rendu dérivé, liste technique des surcharges
// (les valeurs surchargées, elles, sont dans le node).
const IGNORED = new Set(['id', 'absoluteRenderBounds', 'overrides']);
const round = (n) => Math.round(n * 100) / 100;

// Copie normalisée d'un node REST : clés triées, nombres arrondis, position
// relative à `origin` (la place du composant sur le canvas n'est pas du design).
export function normalize(node, origin) {
  if (Array.isArray(node)) return node.map((x) => normalize(x, origin));
  if (typeof node === 'number') return round(node);
  if (!node || typeof node !== 'object') return node;
  const out = {};
  for (const k of Object.keys(node).sort()) {
    if (IGNORED.has(k)) continue;
    const v = node[k];
    if (k === 'absoluteBoundingBox' && v) {
      out.box = [round(v.x - origin.x), round(v.y - origin.y), round(v.width), round(v.height)];
    } else {
      out[k] = normalize(v, origin);
    }
  }
  return out;
}

const hashNode = (node) => fnv1a(JSON.stringify(normalize(node, node.absoluteBoundingBox ?? { x: 0, y: 0 })));

function collectInstances(node, acc = []) {
  if (node.type === 'INSTANCE' && node.componentId) acc.push(node.componentId);
  for (const c of node.children ?? []) collectInstances(c, acc);
  return acc;
}

// ─── Registre : composant → niveau + node Figma, depuis les en-têtes YAML ────
export function buildRegistry(specs) {
  const registry = {};
  const errors = [];
  for (const s of specs) {
    if (s.error || !s.data?.figma?.node) { errors.push(`${s.path} : en-tête YAML invalide — lancer node scripts/check-specs.mjs`); continue; }
    registry[s.file.replace(/\.md$/, '')] = { tier: s.folderTier, node: s.data.figma.node };
  }
  return { registry, errors };
}

// ─── Empreintes à partir des réponses REST ───────────────────────────────────
// `nodes` : réponse de GET /files/:key/nodes (champ `nodes`) pour les nodes du registre
// `page`  : document de la page « Design system » (depth=1)
export function buildPayload(registry, nodes, page, iconPattern) {
  // componentId → id du set (ou du composant seul), pour retrouver les dépendances
  const ownerOf = new Map();
  for (const entry of Object.values(nodes)) {
    for (const [id, c] of Object.entries(entry?.components ?? {})) ownerOf.set(id, c.componentSetId ?? id);
  }
  const nameOf = new Map(Object.entries(registry).map(([name, r]) => [r.node, name]));

  const components = {};
  const missing = [];
  for (const name of Object.keys(registry).sort()) {
    const doc = nodes[registry[name].node]?.document;
    if (!doc) { missing.push(name); continue; }
    const variants = {};
    let props = null;
    if (doc.type === 'COMPONENT_SET') {
      props = fnv1a(JSON.stringify(normalize(doc.componentPropertyDefinitions ?? {}, { x: 0, y: 0 })));
      for (const v of doc.children ?? []) if (v.type === 'COMPONENT') variants[v.name] = hashNode(v);
    } else {
      if (doc.componentPropertyDefinitions) props = fnv1a(JSON.stringify(normalize(doc.componentPropertyDefinitions, { x: 0, y: 0 })));
      variants[doc.name] = hashNode(doc);
    }
    const deps = collectInstances(doc)
      .map((id) => nameOf.get(ownerOf.get(id) ?? id))
      .filter((d) => d && d !== name);
    const keys = Object.keys(variants).sort();
    components[name] = {
      node: registry[name].node,
      hash: fnv1a((props ?? '') + '|' + keys.map((k) => k + '=' + variants[k]).join('|')),
      props,
      variants: Object.fromEntries(keys.map((k) => [k, variants[k]])),
      deps: [...new Set(deps)].sort(),
    };
  }

  const icon = new RegExp(iconPattern);
  const inventory = {};
  for (const n of page?.children ?? []) {
    if ((n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') && !icon.test(n.name)) inventory[n.id] = n.name;
  }
  return { components, missing, inventory };
}

// ─── Comparaison payload ↔ snapshot ──────────────────────────────────────────
// `snapshot` : null au premier lancement.
export function diffSnapshot(snapshot, payload, registry) {
  const tierOf = (name) => registry[name]?.tier ?? 'organism';
  const byTier = (a, b) => TIERS.indexOf(tierOf(a.name)) - TIERS.indexOf(tierOf(b.name)) || a.name.localeCompare(b.name);
  const firstRun = !snapshot;
  const prev = snapshot?.components ?? {};

  const changed = [];
  const unchanged = [];
  for (const [name, cur] of Object.entries(payload.components)) {
    const old = prev[name];
    if (old && old.hash === cur.hash && old.node === cur.node) { unchanged.push(name); continue; }
    const oldV = old?.variants ?? {};
    changed.push({
      name,
      tier: tierOf(name),
      reason: firstRun ? 'premier lancement' : !old ? 'absent du snapshot' : 'empreinte modifiée',
      variantCount: Object.keys(cur.variants).length,
      variantsChanged: Object.keys(cur.variants).filter((v) => v in oldV && oldV[v] !== cur.variants[v]),
      variantsAdded: old ? Object.keys(cur.variants).filter((v) => !(v in oldV)) : [],
      variantsRemoved: Object.keys(oldV).filter((v) => !(v in cur.variants)),
      propsChanged: !!old && old.props !== cur.props,
      nodeChanged: !!old && old.node !== cur.node,
      deps: cur.deps,
    });
  }
  const changedNames = new Set(changed.map((c) => c.name));
  // Au premier lancement tout est « modifié » : l'indication n'apporterait rien.
  for (const c of changed) c.changedDeps = firstRun ? [] : c.deps.filter((d) => changedNames.has(d));
  changed.sort(byTier);

  const registryNodes = new Set(Object.values(registry).map((r) => r.node));
  const knownInventory = snapshot?.inventory ?? payload.inventory;
  const newInFigma = Object.entries(payload.inventory)
    .filter(([id]) => !(id in knownInventory) && !registryNodes.has(id))
    .map(([id, name]) => ({ id, name }));

  return { firstRun, changed, unchanged: unchanged.sort(), missing: [...payload.missing].sort(), newInFigma };
}

export const hasChanges = (diff) => diff.firstRun || diff.changed.length > 0 || diff.missing.length > 0 || diff.newInFigma.length > 0;

export function formatReport(diff) {
  const lines = [];
  if (diff.firstRun) lines.push('⚠️  Premier lancement : aucun snapshot — tous les composants sont à analyser.', '');
  lines.push(`Composants à analyser (${diff.changed.length}) — ordre de traitement :`);
  for (const c of diff.changed) {
    lines.push(`  [${c.tier}] ${c.name} — ${c.reason}`);
    if (c.propsChanged) lines.push('      propriétés du composant modifiées (ajout, renommage ou valeur par défaut)');
    if (c.nodeChanged) lines.push('      node Figma de la fiche modifié');
    if (c.variantsChanged.length) {
      const all = c.variantsChanged.length === c.variantCount && c.variantCount > 1;
      lines.push(`      variantes modifiées : ${all ? `toutes (${c.variantCount}) — changement commun, ex. sous-composant ou style partagé` : c.variantsChanged.join(' · ')}`);
    }
    if (c.variantsAdded.length) lines.push(`      variantes ajoutées : ${c.variantsAdded.join(' · ')}`);
    if (c.variantsRemoved.length) lines.push(`      variantes supprimées : ${c.variantsRemoved.join(' · ')}`);
    if (c.variantsAdded.length && c.variantsRemoved.length) lines.push('      ⓘ un renommage de variante apparaît comme une suppression + un ajout');
    if (c.changedDeps.length) lines.push(`      ⓘ utilise ${c.changedDeps.join(', ')}, aussi modifié(s) — le changement peut venir de là`);
  }
  if (diff.missing.length) lines.push('', `❌ Introuvables dans Figma (node supprimé ?) : ${diff.missing.join(', ')}`);
  if (diff.newInFigma.length) {
    lines.push('', 'Nouveaux dans Figma (page « Design system », sans fiche specs) :');
    for (const n of diff.newInFigma) lines.push(`  ${n.name} (${n.id})`);
  }
  lines.push('', `Inchangés (${diff.unchanged.length}) : ${diff.unchanged.join(', ') || '—'}`);
  lines.push('', 'Figma Variables : non couvertes ici — vérifier avec /sync-tokens.');
  return lines.join('\n');
}

// ─── Mise à jour du snapshot ─────────────────────────────────────────────────
// `only` : liste de composants à mettre à jour, ou null pour tout.
export function updateSnapshot(snapshot, payload, only) {
  // Mise à jour partielle : l'inventaire reste celui du snapshot, pour qu'un
  // nouveau composant non traité continue d'être signalé au prochain /sync-ds.
  const partial = !!only && !!snapshot;
  const names = only ?? Object.keys(payload.components);
  const unknown = names.filter((n) => !(n in payload.components));
  if (unknown.length) throw new Error(`composant(s) absent(s) de Figma ou du registre : ${unknown.join(', ')}`);
  const components = { ...(snapshot?.components ?? {}) };
  for (const n of names) components[n] = payload.components[n];
  // Une fiche supprimée ne doit pas laisser d'entrée orpheline
  if (!only) for (const n of Object.keys(components)) if (!(n in payload.components)) delete components[n];
  return {
    $comment: 'Généré par scripts/figma-sync-ds.mjs update — ne pas éditer à la main.',
    components: Object.fromEntries(Object.keys(components).sort().map((k) => [k, components[k]])),
    inventory: partial ? snapshot.inventory : payload.inventory,
  };
}

// ─── Lint des conventions Figma ──────────────────────────────────────────────
// Erreurs (convention cassée) :
//   - valeur de variante hors minuscules / kebab-case
//   - texte du DS dont la taille ou la graisse n'est pas liée à une variable
//   - couleur de texte non liée à une variable color/*
// Avertissements (écart toléré, à décider) :
//   - texte du DS sans style de texte
// Ignorés : textes dans une police hors `textFontFamilies` (contenu illustratif)
// et contenu des instances imbriquées (vérifié dans leur composant source).
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Remplissages réellement affichés par un texte : un texte à plusieurs segments
// porte ses couleurs dans `styleOverrideTable` ; le style de base ne compte que
// si au moins un caractère l'utilise.
export function usedTextFills(n) {
  const cso = n.characterStyleOverrides ?? [];
  const sot = n.styleOverrideTable ?? {};
  const used = [];
  if (cso.length < (n.characters ?? '').length || cso.includes(0)) used.push(...(n.fills ?? []));
  for (const k of new Set(cso)) {
    if (k === 0) continue;
    used.push(...(sot[k]?.fills ?? n.fills ?? []));
  }
  return used;
}

// Un texte à plusieurs styles (ex. titre Medium + Regular) porte le style de
// chaque segment dans `styleOverrideTable[k].inheritTextStyleId` ; `styles.text`
// ne couvre que les caractères restés sur le style de base.
export function hasTextStyle(n) {
  const cso = n.characterStyleOverrides ?? [];
  const sot = n.styleOverrideTable ?? {};
  const base = Boolean(n.styles?.text);
  if (!base && (cso.length < (n.characters ?? '').length || cso.includes(0))) return false;
  return [...new Set(cso)].every((k) => k === 0 || base || Boolean(sot[k]?.inheritTextStyleId));
}

export function lintNodes(registry, nodes, fonts) {
  const errors = [];
  const warnings = [];
  for (const name of Object.keys(registry).sort()) {
    const doc = nodes[registry[name].node]?.document;
    if (!doc) continue;
    if (doc.type === 'COMPONENT_SET') {
      for (const v of doc.children ?? []) {
        for (const pair of v.name.split(',').map((s) => s.trim())) {
          const value = pair.split('=')[1];
          if (value !== undefined && !KEBAB.test(value)) errors.push(`${name} : variante « ${v.name} » — valeur « ${value} » hors kebab-case`);
        }
      }
    }
    const walk = (n, path) => {
      if (n.type === 'TEXT' && fonts.includes(n.style?.fontFamily)) {
        const where = `${name} › ${path} « ${(n.characters ?? '').slice(0, 30)} »`;
        const b = n.boundVariables ?? {};
        if (!b.fontSize || !b.fontWeight) errors.push(`${where} : taille ou graisse non liée à une variable`);
        if (usedTextFills(n).some((f) => f.type === 'SOLID' && f.visible !== false && !f.boundVariables?.color)) errors.push(`${where} : couleur non liée à une variable`);
        if (!hasTextStyle(n)) warnings.push(`${where} : sans style de texte`);
      }
      if (n.type === 'INSTANCE') return;
      for (const c of n.children ?? []) walk(c, `${path}/${c.name}`);
    };
    walk(doc, doc.name);
  }
  return { errors, warnings };
}

export function formatLint({ errors, warnings }) {
  const lines = [];
  lines.push(errors.length ? `❌ ${errors.length} convention(s) non respectée(s) :` : '✅ Conventions Figma respectées.');
  for (const e of errors) lines.push(`  ${e}`);
  if (warnings.length) {
    lines.push('', `⚠️  ${warnings.length} avertissement(s) :`);
    for (const w of warnings) lines.push(`  ${w}`);
  }
  return lines.join('\n');
}

// ─── Accès Figma (REST, lecture seule) ───────────────────────────────────────
export function readToken(env, dotenvText) {
  if (env.FIGMA_TOKEN) return env.FIGMA_TOKEN.trim();
  const m = dotenvText?.match(/^FIGMA_TOKEN=(\S+)\s*$/m);
  return m ? m[1] : null;
}

async function figmaGet(path, token) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(API + path, { headers: { 'X-Figma-Token': token } });
    if (res.ok) return res.json();
    if (res.status === 429 && attempt < 4) {
      const wait = Number(res.headers.get('retry-after')) || 10 * attempt;
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    const hint = res.status === 403 ? ' — token invalide, expiré ou sans le scope file_content:read' : '';
    throw new Error(`Figma ${res.status} sur ${path.split('?')[0]}${hint}`);
  }
}

async function fetchRegistryNodes(config, registry, token) {
  const ids = [...new Set(Object.values(registry).map((r) => r.node))];
  return (await figmaGet(`/files/${config.figma.fileKey}/nodes?ids=${encodeURIComponent(ids.join(','))}`, token)).nodes;
}

export async function fetchPayload(config, registry, token) {
  const { fileKey, designSystemPageId, iconNamePattern } = config.figma;
  const [nodes, pageRes] = await Promise.all([
    fetchRegistryNodes(config, registry, token),
    figmaGet(`/files/${fileKey}/nodes?ids=${encodeURIComponent(designSystemPageId)}&depth=1`, token),
  ]);
  return buildPayload(registry, nodes, pageRes.nodes[designSystemPageId]?.document, iconNamePattern);
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
function arg(args, name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

async function main(argv) {
  const [command, ...args] = argv;
  if (!['detect', 'update', 'lint'].includes(command)) {
    console.error('Usage : figma-sync-ds.mjs detect [--report f.md] | update [--only A,B] | lint');
    return 1;
  }
  const config = loadConfig(repoRoot);
  const { registry, errors } = buildRegistry(readComponentSpecs(repoRoot, config.specs.componentTiers));
  if (errors.length) {
    console.error('❌ Registre invalide :\n  ' + errors.join('\n  '));
    return 1;
  }
  const dotenv = join(repoRoot, '.env');
  const token = readToken(process.env, existsSync(dotenv) ? readFileSync(dotenv, 'utf8') : null);
  if (!token) {
    console.error('❌ FIGMA_TOKEN absent : le renseigner dans .env (voir .env.example) ou en variable d\'environnement.');
    return 1;
  }

  if (command === 'lint') {
    let nodes;
    try {
      nodes = await fetchRegistryNodes(config, registry, token);
    } catch (e) {
      console.error(`❌ ${e.message}`);
      return 1;
    }
    const result = lintNodes(registry, nodes, config.figma.textFontFamilies ?? []);
    console.log(formatLint(result));
    return result.errors.length ? 3 : 0;
  }

  let payload;
  try {
    payload = await fetchPayload(config, registry, token);
  } catch (e) {
    console.error(`❌ ${e.message}`);
    return 1;
  }
  const snapshot = existsSync(SNAPSHOT_PATH) ? JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) : null;

  if (command === 'detect') {
    const diff = diffSnapshot(snapshot, payload, registry);
    const report = formatReport(diff);
    console.log(report);
    const out = arg(args, '--report');
    if (out) writeFileSync(out, '```\n' + report + '\n```\n\nLancer `/sync-ds` dans Claude Code pour analyser et synchroniser.\n');
    return hasChanges(diff) ? 3 : 0;
  }

  const onlyArg = arg(args, '--only');
  const only = onlyArg ? onlyArg.split(',').map((s) => s.trim()).filter(Boolean) : null;
  try {
    writeFileSync(SNAPSHOT_PATH, JSON.stringify(updateSnapshot(snapshot, payload, only), null, 2) + '\n');
  } catch (e) {
    console.error(`❌ ${e.message}`);
    return 1;
  }
  console.log(`Snapshot mis à jour : ${only ? only.join(', ') : 'tous les composants + inventaire'}`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main(process.argv.slice(2));
}
