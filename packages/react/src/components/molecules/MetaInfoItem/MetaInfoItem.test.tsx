import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { MetaInfoItem } from './MetaInfoItem';

describe('MetaInfoItem — rendu', () => {
  it('affiche le texte (children)', () => {
    render(<MetaInfoItem icon={<svg />}>Chill à Champs-Sur-Marne</MetaInfoItem>);
    expect(screen.getByText('Chill à Champs-Sur-Marne')).toBeInTheDocument();
  });

  it("affiche l'icône fournie", () => {
    render(
      <MetaInfoItem icon={<svg data-testid="custom-icon" />}>
        Texte
      </MetaInfoItem>
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('expose data-component="ds-br-meta-info-item"', () => {
    const { container } = render(<MetaInfoItem icon={<svg />}>Texte</MetaInfoItem>);
    expect(container.querySelector('[data-component="ds-br-meta-info-item"]')).toBeInTheDocument();
  });

  it('accepte un composant React en icône (ex: LogoCompanies)', () => {
    function FakeLogo() {
      return <img src="/logo.png" alt="Tidal" />;
    }
    render(
      <MetaInfoItem icon={<FakeLogo />}>
        The Sunshine
      </MetaInfoItem>
    );
    expect(screen.getByRole('img', { name: 'Tidal' })).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(
      <MetaInfoItem icon={<svg />} className="custom">
        Texte
      </MetaInfoItem>
    );
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});

describe('MetaInfoItem — accessibilité', () => {
  it('aucune violation axe', async () => {
    const { container } = render(
      <MetaInfoItem icon={<svg aria-hidden="true" />}>Chill à Champs-Sur-Marne</MetaInfoItem>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
