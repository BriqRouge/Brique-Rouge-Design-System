# TopNav

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/organisms/TopNav/`
**Fichiers :** `TopNav.tsx`, `TopNav.module.css`, `TopNav.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/TopNav.stories.tsx`

## API

```ts
type TopNavProject = 'odaptos' | 'bpce' | 'ibp' | 'opco-atlas' | 'conseil-constitutionnel';

// project absent = état homepage (pas de bouton retour ni de titre)
// project fourni = title requis, subtitle optionnel
interface TopNavProps {
  children:     React.ReactNode;  // requis — contenu du menu déroulant "Sélection projets"
  project?:     TopNavProject;
  title?:       string;           // requis si project est fourni
  subtitle?:    string;
  onBackClick?: () => void;
  className?:   string;
  // + props HTML natives (HTMLElement, racine <nav>)
}
```

**Types exportés :** `TopNavProps`, `TopNavProject`
**data-attributes :** `data-project` (sur la pilule, absent en homepage)

## Composition

Réutilise `MenuButton` (atome — bouton retour, `outlined`/`light`/`md`) et `DropdownMenuTrigger` (organisme — sélecteur de projets, `triggerSize="md"`) — ne pas dupliquer leur logique. Le contenu du menu déroulant est entièrement fourni par le consommateur via `children` : `TopNav` ne connaît pas la liste des projets.

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `color/background/projects/{project}` | — | Fond de la pilule (un par projet) |
| `color/text/nav-bar/{project}` | — | Couleur du titre **et** du sous-titre (un par projet — même couleur pour les deux) |
| `--color-border-menu-button-outlined-white`, `--color-text-menu-button-outline-white` | — | Bouton retour (`MenuButton` outlined/light/md) |
| `--spacing-x10`, `--spacing-x12`, `--spacing-x6` | `40px`, `48px`, `24px` | Padding du conteneur |
| `--spacing-component-md`, `--spacing-component-lg`, `--spacing-component-sm` | `16px`, `24px`, `8px` | Padding/gap de la pilule |
| `--border-radius-button` | `999px` | Border-radius de la pilule |
| `--typography-font-size-xl` | `20px` | Taille du titre/sous-titre |

## Règles d'usage

- **États** : homepage (pas de `project`) → pas de bouton retour ni titre, trigger aligné à droite ; page projet (`project` fourni) → fond coloré, bouton retour "Accueil", titre + sous-titre
- Titre et sous-titre partagent la même couleur (`color/text/nav-bar/{project}`), seul le `font-weight` diffère (medium vs regular)

## Tests

12 tests — 12 passants
