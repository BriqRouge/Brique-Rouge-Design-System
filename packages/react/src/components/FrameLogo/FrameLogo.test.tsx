import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { FrameLogo } from './FrameLogo';

describe('FrameLogo — rendu', () => {
  it('rend une image avec src', () => {
    render(<FrameLogo src="/logo.png" alt="Logo Acme" />);
    expect(screen.getByRole('img', { name: 'Logo Acme' })).toBeInTheDocument();
  });

  it("transmet src à l'image", () => {
    render(<FrameLogo src="/logo.png" alt="Logo" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/logo.png');
  });

  it('utilise alt vide par défaut', () => {
    const { container } = render(<FrameLogo src="/logo.png" />);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('ajoute une className supplémentaire', () => {
    render(<FrameLogo src="/logo.png" alt="Logo" className="custom" />);
    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('custom');
  });

  it('expose data-component="ds-br-frame-logo"', () => {
    render(<FrameLogo src="/logo.png" alt="Logo" />);
    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveAttribute('data-component', 'ds-br-frame-logo');
  });

  it('transmet les props HTML au conteneur', () => {
    render(<FrameLogo src="/logo.png" alt="Logo" data-testid="frame" />);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
  });
});

describe('FrameLogo — accessibilité', () => {
  it('avec alt : aucune violation axe', async () => {
    const { container } = render(<FrameLogo src="/logo.png" alt="Logo Acme" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('avec alt vide (décoratif) : aucune violation axe', async () => {
    const { container } = render(<FrameLogo src="/logo.png" alt="" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
