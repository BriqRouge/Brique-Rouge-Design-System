---
component: MenuButton
tier: atom
figma:
  node: "1345:21426"
  name: MenuButton
  type: component-set
---
# MenuButton

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/MenuButton/`
**Figma :** 39 variantes (axes `Type`, `State`, `Size`, `Viewport`, `Mode`), même node que `MenuButton.figma.tsx`
**Commit :** `7745697`
**Fichiers :** `MenuButton.tsx`, `MenuButton.module.css`, `MenuButton.test.tsx`, `MenuButton.figma.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/MenuButton.stories.tsx`

## API

```ts
type MenuButtonVariant     = 'contained' | 'outlined';
type MenuButtonMode        = 'default' | 'light' | 'dark';
type MenuButtonSize        = 'sm' | 'nm' | 'md';

interface MenuButtonProps {
  children:     React.ReactNode;       // requis
  variant?:     MenuButtonVariant;
  mode?:        MenuButtonMode;        // Figma `Mode` — outlined : dark = contour blanc (fond sombre), light = contour noir (fond clair)
  size?:        MenuButtonSize;
  leftIcon?:    React.ReactNode;
  rightIcon?:   React.ReactNode;
  disabled?:    boolean;
  // + props HTML natives (HTMLButtonElement)
}
```

**Types exportés :** `MenuButtonProps`, `MenuButtonVariant`, `MenuButtonMode`, `MenuButtonSize`
**data-component :** `ds-br-menu-button`
**data-attributes :** `data-icon-only` (`true`/`false`)

## Tokens CSS utilisés

- `--color-menu-button-idle|hovered|hovered-black|disabled`
- `--color-border-menu-button-contained|outlined-white|outlined-black|focus|disabled`
- `--color-text-menu-button-contained-idle`, `-outlined-light-idle|hover`, `-outlined-dark-idle|hover`, `-disabled` (`:focus-visible` réutilise le token `hover`). `contained-idle` et `outlined-dark-hover` valent `#525252` (`text/secondary`) depuis le 2026-11-10 : `#737373` n'atteignait que 4,35:1 et 3,76:1
- `--color-icon-menu-button-contained|outline-white|outline-black|disabled` (namespace `menu-button` — **renommé côté Figma** pour distinguer du composant `Button`, qui garde le namespace générique `button`)
- `--border-radius-button`
- `--motion-duration-fast` / `--motion-easing-standard` (transitions de survol, 150ms ease-out)
- `--typography-button-sm-font-size` (12px, partage le `font-family` de `nm`), `--typography-button-nm-font-family`/`-font-size` (14px), `--typography-button-md-font-family`/`-font-size` (16px)

**Padding :** sm/nm → 8px vertical / 12px horizontal (`--sizing-x3`), md → 8px vertical / 14px horizontal (`--spacing-x3-5`)

**Largeur minimale :** sm → 24px (`--sizing-x6`, lié à `sizing/x6` dans Figma) · nm → 40px (`--sizing-button-nm`) · md → 48px (`--sizing-x12`, toutes variantes — décision de Damien, 2026-11-07)

## Règles d'usage

- **Largeur minimale `md` = 48px partout** (décision de Damien, 2026-11-07) : Figma montrait 48px (contained desktop idle) ou 40px (autres variantes, non liées) et le CSS 56px (`--sizing-x14`) ; harmonisé à `--sizing-x12` dans le code et dans Figma (`sizing/x12`)
- **Renommage `colorScheme` → `mode` (/sync-ds 2026-11-07, validé par Damien)** : la propriété Figma `Color-scheme` est devenue `Mode`, et ses valeurs `light`/`dark` ont été **inversées** sur les mêmes nodes. Le code suit Figma : l'ancien `colorScheme="light"` (contour blanc, fond sombre) s'écrit désormais `mode="dark"`, l'ancien `colorScheme="dark"` s'écrit `mode="light"`. Consommateurs migrés : `TopNav` (bouton retour), `DropdownMenuTrigger` (`triggerColorScheme` → `triggerMode`)
- **Axe `Viewport`** : pas de prop React — l'adaptation mobile (ombre `Elevation 2` sur `contained md`) passera par le CSS, quand le breakpoint sera défini (décision du 2026-11-07)
- **Icône seule** : quand `children` est vide (`null`) et qu'une icône est fournie, le bouton devient strictement rond (largeur = hauteur) via la classe `iconOnly` — expose `data-icon-only` (`true`/`false`)
- Composant distinct de `Button` (plus récent) — les deux coexistent intentionnellement, périmètres différents
- **Focus visible — corrigé après audit rétroactif des états de tous les composants** : la première implémentation utilisait un anneau extérieur générique (`outline: 2px solid`). Vérification des variantes `State=Focus` du Figma source (`1453:20608` contained, `1453:20612` outlined/light, `1453:20616` outlined/dark) : Figma montre un fond **identique à l'état hovered** combiné à une bordure `--color-border-menu-button-focus` (bleu universel, quel que soit `mode`) — pas d'anneau extérieur. Géré par variante (`contained`, `outlined.mode-light`, `outlined.mode-dark`) avec le fond + texte de l'état hovered correspondant. Vérifié par mesure réelle (`getComputedStyle` après `Tab`), pas seulement par capture d'écran.

## Tests

25 tests — 25 passants
