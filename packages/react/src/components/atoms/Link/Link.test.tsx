import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Link } from './Link';

const Icon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M5 12h14" />
  </svg>
);

describe('Link — rendu', () => {
  it('rend un lien avec son libellé', () => {
    render(<Link href="/accueil">Retour à l’accueil</Link>);
    expect(screen.getByRole('link', { name: 'Retour à l’accueil' })).toHaveAttribute('href', '/accueil');
  });

  it('expose data-component, data-size et data-theme (défauts md / light)', () => {
    render(<Link href="#">Lien</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-component', 'ds-br-link');
    expect(link).toHaveAttribute('data-size', 'md');
    expect(link).toHaveAttribute('data-theme', 'light');
  });

  it.each(['sm', 'md', 'lg'] as const)('expose data-size="%s"', (size) => {
    render(
      <Link href="#" size={size}>
        Lien
      </Link>
    );
    expect(screen.getByRole('link')).toHaveAttribute('data-size', size);
  });

  it('expose data-theme="dark"', () => {
    render(
      <Link href="#" theme="dark">
        Lien
      </Link>
    );
    expect(screen.getByRole('link')).toHaveAttribute('data-theme', 'dark');
  });

  it('ajoute une className et transmet les props HTML', () => {
    render(
      <Link href="#" className="custom" target="_blank" rel="noopener noreferrer">
        Lien
      </Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom');
    expect(link).toHaveAttribute('target', '_blank');
  });
});

describe('Link — icônes', () => {
  it("n'affiche aucune icône par défaut", () => {
    const { container } = render(<Link href="#">Lien</Link>);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it("affiche leftIcon et rightIcon, masquées aux lecteurs d'écran", () => {
    const { container } = render(
      <Link href="#" leftIcon={<Icon />} rightIcon={<Icon />}>
        Lien
      </Link>
    );
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
    expect(screen.getByRole('link')).toHaveAccessibleName('Lien');
  });
});

describe('Link — état disabled', () => {
  it('retire le href et expose aria-disabled', () => {
    render(
      <Link href="/accueil" disabled>
        Lien
      </Link>
    );
    const link = screen.getByText('Lien').closest('a');
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('ne déclenche pas onClick quand disabled', async () => {
    const onClick = vi.fn();
    render(
      <Link href="#" disabled onClick={onClick}>
        Lien
      </Link>
    );
    await userEvent.click(screen.getByText('Lien'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Link — interactions', () => {
  it('déclenche onClick au clic', async () => {
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Link href="#" onClick={onClick}>
        Lien
      </Link>
    );
    await userEvent.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('est focalisable au clavier', async () => {
    render(<Link href="#">Lien</Link>);
    await userEvent.tab();
    expect(screen.getByRole('link')).toHaveFocus();
  });
});

describe('Link — accessibilité', () => {
  it('light : aucune violation axe', async () => {
    const { container } = render(
      <Link href="#" leftIcon={<Icon />}>
        Retour à l’accueil
      </Link>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('dark : aucune violation axe', async () => {
    const { container } = render(
      <div style={{ backgroundColor: '#000000' }}>
        <Link href="#" theme="dark" rightIcon={<Icon />}>
          Lire la vidéo
        </Link>
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('disabled : aucune violation axe', async () => {
    const { container } = render(
      <Link href="#" disabled>
        Lien
      </Link>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
