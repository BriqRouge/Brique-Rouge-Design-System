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

| Style Figma | Taille | Graisse | Interligne | Espacement | Rendu | Usage |
|---|---|---|---|---|---|---|
| `display/lg` | `--typography-font-size-5xl` | `--typography-font-weight-bold` | `--typography-line-height-x14` | `-0.02em` | — | Titre principal d'une page projet |
| `heading/xl` | `--typography-font-size-3xl` | `--typography-font-weight-medium` | `--typography-line-height-x10` | — | — | Titre de section |
| `heading/lg` | `--typography-font-size-2xl` | `--typography-font-weight-regular` | `--typography-line-height-x8` | — | — | Sous-titre, accroche |
| `heading/md` | `--typography-font-size-xl` | `--typography-font-weight-medium` | `normal` | — | — | Titre compact (navigation) |
| `heading/md-regular` | `--typography-font-size-xl` | `--typography-font-weight-regular` | `normal` | — | — | Titre compact, graisse normale (sous-titre TopNav) |
| `body/md` | `--typography-font-size-base` | `--typography-font-weight-regular` | `--typography-line-height-x6` | — | — | Corps de texte |
| `body/md-trim` | `--typography-font-size-base` | `--typography-font-weight-regular` | `--typography-line-height-x6` | — | rognage | Corps rogné (ProjectOverview, ProjectCardDescription) |
| `body/md-medium` | `--typography-font-size-base` | `--typography-font-weight-medium` | `--typography-line-height-x6` | — | — | Corps appuyé |
| `body/md-medium-tight` | `--typography-font-size-base` | `--typography-font-weight-medium` | `--typography-line-height-x4-5` | — | rognage | Corps appuyé serré (titre ProjectCardDescription) |
| `body/md-bold` | `--typography-font-size-base` | `--typography-font-weight-bold` | `--typography-line-height-x6` | — | — | Corps fort (titre de notification) |
| `body/sm` | `--typography-font-size-sm` | `--typography-font-weight-regular` | `--typography-line-height-x5-5` | — | — | Texte secondaire |
| `body/sm-loose` | `--typography-font-size-sm` | `--typography-font-weight-regular` | `--typography-line-height-x6` | — | rognage | Texte secondaire aéré (ProjectCardDescription) |
| `caption` | `--typography-font-size-xs` | `--typography-font-weight-regular` | `--typography-line-height-x5` | — | — | Légende, métadonnée, horodatage |
| `eyebrow` | `--typography-font-size-base` | `--typography-font-weight-medium` | `--typography-line-height-x6` | `0.15em` | capitales | Surtitre espacé |
| `label/md` | `--typography-button-md-font-size` | `--typography-font-weight-regular` | `normal` | — | rognage | Libellé de contrôle md (Button, MenuButton) |
| `label/md-underline` | `--typography-button-md-font-size` | `--typography-font-weight-regular` | `normal` | — | rognage, souligné | Libellé souligné (Button tertiary) |
| `label/md-medium` | `--typography-dropdown-menu-button-font-size` | `--typography-font-weight-medium` | `normal` | — | rognage | Libellé appuyé (DropdownMenuButton, y compris disabled) |
| `label/nm` | `--typography-button-nm-font-size` | `--typography-font-weight-regular` | `normal` | — | rognage | Libellé de contrôle nm |
| `label/sm` | `--typography-button-sm-font-size` | `--typography-font-weight-regular` | `normal` | — | rognage | Libellé de contrôle sm |
| `label/xs` | `--typography-font-size-xs` | `--typography-font-weight-regular` | `normal` | — | — | Texte d'une ligne 12px (MetaInfoItem) |
| `label/xs-medium` | `--typography-font-size-xs` | `--typography-font-weight-medium` | `normal` | — | — | Texte d'une ligne appuyé 12px (Tag sm) |
| `label/base-medium` | `--typography-font-size-base` | `--typography-font-weight-medium` | `normal` | — | — | Texte d'une ligne appuyé 16px (Tag nm) |
| `label/2xl-medium` | `--typography-font-size-2xl` | `--typography-font-weight-medium` | `normal` | — | — | Texte d'une ligne appuyé 24px (Tag md) |
| `label/3xl-medium` | `--typography-font-size-3xl` | `--typography-font-weight-medium` | `normal` | — | — | Texte d'une ligne appuyé 32px (Tag lg) |
| `label/3xl-medium-trim` | `--typography-font-size-3xl` | `--typography-font-weight-medium` | `normal` | — | rognage | Titre ProjectOverview (partie appuyée) |
| `label/3xl-trim` | `--typography-font-size-3xl` | `--typography-font-weight-regular` | `normal` | — | rognage | Titre ProjectOverview (accroche) |

