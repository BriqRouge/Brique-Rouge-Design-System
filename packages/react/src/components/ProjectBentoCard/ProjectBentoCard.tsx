import { forwardRef } from 'react';
import styles from './ProjectBentoCard.module.css';

type ProjectBentoCardProject = 'odaptos' | 'bpce' | 'ibp' | 'conseil-constitutionnel' | 'cv';
type ProjectBentoCardShape = 'square' | 'rectangle';

interface ProjectBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Projet affiché — détermine la couleur d'accent au survol */
  project: ProjectBentoCardProject;
  /** Format de la carte — 'rectangle' est deux fois plus haute que 'square' */
  shape?: ProjectBentoCardShape;
  /**
   * Si true, la carte s'élargit (276px → 576px) au survol/focus en plus du
   * changement de couleur. Dans le Figma source, seules 2 des 5 variantes
   * s'étendent (Odaptos en square, Conseil constitutionnel en rectangle) —
   * les autres (BPCE, iBP, CV) ne font que changer de couleur/contenu.
   * Défaut : false.
   */
  expandOnHover?: boolean;
  /** Description révélée au survol/focus — typiquement un <ProjectCardDescription /> */
  description?: React.ReactNode;
  /** Contenu visuel de la carte (image, illustration…) */
  children: React.ReactNode;
  /**
   * Contenu visuel alternatif révélé au survol/focus, en fondu enchaîné avec
   * `children` (même mécanique que `description`). Optionnel — certaines
   * variantes du Figma source affichent un visuel différent au survol
   * (ex: Conseil constitutionnel, Odaptos), d'autres gardent le même visuel
   * (leur contenu visuel n'est pas encore arrêté). Sans effet si non fourni.
   */
  hoverChildren?: React.ReactNode;
}

const ProjectBentoCard = forwardRef<HTMLDivElement, ProjectBentoCardProps>(
  (
    {
      project,
      shape = 'square',
      expandOnHover = false,
      description,
      children,
      hoverChildren,
      className,
      ...props
    },
    ref
  ) => {
    const classes = [
      styles.card,
      expandOnHover ? styles.expandOnHover : '',
      hoverChildren ? styles.hasHoverVisual : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        data-component="ds-br-project-bento-card"
        data-project={project}
        data-shape={shape}
        data-expand-on-hover={expandOnHover}
        data-has-hover-visual={Boolean(hoverChildren)}
        className={classes}
        {...props}
      >
        <div className={styles.content}>{children}</div>
        {hoverChildren && <div className={styles.hoverContent}>{hoverChildren}</div>}
        {description && <div className={styles.description}>{description}</div>}
      </div>
    );
  }
);

ProjectBentoCard.displayName = 'ProjectBentoCard';

export { ProjectBentoCard };
export type { ProjectBentoCardProps, ProjectBentoCardProject, ProjectBentoCardShape };
