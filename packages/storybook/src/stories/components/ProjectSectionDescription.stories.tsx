import type { Meta, StoryObj } from '@storybook/react';
import { ProjectSectionDescription, AlertBanner, Button } from '@brique-rouge/react';

const meta = {
  title: 'Organismes/ProjectSectionDescription',
  component: ProjectSectionDescription,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=744-20765',
    },
  },
  argTypes: {
    number: {
      description: 'Numéro de la section affiché avant le titre',
      control: 'text',
    },
    title: {
      description: 'Titre de la section',
      control: 'text',
    },
    children: {
      description: "Texte d'introduction de la section",
      control: 'text',
    },
    bulletPoints: {
      description: 'Liste à puces optionnelle',
      control: false,
    },
    alertBanner: {
      description: 'Bandeau révélé en bas de la section — typiquement un <AlertBanner />',
      control: false,
    },
  },
} satisfies Meta<typeof ProjectSectionDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Défaut',
  args: {
    number: '01',
    title: 'Problème',
    children:
      "Dans le contexte d'une équipe réduite, le produit ne possédait pas encore de design system. L'interface existante manquait de structure et ne répondait pas aux futurs besoins d'évolution.",
    bulletPoints: [
      "Aucune documentation structurée n'était disponible, laissant les futurs concepteurs sans directives claires.",
      "Les équipes de conception et de développement s'appuyaient fortement sur des connaissances individuelles hétérogènes.",
    ],
  },
};

export const AvecBandeauAlerte: Story = {
  name: "Avec bandeau d'alerte",
  args: {
    number: '02',
    title: 'Objectif',
    children: "Dans le contexte d'une équipe réduite, le produit ne possédait pas encore de design system.",
    bulletPoints: ['Créer une bibliothèque de composants réutilisables.', "Assurer la cohérence des parcours utilisateurs."],
    alertBanner: (
      <AlertBanner title="Design system v1 disponible" description="Consultez la documentation complète." timestamp="Il y a 5 min.">
        <Button variant="primary" colorScheme="info">
          Découvrir
        </Button>
        <Button variant="secondary" colorScheme="info">
          Découvrir
        </Button>
      </AlertBanner>
    ),
  },
};

export const SansListeNiBandeau: Story = {
  name: 'Sans liste ni bandeau',
  args: {
    number: '03',
    title: 'Résultat',
    children: "Une section peut se limiter au numéro, au titre et au texte d'introduction.",
  },
};

export const Playground: Story = {
  args: {
    number: '01',
    title: 'Problème',
    children: "Texte d'introduction de la section.",
    bulletPoints: ['Premier point.', 'Deuxième point.'],
  },
};
