# Décisions d'architecture (ADR) — Brique Rouge

Un ADR (*Architecture Decision Record*) fige une décision transversale **et son
raisonnement** : le contexte, les options écartées, le choix, ses conséquences. Il
répond à la question « pourquoi c'est comme ça ? » quand plus personne ne s'en souvient.

## ADR, backlog et CLAUDE.md : qui porte quoi

| Document | Contenu | Évolue ? |
|---|---|---|
| `docs/backlog/` | Ce qui n'est **pas encore décidé** : écarts, risques, propositions | Oui (statut) |
| `docs/adr/` | Ce qui **a été décidé**, et pourquoi | Non, une fois accepté |
| `CLAUDE.md` | La **règle à appliquer**, courte, avec un lien vers l'ADR | Oui |

Cycle habituel : une entrée du backlog mûrit → Damien tranche → un ADR fige le
raisonnement → l'entrée passe à « Fait » et pointe vers l'ADR (« Lié à »). Les
« Conséquences » d'un ADR peuvent à leur tour créer des entrées de backlog.

## Quand écrire un ADR

Quand une décision validée par Damien :
- fixe une convention transversale (nommage, collections, grammaire de tokens) ;
- ajoute ou retire un outil, une dépendance, un contrôle de CI ;
- supprime ou renomme une famille de tokens ou de composants ;
- serait coûteuse à rouvrir sans en connaître le pourquoi.

Une correction de documentation ou un choix local à un composant n'en demande pas.
L'ADR est écrit **dans la même PR** que la mise en œuvre.

## Format

Un fichier par ADR : `NNN-titre-court.md` (numéro sur 3 chiffres, jamais réutilisé).
L'en-tête YAML est lisible par une machine (futur indexeur, voir la conversation RAG du
17 avril et la passe 04 du schéma metadata) :

```markdown
---
id: ADR-NNN
title: Titre de la décision
status: proposed | accepted | deprecated | superseded
date: AAAA-MM-JJ            # date de la décision
deciders: [Damien]
supersedes: []              # ADR remplacés
superseded_by: null         # ADR qui le remplace
related_components: []      # noms React
related_tokens: []          # préfixes de tokens Figma
backlog: []                 # entrées liées (001, 003…)
prs: []                     # numéros de PR de mise en œuvre
tags: []
---

# ADR-NNN — Titre

## Contexte
## Options considérées
## Décision
## Conséquences
## Sources
```

Un ADR accepté ne se réécrit pas : on corrige une coquille ou on ajoute un lien, mais
un changement de décision passe par un nouvel ADR (`supersedes` / `superseded_by`).
Le suivi d'avancement (lots, PR) vit dans les PR et le backlog, pas dans l'ADR.

## Index

| # | Titre | Statut | Date |
|---|---|---|---|
| 001 | [Vocabulaire des tokens de couleur de texte](001-vocabulaire-tokens-texte.md) | accepted | 2026-11-09 |
| 002 | [Collection `project` : aucun nom de client dans `semantic`](002-collection-project.md) | accepted | 2026-11-10 |
| 003 | [Contraste contrôlé en CI à deux niveaux](003-controle-contraste-ci.md) | accepted | 2026-11-10 |
