# Méthodologie — Design System Starter

## Pourquoi ce template existe

Construire un Design System sérieux prend du temps.
Pas parce que c'est compliqué — mais parce que sans méthode,
on recommence les mêmes erreurs à chaque projet :
des tokens définis trop tard, des composants sans tests,
une documentation qui ne suit pas, un fossé entre Figma et le code.

Ce template capitalise sur ce qui fonctionne.
Il te donne une infrastructure éprouvée pour que tu puisses
te concentrer sur ce qui compte vraiment : ton Design System.

## Les principes fondateurs

### Figma est la source de vérité

Tout part de Figma. Les tokens, les composants, les décisions de design.
Le code suit Figma — jamais l'inverse.

Si quelque chose existe dans Figma, on le lit avant d'écrire une ligne de code.
Si quelque chose n'existe pas dans Figma, on ne l'invente pas.

### Les tokens avant les composants

On ne crée pas de composant sans tokens.
Un composant sans tokens est un composant qui ne s'adapte pas,
qui crée de la dette, et qui sera réécrit dans six mois.

L'ordre est toujours : primitives → tokens sémantiques → composants.

### L'accessibilité n'est pas optionnelle

WCAG 2.1 AA est le minimum, pas l'objectif.
Navigation clavier, focus visible, contrastes corrects, ARIA juste —
ces contraintes sont intégrées dès le départ, pas ajoutées à la fin.

Un composant qui n'est pas accessible n'est pas terminé.

### Un système simple vaut mieux qu'un système parfait

La sur-ingénierie est l'ennemi du Design System.
Chaque couche d'abstraction supplémentaire est une couche
que quelqu'un devra comprendre, maintenir et expliquer.

On préfère :
- Un token de moins qu'un token inutile
- Un composant simple qu'un composant sur-paramétré
- Une convention stable qu'une convention élégante mais fragile

### Claude AI ferme la boucle

Claude AI n'est pas un raccourci — c'est un partenaire de méthode.
Il lit Figma, propose une API, génère le code, écrit les tests.
Mais c'est toujours le designer qui valide avant que le code soit écrit.

La division du travail est claire :
- Le designer : décisions de design, validation de l'API, vérification visuelle
- Claude AI : lecture Figma, proposition d'API, génération de code
- Claude Code : implémentation, tests, git

## L'ordre des phases

Ce template impose un ordre. Cet ordre n'est pas arbitraire.

### Phase 1 — Tokens

Sans tokens, pas de composants cohérents.
On commence toujours par exporter les variables Figma,
les intégrer dans Style Dictionary, et vérifier qu'elles
apparaissent correctement dans Storybook.

### Phase 2 — Composants

On crée les composants un par un, dans l'ordre de priorité du projet.
Chaque composant suit le même workflow :
Figma → Claude AI → validation → Claude Code → Storybook.

### Phase 3 — CI/CD

Une fois les premiers composants en place, on automatise.
Les tests tournent à chaque push. Storybook se déploie automatiquement.
On ne revient pas en arrière sur cette étape.

### Phase 4 — Code Connect

En dernier, quand le composant est stable.
Code Connect relie Figma et le code — c'est la boucle fermée.
Inutile de le faire sur un composant qui va encore changer.

## Les décisions d'architecture

### Pourquoi pnpm + Turborepo ?

pnpm est plus rapide et plus strict que npm ou yarn.
Turborepo orchestre les builds dans le bon ordre entre les packages.
Ensemble, ils gèrent la complexité du monorepo sans friction.

### Pourquoi Style Dictionary v4 ?

Style Dictionary transforme un JSON de tokens en variables CSS.
La version 4 supporte nativement le format DTCG — le format
qu'utilise Figma pour ses exports de variables.

Le mapping flexible (`mapping.config.js`) permet d'adapter
la configuration à n'importe quelle nomenclature de collections Figma
sans toucher au reste du système.

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

## Ce que ce template ne fait pas

Ce template ne remplace pas les décisions de design.
Il ne génère pas de tokens à ta place.
Il ne crée pas de composants sans que tu aies d'abord conçu dans Figma.
Il ne dispense pas de valider chaque étape.

C'est une infrastructure, pas une solution clé en main.
La qualité du Design System dépend de la qualité du travail de design.
