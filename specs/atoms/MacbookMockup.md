---
component: MacbookMockup
tier: atom
figma:
  node: "537:19720"
  name: Macbook Pro
  type: component-set
---
# MacbookMockup

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/MacbookMockup/`
**Figma :** composant réutilisé sur les pages projet Odaptos et BPCE (ex. instance `837:19547`) ; déjà recréé à la main pour `ProjectBentoCard.conseilConstitutionnel` avant extraction
**Écart Figma ↔ code (assumé, décidé le 2026-11-02) :** Figma propose 6 variantes `Style=fill|outline|shaded` × `Model=13in-m1-pro|14-16in-m1-pro` ; le code ne reproduit que `Style=shaded, Model=14-16in-m1-pro` (celle des pages projet) et n'expose aucune prop. Ajouter `style` / `model` seulement quand un écran en aura besoin

## API

```ts
interface MacbookMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode; // requis — contenu affiché dans l'écran, typiquement une capture d'écran
}
```

**Types exportés :** `MacbookMockupProps`
**data-component :** `ds-br-macbook-mockup`

## Règles d'usage

- **Sans taille propre** : le consommateur définit `width`/`height` (ex: via `style` ou une classe) — l'aspect ratio d'origine est ~1.644:1 (842×512px dans le Figma source)
- `children` est rogné (`overflow: hidden`) à la zone d'écran — passer typiquement une `<img>` en `object-fit: cover` ou un fond plein
- Assets réels téléchargés depuis Figma (`assets/*.svg`) : shadow, rubber (gauche/droite, même asset réutilisé), feet (gauche/droite, même asset réutilisé), body, bottom, body-shades, screen-frame, bevel (×2, blend-modes `hard-light`/`multiply`)
- **Contenu illustratif bespoke** : la couleur `#1b1b1b` du "display bottom" (base de l'écran) est hardcodée — pas un token DS, même valeur que celle déjà utilisée dans `ProjectBentoCard.conseilConstitutionnel.module.css`. Fichier CSS marqué `/* token-audit-ignore */`
- **Opportunité identifiée lors d'un audit des pages réelles du portfolio** (pas de la doc Figma "Design system") : ce mockup était déjà recréé à la main pour la carte Conseil constitutionnel de `ProjectBentoCard` avant son extraction en atome générique — les pages projet Odaptos/BPCE l'utilisent aussi pour présenter leurs captures d'écran

## Tests

5 tests — 5 passants
