# LogoCompanies

**Package :** `@brique-rouge/react`
**Chemin :** `packages/react/src/components/atoms/LogoCompanies/`
**Fichiers :** `LogoCompanies.tsx`, `LogoCompanies.module.css`, `LogoCompanies.test.tsx`, `index.ts`
**Story :** `packages/storybook/src/stories/components/LogoCompanies.stories.tsx`

## API

```ts
type LogoCompany = 'bpce' | 'conseil-constitutionnel' | 'odaptos' | 'ibp' | 'vinci' | 'tidal' | 'squared-icon' | 'steam';
type LogoSize     = '32' | '16' | '12' | '8';

interface LogoCompaniesProps extends React.HTMLAttributes<HTMLDivElement> {
  company?: LogoCompany;  // défaut: 'squared-icon'
  size?:    LogoSize;     // défaut: '32'
}
```

**Types exportés :** `LogoCompaniesProps`, `LogoCompany`, `LogoSize`
**data-attributes :** `data-company`, `data-size`

## Accessibilité

`role="img"` + `aria-label` auto-généré depuis le nom de la compagnie, logo `<img>` avec `aria-hidden="true"`.

## Tests

20 tests — 20 passants
