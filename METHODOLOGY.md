# Méthodologie — Design System AI-ready

## Pourquoi cette méthode existe

Construire un Design System sérieux prend du temps.
Pas parce que c'est compliqué — mais parce que sans méthode,
on recommence les mêmes erreurs à chaque projet :
des tokens définis trop tard, des composants sans tests,
une documentation qui ne suit pas, un fossé entre Figma et le code.

Et même avec une méthode, un fossé finit par se creuser : on modifie Figma,
on oublie de reporter le changement dans le code, et le DS perd sa valeur de
référence. Cette méthode vise un DS **« AI-ready »** : un DS qu'une IA peut
lire, vérifier et tenir à jour, sous le contrôle d'un humain qui décide.

## Deux couches : la méthode et le contenu

Ce dépôt contient deux choses qu'il faut savoir distinguer :

| Couche | Contenu | Durée de vie |
|---|---|---|
| **La méthode** | Monorepo, build des tokens, scripts de synchronisation et de vérification, skills Claude Code, CI, conventions Figma, gabarits de specs | Réutilisable d'un DS à l'autre |
| **Le contenu** | Tokens, composants, specs, choix de design de Brique Rouge | Propre à un DS |

Brique Rouge est à la fois un Design System à part entière et la démonstration
que la méthode fonctionne. Toute évolution de la méthode doit rester
indépendante du contenu : les paramètres d'un projet vivent dans
`ds.config.json`, pas dans les scripts.

## Les principes fondateurs

### Figma est la source de vérité

Tout part de Figma. Les tokens, les composants, les décisions de design.
Le code suit Figma — jamais l'inverse.

Si quelque chose existe dans Figma, on le lit avant d'écrire une ligne de code.
Si quelque chose n'existe pas dans Figma, on ne l'invente pas.
Si quelque chose semble incohérent dans Figma, on le **signale** — on ne le
corrige pas de sa propre initiative. La décision revient à la personne
responsable du design.

### Synchroniser, jamais recopier

Rien ne se reporte à la main entre Figma et le code. `tokens.json` est généré
depuis les Variables Figma ; les changements de composants sont détectés par
empreinte. Un report manuel finit toujours par être oublié.

### Le déterministe vérifie, l'IA orchestre

L'IA lit, compare, propose et exécute. Mais chaque transformation sensible est
faite par un script testé, et chaque résultat est vérifié par un script :

- l'export des Variables porte une empreinte calculée dans Figma, recalculée
  après recopie — une recopie altérée est refusée ;
- la détection compare des empreintes, elle ne « juge » pas ;
- le lint, `check-specs` et `token-audit` vérifient les conventions en CI.

Un script refuse plutôt que de deviner : un nom hors convention ou un alias
cassé arrête la synchronisation, et la correction se fait dans Figma.

### L'humain décide, à des points d'arrêt explicites

Chaque synchronisation s'arrête sur un **rapport d'écarts** numérotés, avec une
recommandation pour chacun. Rien n'est modifié avant la réponse de la personne
responsable du design. Rien n'est mergé sans elle.

Avant toute modification en masse dans Figma, une version nommée est
enregistrée : c'est le point de restauration.

### Les tokens avant les composants

On ne crée pas de composant sans tokens.
Un composant sans tokens est un composant qui ne s'adapte pas,
qui crée de la dette, et qui sera réécrit dans six mois.

L'ordre est toujours : primitives → tokens sémantiques → composants.
Aucune valeur arbitraire si un token existe — dans le code comme dans Figma.

### L'accessibilité n'est pas optionnelle

WCAG 2.1 AA est le minimum, pas l'objectif.
Navigation clavier, focus visible, contrastes corrects, ARIA juste —
ces contraintes sont intégrées dès le départ, pas ajoutées à la fin.

Un composant qui n'est pas accessible n'est pas terminé.

### Une documentation pour les humains et pour les LLM

