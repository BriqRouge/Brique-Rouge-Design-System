# MenuButton

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/MenuButton/`
**Commit :** `7745697`
**Fichiers :** `MenuButton.tsx`, `MenuButton.module.css`, `MenuButton.test.tsx`, `MenuButton.figma.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/MenuButton.stories.tsx`

## API

```ts
type MenuButtonVariant     = 'contained' | 'outlined';
type MenuButtonColorScheme = 'default' | 'light' | 'dark';
type MenuButtonSize        = 'sm' | 'nm' | 'md';

interface MenuButtonProps {
  children:     React.ReactNode;       // requis
  variant?:     MenuButtonVariant;
  colorScheme?: MenuButtonColorScheme;
  size?:        MenuButtonSize;
  leftIcon?:    React.ReactNode;
  rightIcon?:   React.ReactNode;
  disabled?:    boolean;
  // + props HTML natives (HTMLButtonElement)
}
```

**Types exportés :** `MenuButtonProps`, `MenuButtonVariant`, `MenuButtonColorScheme`, `MenuButtonSize`
**data-component :** `ds-br-menu-button`
**data-attributes :** `data-icon-only` (`true`/`false`)

## Tokens CSS utilisés

- `--color-menu-button-idle|hovered|hovered-black|disabled`
- `--color-border-menu-button-contained|outlined-white|outlined-black|focus|disabled`
- `--color-text-menu-button-contained|outline-white|outline-black|disabled`
- `--color-icon-menu-button-contained|outline-white|outline-black|disabled` (namespace `menu-button` — **renommé côté Figma** pour distinguer du composant `Button`, qui garde le namespace générique `button`)
- `--border-radius-button`
- `--typography-button-sm-font-size` (12px, partage le `font-family` de `nm`), `--typography-button-nm-font-family`/`-font-size` (14px), `--typography-button-md-font-family`/`-font-size` (16px)

**Padding :** sm/nm → 8px vertical / 12px horizontal (`--sizing-x3`), md → 8px vertical / 14px horizontal (`--spacing-x3-5`)

## Règles d'usage

- **Point relevé (non modifié)** : le Figma source ne montre plus de `min-width` spécifique en `md` (semble uniforme à 40px comme `sm`/`nm`) alors que notre CSS garde `min-width: 56px` (`--sizing-x14`) pour `md` — non touché pour ne pas risquer une régression visuelle sur `TopNav`/`DropdownMenuTrigger` (déjà validés) ; à confirmer avec Damien si c'est intentionnel
- **Icône seule** : quand `children` est vide (`null`) et qu'une icône est fournie, le bouton devient strictement rond (largeur = hauteur) via la classe `iconOnly` — expose `data-icon-only` (`true`/`false`)
- Composant distinct de `Button` (plus récent) — les deux coexistent intentionnellement, périmètres différents

## Tests

22 tests — 22 passants
