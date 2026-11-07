// style-dictionary.config.js
// Configuration Style Dictionary v4 — Design System Starter
//
// Lis mapping.config.js et génère dynamiquement un fichier CSS par collection.
// Ne modifie ce fichier que si tu as besoin d'un transformer ou d'un format custom.

import StyleDictionary from 'style-dictionary';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mapping from './mapping.config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Commentaire inséré dans les CSS vides ────────────────────────────────
const COMMENT_VIDE =
  '/* Aucun token défini — remplace tokens.json par ton export Figma. Voir Étape 1 dans Storybook. */\n';

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
    [...new Set(mapping.collections.map((col) => col.output))].map((output) => `@import './${output}';`).join('\n') + '\n';
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
//         si le chemin contient "duration" → valeur en ms (ex: 150ms)
//         sinon → valeur en px (ex: 16px)
// Fonction partagée : appliquée à $value par le transformer, et aux valeurs des
// autres modes (qui ne passent pas par les transformers) par le format CSS.
function numberToCss(path, raw) {
  const token = { path };
  {
    const num = Number(raw);
    const isOpacity = token.path.some((p) => p.toLowerCase().includes('opacity'));
    // font-weight : toujours brut.
    // line-height : brut uniquement pour les ratios nommés (tight, normal, loose) ;
    // tout le reste est en px — l'échelle x… (primitive) comme les tokens
    // sémantiques (ex: typography/body/line-height), qui pointent vers cette
    // échelle dans Figma.
    const LINE_HEIGHT_RATIOS = ['tight', 'normal', 'loose'];
    const lastSegment = token.path[token.path.length - 1].toLowerCase();
    const isFontWeight = token.path.some((p) => p.toLowerCase() === 'font-weight');
    const isLineHeightRatio =
      token.path.some((p) => p.toLowerCase() === 'line-height') &&
      LINE_HEIGHT_RATIOS.includes(lastSegment);
    if (token.path.some((p) => p.toLowerCase() === 'duration')) return `${num}ms`;
    return (isOpacity || isFontWeight || isLineHeightRatio) ? String(num) : `${num}px`;
  }
}

StyleDictionary.registerTransform({
  name: 'number/px-or-opacity',
  type: 'value',
  filter: (token) => (token.type ?? token.$type) === 'number',
  transform: (token) => numberToCss(token.path, token.original?.$value ?? token.$value),
});

// ─── Transformer : font-family → nom entre guillemets + police de secours ──
// Figma stocke le nom seul (ex: "GT Ultra") pour pouvoir appliquer la police ;
// la pile de secours n'existe que côté CSS. Défaut : sans-serif.
const FONT_FALLBACKS = {
  'GT Ultra': 'serif',
  'GT Ultra Median': 'serif',
};

StyleDictionary.registerTransform({
  name: 'text/font-family-stack',
  type: 'value',
  filter: (token) =>
    (token.type ?? token.$type) === 'text' &&
    token.path.some((p) => p.toLowerCase() === 'font-family'),
  transform: (token) => fontStack(token.original?.$value ?? token.$value),
});

function fontStack(raw) {
  const family = String(raw);
  return `"${family}", ${FONT_FALLBACKS[family] ?? 'sans-serif'}`;
}

// ─── Valeurs des modes autres que le mode de base ────────────────────────
// Portées par $extensions (voir MODES_EXTENSION dans
// scripts/figma-sync-tokens.mjs) : elles ne passent pas par les transformers
// Style Dictionary, on leur applique donc les mêmes fonctions ici.
const MODES_EXTENSION = 'brique-rouge.modes';

function modeValueToCss(token, raw) {
  const type = token.type ?? token.$type;
  if (type === 'number') return numberToCss(token.path, raw);
  if (type === 'text' && token.path.some((p) => p.toLowerCase() === 'font-family')) return fontStack(raw);
  return String(raw);
}

