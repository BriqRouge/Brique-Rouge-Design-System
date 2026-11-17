---
id: "011"
title: Écarts mineurs relevés dans la chaîne de génération d'écrans
status: a-explorer
created: 2026-11-16
origin: "Relevé le 2026-11-16 en vérifiant la chaîne de la skill ds-br-screen ; hors du périmètre de la PR fix/skill-ds-br-screen"
adr: []
claude_md: ["6.6", "11", "18"]
related_components: [ProjectSectionsDescription]
related_tokens: [motion/easing/dismiss]
references: [CLAUDE.md, package.json, Makefile, specs/organisms/ProjectSectionsDescription.md, specs/patterns/motion-design.md]
prs: []
---

# 011 — Écarts mineurs relevés dans la chaîne de génération d'écrans

## Problème
Petits écarts, chacun sans gravité, regroupés pour ne pas les perdre :

1. **CLAUDE.md §18, étape 4** : « La génération de maquettes Figma nécessite un outil
   d'écriture MCP local (ex. figma-use) — à configurer ultérieurement ». Or §6.6 et §19
   encadrent déjà le travail direct dans Figma via `use_figma`. L'étape 4 paraît périmée.
2. **Story d'un écran** : CLAUDE.md §11 impose `layout: 'centered'` par défaut et ne liste
   pas `screens/` dans la structure des stories ; un écran complet demande probablement
   `layout: 'fullscreen'`. Ni §11, ni §18, ni la skill ne le précisent.
3. **Nom du package racine** : `package.json` s'appelle encore `design-system-starter`, et
   l'en-tête du `Makefile` « Design System Starter ». Les mentions du README et de
   `Bienvenue.mdx` créditent le template de Romain Richard : légitimes, à garder.
   Renommer le package relève de CLAUDE.md §6.7 (vérifier les usages d'abord).
4. **`specs/organisms/ProjectSectionsDescription.md`, ligne 73** : cite `var(--spacing/x10, 40px)`
   comme code syntax Figma. Si la variable Figma porte encore cette code syntax, elle
   contredit la convention « code syntax WEB = nom de la variable CSS générée » (CLAUDE.md
   §7). Non vérifié : demande un `node scripts/figma-sync-ds.mjs lint` avec `FIGMA_TOKEN`.
5. **`--motion-easing-dismiss`** : défini, utilisé par aucun composant. La PR
   `fix/skill-ds-br-screen` l'indique pour « contenu qui sort » dans
   `specs/patterns/motion-design.md`, en se fondant sur son nom : à confirmer.

## Ce qui existe déjà
Voir chaque point ci-dessus.

## Proposition
Traiter chaque point séparément, au fil de l'eau : 1 et 2 dans CLAUDE.md (et la skill pour
2), 3 après vérification des usages, 4 par le lint Figma, 5 par une confirmation de Damien.

## Prérequis / questions ouvertes
- [ ] 1 : l'étape 4 est-elle à réécrire autour de `use_figma` ?
- [ ] 2 : `layout: 'fullscreen'` pour les stories `Screens/*` ?
- [ ] 5 : `dismiss` est-il bien la courbe des sorties ?

## Non couvert
—
