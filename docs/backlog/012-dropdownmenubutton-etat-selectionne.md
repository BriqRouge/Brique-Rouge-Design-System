---
id: "012"
title: "DropdownMenuButton : l'état « sélectionné » (prop activated) n'a pas de design"
status: a-explorer
created: 2026-11-16
origin: "Relevé le 2026-11-16 par le contrôle css-class-audit (ADR-005) : styles['is-activated'] appliqué mais défini dans aucun CSS"
adr: [ADR-005]
claude_md: ["6.1", "7", "15"]
related_components: [DropdownMenuButton, DropdownMenuTrigger, TopNav]
related_tokens: []
references: [specs/molecules/DropdownMenuButton.md, scripts/css-class-audit.mjs]
prs: []
---

# 012 — DropdownMenuButton : l'état « sélectionné » (prop `activated`) n'a pas de design

## Problème
La prop `activated` (« item sélectionné ») pose la classe `is-activated`, qui n'existe dans
aucun CSS : un item sélectionné est rendu exactement comme les autres. Damien a décidé de
garder la référence et de lui donner un style (2026-11-16), mais aucun design ne dit lequel.

## Ce qui existe déjà
- Figma, set `DropdownMenuButton` (`370:19497`), lu le 2026-11-16 : 18 variantes,
  `Company` × `State` (idle, hovered) × `Type` (activated, deactivated) × `Viewport`. Aucune
  variante « sélectionné ». Dans Figma, `Type=activated` signifie « disponible », pas
  « sélectionné » (piège déjà noté dans `specs/molecules/DropdownMenuButton.md`).
- Code : `data-activated` exposé et testé (attribut, axe) ; story `Activated`. Aucun
  organisme ne passe `activated` (ni `DropdownMenuTrigger`, ni `TopNav`).
- `scripts/css-class-audit.mjs` déclare `is-activated` en écart connu (`KNOWN_ISSUES`) : il
  le signale à chaque exécution et échouera dès qu'un style existera, pour qu'on retire
  l'entrée.

## Proposition
1. Damien dessine l'état dans Figma : une propriété dédiée (`Selected=true|false`, par
   exemple), distincte de `Type`, pour ne pas ajouter un troisième sens à « activated ».
2. `/sync-component DropdownMenuButton` l'implémente sur `.is-activated`, puis l'entrée de
   `KNOWN_ISSUES` est retirée.

## Prérequis / questions ouvertes
- [ ] Où l'état sert-il ? Probablement le projet courant dans le menu du `TopNav` : à
      confirmer, aucun usage dans le DS aujourd'hui.
- [ ] Accessibilité : un item « courant » s'annonce aussi aux lecteurs d'écran
      (`aria-current`), pas seulement par le style (WCAG 1.3.1, 1.4.1).
- [ ] Contraste : la nouvelle combinaison texte/fond s'ajoute à
      `packages/tokens/contrast-pairs.config.js` dans la même PR (CLAUDE.md §6.6).
- [ ] Renommer la prop (`selected` ?) pour lever l'ambiguïté avec Figma relève de §6.7 :
      à décider séparément.

## Non couvert
Le comportement du menu (fermeture, navigation clavier), déjà traité par `DropdownMenuTrigger`.
