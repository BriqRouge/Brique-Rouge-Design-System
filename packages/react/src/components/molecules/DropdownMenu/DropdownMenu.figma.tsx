import figma from "@figma/code-connect";
import { DropdownMenu } from "./DropdownMenu";

/**
 * Code Connect — DropdownMenu
 * Composant Figma : node 375:19690
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Company 1…5 → visibilité des items
 *   Instances DropdownMenuButton → children
 */
figma.connect(DropdownMenu, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=375-19690", {
  props: {
    children: figma.children("DropdownMenuButton"),
  },
  example: ({ children }) => <DropdownMenu>{children}</DropdownMenu>,
});
