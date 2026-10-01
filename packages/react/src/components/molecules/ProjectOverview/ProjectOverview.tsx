import { forwardRef } from 'react';
import styles from './ProjectOverview.module.css';

interface ProjectOverviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Nom du projet (ex: "Odaptos") */
  title: string;
  /** Accroche affichée après le tiret, à la suite du titre */
  tagline: string;
  /** Paragraphe(s) de description — peut contenir des mots mis en avant via <span> */
  children: React.ReactNode;
  /** Rôle occupé sur le projet (ex: "Founder Product Designer") */
  role: string;
  /** Contributions apportées (ex: "Sales, Product Strategy, ...") */
  contributions: string;
}

const ProjectOverview = forwardRef<HTMLDivElement, ProjectOverviewProps>(
  ({ title, tagline, children, role, contributions, className, ...props }, ref) => {
    const classes = [styles.overview, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} data-component="ds-br-project-overview" className={classes} {...props}>
        <div className={styles.titleColumn}>
          <p className={styles.title}>
            {title}{' '}
            <span className={styles.tagline}>— {tagline}</span>
          </p>
        </div>
        <div className={styles.descriptionColumn}>
          <div className={styles.text}>{children}</div>
          <p className={styles.meta}>Rôle: {role}</p>
          <p className={styles.meta}>Contribution: {contributions}</p>
        </div>
      </div>
    );
  }
);

ProjectOverview.displayName = 'ProjectOverview';

export { ProjectOverview };
export type { ProjectOverviewProps };
