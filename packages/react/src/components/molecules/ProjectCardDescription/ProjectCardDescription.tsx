import { forwardRef } from 'react';
import styles from './ProjectCardDescription.module.css';

type ProjectCardDescriptionVariant = 'default' | 'cv';

interface ProjectCardDescriptionBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Titre du projet (contenu principal) */
  children: React.ReactNode;
}

interface ProjectCardDescriptionDefaultProps extends ProjectCardDescriptionBaseProps {
  /** Variante Figma `Type=Default` — nom du projet, année, titre et catégorie */
  variant?: 'default';
  /** Nom du projet affiché en haut à gauche (ex: "Odaptos") */
  project: string;
  /** Année du projet affichée en haut à droite (ex: "2024") */
  year: string;
  /** Catégorie ou rôle affiché en bas (ex: "Product Design") */
  category: string;
}

interface ProjectCardDescriptionCvProps extends ProjectCardDescriptionBaseProps {
  /** Variante Figma `Type=CV` — titre seul, centré */
  variant: 'cv';
  project?: never;
  year?: never;
  category?: never;
}

type ProjectCardDescriptionProps = ProjectCardDescriptionDefaultProps | ProjectCardDescriptionCvProps;

const ProjectCardDescription = forwardRef<HTMLDivElement, ProjectCardDescriptionProps>(
  ({ children, variant = 'default', project, year, category, className, ...props }, ref) => {
    const classes = [styles.card, styles[`variant-${variant}`], className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        data-component="ds-br-project-card-description"
        data-variant={variant}
        className={classes}
        {...props}
      >
        {variant === 'default' && (
          <div className={styles.header}>
            <p className={styles.project}>{project}</p>
            <p className={styles.year}>{year}</p>
          </div>
        )}
        <div className={styles.titleWrapper}>
          <p className={styles.title}>{children}</p>
        </div>
        {variant === 'default' && (
          <div className={styles.footer}>
            <p className={styles.category}>{category}</p>
          </div>
        )}
      </div>
    );
  }
);

ProjectCardDescription.displayName = 'ProjectCardDescription';

export { ProjectCardDescription };
export type { ProjectCardDescriptionProps, ProjectCardDescriptionVariant };
