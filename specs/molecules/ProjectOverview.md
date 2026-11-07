---
component: ProjectOverview
tier: molecule
figma:
  node: "2353:39997"
  name: Overview Projet
  type: component-set
---
# ProjectOverview

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/ProjectOverview/`
**Figma :** composant « Overview Projet » sur la page Design system, créé le 2026-11-02 à partir du cadre de la page Portfolio (`837:19534`), utilisé en instance sur toutes les pages projet de la page Portfolio (Odaptos, BPCE, iBP, OPCO Atlas, Conseil Constitutionnel — 20 instances, cadres copiés remplacés le 2026-11-02 après vérification des dimensions et des textes). Titre : styles `label/3xl-medium-trim` + `label/3xl-trim` (rognage à la hauteur des capitales)

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
| `--color-text-primary` | `#171717` | Titre du projet |
| `--color-text-body` | `#525252` | Accroche (après le tiret) |
| `--color-text-secondary` | `#404040` | Texte de description |
| `--color-text-tertiary` | `#737373` | Rôle et contributions |
| `--typography-font-family-sans` | — | Tous les textes |
| `--typography-project-overview-title-font-size` | `32px` (mobile `24px`) | Titre — token viewport |
| `--typography-font-size-base` | `16px` | Reste |
| `--typography-font-weight-medium`/`-regular` | `500`/`400` | Titre / reste |
| `--spacing-x6`/`-x8` | `24px`/`32px` | Gap colonnes / padding |
| `--border-radius-section-card` | `40px` | Border-radius (Figma : `border-radius/section-card`, depuis le 2026-11-05) |

## Sous le breakpoint (mobile)

Figma `Viewport=mobile` (2353:39987). Pas de prop React : l'adaptation passe par le CSS
(`@media not (--viewport-desktop)`, breakpoint 816px = 51em, voir
`specs/foundations/breakpoint.md`).

- Colonnes empilées (titre puis description), chacune en pleine largeur, gap `--spacing-x6`
- Titre 24px via le token viewport `--typography-project-overview-title-font-size`

## Règles d'usage

- Layout en 2 colonnes égales (`flex: 1 0 0` chacune) : titre à gauche, description à droite
- `children` accepte du contenu riche (ex: `<span>` colorés pour mettre en avant certains mots) — le Figma source met en évidence des mots-clés (ex: "plateforme SaaS", "IA") en `--color-deep-sea-600`, mais ces mots-clés varient par projet donc ce n'est pas géré par le composant lui-même
- Les préfixes "Rôle:" et "Contribution:" sont posés par le composant (texte fixe identique sur les 4 pages), seules les valeurs sont fournies par le consommateur
- Aucun fond ni bordure — le conteneur est transparent dans le Figma source (le border-radius existe mais n'est visuellement pas perceptible sans fond)

## Tests

7 tests — 7 passants
