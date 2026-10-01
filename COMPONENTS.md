# COMPONENTS.md — Index des composants

> Ce fichier est la référence pour Claude Code lors de la génération
> de composants et d'interfaces. Il est mis à jour à chaque nouveau
> composant validé dans le Design System.

## Comment utiliser ce fichier

Ce fichier liste les composants disponibles dans le Design System. Pour chacun,
l'API complète (props, variants, états), les tokens CSS utilisés et les règles
d'usage détaillées vivent dans un fichier dédié sous `specs/{atoms,molecules,organisms}/`.

Claude Code lit ce fichier avant toute implémentation, puis ouvre le fichier
`specs/` du composant concerné pour le détail.

## Atomes

Élément indivisible (bouton, logo, icône).

| Composant | Description | Spec |
|---|---|---|
| `Button` | Bouton principal du DS (primary/secondary/tertiary) | [specs/atoms/Button.md](specs/atoms/Button.md) |
| `MenuButton` | Bouton de menu/navigation (contained/outlined) | [specs/atoms/MenuButton.md](specs/atoms/MenuButton.md) |
| `FrameLogo` | Conteneur de logo avec ombre portée | [specs/atoms/FrameLogo.md](specs/atoms/FrameLogo.md) |
| `LogoCompanies` | Logo d'entreprise (8 variantes) | [specs/atoms/LogoCompanies.md](specs/atoms/LogoCompanies.md) |
| `MacbookMockup` | Mockup d'ordinateur portable pour capture d'écran | [specs/atoms/MacbookMockup.md](specs/atoms/MacbookMockup.md) |

## Molécules

Assemble des atomes en une unité fonctionnelle précise.

| Composant | Description | Spec |
|---|---|---|
| `AlertBanner` | Bandeau de notification (info/warning) | [specs/molecules/AlertBanner.md](specs/molecules/AlertBanner.md) |
| `DropdownMenu` | Conteneur de menu déroulant | [specs/molecules/DropdownMenu.md](specs/molecules/DropdownMenu.md) |
| `DropdownMenuButton` | Item de menu déroulant (logo + texte + icône) | [specs/molecules/DropdownMenuButton.md](specs/molecules/DropdownMenuButton.md) |
| `ProjectCardDescription` | Bloc titre/année/catégorie d'un projet | [specs/molecules/ProjectCardDescription.md](specs/molecules/ProjectCardDescription.md) |
| `ProjectOverview` | En-tête de page projet (titre, description, rôle, contributions) | [specs/molecules/ProjectOverview.md](specs/molecules/ProjectOverview.md) |

## Organismes

Compose au moins une molécule et/ou plusieurs atomes/organismes pour former une section d'interface complète.

| Composant | Description | Spec |
|---|---|---|
| `DropdownMenuTrigger` | Trigger + menu déroulant complet (hover/focus/clavier) | [specs/organisms/DropdownMenuTrigger.md](specs/organisms/DropdownMenuTrigger.md) |
| `TopNav` | Barre de navigation supérieure | [specs/organisms/TopNav.md](specs/organisms/TopNav.md) |
| `ProjectBentoCard` | Carte projet de la grille bento (survol, agrandissement) | [specs/organisms/ProjectBentoCard.md](specs/organisms/ProjectBentoCard.md) |
| `ProjectSectionDescription` | Section numérotée (titre, texte, puces, bandeau d'alerte optionnel) | [specs/organisms/ProjectSectionDescription.md](specs/organisms/ProjectSectionDescription.md) |
| `ProjectSectionsDescription` | Carte conteneur empilant plusieurs sections avec séparateurs | [specs/organisms/ProjectSectionsDescription.md](specs/organisms/ProjectSectionsDescription.md) |
