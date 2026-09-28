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
**Node Figma :** `1506:20751` (composant "Button" — source de vérité pour tous les boutons du DS)

#### API

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

#### Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-button-primary` / `-hover` | `#262626` / `#404040` | Fond primary neutre |
| `--color-button-secondary-hover` | `#262626` | Fond secondary neutre (hover, remplit) |
| `--color-button-info` / `-hover` | `#3453dc` / `#2c41c9` | Fond primary + bordure/fond hover secondary, info |
| `--color-button-warning` / `-hover` | `#e1742e` / `#d35c23` | Idem, warning |
| `--color-button-success` / `-hover` | `#23a019` / `#1f7d18` | Idem, success |
| `--color-button-error` / `-hover` | `#e22020` / `#be1717` | Idem, error |
| `--color-button-focus` | `#567be9` | Outline focus visible |
| `--color-border-button-secondary` | `#262626` | Bordure secondary neutre |
| `--color-text-button-primary` / `-hover` | `#fafafa` | Texte sur fond plein (primary, ou secondary au hover) |
| `--color-text-button-secondary` / `-hover` | `#262626` / `#fafafa` | Texte secondary neutre (idle / hover) |
| `--color-text-button-tertiary` / `-hover` / `-focus` | `#262626` / `#404040` / `#3453dc` | Texte tertiary selon l'état |
| `--color-icon-button-info` / `warning` | `#3453dc` / `#e1742e` | Icône + texte secondary info/warning (idle) |
| `--border-radius-button` | `999px` | Border-radius (pill) |
| `--spacing-component-sm` | `8px` | Gap + padding vertical |
| `--sizing-x3` | `12px` | Padding horizontal |
| `--sizing-button-nm` | `40px` | Hauteur (taille unique, pas de variant size) |

#### Règles d'usage

- `primary` : fond plein — neutre (`#262626`) ou couleur sémantique
- `secondary` : bordure 2px, fond transparent — au hover, se remplit en plein (couleur sémantique ou neutre) avec texte blanc
- `tertiary` : lien souligné, sans fond ni bordure — **toujours neutre**, `colorScheme` est ignoré
- `colorScheme` (`info`/`warning`/`success`/`error`) s'applique à `primary` et `secondary`, jamais à `tertiary`
- Taille unique (40px de hauteur) — pas de variant `size` comme sur MenuButton
- État disabled : réutilise les tokens neutres génériques (`color/background/button/disabled` etc.) — le Figma source ne définit pas d'état disabled dédié par schéma de couleur
- Toujours fournir `aria-label` si le bouton ne contient que des icônes — passer `children={null}`
- Ne pas confondre avec `MenuButton` : composant distinct, plus ancien, utilisé notamment par `TopNav` (bouton retour, trigger de dropdown) — les deux composants coexistent intentionnellement

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
| `--border-radius-lg` | `12px` | Arrondi des coins bas uniquement (coins hauts carrés) |

#### Règles d'usage

- Largeur fixe 276px (spec Figma) ; **hauteur automatique** (pas 120px fixe) — le titre du Figma source s'affiche volontairement sur 2 lignes, une hauteur figée tronquerait la catégorie dès que le titre dépasse 1 ligne
- `children` = titre du projet ; supporte un retour à la ligne manuel (`<br />`) ou un wrap naturel
- **Écart signalé vs Figma** : dans le fichier Figma, le texte n'est lié à aucune variable de couleur (`color/text/*`) — mappé sur `--color-neutral-900` (le noir pur du Figma ne correspond à aucun token existant)
- **Écart signalé vs Figma** : les poids de police Figma (`Light` pour les labels, `Medium` variable ~571 pour le titre) n'ont pas d'équivalent exact dans `--typography-font-weight-*` — mappés sur `regular` (400) et `medium` (500)
