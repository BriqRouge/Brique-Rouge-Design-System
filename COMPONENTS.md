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

- **Largeur 100% (responsive)** — le composant remplit son conteneur (le consommateur définit la largeur, 276px par défaut dans les stories via un wrapper). Corrigé d'une largeur fixe 276px initiale : le panneau révélé par `ProjectBentoCard` au survol doit occuper toute la largeur de la carte, y compris lorsqu'elle s'agrandit à 576px — vérifié dans le JSX Figma (`left-[-1px] right-[-1px]`, jamais une largeur figée)
- **Hauteur automatique** (pas 120px fixe) — le titre du Figma source s'affiche volontairement sur 2 lignes, une hauteur figée tronquerait la catégorie dès que le titre dépasse 1 ligne
- **Hauteur visuelle ≈120px, conforme au Figma** : `line-height: 1` sur project/year/category (repli universel, ~130px) + `text-box-trim: trim-both` / `text-box-edge: cap alphabetic` en amélioration progressive sur les 4 textes (~114px dans les navigateurs compatibles, Chrome 130+). Ne jamais reprendre les valeurs `line-height` littérales du JSX généré par Figma (24px, 18px) sans vérifier qu'elles ne sont pas elles-mêmes compressées par `text-box-trim` côté Figma — sinon le composant rend significativement plus grand que prévu
- `children` = titre du projet ; supporte un retour à la ligne manuel (`<br />`) ou un wrap naturel
- **Écart signalé vs Figma** : dans le fichier Figma, le texte n'est lié à aucune variable de couleur (`color/text/*`) — mappé sur `--color-neutral-900` (le noir pur du Figma ne correspond à aucun token existant)
- **Écart signalé vs Figma** : les poids de police Figma (`Light` pour les labels, `Medium` variable ~571 pour le titre) n'ont pas d'équivalent exact dans `--typography-font-weight-*` — mappés sur `regular` (400) et `medium` (500)

---

### AlertBanner

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/AlertBanner/`
**Node Figma :** `755:21871` ("Notifications / Alert Banners")

#### API

```ts
type AlertBannerType = 'info' | 'warning';

interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title:        string;             // requis — titre en gras
  type?:        AlertBannerType;    // default: 'info'
  timestamp?:   string;             // ex: "Il y a 5 min."
  description?: string;
  onClose?:     () => void;         // affiche le bouton de fermeture si fourni
  children?:    React.ReactNode;    // CTA optionnels — typiquement des <Button />
}
```

#### Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-background-notification-info` | `#f0f4fe` | Fond, type info |
| `--color-background-notification-warning` | `#fdf7ef` | Fond, type warning |
| `--color-border-notification-info` | `#6c95ee` | Bordure, type info |
| `--color-border-notification-warning` | `#e68c47` | Bordure, type warning |
| `--color-text-notification-info` | `#2c41c9` | Texte titre + description, info |
| `--color-text-notification-warning` | `#af471f` | Texte titre + description, warning |
| `--color-text-notification-info-timestamp` | `#567be9` | Texte horodatage, info |
| `--color-text-notification-warning-timestamp` | `#e1742e` | Texte horodatage, warning |
| `--color-icon-notification-info` | `#3453dc` | Icône d'en-tête, info |
| `--color-icon-notification-warning` | `#e1742e` | Icône d'en-tête, warning |
| `--color-icon-notification-info-close` | `#263282` | Bouton de fermeture, info |
| `--color-icon-notification-warning-close` | `#71311d` | Bouton de fermeture, warning |
| `--border-radius-lg` | `12px` | Border-radius de la carte |
| `--spacing-x4` | `16px` | Padding de la carte |
| `--spacing-x2` | `8px` | Gap entre header/description/CTA |
| `--spacing-x1` | `4px` | Gap dans le header (icône/titre/horodatage/fermeture) |

#### Règles d'usage

- `title` est la seule prop requise — `timestamp`, `description`, `onClose` (bouton fermeture) et `children` (CTA) sont tous optionnels et n'affichent leur zone respective que s'ils sont fournis
- Les CTA sont composés par le consommateur via `children` (ex: `<Button variant="primary" colorScheme="info">…</Button>`) — le composant ne connaît pas leur contenu, cohérent avec le pattern déjà établi par `TopNav`
- Largeur 100% (responsive) — contrairement au frame Figma fixé à 641px ; hauteur automatique
- Icônes (info, warning, fermeture) dessinées à la main en SVG inline avec `currentColor`, pas d'assets Figma exportés — nécessaire pour recolorer selon `type`
- **Écart signalé vs Figma** : le contenu du Figma est du lorem ipsum avec des icônes de boutons placeholder (téléchargement/mail) — validé avec Damien que le contenu des CTA doit être entièrement personnalisable via `Button`, rien n'est figé en dur

