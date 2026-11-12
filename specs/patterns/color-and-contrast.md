# Couleur et contraste

## Tokens couleurs du DS

Toutes les couleurs passent par les tokens `@brique-rouge/tokens`. Jamais de valeur hexadécimale arbitraire.

### Structure des tokens

| Catégorie | Exemples | Usage |
|-----------|----------|-------|
| `--color/background/button/*` | `--color/background/button/idle`, `--color/background/button/hovered` | Fonds de boutons |
| `--color/text/button/*` | `--color/text/button/contained`, `--color/text/button/outline-white` | Textes de boutons |
| `--color/border/button/*` | `--color/border/button/contained`, `--color/border/button/outlined-black` | Bordures de boutons |
| `--color/icon/button/*` | `--color/icon/button/contained`, `--color/icon/button/outline-white` | Icônes de boutons |
| `--border-radius/button` | `--border-radius/button` | Border-radius pill |

En cas de doute sur les tokens disponibles : vérifier dans `packages/tokens/build/css/`.

### Socle sémantique générique (décidé le 2026-11-04)

Rôles génériques à utiliser **avant** toute primitive. Ces variables reprennent à
l'identique les niveaux de gris déjà employés : leur création n'a entraîné aucun
changement visuel. Pour consolider ensuite (par exemple réduire le nombre de niveaux), il
suffit de changer l'alias dans Figma. Contraste mesuré sur `background/page` (#fafafa).

| Token CSS | Alias | Rôle | Contraste |
|---|---|---|---|
| `--color-text-primary` | neutral/900 | Titres, texte principal, introductions, libellés | 17.2:1 |
| `--color-text-secondary` | neutral/600 | Texte courant, descriptions, puces, accroches | 7.5:1 |
| `--color-text-tertiary` | neutral/500 | Métadonnées, numéros de section, aide | 4.5:1 — limite AA ; **uniquement sur `background/page`** (4.35:1 sur `surface`, sous AA) |
| `--color-text-disabled` | neutral/300 | Texte d'un élément désactivé | exempté (WCAG 1.4.3) |
| `--color-text-inverse` | neutral/50 | Texte sur fond foncé ou coloré | selon le fond |
| `--color-text-accent` | deep-sea/600 | Accent interactif, mise en valeur | 5.9:1 |
| `--color-text-info` / `--color-text-warning` | deep-sea/700 / autumn/700 | Messages d'information / d'avertissement | 7.05:1 / 5.27:1 sur leur fond de notification |

Échelle à 3 niveaux décidée par l'ADR-001 (lot 4, 2026-11-10). Les anciens
`--color-text-strong`, `--color-text-body` et `--color-text-muted` ont été supprimés au
lot 7 (2026-11-10) : utiliser `primary`, `secondary` et `tertiary`.

Les ratios sont vérifiés en CI par `scripts/contrast-audit.mjs` sur les combinaisons
déclarées dans `packages/tokens/contrast-pairs.config.js`, puis sur le rendu réel de chaque
story par `scripts/rendered-contrast-audit.mjs` (axe-core dans Chromium, job Test) : ce second
contrôle voit les combinaisons non déclarées (ex. un libellé sur le fond d'un composant parent).
| `--color-background-page` | neutral/50 | Fond de page | — |
| `--color-background-surface` | neutral/100 | Surfaces (menus, cadres de logo) | — |
| `--color-background-surface-raised` | neutral/200 | Surfaces surélevées, survol neutre | — |
| `--color-background-inverse` | neutral/950 | Sections sombres (hero, footer) ; fond de référence des variantes « sur fond foncé » | — |
| `--color-border-default` | neutral/300 | Bordures de conteneur | — |
| `--color-border-subtle` | neutral/200 | Bordures discrètes | — |
| `--color-border-focus` | deep-sea/600 | Indicateur de focus | — |

Les primitives restent légitimes pour les **couleurs de marque des projets**, comme les
variantes entreprise de `DropdownMenuButton` ; préférer alors `background/projects/*` et
`text/nav-bar/*` quand ils existent. Elles restent aussi légitimes pour les icônes et le
contenu illustratif.

---

## Accessibilité WCAG AA — non négociable

| Type de contenu | Ratio minimum |
|-----------------|---------------|
| Texte body | 4.5:1 |
| Texte large (18px+ ou 14px bold) | 3:1 |
| Composants UI, icônes | 3:1 |
| Décorations non essentielles | Aucun |

### Combinaisons à risque

- Texte gris sur fond coloré → utiliser une nuance de la couleur de fond, jamais du gris pur
- Placeholder text : doit aussi respecter 4.5:1 — le gris clair générique échoue presque toujours

---

## Principes de composition couleur

### La règle 60-30-10 — appliquée correctement

C'est une règle de **poids visuel**, pas de pixels :

- **60%** : Fonds neutres, espace blanc, surfaces de base
- **30%** : Couleurs secondaires — texte, bordures, états inactifs
- **10%** : Accent — CTAs, highlights, états de focus

Les couleurs d'accent fonctionnent *parce qu'elles sont rares*. La surutilisation tue leur pouvoir.

---

## Directives

**À faire :**
- S'engager dans une palette cohérente — dominante neutre, accent tranchant
- Vérifier les ratios de contraste avant de livrer — ne pas faire confiance à l'œil seul

**À ne jamais faire :**
- Valeurs hexadécimales arbitraires — tout passe par les tokens
- Palette cyan/violet/dégradé générique — fingerprint AI slop
- Texte en dégradé pour "l'impact" — décoratif, pas signifiant
- Fond sombre avec accents lumineux/néon par défaut — paraît "cool" sans vraie décision
- Glassmorphisme décoratif — transparence sans intention

---

## Mode sombre

Le DS génère `colors-light.css` et `colors-dark.css`. Le mode sombre n'est pas l'inversion du mode clair — les tokens sémantiques changent de valeur, pas de nom. Utiliser les tokens correctement garantit que le mode sombre fonctionne sans surcharge CSS.

---

## Implémentation CSS Modules

```css
/* ✅ Correct */
.button {
  background-color: var(--color\/background\/button\/idle);
  border: 1px solid var(--color\/border\/button\/contained);
  color: var(--color\/text\/button\/contained);
}

/* ❌ Incorrect */
.button {
  background-color: #f5f5f5;
  border: 1px solid #d4d4d4;
  color: #737373;
}
```

---

**À éviter :** Valeurs hexadécimales hors tokens. Gris pur sur fond coloré. Contraste non vérifié.
