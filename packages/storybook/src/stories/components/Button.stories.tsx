import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@brique-rouge/react';

const meta = {
  title: 'Composants/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
      options: ['nm', 'md'],
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
    children: 'Créer le projet',
    variant: 'contained',
    size: 'nm',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant="contained">Contained</Button>
      <div style={{ background: '#262626', padding: '16px', borderRadius: '8px' }}>
        <Button variant="outlined" colorScheme="light">Outlined light</Button>
      </div>
      <Button variant="outlined" colorScheme="dark">Outlined dark</Button>
    </div>
  ),
};

export const Tailles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="nm">Normal (nm)</Button>
      <Button size="md">Medium (md)</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button disabled variant="contained">Contained désactivé</Button>
      <Button disabled variant="outlined" colorScheme="dark">Outlined désactivé</Button>
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
