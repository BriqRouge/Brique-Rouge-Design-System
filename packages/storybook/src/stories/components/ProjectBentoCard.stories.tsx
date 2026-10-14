import type { Meta, StoryObj } from '@storybook/react';
import { ProjectBentoCard, ProjectCardDescription } from '@brique-rouge/react';
import { ConseilConstitutionnelVisual } from './ProjectBentoCard.conseilConstitutionnel';
import {
  BpceVisual,
  CvHoverVisual,
  CvVisual,
  EmptyHoverVisual,
  IbpHoverVisual,
  IbpVisual,
  OdaptosVisual,
} from './ProjectBentoCard.visuals';

const meta = {
  title: 'Organismes/ProjectBentoCard',
  component: ProjectBentoCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2032-20121',
    },
  },
  argTypes: {
    project: {
      description: 'Projet affiché — détermine la couleur de la plaque de fond et de la bordure au survol',
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
        "S'élargit (276px→576px) au survol en plus du décalage de la façade — dans le Figma source, seuls Odaptos et Conseil constitutionnel s'étendent",
      control: 'boolean',
    },
    description: {
      description: 'Description révélée au survol/focus en bas de la façade — typiquement un <ProjectCardDescription />',
      control: false,
    },
    children: {
      description: 'Contenu visuel de la carte',
      control: false,
    },
    hoverChildren: {
      description: 'Contenu visuel alternatif révélé au survol/focus, en fondu enchaîné avec children',
      control: false,
    },
  },
  // Marge pour le décalage de la façade au survol (+8px à droite, -8px en haut)
  decorators: [(Story) => <div style={{ padding: 'var(--spacing-x4)' }}><Story /></div>],
} satisfies Meta<typeof ProjectBentoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const odaptosDescription = (
  <ProjectCardDescription project="Odaptos" year="2024" category="Discovery | Product Design | Design System">
    Refonte de la plateforme AI-SaaS
  </ProjectCardDescription>
);

const bpceDescription = (
  <ProjectCardDescription project="BPCE" year="2024" category="Discovery | Product Design">
    Refonte de la plateforme
    <br />
    MyCarLease
  </ProjectCardDescription>
);

const ibpDescription = (
  <ProjectCardDescription project="I-BP" year="2023" category="Discovery | Research OPS | Change">
    Industrialiser la User Research
  </ProjectCardDescription>
);

const conseilConstitutionnelDescription = (
  <ProjectCardDescription project="Conseil Constitutionnel" year="2024" category="Discovery | Product Design">
    Conception de l’expérience utilisateur du site web
  </ProjectCardDescription>
);

const cvDescription = <ProjectCardDescription variant="cv">CV</ProjectCardDescription>;

export const Default: Story = {
  args: {
    project: 'odaptos',
    expandOnHover: true,
    children: <OdaptosVisual />,
    hoverChildren: <EmptyHoverVisual />,
    description: odaptosDescription,
  },
};

export const SurvolezPourVoir: Story = {
  name: 'Survolez pour voir (grille bento, comportement exact par carte)',
  args: { project: 'odaptos', children: <OdaptosVisual /> },
  render: () => (
    // Positionnement absolu obligatoire : les cartes avec expandOnHover
    // s'agrandissent au survol (width 276px → 576px). En flux normal
    // (flex/grid), cet agrandissement pousserait les cartes voisines et leur
    // volerait le survol. Le conteneur parent doit être position:relative,
    // chaque carte position:absolute — exactement comme la grille bento réelle.
    //
    // Comportement exact du Figma (node 2032:20121) : seules Odaptos (square)
    // et Conseil constitutionnel (rectangle) s'étendent au survol. Toutes les
    // cartes décalent leur façade et révèlent la plaque de couleur du projet.
    <div style={{ position: 'relative', width: '1176px', height: '576px' }}>
      <ProjectBentoCard
        project="odaptos"
        expandOnHover
        style={{ position: 'absolute', top: 0, left: 0 }}
        hoverChildren={<EmptyHoverVisual />}
        description={odaptosDescription}
      >
        <OdaptosVisual />
      </ProjectBentoCard>
      <ProjectBentoCard
        project="bpce"
        style={{ position: 'absolute', top: 0, left: '300px' }}
        hoverChildren={<EmptyHoverVisual />}
        description={bpceDescription}
      >
        <BpceVisual />
      </ProjectBentoCard>
      <ProjectBentoCard
        project="ibp"
        style={{ position: 'absolute', top: '300px', left: 0 }}
        hoverChildren={<IbpHoverVisual />}
        description={ibpDescription}
      >
        <IbpVisual />
      </ProjectBentoCard>
      <ProjectBentoCard
        project="cv"
        style={{ position: 'absolute', top: '300px', left: '300px' }}
        hoverChildren={<CvHoverVisual />}
        description={cvDescription}
      >
        <CvVisual />
      </ProjectBentoCard>
      <ProjectBentoCard
        project="conseil-constitutionnel"
        shape="rectangle"
        expandOnHover
        style={{ position: 'absolute', top: 0, left: '600px' }}
        description={conseilConstitutionnelDescription}
      >
        <ConseilConstitutionnelVisual />
      </ProjectBentoCard>
    </div>
  ),
};

export const FormatRectangle: Story = {
  name: 'Format rectangle (Conseil constitutionnel)',
  args: {
    project: 'conseil-constitutionnel',
    shape: 'rectangle',
    expandOnHover: true,
    children: <ConseilConstitutionnelVisual />,
    description: conseilConstitutionnelDescription,
  },
};

export const VisuelAlternatif: Story = {
  name: 'Visuel alternatif au survol (iBP)',
  args: {
    project: 'ibp',
    children: <IbpVisual />,
    hoverChildren: <IbpHoverVisual />,
    description: ibpDescription,
  },
};

export const DescriptionCV: Story = {
  name: 'Description variante CV',
  args: {
    project: 'cv',
    children: <CvVisual />,
    hoverChildren: <CvHoverVisual />,
    description: cvDescription,
  },
};

export const Playground: Story = {
  args: {
    project: 'bpce',
    shape: 'square',
    expandOnHover: false,
    children: <BpceVisual />,
    hoverChildren: <EmptyHoverVisual />,
    description: bpceDescription,
  },
};
