import type { Meta, StoryObj } from '@storybook/react';
import { AlertBanner, Button } from '@brique-rouge/react';

const meta = {
  title: 'Molécules/AlertBanner',
  component: AlertBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=755-21871',
    },
  },
  argTypes: {
    type: {
      description: 'Type de bannière — détermine la couleur et l’icône',
      control: 'select',
      options: ['info', 'warning'],
    },
    title: {
      description: 'Titre de la bannière (gras)',
      control: 'text',
    },
    timestamp: {
      description: 'Horodatage optionnel affiché à côté du titre',
      control: 'text',
    },
    description: {
      description: 'Texte descriptif optionnel',
      control: 'text',
    },
    children: {
      description: 'CTA optionnels (ex: <Button />)',
      control: false,
    },
  },
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'info',
    title: 'Mise à jour disponible',
    timestamp: 'Il y a 5 min.',
    description: 'Une nouvelle version est disponible avec des améliorations de performance.',
  },
  render: (args) => (
    <div style={{ width: '641px' }}>
      <AlertBanner {...args} onClose={() => {}}>
        <Button variant="primary" colorScheme="info">Découvrir</Button>
        <Button variant="secondary" colorScheme="info">En savoir plus</Button>
      </AlertBanner>
    </div>
  ),
};

export const Warning: Story = {
  name: 'Type warning',
  args: {
    type: 'warning',
    title: 'Action requise',
    timestamp: 'Il y a 5 min.',
    description: 'Votre abonnement expire bientôt. Renouvelez-le pour continuer à profiter du service.',
  },
  render: (args) => (
    <div style={{ width: '641px' }}>
      <AlertBanner {...args} onClose={() => {}}>
        <Button variant="primary" colorScheme="warning">Renouveler</Button>
        <Button variant="secondary" colorScheme="warning">Plus tard</Button>
      </AlertBanner>
    </div>
  ),
};

export const Minimal: Story = {
  name: 'Minimal (titre seul)',
  args: {
    type: 'info',
    title: 'Enregistrement effectué.',
  },
  render: (args) => (
    <div style={{ width: '641px' }}>
      <AlertBanner {...args} />
    </div>
  ),
};

export const SansFermeture: Story = {
  name: 'Sans bouton de fermeture',
  args: {
    type: 'info',
    title: 'Information permanente',
    description: 'Ce message ne peut pas être fermé par l’utilisateur.',
  },
  render: (args) => (
    <div style={{ width: '641px' }}>
      <AlertBanner {...args} />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    type: 'info',
    title: 'Mise à jour disponible',
    timestamp: 'Il y a 5 min.',
    description: 'Une nouvelle version est disponible avec des améliorations de performance.',
  },
  render: (args) => (
    <div style={{ width: '641px' }}>
      <AlertBanner {...args} onClose={() => {}}>
        <Button variant="primary" colorScheme={args.type === 'warning' ? 'warning' : 'info'}>
          Découvrir
        </Button>
        <Button variant="secondary" colorScheme={args.type === 'warning' ? 'warning' : 'info'}>
          En savoir plus
        </Button>
      </AlertBanner>
    </div>
  ),
};
