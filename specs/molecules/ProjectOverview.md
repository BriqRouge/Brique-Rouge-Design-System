# ProjectOverview

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/ProjectOverview/`
**Node Figma :** `837:19534` ("Overview Projet") — vérifié identique sur les 4 pages projet (Odaptos, BPCE, iBP, OPCO Atlas)

## API

```ts
interface ProjectOverviewProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;              // requis — nom du projet, ex: "Odaptos"
  tagline: string;            // requis — accroche affichée après le tiret
  children: React.ReactNode;  // requis — paragraphe(s) de description, peut contenir des mots mis en avant
  role: string;                // requis — ex: "Founder Product Designer"
  contributions: string;       // requis — ex: "Sales, Product Strategy, ..."
}
```

**Types exportés :** `ProjectOverviewProps`
**data-component :** `ds-br-project-overview`

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-neutral-900` | `#171717` | Titre du projet |
| `--color-neutral-600` | `#525252` | Accroche (après le tiret) |
| `--color-neutral-700` | `#404040` | Texte de description |
| `--color-neutral-500` | `#737373` | Rôle et contributions |
| `--typography-font-family-sans` | — | Tous les textes |
| `--typography-font-size-3xl`/`-base` | `32px`/`16px` | Titre / reste |
| `--typography-font-weight-medium`/`-regular` | `500`/`400` | Titre / reste |
| `--spacing-x6`/`-x8` | `24px`/`32px` | Gap colonnes / padding |
| `--spacing-x10` | `40px` | Border-radius (token de spacing réutilisé en radius côté Figma) |

## Règles d'usage

- Layout en 2 colonnes égales (`flex: 1 0 0` chacune) : titre à gauche, description à droite
- `children` accepte du contenu riche (ex: `<span>` colorés pour mettre en avant certains mots) — le Figma source met en évidence des mots-clés (ex: "plateforme SaaS", "IA") en `--color-deep-sea-600`, mais ces mots-clés varient par projet donc ce n'est pas géré par le composant lui-même
- Les préfixes "Rôle:" et "Contribution:" sont posés par le composant (texte fixe identique sur les 4 pages), seules les valeurs sont fournies par le consommateur
- Aucun fond ni bordure — le conteneur est transparent dans le Figma source (le border-radius existe mais n'est visuellement pas perceptible sans fond)

## Tests

7 tests — 7 passants
