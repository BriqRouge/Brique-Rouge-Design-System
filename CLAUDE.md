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
│   ├── react/           # Composants React (atoms/molecules/organisms)
│   └── storybook/       # Documentation et vitrine
├── specs/               # Référence LLM : foundations, tokens, composants, patterns
│   ├── foundations/     # Généré — valeurs par catégorie de token
│   ├── tokens/          # Généré — catalogue --css-var: valeur
│   ├── atoms/           # Fiche par composant atome
│   ├── molecules/       # Fiche par composant molécule
│   ├── organisms/       # Fiche par composant organisme
│   └── patterns/        # Règles de composition (typo, couleur, spacing, motion…)
├── scripts/
│   └── token-audit.mjs  # CI — détecte les couleurs hardcodées
├── CLAUDE.md
├── COMPONENTS.md        # Index des composants → specs/
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
- **Vérifié en CI** : `scripts/token-audit.mjs` (job Lint) détecte toute couleur hexadécimale codée en dur dans les CSS Modules (hors fallback `var(--token, #hex)`, usage légitime). Portée volontairement limitée aux couleurs — voir commentaire en tête du script pour le raisonnement. Exception explicite via `/* token-audit-ignore */` en tête de fichier, réservée au contenu illustratif bespoke sans équivalent DS (ex: assets Figma composés à la main)

---

## 7. Workflow composants

### Étape 0 — Analyse Figma complète (obligatoire, avant d'écrire la moindre ligne de code)

**Ne jamais conclure sur le comportement d'un composant à partir d'une seule
capture d'écran ou d'une seule instance.** Une capture d'écran ne montre que
l'apparence statique d'UN état — elle ne révèle ni les interactions, ni les
variantes absentes de cette instance précise. Erreur déjà commise sur
`MetaInfoItem` : vérifié uniquement via l'instance `State=Idle` de la page
d'accueil, l'état `Hovered` (vrai lien, surbrillance au survol, icône qui
change) n'a été découvert qu'après coup, sur signalement de Damien.

Avant d'implémenter, systématiquement :

