# 001 — Contrôle des breaking changes sur les tokens

**Statut :** À explorer
**Origine :** discussion du 2026-11-11, ajout de `spacing/x22` et `spacing/x24` —
la variable `spacing/x32`, mal ordonnée, n'a pas été recréée pour ne pas casser ses liaisons
**Lié à :** CLAUDE.md §6.7 (niveau 1 de cette règle) · Passe 04 du schéma metadata
(Gouvernance) · Passe 03 (`qualityGates.onBreach`)

## Problème
Supprimer ou renommer un token est un breaking change pour tout consommateur du DS.
La règle §6.7 n'encadre que les agents ; rien ne qualifie aujourd'hui un changement de
tokens comme cassant ou non, ni ne gère une dépréciation dans le temps.

## Ce qui existe déjà
- `tokens.json` (DTCG) est généré depuis Figma et versionné : `/sync-tokens` →
  `scripts/figma-sync-tokens.mjs`.
- Ce script détecte déjà les variables CSS supprimées encore utilisées dans le code
  (code de sortie `2`) et refuse les renommages. Le contrôle existe donc **au moment de
  la synchro**, piloté par un agent ou un humain.
- `figma-drift.yml` détecte la nuit les écarts de composants, pas les Variables
  (API REST Enterprise requise).
- Aucun versioning sémantique : tous les packages sont en `0.0.0`, pas de changesets.

## Proposition
Transformer la détection ponctuelle en contrôle de PR :
- comparer `tokens.json` entre la branche et `main` en CI ;
- token supprimé ou renommé → breaking change (semver major une fois le versioning en place) ;
- token marqué `DEPRECATED` dans sa description → warning, avec date de retrait prévue.

Gradation, en réutilisant la grammaire `onBreach` de la passe 03 :
`log-only` → `warn` → `block-release` une fois le DS consommé par d'autres équipes.

## Prérequis / questions ouvertes
- [ ] Mettre en place un versioning des packages (changesets ?) — sans lui, « major » ne veut rien dire
- [ ] Faire remonter la description Figma (`DEPRECATED — …`) dans `tokens.json` (`$description` DTCG ?)
- [ ] Représenter un token ressort (mass / stiffness / damping, aujourd'hui 3 FLOAT séparés)

## Non couvert
Les suppressions manuelles dans Figma et les calques Figma dont la variable a disparu.
À étudier : audit périodique des liaisons orphelines via `use_figma`, ou plugin dédié.
