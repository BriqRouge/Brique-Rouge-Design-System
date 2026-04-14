import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

// Ordre de la sidebar : Démarrage → Fondations → Composants
addons.setConfig({
  sidebar: {
    showRoots: true,
  },
});
