import { forwardRef } from 'react';
import styles from './LogoCompanies.module.css';

import bpce32 from '../../assets/logos/bpce-32.png';
import conseilConstitutionnel32 from '../../assets/logos/conseil-constitutionnel-32.png';
import ibp32 from '../../assets/logos/ibp-32.png';
import odaptos32 from '../../assets/logos/odaptos-32.png';
import squaredIcon12 from '../../assets/logos/squared-icon-12.svg';
import squaredIcon16 from '../../assets/logos/squared-icon-16.svg';
import squaredIcon32 from '../../assets/logos/squared-icon-32.svg';
import squaredIcon8 from '../../assets/logos/squared-icon-8.svg';
import steam12 from '../../assets/logos/steam-12.svg';
import steam16 from '../../assets/logos/steam-16.svg';
import steam32 from '../../assets/logos/steam-32.svg';
import steam8 from '../../assets/logos/steam-8.svg';
import tidal12 from '../../assets/logos/tidal-12.svg';
import tidal16 from '../../assets/logos/tidal-16.svg';
import tidal32 from '../../assets/logos/tidal-32.svg';
import tidal8 from '../../assets/logos/tidal-8.svg';
import vinci32 from '../../assets/logos/vinci-32.png';

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

type SizedAssets = Record<LogoSize, string>;

const single = (url: string): SizedAssets => ({ 32: url, 16: url, 12: url, 8: url });

const LOGO_ASSETS: Record<LogoCompany, SizedAssets> = {
  bpce: single(bpce32),
  'conseil-constitutionnel': single(conseilConstitutionnel32),
  odaptos: single(odaptos32),
  ibp: single(ibp32),
  vinci: single(vinci32),
  'squared-icon': {
    32: squaredIcon32,
    16: squaredIcon16,
    12: squaredIcon12,
    8: squaredIcon8,
  },
  tidal: {
    32: tidal32,
    16: tidal16,
    12: tidal12,
    8: tidal8,
  },
  steam: {
    32: steam32,
    16: steam16,
    12: steam12,
    8: steam8,
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
