import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenuButton } from '@brique-rouge/react';

const meta = {
  title: 'Molécules/DropdownMenuButton',
  component: DropdownMenuButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=370-19497',
    },
  },
  argTypes: {
    children: {
      description: 'Nom de la compagnie ou du projet',
      control: 'text',
    },
    company: {
      description: "Identifiant de la compagnie — détermine le logo et la couleur d'accent",
      control: 'select',
      options: ['odaptos', 'bpce', 'ibp', 'vinci', 'conseil-constitutionnel', 'tidal', 'steam', 'squared-icon'],
    },
    src: {
      description: 'URL du logo personnalisé (ignoré si company est fourni)',
      control: 'text',
    },
    alt: {
      description: 'Texte alternatif du logo (ignoré si company est fourni)',
      control: 'text',
    },
    rightIcon: {
      description: "Affiche l'icône de lien externe",
      control: 'boolean',
    },
    activated: {
      description: "Indique si cet item est l'item actif",
      control: 'boolean',
    },
    disabled: {
      description: 'Item non disponible (projet à venir)',
      control: 'boolean',
    },
    hoverLabel: {
      description:
        "Libellé affiché au survol à la place de children (ex : « Showcase à venir ») — toujours annoncé aux lecteurs d'écran",
      control: 'text',
    },
  },
} satisfies Meta<typeof DropdownMenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Odaptos',
    company: 'odaptos',
  },
};

export const Activated: Story = {
  name: 'Activé',
  args: {
    children: 'Odaptos',
    company: 'odaptos',
    activated: true,
  },
};

export const Disabled: Story = {
  name: 'Désactivé (projet à venir)',
  args: {
    children: 'Vinci',
    company: 'vinci',
    disabled: true,
    hoverLabel: 'Showcase à venir',
  },
};

export const CouleursDeMarque: Story = {
  name: 'Couleurs de marque (hover)',
  args: { children: 'Odaptos', company: 'odaptos' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <DropdownMenuButton company="odaptos">Odaptos</DropdownMenuButton>
      <DropdownMenuButton company="bpce">BPCE</DropdownMenuButton>
      <DropdownMenuButton company="ibp">iBP</DropdownMenuButton>
      <DropdownMenuButton company="vinci" disabled hoverLabel="Showcase à venir">Vinci</DropdownMenuButton>
      <DropdownMenuButton company="conseil-constitutionnel" disabled hoverLabel="Showcase à venir">Conseil Cons.</DropdownMenuButton>
    </div>
  ),
};

export const SansCompagnie: Story = {
  name: 'Sans compagnie (Company=none)',
  args: { children: 'Company Name' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <DropdownMenuButton>Company Name</DropdownMenuButton>
      <DropdownMenuButton disabled hoverLabel="Projet à venir">
        Company Name
      </DropdownMenuButton>
    </div>
  ),
};

export const AvecIcone: Story = {
  name: 'Avec icône droite',
  args: { children: 'iBP', company: 'ibp', rightIcon: true },
};

export const Playground: Story = {
  args: {
    children: 'Odaptos',
    company: 'odaptos',
    activated: false,
    rightIcon: false,
    disabled: false,
  },
};
