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
