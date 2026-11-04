import type { Meta, StoryObj } from '@storybook/react';
import { Link } from '@brique-rouge/react';

/* Icônes Figma « Arrow / Arrow_Left_MD » et « Interface / External_Link », en SVG inline */
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M10 5H8.2C7.08 5 6.52 5 6.09 5.22C5.72 5.41 5.41 5.72 5.22 6.09C5 6.52 5 7.08 5 8.2V15.8C5 16.92 5 17.48 5.22 17.91C5.41 18.28 5.72 18.59 6.09 18.78C6.52 19 7.08 19 8.2 19H15.8C16.92 19 17.48 19 17.91 18.78C18.28 18.59 18.59 18.28 18.78 17.91C19 17.48 19 16.92 19 15.8V14M20 9V4M20 4H15M20 4L13 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const meta = {
  title: 'Atomes/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2326-37384',
    },
  },
  argTypes: {
    children: { description: 'Libellé du lien', control: 'text' },
    href: { description: 'Destination du lien', control: 'text' },
    size: { description: 'Taille', control: 'select', options: ['sm', 'md', 'lg'] },
    theme: {
      description: 'light sur fond clair, dark sur fond sombre',
      control: 'select',
      options: ['light', 'dark'],
    },
    leftIcon: { description: 'Icône à gauche (ReactNode)', control: false },
    rightIcon: { description: 'Icône à droite (ReactNode)', control: false },
    disabled: {
      description: "Lien inactif : sans href, non focalisable, annoncé comme désactivé (aria-disabled)",
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

const darkBackground = {
  display: 'flex',
  gap: '24px',
  alignItems: 'center',
  padding: '24px',
  backgroundColor: 'var(--color-neutral-900)',
} as const;

export const Default: Story = {
  args: {
    children: 'Retour à l’accueil',
    href: '#',
    leftIcon: <ArrowLeftIcon />,
  },
};

export const Tailles: Story = {
  args: { children: 'Lien', href: '#' },
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Link href="#" size="sm" leftIcon={<ArrowLeftIcon />}>Small</Link>
      <Link href="#" size="md" leftIcon={<ArrowLeftIcon />}>Medium</Link>
      <Link href="#" size="lg" leftIcon={<ArrowLeftIcon />}>Large</Link>
    </div>
  ),
};

export const FondSombre: Story = {
  name: 'Fond sombre (theme="dark")',
  args: { children: 'Lire la vidéo', href: '#', theme: 'dark' },
  render: () => (
    <div style={darkBackground}>
      <Link href="#" theme="dark" rightIcon={<ExternalLinkIcon />}>
        Lire la vidéo
      </Link>
      <Link href="#" theme="dark" disabled rightIcon={<ExternalLinkIcon />}>
        Désactivé
      </Link>
    </div>
  ),
};

export const Disabled: Story = {
  name: 'État Disabled',
  args: { children: 'Retour à l’accueil', href: '#', disabled: true, leftIcon: <ArrowLeftIcon /> },
};

export const Playground: Story = {
  args: {
    children: 'Retour à l’accueil',
    href: '#',
    size: 'md',
    theme: 'light',
    disabled: false,
  },
};
