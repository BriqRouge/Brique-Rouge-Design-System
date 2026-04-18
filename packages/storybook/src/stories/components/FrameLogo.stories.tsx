import type { Meta, StoryObj } from '@storybook/react';
import { FrameLogo } from '@brique-rouge/react';

const LOGO_PLACEHOLDER = 'https://placehold.co/24x24/e5e5e5/737373?text=L';

const meta = {
  title: 'Composants/FrameLogo',
  component: FrameLogo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: {
      description: "URL de l'image du logo",
      control: 'text',
    },
    alt: {
      description: "Texte alternatif pour l'accessibilité",
      control: 'text',
    },
  },
} satisfies Meta<typeof FrameLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: LOGO_PLACEHOLDER,
    alt: "Logo de l'entreprise",
  },
};

export const AvecAlt: Story = {
  name: 'Avec texte alternatif',
  args: {
    src: LOGO_PLACEHOLDER,
    alt: 'Logo Acme Corp',
  },
};

export const Decoratif: Story = {
  name: 'Décoratif (alt vide)',
  args: {
    src: LOGO_PLACEHOLDER,
    alt: '',
  },
};

export const PlusieursLogos: Story = {
  name: 'Plusieurs logos',
  args: { src: LOGO_PLACEHOLDER, alt: 'Logo A' },
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <FrameLogo src={LOGO_PLACEHOLDER} alt="Logo A" />
      <FrameLogo src="https://placehold.co/24x24/d4d4d4/404040?text=B" alt="Logo B" />
      <FrameLogo src="https://placehold.co/24x24/a1a1a1/fafafa?text=C" alt="Logo C" />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    src: LOGO_PLACEHOLDER,
    alt: "Logo de l'entreprise",
  },
};
