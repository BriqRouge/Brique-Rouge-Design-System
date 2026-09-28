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

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/Button/`

#### API

```ts
type ButtonVariant     = 'contained' | 'outlined';
type ButtonColorScheme = 'default' | 'light' | 'dark';
type ButtonSize        = 'nm' | 'md';

interface ButtonProps {
  children:      React.ReactNode;    // requis — contenu textuel du bouton
  variant?:      ButtonVariant;      // default: 'contained'
  colorScheme?:  ButtonColorScheme;  // default: 'default' — ignoré si variant='contained'
  size?:         ButtonSize;         // default: 'nm'
  leftIcon?:     React.ReactNode;
  rightIcon?:    React.ReactNode;
  disabled?:     boolean;
  onClick?:      React.MouseEventHandler<HTMLButtonElement>;
  type?:         'button' | 'submit' | 'reset';
  className?:    string;
  'aria-label'?: string;
}
```

#### Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-background-button-idle` | `#f5f5f5` | Fond contained (idle) |
| `--color-background-button-hovered` | `#e5e5e5` | Fond contained/outlined-light (hover) |
| `--color-background-button-hovered-black` | `#171717` | Fond outlined-dark (hover) |
| `--color-background-button-disabled` | `#f5f5f5` | Fond état disabled (tous variants) |
| `--color-border-button-contained` | `#d4d4d4` | Bordure contained |
| `--color-border-button-outlined-white` | `#f5f5f5` | Bordure outlined light |
| `--color-border-button-outlined-black` | `#171717` | Bordure outlined dark |
| `--color-border-button-focus` | `#3453dc` | Outline focus visible |
| `--color-border-button-disabled` | `#d4d4d4` | Bordure état disabled |
| `--color-text-button-contained` | `#737373` | Texte contained |
| `--color-text-button-outline-white` | `#f5f5f5` | Texte outlined light |
| `--color-text-button-outline-black` | `#171717` | Texte outlined dark |
| `--color-text-button-disabled` | `#d4d4d4` | Texte état disabled |
| `--border-radius-button` | `999px` | Border-radius |
| `--spacing-component-sm` | `8px` | Gap + padding vertical |
| `--sizing-x3` | `12px` | Padding horizontal nm |
| `--spacing-x3-5` | `14px` | Padding horizontal md |

#### Règles d'usage

- `contained` : toujours sur fond sombre (texte et bordure gris clair)
- `outlined light` / `outlined default` : fond sombre → outline blanc, hover remplit en clair
- `outlined dark` : fond clair → outline noir, hover remplit en noir
- Taille `nm` = 40px de hauteur, `md` = 48px de hauteur
- État disabled : couleurs dédiées (pas d'opacité)
- Toujours fournir `aria-label` si le bouton ne contient que des icônes — passer `children={null}`

---

### FrameLogo

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/FrameLogo/`

#### API

```ts
interface FrameLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  src:   string;           // requis — URL de l'image
  alt?:  string;           // défaut: '' (décoratif)
}
```

#### Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--sizing-x6` | `24px` | Largeur et hauteur du conteneur |
| `--border-radius-sm` | `4px` | Arrondi du conteneur |
| `--color-neutral-100` | `#f5f5f5` | Fond fallback si image absente |
| `--elevation-1-key-shadow-*` | — | Ombre portée (key layer) |
| `--elevation-1-ambient-shadow-*` | — | Ombre portée (ambient layer) |

#### Règles d'usage

- Conteneur fixe 24×24px, `overflow: hidden`, `flex-shrink: 0`
- Image en `object-fit: cover` — toujours passer une URL valide
- Si le logo est purement décoratif, laisser `alt=""` (défaut)
- Si le logo est informatif, renseigner un `alt` descriptif

### TopNav

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/TopNav/`

#### API

```ts
type TopNavProject = 'odaptos' | 'bpce' | 'ibp' | 'opco-atlas' | 'conseil-constitutionnel';

