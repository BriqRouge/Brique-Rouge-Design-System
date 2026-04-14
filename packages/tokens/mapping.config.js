// mapping.config.js
// ─── Le seul fichier à modifier pour adapter le système à tes collections Figma ───
// Ajoute autant d'entrées que tu as de collections dans ton fichier Figma Variables.

export default {
  collections: [
    {
      // Nom exact de la collection dans Figma (sensible à la casse)
      // Correspond au chemin de la clé racine dans tokens.json, séparé par "/"
      figmaCollection: 'color/light',
      // Nom du fichier CSS généré dans packages/tokens/build/css/
      output: 'colors-light.css',
      // Type de tokens : "color" | "number" | "typography"
      type: 'color',
      // Mode Figma si applicable (détermine le sélecteur CSS)
      // "light" → :root | tout autre valeur → [data-theme="<mode>"]
      mode: 'light',
    },
    {
      figmaCollection: 'color/dark',
      output: 'colors-dark.css',
      type: 'color',
      mode: 'dark',
    },
    {
      figmaCollection: 'number',
      output: 'numbers.css',
      type: 'number',
      // Pas de mode → :root
    },
    {
      figmaCollection: 'typography',
      output: 'typography.css',
      type: 'typography',
    },

    // ─── Exemples commentés pour guider le designer ─────────────────────────
    //
    // Collection d'effets (ombres, flous) :
    // {
    //   figmaCollection: 'effect',
    //   output: 'effects.css',
    //   type: 'number',
    // },
    //
    // Deuxième mode de couleur (ex: high contrast) :
    // {
    //   figmaCollection: 'color/high-contrast',
    //   output: 'colors-high-contrast.css',
    //   type: 'color',
    //   mode: 'high-contrast',
    // },
    //
    // Tokens de taille (icônes, composants) :
    // {
    //   figmaCollection: 'size',
    //   output: 'sizes.css',
    //   type: 'number',
    // },
  ],
};
