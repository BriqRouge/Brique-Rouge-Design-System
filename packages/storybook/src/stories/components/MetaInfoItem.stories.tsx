import type { Meta, StoryObj } from '@storybook/react';
import { MetaInfoItem, LogoCompanies } from '@brique-rouge/react';

function PlanetIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.59841 12.1079C5.52165 12.8732 6.70714 13.3333 8.00009 13.3333C10.9456 13.3333 13.3334 10.9455 13.3334 8C13.3334 7.62064 13.2938 7.25052 13.2185 6.89357M4.59841 12.1079C3.41837 11.1296 2.66676 9.65257 2.66676 8C2.66676 5.05448 5.05457 2.66667 8.00009 2.66667C10.5662 2.66667 12.7091 4.47902 13.2185 6.89357M4.59841 12.1079C5.90209 11.8098 7.45305 11.1885 9.01735 10.2854C10.8376 9.23448 12.3182 8.00832 13.2185 6.89357M4.59841 12.1079C2.97896 12.4781 1.74106 12.3495 1.3331 11.6429C0.91289 10.9151 1.46421 9.73128 2.66666 8.47266M13.2185 6.89357C14.0531 5.86027 14.389 4.9227 14.0348 4.30916C13.6756 3.68701 12.673 3.51292 11.3331 3.73286"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.33333 13.0001V4.13346C3.33333 3.38673 3.33333 3.01308 3.47866 2.72786C3.60649 2.47698 3.81032 2.27316 4.0612 2.14532C4.34641 2 4.72006 2 5.4668 2H11.6001C11.9735 2 12.1604 2 12.3031 2.07266C12.4285 2.13658 12.5298 2.23849 12.5938 2.36393C12.6664 2.50654 12.6667 2.69336 12.6667 3.06673V10.9334C12.6667 11.3068 12.6664 11.4932 12.5938 11.6358C12.5298 11.7612 12.4286 11.8635 12.3032 11.9274C12.1607 12 11.974 12 11.6014 12H4.83333C4.00491 12 3.33333 12.6716 3.33333 13.5C3.33333 13.7761 3.55719 14 3.83333 14H10.9347C11.3073 14 11.494 14 11.6365 13.9274C11.762 13.8635 11.8632 13.7613 11.9271 13.6359C11.9997 13.4933 12 13.3067 12 12.9333V12"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 6.5332V13.3332M8 13.3332L7.61232 12.7518C7.26781 12.2351 7.09505 11.9759 6.86654 11.7881C6.66341 11.6211 6.4287 11.496 6.17712 11.4196C5.89295 11.3333 5.57996 11.3333 4.95382 11.3333H3.06531C2.69267 11.3333 2.5064 11.3333 2.36393 11.2607C2.23849 11.1968 2.13658 11.0946 2.07266 10.9691C2 10.8265 2 10.6401 2 10.2667V4.40007C2 4.0267 2 3.83987 2.07266 3.69727C2.13658 3.57182 2.23849 3.46991 2.36393 3.406C2.50654 3.33333 2.69304 3.33333 3.06641 3.33333H4.79974C5.91984 3.33333 6.48003 3.33333 6.90785 3.55132C7.28418 3.74307 7.59015 4.04913 7.7819 4.42546C7.99989 4.85328 8 5.4131 8 6.5332C8 5.4131 8 4.85328 8.21799 4.42546C8.40973 4.04913 8.71547 3.74307 9.0918 3.55132C9.51962 3.33333 10.0798 3.33333 11.1999 3.33333H12.9332C13.3066 3.33333 13.4934 3.33333 13.636 3.406C13.7614 3.46991 13.8632 3.57182 13.9271 3.69727C13.9997 3.83987 14 4.0267 14 4.40007V10.2667C14 10.6401 13.9997 10.8265 13.9271 10.9691C13.8632 11.0946 13.7617 11.1968 13.6362 11.2607C13.4937 11.3333 13.3073 11.3333 12.9347 11.3333H11.0462C10.4201 11.3333 10.1064 11.3333 9.82227 11.4196C9.57069 11.496 9.33711 11.6211 9.13399 11.7881C8.90455 11.9767 8.73068 12.2372 8.38336 12.7581L8 13.3332Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: 'Molécules/MetaInfoItem',
  component: MetaInfoItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=837-19518',
    },
  },
  argTypes: {
    href: {
      description: 'URL externe liée (ouvre dans un nouvel onglet)',
      control: 'text',
    },
    icon: {
      description: "Icône affichée à l'état idle — SVG dessiné à la main ou composant (ex: <LogoCompanies />)",
      control: false,
    },
    hoverIcon: {
      description: "Icône affichée au survol/focus si différente de icon (ex: livre fermé → ouvert)",
      control: false,
    },
    children: {
      description: "Texte affiché à droite de l'icône",
      control: 'text',
    },
  },
} satisfies Meta<typeof MetaInfoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Défaut (survolez pour voir la surbrillance)',
  args: {
    href: 'https://maps.app.goo.gl/YK8WhGouyVoKfdcBA',
    icon: <PlanetIcon />,
    children: 'Chill à Champs-Sur-Marne',
  },
};

export const AvecLogoCompanies: Story = {
  name: 'Avec LogoCompanies',
  args: {
    href: 'https://tidal.com/track/340170629/u',
    icon: <LogoCompanies company="tidal" size={16} />,
    children: 'The Sunshine - New Visionaries...',
  },
};

export const AvecIconeDeSurvolDifferente: Story = {
  name: "Avec icône de survol différente (livre fermé → ouvert)",
  args: {
    href: 'https://www.goodreads.com/book/show/214268997-tiny-experiments',
    icon: <BookIcon />,
    hoverIcon: <BookOpenIcon />,
    children: 'En train de lire',
  },
};

export const Liste: Story = {
  name: 'Liste (usage réel — page d’accueil, liens externes réels)',
  args: {
    href: 'https://maps.app.goo.gl/YK8WhGouyVoKfdcBA',
    icon: <PlanetIcon />,
    children: 'Chill à Champs-Sur-Marne',
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '8px 24px' }}>
      <MetaInfoItem href="https://maps.app.goo.gl/YK8WhGouyVoKfdcBA" icon={<PlanetIcon />}>
        Chill à Champs-Sur-Marne
      </MetaInfoItem>
      <MetaInfoItem
        href="https://store.steampowered.com/app/588650/Dead_Cells/"
        icon={<LogoCompanies company="steam" size={16} />}
      >
        Dead Cells
      </MetaInfoItem>
      <MetaInfoItem href="https://tidal.com/track/340170629/u" icon={<LogoCompanies company="tidal" size={16} />}>
        The Sunshine - New Visionaries...
      </MetaInfoItem>
      <MetaInfoItem
        href="https://www.goodreads.com/book/show/214268997-tiny-experiments"
        icon={<BookIcon />}
        hoverIcon={<BookOpenIcon />}
      >
        En train de lire
      </MetaInfoItem>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    href: 'https://maps.app.goo.gl/YK8WhGouyVoKfdcBA',
    icon: <PlanetIcon />,
    children: 'Chill à Champs-Sur-Marne',
  },
};
