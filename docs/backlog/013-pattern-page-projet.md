---
id: "013"
title: "Premier pattern : la page projet (étude de cas), avec une mesure avant/après"
status: pret
created: 2026-11-17
origin: "Décidé le 2026-11-17 avec l'ADR-006 : un seul pattern pour commencer, celui dont la répétition est prouvée"
adr: [ADR-006]
claude_md: ["19"]
related_components: [TopNav, ProjectOverview, ProjectSectionsDescription, ProjectSectionDescription, MacbookMockup, Link]
related_tokens: []
references: [specs/patterns/README.md, specs/molecules/ProjectOverview.md, specs/organisms/TopNav.md, specs/atoms/MacbookMockup.md, specs/atoms/Link.md]
prs: []
---

# 013 — Premier pattern : la page projet (étude de cas), avec une mesure avant/après

## Problème
La page projet est la seule composition de Brique Rouge dont la répétition est prouvée,
mais rien ne la décrit comme un tout : chaque fiche composant n'en voit qu'un morceau. Un
agent qui génère une page projet recompose donc la structure à chaque fois, avec la
liberté créative que la skill `ds-br-screen` lui donne quand aucun pattern ne s'applique.

L'ADR-006 fait de ce pattern le premier, et demande d'en mesurer la valeur avant de le
passer en `stable`.

## Ce qui existe déjà
- `ProjectOverview` : instance sur les cinq pages projet de la page Portfolio (Odaptos,
  BPCE, iBP, OPCO Atlas, Conseil constitutionnel), 20 instances au total
  (`specs/molecules/ProjectOverview.md`). La répartition des 20 instances par page n'est
  pas expliquée.
- `TopNav` : état « page projet » (prop `project`, bouton retour, sélecteur de projets)
  (`specs/organisms/TopNav.md`).
- `MacbookMockup` : sur les pages Odaptos et BPCE (instance `837:19547`).
- `Link` : instance sur la page iBP (cadre RETEX).
- `ProjectSectionsDescription` / `ProjectSectionDescription` : sections numérotées et
  cartes « citation » de la page Portfolio.
- Couleurs par projet : collection `project` et attribut `[data-project]` (ADR-002).
- Une page « Portfolio mobile » existe dans Figma (backlog 003).
- Aucun écran n'existe encore ; `ds-br-screen` et `/audit-screen` appliquent les patterns
  depuis l'ADR-006.

## Proposition
1. **Lire les cinq pages dans Figma**, desktop et mobile, avec la rigueur de l'étape 0
   (CLAUDE.md §7) : `get_metadata` sur chaque cadre de page, pas sur une seule. Relever
   les blocs dans l'ordre, le composant de chaque bloc, les espacements entre blocs
   (tokens) et ce qui varie d'une page à l'autre.
2. **Mesure « avant »**, tant que le pattern n'existe pas : générer la même page projet
   trois fois avec `ds-br-screen`, chacune dans une session neuve. Relever pour chaque
   génération l'ordre des `data-component`, le nombre de `data-ds-missing`, le score et
   les constats de `/audit-screen`. Les générations restent sur une branche d'expérience,
   jamais fusionnée.
3. **Écrire la fiche** `specs/patterns/page-projet.md` (`experimental`) d'après la lecture
   Figma, avec ses sections « Fixé » et « Libre » arbitrées par Damien, et la story
   `Patterns/PageProjet`.
4. **Mesure « après »** : les trois mêmes générations, avec le pattern. Comparer.
5. **Critère de réussite** (à valider) : l'ordre des `data-component` est identique dans
   les trois générations « après » et conforme à la section « Fixé », sans plus de
   constats `/audit-screen` qu'avant. Sinon, le pattern reste `experimental` et on
   cherche pourquoi.

L'agent qui mène la mesure « avant » ne doit avoir vu ni cette entrée, ni la lecture
Figma : un agent informé ne se comporte plus naïvement, la mesure ne vaudrait rien (même
constat que dans le backlog 010).

## Prérequis / questions ouvertes
- [ ] Ce qui est fixé et ce qui est libre sur une page projet : décision de design, à
      Damien (CLAUDE.md §15).
- [ ] Page à générer pour la mesure : une page existante (comparable à Figma) ou un projet
      fictif (plus proche d'un usage réel) ?
- [ ] Les 20 instances de `ProjectOverview` : variantes desktop et mobile, ou autres
      cadres ? À vérifier dans Figma.
- [ ] Trois générations par condition : minimum choisi pour le coût, pas un seuil
      statistique.

## Non couvert
- Les patterns génériques (formulaire, erreurs, état vide) : ils attendent les
  composants absents (ADR-006).
- Un contrôle de CI de la conformité d'un écran à un pattern (ADR-006, Conséquences).
