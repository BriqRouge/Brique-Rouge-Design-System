// Tests de scripts/contrast-audit.mjs — runner natif Node, sans dépendance.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, parseHex, blend, audit } from './contrast-audit.mjs';

const r2 = (x) => Math.round(x * 100) / 100;

test('ratios WCAG de référence', () => {
  assert.equal(r2(contrastRatio('#000000', '#ffffff')), 21);
  assert.equal(r2(contrastRatio('#ffffff', '#ffffff')), 1);
  assert.equal(r2(contrastRatio('#737373', '#fafafa')), 4.54); // text/tertiary sur la page
  assert.equal(r2(contrastRatio('#c2f6bc', '#5bdb50')), 1.47); // ancienne pastille TopNav
  assert.equal(r2(contrastRatio('#fafafa', '#af471f')), r2(contrastRatio('#af471f', '#fafafa'))); // symétrique
});

test('une couleur semi-transparente est mélangée à son fond avant le calcul', () => {
  assert.deepEqual(blend(parseHex('#00000080'), parseHex('#ffffff')), { r: 127, g: 127, b: 127, a: 1 });
  assert.ok(contrastRatio('#00000080', '#ffffff') < contrastRatio('#000000', '#ffffff'));
  // fond transparent : mélangé au fond de page
  assert.equal(r2(contrastRatio('#000000', '#ffffff00', '#ffffff')), 21);
});

test('couleur invalide refusée', () => {
  assert.throws(() => parseHex('#fff'), /couleur invalide/);
});

const tokens = {
  semantic: { color: {
    background: { page: { $value: '#fafafa' } },
    text: { ok: { $value: '#171717' }, ko: { $value: '#d4d4d4' } },
  } },
  project: { color: { a: { $value: '#2c41c9', $extensions: { 'brique-rouge.modes': { bpce: '#9b75ab' } } } } },
};

test('audit : seuil texte 4,5 et ui 3, écart connu signalé sans échec', () => {
  const rows = audit(tokens, {
    page: 'semantic/color/background/page',
    pairs: [
      { fg: 'semantic/color/text/ok', bg: 'semantic/color/background/page' },
      { fg: 'semantic/color/text/ko', bg: 'semantic/color/background/page' },
      { fg: 'semantic/color/text/ko', bg: 'semantic/color/text/ok', kind: 'ui' },
    ],
    knownIssues: [{ fg: 'semantic/color/text/ko', bg: 'semantic/color/background/page', reason: 'test' }],
  });
  assert.deepEqual(rows.map((r) => [r.ok, r.min, r.known]), [[true, 4.5, undefined], [false, 4.5, 'test'], [true, 3, undefined]]);
});

test('audit : une paire de la collection project est contrôlée pour chaque mode', () => {
  const rows = audit(tokens, { page: 'semantic/color/background/page', pairs: [{ fg: 'semantic/color/background/page', bg: 'project/color/a' }] });
  assert.deepEqual(rows.map((r) => [r.mode, r.bg]), [[null, '#2c41c9'], ['bpce', '#9b75ab']]);
  assert.equal(rows[1].ok, false); // #fafafa sur #9b75ab = 3,06:1
});

test('audit : token inconnu refusé', () => {
  assert.throws(() => audit(tokens, { page: 'semantic/color/background/page', pairs: [{ fg: 'semantic/color/nope', bg: 'semantic/color/background/page' }] }), /token introuvable/);
});
