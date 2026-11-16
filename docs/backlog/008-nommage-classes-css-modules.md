---
id: "008"
title: "Nommage des classes CSS Modules : règle de CLAUDE.md et de la skill ds-br-screen contradictoires"
status: fait
created: 2026-11-16
origin: "Relevé le 2026-11-16 en vérifiant la chaîne de la skill ds-br-screen avant un test de génération d'écrans"
adr: [ADR-005]
claude_md: ["8"]
related_components: [Button, MenuButton, ProjectBentoCard, MetaInfoItem, DropdownMenuButton]
related_tokens: []
references: [.claude/skills/ds-br-screen/SKILL.md, .claude/skills/ds-br-screen/commands/polish-screen.md]
prs: [106]
---

# 008 — Nommage des classes CSS Modules : règle de CLAUDE.md et de la skill contradictoires

## Problème
- CLAUDE.md §8 : « Classes : kebab-case avec préfixe sémantique (`variant-contained`,
  `size-nm`, `is-activated`) ».
- Skill `ds-br-screen` (« Structure des fichiers ») et `/polish-screen` (« Qualité du
  code ») : « noms de classes en camelCase ».

Un agent qui génère un écran reçoit deux règles incompatibles.

## Ce qui existe déjà
> **Correction du 2026-11-16** : le premier comptage ci-dessous ne lisait que les sélecteurs
> en début de ligne. Avec les sélecteurs composés : 127 classes, 27 en kebab-case (toutes des
> modificateurs préfixés, dont `mode-*` et `color-scheme-*`), 52 en camelCase, 48 d'un mot ;
> **4** modificateurs booléens en camelCase (`hasHoverIcon` de MetaInfoItem en plus), et
> `is-activated` appliqué sans être défini. Chiffres retenus dans l'ADR-005.

Premier comptage — sélecteurs de classe en début de ligne dans
`packages/react/src/components/*/*/*.module.css` (2026-11-16) :
- **21 en kebab-case**, tous des modificateurs à préfixe sémantique : `variant-*`,
  `size-*`, `theme-*`, `company-*`, `is-expanded`, `has-hover-label`. Conforme à §8.
- **50 en camelCase**, presque tous des éléments structurels (`.bentoBox`, `.titleBlock`,
  `.hoverIcon`…). §8 ne dit rien de ces classes.
- Exceptions : 3 modificateurs en camelCase (`.hasHoverVisual`, `.expandOnHover`,
  `.iconOnly`), contraires à §8.
- 48 noms d'un seul mot, non discriminants.

La pratique réelle semble donc être : modificateurs en kebab-case préfixé, éléments en
camelCase.

## Proposition
Si c'est l'intention, l'écrire au même endroit pour les composants et les écrans :
« éléments en camelCase, modificateurs (variante, taille, état) en kebab-case avec préfixe
sémantique », dans CLAUDE.md §8, la skill et `/polish-screen`. Décider ensuite du sort des
3 exceptions (les renommer touche le TSX et les tests des composants concernés).

## Prérequis / questions ouvertes
- [x] Règle validée par Damien le 2026-11-16, avec contrôle en CI → [ADR-005](../adr/005-nommage-classes-css-modules.md).
- [x] Exceptions renommées : `is-icon-only`, `is-expand-on-hover`, `has-hover-visual`,
      `has-hover-icon` (rendu vérifié identique par mesure).
- [x] `is-activated` : gardé, style en attente du design → backlog [012](012-dropdownmenubutton-etat-selectionne.md).

## Non couvert
Les classes des stories et des contenus illustratifs (`packages/storybook/src/stories/`).
