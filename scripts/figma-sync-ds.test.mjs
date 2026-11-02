// Tests de scripts/figma-sync-ds.mjs — runner natif Node, sans dépendance.
// Lancer : node --test scripts/figma-sync-ds.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fnv1a, parseRegistry, buildSnippet, readExport, diffSnapshot, updateSnapshot, formatReport } from './figma-sync-ds.mjs';

const spec = (node) => `# X\n\n**Package :** \`@brique-rouge/react\`\n${node ? `**Node Figma :** ${node}\n` : ''}`;
const REGISTRY = {
  Tag: { tier: 'atoms', ids: ['184:18522'] },
  Button: { tier: 'atoms', ids: ['1506:20751'] },
  TopNav: { tier: 'organisms', ids: ['1702:20362'] },
  MetaInfoItem: { tier: 'molecules', ids: ['837:19518', '797:19440'] },
};

const comp = (nodes, variants, deps = []) => {
  const keys = Object.keys(variants).sort();
  return { nodes, hash: fnv1a(keys.map((k) => k + '=' + variants[k]).join('|')), variants, deps };
};
const payload = (overrides = {}) => ({
  tokens: { count: 2, hash: 'aaaa0000' },
  components: {
    Tag: comp(['184:18522'], { 'Size=sm': '11111111', 'Size=nm': '22222222' }),
    Button: comp(['1506:20751'], { 'Type=primary': '33333333' }),
    TopNav: comp(['1702:20362'], { 'Type=homepage': '44444444' }, ['Button']),
    MetaInfoItem: comp(['797:19440'], { 'State=idle': '55555555' }),
  },
  missing: [],
  inventory: { '184:18522': 'Tag', '1506:20751': 'Button', '1702:20362': 'TopNav', '797:19440': 'Meta', '184:18566': 'Badge' },
  ...overrides,
});
const exportOf = (p) => JSON.stringify({ checksum: fnv1a(JSON.stringify(p)), payload: p });

test('registre : node(s) lus dans la ligne « Node Figma », tier selon le dossier', () => {
  const { registry, errors } = parseRegistry({
    atoms: { 'Tag.md': spec('`184:18522` ("Tag")') },
    molecules: { 'MetaInfoItem.md': spec('`837:19518` (instance) + `797:19440` (bibliothèque)') },
    organisms: {},
  });
  assert.deepEqual(errors, []);
  assert.deepEqual(registry.Tag, { tier: 'atoms', ids: ['184:18522'] });
  assert.deepEqual(registry.MetaInfoItem.ids, ['837:19518', '797:19440']);
});

test('registre : une fiche sans node Figma est une erreur', () => {
  const { errors } = parseRegistry({ atoms: { 'Foo.md': spec(null) }, molecules: {}, organisms: {} });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /Foo\.md/);
});

test('snippet : le registre remplace le marqueur du modèle réel', () => {
  const template = readFileSync(join(import.meta.dirname, 'figma/snapshot-components.js'), 'utf8');
  const snippet = buildSnippet(template, REGISTRY);
  assert.ok(!snippet.includes('/*__REGISTRY__*/'));
  assert.ok(snippet.includes('"Tag":{"ids":["184:18522"]}'));
  assert.ok(!snippet.includes('"tier"'));
});

test('export : une recopie altérée est refusée', () => {
  const text = exportOf(payload()).replace('11111111', '11111112');
  assert.match(readExport(text).errors[0], /empreinte invalide/);
});

test('export : un export intact est accepté', () => {
  const { payload: p, errors } = readExport(exportOf(payload()));
  assert.deepEqual(errors, []);
  assert.equal(Object.keys(p.components).length, 4);
});

test('premier lancement : tout est à analyser, dans l\'ordre atomes → molécules → organismes', () => {
  const diff = diffSnapshot(null, payload(), REGISTRY);
  assert.equal(diff.firstRun, true);
  assert.deepEqual(diff.changed.map((c) => c.name), ['Button', 'Tag', 'MetaInfoItem', 'TopNav']);
  assert.deepEqual(diff.newInFigma, []);
});

test('aucun changement : rien à analyser', () => {
  const snap = updateSnapshot(null, payload(), null);
  const diff = diffSnapshot(snap, payload(), REGISTRY);
  assert.equal(diff.changed.length, 0);
  assert.equal(diff.tokensChanged, false);
  assert.equal(diff.unchanged.length, 4);
});

test('variante modifiée, ajoutée, supprimée + dépendance modifiée signalée', () => {
  const snap = updateSnapshot(null, payload(), null);
  const next = payload();
  next.components.Tag = comp(['184:18522'], { 'Size=sm': '99999999', 'Size=lg': '66666666' });
  next.components.Button = comp(['1506:20751'], { 'Type=primary': '77777777' });
  next.components.TopNav = comp(['1702:20362'], { 'Type=homepage': '88888888' }, ['Button']);
  const diff = diffSnapshot(snap, next, REGISTRY);
  const tag = diff.changed.find((c) => c.name === 'Tag');
  assert.deepEqual(tag.variantsChanged, ['Size=sm']);
  assert.deepEqual(tag.variantsAdded, ['Size=lg']);
  assert.deepEqual(tag.variantsRemoved, ['Size=nm']);
  assert.deepEqual(diff.changed.find((c) => c.name === 'TopNav').changedDeps, ['Button']);
  assert.match(formatReport(diff), /utilise Button, aussi modifié/);
});

test('tokens modifiés, composant introuvable et nouveau composant Figma signalés', () => {
  const snap = updateSnapshot(null, payload(), null);
  const next = payload({ tokens: { count: 3, hash: 'bbbb0000' }, missing: ['TopNav'] });
  delete next.components.TopNav;
  next.inventory = { ...next.inventory, '2200:1': 'Accordion' };
  const diff = diffSnapshot(snap, next, REGISTRY);
  assert.equal(diff.tokensChanged, true);
  assert.deepEqual(diff.missing, ['TopNav']);
  assert.deepEqual(diff.newInFigma, [{ id: '2200:1', name: 'Accordion' }]);
});

test('mise à jour partielle : seuls les composants listés changent, tokens et inventaire conservés', () => {
  const snap = updateSnapshot(null, payload(), null);
  const next = payload({ tokens: { count: 3, hash: 'bbbb0000' } });
  next.components.Tag = comp(['184:18522'], { 'Size=sm': '99999999' });
  next.components.Button = comp(['1506:20751'], { 'Type=primary': '77777777' });
  next.inventory = { ...next.inventory, '2200:1': 'Accordion' };
  const updated = updateSnapshot(snap, next, ['Tag']);
  assert.equal(updated.components.Tag.hash, next.components.Tag.hash);
  assert.equal(updated.components.Button.hash, snap.components.Button.hash);
  assert.equal(updated.tokens.hash, 'aaaa0000');
  assert.ok(!('2200:1' in updated.inventory));
  const diff = diffSnapshot(updated, next, REGISTRY);
  assert.deepEqual(diff.changed.map((c) => c.name), ['Button']);
  assert.equal(diff.tokensChanged, true);
});

test('mise à jour partielle : un composant absent de l\'export est refusé', () => {
  assert.throws(() => updateSnapshot(null, payload(), ['Inconnu']), /Inconnu/);
});
