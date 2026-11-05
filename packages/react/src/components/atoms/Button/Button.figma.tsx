import figma from "@figma/code-connect";
import { Button } from "./Button";

/**
 * Code Connect — Button
 * Composant Figma : node 1506:20751
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Variant      → variant     (primary | secondary | tertiary)
 *   Color-scheme → colorScheme (neutral | info | warning | success | error)
 *   State        → disabled    (disabled) ; idle/hovered/focus gérés en CSS
 *   Texte « Découvrir » → children
 *   Icon Left / Icon Right → non mappés : le DS n'a pas de composant Icon
 */
figma.connect(Button, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=1506-20751", {
  props: {
    variant: figma.enum("Variant", { primary: "primary", secondary: "secondary", tertiary: "tertiary" }),
    colorScheme: figma.enum("Color-scheme", {
      neutral: "neutral",
      info: "info",
      warning: "warning",
      success: "success",
      error: "error",
    }),
    disabled: figma.enum("State", { disabled: true }),
    children: figma.textContent("Découvrir"),
  },
  example: ({ variant, colorScheme, disabled, children }) => (
    <Button variant={variant} colorScheme={colorScheme} disabled={disabled}>
      {children}
    </Button>
  ),
});
