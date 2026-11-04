import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { BulletBrique } from './BulletBrique';

const KEYWORDS = ['Vision', 'Priorisation', 'Roadmap'];

function renderBullet() {
  return render(<BulletBrique keywords={KEYWORDS}>J’apporte de la clarté</BulletBrique>);
}

const root = (container: HTMLElement) => container.querySelector('[data-component="ds-br-bullet-brique"]');

// jsdom n'implémente pas PointerEvent : on simule pointerover/pointerout (que
// React traduit en onPointerEnter/onPointerLeave) avec pointerType="mouse"
function mousePointer(element: Element, type: 'pointerover' | 'pointerout') {
  const event = new MouseEvent(type, { bubbles: true, relatedTarget: document.body });
  Object.defineProperty(event, 'pointerType', { value: 'mouse' });
  fireEvent(element, event);
}

describe('BulletBrique — rendu', () => {
  it("rend l'intitulé dans un bouton fermé par défaut", () => {
    const { container } = renderBullet();
    const button = screen.getByRole('button', { name: 'J’apporte de la clarté' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(root(container)).toHaveAttribute('data-state', 'closed');
  });

  it('rend un Badge par mot-clé, dans la liste contrôlée par le bouton', () => {
    const { container } = renderBullet();
    const list = screen.getByRole('list', { hidden: true });
    expect(screen.getByRole('button')).toHaveAttribute('aria-controls', list.id);
    expect(container.querySelectorAll('[data-component="ds-br-badge"]')).toHaveLength(3);
    expect(container.querySelector('[data-component="ds-br-badge"]')).toHaveAttribute('data-size', 'md');
  });

  it('masque la brique aux lecteurs d’écran', () => {
    const { container } = renderBullet();
    expect(container.querySelector('[aria-hidden="true"] img')).toBeInTheDocument();
  });

  it('ajoute une className et transmet les props HTML', () => {
    const { container } = render(
      <BulletBrique keywords={KEYWORDS} className="custom" data-testid="bullet">
        Titre
      </BulletBrique>
    );
    expect(root(container)).toHaveClass('custom');
    expect(screen.getByTestId('bullet')).toBeInTheDocument();
  });
});

describe('BulletBrique — ouverture', () => {
  it('s’ouvre au survol de la souris et se referme en sortant', () => {
    const { container } = renderBullet();
    const button = screen.getByRole('button');
    mousePointer(button, 'pointerover');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(root(container)).toHaveAttribute('data-state', 'opened');
    mousePointer(button, 'pointerout');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('s’ouvre et se referme au clic (tap)', async () => {
    renderBullet();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('s’ouvre au clavier avec Entrée et se referme avec Échap', async () => {
    renderBullet();
    const button = screen.getByRole('button');
    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('BulletBrique — accessibilité', () => {
  it('fermée : aucune violation axe', async () => {
    const { container } = renderBullet();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ouverte : aucune violation axe', async () => {
    const { container } = renderBullet();
    fireEvent.click(screen.getByRole('button'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
