import type { Meta, StoryObj } from '@storybook/react';
import { BulletBrique } from '@brique-rouge/react';

const meta = {
  title: 'Molécules/BulletBrique',
  component: BulletBrique,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2131-21897',
    },
  },
  argTypes: {
    children: { description: 'Intitulé de la puce', control: 'text' },
    keywords: {
      description: 'Mots-clés révélés à l’ouverture (survol, focus clavier, clic ou tap), affichés en Badge md',
      control: 'object',
    },
  },
  decorators: [(Story) => <div style={{ width: '494px' }}><Story /></div>],
} satisfies Meta<typeof BulletBrique>;

export default meta;
type Story = StoryObj<typeof meta>;

const KEYWORDS = ['Vision', 'Priorisation', 'Roadmap', 'Objectifs', 'Critères de succès', 'Trade-off décisionnaires'];

export const Default: Story = {
  name: 'Default (survolez, tabulez ou cliquez)',
  args: {
    children: 'J’apporte de la clarté',
    keywords: KEYWORDS,
  },
};

export const Playground: Story = {
  args: {
    children: 'J’apporte de la clarté',
    keywords: ['Vision', 'Roadmap'],
  },
};
