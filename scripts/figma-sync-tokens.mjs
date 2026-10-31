#!/usr/bin/env node
// scripts/figma-sync-tokens.mjs
//
// Régénère packages/tokens/tokens.json à partir d'un export des Figma Variables
// produit par scripts/figma/export-variables.js (exécuté via `use_figma` par le
// skill /sync-tokens). Sans dépendance.
//
// Principe : Figma est la source de vérité. Le script REFUSE plutôt que de
// corriger — il ne renomme rien, ne devine rien :
//   - empreinte d'un morceau différente de celle calculée dans Figma → refus
//     (recopie altérée ou tronquée : réexporter)
//   - nombre de variables différent du manifeste → refus (morceau manquant)
//   - nom hors convention (minuscules, chiffres, tirets, `/`) → refus
//   - valeur non résolue (alias cassé), doublon, collection non déclarée dans
//     packages/tokens/mapping.config.js, collection multi-modes → refus
// Les corrections se font dans Figma, puis on relance.
//
// Usage :
//   node scripts/figma-sync-tokens.mjs [--from <dossier>] [--check]
//     --from   dossier de l'export (défaut : $TMPDIR/figma-tokens-export)
//     --check  n'écrit rien, affiche seulement le rapport
//
// Dossier d'export attendu :
//   manifest.json        le `manifest` renvoyé par le snippet, tel quel
//   chunk-<index>.tsv    1re ligne : `#chunk <index> <collection> <empreinte>`,
//                        puis le `tsv` du morceau, tel quel
//
// Codes de sortie :
//   0  tokens.json à jour (ou --check sans erreur)
//   1  export refusé — rien n'a été écrit
//   2  tokens.json écrit, MAIS des variables CSS supprimées sont encore
//      utilisées dans packages/*/src — à corriger avant de committer

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { tmpdir } from 'os';
import { pathToFileURL } from 'url';

const repoRoot = join(import.meta.dirname, '..');
const TOKENS_PATH = join(repoRoot, 'packages/tokens/tokens.json');
const SCAN_DIRS = ['packages/react/src', 'packages/storybook/src'];
const SCAN_EXTENSIONS = ['.css', '.ts', '.tsx', '.mdx'];

const SEGMENT = '[a-z0-9]+(?:-[a-z0-9]+)*';
export const NAME_PATTERN = new RegExp(`^${SEGMENT}(?:/${SEGMENT})*$`);
const TYPE_MAP = { C: 'color', F: 'number', S: 'text' };

// ─── Empreinte — identique à celle du snippet Figma ──────────────────────────
export function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

