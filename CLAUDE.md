# CLAUDE.md — Contexte du projet pour Claude Code

## Ce projet

Ce repo est un Design System généré à partir du template `design-system-starter`.
Il suit une architecture monorepo avec pnpm + Turborepo.

## Stack technique

- pnpm + Turborepo
- React + TypeScript strict
- CSS Modules + CSS Variables
- Style Dictionary v4
- Storybook v8
- Vitest + Testing Library + jest-axe

## Packages

- `@starter/tokens` — tokens CSS générés depuis Figma via Style Dictionary
- `@starter/react` — composants React du Design System
- `@starter/storybook` — documentation Storybook

## Règles absolues à toujours respecter

1. Toujours travailler sur une branche dédiée (jamais directement sur main)
   Convention : `feat/composant-[nom]` · `fix/[sujet]` · `chore/[sujet]`

2. Toujours lire COMPONENTS.md avant d'implémenter un composant

3. Tokens CSS — convention de nommage stricte :
   Les tokens suivent la structure sémantique définie dans COMPONENTS.md.
   - Utilise uniquement les tokens définis dans `packages/tokens/build/css/`
   - Ne jamais inventer une valeur arbitraire si un token existe
   - Ne jamais préfixer les tokens avec `--color-*`
   - La structure est : `--[catégorie]-[variante]-[état]`
     ex: `--background-neutral-default`, `--text-brand-primary`

4. Accessibilité WCAG 2.1 AA non négociable :
   - Navigation clavier complète
   - Focus visible
   - ARIA correct
   - Contrastes vérifiés

5. Chaque composant doit avoir :
   - Son implémentation React + CSS Module
   - Ses tests (unitaires + accessibilité avec jest-axe)
   - Ses stories Storybook (Docs, Playground, Variants, États)

6. Jamais de `any` TypeScript
   Jamais de `dangerouslySetInnerHTML`
   Jamais de style arbitraire si un token existe

## Structure d'un composant

```
packages/react/src/components/[NomComposant]/
├── [NomComposant].tsx
├── [NomComposant].module.css
├── [NomComposant].test.tsx
├── index.ts
└── [NomComposant].figma.tsx  (après validation du composant)
```

## Workflow Git

Toujours commencer par :
> "Travaille sur la branche `feat/composant-[nom]`
> (à créer depuis main si elle n'existe pas)."
