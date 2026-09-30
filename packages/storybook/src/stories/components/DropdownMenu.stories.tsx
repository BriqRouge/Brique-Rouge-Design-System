import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu, DropdownMenuButton } from '@brique-rouge/react';

const meta = {
  title: 'Molécules/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=375-19690',
    },
  },
  argTypes: {
    children: {
      description: 'Contenu du menu — typiquement des <DropdownMenuButton />',
      control: false,
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Défaut',
  args: { children: '' },
  render: () => (
    <DropdownMenu>
      <DropdownMenuButton company="odaptos">Odaptos</DropdownMenuButton>
      <DropdownMenuButton company="bpce">BPCE</DropdownMenuButton>
      <DropdownMenuButton company="ibp" activated>
        iBP
      </DropdownMenuButton>
    </DropdownMenu>
  ),
};

export const AvecItemsDesactives: Story = {
  name: "Avec items désactivés",
  args: { children: '' },
  render: () => (
    <DropdownMenu>
      <DropdownMenuButton company="bpce">BPCE</DropdownMenuButton>
      <DropdownMenuButton company="odaptos" activated>
        Odaptos
      </DropdownMenuButton>
      <DropdownMenuButton company="ibp" disabled>
        Showcase à venir
      </DropdownMenuButton>
      <DropdownMenuButton company="conseil-constitutionnel" disabled>
        Showcase à venir
      </DropdownMenuButton>
      <DropdownMenuButton company="vinci" disabled>
        Showcase à venir
      </DropdownMenuButton>
    </DropdownMenu>
  ),
};

export const UnSeulItem: Story = {
  name: 'Un seul item',
  args: { children: '' },
  render: () => (
    <DropdownMenu>
      <DropdownMenuButton company="odaptos" activated>
        Odaptos
      </DropdownMenuButton>
    </DropdownMenu>
  ),
};

export const Playground: Story = {
  args: { children: '' },
  render: () => (
    <DropdownMenu>
      <DropdownMenuButton company="odaptos">Odaptos</DropdownMenuButton>
      <DropdownMenuButton company="bpce">BPCE</DropdownMenuButton>
      <DropdownMenuButton company="ibp">iBP</DropdownMenuButton>
      <DropdownMenuButton company="vinci" disabled>Showcase à venir</DropdownMenuButton>
      <DropdownMenuButton company="conseil-constitutionnel" disabled>
        Showcase à venir
      </DropdownMenuButton>
    </DropdownMenu>
  ),
};
