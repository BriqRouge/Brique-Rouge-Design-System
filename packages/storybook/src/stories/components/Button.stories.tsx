import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@brique-rouge/react';

const meta = {
  title: 'Composants/Button',
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
