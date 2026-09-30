import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { AlertBanner } from './AlertBanner';
import { Button } from '../../atoms/Button';

describe('AlertBanner — rendu', () => {
  it('affiche le titre', () => {
    render(<AlertBanner title="Mise à jour disponible" />);
    expect(screen.getByText('Mise à jour disponible')).toBeInTheDocument();
  });

  it('affiche le timestamp si fourni', () => {
    render(<AlertBanner title="Titre" timestamp="Il y a 5 min." />);
    expect(screen.getByText('Il y a 5 min.')).toBeInTheDocument();
  });

  it("n'affiche pas de timestamp par défaut", () => {
    render(<AlertBanner title="Titre" />);
    expect(screen.queryByText(/il y a/i)).not.toBeInTheDocument();
  });

  it('affiche la description si fournie', () => {
    render(<AlertBanner title="Titre" description="Description détaillée." />);
    expect(screen.getByText('Description détaillée.')).toBeInTheDocument();
  });

  it('affiche les CTA (children) si fournis', () => {
    render(
      <AlertBanner title="Titre">
        <Button variant="primary" colorScheme="info">Découvrir</Button>
      </AlertBanner>
    );
    expect(screen.getByRole('button', { name: 'Découvrir' })).toBeInTheDocument();
  });

  it('expose data-component="ds-br-alert-banner"', () => {
    const { container } = render(<AlertBanner title="Titre" />);
    expect(container.querySelector('[data-component="ds-br-alert-banner"]')).toBeInTheDocument();
  });

  it('expose data-type="info" par défaut', () => {
    const { container } = render(<AlertBanner title="Titre" />);
    expect(container.firstChild).toHaveAttribute('data-type', 'info');
  });

  it('expose data-type="warning"', () => {
    const { container } = render(<AlertBanner type="warning" title="Titre" />);
    expect(container.firstChild).toHaveAttribute('data-type', 'warning');
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(<AlertBanner title="Titre" className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });
});

describe('AlertBanner — bouton de fermeture', () => {
  it("n'affiche pas de bouton de fermeture sans onClose", () => {
    render(<AlertBanner title="Titre" />);
    expect(screen.queryByRole('button', { name: 'Fermer' })).not.toBeInTheDocument();
  });

  it('affiche un bouton de fermeture si onClose est fourni', () => {
    render(<AlertBanner title="Titre" onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
  });

  it('appelle onClose au clic', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<AlertBanner title="Titre" onClose={handleClose} />);
    await user.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe('AlertBanner — accessibilité', () => {
  it('info complet : aucune violation axe', async () => {
    const { container } = render(
      <AlertBanner
        type="info"
        title="Mise à jour disponible"
        timestamp="Il y a 5 min."
        description="Description détaillée."
        onClose={() => {}}
      >
        <Button variant="primary" colorScheme="info">Découvrir</Button>
        <Button variant="secondary" colorScheme="info">En savoir plus</Button>
      </AlertBanner>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('warning complet : aucune violation axe', async () => {
    const { container } = render(
      <AlertBanner
        type="warning"
        title="Action requise"
        timestamp="Il y a 5 min."
        description="Description détaillée."
        onClose={() => {}}
      >
        <Button variant="primary" colorScheme="warning">Découvrir</Button>
        <Button variant="secondary" colorScheme="warning">En savoir plus</Button>
      </AlertBanner>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('minimal (titre seul) : aucune violation axe', async () => {
    const { container } = render(<AlertBanner title="Titre" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
