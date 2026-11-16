---
id: "007"
title: "Tailles de texte : px émis par le build, rem recommandé par les patterns"
status: a-explorer
created: 2026-11-16
origin: "Relevé le 2026-11-16 en vérifiant la chaîne de la skill ds-br-screen avant un test de génération d'écrans"
adr: []
claude_md: ["5", "17"]
related_components: []
related_tokens: [typography/font-size, typography/line-height]
references: [specs/patterns/typography.md, packages/tokens/style-dictionary.config.js]
prs: []
---

# 007 — Tailles de texte : px émis par le build, `rem` recommandé par les patterns

## Problème
`specs/patterns/typography.md` demandait « `rem` pour les tailles de texte — respecte les
préférences du navigateur », alors que le build émet les tailles en px
(`--typography-font-size-base: 16px`) et que CLAUDE.md §17 interdit toute valeur hors
token. Les deux règles ne pouvaient pas être suivies ensemble : un agent devait choisir
entre une taille en `rem` écrite à la main et le token en px.

La consigne `rem` a été retirée du pattern par la PR `fix/skill-ds-br-screen`, qui
renvoie ici : la question de fond reste ouverte.

## Ce qui existe déjà
- Transformer `number/px-or-opacity` (`packages/tokens/style-dictionary.config.js`) :
  les nombres sortent en px.
- Précédent de conversion d'unité dans le build : le breakpoint, saisi en px dans Figma,
  est converti en em (÷ 16) (CLAUDE.md §5).
- Les interlignes sont aussi en px (`--typography-line-height-x6: 24px`).
- Le zoom du navigateur agrandit les tailles en px (WCAG 1.4.4 reste atteignable). En
  revanche, une taille en px ne suit pas la taille de police par défaut réglée par
  l'utilisateur dans son navigateur.

## Proposition
- **A — Statu quo** : px partout, la règle actuelle du pattern suffit.
- **B — Conversion dans le build** : tailles de texte en `rem` (÷ 16), sur le modèle du
  breakpoint. Rendu identique à 16px par défaut ; le texte suit alors le réglage de
  l'utilisateur. Figma reste en px.

## Prérequis / questions ouvertes
- [ ] Choix A ou B (Damien). B est une convention transversale : ADR dans la même PR.
- [ ] Si B : convertir aussi les interlignes, sinon un texte agrandi garde un interligne
      fixe et les lignes se chevauchent.
- [ ] Si B : vérifier les composants qui calculent des dimensions à partir d'une taille de
      texte (rognage `text-box-trim`, cercles de `Button` icône seule).

## Non couvert
Les espacements et dimensions (`spacing`, `sizing`), qui restent en px dans les deux options.
