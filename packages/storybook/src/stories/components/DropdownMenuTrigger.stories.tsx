import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenuTrigger, DropdownMenuButton } from '@brique-rouge/react';

const meta = {
  title: 'Organismes/DropdownMenuTrigger',
  component: DropdownMenuTrigger,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=379-18464',
    },
  },
  argTypes: {
    triggerLabel: {
      description: 'Label du bouton déclencheur',
      control: 'text',
    },
    triggerVariant: {
      description: 'Variant du bouton trigger',
      control: 'select',
      options: ['contained', 'outlined'],
    },
    triggerColorScheme: {
      description: 'Color scheme du bouton trigger',
      control: 'select',
      options: ['default', 'light', 'dark'],
    },
    triggerSize: {
      description: 'Taille du bouton trigger',
      control: 'select',
      options: ['nm', 'md'],
    },
    open: {
      description: 'État contrôlé (optionnel)',
      control: 'boolean',
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof DropdownMenuTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <>
    <DropdownMenuButton company="odaptos" activated>Odaptos</DropdownMenuButton>
    <DropdownMenuButton company="bpce">BPCE</DropdownMenuButton>
    <DropdownMenuButton company="ibp">iBP</DropdownMenuButton>
    <DropdownMenuButton company="conseil-constitutionnel" disabled>Showcase à venir</DropdownMenuButton>
    <DropdownMenuButton company="vinci" disabled>Showcase à venir</DropdownMenuButton>
  </>
);

export const Default: Story = {
  name: 'Fermé (défaut)',
  args: {
    triggerLabel: 'Sélection projets',
    children: items,
  },
};

export const Ouvert: Story = {
  name: 'Ouvert',
  args: {
    triggerLabel: 'Sélection projets',
    open: true,
    onOpenChange: () => {},
    children: items,
  },
};

export const ModeControle: Story = {
  name: 'Mode contrôlé',
  args: { triggerLabel: 'Sélection projets', children: items },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ fontSize: '14px', color: '#737373' }}>
          État : <strong>{open ? 'ouvert' : 'fermé'}</strong>
        </p>
        <DropdownMenuTrigger
          triggerLabel="Sélection projets"
          open={open}
          onOpenChange={setOpen}
        >
          {items}
        </DropdownMenuTrigger>
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    triggerLabel: 'Sélection projets',
    triggerVariant: 'contained',
    triggerColorScheme: 'default',
    triggerSize: 'nm',
    children: items,
  },
};
