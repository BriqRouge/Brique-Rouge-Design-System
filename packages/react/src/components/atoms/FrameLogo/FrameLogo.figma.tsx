import figma from "@figma/code-connect";
import { FrameLogo } from "./FrameLogo";

/**
 * Code Connect — FrameLogo
 * Composant Figma : node 370:19490
 * Fichier Figma   : NZtxQVYKRqeaGcC7hT5pjw
 *
 * Mapping des propriétés Figma → props React :
 *   type → aucune prop (une seule variante)
 *   Image du logo → src (à fournir : asset hors Figma)
 */
figma.connect(FrameLogo, "https://www.figma.com/design/NZtxQVYKRqeaGcC7hT5pjw?node-id=370-19490", {
  example: () => <FrameLogo src="/logo.svg" alt="" />,
});
