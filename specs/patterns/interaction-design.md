# Design d'interaction

## Les huit états interactifs

Chaque élément interactif nécessite ces états :

| État | Quand | Traitement visuel |
|------|-------|-------------------|
| **Default** | Au repos | Style de base |
| **Hover** | Pointeur dessus (pas touch) | Légère élévation, changement de couleur |
| **Focus** | Focus clavier/programmatique | Ring visible (voir ci-dessous) |
| **Active** | En cours d'appui | Enfoncé, plus sombre |
| **Disabled** | Non interactif | Opacité réduite, pas de pointeur |
| **Loading** | En cours de traitement | Spinner, skeleton |
| **Error** | État invalide | Bordure rouge, icône, message |
| **Success** | Action complétée | Check vert, confirmation |

**L'erreur courante** : concevoir hover sans focus, ou inversement. Ils sont différents. Les utilisateurs clavier ne voient jamais les états hover.

---

## Focus rings — les faire correctement

**Jamais `outline: none` sans remplacement** — violation d'accessibilité.

Pour les éléments custom :
```css
.customElement:focus {
  outline: none;
}

.customElement:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

---

## Boutons — composant DS

Le composant `Button` gère les états de base. Utiliser ses props correctement — API
complète : `specs/atoms/Button.md` (`variant` : `primary` | `secondary` | `tertiary` ;
`colorScheme` : `neutral` | `info` | `warning` | `success` | `error` ; pas de prop `size`).

```tsx
/* ✅ Correct */
<Button variant="primary" onClick={handleSubmit}>
  Créer le projet
</Button>

/* ✅ Avec icône seule — children vide, aria-label obligatoire */
<Button variant="secondary" leftIcon={<TrashIcon />} aria-label="Supprimer le projet">
  {null}
</Button>

/* ❌ Incorrect — pas de aria-label sur bouton icon-only */
<Button variant="primary" leftIcon={<TrashIcon />}>
  {null}
</Button>
```

**Règles boutons :**
- Toujours des verbes d'action (`Créer`, `Enregistrer`, `Supprimer`)
- `aria-label` obligatoire si le bouton ne contient que des icônes
- Ne pas mettre tous les boutons en `primary` — la hiérarchie des actions compte
- `colorScheme` porte une couleur sémantique (info, warning, success, error), pas un thème clair/sombre : `Button` n'a pas de variante pour fond sombre. Un bouton sur fond sombre est un manque du DS à signaler, pas à styler à la main (`MenuButton` a un `mode="dark"`, mais c'est un composant distinct au périmètre différent — voir sa fiche). Une variante manquante ne justifie pas de repli balisé ([ADR-004](../../docs/adr/004-ecrans-repli-balise.md))

---

## États de chargement

- **Button loading** : gérer l'état `disabled` pendant le chargement pour éviter les doubles soumissions
- **Feedback de soumission** : état loading → transition vers succès ou erreur

---

## Navigation clavier

- Tab order logique suivant le flux visuel de l'écran
- Un seul `<h1>` par écran
- Les boutons utilisent des verbes d'action (`aria-label` si icône seule)

---

## Actions destructives

L'undo est meilleur que les modales de confirmation — les utilisateurs cliquent sur "Confirmer" machinalement. Utiliser une confirmation uniquement pour les actions vraiment irréversibles (suppression de compte, données critiques).

---

**À éviter :** Supprimer les focus rings sans remplacement. Zones de tap < 44×44px. Tous les boutons en `primary`. Modales pour des actions non-destructives.
