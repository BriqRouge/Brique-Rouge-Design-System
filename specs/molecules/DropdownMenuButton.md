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
**Figma :** 30 variantes — `Company=none` ↔ prop `company` absente (renommé depuis `Company=no` le 2026-11-02) ; propriété `Selected` ajoutée le 2026-11-17 (12 variantes `Selected=true`)
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
  activated?:  boolean;          // item courant — Figma Selected=true : fond plein + aria-current
  disabled?:   boolean;          // Figma Type=deactivated (projet à venir)
  hoverLabel?: string;           // libellé affiché au survol (ex : « Showcase à venir »)
}
```

**Types exportés :** `DropdownMenuButtonProps`
**data-attributes :** `data-activated`, `data-company`, `data-project` (= `company`, sélectionne les valeurs de la collection Figma `project`)
**ARIA :** `aria-current="true"` quand `activated` ; le consommateur peut le préciser (`aria-current="page"`)

## Correspondance Figma ↔ code (synchro du 2026-11-04)

| Figma | Code |
|---|---|
| `Company=none` | `company` absent |
| `Company=odaptos\|bpce\|ibp\|conseil-constitutionnel\|vinci` | `company="…"` |
| `State=idle\|hovered` | `:hover` CSS |
| `Type=activated` | état par défaut (item disponible) |
| `Type=deactivated` | `disabled` |
| `Selected=false` (défaut) | `activated` absent ou `false` |
| `Selected=true` | `activated` (classe `is-activated`, `aria-current`) |
| Libellé au survol en `deactivated` (« Showcase à venir », « Projet à venir ») | `hoverLabel` |
| Booléen `Right Icon` | `rightIcon` |

Attention au vocabulaire : dans Figma, `Type=activated` signifie « disponible » ; l'item courant est `Selected=true`. Dans le code, la prop `activated` signifie « item courant » (nom conservé, CLAUDE.md §6.7). `Selected=true` n'existe que pour `Type=activated` : un item indisponible ne peut pas être courant (backlog [012](../../docs/backlog/012-dropdownmenubutton-etat-selectionne.md)).

## États

- **Repos** : texte `--color-text-secondary` (7,2:1 sur le fond `surface` du DropdownMenu ; `tertiary` n'atteignait que 4,34:1, relevé par le contrôle du contraste rendu le 2026-11-10)
- **Survol neutre** (sans `company`, ou `disabled`) : fond `--color-background-surface-raised`, bordure `--color-border-default` (0.5px), texte `--color-text-secondary` (6,1:1 ; `tertiary` n'atteignait que 3,76:1, corrigé le 2026-11-10)
- **Survol de marque** (`odaptos`/`bpce`/`ibp`, hors `disabled`) : fond, bordure et texte aux couleurs de la marque
- **Sélectionné** (`activated`, Figma `Selected=true`) : fond plein, sans bordure, inchangé au survol. Neutre : `--color-background-inverse` / `--color-text-inverse` (18,97:1). Projet (`odaptos`/`bpce`/`ibp`) : `--color-background-project-accent` / `--color-text-project-on-accent`, comme la pastille projet du `TopNav` (4,58:1 à 6,04:1 selon le projet ; iBP au plus juste). Le fond plein ressort sur le menu (6,03:1 à 18,16:1, WCAG 1.4.11) et se distingue du survol subtil des autres items. Un seul item courant par menu
- **Désactivé** : opacité 0.5, `cursor: not-allowed`. Le survol reste visible, comme dans Figma (décision Damien, 2026-11-04)
- **Focus clavier** : contour 2px `--color-border-focus`, décalé de 2px. Figma n'a pas d'état focus ; contour ajouté pour WCAG 2.4.7 (décision Damien, 2026-11-04)

## Tokens CSS utilisés

- `--spacing-component-sm` (gap + padding)
- `--sizing-x10` (hauteur)
- `--border-radius-dropdown-menu-button`
- `--color-text-secondary` (texte au repos et au survol neutre ; au survol neutre, seul le fond change)
- `--color-background-surface-raised`, `--color-border-default` (survol neutre)
- `--color-border-focus` (contour de focus)
- `--color-background-inverse`, `--color-text-inverse` (sélectionné, neutre)
- `--color-background-project-accent`, `--color-text-project-on-accent` (sélectionné, projet)
- Couleurs accent par compagnie (survol activé) : `--color-background-project-subtle`, `--color-border-project-subtle`, `--color-text-project-on-subtle` — une valeur par projet (`[data-project]`, ADR-001 lot 5). Depuis le 2026-11-10, BPCE utilise son violet de marque (`purple-mountain`) et IBP le sien (`purple`) ; contraste du texte ≥ 4,9:1
- `--typography-dropdown-menu-button-font-family` / `-font-size` (16px) — graisse `--typography-font-weight-medium` dans tous les états, disabled compris (style Figma `label/md-medium`, aligné le 2026-11-02)

## Règles d'usage

- Layout : flex row, `width: 100%` (responsive — remplit le `DropdownMenu`), hauteur fixe via `--sizing-x10`
- `hoverLabel` : remplace visuellement `children` au survol. Le libellé est **toujours** annoncé aux lecteurs d'écran à la suite de `children` (« Vinci, Showcase à venir »), car un bouton désactivé n'est pas focalisable et le survol n'existe ni au clavier ni au toucher
- `rightIcon` : l'icône suit la couleur du texte (gris au repos, couleur de marque au survol). Le booléen Figma `Right Icon` n'est relié à aucun calque (incohérence signalée le 2026-11-04)
- `company` accepte toutes les valeurs de `LogoCompany` (voir `LogoCompanies`), mais l'accent couleur ne s'applique qu'à `odaptos`/`bpce`/`ibp`
- **Sous le breakpoint (mobile)** : la version desktop est conservée telle quelle. La variante Figma `Viewport=mobile` n'est pas implémentée (décision de Damien, 2026-11-07) — aucune media query dans le CSS du composant

## Tests

29 tests — 29 passants
