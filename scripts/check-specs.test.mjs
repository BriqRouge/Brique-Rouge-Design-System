// Tests de scripts/check-specs.mjs et scripts/lib/specs.mjs — runner natif Node.
// Lancer : node --test scripts/check-specs.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter } from './lib/specs.mjs';
import { checkSpecs } from './check-specs.mjs';

const HEADER = ['---', 'component: Tag', 'tier: atom', 'figma:', '  node: "184:18522"', '  name: Tag', '  type: component-set', '---', '# Tag'].join('\n');
const spec = (data, file = 'Tag.md', folderTier = 'atom', dir = 'atoms') => ({ path: `specs/${dir}/${file}`, file, folderTier, dir, data });
const TAG = { component: 'Tag', tier: 'atom', figma: { node: '184:18522', name: 'Tag', type: 'component-set' } };

test('en-tête : clés simples, bloc imbriqué, valeurs entre guillemets', () => {
  const { data, body } = parseFrontmatter(HEADER);
  assert.deepEqual(data, TAG);
  assert.equal(body.trim(), '# Tag');
});

test('en-tête : fins de ligne CRLF acceptées, fiche sans en-tête → data null', () => {
  assert.deepEqual(parseFrontmatter(HEADER.replace(/\n/g, '\r\n')).data, TAG);
  assert.equal(parseFrontmatter('# Tag\n').data, null);
});

test('en-tête : non fermé ou ligne illisible → erreur explicite', () => {
  assert.throws(() => parseFrontmatter('---\ncomponent: Tag\n'), /non fermé/);
  assert.throws(() => parseFrontmatter('---\n- liste\n---\n'), /illisible/);
});

test('fiches cohérentes : aucune erreur', () => {
  const { errors, warnings } = checkSpecs([spec(TAG)], { atom: ['Tag'], molecule: [], organism: [] });
  assert.deepEqual(errors, []);
  assert.deepEqual(warnings, []);
});

test('incohérences nom / niveau / node / type détectées', () => {
  const bad = { component: 'Tags', tier: 'molecule', figma: { node: '184-18522', type: 'instance' } };
  const { errors } = checkSpecs([spec(bad)], { atom: ['Tag'], molecule: [], organism: [] });
  assert.equal(errors.length, 4);
});

test('composant sans fiche et fiche sans composant détectés', () => {
  const { errors } = checkSpecs([spec(TAG)], { atom: ['Tag', 'Badge'], molecule: ['Card'], organism: [] });
  assert.ok(errors.some((e) => e.includes('« Badge » sans fiche')));
  assert.ok(errors.some((e) => e.includes('« Card » sans fiche')));
  const { errors: e2 } = checkSpecs([spec(TAG)], { atom: [], molecule: [], organism: [] });
  assert.ok(e2.some((e) => e.includes('sans composant React')));
});

test('cadre et node partagé → avertissements, pas d\'erreur', () => {
  const frame = { component: 'Overview', tier: 'atom', figma: { node: '184:18522', name: 'X', type: 'frame' } };
  const { errors, warnings } = checkSpecs([spec(TAG), spec(frame, 'Overview.md')], { atom: ['Tag', 'Overview'], molecule: [], organism: [] });
  assert.deepEqual(errors, []);
  assert.equal(warnings.length, 2);
});
