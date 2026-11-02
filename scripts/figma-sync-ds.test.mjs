// Tests de scripts/figma-sync-ds.mjs — runner natif Node, sans dépendance.
// Lancer : node --test scripts/figma-sync-ds.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fnv1a, normalize, buildRegistry, buildPayload, diffSnapshot, updateSnapshot, formatReport, hasChanges, readToken, lintNodes, usedTextFills, hasTextStyle } from './figma-sync-ds.mjs';

const REGISTRY = {
  Tag: { tier: 'atom', node: '184:18522' },
  Button: { tier: 'atom', node: '1506:20751' },
  TopNav: { tier: 'organism', node: '1702:20362' },
  MetaInfoItem: { tier: 'molecule', node: '797:19440' },
};

// ─── Réponses REST simulées ──────────────────────────────────────────────────
const box = (x, y, width = 40, height = 20) => ({ x, y, width, height });
const variant = (id, name, x, padding = 8, extra = {}) => ({
  id, name, type: 'COMPONENT', absoluteBoundingBox: box(x, 0), absoluteRenderBounds: box(x, 0),
  paddingLeft: padding, children: [{ id: `${id}0`, name: 'Label', type: 'TEXT', characters: 'Tag', absoluteBoundingBox: box(x + padding, 2) }], ...extra,
});
const restNodes = () => ({
  '184:18522': {
    document: { id: '184:18522', type: 'COMPONENT_SET', name: 'Tag', componentPropertyDefinitions: { Size: { type: 'VARIANT', defaultValue: 'sm', variantOptions: ['sm', 'nm'] } },
      absoluteBoundingBox: box(0, 0, 200, 40), children: [variant('1:1', 'Size=sm', 0), variant('1:2', 'Size=nm', 100, 12)] },
    components: {},
  },
  '1506:20751': {
    document: { id: '1506:20751', type: 'COMPONENT_SET', name: 'Button', componentPropertyDefinitions: {}, absoluteBoundingBox: box(0, 0), children: [variant('2:1', 'Type=primary', 0)] },
    components: {},
  },
  '1702:20362': {
    document: { id: '1702:20362', type: 'COMPONENT', name: 'TopNav', absoluteBoundingBox: box(500, 500),
      children: [{ id: 'I9', type: 'INSTANCE', name: 'Button', componentId: '2:1', overrides: [{ id: 'I9' }], absoluteBoundingBox: box(510, 500) }] },
    components: { '2:1': { name: 'Type=primary', componentSetId: '1506:20751' } },
  },
  '797:19440': null,
});
const PAGE = { children: [
  { id: '184:18522', type: 'COMPONENT_SET', name: 'Tag' },
  { id: '184:18566', type: 'COMPONENT_SET', name: 'Badge' },
  { id: '86:1', type: 'COMPONENT_SET', name: 'Arrow / Chevron' },
  { id: '9:9', type: 'FRAME', name: 'Notes' },
] };
const ICONS = '^(Arrow|Interface) /';
const payloadOf = (nodes = restNodes(), page = PAGE) => buildPayload(REGISTRY, nodes, page, ICONS);

test('normalisation : position relative, identifiants et rendu dérivé ignorés', () => {
  const a = normalize(variant('1:1', 'Size=sm', 0), { x: 0, y: 0 });
  const b = normalize(variant('7:7', 'Size=sm', 300), { x: 300, y: 0 });
  assert.deepEqual(a, b);
  assert.ok(!('id' in a) && !('absoluteRenderBounds' in a));
  assert.deepEqual(a.box, [0, 0, 40, 20]);
});

test('registre : lu dans les en-têtes YAML, fiche invalide signalée', () => {
  const { registry, errors } = buildRegistry([
    { path: 'specs/atoms/Tag.md', file: 'Tag.md', folderTier: 'atom', data: { figma: { node: '184:18522' } } },
    { path: 'specs/atoms/Foo.md', file: 'Foo.md', folderTier: 'atom', data: null },
  ]);
  assert.deepEqual(registry, { Tag: { tier: 'atom', node: '184:18522' } });
  assert.match(errors[0], /Foo\.md/);
});

test('payload : variantes, dépendances, introuvables et inventaire hors icônes', () => {
  const p = payloadOf();
  assert.deepEqual(Object.keys(p.components.Tag.variants), ['Size=nm', 'Size=sm']);
  assert.deepEqual(p.components.TopNav.deps, ['Button']);
  assert.deepEqual(p.missing, ['MetaInfoItem']);
  assert.deepEqual(p.inventory, { '184:18522': 'Tag', '184:18566': 'Badge' });
});

