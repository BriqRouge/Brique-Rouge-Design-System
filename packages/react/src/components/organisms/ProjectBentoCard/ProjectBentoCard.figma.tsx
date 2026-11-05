import figma from "@figma/code-connect";
import { ProjectBentoCard } from "./ProjectBentoCard";

/**
 * Code Connect — ProjectBentoCard
 * Composant Figma : node 2032:20121
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Project → project
 *   State   → interne (survol géré en CSS)
 *   Macbook Pro → children
 */
figma.connect(ProjectBentoCard, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2032-20121", {
  props: {
    project: figma.enum("Project", {
      odaptos: "odaptos",
      ibp: "ibp",
      bpce: "bpce",
      cv: "cv",
      "conseil-constitutionnel": "conseil-constitutionnel",
    }),
    children: figma.children("Macbook Pro"),
  },
  example: ({ project, children }) => <ProjectBentoCard project={project}>{children}</ProjectBentoCard>,
});
