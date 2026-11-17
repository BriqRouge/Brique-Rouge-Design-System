---
id: "014"
title: "Licence du dépôt : CLAUDE.md annonce MIT, aucun fichier ne l'établit"
status: a-explorer
created: 2026-11-17
origin: "Relevé le 2026-11-17 en ajoutant l'attribution d'Impeccable (ADR-006)"
adr: [ADR-006]
claude_md: ["1"]
related_components: []
related_tokens: []
references: [NOTICE.md, LICENSES/Apache-2.0.txt, package.json]
prs: []
---

# 014 — Licence du dépôt : CLAUDE.md annonce MIT, aucun fichier ne l'établit

## Problème
CLAUDE.md §1 indique « Licence : MIT ». Mais le dépôt, public, n'a pas de fichier
`LICENSE` à la racine, et aucun des quatre `package.json` (racine et trois packages) n'a
de champ `license`. Selon la documentation GitHub, un dépôt public n'est vraiment open
source que si une licence permet aux autres de l'utiliser, de le modifier et de le
distribuer.

L'objectif affiché est d'ouvrir le DS à des équipes de grandes entreprises : une revue
juridique cherchera ce fichier en premier.

## Ce qui existe déjà
- Contenus tiers sous Apache 2.0 attribués depuis l'ADR-006 : `NOTICE.md`,
  `LICENSES/Apache-2.0.txt`.
- Le dépôt part du template `design-system-starter` de Romain Richard (CLAUDE.md §1) ; la
  licence de ce template n'a pas été vérifiée.
- Le `package.json` racine porte encore le nom `design-system-starter` (backlog 011).

## Proposition
Choix à Damien. Je ne suis pas juriste : un avis juridique est recommandé avant une offre
à des entreprises.

- **A — MIT, comme annoncé** : fichier `LICENSE` à la racine, `"license": "MIT"` dans
  les `package.json`.
- **B — Une autre licence**, par exemple Apache 2.0 pour tout le dépôt (elle prévoit aussi
  une licence de brevet, et c'est celle des contenus adaptés d'Impeccable).

## Prérequis / questions ouvertes
- [ ] Licence du template `design-system-starter`, et ce qu'elle impose (mention à
      conserver ?).
- [ ] Titulaire(s) des droits : Damien seul, ou aussi l'auteur du template ?
- [ ] Compatibilité de la licence choisie avec les contenus Apache 2.0 (attribution
      conservée dans `NOTICE.md`).

## Non couvert
Les droits sur les polices commerciales (ABC Favorit, GT Ultra) et sur les logos et
visuels de clients montrés dans les stories : question distincte, aucun fichier de police
n'est versionné dans le dépôt.
