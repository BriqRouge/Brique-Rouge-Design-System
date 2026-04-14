// mapping.config.js
// ─── Le seul fichier à modifier pour adapter le système à tes collections Figma ───
// Correspond aux collections exportées depuis Figma : "primitive" et "semantic".

export default {
  collections: [
    // ─── Tokens sémantiques (à utiliser dans les composants) ──────────────────

    {
      // Couleurs sémantiques : background, text, border
      figmaCollection: 'semantic/color',
      output: 'colors.css',
      type: 'color',
      mode: 'light', // → sélecteur :root
    },
    {
      // Espacements sémantiques : component (xs→xl) et layout (sm→xl)
      // stripDepth:1 → conserve "spacing" dans le nom : --spacing-component-xs
      figmaCollection: 'semantic/spacing',
      output: 'spacing.css',
      type: 'number',
      stripDepth: 1,
    },
    {
      // Typographie sémantique : body, heading, label
      figmaCollection: 'semantic/typography',
      output: 'typography.css',
      type: 'typography',
    },
    {
      // Border-radius sémantiques : sm, md, lg, full
      // stripDepth:1 → conserve "border-radius" dans le nom : --border-radius-sm
      figmaCollection: 'semantic/border-radius',
      output: 'border-radius.css',
      type: 'number',
      stripDepth: 1,
    },

    // ─── Tokens primitifs (palette de référence) ──────────────────────────────

    {
      // Palette de couleurs brutes : neutral, purple-mountain, etc.
      figmaCollection: 'primitive/color',
      output: 'primitive-colors.css',
      type: 'color',
      mode: 'light', // → sélecteur :root
    },
    {
      // Espacements primitifs — stripDepth:1 → --spacing-x1, --spacing-x2…
      figmaCollection: 'primitive/spacing',
      output: 'primitive-spacing.css',
      type: 'number',
      stripDepth: 1,
    },
    {
      // Border-radius primitifs — stripDepth:1 → --border-radius-sm…
      figmaCollection: 'primitive/border-radius',
      output: 'primitive-border-radius.css',
      type: 'number',
      stripDepth: 1,
    },
    {
      // Typographie primitive : font-family, font-size, font-weight, line-height
      figmaCollection: 'primitive/typography',
      output: 'primitive-typography.css',
      type: 'typography',
    },
  ],
};
