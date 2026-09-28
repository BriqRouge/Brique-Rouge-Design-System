import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button — rendu', () => {
  it('affiche le texte enfant', () => {
    render(<Button>Découvrir</Button>);
    expect(screen.getByRole('button', { name: 'Découvrir' })).toBeInTheDocument();
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
    render(<Button aria-label="Supprimer">{null}</Button>);
    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    render(<Button className="custom-class">Action</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});

describe('Button — data-attributes', () => {
  it('expose data-variant="primary" et data-color-scheme="neutral" par défaut', () => {
    render(<Button>Action</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-variant', 'primary');
    expect(btn).toHaveAttribute('data-color-scheme', 'neutral');
    expect(btn).toHaveAttribute('data-component', 'ds-br-button');
  });

  it('expose data-variant="secondary" et data-color-scheme="info"', () => {
    render(<Button variant="secondary" colorScheme="info">Action</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-variant', 'secondary');
    expect(btn).toHaveAttribute('data-color-scheme', 'info');
  });

  it('expose data-variant="tertiary"', () => {
    render(<Button variant="tertiary">Action</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'tertiary');
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

  it('peut afficher uniquement une icône sans texte', () => {
    render(<Button aria-label="Supprimer" leftIcon={<svg data-testid="icon" />}>{null}</Button>);
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
  it('primary neutral : aucune violation axe', async () => {
    const { container } = render(<Button>Découvrir</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('secondary neutral : aucune violation axe', async () => {
    const { container } = render(<Button variant="secondary">Découvrir</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('tertiary : aucune violation axe', async () => {
    const { container } = render(<Button variant="tertiary">Découvrir</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('primary info : aucune violation axe', async () => {
    const { container } = render(
      <Button variant="primary" colorScheme="info">Découvrir</Button>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('secondary warning : aucune violation axe', async () => {
    const { container } = render(
      <Button variant="secondary" colorScheme="warning">Découvrir</Button>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('primary success : aucune violation axe', async () => {
    const { container } = render(
      <Button variant="primary" colorScheme="success">Découvrir</Button>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('secondary error : aucune violation axe', async () => {
    const { container } = render(
      <Button variant="secondary" colorScheme="error">Découvrir</Button>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('disabled : aucune violation axe', async () => {
    const { container } = render(<Button disabled>Découvrir</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('icon-only avec aria-label : aucune violation axe', async () => {
    const { container } = render(
      <Button aria-label="Supprimer" leftIcon={<svg aria-hidden="true" />}>{null}</Button>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
