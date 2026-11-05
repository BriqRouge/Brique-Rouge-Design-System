import figma from "@figma/code-connect";
import { MacbookMockup } from "./MacbookMockup";

/**
 * Code Connect — MacbookMockup
 * Composant Figma : node 537:19720
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Style / Model → aucune prop (le code rend le modèle shaded 13in)
 *   Calque « Paste your design here » → children
 */
figma.connect(MacbookMockup, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=537-19720", {
  props: {
    children: figma.children("Paste your design here"),
  },
  example: ({ children }) => <MacbookMockup>{children}</MacbookMockup>,
});
