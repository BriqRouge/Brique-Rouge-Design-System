---
component: Badge
tier: atom
figma:
  node: "184:18566"
  name: Badge
  type: component-set
---
# Badge

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/Badge/`
**Figma :** `Size` × `Style=contained|outlined`, booléens `Left Icon` / `Right Icon` (6 variantes)

## API

```ts
type BadgeSize    = 'sm' | 'md' | 'lg';
type BadgeVariant = 'contained' | 'outlined';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children:    React.ReactNode; // requis
  size?:       BadgeSize;       // défaut: 'md'
  variant?:    BadgeVariant;    // défaut: 'contained' — outlined = fond sombre
  leftIcon?:   boolean;         // icône ronde (indicateur) à gauche
  rightIcon?:  boolean;         // icône de fermeture à droite
}
```

**Types exportés :** `BadgeProps`, `BadgeSize`, `BadgeVariant`
**data-component :** `ds-br-badge`
**data-attributes :** `data-size`, `data-variant`

## Correspondance Figma ↔ code

| Figma | Code |
|---|---|
| `Size=sm` (contained) / `Size=s` (outlined) | `size="sm"` |
| `Size=md` | `size="md"` |
| `Size=lg` (contained) / `Size=l` (outlined) | `size="lg"` |
| `Style=contained\|outlined` | `variant` |
| `Left Icon` / `Right Icon` | `leftIcon` / `rightIcon` |

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-neutral-100` | `#f5f5f5` | Fond (contained) ; bordure et texte (outlined) |
| `--color-neutral-900` | `#171717` | Texte et icônes (contained) |
| `--border-radius-button` | `999px` | Forme pilule |
| `--spacing-x1`/`-x2` | `4px`/`8px` | Gap, padding |
| `--spacing-x4`/`-x6`/`-x8` | `16px`/`24px`/`32px` | Hauteur sm/md/lg |
| `--spacing-x3`/`-x4`/`-x6` | `12px`/`16px`/`24px` | Taille des icônes sm/md/lg |
| `--typography-font-size-xs`/`-base`/`-2xl` | `12px`/`16px`/`24px` | Taille de police sm/md/lg |
| `--typography-font-weight-medium` | `500` | Toutes tailles |

Les couleurs reprennent les variables liées dans Figma (primitives `color/neutral/*`).

## Règles d'usage

- **Badge ≠ Tag** : même structure que `Tag` (indicateur rond, texte, croix), mais en forme de pilule, avec un fond `neutral/100` et un `outlined` pour fond sombre. Composant distinct, décision de Damien (2026-11-04)
- **`outlined` = fond sombre uniquement** : bordure et texte `neutral/100`, illisibles sur fond clair (décision de Damien, 2026-11-04)
- Icônes fixes, togglées par booléen, dessinées en SVG inline (`currentColor`), comme `Tag`
- Pas d'interaction : la croix est décorative, aucun `onClick` (Figma ne spécifie aucun comportement)
- **Valeurs par défaut** : celles du code font référence (`size='md'`, taille utilisée par la bullet brique ; icônes masquées)

## Incohérences Figma signalées (2026-11-04, non corrigées)

- Valeurs de taille différentes selon le style : `sm|md|lg` en contained, `s|md|l` en outlined. Le code normalise en `sm|md|lg`
- Tailles de police liées aux variables `spacing/x3|x4|x6` au lieu de `typography/font-size/*`. Le code utilise les tokens typo de même valeur (décision de Damien)
- Aucun style de texte sur le libellé
- Hauteur `sm` de 16px avec padding de 8px : le code réduit le padding vertical à 4px, comme `Tag`

## Tests

14 tests — 14 passants
