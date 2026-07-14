import { forwardRef } from 'react';
import { MenuButton } from '../MenuButton';
import { DropdownMenuTrigger } from '../DropdownMenuTrigger';
import styles from './TopNav.module.css';

type TopNavProject = 'odaptos' | 'bpce' | 'ibp' | 'opco-atlas' | 'conseil-constitutionnel';

interface TopNavCommonProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Contenu du menu déroulant "Sélection projets" — typiquement des <DropdownMenuButton /> */
  children: React.ReactNode;
  /** Callback au clic sur le bouton retour (absent en état homepage) */
  onBackClick?: () => void;
}

interface TopNavHomepageProps extends TopNavCommonProps {
  project?: undefined;
  title?: undefined;
  subtitle?: undefined;
}

interface TopNavProjectPageProps extends TopNavCommonProps {
  /** Projet affiché — détermine la couleur de fond et du titre */
  project: TopNavProject;
  /** Titre du projet (ex: "Odaptos") */
  title: string;
  /** Sous-titre du projet (ex: "L'IA au service de la recherche utilisateur.") */
  subtitle?: string;
}

type TopNavProps = TopNavHomepageProps | TopNavProjectPageProps;

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M15.8333 10H4.16667M9.16667 5L4.16667 10L9.16667 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectsMenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M10.1267 3.40602C10.1261 3.09966 10.0834 2.79483 10 2.5C14.1402 2.50454 17.4954 5.86649 17.5 10C17.5134 14.1354 14.1421 17.4863 10 17.4997C5.85789 17.5131 2.51346 14.1358 2.5 10.0004C3.4264 10.1969 4.39199 9.99845 5.12492 9.39962C5.88017 8.78767 6.31575 7.86613 6.3085 6.89506C6.30799 6.67663 6.28841 6.45893 6.25 6.2439C7.0982 6.5802 8.05869 6.47007 8.809 5.95135C9.64134 5.37114 10.1342 4.4195 10.1267 3.40602Z M2.50163 5.835V5.83333H2.5V5.83496L2.50163 5.835Z M6.66829 2.50167V2.5H6.66667V2.50163L6.66829 2.50167Z M3.33496 2.50167V2.5H3.33333V2.50163L3.33496 2.50167Z M8.33496 14.1683V14.1667H8.33333V14.1683L8.33496 14.1683Z M12.5016 12.5017V12.5H12.5V12.5016L12.5016 12.5017Z M9.16829 10.0017V10H9.16667V10.0016L9.16829 10.0017Z M13.335 8.335V8.33333H13.3333V8.33496L13.335 8.335Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TopNav = forwardRef<HTMLElement, TopNavProps>(
  ({ project, title, subtitle, children, onBackClick, className, ...props }, ref) => {
    const classes = [styles.topNav, className].filter(Boolean).join(' ');

    return (
      <nav ref={ref} data-component="ds-br-top-nav" className={classes} aria-label="Navigation" {...props}>
        <div className={styles.pill} data-project={project}>
          {project && (
            <div className={styles.projectGroup}>
              <MenuButton
                variant="outlined"
                colorScheme="light"
                size="md"
                leftIcon={<ArrowLeftIcon />}
                onClick={onBackClick}
              >
                Accueil
              </MenuButton>
              <p className={styles.titleBlock}>
                <span className={styles.title}>{title}</span>
                {subtitle && <span className={styles.subtitle}>{` — ${subtitle}`}</span>}
              </p>
            </div>
          )}
          <div className={styles.trigger}>
            <DropdownMenuTrigger triggerLabel="Sélection projets" triggerSize="md" triggerLeftIcon={<ProjectsMenuIcon />}>
              {children}
            </DropdownMenuTrigger>
          </div>
        </div>
      </nav>
    );
  }
);

TopNav.displayName = 'TopNav';

export { TopNav };
export type { TopNavProps, TopNavProject };
