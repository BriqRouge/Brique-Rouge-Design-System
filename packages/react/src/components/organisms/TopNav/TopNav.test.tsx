import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { TopNav } from './TopNav';

const menu = <button role="menuitem">Item</button>;

describe('TopNav — état homepage', () => {
  it('rend le trigger "Sélection projets" sans bouton retour ni titre', () => {
    render(<TopNav>{menu}</TopNav>);
    expect(screen.getByRole('button', { name: 'Sélection projets' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Accueil' })).not.toBeInTheDocument();
  });

  it('expose data-component="ds-br-top-nav"', () => {
    const { container } = render(<TopNav>{menu}</TopNav>);
    expect(container.firstChild).toHaveAttribute('data-component', 'ds-br-top-nav');
  });

  it("n'a pas de data-project", () => {
    const { container } = render(<TopNav>{menu}</TopNav>);
    expect(container.querySelector('[data-project]')).not.toBeInTheDocument();
  });
});

describe('TopNav — état page projet', () => {
  it('rend le bouton retour, le titre et le sous-titre', () => {
    render(
      <TopNav project="odaptos" title="Odaptos" subtitle="L'IA au service de la recherche utilisateur.">
        {menu}
      </TopNav>
    );
    expect(screen.getByRole('button', { name: 'Accueil' })).toBeInTheDocument();
    expect(screen.getByText('Odaptos')).toBeInTheDocument();
    expect(screen.getByText(/L'IA au service/)).toBeInTheDocument();
  });

  it('expose data-project avec la valeur du projet', () => {
    const { container } = render(
      <TopNav project="bpce" title="BPCE Car Lease">
        {menu}
      </TopNav>
    );
    expect(container.querySelector('[data-project="bpce"]')).toBeInTheDocument();
  });

  it('rend le titre sans sous-titre si non fourni', () => {
    render(
      <TopNav project="ibp" title="iBP">
        {menu}
      </TopNav>
    );
    expect(screen.getByText('iBP')).toBeInTheDocument();
  });

  it('appelle onBackClick au clic sur le bouton retour', async () => {
    const onBackClick = vi.fn();
    render(
      <TopNav project="opco-atlas" title="OPCO Atlas" onBackClick={onBackClick}>
        {menu}
      </TopNav>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Accueil' }));
    expect(onBackClick).toHaveBeenCalledTimes(1);
  });

  it('rend le menu déroulant "Sélection projets" au clic', async () => {
    render(
      <TopNav project="conseil-constitutionnel" title="Conseil Constitutionnel">
        {menu}
      </TopNav>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sélection projets' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

describe('TopNav — props communes', () => {
  it('ajoute une className supplémentaire', () => {
    const { container } = render(<TopNav className="custom">{menu}</TopNav>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('transmet les props HTML au conteneur', () => {
    const { container } = render(<TopNav data-testid="top-nav">{menu}</TopNav>);
    expect(container.firstChild).toHaveAttribute('data-testid', 'top-nav');
  });
});

describe('TopNav — accessibilité axe', () => {
  it('état homepage : aucune violation axe', async () => {
    const { container } = render(<TopNav>{menu}</TopNav>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('état page projet : aucune violation axe', async () => {
    const { container } = render(
      <TopNav project="odaptos" title="Odaptos" subtitle="L'IA au service de la recherche utilisateur.">
        {menu}
      </TopNav>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
