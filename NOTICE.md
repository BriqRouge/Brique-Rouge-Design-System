# Notice — contenus tiers

Ce dépôt contient des contenus adaptés de projets tiers. Ce fichier conserve leurs
mentions d'auteur, comme le demande l'article 4 de la licence Apache 2.0, dont le texte
complet est dans [`LICENSES/Apache-2.0.txt`](LICENSES/Apache-2.0.txt).

La licence du reste du dépôt n'est pas encore fixée par un fichier : voir le backlog
[014](docs/backlog/014-licence-du-depot.md).

## Impeccable

Impeccable
Copyright 2025 Paul Bakaus
Licence : Apache License 2.0
Source : https://github.com/pbakaus/impeccable (version du début 2026 : skill
`frontend-design`, ses fichiers de référence et les commandes `audit`, `critique`, `polish`)

Mention reprise du fichier NOTICE d'Impeccable :

> The `frontend-design` skill in this project builds on Anthropic's original
> frontend-design skill.
> Original work: https://github.com/anthropics/skills/tree/main/skills/frontend-design
> Original license: Apache License 2.0
> Copyright: 2025 Anthropic, PBC

### Fichiers de Brique Rouge concernés

| Fichier | Adapté de (Impeccable) |
|---|---|
| `specs/guidelines/typography.md` | `reference/typography.md` |
| `specs/guidelines/color-and-contrast.md` | `reference/color-and-contrast.md` |
| `specs/guidelines/spatial-design.md` | `reference/spatial-design.md` |
| `specs/guidelines/motion-design.md` | `reference/motion-design.md` |
| `specs/guidelines/interaction-design.md` | `reference/interaction-design.md` |
| `specs/guidelines/ux-writing.md` | `reference/ux-writing.md` |
| `.claude/skills/ds-br-screen/SKILL.md` | `skills/frontend-design/SKILL.md` |
| `.claude/skills/ds-br-screen/commands/audit-screen.md` | `commands/audit.md` |
| `.claude/skills/ds-br-screen/commands/critique-screen.md` | `commands/critique.md` |
| `.claude/skills/ds-br-screen/commands/polish-screen.md` | `commands/polish.md` |

### Modifications apportées

Ces fichiers ont été traduits en français, réduits, puis modifiés pour Brique Rouge :
tokens du DS à la place des valeurs génériques, renvois aux composants et aux fiches
`specs/`, règles propres au projet (repli balisé de l'ADR-004, nommage des classes de
l'ADR-005). Chaque fichier porte une mention de modification sous son titre.

Ils sont arrivés dans le dépôt le 2026-04-15 (`.claude/skills/ds-br-screen/`), et les six
fichiers de référence ont été déplacés vers `specs/patterns/` (ancien nom) le 2026-09-30, puis vers
`specs/guidelines/` le 2026-11-17 ([ADR-006](docs/adr/006-definition-patterns.md)).
L'origine a été établie le 2026-11-17 en comparant leur structure et leurs tableaux avec
l'historique d'Impeccable.