1. `get_metadata` sur le composant **et sur son parent dans la bibliothèque
   Figma** (pas seulement l'instance rencontrée en premier) pour lister
   **toutes** les variantes (`Size=`, `State=`, `Style=`, etc.) et leurs
   node IDs — une instance isolée ne montre qu'une combinaison de variantes
2. `get_design_context` sur **chaque état pertinent** (`State=Idle`,
   `State=Hovered`, `State=Focus`, `State=Disabled`, `State=Error`...),
   pas uniquement l'état par défaut
3. `get_motion_context` pour vérifier l'existence d'animations Smart Animate
   authored côté Figma (confirmer explicitement l'absence plutôt que de
   l'assumer)
4. À partir de ces lectures, documenter avant de coder :
   - **Composants du DS déjà utilisés** dans la structure (pour réutiliser,
     pas dupliquer)
   - **Tous les variants et leurs valeurs** (ex: `Size=sm|nm|md|lg`)
   - **Tous les états** (default, hover, focus, disabled, error...)
   - **Les tailles**, si applicable
   - **Les tokens utilisés** (couleurs, espacements, typographie) — avec
     vérification systématique contre le CSS réellement généré
     (`packages/tokens/build/css/`), pas seulement la valeur de fallback
     Figma
   - **Les animations proposées** (ou leur absence confirmée)
   - **La structure de grille/layout**
5. Proposer une API React propre et cohérente qui reflète fidèlement cette
   structure — en signalant toute incohérence Figma repérée (§6.1)

### Ordre impératif pour chaque nouveau composant ou modification

```
1. Étape 0 ci-dessus (analyse Figma complète — tous les états/variantes)
2. Faire le diff avec le code existant
3. Identifier le périmètre exact des changements
4. Pour un nouveau composant : choisir son niveau atomic design
   (atome/molécule/organisme — voir critères en §9) AVANT de créer les
   fichiers, pour le placer directement au bon endroit
5. Implémenter uniquement ce qui a changé, dans
   packages/react/src/components/{atoms,molecules,organisms}/{Composant}/
6. Vérifier les tests existants — ne pas les casser
7. Ajouter ou mettre à jour les tests (couvrir chaque état identifié en
   étape 0, pas seulement le rendu par défaut)
8. Mettre à jour la story Storybook — title au format
   'Atomes|Molécules|Organismes/{Composant}' selon le niveau choisi
9. Vérifier le rendu réel dans Storybook par **mesure** (Playwright
   `getComputedStyle`/`boundingBox()` avant/après interaction), pas
   seulement par capture d'écran visuelle — une capture ne détecte pas
   un état CSS qui ne change pas visuellement assez pour l'œil, ni un
   état jamais déclenché
10. Créer ou mettre à jour specs/{tier}/{Composant}.md (API, tokens,
    règles d'usage) — c'est la fiche canonique, pas COMPONENTS.md ni
    CLAUDE.md §9 (simples index qui pointent vers specs/)
11. Ajouter une ligne dans COMPONENTS.md (index) pointant vers cette
    fiche
12. Si de nouveaux tokens ont été ajoutés à tokens.json : relancer
    `pnpm --filter @brique-rouge/tokens build` pour régénérer
    specs/foundations/ et specs/tokens/ (sinon le check CI "specs à
    jour" casse)
13. Push GitHub
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

L'API complète, les tokens CSS et les règles d'usage détaillées de chaque composant
vivent désormais dans `specs/{atoms,molecules,organisms}/{Composant}.md` — ce fichier
n'est plus qu'un index. Voir `COMPONENTS.md` à la racine pour la liste complète avec
liens.

| Niveau | Composants |
|---|---|
| **Atomes** (`packages/react/src/components/atoms/`) | `Button`, `MenuButton`, `FrameLogo`, `LogoCompanies` |
| **Molécules** (`packages/react/src/components/molecules/`) | `AlertBanner`, `DropdownMenu`, `DropdownMenuButton`, `ProjectCardDescription` |
| **Organismes** (`packages/react/src/components/organisms/`) | `DropdownMenuTrigger`, `TopNav`, `ProjectBentoCard` |

Classification : un **atome** est un élément indivisible. Une **molécule** assemble des
atomes en une unité fonctionnelle précise (ex: `DropdownMenuButton` = logo + texte +
icône). Un **organisme** compose au moins une molécule et/ou plusieurs
atomes/organismes pour former une section d'interface complète (ex: `TopNav` compose
`MenuButton` + `DropdownMenuTrigger`). Classer tout nouveau composant dans cette
hiérarchie dès sa création.

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
| Code Connect | Fait — `figma.config.json` configuré, premier mapping (`MenuButton.figma.tsx`) en place |
| Component tokens | Intentionnellement minimaliste — pas de sur-tokenisation |

---

## 14. Prochaines étapes

1. Prochain composant — **à définir** avec claude.ai (node Figma à renseigner)
2. ~~**Code Connect** — mapping Figma ↔ React~~ ✅ **Fait** (`figma.config.json` configuré, scripts figma en place)
3. ~~**GitHub Actions** CI/CD~~ ✅ **Fait** (`ci.yml` + `storybook.yml`)
4. ~~**Sync tokens Figma → doc**~~ ✅ **Fait** (`generate-specs.mjs` régénère `specs/foundations/` + `specs/tokens/` à chaque build, vérifié en CI)
5. **Automatisation progressive du workflow** — à définir selon les besoins réels (ex : previews PR Storybook, déclenchement Code Connect automatique)

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

Ce fichier liste les composants React disponibles (classés atomes/molécules/organismes)
avec un lien vers leur fiche détaillée dans `specs/{atoms,molecules,organisms}/` : API
exacte, node ID Figma, tokens CSS à utiliser, règles d'usage.

Règle absolue : aucune valeur arbitraire (couleur hex, px hardcodé, etc.) si un token existe.

---

## 18. Workflow — Génération d'interfaces et maquettes Figma

Ce workflow permet de générer des interfaces codées conformes au DS,
puis de les exporter comme maquettes Figma.

### Étape 1 — Description (claude.ai)
Décrire l'écran en langage naturel à Claude.
Claude génère le prompt structuré pour Claude Code.

### Étape 2 — Génération du code (Claude Code)
Claude Code lit `COMPONENTS.md` puis les fiches `specs/` des composants concernés, et produit :
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
2. Lire les patterns obligatoires dans `specs/patterns/` :
   - `specs/patterns/typography.md`
   - `specs/patterns/color-and-contrast.md`
   - `specs/patterns/spatial-design.md`
3. Lire les patterns additionnels selon le contexte (motion, interaction, ux-writing)

### Après toute création ou modification

Lancer `/audit-screen` pour vérifier systématiquement :
- Tokens DS : zéro valeur hardcodée (couleurs, spacing, border-radius, **effets/shadows**)
- Accessibilité
- Anti-patterns visuels

**Ne jamais déclarer un screen « terminé » sans avoir passé `/audit-screen`.**

---
