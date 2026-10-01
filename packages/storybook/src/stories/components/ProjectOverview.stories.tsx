import type { Meta, StoryObj } from '@storybook/react';
import { ProjectOverview } from '@brique-rouge/react';

const meta = {
  title: 'Molécules/ProjectOverview',
  component: ProjectOverview,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=837-19534',
    },
  },
  argTypes: {
    title: {
      description: 'Nom du projet',
      control: 'text',
    },
    tagline: {
      description: 'Accroche affichée après le tiret',
      control: 'text',
    },
    children: {
      description: 'Paragraphe(s) de description — peut contenir des mots mis en avant',
      control: false,
    },
    role: {
      description: 'Rôle occupé sur le projet',
      control: 'text',
    },
    contributions: {
      description: 'Contributions apportées',
      control: 'text',
    },
  },
} satisfies Meta<typeof ProjectOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Défaut',
  args: {
    title: 'Odaptos',
    tagline: "Poser les fondations design d'une plateforme IA B2B SaaS.",
    role: 'Founder Product Designer',
    contributions: 'Sales, Product Strategy, User research, User Experience, Visual Design, Design System, AI usages.',
    children: (
      <p>
        Odaptos est une <span style={{ color: 'var(--color-deep-sea-600)' }}>plateforme SaaS</span> qui met à
        profit l&apos;<span style={{ color: 'var(--color-deep-sea-600)' }}>IA</span> au service de la recherche
        utilisateur. En tant que founder product designer j&apos;ai joué un rôle pivot en menant la refonte de
        la plateforme.
      </p>
    ),
  },
};

export const SansMiseEnAvant: Story = {
  name: 'Sans mots mis en avant',
  args: {
    title: 'BPCE Car Lease',
    tagline: 'Refonte de la plateforme web.',
    role: 'Product Designer',
    contributions: 'Product Strategy, User Experience, Visual Design, Design System.',
    children: (
      <p>
        MyCarlease.fr est une plateforme dédiée aux modes de financement leasing. En tant que Product Designer
        j&apos;ai eu pour responsabilité la conception de la nouvelle expérience utilisateur.
      </p>
    ),
  },
};

export const Playground: Story = {
  args: {
    title: 'Odaptos',
    tagline: "Poser les fondations design d'une plateforme IA B2B SaaS.",
    role: 'Founder Product Designer',
    contributions: 'Sales, Product Strategy, User research.',
    children: <p>Description du projet.</p>,
  },
};
