import { forwardRef, Fragment, Children } from 'react';
import styles from './ProjectSectionsDescription.module.css';

interface ProjectSectionsDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Titre de la carte (ex: "Design system") — absent : ni titre ni barre d'accent (booléen Figma `Display Title`) */
  title?: string;
  /** Séparateur entre les sections (booléen Figma `-----Devider-----`) — `true` par défaut */
  divider?: boolean;
  /** Une ou plusieurs <ProjectSectionDescription /> — un séparateur est inséré automatiquement entre elles */
  children: React.ReactNode;
}

const ProjectSectionsDescription = forwardRef<HTMLDivElement, ProjectSectionsDescriptionProps>(
  ({ title, divider = true, children, className, ...props }, ref) => {
    const classes = [styles.card, className].filter(Boolean).join(' ');
    const sections = Children.toArray(children);

    return (
      <div ref={ref} data-component="ds-br-project-sections-description" className={classes} {...props}>
        {title && (
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.accentBar} aria-hidden="true">
              <span className={styles.accentBarLong} />
              <span className={styles.accentBarShort} />
            </div>
          </div>
        )}
        <div className={styles.content}>
          {sections.map((section, index) => (
            <Fragment key={index}>
              {divider && index > 0 && <div className={styles.divider} data-divider aria-hidden="true" />}
              {section}
            </Fragment>
          ))}
        </div>
      </div>
    );
  }
);

ProjectSectionsDescription.displayName = 'ProjectSectionsDescription';

export { ProjectSectionsDescription };
export type { ProjectSectionsDescriptionProps };
