# COMPONENTS.md — Contrat des composants

> Ce fichier est la référence pour Claude Code lors de la génération
> de composants et d'interfaces. Il est mis à jour à chaque nouveau
> composant validé dans le Design System.

## Comment utiliser ce fichier

Ce fichier documente :
- les composants disponibles dans le Design System
- leur API (props, variants, états)
- les tokens CSS qu'ils utilisent
- les règles d'usage

Claude Code lit ce fichier avant toute implémentation.

## Composants disponibles

### Button

**Package :** `@starter/react`
**Chemin :** `packages/react/src/components/Button/`

#### API

```ts
type ButtonVariant     = 'contained' | 'outlined';
type ButtonColorScheme = 'default' | 'light' | 'dark';
type ButtonSize        = 'nm' | 'md';

interface ButtonProps {
  variant?:      ButtonVariant;      // default: 'contained'
  colorScheme?:  ButtonColorScheme;  // default: 'default' — ignoré si variant='contained'
  size?:         ButtonSize;         // default: 'nm'
  children?:     React.ReactNode;
  leftIcon?:     React.ReactNode;
  rightIcon?:    React.ReactNode;
  disabled?:     boolean;            // opacity: 0.4
  onClick?:      React.MouseEventHandler<HTMLButtonElement>;
  type?:         'button' | 'submit' | 'reset';
  className?:    string;
  'aria-label'?: string;
}
```

#### Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--background-button-idle` | `#f5f5f5` | Fond contained (idle) |
| `--background-button-hovered` | `#e5e5e5` | Fond contained (hover) |
| `--background-button-hovered-black` | `#171717` | Fond outlined-dark (hover) |
| `--border-button-contained` | `#d4d4d4` | Bordure contained |
| `--border-button-outlined-white` | `#f5f5f5` | Bordure outlined light |
| `--border-button-outlined-black` | `#171717` | Bordure outlined dark |
| `--text-button-contained` | `#737373` | Texte contained |
| `--text-button-outline-white` | `#f5f5f5` | Texte outlined light |
| `--text-button-outline-black` | `#171717` | Texte outlined dark |
| `--border-radius-button` | `999px` | Border-radius |
| `--spacing-component-sm` | `8px` | Gap + padding vertical nm |
| `--spacing-component-md` | `16px` | Padding horizontal + vertical md |

#### Règles d'usage

- `contained` : toujours sur fond sombre (texte et bordure gris clair)
- `outlined light` / `outlined default` : fond sombre → outline blanc, hover remplit en clair
- `outlined dark` : fond clair → outline noir, hover remplit en noir
- Taille `nm` = 40px de hauteur, `md` = 48px de hauteur
- Toujours fournir `aria-label` si le bouton ne contient que des icônes
