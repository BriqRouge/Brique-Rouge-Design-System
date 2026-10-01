# ProjectSectionsDescription

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/organisms/ProjectSectionsDescription/`
**Node Figma :** `744:20765` ("Cards / Project_Sections_Descritpion" — carte conteneur, typo Figma corrigée dans le nom du composant)

## API

```ts
interface ProjectSectionsDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;              // requis — ex: "Design system"
  children: React.ReactNode;  // requis — une ou plusieurs <ProjectSectionDescription />
}
```

**Types exportés :** `ProjectSectionsDescriptionProps`
**data-component :** `ds-br-project-sections-description`

## Composition

Réutilise `ProjectSectionDescription` (organisme) — chaque section est fournie par le consommateur via `children`, ce composant ne connaît pas leur contenu. Un séparateur (`data-divider`) est inséré automatiquement entre chaque section (N enfants → N-1 séparateurs) ; aucun séparateur si une seule section.

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-neutral-50` | `#fafafa` | Fond de la carte |
| `--color-neutral-900` | `#171717` | Titre de la carte |
| `--color-neutral-200` | `#e5e5e5` | Début du dégradé du séparateur |
| `--color-deep-sea-600` | `#3453dc` | Barre d'accent longue |
| `--color-deep-sea-200` | `#c4d5f9` | Barre d'accent courte |
| `--typography-heading-font-family`/`-font-weight` | — | Titre de la carte |
| `--typography-font-size-5xl` | `48px` | Titre de la carte |
| `--spacing-x16`/`-x4`/`-x6`/`-x2` | `64px`/`16px`/`24px`/`8px` | Gaps internes |
| `--border-radius-full` | `999px` | Barres d'accent et séparateur |

## Règles d'usage

- Les sections passées en `children` sont typiquement des `<ProjectSectionDescription />`, mais le composant ne force rien structurellement — n'importe quel `ReactNode` reçoit un séparateur entre éléments
- Séparateur en dégradé (`linear-gradient` vers transparent), pas une bordure pleine — reproduit fidèlement le style du Figma source
- **Écart signalé vs Figma** : padding horizontal de la carte (128px) sans token correspondant — l'échelle spacing s'arrête à `--spacing-x20` (80px). Valeur littérale utilisée
- **Écart signalé vs Figma** : border-radius de la carte (40px) sans token correspondant — l'échelle actuelle va jusqu'à `--border-radius-2xl` (24px) puis `--border-radius-full` (999px). Valeur littérale utilisée

## Tests

8 tests — 8 passants
