import type { Meta, StoryObj } from '@storybook/react';
import { ProjectBentoCard, ProjectCardDescription } from '@brique-rouge/react';
import { ConseilConstitutionnelVisual } from './ProjectBentoCard.conseilConstitutionnel';

const meta = {
  title: 'Organismes/ProjectBentoCard',
  component: ProjectBentoCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=1759-22825',
    },
  },
  argTypes: {
    project: {
      description: "Projet affiché — détermine la couleur d'accent au survol",
      control: 'select',
      options: ['odaptos', 'bpce', 'ibp', 'conseil-constitutionnel', 'cv'],
    },
    shape: {
      description: "Format de la carte — 'rectangle' est deux fois plus haute",
      control: 'select',
      options: ['square', 'rectangle'],
    },
    expandOnHover: {
      description:
        "S'élargit (276px→576px) au survol en plus du changement de couleur — dans le Figma source, seuls Odaptos et Conseil constitutionnel s'étendent",
      control: 'boolean',
    },
    description: {
      description: 'Description révélée au survol/focus — typiquement un <ProjectCardDescription />',
      control: false,
    },
    children: {
      description: 'Contenu visuel de la carte',
      control: false,
    },
  },
} satisfies Meta<typeof ProjectBentoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const placeholderVisual = (
  <div
    style={{
      width: '80%',
      height: '60%',
      borderRadius: '8px',
      background: 'var(--color-neutral-200)',
    }}
  />
);

export const Default: Story = {
  args: {
    project: 'odaptos',
    expandOnHover: true,
    children: placeholderVisual,
    description: (
      <ProjectCardDescription project="Odaptos" year="2024" category="Product Design">
        Refonte de la plateforme
        <br />
        AI-SaaS
      </ProjectCardDescription>
    ),
  },
};

export const SurvolezPourVoir: Story = {
  name: 'Survolez pour voir (comportement exact par carte)',
  args: { project: 'odaptos', children: placeholderVisual },
  render: () => (
    // Positionnement absolu obligatoire : les cartes avec expandOnHover
    // s'agrandissent au survol (width 276px → 576px). En flux normal
    // (flex/grid), cet agrandissement pousserait les cartes voisines et leur
    // volerait le survol. Le conteneur parent doit être position:relative,
    // chaque carte position:absolute — exactement comme la grille bento
    // réelle du Figma source.
    //
    // Comportement exact du Figma (node 1759:22825) : seules Odaptos (square)
    // et Conseil constitutionnel (rectangle) s'étendent au survol. BPCE et
    // iBP changent seulement de couleur + révèlent leur description à taille
    // fixe. CV change de couleur et transforme son illustration, sans
    // description ni agrandissement.
    <div style={{ position: 'relative', width: '576px', height: '576px' }}>
      <ProjectBentoCard
        project="odaptos"
        expandOnHover
        style={{ position: 'absolute', top: 0, left: 0 }}
        description={
          <ProjectCardDescription project="Odaptos" year="2024" category="Product Design">
            Refonte de la plateforme
            <br />
            AI-SaaS
          </ProjectCardDescription>
        }
      >
        {placeholderVisual}
      </ProjectBentoCard>
      <ProjectBentoCard
        project="bpce"
        style={{ position: 'absolute', top: 0, left: '300px' }}
        description={
          <ProjectCardDescription project="BPCE" year="2024" category="Product Design">
            Refonte de la plateforme
            <br />
            de MyCarLease
          </ProjectCardDescription>
        }
      >
        {placeholderVisual}
      </ProjectBentoCard>
      <ProjectBentoCard
        project="ibp"
        style={{ position: 'absolute', top: '300px', left: 0 }}
        description={
          <ProjectCardDescription project="iBP" year="2024" category="Product | Research OPS">
            Industrialiser la User Research
          </ProjectCardDescription>
        }
      >
        {placeholderVisual}
      </ProjectBentoCard>
      <ProjectBentoCard project="cv" style={{ position: 'absolute', top: '300px', left: '300px' }}>
        {placeholderVisual}
      </ProjectBentoCard>
    </div>
  ),
};

export const FormatRectangle: Story = {
  name: 'Format rectangle (Conseil constitutionnel — visuels réels)',
  args: {
    project: 'conseil-constitutionnel',
    shape: 'rectangle',
    expandOnHover: true,
    children: <ConseilConstitutionnelVisual />,
    description: (
      <ProjectCardDescription project="Conseil constitutionnel" year="2024" category="Product Design">
        Conception de l’expérience
        <br />
        utilisateur du site web
      </ProjectCardDescription>
    ),
  },
};

export const SansDescription: Story = {
  name: 'Sans description (ex: CV)',
  args: {
    project: 'cv',
    children: placeholderVisual,
  },
};

export const Playground: Story = {
  args: {
    project: 'odaptos',
    shape: 'square',
    expandOnHover: true,
    children: placeholderVisual,
    description: (
      <ProjectCardDescription project="Odaptos" year="2024" category="Product Design">
        Refonte de la plateforme
        <br />
        AI-SaaS
      </ProjectCardDescription>
    ),
  },
};
