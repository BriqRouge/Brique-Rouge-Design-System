#!/usr/bin/env node
// scripts/contrast-audit.mjs
//
// Contrôle de contraste des paires de tokens (ADR-001, lot 7) — sans dépendance.
//
// Principe (même modèle que GitHub Primer) : les combinaisons texte/fond et
// composant/fond réellement utilisées par les composants sont déclarées dans
// packages/tokens/contrast-pairs.config.js. Pour chacune, le script lit les
// valeurs résolues de packages/tokens/tokens.json et calcule le ratio WCAG 2.x.
//   - kind 'text' : 4,5:1 minimum (WCAG 1.4.3)
//   - kind 'ui'   : 3:1 minimum (WCAG 1.4.11 — bordures, icônes)
//   Les états désactivés sont exemptés par WCAG : ne pas les déclarer.
// Une couleur semi-transparente est d'abord mélangée à son fond (et un fond
// semi-transparent au fond de page) avant le calcul.
// Une paire d'une collection à modes (ex. `project`) est contrôlée pour chaque mode.
//
// Limite : seules les paires déclarées sont contrôlées. Toute nouvelle
// combinaison texte/fond dans un composant doit être ajoutée à la config.
// Le contrôle du rendu réel (axe-core dans un navigateur) est complémentaire.
//
// Usage : node scripts/contrast-audit.mjs
// Codes de sortie : 0 tout est conforme (écarts connus signalés), 1 au moins une paire échoue.

import { readFileSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';

const repoRoot = join(import.meta.dirname, '..');
const MODES_EXTENSION = 'brique-rouge.modes';
export const THRESHOLDS = { text: 4.5, ui: 3 };

// ─── Couleurs ────────────────────────────────────────────────────────────────
export function parseHex(hex) {
  const m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(String(hex));
  if (!m) throw new Error(`couleur invalide « ${hex} »`);
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: m[2] ? parseInt(m[2], 16) / 255 : 1 };
}

// Composition « source-over » d'une couleur sur un fond opaque.
export function blend(top, bottom) {
  const mix = (c) => Math.round(top[c] * top.a + bottom[c] * (1 - top.a));
  return { r: mix('r'), g: mix('g'), b: mix('b'), a: 1 };
}

export function luminance({ r, g, b }) {
  const lin = (v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(fgHex, bgHex, pageHex = '#ffffff') {
  let bg = parseHex(bgHex);
  if (bg.a < 1) bg = blend(bg, parseHex(pageHex));
  let fg = parseHex(fgHex);
  if (fg.a < 1) fg = blend(fg, bg);
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// ─── Lecture des tokens ──────────────────────────────────────────────────────
// `path` : chemin complet dans tokens.json, collection comprise
// (ex. 'semantic/color/text/primary'). Retourne { base, modes }.
export function readToken(tokens, path) {
  const node = path.split('/').reduce((n, seg) => n?.[seg], tokens);
  if (!node || !('$value' in node)) throw new Error(`token introuvable : ${path}`);
  return { base: node.$value, modes: node.$extensions?.[MODES_EXTENSION] ?? {} };
}

// ─── Audit ───────────────────────────────────────────────────────────────────
// Retourne une ligne par paire et par mode : { pair, mode, ratio, min, ok, known }.
export function audit(tokens, config) {
  const page = readToken(tokens, config.page).base;
  const known = new Map((config.knownIssues ?? []).map((k) => [`${k.fg} | ${k.bg}`, k.reason]));
  const rows = [];
  for (const pair of config.pairs) {
    const fg = readToken(tokens, pair.fg);
    const bg = readToken(tokens, pair.bg);
    const modeNames = [...new Set([...Object.keys(fg.modes), ...Object.keys(bg.modes)])];
    const variants = [{ mode: null, fg: fg.base, bg: bg.base }];
    for (const mode of modeNames) variants.push({ mode, fg: fg.modes[mode] ?? fg.base, bg: bg.modes[mode] ?? bg.base });
    const min = THRESHOLDS[pair.kind ?? 'text'];
    if (!min) throw new Error(`kind inconnu « ${pair.kind} » pour ${pair.fg}`);
    for (const v of variants) {
      const ratio = contrastRatio(v.fg, v.bg, page);
      const ok = ratio >= min;
      rows.push({ pair, mode: v.mode, fg: v.fg, bg: v.bg, ratio, min, ok, known: !ok ? known.get(`${pair.fg} | ${pair.bg}`) : undefined });
    }
  }
  return rows;
}

async function main() {
  const tokens = JSON.parse(readFileSync(join(repoRoot, 'packages/tokens/tokens.json'), 'utf8'));
  const { default: config } = await import(pathToFileURL(join(repoRoot, 'packages/tokens/contrast-pairs.config.js')).href);
  const rows = audit(tokens, config);
  const short = (p) => p.split('/').slice(1).join('/');
  const label = (r) => `${short(r.pair.fg)} sur ${short(r.pair.bg)}${r.mode ? ` [${r.mode}]` : ''}`;
  const failures = rows.filter((r) => !r.ok && !r.known);
  const knownRows = rows.filter((r) => !r.ok && r.known);

  console.log(`Contraste des tokens : ${rows.length} combinaisons contrôlées (${config.pairs.length} paires déclarées)`);
  for (const r of knownRows) console.log(`   ⚠️  ${r.ratio.toFixed(2)}:1 < ${r.min}:1  ${label(r)} — écart connu : ${r.known}`);
  if (failures.length) {
    console.error(`\n❌ ${failures.length} combinaison(s) sous le seuil WCAG :`);
    for (const r of failures) console.error(`   ${r.ratio.toFixed(2)}:1 < ${r.min}:1  ${label(r)}  (${r.fg} sur ${r.bg})${r.pair.where ? ` — ${r.pair.where}` : ''}`);
    console.error('\nCorriger la valeur dans Figma (puis /sync-tokens), ou la paire dans packages/tokens/contrast-pairs.config.js si elle ne correspond à aucun usage réel.');
    process.exit(1);
  }
  console.log(`✅ Toutes les combinaisons atteignent leur seuil${knownRows.length ? ` (${knownRows.length} écart(s) connu(s) signalé(s))` : ''}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
