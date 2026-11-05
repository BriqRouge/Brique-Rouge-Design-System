import figma from "@figma/code-connect";
import { BulletBrique } from "./BulletBrique";

/**
 * Code Connect — BulletBrique
 * Composant Figma : node 2131:21897
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   State → interne (survol, focus, clic)
 *   Intitulé → children
 *   Badges de l'état ouvert → keywords (textes à fournir)
 */
figma.connect(BulletBrique, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2131-21897", {
  props: {
    children: figma.textContent("J’apporte de la clarté"),
  },
  example: ({ children }) => <BulletBrique keywords={["Mot-clé"]}>{children}</BulletBrique>,
});
