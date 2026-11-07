import figma from "@figma/code-connect";
import { MenuButton, type MenuButtonVariant, type MenuButtonMode, type MenuButtonSize } from "./MenuButton";

/**
 * Code Connect — MenuButton
 * Composant Figma : node 1345:21426
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Type          → variant     (contained | outlined)
 *   Mode          → mode        (default | light | dark — dark = contour blanc, fond sombre)
 *   Size          → size        (sm | nm | md)
 *   State         → interne     (géré via CSS :hover, jamais exposé)
 *   Viewport      → aucun       (l'adaptation mobile passe par le CSS, décision 2026-11-07)
 */
figma.connect(
  MenuButton,
  "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=1345-21426",
  {
    props: {
      variant: figma.enum("Type", {
        contained: "contained",
        outlined: "outlined",
      }),
      mode: figma.enum("Mode", {
        default: "default",
        light: "light",
        dark: "dark",
      }),
      size: figma.enum("Size", {
        sm: "sm",
        nm: "nm",
        md: "md",
      }),
      children: figma.string("Label"),
    },
    example: ({ variant, mode, size, children }: { variant: MenuButtonVariant; mode: MenuButtonMode; size: MenuButtonSize; children: string }) => (
      <MenuButton variant={variant} mode={mode} size={size}>
        {children}
      </MenuButton>
    ),
  }
);
