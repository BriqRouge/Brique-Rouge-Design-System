import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu — rendu', () => {
  it('rend ses enfants', () => {
    render(<DropdownMenu><button>Item</button></DropdownMenu>);
    expect(screen.getByRole('button', { name: 'Item' })).toBeInTheDocument();
  });

  it('expose data-component="ds-br-dropdown-menu"', () => {
    render(<DropdownMenu><button>Item</button></DropdownMenu>);
    expect(screen.getByRole('menu')).toHaveAttribute(
      'data-component',
      'ds-br-dropdown-menu'
    );
  });

  it('ajoute une className supplémentaire', () => {
    render(
      <DropdownMenu className="custom"><button>Item</button></DropdownMenu>
    );
    expect(screen.getByRole('menu')).toHaveClass('custom');
  });

  it('transmet les props HTML au conteneur', () => {
    render(
      <DropdownMenu data-testid="menu"><button>Item</button></DropdownMenu>
    );
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });

  it('rend plusieurs enfants', () => {
    render(
      <DropdownMenu>
        <button>Item 1</button>
        <button>Item 2</button>
        <button>Item 3</button>
      </DropdownMenu>
    );
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
});

describe('DropdownMenu — accessibilité', () => {
  it('avec un enfant : aucune violation axe', async () => {
    const { container } = render(
      <DropdownMenu aria-label="Menu de navigation">
        <button role="menuitem">Item</button>
      </DropdownMenu>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('avec enfants boutons : aucune violation axe', async () => {
    const { container } = render(
      <DropdownMenu aria-label="Sélection entreprise">
        <button role="menuitem">Odaptos</button>
        <button role="menuitem">BPCE</button>
      </DropdownMenu>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
