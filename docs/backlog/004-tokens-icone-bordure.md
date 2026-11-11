# 004 — Aligner les tokens d'icône et de bordure sur l'échelle du texte

**Statut :** À explorer
**Origine :** audit de suivi de l'ADR-001, 2026-11-10
**Lié à :** [ADR-001](../adr/001-vocabulaire-tokens-texte.md) (règles 1 à 3, écrites pour
le texte seulement) · CLAUDE.md §6.6 · `packages/tokens/contrast-pairs.config.js`

## Problème
L'ADR-001 a rangé les tokens de **texte** : échelle globale par rang, tokens de composant
qui pointent vers un token global. Les familles `icon/*` et `border/*` n'ont pas suivi :
- chaque token pointe directement vers une primitive (règle 2 non appliquée) ;
- une même intention a des valeurs différentes selon la famille ;
- des composants empruntent les tokens d'un autre composant.

## Ce qui existe déjà
Vérifié le 2026-11-10 dans Figma et dans le code :
- **Aucun token global d'icône.** Les 20 tokens `icon/*` (12 `button`, 4 `menu-button`,
  4 `notification`) sont des tokens de composant
  (`icon/button/*`, `icon/menu-button/*`, `icon/notification/*`), tous aliasés sur une
  primitive.
- **Bordures** : 3 tokens globaux existent (`border/default`, `border/subtle`,
  `border/focus`) ; les autres (`border/button/*`, `border/menu-button/*`,
  `border/bento-cards/*`, `border/notification/*`) pointent vers des primitives.
- **Incohérence visible** : dans Button secondary, le texte est `#171717`
  (`text/primary`) mais l'icône et la bordure sont `#262626` (`neutral/800`).
- **Emprunts entre composants** : `Tag.module.css` et `Badge.module.css` colorent leur
  icône avec `--color-icon-button-secondary`, un token de Button.
- **Primitive dans le CSS d'un composant** : `Badge.module.css` (`.variant-contained`)
  utilise `--color-neutral-100` comme fond.
- **Tokens sans usage dans le code** : les 4 `icon/menu-button/*` (0 occurrence de
  `--color-icon-menu-button-*` dans les CSS Modules).
- Le contrôle de contraste couvre déjà les icônes et bordures déclarées (`kind: 'ui'`,
  3:1) — ADR-003.

## Proposition
Appliquer les règles 1 à 3 de l'ADR-001 aux icônes et aux bordures, dans un ADR dédié :
- échelles globales `icon/*` et `border/*` par rang (même vocabulaire que le texte) ;
- tokens de composant aliasés sur ces globaux ;
- trancher le rôle des tokens d'icône : soit l'icône suit le texte (`currentColor`, et on
  retire les tokens d'icône redondants), soit elle garde ses tokens (cas où elle doit
  différer du texte).

## Prérequis / questions ouvertes
- [ ] Décision de design : l'icône et la bordure de Button secondary doivent-elles être
      `#171717` comme le texte, ou `#262626` est-il voulu ?
- [ ] `currentColor` par défaut pour les icônes, ou tokens dédiés ?
- [ ] Tag et Badge : leur propre token d'icône, ou un token global ?
- [ ] Inventaire complet des liaisons Figma avant tout renommage (§6.7).

## Non couvert
Les fonds de composant (`button/*`, `menu-button/*`) : même problème probable, à
inventorier séparément.
