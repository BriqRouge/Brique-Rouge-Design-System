# Contribuer au Design System Brique Rouge

Ce guide décrit comment proposer une modification. Les règles détaillées (conventions
de code, workflow composant, accessibilité) vivent dans [`CLAUDE.md`](CLAUDE.md) ; ce
fichier en donne le parcours.

## Principe : Figma d'abord

**Figma est la source de vérité** (fichier `figma.fileKey` de `ds.config.json`).

- Un token se crée ou se modifie **dans les Variables Figma**, puis `/sync-tokens`
  régénère `packages/tokens/tokens.json`. Ne jamais éditer `tokens.json` à la main.
- Un composant reproduit exactement son composant Figma : variantes, états, tailles,
  tokens. Une incohérence Figma se **signale**, elle ne se corrige pas d'office dans
  le code.
- Les décisions de design appartiennent à la personne responsable du design
  (`governance.designOwner` de `ds.config.json`).

## Installer

```bash
pnpm install
pnpm tokens          # génère les variables CSS
pnpm dev             # Storybook sur http://localhost:6007
```

Prérequis : Node ≥ 24, pnpm ≥ 12. Pour les scripts Figma, un token Figma en lecture
seule dans `.env` (voir `.env.example`) — jamais committé.

## Parcours d'une modification

1. **Branche** depuis `main` à jour : `feat/component-<nom>`, `feat/screens-<nom>`,
   `fix/…` ou `chore/…`. `main` est protégée : tout passe par une PR.
2. **Figma** : lire le composant et **toutes** ses variantes et états avant de coder
   (`CLAUDE.md`, « Étape 0 »). Avec Claude Code : `/sync-component <Nom>` pour un
   composant existant, `/sync-ds` pour tout ce qui a changé.
3. **Code** dans `packages/react/src/components/{atoms,molecules,organisms}/<Nom>/` :
   `forwardRef`, `displayName`, `data-component="ds-br-<nom>"`, CSS Modules avec
   tokens uniquement, TypeScript strict sans `any`.
4. **Tests** (Vitest + Testing Library + jest-axe) : chaque état et variante, et
   l'accessibilité.
5. **Story** `Atomes|Molécules|Organismes/<Nom>`, documentée en français.
6. **Fiche** `specs/<tier>/<Nom>.md` (en-tête YAML obligatoire) et une ligne dans
   `COMPONENTS.md`.
7. **Changeset** : `pnpm changeset` (voir ci-dessous).
8. **Contrôles** en local, puis PR vers `main`.

## Changesets — versions et CHANGELOG

Chaque PR qui modifie `@brique-rouge/tokens` ou `@brique-rouge/react` ajoute un
fichier de changement :

```bash
pnpm changeset
```

Choisir les packages concernés et le niveau :

| Niveau | Quand |
|---|---|
| `patch` | Correction sans changement d'API ni de rendu voulu (bug, accessibilité, doc) |
| `minor` | Ajout : nouveau composant, nouvelle prop, nouveau token, nouvel état |
| `major` | Rupture : prop ou token supprimé ou renommé, changement de rendu d'un composant existant |

La description, en français, dit ce qui change pour qui utilise le package. Une PR
qui ne touche que Storybook, les specs, les scripts ou la CI n'a pas besoin de
changeset (`@brique-rouge/storybook` est ignoré).

Pour préparer une version : `pnpm version-packages` met à jour les numéros de
version et les `CHANGELOG.md`, dans une PR dédiée. Les packages sont privés : rien
n'est publié sur npm.

## Contrôles avant la PR

```bash
pnpm turbo run lint
pnpm test
node scripts/token-audit.mjs        # aucune couleur en dur
node scripts/check-specs.mjs        # composants ↔ fiches specs
node scripts/figma-sync-ds.mjs lint # conventions Figma (token Figma requis)
```

La CI relance lint et tests sur chaque PR : les deux doivent passer avant le merge.

## Règles non négociables

- Accessibilité WCAG 2.1 AA : clavier, focus visible, ARIA, contrastes
- Aucune valeur arbitraire si un token existe (code **et** Figma)
- Pas de `dangerouslySetInnerHTML`, pas de Tailwind, pas de dépendance non validée
- Ne jamais supprimer un test existant
- Ne jamais pousser sur `main`, ne jamais forcer un push
