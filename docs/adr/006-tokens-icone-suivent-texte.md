---
id: ADR-006
title: "Les tokens d'icône prennent la valeur du texte de leur état"
status: accepted
date: 2026-11-27
deciders: [Damien]
supersedes: []
superseded_by: null
related_components: [Button, MenuButton, Badge, Tag, DropdownMenuTrigger, TopNav]
related_tokens: [color/icon/button, color/icon/menu-button]
backlog: ["004"]
prs: [110]
tags: [tokens, couleur, icônes, figma]
---

# ADR-006 — Les tokens d'icône prennent la valeur du texte de leur état

## Contexte

Dans le code, les icônes de Button et de MenuButton sont dessinées en SVG avec
`currentColor` : elles prennent la couleur du texte du bouton. Dans Figma, elles sont liées
à des tokens `icon/*` distincts, qui pointaient vers d'autres primitives que le texte.

Le /sync-ds du 2026-11-27 a relevé l'écart qui en résulte, déjà noté au lot 5 de l'ADR-001
(PR #95) et dans l'entrée [004](../backlog/004-tokens-icone-bordure.md) du backlog :

| Token d'icône | Avant | Texte du même état |
|---|---|---|
| `icon/button/secondary` | `neutral/800` `#262626` | `text/button/secondary/idle` `#171717` |
| `icon/button/tertiary` | `neutral/800` `#262626` | `text/button/tertiary/idle` `#171717` |
| `icon/button/tertiary-hover` | `neutral/700` `#404040` | `text/button/tertiary/hover` `#525252` |
| `icon/button/tertiary-focus` | `deep-sea/500` `#567be9` | `text/button/tertiary/focus` `#3453dc` |
| `icon/menu-button/contained` | `neutral/500` `#737373` | `text/menu-button/contained/idle` `#525252` |
| `icon/menu-button/outline-white` | `neutral/100` `#f5f5f5` | `text/menu-button/outlined-dark/idle` `#fafafa` |

L'écart du MenuButton contained venait de la PR #100 : le texte a été foncé pour atteindre
4,5:1, l'icône non.

## Options considérées

- **A — Le code lit les tokens d'icône** : une règle de couleur par état et par variante
  sur les icônes. Garde des icônes plus claires que le texte, au prix d'environ 12 règles CSS
  et d'un écart qui réapparaît à chaque changement de texte.
- **B — Les tokens d'icône prennent la valeur du texte, dans Figma** : aucun changement de
  code (`currentColor` reste juste), une seule intention par état.

## Décision

**Option B**, choisie par Damien le 2026-11-27. Dans Figma, chaque token d'icône ci-dessus
pointe vers le **token global** utilisé par le texte de son état (règle 2 de l'ADR-001) :

| Token d'icône | Pointe vers | Valeur |
|---|---|---|
| `icon/button/secondary` | `color/text/primary` | `#171717` |
| `icon/button/tertiary` | `color/text/primary` | `#171717` |
| `icon/button/tertiary-hover` | `color/text/secondary` | `#525252` |
| `icon/button/tertiary-focus` | `color/text/accent` | `#3453dc` |
| `icon/menu-button/contained` | `color/text/secondary` | `#525252` |
| `icon/menu-button/outline-white` | `color/text/inverse` | `#fafafa` |

Règle pour la suite : **une icône a la même couleur que le texte de son état**. Si un texte
change de couleur, le token d'icône du même état change avec lui. Un token d'icône qui doit
différer du texte est une exception à justifier.

## Conséquences

- Les noms des tokens et leurs liaisons dans Figma ne changent pas : seule leur cible change
  (aucune référence cassée, CLAUDE.md §6.7).
- Inventaire Figma avant modification (5 pages, instances comprises) : 193 liaisons, toutes
  sur des icônes, sauf une. Le contour du Button primary info en focus était lié à `icon/button/tertiary-focus` :
  il est relié à `color/button/focus`, sa couleur ne change pas (`#567be9`).
- Icônes un peu plus foncées : Button secondary et tertiary neutres, MenuButton, Tag et
  Badge contained (`--color-icon-button-secondary`), DropdownMenuTrigger, TopNav, et les
  composants Figma `Icons/Animated` et `Tooltip_Animation`.
- Le code ne change pas pour Button et MenuButton (`currentColor`). Tag et Badge lisent
  `--color-icon-button-secondary`, qui passe de `#262626` à `#171717`.
- Non couvert : la famille `border/*` (ex. `border/button/secondary` `#262626` contre un texte
  `#171717`), les tokens d'icône sans équivalent texte (`icon/notification/*`) et la création
  d'une échelle globale `icon/*`. Ces points restent dans l'entrée 004 du backlog.

## Sources

- Rapport /sync-ds du 2026-11-27 (description de la PR de mise en œuvre)
- [ADR-001](001-vocabulaire-tokens-texte.md), règle 2
- Backlog [004](../backlog/004-tokens-icone-bordure.md)
