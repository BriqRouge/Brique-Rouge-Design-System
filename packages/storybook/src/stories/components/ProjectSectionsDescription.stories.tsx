import type { Meta, StoryObj } from '@storybook/react';
import {
  ProjectSectionsDescription,
  ProjectSectionDescription,
  AlertBanner,
  Button,
} from '@brique-rouge/react';

const meta = {
  title: 'Organismes/ProjectSectionsDescription',
  component: ProjectSectionsDescription,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=744-20765',
    },
  },
  argTypes: {
    title: {
      description: 'Titre de la carte',
      control: 'text',
    },
    children: {
      description: 'Une ou plusieurs <ProjectSectionDescription /> — séparateur inséré automatiquement entre elles',
      control: false,
    },
  },
} satisfies Meta<typeof ProjectSectionsDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Défaut',
  args: {
    title: 'Design system',
    children: (
      <>
        <ProjectSectionDescription
          number="01"
          title="Problème"
          bulletPoints={[
            "Aucune documentation structurée n'était disponible, laissant les futurs concepteurs sans directives claires.",
            "Les équipes de conception et de développement s'appuyaient fortement sur des connaissances individuelles hétérogènes, ce qui nuisait fortement à la vélocité de production et à la cohérence de l'expérience utilisateur.",
          ]}
          alertBanner={
            <AlertBanner title="Design system v1 disponible" description="Consultez la documentation complète." timestamp="Il y a 5 min.">
              <Button variant="primary" colorScheme="info">
                Découvrir
              </Button>
              <Button variant="secondary" colorScheme="info">
                Découvrir
              </Button>
            </AlertBanner>
          }
        >
          Dans le contexte d&apos;une équipe réduite, le produit ne possédait pas encore de design
          system. L&apos;interface existante manquait de structure et ne répondait pas aux futurs
          besoins d&apos;évolution.
        </ProjectSectionDescription>
        <ProjectSectionDescription
          number="02"
          title="Objectif"
          bulletPoints={[
            'Créer une bibliothèque de composants réutilisables, facile à maintenir et évolutive pour améliorer la communication et gagner en vélocité.',
            'Assurer la cohérence des parcours utilisateurs.',
          ]}
        >
          Dans le contexte d&apos;une équipe réduite, le produit ne possédait pas encore de design
          system. L&apos;interface existante manquait de structure et ne répondait pas aux futurs
          besoins d&apos;évolution.
        </ProjectSectionDescription>
      </>
    ),
  },
};

export const UneSeuleSection: Story = {
  name: 'Une seule section (pas de séparateur)',
  args: {
    title: 'Design system',
    children: (
      <ProjectSectionDescription number="01" title="Problème" bulletPoints={['Premier constat.']}>
        Texte d&apos;introduction de la section.
      </ProjectSectionDescription>
    ),
  },
};

export const SansListeNiBandeau: Story = {
  name: 'Sans liste ni bandeau',
  args: {
    title: 'Design system',
    children: (
      <ProjectSectionDescription number="01" title="Résultat">
        Une section peut se limiter au numéro, au titre et au texte d&apos;introduction.
      </ProjectSectionDescription>
    ),
  },
};
