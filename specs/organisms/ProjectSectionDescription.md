---
component: ProjectSectionDescription
tier: organism
figma:
  node: "2363:42524"
  name: Cards
  type: component-set
---
# ProjectSectionDescription

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/organisms/ProjectSectionDescription/`
**Figma :** section individuelle — composant enfant créé le 2026-11-02 à partir de « Section 1 » ; le parent `ProjectSectionsDescription` (`744:20765`) en empile des instances

## API

```ts
interface ProjectSectionDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: string;             // optionnel — ex: "01"
  title?: string;              // optionnel — ex: "Problème"
  children?: React.ReactNode;  // optionnel — texte d'introduction
  bulletPoints?: string[];     // optionnel — liste à puces
  alertBanner?: React.ReactNode; // optionnel — typiquement <AlertBanner />
}
```

**Types exportés :** `ProjectSectionDescriptionProps`
**data-component :** `ds-br-project-section-description`

## Correspondance avec les booléens Figma (décidé le 2026-11-04)

Le composant Figma porte 9 booléens. Le code est piloté par le contenu : un élément absent n'est pas rendu.

| Booléen Figma | Code |
|---|---|
| `Header` (numéro + titre) | ni `number` ni `title` → pas d'en-tête |
| `Subtitle` (titre seul) | pas de `title` → numéro seul |
| `Lead Text` | pas de `children` → pas d'accroche |
| `Bullet points list`, `Bullet Point 1–4` | `bulletPoints` absent ou vide → pas de liste ; un élément par puce |
| `Alert Banner` | `alertBanner` absent → pas de bandeau |

Souplesse assumée (décision Damien, 2026-11-04) : le code accepte un titre sans numéro (impossible en Figma, faute de booléen sur le numéro) et plus de 4 puces.

## Composition

Accepte `alertBanner` en slot optionnel — typiquement rempli avec `<AlertBanner>` (molécule, avec `<Button>` en CTA). Le composant ne connaît pas le contenu du bandeau, cohérent avec le pattern déjà établi par `ProjectBentoCard`/`TopNav`.

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-text-tertiary` | `#737373` | Numéro de section (neutral/500 depuis le 2026-11-04, contraste AA) |
| `--color-text-primary` | `#171717` | Titre de section |
| `--color-text-primary` | `#171717` | Texte d'introduction (`#262626` jusqu'au lot 4 de l'ADR-001) |
| `--color-text-secondary` | `#525252` | Texte des puces |
| `--color-deep-sea-600` | `#3453dc` | Icône des puces |
| `--typography-font-family-sans` | — | Numéro, titre de section, texte d'introduction |
| `--typography-body-font-family` | — | Texte des puces |
| `--typography-font-size-base` | `16px` | Numéro |
| `--typography-heading-xl-font-size`/`-line-height` | `32px`/`40px` (mobile `24px`/`32px`) | Titre de section — style Figma `heading/xl`, tokens viewport |
| `--typography-heading-lg-font-size`/`-line-height` | `24px`/`32px` (mobile `20px`/`28px`) | Texte d'introduction — style Figma `heading/lg`, tokens viewport |
| `--typography-font-weight-medium`/`-regular` | `500`/`400` | Numéro et titre (medium), reste (regular) |
| `--spacing-x6`/`-x4` | `24px`/`16px` | Gaps ; indentation de la liste (`--spacing-x4`, toutes tailles) |
| `--sizing-x6` | `24px` | Taille de l'icône des puces |

## Sous le breakpoint (mobile)

Figma `Viewport=mobile` (2363:42525). Pas de prop React : l'adaptation passe par le CSS
(`@media not (--viewport-desktop)`, breakpoint 816px = 51em, voir
`specs/foundations/breakpoint.md`).

- En-tête : pleine largeur, sans padding latéral, le titre prend la largeur restante
- Titre et texte d'introduction : plus petits grâce aux tokens viewport (`heading/xl` 24/32, `heading/lg` 20/28), sans règle dans le media query

**Mise en page alignée sur Figma le 2026-11-27 (/sync-ds, décision de Damien)** : le retrait de 56px
(`--spacing-x14`) du texte d'introduction (gauche et droite) et de la liste sur desktop est
**abandonné**. Le texte d'introduction n'a plus de retrait, la liste a un retrait de 16px
(`--spacing-x4`) à toutes les tailles, et le numéro et le titre sont centrés verticalement
(alignés en bas auparavant). Le padding de 16px de l'en-tête mobile a disparu de Figma.

## Règles d'usage

- Icône des puces dessinée à la main en SVG inline (`currentColor`), cohérent avec la convention déjà établie par `AlertBanner`/`TopNav` — pas d'asset Figma exporté
- `bulletPoints` : tableau de chaînes simples (le Figma source ne montre que du texte brut dans les puces, pas de mise en forme riche)
- `alertBanner` : rendu tel quel si fourni, rien autrement — pas de fond/bordure par défaut ajouté par ce composant (le style vient entièrement de l'`<AlertBanner>` fourni)
- **Couleur du numéro de section** : `--color-text-tertiary` (neutral/500) — passé de neutral/400 (2.5:1) à neutral/500 (4.5:1) le 2026-11-04 pour respecter le contraste AA (décision Damien)
- **Graisse du texte d'introduction et des puces** : `regular` (400) — Figma aligné le 2026-11-02 (l'ancien style « Book » ~333 est désormais lié à `typography/font-weight/regular`)
- **Écart signalé vs Figma** : le gap entre numéro et titre varie légèrement entre les deux sections du frame source (24px vs 26px) — standardisé à 24px (`--spacing-x6`), traité comme une dérive d'auteur Figma plutôt qu'une différence intentionnelle entre sections

- **Sans titre** : la section n'a plus d'intitulé (`h3`) — acceptable pour une citation (cartes « citation » de la page Portfolio), à éviter pour une section de contenu

## Tests

17 tests — 17 passants
