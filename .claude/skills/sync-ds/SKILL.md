---
name: sync-ds
description: Synchronisation globale Figma → Design System en une commande — détecte tout ce qui a changé dans le fichier Figma (`figma.fileKey` de `ds.config.json`) (Variables et composants) depuis la dernière synchro, présente un rapport d'écarts consolidé et détaillé validé par la personne responsable du design, puis met à jour tokens, composants, tests, stories et specs dans une seule PR (un commit par composant). Utiliser quand la personne responsable du design demande /sync-ds, de tout synchroniser, ou de synchroniser plusieurs composants d'un coup.
---

# /sync-ds — Figma → Design System, en une commande

La personne responsable du design travaille sur plusieurs composants dans Figma, puis lance `/sync-ds` une
seule fois. Le skill :

1. **détecte** ce qui a changé depuis la dernière synchro (empreintes) ;
2. **synchronise les tokens** d'abord si les Variables ont changé ;
3. **analyse** en profondeur les seuls composants modifiés ;
4. présente **un rapport consolidé très détaillé** → **STOP, validation de la personne responsable du design** ;
5. implémente les écarts validés, **un commit par composant** ;
6. met à jour le snapshot et ouvre **une seule PR**.

Pour forcer la synchro d'un composant précis, `/sync-component <Nom>` reste
disponible. Les **conventions établies** et la méthode d'analyse d'un composant
sont celles de `.claude/skills/sync-component/SKILL.md` : les lire avant de
commencer, elles s'appliquent ici sans exception.

## Prérequis

- `FIGMA_TOKEN` dans `.env` (voir `.env.example`) : token personnel Figma en
  lecture seule (`file_content:read`). Ne jamais le lire, l'afficher ni le
  demander dans la conversation.
- MCP Figma connecté (`whoami` en cas d'erreur de droits) — pour l'analyse et les
  Variables
- Skills `figma-use` (avant `use_figma`) et `figma-design-to-code` (avant
  `get_design_context`) chargés
- `main` à jour et propre : `git switch main && git pull`, puis
  `git switch -c feat/sync-ds-<AAAA-MM-JJ>`

## Étape 1 — Détection

### Composants

```bash
node scripts/figma-sync-ds.mjs detect
```

Le script lit Figma directement par l'API REST (fichier `figma.fileKey` de
`ds.config.json`) : aucune donnée n'est recopiée à la main. Le registre des
composants vient des en-têtes YAML des fiches `specs/` (`figma.node`).

| Code | Signification | Action |
|---|---|---|
| `0` | Aucun composant modifié | Passer aux Variables |
| `1` | Token absent ou refusé, Figma injoignable, fiche invalide | Corriger (message explicite), relancer |
| `3` | Changements détectés | Noter la liste, passer aux Variables |

Lecture du rapport de détection :
- **Composants à analyser**, déjà triés atomes → molécules → organismes, avec les
  variantes modifiées / ajoutées / supprimées et les propriétés modifiées
- Un **renommage** de variante apparaît comme une suppression + un ajout
- **ⓘ « utilise X, aussi modifié »** : le changement vient peut-être d'un
  composant imbriqué (ex. `TopNav` qui contient `MenuButton`) — l'analyse le
  confirme ou non
- **Introuvables** (node supprimé dans Figma) et **nouveaux dans Figma** (page
  « Design system », sans fiche) : à reporter dans le rapport consolidé, jamais
  traités automatiquement
- **Premier lancement** (pas de snapshot) : tous les composants sont à analyser —
  c'est l'audit complet de référence ; annoncer que ce sera long

### Variables

L'API REST des Variables est réservée au plan Figma Enterprise : elles passent par
le plugin. Appliquer `.claude/skills/sync-tokens/SKILL.md` étapes 1 et 2 (export
via `use_figma`), puis :

```bash
node scripts/figma-sync-tokens.mjs --check
```

`0 ajoutée(s), 0 supprimée(s), 0 valeur(s) modifiée(s)` → Variables inchangées.

Rien de modifié (composants **et** Variables) → le dire. Fin, pas de PR.

## Étape 2 — Tokens (si les Variables ont changé)

Appliquer `.claude/skills/sync-tokens/SKILL.md`, **étapes 1 à 5 uniquement**, sur
la branche courante : pas de branche ni de PR séparée. Les valeurs modifiées
font partie du rapport consolidé (section Tokens). Après validation, un commit :
`feat(tokens): synchro Figma Variables`.

## Étape 3 — Analyse des composants modifiés

Pour chaque composant listé, dans l'ordre du rapport : appliquer les étapes 2
et 3 de `/sync-component` (toutes les variantes du set, `get_design_context`
sur chaque variante **modifiée ou ajoutée** + au moins une variante par état,
variables liées, motion, assets, lecture du code et des consommateurs).

Ne rien modifier pendant cette étape. Garder pour chaque composant les
éléments du rapport (étape 4).

## Étape 4 — Rapport consolidé (très détaillé) → STOP

Un seul message, structuré ainsi :

