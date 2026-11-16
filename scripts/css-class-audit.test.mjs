// Tests de scripts/css-class-audit.mjs — runner natif Node.
// Lancer : node --test scripts/css-class-audit.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditModule, extractCssClasses, extractTsxUsage } from './css-class-audit.mjs';

const mod = (css, tsx) => ({
  cssPath: 'atoms/X/X.module.css',
  css,
  users: tsx === undefined ? [] : [{ path: 'atoms/X/X.tsx', tsx, varName: 'styles' }],
});

test('classes CSS : sélecteurs composés, pseudo-classes et @media lus ; commentaires et valeurs ignorés', () => {
  const css = `/* .commentee {} */
.button { opacity: 0.5; width: calc(1.5 * var(--x)); }
.variant-outlined.mode-dark:hover:not(:disabled) { color: red; }
@media not (--viewport-desktop) { .is-expanded .panel { gap: 0; } }
@keyframes pop { from { opacity: 0; } to { opacity: 1; } }`;
  assert.deepEqual([...extractCssClasses(css)].sort(), ['button', 'is-expanded', 'mode-dark', 'panel', 'variant-outlined']);
});

test('usages TSX : références, conditions (?, &&) et préfixes de gabarit', () => {
  const tsx = "const c = [styles.root, styles[`size-${size}`], open ? styles['is-open'] : '', icon && styles.iconOnly, styles.label];";
  const u = extractTsxUsage(tsx);
  assert.deepEqual([...u.refs].sort(), ['iconOnly', 'is-open', 'label', 'root']);
  assert.deepEqual([...u.conditional].sort(), ['iconOnly', 'is-open']);
  assert.deepEqual([...u.templatePrefixes], ['size']);
});

test('module conforme : éléments camelCase, modificateurs préfixés appliqués sous condition', () => {
  const r = auditModule(mod('.root {} .titleBlock {} .size-sm {} .is-open {}', "[styles.root, styles.titleBlock, styles[`size-${s}`], o && styles['is-open']]"));
  assert.deepEqual(r.errors, []);
});

test('modificateur booléen en camelCase : erreur côté CSS et côté TSX', () => {
  const r = auditModule(mod('.root {} .hasHoverIcon {}', '[styles.root, hover ? styles.hasHoverIcon : ""]'));
  assert.equal(r.errors.length, 2);
  assert.match(r.errors[0], /booléen en camelCase/);
  assert.match(r.errors[1], /appliqué sous condition/);
});

test('modificateur sans préfixe appliqué sous condition (iconOnly) : erreur', () => {
  const r = auditModule(mod('.root {} .iconOnly {}', 'only && styles.iconOnly'));
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /iconOnly appliqué sous condition/);
});

test('format invalide : kebab-case sans préfixe de la liste', () => {
  const r = auditModule(mod('.hover-label {}'));
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /ni élément camelCase, ni modificateur/);
});

test('classe référencée mais non définie : erreur, sauf écart connu (avertissement)', () => {
  const m = mod('.root {}', "[styles.root, a && styles['is-activated']]");
  assert.match(auditModule(m).errors[0], /is-activated référencée mais non définie/);
  const known = [{ file: 'atoms/X/X.tsx', className: 'is-activated', reason: 'en attente du design' }];
  const r = auditModule(m, known);
  assert.deepEqual(r.errors, []);
  assert.match(r.warnings[0], /écart connu : en attente du design/);
  assert.ok(r.matchedKnown.has('atoms/X/X.tsx#is-activated'));
});

test('gabarit : préfixe hors liste, ou aucune classe de la famille définie', () => {
  const r = auditModule(mod('.root {} .size-sm {}', '[styles[`tone-${t}`], styles[`variant-${v}`]]'));
  assert.equal(r.errors.length, 2);
  assert.match(r.errors[0], /« tone- » hors liste/);
  assert.match(r.errors[1], /aucune classe variant-… définie/);
});
