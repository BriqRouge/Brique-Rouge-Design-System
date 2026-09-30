# ProjectCardDescription

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/ProjectCardDescription/`
**Node Figma :** `1902:22312` ("Project-Cards-Description")
**Fichiers :** `ProjectCardDescription.tsx`, `ProjectCardDescription.module.css`, `ProjectCardDescription.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/ProjectCardDescription.stories.tsx`

## API

```ts
interface ProjectCardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children:  React.ReactNode; // requis — titre du projet (contenu principal, peut être multi-lignes)
  project:   string;          // requis — nom du projet (ex: "Odaptos")
  year:      string;          // requis — année du projet (ex: "2024")
  category:  string;          // requis — catégorie/rôle (ex: "Product Design")
}
```

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-background-projects-body` | `#e5e5e5` | Fond de la carte |
| `--color-neutral-900` | `#171717` | Couleur de tout le texte (voir écart Figma ci-dessous) |
| `--typography-font-family-sans` | `ABC Favorit Pro Variable` | Police (tous les textes) |
| `--typography-font-size-base` | `16px` | Taille du nom du projet et du titre |
| `--typography-font-size-sm` | `14px` | Taille de l'année et de la catégorie |
| `--typography-font-weight-medium` | `500` | Poids du titre |
| `--typography-font-weight-regular` | `400` | Poids du nom du projet, de l'année et de la catégorie |
| `--spacing-x4` | `16px` | Padding + gap entre les 3 sections |
| `--border-radius-lg` | `12px` | Arrondi des coins bas uniquement (coins hauts carrés) |

## Règles d'usage

- **Largeur 100% (responsive)** — le composant remplit son conteneur (le consommateur définit la largeur, 276px par défaut dans les stories via un wrapper). Corrigé d'une largeur fixe 276px initiale : le panneau révélé par `ProjectBentoCard` au survol doit occuper toute la largeur de la carte, y compris lorsqu'elle s'agrandit à 576px — vérifié dans le JSX Figma (`left-[-1px] right-[-1px]`, jamais une largeur figée)
- **Hauteur automatique** (pas 120px fixe) — le titre du Figma source s'affiche volontairement sur 2 lignes, une hauteur figée tronquerait la catégorie dès que le titre dépasse 1 ligne
- **Hauteur visuelle ≈120px, conforme au Figma** : `line-height: 1` sur project/year/category (repli universel, ~130px) + `text-box-trim: trim-both` / `text-box-edge: cap alphabetic` en amélioration progressive sur les 4 textes (~114px dans les navigateurs compatibles, Chrome 130+). **Ne jamais reprendre les valeurs `line-height` littérales du JSX généré par Figma (24px, 18px) sans vérifier qu'elles ne sont pas elles-mêmes compressées par `text-box-trim` côté Figma** — sinon le composant rend significativement plus grand que prévu
- `children` = titre du projet ; supporte un retour à la ligne manuel (`<br />`) ou un wrap naturel
- **Écart signalé vs Figma** (validé par Damien) : le texte n'est lié à aucune variable de couleur Figma (`color/text/*`) — mappé sur `--color-neutral-900` (le noir pur du Figma ne correspond à aucun token existant)
- **Écart signalé vs Figma** (validé par Damien) : les poids de police Figma (`Light` pour les labels, `Medium` variable ~571 pour le titre) n'ont pas d'équivalent exact dans `--typography-font-weight-*` — mappés sur `regular` (400) et `medium` (500)

## Tests

7 tests — 7 passants
