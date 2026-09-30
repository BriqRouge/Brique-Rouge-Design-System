import type { Meta, StoryObj } from '@storybook/react';
import { MenuButton } from '@brique-rouge/react';

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M8 2v7.5M4.5 6.5 8 10l3.5-3.5M2.5 12.5h11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m2.5 4.5 5.5 4 5.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const meta = {
  title: 'Atomes/MenuButton',
  component: MenuButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=1345-21426',
    },
  },
  argTypes: {
    variant: {
      description: 'Style visuel du bouton',
      control: 'select',
      options: ['contained', 'outlined'],
    },
    colorScheme: {
      description: 'Schéma de couleur (ignoré si variant="contained")',
      control: 'select',
      options: ['default', 'light', 'dark'],
    },
    size: {
      description: 'Taille du bouton',
      control: 'select',
      options: ['sm', 'nm', 'md'],
    },
    children: {
      description: 'Label du bouton',
      control: 'text',
    },
    disabled: {
      description: 'Désactive le bouton',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof MenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Créer le projet',
    variant: 'contained',
    size: 'nm',
  },
};

export const Variants: Story = {
  args: { children: 'Variants' },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <MenuButton variant="contained">Contained</MenuButton>
      <div style={{ background: '#262626', padding: '16px', borderRadius: '8px' }}>
        <MenuButton variant="outlined" colorScheme="light">Outlined light</MenuButton>
      </div>
      <MenuButton variant="outlined" colorScheme="dark">Outlined dark</MenuButton>
    </div>
  ),
};

export const Tailles: Story = {
  args: { children: 'Tailles' },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <MenuButton size="sm">Small (sm)</MenuButton>
      <MenuButton size="nm">Normal (nm)</MenuButton>
      <MenuButton size="md">Medium (md)</MenuButton>
    </div>
  ),
};

export const AvecIcones: Story = {
  name: 'Avec icônes',
  args: { children: 'Avec icônes' },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <MenuButton leftIcon={<DownloadIcon />}>Télécharger</MenuButton>
      <MenuButton rightIcon={<MailIcon />}>Contacter</MenuButton>
      <MenuButton leftIcon={<DownloadIcon />} rightIcon={<MailIcon />}>Sélection projets</MenuButton>
    </div>
  ),
};

export const IconeSeule: Story = {
  name: 'Icône seule',
  args: { children: null, 'aria-label': 'Ajouter' },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <MenuButton aria-label="Ajouter" size="sm" leftIcon={<PlusIcon />}>{null}</MenuButton>
      <MenuButton aria-label="Ajouter" size="nm" leftIcon={<PlusIcon />}>{null}</MenuButton>
      <MenuButton aria-label="Ajouter" size="md" leftIcon={<PlusIcon />}>{null}</MenuButton>
    </div>
  ),
};

export const Disabled: Story = {
  args: { children: 'Disabled' },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <MenuButton disabled variant="contained">Contained désactivé</MenuButton>
      <MenuButton disabled variant="outlined" colorScheme="dark">Outlined désactivé</MenuButton>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Enregistrer les modifications',
    variant: 'contained',
    colorScheme: 'default',
    size: 'nm',
    disabled: false,
  },
};
