# Backlog de consolidation — Brique Rouge

Chantiers identifiés pour rendre l'AI-Ready Design System Brique Rouge plus
**consistant**, **cohérent** et **déterministe**. Ce n'est pas une roadmap produit :
on y consigne les écarts, risques et améliorations repérés en cours de route, pour
les traiter au bon moment plutôt qu'en dehors du périmètre d'une tâche.

## Format d'une entrée

Un fichier par entrée : `NNN-titre-court.md` (numéro sur 3 chiffres, jamais réutilisé).

```markdown
# NNN — Titre

**Statut :** À explorer · Prêt · En cours · Fait · Abandonné
**Origine :** contexte et date
**Lié à :** règles CLAUDE.md, passes du schéma metadata, fichiers concernés

## Problème
## Ce qui existe déjà
## Proposition
## Prérequis / questions ouvertes
## Non couvert
```

« Ce qui existe déjà » est obligatoire : on vérifie le repo avant de proposer.
Une entrée qui débouche sur une décision transversale renvoie à son ADR (`docs/adr/`) dans
« Lié à » : le raisonnement vit dans l'ADR, l'entrée passe à « Fait ».
Une entrée abandonnée reste dans le dossier avec sa raison.

## Index

| # | Titre | Statut |
|---|---|---|
| 001 | [Contrôle des breaking changes sur les tokens](001-breaking-changes-tokens.md) | À explorer |
| 002 | [Nomenclature des tokens incohérente dans CLAUDE.md](002-nomenclature-tokens-claude-md.md) | Prêt |
| 003 | [`background/project-page/<client>` : des noms de clients dans `semantic`](003-project-page-noms-clients.md) | Prêt |
| 004 | [Aligner les tokens d'icône et de bordure sur l'échelle du texte](004-tokens-icone-bordure.md) | À explorer |
| 005 | [Tokens créés pour la page Accueil, sans usage depuis sa suppression](005-tokens-sans-usage-accueil.md) | À explorer |
