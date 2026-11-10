import { test } from 'node:test';
import assert from 'node:assert/strict';
import { storiesFromIndex } from './rendered-contrast-audit.mjs';

test('storiesFromIndex ne garde que les stories, dans l’ordre de l’index', () => {
  const index = { entries: {
    'a--docs': { type: 'docs', id: 'a--docs', title: 'A', name: 'Docs' },
    'a--default': { type: 'story', id: 'a--default', title: 'A', name: 'Défaut' },
    'b--playground': { type: 'story', id: 'b--playground', title: 'B', name: 'Playground' },
  } };
  assert.deepEqual(storiesFromIndex(index).map((s) => s.id), ['a--default', 'b--playground']);
});

test('storiesFromIndex tolère un index vide', () => {
  assert.deepEqual(storiesFromIndex({}), []);
});
