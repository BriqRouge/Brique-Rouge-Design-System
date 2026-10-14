import { forwardRef } from 'react';
import styles from './ProjectBentoCard.module.css';

type ProjectBentoCardProject = 'odaptos' | 'bpce' | 'ibp' | 'conseil-constitutionnel' | 'cv';
type ProjectBentoCardShape = 'square' | 'rectangle';

interface ProjectBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Projet affiché — détermine la couleur de la plaque de fond et de la bordure au survol */
  project: ProjectBentoCardProject;
  /** Format de la carte — 'rectangle' est deux fois plus haute que 'square' */
  shape?: ProjectBentoCardShape;
  /**
   * Si true, la carte s'élargit (276px → 576px) au survol/focus en plus du
   * décalage de la façade. Dans le Figma source, seules 2 des 5 variantes
   * s'étendent (Odaptos en square, Conseil constitutionnel en rectangle).
   * Défaut : false.
   */
  expandOnHover?: boolean;
  /** Description révélée au survol/focus en bas de la façade — typiquement un <ProjectCardDescription /> */
  description?: React.ReactNode;
  /** Contenu visuel de la carte (image, illustration…) */
  children: React.ReactNode;
  /**
   * Contenu visuel alternatif révélé au survol/focus, en fondu enchaîné avec
   * `children` (même mécanique que `description`). À utiliser quand le Figma
   * source montre un contenu réellement différent entre idle et survol
   * (ex: iBP, CV). Sans effet si non fourni.
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
        {/* Plaque de fond (Figma "Surface BG") — couleur du projet, révélée au survol */}
        <div className={styles.surfaceBg} aria-hidden="true" />
        {/* Façade (Figma "Surface Front") — décalée au survol pour révéler la plaque de fond */}
        <div className={styles.surfaceFront}>
          <div className={styles.content}>{children}</div>
          {hoverChildren && <div className={styles.hoverContent}>{hoverChildren}</div>}
          {description && <div className={styles.description}>{description}</div>}
        </div>
      </div>
    );
  }
);

ProjectBentoCard.displayName = 'ProjectBentoCard';

export { ProjectBentoCard };
export type { ProjectBentoCardProps, ProjectBentoCardProject, ProjectBentoCardShape };
