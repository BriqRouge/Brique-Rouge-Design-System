# MacbookMockup

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/MacbookMockup/`
**Node Figma :** `837:19547` ("Macbook Pro") — composant Figma réutilisé plusieurs fois (pages projet Odaptos, BPCE ; déjà recréé à la main pour `ProjectBentoCard.conseilConstitutionnel` avant extraction)

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