// ─── Format CSS : variables avec suppression du préfixe de collection ─────
// Chaque collection a un préfixe path (ex: ["color", "light"]).
// Ce format le supprime pour générer des noms sémantiques :
// "color-light-background-neutral-default" → "--background-neutral-default"
//
// Option `belowBreakpoint` ({ mode, media }) : ajoute après le bloc de base un
// bloc `@media <media> { :root { … } }` avec les valeurs de ce mode.
// Option `header: false` : pas de commentaire d'en-tête (bloc ajouté à la
// suite d'un autre dans le même fichier).
StyleDictionary.registerFormat({
  name: 'css/variables-stripped',
  format: ({ dictionary, options }) => {
    const { prefixLength = 0, selector = ':root', belowBreakpoint, header = true } = options ?? {};
    const tokens = dictionary.allTokens;

    if (!tokens.length) return COMMENT_VIDE;

    const cssName = (t) => t.path.slice(prefixLength).join('-');
    const vars = tokens
      .map((t) => `  --${cssName(t)}: ${String(t.value ?? t.$value)};`)
      .join('\n');

    const lines = header
      ? [
          '/**',
          ' * Ce fichier est généré automatiquement. Ne pas modifier.',
          ' * Source : packages/tokens/tokens.json',
          ' */',
          '',
        ]
      : [''];
    lines.push(`${selector} {`, vars, '}', '');

    if (belowBreakpoint) {
      const modeVars = tokens
        .filter((t) => t.original?.$extensions?.[MODES_EXTENSION]?.[belowBreakpoint.mode] !== undefined)
        .map((t) => {
          const raw = t.original.$extensions[MODES_EXTENSION][belowBreakpoint.mode];
          return `    --${cssName(t)}: ${modeValueToCss(t, raw)};`;
        });
      if (modeVars.length) {
        lines.push(`@media ${belowBreakpoint.media} {`, `  ${selector} {`, ...modeVars, '  }', '}', '');
      }
    }

    return lines.join('\n');
  },
});

// ─── Transforms appliqués à toutes les plateformes ───────────────────────
// Les filters sur chaque transformer limitent leur application au bon type.
const VALUE_TRANSFORMS = ['color/figma-hex', 'number/px-or-opacity', 'text/font-family-stack'];

// ─── Détermine le sélecteur CSS selon le mode de la collection ───────────
function getSelector(collection) {
  if (!collection.mode || collection.mode === 'light') return ':root';
  return `[data-theme="${collection.mode}"]`;
}

// ─── Breakpoint : token primitive en px → em ─────────────────────────────
// Lu dans tokens.json ; jamais émis en variable CSS (voir mapping.config.js).
const breakpointPath = mapping.breakpoint?.token.split('/') ?? null;
let breakpointMedia = null;
if (breakpointPath) {
  const px = breakpointPath.reduce((node, seg) => node?.[seg], tokensObj)?.$value;
  if (typeof px !== 'number') {
    throw new Error(`Breakpoint introuvable dans tokens.json : ${mapping.breakpoint.token} (variable number attendue)`);
  }
  breakpointMedia = { em: `${px / 16}em` };
}
const isBreakpointToken = (token) =>
  breakpointPath !== null &&
  token.path.length === breakpointPath.length &&
  breakpointPath.every((seg, i) => token.path[i] === seg);

// ─── Build : une instance Style Dictionary par collection ─────────────────
// Plusieurs collections peuvent partager un fichier de sortie (viewport →
// semantic.css) : chacune est écrite dans un fichier intermédiaire, puis les
// morceaux sont concaténés dans l'ordre de mapping.config.js.
const PARTS_DIR = 'build/css/.parts/';
const parts = new Map(); // output → [fichiers intermédiaires]

