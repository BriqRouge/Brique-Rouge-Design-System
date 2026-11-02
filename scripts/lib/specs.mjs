// scripts/lib/specs.mjs
//
// Lecture des fiches composants `specs/{atoms,molecules,organisms}/*.md` et de
// leur en-tête YAML. Sans dépendance : l'en-tête suit un sous-ensemble strict
// de YAML (clés simples, un niveau d'imbrication, indentation de 2 espaces),
// suffisant et volontairement limité pour rester lisible par tous.
//
// En-tête attendu :
//   ---
//   component: Tag
//   tier: atom                 # atom | molecule | organism
//   figma:
//     node: "184:18522"        # composant ou set de la BIBLIOTHÈQUE (pas une instance)
//     name: Tag                # nom du calque dans Figma
//     type: component-set      # component-set | component | frame
//   ---

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export const FIGMA_TYPES = ['component-set', 'component', 'frame'];
export const NODE_ID = /^\d+:\d+$/;

const unquote = (v) => {
  const t = v.trim();
  return /^(["']).*\1$/.test(t) ? t.slice(1, -1) : t;
};

// Retourne { data, body } — data = null si la fiche n'a pas d'en-tête.
export function parseFrontmatter(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  if (lines[0] !== '---') return { data: null, body: text };
  const end = lines.indexOf('---', 1);
  if (end < 0) throw new Error('en-tête YAML non fermé (ligne « --- » manquante)');
  const data = {};
  let parent = null;
  for (const [i, raw] of lines.slice(1, end).entries()) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const m = /^( {0,2})([A-Za-z][\w-]*):(?:\s+(.*))?$/.exec(raw.replace(/\s+#.*$/, ''));
    if (!m) throw new Error(`en-tête YAML, ligne ${i + 2} illisible : « ${raw} »`);
    const [, indent, key, value] = m;
    if (indent === '') {
      if (value === undefined || value === '') { data[key] = {}; parent = key; }
      else { data[key] = unquote(value); parent = null; }
    } else {
      if (!parent) throw new Error(`en-tête YAML, ligne ${i + 2} : clé indentée sans parent`);
      data[parent][key] = unquote(value ?? '');
    }
  }
  return { data, body: lines.slice(end + 1).join('\n') };
}

// `tiers` : { atom: 'atoms', … } (ds.config.json → specs.componentTiers)
export function readComponentSpecs(repoRoot, tiers) {
  const specs = [];
  for (const [tier, dir] of Object.entries(tiers)) {
    const abs = join(repoRoot, 'specs', dir);
    if (!existsSync(abs)) continue;
    for (const file of readdirSync(abs).filter((f) => f.endsWith('.md')).sort()) {
      const path = `specs/${dir}/${file}`;
      let parsed;
      try {
        parsed = parseFrontmatter(readFileSync(join(abs, file), 'utf8'));
      } catch (e) {
        specs.push({ path, file, folderTier: tier, dir, error: e.message });
        continue;
      }
      specs.push({ path, file, folderTier: tier, dir, data: parsed.data });
    }
  }
  return specs;
}

export function loadConfig(repoRoot) {
  return JSON.parse(readFileSync(join(repoRoot, 'ds.config.json'), 'utf8'));
}
