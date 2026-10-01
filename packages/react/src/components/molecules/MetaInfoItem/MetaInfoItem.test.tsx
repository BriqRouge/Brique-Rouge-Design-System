import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { MetaInfoItem } from './MetaInfoItem';

describe('MetaInfoItem — rendu', () => {
  it('affiche le texte (children)', () => {
    render(
      <MetaInfoItem href="https://example.com" icon={<svg />}>
        Chill à Champs-Sur-Marne
      </MetaInfoItem>
    );
    expect(screen.getByText('Chill à Champs-Sur-Marne')).toBeInTheDocument();
  });

  it('est un vrai lien avec href, target et rel sécurisés', () => {
    render(
      <MetaInfoItem href="https://maps.app.goo.gl/YK8WhGouyVoKfdcBA" icon={<svg />}>
        Texte
      </MetaInfoItem>
    );
    const link = screen.getByRole('link', { name: 'Texte' });
    expect(link).toHaveAttribute('href', 'https://maps.app.goo.gl/YK8WhGouyVoKfdcBA');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it("affiche l'icône fournie", () => {
    render(
      <MetaInfoItem href="https://example.com" icon={<svg data-testid="custom-icon" />}>
        Texte
      </MetaInfoItem>
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('expose data-component="ds-br-meta-info-item"', () => {
    const { container } = render(
      <MetaInfoItem href="https://example.com" icon={<svg />}>
        Texte
      </MetaInfoItem>
    );
    expect(container.querySelector('[data-component="ds-br-meta-info-item"]')).toBeInTheDocument();
  });

  it('accepte un composant React en icône (ex: LogoCompanies)', () => {
    function FakeLogo() {
      return <img src="/logo.png" alt="Tidal" />;
    }
    render(
      <MetaInfoItem href="https://example.com" icon={<FakeLogo />}>
        The Sunshine
      </MetaInfoItem>
    );
    expect(screen.getByRole('img', { name: 'Tidal' })).toBeInTheDocument();
  });

  it("n'affiche pas de hoverIcon dans le DOM si non fournie", () => {
    const { container } = render(
      <MetaInfoItem href="https://example.com" icon={<svg data-testid="icon-idle" />}>
        Texte
      </MetaInfoItem>
    );
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('rend hoverIcon dans le DOM (toujours présent, révélé en CSS au survol/focus) quand fournie', () => {
    render(
      <MetaInfoItem
        href="https://example.com"
        icon={<svg data-testid="icon-idle" />}
        hoverIcon={<svg data-testid="icon-hover" />}
      >
        Texte
      </MetaInfoItem>
    );
    expect(screen.getByTestId('icon-idle')).toBeInTheDocument();
    expect(screen.getByTestId('icon-hover')).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(
      <MetaInfoItem href="https://example.com" icon={<svg />} className="custom">
        Texte
      </MetaInfoItem>
    );
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});

describe('MetaInfoItem — accessibilité', () => {
  it('sans hoverIcon : aucune violation axe', async () => {
    const { container } = render(
      <MetaInfoItem href="https://example.com" icon={<svg aria-hidden="true" />}>
        Chill à Champs-Sur-Marne
      </MetaInfoItem>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('avec hoverIcon : aucune violation axe', async () => {
    const { container } = render(
      <MetaInfoItem
        href="https://example.com"
        icon={<svg aria-hidden="true" />}
        hoverIcon={<svg aria-hidden="true" />}
      >
        En train de lire
      </MetaInfoItem>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