```markdown
# Rapport /sync-ds — <date>

## Synthèse
- Détection : N composants modifiés · tokens modifiés oui/non · X introuvables · Y nouveaux
- Résultat de l'analyse : A composants avec écarts, B sans écart (changement Figma
  sans impact code : texte d'exemple, position, surcharge identique…)
- Décisions demandées : D (numérotées ci-dessous)

## Tokens            (si étape 2)
| Variable | Avant | Après | Impact rendu | Composants concernés |

## [atome] Tag — node 184:18522
**Détecté** : variantes modifiées `Size=sm, Style=outlined`…
**Ce qui a changé dans Figma** : description en clair (ex. « le padding horizontal
du sm passe de 8 à 6px, lié à spacing/x1-5 »)

| # | Catégorie | Figma | Code actuel | Écart | Impact rendu | Proposition |
|---|---|---|---|---|---|---|
| 1 | Spacing | `spacing/x1-5` (6px) | `--spacing-x2` (8px) | padding sm | -2px de large | Aligner le code |

**Incohérences Figma** (CLAUDE.md « Figma est la source de vérité » : signalées, non corrigées) : …
**API React** : inchangée / prop modifiée → consommateurs impactés : `fichier:ligne`…
**Fichiers modifiés** : `Tag.module.css`, `Tag.test.tsx`, `Tag.stories.tsx`, `specs/atoms/Tag.md`
**Tests ajoutés / mis à jour** : …

## Sans écart
- `TopNav` : changement détecté = conséquence de `MenuButton` (ⓘ) — aucun écart propre

## Hors périmètre automatique
- Introuvables : … → que faire ? (fiche à mettre à jour, composant à retirer ?)
- Nouveaux dans Figma : `Badge` (184:18566) → à créer via le workflow CLAUDE.md « Workflow composants » ?

## Décisions à prendre
1. Tag #1 — aligner le code sur 6px ? (recommandé : oui)
2. …
```

Règles du rapport :
- **Chaque écart a un numéro global** (`Tag #1`, `Button #3`…) pour que la personne responsable du design
  puisse répondre « tout OK sauf Tag #2, reporter MenuButton ».
- Toujours indiquer l'**impact rendu** réel (px, couleur avant → après) et les
  **consommateurs** touchés.
- Appliquer les conventions établies sans les redemander ; ne poser que les
  vraies questions de design.

**STOP — attendre la réponse de la personne responsable du design.** Trois réponses possibles par
composant : **valider**, **refuser un écart** (reste signalé dans la fiche),
**reporter le composant** (rien n'est fait, il réapparaîtra au prochain `/sync-ds`).

## Étape 5 — Implémentation, un commit par composant

Dans l'ordre atomes → molécules → organismes, pour chaque composant validé,
appliquer les étapes 5 à 7 de `/sync-component` (code, tests par état/variante,
story, mesure Playwright `getComputedStyle`/`boundingBox()`, fiche specs,
`COMPONENTS.md` si besoin), puis :

```bash
pnpm --filter @brique-rouge/react test   # avant chaque commit
git commit -m "fix(<composant-kebab>): aligne sur Figma — <résumé des écarts>"
```

(`feat(...)` si le changement ajoute une variante ou une prop.) Un composant
sans écart ne produit pas de commit.

## Étape 6 — Snapshot, contrôles, PR

1. Snapshot — **sauf les composants reportés** :
   - rien de reporté : `node scripts/figma-sync-ds.mjs update`
   - sinon : `node scripts/figma-sync-ds.mjs update --only <validés et sans écart, séparés par des virgules>`
     (les nouveaux composants restent alors signalés au prochain lancement tant
     qu'ils ne sont pas traités)

   Le snapshot reflète Figma **au moment de `update`** : si Figma a été modifié
   pendant la synchro, relancer `detect` avant pour ne rien absorber sans analyse.
   Commit : `chore(sync-ds): met à jour le snapshot Figma`. Une fois mergé, la
   détection nocturne ferme l'issue « Drift Figma ».
2. Contrôles :
   ```bash
   node scripts/token-audit.mjs
   node scripts/check-specs.mjs
   node --test scripts/figma-sync-tokens.test.mjs scripts/figma-sync-ds.test.mjs scripts/check-specs.test.mjs
   pnpm turbo run lint
   pnpm test
   ```
3. PR unique `feat/sync-ds-<date>` → `main` : description = le rapport consolidé
   final (écarts appliqués, refusés, reportés, incohérences Figma), les mesures
   et les contrôles. **Ne jamais merger** (CLAUDE.md « Workflow Git »).

## Ce que ce skill ne fait pas

- Pas de création ni de suppression de composant : signalés, puis workflow CLAUDE.md « Workflow composants » ou
  décision de la personne responsable du design.
- Pas de correction de Figma : une incohérence est signalée (CLAUDE.md « Figma est la source de vérité »).
- Pas de modification avant le rapport validé : l'étape 4 est un point d'arrêt.
- Limite connue de la détection : seuls les composants qui ont une fiche specs
  sont comparés finement ; les autres composants de la page « Design system »
  ne sont repérés qu'à leur apparition.
