// Tests de scripts/figma-sync-tokens.mjs — runner natif Node, sans dépendance.
// Lancer : node --test scripts/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fnv1a,
  readExport,
  buildTokens,
  orderLike,
  flatten,
  cssVarName,
  diffTokens,
  findUsages,
} from './figma-sync-tokens.mjs';

const chunk = (index, collection, tsv) => `#chunk ${index} ${collection} ${fnv1a(tsv)}\n${tsv}\n`;
const manifest = (collections, chunkCount) => JSON.stringify({ collections, chunkCount });

const PRIMITIVE_TSV = ['color/neutral/50\tC\t#fafafa', 'color/shadow\tC\t#0000000f', 'spacing/x2\tF\t8'].join('\n');
const SEMANTIC_TSV = ['typography/body/font-family\tS\tABC Favorit Pro Variable'].join('\n');
const validFiles = () => ({
  'manifest.json': manifest(
    [
      { name: 'primitive', modes: ['Mode 1'], count: 3 },
      { name: 'semantic', modes: ['Mode 1'], count: 1 },
    ],
    2,
  ),
  'chunk-0.tsv': chunk(0, 'primitive', PRIMITIVE_TSV),
  'chunk-1.tsv': chunk(1, 'semantic', SEMANTIC_TSV),
});
const DECLARED = ['primitive', 'semantic'];

test('un export valide est lu sans erreur', () => {
  const { variables, errors } = readExport(validFiles(), DECLARED);
  assert.deepEqual(errors, []);
  assert.equal(variables.length, 4);
});

test('un morceau altéré pendant la recopie est refusé', () => {
  const files = validFiles();
  files['chunk-0.tsv'] = files['chunk-0.tsv'].replace('#fafafa', '#fafafb');
  const { errors } = readExport(files, DECLARED);
  assert.match(errors.join(), /empreinte/);
});

test('un morceau manquant est refusé', () => {
  const files = validFiles();
  delete files['chunk-1.tsv'];
  const { errors } = readExport(files, DECLARED);
  assert.match(errors.join(), /chunk-1\.tsv absent/);
  assert.match(errors.join(), /0 variables lues, 1 attendues/);
});

test('un nom hors convention est refusé, pas corrigé', () => {
  const tsv = 'color/maroon-flush/Maroon Flush_500\tC\t#ff2d66';
  const files = {
    'manifest.json': manifest([{ name: 'primitive', modes: ['Mode 1'], count: 1 }], 1),
    'chunk-0.tsv': chunk(0, 'primitive', tsv),
  };
  const { errors } = readExport(files, DECLARED);
  assert.match(errors.join(), /nom hors convention/);
});

test('une valeur non résolue, une collection non déclarée ou multi-modes sont refusées', () => {
  const tsv = 'border-radius/tag\tF\t!UNRESOLVED:alias-introuvable';
  const files = {
    'manifest.json': manifest([{ name: 'theme', modes: ['Light', 'Dark'], count: 1 }], 1),
    'chunk-0.tsv': chunk(0, 'theme', tsv),
  };
  const all = readExport(files, DECLARED).errors.join('\n');
  assert.match(all, /valeur non résolue/);
  assert.match(all, /absente de packages\/tokens\/mapping\.config\.js/);
  assert.match(all, /2 modes/);
});

test('buildTokens produit le format attendu par Style Dictionary', () => {
  const { variables } = readExport(validFiles(), DECLARED);
  const { tokens, errors } = buildTokens(variables);
  assert.deepEqual(errors, []);
  assert.deepEqual(tokens.primitive.color.neutral['50'], { $value: '#fafafa', $type: 'color' });
  assert.deepEqual(tokens.primitive.color.shadow, { $value: '#0000000f', $type: 'color' });
  assert.deepEqual(tokens.primitive.spacing.x2, { $value: 8, $type: 'number' });
  assert.deepEqual(tokens.semantic.typography.body['font-family'], {
    $value: 'ABC Favorit Pro Variable',
    $type: 'text',
  });
});

test('un chemin à la fois token et groupe est refusé', () => {
  const { errors } = buildTokens([
    { collection: 'semantic', name: 'border-radius/button', type: 'F', value: '999' },
    { collection: 'semantic', name: 'border-radius/button/rounded', type: 'F', value: '999' },
  ]);
  assert.equal(errors.length, 1);
});

test("orderLike garde l'ordre précédent et ajoute les nouvelles clés en fin de groupe", () => {
  const prev = { a: { z: { $value: 1 }, y: { $value: 2 } } };
  const next = { a: { new: { $value: 3 }, y: { $value: 2 }, z: { $value: 1 } } };
  assert.deepEqual(Object.keys(orderLike(next, prev).a), ['z', 'y', 'new']);
});

test('diffTokens et cssVarName signalent les variables CSS supprimées', () => {
  const prev = flatten({ semantic: { color: { text: { primary: { $value: '#171717', $type: 'color' } } } } });
  const next = flatten({ semantic: { color: { text: { display: { $value: '#404040', $type: 'color' } } } } });
  const { added, removed } = diffTokens(prev, next);
  assert.deepEqual(added, ['semantic/color/text/display']);
  assert.deepEqual(removed.map(cssVarName), ['--color-text-primary']);
});

test('findUsages ne confond pas une variable avec un préfixe plus long', () => {
  const sources = [
    ['a.module.css', 'color: var(--color-text-primary);\nborder: var(--color-text-primary-hover);'],
  ];
  const usages = findUsages(['--color-text-primary'], sources);
  assert.deepEqual(usages, [{ file: 'a.module.css', line: 1, name: '--color-text-primary' }]);
});
