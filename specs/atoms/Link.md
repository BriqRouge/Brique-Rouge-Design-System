---
component: Link
tier: atom
figma:
  node: "2326:37384"
  name: Link
  type: component-set
---
# Link

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/Link/`
**Figma :** `Size=sm|md|lg` × `State=idle|hovered|focus|disabled` × `Theme=light|dark` (24 variantes), booléens `Left Icon` / `Right Icon`, échanges d'instance `Left Icon Swap` / `Right Icon Swap`, texte `Label`. Créé le 2026-11-04 pour remplacer « Buttons / Text Link » de la librairie externe (page iBP)

## API

```ts
type LinkSize  = 'sm' | 'md' | 'lg';
type LinkTheme = 'light' | 'dark';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children:   React.ReactNode; // requis
  size?:      LinkSize;        // défaut: 'md'
  theme?:     LinkTheme;       // défaut: 'light' — dark sur fond sombre
  leftIcon?:  React.ReactNode; // icône à gauche (Figma : flèche par défaut)
  rightIcon?: React.ReactNode; // icône à droite (Figma : lien externe par défaut)
  disabled?:  boolean;
}
```

**Types exportés :** `LinkProps`, `LinkSize`, `LinkTheme`
**data-component :** `ds-br-link`
**data-attributes :** `data-size`, `data-theme`

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-text-primary` | `#171717` | Texte et icônes au repos (light) |
| `--color-text-muted` | `#737373` | Survol et disabled (light) — AA, remplace le `#8e8e8e` de la librairie externe |
| `--color-neutral-100` | `#f5f5f5` | Texte et icônes au repos (dark) |
| `--color-neutral-300` | `#d4d4d4` | Survol et disabled (dark) |
| `--color-border-focus` | `#3453dc` | Contour de focus 2px |
| `--typography-font-size-sm`/`-base`/`-2xl` | `14px`/`16px`/`24px` | Taille sm/md/lg |
| `--typography-font-weight-medium` | `500` | Toutes tailles |
| `--sizing-x4`/`-x6` | `16px`/`24px` | Icônes sm / md et lg |
| `--spacing-x2` | `8px` | Gap |
| `--spacing-x1` | `4px` | Padding |

Styles de texte Figma (créés le 2026-11-04) : `label/sm-medium-underline`, `label/base-medium-underline`, `label/2xl-medium-underline`.

## Règles d'usage

- **Toujours souligné** : le lien se distingue du texte sans s'appuyer sur la seule couleur (WCAG 1.4.1, décision Damien, 2026-11-04)
- **`theme="dark"`** sur fond sombre uniquement (ex : section RETEX noire de la page iBP)
- **Icônes** : slots `ReactNode`, comme `Button`. Elles sont décoratives (`aria-hidden`) et suivent la couleur du texte (`currentColor`). Un lien qui ouvre un nouvel onglet doit le dire dans son libellé ou via `aria-label`
- **Disabled** : le `href` est retiré, le lien n'est plus focalisable et porte `aria-disabled="true"`. Un `<a>` n'a pas de `:disabled` natif : le style passe par `[aria-disabled='true']`, **exception** à la convention CLAUDE.md « :disabled natif uniquement »
- **Focus** : contour 2px `--color-border-focus` sans décalage, comme la variante Figma `State=focus` (contour extérieur)
- Aucune animation : changement de couleur instantané au survol, comme dans Figma

## Correspondance avec la librairie externe remplacée

| « Buttons / Text Link » | Link |
|---|---|
| `Size=Xs\|Sm\|Lg` (14/16/24px) | `size="sm\|md\|lg"` |
| `#1e1e1e` / survol `#8e8e8e` (3,3:1, sous AA) | `text/primary` / `text/muted` (4,7:1) |
| Pas de focus | contour `border/focus` |
| Instance iBP : blanc, souligné, en surcharge | `Theme=dark` |

L'instance de la page iBP (frame RETEX) est remplacée par `Link` `Size=md, Theme=dark`, icône droite, à l'échelle 1,75 : 226×56 contre 213×42 avant, l'icône du DS faisant 24px au lieu de 16px. L'interaction de survol de l'ancienne instance (vers une variante de la librairie externe) n'est pas reprise. Le lien YouTube au clic est conservé.

## Tests

16 tests — 16 passants