for (const col of mapping.collections) {
  const prefixSegments = col.figmaCollection.split('/');
  const prefixLength = prefixSegments.length;
  const isFirstOfOutput = !parts.has(col.output);
  const partFile = `${col.figmaCollection.replace(/\//g, '-')}.css`;
  if (isFirstOfOutput) parts.set(col.output, []);
  parts.get(col.output).push(partFile);

  if (col.belowBreakpointMode && !breakpointMedia) {
    throw new Error(`Collection « ${col.figmaCollection} » : belowBreakpointMode sans breakpoint dans mapping.config.js`);
  }

  const sd = new StyleDictionary({
    source: [tokensPath],
    parsers: ['strip-metadata'],
    usesDtcg: true,
    // Les collisions sont attendues : chaque plateforme ne garde qu'un sous-ensemble des tokens
    log: { warnings: 'disabled' },
    platforms: {
      [`css/${col.output}`]: {
        transforms: VALUE_TRANSFORMS,
        buildPath: PARTS_DIR,
        files: [
          {
            destination: partFile,
            format: 'css/variables-stripped',
            // Filtre : inclut uniquement les tokens appartenant à cette
            // collection (le breakpoint n'est jamais une variable CSS)
            filter: (token) =>
              prefixSegments.every((seg, i) => token.path[i] === seg) && !isBreakpointToken(token),
            options: {
              prefixLength,
              selector: getSelector(col),
              header: isFirstOfOutput,
              belowBreakpoint: col.belowBreakpointMode
                ? { mode: col.belowBreakpointMode, media: `(width < ${breakpointMedia.em})` }
                : undefined,
            },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}

for (const [output, files] of parts) {
  const content = files.map((f) => readFileSync(resolve(__dirname, PARTS_DIR, f), 'utf8')).join('');
  writeFileSync(resolve(__dirname, 'build/css', output), content);
}
rmSync(resolve(__dirname, PARTS_DIR), { recursive: true, force: true });

// ─── Build : custom-media.css — media queries nommées ─────────────────────
// À importer en tête de chaque CSS Module qui en a besoin ; résolu au build
// du consommateur par postcss-custom-media (@custom-media n'est pas encore
// supporté nativement par les navigateurs).
if (breakpointMedia) {
  writeFileSync(
    resolve(__dirname, 'build/css/custom-media.css'),
    [
      '/**',
      ' * Ce fichier est généré automatiquement. Ne pas modifier.',
      ` * Source : packages/tokens/tokens.json (${mapping.breakpoint.token})`,
      ' * Résolu par postcss-custom-media : ne produit aucune règle CSS.',
      ' */',
      '',
      `@custom-media ${mapping.breakpoint.customMedia} (width >= ${breakpointMedia.em});`,
      '',
    ].join('\n'),
  );
}

// ─── Build : index.css qui importe toutes les collections ─────────────────
const indexContent =
  [...parts.keys()].map((output) => `@import './${output}';`).join('\n') + '\n';
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

// ─── Build : modes.json — valeurs CSS des modes hors base + breakpoint ────
// json/nested ne garde que $value : ce fichier complète build/tokens.json pour
// generate-specs.mjs (fiches specs/ lisibles sans lancer de build).
const modes = {};
(function walk(node, path) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || key === '_comment' || !value || typeof value !== 'object') continue;
    const next = [...path, key];
    if ('$value' in value) {
      for (const [mode, raw] of Object.entries(value.$extensions?.[MODES_EXTENSION] ?? {})) {
        (modes[next.join('/')] ??= {})[mode] = modeValueToCss({ path: next, $type: value.$type }, raw);
      }
    } else {
      walk(value, next);
    }
  }
})(tokensObj, []);
writeFileSync(
  resolve(__dirname, 'build/modes.json'),
  JSON.stringify(
    {
      breakpoint: breakpointMedia
        ? { token: mapping.breakpoint.token, em: breakpointMedia.em, customMedia: mapping.breakpoint.customMedia }
        : null,
      collections: mapping.collections
        .filter((c) => c.baseMode)
        .map((c) => ({ name: c.figmaCollection, baseMode: c.baseMode, belowBreakpointMode: c.belowBreakpointMode })),
      modes,
    },
    null,
    2,
  ) + '\n',
);

console.log('\n✅ Tokens générés avec succès dans build/css/');
