import type { Meta, StoryObj } from '@storybook/react';
import { ProjectPageOdaptos } from './ProjectPageOdaptos';

const meta = {
  title: 'Screens/ProjectPageOdaptos',
  component: ProjectPageOdaptos,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Écran d'ouverture de l'étude de cas Odaptos (desktop, 1920 px de référence). Premier test de génération d'écran avec la skill ds-br-screen, à partir d'un brief validé par Damien le 2026-11-17. Composants et tokens du DS uniquement.",
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=837-19524',
    },
  },
  argTypes: {
    onBackClick: { description: "Retour à l'accueil (bouton « Accueil »)", control: false },
  },
} satisfies Meta<typeof ProjectPageOdaptos>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Défaut (desktop)',
};
