import figma from "@figma/code-connect";
import { Button } from "./Button";

/**
 * Code Connect — Button
 * Composant Figma : node 1345:21426
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Type          → variant     (contained | outlined)
 *   Color-scheme  → colorScheme (default | light | dark)
 *   Size          → size        (nm | md)
 *   State         → interne     (géré via CSS :hover, jamais exposé)
 */
figma.connect(
  Button,
  "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=1345-21426",
  {
    props: {
      variant: figma.enum("Type", {
        contained: "contained",
        outlined: "outlined",
      }),
      colorScheme: figma.enum("Color-scheme", {
        default: "default",
        light: "light",
        dark: "dark",
      }),
      size: figma.enum("Size", {
        nm: "nm",
        md: "md",
      }),
      children: figma.string("Label"),
    },
    example: ({ variant, colorScheme, size, children }) => (
      <Button variant={variant} colorScheme={colorScheme} size={size}>
        {children}
      </Button>
    ),
  }
);
