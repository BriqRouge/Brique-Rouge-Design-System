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

## Styles de texte Figma (rôles)

Chaque texte d'un composant porte un style de texte Figma par rôle, lié aux
variables. En CSS, utiliser les tokens de la même ligne : ne jamais recomposer un
rôle avec d'autres valeurs.

| Style Figma | Taille | Graisse | Interligne | Espacement | Usage |
|---|---|---|---|---|---|
| `display/lg` | `--typography-font-size-5xl` | `--typography-font-weight-bold` | `--typography-line-height-x14` | `-0.02em` | Titre principal d'une page projet |
| `heading/xl` | `--typography-font-size-3xl` | `--typography-font-weight-medium` | `--typography-line-height-x10` | — | Titre de section |
| `heading/lg` | `--typography-font-size-2xl` | `--typography-font-weight-regular` | `--typography-line-height-x8` | — | Sous-titre, accroche |
| `heading/md` | `--typography-font-size-xl` | `--typography-font-weight-medium` | `normal` | — | Titre compact (navigation) |
| `body/md` | `--typography-font-size-base` | `--typography-font-weight-regular` | `--typography-line-height-x6` | — | Corps de texte |
| `body/md-medium` | `--typography-font-size-base` | `--typography-font-weight-medium` | `--typography-line-height-x6` | — | Corps appuyé |
| `body/md-bold` | `--typography-font-size-base` | `--typography-font-weight-bold` | `--typography-line-height-x6` | — | Corps fort (titre de notification) |
| `body/sm` | `--typography-font-size-sm` | `--typography-font-weight-regular` | `--typography-line-height-x5-5` | — | Texte secondaire |
| `caption` | `--typography-font-size-xs` | `--typography-font-weight-regular` | `--typography-line-height-x5` | — | Légende, métadonnée, horodatage |
| `eyebrow` | `--typography-font-size-base` | `--typography-font-weight-medium` | `--typography-line-height-x6` | `0.15em` | Surtitre espacé |
| `label/md` | `--typography-button-md-font-size` | `--typography-font-weight-regular` | `normal` | — | Libellé de contrôle md |
| `label/md-medium` | `--typography-dropdown-menu-button-font-size` | `--typography-font-weight-medium` | `normal` | — | Libellé appuyé (DropdownMenuButton) |
| `label/nm` | `--typography-button-nm-font-size` | `--typography-font-weight-regular` | `normal` | — | Libellé de contrôle nm |
| `label/sm` | `--typography-button-sm-font-size` | `--typography-font-weight-regular` | `normal` | — | Libellé de contrôle sm |

Textes encore sans style (écarts signalés, à décider) : liste à jour via
`node scripts/figma-sync-ds.mjs lint`.

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
