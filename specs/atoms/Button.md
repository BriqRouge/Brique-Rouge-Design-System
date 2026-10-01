# Button

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/Button/`
**Node Figma :** `1506:20751` (composant "Button" — source de vérité pour tous les boutons du DS)
**Fichiers :** `Button.tsx`, `Button.module.css`, `Button.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/Button.stories.tsx`

## API

```ts
type ButtonVariant     = 'primary' | 'secondary' | 'tertiary';
type ButtonColorScheme = 'neutral' | 'info' | 'warning' | 'success' | 'error';

interface ButtonProps {
  children:      React.ReactNode;    // requis — contenu textuel du bouton
  variant?:      ButtonVariant;      // default: 'primary'
  colorScheme?:  ButtonColorScheme;  // default: 'neutral' — ignoré si variant='tertiary'
  leftIcon?:     React.ReactNode;
  rightIcon?:    React.ReactNode;
  disabled?:     boolean;
  onClick?:      React.MouseEventHandler<HTMLButtonElement>;
  type?:         'button' | 'submit' | 'reset';
  className?:    string;
  'aria-label'?: string;
}
```

**Types exportés :** `ButtonProps`, `ButtonVariant`, `ButtonColorScheme`
**data-component :** `ds-br-button`
**data-attributes :** `data-variant`, `data-color-scheme`, `data-icon-only` (utilisés par les tests)

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-button-primary` / `-hover` | `#262626` / `#404040` | Fond primary neutre |
| `--color-button-secondary-hover` | `#262626` | Fond secondary neutre (hover, remplit) |
| `--color-button-info` / `-hover` | `#3453dc` / `#2c41c9` | Fond primary + bordure/fond hover secondary, info |
| `--color-button-warning` / `-hover` | `#e1742e` / `#d35c23` | Idem, warning |
| `--color-button-success` / `-hover` | `#23a019` / `#1f7d18` | Idem, success |
| `--color-button-error` / `-hover` | `#e22020` / `#be1717` | Idem, error |
| `--color-button-focus` | `#567be9` | Bordure focus-visible (primary/secondary, intégrée — pas un anneau extérieur) |
| `--color-border-button-secondary` | `#262626` | Bordure secondary neutre |
| `--color-text-button-primary` / `-hover` | `#fafafa` | Texte sur fond plein (primary, ou secondary au hover) |
| `--color-text-button-secondary` / `-hover` | `#262626` / `#fafafa` | Texte secondary neutre (idle / hover) |
| `--color-text-button-tertiary` / `-hover` / `-focus` | `#262626` / `#404040` / `#3453dc` | Texte tertiary selon l'état |
| `--color-icon-button-info` / `warning` | `#3453dc` / `#e1742e` | Icône + texte secondary info/warning (idle) |
| `--border-radius-button` | `999px` | Border-radius (pill) |
| `--spacing-component-sm` | `8px` | Gap + padding vertical |
| `--sizing-x3` | `12px` | Padding horizontal |
| `--sizing-button-nm` | `40px` | Hauteur (taille unique, pas de variant size) |

## Règles d'usage

- `primary` : fond plein — neutre (`#262626`) ou couleur sémantique
- `secondary` : bordure 2px, fond transparent — au hover, se remplit en plein (couleur sémantique ou neutre) avec texte blanc
- `tertiary` : lien souligné, sans fond ni bordure — **toujours neutre**, `colorScheme` est ignoré
- `colorScheme` (`info`/`warning`/`success`/`error`) s'applique à `primary` et `secondary`, jamais à `tertiary`
- Taille unique (40px de hauteur) — pas de variant `size` comme sur `MenuButton`
- État disabled : réutilise les tokens neutres génériques (`--color-background-button-disabled` etc.) — le Figma source ne définit pas d'état disabled dédié par schéma de couleur
- Toujours fournir `aria-label` si le bouton ne contient que des icônes — passer `children={null}`
- **Icône seule** : quand `children` est vide (`null`) et qu'une icône est fournie, le bouton devient strictement rond (largeur = hauteur = 40px) via la classe `iconOnly`, qui force `width` (le `min-width` seul ne suffisait pas : la bordure de 2px faisait dépasser la largeur naturelle du contenu au-delà du `min-width`, donnant un bouton ovale de ~43px de large)
- Ne pas confondre avec `MenuButton` : composant distinct, plus ancien, utilisé notamment par `TopNav` (bouton retour, trigger de dropdown) — les deux composants coexistent intentionnellement, périmètres différents
- **Focus visible — corrigé après audit rétroactif des états de tous les composants** : la première implémentation utilisait un anneau extérieur générique (`outline: 2px solid`). Vérification des variantes `Type=*-focus` du Figma source (ex: `1729:19123` primary-focus, `1506:20752` secondary-focus) : Figma ne montre pas d'anneau extérieur mais une **bordure intégrée de 2px** sur le bouton lui-même, fond inchangé par rapport à l'idle. La bordure focus est **universelle** (`--color-button-focus`, toujours la même quelle que soit `colorScheme`). `tertiary` n'a ni bordure ni fond à aucun état — seule sa couleur de texte change (déjà correct avant l'audit). Vérifié par mesure réelle (`getComputedStyle` après `Tab`), pas seulement par capture d'écran.

## Tests

25 tests — 25 passants
