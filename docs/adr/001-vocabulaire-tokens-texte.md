---
id: ADR-001
title: Vocabulaire des tokens de couleur de texte
status: accepted
date: 2026-11-09
deciders: [Damien]
supersedes: []
superseded_by: null
related_components: [Button, MenuButton, DropdownMenuButton, AlertBanner, Link, Badge, TopNav]
related_tokens: [color/text]
backlog: []
prs: [94, 95, 96, 97, 98]
tags: [tokens, couleur, texte, nommage, contraste]
---

# ADR-001 — Vocabulaire des tokens de couleur de texte

## Contexte

Damien trouvait les variables de couleur des textes incohérentes. L'audit du
9 novembre 2026 a montré que les 29 tokens de texte étaient identiques dans Figma
(collection `semantic`) et dans `packages/tokens/tokens.json` : l'incohérence venait du
nommage, pas de la synchronisation.

- **Trois logiques mélangées au même niveau** : rang (`primary`, `secondary`,
  `tertiary`), intensité (`strong`, `muted`), rôle (`body`). Six noms pour cinq gris, et
  `muted` = `tertiary` (`#737373`).
- **Ordre contradictoire** : `strong` (`#262626`) plus clair que `primary` (`#171717`),
  `body` (`#525252`) moins contrasté que `secondary` (`#404040`).
- **Grammaire des tokens de composant hétérogène** : `button/primary-hover` (état en
  suffixe), `menu-button/outline-white` (couleur dans le nom, alors que la prop s'appelle
  `mode`), `notification/info-timestamp` (partie en suffixe), `nav-bar/opco-atlas` (nom
  de client).
- **Tokens de composant branchés sur les primitives** : `#fafafa` « texte sur fond foncé »
  copié 3 fois, `#3453dc` 3 fois, `#d4d4d4` 2 fois.
- **Contraste insuffisant** : 5 tokens `nav-bar/*` (de 1,47:1 à 4,17:1) et les 2
  horodatages de notification (2,93:1 et 3,53:1), pour un seuil AA de 4,5:1.
- **Dérive dans Figma** : 176 textes en `#000000` brut sur 4 pages, des primitives liées
  directement à du texte, des tokens d'icône posés sur du texte.

## Options considérées

1. **Échelle par intensité** (`strong` / `default` / `subtle`, modèle Atlassian) :
   aurait demandé de renommer `primary`, l'axe le plus utilisé.
2. **Échelle par rang** (`primary` / `secondary` / `tertiary`, modèle Carbon) : reprend
   l'axe déjà dominant (`text-primary` dans 12 déclarations CSS).
3. **Statu quo + documentation** : ne règle ni l'ordre contradictoire ni les doublons.

## Décision

Option 2, en quatre règles. Elles conservent les conventions déjà actées : préfixe
`color/text/`, kebab-case, séparateur `/`, collection `semantic`, noms CSS `--color-text-*`.

**Règle 1 — Une seule échelle de gris, nommée par rang.** Trois niveaux, pas plus.

| Token global | Primitive | Usage |
|---|---|---|
| `color/text/primary` | `neutral/900` | Titres, corps de texte, libellés forts |
| `color/text/secondary` | `neutral/600` | Texte secondaire, descriptions |
| `color/text/tertiary` | `neutral/500` | Métadonnées, aide (sur la page uniquement : 4,35:1 sur `surface`) |
| `color/text/disabled` | `neutral/300` | Texte d'un élément désactivé |
| `color/text/inverse` | `neutral/50` | Texte sur fond foncé ou coloré |
| `color/text/accent` | `deep-sea/600` | Accent interactif |
| `color/text/info` | `deep-sea/700` | Message d'information |
| `color/text/warning` | `autumn/700` | Message d'avertissement |

