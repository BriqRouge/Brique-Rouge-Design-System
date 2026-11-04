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
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2248-28967',
    },
  },
  argTypes: {
    number: {
      description: "Numéro de la section affiché avant le titre — absent avec `title` : pas d'en-tête (booléen Figma `Header`)",
      control: 'text',
    },
    title: {
      description: 'Titre de la section — absent : pas de titre (booléen Figma `Subtitle`)',
      control: 'text',
    },
    children: {
      description: "Texte d'introduction de la section — absent : pas d'accroche (booléen Figma `Lead Text`)",
      control: 'text',
    },
    bulletPoints: {
      description: 'Liste à puces optionnelle (booléens Figma `Bullet points list` et `Bullet Point 1–4`) — pas de limite de nombre côté code',
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

export const SansEnTete: Story = {
  name: 'Sans en-tête (citation)',
  args: {
    children:
      "“D'une relecture je sors un résumé, des thématiques, des verbatims. Avec l'IA sur cette partie ça me fait gagner du temps.”",
  },
};

export const NumeroSansTitre: Story = {
  name: 'Numéro sans titre',
  args: {
    number: '02',
    children: "Le booléen Figma `Subtitle` masque le titre en gardant le numéro.",
  },
};

export const SansAccroche: Story = {
  name: "Sans texte d'introduction",
  args: {
    number: '03',
    title: 'Mes objectifs',
    bulletPoints: ['Premier objectif.', 'Deuxième objectif.', 'Troisième objectif.'],
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
