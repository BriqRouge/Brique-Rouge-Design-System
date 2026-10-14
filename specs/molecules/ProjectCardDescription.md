# ProjectCardDescription

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/ProjectCardDescription/`
**Node Figma :** `1902:22312` ("Project-Cards-Description", `Type=Default`) / `2040:19252` (`Type=CV`)
**Fichiers :** `ProjectCardDescription.tsx`, `ProjectCardDescription.module.css`, `ProjectCardDescription.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/ProjectCardDescription.stories.tsx`

## API

Union discriminée par `variant` :

```ts
type ProjectCardDescriptionVariant = 'default' | 'cv';

// variant 'default' (défaut) — Figma Type=Default
{
  variant?:  'default';
  children:  React.ReactNode; // requis — titre du projet (peut être multi-lignes)
  project:   string;          // requis — nom du projet (ex: "Odaptos")
  year:      string;          // requis — année du projet (ex: "2024")
  category:  string;          // requis — catégorie/rôle (ex: "Product Design")
}

// variant 'cv' — Figma Type=CV : titre seul, centré
{
  variant:   'cv';
  children:  React.ReactNode; // requis — titre (ex: "CV")
}
```

**Types exportés :** `ProjectCardDescriptionProps`, `ProjectCardDescriptionVariant`
**data-component :** `ds-br-project-card-description`
**data-attributes :** `data-variant`

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
- **Hauteur fixe 120px** (validé par Damien, aligné sur les instances du composant Figma `ProjectBentoCard` `2032:20121`) — remplace la hauteur automatique précédente. Le titre occupe l'espace restant entre l'en-tête et la catégorie (`flex: 1 0 0`). Contenu prévu pour tenir dans 120px : un titre sur 1–2 lignes et une catégorie sur 1 ligne. Une catégorie qui passe à la ligne dans une largeur de 276px (ex : "Discovery | Product Design | Design System") déborde légèrement — dans `ProjectBentoCard`, la description Odaptos ne s'affiche qu'une fois la carte agrandie à 576px, où elle tient sur une ligne
- **Hauteur des textes** : `line-height: 1` sur project/year/category (repli universel, ~130px) + `text-box-trim: trim-both` / `text-box-edge: cap alphabetic` en amélioration progressive sur les 4 textes (rognage des interlignes pour coller au rendu Figma, Chrome 130+). **Ne jamais reprendre les valeurs `line-height` littérales du JSX généré par Figma (24px, 18px) sans vérifier qu'elles ne sont pas elles-mêmes compressées par `text-box-trim` côté Figma** — sinon le composant rend significativement plus grand que prévu
- `children` = titre du projet ; supporte un retour à la ligne manuel (`<br />`) ou un wrap naturel
- **Écart signalé vs Figma** (validé par Damien) : le texte n'est lié à aucune variable de couleur Figma (`color/text/*`) — mappé sur `--color-neutral-900` (le noir pur du Figma ne correspond à aucun token existant)
- **Écart signalé vs Figma** (validé par Damien) : les poids de police Figma (`Light` pour les labels, `Medium` variable ~571 pour le titre) n'ont pas d'équivalent exact dans `--typography-font-weight-*` — mappés sur `regular` (400) et `medium` (500)
- **Variante `cv`** (ajoutée pour la carte CV de `ProjectBentoCard`) : titre seul, centré horizontalement et verticalement
- **Storybook** : les props étant une union discriminée, la story utilise un type d'args plat + un `render` explicite (Storybook ne sait pas typer des args sur une union)

## Tests

10 tests — 10 passants
