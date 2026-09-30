# Design spatial

## Système de tokens spacing et sizing

Tous les espacements passent par les tokens du DS `@brique-rouge/tokens`. Jamais de valeur px arbitraire.

```css
/* ✅ Correct */
.container {
  padding: var(--spacing\/x12);
  gap: var(--spacing\/x3-5);
}

/* ❌ Incorrect */
.container {
  padding: 48px;
  gap: 14px;
}
```

Les tokens `--spacing/*` et `--sizing/*` suivent une échelle préfixée x. Vérifier les valeurs disponibles dans `packages/tokens/build/css/numbers.css`.

---

## Hiérarchie visuelle

### Le test du flou

Flouter l'écran (ou prendre un screenshot et le flouter). Peut-on encore identifier :
- L'élément le plus important ?
- Le deuxième plus important ?
- Des groupements clairs ?

Si tout a le même poids flou, il y a un problème de hiérarchie.

### Hiérarchie multi-dimensionnelle

Ne pas s'appuyer sur la taille seule. Combiner :

| Outil | Hiérarchie forte | Hiérarchie faible |
|-------|-----------------|-------------------|
| **Taille** | Ratio 3:1 ou plus | Ratio < 2:1 |
| **Graisse** | Bold vs Regular | Medium vs Regular |
| **Couleur** | Fort contraste | Teintes similaires |
| **Position** | Haut/gauche (primaire) | Bas/droite |
| **Espace** | Entouré de blanc | Encombré |

La meilleure hiérarchie combine 2–3 dimensions simultanément.

---

## Rythme d'espacement

L'espacement crée la structure sans bordures ni séparateurs. Les éléments qui appartiennent ensemble respirent moins entre eux que les éléments séparés.

Principe : groupements serrés pour les éléments liés, séparations généreuses pour les sections distinctes.

---

## Grilles et layouts

### Liberté de composition

Pas de grille imposée. Les options disponibles :

- **Split layout** — deux zones distinctes avec logiques différentes
- **Full-bleed** — un élément occupe toute la largeur pour l'impact
- **Centrage généreux** — formulaire centré avec espace négatif assumé
- **Stack compact** — densité contrôlée, utilitaire
- **Asymétrie** — colonne étroite + colonne large, déséquilibre intentionnel
- **Chevauchement** — éléments qui se superposent pour créer de la profondeur

Ce qui compte : l'intentionnalité.

### Cards — utiliser avec parcimonie

Les cards sont surutilisées. Utiliser une card uniquement quand :
- Le contenu est véritablement distinct et actionnable
- Les éléments nécessitent une comparaison visuelle en grille
- Le contenu nécessite des limites d'interaction claires

**Jamais de cards imbriquées dans des cards.**
**Jamais de grille de cards identiques.**

---

## Zones de tap

Les boutons peuvent être visuellement petits mais nécessitent de grandes zones de tap (44px minimum). Utiliser le padding ou les pseudo-éléments pour étendre la zone sans changer l'apparence visuelle.

---

**À éviter :** Valeurs d'espacement arbitraires hors tokens. Espacements identiques partout. Hiérarchie créée par la taille seule. Cards imbriquées. Grilles de cards identiques.
