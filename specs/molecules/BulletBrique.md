---
component: BulletBrique
tier: molecule
figma:
  node: "2131:21897"
  name: Animation-bullet-brique
  type: component-set
---
# BulletBrique

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/BulletBrique/`
**Figma :** `State=bullet closed|bullet openned`. Survol (Smart Animate 300ms linéaire) : ouverture, révélation de 6 `Badge`. Utilisé 3 fois sur la page d'accueil du Portfolio

## API

```ts
interface BulletBriqueProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode; // intitulé (ex : « J'apporte de la clarté »)
  keywords: string[];        // mots-clés révélés, en Badge md
}
```

**Types exportés :** `BulletBriqueProps`
**data-component :** `ds-br-bullet-brique`
**data-attributes :** `data-state` (`closed` | `opened`)

## Composition

Molécule : illustration de brique (asset), intitulé et une liste d'atomes `Badge` (`size="md"`, `contained`).

```
div[data-component]
├── button[aria-expanded][aria-controls]
│   ├── span.brique (aria-hidden) ← ombre + brique, SVG assets/brand/brique-bullet*.svg
│   └── span.label                ← children
└── div.panel (grid 0fr → 1fr)
    └── ul#id > li > Badge         ← keywords
```

## Ouverture (décision Damien, 2026-11-04)

Survol, focus clavier **et** clic / tap, pour que les mots-clés soient accessibles sans souris :

| Interaction | Effet |
|---|---|
| Survol souris (`pointerType="mouse"`) | ouvre ; sortie → referme, comme Figma |
| Focus clavier (`:focus-visible`) | ouvre ; perte du focus → referme |
| Clic, tap, Entrée, Espace | épingle ou désépingle l'ouverture |
| Échap | referme |

Le bouton porte `aria-expanded` et `aria-controls`. Fermée, la liste est en `visibility: hidden` (hors de l'arbre d'accessibilité).

## Animation (get_motion_context, 2131:21897)

- **Lévitation en boucle**, 4993ms. La brique monte de 6,667px (montée sur 32 % du cycle, descente sur le reste, ease-in-out sinusoïdal), l'ombre rétrécit (×0,82) et s'estompe (0,22 → 0,10)
- **Ouverture** : 300ms linéaire (Smart Animate Figma). Hauteur via `grid-template-rows`, exception documentée à la règle « n'animer que transform/opacity », plus fondu des badges
- `prefers-reduced-motion: reduce` : lévitation arrêtée, ouverture en 1ms
- Valeurs codées en dur dans les keyframes : pas de token motion dans le DS

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-text-primary` | `#171717` | Intitulé (Figma : `#000000` non lié, voir incohérences) |
| `--color-border-focus` | `#3453dc` | Contour de focus |
| `--typography-font-family-sans` | — | Intitulé (Figma : `typography/button/md/font-family`, même police) |
| `--typography-font-size-2xl` | `24px` | Intitulé |
| `--typography-font-weight-regular` | `400` | Intitulé |
| `--spacing-x2` | `8px` | Gap brique/intitulé, espacement des badges, retrait du panneau |
| `--sizing-x8` | `32px` | Largeur du cadre de la brique |

## Assets

`assets/brand/brique-bullet.svg` (158 pixels) et `brique-bullet-shadow.svg` (16 pixels), générés depuis les vecteurs Figma (grille de 8/9 px). Pixel art aux couleurs propres à l'illustration, hors tokens (CLAUDE.md : contenu illustratif). Les briques de `TopNav` (`brick-1..4.svg`) sont un autre dessin, à une autre échelle.

## Incohérences Figma signalées (2026-11-04, non corrigées)

- Valeurs de variante `bullet closed` / `bullet openned` : ni kebab-case, ni orthographe (`openned`)
- Intitulé sans style de texte, police liée à `typography/button/md/font-family`, couleur `#000000` non liée (code : `--color-text-primary`)
- Le cadre de la brique (`brique-levitation 2`) a un fond blanc `#ffffff` non lié, non repris dans le code (il ferait apparaître un carré blanc sur le fond de page)
- Le composant ouvert fait 116px de haut alors que les badges s'arrêtent à 102px. Le code suit le contenu (101px)
- Les badges sont positionnés à la main (pas d'auto-layout) ; le code les dispose en flex-wrap avec gap 8px, mêmes positions à 1px près

## Tests

9 tests — 9 passants
