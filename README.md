# Brique Rouge — Design System AI-ready

[![CI](https://github.com/BriqRouge/Brique-Rouge-Design-System/actions/workflows/ci.yml/badge.svg)](https://github.com/BriqRouge/Brique-Rouge-Design-System/actions/workflows/ci.yml)

> Un Design System dont **Figma est la source de vérité** et que **Claude Code
> synchronise avec le code**, sans report manuel ni oubli.

📖 **Documentation en ligne** : https://briqrouge.github.io/Brique-Rouge-Design-System

## Ce que contient ce dépôt

- **Des tokens** générés depuis les Variables Figma → variables CSS
  (`@brique-rouge/tokens`)
- **Des composants React** accessibles (WCAG 2.1 AA), testés, classés en
  atomes, molécules et organismes (`@brique-rouge/react`)
- **Une documentation Storybook** en français, déployée automatiquement
  (`@brique-rouge/storybook`)
- **Des specs lisibles par les LLM** (`specs/`) : une fiche par composant,
  les fondations, les règles de composition
- **Une synchronisation Figma → code** : skills Claude Code (`/sync-ds`,
  `/sync-component`, `/sync-tokens`), détection nocturne des écarts, lint des
  conventions Figma

## Stack

pnpm + Turborepo · React + TypeScript strict · CSS Modules + CSS Variables ·
Style Dictionary v4 · Storybook 8 · Vitest + Testing Library + jest-axe ·
Claude Code + MCP Figma

---

## Installation

### Prérequis

| Outil | Version | Vérifier |
|---|---|---|
| [Node.js](https://nodejs.org) | 24 (voir `.nvmrc`) | `node --version` |
| [Git](https://git-scm.com) | récent | `git --version` |
| pnpm | 8 (fixé par `packageManager`) | `pnpm --version` |
| [Claude Code](https://claude.com/claude-code) + MCP Figma | — | pour la synchronisation et la création de composants |

Pour obtenir la bonne version de pnpm sans l'installer à la main :

```bash
corepack enable
```

> **C'est quoi le terminal ?** Une fenêtre où l'on tape des commandes.
> Sur Mac : **Terminal** (Applications → Utilitaires). Sur Windows : **Git Bash**,
> installé avec Git.

### Démarrer

```bash
git clone https://github.com/BriqRouge/Brique-Rouge-Design-System.git
cd Brique-Rouge-Design-System
make setup    # installe les dépendances
make dev      # compile les tokens et lance Storybook sur http://localhost:6007
```

## Commandes

| Commande | Description |
|----------|-------------|
| `make setup` | Installe les dépendances |
| `make dev` | Lance Storybook en local |
| `make tokens` | Génère les CSS depuis `tokens.json` |
| `make test` | Lance les tests |
| `make build` | Build complet du projet |
| `make help` | Liste toutes les commandes |

| Dans Claude Code | Description |
|---|---|
| `/sync-ds` | Synchronise tout ce qui a changé dans Figma (tokens + composants), une PR |
| `/sync-component <Nom>` | Synchronise un composant existant |
| `/sync-tokens` | Régénère `tokens.json` depuis les Variables Figma |

| Vérification | Description |
|---|---|
| `node scripts/figma-sync-ds.mjs detect` | Liste les composants modifiés dans Figma depuis la dernière synchro |
| `node scripts/figma-sync-ds.mjs lint` | Vérifie les conventions Figma (variantes, variables, styles de texte) |
| `node scripts/check-specs.mjs` | Cohérence composants React ↔ fiches `specs/` |
| `node scripts/token-audit.mjs` | Détecte les couleurs codées en dur dans les CSS Modules |

## Où trouver quoi

| Fichier | Rôle |
|---|---|
| `ds.config.json` | Paramètres du projet : fichier Figma, page DS, responsable design |
| `CLAUDE.md` | Règles de travail de Claude Code sur ce dépôt |
| `COMPONENTS.md` | Index des composants → fiches `specs/` |
| `METHODOLOGY.md` | Les principes et le pourquoi de la méthode |
| `specs/` | Référence pour les LLM : fondations, tokens, composants, patterns |

---

## Réutiliser comme template

Ce dépôt sépare deux couches :

- **La méthode** (monorepo, build des tokens, scripts, skills Claude Code, CI,
  conventions) : réutilisable telle quelle ;
- **Les choix Brique Rouge** (tokens, composants, specs, contenus) : propres à
  ce DS, à remplacer par les tiens.

Le guide pas à pas pour construire ton propre DS depuis zéro est dans
Storybook, section **Démarrage** (Étapes 0 à 5).

> Un template « vide », débarrassé du contenu Brique Rouge, est prévu. En
> attendant, partir d'une copie de ce dépôt demande les adaptations ci-dessous.

### Configurer le template

**1. Copier le dépôt**

Sur GitHub : **Fork**, puis clone ta copie. Pour un dépôt indépendant sans lien
de fork, crée un dépôt vide et pousse-y un clone de celui-ci :

```bash
git clone https://github.com/BriqRouge/Brique-Rouge-Design-System.git mon-ds
cd mon-ds
git remote set-url origin https://github.com/TON-COMPTE/TON-REPO.git
git push -u origin main
```

**2. Renseigner `ds.config.json`** (le seul fichier de paramètres lu par les
scripts et les skills)

| Clé | À renseigner |
|---|---|
| `project.name`, `project.language` | Nom de ton DS, langue de la documentation |
| `governance.designOwner`, `designOwnerRole` | La personne qui valide les décisions de design |
| `figma.fileKey` | Dans l'URL `figma.com/design/<fileKey>/…` |
| `figma.designSystemPageId` | Identifiant de la page Figma qui contient les composants (`node-id=1-2` → `1:2`) |
| `figma.iconNamePattern` | Motif des noms de composants d'icônes, ignorés par l'inventaire |
| `figma.textFontFamilies` | Polices de ton DS (tout texte dans une autre police est du contenu illustratif) |

**3. Donner l'accès Figma**

- En local : copier `.env.example` en `.env` et renseigner `FIGMA_TOKEN`
  (token personnel Figma, **lecture seule**). Ne jamais le committer ni le
  coller dans un chat.
- En CI : secret GitHub `FIGMA_TOKEN` (voir Storybook › Étape 3).
- Connecter le **MCP Figma** à Claude Code.

**4. Retirer le contenu Brique Rouge**

| Contenu | Où |
|---|---|
| Composants | `packages/react/src/components/{atoms,molecules,organisms}/` et leurs exports dans `packages/react/src/index.ts` |
| Stories des composants | `packages/storybook/src/stories/components/` |
| Fiches composants | `specs/{atoms,molecules,organisms}/`, index `COMPONENTS.md` |
| Snapshot de synchronisation | `scripts/figma/components-snapshot.json` (supprimer : le premier `/sync-ds` le recrée) |
| Tokens | `packages/tokens/tokens.json` (régénéré depuis ton Figma par `/sync-tokens`) |
| Mapping Code Connect | fichiers `*.figma.tsx` |

**5. Renommer ce qui porte le nom Brique Rouge**

Ces couplages ne sont pas encore paramétrés : à renommer par recherche et
remplacement dans tout le dépôt.

| Élément | Valeur actuelle |
|---|---|
| Namespace des packages | `@brique-rouge/tokens`, `@brique-rouge/react`, `@brique-rouge/storybook` |
| Attribut DOM des composants | `data-component="ds-br-…"` |
| Skill de génération d'écrans | `.claude/skills/ds-br-screen/` |
| Contexte du projet | `CLAUDE.md` sections 1 et 2, ce `README`, Storybook › Bienvenue |
| Badge CI et URL de documentation | ce `README` |

**6. Suivre le guide**

Lance `make dev`, puis suis Storybook › **Démarrage**, de l'Étape 0
(préparer ton fichier Figma) à l'Étape 5 (synchroniser).

---

Auteur : **Damien Ramzi** — Senior Product Designer, UX Strategist, à partir du
*Design System Starter* de **Romain Richard**. Licence : MIT.
