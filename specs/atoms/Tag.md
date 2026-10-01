# Tag

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/Tag/`
**Node Figma :** `184:18522` ("Tag")

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
| `--color-neutral-200` | `#e5e5e5` | Fond (contained) / bordure (outlined) |
| `--color-neutral-900` | `#171717` | Texte/icône (contained) |
| `--border-radius-tag` | `4px` | Border-radius |
| `--spacing-x1`/`-x2` | `4px`/`8px` | Gap, padding |
| `--spacing-x3`/`-x4`/`-x6`/`-x8` | `12px`/`16px`/`24px`/`32px` | Taille des icônes par taille de tag |
| `--spacing-x4`/`-x6`/`-x8`/`-x10` | `16px`/`24px`/`32px`/`40px` | Hauteur par taille de tag |
| `--typography-font-size-xs`/`-base`/`-2xl`/`-3xl` | `12px`/`16px`/`24px`/`32px` | Taille de police par taille de tag |
| `--typography-font-weight-medium` | `500` | Toutes tailles |

## Règles d'usage

- **Icônes fixes, pas des slots arbitraires** : contrairement à `Button`/`MenuButton` (où `leftIcon`/`rightIcon` acceptent n'importe quel `ReactNode`), les icônes de `Tag` sont **fixes** (indicateur rond à gauche, croix de fermeture à droite) et seulement togglées par booléen — fidèle à la structure du Figma source, qui ne montre jamais d'icône différente
- Icônes dessinées à la main en SVG inline (`currentColor`), cohérent avec la convention déjà établie par `AlertBanner`/`TopNav`
- **Normalisation de nommage** : le Figma source nomme la plus petite taille `Smallsm` en `contained` mais `sm` en `outlined`, et la plus grande `lg` en `contained` mais `l` en `outlined` — incohérence de nommage des variantes côté Figma (même dimensions des deux côtés), normalisé en `sm`/`nm`/`md`/`lg` partout dans l'API
- **⚠️ Écart signalé vs Figma — contraste insuffisant (non corrigé, implémenté tel quel à la demande de Damien)** : le style `outlined` utilise une couleur de texte/icône très claire (`--color-neutral-200` pour sm/nm/md, `--color-neutral-100` pour lg) — sur un fond clair réel (`--color-neutral-50` utilisé partout ailleurs dans le DS), ce texte serait quasiment invisible et échouerait largement WCAG AA. Probable erreur d'auteur Figma (texte clair resté après un changement contained→outlined). **À corriger côté Figma si Damien confirme que c'est une erreur**, avant tout usage réel du style outlined en production
- Pas d'interaction gérée (ni `onClick` sur l'icône de fermeture, ni état hover/focus) — le Figma source ne spécifie aucun comportement, seulement l'apparence visuelle

## Tests

15 tests — 15 passants
