# Motion design

> Adapté d'[Impeccable](https://github.com/pbakaus/impeccable) (© 2025 Paul Bakaus, licence Apache 2.0) : traduit, réduit et modifié pour Brique Rouge. Voir [NOTICE.md](../../NOTICE.md).

## Tokens motion du DS

Les durées et les courbes viennent de Figma (`motion/*`, synchronisées par `/sync-tokens`). Les transitions de prototype Figma ne peuvent pas lier de variable : ces tokens servent au code.

| Token | Valeur | Usage |
|-------|--------|-------|
| `--motion-duration-fast` | `150ms` | Feedback de survol (Button, MenuButton, MetaInfoItem, AlertBanner, ProjectBentoCard) |
| `--motion-duration-base` | `300ms` | Ouverture d'un contenu (BulletBrique) |
| `--motion-easing-standard` | `ease-out` | Courbe par défaut des transitions de survol |
| `--motion-easing-reveal` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Révélation de contenu : ouverture BulletBrique, menu mobile (decelerate, décision du 2026-11-10) |
| `--motion-duration-reveal` | `400ms` | Défini, pas encore utilisé par un composant |
| `--motion-duration-dismiss` | `300ms` | Défini, pas encore utilisé par un composant |
| `--motion-easing-dismiss` | `cubic-bezier(0.2, 0, 0, 1)` | Défini, pas encore utilisé par un composant |

Liste complète (primitives et ressorts compris) : `specs/foundations/motion.md`.

- Jamais de durée ou de courbe en dur quand un token existe
- Exceptions documentées : les boucles décoratives (lévitation BulletBrique 4993ms, logo TopNav 5s) et l'ouverture/fermeture de `DropdownMenuTrigger` (120ms / 200ms, courbes propres), sans token équivalent
- `prefers-reduced-motion` : réduire à `1ms` (valeur technique, pas un token)


## Durées — la règle 100/300/500

| Durée | Usage | Exemples |
|-------|-------|----------|
| **100–150ms** | Feedback instantané | Appui bouton, toggle, changement de couleur |
| **200–300ms** | Changements d'état | Ouverture menu, tooltip, hover |
| **300–500ms** | Changements de layout | Accordéon, modal, drawer |
| **500–800ms** | Animations d'entrée | Chargement page, reveals hero |

Les animations de sortie sont plus rapides que les entrées — utiliser ~75% de la durée d'entrée.

Dans le DS, ces ordres de grandeur se traduisent par les tokens : `--motion-duration-fast`
(150ms), `-base` (300ms), `-reveal` (400ms), `-dismiss` (300ms, soit 75 % de `reveal`).
Une durée sans token équivalent est un écart à signaler, pas une valeur à coder en dur.

---

## Easing — choisir la bonne courbe

Ne pas utiliser `ease` — c'est un compromis rarement optimal.

Dans le DS, une courbe est toujours un token :

| Situation | Token |
|-----------|-------|
| Survol, changement de couleur | `--motion-easing-standard` |
| Contenu qui entre ou se révèle | `--motion-easing-reveal` |
| Contenu qui sort | `--motion-easing-dismiss` |

Les courbes exponentielles (ease-out-quart, -quint, -expo) ne font pas partie du DS. Si aucun
token ne convient, le signaler à Damien plutôt que de coder une courbe en dur.

**Éviter absolument bounce et elastic easing** — daté depuis 2015, amateur.

---

## Seules deux propriétés à animer

**`transform` et `opacity` uniquement** — tout le reste provoque un recalcul de layout.

Pour les animations de hauteur (accordéons) : utiliser `grid-template-rows: 0fr → 1fr` plutôt qu'animer `height` directement.

```css
/* ✅ Correct — pas de recalcul layout */
.element {
  transition: transform var(--motion-duration-base) var(--motion-easing-standard),
              opacity var(--motion-duration-base) var(--motion-easing-standard);
}

/* ❌ Incorrect — recalcul layout */
.element {
  transition: width 250ms ease,
              height 250ms ease,
              padding 250ms ease;
}
```

---

## Animations d'entrée orchestrées

Un seul reveal orchestré à l'entrée de page crée plus d'impact que des micro-interactions dispersées.

```css
.panelLeft {
  animation: fadeIn var(--motion-duration-reveal) var(--motion-easing-reveal) both;
}

.panelRight {
  animation: fadeIn var(--motion-duration-reveal) var(--motion-easing-reveal) 100ms both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(var(--spacing-x3));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Limiter le stagger total** — 10 éléments à 50ms = 500ms total, c'est trop.

---

## prefers-reduced-motion — obligatoire

Pratique du DS (ProjectBentoCard, MetaInfoItem, BulletBrique, TopNav) : les transitions
passent à `1ms`, les boucles décoratives sont coupées.

```css
.card {
  transition: transform var(--motion-duration-fast) var(--motion-easing-standard);
}

.brick {
  animation: brique-levitation 4993ms infinite; /* boucle décorative de BulletBrique, exception documentée */
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition-duration: 1ms;
  }

  .brick {
    animation: none;
  }
}
```

---

**À éviter :** Animer layout properties. Bounce/elastic easing. Ignorer `prefers-reduced-motion`. Stagger sur chaque élément individuel. Animations > 500ms pour du feedback UI.
