import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCardDescription } from '@brique-rouge/react';

const meta = {
  title: 'Composants/ProjectCardDescription',
  component: ProjectCardDescription,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=1902-22312',
    },
  },
  argTypes: {
    children: {
      description: 'Titre du projet (contenu principal)',
      control: 'text',
    },
    project: {
      description: 'Nom du projet affiché en haut à gauche',
      control: 'text',
    },
    year: {
      description: 'Année du projet affichée en haut à droite',
      control: 'text',
    },
    category: {
      description: 'Catégorie ou rôle affiché en bas',
      control: 'text',
    },
  },
} satisfies Meta<typeof ProjectCardDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Défaut',
  args: {
    project: 'Odaptos',
    year: '2024',
    category: 'Product Design',
    children: (
      <>
        Refonte de la plateforme
        <br />
        AI-SaaS
      </>
    ),
  },
};

export const TitreLong: Story = {
  name: 'Titre long',
  args: {
    project: 'Conseil constitutionnel',
    year: '2023',
    category: 'UX Research & Product Design',
    children: 'Refonte complète du portail de saisine citoyenne en ligne',
  },
};

export const Playground: Story = {
  args: {
    project: 'BPCE',
    year: '2022',
    category: 'Product Design',
    children: 'Design system bancaire multi-marques',
  },
};
