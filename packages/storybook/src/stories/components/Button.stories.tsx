import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@brique-rouge/react';

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
  title: 'Atomes/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=1506-20751',
    },
  },
  argTypes: {
    variant: {
      description: 'Style visuel du bouton',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    colorScheme: {
      description: 'Schéma de couleur — ignoré si variant="tertiary" (toujours neutre)',
      control: 'select',
      options: ['neutral', 'info', 'warning', 'success', 'error'],
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
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Découvrir',
    variant: 'primary',
  },
};

export const Variants: Story = {
  args: { children: 'Variants' },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
    </div>
  ),
};

export const SchemasSemantiques: Story = {
  name: 'Schémas sémantiques',
  args: { children: 'Schémas sémantiques' },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary" colorScheme="info">Découvrir</Button>
      <Button variant="secondary" colorScheme="info">Découvrir</Button>
      <Button variant="primary" colorScheme="warning">Découvrir</Button>
      <Button variant="secondary" colorScheme="warning">Découvrir</Button>
      <Button variant="primary" colorScheme="success">Découvrir</Button>
      <Button variant="secondary" colorScheme="success">Découvrir</Button>
      <Button variant="primary" colorScheme="error">Découvrir</Button>
      <Button variant="secondary" colorScheme="error">Découvrir</Button>
    </div>
  ),
};

export const AvecIcones: Story = {
  name: 'Avec icônes',
  args: { children: 'Avec icônes' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="primary" leftIcon={<DownloadIcon />}>Télécharger</Button>
        <Button variant="primary" rightIcon={<MailIcon />}>Contacter</Button>
        <Button variant="primary" leftIcon={<DownloadIcon />} rightIcon={<MailIcon />}>Découvrir</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="secondary" leftIcon={<DownloadIcon />}>Télécharger</Button>
        <Button variant="secondary" rightIcon={<MailIcon />}>Contacter</Button>
        <Button variant="secondary" leftIcon={<DownloadIcon />} rightIcon={<MailIcon />}>Découvrir</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="tertiary" leftIcon={<DownloadIcon />}>Télécharger</Button>
        <Button variant="tertiary" rightIcon={<MailIcon />}>Contacter</Button>
        <Button variant="tertiary" leftIcon={<DownloadIcon />} rightIcon={<MailIcon />}>Découvrir</Button>
      </div>
    </div>
  ),
};

export const IconeSeule: Story = {
  name: 'Icône seule',
  args: { children: null, 'aria-label': 'Télécharger' },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant="primary" aria-label="Télécharger" leftIcon={<DownloadIcon />}>{null}</Button>
      <Button variant="secondary" aria-label="Télécharger" leftIcon={<DownloadIcon />}>{null}</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { children: 'Disabled' },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button disabled variant="primary">Primary désactivé</Button>
      <Button disabled variant="secondary">Secondary désactivé</Button>
      <Button disabled variant="tertiary">Tertiary désactivé</Button>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Découvrir',
    variant: 'primary',
    colorScheme: 'neutral',
    disabled: false,
  },
};
