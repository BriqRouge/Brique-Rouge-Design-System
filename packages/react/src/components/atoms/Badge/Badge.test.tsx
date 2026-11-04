import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

const query = (container: HTMLElement) => container.querySelector('[data-component="ds-br-badge"]');

describe('Badge — rendu', () => {
  it('affiche le contenu (children)', () => {
    render(<Badge>Vision</Badge>);
    expect(screen.getByText('Vision')).toBeInTheDocument();
  });

  it('expose data-component="ds-br-badge"', () => {
    const { container } = render(<Badge>Badge</Badge>);
    expect(query(container)).toBeInTheDocument();
  });

  it('size="md" et variant="contained" par défaut', () => {
    const { container } = render(<Badge>Badge</Badge>);
    expect(query(container)).toHaveAttribute('data-size', 'md');
    expect(query(container)).toHaveAttribute('data-variant', 'contained');
  });

  it.each(['sm', 'md', 'lg'] as const)('expose data-size="%s"', (size) => {
    const { container } = render(<Badge size={size}>Badge</Badge>);
    expect(query(container)).toHaveAttribute('data-size', size);
  });

  it.each(['contained', 'outlined'] as const)('expose data-variant="%s"', (variant) => {
    const { container } = render(<Badge variant={variant}>Badge</Badge>);
    expect(query(container)).toHaveAttribute('data-variant', variant);
  });

  it("n'affiche aucune icône par défaut", () => {
    const { container } = render(<Badge>Badge</Badge>);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('affiche leftIcon et rightIcon quand demandé', () => {
    const { container } = render(
      <Badge leftIcon rightIcon>
        Badge
      </Badge>
    );
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('ajoute une className supplémentaire et transmet les props HTML', () => {
    const { container } = render(
      <Badge className="custom" data-testid="badge">
        Badge
      </Badge>
    );
    expect(query(container)).toHaveClass('custom');
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });
});

describe('Badge — accessibilité', () => {
  it('contained, sans icône : aucune violation axe', async () => {
    const { container } = render(<Badge>Badge</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('contained, avec icônes : aucune violation axe', async () => {
    const { container } = render(
      <Badge leftIcon rightIcon>
        Badge
      </Badge>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('outlined, avec icônes : aucune violation axe', async () => {
    const { container } = render(
      <div style={{ backgroundColor: '#171717' }}>
        <Badge variant="outlined" leftIcon rightIcon>
          Badge
        </Badge>
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
