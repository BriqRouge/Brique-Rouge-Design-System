---
id: ADR-006
title: "Patterns : une définition unique, et les règles de métier renommées en guidelines"
status: accepted
date: 2026-11-17
deciders: [Damien]
supersedes: []
superseded_by: null
related_components: []
related_tokens: []
backlog: ["013", "014"]
prs: [109]
tags: [specs, patterns, guidelines, skill, gouvernance, licence]
---

# ADR-006 — Patterns : une définition unique, et les règles de métier renommées en guidelines

## Contexte

**Le mot « pattern » a plusieurs sens.**

- Christopher Alexander : un problème qui revient sans cesse, et le cœur de sa solution,
  réutilisable sans être appliqué deux fois à l'identique.
- GOV.UK, Carbon, Atlassian : des solutions de référence à des tâches utilisateur ou à des
  types de page, qui combinent plusieurs composants. Carbon les distingue des composants :
  un composant est prêt à importer, un pattern admet plusieurs façons de répondre au besoin.
- Hardik Pandya, dont vient la structure de `specs/` (commit `fe87848`, 2026-09-30) :
  `patterns/` y contient les règles de mise en page et de composition (`form-layout`,
  `list-detail`, `error-handling`…).
- Alla Kholmatova : les « perceptual patterns » sont des styles (couleur, typographie,
  animation).

**Le dossier `specs/patterns/` ne contenait aucun pattern au sens des trois premières
définitions.** Ses six fichiers (typographie, couleur et contraste, espacement, motion,
interaction, rédaction) sont des règles de métier générales. CLAUDE.md §4 les présentait
comme des « règles de composition » et la skill `ds-br-screen` comme des « patterns de
composition », alors qu'aucun ne décrit une composition. Le mot était donc occupé par
autre chose, et Brique Rouge n'avait aucun pattern.

**Ces fichiers sont adaptés d'Impeccable**, comme la skill `ds-br-screen` et ses commandes
`/audit-screen`, `/critique-screen` et `/polish-screen`. Impeccable est sous licence Apache
2.0 (© 2025 Paul Bakaus), et le dépôt ne portait aucune attribution. Origine établie le
2026-11-17 en comparant la structure et les tableaux des fichiers avec l'historique
d'Impeccable (par exemple, le tableau des libellés de boutons de `ux-writing.md` est une
traduction ligne à ligne).

**La composition n'est fixée nulle part.** Les tokens fixent les valeurs, les composants
fixent les pièces. La skill `ds-br-screen` demande à l'agent de proposer « une direction
créative forte » à chaque écran, alors que le backlog vise un DS « plus consistant,
cohérent et plus déterministe ». Le schéma metadata (passe 02) décrit les cas d'usage
composant par composant : aucune unité ne représente un cas d'usage qui mobilise
plusieurs composants.

**Le DS n'a pas encore de quoi nourrir une bibliothèque de patterns.** Il compte 21
composants, surtout faits pour le portfolio : ni champ de saisie, ni liste déroulante, ni
case à cocher, ni tableau, ni modale. Aucun écran n'existe (`stories/screens/` absent),
et aucun `.metadata.ts`. Nathan Curtis ne voit pas de retour sur investissement clair dans
une bibliothèque de patterns interne pour la plupart des équipes et conseille de commencer
par un seul pattern essentiel. GOV.UK exige la preuve qu'un pattern serve à plusieurs
équipes ou services avant de l'accepter.

## Options considérées

**Nommage**

1. **A — Garder `specs/patterns/` pour les règles de métier** et ranger les vrais patterns
   ailleurs (`specs/compositions/`). Écarté : contredit toutes les sources citées, y
   compris celle dont vient la structure de `specs/`, et laisse aux agents un mot à deux
   sens.
2. **B — Renommer le dossier actuel en `specs/guidelines/`** et réserver `specs/patterns/`
   aux patterns définis ci-dessous. Retenu.
3. **C — Tout garder dans `specs/patterns/` avec un champ `kind`.** Écarté : deux natures
   de règles sous un même nom, la confusion d'où viennent les backlogs 007 et 009.

**Place de la liberté créative dans la skill**

1. **Liberté partout** (statu quo). Écarté : la composition reste réinventée à chaque
   génération.
2. **Le pattern s'applique ; la liberté porte sur ce qu'il laisse libre.** Retenu.

**Périmètre de départ**

1. **Écrire dès maintenant les patterns génériques** (formulaire, erreurs, état vide).
   Écarté : ils reposent sur des composants absents, sans aucune occurrence à documenter.
2. **Un seul pattern, celui dont la répétition est prouvée : la page projet.** Retenu
   (backlog [013](../backlog/013-pattern-page-projet.md)).

