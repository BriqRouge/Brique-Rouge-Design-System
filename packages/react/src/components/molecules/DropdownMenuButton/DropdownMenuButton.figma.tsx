import figma from "@figma/code-connect";
import { DropdownMenuButton } from "./DropdownMenuButton";

/**
 * Code Connect — DropdownMenuButton
 * Composant Figma : node 370:19497
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Company    → company   (none = sans logo)
 *   Type       → activated (activated | deactivated)
 *   Right Icon → rightIcon
 *   State      → interne (survol géré en CSS)
 *   Texte « Company Name » → children
 */
figma.connect(DropdownMenuButton, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=370-19497", {
  props: {
    company: figma.enum("Company", {
      none: undefined,
      odaptos: "odaptos",
      bpce: "bpce",
      ibp: "ibp",
      "conseil-constitutionnel": "conseil-constitutionnel",
      vinci: "vinci",
    }),
    activated: figma.enum("Type", { activated: true, deactivated: false }),
    rightIcon: figma.boolean("Right Icon"),
    children: figma.textContent("Company Name"),
  },
  example: ({ company, activated, rightIcon, children }) => (
    <DropdownMenuButton company={company} activated={activated} rightIcon={rightIcon}>
      {children}
    </DropdownMenuButton>
  ),
});
