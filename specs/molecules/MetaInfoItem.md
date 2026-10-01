# MetaInfoItem

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/MetaInfoItem/`
**Node Figma :** `837:19518` ("Meta_Info Button" — instance réelle sur la page d'accueil, vérifiée via métadonnées `<instance>`, pas une maquette abstraite)

## API

```ts
interface MetaInfoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon:     React.ReactNode; // requis — ex: SVG dessiné à la main, ou <LogoCompanies />
  children: React.ReactNode; // requis — texte affiché à droite de l'icône
}
```

**Types exportés :** `MetaInfoItemProps`
**data-component :** `ds-br-meta-info-item`

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-neutral-800` | `#262626` | Icône et texte (pas de token `color/text/small` dédié dans Figma, mappé sur la valeur hex la plus proche) |
| `--typography-font-family-sans` | — | Texte |
| `--typography-font-size-xs` | `12px` | Texte |
| `--typography-font-weight-regular` | `400` | Texte |
| `--spacing-x1` | `4px` | Gap icône/texte |
| `--spacing-x4` | `16px` | Taille de l'icône |

## Composition

`icon` est un slot libre — sur la page d'accueil réelle, 2 des 4 usages passent un SVG dessiné à la main (planète, livre) et 2 passent `<LogoCompanies company="tidal"|"steam" size={16} />` (atome déjà existant). Le composant ne connaît pas le contenu de l'icône.

## Règles d'usage

- Utilisé en grille 2×N sur la page d'accueil (section "Meta Info" sous l'intro) — le layout de grille est de la responsabilité de la page, pas du composant lui-même
- **Élément non implémenté, signalé** : le Figma source contient un séparateur vertical (`2px` de large, `#d9d9d9`) entre l'icône+texte et un élément suivant, mais avec `opacity: 0` — invisible et sans effet actuel. Non rendu dans l'implémentation (markup mort sans valeur visuelle), à réexaminer si Damien confirme une intention pour ce séparateur

## Tests

6 tests — 6 passants
