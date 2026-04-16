import { forwardRef } from 'react';
import styles from './LogoCompanies.module.css';

export type LogoCompany =
  | 'bpce'
  | 'conseil-constitutionnel'
  | 'odaptos'
  | 'ibp'
  | 'vinci'
  | 'tidal'
  | 'squared-icon'
  | 'steam';

export type LogoSize = 32 | 16 | 12 | 8;

export interface LogoCompaniesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Identifiant de l'entreprise */
  company?: LogoCompany;
  /** Taille du logo en pixels */
  size?: LogoSize;
}

// ─── Assets ──────────────────────────────────────────────────────────────────
// URLs issues de Figma MCP — valides 7 jours.
// À remplacer par des assets statiques dans packages/react/src/assets/logos/

type SizedAssets = Record<LogoSize, string>;

const single = (url: string): SizedAssets => ({ 32: url, 16: url, 12: url, 8: url });

const LOGO_ASSETS: Record<LogoCompany, SizedAssets> = {
  bpce: single('https://www.figma.com/api/mcp/asset/6556ee8c-b0f7-414f-8d80-f63ed73a51c2'),
  'conseil-constitutionnel': single(
    'https://www.figma.com/api/mcp/asset/29a85fbf-8aa7-4f90-8b36-ba60dd1a38cc'
  ),
  odaptos: single('https://www.figma.com/api/mcp/asset/081a4edd-8b74-4bbf-bcd9-e7c393a8d846'),
  ibp: single('https://www.figma.com/api/mcp/asset/76a72662-385c-428d-995a-cfea5ce03bbf'),
  vinci: single('https://www.figma.com/api/mcp/asset/b1f126c6-6fed-4f06-9cc3-817ddcb1a6e4'),
  'squared-icon': {
    32: 'https://www.figma.com/api/mcp/asset/e7d570a0-3d89-4595-9f1f-8d7d0276eaab',
    16: 'https://www.figma.com/api/mcp/asset/e111169f-632b-48fd-9943-ac09a6eab72d',
    12: 'https://www.figma.com/api/mcp/asset/170de387-3e59-4eea-8b26-4049da4dbb5f',
    8: 'https://www.figma.com/api/mcp/asset/fc47692c-a01c-41ac-bea2-4e202c2a9678',
  },
  tidal: {
    32: 'https://www.figma.com/api/mcp/asset/6fa4ebf8-bdbc-4af0-b5c0-7d7227aedc1b',
    16: 'https://www.figma.com/api/mcp/asset/2acf31fb-bfda-4c71-a427-e1695db1dbd3',
    12: 'https://www.figma.com/api/mcp/asset/4ae378c9-9a80-4be5-9e07-347ae27ec1c2',
    8: 'https://www.figma.com/api/mcp/asset/c52ebdf2-5e5a-4796-baef-fd861ec739b1',
  },
  steam: {
    32: 'https://www.figma.com/api/mcp/asset/006b5204-e3e6-4eee-9d05-b7c04b4ac780',
    16: 'https://www.figma.com/api/mcp/asset/bcf74712-10f8-40f4-81a4-f9437688ef86',
    12: 'https://www.figma.com/api/mcp/asset/2e9ccd39-ffbb-4ec2-b71b-25238e2da1fc',
    8: 'https://www.figma.com/api/mcp/asset/942e0c45-f1c5-4e95-b4f6-4f33e6676695',
  },
};

const COMPANY_LABELS: Record<LogoCompany, string> = {
  bpce: 'BPCE',
  'conseil-constitutionnel': 'Conseil Constitutionnel',
  odaptos: 'Odaptos',
  ibp: 'iBP',
  vinci: 'Vinci',
  tidal: 'Tidal',
  'squared-icon': 'Squared Icon',
  steam: 'Steam',
};

// ─── Composant ───────────────────────────────────────────────────────────────

export const LogoCompanies = forwardRef<HTMLDivElement, LogoCompaniesProps>(
  ({ company = 'squared-icon', size = 32, className, ...props }, ref) => {
    const src = LOGO_ASSETS[company][size];
    const label = COMPANY_LABELS[company];

    const classes = [styles.logo, styles[`size-${size}`], className]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        role="img"
        aria-label={label}
        data-component="ds-br-logo-companies"
        data-company={company}
        data-size={size}
        className={classes}
        {...props}
      >
        <img src={src} alt="" aria-hidden="true" className={styles.image} />
      </div>
    );
  }
);

LogoCompanies.displayName = 'LogoCompanies';
