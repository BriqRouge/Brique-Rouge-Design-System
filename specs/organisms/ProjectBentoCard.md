# ProjectBentoCard

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/organisms/ProjectBentoCard/`
**Node Figma :** `2032:20121` ("Card") — remplace l'ancien node `1759:22825` ("Projects-Bento-Cards")
**Variantes Figma :** `State=Idle|Hover` × `Project=Odaptos|BPCE|Ibp|CV|Conseil Constitutionnel`
**Fichiers :** `ProjectBentoCard.tsx`, `ProjectBentoCard.module.css`, `ProjectBentoCard.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/ProjectBentoCard.stories.tsx`

## API

```ts
type ProjectBentoCardProject = 'odaptos' | 'bpce' | 'ibp' | 'conseil-constitutionnel' | 'cv';
type ProjectBentoCardShape  = 'square' | 'rectangle';

interface ProjectBentoCardProps {
  project:        ProjectBentoCardProject; // requis — couleur de la plaque de fond et de la bordure au survol
  shape?:         ProjectBentoCardShape;   // default: 'square'
  expandOnHover?: boolean;                 // default: false — voir Règles d'usage
  description?:   React.ReactNode;         // révélé au survol/focus — typiquement <ProjectCardDescription />
  children:       React.ReactNode;         // requis — contenu visuel idle de la carte
  hoverChildren?: React.ReactNode;         // optionnel — contenu visuel alternatif, voir Règles d'usage
  className?:     string;
}
```

**Types exportés :** `ProjectBentoCardProps`, `ProjectBentoCardProject`, `ProjectBentoCardShape`
**data-component :** `ds-br-project-bento-card`
**data-attributes :** `data-project`, `data-shape`, `data-expand-on-hover`, `data-has-hover-visual`

## Structure

Deux plaques superposées de même taille (layers Figma "Surface BG" / "Surface Front") :

```
.card                     ← 276×276 (square) / 276×576 (rectangle), 576px de large au survol si expandOnHover
├── .surfaceBg            ← aria-hidden, couleur du projet, opacity 0 → 1 au survol
└── .surfaceFront         ← fond clair + bordure, overflow hidden, porte le contenu
    ├── .content          ← children
    ├── .hoverContent     ← hoverChildren (si fourni)
    └── .description      ← description, en bas de la façade
```

## Composition

Réutilise `ProjectCardDescription` (molécule) comme panneau de description révélé au survol — variante `cv` pour la carte CV. Le contenu visuel (image, illustration) est fourni par le consommateur via `children` / `hoverChildren`, le composant ne gère aucun asset. Les visuels réels des 5 cartes vivent dans Storybook (`ProjectBentoCard.visuals.tsx`, `ProjectBentoCard.conseilConstitutionnel.tsx`).

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-border-bento-cards-idle` | `#e5e5e5` | Bordure de la façade au repos |
| `--color-background-homepage` | `#fafafa` | Fond de la façade |
| `--color-background-projects-odaptos` | `#3453dc` | Plaque de fond + bordure au survol, Odaptos |
| `--color-background-projects-bpce` | `#9b75ab` | Plaque de fond + bordure au survol, BPCE |
| `--color-background-projects-ibp` | `#949ae5` | Plaque de fond + bordure au survol, iBP |
| `--color-background-projects-conseil-constitutionnel` | `#5bdb50` | Plaque de fond + bordure au survol, Conseil constitutionnel |
| `--color-background-projects-cv` | `#efde59` | Plaque de fond + bordure au survol, CV |
| `--border-radius-bento-section` | `12px` | Arrondi des deux plaques (token ajouté avec ce composant) |
| `--spacing-x2` | `8px` | Décalage de la façade au survol ; décalage vertical de la description avant apparition |

`--color-border-bento-cards-hovered` n'est plus utilisé par ce composant (la bordure prend la couleur du projet au survol, comme dans Figma).

## Règles d'usage

