# CLAUDE.md — Contexte du projet pour Claude Code

## Ce projet

Ce repo est un Design System généré à partir du template `design-system-starter`.
Il suit une architecture monorepo avec pnpm + Turborepo.

---

## 1. Contexte du projet

Design System open-source de Damien Ramzi (sur un template de Romain Richard).

- **GitHub** : https://github.com/BriqRouge/my-personal-design-system
- **Figma** : fichier `NZtxQVYKRqeaGcC7hT5pjw` ("Portfolio Damien Ramzi")
- **Licence** : MIT

Damien est **Senior Product Designer** (7 ans de design, dont 1 ans sur la constructiion d'un DS).

---

## 2. Rôles

| Qui | Rôle |
|---|---|
| Damien | Senior Product Designer — user research, ux stratégie, conception Figma, décisions design, validation |
| Claude (claude.ai) | Tech Lead / Architecte — réflexion, architecture, composants complexes |
| Claude Code | Exécution — remplacement de fichiers, tâches répétitives, automatisation |

**Claude Code ne prend pas de décisions d'architecture.** Il exécute ce qui a été décidé avec claude.ai.

---

## 3. Stack technique

```
pnpm + Turborepo (monorepo)
TypeScript strict (pas de any)
React
CSS Modules + CSS Variables
Storybook 8
Vitest + Testing Library + jest-axe
```

---

## 4. Structure du monorepo

```
design-system/
├── packages/
│   ├── tokens/          # Design tokens → CSS Variables + JSON
│   ├── react/           # Composants React
│   └── storybook/       # Documentation et vitrine
├── CLAUDE.md
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

**Namespaces** :
`@brique-rouge/tokens
@brique-rouge/react
@brique-rouge/storybook`

---

## 5. Tokens

### Source de vérité
Figma Variables — fichier `NZtxQVYKRqeaGcC7hT5pjw`

### Collections Figma
- Primitives
- Semantic Numbers
- Semantic Colors (light / dark)
- Typography

### Build (Style Dictionary v4)
- `usesDtcg: true`
- Transformers custom : `color/figma-hex`, `number/px-or-opacity`
- Format Figma JSON propriétaire : `$value` est un objet `{hex, alpha, components}` — toujours lire via `token.original.$value`
- Sorties : `colors-light.css`, `colors-dark.css`, `numbers.css`, `typography.css`, `tokens.json`

### Nomenclature
Échelle numérique (`spacing.01`, `spacing.02`…) — pas de t-shirt sizing.

### Exports package tokens
```
@brique-rouge/tokens/css/colors-light
@brique-rouge/tokens/css/colors-dark
@brique-rouge/tokens/css/numbers
@brique-rouge/tokens/css/typography
```

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
