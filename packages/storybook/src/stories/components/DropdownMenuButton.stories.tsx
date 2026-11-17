import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu, DropdownMenuButton } from '@brique-rouge/react';

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
      description:
        'Item courant (Figma `Selected=true`) : fond plein et `aria-current`. À ne pas confondre avec Figma `Type=activated`, qui signifie « disponible »',
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
  name: 'Sélectionné (projet)',
  parameters: {
    docs: {
      description: {
        story:
          'Item courant d’un projet : mêmes tokens que la pastille projet du TopNav (`background/project/accent`, `text/project/on-accent`). Le survol ne le modifie pas.',
      },
    },
  },
  args: {
    children: 'Odaptos',
    company: 'odaptos',
    activated: true,
  },
};

export const ActivatedNeutre: Story = {
  name: 'Sélectionné (Company=none)',
  parameters: {
    docs: {
      description: { story: 'Item courant sans projet : fond et texte inverses (`background/inverse`, `text/inverse`).' },
    },
  },
  args: {
    children: 'Company Name',
    activated: true,
  },
};

export const SelectionDansUnMenu: Story = {
  name: 'Sélection dans un menu',
  parameters: {
    docs: {
      description: {
        story:
          'Un seul item courant par menu. Le fond plein le distingue du survol (subtil) des autres items ; `aria-current` l’annonce aux lecteurs d’écran.',
      },
    },
  },
  args: { children: 'Odaptos', company: 'odaptos' },
  render: () => (
    <DropdownMenu aria-label="Sélection projets">
      <DropdownMenuButton role="menuitem" company="odaptos">Odaptos</DropdownMenuButton>
      <DropdownMenuButton role="menuitem" company="bpce" activated aria-current="page">
        BPCE
      </DropdownMenuButton>
      <DropdownMenuButton role="menuitem" company="ibp">iBP</DropdownMenuButton>
      <DropdownMenuButton role="menuitem" company="vinci" disabled hoverLabel="Showcase à venir">
        Vinci
      </DropdownMenuButton>
    </DropdownMenu>
  ),
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
