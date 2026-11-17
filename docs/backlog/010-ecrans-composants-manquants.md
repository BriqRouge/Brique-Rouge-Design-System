---
id: "010"
title: "Écrans : que faire quand un composant nécessaire n'existe pas dans le DS"
status: fait
created: 2026-11-16
origin: "Relevé le 2026-11-16 en préparant un test de génération d'écrans avec la skill ds-br-screen"
adr: [ADR-004]
claude_md: ["17", "18", "19"]
related_components: []
related_tokens: []
references: [.claude/skills/ds-br-screen/SKILL.md, COMPONENTS.md, specs/guidelines/interaction-design.md]
prs: [105]
---

# 010 — Écrans : que faire quand un composant nécessaire n'existe pas dans le DS

## Problème
La skill `ds-br-screen` se déclare utilisable « pour tout écran, page, formulaire ou
layout » et impose « exclusivement les composants » du DS (CLAUDE.md §18 : « uniquement
les composants de `@brique-rouge/react` »). Mais le DS ne contient ni champ de saisie, ni
liste déroulante, ni case à cocher, ni tableau, ni modale (`COMPONENTS.md`, 21
composants). La skill ne dit pas quoi faire dans ce cas : l'agent s'arrête, ou il improvise
(HTML natif stylé avec les tokens, composant inventé), sans règle commune.

`specs/guidelines/interaction-design.md` traite déjà le cas du bouton sur fond sombre :
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
- **B — Repli balisé** : élément HTML natif stylé uniquement avec des tokens, marqué, et
  listé dans le rapport `/audit-screen` comme candidat composant. (Marquage d'abord
  envisagé : `data-component="ds-br-missing-<nom>"` — écarté, la requête
  `[data-component^="ds-br"]` de CLAUDE.md §18 l'aurait compté comme un composant du DS ;
  retenu : `data-ds-missing`.)

## Prérequis / questions ouvertes
- [x] Choix A ou B : **B**, décidé par Damien le 2026-11-16 → [ADR-004](../adr/004-ecrans-repli-balise.md).
- [x] ~~Test hors périmètre sans règle~~ : abandonné. L'agent qui l'aurait mené est celui
      qui a écrit cette entrée ; il ne pouvait plus se comporter naïvement, le résultat
      n'aurait rien mesuré.

## Non couvert
La création des composants manquants eux-mêmes (workflow composants, CLAUDE.md §7).
