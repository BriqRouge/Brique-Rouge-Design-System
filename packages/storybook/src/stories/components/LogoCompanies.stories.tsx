import type { Meta, StoryObj } from '@storybook/react';
import { LogoCompanies } from '@brique-rouge/react';
import type { LogoCompany } from '@brique-rouge/react';

const meta = {
  title: 'Composants/LogoCompanies',
  component: LogoCompanies,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=375-19574',
    },
  },
  argTypes: {
    company: {
      description: 'Identifiant de l\'entreprise',
      control: 'select',
      options: [
        'bpce',
        'conseil-constitutionnel',
        'odaptos',
        'ibp',
        'vinci',
        'tidal',
        'squared-icon',
        'steam',
      ],
    },
    size: {
      description: 'Taille du logo en pixels',
      control: 'select',
      options: [32, 16, 12, 8],
    },
  },
} satisfies Meta<typeof LogoCompanies>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    company: 'squared-icon',
    size: 32,
  },
};

const ALL_COMPANIES: LogoCompany[] = [
  'bpce',
  'conseil-constitutionnel',
  'odaptos',
  'ibp',
  'vinci',
  'tidal',
  'squared-icon',
  'steam',
];

const COMPANY_LABELS: Record<LogoCompany, string> = {
  bpce: 'BPCE',
  'conseil-constitutionnel': 'Conseil Constitutionnel',
  odaptos: 'Odaptos',
  ibp: 'iBP',
  vinci: 'Vinci',
  tidal: 'Tidal',
  'squared-icon': 'Squared Icon',
  steam: 'Steam',
};

export const ToutesLesEntreprises: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
      {ALL_COMPANIES.map((company) => (
        <div
          key={company}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <LogoCompanies company={company} size={32} />
          <span style={{ fontSize: '11px', color: '#737373' }}>{COMPANY_LABELS[company]}</span>
        </div>
      ))}
    </div>
  ),
};

export const Tailles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {([32, 16, 12, 8] as const).map((size) => (
        <div
          key={size}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <LogoCompanies company="squared-icon" size={size} />
          <span style={{ fontSize: '11px', color: '#737373' }}>{size}px</span>
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    company: 'odaptos',
    size: 32,
  },
};
