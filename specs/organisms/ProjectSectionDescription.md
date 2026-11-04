---
component: ProjectSectionDescription
tier: organism
figma:
  node: "2248:28967"
  name: "Cards / Project_Section_Description"
  type: component
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
| `--color-text-muted` | `#a1a1a1` | Numéro de section |
| `--color-text-primary` | `#171717` | Titre de section |
| `--color-text-strong` | `#262626` | Texte d'introduction |
| `--color-text-body` | `#525252` | Texte des puces |
| `--color-deep-sea-600` | `#3453dc` | Icône des puces |
| `--typography-font-family-sans` | — | Numéro de section |
| `--typography-subtitle-font-family`/`-font-weight` | — | Titre de section, texte d'introduction |
| `--typography-body-font-family` | — | Texte des puces |
| `--typography-font-size-base`/`-3xl`/`-2xl` | `16px`/`32px`/`24px` | Numéro, titre, texte d'introduction |
| `--typography-font-weight-medium`/`-regular` | `500`/`400` | Numéro (medium), reste (regular) |
| `--spacing-x6`/`-x4`/`-x14` | `24px`/`16px`/`56px` | Gaps et indentation |
| `--sizing-x6` | `24px` | Taille de l'icône des puces |

## Règles d'usage

- Icône des puces dessinée à la main en SVG inline (`currentColor`), cohérent avec la convention déjà établie par `AlertBanner`/`TopNav` — pas d'asset Figma exporté
- `bulletPoints` : tableau de chaînes simples (le Figma source ne montre que du texte brut dans les puces, pas de mise en forme riche)
- `alertBanner` : rendu tel quel si fourni, rien autrement — pas de fond/bordure par défaut ajouté par ce composant (le style vient entièrement de l'`<AlertBanner>` fourni)
- **Couleur du numéro de section** : `--color-neutral-400` — Figma aligné le 2026-11-02 (l'ancien `#a3a3a3` non lié, sans token exact, a été remplacé par la variable `color/neutral/400`)
- **Graisse du texte d'introduction et des puces** : `regular` (400) — Figma aligné le 2026-11-02 (l'ancien style « Book » ~333 est désormais lié à `typography/font-weight/regular`)
- **Écart signalé vs Figma** : le gap entre numéro et titre varie légèrement entre les deux sections du frame source (24px vs 26px) — standardisé à 24px (`--spacing-x6`), traité comme une dérive d'auteur Figma plutôt qu'une différence intentionnelle entre sections

- **Sans titre** : la section n'a plus d'intitulé (`h3`) — acceptable pour une citation (cartes « citation » de la page Portfolio), à éviter pour une section de contenu

## Tests

17 tests — 17 passants
