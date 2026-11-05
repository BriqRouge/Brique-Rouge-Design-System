import figma from "@figma/code-connect";
import { Link } from "./Link";

/**
 * Code Connect — Link
 * Composant Figma : node 2326:37384
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Size  → size     (sm | md | lg)
 *   Theme → theme    (light | dark)
 *   State → disabled (disabled) ; idle/hovered/focus gérés en CSS
 *   Label → children
 *   Left/Right Icon (+ Swap) → non mappés : le DS n'a pas de composant Icon
 */
figma.connect(Link, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2326-37384", {
  props: {
    size: figma.enum("Size", { sm: "sm", md: "md", lg: "lg" }),
    theme: figma.enum("Theme", { light: "light", dark: "dark" }),
    disabled: figma.enum("State", { disabled: true }),
    children: figma.string("Label"),
  },
  example: ({ size, theme, disabled, children }) => (
    <Link href="#" size={size} theme={theme} disabled={disabled}>
      {children}
    </Link>
  ),
});
