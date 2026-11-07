import figma from "@figma/code-connect";
import { DropdownMenuTrigger } from "./DropdownMenuTrigger";

/**
 * Code Connect — DropdownMenuTrigger
 * Composant Figma : node 379:18464
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   State      → open (closed | open)
 *   MenuButton → triggerLabel, triggerVariant, triggerColorScheme, triggerSize
 *   DropdownMenu → children
 */
figma.connect(DropdownMenuTrigger, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=379-18464", {
  props: {
    open: figma.enum("State", { closed: false, open: true }),
    trigger: figma.nestedProps("MenuButton", {
      label: figma.textContent("Sélection projets"),
      variant: figma.enum("Type", { contained: "contained", outlined: "outlined" }),
      colorScheme: figma.enum("Color-scheme", { default: "default", light: "light", dark: "dark" }),
      size: figma.enum("Size", { nm: "nm", md: "md" }),
    }),
    children: figma.children("DropdownMenu"),
  },
  example: ({ open, trigger, children }) => (
    <DropdownMenuTrigger
      open={open}
      triggerLabel={trigger.label}
      triggerVariant={trigger.variant}
      triggerColorScheme={trigger.colorScheme}
      triggerSize={trigger.size}
    >
      {children}
    </DropdownMenuTrigger>
  ),
});