- **Effet de survol** : la façade se décale de **+8px à droite / −8px en haut** (`transform: translate`) et révèle la plaque de fond de la couleur du projet ; la bordure de la façade prend la même couleur. La façade **garde sa taille** (option validée par Damien) : l'emprise visuelle au survol est de 284×284 (square), 584×284 (Odaptos agrandie), 584×584 (Conseil constitutionnel agrandie). Le conteneur parent doit prévoir 8px de marge en haut et à droite
- Taille de base 276×276px (`square`) ou 276×576px (`rectangle`) ; la largeur ne passe à 576px que si `expandOnHover` est activé — dans le Figma source, seules **Odaptos** (square) et **Conseil constitutionnel** (rectangle) s'agrandissent
- **Positionnement obligatoire** : conteneur parent `position: relative`, chaque carte en `position: absolute` — comme la grille bento réelle. En flux normal (flex/grid), l'agrandissement d'une carte `expandOnHover` pousse les cartes voisines et leur vole le survol
- `description` n'est affichée qu'au survol (`:hover`) ou focus d'un enfant (`:focus-within`) — reste dans le DOM en permanence (opacity/transform, pas de montage conditionnel), donc lisible par un lecteur d'écran indépendamment du survol
- Le survol clavier nécessite un enfant focusable (ex: un lien enveloppant la carte) — `:focus-within` seul ne déclenche rien si la carte ne contient aucun élément focusable
- Transition `width` 150ms ease-out — exception documentée à la règle DS générale "n'animer que `transform`/`opacity`" : ici la largeur doit réellement changer pour révéler du contenu sans étirer le texte. Décalage de la façade en `transform`, plaque de fond en `opacity`. `prefers-reduced-motion` réduit toutes les transitions à 1ms
- **Aucune donnée de motion Figma** : `get_motion_context` ne retourne rien sur `2032:20121` — les transitions (150ms ease-out) suivent la convention de `Button`/`MenuButton`, pas une animation extraite de Figma
- **`hoverChildren` vs repositionnement — deux mécaniques différentes** : quand le Figma source montre un **contenu réellement différent** entre idle et hover, utiliser `hoverChildren` (crossfade `opacity`, classe `hasHoverVisual` posée automatiquement) — c'est le cas d'**iBP** (radar → capture d'écran), **CV** (illustration droite → inclinée), **Odaptos** et **BPCE** (MacBook → haut de façade vide). Quand Figma montre les **mêmes éléments qui se déplacent/redimensionnent** (**Conseil constitutionnel** — téléphone + ordinateur portable), passer la composition en `children` et transitionner `left`/`top`/`width`/`height` en CSS via `:hover`/`:focus-within` sur `[data-component="ds-br-project-bento-card"]`. Vérifier au cas par cas dans Figma avant de choisir
- **Survol Odaptos / BPCE : haut de façade vide** — intention design confirmée par Damien (contenu à venir). Reproduit avec un `hoverChildren` vide (`EmptyHoverVisual` dans la story) pour masquer le MacBook au survol
- **Écrans vidéo** : les écrans des mockups Odaptos (`Odaptos_DEMO_Final`) et Conseil constitutionnel (`[Mobile]Home_page_record`, `Conseil_Constitutionnel_Clip_Accueil`) sont des vidéos non exportables — fond neutre (`--color-neutral-200`) en attendant
- **Ombres des mockups** : les ombres Figma des instances mises à l'échelle (MacBook BPCE, téléphone et ordinateur portable Conseil constitutionnel) avaient des valeurs déformées (ex: `6.73px 2.524px`) — remplacées par les tokens `--elevation-4-*` à la demande de Damien. La capture iBP au survol utilise l'effet Figma "Drop Shadow/Elevation 3" (tokens `--elevation-3-*`, couleur ambiante `--elevation-4-ambient-shadow-color` comme dans Figma)

## Tests

17 tests — 17 passants
