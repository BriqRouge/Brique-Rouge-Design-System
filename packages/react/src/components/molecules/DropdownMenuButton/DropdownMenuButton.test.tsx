import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { DropdownMenuButton } from './DropdownMenuButton';

const LOGO = '/logo.png';

describe('DropdownMenuButton — rendu', () => {
  it('rend le label (children)', () => {
    render(<DropdownMenuButton company="odaptos">Odaptos</DropdownMenuButton>);
    expect(screen.getByRole('button', { name: /Odaptos/i })).toBeInTheDocument();
  });

  it('expose data-component="ds-br-dropdown-menu-button"', () => {
    render(<DropdownMenuButton company="odaptos">Odaptos</DropdownMenuButton>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-component',
      'ds-br-dropdown-menu-button'
    );
  });

  it('expose data-company quand company est fourni', () => {
    render(<DropdownMenuButton company="bpce">BPCE</DropdownMenuButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-company', 'bpce');
  });

  it('ajoute une className supplémentaire', () => {
    render(
      <DropdownMenuButton company="odaptos" className="custom">
        Odaptos
      </DropdownMenuButton>
    );
    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('transmet les props HTML au bouton', () => {
    render(
      <DropdownMenuButton company="odaptos" data-testid="btn">
        Odaptos
      </DropdownMenuButton>
    );
    expect(screen.getByTestId('btn')).toBeInTheDocument();
  });
});

describe('DropdownMenuButton — logo', () => {
  it('utilise LogoCompanies quand company est fourni', () => {
    render(<DropdownMenuButton company="odaptos">Odaptos</DropdownMenuButton>);
    expect(screen.getByRole('img', { name: 'Odaptos' })).toBeInTheDocument();
  });

  it('utilise src quand company est absent', () => {
    render(
      <DropdownMenuButton src={LOGO} alt="Logo custom">
        Custom
      </DropdownMenuButton>
    );
    expect(screen.getByRole('img', { name: 'Logo custom' })).toHaveAttribute('src', LOGO);
  });

  it('utilise alt vide par défaut avec src', () => {
    const { container } = render(
      <DropdownMenuButton src={LOGO}>Custom</DropdownMenuButton>
    );
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });
});

describe('DropdownMenuButton — état activated', () => {
  it('expose data-activated="false" par défaut', () => {
    render(<DropdownMenuButton company="odaptos">Odaptos</DropdownMenuButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-activated', 'false');
  });

  it('expose data-activated="true" quand activated', () => {
    render(
      <DropdownMenuButton company="odaptos" activated>
        Odaptos
      </DropdownMenuButton>
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-activated', 'true');
  });
});

describe('DropdownMenuButton — right icon', () => {
  it("n'affiche pas l'icône externe par défaut", () => {
    const { container } = render(
      <DropdownMenuButton company="odaptos">Odaptos</DropdownMenuButton>
    );
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it("affiche l'icône externe quand rightIcon={true}", () => {
    const { container } = render(
      <DropdownMenuButton company="ibp" rightIcon>
        iBP
      </DropdownMenuButton>
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('DropdownMenuButton — état disabled', () => {
  it('est désactivé quand disabled', () => {
    render(
      <DropdownMenuButton company="vinci" disabled>
        Vinci
      </DropdownMenuButton>
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('ne déclenche pas onClick quand disabled', async () => {
    const onClick = vi.fn();
    render(
      <DropdownMenuButton company="vinci" disabled onClick={onClick}>
        Vinci
      </DropdownMenuButton>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('DropdownMenuButton — interactions', () => {
  it('déclenche onClick au clic', async () => {
    const onClick = vi.fn();
    render(
      <DropdownMenuButton company="odaptos" onClick={onClick}>
        Odaptos
      </DropdownMenuButton>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('DropdownMenuButton — accessibilité', () => {
  it('état par défaut : aucune violation axe', async () => {
    const { container } = render(
      <DropdownMenuButton company="odaptos">Odaptos</DropdownMenuButton>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('état activated : aucune violation axe', async () => {
    const { container } = render(
      <DropdownMenuButton company="odaptos" activated>
        Odaptos
      </DropdownMenuButton>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('état disabled : aucune violation axe', async () => {
    const { container } = render(
      <DropdownMenuButton company="vinci" disabled>
        Vinci
      </DropdownMenuButton>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('avec rightIcon : aucune violation axe', async () => {
    const { container } = render(
      <DropdownMenuButton company="ibp" activated rightIcon>
        iBP
      </DropdownMenuButton>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('avec src (sans company) : aucune violation axe', async () => {
    const { container } = render(
      <DropdownMenuButton src={LOGO} alt="Logo custom">
        Custom
      </DropdownMenuButton>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
