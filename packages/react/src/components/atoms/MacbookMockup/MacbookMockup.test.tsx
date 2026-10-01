import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { MacbookMockup } from './MacbookMockup';

describe('MacbookMockup — rendu', () => {
  it('affiche le contenu (children) dans l\'écran', () => {
    render(
      <MacbookMockup>
        <img src="/screenshot.png" alt="Aperçu du produit" />
      </MacbookMockup>
    );
    expect(screen.getByRole('img', { name: 'Aperçu du produit' })).toBeInTheDocument();
  });

  it('expose data-component="ds-br-macbook-mockup"', () => {
    const { container } = render(<MacbookMockup>Contenu</MacbookMockup>);
    expect(container.querySelector('[data-component="ds-br-macbook-mockup"]')).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(<MacbookMockup className="custom">Contenu</MacbookMockup>);
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });

  it('transmet les props HTML natives', () => {
    const { container } = render(<MacbookMockup data-testid="mockup">Contenu</MacbookMockup>);
    expect(container.querySelector('[data-testid="mockup"]')).toBeInTheDocument();
  });
});

describe('MacbookMockup — accessibilité', () => {
  it('aucune violation axe', async () => {
    const { container } = render(
      <MacbookMockup>
        <img src="/screenshot.png" alt="Aperçu du produit" />
      </MacbookMockup>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
