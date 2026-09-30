# AlertBanner

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/molecules/AlertBanner/`
**Node Figma :** `755:21871` ("Notifications / Alert Banners")
**Fichiers :** `AlertBanner.tsx`, `AlertBanner.module.css`, `AlertBanner.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/AlertBanner.stories.tsx`

## API

```ts
type AlertBannerType = 'info' | 'warning';

interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title:        string;             // requis — titre en gras
  type?:        AlertBannerType;    // default: 'info'
  timestamp?:   string;             // ex: "Il y a 5 min."
  description?: string;
  onClose?:     () => void;         // affiche le bouton de fermeture si fourni
  children?:    React.ReactNode;    // CTA optionnels — typiquement des <Button />
}
```

**Types exportés :** `AlertBannerProps`, `AlertBannerType`
**data-component :** `ds-br-alert-banner`
**data-attributes :** `data-type`

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-background-notification-info` | `#f0f4fe` | Fond, type info |
| `--color-background-notification-warning` | `#fdf7ef` | Fond, type warning |
| `--color-border-notification-info` | `#6c95ee` | Bordure, type info |
| `--color-border-notification-warning` | `#e68c47` | Bordure, type warning |
| `--color-text-notification-info` | `#2c41c9` | Texte titre + description, info |
| `--color-text-notification-warning` | `#af471f` | Texte titre + description, warning |
| `--color-text-notification-info-timestamp` | `#567be9` | Texte horodatage, info |
| `--color-text-notification-warning-timestamp` | `#e1742e` | Texte horodatage, warning |
| `--color-icon-notification-info` | `#3453dc` | Icône d'en-tête, info |
| `--color-icon-notification-warning` | `#e1742e` | Icône d'en-tête, warning |
| `--color-icon-notification-info-close` | `#263282` | Bouton de fermeture, info |
| `--color-icon-notification-warning-close` | `#71311d` | Bouton de fermeture, warning |
| `--border-radius-lg` | `12px` | Border-radius de la carte |
| `--spacing-x4` | `16px` | Padding de la carte |
| `--spacing-x2` | `8px` | Gap entre header/description/CTA |
| `--spacing-x1` | `4px` | Gap dans le header (icône/titre/horodatage/fermeture) |

## Règles d'usage

- `title` est la seule prop requise — `timestamp`, `description`, `onClose` (bouton fermeture) et `children` (CTA) sont tous optionnels et n'affichent leur zone respective que s'ils sont fournis
- **Composition** : les CTA sont fournis par le consommateur via `children` (typiquement des `<Button colorScheme="info|warning" />`) — AlertBanner ne connaît pas leur contenu, cohérent avec le pattern déjà établi par `TopNav`
- Largeur 100% (responsive) — contrairement au frame Figma fixé à 641px ; hauteur automatique
- Icônes (`InfoIcon`/`WarningIcon`/`CloseIcon`) dessinées à la main en SVG inline (`currentColor`), cohérent avec la convention déjà établie par `TopNav` — pas d'assets Figma exportés (nécessaire pour la recoloration par type)
- **Écart signalé vs Figma** (validé par Damien) : le contenu du Figma est du lorem ipsum générique avec des icônes de boutons placeholder (téléchargement/mail) — le composant expose donc `leftIcon`/`rightIcon`/label entièrement personnalisables via `Button`, rien n'est figé en dur

## Tests

15 tests — 15 passants
