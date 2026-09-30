# FrameLogo

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/FrameLogo/`
**Commit :** `49a78d7`
**Fichiers :** `FrameLogo.tsx`, `FrameLogo.module.css`, `FrameLogo.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/FrameLogo.stories.tsx`

## API

```ts
interface FrameLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  src:   string;  // requis — URL de l'image
  alt?:  string;  // défaut: '' (décoratif)
}
```

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--sizing-x6` | `24px` | Largeur et hauteur du conteneur |
| `--border-radius-sm` | `4px` | Arrondi du conteneur |
| `--color-neutral-100` | `#f5f5f5` | Fond fallback si image absente |
| `--elevation-1-key-shadow-*` | — | Ombre portée (key layer) |
| `--elevation-1-ambient-shadow-*` | — | Ombre portée (ambient layer) |

## Règles d'usage

- Conteneur fixe 24×24px, `overflow: hidden`, `flex-shrink: 0`
- Image en `object-fit: cover` — toujours passer une URL valide
- Si le logo est purement décoratif, laisser `alt=""` (défaut)
- Si le logo est informatif, renseigner un `alt` descriptif

## Tests

8 tests — 8 passants
