# Breakpoint

> Généré automatiquement par `packages/tokens/generate-specs.mjs` depuis
> `packages/tokens/tokens.json`. Ne pas modifier à la main — modifier la
> source (Figma Variables) puis relancer `pnpm --filter @brique-rouge/tokens build`.

| Token Figma | Valeur | Media query |
|---|---|---|
| `primitive/breakpoint/desktop` | `816px` → `51em` | `@custom-media --viewport-desktop (width >= 51em)` |

Le breakpoint n'est **jamais** une variable CSS (`var()` est inutilisable dans une media query).
Il produit :

- le bloc `@media (width < 51em)` des tokens « Selon le viewport », à la fin de `semantic.css` ;
- `@brique-rouge/tokens/css/custom-media` : `--viewport-desktop`, pour les changements de mise en page dans les CSS Modules.

```css
@import '@brique-rouge/tokens/css/custom-media';

@media not (--viewport-desktop) {
  /* mise en page sous le breakpoint */
}
```

Résolu au build par `postcss-custom-media` (configuré dans chaque consommateur).
