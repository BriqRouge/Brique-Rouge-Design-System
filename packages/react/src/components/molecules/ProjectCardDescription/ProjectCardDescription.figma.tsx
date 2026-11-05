import figma from "@figma/code-connect";
import { ProjectCardDescription } from "./ProjectCardDescription";

/**
 * Code Connect — ProjectCardDescription
 * Composant Figma : node 2040:19251
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Type=default → project, year, category, children
 *   Type=cv      → variant="cv", children
 */
figma.connect(ProjectCardDescription, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2040-19251", {
  variant: { Type: "default" },
  props: {
    project: figma.textContent("Odaptos"),
    year: figma.textContent("2024"),
    category: figma.textContent("Product Design"),
    children: figma.textContent("Refonte de la plateforme  AI-SaaS"),
  },
  example: ({ project, year, category, children }) => (
    <ProjectCardDescription project={project} year={year} category={category}>
      {children}
    </ProjectCardDescription>
  ),
});

figma.connect(ProjectCardDescription, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2040-19251", {
  variant: { Type: "cv" },
  props: {
    children: figma.textContent("CV"),
  },
  example: ({ children }) => <ProjectCardDescription variant="cv">{children}</ProjectCardDescription>,
});
