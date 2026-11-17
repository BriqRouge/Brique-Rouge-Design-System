# Patterns — Brique Rouge

Définition, critères et format décidés dans l'[ADR-006](../../docs/adr/006-definition-patterns.md).

## Ce qu'est un pattern

Un **pattern** Brique Rouge est la solution documentée à une **tâche** ou à un **type de
page** qui revient, construite uniquement avec des composants du DS, avec ses règles de
composition, de contenu et d'accessibilité.

| Niveau | Question à laquelle il répond | Où |
|---|---|---|
| Guideline | Comment bien faire, en général (typographie, couleur, espacement…) ? | `specs/guidelines/` |
| Composant | Avec quelle pièce ? | `specs/{atoms,molecules,organisms}/` |
| **Pattern** | Comment résoudre cette tâche, ou construire ce type de page, avec ces pièces ? | `specs/patterns/` |
| Écran | Quelle instance précise ? | `packages/storybook/src/stories/screens/` |

**Pattern ou organisme ?** Une composition figée, réutilisée telle quelle comme un seul
bloc, est un organisme (exemple : `BentoBox`, grille fixe de cinq cartes). Un pattern
agence plusieurs composants selon des règles et laisse des parties libres.

« Anti-pattern » garde son sens courant (une pratique à éviter) : un composant, une
guideline ou un pattern peut en déclarer.

## Critères d'entrée

Inspirés des critères de contribution du GOV.UK Design System.

| Critère | Exigence |
|---|---|
| Utile | Au moins **3 occurrences réelles** (cadres Figma ou écrans), listées dans `evidence` |
| Unique | Ne double ni un composant, ni un organisme, ni un autre pattern |
| Construit avec le DS | Uniquement des composants de `COMPONENTS.md` et des tokens ; un composant manquant est listé dans `missing` |

## Statuts

| Statut | Condition |
|---|---|
| `experimental` | Critères d'entrée remplis ; fiche écrite d'après les occurrences |
| `stable` | `missing` vide ; story `Patterns/<Nom>` qui passe la CI ; au moins un écran généré avec le pattern qui passe `/audit-screen` ; mesure faite (protocole du backlog [013](../../docs/backlog/013-pattern-page-projet.md)) ; validé par Damien |
| `deprecated` | Remplacé : `superseded_by` renseigné |

## Application par la skill `ds-br-screen`

- **Un pattern couvre l'écran** : sa section « Fixé » s'applique telle quelle. La
  direction créative ne porte que sur sa section « Libre ».
- **Le pattern contredit une guideline ou Figma** : appliquer le pattern et signaler
  l'écart à Damien (CLAUDE.md §6.1). Figma reste la source de vérité : le pattern se
  corrige, pas Figma.
- **Aucun pattern ne couvre l'écran** : composition libre. Si elle reproduit une
  composition déjà vue ailleurs, le rapport `/audit-screen` la signale comme candidate.

## Format d'une fiche

Un fichier par pattern : `specs/patterns/<nom-en-kebab-case>.md`.

```markdown
---
pattern: nom-du-pattern       # = nom du fichier
title: Titre lisible
kind: page-type               # page-type (type de page) | task (tâche utilisateur)
status: experimental          # experimental | stable | deprecated
components: [NomReact, NomReact]   # noms React, tous dans COMPONENTS.md
missing: []                   # composants nécessaires absents du DS (noms kebab-case, ADR-004)
evidence:                     # au moins 3 occurrences réelles
  - { source: figma, node: "<id du cadre>", name: "<page / cadre>" }
  - { source: screen, path: "packages/storybook/src/stories/screens/<NomEcran>.tsx" }
storybook: Patterns/NomDuPattern   # titre de la story de référence
adr: []
backlog: []
superseded_by: null
---

# Titre lisible

## Problème
La tâche ou le type de page, et qui le rencontre, en une à trois phrases.

## Quand l'utiliser / Quand ne pas l'utiliser

## Structure
### Fixé
Ordre des blocs, composant et props de chacun, tokens d'espacement entre les blocs,
comportement sous le breakpoint.
### Libre
Ce que l'écran peut choisir (nombre de sections, visuels, contenu…).

## Contenu
Règles de rédaction propres au pattern ; le reste suit `specs/guidelines/ux-writing.md`.

## Accessibilité
Landmarks, hiérarchie des titres, ordre de lecture et de focus.

## Anti-patterns
Format `AntiPattern` de la passe 02 du schéma metadata.

| Scénario | Pourquoi | À la place | Sévérité | Détection | Exceptions |
|---|---|---|---|---|---|
| … | … | … | error \| warning \| info | static-analysis \| human-review \| runtime \| design-review | … |

## Occurrences
Le détail de `evidence` : où, et ce qui varie d'une occurrence à l'autre.

## Historique
```

La story de référence vit dans `packages/storybook/src/stories/patterns/`, sous le titre
`Patterns/<Nom>`, en `layout: 'fullscreen'`.

## Index

| Pattern | Type | Statut |
|---|---|---|
| — | — | — |

Aucun pattern à ce jour. Premier candidat : la page projet (backlog
[013](../../docs/backlog/013-pattern-page-projet.md)).
