---
id: ADR-005
title: "Classes CSS Modules : éléments en camelCase, modificateurs en kebab-case préfixé, contrôlé en CI"
status: accepted
date: 2026-11-16
deciders: [Damien]
supersedes: []
superseded_by: null
related_components: [Button, MenuButton, ProjectBentoCard, MetaInfoItem, DropdownMenuButton]
related_tokens: []
backlog: ["008", "012"]
prs: [106]
tags: [conventions, css-modules, ci, gouvernance]
---

# ADR-005 — Classes CSS Modules : éléments en camelCase, modificateurs en kebab-case préfixé, contrôlé en CI

## Contexte

CLAUDE.md §8 demandait « kebab-case avec préfixe sémantique » ; la skill `ds-br-screen`
et `/polish-screen` demandaient « camelCase ». Un agent qui génère un écran recevait deux
règles incompatibles (backlog [008](../backlog/008-nommage-classes-css-modules.md)).

Inventaire du 2026-11-16 (`packages/react/src/components`, sélecteurs composés compris) :
127 classes distinctes.
- Les **27 en kebab-case** sont toutes des modificateurs à préfixe : `variant-`, `size-`,
  `theme-`, `mode-`, `color-scheme-`, `company-`, `is-`, `has-`.
- Les **52 en camelCase** sont presque toutes des éléments (`titleBlock`, `hoverIcon`).
- Les modificateurs, repérés à la façon dont le TSX les applique (sous condition), étaient
  tous en kebab-case sauf **4 booléens** : `iconOnly` (Button, MenuButton),
  `expandOnHover` et `hasHoverVisual` (ProjectBentoCard), `hasHoverIcon` (MetaInfoItem).
- `styles['is-activated']` (DropdownMenuButton) était appliqué sans être défini : une
  classe absente vaut `undefined`, sans erreur ni au build ni aux tests.

La règle écrite avait donc déjà dérivé : une convention documentée seule ne tient pas.

## Options considérées

1. **Règle seule, exceptions acceptées** : aucun code touché, mais les exceptions restent
   des précédents, dans les atomes les plus recopiés (`Button`) ; un contrôle futur devrait
   garder une liste d'exceptions à vie.
2. **Règle et renommage** : cohérent aujourd'hui, rien n'empêche une nouvelle dérive.
3. **Règle, renommage et contrôle en CI** : la seule qui tient dans le temps.

## Décision

Option 3.

- **Élément** : camelCase (`titleBlock`). C'est la forme naturelle d'un accès direct
  `styles.titleBlock`.
- **Modificateur** — variante, taille, état, toute classe appliquée sous condition :
  kebab-case avec un préfixe de la liste fermée `variant-`, `size-`, `theme-`, `mode-`,
  `color-scheme-`, `company-`, `is-`, `has-`. Les modificateurs de valeur sont construits
  depuis les props (``styles[`variant-${variant}`]``) et les valeurs de props sont en
  kebab-case par convention Figma (CLAUDE.md §7) : le kebab-case est imposé par les
  données. Les modificateurs booléens suivent la même forme (`is-…`, `has-…`).
- **Renommage** des 4 exceptions : `is-icon-only`, `is-expand-on-hover`,
  `has-hover-visual`, `has-hover-icon`. Classes internes : le package est publié en source
  et chaque consommateur hache les noms, aucun test ne les référence (vérifié). Rendu
  inchangé, vérifié par mesure (3 733 empreintes `getComputedStyle`, au repos et au
  survol, sur 26 stories : 0 différence).
- **`is-activated`** : la référence est gardée et recevra un style (décision de Damien).
  Figma n'a aucune variante « sélectionné » (18 variantes : `Company` × `State` × `Type` ×
  `Viewport`, vérifié le 2026-11-16) : le style attend le design, écart connu déclaré dans
  le contrôle (backlog [012](../backlog/012-dropdownmenubutton-etat-selectionne.md)).
- **Contrôle** : `scripts/css-class-audit.mjs`, job Lint, sans dépendance, testé par
  `scripts/css-class-audit.test.mjs`. Il vérifie le format de chaque classe, qu'une
  classe appliquée sous condition est un modificateur, qu'un préfixe de gabarit est dans
  la liste, et que toute classe référencée dans le TSX existe. Portée :
  `packages/react/src/components` et `packages/storybook/src/stories/screens`.
- **Écarts connus** : liste `KNOWN_ISSUES` du script, chacun avec sa raison et son entrée
  de backlog ; signalés à chaque exécution sans faire échouer la CI, sur le modèle des
  `knownIssues` du contrôle de contraste. Une entrée qui ne correspond plus à rien fait
  échouer le contrôle.

Stylelint (`selector-class-pattern`) a été écarté : nouvelle dépendance, et il ne voit pas
le TSX, donc ni les modificateurs appliqués sous condition ni les classes non définies.

## Conséquences

- CLAUDE.md §8, la skill `ds-br-screen`, `/audit-screen` et `/polish-screen` portent la
  même règle et renvoient à cet ADR.
- Ajouter une famille de modificateurs = ajouter son préfixe à `MODIFIER_PREFIXES`, dans
  une PR qui le justifie.
- Limite : un modificateur est reconnu à la façon dont le TSX l'applique (ternaire, `&&`,
  gabarit). Un modificateur appliqué autrement échappe à cette partie du contrôle.
- Les stories de contenu illustratif (`packages/storybook/src/stories/components/*.module.css`)
  restent hors contrôle.

## Sources

- Backlog [008](../backlog/008-nommage-classes-css-modules.md) et
  [012](../backlog/012-dropdownmenubutton-etat-selectionne.md) ; CLAUDE.md §6.2, §6.7,
  §7, §8.
- Figma `NZtxQVYKRqeaGcC7hT5pjw`, set `DropdownMenuButton` (`370:19497`), lu le 2026-11-16.
- `packages/tokens/contrast-pairs.config.js` (`knownIssues`), `scripts/check-specs.mjs`
  (structure du script).
