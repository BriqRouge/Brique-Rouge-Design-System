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
| `Size=sm` | `size="sm"` |
| `Size=md` | `size="md"` |
| `Size=lg` | `size="lg"` |
| `Style=contained\|outlined` | `variant` |
| `Left Icon` / `Right Icon` | `leftIcon` / `rightIcon` |

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-neutral-100` | `#f5f5f5` | Fond (contained) ; bordure et texte (outlined) |
| `--color-text-primary` | `#171717` | Texte (contained) |
| `--color-icon-button-secondary` | `#262626` | Icônes (contained) |
| `--border-radius-button` | `999px` | Forme pilule |
| `--spacing-x1`/`-x2` | `4px`/`8px` | Gap, padding |
| `--spacing-x4`/`-x6`/`-x8` | `16px`/`24px`/`32px` | Hauteur sm/md/lg |
| `--spacing-x3`/`-x4`/`-x6` | `12px`/`16px`/`24px` | Taille des icônes sm/md/lg |
| `--typography-font-size-xs`/`-base`/`-2xl` | `12px`/`16px`/`24px` | Taille de police sm/md/lg |
| `--typography-font-weight-medium` | `500` | Toutes tailles |

Styles de texte Figma : `label/xs-medium` (sm), `label/base-medium` (md), `label/2xl-medium` (lg).

Les couleurs reprennent les variables liées dans Figma : `color/neutral/100`, `color/text/primary` et `color/icon/button/secondary` (texte et icônes du `contained` liés à des tokens sémantiques depuis le /sync-ds du 2026-11-07).

## Règles d'usage

- **Badge ≠ Tag** : même structure que `Tag` (indicateur rond, texte, croix), mais en forme de pilule, avec un fond `neutral/100` et un `outlined` pour fond sombre. Composant distinct, décision de Damien (2026-11-04)
- **`outlined` = fond sombre uniquement** : bordure et texte `neutral/100`, illisibles sur fond clair (décision de Damien, 2026-11-04)
- Icônes fixes, togglées par booléen, dessinées en SVG inline (`currentColor`), comme `Tag` ; en `contained`, leur couleur est `--color-icon-button-secondary` (#262626), distincte du texte (#171717) comme dans Figma
- Pas d'interaction : la croix est décorative, aucun `onClick` (Figma ne spécifie aucun comportement)
- **Valeurs par défaut** : celles du code font référence (`size='md'`, taille utilisée par la bullet brique ; icônes masquées)

## Corrections Figma (2026-11-04, demandées par Damien)

- Variantes outlined renommées `Size=s|l` → `Size=sm|lg`
- Libellé : styles `label/xs-medium`, `label/base-medium`, `label/2xl-medium` appliqués ; les tailles de police sont désormais liées à `typography/font-size/*` (au lieu de `spacing/x3|x4|x6`). Dimensions et couleurs inchangées

## Écart restant

- Hauteur `sm` de 16px avec padding de 8px : le code réduit le padding vertical à 4px, comme `Tag`

## Tests

14 tests — 14 passants
