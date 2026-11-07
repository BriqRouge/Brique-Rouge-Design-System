import figma from "@figma/code-connect";
import { Tag } from "./Tag";

/**
 * Code Connect — Tag
 * Composant Figma : node 184:18522
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Size       → size      (sm | nm | md | lg)
 *   Style      → variant   (contained | outlined)
 *   Left Icon  → leftIcon
 *   Right Icon → rightIcon
 *   Texte « Tag » → children
 */
figma.connect(Tag, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=184-18522", {
  props: {
    size: figma.enum("Size", { sm: "sm", nm: "nm", md: "md", lg: "lg" }),
    variant: figma.enum("Style", { contained: "contained", outlined: "outlined" }),
    leftIcon: figma.boolean("Left Icon"),
    rightIcon: figma.boolean("Right Icon"),
    children: figma.textContent("Tag"),
  },
  example: ({ size, variant, leftIcon, rightIcon, children }) => (
    <Tag size={size} variant={variant} leftIcon={leftIcon} rightIcon={rightIcon}>
      {children}
    </Tag>
  ),
});
