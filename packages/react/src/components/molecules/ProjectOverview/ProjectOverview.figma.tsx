import figma from "@figma/code-connect";
import { ProjectOverview } from "./ProjectOverview";

/**
 * Code Connect — ProjectOverview
 * Composant Figma : node 2248:55550
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Paragraphe → children
 *   title / tagline / role / contributions → à fournir : Figma les regroupe dans 3 textes (« Odaptos — … », « Rôle: … », « Contribution: … »)
 */
figma.connect(ProjectOverview, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2248-55550", {
  props: {
    children: figma.textContent(
      "Odaptos est une plateforme SaaS qui met à profit l’IA au service de la recherche utilisateur. En tant que founder product designer j’ai joué un rôle pivot en menant la refonte de la plateforme. Derrière cette refonte un enjeu crucial : valider la seconde levée de fonds pour le développement du produit.  Levée de fonds --> 1,5 millions d’euros. Acquisition client --> Un client majeur : PwC."
    ),
  },
  example: ({ children }) => (
    <ProjectOverview title="Nom du projet" tagline="Accroche" role="Rôle" contributions="Contributions">
      {children}
    </ProjectOverview>
  ),
});
