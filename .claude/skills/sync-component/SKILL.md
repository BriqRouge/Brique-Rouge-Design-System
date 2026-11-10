---
name: sync-component
description: Synchronise un ou plusieurs composants React du DS avec leur composant Figma (fichier `figma.fileKey` de `ds.config.json`) — analyse complète de tous les variants/états, rapport d'écarts validé par la personne responsable du design, puis mise à jour code, tests, story, spec et PR. Utiliser quand la personne responsable du design demande /sync-component <Nom>, de synchroniser ou mettre à jour un composant depuis Figma.
---

# /sync-component — Figma → composant React

Figma est la source de vérité. Ce skill applique le workflow CLAUDE.md « Workflow composants » à un
composant **existant**, en deux temps séparés par une validation humaine :

1. **Lecture seule** — analyse Figma complète + lecture du code → rapport d'écarts
2. **Écriture** — uniquement les écarts validés par la personne responsable du design → PR

Il ne corrige jamais le design de lui-même (CLAUDE.md « Figma est la source de vérité ») : une incohérence Figma est
signalée dans le rapport, implémentée telle quelle si la personne responsable du design le confirme, ou
corrigée **dans Figma** puis on relance.

La personne responsable du design est celle définie dans `ds.config.json`
(`governance.designOwner`) : c'est elle qui valide, ce skill ne tranche jamais.

Usage : `/sync-component <Nom> [<Nom>…]` — `<Nom>` = nom du composant React
(ex: `Tag`, `ProjectBentoCard`). Pour un **nouveau** composant, ce skill ne
s'applique pas : suivre CLAUDE.md « Workflow composants » directement.

## Prérequis

