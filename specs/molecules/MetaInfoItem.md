# MetaInfoItem

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/MetaInfoItem/`
**Node Figma :** `837:19518` ("Meta_Info Button" — instance réelle sur la page d'accueil) + `797:19440` (bibliothèque "Design system", variantes `Interests` × `State=Idle|Hovered`)

## API

```ts
interface MetaInfoItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href:       string;          // requis — URL externe liée (ouvre dans un nouvel onglet)
  icon:       React.ReactNode; // requis — icône à l'état idle
  hoverIcon?: React.ReactNode; // optionnel — icône différente au survol/focus (ex: livre fermé → ouvert)
  children:   React.ReactNode; // requis — texte affiché à droite de l'icône
}
```

**Types exportés :** `MetaInfoItemProps`
**data-component :** `ds-br-meta-info-item`

## Comportement — élément interactif, pas un simple affichage

**Correction majeure après signalement de Damien** : la première implémentation rendait un
`<div>` décoratif statique. En vérifiant les variantes `State=Idle`/`State=Hovered` de la
bibliothèque Figma (`797:19440`, pas seulement l'instance homepage en `State=Idle` consultée
initialement), il s'avère que ce composant est un **vrai lien externe interactif** :

- Racine = `<a href={href} target="_blank" rel="noopener noreferrer">`, `cursor: pointer`
- Chaque variante réelle du Figma source a sa propre URL : Location → Google Maps, Tidal →
  lien morceau, Steam → page store du jeu, Lecture → fiche Goodreads. `rel="noopener noreferrer"`
  ajouté par sécurité (absent du Figma, bonne pratique pour tout lien `target="_blank"`)
- **Survol/focus — surbrillance révélée** : un rectangle `--color-neutral-300` est toujours
  présent dans le DOM (`aria-hidden`), derrière le texte. À l'idle : `width: 2px`,
  `opacity: 0` (invisible). Au survol/focus : `width: 100%` (largeur exacte du texte, via un
  wrapper `position: relative` dimensionné au contenu), `opacity: 1`. Transition
  `width`/`opacity` 150ms ease-out — **exception documentée à la règle DS "n'animer que
  transform/opacity"**, cohérente avec l'exception déjà actée sur `ProjectBentoCard`
  (ici la largeur doit réellement croître pour reproduire l'effet Figma)
- **Survol/focus — icône optionnellement différente** : `hoverIcon`, si fourni, remplace
  `icon` au survol/focus (crossfade opacité, même mécanique que `description` sur
  `ProjectBentoCard`). Sur les 4 usages réels du Figma source, seule la variante "Lecture"
  change d'icône (livre fermé → livre ouvert) ; Location/Tidal/Steam gardent la même icône.
  Défaut (`hoverIcon` absent) : `icon` reste affichée dans tous les états — zéro régression
  pour les usages qui n'ont pas encore d'icône de survol définie
- `prefers-reduced-motion` réduit toutes les transitions à 1ms

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-neutral-800` | `#262626` | Icône et texte |
| `--color-neutral-300` | `#d4d4d4` | Surbrillance au survol (voir écart Figma ci-dessous) |
| `--typography-font-family-sans` | — | Texte |
| `--typography-font-size-xs` | `12px` | Texte |
| `--typography-font-weight-regular` | `400` | Texte |
| `--spacing-x1` | `4px` | Gap icône/texte |
| `--spacing-x4` | `16px` | Taille de l'icône |

## Composition

`icon`/`hoverIcon` sont des slots libres — sur la page d'accueil réelle, 2 des 4 usages passent
un SVG dessiné à la main (planète, livre/livre ouvert) et 2 passent
`<LogoCompanies company="tidal"|"steam" size={16} />` (atome déjà existant).

## Règles d'usage

- Utilisé en grille 2×N sur la page d'accueil (section "Meta Info" sous l'intro) — le layout
  de grille est de la responsabilité de la page, pas du composant lui-même
- **Écart signalé vs Figma** : la couleur de la surbrillance (`#d9d9d9`) ne correspond à aucun
  token exact — `--color-neutral-300` (`#d4d4d4`) est la valeur existante la plus proche
- Vérifié en conditions réelles (Playwright, mesure `getComputedStyle` avant/après survol,
  pas seulement une capture d'écran) : opacité et largeur de la surbrillance, crossfade de
  l'icône — tout corrigé après un premier signalement où l'état hover n'avait pas été vérifié

## Tests

10 tests — 10 passants
