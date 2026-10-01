import type { Meta, StoryObj } from '@storybook/react';
import { MacbookMockup } from '@brique-rouge/react';

const meta = {
  title: 'Atomes/MacbookMockup',
  component: MacbookMockup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=837-19547',
    },
  },
  argTypes: {
    children: {
      description: "Contenu affiché dans l'écran — typiquement une capture d'écran",
      control: false,
    },
  },
} satisfies Meta<typeof MacbookMockup>;

export default meta;
type Story = StoryObj<typeof meta>;

const placeholderScreenshot = (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, var(--color-deep-sea-400), var(--color-deep-sea-600))',
    }}
  />
);

export const Default: Story = {
  name: 'Défaut',
  args: {
    children: placeholderScreenshot,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '842px', height: '512px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Playground: Story = {
  args: {
    children: placeholderScreenshot,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '842px', height: '512px' }}>
        <Story />
      </div>
    ),
  ],
};