- MCP Figma connecté (`whoami` en cas d'erreur de droits)
- Charger le skill `figma-design-to-code` avant le premier `get_design_context`
- Être sur `main` à jour, sans modifications locales : `git switch main && git pull`
- **Tokens synchronisés d'abord** : si des Variables Figma ont changé, lancer
  `/sync-tokens` et merger sa PR avant. Ce skill ne crée ni ne modifie jamais un
  token.

## Conventions établies (décidées le 2026-11-02)

À appliquer sans redemander. Tout écart à ces conventions dans Figma est une
**incohérence Figma** à signaler (étape 4), pas un changement d'API à reporter.

- **Valeurs de variantes = valeurs des props du code**, en minuscules / kebab-case
  (`Size=sm|nm|md|lg`, `State=idle|hovered|focus|disabled`,
  `Company=conseil-constitutionnel`…). Les noms de propriétés gardent leur casse
  (`Size`, `State`, `Type`).
- **Valeurs par défaut** : le code fait référence. Les défauts Figma (première
  variante du set, booléens à `true`) sont une information, jamais un écart.
- **Typographie** : taille et graisse des textes liées aux variables
  `typography/font-size/*` et `typography/font-weight/*`. Les styles de la police
  variable Favorit correspondent à : Light / Book / Regular → `regular` (400),
  Medium (~571) → `medium` (500), Bold → `bold` (700) ; GT Ultra : Light →
  `light` (300), Black → `black` (900). Une taille liée à une
  variable `spacing/*` est une incohérence. Chaque texte porte un **style de texte
  par rôle** (`display/*`, `heading/*`, `body/*`, `caption`, `eyebrow`, `label/*`,
  et `expressive/*` pour GT Ultra / GT Ultra Median, polices du DS depuis le 2026-11-04) ;
  le code utilise les tokens CSS correspondants (`specs/patterns/typography.md`).
  Un texte sans style est un écart à signaler, pas à corriger d'office.
- **Couleurs** : toute couleur de texte, de fond ou de bordure est liée à une
  variable `color/*`. Une couleur non liée sans token exact est une incohérence.
- **Contraste** : chaque combinaison texte/fond ou icône/fond du composant figure
  dans `packages/tokens/contrast-pairs.config.js`. Une combinaison nouvelle s'y
  ajoute ; si elle échoue, c'est un écart à présenter, pas à corriger d'office.
- **Contenu illustratif** (mockups, logos texte, captures d'écran recomposées,
  polices hors `figma.textFontFamilies` de `ds.config.json`, comme Helvetica) :
  hors périmètre, ignoré.

## Étape 1 — Résoudre la cible

Pour chaque `<Nom>` :

1. Trouver la fiche : `specs/{atoms,molecules,organisms}/<Nom>.md`. Absente →
   s'arrêter : ce n'est pas un composant existant.
2. Lire son en-tête YAML : `figma.node` (composant ou set de la bibliothèque),
   `figma.type`. `node scripts/check-specs.mjs` garantit qu'il est présent et bien
   formé. `figma.type: frame` → le node n'est pas un composant Figma : le signaler
   dans le rapport (étape 4).
3. Node introuvable dans Figma → chercher le composant avec `search_design_system`,
   présenter le(s) candidat(s) à la personne responsable du design et **attendre
   sa confirmation**. Le node confirmé remplacera `figma.node` à l'étape 6.

Plusieurs composants demandés → les traiter **de bas en haut** (atomes, puis
molécules, puis organismes) : un organisme se compare à des molécules déjà à jour.

## Étape 2 — Analyse Figma complète (lecture seule)

Commencer par le lint déterministe des conventions (lecture REST, `FIGMA_TOKEN`) :

```bash
node scripts/figma-sync-ds.mjs lint
```

Ses erreurs et avertissements concernant le composant entrent dans le rapport
(étape 4, « Incohérences Figma »).

`create_session` (`fileKey` : `figma.fileKey` de `ds.config.json`), puis pour chaque node :

1. `get_metadata` sur le node **et sur son parent** (component set de la
   bibliothèque, pas l'instance) → liste exhaustive des variantes
   (`Size=`, `State=`, `Type=`…) avec leurs node IDs.
2. `get_design_context` sur **chaque variante pertinente** — au minimum chaque
   valeur de `State=` (Idle, Hovered, Focus, Pressed, Disabled, Error…) et chaque
   valeur de `Size=`/`Type=`. Jamais uniquement l'état par défaut.
3. `get_variable_defs` → variables Figma réellement liées au composant.
4. `get_motion_context` → animations authored, ou leur absence **confirmée**.
5. `get_screenshot` des variantes principales, pour le rapport.

Pour chaque variable Figma relevée : vérifier que la variable CSS correspondante
existe dans `packages/tokens/build/css/` (après `pnpm --filter @brique-rouge/tokens build`).
Variable absente du build → tokens pas à jour : s'arrêter et proposer `/sync-tokens`.

## Étape 3 — Lecture du code existant

Dans `packages/react/src/components/<tier>/<Nom>/` : `<Nom>.tsx`,
`<Nom>.module.css`, `<Nom>.test.tsx`, `<Nom>.figma.tsx` s'il existe ; la story
`packages/storybook/src/stories/components/<Nom>.stories.tsx` ; la fiche specs.

Lister aussi les **consommateurs** (impact en cascade) :

```bash
grep -rln "<Nom>" packages/react/src packages/storybook/src --include=*.tsx | grep -v "/<Nom>/"
```

## Étape 4 — Rapport d'écarts (avant toute modification)

Présenter à la personne responsable du design un rapport, catégorie par catégorie, **Figma vs code** :

| Catégorie | Figma | Code | Écart |
|---|---|---|---|
| Variants / props | `Size=sm\|md` | `size: 'sm' \| 'md' \| 'lg'` | `lg` absent de Figma |
| États | … | … | … |
| Tailles / layout / spacing | … | … | … |
| Couleurs (tokens) | … | … | … |
| Typographie (tokens) | … | … | … |
| Border-radius / effets | … | … | … |
| Icônes / assets | … | … | … |
| Motion | … | … | … |
| Accessibilité (rôle, nom, focus) | … | … | … |

Puis, séparément :

- **Incohérences Figma repérées** (CLAUDE.md « Figma est la source de vérité ») — signalées, jamais corrigées d'office
  (ex: un état Hovered sans token, une variante orpheline, une valeur hors token)
- **Écarts qui changent l'API React** (prop ajoutée/supprimée/renommée) → impact
  sur les consommateurs listés à l'étape 3
- **Impact rendu** sur les consommateurs

Aucun écart → le dire, ne rien modifier, pas de PR. Fin.

**STOP — attendre la validation de la personne responsable du design**, écart par écart si nécessaire. Ne
toucher à aucun fichier avant.

## Étape 5 — Implémentation (écarts validés uniquement)

- Branche : `feat/sync-component-<nom-kebab>` (plusieurs composants : `feat/sync-components-<AAAA-MM-JJ>`)
- Périmètre strict (CLAUDE.md « Anti-régression ») : uniquement les écarts validés, rien d'autre
- Conventions CLAUDE.md « Conventions composants React » : `children`, `forwardRef`, `displayName`, `data-variant`/`data-size`,
  `:disabled` natif, `data-component="ds-br-<nom>"` conservé
- Tokens uniquement (CLAUDE.md « Génération d'interfaces ») : aucune valeur arbitraire si un token existe
- Prop d'API modifiée → mettre à jour les consommateurs dans la même PR
- `<Nom>.figma.tsx` présent et props modifiées → mettre à jour le mapping Code Connect

Puis, dans l'ordre :

1. **Tests** : les tests existants passent toujours ; ajouter/mettre à jour un test
   par état et variante identifiés à l'étape 2, plus `jest-axe`
2. **Story** : refléter les variantes et états Figma (title `Atomes|Molécules|Organismes/<Nom>`)
3. **Mesure dans Storybook** (Playwright) : pour chaque écart corrigé, vérifier la
   valeur par `getComputedStyle` / `boundingBox()`, avant et après interaction
   (hover, focus, disabled) — pas seulement par capture d'écran

## Étape 6 — Documentation

- `specs/<tier>/<Nom>.md` : API, tokens, variantes, états ; en-tête YAML
  (`figma.node`, `figma.name`, `figma.type`) corrigé si besoin, puis
  `node scripts/check-specs.mjs`
- `COMPONENTS.md` : uniquement si le résumé ou le node changent
- `CLAUDE.md` « Composants existants » : uniquement si le niveau atomic du composant change (même PR)

## Étape 7 — Snapshot et contrôles

Mettre à jour l'empreinte du composant, pour que `/sync-ds` et la détection
nocturne ne le signalent plus comme modifié (lecture REST, `FIGMA_TOKEN` requis) :

```bash
node scripts/figma-sync-ds.mjs update --only <Nom>[,<Nom>…]
```

Puis :

```bash
node scripts/token-audit.mjs
node scripts/contrast-audit.mjs
node --test scripts/figma-sync-ds.test.mjs
pnpm turbo run lint
pnpm test
```

## Étape 8 — PR

- Description : le rapport d'écarts de l'étape 4 (écarts corrigés, écarts écartés
  par la personne responsable du design, incohérences Figma signalées), les mesures de l'étape 5 et les
  contrôles de l'étape 7
- Ne jamais merger : la validation est humaine (CLAUDE.md « Workflow Git »)

## Ce que ce skill ne fait pas

- Pas de création de composant : un nouveau composant suit CLAUDE.md « Workflow composants ».
- Pas de token : création, renommage ou valeur de token → Figma puis `/sync-tokens`.
- Pas de correction du design : une incohérence est signalée, la personne responsable du design tranche.
- Pas de modification sans rapport validé : l'étape 4 est un point d'arrêt obligatoire.
