import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { LogoCompanies } from './LogoCompanies';
import type { LogoCompany, LogoSize } from './LogoCompanies';

describe('LogoCompanies — rendu', () => {
  it('rend avec les valeurs par défaut (squared-icon, 32)', () => {
    render(<LogoCompanies />);
    const logo = screen.getByRole('img', { name: 'Squared Icon' });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-company', 'squared-icon');
    expect(logo).toHaveAttribute('data-size', '32');
  });

  it('expose data-component="ds-br-logo-companies"', () => {
    render(<LogoCompanies />);
    expect(screen.getByRole('img')).toHaveAttribute('data-component', 'ds-br-logo-companies');
  });

  it('accepte une className supplémentaire', () => {
    render(<LogoCompanies className="custom" />);
    expect(screen.getByRole('img')).toHaveClass('custom');
  });

  it('transmet les props HTML au div', () => {
    render(<LogoCompanies id="logo-test" />);
    expect(screen.getByRole('img')).toHaveAttribute('id', 'logo-test');
  });
});

describe('LogoCompanies — entreprises', () => {
  const companies: Array<{ company: LogoCompany; label: string }> = [
    { company: 'bpce', label: 'BPCE' },
    { company: 'conseil-constitutionnel', label: 'Conseil Constitutionnel' },
    { company: 'odaptos', label: 'Odaptos' },
    { company: 'ibp', label: 'iBP' },
    { company: 'vinci', label: 'Vinci' },
    { company: 'tidal', label: 'Tidal' },
    { company: 'squared-icon', label: 'Squared Icon' },
    { company: 'steam', label: 'Steam' },
  ];

  companies.forEach(({ company, label }) => {
    it(`affiche le logo ${label} avec aria-label correct`, () => {
      render(<LogoCompanies company={company} />);
      expect(screen.getByRole('img', { name: label })).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('data-company', company);
    });
  });
});

describe('LogoCompanies — tailles', () => {
  const sizes: LogoSize[] = [32, 16, 12, 8];

  sizes.forEach((size) => {
    it(`expose data-size="${size}"`, () => {
      render(<LogoCompanies size={size} />);
      expect(screen.getByRole('img')).toHaveAttribute('data-size', String(size));
    });
  });
});

describe('LogoCompanies — accessibilité', () => {
  it('squared-icon size 32 : aucune violation axe', async () => {
    const { container } = render(<LogoCompanies company="squared-icon" size={32} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('bpce size 16 : aucune violation axe', async () => {
    const { container } = render(<LogoCompanies company="bpce" size={16} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('tidal size 8 : aucune violation axe', async () => {
    const { container } = render(<LogoCompanies company="tidal" size={8} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('conseil-constitutionnel size 12 : aucune violation axe', async () => {
    const { container } = render(<LogoCompanies company="conseil-constitutionnel" size={12} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
