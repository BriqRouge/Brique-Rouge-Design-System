import figma from "@figma/code-connect";
import { ProjectSectionDescription } from "./ProjectSectionDescription";

/**
 * Code Connect — ProjectSectionDescription
 * Composant Figma : node 2248:28967
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Header       → number
 *   Subtitle     → title
 *   Lead Text    → children
 *   Bullet points list / Bullet Point 1…4 → bulletPoints (textes à fournir : 3 calques portent le même nom)
 *   Alert Banner → alertBanner
 */
figma.connect(ProjectSectionDescription, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=2248-28967", {
  props: {
    number: figma.boolean("Header", { true: figma.textContent("01"), false: undefined }),
    title: figma.boolean("Subtitle", { true: figma.textContent("Problème"), false: undefined }),
    children: figma.boolean("Lead Text", {
      true: figma.textContent("Dans le contexte d'une équipe réduite, le produit "),
      false: undefined,
    }),
    bulletPoints: figma.boolean("Bullet points list", { true: ["Point clé"], false: undefined }),
    alertBanner: figma.boolean("Alert Banner", {
      true: figma.children("Notifications / Alert Banners"),
      false: undefined,
    }),
  },
  example: ({ number, title, children, bulletPoints, alertBanner }) => (
    <ProjectSectionDescription number={number} title={title} bulletPoints={bulletPoints} alertBanner={alertBanner}>
      {children}
    </ProjectSectionDescription>
  ),
});
