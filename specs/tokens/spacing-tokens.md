# Spacing — Variables CSS

> Généré automatiquement par `packages/tokens/generate-specs.mjs` depuis
> `packages/tokens/tokens.json`. Ne pas modifier à la main — modifier la
> source (Figma Variables) puis relancer `pnpm --filter @brique-rouge/tokens build`.

## Primitives

```css
--spacing-x1: 4px;
--spacing-x2: 8px;
--spacing-x3: 12px;
--spacing-x4: 16px;
--spacing-x5: 20px;
--spacing-x6: 24px;
--spacing-x8: 32px;
--spacing-x10: 40px;
--spacing-x12: 48px;
--spacing-x14: 56px;
--spacing-x16: 64px;
--spacing-x18: 72px;
--spacing-x20: 80px;
--spacing-x3-5: 14px;
--spacing-x32: 128px;
--spacing-x22: 88px;
--spacing-x24: 96px;
```

## Sémantiques

```css
--spacing-component-xs: 4px;
--spacing-component-sm: 8px;
--spacing-component-md: 16px;
--spacing-component-lg: 24px;
--spacing-component-xl: 32px;
--spacing-layout-sm: 32px;
--spacing-layout-md: 48px;
--spacing-layout-lg: 64px;
--spacing-layout-xl: 80px;
--spacing-layout-2xl: 128px;
```

## Selon le viewport

Émises à la fin de `semantic.css` : la valeur change seule sous le breakpoint, sans media query côté composant.

```css
:root {
  --spacing-layout-section-inline: 128px;
  --spacing-layout-nav-inline: 48px;
}

@media (width < 51em) {
  :root {
    --spacing-layout-section-inline: 24px;
    --spacing-layout-nav-inline: 16px;
  }
}
```
