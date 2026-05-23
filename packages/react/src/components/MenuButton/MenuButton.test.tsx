import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { MenuButton } from './MenuButton';

describe('MenuButton — rendu', () => {
  it('affiche le texte enfant', () => {
    render(<MenuButton>Créer le projet</MenuButton>);
    expect(screen.getByRole('button', { name: 'Créer le projet' })).toBeInTheDocument();
  });

  it('utilise type="button" par défaut', () => {
    render(<MenuButton>Action</MenuButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('accepte type="submit"', () => {
    render(<MenuButton type="submit">Envoyer</MenuButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('transmet aria-label au bouton', () => {
    render(<MenuButton aria-label="Supprimer le projet">{null}</MenuButton>);
    expect(screen.getByRole('button', { name: 'Supprimer le projet' })).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    render(<MenuButton className="custom-class">Action</MenuButton>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});

describe('MenuButton — data-attributes', () => {
  it('expose data-variant et data-size par défaut', () => {
    render(<MenuButton>Action</MenuButton>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-variant', 'contained');
    expect(btn).toHaveAttribute('data-size', 'nm');
  });

  it('expose data-variant="outlined" et data-size="md"', () => {
    render(<MenuButton variant="outlined" colorScheme="dark" size="md">Action</MenuButton>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-variant', 'outlined');
    expect(btn).toHaveAttribute('data-size', 'md');
  });
});

describe('MenuButton — icônes', () => {
  it('affiche leftIcon', () => {
    render(<MenuButton leftIcon={<svg data-testid="icon-left" />}>Action</MenuButton>);
    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
  });

  it('affiche rightIcon', () => {
    render(<MenuButton rightIcon={<svg data-testid="icon-right" />}>Action</MenuButton>);
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });

  it('peut afficher uniquement une icône sans texte', () => {
    render(<MenuButton aria-label="Supprimer" leftIcon={<svg data-testid="icon" />}>{null}</MenuButton>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeInTheDocument();
  });
});

describe('MenuButton — disabled', () => {
  it('est désactivé quand disabled=true', () => {
    render(<MenuButton disabled>Action</MenuButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it("n'appelle pas onClick quand désactivé", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<MenuButton disabled onClick={handleClick}>Action</MenuButton>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('MenuButton — interaction', () => {
  it('appelle onClick quand actif', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<MenuButton onClick={handleClick}>Action</MenuButton>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('MenuButton — accessibilité', () => {
  it('contained : aucune violation axe', async () => {
    const { container } = render(<MenuButton variant="contained">Créer le projet</MenuButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('outlined light : aucune violation axe', async () => {
    const { container } = render(
      <MenuButton variant="outlined" colorScheme="light">Créer le projet</MenuButton>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('outlined dark : aucune violation axe', async () => {
    const { container } = render(
      <MenuButton variant="outlined" colorScheme="dark">Créer le projet</MenuButton>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('disabled : aucune violation axe', async () => {
    const { container } = render(<MenuButton disabled>Créer le projet</MenuButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('icon-only avec aria-label : aucune violation axe', async () => {
    const { container } = render(
      <MenuButton aria-label="Supprimer le projet" leftIcon={<svg aria-hidden="true" />}>{null}</MenuButton>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