test('payload : déplacer un composant sur le canvas ne change pas son empreinte', () => {
  const moved = restNodes();
  const set = moved['184:18522'].document;
  set.absoluteBoundingBox = box(1000, 1000, 200, 40);
  set.children = [variant('1:1', 'Size=sm', 1000), variant('1:2', 'Size=nm', 1100, 12)];
  assert.equal(payloadOf(moved).components.Tag.hash, payloadOf().components.Tag.hash);
});

test('premier lancement : tout est à analyser, dans l\'ordre atomes → molécules → organismes', () => {
  const diff = diffSnapshot(null, payloadOf(), REGISTRY);
  assert.equal(diff.firstRun, true);
  assert.deepEqual(diff.changed.map((c) => c.name), ['Button', 'Tag', 'TopNav']);
  assert.deepEqual(diff.newInFigma, []);
  assert.ok(hasChanges(diff));
});

test('aucun changement : rien à analyser', () => {
  const snap = updateSnapshot(null, payloadOf(), null);
  const diff = diffSnapshot(snap, payloadOf(), REGISTRY);
  assert.equal(diff.changed.length, 0);
  assert.deepEqual(diff.unchanged, ['Button', 'Tag', 'TopNav']);
  assert.deepEqual(diff.missing, ['MetaInfoItem']);
});

test('variante modifiée, ajoutée, supprimée + dépendance modifiée signalée', () => {
  const snap = updateSnapshot(null, payloadOf(), null);
  const next = restNodes();
  next['184:18522'].document.children = [variant('1:1', 'Size=sm', 0, 6), variant('1:3', 'Size=lg', 100)];
  next['1506:20751'].document.children = [variant('2:1', 'Type=primary', 0, 10)];
  const diff = diffSnapshot(snap, payloadOf(next), REGISTRY);
  const tag = diff.changed.find((c) => c.name === 'Tag');
  assert.deepEqual(tag.variantsChanged, ['Size=sm']);
  assert.deepEqual(tag.variantsAdded, ['Size=lg']);
  assert.deepEqual(tag.variantsRemoved, ['Size=nm']);
  // le rendu de l'instance n'a pas changé dans la réponse simulée : TopNav inchangé
  assert.ok(diff.unchanged.includes('TopNav'));
  assert.match(formatReport(diff), /renommage de variante/);
});

test('instance surchargée dans un organisme : changement détecté, dépendance signalée', () => {
  const snap = updateSnapshot(null, payloadOf(), null);
  const next = restNodes();
  next['1506:20751'].document.children = [variant('2:1', 'Type=primary', 0, 10)];
  next['1702:20362'].document.children[0].fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 } }];
  const diff = diffSnapshot(snap, payloadOf(next), REGISTRY);
  assert.deepEqual(diff.changed.find((c) => c.name === 'TopNav').changedDeps, ['Button']);
  assert.match(formatReport(diff), /utilise Button, aussi modifié/);
});

test('propriétés du composant modifiées signalées', () => {
  const snap = updateSnapshot(null, payloadOf(), null);
  const next = restNodes();
  next['184:18522'].document.componentPropertyDefinitions.Size.defaultValue = 'nm';
  const tag = diffSnapshot(snap, payloadOf(next), REGISTRY).changed.find((c) => c.name === 'Tag');
  assert.equal(tag.propsChanged, true);
  assert.deepEqual(tag.variantsChanged, []);
});

test('nouveau composant sur la page Design system signalé', () => {
  const snap = updateSnapshot(null, payloadOf(), null);
  const page = { children: [...PAGE.children, { id: '2200:1', type: 'COMPONENT', name: 'Accordion' }] };
  assert.deepEqual(diffSnapshot(snap, payloadOf(restNodes(), page), REGISTRY).newInFigma, [{ id: '2200:1', name: 'Accordion' }]);
});

test('mise à jour partielle : seuls les composants listés changent, inventaire conservé', () => {
  const snap = updateSnapshot(null, payloadOf(), null);
  const next = restNodes();
  next['184:18522'].document.children = [variant('1:1', 'Size=sm', 0, 6)];
  next['1506:20751'].document.children = [variant('2:1', 'Type=primary', 0, 10)];
  const page = { children: [...PAGE.children, { id: '2200:1', type: 'COMPONENT', name: 'Accordion' }] };
  const p = payloadOf(next, page);
  const updated = updateSnapshot(snap, p, ['Tag']);
  assert.equal(updated.components.Tag.hash, p.components.Tag.hash);
  assert.equal(updated.components.Button.hash, snap.components.Button.hash);
  assert.ok(!('2200:1' in updated.inventory));
  assert.deepEqual(diffSnapshot(updated, p, REGISTRY).changed.map((c) => c.name), ['Button']);
});