// ─── Lecture et vérification de l'export ─────────────────────────────────────
// `files` : { 'manifest.json': string, 'chunk-0.tsv': string, … }
// Retourne { variables: [{ collection, name, type, value }], errors: string[] }
export function readExport(files, declaredCollections) {
  const errors = [];
  const variables = [];

  if (!files['manifest.json']) return { variables, errors: ['manifest.json absent'] };
  let manifest;
  try {
    manifest = JSON.parse(files['manifest.json']);
  } catch (e) {
    return { variables, errors: [`manifest.json illisible : ${e.message}`] };
  }

  const counts = {};
  for (let i = 0; i < manifest.chunkCount; i++) {
    const file = `chunk-${i}.tsv`;
    const content = files[file];
    if (content === undefined) {
      errors.push(`${file} absent`);
      continue;
    }
    const body = content.replace(/\r\n/g, '\n').replace(/\n$/, '');
    const newline = body.indexOf('\n');
    const header = newline === -1 ? body : body.slice(0, newline);
    const tsv = newline === -1 ? '' : body.slice(newline + 1);
    const match = header.match(/^#chunk (\d+) (\S+) ([0-9a-f]{8})$/);
    if (!match || Number(match[1]) !== i) {
      errors.push(`${file} : en-tête invalide (« ${header} »)`);
      continue;
    }
    const [, , collection, expected] = match;
    const actual = fnv1a(tsv);
    if (actual !== expected) {
      errors.push(`${file} : empreinte ${actual} ≠ ${expected} calculée dans Figma — morceau altéré, à réexporter`);
      continue;
    }
    for (const line of tsv.split('\n')) {
      const [name, type, value, ...rest] = line.split('\t');
      if (rest.length || value === undefined) {
        errors.push(`${file} : ligne mal formée « ${line} »`);
        continue;
      }
      variables.push({ collection, name, type, value });
      counts[collection] = (counts[collection] ?? 0) + 1;
    }
  }

  for (const col of manifest.collections ?? []) {
    if (!declaredCollections.includes(col.name)) {
      errors.push(`collection « ${col.name} » absente de packages/tokens/mapping.config.js — à déclarer avant de synchroniser`);
    }
    if (col.modes.length !== 1) {
      errors.push(`collection « ${col.name} » : ${col.modes.length} modes (${col.modes.join(', ')}) — le build ne gère qu'un mode par collection`);
    }
    if ((counts[col.name] ?? 0) !== col.count) {
      errors.push(`collection « ${col.name} » : ${counts[col.name] ?? 0} variables lues, ${col.count} attendues`);
    }
  }

  const seen = new Set();
  for (const v of variables) {
    const id = `${v.collection}/${v.name}`;
    if (seen.has(id)) errors.push(`doublon : ${id}`);
    seen.add(id);
    if (!NAME_PATTERN.test(v.name)) {
      errors.push(`${id} : nom hors convention (minuscules, chiffres, tirets, « / ») — à renommer dans Figma`);
    }
    if (!TYPE_MAP[v.type]) errors.push(`${id} : type « ${v.type} » non pris en charge`);
    if (v.value.startsWith('!UNRESOLVED')) errors.push(`${id} : valeur non résolue (${v.value})`);
    if (v.type === 'C' && !/^#[0-9a-f]{6}([0-9a-f]{2})?$/.test(v.value)) {
      errors.push(`${id} : couleur invalide « ${v.value} »`);
    }
    if (v.type === 'F' && !Number.isFinite(Number(v.value))) {
      errors.push(`${id} : nombre invalide « ${v.value} »`);
    }
  }

  return { variables, errors };
}

// ─── Construction de tokens.json ─────────────────────────────────────────────
export function buildTokens(variables) {
  const errors = [];
  const tokens = {};
  for (const v of variables) {
    const path = [v.collection, ...v.name.split('/')];
    let node = tokens;
    for (const seg of path.slice(0, -1)) {
      if (node[seg] && '$value' in node[seg]) {
        errors.push(`${path.join('/')} : « ${seg} » est à la fois un token et un groupe`);
        break;
      }
      node = node[seg] ??= {};
    }
    const leaf = path[path.length - 1];
    if (node[leaf] && !('$value' in node[leaf])) {
      errors.push(`${path.join('/')} : est à la fois un token et un groupe`);
      continue;
    }
    node[leaf] = {
      $value: v.type === 'F' ? Number(v.value) : v.value,
      $type: TYPE_MAP[v.type],
    };
  }
  return { tokens, errors };
}

// Conserve l'ordre des clés du tokens.json précédent (diff git minimal) ;
// les nouvelles clés s'ajoutent en fin de groupe, dans l'ordre Figma.
export function orderLike(next, prev) {
  if (!prev || typeof prev !== 'object' || '$value' in next) return next;
  const keys = [
    ...Object.keys(prev).filter((k) => k in next),
    ...Object.keys(next).filter((k) => !(k in prev)),
  ];
  return Object.fromEntries(keys.map((k) => [k, orderLike(next[k], prev[k])]));
}

// { 'primitive/color/neutral/50': { value, type } }
export function flatten(tokens, prefix = []) {
  const out = {};
  for (const [k, v] of Object.entries(tokens)) {
    if (k.startsWith('$') || k === '_comment') continue;
    if (v && typeof v === 'object' && '$value' in v) {
      out[[...prefix, k].join('/')] = { value: v.$value, type: v.$type };
    } else if (v && typeof v === 'object') {
      Object.assign(out, flatten(v, [...prefix, k]));
    }
  }
  return out;
}

// Nom de la variable CSS générée (le préfixe de collection est retiré, voir
// css/variables-stripped dans style-dictionary.config.js).
export const cssVarName = (flatPath) => '--' + flatPath.split('/').slice(1).join('-');

export function diffTokens(prevFlat, nextFlat) {
  const added = Object.keys(nextFlat).filter((k) => !(k in prevFlat));
  const removed = Object.keys(prevFlat).filter((k) => !(k in nextFlat));
  const changed = Object.keys(nextFlat).filter(
    (k) =>
      k in prevFlat &&
      (String(prevFlat[k].value).toLowerCase() !== String(nextFlat[k].value).toLowerCase() ||
        prevFlat[k].type !== nextFlat[k].type),
  );
  return { added, removed, changed };
}

// ─── Usages restants des variables CSS supprimées ────────────────────────────
function listSourceFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true })
    .map((entry) => join(dir, entry))
    .filter((full) => SCAN_EXTENSIONS.some((ext) => full.endsWith(ext)) && statSync(full).isFile());
}

