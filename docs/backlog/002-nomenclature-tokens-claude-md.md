# 002 — Nomenclature des tokens incohérente dans CLAUDE.md

**Statut :** Prêt
**Origine :** relevé le 2026-11-11 en préparant la règle §6.7
**Lié à :** CLAUDE.md §5 (Nomenclature) et §13 (Décisions techniques)

## Problème
CLAUDE.md se contredit sur la nomenclature des tokens :
- §5 indique une échelle `spacing.01`, `spacing.02`…
- §13 indique le préfixe x (`x10`, `x12`…), aligné sur Figma.

Un agent qui lit §5 peut produire des noms qui n'existent pas. C'est exactement le type
d'ambiguïté qui rend le comportement des agents non déterministe.

## Ce qui existe déjà
`packages/tokens/tokens.json` et les Figma Variables utilisent le préfixe x
(`spacing/x1` = 4, `spacing/x22` = 88, `spacing/x24` = 96…). §13 décrit donc l'état réel.

## Proposition
Corriger §5 pour qu'il décrive le préfixe x, avec la règle de nommage :
`x<n>` = n × 4 px, décimale avec tiret (`x3-5` = 14 px).

## Prérequis / questions ouvertes
- [ ] Validation de Damien (modification d'une section de référence de CLAUDE.md)
