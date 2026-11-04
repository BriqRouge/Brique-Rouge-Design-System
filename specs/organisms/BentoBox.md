---
component: BentoBox
tier: organism
figma:
  node: "2049:20632"
  name: Bento-box
  type: component
---
# BentoBox

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/organisms/BentoBox/`
**Figma :** composant sans propriété, 5 instances de `Projects-Bento-Cards` en grille 2 colonnes × 3 lignes (576×876)

## API

```ts
interface BentoBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode; // cartes ProjectBentoCard, dans l'ordre de lecture
}
```

**Types exportés :** `BentoBoxProps`
**data-component :** `ds-br-bento-box`

## Composition

Organisme qui dispose 5 `ProjectBentoCard` (organisme). Le composant ne connaît pas les projets : les cartes sont fournies en `children`, dans l'ordre de lecture du Figma.

```
Odaptos (expandOnHover) | iBP
Conseil constitutionnel | CV
(shape="rectangle")     | BPCE
```

## Tokens CSS utilisés

| Token | Valeur | Usage |
|-------|--------|-------|
| `--spacing-x6` | `24px` | Espacement entre lignes et colonnes |

Les pistes de grille (276px) reprennent la taille fixe de `ProjectBentoCard`.

## Règles d'usage

- **Placement automatique** : grille CSS à pistes fixes de 276px. Une carte `shape="rectangle"` occupe deux lignes (`grid-row: span 2`). L'ordre des `children` détermine la position
- **Agrandissement au survol** : une carte `expandOnHover` (276 → 576px) déborde par-dessus sa voisine sans la déplacer, car les pistes sont fixes et la carte passe en `z-index: 1` au survol. Pas besoin de positionnement absolu, contrairement à la story « Survolez pour voir » de `ProjectBentoCard`
- **Marge au survol** : la façade des cartes se décale de 8px vers le haut et la droite. Le conteneur parent doit prévoir cette marge, comme pour `ProjectBentoCard`
- **Disposition** : celle du Figma (2 × 3) fait foi (décision Damien, 2026-11-04). La story « Survolez pour voir » de `ProjectBentoCard` (3 × 2) reste inchangée
- Aucune animation propre : `get_motion_context` ne retourne rien sur `2049:20632`. Les transitions viennent des cartes

## Incohérences Figma signalées (2026-11-04, non corrigées)

- Les espacements de la grille (24px) ne sont pas liés à une variable (`spacing/x6` existe)

## Tests

4 tests — 4 passants
