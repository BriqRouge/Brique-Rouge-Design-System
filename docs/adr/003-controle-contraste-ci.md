---
id: ADR-003
title: Contraste contrôlé en CI à deux niveaux
status: accepted
date: 2026-11-10
deciders: [Damien]
supersedes: []
superseded_by: null
related_components: []
related_tokens: [color]
backlog: []
prs: [99, 100, 101]
tags: [accessibilite, contraste, wcag, ci, gouvernance]
---

# ADR-003 — Contraste contrôlé en CI à deux niveaux

## Contexte

L'accessibilité WCAG 2.1 AA est une règle absolue du DS (CLAUDE.md §6.3). Jusqu'en
novembre 2026, le contraste n'était vérifié qu'à la main. L'audit de l'ADR-001 a trouvé 7
textes sous le seuil.

Les tests `jest-axe` ne protègent pas : ils tournent sous jsdom, qui ne calcule pas les
styles. Démonstration du 10 novembre : un texte à 1,47:1 passe `jest-axe` sans violation
ni résultat « incomplete », alors qu'axe-core dans Chromium le signale
(`color-contrast : 1.47:1`).

## Options considérées

1. **Vérification manuelle** (add-on a11y de Storybook) : utile en développement, mais ni
   systématique ni bloquante.
2. **Paires de tokens déclarées** (inspiré du contrôle en CI de Primer) : rapide, sans navigateur, couvre les
   états `:hover` / `:focus` et chaque mode `project`. Ne voit pas une combinaison que
   personne n'a déclarée.
3. **Rendu réel dans un navigateur** (axe-core sur chaque story) : voit ce qui s'affiche
   vraiment, y compris les combinaisons non déclarées. Ne voit que l'état au chargement et
   ajoute un navigateur à la CI.
4. **Les deux** : chacune couvre l'angle mort de l'autre.

## Décision

Option 4.

- **`scripts/contrast-audit.mjs`** (job Lint) calcule le ratio WCAG 2.x de chaque paire de
  `packages/tokens/contrast-pairs.config.js` : 4,5:1 pour le texte, 3:1 pour les bordures
  et icônes, dans chaque mode `project`. Un écart accepté va dans `knownIssues` avec sa
  raison ; tout autre écart fait échouer la CI.
- **`scripts/rendered-contrast-audit.mjs`** (job Test) construit Storybook, ouvre chaque
  story dans Chromium (Playwright) et lance la règle axe-core `color-contrast`. Une
  violation fait échouer la CI ; un résultat « incomplete » (fond indéterminable) est
  signalé sans échec.
- **Fond sombre de référence** des variantes « sur fond foncé » : `background/inverse`
  (validé le 10 novembre).
- **Règle de PR** : toute nouvelle combinaison texte/fond d'un composant est déclarée
  dans `contrast-pairs.config.js` dans la même PR.

## Conséquences

- **Dépendances** ajoutées à la racine, validées : `playwright` 1.63.0 et `axe-core`
  4.11.1 (même version que celle de `@storybook/addon-a11y`).
- **Durée de CI** : environ 2 minutes de plus sur le job Test (113 s mesurées sur la PR
  #101).
- **Efficacité constatée** : le contrôle des paires a trouvé 4 écarts (corrigés, PR #100) ;
  le contrôle du rendu en a trouvé un que les paires ne voyaient pas, les libellés de
  DropdownMenuButton à 4,34:1 sur le fond du menu (corrigé, PR #101).
- **Angles morts restants** : les états `:hover` / `:focus` ne sont couverts que par les
  paires déclarées ; un texte posé sur une image ou un dégradé sort en « incomplete »
  (exemple : libellés Helvetica des visuels iBP, exception assumée) ; les maquettes Figma
  ne sont pas contrôlées.
- **Dette évitée** : `jest-axe` reste utile pour les autres règles (ARIA, rôles, noms
  accessibles), mais n'est plus présenté comme une garantie de contraste.

Mise en œuvre : PR #99 (paires), #100 (4 écarts corrigés), #101 (rendu).

## Sources

- [WCAG 2.1 — 1.4.3 Contraste (minimum)](https://www.w3.org/TR/WCAG21/#contrast-minimum) et [1.4.11 Contraste du contenu non textuel](https://www.w3.org/TR/WCAG21/#non-text-contrast).
- axe-core 4.11.1, règle `color-contrast` (paquet installé dans le repo).
- [GitHub Blog — Unlocking inclusive design: how Primer's color system is making GitHub.com more inclusive](https://github.blog/engineering/unlocking-inclusive-design-how-primers-color-system-is-making-github-com-more-inclusive/) : contrôle de contraste des tokens exécuté en CI sur chaque PR.
- `scripts/contrast-audit.mjs`, `scripts/rendered-contrast-audit.mjs`, `.github/workflows/ci.yml`.
