---
component: TopNav
tier: organism
figma:
  node: "1702:20362"
  name: TopNav
  type: component-set
---
# TopNav

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/organisms/TopNav/`
**Figma :** 6 variantes `Type=`
**Fichiers :** `TopNav.tsx`, `TopNav.module.css`, `TopNav.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/TopNav.stories.tsx`

## API

```ts
type TopNavProject = 'odaptos' | 'bpce' | 'ibp' | 'opco-atlas' | 'conseil-constitutionnel';

// project absent = état homepage : logo animé + logo-texte, aucune autre prop
// project fourni = title et children requis, subtitle optionnel
interface TopNavProps {
  project?:     TopNavProject;
  title?:       string;           // requis si project est fourni
  subtitle?:    string;
  children?:    React.ReactNode;  // requis si project est fourni — contenu du menu "Sélection projets"
  onBackClick?: () => void;       // page projet uniquement
  className?:   string;
  // + props HTML natives (HTMLElement, racine <nav>)
}
```

**Types exportés :** `TopNavProps`, `TopNavProject`
**data-attributes :** `data-project` (sur la pilule, absent en homepage)

## Composition

**Page projet** : réutilise `MenuButton` (atome — bouton retour, `outlined`/`light`/`md`) et `DropdownMenuTrigger` (organisme — sélecteur de projets, `triggerSize="md"`) — ne pas dupliquer leur logique. Le contenu du menu déroulant est entièrement fourni par le consommateur via `children` : `TopNav` ne connaît pas la liste des projets.

**Homepage** : logo animé (4 briques SVG, `packages/react/src/assets/brand/brick-{1..4}.svg`, Figma `Animation-Logo` 2104:28062) et logo-texte « **Damien**Ramzi » (`expressive/md-light` + `expressive/md`). Pas de sélecteur de projets.

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-background-projects-{project}` | — | Fond de la pilule (un par projet) |
| `--color-text-nav-bar-{project}` | — | Couleur du titre **et** du sous-titre (un par projet — même couleur pour les deux) |
| `--color-border-menu-button-outlined-white`, `--color-text-menu-button-outlined-light-hover` | — | Bouton retour (`MenuButton` outlined/light/md) |
| `--spacing-x10`, `--spacing-x6` | `40px`, `24px` | Padding vertical du conteneur |
| `--spacing-layout-nav-inline` | `48px` (mobile `16px`) | Padding horizontal du conteneur — token viewport (Figma `spacing/layout/nav-inline`) |
| `--spacing-component-md`, `--spacing-component-lg`, `--spacing-component-sm` | `16px`, `24px`, `8px` | Padding/gap de la pilule |
| `--border-radius-button` | `999px` | Border-radius de la pilule |
| `--typography-font-size-xl` | `20px` | Taille du titre/sous-titre |
| `--typography-font-family-display-median`, `--typography-font-size-2xl`, `--typography-line-height-x10` | `"GT Ultra Median"`, `24px`, `40px` | Logo-texte homepage |
| `--typography-font-weight-light`, `--typography-font-weight-black` | `300`, `900` | « Damien » / « Ramzi » |
| `--color-text-secondary` | `#525252` | Couleur du logo-texte |
| `--sizing-x12` | `48px` | Largeur du logo animé |
| `--spacing-component-md` | `16px` | Écart logo / logo-texte, padding droit homepage |

## Sous le breakpoint (mobile)

Figma `Viewport=mobile` (header : 2353:38724). Pas de prop React : l'adaptation passe par le CSS
(`@media not (--viewport-desktop)`, breakpoint 816px = 51em, voir
`specs/foundations/breakpoint.md`).

- Header (homepage) : padding horizontal 16px (token viewport), bloc logo avec `--spacing-x4` sur les 4 côtés et hauteur ajustée au contenu (72px, contre 88px fixe sur desktop)
- **Barre projet mobile (`Type=bottomnav-bar`) : non implémentée, volontairement** — ses deux boutons servent à passer d'un projet à l'autre, mais c'est une idée de design que Damien n'a pas encore confirmée (2026-11-07). Rien à implémenter tant qu'elle n'est pas validée. Sous le breakpoint, la barre projet garde pour l'instant la mise en page desktop avec un padding horizontal de 16px

## Règles d'usage

- **États** : homepage (pas de `project`) → logo animé + logo-texte alignés en haut à gauche, sans sélecteur ; page projet (`project` fourni) → fond coloré, bouton retour "Accueil", titre + sous-titre centré dans l'espace libre, sélecteur à droite (`space-between`, comme Figma)
- **Motion** : les 4 briques se décalent puis reviennent, boucle de 5 s, interpolation linéaire entre les points exportés de Figma (`get_motion_context`). Figé sous `prefers-reduced-motion: reduce`. Logo décoratif : `aria-hidden`, images `alt=""`
- **Marges** : 40 / 48 / 24 px pour tous les variants (Figma homepage aligné sur 48 px le 2026-11-04)
- Titre et sous-titre partagent la même couleur (`--color-text-nav-bar-{project}`), seul le `font-weight` diffère (medium vs regular)

## Tests

13 tests — 13 passants
