// packages/tokens/contrast-pairs.config.js
//
// Combinaisons de couleurs contrôlées par scripts/contrast-audit.mjs (CI, job Lint).
// Chaque paire décrit un usage RÉEL d'un composant (`where`) : un texte (`fg`) posé
// sur un fond (`bg`). Chemins complets dans tokens.json, collection comprise.
//   kind 'text' (défaut) : 4,5:1 — kind 'ui' (bordure, icône) : 3:1
// Les états désactivés sont exemptés par WCAG 1.4.3 : ne pas les déclarer.
// Une paire dont un token appartient à la collection `project` est contrôlée
// pour chaque projet (mode).
//
// Règle : toute nouvelle combinaison texte/fond dans un composant s'ajoute ici,
// dans la même PR (voir le skill /sync-component).

const PAGE = 'semantic/color/background/page';
const SURFACE = 'semantic/color/background/surface';
const SURFACE_RAISED = 'semantic/color/background/surface-raised';
// Fond sombre de référence pour les variantes « sur fond foncé » (Link theme=dark,
// MenuButton outlined mode=dark, Badge outlined) : le DS n'a pas de token de fond
// sombre, ces composants se posent sur un visuel ou une couleur de projet.
const DARK = 'primitive/color/neutral/900';
const T = (name) => `semantic/color/text/${name}`;
const S = (name) => `semantic/color/${name}`;

export default {
  page: PAGE,

  pairs: [
    // ─── Échelle globale (ADR-001, lot 4) ───────────────────────────────────
    ...['primary', 'secondary', 'tertiary', 'accent', 'info', 'warning', 'success', 'danger'].map((n) => ({
      fg: T(n), bg: PAGE, where: 'texte global sur la page',
    })),
    // `tertiary` n'est autorisé que sur la page (4,35:1 sur surface) : non déclaré sur SURFACE.
    { fg: T('primary'), bg: SURFACE, where: 'texte global sur une surface' },
    { fg: T('secondary'), bg: SURFACE, where: 'texte global sur une surface' },

    // ─── Button ─────────────────────────────────────────────────────────────
    { fg: T('button/primary/idle'), bg: S('button/primary'), where: 'Button primary' },
    { fg: T('button/primary/hover'), bg: S('button/primary-hover'), where: 'Button primary :hover' },
    ...['info', 'warning', 'success', 'error'].flatMap((s) => [
      { fg: T('button/primary/idle'), bg: S(`button/${s}`), where: `Button primary ${s}` },
      { fg: T('button/primary/idle'), bg: S(`button/${s}-hover`), where: `Button primary ${s} :hover` },
      { fg: T('button/secondary/hover'), bg: S(`button/${s}-hover`), where: `Button secondary ${s} :hover` },
      { fg: T(`button/secondary-${s}/idle`), bg: PAGE, where: `Button secondary ${s}` },
      { fg: S(`button/${s}`), bg: PAGE, kind: 'ui', where: `bordure Button secondary ${s}` },
    ]),
    { fg: T('button/secondary/idle'), bg: PAGE, where: 'Button secondary' },
    { fg: T('button/secondary/hover'), bg: S('button/secondary-hover'), where: 'Button secondary :hover' },
    { fg: S('border/button/secondary'), bg: PAGE, kind: 'ui', where: 'bordure Button secondary' },
    { fg: T('button/tertiary/idle'), bg: PAGE, where: 'Button tertiary' },
    { fg: T('button/tertiary/hover'), bg: PAGE, where: 'Button tertiary :hover' },
    { fg: T('button/tertiary/focus'), bg: PAGE, where: 'Button tertiary :focus-visible' },

    // ─── MenuButton ─────────────────────────────────────────────────────────
    { fg: T('menu-button/contained/idle'), bg: S('menu-button/idle'), where: 'MenuButton contained' },
    { fg: T('menu-button/outlined-light/idle'), bg: PAGE, where: 'MenuButton outlined light' },
    { fg: T('menu-button/outlined-light/hover'), bg: S('menu-button/hovered-black'), where: 'MenuButton outlined light :hover/:focus' },
    { fg: T('menu-button/outlined-dark/idle'), bg: DARK, where: 'MenuButton outlined dark (fond sombre)' },
    { fg: T('menu-button/outlined-dark/hover'), bg: S('menu-button/hovered'), where: 'MenuButton outlined dark :hover/:focus' },

    // ─── Link ───────────────────────────────────────────────────────────────
    { fg: T('inverse'), bg: DARK, where: 'Link theme=dark, Badge outlined' },
    { fg: T('inverse-secondary'), bg: DARK, where: 'Link theme=dark :hover' },

    // ─── Badge, Tag ─────────────────────────────────────────────────────────
    { fg: T('primary'), bg: 'primitive/color/neutral/100', where: 'Badge contained' },
    { fg: T('primary'), bg: SURFACE_RAISED, where: 'Tag' },

    // ─── AlertBanner ────────────────────────────────────────────────────────
    ...['info', 'warning'].flatMap((t) => [
      { fg: T(`notification/${t}/message`), bg: S(`background/notification/${t}`), where: `AlertBanner ${t} (titre, description)` },
      { fg: T(`notification/${t}/timestamp`), bg: S(`background/notification/${t}`), where: `AlertBanner ${t} (horodatage)` },
      { fg: S(`icon/notification/${t}`), bg: S(`background/notification/${t}`), kind: 'ui', where: `AlertBanner ${t} (icône)` },
      { fg: S(`icon/notification/${t}-close`), bg: S(`background/notification/${t}`), kind: 'ui', where: `AlertBanner ${t} (fermer)` },
    ]),

    // ─── DropdownMenuButton ─────────────────────────────────────────────────
    { fg: T('tertiary'), bg: SURFACE_RAISED, where: 'DropdownMenuButton :hover neutre' },
    { fg: 'project/color/text/project/on-subtle', bg: 'project/color/background/project/subtle', where: 'DropdownMenuButton :hover par projet' },

    // ─── TopNav, cartes ─────────────────────────────────────────────────────
    { fg: 'project/color/text/project/on-accent', bg: 'project/color/background/project/accent', where: 'TopNav pastille projet' },
    { fg: T('primary'), bg: S('background/projects/body'), where: 'ProjectCardDescription' },
  ],

  // Écarts connus : signalés à chaque exécution sans faire échouer la CI.
  // Chaque entrée a une raison et attend une décision de design (voir l'ADR-001).
  knownIssues: [
    // Relevés par la première exécution du contrôle (2026-11-10), en attente de décision de Damien.
    { fg: T('menu-button/contained/idle'), bg: S('menu-button/idle'), reason: '#737373 sur #f5f5f5 (4,35:1) — à décider' },
    { fg: T('menu-button/outlined-dark/hover'), bg: S('menu-button/hovered'), reason: '#737373 sur #e5e5e5 (3,76:1) — à décider' },
    { fg: T('tertiary'), bg: SURFACE_RAISED, reason: 'DropdownMenuButton survol neutre, #737373 sur #e5e5e5 (3,76:1) — à décider' },
    { fg: S('icon/notification/warning'), bg: S('background/notification/warning'), reason: 'icône #e1742e sur #fdf7ef (2,93:1 < 3:1) — à décider' },
  ],
};
