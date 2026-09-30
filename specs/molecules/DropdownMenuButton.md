# DropdownMenuButton

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/DropdownMenuButton/`
**Commit :** `63a6751`
**Fichiers :** `DropdownMenuButton.tsx`, `DropdownMenuButton.module.css`, `DropdownMenuButton.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/DropdownMenuButton.stories.tsx`

## API

```ts
interface DropdownMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children:    React.ReactNode;  // requis
  company?:    LogoCompany;      // accent couleur seulement pour 'odaptos' | 'bpce' | 'ibp'
  src?:        string;           // URL logo custom, ignoré si company fourni
  alt?:        string;           // défaut: ''
  rightIcon?:  boolean;          // icône lien externe
  activated?:  boolean;          // item sélectionné
  disabled?:   boolean;
}
```

**Types exportés :** `DropdownMenuButtonProps`
**data-attributes :** `data-activated`, `data-company`

## Tokens CSS utilisés

- `--spacing-component-sm` (gap + padding)
- `--sizing-x10` (hauteur)
- `--border-radius-dropdown-menu-button`
- Couleurs accent par compagnie : `--color-deep-sea-*`, `--color-maroon-flush-*`, `--color-purple-mountain-*`
- `--typography-dropdown-menu-button-font-family` / `-font-size` (16px)

## Règles d'usage

- Layout : flex row, `width: 100%` (responsive — remplit le `DropdownMenu`), hauteur fixe via `--sizing-x10`
- `company` accepte toutes les valeurs de `LogoCompany` (voir `LogoCompanies`), mais l'accent couleur ne s'applique qu'à `odaptos`/`bpce`/`ibp`

## Tests

20 tests — 20 passants
