import figma from "@figma/code-connect";
import { LogoCompanies } from "./LogoCompanies";

/**
 * Code Connect — LogoCompanies
 * Composant Figma : node 375:19574
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Company → company (8 logos)
 *   Size    → size    (32 | 16 | 12 | 8)
 */
figma.connect(LogoCompanies, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=375-19574", {
  props: {
    company: figma.enum("Company", {
      "squared-icon": "squared-icon",
      odaptos: "odaptos",
      "conseil-constitutionnel": "conseil-constitutionnel",
      bpce: "bpce",
      ibp: "ibp",
      vinci: "vinci",
      tidal: "tidal",
      steam: "steam",
    }),
    size: figma.enum("Size", { "32": 32, "16": 16, "12": 12, "8": 8 }),
  },
  example: ({ company, size }) => <LogoCompanies company={company} size={size} />,
});
