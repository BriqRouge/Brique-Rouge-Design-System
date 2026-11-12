---
id: "006"
title: Fiabiliser l'installation de Chromium en CI
status: pret
created: 2026-11-12
origin: "Le 2026-11-11, le job Test de la PR #103 a échoué deux fois : l'installation des dépendances système de Chromium n'a pas pu joindre les miroirs Ubuntu"
adr: [ADR-003]
claude_md: ["6.6", "16"]
related_components: []
related_tokens: []
references: [.github/workflows/ci.yml, scripts/rendered-contrast-audit.mjs]
prs: [101, 103]
---

# 006 — Fiabiliser l'installation de Chromium en CI

## Problème
Le contrôle du contraste rendu (ADR-003) dépend de serveurs externes à chaque exécution.
Quand ils sont injoignables, le job Test échoue avant même de contrôler quoi que ce soit,
et **toute** PR est bloquée (les 2 status checks sont obligatoires, CLAUDE.md §16), y
compris une PR de documentation.

## Ce qui existe déjà
- Job Test, étape « Contraste rendu dans Chromium » (`.github/workflows/ci.yml`) :
  `pnpm exec playwright install --with-deps chromium`, puis build Storybook, puis
  `node scripts/rendered-contrast-audit.mjs`.
- `--with-deps` lance `apt-get` pour installer les bibliothèques système de Chromium.
- Incident du 2026-11-11, PR #103 (documentation seule) :
  - tentatives 1 (14:06 UTC) et 2 (14:17 UTC) : échec,
    `Temporary failure resolving 'azure.archive.ubuntu.com'`, puis
    `Failed to install browsers — exit code 100` après ~10 minutes de nouvelles tentatives
    d'apt ;
  - tentative 3 (23:12 UTC) : succès, job complet en 2 min 16 s.
- Le navigateur lui-même (téléchargé depuis le CDN de Playwright) n'est pas en cache :
  il est retéléchargé à chaque exécution.

## Proposition
Par ordre de coût croissant :
1. **Retirer `--with-deps`** : les images `ubuntu-latest` de GitHub incluent un
   navigateur Chrome et, a priori, ses bibliothèques. Non vérifié : la CI de la PR le
   confirmera ou non.
2. **Mettre `~/.cache/ms-playwright` en cache** (`actions/cache`, clé = version de
   `playwright` dans `pnpm-lock.yaml`) : supprime le téléchargement du navigateur.
3. **Si 1 ne suffit pas** : exécuter le job dans l'image officielle de Playwright, qui
   contient déjà le navigateur et ses dépendances (même version que `playwright` 1.63.0).
   Change l'environnement de tout le job Test.

## Prérequis / questions ouvertes
- [ ] Vérifier sur une PR que Chromium se lance sans `--with-deps` sur `ubuntu-latest`.
- [ ] Faut-il isoler le contrôle de contraste rendu dans un job séparé, pour qu'un
      incident d'infrastructure ne masque pas le résultat des tests unitaires ?
      (Implique d'ajouter ce job aux status checks obligatoires de `main`.)

## Non couvert
La disponibilité de npm et du CDN de Playwright eux-mêmes : une panne de npm bloque
déjà `pnpm install`, quel que soit ce contrôle.
