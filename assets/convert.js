// convert.js
// Convertit primitive.json + semantic.json (exports Figma API brut)
// en tokens.json au format attendu par Style Dictionary v4.
// Usage : node assets/convert.js

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rgbToHex(r, g, b) {
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function setNested(obj, path, value) {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!cur[path[i]]) cur[path[i]] = {};
    cur = cur[path[i]];
  }
  cur[path[path.length - 1]] = value;
}

function convertVariable(variable, modeKey) {
  const resolved = variable.resolvedValuesByMode[modeKey]?.resolvedValue;
  if (resolved === undefined || resolved === null) return null;

  switch (variable.type) {
    case 'COLOR': {
      const { r, g, b, a } = resolved;
      const hex = rgbToHex(r, g, b);
      return {
        $value: {
          hex,
          alpha: a,
          components: {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
          },
        },
        $type: 'color',
      };
    }
    case 'FLOAT':
      return { $value: resolved, $type: 'number' };
    case 'STRING':
      return { $value: `"${resolved}"`, $type: 'string' };
    default:
      return null;
  }
}

// Nettoie un segment de nom de token pour produire un identifiant CSS valide :
// espaces → tirets, underscores → tirets, minuscules, tirets multiples fusionnés.
function sanitize(segment) {
  return segment
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/[^a-z0-9-]/g, '-');
}

function processCollection(data, collectionName) {
  const result = {};
  const modeKey = Object.keys(data.modes)[0];

  for (const variable of data.variables) {
    const tokenValue = convertVariable(variable, modeKey);
    if (!tokenValue) continue;

    const nameParts = variable.name.split('/').map(sanitize);
    const fullPath = [collectionName, ...nameParts];
    setNested(result, fullPath, tokenValue);
  }

  return result;
}

// ─── Conversion ───────────────────────────────────────────────────────────────

const primitive = JSON.parse(readFileSync(resolve(__dirname, 'primitive.json'), 'utf8'));
const semantic = JSON.parse(readFileSync(resolve(__dirname, 'semantic.json'), 'utf8'));

const tokens = {
  $schema: 'https://raw.githubusercontent.com/tokens-studio/tokens-schema/main/schema.json',
  _comment: 'Généré depuis assets/primitive.json + assets/semantic.json. Ne pas modifier manuellement — relancer node assets/convert.js.',
  ...processCollection(primitive, 'primitive'),
  ...processCollection(semantic, 'semantic'),
};

const outputPath = resolve(__dirname, '../packages/tokens/tokens.json');
writeFileSync(outputPath, JSON.stringify(tokens, null, 2));

console.log('✅ tokens.json généré avec succès dans packages/tokens/');
console.log(`   → ${primitive.variables.length} tokens primitifs`);
console.log(`   → ${semantic.variables.length} tokens sémantiques`);
