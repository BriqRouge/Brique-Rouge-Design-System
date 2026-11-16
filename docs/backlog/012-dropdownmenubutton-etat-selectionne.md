---
id: "012"
title: "DropdownMenuButton : l'état « sélectionné » (prop activated) n'a pas de design"
status: fait
created: 2026-11-16
origin: "Relevé le 2026-11-16 par le contrôle css-class-audit (ADR-005) : styles['is-activated'] appliqué mais défini dans aucun CSS"
adr: [ADR-005]
claude_md: ["6.1", "7", "15"]
related_components: [DropdownMenuButton, DropdownMenuTrigger, TopNav]
related_tokens: []
references: [specs/molecules/DropdownMenuButton.md, scripts/css-class-audit.mjs]
prs: [106, 107]
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
- [x] Feu vert de Damien le 2026-11-17 pour créer la variante Figma et le style ; version
      nommée enregistrée avant l'écriture (CLAUDE.md §6.6).
- [x] Figma : propriété `Selected` (défaut `false`) ; 12 variantes `Selected=true`, une par
      variante `Type=activated` (desktop et mobile), liées aux variables, sans valeur en dur.
- [x] Design fondé sur l'existant : projet = pastille projet du `TopNav`
      (`background/project/accent`, `text/project/on-accent`) ; neutre = `background/inverse`,
      `text/inverse`. Inchangé au survol, distinct du survol subtil des autres items.
- [x] Accessibilité : `aria-current="true"` (précisable en `"page"`) ; forme du fond
      ≥ 6:1 contre le menu (WCAG 1.4.11).
- [x] Contraste : 4 paires ajoutées à `contrast-pairs.config.js` (texte ≥ 4,58:1, iBP au
      plus juste ; forme ≥ 6,03:1).
- [x] `KNOWN_ISSUES` de `css-class-audit` vidé.
- [ ] Empreinte Figma du composant (`node scripts/figma-sync-ds.mjs update --only
      DropdownMenuButton`) : demande `FIGMA_TOKEN`, absent de la session qui a fait le
      changement. À lancer en local, sinon la détection nocturne ouvrira l'issue « Drift Figma ».
- [ ] Renommer la prop (`selected` ?) pour lever l'ambiguïté avec Figma relève de §6.7 :
      à décider séparément, rien ne l'impose aujourd'hui.

## Non couvert
Le comportement du menu (fermeture, navigation clavier), déjà traité par `DropdownMenuTrigger`.
