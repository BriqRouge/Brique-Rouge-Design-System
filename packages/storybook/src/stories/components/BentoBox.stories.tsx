import type { Meta, StoryObj } from '@storybook/react';
import { BentoBox, ProjectBentoCard, ProjectCardDescription } from '@brique-rouge/react';
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
  title: 'Organismes/BentoBox',
  component: BentoBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2049-20632',
    },
  },
  argTypes: {
    children: {
      description:
        'Cartes ProjectBentoCard, dans l’ordre de lecture : Odaptos, iBP, Conseil constitutionnel (rectangle), CV, BPCE',
      control: false,
    },
  },
  // Marge pour le décalage de la façade des cartes au survol (+8px à droite, -8px en haut)
  decorators: [(Story) => <div style={{ padding: 'var(--spacing-x4)' }}><Story /></div>],
} satisfies Meta<typeof BentoBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const cards = [
  <ProjectBentoCard
    key="odaptos"
    project="odaptos"
    expandOnHover
    hoverChildren={<EmptyHoverVisual />}
    description={
      <ProjectCardDescription project="Odaptos" year="2024" category="Discovery | Product Design | Design System">
        Refonte de la plateforme AI-SaaS
      </ProjectCardDescription>
    }
  >
    <OdaptosVisual />
  </ProjectBentoCard>,
  <ProjectBentoCard
    key="ibp"
    project="ibp"
    hoverChildren={<IbpHoverVisual />}
    description={
      <ProjectCardDescription project="I-BP" year="2023" category="Discovery | Research OPS | Change">
        Industrialiser la User Research
      </ProjectCardDescription>
    }
  >
    <IbpVisual />
  </ProjectBentoCard>,
  <ProjectBentoCard
    key="conseil-constitutionnel"
    project="conseil-constitutionnel"
    shape="rectangle"
    expandOnHover
    description={
      <ProjectCardDescription project="Conseil Constitutionnel" year="2024" category="Discovery | Product Design">
        Conception de l’expérience utilisateur du site web
      </ProjectCardDescription>
    }
  >
    <ConseilConstitutionnelVisual />
  </ProjectBentoCard>,
  <ProjectBentoCard
    key="cv"
    project="cv"
    hoverChildren={<CvHoverVisual />}
    description={<ProjectCardDescription variant="cv">CV</ProjectCardDescription>}
  >
    <CvVisual />
  </ProjectBentoCard>,
  <ProjectBentoCard
    key="bpce"
    project="bpce"
    hoverChildren={<EmptyHoverVisual />}
    description={
      <ProjectCardDescription project="BPCE" year="2024" category="Discovery | Product Design">
        Refonte de la plateforme
        <br />
        MyCarLease
      </ProjectCardDescription>
    }
  >
    <BpceVisual />
  </ProjectBentoCard>,
];

export const Default: Story = {
  name: 'Grille Figma (survolez les cartes)',
  args: { children: cards },
};