Colonne **Rendu** — propriétés que le style porte en plus de la taille et de la
graisse, à reproduire en CSS :

| Figma | CSS |
|---|---|
| rognage (`leadingTrim: CAP_HEIGHT`) | `text-box-trim: trim-both; text-box-edge: cap alphabetic;` (avec repli `line-height: 1`, voir `ProjectCardDescription`) |
| capitales (`textCase: UPPER`) | `text-transform: uppercase` |
| souligné (`textDecoration: UNDERLINE`) | `text-decoration: underline` |

**Appliquer un style de texte dans Figma remplace toutes les propriétés du texte**,
rognage, casse et soulignement compris. Avant d'appliquer un style à un texte
existant, vérifier que ces trois propriétés sont identiques, sinon choisir (ou
créer) la variante de style qui les porte (`-trim`, `-underline`…), puis contrôler
la largeur et la hauteur du texte avant/après. Un texte combinant plusieurs styles
(ex. titre Medium + Regular) porte un style par segment.

Tous les textes des composants portent un style depuis le 2026-11-02. Un texte
sans style est signalé (avertissement) par `node scripts/figma-sync-ds.mjs lint`.

### Famille expressive (GT Ultra)

Les styles ci-dessus utilisent tous Favorit (`--typography-font-family-sans`). La
famille `expressive/*` (décidée le 2026-11-04) porte la police d'affichage GT Ultra :
accroches, introductions, logo-texte, libellés de schémas. Elle n'est pas un niveau
de titre de l'interface : ne pas l'utiliser pour les titres de section ni les
libellés de contrôles.

| Style Figma | Police | Taille | Graisse | Interligne | Rendu | Usage |
|---|---|---|---|---|---|---|
| `expressive/xl` | `--typography-font-family-display-median` | `--typography-font-size-5xl` | `--typography-font-weight-black` | `--typography-line-height-x14` | rognage | Titre d'accroche (hero) |
| `expressive/lg` | `--typography-font-family-display-median` | `--typography-font-size-3xl` | `--typography-font-weight-black` | `--typography-line-height-x10` | rognage | Titre d'accroche secondaire |
| `expressive/md` | `--typography-font-family-display-median` | `--typography-font-size-2xl` | `--typography-font-weight-black` | `--typography-line-height-x10` | — | Logo-texte, partie grasse (TopNav) |
| `expressive/md-light` | `--typography-font-family-display-median` | `--typography-font-size-2xl` | `--typography-font-weight-light` | `--typography-line-height-x10` | — | Logo-texte, partie légère (TopNav) |
| `expressive/lead` | `--typography-font-family-display` | `--typography-font-size-xl` | `--typography-font-weight-regular` | `--typography-line-height-x7` | rognage | Paragraphe d'introduction |
| `expressive/lead-italic` | `--typography-font-family-display` | `--typography-font-size-xl` | `--typography-font-weight-regular` | `--typography-line-height-x7` | rognage, italique | Mise en valeur dans une introduction |
| `expressive/label` | `--typography-font-family-display` | `--typography-font-size-base` | `--typography-font-weight-regular` | `--typography-line-height-x4-5` | rognage | Libellé de schéma |

Italique (`fontName.style: Italic`) → `font-style: italic`. GT Ultra et GT Ultra
Median sont deux familles distinctes : la graisse seule ne passe pas de l'une à
l'autre.

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