export function findUsages(varNames, sources) {
  const usages = [];
  for (const [file, content] of sources) {
    const lines = content.split('\n');
    for (const name of varNames) {
      const re = new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`);
      lines.forEach((line, i) => {
        if (re.test(line)) usages.push({ file, line: i + 1, name });
      });
    }
  }
  return usages;
}

// ─── Programme principal ─────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const fromIndex = args.indexOf('--from');
  const from = fromIndex !== -1 ? args[fromIndex + 1] : join(tmpdir(), 'figma-tokens-export');
  const checkOnly = args.includes('--check');

  if (!existsSync(from)) {
    console.error(`❌ Dossier d'export introuvable : ${from}`);
    process.exit(1);
  }
  const files = Object.fromEntries(
    readdirSync(from)
      .filter((f) => f === 'manifest.json' || /^chunk-\d+\.tsv$/.test(f))
      .map((f) => [f, readFileSync(join(from, f), 'utf8')]),
  );

  const { default: mapping } = await import(pathToFileURL(join(repoRoot, 'packages/tokens/mapping.config.js')).href);
  const declared = mapping.collections.map((c) => c.figmaCollection);

  const read = readExport(files, declared);
  const built = read.errors.length ? { tokens: {}, errors: [] } : buildTokens(read.variables);
  const errors = [...read.errors, ...built.errors];
  if (errors.length) {
    console.error(`❌ Export refusé — ${errors.length} problème(s), tokens.json n'a pas été modifié :`);
    for (const e of errors) console.error(`   - ${e}`);
    process.exit(1);
  }

  const prev = JSON.parse(readFileSync(TOKENS_PATH, 'utf8'));
  const next = orderLike(built.tokens, prev);
  const prevFlat = flatten(prev);
  const nextFlat = flatten(next);
  const { added, removed, changed } = diffTokens(prevFlat, nextFlat);

  console.log(`✅ Export vérifié : ${read.variables.length} variables (${declared.join(', ')})`);
  console.log(`   ${added.length} ajoutée(s), ${removed.length} supprimée(s), ${changed.length} valeur(s) modifiée(s)`);
  for (const k of added) console.log(`   + ${k} = ${nextFlat[k].value}`);
  for (const k of removed) console.log(`   - ${k} (était ${prevFlat[k].value})`);
  for (const k of changed) console.log(`   ~ ${k} : ${prevFlat[k].value} → ${nextFlat[k].value}`);

  const sources = SCAN_DIRS.flatMap((d) => listSourceFiles(join(repoRoot, d))).map((f) => [
    relative(repoRoot, f),
    readFileSync(f, 'utf8'),
  ]);
  const usages = findUsages(removed.map(cssVarName), sources);

  if (!checkOnly) {
    writeFileSync(TOKENS_PATH, JSON.stringify(next, null, 2) + '\n');
    console.log(`\n📝 ${relative(repoRoot, TOKENS_PATH)} régénéré.`);
  }

  if (usages.length) {
    console.error(`\n⚠️  ${usages.length} usage(s) de variables CSS supprimées — à corriger avant de committer :`);
    for (const u of usages) console.error(`   ${u.file}:${u.line}  ${u.name}`);
    process.exit(2);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
