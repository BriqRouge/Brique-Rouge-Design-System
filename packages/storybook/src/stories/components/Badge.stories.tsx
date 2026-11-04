import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@brique-rouge/react';

const meta = {
  title: 'Atomes/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=184-18566',
    },
  },
  argTypes: {
    children: {
      description: 'Contenu textuel du badge',
      control: 'text',
    },
    size: {
      description: 'Taille',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      description: 'Style visuel — contained (fond neutre) ou outlined (bordure et texte clairs, pour fond sombre)',
      control: 'select',
      options: ['contained', 'outlined'],
    },
    leftIcon: {
      description: 'Affiche une icône ronde (indicateur) à gauche',
      control: 'boolean',
    },
    rightIcon: {
      description: 'Affiche une icône de fermeture à droite',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const darkBackground = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  padding: '24px',
  backgroundColor: 'var(--color-neutral-900)',
} as const;

export const Default: Story = {
  args: {
    children: 'Vision',
  },
};

export const Tailles: Story = {
  args: { children: 'Badge' },
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const AvecIcones: Story = {
  name: 'Avec icônes',
  args: {
    children: 'Badge',
    leftIcon: true,
    rightIcon: true,
  },
};

export const Outlined: Story = {
  name: 'Outlined (fond sombre)',
  args: { children: 'Badge', variant: 'outlined' },
  render: () => (
    <div style={darkBackground}>
      <Badge variant="outlined" size="sm">Small</Badge>
      <Badge variant="outlined" size="md" leftIcon>
        Medium
      </Badge>
      <Badge variant="outlined" size="lg" rightIcon>
        Large
      </Badge>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Badge',
    size: 'md',
    variant: 'contained',
    leftIcon: false,
    rightIcon: false,
  },
};
