---
id: ADR-004
title: "Écrans : repli balisé quand un composant n'existe pas dans le DS"
status: accepted
date: 2026-11-16
deciders: [Damien]
supersedes: []
superseded_by: null
related_components: []
related_tokens: []
backlog: ["010"]
prs: []
tags: [ecrans, skill, gouvernance, observabilite]
---

# ADR-004 — Écrans : repli balisé quand un composant n'existe pas dans le DS

## Contexte

La skill `ds-br-screen` sert à générer « tout écran, page, formulaire ou layout » avec
« exclusivement les composants » du DS, et CLAUDE.md §18 impose « uniquement les
composants de `@brique-rouge/react` ». Or le DS compte 21 composants, surtout faits pour
le portfolio (`COMPONENTS.md`) : ni champ de saisie, ni liste déroulante, ni case à
cocher, ni tableau, ni modale. Rien ne disait quoi faire quand un écran en a besoin :
l'agent s'arrête ou improvise, sans règle commune (backlog [010](../backlog/010-ecrans-composants-manquants.md)).

L'observabilité est la fonction prioritaire de Brique Rouge (condensé de la conversation
RAG du 17 avril 2026 ; passe 03 du schéma metadata). Un manque de composant est donc
d'abord une donnée à mesurer.

## Options considérées

1. **A — Arrêt** : lister les composants manquants et attendre avant de générer. Sûr,
   mais presque tout écran hors portfolio s'arrête au premier champ : le DS ne s'éprouve
   plus, et le manque n'est consigné nulle part.
2. **B — Repli balisé** : générer l'écran avec un élément HTML natif à la place du
   composant absent, stylé uniquement avec des tokens, marqué et inventorié.
3. **C — Composant inventé dans l'écran** : écarté. Il contredit CLAUDE.md §15 (pas de
   décision de design) et le workflow composants (§7 : Figma d'abord).

## Décision

Option B, avec ces règles :

- **Seulement pour un composant absent.** Si `COMPONENTS.md` a un composant qui répond
  au besoin, on l'utilise. Une **variante** manquante d'un composant existant (exemple :
  `Button` sur fond sombre) ne justifie pas de repli : utiliser la variante la plus proche
  et signaler le manque. Réimplémenter un composant existant créerait un *shadow
  component* (passe 03, doublon de type 2), c'est-à-dire de la dette.
- **Élément HTML natif et sémantique** (`input`, `select`, `textarea`, `table`, `dialog`…),
  jamais un `div` qui imite un contrôle.
- **Tokens uniquement**, comme le reste de l'écran (CLAUDE.md §17), dans le CSS Module de
  l'écran.
- **Accessibilité WCAG 2.1 AA** comme pour un composant : libellé associé, focus visible,
  états (CLAUDE.md §6.3).
- **Marquage** : `data-ds-missing="<nom>"` sur l'élément racine du repli, nom en
  kebab-case (`text-field`, `select`, `data-table`…). Jamais `data-component` : ce préfixe
  est réservé aux composants du DS, et la requête `[data-component^="ds-br"]` de CLAUDE.md
  §18 compterait le repli comme un composant.
- **Inventaire** : le commentaire d'en-tête du `.tsx` liste les replis (nom, besoin
  couvert), et `/audit-screen` les reporte dans une section dédiée.
- **Statut** : un écran qui contient au moins un repli n'est pas « terminé » sans
  l'arbitrage de Damien : créer le composant, garder le repli, ou revoir l'écran.

## Conséquences

- CLAUDE.md §18 : « uniquement les composants », sauf repli balisé selon cet ADR.
- Mesure : `document.querySelectorAll('[data-ds-missing]')` donne l'inventaire d'un
  écran. Le cumul des noms sur tous les écrans indique quels composants manquent le plus,
  une base factuelle pour choisir le « prochain composant » (CLAUDE.md §14.1).
- Pour un futur observer, le marquage distingue deux cas : un repli marqué est une
  demande de composant ; un élément non marqué qui imite un composant existant est un
  shadow component.
- Contrôles déjà en place qui couvrent les replis : `token-audit.mjs` (CSS Modules de
  `packages/storybook/src`) et `rendered-contrast-audit.mjs` (chaque story, donc chaque
  écran, à l'état chargé).
- Risque : un repli qui dure devient un composant de fait, hors Figma. La règle de statut
  et l'inventaire servent à l'empêcher ; aucun contrôle de CI ne le vérifie.

## Sources

- Backlog [010](../backlog/010-ecrans-composants-manquants.md) ; CLAUDE.md §6.3, §7, §14.1,
  §15, §17, §18.
- Condensé de la conversation RAG du 17 avril 2026 (« Fonction prioritaire :
  observabilité / évaluation ») et schéma metadata, passe 03 — Observabilité
  (`ObservabilityDuplicates`, type 2 « shadow implementations »), documents du projet
  Brique Rouge.
