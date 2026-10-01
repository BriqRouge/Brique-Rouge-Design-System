# ProjectSectionDescription

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/organisms/ProjectSectionDescription/`
**Node Figma :** `744:20765` ("Cards / Project_Sections_Descritpion" — section individuelle, typo Figma corrigée dans le nom du composant)

## API

```ts
interface ProjectSectionDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  number: string;              // requis — ex: "01"
  title: string;               // requis — ex: "Problème"
  children: React.ReactNode;   // requis — texte d'introduction
  bulletPoints?: string[];     // optionnel — liste à puces
  alertBanner?: React.ReactNode; // optionnel — typiquement <AlertBanner />
}
```

**Types exportés :** `ProjectSectionDescriptionProps`
**data-component :** `ds-br-project-section-description`

## Composition

Accepte `alertBanner` en slot optionnel — typiquement rempli avec `<AlertBanner>` (molécule, avec `<Button>` en CTA). Le composant ne connaît pas le contenu du bandeau, cohérent avec le pattern déjà établi par `ProjectBentoCard`/`TopNav`.

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-neutral-400` | `#a1a1a1` | Numéro de section (voir écart Figma ci-dessous) |
| `--color-neutral-900` | `#171717` | Titre de section |
| `--color-neutral-800` | `#262626` | Texte d'introduction |
| `--color-neutral-600` | `#525252` | Texte des puces |
| `--color-deep-sea-600` | `#3453dc` | Icône des puces |
| `--typography-font-family-sans` | — | Numéro de section |
| `--typography-subtitle-font-family`/`-font-weight` | — | Titre de section, texte d'introduction |
| `--typography-body-font-family` | — | Texte des puces |
| `--typography-font-size-base`/`-3xl`/`-2xl` | `16px`/`32px`/`24px` | Numéro, titre, texte d'introduction |
| `--typography-font-weight-medium`/`-regular` | `500`/`400` | Numéro (medium), reste (regular — voir écart Figma) |
| `--spacing-x6`/`-x4`/`-x14` | `24px`/`16px`/`56px` | Gaps et indentation |
| `--sizing-x6` | `24px` | Taille de l'icône des puces |

## Règles d'usage

- Icône des puces dessinée à la main en SVG inline (`currentColor`), cohérent avec la convention déjà établie par `AlertBanner`/`TopNav` — pas d'asset Figma exporté
- `bulletPoints` : tableau de chaînes simples (le Figma source ne montre que du texte brut dans les puces, pas de mise en forme riche)
- `alertBanner` : rendu tel quel si fourni, rien autrement — pas de fond/bordure par défaut ajouté par ce composant (le style vient entièrement de l'`<AlertBanner>` fourni)
- **Écart signalé vs Figma** : la couleur du numéro de section (`#a3a3a3`) ne correspond à aucun token exact — `--color-neutral-400` (`#a1a1a1`) est la valeur existante la plus proche, écart de 2 points par canal, cohérent avec le type de dérive Figma déjà rencontré (cf. `ProjectBentoCard`/`conseil-constitutionnel`)
- **Écart signalé vs Figma** : poids de police "Book" (~333) du texte d'introduction et des puces sans équivalent exact dans `--typography-font-weight-*` — mappé sur `regular` (400), même convention que `ProjectCardDescription`
- **Écart signalé vs Figma** : le gap entre numéro et titre varie légèrement entre les deux sections du frame source (24px vs 26px) — standardisé à 24px (`--spacing-x6`), traité comme une dérive d'auteur Figma plutôt qu'une différence intentionnelle entre sections

## Tests

11 tests — 11 passants
