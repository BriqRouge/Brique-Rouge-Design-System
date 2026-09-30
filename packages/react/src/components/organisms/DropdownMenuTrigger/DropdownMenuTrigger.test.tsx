import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';

const LABEL = 'Sélection projets';

describe('DropdownMenuTrigger — rendu', () => {
  it('rend le label du trigger', () => {
    render(<DropdownMenuTrigger triggerLabel={LABEL}><div>item</div></DropdownMenuTrigger>);
    expect(screen.getByRole('button', { name: LABEL })).toBeInTheDocument();
  });

  it('expose data-component="ds-br-dropdown-menu-trigger"', () => {
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL}><div>item</div></DropdownMenuTrigger>
    );
    expect(container.firstChild).toHaveAttribute('data-component', 'ds-br-dropdown-menu-trigger');
  });

  it('expose data-state="closed" par défaut', () => {
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL}><div>item</div></DropdownMenuTrigger>
    );
    expect(container.firstChild).toHaveAttribute('data-state', 'closed');
  });

  it('le menu est masqué par défaut', () => {
    render(<DropdownMenuTrigger triggerLabel={LABEL}><div>item</div></DropdownMenuTrigger>);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL} className="custom"><div>item</div></DropdownMenuTrigger>
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('transmet les props HTML au conteneur', () => {
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL} data-testid="trigger"><div>item</div></DropdownMenuTrigger>
    );
    expect(container.firstChild).toHaveAttribute('data-testid', 'trigger');
  });
});

describe('DropdownMenuTrigger — ouverture / fermeture', () => {
  it('ouvre le menu au clic sur le trigger', async () => {
    render(<DropdownMenuTrigger triggerLabel={LABEL}><div role="menuitem">item</div></DropdownMenuTrigger>);
    await userEvent.click(screen.getByRole('button', { name: LABEL }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('expose data-state="open" quand le menu est ouvert', async () => {
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL}><div>item</div></DropdownMenuTrigger>
    );
    await userEvent.click(screen.getByRole('button', { name: LABEL }));
    expect(container.firstChild).toHaveAttribute('data-state', 'open');
  });

  it('le menu reste ouvert au deuxième clic sur le trigger', async () => {
    render(<DropdownMenuTrigger triggerLabel={LABEL}><div role="menuitem">item</div></DropdownMenuTrigger>);
    const btn = screen.getByRole('button', { name: LABEL });
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('ouvre le menu au focus du trigger', () => {
    render(<DropdownMenuTrigger triggerLabel={LABEL}><div role="menuitem">item</div></DropdownMenuTrigger>);
    fireEvent.focus(screen.getByRole('button', { name: LABEL }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('ferme le menu avec la touche Escape', async () => {
    render(<DropdownMenuTrigger triggerLabel={LABEL}><div>item</div></DropdownMenuTrigger>);
    await userEvent.click(screen.getByRole('button', { name: LABEL }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ferme le menu au clic en dehors du composant', async () => {
    render(
      <div>
        <DropdownMenuTrigger triggerLabel={LABEL}><div>item</div></DropdownMenuTrigger>
        <button>Dehors</button>
      </div>
    );
    await userEvent.click(screen.getByRole('button', { name: LABEL }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Dehors' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('DropdownMenuTrigger — hover', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('ouvre le menu au mouseenter sur le container', () => {
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL}><div role="menuitem">item</div></DropdownMenuTrigger>
    );
    fireEvent.mouseEnter(container.firstChild!);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('ferme le menu après 150ms au mouseleave du container', () => {
    vi.useFakeTimers();
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL}><div role="menuitem">item</div></DropdownMenuTrigger>
    );
    fireEvent.mouseEnter(container.firstChild!);
    fireEvent.mouseLeave(container.firstChild!);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(150); });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('annule la fermeture si la souris re-entre avant 150ms', () => {
    vi.useFakeTimers();
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL}><div role="menuitem">item</div></DropdownMenuTrigger>
    );
    fireEvent.mouseEnter(container.firstChild!);
    fireEvent.mouseLeave(container.firstChild!);
    fireEvent.mouseEnter(container.firstChild!);
    act(() => { vi.advanceTimersByTime(150); });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

describe('DropdownMenuTrigger — accessibilité ARIA', () => {
  it('aria-expanded="false" par défaut', () => {
    render(<DropdownMenuTrigger triggerLabel={LABEL}><div>item</div></DropdownMenuTrigger>);
    expect(screen.getByRole('button', { name: LABEL })).toHaveAttribute('aria-expanded', 'false');
  });

  it('aria-expanded="true" quand ouvert', async () => {
    render(<DropdownMenuTrigger triggerLabel={LABEL}><div>item</div></DropdownMenuTrigger>);
    await userEvent.click(screen.getByRole('button', { name: LABEL }));
    expect(screen.getByRole('button', { name: LABEL })).toHaveAttribute('aria-expanded', 'true');
  });

  it('aria-haspopup="menu" sur le trigger', () => {
    render(<DropdownMenuTrigger triggerLabel={LABEL}><div>item</div></DropdownMenuTrigger>);
    expect(screen.getByRole('button', { name: LABEL })).toHaveAttribute('aria-haspopup', 'menu');
  });
});

describe('DropdownMenuTrigger — mode contrôlé', () => {
  it('affiche le menu quand open={true}', () => {
    render(
      <DropdownMenuTrigger triggerLabel={LABEL} open={true} onOpenChange={() => {}}>
        <div>item</div>
      </DropdownMenuTrigger>
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('masque le menu quand open={false}', () => {
    render(
      <DropdownMenuTrigger triggerLabel={LABEL} open={false} onOpenChange={() => {}}>
        <div>item</div>
      </DropdownMenuTrigger>
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('appelle onOpenChange au clic', async () => {
    const onOpenChange = vi.fn();
    render(
      <DropdownMenuTrigger triggerLabel={LABEL} open={false} onOpenChange={onOpenChange}>
        <div>item</div>
      </DropdownMenuTrigger>
    );
    await userEvent.click(screen.getByRole('button', { name: LABEL }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe('DropdownMenuTrigger — accessibilité axe', () => {
  it('état fermé : aucune violation axe', async () => {
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL}>
        <button role="menuitem">Odaptos</button>
      </DropdownMenuTrigger>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('état ouvert : aucune violation axe', async () => {
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL}>
        <button role="menuitem">Odaptos</button>
      </DropdownMenuTrigger>
    );
    await userEvent.click(screen.getByRole('button', { name: LABEL }));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('mode contrôlé ouvert : aucune violation axe', async () => {
    const { container } = render(
      <DropdownMenuTrigger triggerLabel={LABEL} open={true} onOpenChange={() => {}}>
        <button role="menuitem">Odaptos</button>
      </DropdownMenuTrigger>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
