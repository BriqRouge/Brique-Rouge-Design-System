---
component: Tag
tier: atom
figma:
  node: "184:18522"
  name: Tag
  type: component-set
---
# Tag

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/Tag/`

## API

```ts
type TagSize    = 'sm' | 'nm' | 'md' | 'lg';
type TagVariant = 'contained' | 'outlined';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  children:    React.ReactNode; // requis
  size?:       TagSize;         // défaut: 'nm'
  variant?:    TagVariant;      // défaut: 'contained'
  leftIcon?:   boolean;         // affiche une icône ronde (indicateur) à gauche
  rightIcon?:  boolean;         // affiche une icône de fermeture à droite
}
```

**Types exportés :** `TagProps`, `TagSize`, `TagVariant`
**data-component :** `ds-br-tag`
**data-attributes :** `data-size`, `data-variant`

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-background-surface-raised` | `#e5e5e5` | Fond (contained) |
| `--color-border-subtle` | `#e5e5e5` | Bordure (outlined) |
| `--color-text-primary` | `#171717` | Texte/icône (contained) |
| `--border-radius-tag` | `4px` | Border-radius |
| `--spacing-x1`/`-x2` | `4px`/`8px` | Gap, padding |
| `--spacing-x3`/`-x4`/`-x6`/`-x8` | `12px`/`16px`/`24px`/`32px` | Taille des icônes par taille de tag |
| `--spacing-x4`/`-x6`/`-x8`/`-x10` | `16px`/`24px`/`32px`/`40px` | Hauteur par taille de tag |
| `--typography-font-size-xs`/`-base`/`-2xl`/`-3xl` | `12px`/`16px`/`24px`/`32px` | Taille de police par taille de tag |
| `--typography-font-weight-medium` | `500` | Toutes tailles |

## Règles d'usage

- **Icônes fixes, pas des slots arbitraires** : contrairement à `Button`/`MenuButton` (où `leftIcon`/`rightIcon` acceptent n'importe quel `ReactNode`), les icônes de `Tag` sont **fixes** (indicateur rond à gauche, croix de fermeture à droite) et seulement togglées par booléen — fidèle à la structure du Figma source, qui ne montre jamais d'icône différente
- Icônes dessinées à la main en SVG inline (`currentColor`), cohérent avec la convention déjà établie par `AlertBanner`/`TopNav`
- **Nommage des tailles** : `sm`/`nm`/`md`/`lg` dans Figma comme dans l'API (Figma harmonisé le 2026-11-02 — anciennement `Smallsm` et `l` selon le style)
- **Style `outlined`** : bordure `--color-neutral-200`, texte et icônes `--color-neutral-900` — contraste conforme WCAG AA sur fond clair. Décision de Damien (2026-11-02), appliquée dans Figma et dans le code ; remplace l'ancien texte `neutral-200`/`neutral-100` quasi invisible
- **Graisse** : `--typography-font-weight-medium` (500), liée à la variable `typography/font-weight/medium` dans Figma (anciennement style « Medium » de la police variable, ~571)
- **Valeurs par défaut** : celles du code font référence (`size='nm'`, icônes masquées) ; les défauts Figma (première variante, icônes affichées) ne sont pas une décision de design
- Pas d'interaction gérée (ni `onClick` sur l'icône de fermeture, ni état hover/focus) — le Figma source ne spécifie aucun comportement, seulement l'apparence visuelle

## Tests

15 tests — 15 passants
