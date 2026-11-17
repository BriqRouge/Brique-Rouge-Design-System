---
name: polish-screen
description: Effectue une passe finale de qualité sur un écran du DS @brique-rouge — alignement, espacement, cohérence, micro-détails — avant livraison.
user-invocable: true
argument-hint: "[nom de l'écran ou composant]"
---

> Adapté d'[Impeccable](https://github.com/pbakaus/impeccable) (© 2025 Paul Bakaus, licence Apache 2.0) : traduit, réduit et modifié pour Brique Rouge. Voir [NOTICE.md](../../../../NOTICE.md).

## Préparation obligatoire

Lire `.claude/skills/ds-br-screen/SKILL.md` avant de procéder. Le polish est la dernière étape, pas la première. Ne pas polir un écran fonctionnellement incomplet.

---

Effectuer une passe finale méticuleuse pour attraper tous les petits détails qui séparent un bon travail d'un excellent travail.

## Polish systématique

### Alignement et espacement

- **Alignement pixel-perfect** : tout s'aligne sur la grille
- **Espacements cohérents** : tous les gaps utilisent les tokens `--spacing-*` (pas de valeurs px isolées)
- **Alignement optique** : ajuster pour le poids visuel (les icônes nécessitent parfois un offset)
- **Rythme d'espacement** : variation assumée, pas les mêmes gaps partout

**Vérifier :**
- Inspecter les espacements avec les DevTools
- Chercher les valeurs px arbitraires dans le CSS
- Vérifier à plusieurs tailles de viewport

### Typographie

- **Cohérence de hiérarchie** : les mêmes éléments utilisent les mêmes tailles/graisses partout
- **Longueur de ligne** : 45–75 caractères pour le corps de texte long
- **Hauteur de ligne** : appropriée au contexte
- **Variation de graisses** : assumée, pas uniforme

### Couleur et contraste

- **Ratios de contraste** : tous les textes respectent WCAG AA
- **Tokens cohérents** : zéro valeur hexadécimale, tout via `var(--token)`
- **Focus indicators** : visibles avec contraste suffisant

### États interactifs

Chaque élément interactif a tous ses états :
- Default, Hover, Focus, Active, Disabled
- Transitions fluides (tokens `--motion-duration-*` / `--motion-easing-*`)
- Aucun état abrupt (pas de changement instantané sans transition)

### Micro-interactions et transitions

- **Transitions fluides** : changements d'état animés (150–300ms)
- **Easing cohérent** : tokens `--motion-easing-*` du DS — jamais bounce ou elastic
- **60fps** : animer uniquement `transform` et `opacity`
- **Motion intentionnelle** : la motion sert un but
- **`prefers-reduced-motion`** : respecté

### Contenu et copy

- **Terminologie cohérente** : les mêmes choses appelées de la même façon partout
- **Capitalisation cohérente** : appliquée de façon uniforme
- **Pas de lorem ipsum** : tout le contenu est réaliste et en français
- **Labels de boutons** : verbes d'action, spécifiques
- **Ponctuation cohérente** : points sur les phrases, pas sur les labels

### États et cas limites

- **États de chargement** : toutes les actions async ont un feedback
- **États vides** : guident vers l'action
- **États d'erreur** : message clair avec chemin de récupération
- **États de succès** : confirmation et orientation vers la suite

### Qualité du code

- Pas de `console.log` de debug
- Pas de code commenté mort
- Pas d'imports inutilisés
- Pas de TypeScript `any`
- Pas de valeurs CSS arbitraires hors tokens
- Noms de classes CSS Modules : éléments en camelCase, modificateurs en kebab-case préfixé (`node scripts/css-class-audit.mjs`)

## Checklist finale

- [ ] Espacements via tokens `--spacing-*` partout
- [ ] Zéro valeur hexadécimale arbitraire
- [ ] Hiérarchie typographique cohérente
- [ ] Tous les états interactifs implémentés
- [ ] Toutes les transitions fluides (60fps, tokens motion du DS)
- [ ] `prefers-reduced-motion` respecté
- [ ] Contenu réaliste en français
- [ ] Labels de boutons = verbes d'action
- [ ] Ratios de contraste WCAG AA vérifiés
- [ ] Focus indicators visibles
- [ ] Tab order logique
- [ ] Un seul `<h1>` par écran
- [ ] Boutons icon-only avec `aria-label`
- [ ] Pas de `console.log`, pas de code mort
- [ ] Zéro `any` TypeScript

## Vérification finale

Avant de marquer comme terminé :
- **L'utiliser soi-même** : interagir vraiment avec l'écran
- **Tester les états** : pas seulement le happy path
- **Le test AI slop** : est-ce qu'un DA senior serait fier de signer cet écran ?

Le polish concerne les détails. Zoomer. Le regarder de loin. Chaque détail compte.
