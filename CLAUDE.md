# CLAUDE.md — Contexte du projet pour Claude Code

## Ce projet

Ce repo est un Design System généré à partir du template `design-system-starter`.
Il suit une architecture monorepo avec pnpm + Turborepo.

---

## 1. Contexte du projet

Design System open-source de Damien Ramzi (sur un template de Romain Richard).

- **GitHub** : https://github.com/BriqRouge/Brique-Rouge-Design-System
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
`@brique-rouge-DS/tokens
@brique-rouge-DS/react
@brique-rouge-DS/storybook`

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
@brique-rouge-DS/tokens/css/colors-light
@brique-rouge-DS/tokens/css/colors-dark
@brique-rouge-DS/tokens/css/numbers
@brique-rouge-DS/tokens/css/typography
```
### Imports Storybook preview
```js
@brique-rouge-DS/tokens/css/colors-light
@brique-rouge-DS/tokens/css/numbers
@brique-rouge-DS/tokens/css/typography
```
---

## 6. Règles absolues — à ne jamais enfreindre

### 6.1 Figma est la source de vérité
- Toujours lire Figma avant d'implémenter ou modifier un composant.
- Reproduire exactement ce qui est dans Figma : variants, props, états, tailles, tokens.
- Si quelque chose semble étrange ou incohérent : **le signaler, mais l'implémenter quand même**.
- C'est Romain qui décide si c'est une erreur ou une intention design.
- **Ne jamais corriger, améliorer ou interpréter le design de sa propre initiative.**

### 6.2 Anti-régression
- Identifier le périmètre exact de chaque changement avant de toucher au code.
- Ne modifier que ce périmètre — rien d'autre.
- Ne jamais modifier ce qui fonctionne déjà.
- Valider mentalement chaque ligne modifiée avant de l'écrire.

### 6.3 Accessibilité (WCAG 2.1 AA — non négociable)
- Navigation clavier complète
- Focus visible
- ARIA correct
- Compatibilité lecteurs d'écran
- Contrastes suffisants
- Logique d'états accessible

### 6.4 Sécurité
- Pas de `dangerouslySetInnerHTML`
- Pas de patterns XSS
- Pas de dépendances inutiles

### 6.5 Qualité de code
- TypeScript strict — pas de `any`
- CSS Modules + CSS Variables uniquement
- Pas de Tailwind
- Pas de sur-ingénierie
- Code lisible, maintenable, documenté

---

## 7. Workflow composants

### Ordre impératif pour chaque nouveau composant ou modification

```
1. Lire Figma via MCP (get_design_context)
2. Faire le diff avec le code existant
3. Identifier le périmètre exact des changements
4. Implémenter uniquement ce qui a changé
5. Vérifier les tests existants — ne pas les casser
6. Ajouter ou mettre à jour les tests
7. Mettre à jour la story Storybook
8. Push GitHub
```

### IDs Figma — format
- URLs Figma : format tiret (`18-765`)
- Appels MCP : format deux-points (`18:765`)

---

## 8. Conventions composants React

### API
- `children` pour le contenu textuel (pas de prop `label`)
- Props booléennes sans valeur : `<Button loading />` pas `<Button loading={true} />`
- `forwardRef` systématique
- `displayName` défini

### CSS Modules
- Classes : kebab-case avec préfixe sémantique (`level-primary`, `size-m`, `is-loading`)
- États disabled : sélecteur `:disabled` natif uniquement — **pas** `[aria-disabled='true']`
- L'attribut `aria-disabled` sert à la communication avec les lecteurs d'écran, pas au style

### États loading
- Pas de `disabled` HTML natif en état loading
- `aria-busy="true"` + `aria-disabled="true"` exposés
- Click bloqué via handler (`if (loading) return`)
- `loadingLabel` (défaut : `"Chargement en cours"`) dans un `<span class="srOnly">`

### data-attributes
- `data-level` et `data-size` obligatoires sur le `<button>` natif (utilisés par les tests)

---

## 9. Composants existants

### Button (`packages/react/src/components/Button/`)
- **Commit** : `b7b2f04`
- **Fichiers** : `Button.tsx`, `Button.module.css`, `Button.test.tsx`, `index.ts`
- **Story** : `packages/storybook/src/stories/components/Button.stories.tsx`
- **API** : `children`, `variant` (`contained`|`outlined`), `colorScheme` (`default`|`light`|`dark`), `size` (`nm`|`md`), `leftIcon`, `rightIcon`, `disabled` + props HTML natives
- **Tokens** : `color/background/button/idle`, `color/background/button/hovered`, `color/background/button/hovered-black`, `color/border/button/*`, `color/text/button/*`, `color/icon/button/*`, `border-radius/button`
- **Tests** : 16 tests — 16 passants

---

## 10. Tests

### Couverture minimale par composant
- Rendu de base (children, props par défaut, className, props HTML)
- Icônes (leftIcon, rightIcon, icon-only)
- État disabled (désactivé, click bloqué)
- Interactions (click)
- Accessibilité axe (contained, outlined light, outlined dark, disabled, icon-only)

### Commandes
```bash
# Depuis packages/react
pnpm test --reporter=verbose

# Depuis la racine
pnpm --filter @brique-rouge/react test --reporter=verbose
```

---

## 11. Storybook

### Commande
```bash
pnpm --filter @brique-rouge/storybook dev
```

### Conventions stories
- Titre : `Composants/NomComposant`
- `tags: ['autodocs']`
- Documentation en **français**
- Stories obligatoires : Default, Variants, Tailles, État Disabled, Playground
- `layout: 'centered'` par défaut
- `argTypes` documentés en français

---

## 12. Figma MCP

### Outil principal
`get_design_context` avec `fileKey` + `nodeId` explicites

### Clé de fichier
`NZtxQVYKRqeaGcC7hT5pjw`

### Variables
`get_variable_defs` pour accéder aux tokens Figma

### Collections Figma (pour référence)
- Colors (`color/*`)
- Sizing (`sizing/*`)
- Spacing (`spacing/*`)
- Typography (`typography/*`)
- Border Radius (`border-radius/*`)

---

## 13. Décisions techniques définitives

Ces décisions sont prises et ne se remettent pas en question sauf demande explicite de Damien.

| Décision | Choix |
|---|---|
| Monorepo | pnpm + Turborepo |
| Framework | React + TypeScript strict |
| Style | CSS Modules + CSS Variables |
| Tests | Vitest + Testing Library + jest-axe |
| Documentation | Storybook, en français |
| Tokens | Style Dictionary v4, `usesDtcg: true` |
| Nomenclature tokens | Préfixe x (`x10`, `x12`…) — alignée sur Figma |
| Figma | Source de vérité absolue |
| Code Connect | Prévu — à mettre en place après stabilisation des composants |
| Component tokens | Intentionnellement minimaliste — pas de sur-tokenisation |

---

## 14. Prochaines étapes

1. Prochain composant — **à définir** (node Figma à renseigner)
2. **Code Connect** — mapping Figma ↔ React
3. **GitHub Actions** CI/CD
4. Automatisation progressive du workflow

---

## 15. Ce que Claude Code ne doit pas faire

- Modifier l'architecture sans validation préalable de claude.ai et Damien
- Prendre des décisions de design
- Corriger ce qui semble étrange dans Figma
- Toucher à des fichiers hors du périmètre de la tâche en cours
- Supprimer des tests existants
- Introduire des dépendances non validées
- Utiliser `any` en TypeScript
- Utiliser `dangerouslySetInnerHTML`
- Utiliser Tailwind

---

## 16. Workflow Git

Le branch `main` est protégé. Toute modification passe obligatoirement par une PR.

Workflow à suivre pour chaque tâche :

1. Créer une branche : `feat/component-button` (convention `feat/component-[name]` ou `feat/screens-[name]`)
2. Committer les fichiers sur cette branche
3. Push la branche : `git push origin feat/component-button`
4. Ouvrir une PR sur GitHub vers `main`
5. Attendre que les 2 status checks CI passent (Tests + Lint)
6. Merger la PR dans `main`

Ne jamais push directement sur `main`.
Ne jamais force push.

---

## 17. Génération d'interfaces

Avant toute génération d'interface ou de maquette Figma, consulter `COMPONENTS.md`.

Ce fichier liste :
- les composants React disponibles avec leur API exacte
- les node IDs Figma correspondants
- l'ensemble des tokens CSS à utiliser

Règle absolue : aucune valeur arbitraire (couleur hex, px hardcodé, etc.) si un token existe.

---

## 18. Workflow — Génération d'interfaces et maquettes Figma

Ce workflow permet de générer des interfaces codées conformes au DS,
puis de les exporter comme maquettes Figma.

### Étape 1 — Description (claude.ai)
Décrire l'écran en langage naturel à Claude.
Claude génère le prompt structuré pour Claude Code.

### Étape 2 — Génération du code (Claude Code)
Claude Code lit COMPONENTS.md comme référence unique et produit :
- `packages/storybook/src/stories/screens/NomEcran.tsx`
- `packages/storybook/src/stories/screens/NomEcran.module.css`
- `packages/storybook/src/stories/screens/NomEcran.stories.tsx`

Règles strictes :
- Uniquement les composants de `@brique-rouge/react`
- Uniquement les tokens CSS de `@brique-rouge/tokens` (variables CSS, aucune valeur arbitraire)
- Accessibilité WCAG 2.1 AA obligatoire
- Story sous `Screens/NomEcran`

### Étape 3 — Itération design (localhost:6007)
Valider le rendu dans Storybook.
Itérer via des prompts de correction jusqu'à validation complète.
Ne passer à l'étape suivante qu'une fois le rendu validé.

### Étape 4 — Génération maquette Figma (à mettre en place)
La génération de maquettes Figma nécessite un outil d'écriture MCP local
(ex. figma-use) — à configurer ultérieurement.
Page cible : "Screens" (à créer dans le fichier `NZtxQVYKRqeaGcC7hT5pjw`)

### Identification des composants DS dans le DOM
Tous les composants portent `data-component="ds-br-[nom]"` sur leur nœud racine.
Vérification rapide dans DevTools Console :

```js
document.querySelectorAll('[data-component^="ds-br"]')
  .forEach(el => console.log(el.dataset.component))
```

---
