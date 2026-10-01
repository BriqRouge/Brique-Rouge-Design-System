import { forwardRef } from 'react';
import styles from './MetaInfoItem.module.css';

interface MetaInfoItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** URL externe liée (ouvre dans un nouvel onglet) */
  href: string;
  /** Icône affichée à gauche à l'état idle — ex: un SVG dessiné à la main ou <LogoCompanies /> */
  icon: React.ReactNode;
  /**
   * Icône affichée à gauche au survol/focus, si différente de `icon` (ex: un
   * livre fermé qui s'ouvre). Optionnel — si non fourni, `icon` reste affichée
   * dans tous les états.
   */
  hoverIcon?: React.ReactNode;
  /** Texte affiché à droite de l'icône */
  children: React.ReactNode;
}

const MetaInfoItem = forwardRef<HTMLAnchorElement, MetaInfoItemProps>(
  ({ href, icon, hoverIcon, children, className, ...props }, ref) => {
    const classes = [styles.item, hoverIcon ? styles.hasHoverIcon : '', className]
      .filter(Boolean)
      .join(' ');

    return (
      <a
        ref={ref}
        data-component="ds-br-meta-info-item"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        <span className={styles.iconWrapper}>
          <span className={styles.icon}>{icon}</span>
          {hoverIcon && <span className={styles.hoverIcon}>{hoverIcon}</span>}
        </span>
        <span className={styles.titleWrapper}>
          <span className={styles.highlight} aria-hidden="true" />
          <span className={styles.label}>{children}</span>
        </span>
      </a>
    );
  }
);

MetaInfoItem.displayName = 'MetaInfoItem';

export { MetaInfoItem };
export type { MetaInfoItemProps };
