// Chargement global des tokens CSS dans Storybook
// Requiert d'avoir lancé `make tokens` au préalable.
import '@starter/tokens/css/index';

import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          'Démarrage',
          [
            'Bienvenue',
            'Étape 1 — Tokens Figma',
            'Étape 2 — Premier composant',
            'Étape 3 — CI-CD',
            'Étape 4 — Code Connect',
          ],
          'Fondations',
          ['Couleurs', 'Typographie', 'Espacements'],
          'Composants',
        ],
      },
    },
  },
};

export default preview;
