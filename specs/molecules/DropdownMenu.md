---
component: DropdownMenu
tier: molecule
figma:
  node: "2357:38494"
  name: DropdownMenu
  type: component-set
---
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
| `--color-background-surface` | — | Fond |
| `--color-border-default` | — | Bordure 0.5px solid |
| `--border-radius-lg` | — | Border-radius |
| `--spacing-x6` | `24px` | Mobile : gap et padding bas |
| `--spacing-x4` | `16px` | Mobile : padding haut |

## Règles d'usage

- Layout : flex column, gap 8px, padding 8px, `align-items: stretch` (les enfants remplissent la largeur du menu)
- Conteneur générique, agnostique de son contenu — typiquement rempli de `DropdownMenuButton`

## Sous le breakpoint (mobile)

Figma `Viewport=mobile` (2357:38495, valeurs liées aux variables le 2026-11-07). Pas de prop React :
l'adaptation passe par le CSS (`@media not (--viewport-desktop)`, breakpoint 816px = 51em).

- Gap `--spacing-x6`, padding haut `--spacing-x4`, padding bas `--spacing-x6` ; paddings gauche/droit inchangés (8px)
- Hauteur ajustée au contenu (comme sur desktop)
- Largeur : 390px dans Figma = largeur de l'écran. Elle relève du conteneur qui positionne le menu (`DropdownMenuTrigger`), pas du menu lui-même — non traitée ici
- Les `DropdownMenuButton` gardent leur version desktop (voir sa fiche)

## Tests

7 tests — 7 passants
