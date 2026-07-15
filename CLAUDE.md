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

Damien est **Senior Product Designer** (7 ans de design, dont 1 an sur la construction d'un DS).

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
```
@brique-rouge/tokens
@brique-rouge/react
@brique-rouge/storybook
```

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
- Sorties : `primitive.css` (tokens bruts — couleurs, spacing, sizing, border-radius, elevation, typography), `semantic.css` (tokens sémantiques composants — boutons, dropdown, etc.), `index.css` (importe les deux), `tokens.json`

### Nomenclature
Échelle numérique (`spacing.01`, `spacing.02`…) — pas de t-shirt sizing.

### Exports package tokens
```
@brique-rouge/tokens/css/index      ← principal (charge primitive + semantic)
@brique-rouge/tokens/css/primitive  ← tokens bruts uniquement
@brique-rouge/tokens/css/semantic   ← tokens sémantiques uniquement
@brique-rouge/tokens/json           ← JSON complet
```

### Imports Storybook preview
```js
@brique-rouge/tokens/css/index
```

---

## 6. Règles absolues — à ne jamais enfreindre

### 6.1 Figma est la source de vérité
- Toujours lire Figma avant d'implémenter ou modifier un composant.
- Reproduire exactement ce qui est dans Figma : variants, props, états, tailles, tokens.
- Si quelque chose semble étrange ou incohérent : **le signaler, mais l'implémenter quand même**.
- C'est Damien qui décide si c'est une erreur ou une intention design.
- **Ne jamais corriger, améliorer ou interpréter le design de sa propre initiative.**
- **En cas de doute entre ce que montre Figma et ce que suggère une bonne pratique technique : signaler le doute — ne jamais trancher seul.**

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

### 6.6 Tokens dans Figma — zéro valeur arbitraire (non négociable)
S'applique à **tout travail direct dans Figma via `use_figma`** (création de frames, screens, maquettes).

- **Avant toute création de node**, inspecter les Figma Variables avec `getLocalVariableCollectionsAsync`
- **Binder systématiquement** les variables aux propriétés : fills via `setBoundVariableForPaint`, spacing/sizing via `setBoundVariable`
- **Jamais de valeur RGB hardcodée** si un token de couleur existe
- **Jamais de valeur px hardcodée** si un token de spacing, sizing ou border-radius existe
- La règle §17 ("aucune valeur arbitraire si un token existe") s'applique au code **et** à Figma

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
- Props booléennes sans valeur : `<Button disabled />` pas `<Button disabled={true} />`
- `forwardRef` systématique
- `displayName` défini

### CSS Modules
- Classes : kebab-case avec préfixe sémantique (`variant-contained`, `size-nm`, `is-activated`)
- États disabled : sélecteur `:disabled` natif uniquement — **pas** `[aria-disabled='true']`
- L'attribut `aria-disabled` sert à la communication avec les lecteurs d'écran, pas au style

### data-attributes
- `data-variant` et `data-size` obligatoires sur le `<button>` natif (utilisés par les tests)

---

## 9. Composants existants

### MenuButton (`packages/react/src/components/MenuButton/`)
- **Commit** : `7745697`
- **Fichiers** : `MenuButton.tsx`, `MenuButton.module.css`, `MenuButton.test.tsx`, `MenuButton.figma.tsx`, `index.ts`
- **Story** : `packages/storybook/src/stories/components/MenuButton.stories.tsx`
- **API** : `children` (requis), `variant` (`contained`|`outlined`), `colorScheme` (`default`|`light`|`dark`), `size` (`nm`|`md`), `leftIcon`, `rightIcon`, `disabled` + props HTML natives
- **Types exportés** : `MenuButtonProps`, `MenuButtonVariant`, `MenuButtonColorScheme`, `MenuButtonSize`
- **data-component** : `ds-br-menu-button`
- **Tokens** : `color/background/button/idle|hovered|hovered-black|disabled`, `color/border/button/contained|outlined-white|outlined-black|focus|disabled`, `color/text/button/contained|outline-white|outline-black|disabled`, `color/icon/button/contained|outline-white|outline-black|disabled`, `border-radius/button`, `typography/button/nm` (`font-family` + `font-size` 14px), `typography/button/md` (`font-family` + `font-size` 16px)
- **Padding** : nm → 8px vertical / 12px horizontal (`--sizing-x3`), md → 8px vertical / 14px horizontal (`--spacing-x3-5`)
- **Tests** : 18 tests — 18 passants

### FrameLogo (`packages/react/src/components/FrameLogo/`)
- **Commit** : `49a78d7`
- **Fichiers** : `FrameLogo.tsx`, `FrameLogo.module.css`, `FrameLogo.test.tsx`, `index.ts`
- **Story** : `packages/storybook/src/stories/components/FrameLogo.stories.tsx`
- **API** : `src` (requis), `alt` (défaut `''`) + props HTML natives (`HTMLDivElement`)
- **Tokens** : `--sizing-x6` (24×24px), `--border-radius-sm` (4px), `--color-neutral-100` (fond fallback), `--elevation-1-*` (key + ambient shadow)
- **Tests** : 8 tests — 8 passants

### DropdownMenu (`packages/react/src/components/DropdownMenu/`)
- **Commit** : `36b8093`
- **Fichiers** : `DropdownMenu.tsx`, `DropdownMenu.module.css`, `DropdownMenu.test.tsx`, `index.ts`
- **Story** : `packages/storybook/src/stories/components/DropdownMenu.stories.tsx`
- **API** : `children` (requis), `className` + props HTML natives (`HTMLDivElement`), `role="menu"` natif
- **Tokens** : `--color-neutral-100` (fond), `--color-neutral-300` (bordure 0.5px solid), `--border-radius-lg` (border-radius)
- **Layout** : flex column, gap 8px, padding 8px, align-items **stretch** (les enfants remplissent la largeur du menu)
- **Tests** : 7 tests — 7 passants

### LogoCompanies (`packages/react/src/components/LogoCompanies/`)
- **Fichiers** : `LogoCompanies.tsx`, `LogoCompanies.module.css`, `LogoCompanies.test.tsx`, `index.ts`
- **Story** : `packages/storybook/src/stories/components/LogoCompanies.stories.tsx`
- **API** : `company` (`bpce`|`conseil-constitutionnel`|`odaptos`|`ibp`|`vinci`|`tidal`|`squared-icon`|`steam`, défaut `squared-icon`), `size` (`32`|`16`|`12`|`8`, défaut `32`) + props HTML natives (`HTMLDivElement`)
- **Accessibilité** : `role="img"` + `aria-label` auto-généré depuis le nom de la compagnie, logo `<img>` avec `aria-hidden="true"`
- **data-attributes** : `data-company`, `data-size`
- **Tests** : 20 tests — 20 passants

### DropdownMenuButton (`packages/react/src/components/DropdownMenuButton/`)
- **Commit** : `63a6751`
- **Fichiers** : `DropdownMenuButton.tsx`, `DropdownMenuButton.module.css`, `DropdownMenuButton.test.tsx`, `index.ts`
- **Story** : `packages/storybook/src/stories/components/DropdownMenuButton.stories.tsx`
- **API** : `children` (requis), `company` (type `LogoCompany` — toutes les valeurs acceptées, accent couleur seulement pour `odaptos`|`bpce`|`ibp`), `src` (URL logo custom, ignoré si `company` fourni), `alt` (défaut `''`), `rightIcon` (booléen, icône lien externe), `activated` (booléen, item sélectionné), `disabled` + props HTML natives (`HTMLButtonElement`)
- **Tokens** : `--spacing-component-sm` (gap + padding), `--sizing-x10` (hauteur), `--border-radius-dropdown-menu-button`, couleurs accent par compagnie (`--color-deep-sea-*`, `--color-maroon-flush-*`, `--color-purple-mountain-*`), `typography/dropdown-menu-button` (`font-family` + `font-size` 16px)
- **Layout** : flex row, `width: 100%` (responsive — remplit le DropdownMenu), hauteur fixe via `--sizing-x10`
- **data-attributes** : `data-activated`, `data-company`
- **Tests** : 20 tests — 20 passants

### DropdownMenuTrigger (`packages/react/src/components/DropdownMenuTrigger/`)
- **Commit** : `1d457c9`
- **Fichiers** : `DropdownMenuTrigger.tsx`, `DropdownMenuTrigger.module.css`, `DropdownMenuTrigger.test.tsx`, `index.ts`
- **Story** : `packages/storybook/src/stories/components/DropdownMenuTrigger.stories.tsx`
- **API** : `children` (requis), `triggerLabel` (requis), `triggerLeftIcon`, `triggerRightIcon`, `triggerVariant` (`contained`|`outlined`, défaut `contained`), `triggerColorScheme` (`default`|`light`|`dark`, défaut `default`), `triggerSize` (`nm`|`md`, défaut `nm`), `open` (mode contrôlé), `onOpenChange` + props HTML natives (`HTMLDivElement`)
- **État** : géré en interne (uncontrolled) ou via `open`/`onOpenChange` (controlled).
- **Interactions** :
  - `mouseenter` container → ouvre immédiatement
  - `mouseleave` container → ferme après **150ms** (timer annulable si re-enter avant expiration)
  - `onFocus` trigger → ouvre (accessibilité clavier, WCAG 1.4.13)
  - `onBlur` container → ferme après 150ms si le focus quitte la zone
  - Clic trigger → ouvre uniquement (**pas de toggle** — évite la fermeture accidentelle en hover)
  - Escape / clic extérieur → fermeture immédiate, timer annulé
- **Dead zone** : inexistante — le `gap: 4px` entre trigger et menu est à l'intérieur du container ; `mouseenter`/`mouseleave` sont écoutés sur le container, pas sur les enfants
- **Animation** : rendu permanent du menu piloté par `aria-hidden` (pas de montage/démontage React). Entrée 200ms `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out), sortie 120ms `cubic-bezier(0.4, 0, 1, 1)` (ease-in). `opacity` + `translateY(-6px→0)`. `visibility` délayée pour exclure le menu fermé du tab order et des lecteurs d'écran.
- **Layout** : inline-flex column, gap 4px, position relative
- **data-attributes** : `data-state` (`open`|`closed`)
- **Tests** : 24 tests — 24 passants

### TopNav (`packages/react/src/components/TopNav/`)
- **Fichiers** : `TopNav.tsx`, `TopNav.module.css`, `TopNav.test.tsx`, `index.ts`
- **Story** : `packages/storybook/src/stories/components/TopNav.stories.tsx`
- **API** : `children` (requis, contenu du menu déroulant "Sélection projets"), `project` (`odaptos`|`bpce`|`ibp`|`opco-atlas`|`conseil-constitutionnel`, absent = état homepage), `title` (requis si `project` fourni), `subtitle`, `onBackClick` + props HTML natives (`HTMLElement`, racine `<nav>`)
- **Composition** : réutilise `MenuButton` (bouton retour, `outlined`/`light`/`md`) et `DropdownMenuTrigger` (sélecteur de projets, `triggerSize="md"`) — le contenu du dropdown est fourni par le consommateur via `children`, TopNav ne connaît pas la liste des projets
- **États** : homepage (pas de `project`) → pas de bouton retour ni titre, trigger aligné à droite ; page projet (`project` fourni) → fond coloré, bouton retour "Accueil", titre + sous-titre
- **Tokens** : `color/background/projects/*`, `color/text/nav-bar/*` (titre et sous-titre — même couleur pour les deux)
- **data-attributes** : `data-project` (sur la pilule, absent en homepage)
- **Tests** : 12 tests — 12 passants

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

### Structure des stories
```
src/stories/
├── getting-started/     ← MDX — pages Démarrage (Bienvenue, Étape 1–4)
├── tokens/              ← MDX — pages Fondations (Couleurs, Typographie, Espacements, Dimensions)
└── components/          ← TSX  — stories des composants React
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

1. Prochain composant — **à définir** avec claude.ai (node Figma à renseigner)
2. ~~**Code Connect** — mapping Figma ↔ React~~ ✅ **Fait** (`figma.config.json` configuré, scripts figma en place)
3. ~~**GitHub Actions** CI/CD~~ ✅ **Fait** (`ci.yml` + `storybook.yml`)
4. **Automatisation progressive du workflow** — à définir selon les besoins réels (ex : sync tokens Figma, previews PR Storybook, déclenchement Code Connect automatique)

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

## 19. Skill ds-br-screen — obligatoire avant tout travail sur un screen

Le skill `.claude/skills/ds-br-screen/` doit être chargé **avant tout travail sur un screen**, que ce soit :
- Génération de code (Storybook)
- Création ou modification de maquettes Figma via `use_figma`

### Ordre de chargement obligatoire

1. Lire `.claude/skills/ds-br-screen/SKILL.md`
2. Lire les références obligatoires :
   - `reference/typography.md`
   - `reference/color-and-contrast.md`
   - `reference/spatial-design.md`
3. Lire les références additionnelles selon le contexte (motion, interaction, ux-writing)

### Après toute création ou modification

Lancer `/audit-screen` pour vérifier systématiquement :
- Tokens DS : zéro valeur hardcodée (couleurs, spacing, border-radius, **effets/shadows**)
- Accessibilité
- Anti-patterns visuels

**Ne jamais déclarer un screen « terminé » sans avoir passé `/audit-screen`.**

---
