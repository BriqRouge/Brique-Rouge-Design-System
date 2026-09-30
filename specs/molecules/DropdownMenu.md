# DropdownMenu

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/DropdownMenu/`
**Commit :** `36b8093`
**Fichiers :** `DropdownMenu.tsx`, `DropdownMenu.module.css`, `DropdownMenu.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/DropdownMenu.stories.tsx`

## API

```ts
interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children:   React.ReactNode;  // requis
  className?: string;
  // role="menu" natif
}
```

**Types exportés :** `DropdownMenuProps`

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-neutral-100` | — | Fond |
| `--color-neutral-300` | — | Bordure 0.5px solid |
| `--border-radius-lg` | — | Border-radius |

## Règles d'usage

- Layout : flex column, gap 8px, padding 8px, `align-items: stretch` (les enfants remplissent la largeur du menu)
- Conteneur générique, agnostique de son contenu — typiquement rempli de `DropdownMenuButton`

## Tests

7 tests — 7 passants
