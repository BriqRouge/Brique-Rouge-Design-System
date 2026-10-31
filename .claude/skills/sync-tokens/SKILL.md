---
name: sync-tokens
description: Synchronise les Figma Variables (fichier NZtxQVYKRqeaGcC7hT5pjw) vers packages/tokens/tokens.json, vérifie le build et ouvre une PR. Utiliser quand Damien demande /sync-tokens, de synchroniser ou mettre à jour les tokens depuis Figma.
---

# /sync-tokens — Figma Variables → tokens.json

Figma est la source de vérité. Ce skill **régénère entièrement** `packages/tokens/tokens.json`
à partir de Figma, puis ouvre une PR. Il ne corrige jamais rien de lui-même : toute
anomalie se corrige **dans Figma**, puis on relance.

Rôle du LLM : orchestrer et recopier. Toute transformation est faite par du code
déterministe et testé (`scripts/figma-sync-tokens.mjs`).

## Prérequis

- MCP Figma connecté (siège Full ou Dev — vérifier avec `whoami` en cas d'erreur de droits)
- Charger le skill `figma-use` avant l'appel à `use_figma`
- Être sur une branche à jour de `main` : `git checkout main && git pull`

## Étapes

### 1. Exporter les variables depuis Figma

Lire `scripts/figma/export-variables.js` et passer son contenu **tel quel** comme `code`
à `use_figma` (`fileKey: NZtxQVYKRqeaGcC7hT5pjw`). Lecture seule.

Le résultat contient `manifest` et `chunks` (morceaux de 60 variables, chacun avec une
empreinte calculée dans Figma).

### 2. Recopier l'export sur disque

Dans un dossier vide (par défaut `$TMPDIR/figma-tokens-export/`, à vider avant) :

- `manifest.json` : l'objet `manifest`, en JSON sur une ligne
- `chunk-<index>.tsv` pour chaque morceau :
  - 1re ligne : `#chunk <index> <collection> <hash>`
  - lignes suivantes : le champ `tsv` **à l'identique**, avec de vraies tabulations
    entre les colonnes et de vrais retours à la ligne

Recopier exactement : l'empreinte détecte la moindre altération.

### 3. Vérifier et générer

```bash
node scripts/figma-sync-tokens.mjs --from <dossier>
```

| Code | Signification | Action |
|---|---|---|
| `0` | `tokens.json` régénéré | Étape 4 |
| `1` | Export refusé, rien écrit | Lire les erreurs. **Empreinte** → recopier à nouveau ce morceau. **Nom hors convention, valeur non résolue, collection non déclarée, multi-modes** → s'arrêter et présenter la liste à Damien : la correction se fait dans Figma |
| `2` | `tokens.json` écrit, mais des variables CSS supprimées sont encore utilisées | Voir ci-dessous |

**Cas `2`** — pour chaque usage listé :
- si le rapport montre un renommage à valeur identique (même valeur supprimée et
  ajoutée), mettre à jour la référence dans le CSS et le signaler dans la PR ;
- sinon (token réellement supprimé, ou valeur différente) : **s'arrêter et demander
  à Damien**. Ne jamais recréer un token supprimé côté code.

Relancer avec `--check` jusqu'à obtenir le code `0` et « 0 ajoutée(s), 0 supprimée(s) ».

### 4. Présenter le diff design avant de committer

Montrer à Damien le rapport du script (ajouts, suppressions, valeurs modifiées).
**Toute valeur modifiée change le rendu** : la lister explicitement.

### 5. Build et contrôles

```bash
pnpm --filter @brique-rouge/tokens build   # régénère aussi specs/foundations et specs/tokens
node scripts/token-audit.mjs
node --test scripts/figma-sync-tokens.test.mjs
pnpm turbo run lint
pnpm test
```

Comparer `packages/tokens/build/css/` avant/après (build de référence fait sur `main`
avant l'étape 3) : chaque ligne qui change doit correspondre au rapport de l'étape 3.

### 6. PR

- Branche : `feat/sync-tokens-<AAAA-MM-JJ>`
- Fichiers attendus : `packages/tokens/tokens.json`, `specs/foundations/*`,
  `specs/tokens/*`, et les éventuelles références CSS mises à jour
- Description : le rapport du script + les vérifications de l'étape 5
- Ne jamais merger : la validation est humaine (CLAUDE.md §16)

## Ce que ce skill ne fait pas

- Pas de token hors Figma : un token absent de Figma est supprimé de `tokens.json`.
- Pas de renommage ni de correction de nom : le script refuse, la correction se fait dans Figma.
- Pas de thèmes / multi-modes : le script refuse une collection à plusieurs modes tant
  que `mapping.config.js` et le build ne le gèrent pas.
- Pas d'export des styles Figma (effets, textes) : seules les Variables sont synchronisées.
