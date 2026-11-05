import figma from "@figma/code-connect";
import { ProjectSectionsDescription } from "./ProjectSectionsDescription";

/**
 * Code Connect — ProjectSectionsDescription
 * Composant Figma : node 744:20765
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Display Title     → title
 *   -----Devider----- → divider
 *   Section 1 / 2     → children (instances Project_Section_Description)
 */
figma.connect(ProjectSectionsDescription, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=744-20765", {
  props: {
    title: figma.boolean("Display Title", { true: figma.textContent("Design system"), false: undefined }),
    divider: figma.boolean("-----Devider-----"),
    children: figma.children("Cards / Project_Section_Description"),
  },
  example: ({ title, divider, children }) => (
    <ProjectSectionsDescription title={title} divider={divider}>
      {children}
    </ProjectSectionsDescription>
  ),
});
