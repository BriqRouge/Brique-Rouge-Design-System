import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from '@brique-rouge/react';

const meta = {
  title: 'Atomes/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=184-18522',
    },
  },
  argTypes: {
    children: {
      description: 'Contenu textuel du tag',
      control: 'text',
    },
    size: {
      description: 'Taille',
      control: 'select',
      options: ['sm', 'nm', 'md', 'lg'],
    },
    variant: {
      description: 'Style visuel — contained (fond neutre) ou outlined (bordure seule)',
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
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Défaut',
  args: {
    children: 'Tag',
    size: 'nm',
    variant: 'contained',
  },
};

export const Tailles: Story = {
  name: 'Toutes les tailles',
  args: { children: 'Tag' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Tag {...args} size="sm" />
      <Tag {...args} size="nm" />
      <Tag {...args} size="md" />
      <Tag {...args} size="lg" />
    </div>
  ),
};

export const AvecIcones: Story = {
  name: 'Avec icônes',
  args: {
    children: 'Tag',
    leftIcon: true,
    rightIcon: true,
  },
};

export const Outlined: Story = {
  name: 'Outlined',
  args: {
    children: 'Tag',
    variant: 'outlined',
    leftIcon: true,
    rightIcon: true,
  },
};

export const Playground: Story = {
  args: {
    children: 'Tag',
    size: 'nm',
    variant: 'contained',
    leftIcon: false,
    rightIcon: false,
  },
};
