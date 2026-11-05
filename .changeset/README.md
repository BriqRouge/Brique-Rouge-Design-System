# Changesets

Chaque PR qui change un package publiable (`@brique-rouge/tokens`, `@brique-rouge/react`)
ajoute un fichier de changement : `pnpm changeset`. Voir `CONTRIBUTING.md`.

Les packages restent privés : `pnpm changeset version` met à jour les numéros de
version et les `CHANGELOG.md`, sans rien publier sur npm.
