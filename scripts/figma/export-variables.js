// scripts/figma/export-variables.js
//
// Snippet Figma Plugin API — exécuté tel quel via l'outil MCP `use_figma`
// (fichier NZtxQVYKRqeaGcC7hT5pjw) par le skill /sync-tokens. Lecture seule.
// Ce n'est PAS un module Node : `await` et `return` de premier niveau sont
// fournis par l'environnement d'exécution de use_figma.
//
// Sortie : un manifeste + des morceaux (« chunks ») TSV de CHUNK_SIZE lignes.
// Chaque morceau porte une empreinte FNV-1a 32 bits calculée ICI, côté Figma.
// scripts/figma-sync-tokens.mjs recalcule l'empreinte de chaque morceau recopié
// sur disque et refuse tout morceau altéré ou tronqué pendant la recopie.
//
// Format d'une ligne TSV : <nom>\t<type>\t<valeur>
//   type   : C (couleur) | F (nombre) | S (texte)
//   valeur : valeur résolue (alias suivis jusqu'à la valeur finale)
//            C → #rrggbb, ou #rrggbbaa si alpha < 1
//            F → nombre arrondi à 4 décimales
//            S → texte brut
//   Toute valeur non résolvable est exportée comme `!UNRESOLVED:<raison>` :
//   le script Node la refuse.

const CHUNK_SIZE = 60;

const fnv1a = (str) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
};

const hex2 = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
const toHex = (c) => {
  const base = '#' + hex2(c.r) + hex2(c.g) + hex2(c.b);
  return c.a !== undefined && c.a < 1 ? base + hex2(c.a) : base;
};
const round4 = (n) => Math.round(n * 10000) / 10000;

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const byId = new Map(variables.map((v) => [v.id, v]));

async function resolve(variable, modeId, depth) {
  if (depth > 10) return '!UNRESOLVED:boucle-alias';
  const raw = variable.valuesByMode[modeId] ?? Object.values(variable.valuesByMode)[0];
  if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') {
    const target = byId.get(raw.id) ?? (await figma.variables.getVariableByIdAsync(raw.id));
    if (!target) return '!UNRESOLVED:alias-introuvable';
    // Une cible d'une autre collection n'a pas le même modeId : on prend son premier mode.
    const targetMode = Object.keys(target.valuesByMode)[0];
    return resolve(target, targetMode, depth + 1);
  }
  if (variable.resolvedType === 'COLOR') return toHex(raw);
  if (variable.resolvedType === 'FLOAT') return String(round4(raw));
  if (variable.resolvedType === 'STRING') {
    return /[\t\n\r]/.test(raw) ? '!UNRESOLVED:caractere-interdit' : String(raw);
  }
  return '!UNRESOLVED:type-' + variable.resolvedType;
}

const TYPE = { COLOR: 'C', FLOAT: 'F', STRING: 'S', BOOLEAN: 'B' };
const manifest = { fileKey: figma.fileKey ?? null, collections: [] };
const chunks = [];

for (const collection of collections) {
  const modeId = collection.modes[0].modeId;
  const lines = [];
  for (const id of collection.variableIds) {
    const v = byId.get(id);
    if (!v) continue;
    lines.push(v.name + '\t' + TYPE[v.resolvedType] + '\t' + (await resolve(v, modeId, 0)));
  }
  manifest.collections.push({
    name: collection.name,
    modes: collection.modes.map((m) => m.name),
    count: lines.length,
  });
  for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
    const tsv = lines.slice(i, i + CHUNK_SIZE).join('\n');
    chunks.push({ index: chunks.length, collection: collection.name, hash: fnv1a(tsv), tsv });
  }
}

manifest.chunkCount = chunks.length;
return { manifest, chunks };
