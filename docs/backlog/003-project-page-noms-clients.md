---
id: "003"
title: "background/project-page/<client> : des noms de clients dans semantic"
status: pret
created: 2026-11-10
origin: "Relevé le 2026-11-10 pendant la migration de background/projects/<client> (PR #101), vérifié dans Figma le 2026-11-11"
adr: [ADR-002]
claude_md: ["6.7"]
related_components: []
related_tokens: [color/background/project-page]
references: []
prs: [101]
---

# 003 — `background/project-page/<client>` : des noms de clients dans `semantic`

## Problème
Quatre variables de la collection `semantic` portent un nom de client, ce que
l'ADR-002 interdit : chaque nouveau client ajouterait une variable, et un calque doit
choisir la sienne par son nom.

## Ce qui existe déjà
Vérifié le 2026-11-11 :

| Variable Figma | Alias | Valeur |
|---|---|---|
| `color/background/project-page/odaptos` | `neutral/300` | `#d4d4d4` |
| `color/background/project-page/bpce` | `sage/400` | `#92bfb1` |
| `color/background/project-page/ibp` | `marigold/400` | `#f4ac45` |
| `color/background/project-page/opco-atlas` | `steel-blue/500` | `#457eac` |

- Scope `FRAME_FILL`, `SHAPE_FILL`, aucune description, aucune variable ne les aliase.
- **Figma** : 15 calques, tous sur la page Playground (« Background - Odaptos » ×6,
  « Background - BPCE » ×3, « Background - iBP » ×3, « Background - OPCO Atlas » ×3).
  Aucun usage sur Design system, Portfolio ni Portfolio mobile.
- **Code** : aucune occurrence de `--color-background-project-page-*`.
- Pas de mode `conseil-constitutionnel` dans cette famille, alors qu'il existe dans la
  collection `project`.
- La collection `project` et le pipeline `[data-project]` sont en place (ADR-002).

## Proposition
Même migration que `brand` (PR #101) :
1. Créer `color/background/project/page` dans la collection `project`, valeurs reprises
   par mode.
2. Relier les 15 calques avec leur mode explicite, vérifier la couleur résolue.
3. Supprimer les 4 variables après confirmation de zéro usage (§6.7).

## Prérequis / questions ouvertes
- [ ] Ces fonds sont-ils un usage du DS ou un brouillon du Playground ? S'ils ne servent
      à rien, l'alternative est de les retirer (cycle de dépréciation §6.7).
- [ ] Valeur pour `conseil-constitutionnel` (absente aujourd'hui) — décision de design.

## Non couvert
Le contraste du texte posé sur ces fonds : aucun composant du DS ne les utilise, donc
aucune paire à déclarer dans `contrast-pairs.config.js` pour l'instant.
