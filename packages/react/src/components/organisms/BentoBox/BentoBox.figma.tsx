import figma from "@figma/code-connect";
import { BentoBox } from "./BentoBox";

/**
 * Code Connect — BentoBox
 * Composant Figma : node 2049:20632
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Instances Projects-Bento-Cards → children
 */
figma.connect(BentoBox, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2049-20632", {
  props: {
    children: figma.children("Projects-Bento-Cards"),
  },
  example: ({ children }) => <BentoBox>{children}</BentoBox>,
});
