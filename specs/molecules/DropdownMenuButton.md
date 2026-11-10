---
component: DropdownMenuButton
tier: molecule
figma:
  node: "370:19497"
  name: DropdownMenuButton
  type: component-set
---
# DropdownMenuButton

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/DropdownMenuButton/`
**Figma :** 14 variantes — `Company=none` ↔ prop `company` absente (renommé depuis `Company=no` le 2026-11-02)
**Fichiers :** `DropdownMenuButton.tsx`, `DropdownMenuButton.module.css`, `DropdownMenuButton.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/DropdownMenuButton.stories.tsx`

## API

```ts
interface DropdownMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children:    React.ReactNode;  // requis
  company?:    LogoCompany;      // accent couleur seulement pour 'odaptos' | 'bpce' | 'ibp'
  src?:        string;           // URL logo custom, ignoré si company fourni
  alt?:        string;           // défaut: ''
  rightIcon?:  boolean;          // icône lien externe
  activated?:  boolean;          // item sélectionné
  disabled?:   boolean;          // Figma Type=deactivated (projet à venir)
  hoverLabel?: string;           // libellé affiché au survol (ex : « Showcase à venir »)
}
```

**Types exportés :** `DropdownMenuButtonProps`
**data-attributes :** `data-activated`, `data-company`

## Correspondance Figma ↔ code (synchro du 2026-11-04)

| Figma | Code |
|---|---|
| `Company=none` | `company` absent |
| `Company=odaptos\|bpce\|ibp\|conseil-constitutionnel\|vinci` | `company="…"` |
| `State=idle\|hovered` | `:hover` CSS |
| `Type=activated` | état par défaut (item disponible) |
| `Type=deactivated` | `disabled` |
| Libellé au survol en `deactivated` (« Showcase à venir », « Projet à venir ») | `hoverLabel` |
| Booléen `Right Icon` | `rightIcon` |

Attention au vocabulaire : dans Figma, `Type=activated` signifie « disponible ». Dans le code, la prop `activated` signifie « item sélectionné » (`data-activated`, sans style propre).

## États

- **Repos** : texte `--color-text-tertiary`
- **Survol neutre** (sans `company`, ou `disabled`) : fond `--color-background-surface-raised`, bordure `--color-border-default` (0.5px), texte `--color-text-tertiary`
- **Survol de marque** (`odaptos`/`bpce`/`ibp`, hors `disabled`) : fond, bordure et texte aux couleurs de la marque
- **Désactivé** : opacité 0.5, `cursor: not-allowed`. Le survol reste visible, comme dans Figma (décision Damien, 2026-11-04)
- **Focus clavier** : contour 2px `--color-border-focus`, décalé de 2px. Figma n'a pas d'état focus ; contour ajouté pour WCAG 2.4.7 (décision Damien, 2026-11-04)

## Tokens CSS utilisés

- `--spacing-component-sm` (gap + padding)
- `--sizing-x10` (hauteur)
- `--border-radius-dropdown-menu-button`
- `--color-text-tertiary` (texte au repos et au survol neutre)
- `--color-background-surface-raised`, `--color-border-default` (survol neutre)
- `--color-border-focus` (contour de focus)
- Couleurs accent par compagnie : `--color-deep-sea-*`, `--color-maroon-flush-*`, `--color-purple-mountain-*`
- `--typography-dropdown-menu-button-font-family` / `-font-size` (16px) — graisse `--typography-font-weight-medium` dans tous les états, disabled compris (style Figma `label/md-medium`, aligné le 2026-11-02)

## Règles d'usage

- Layout : flex row, `width: 100%` (responsive — remplit le `DropdownMenu`), hauteur fixe via `--sizing-x10`
- `hoverLabel` : remplace visuellement `children` au survol. Le libellé est **toujours** annoncé aux lecteurs d'écran à la suite de `children` (« Vinci, Showcase à venir »), car un bouton désactivé n'est pas focalisable et le survol n'existe ni au clavier ni au toucher
- `rightIcon` : l'icône suit la couleur du texte (gris au repos, couleur de marque au survol). Le booléen Figma `Right Icon` n'est relié à aucun calque (incohérence signalée le 2026-11-04)
- `company` accepte toutes les valeurs de `LogoCompany` (voir `LogoCompanies`), mais l'accent couleur ne s'applique qu'à `odaptos`/`bpce`/`ibp`
- **Sous le breakpoint (mobile)** : la version desktop est conservée telle quelle. La variante Figma `Viewport=mobile` n'est pas implémentée (décision de Damien, 2026-11-07) — aucune media query dans le CSS du composant

## Tests

24 tests — 24 passants