// project absent = état homepage (pas de bouton retour ni de titre)
// project fourni = title requis, subtitle optionnel
interface TopNavProps {
  children:      React.ReactNode;     // requis — contenu du menu déroulant "Sélection projets" (ex: <DropdownMenuButton />)
  project?:      TopNavProject;
  title?:        string;              // requis si project est fourni
  subtitle?:     string;
  onBackClick?:  () => void;
  className?:    string;
}
```

#### Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-background-projects-{project}` | — | Fond de la pilule (un par projet) |
| `--color-text-nav-bar-{project}` | — | Couleur du titre **et** du sous-titre (un par projet — même couleur pour les deux) |
| `--color-border-menu-button-outlined-white`, `--color-text-menu-button-outline-white` | — | Bouton retour (`MenuButton` outlined/light/md) |
| `--spacing-x10`, `--spacing-x12`, `--spacing-x6` | `40px`, `48px`, `24px` | Padding du conteneur |
| `--spacing-component-md`, `--spacing-component-lg`, `--spacing-component-sm` | `16px`, `24px`, `8px` | Padding/gap de la pilule |
| `--border-radius-button` | `999px` | Border-radius de la pilule |
| `--typography-font-size-xl` | `20px` | Taille du titre/sous-titre |

#### Règles d'usage

- Réutilise `MenuButton` (bouton retour) et `DropdownMenuTrigger` (sélecteur de projets) — ne pas dupliquer leur logique
- Le contenu du menu déroulant est entièrement fourni par le consommateur via `children` — TopNav ne connaît pas la liste des projets
- État homepage : `project` non fourni → pas de bouton retour ni de titre, le trigger est aligné à droite
- Titre et sous-titre partagent la même couleur (`color/text/nav-bar/{project}`), seul le `font-weight` diffère (medium vs regular)

---

### ProjectCardDescription

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/ProjectCardDescription/`
**Node Figma :** `1902:22312` ("Project-Cards-Description")

#### API

```ts
interface ProjectCardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children:  React.ReactNode; // requis — titre du projet (contenu principal, peut être multi-lignes)
  project:   string;          // requis — nom du projet (ex: "Odaptos")
  year:      string;          // requis — année du projet (ex: "2024")
  category:  string;          // requis — catégorie/rôle (ex: "Product Design")
}
```

#### Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-background-projects-body` | `#e5e5e5` | Fond de la carte |
| `--color-neutral-900` | `#171717` | Couleur de tout le texte (voir note ci-dessous) |
| `--typography-font-family-sans` | `ABC Favorit Pro Variable` | Police (tous les textes) |
| `--typography-font-size-base` | `16px` | Taille du nom du projet et du titre |
| `--typography-font-size-sm` | `14px` | Taille de l'année et de la catégorie |
| `--typography-font-weight-medium` | `500` | Poids du titre |
| `--typography-font-weight-regular` | `400` | Poids du nom du projet, de l'année et de la catégorie |
| `--spacing-x4` | `16px` | Padding + gap entre les 3 sections |

#### Règles d'usage

- Largeur fixe 276px (spec Figma) ; **hauteur automatique** (pas 120px fixe) — le titre du Figma source s'affiche volontairement sur 2 lignes, une hauteur figée tronquerait la catégorie dès que le titre dépasse 1 ligne
- `children` = titre du projet ; supporte un retour à la ligne manuel (`<br />`) ou un wrap naturel
- **Écart signalé vs Figma** : dans le fichier Figma, le texte n'est lié à aucune variable de couleur (`color/text/*`) — mappé sur `--color-neutral-900` (le noir pur du Figma ne correspond à aucun token existant)
- **Écart signalé vs Figma** : les poids de police Figma (`Light` pour les labels, `Medium` variable ~571 pour le titre) n'ont pas d'équivalent exact dans `--typography-font-weight-*` — mappés sur `regular` (400) et `medium` (500)
