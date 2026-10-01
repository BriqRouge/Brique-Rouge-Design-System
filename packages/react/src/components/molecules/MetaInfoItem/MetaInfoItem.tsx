import { forwardRef } from 'react';
import styles from './MetaInfoItem.module.css';

interface MetaInfoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icône affichée à gauche — ex: une icône dessinée à la main ou <LogoCompanies /> */
  icon: React.ReactNode;
  /** Texte affiché à droite de l'icône */
  children: React.ReactNode;
}

const MetaInfoItem = forwardRef<HTMLDivElement, MetaInfoItemProps>(
  ({ icon, children, className, ...props }, ref) => {
    const classes = [styles.item, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} data-component="ds-br-meta-info-item" className={classes} {...props}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{children}</span>
      </div>
    );
  }
);

MetaInfoItem.displayName = 'MetaInfoItem';

export { MetaInfoItem };
export type { MetaInfoItemProps };
