// style-dictionary.config.js
// Configuration Style Dictionary v4 — Design System Starter
//
// Lis mapping.config.js et génère dynamiquement un fichier CSS par collection.
// Ne modifie ce fichier que si tu as besoin d'un transformer ou d'un format custom.

import StyleDictionary from 'style-dictionary';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mapping from './mapping.config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Commentaire inséré dans les CSS vides ────────────────────────────────
const COMMENT_VIDE =
  '/* Aucun token défini — remplace tokens.json par ton export Figma. Voir Étape 2 dans Storybook. */\n';

// ─── Vérification de l'état de tokens.json ───────────────────────────────
// Si le fichier ne contient que les métadonnées ($schema, _comment),
// on génère des fichiers CSS placeholder et on s'arrête proprement.

const tokensPath = resolve(__dirname, 'tokens.json');
const tokensRaw = readFileSync(tokensPath, 'utf8');
const tokensObj = JSON.parse(tokensRaw);

// Clés considérées comme metadata (non-tokens)
const META_KEYS = new Set(['$schema', '$extensions', '_comment']);
const realKeys = Object.keys(tokensObj).filter((k) => !META_KEYS.has(k));
const hasTokens = realKeys.length > 0;

// Toujours créer le répertoire de build
mkdirSync(resolve(__dirname, 'build/css'), { recursive: true });

if (!hasTokens) {
  // Génère des fichiers CSS placeholder pour chaque collection configurée
  for (const col of mapping.collections) {
    writeFileSync(resolve(__dirname, `build/css/${col.output}`), COMMENT_VIDE);
  }
  // Génère l'index.css qui importe toutes les collections
  const indexContent =
    mapping.collections.map((col) => `@import './${col.output}';`).join('\n') + '\n';
  writeFileSync(resolve(__dirname, 'build/css/index.css'), indexContent);
  writeFileSync(resolve(__dirname, 'build/tokens.json'), '{}\n');
  console.log('ℹ️  tokens.json vide — fichiers CSS placeholder générés dans build/css/');
  process.exit(0);
}

// ─── Parser : supprime les métadonnées racine (Figma, DTCG) ──────────────
StyleDictionary.registerParser({
  name: 'strip-metadata',
  pattern: /\.json$/,
  parser: ({ contents }) => {
    const obj = JSON.parse(contents);
    delete obj.$schema;
    delete obj.$extensions;
    delete obj._comment;
    return obj;
  },
});

// ─── Transformer : couleurs Figma → hex CSS ───────────────────────────────
// Le format Figma Variables exporte les couleurs comme :
// $value: { hex: "#RRGGBB", alpha: 1, components: { r: 255, g: 255, b: 255 } }
// ou comme une simple string "#RRGGBB".
StyleDictionary.registerTransform({
  name: 'color/figma-hex',
  type: 'value',
  filter: (token) => (token.type ?? token.$type) === 'color',
  transform: (token) => {
    const val = token.original?.$value ?? token.$value;

    // Valeur déjà une string (ex: "#FFFFFF")
    if (!val || typeof val !== 'object') return String(val ?? '');

    if (val.hex) {
      // Couleur avec transparence → rgba
      if (typeof val.alpha === 'number' && val.alpha < 1) {
        const r = parseInt(val.hex.slice(1, 3), 16);
        const g = parseInt(val.hex.slice(3, 5), 16);
        const b = parseInt(val.hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${val.alpha})`;
      }
      return val.hex;
    }

    return String(val);
  },
});

// ─── Transformer : nombres → px ou valeur d'opacité brute ────────────────
// Règle : si le chemin du token contient "opacity" → valeur brute (ex: 0.5)
//         sinon → valeur en px (ex: 16px)
StyleDictionary.registerTransform({
  name: 'number/px-or-opacity',
  type: 'value',
  filter: (token) => (token.type ?? token.$type) === 'number',
  transform: (token) => {
    const raw = token.original?.$value ?? token.$value;
    const num = Number(raw);
    const isOpacity = token.path.some((p) => p.toLowerCase().includes('opacity'));
    return isOpacity ? String(num) : `${num}px`;
  },
});

// ─── Format CSS : variables avec suppression du préfixe de collection ─────
// Chaque collection a un préfixe path (ex: ["color", "light"]).
// Ce format le supprime pour générer des noms sémantiques :
// "color-light-background-neutral-default" → "--background-neutral-default"
StyleDictionary.registerFormat({
  name: 'css/variables-stripped',
  format: ({ dictionary, options }) => {
    const { prefixLength = 0, selector = ':root' } = options ?? {};
    const tokens = dictionary.allTokens;

    if (!tokens.length) return COMMENT_VIDE;

    const vars = tokens
      .map((t) => {
        const name = t.path.slice(prefixLength).join('-');
        const value = String(t.value ?? t.$value);
        return `  --${name}: ${value};`;
      })
      .join('\n');

    return [
      '/**',
      ' * Ce fichier est généré automatiquement. Ne pas modifier.',
      ' * Source : packages/tokens/tokens.json',
      ' */',
      '',
      `${selector} {`,
      vars,
      '}',
      '',
    ].join('\n');
  },
});

// ─── Transforms appliqués à toutes les plateformes ───────────────────────
// Les filters sur chaque transformer limitent leur application au bon type.
const VALUE_TRANSFORMS = ['color/figma-hex', 'number/px-or-opacity'];

// ─── Détermine le sélecteur CSS selon le mode de la collection ───────────
function getSelector(collection) {
  if (!collection.mode || collection.mode === 'light') return ':root';
  return `[data-theme="${collection.mode}"]`;
}

// ─── Build : une instance Style Dictionary par collection ─────────────────
for (const col of mapping.collections) {
  const prefixSegments = col.figmaCollection.split('/');
  // stripDepth contrôle combien de segments sont retirés du nom de la variable CSS.
  // Par défaut = nombre de segments dans figmaCollection.
  // Réduire stripDepth conserve plus de contexte dans le nom (ex: --spacing-component-xs).
  const prefixLength = col.stripDepth ?? prefixSegments.length;

  const sd = new StyleDictionary({
    source: [tokensPath],
    parsers: ['strip-metadata'],
    usesDtcg: true,
    // Les collisions sont attendues : chaque plateforme ne garde qu'un sous-ensemble des tokens
    log: { warnings: 'disabled' },
    platforms: {
      [`css/${col.output}`]: {
        transforms: VALUE_TRANSFORMS,
        buildPath: 'build/css/',
        files: [
          {
            destination: col.output,
            format: 'css/variables-stripped',
            // Filtre : inclut uniquement les tokens appartenant à cette collection
            filter: (token) => prefixSegments.every((seg, i) => token.path[i] === seg),
            options: {
              prefixLength,
              selector: getSelector(col),
            },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}

// ─── Build : index.css qui importe toutes les collections ─────────────────
const indexContent =
  mapping.collections.map((col) => `@import './${col.output}';`).join('\n') + '\n';
writeFileSync(resolve(__dirname, 'build/css/index.css'), indexContent);

// ─── Build : tokens.json plat (toutes les collections) ────────────────────
const sdJson = new StyleDictionary({
  source: [tokensPath],
  parsers: ['strip-metadata'],
  usesDtcg: true,
  log: { warnings: 'disabled' },
  platforms: {
    json: {
      transforms: VALUE_TRANSFORMS,
      buildPath: 'build/',
      files: [{ destination: 'tokens.json', format: 'json/nested' }],
    },
  },
});
await sdJson.buildAllPlatforms();

console.log('\n✅ Tokens générés avec succès dans build/css/');
