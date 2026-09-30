# DropdownMenuTrigger

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/organisms/DropdownMenuTrigger/`
**Commit :** `1d457c9`
**Fichiers :** `DropdownMenuTrigger.tsx`, `DropdownMenuTrigger.module.css`, `DropdownMenuTrigger.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/DropdownMenuTrigger.stories.tsx`

## API

```ts
type MenuButtonVariant     = 'contained' | 'outlined';
type MenuButtonColorScheme = 'default' | 'light' | 'dark';
type MenuButtonSize        = 'nm' | 'md';

interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children:         React.ReactNode;        // requis — contenu du menu (ex: <DropdownMenu><DropdownMenuButton /></DropdownMenu>)
  triggerLabel:     string;                 // requis
  triggerLeftIcon?: React.ReactNode;
  triggerRightIcon?: React.ReactNode;
  triggerVariant?:  MenuButtonVariant;      // défaut: 'contained'
  triggerColorScheme?: MenuButtonColorScheme; // défaut: 'default'
  triggerSize?:     MenuButtonSize;         // défaut: 'nm'
  open?:            boolean;                // mode contrôlé
  onOpenChange?:    (open: boolean) => void;
}
```

**Types exportés :** `DropdownMenuTriggerProps`
**data-attributes :** `data-state` (`open`|`closed`)

## Composition

Réutilise `MenuButton` (atome, pour le trigger) et `DropdownMenu` (molécule, pour le conteneur de menu) — ne pas dupliquer leur logique.

## Comportement

- **État** : géré en interne (uncontrolled) ou via `open`/`onOpenChange` (controlled)
- **Interactions** :
  - `mouseenter` container → ouvre immédiatement
  - `mouseleave` container → ferme après **150ms** (timer annulable si re-enter avant expiration)
  - `onFocus` trigger → ouvre (accessibilité clavier, WCAG 1.4.13)
  - `onBlur` container → ferme après 150ms si le focus quitte la zone
  - Clic trigger → ouvre uniquement (**pas de toggle** — évite la fermeture accidentelle en hover)
  - Escape / clic extérieur → fermeture immédiate, timer annulé
- **Dead zone** : inexistante — le `gap: 4px` entre trigger et menu est à l'intérieur du container ; `mouseenter`/`mouseleave` sont écoutés sur le container, pas sur les enfants
- **Animation** : rendu permanent du menu piloté par `aria-hidden` (pas de montage/démontage React). Entrée 200ms `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out), sortie 120ms `cubic-bezier(0.4, 0, 1, 1)` (ease-in). `opacity` + `translateY(-6px→0)`. `visibility` délayée pour exclure le menu fermé du tab order et des lecteurs d'écran
- **Layout** : inline-flex column, gap 4px, position relative

## Tests

24 tests — 24 passants
