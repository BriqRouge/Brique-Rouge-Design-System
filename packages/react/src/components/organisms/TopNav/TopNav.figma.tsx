import figma from "@figma/code-connect";
import { TopNav } from "./TopNav";

/**
 * Code Connect — TopNav
 * Composant Figma : node 1702:20362
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   Type=homepage → aucune prop
 *   Type=<projet> → project
 *   Titre « Projet — accroche » → title / subtitle à fournir : Figma n'a qu'un texte
 *   Menu « Sélection projets » → children à fournir
 */
figma.connect(TopNav, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=1702-20362", {
  variant: { Type: "homepage" },
  example: () => <TopNav />,
});

figma.connect(TopNav, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=1702-20362", {
  props: {
    project: figma.enum("Type", {
      odaptos: "odaptos",
      bpce: "bpce",
      ibp: "ibp",
      "opco-atlas": "opco-atlas",
      "conseil-constitutionnel": "conseil-constitutionnel",
    }),
  },
  example: ({ project }) => (
    <TopNav project={project} title="Nom du projet" subtitle="Accroche">
      <>{/* DropdownMenuButton des autres projets */}</>
    </TopNav>
  ),
});
