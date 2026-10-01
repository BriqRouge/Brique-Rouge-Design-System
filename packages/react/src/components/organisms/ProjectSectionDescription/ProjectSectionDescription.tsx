import { forwardRef } from 'react';
import styles from './ProjectSectionDescription.module.css';

interface ProjectSectionDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Numéro de la section affiché avant le titre (ex: "01") */
  number: string;
  /** Titre de la section (ex: "Problème") */
  title: string;
  /** Texte d'introduction de la section */
  children: React.ReactNode;
  /** Liste à puces optionnelle sous le texte d'introduction */
  bulletPoints?: string[];
  /** Bandeau révélé en bas de la section — typiquement un <AlertBanner /> */
  alertBanner?: React.ReactNode;
}

function SquaredIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 0C21.3137 0 24 2.68629 24 6V18C24 21.3137 21.3137 24 18 24H6C2.68629 24 0 21.3137 0 18V6C0 2.68629 2.68629 0 6 0H18ZM6 2C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2H6ZM12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

const ProjectSectionDescription = forwardRef<HTMLDivElement, ProjectSectionDescriptionProps>(
  ({ number, title, children, bulletPoints, alertBanner, className, ...props }, ref) => {
    const classes = [styles.section, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} data-component="ds-br-project-section-description" className={classes} {...props}>
        <div className={styles.header}>
          <span className={styles.number}>{number}</span>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <p className={styles.leadText}>{children}</p>
        {bulletPoints && bulletPoints.length > 0 && (
          <ul className={styles.bulletList}>
            {bulletPoints.map((point, index) => (
              <li className={styles.bulletItem} key={index}>
                <span className={styles.bulletIcon}>
                  <SquaredIcon />
                </span>
                {point}
              </li>
            ))}
          </ul>
        )}
        {alertBanner && <div className={styles.alertBanner}>{alertBanner}</div>}
      </div>
    );
  }
);

ProjectSectionDescription.displayName = 'ProjectSectionDescription';

export { ProjectSectionDescription };
export type { ProjectSectionDescriptionProps };
