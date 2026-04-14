import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@starter/react';

const meta = {
  title: 'Composants/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Bouton d\u2019action principal du Design System. Supporte deux variants (`contained`, `outlined`) et trois colorSchemes pour les boutons outlined (`default`, `light`, `dark`).",
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined'],
      description: 'Apparence du bouton',
      table: { defaultValue: { summary: 'contained' } },
    },
    colorScheme: {
      control: 'select',
      options: ['default', 'light', 'dark'],
      description: 'Schéma de couleur — ignoré si `variant="contained"`',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['nm', 'md'],
      description: 'Taille du bouton (`nm` = Normal 40px, `md` = Medium 48px)',
      table: { defaultValue: { summary: 'nm' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Désactive le bouton (opacity 0.4)',
      table: { defaultValue: { summary: 'false' } },
    },
    children: {
      control: 'text',
      description: 'Texte du bouton',
    },
  },
  args: {
    children: 'Sélection projets',
    variant: 'contained',
    colorScheme: 'default',
    size: 'nm',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ─────────────────────────────────────────────

export const Playground: Story = {};

// ── Contained ─────────────────────────────────────────────

export const Contained: Story = {
  name: 'Contained',
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Bouton rempli (fond clair, texte gris). Toujours sur fond sombre.',
      },
    },
  },
  args: {
    variant: 'contained',
    children: 'Sélection projets',
  },
};

// ── Outlined ──────────────────────────────────────────────

export const OutlinedLight: Story = {
  name: 'Outlined — light (fonds sombres)',
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story:
          'Bouton contour clair, conçu pour être affiché sur fond sombre. Au survol, il se remplit de `background-button-idle`.',
      },
    },
  },
  args: {
    variant: 'outlined',
    colorScheme: 'light',
    children: 'Sélection projets',
  },
};

export const OutlinedDark: Story = {
  name: 'Outlined — dark (fonds clairs)',
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story:
          'Bouton contour sombre, conçu pour être affiché sur fond clair. Au survol, il se remplit de `background-button-hovered-black`.',
      },
    },
  },
  args: {
    variant: 'outlined',
    colorScheme: 'dark',
    children: 'Sélection projets',
  },
};

// ── Tailles ────────────────────────────────────────────────

export const TailleNm: Story = {
  name: 'Taille — nm (40px)',
  parameters: { backgrounds: { default: 'dark' } },
  args: {
    size: 'nm',
    children: 'Normal',
  },
};

export const TailleMd: Story = {
  name: 'Taille — md (48px)',
  parameters: { backgrounds: { default: 'dark' } },
  args: {
    size: 'md',
    children: 'Medium',
  },
};

// ── États ──────────────────────────────────────────────────

export const Disabled: Story = {
  name: 'État — désactivé',
  parameters: { backgrounds: { default: 'dark' } },
  args: {
    disabled: true,
    children: 'Indisponible',
  },
};

// ── Avec icônes ────────────────────────────────────────────

const IconDownload = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 12L3 7h3V2h4v5h3L8 12Z" />
    <rect x="2" y="13" width="12" height="1.5" rx="0.75" />
  </svg>
);

export const AvecIconeGauche: Story = {
  name: 'Icône — gauche',
  parameters: { backgrounds: { default: 'dark' } },
  args: {
    leftIcon: <IconDownload />,
    children: 'Télécharger',
  },
};

export const AvecIconeDroite: Story = {
  name: 'Icône — droite',
  parameters: { backgrounds: { default: 'dark' } },
  args: {
    rightIcon: <IconDownload />,
    children: 'Télécharger',
  },
};

export const IconeSeule: Story = {
  name: 'Icône — seule',
  parameters: { backgrounds: { default: 'dark' } },
  args: {
    leftIcon: <IconDownload />,
    children: undefined,
    'aria-label': 'Télécharger',
  },
};

// ── Tous les variants ─────────────────────────────────────

export const TousLesVariants: Story = {
  name: 'Tous les variants',
  parameters: {
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        story: "Vue d\u2019ensemble de tous les variants et colorSchemes.",
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="contained" size="nm">Contained nm</Button>
        <Button variant="contained" size="md">Contained md</Button>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="outlined" colorScheme="light" size="nm">Outlined light nm</Button>
        <Button variant="outlined" colorScheme="light" size="md">Outlined light md</Button>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          background: '#f5f5f5',
          padding: '16px',
          borderRadius: '8px',
        }}
      >
        <Button variant="outlined" colorScheme="dark" size="nm">Outlined dark nm</Button>
        <Button variant="outlined" colorScheme="dark" size="md">Outlined dark md</Button>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="contained" disabled size="nm">Désactivé nm</Button>
        <Button variant="outlined" colorScheme="light" disabled size="nm">Désactivé outlined</Button>
      </div>
    </div>
  ),
};
