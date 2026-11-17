---
id: "009"
title: Contrôler en CI que les variables CSS citées dans specs/ et les skills existent
status: a-explorer
created: 2026-11-16
origin: "Le 2026-11-16, 36 références à des tokens inexistants ont été trouvées dans la chaîne de la skill ds-br-screen (specs/guidelines/, SKILL.md, commandes) ; aucun contrôle ne les avait signalées"
adr: []
claude_md: ["6.6", "17", "19"]
related_components: []
related_tokens: []
references: [specs/guidelines/, .claude/skills/, scripts/check-specs.mjs, scripts/token-audit.mjs]
prs: []
---

# 009 — Contrôler en CI que les variables CSS citées dans `specs/` et les skills existent

## Problème
Les guidelines (alors dans `specs/patterns/`, voir ADR-006) et les skills que lisent les agents citaient des tokens qui n'existent pas
(syntaxe à slash `--color/background/button/idle`, noms du template de départ). Une
`var()` vers un token absent n'échoue pas : la propriété se comporte comme `unset`. Un
agent qui recopie l'exemple produit un écran faux sans aucune erreur, ni au build ni en CI.
Corrigé à la main par la PR `fix/skill-ds-br-screen` ; rien n'empêche que ça se reproduise.

## Ce qui existe déjà
- `scripts/check-specs.mjs` : cohérence composants React ↔ en-têtes YAML des fiches,
  sans regard sur les tokens cités.
- `scripts/token-audit.mjs` : couleurs hexadécimales en dur dans les CSS Modules.
- `/sync-tokens` : bloque la suppression d'une variable encore utilisée **dans le code**
  (code de sortie 2), pas dans la documentation.
- Vérification ponctuelle du 2026-11-16 (script hors repo) sur `specs/`, `COMPONENTS.md`,
  `CLAUDE.md` et `.claude/skills/` : hors chaîne `ds-br-screen`, aucune vraie anomalie ;
  les seuls faux positifs sont des options de ligne de commande (`--only`, `--test`), la
  notation `{info,warning,…}` et les mentions volontaires de tokens supprimés.

## Proposition
Un script dans le job Lint, après le build des tokens : extraire les `var(--…)` (et les
noms entre backticks) des fichiers Markdown de `specs/` et `.claude/skills/`, les comparer
aux variables de `packages/tokens/build/css/`, échouer sur toute référence absente.
Exceptions explicites (tokens supprimés cités volontairement) par un marqueur, sur le
modèle de `/* token-audit-ignore */`.

## Prérequis / questions ouvertes
- [ ] Nouveau contrôle de CI : décision de Damien et ADR (CLAUDE.md §6.8).
- [ ] Portée : `var(--…)` seulement (aucun faux positif constaté) ou aussi les noms entre
      backticks (couvre les tableaux, demande les exceptions ci-dessus) ?
- [ ] Couvrir aussi les CSS Modules des composants et des écrans (`var()` vers un token
      supprimé) ?

## Non couvert
Les noms de variables Figma (`color/text/primary`) et de styles de texte (`body/md`), qui
ne sont pas des variables CSS.
