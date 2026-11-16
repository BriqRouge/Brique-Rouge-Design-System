---
name: audit-screen
description: Effectue un audit technique qualité d'un écran du DS @brique-rouge. Vérifie accessibilité, tokens, performance, responsive et anti-patterns. Génère un rapport scoré avec niveaux de sévérité P0-P3.
user-invocable: true
argument-hint: "[nom de l'écran ou composant]"
---

## Préparation obligatoire

Lire `.claude/skills/ds-br-screen/SKILL.md` avant de procéder.

---

Effectuer un audit technique systématique. Ne pas corriger les problèmes — les documenter pour traitement ultérieur.

## Scan diagnostique

### 1. Tokens et cohérence DS

**Vérifier :**
- Valeurs hexadécimales arbitraires (doit être 0)
- Propriétés CSS hors tokens (`font-size`, `padding`, `gap` en px arbitraires)
- Variables CSS citées qui n'existent pas dans `packages/tokens/build/css/` — une `var()` vers un token absent échoue sans erreur (la propriété se comporte comme `unset`)
- Nommage des classes CSS Modules (CLAUDE.md §8, ADR-005) : `node scripts/css-class-audit.mjs` sans erreur
- Composants DS non utilisés alors qu'ils existent (index : `COMPONENTS.md`)
- Props de composants incorrectement utilisées (API : fiche `specs/{atoms,molecules,organisms}/` du composant)
- Replis (ADR-004) : chaque élément qui comble un composant absent porte `data-ds-missing`, est un élément HTML natif (pas un `div` qui imite un contrôle) et figure dans l'en-tête du `.tsx`. Signaler tout repli non marqué, et tout repli d'un composant qui existe dans `COMPONENTS.md` (*shadow component*)

**Score 0–4 :** 0 = Aucun token (tout hardcodé), 1 = Tokens minoritaires, 2 = Tokens partiels (gaps notables), 3 = Tokens majoritaires (quelques valeurs isolées), 4 = Tokens complets, zéro valeur arbitraire

### 2. Accessibilité

**Vérifier :**
- Ratios de contraste texte < 4.5:1 (ou < 3:1 pour grands textes/UI)
- Éléments interactifs sans labels ARIA
- Navigation clavier : focus rings manquants, ordre de tab illogique
- HTML sémantique : hiérarchie de titres, landmarks, divs à la place de boutons
- Boutons icon-only sans `aria-label`
- Un seul `<h1>` par écran

**Score 0–4 :** 0 = Inaccessible (échoue WCAG A), 1 = Lacunes majeures, 2 = Partiel (effort présent, gaps significatifs), 3 = Bon (WCAG AA majoritairement respecté), 4 = Excellent (WCAG AA complet)

### 3. Anti-patterns visuels

Vérifier contre toutes les directives **À ne jamais faire** du skill principal.

Fingerprints AI slop à détecter : palette cyan/violet/dégradé générique · glassmorphisme · grille de cards identiques · typographie sans variation · texte en dégradé · fond sombre + accents néon · rectangles arrondis + ombre générique · hero metric layout · bounce/elastic easing.

**Score 0–4 :** 0 = Galerie AI slop (5+ fingerprints), 1 = Esthétique AI marquée (3–4), 2 = Quelques tells (1–2), 3 = Majoritairement propre, 4 = Aucun tell, design distinctif et intentionnel

### 4. Motion et interactions

**Vérifier :**
- Propriétés layout animées (`width`, `height`, `padding`, `margin`)
- Bounce ou elastic easing
- `prefers-reduced-motion` non respecté
- Durées > 500ms pour du feedback UI
- États interactifs manquants (hover, focus, active, disabled)

**Score 0–4 :** 0 = Animations layout, pas de reduced motion, 1 = Problèmes majeurs, 2 = Partiel, 3 = Bon (gaps mineurs), 4 = Excellent

### 5. Qualité du contenu

**Vérifier :**
- Lorem ipsum ou placeholder text
- Labels de boutons génériques ("OK", "Envoyer", "Oui")
- Messages d'erreur vagues ("Une erreur est survenue")
- Terminologie incohérente
- Texte non français (sauf noms propres ou termes techniques)

**Score 0–4 :** 0 = Tout placeholder, 1 = Majoritairement générique, 2 = Partiel, 3 = Bon (quelques formulations à améliorer), 4 = Contenu réaliste, précis, en français

## Rapport d'audit

### Score de santé

| # | Dimension | Score | Constat clé |
|---|-----------|-------|-------------|
| 1 | Tokens DS | ? | |
| 2 | Accessibilité | ? | |
| 3 | Anti-patterns | ? | |
| 4 | Motion / Interactions | ? | |
| 5 | Qualité du contenu | ? | |
| **Total** | | **??/20** | |

**Niveaux :** 18–20 Excellent · 14–17 Bon · 10–13 Acceptable · 6–9 Faible · 0–5 Critique

### Verdict anti-patterns
**Commencer ici.** Pass/fail : est-ce que ça ressemble à du travail IA générique ? Lister les fingerprints spécifiques détectées. Être direct.

### Replis balisés (ADR-004)

Lister chaque élément `[data-ds-missing]` : nom, fichier, besoin couvert. Rappeler qu'un
écran avec au moins un repli n'est pas « terminé » sans l'arbitrage de Damien (créer le
composant, garder le repli, ou revoir l'écran). Écrire « Aucun » s'il n'y en a pas.

### Résumé exécutif
- Score de santé : **??/20**
- Total des problèmes (par sévérité : P0/P1/P2/P3)
- Top 3–5 problèmes critiques
- Prochaines étapes recommandées

### Problèmes détaillés par sévérité

Tagger chaque problème **P0–P3** :
- **P0 Bloquant** : Empêche l'utilisation — corriger immédiatement
- **P1 Majeur** : Difficulté significative ou violation WCAG AA — corriger avant livraison
- **P2 Mineur** : Gêne, contournement possible — corriger à la prochaine passe
- **P3 Polish** : Amélioration souhaitable, pas d'impact réel — corriger si le temps le permet

Pour chaque problème :
- **[P?] Nom du problème**
- **Localisation** : Composant, fichier, ligne
- **Catégorie** : Tokens / Accessibilité / Anti-pattern / Motion / Contenu
- **Impact** : Comment ça affecte l'utilisateur
- **Recommandation** : Comment corriger
- **Commande suggérée** : `/audit-screen`, `/critique-screen`, `/polish-screen`

### Points positifs
Ce qui fonctionne bien — bonnes pratiques à maintenir et répliquer.

## Actions recommandées

Lister les commandes en ordre de priorité (P0 d'abord) :

1. **[P?] `/commande`** — Description courte (contexte spécifique de l'audit)

Terminer par `/polish-screen` comme dernière étape si des corrections ont été recommandées.

> Tu peux me demander de lancer ces commandes une par une, toutes en même temps, ou dans l'ordre que tu préfères.
> Relance `/audit-screen` après les corrections pour voir le score évoluer.
