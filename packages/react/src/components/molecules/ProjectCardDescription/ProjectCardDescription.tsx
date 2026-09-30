import { forwardRef } from 'react';
import styles from './ProjectCardDescription.module.css';

interface ProjectCardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Titre du projet (contenu principal) */
  children: React.ReactNode;
  /** Nom du projet affiché en haut à gauche (ex: "Odaptos") */
  project: string;
  /** Année du projet affichée en haut à droite (ex: "2024") */
  year: string;
  /** Catégorie ou rôle affiché en bas (ex: "Product Design") */
  category: string;
}

const ProjectCardDescription = forwardRef<HTMLDivElement, ProjectCardDescriptionProps>(
  ({ children, project, year, category, className, ...props }, ref) => {
    const classes = [styles.card, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} data-component="ds-br-project-card-description" className={classes} {...props}>
        <div className={styles.header}>
          <p className={styles.project}>{project}</p>
          <p className={styles.year}>{year}</p>
        </div>
        <div className={styles.titleWrapper}>
          <p className={styles.title}>{children}</p>
        </div>
        <div className={styles.footer}>
          <p className={styles.category}>{category}</p>
        </div>
      </div>
    );
  }
);

ProjectCardDescription.displayName = 'ProjectCardDescription';

export { ProjectCardDescription };
export type { ProjectCardDescriptionProps };
