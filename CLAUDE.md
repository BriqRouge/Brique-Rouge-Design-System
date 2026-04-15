# CLAUDE.md â€” Contexte du projet pour Claude Code

## Ce projet

Ce repo est un Design System gÃ©nÃ©rÃ© Ã  partir du template `design-system-starter`.
Il suit une architecture monorepo avec pnpm + Turborepo.

---

## 1. Contexte du projet

Design System open-source de Damien Ramzi (sur un template de Romain Richard).

- **GitHub** : https://github.com/BriqRouge/Brique-Rouge-Design-System
- **Figma** : fichier `NZtxQVYKRqeaGcC7hT5pjw` ("Portfolio Damien Ramzi")
- **Licence** : MIT

Damien est **Senior Product Designer** (7 ans de design, dont 1 ans sur la constructiion d'un DS).

---

## 2. RÃ´les

| Qui | RÃ´le |
|---|---|
| Damien | Senior Product Designer â€” user research, ux stratÃ©gie, conception Figma, dÃ©cisions design, validation |
| Claude (claude.ai) | Tech Lead / Architecte â€” rÃ©flexion, architecture, composants complexes |
| Claude Code | ExÃ©cution â€” remplacement de fichiers, tÃ¢ches rÃ©pÃ©titives, automatisation |

**Claude Code ne prend pas de dÃ©cisions d'architecture.** Il exÃ©cute ce qui a Ã©tÃ© dÃ©cidÃ© avec claude.ai.

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
â”œâ”€â”€ packages/
â”‚   â”œâ”€â”€ tokens/          # Design tokens â†’ CSS Variables + JSON
â”‚   â”œâ”€â”€ react/           # Composants React
â”‚   â””â”€â”€ storybook/       # Documentation et vitrine
â”œâ”€â”€ CLAUDE.md
â”œâ”€â”€ turbo.json
â”œâ”€â”€ pnpm-workspace.yaml
â””â”€â”€ tsconfig.json
```

**Namespaces** :
`@brique-rouge-DS/tokens
@brique-rouge-DS/react
@brique-rouge-DS/storybook`

---

## 5. Tokens

### Source de vÃ©ritÃ©
Figma Variables â€” fichier `NZtxQVYKRqeaGcC7hT5pjw`

### Collections Figma
- Primitives
- Semantic Numbers
- Semantic Colors (light / dark)
- Typography

### Build (Style Dictionary v4)
- `usesDtcg: true`
- Transformers custom : `color/figma-hex`, `number/px-or-opacity`
- Format Figma JSON propriÃ©taire : `$value` est un objet `{hex, alpha, components}` â€” toujours lire via `token.original.$value`
- Sorties : `colors-light.css`, `colors-dark.css`, `numbers.css`, `typography.css`, `tokens.json`

### Nomenclature
Ã‰chelle numÃ©rique (`spacing.01`, `spacing.02`â€¦) â€” pas de t-shirt sizing.

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

## 6. RÃ¨gles absolues â€” Ã  ne jamais enfreindre

### 6.1 Figma est la source de vÃ©ritÃ©
- Toujours lire Figma avant d'implÃ©menter ou modifier un composant.
- Reproduire exactement ce qui est dans Figma : variants, props, Ã©tats, tailles, tokens.
- Si quelque chose semble Ã©trange ou incohÃ©rent : **le signaler, mais l'implÃ©menter quand mÃªme**.
- C'est Romain qui dÃ©cide si c'est une erreur ou une intention design.
- **Ne jamais corriger, amÃ©liorer ou interprÃ©ter le design de sa propre initiative.**

### 6.2 Anti-rÃ©gression
- Identifier le pÃ©rimÃ¨tre exact de chaque changement avant de toucher au code.
- Ne modifier que ce pÃ©rimÃ¨tre â€” rien d'autre.
- Ne jamais modifier ce qui fonctionne dÃ©jÃ .
- Valider mentalement chaque ligne modifiÃ©e avant de l'Ã©crire.

### 6.3 AccessibilitÃ© (WCAG 2.1 AA â€” non nÃ©gociable)
- Navigation clavier complÃ¨te
- Focus visible
- ARIA correct
- CompatibilitÃ© lecteurs d'Ã©cran
- Contrastes suffisants
- Logique d'Ã©tats accessible

### 6.4 SÃ©curitÃ©
- Pas de `dangerouslySetInnerHTML`
- Pas de patterns XSS
- Pas de dÃ©pendances inutiles

### 6.5 QualitÃ© de code
- TypeScript strict â€” pas de `any`
- CSS Modules + CSS Variables uniquement
- Pas de Tailwind
- Pas de sur-ingÃ©nierie
- Code lisible, maintenable, documentÃ©

---

## 7. Workflow composants

### Ordre impÃ©ratif pour chaque nouveau composant ou modification

```
1. Lire Figma via MCP (get_design_context)
2. Faire le diff avec le code existant
3. Identifier le pÃ©rimÃ¨tre exact des changements
4. ImplÃ©menter uniquement ce qui a changÃ©
5. VÃ©rifier les tests existants â€” ne pas les casser
6. Ajouter ou mettre Ã  jour les tests
7. Mettre Ã  jour la story Storybook
8. Push GitHub
```

### IDs Figma â€” format
- URLs Figma : format tiret (`18-765`)
- Appels MCP : format deux-points (`18:765`)

---

## 8. Conventions composants React

### API
- `children` pour le contenu textuel (pas de prop `label`)
- Props boolÃ©ennes sans valeur : `<Button loading />` pas `<Button loading={true} />`
- `forwardRef` systÃ©matique
- `displayName` dÃ©fini

### CSS Modules
- Classes : kebab-case avec prÃ©fixe sÃ©mantique (`level-primary`, `size-m`, `is-loading`)
- Ã‰tats disabled : sÃ©lecteur `:disabled` natif uniquement â€” **pas** `[aria-disabled='true']`
- L'attribut `aria-disabled` sert Ã  la communication avec les lecteurs d'Ã©cran, pas au style

### Ã‰tats loading
- Pas de `disabled` HTML natif en Ã©tat loading
- `aria-busy="true"` + `aria-disabled="true"` exposÃ©s
- Click bloquÃ© via handler (`if (loading) return`)
- `loadingLabel` (dÃ©faut : `"Chargement en cours"`) dans un `<span class="srOnly">`

### data-attributes
- `data-level` et `data-size` obligatoires sur le `<button>` natif (utilisÃ©s par les tests)

---

## 9. Composants existants

### Button (`packages/react/src/components/Button/`)
- **Commit** : `514e779`
- **Fichiers** : `Button.tsx`, `Button.module.css`, `Button.test.tsx`, `index.ts`
- **Story** : `packages/storybook/src/stories/components/Button.stories.tsx`
- **API** : `children`, `variant` (`contained`|`outlined`), `colorScheme` (`default`|`light`|`dark`), `size` (`nm`|`md`), `leftIcon`, `rightIcon`, `disabled` + props HTML natives
- **Tokens** : `color/background/button/idle`, `color/background/button/hovered`, `color/background/button/hovered-black`, `color/border/button/*`, `color/text/button/*`, `color/icon/button/*`, `border-radius/button`
- **Tests** : 18 tests — 18 passants

---

## 10. Tests

### Couverture minimale par composant
- Rendu de base (children, props par dÃ©faut, className, props HTML)
- IcÃ´nes (leftIcon, rightIcon, icon-only)
- Ã‰tat disabled (dÃ©sactivÃ©, click bloquÃ©)
- Interactions (click)
- AccessibilitÃ© axe (contained, outlined light, outlined dark, disabled, icon-only)

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
- Documentation en **franÃ§ais**
- Stories obligatoires : Default, Variants, Tailles, Ã‰tat Disabled, Playground
- `layout: 'centered'` par dÃ©faut
- `argTypes` documentÃ©s en franÃ§ais

---

## 12. Figma MCP

### Outil principal
`get_design_context` avec `fileKey` + `nodeId` explicites

### ClÃ© de fichier
`NZtxQVYKRqeaGcC7hT5pjw`

### Variables
`get_variable_defs` pour accÃ©der aux tokens Figma

### Collections Figma (pour rÃ©fÃ©rence)
- Colors (`color/*`)
- Sizing (`sizing/*`)
- Spacing (`spacing/*`)
- Typography (`typography/*`)
- Border Radius (`border-radius/*`)

---

## 13. DÃ©cisions techniques dÃ©finitives

Ces dÃ©cisions sont prises et ne se remettent pas en question sauf demande explicite de Damien.

| DÃ©cision | Choix |
|---|---|
| Monorepo | pnpm + Turborepo |
| Framework | React + TypeScript strict |
| Style | CSS Modules + CSS Variables |
| Tests | Vitest + Testing Library + jest-axe |
| Documentation | Storybook, en franÃ§ais |
| Tokens | Style Dictionary v4, `usesDtcg: true` |
| Nomenclature tokens | PrÃ©fixe x (`x10`, `x12`â€¦) â€” alignÃ©e sur Figma |
| Figma | Source de vÃ©ritÃ© absolue |
| Code Connect | PrÃ©vu â€” Ã  mettre en place aprÃ¨s stabilisation des composants |
| Component tokens | Intentionnellement minimaliste â€” pas de sur-tokenisation |

---

## 14. Prochaines Ã©tapes

1. Prochain composant â€” **Ã  dÃ©finir** (node Figma Ã  renseigner)
2. **Code Connect** â€” mapping Figma â†” React
3. **GitHub Actions** CI/CD
4. Automatisation progressive du workflow

---

## 15. Ce que Claude Code ne doit pas faire

- Modifier l'architecture sans validation prÃ©alable de claude.ai et Damien
- Prendre des dÃ©cisions de design
- Corriger ce qui semble Ã©trange dans Figma
- Toucher Ã  des fichiers hors du pÃ©rimÃ¨tre de la tÃ¢che en cours
- Supprimer des tests existants
- Introduire des dÃ©pendances non validÃ©es
- Utiliser `any` en TypeScript
- Utiliser `dangerouslySetInnerHTML`
- Utiliser Tailwind

---

## 16. Workflow Git

Le branch `main` est protÃ©gÃ©. Toute modification passe obligatoirement par une PR.

Workflow Ã  suivre pour chaque tÃ¢che :

1. CrÃ©er une branche : `feat/component-button` (convention `feat/component-[name]` ou `feat/screens-[name]`)
2. Committer les fichiers sur cette branche
3. Push la branche : `git push origin feat/component-button`
4. Ouvrir une PR sur GitHub vers `main`
5. Attendre que les 2 status checks CI passent (Tests + Lint)
6. Merger la PR dans `main`

Ne jamais push directement sur `main`.
Ne jamais force push.

---

## 17. GÃ©nÃ©ration d'interfaces

Avant toute gÃ©nÃ©ration d'interface ou de maquette Figma, consulter `COMPONENTS.md`.

Ce fichier liste :
- les composants React disponibles avec leur API exacte
- les node IDs Figma correspondants
- l'ensemble des tokens CSS Ã  utiliser

RÃ¨gle absolue : aucune valeur arbitraire (couleur hex, px hardcodÃ©, etc.) si un token existe.

---

## 18. Workflow â€” GÃ©nÃ©ration d'interfaces et maquettes Figma

Ce workflow permet de gÃ©nÃ©rer des interfaces codÃ©es conformes au DS,
puis de les exporter comme maquettes Figma.

### Ã‰tape 1 â€” Description (claude.ai)
DÃ©crire l'Ã©cran en langage naturel Ã  Claude.
Claude gÃ©nÃ¨re le prompt structurÃ© pour Claude Code.

### Ã‰tape 2 â€” GÃ©nÃ©ration du code (Claude Code)
Claude Code lit COMPONENTS.md comme rÃ©fÃ©rence unique et produit :
- `packages/storybook/src/stories/screens/NomEcran.tsx`
- `packages/storybook/src/stories/screens/NomEcran.module.css`
- `packages/storybook/src/stories/screens/NomEcran.stories.tsx`

RÃ¨gles strictes :
- Uniquement les composants de `@brique-rouge/react`
- Uniquement les tokens CSS de `@brique-rouge/tokens` (variables CSS, aucune valeur arbitraire)
- AccessibilitÃ© WCAG 2.1 AA obligatoire
- Story sous `Screens/NomEcran`

### Ã‰tape 3 â€” ItÃ©ration design (localhost:6007)
Valider le rendu dans Storybook.
ItÃ©rer via des prompts de correction jusqu'Ã  validation complÃ¨te.
Ne passer Ã  l'Ã©tape suivante qu'une fois le rendu validÃ©.

### Ã‰tape 4 â€” GÃ©nÃ©ration maquette Figma (Ã  mettre en place)
La gÃ©nÃ©ration de maquettes Figma nÃ©cessite un outil d'Ã©criture MCP local
(ex. figma-use) â€” Ã  configurer ultÃ©rieurement.
Page cible : "Screens" (Ã  crÃ©er dans le fichier `NZtxQVYKRqeaGcC7hT5pjw`)

### Identification des composants DS dans le DOM
Tous les composants portent `data-component="ds-br-[nom]"` sur leur nÅ“ud racine.
VÃ©rification rapide dans DevTools Console :

```js
document.querySelectorAll('[data-component^="ds-br"]')
  .forEach(el => console.log(el.dataset.component))
```

---