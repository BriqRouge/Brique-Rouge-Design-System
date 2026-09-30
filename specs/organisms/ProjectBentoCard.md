# ProjectBentoCard

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/organisms/ProjectBentoCard/`
**Node Figma :** `1759:22825` ("Projects-Bento-Cards")
**Fichiers :** `ProjectBentoCard.tsx`, `ProjectBentoCard.module.css`, `ProjectBentoCard.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/ProjectBentoCard.stories.tsx`

## API

```ts
type ProjectBentoCardProject = 'odaptos' | 'bpce' | 'ibp' | 'conseil-constitutionnel' | 'cv';
type ProjectBentoCardShape  = 'square' | 'rectangle';

interface ProjectBentoCardProps {
  project:        ProjectBentoCardProject; // requis — couleur d'accent au survol
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

## Composition

Réutilise `ProjectCardDescription` (molécule) comme panneau de description révélé au survol — ne pas dupliquer sa logique. Le contenu visuel (image, illustration) est fourni par le consommateur via `children`, le composant ne gère aucun asset.

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-border-bento-cards-idle` | `#e5e5e5` | Bordure au repos |
| `--color-border-bento-cards-hovered` | `#3453dc` | Bordure au survol/focus |
| `--color-background-projects-odaptos` | `#3453dc` | Fond au survol, projet Odaptos |
| `--color-background-projects-bpce` | `#9b75ab` | Fond au survol, projet BPCE |
| `--color-background-projects-ibp` | `#949ae5` | Fond au survol, projet iBP |
| `--color-background-projects-conseil-constitutionnel` | `#5bdb50` | Fond au survol, Conseil constitutionnel |
| `--color-background-projects-cv` | `#efde59` | Fond au survol, carte CV |
| `--border-radius-lg` | `12px` | Border-radius de la carte |
| `--spacing-x2` | `8px` | Décalage vertical de la description avant apparition |

## Règles d'usage

- Taille de base 276×276px (`square`) ou 276×576px (`rectangle`) ; au survol/focus, la bordure et le fond changent toujours, mais **la largeur ne passe à 576px que si `expandOnHover` est activé**
- **`expandOnHover` : comportement non uniforme entre variantes, vérifié dans le Figma source (node `1759:22825`)** — seules 2 des 5 combinaisons s'agrandissent réellement : `Odaptos` (square) et `Conseil constitutionnel` (rectangle). `BPCE` et `iBP` changent de couleur et révèlent leur description à taille fixe ; `CV` change de couleur et transforme son illustration, sans description. Ne pas supposer un agrandissement uniforme — vérifier chaque variante individuellement avant d'implémenter une interaction Figma partagée entre plusieurs instances d'un même composant
- **Positionnement obligatoire** : conteneur parent `position: relative`, chaque carte en `position: absolute` — comme la grille bento réelle. En flux normal (flex/grid), l'agrandissement d'une carte `expandOnHover` pousse les cartes voisines et leur vole le survol
- `description` n'est affiché qu'au survol (`:hover`) ou focus d'un enfant (`:focus-within`) — reste dans le DOM en permanence (opacity/transform, pas de montage conditionnel), donc lisible par un lecteur d'écran indépendamment du survol
- Le survol clavier nécessite un enfant focusable (ex: un lien enveloppant la carte) — `:focus-within` seul ne déclenche rien si la carte ne contient aucun élément focusable
- Transition `width` 150ms ease-out — exception documentée à la règle DS générale "n'animer que `transform`/`opacity`" : ici la largeur doit réellement changer pour révéler du contenu sans étirer le texte ; `prefers-reduced-motion` réduit la transition à 1ms
- **Aucune donnée de motion Figma** : `get_motion_context` ne retourne rien pour ce composant — la transition ci-dessus est alignée sur la convention déjà établie dans `Button`/`MenuButton` (150ms ease-out), pas extraite de Figma. Validé avec Damien
- **Écart signalé vs Figma, validé par Damien** : la couleur `conseil-constitutionnel` avait dérivé côté Figma (`#5bdb50` vs `#32c126`) — mise à jour globalement (impacte aussi `TopNav`, qui partage ce token)
- **`hoverChildren` vs repositionnement — deux mécaniques différentes, à ne pas confondre** : quand le Figma source montre un **contenu réellement différent** entre idle et hover (ex: Odaptos, où l'image disparaît au profit de la description), utiliser `hoverChildren` (crossfade `opacity`, même mécanique que `description`, activé par la classe `hasHoverVisual` posée automatiquement quand la prop est fournie). Quand le Figma source montre les **mêmes éléments qui se déplacent/redimensionnent** (ex: Conseil constitutionnel — mockup téléphone + ordinateur portable identiques aux deux états, seule leur position/taille change), ne pas utiliser `hoverChildren` : passer directement la composition en `children` et transitionner `left`/`top`/`width`/`height` en CSS via `:hover`/`:focus-within` sur `[data-component="ds-br-project-bento-card"]`. Vérifier au cas par cas dans Figma (comparer les valeurs `left`/`top`/`width`/`height` entre les deux variantes idle/hover du même node) avant de choisir l'une ou l'autre — ne jamais supposer. Défaut de `hoverChildren` : absent → aucun changement (zéro régression pour les cartes dont le contenu visuel n'est pas encore arrêté)
- **Assets Figma manquants peuvent être des vidéos, pas des échecs d'export** : pour Conseil constitutionnel, les zones d'écran (téléphone ET ordinateur portable) sont vides dans les assets exportables par `get_design_context`/`get_metadata` — les layers concernés s'appellent explicitement `[Mobile]Home_page_record 1` et `Conseil_Constitutionnel_Clip_Accueil`, confirmant qu'il s'agit d'enregistrements vidéo prévus pour le site réel, pas d'un problème d'export. Remplacé par un fond neutre (`--color-neutral-200`) en attendant que Damien fournisse la vidéo. Composition dédiée : `ProjectBentoCard.conseilConstitutionnel.tsx`/`.module.css` (packages/storybook), assets réels téléchargés dans `packages/storybook/src/stories/components/assets/project-bento-card/`

## Tests

15 tests — 15 passants
