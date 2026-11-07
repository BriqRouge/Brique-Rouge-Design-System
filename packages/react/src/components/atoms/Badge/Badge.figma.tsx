import figma from "@figma/code-connect";
import { Badge } from "./Badge";

/**
 * Code Connect — Badge
 * Composant Figma : node 184:18566
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Size       → size      (sm | md | lg)
 *   Style      → variant   (contained | outlined)
 *   Left Icon  → leftIcon
 *   Right Icon → rightIcon
 *   Texte « Badge » → children
 */
figma.connect(Badge, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=184-18566", {
  props: {
    size: figma.enum("Size", { sm: "sm", md: "md", lg: "lg" }),
    variant: figma.enum("Style", { contained: "contained", outlined: "outlined" }),
    leftIcon: figma.boolean("Left Icon"),
    rightIcon: figma.boolean("Right Icon"),
    children: figma.textContent("Badge"),
  },
  example: ({ size, variant, leftIcon, rightIcon, children }) => (
    <Badge size={size} variant={variant} leftIcon={leftIcon} rightIcon={rightIcon}>
      {children}
    </Badge>
  ),
});
