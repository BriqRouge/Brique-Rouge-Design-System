import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

// ── Rendu de base ──────────────────────────────────────────

describe('Button — rendu', () => {
  it('affiche le texte enfant', () => {
    render(<Button>Valider</Button>);
    expect(screen.getByRole('button', { name: 'Valider' })).toBeInTheDocument();
  });

  it('utilise type="button" par défaut', () => {
    render(<Button>Ok</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('accepte type="submit"', () => {
    render(<Button type="submit">Envoyer</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('transmet aria-label au bouton', () => {
    render(<Button aria-label="Fermer la modal" />);
    expect(screen.getByRole('button', { name: 'Fermer la modal' })).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    render(<Button className="custom">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });
});

// ── Icônes ─────────────────────────────────────────────────

describe('Button — icônes', () => {
  it('affiche leftIcon', () => {
    render(<Button leftIcon={<svg data-testid="icon-left" />}>Action</Button>);
    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
  });

  it('affiche rightIcon', () => {
    render(<Button rightIcon={<svg data-testid="icon-right" />}>Action</Button>);
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });

  it('peut afficher uniquement une icône sans children', () => {
    render(<Button leftIcon={<svg data-testid="icon-only" />} aria-label="Télécharger" />);
    expect(screen.getByTestId('icon-only')).toBeInTheDocument();
    expect(screen.queryByRole('button')?.textContent?.trim()).toBe('');
  });
});

// ── État désactivé ─────────────────────────────────────────

describe('Button — disabled', () => {
  it('est désactivé quand disabled=true', () => {
    render(<Button disabled>Indisponible</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it("n'appelle pas onClick quand désactivé", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Indisponible
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

// ── Interaction ────────────────────────────────────────────

describe('Button — interaction', () => {
  it('appelle onClick quand actif', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Cliquer</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// ── Accessibilité (jest-axe) ───────────────────────────────

describe('Button — accessibilité', () => {
  it('contained : aucune violation axe', async () => {
    const { container } = render(<Button variant="contained">Valider</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('outlined light : aucune violation axe', async () => {
    const { container } = render(
      <Button variant="outlined" colorScheme="light">
        Annuler
      </Button>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('outlined dark : aucune violation axe', async () => {
    const { container } = render(
      <Button variant="outlined" colorScheme="dark">
        Annuler
      </Button>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('disabled : aucune violation axe', async () => {
    const { container } = render(<Button disabled>Désactivé</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('icon-only avec aria-label : aucune violation axe', async () => {
    const { container } = render(
      <Button leftIcon={<svg aria-hidden="true" />} aria-label="Télécharger" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
