import { forwardRef } from 'react';
import styles from './ProjectBentoCard.module.css';

type ProjectBentoCardProject = 'odaptos' | 'bpce' | 'ibp' | 'conseil-constitutionnel' | 'cv';
type ProjectBentoCardShape = 'square' | 'rectangle';

interface ProjectBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Projet affiché — détermine la couleur d'accent au survol */
  project: ProjectBentoCardProject;
  /** Format de la carte — 'rectangle' est deux fois plus haute que 'square' */
  shape?: ProjectBentoCardShape;
  /** Description révélée au survol/focus — typiquement un <ProjectCardDescription /> */
  description?: React.ReactNode;
  /** Contenu visuel de la carte (image, illustration…) */
  children: React.ReactNode;
}

const ProjectBentoCard = forwardRef<HTMLDivElement, ProjectBentoCardProps>(
  ({ project, shape = 'square', description, children, className, ...props }, ref) => {
    const classes = [styles.card, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        data-component="ds-br-project-bento-card"
        data-project={project}
        data-shape={shape}
        className={classes}
        {...props}
      >
        <div className={styles.content}>{children}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    );
  }
);

ProjectBentoCard.displayName = 'ProjectBentoCard';

export { ProjectBentoCard };
export type { ProjectBentoCardProps, ProjectBentoCardProject, ProjectBentoCardShape };