---

### ProjectBentoCard

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/ProjectBentoCard/`
**Node Figma :** `1759:22825` ("Projects-Bento-Cards")

#### API

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

#### Tokens CSS utilisés

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

#### Règles d'usage

- Taille de base 276×276px (`square`) ou 276×576px (`rectangle`) ; au survol/focus, la bordure et le fond changent toujours, mais **la largeur ne passe à 576px que si `expandOnHover` est activé**
- **`expandOnHover` : comportement non uniforme entre variantes, vérifié dans le Figma source (node `1759:22825`)** — seules 2 des 5 combinaisons s'agrandissent réellement : `Odaptos` (square) et `Conseil constitutionnel` (rectangle). `BPCE` et `iBP` changent de couleur et révèlent leur description à taille fixe ; `CV` change de couleur et transforme son illustration, sans description. Ne pas supposer un agrandissement uniforme — vérifier chaque variante individuellement avant d'implémenter une interaction Figma partagée entre plusieurs instances d'un même composant.
- **Positionnement obligatoire** : conteneur parent `position: relative`, chaque carte en `position: absolute` — comme la grille bento réelle. En flux normal (flex/grid), l'agrandissement d'une carte `expandOnHover` pousse les cartes voisines et leur vole le survol
- `description` n'est affiché qu'au survol (`:hover`) ou focus d'un enfant (`:focus-within`) — reste dans le DOM en permanence (opacity/transform, pas de montage conditionnel), donc lisible par un lecteur d'écran indépendamment du survol
- Le survol clavier nécessite un enfant focusable (ex: un lien enveloppant la carte) — `:focus-within` seul ne déclenche rien si la carte ne contient aucun élément focusable
- Transition `width` 150ms ease-out — exception documentée à la règle DS générale "n'animer que `transform`/`opacity`" : ici la largeur doit réellement changer pour révéler du contenu sans étirer le texte ; `prefers-reduced-motion` réduit la transition à 1ms
- **Aucune donnée de motion Figma** : `get_motion_context` ne retourne rien pour ce composant — la transition ci-dessus est alignée sur la convention déjà établie dans `Button`/`MenuButton` (150ms ease-out), pas extraite de Figma
- **Écart signalé vs Figma, validé par Damien** : la couleur `conseil-constitutionnel` avait dérivé côté Figma (`#5bdb50` vs `#32c126`) — mise à jour globalement (impacte aussi `TopNav`)
- **`hoverChildren` vs repositionnement — deux mécaniques différentes, à ne pas confondre** : quand le Figma source montre un **contenu différent** entre idle et hover (ex: Odaptos, où l'image disparaît au profit de la description), utiliser `hoverChildren` (crossfade `opacity`, même mécanique que `description`, activé par la classe `hasHoverVisual` posée automatiquement quand la prop est fournie). Quand le Figma source montre les **mêmes éléments qui se déplacent/redimensionnent** (ex: Conseil constitutionnel — mockup téléphone + ordinateur portable identiques aux deux états, seule leur position/taille change), ne pas utiliser `hoverChildren` : passer directement la composition en `children` et transitionner `left`/`top`/`width`/`height` en CSS via `:hover`/`:focus-within` sur `[data-component="ds-br-project-bento-card"]`. Vérifier au cas par cas dans Figma (comparer les valeurs `left`/`top`/`width`/`height` entre les deux variantes idle/hover du même node) avant de choisir l'une ou l'autre — ne jamais supposer.
- **Assets manquants dans Figma peuvent être des vidéos, pas des échecs d'export** : pour Conseil constitutionnel, les zones d'écran (téléphone et ordinateur portable) n'ont aucune image de fond dans les données retournées par `get_design_context`/`get_metadata`. Avant de conclure à un problème d'extraction, vérifier le nom des layers concernés — ici `[Mobile]Home_page_record 1` et `Conseil_Constitutionnel_Clip_Accueil` indiquent explicitement un enregistrement vidéo prévu pour le site réel, jamais fourni comme image statique côté Figma. Traiter avec un fond neutre (`--color-neutral-200`) documenté comme temporaire, plutôt que d'inventer un contenu.
