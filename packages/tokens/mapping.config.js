export default {
  collections: [
    {
      figmaCollection: 'primitive',
      output: 'primitive.css',
      type: 'color',
    },
    {
      figmaCollection: 'semantic',
      output: 'semantic.css',
      type: 'color',
    },
    // Collection à deux modes (décision du 2026-11-07) : le mode de base
    // (= mode par défaut dans Figma) est émis dans :root, le second dans
    // @media (width < <breakpoint>), à la fin du même fichier.
    {
      figmaCollection: 'viewport',
      output: 'semantic.css',
      baseMode: 'desktop',
      belowBreakpointMode: 'mobile',
    },
  ],
  // Seuil desktop / mobile : variable number de `primitive`, saisie en px dans
  // Figma, convertie en em (÷ 16) par le build. Jamais émise en variable CSS
  // (une variable CSS n'est pas utilisable dans une media query) : elle produit
  // le @media des collections à modes et le fichier custom-media.css.
  breakpoint: {
    token: 'primitive/breakpoint/desktop',
    customMedia: '--viewport-desktop',
  },
};
