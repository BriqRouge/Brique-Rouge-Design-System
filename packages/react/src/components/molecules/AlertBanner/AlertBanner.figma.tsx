import figma from "@figma/code-connect";
import { AlertBanner } from "./AlertBanner";

/**
 * Code Connect — AlertBanner
 * Composant Figma : node 755:21871
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Type         → type        (info | warning)
 *   Titre        → title
 *   Time stamp   → timestamp
 *   Description  → description
 *   Close button → onClose
 *   CTA          → children (boutons)
 *   Header / Primary / Secondary / Alt Button → couverts par title et children
 */
figma.connect(AlertBanner, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=755-21871", {
  props: {
    type: figma.enum("Type", { info: "info", warning: "warning" }),
    title: figma.textContent("Hipster ipsum tattooed brunch I'm baby."),
    timestamp: figma.boolean("Time stamp", {
      true: figma.textContent("Il y a 5 min."),
      false: undefined,
    }),
    description: figma.boolean("Description", {
      true: figma.textContent("Hipster ipsum tattooed brunch I'm baby. Blue drinking copper brooklyn small beard gentrify."),
      false: undefined,
    }),
    onClose: figma.boolean("Close button", { true: () => {}, false: undefined }),
    children: figma.boolean("CTA", { true: figma.children("Button"), false: undefined }),
  },
  example: ({ type, title, timestamp, description, onClose, children }) => (
    <AlertBanner type={type} title={title} timestamp={timestamp} description={description} onClose={onClose}>
      {children}
    </AlertBanner>
  ),
});