## Décision

- **Définition.** Un pattern Brique Rouge est la solution documentée à une tâche ou à un
  type de page qui revient, construite uniquement avec des composants du DS, avec ses
  règles de composition, de contenu et d'accessibilité.
- **Distinctions.** Une *guideline* est une règle de métier générale. Un *organisme* est
  une composition figée, réutilisée telle quelle comme un seul bloc : si une composition
  ne varie pas, c'est un organisme, pas un pattern. « Anti-pattern » garde son sens
  courant, à tous les niveaux.
- **Dossiers.** `specs/patterns/` → `specs/guidelines/`. `specs/patterns/` accueille les
  patterns ; son `README.md` porte l'index, les critères et le format de fiche.
- **Critères d'entrée** (inspirés de GOV.UK) : utile, avec au moins 3 occurrences réelles
  listées ; unique ; construit avec les composants et tokens du DS. Statuts
  `experimental` → `stable` → `deprecated`, conditions dans `specs/patterns/README.md`.
- **Application.** Quand un pattern couvre l'écran, sa section « Fixé » s'applique telle
  quelle ; la direction créative ne porte que sur sa section « Libre ». Un conflit entre un
  pattern et une guideline ou Figma est signalé à Damien (CLAUDE.md §6.1).
- **Attribution.** `NOTICE.md` à la racine, texte de la licence dans
  `LICENSES/Apache-2.0.txt`, mention de modification sous le titre de chaque fichier
  adapté.

## Conséquences

- **Références mises à jour dans la même PR** : 30 occurrences de `specs/patterns/` dans
  8 fichiers (CLAUDE.md, skills `ds-br-screen` et `sync-component`, page Storybook
  « Étape 0 », backlogs 007, 009, 010, 011), plus le vocabulaire de `README.md`,
  `METHODOLOGY.md` et du backlog 007. Seuls `NOTICE.md`, cet ADR et les backlogs gardent
  l'ancien chemin, comme trace. Le dossier n'est publié dans aucun package npm
  (`specs/` est à la racine). Procédure de CLAUDE.md §6.7 suivie : usages recherchés dans
  tout le dépôt, renommage validé par Damien le 2026-11-17.
- **Skill.** `ds-br-screen` lit l'index des patterns avant de composer, et
  `/audit-screen` vérifie la conformité au pattern quand l'écran en relève.
- **Pas de contrôle de CI** de la conformité d'un écran à un pattern : seule la revue de
  `/audit-screen` la vérifie. À automatiser si le premier pattern prouve sa valeur (par
  exemple en comparant l'ordre des `data-component` de l'écran à la section « Fixé »).
- **Risque : figer trop tôt une composition.** Le statut `experimental` et la règle « Figma
  reste la source de vérité » le limitent. Rien ne détecte encore qu'une page Figma
  s'écarte d'un pattern documenté.
- **Licence du dépôt.** CLAUDE.md annonce MIT, mais aucun fichier `LICENSE` ne l'établit :
  backlog [014](../backlog/014-licence-du-depot.md).
- **Non couvert** : l'intégration des patterns au schéma metadata (unité de cas d'usage
  multi-composants), à traiter dans une passe ultérieure.

## Sources

- Christopher Alexander, *A Pattern Language* (1977), cité par
  [Wikipedia — Design pattern](https://en.wikipedia.org/wiki/Design_pattern).
- [GOV.UK Design System — Patterns](https://design-system.service.gov.uk/patterns) et
  [Contribution criteria](https://design-system.service.gov.uk/community/contribution-criteria).
- [Carbon — Patterns overview](https://preview.carbondesignsystem.com/building-blocks/core/patterns/overview).
- [Atlassian Design System — Patterns](https://atlassian.design/patterns).
- Nathan Curtis, [UX Patterns ≠ UI Components](https://eightshapes.com/articles/patterns-components/).
- Hardik Pandya, [Expose your design system to LLMs](https://hardik.substack.com/p/expose-your-design-system-to-llms)
  (structure `specs/` lue via une copie de hvpandya.com/llm-design-systems).
- Alla Kholmatova, *Design Systems* (Smashing, 2017), chapitre « Perceptual Patterns ».
- Brad Frost, [The art of design system recipes](https://bradfrost.com/blog/post/the-art-of-design-system-recipes/).
- [Impeccable](https://github.com/pbakaus/impeccable), fichiers `NOTICE.md` et `LICENSE`.
- Conversation du 2026-11-17 (claude.ai, projet Brique Rouge) ; schéma metadata, passe 02
  — Usage (`UseCase`, `RelatedComponent`, `AntiPattern`) ; ADR-004 ; CLAUDE.md §6.1, §6.7, §19.
