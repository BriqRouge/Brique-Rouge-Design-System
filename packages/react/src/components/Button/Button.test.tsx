import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button — rendu', () => {
  it('affiche le texte enfant', () => {
    render(<Button>Créer le projet</Button>);
    expect(screen.getByRole('button', { name: 'Créer le projet' })).toBeInTheDocument();
  });

  it('utilise type="button" par défaut', () => {
    render(<Button>Action</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('accepte type="submit"', () => {
    render(<Button type="submit">Envoyer</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('transmet aria-label au bouton', () => {
    render(<Button aria-label="Supprimer le projet" />);
    expect(screen.getByRole('button', { name: 'Supprimer le projet' })).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    render(<Button className="custom-class">Action</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});

describe('Button — data-attributes', () => {
  it('expose data-variant et data-size par défaut', () => {
    render(<Button>Action</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-variant', 'contained');
    expect(btn).toHaveAttribute('data-size', 'nm');
  });

  it('expose data-variant="outlined" et data-size="md"', () => {
    render(<Button variant="outlined" colorScheme="dark" size="md">Action</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-variant', 'outlined');
    expect(btn).toHaveAttribute('data-size', 'md');
  });
});

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
    render(<Button aria-label="Supprimer" leftIcon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeInTheDocument();
  });
});

describe('Button — disabled', () => {
  it('est désactivé quand disabled=true', () => {
    render(<Button disabled>Action</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it("n'appelle pas onClick quand désactivé", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Action</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('Button — interaction', () => {
  it('appelle onClick quand actif', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Action</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('Button — accessibilité', () => {
  it('contained : aucune violation axe', async () => {
    const { container } = render(<Button variant="contained">Créer le projet</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('outlined light : aucune violation axe', async () => {
    const { container } = render(
      <Button variant="outlined" colorScheme="light">Créer le projet</Button>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('outlined dark : aucune violation axe', async () => {
    const { container } = render(
      <Button variant="outlined" colorScheme="dark">Créer le projet</Button>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('disabled : aucune violation axe', async () => {
    const { container } = render(<Button disabled>Créer le projet</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('icon-only avec aria-label : aucune violation axe', async () => {
    const { container } = render(
      <Button aria-label="Supprimer le projet" leftIcon={<svg aria-hidden="true" />} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
