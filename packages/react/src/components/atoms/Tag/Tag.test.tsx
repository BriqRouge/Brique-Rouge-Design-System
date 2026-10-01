import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Tag } from './Tag';

describe('Tag — rendu', () => {
  it('affiche le contenu (children)', () => {
    render(<Tag>Mon tag</Tag>);
    expect(screen.getByText('Mon tag')).toBeInTheDocument();
  });

  it('expose data-component="ds-br-tag"', () => {
    const { container } = render(<Tag>Tag</Tag>);
    expect(container.querySelector('[data-component="ds-br-tag"]')).toBeInTheDocument();
  });

  it('size="nm" et variant="contained" par défaut', () => {
    const { container } = render(<Tag>Tag</Tag>);
    const el = container.querySelector('[data-component="ds-br-tag"]');
    expect(el).toHaveAttribute('data-size', 'nm');
    expect(el).toHaveAttribute('data-variant', 'contained');
  });

  it.each(['sm', 'nm', 'md', 'lg'] as const)('expose data-size="%s"', (size) => {
    const { container } = render(<Tag size={size}>Tag</Tag>);
    expect(container.querySelector('[data-component="ds-br-tag"]')).toHaveAttribute('data-size', size);
  });

  it.each(['contained', 'outlined'] as const)('expose data-variant="%s"', (variant) => {
    const { container } = render(<Tag variant={variant}>Tag</Tag>);
    expect(container.querySelector('[data-component="ds-br-tag"]')).toHaveAttribute('data-variant', variant);
  });

  it("n'affiche aucune icône par défaut", () => {
    const { container } = render(<Tag>Tag</Tag>);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('affiche leftIcon et rightIcon quand demandé', () => {
    const { container } = render(
      <Tag leftIcon rightIcon>
        Tag
      </Tag>
    );
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(<Tag className="custom">Tag</Tag>);
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});

describe('Tag — accessibilité', () => {
  it('contained, sans icône : aucune violation axe', async () => {
    const { container } = render(<Tag>Tag</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('contained, avec icônes : aucune violation axe', async () => {
    const { container } = render(
      <Tag leftIcon rightIcon>
        Tag
      </Tag>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('outlined : aucune violation axe (structure/markup, pas le contraste — voir specs/)', async () => {
    const { container } = render(
      <Tag variant="outlined" leftIcon rightIcon>
        Tag
      </Tag>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
