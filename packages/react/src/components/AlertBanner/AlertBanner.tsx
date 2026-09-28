import { forwardRef } from 'react';
import styles from './AlertBanner.module.css';

type AlertBannerType = 'info' | 'warning';

interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Type de bannière — détermine la couleur et l'icône */
  type?: AlertBannerType;
  /** Titre de la bannière (gras) */
  title: string;
  /** Horodatage optionnel affiché à côté du titre (ex: "Il y a 5 min.") */
  timestamp?: string;
  /** Texte descriptif optionnel */
  description?: string;
  /** Callback de fermeture — si fourni, affiche le bouton de fermeture */
  onClose?: () => void;
  /** CTA optionnels (ex: <Button />) */
  children?: React.ReactNode;
}

function InfoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M10.66 4.2 2.9 17.5a1.5 1.5 0 0 0 1.3 2.25h15.6a1.5 1.5 0 0 0 1.3-2.25L13.34 4.2a1.5 1.5 0 0 0-2.68 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const AlertBanner = forwardRef<HTMLDivElement, AlertBannerProps>(
  (
    { type = 'info', title, timestamp, description, onClose, children, className, ...props },
    ref
  ) => {
    const classes = [styles.banner, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} data-component="ds-br-alert-banner" data-type={type} className={classes} {...props}>
        <div className={styles.header}>
          <span className={styles.icon} aria-hidden="true">
            {type === 'warning' ? <WarningIcon /> : <InfoIcon />}
          </span>
          <p className={styles.title}>{title}</p>
          {timestamp && (
            <div className={styles.timestampWrapper}>
              <p className={styles.timestamp}>{timestamp}</p>
            </div>
          )}
          {onClose && (
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Fermer"
            >
              <CloseIcon />
            </button>
          )}
        </div>
        {description && <p className={styles.description}>{description}</p>}
        {children && <div className={styles.cta}>{children}</div>}
      </div>
    );
  }
);

AlertBanner.displayName = 'AlertBanner';

export { AlertBanner };
export type { AlertBannerProps, AlertBannerType };