test('mise à jour partielle : un composant inconnu est refusé', () => {
  assert.throws(() => updateSnapshot(null, payloadOf(), ['Inconnu']), /Inconnu/);
});

test('token : variable d\'environnement prioritaire, sinon .env', () => {
  assert.equal(readToken({ FIGMA_TOKEN: 'abc' }, 'FIGMA_TOKEN=def'), 'abc');
  assert.equal(readToken({}, '# x\nFIGMA_TOKEN=def\r\n'), 'def');
  assert.equal(readToken({}, 'FIGMA_TOKEN=\n'), null);
  assert.equal(readToken({}, null), null);
});

test('empreinte FNV-1a stable', () => {
  assert.equal(fnv1a(''), '811c9dc5');
  assert.equal(fnv1a('a'), 'e40c292c');
});

// ─── Lint des conventions Figma ──────────────────────────────────────────────
const FONTS = ['ABC Favorit Pro Variable'];
const bound = { type: 'VARIABLE_ALIAS', id: 'VariableID:1:1' };
const solid = (b) => ({ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 }, ...(b ? { boundVariables: { color: bound } } : {}) });
const text = (extra = {}) => ({
  type: 'TEXT', name: 'Label', characters: 'Tag', style: { fontFamily: FONTS[0] },
  boundVariables: { fontSize: [bound], fontWeight: [bound] }, fills: [solid(true)], styles: { text: '1:2' }, ...extra,
});
const lintOf = (children, setName = 'Size=sm') => lintNodes(
  { Tag: { tier: 'atom', node: '1:1' } },
  { '1:1': { document: { type: 'COMPONENT_SET', name: 'Tag', children: [{ type: 'COMPONENT', name: setName, children }] } } },
  FONTS,
);

test('lint : composant conforme → ni erreur ni avertissement', () => {
  assert.deepEqual(lintOf([text()]), { errors: [], warnings: [] });
});

test('lint : variante hors kebab-case, taille non liée, couleur non liée', () => {
  const { errors } = lintOf([text({ boundVariables: { fontWeight: [bound] }, fills: [solid(false)] })], 'Size=Small, State=idle');
  assert.equal(errors.length, 3);
  assert.match(errors[0], /« Small » hors kebab-case/);
});

test('lint : sans style de texte → avertissement ; police illustrative et instance ignorées', () => {
  const { errors, warnings } = lintOf([
    text({ styles: {} }),
    text({ style: { fontFamily: 'Helvetica' }, fills: [solid(false)], boundVariables: {} }),
    { type: 'INSTANCE', name: 'Icon', children: [text({ fills: [solid(false)] })] },
  ]);
  assert.deepEqual(errors, []);
  assert.equal(warnings.length, 1);
});

test('lint : texte multi-segments — seules les couleurs réellement utilisées comptent', () => {
  const segmented = text({ characters: 'ab', fills: [solid(false)], characterStyleOverrides: [1, 2], styleOverrideTable: { 1: { fills: [solid(true)] }, 2: { fills: [solid(true)] } } });
  assert.equal(usedTextFills(segmented).length, 2);
  assert.deepEqual(lintOf([segmented]).errors, []);
  const partial = { ...segmented, characterStyleOverrides: [1] }; // 2e caractère sur le style de base
  assert.equal(lintOf([partial]).errors.length, 1);
});

test('lint : texte multi-styles — style porté par chaque segment', () => {
  const styled = text({ characters: 'ab', styles: {}, characterStyleOverrides: [1, 2], styleOverrideTable: { 1: { inheritTextStyleId: '1:3' }, 2: { inheritTextStyleId: '1:4' } } });
  assert.equal(hasTextStyle(styled), true);
  assert.deepEqual(lintOf([styled]).warnings, []);
  assert.equal(hasTextStyle({ ...styled, styleOverrideTable: { 1: { inheritTextStyleId: '1:3' }, 2: {} } }), false);
  assert.equal(hasTextStyle({ ...styled, characterStyleOverrides: [1] }), false); // 2e caractère sans style
});

test('rapport : toutes les variantes modifiées → résumé au lieu de la liste', () => {
  const snap = updateSnapshot(null, payloadOf(), null);
  const next = restNodes();
  next['184:18522'].document.children = [variant('1:1', 'Size=sm', 0, 6), variant('1:2', 'Size=nm', 100, 14)];
  assert.match(formatReport(diffSnapshot(snap, payloadOf(next), REGISTRY)), /toutes \(2\)/);
});
