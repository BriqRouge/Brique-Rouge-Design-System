# Typographie

## Principes fondamentaux

### Rythme vertical

La hauteur de ligne est l'unité de base de tout espacement vertical. Si le corps de texte a `line-height: 1.5` sur `16px` (= 24px), les valeurs d'espacement doivent être des multiples de 24px.

### Échelle et hiérarchie

L'erreur courante : trop de tailles trop proches (14px, 15px, 16px, 18px). La hiérarchie devient floue.

**Utiliser moins de tailles avec plus de contraste.** Vérifier les tokens disponibles dans `packages/tokens/build/css/typography.css`.

| Rôle | Usage |
|------|-------|
| xs | Captions, métadonnées |
| sm | UI secondaire, labels discrets |
| base | Corps de texte |
| lg | Sous-titres, texte d'accroche |
| xl+ | Titres, hero text |

Choisir un ratio et s'y tenir. Le contraste entre niveaux doit se ressentir immédiatement.

### Lisibilité et mesure

Utiliser `max-width: 65ch` pour les colonnes de texte long.

---

## Typographie du DS

Le token `--typography/font-size/base` est défini à `16px`. Utiliser les tokens de typographie disponibles pour toutes les tailles — jamais de valeurs px arbitraires.

**Varier les graisses** pour créer de la hiérarchie. Les différentes graisses (Regular, Medium, Semibold, Bold) sont quatre niveaux de hiérarchie disponibles.

**Ne jamais utiliser la même graisse partout** — c'est l'absence de décision typographique.

---

## Directives

**À faire :**
- Contraste fort entre niveaux de hiérarchie (ratio 1.333 ou 1.5 minimum)
- `font-variant-numeric: tabular-nums` pour les données chiffrées alignées
- Hauteur de ligne adaptée au contexte — plus serrée pour les titres, plus aérée pour le corps

**À ne jamais faire :**
- Même graisse partout sans variation — signe d'absence de décision
- Typographie monospace comme raccourci pour "ambiance dev/technique"
- Grande icône arrondie au-dessus de chaque titre — template générique
- Tailles trop proches (ex. 14/15/16/18px) — hiérarchie floue

---

## Implémentation CSS Modules

Tous les tokens typographiques via `var(--token)`. Jamais de valeurs px arbitraires.

```css
/* ✅ Correct */
.title {
  font-size: var(--typography\/font-size\/base);
  font-weight: 700;
  line-height: 1.2;
}

.body {
  font-size: var(--typography\/font-size\/base);
  line-height: 1.5;
  color: var(--color\/text\/button\/contained);
}

/* ❌ Incorrect */
.title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
}
```

---

## Accessibilité

- Jamais de `user-scalable=no`
- `rem` pour les tailles de texte — respecte les préférences du navigateur
- Minimum 14px pour les textes UI, 16px pour le corps
- Les liens dans le texte doivent avoir une zone de tap d'au moins 44px via padding ou line-height

---

**À éviter :** Tailles identiques sur des éléments de niveaux différents. Valeurs px arbitraires hors tokens. Graisse uniforme sans variation.
