---
id: ADR-002
title: "Collection project : aucun nom de client dans semantic"
status: accepted
date: 2026-11-10
deciders: [Damien]
supersedes: []
superseded_by: null
related_components: [TopNav, DropdownMenuButton, ProjectBentoCard]
related_tokens: [color/background/project, color/text/project, color/border/project]
backlog: ["003"]
prs: [96, 97, 101]
tags: [tokens, couleur, modes, multi-projet]
---

# ADR-002 — Collection `project` : aucun nom de client dans `semantic`

## Contexte

La règle 4 de l'[ADR-001](001-vocabulaire-tokens-texte.md) interdit les noms de clients
dans la collection `semantic`. En novembre 2026, plusieurs familles en portaient :

- `color/text/nav-bar/<client>` : texte de la pastille de projet du TopNav, dont 5 valeurs
  sur 5 étaient sous 4,5:1 (de 1,47:1 à 4,17:1) ;
- `color/background/projects/<client>` : plaque et bordure de ProjectBentoCard, et fonds
  des pages projet du Portfolio dans Figma (69 calques) ;
- les couleurs de survol de DropdownMenuButton, choisies par client.

Chaque nouveau client multipliait les tokens, et un composant devait connaître la liste des
clients pour choisir sa variable.

## Options considérées

1. **Garder un token par client dans `semantic`** : simple, mais la liste grossit avec
   chaque client, chaque composant énumère les clients en CSS, et le contraste se vérifie
   token par token.
2. **Une collection Figma `project`, un mode par client** : un seul nom de token par
   intention (`background/project/accent`), la valeur dépend du mode. C'est le mécanisme
   déjà utilisé par la collection `viewport`.
3. **Thème CSS seulement, sans Figma** : contredit « Figma source de vérité ».

## Décision

Option 2.

- **Collection `project`** dans Figma, un mode par client : `odaptos`, `bpce`, `ibp`,
  `opco-atlas`, `conseil-constitutionnel`.
- **Intentions, pas clients** : `background/project/accent` et `text/project/on-accent`
  (pastille du TopNav), `background/project/subtle`, `border/project/subtle` et
  `text/project/on-subtle` (survol de DropdownMenuButton), `background/project/brand` et
  `border/project/brand` (ProjectBentoCard, pages projet).
- **Fond et bordure séparés** : un token `border/…` distinct même quand la valeur est
  identique au fond (décision du 10 novembre pour `brand`, sur le modèle de
  `border/project/subtle`), pour que chaque usage garde son scope Figma (`STROKE_COLOR`
  vs `FRAME_FILL`, `SHAPE_FILL`).
- **Pastille du TopNav** : fond foncé, texte clair (option B du lot 6), pour atteindre
  4,5:1 dans chaque mode.
- **Code** : le build émet un bloc `[data-project='<mode>'] { … }` par mode dans
  `semantic.css`. Le composant pose l'attribut : `TopNav` (pastille), `DropdownMenuButton`
  (`data-project={company}`), `ProjectBentoCard` (`data-project={project}`).
- **Figma** : chaque calque lié à une variable `project` porte un mode explicite sur la
  collection, sinon il prend le mode par défaut (`odaptos`).
- **Ce qui n'est pas un client reste dans `semantic`** : `background/projects/cv` (carte
  CV) et `background/projects/body`.

## Conséquences

- **Ajouter un client** = ajouter un mode dans Figma, puis l'ajouter à
  `packages/tokens/mapping.config.js` (`modes`). Aucun composant à modifier.
- **Pas de valeur par défaut en CSS** : les variables `project` n'existent que dans les
  blocs `[data-project]`. Un composant sans attribut, ou avec une valeur qui n'est pas un
  mode (`cv`, `vinci`), ne reçoit aucune valeur : il doit prévoir son propre style
  (exemples : `.card:not([data-project='cv'])`, survol neutre de DropdownMenuButton).
- **Contraste** : `scripts/contrast-audit.mjs` contrôle chaque paire `project` dans chaque
  mode (voir l'[ADR-003](003-controle-contraste-ci.md)).
- **Limite Figma** : le nombre de modes par collection dépend du plan Figma. 5 modes
  fonctionnent sur le plan actuel ; la limite exacte n'a pas été vérifiée.
- **Reste à traiter** : `background/project-page/<client>` porte encore des noms de
  clients dans `semantic` (entrée de backlog [003](../backlog/003-project-page-noms-clients.md)).

Mise en œuvre : PR #96 (collection, TopNav), #97 (DropdownMenuButton), #101
(`background/projects/<client>` → `brand`).

## Sources

- Collection `viewport` du même fichier Figma (modes `desktop` / `mobile`, décision du 2026-11-07) : mécanisme repris tel quel.
- `packages/tokens/mapping.config.js`, `packages/tokens/style-dictionary.config.js` (`byAttribute`), `packages/tokens/build/css/semantic.css`.
