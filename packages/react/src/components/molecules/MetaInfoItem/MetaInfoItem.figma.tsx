import figma from "@figma/code-connect";
import { MetaInfoItem } from "./MetaInfoItem";

/**
 * Code Connect — MetaInfoItem
 * Composant Figma : node 797:19440
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Interests → icon et children (contenu propre à chaque intérêt)
 *   State     → interne (survol géré en CSS)
 *   href      → à fournir (lien hors Figma)
 */
figma.connect(MetaInfoItem, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=797-19440", {
  props: {
    icon: figma.enum("Interests", {
      location: figma.children("Environment / Planet"),
      music: figma.children("Logo Companies"),
      "video-game": figma.children("Logo Companies"),
      lecture: figma.children("Interface / Book"),
    }),
    children: figma.enum("Interests", {
      location: figma.textContent("Chill à Champs-Sur-Marne"),
      music: figma.textContent("The Sunshine - New Visionaries..."),
      "video-game": figma.textContent("Dead Cells"),
      lecture: figma.textContent("En train de lire"),
    }),
  },
  example: ({ icon, children }) => (
    <MetaInfoItem href="#" icon={icon}>
      {children}
    </MetaInfoItem>
  ),
});
