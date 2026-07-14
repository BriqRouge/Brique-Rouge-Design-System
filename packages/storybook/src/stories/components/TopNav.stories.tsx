import type { Meta, StoryObj } from '@storybook/react';
import { TopNav, DropdownMenuButton } from '@brique-rouge/react';

const meta = {
  title: 'Composants/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=1702-20362',
    },
  },
  argTypes: {
    project: {
      description: 'Projet affiché — détermine la couleur de fond. Absent = état homepage.',
      control: 'select',
      options: [undefined, 'odaptos', 'bpce', 'ibp', 'opco-atlas', 'conseil-constitutionnel'],
    },
    title: {
      description: 'Titre du projet (requis si project est fourni)',
      control: 'text',
    },
    subtitle: {
      description: 'Sous-titre du projet',
      control: 'text',
    },
    onBackClick: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof TopNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <>
    <DropdownMenuButton company="odaptos" activated>Odaptos</DropdownMenuButton>
    <DropdownMenuButton company="bpce">BPCE</DropdownMenuButton>
    <DropdownMenuButton company="ibp">iBP</DropdownMenuButton>
    <DropdownMenuButton company="conseil-constitutionnel" disabled>Showcase à venir</DropdownMenuButton>
  </>
);

export const Homepage: Story = {
  name: 'Homepage (défaut)',
  args: {
    children: items,
  },
};

export const PageProjet: Story = {
  name: 'Page projet',
  args: {
    project: 'odaptos',
    title: 'Odaptos',
    subtitle: "L'IA au service de la recherche utilisateur.",
    children: items,
  },
};

export const TousLesProjets: Story = {
  name: 'Tous les projets',
  args: { children: items },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <TopNav project="odaptos" title="Odaptos" subtitle="L'IA au service de la recherche utilisateur.">
        {items}
      </TopNav>
      <TopNav project="bpce" title="BPCE Car Lease" subtitle="Refonte de la plateforme web">
        {items}
      </TopNav>
      <TopNav project="ibp" title="iBP" subtitle="Implémenter l'Atomic Research.">
        {items}
      </TopNav>
      <TopNav project="opco-atlas" title="OPCO Atlas" subtitle="Lorem ipsum">
        {items}
      </TopNav>
      <TopNav project="conseil-constitutionnel" title="Conseil Constitutionnel" subtitle="Une expérience numérique pour un jeune public">
        {items}
      </TopNav>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    project: 'odaptos',
    title: 'Odaptos',
    subtitle: "L'IA au service de la recherche utilisateur.",
    children: items,
  },
};
