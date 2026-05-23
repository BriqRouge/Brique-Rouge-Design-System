// Chargement global des tokens CSS dans Storybook
// Requiert d'avoir lancÃ© `make tokens` au prÃ©alable.
import '@brique-rouge/tokens/css/index';

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
          'DÃ©marrage',
          [
            'Bienvenue',
            'Ã‰tape 1 â€” Tokens Figma',
            'Ã‰tape 2 â€” Premier composant',
            'Ã‰tape 3 â€” CI-CD',
            'Ã‰tape 4 â€” Code Connect',
          ],
          'Fondations',
          ['Couleurs', 'Typographie', 'Espacements', 'Dimensions'],
          'Composants',
        ],
      },
    },
  },
};

export default preview;