On ne crée pas de token sans usage : `success`, `danger`, `inverse-secondary` et
`inverse-disabled` ont été ajoutés quand Button et Link en ont eu besoin (PR #97).

**Règle 2 — Un token de composant pointe vers un token global, jamais vers une
primitive.** Exemple : `button/primary/idle → color/text/inverse → neutral/50`. Changer
une intention se fait en un seul endroit.

**Règle 3 — Une grammaire unique pour les tokens de composant, calquée sur l'API React.**

```
color/text/<composant>/<variant>[-<mode>]/<état>     composant interactif
color/text/<composant>/<variant>/<partie>            composant statique
color/text/<composant>/disabled                      état commun à toutes les variantes
```

- `<variant>` et `<mode>` reprennent les valeurs des props (`Button.variant`,
  `MenuButton.variant`, `MenuButton.mode`).
- `<état>` est une liste fermée : `idle`, `hover`, `focus`, `active` (`idle` = Figma
  `State=Idle`).
- `<partie>` est le nom de la classe CSS de l'élément (`message`, `timestamp`).
- On ne crée un token d'état que s'il a une valeur différente ; sinon le code réutilise
  `idle`.

Un niveau d'état explicite plutôt qu'un suffixe (`primary-hover`) : l'état de repos
devient nommé, comme `-rest` chez Primer, et `--color-text-button-primary-hover` garde
le même nom CSS.

**Règle 4 — Aucun nom de client dans `semantic`.** Les 5 tokens `nav-bar/<client>`
deviennent `color/text/project/on-accent`, porté par une collection à modes. Cette règle
est détaillée et étendue aux fonds par l'[ADR-002](002-collection-project.md).

## Conséquences

- **Rendu** : léger changement sur 7 éléments (Cards, MetaInfoItem,
  ProjectSectionDescription, ProjectOverview, Button secondary et tertiary, MenuButton
  outlined). `#262626` → `#171717` est quasi imperceptible ; `secondary`
  (`#404040` → `#525252`) est visible.
- **Contraste** : les 2 horodatages passent au-dessus de 4,5:1. Le timestamp warning prend
  la couleur du message (`autumn/700`, 5,27:1) et se distingue par sa taille.
- **Code** : les tokens de composant ne sont consommés que par le CSS du DS, donc
  renommés en une PR sans alias. `strong`, `body` et `muted` ont été supprimés sans
  période de transition (PR #98) : le portfolio ne consomme pas `@brique-rouge/tokens`.
- **Figma** : un renommage conserve les liaisons ; une fusion impose de relier les calques
  au token cible avant de supprimer l'ancien. Les liaisons de texte se lisent par plage
  (`getStyledTextSegments`), pas seulement par nœud — oubli corrigé au lot 4.
- **Exception assumée** : les textes Helvetica des cartes Bento sont le visuel d'un
  projet client, volontairement hors DS (décision du 10 novembre).
- **Gouvernance** : la vérification du contraste a été automatisée, voir
  l'[ADR-003](003-controle-contraste-ci.md).

Mise en œuvre en 7 lots, du 9 au 10 novembre 2026 : PR #94 (renommages), #95 (fusions),
#96 (collection `project`), #97 (dérive Figma), #98 (suppressions).

## Sources

- [Carbon — Color tokens](https://carbondesignsystem.com/elements/color/tokens) : `text-primary`, `text-secondary`, `text-helper`, `text-on-color`, `text-disabled`.
- [Atlassian — All design tokens](https://atlassian.design/components/tokens/all-tokens) : `color.text`, `.subtle`, `.subtlest`, `.inverse`, `.disabled`.
- [Primer — Token names](https://primer.style/foundations/primitives/token-names) : tokens de composant réservés au CSS des composants, état `-rest`.
- Fichier Figma Brique Rouge, lu le 9 novembre 2026 ; `packages/tokens/tokens.json` et `packages/react/src/**/*.module.css`.
- Contraste : luminance relative WCAG 2.x sur les valeurs hexadécimales, seuil 4,5:1 (le seuil grand texte de 3:1 n'a pas été appliqué, les tailles réelles n'ayant pas été vérifiées).
- Document de travail initial (table de correspondance des 29 tokens, plan par lots) : [ADR-001 sur claude.ai](https://claude.ai/artifact/99Y2C5vSvbZASAV2NYzLMp).
