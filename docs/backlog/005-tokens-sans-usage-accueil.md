---
id: "005"
title: Tokens créés pour la page Accueil, sans usage depuis sa suppression
status: fait
created: 2026-11-11
origin: "Constaté le 2026-11-11 : la page Figma « Accueil » n'existe plus (remplacée par « Ressources »)"
adr: [ADR-001]
claude_md: ["6.7"]
related_components: []
related_tokens: [color/background/inverse-raised, color/background/accent-subtle, color/background/inverse]
references: []
prs: [101, 103]
---

# 005 — Tokens créés pour la page Accueil, sans usage depuis sa suppression

## Problème
Trois tokens `semantic` ont été créés le 2026-11-10 (PR #101) pour relier la page
Accueil à des tokens sémantiques. La page a depuis été supprimée : deux d'entre eux n'ont
plus aucun usage.

## Ce qui existe déjà
Vérifié le 2026-11-11 (liaisons de remplissage et de contour sur les pages Design system,
Playground, Portfolio et Portfolio mobile ; la page Ressources n'a pas été inspectée en
détail, elle contient une image, un texte et un cadre « Quote ») :

| Token | Valeur | Usage Figma | Usage code |
|---|---|---|---|
| `color/background/inverse` | `neutral/950` | 0 | fond sombre de référence de `contrast-pairs.config.js` (ADR-003) |
| `color/background/inverse-raised` | `neutral/800` | 0 | 0 |
| `color/background/accent-subtle` | `deep-sea/100` | 0 | 0 |

## Proposition
- `background/inverse` : le garder, il sert de référence au contrôle de contraste et
  correspond à un besoin réel (variantes « sur fond foncé » de Link, MenuButton, Badge).
- `inverse-raised` et `accent-subtle` : les déprécier (description
  `DEPRECATED — sans usage depuis la suppression de la page Accueil`), puis les supprimer
  avec validation, ou les garder si une prochaine maquette en a besoin.

## Prérequis / questions ouvertes
- [ ] La page Accueil a-t-elle été déplacée ailleurs (autre fichier) ou abandonnée ?
- [ ] Décision de Damien : garder ou retirer `inverse-raised` et `accent-subtle`.

## Décision (2026-11-12)
Damien a validé la suppression de `inverse-raised` et `accent-subtle` ; `background/inverse`
est conservé. Avant suppression, une version Figma nommée a été enregistrée et les usages
revérifiés : 0 liaison sur les 5 pages (Ressources comprise), 0 alias, 0 occurrence dans le
code. Variables supprimées dans Figma puis synchronisées (`/sync-tokens`, PR #103).
