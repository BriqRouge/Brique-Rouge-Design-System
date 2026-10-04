// style-dictionary.config.js
// Configuration Style Dictionary v4 â€” Design System Starter
//
// Lis mapping.config.js et gÃ©nÃ¨re dynamiquement un fichier CSS par collection.
// Ne modifie ce fichier que si tu as besoin d'un transformer ou d'un format custom.

import StyleDictionary from 'style-dictionary';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mapping from './mapping.config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// â”€â”€â”€ Commentaire insÃ©rÃ© dans les CSS vides â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const COMMENT_VIDE =
  '/* Aucun token dÃ©fini â€” remplace tokens.json par ton export Figma. Voir Ã‰tape 2 dans Storybook. */\n';

// â”€â”€â”€ VÃ©rification de l'Ã©tat de tokens.json â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Si le fichier ne contient que les mÃ©tadonnÃ©es ($schema, _comment),
// on gÃ©nÃ¨re des fichiers CSS placeholder et on s'arrÃªte proprement.

const tokensPath = resolve(__dirname, 'tokens.json');
const tokensRaw = readFileSync(tokensPath, 'utf8');
const tokensObj = JSON.parse(tokensRaw);

// ClÃ©s considÃ©rÃ©es comme metadata (non-tokens)
const META_KEYS = new Set(['$schema', '$extensions', '_comment']);
const realKeys = Object.keys(tokensObj).filter((k) => !META_KEYS.has(k));
const hasTokens = realKeys.length > 0;

// Toujours crÃ©er le rÃ©pertoire de build
mkdirSync(resolve(__dirname, 'build/css'), { recursive: true });

if (!hasTokens) {
  // GÃ©nÃ¨re des fichiers CSS placeholder pour chaque collection configurÃ©e
  for (const col of mapping.collections) {
    writeFileSync(resolve(__dirname, `build/css/${col.output}`), COMMENT_VIDE);
  }
  // GÃ©nÃ¨re l'index.css qui importe toutes les collections
  const indexContent =
    mapping.collections.map((col) => `@import './${col.output}';`).join('\n') + '\n';
  writeFileSync(resolve(__dirname, 'build/css/index.css'), indexContent);
  writeFileSync(resolve(__dirname, 'build/tokens.json'), '{}\n');
  console.log('â„¹ï¸  tokens.json vide â€” fichiers CSS placeholder gÃ©nÃ©rÃ©s dans build/css/');
  process.exit(0);
}

// â”€â”€â”€ Parser : supprime les mÃ©tadonnÃ©es racine (Figma, DTCG) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Transformer : couleurs Figma â†’ hex CSS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Le format Figma Variables exporte les couleurs comme :
// $value: { hex: "#RRGGBB", alpha: 1, components: { r: 255, g: 255, b: 255 } }
// ou comme une simple string "#RRGGBB".
StyleDictionary.registerTransform({
  name: 'color/figma-hex',
  type: 'value',
  filter: (token) => (token.type ?? token.$type) === 'color',
  transform: (token) => {
    const val = token.original?.$value ?? token.$value;

    // Valeur dÃ©jÃ  une string (ex: "#FFFFFF")
    if (!val || typeof val !== 'object') return String(val ?? '');

    if (val.hex) {
      // Couleur avec transparence â†’ rgba
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

// â”€â”€â”€ Transformer : nombres â†’ px ou valeur d'opacitÃ© brute â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// RÃ¨gle : si le chemin du token contient "opacity" â†’ valeur brute (ex: 0.5)
//         sinon â†’ valeur en px (ex: 16px)
StyleDictionary.registerTransform({
  name: 'number/px-or-opacity',
  type: 'value',
  filter: (token) => (token.type ?? token.$type) === 'number',
  transform: (token) => {
    const raw = token.original?.$value ?? token.$value;
    const num = Number(raw);
    const isOpacity = token.path.some((p) => p.toLowerCase().includes('opacity'));
    const isRaw = token.path.some((p) => ['font-weight', 'line-height'].includes(p.toLowerCase()));
    return (isOpacity || isRaw) ? String(num) : `${num}px`;
  },
});

// ─── Transformer : font-family → nom entre guillemets + police de secours ──
// Figma stocke le nom seul (ex: "GT Ultra") pour pouvoir appliquer la police ;
// la pile de secours n'existe que côté CSS. Défaut : sans-serif.
const FONT_FALLBACKS = {
  'GT Ultra': 'serif',
};

StyleDictionary.registerTransform({
  name: 'text/font-family-stack',
  type: 'value',
  filter: (token) =>
    (token.type ?? token.$type) === 'text' &&
    token.path.some((p) => p.toLowerCase() === 'font-family'),
  transform: (token) => {
    const family = String(token.original?.$value ?? token.$value);
    return `"${family}", ${FONT_FALLBACKS[family] ?? 'sans-serif'}`;
  },
});

// â”€â”€â”€ Format CSS : variables avec suppression du prÃ©fixe de collection â”€â”€â”€â”€â”€
// Chaque collection a un prÃ©fixe path (ex: ["color", "light"]).
// Ce format le supprime pour gÃ©nÃ©rer des noms sÃ©mantiques :
// "color-light-background-neutral-default" â†’ "--background-neutral-default"
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
      ' * Ce fichier est gÃ©nÃ©rÃ© automatiquement. Ne pas modifier.',
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

// â”€â”€â”€ Transforms appliquÃ©s Ã  toutes les plateformes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Les filters sur chaque transformer limitent leur application au bon type.
const VALUE_TRANSFORMS = ['color/figma-hex', 'number/px-or-opacity', 'text/font-family-stack'];

// â”€â”€â”€ DÃ©termine le sÃ©lecteur CSS selon le mode de la collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getSelector(collection) {
  if (!collection.mode || collection.mode === 'light') return ':root';
  return `[data-theme="${collection.mode}"]`;
}

// â”€â”€â”€ Build : une instance Style Dictionary par collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
for (const col of mapping.collections) {
  const prefixSegments = col.figmaCollection.split('/');
  const prefixLength = prefixSegments.length;

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
            // Filtre : inclut uniquement les tokens appartenant Ã  cette collection
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

// â”€â”€â”€ Build : index.css qui importe toutes les collections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const indexContent =
  mapping.collections.map((col) => `@import './${col.output}';`).join('\n') + '\n';
writeFileSync(resolve(__dirname, 'build/css/index.css'), indexContent);

// â”€â”€â”€ Build : tokens.json plat (toutes les collections) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

console.log('\nâœ… Tokens gÃ©nÃ©rÃ©s avec succÃ¨s dans build/css/');