Storybook documente pour les humains. `specs/` documente pour les LLM : une
fiche par composant (API, tokens, règles d'usage) avec un en-tête YAML qui le
relie à son nœud Figma, et des patterns de composition. Les fiches de tokens et
de fondations sont générées par le build, donc toujours à jour.

### Un système simple vaut mieux qu'un système parfait

La sur-ingénierie est l'ennemi du Design System.
Chaque couche d'abstraction supplémentaire est une couche
que quelqu'un devra comprendre, maintenir et expliquer.

On préfère :
- Un token de moins qu'un token inutile
- Un composant simple qu'un composant sur-paramétré
- Une convention stable qu'une convention élégante mais fragile

## La division du travail

| Qui | Rôle |
|---|---|
| **Personne responsable du design** | Conçoit dans Figma, prend les décisions de design, valide les rapports d'écarts et les PR |
| **Claude AI** (claude.ai) | Réflexion, architecture, composants complexes |
| **Claude Code** | Lecture de Figma (MCP), comparaison, implémentation, tests, git — exécute ce qui est décidé |
| **Scripts et CI** | Vérifient, sans rien décider |

## L'ordre des phases

Cette méthode impose un ordre. Cet ordre n'est pas arbitraire.
Le guide détaillé est dans Storybook, section **Démarrage**.

### Phase 0 — Préparer Figma

Un fichier lisible par la machine : une page DS, des Variables nommées
proprement en deux collections, des styles de texte par rôle, des variantes en
kebab-case, des couleurs et des tailles liées aux variables.

### Phase 1 — Tokens

Sans tokens, pas de composants cohérents.
`/sync-tokens` régénère `tokens.json` depuis Figma, Style Dictionary produit
les variables CSS, Storybook les affiche.

### Phase 2 — Composants

On crée les composants un par un, dans l'ordre de priorité du projet.
Chaque composant suit le même workflow : analyse Figma complète (toutes les
variantes, tous les états) → validation de l'API → implémentation → tests →
Storybook → fiche specs.

### Phase 3 — CI/CD

Une fois les premiers composants en place, on automatise.
Les vérifications tournent à chaque PR. Storybook se déploie automatiquement.
On ne revient pas en arrière sur cette étape.

### Phase 4 — Code Connect

Quand le composant est stable.
Code Connect affiche le code React dans le panneau Dev de Figma.
Inutile de le faire sur un composant qui va encore changer.

### Phase 5 — Synchronisation continue

Le DS vit. `/sync-ds` synchronise tout ce qui a changé en une commande ; la
détection nocturne ouvre une issue dès que Figma et le code divergent. C'est
cette phase qui maintient le DS fiable dans la durée.

## Les décisions d'architecture

### Pourquoi pnpm + Turborepo ?

pnpm est plus rapide et plus strict que npm ou yarn.
Turborepo orchestre les builds dans le bon ordre entre les packages.
Ensemble, ils gèrent la complexité du monorepo sans friction.

### Pourquoi Style Dictionary v4 ?

Style Dictionary transforme un JSON de tokens en variables CSS.
La version 4 supporte nativement le format DTCG, proche du modèle
des Variables Figma.

Le mapping (`mapping.config.js`) associe chaque collection Figma à un fichier
CSS : il s'adapte à d'autres collections sans toucher au reste du système.

### Pourquoi CSS Modules + CSS Variables ?

CSS Modules isolent les styles par composant — pas de collision,
pas de spécificité à gérer, pas de convention de nommage à inventer.

CSS Variables exposent les tokens au runtime — elles permettent
le theming (light/dark) sans JavaScript supplémentaire.

### Pourquoi Storybook ?

Storybook est la documentation vivante du Design System.
Il sert à trois choses distinctes :
- Développer les composants en isolation
- Documenter les variants, états et usages
- Partager le DS avec les équipes sans accès au code

### Pourquoi TypeScript strict ?

Le mode strict élimine une catégorie entière de bugs à la compilation.
Dans un Design System — consommé par d'autres équipes —
la rigueur du typage est une forme de documentation.

### Pourquoi l'API REST de Figma pour la détection ?

Elle permet une détection sans intervention humaine, en CI, avec un token en
lecture seule. Sa limite : l'API des Variables est réservée au plan Enterprise.
Les Variables sont donc vérifiées par le MCP Figma, lors de `/sync-ds`.

## Les leçons apprises

Ces règles viennent d'erreurs réellement commises sur Brique Rouge.

- **Une capture d'écran ne montre qu'un état.** Analyser le Component Set
  complet, chaque état, avant d'implémenter : l'état survolé de `MetaInfoItem`
  avait été manqué parce que seule l'instance au repos avait été lue.
- **Appliquer un style de texte Figma remplace toutes les propriétés du
  texte**, rognage, casse et soulignement compris. Comparer ces propriétés et
  les dimensions avant et après, idéalement contre une version Figma enregistrée.
- **Vérifier par la mesure, pas à l'œil.** Un état CSS qui change peu, ou jamais
  déclenché, ne se voit pas sur une capture : mesurer les styles calculés.
- **Ne jamais annoncer « aucun changement visuel » sans l'avoir mesuré.**

## Ce que cette méthode ne fait pas

Elle ne remplace pas les décisions de design.
Elle ne génère pas de tokens à ta place.
Elle ne crée pas de composants sans que tu aies d'abord conçu dans Figma.
Elle ne dispense pas de valider chaque étape.

C'est une infrastructure, pas une solution clé en main.
La qualité du Design System dépend de la qualité du travail de design.
