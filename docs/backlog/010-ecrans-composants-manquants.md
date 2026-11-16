---
id: "010"
title: "Écrans : que faire quand un composant nécessaire n'existe pas dans le DS"
status: a-explorer
created: 2026-11-16
origin: "Relevé le 2026-11-16 en préparant un test de génération d'écrans avec la skill ds-br-screen"
adr: []
claude_md: ["17", "18", "19"]
related_components: []
related_tokens: []
references: [.claude/skills/ds-br-screen/SKILL.md, COMPONENTS.md, specs/patterns/interaction-design.md]
prs: []
---

# 010 — Écrans : que faire quand un composant nécessaire n'existe pas dans le DS

## Problème
La skill `ds-br-screen` se déclare utilisable « pour tout écran, page, formulaire ou
layout » et impose « exclusivement les composants » du DS (CLAUDE.md §18 : « uniquement
les composants de `@brique-rouge/react` »). Mais le DS ne contient ni champ de saisie, ni
liste déroulante, ni case à cocher, ni tableau, ni modale (`COMPONENTS.md`, 21
composants). La skill ne dit pas quoi faire dans ce cas : l'agent s'arrête, ou il improvise
(HTML natif stylé avec les tokens, composant inventé), sans règle commune.

`specs/patterns/interaction-design.md` traite déjà le cas du bouton sur fond sombre :
« un manque du DS à signaler, pas à styler à la main ». Rien n'est dit pour les autres
manques.

## Ce qui existe déjà
- Le DS couvre surtout le portfolio : `TopNav`, `BentoBox`, `ProjectBentoCard`,
  `ProjectOverview`, `ProjectSectionsDescription`, `MacbookMockup`, `LogoCompanies`…
- CLAUDE.md §6.1 et §15 : signaler, ne pas trancher seul, ne pas prendre de décision de
  design.

## Proposition
Une règle explicite dans la skill, au choix de Damien :
- **A — Arrêt** : lister les composants manquants avant de générer, et attendre.
- **B — Repli balisé** : élément HTML natif stylé uniquement avec des tokens, marqué
  (`data-component="ds-br-missing-<nom>"`, par exemple), et listé dans le rapport
  `/audit-screen` comme candidat composant.

## Prérequis / questions ouvertes
- [ ] Choix A ou B.
- [ ] Un test de génération d'écran hors du périmètre du DS (un formulaire, par exemple)
      montrerait le comportement actuel de la skill sans règle.

## Non couvert
La création des composants manquants eux-mêmes (workflow composants, CLAUDE.md §7).
