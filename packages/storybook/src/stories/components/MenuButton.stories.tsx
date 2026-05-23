import type { Meta, StoryObj } from '@storybook/react';
import { MenuButton } from '@brique-rouge/react';

const meta = {
  title: 'Composants/MenuButton',
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
      <MenuButton size="nm">Normal (nm)</MenuButton>
      <MenuButton size="md">Medium (md)</MenuButton>
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
