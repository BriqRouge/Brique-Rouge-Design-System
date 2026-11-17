/**
 * Écran — Page projet Odaptos (écran d'ouverture, desktop 1920)
 * Brief validé par Damien le 2026-11-17 (rédigé par Claude sans ouvrir la maquette Figma).
 *
 * Direction créative (skill ds-br-screen, phase 1)
 * 1. Ressenti : éditorial et posé — une étude de cas qu'un recruteur ou un lead design
 *    parcourt en confiance. Beaucoup d'air, aucune décoration gratuite.
 * 2. Élément inoubliable : l'accroche du projet (ProjectOverview), « Odaptos — des fondations
 *    design pour un produit IA ». La couleur du projet reste un accent : pastille du TopNav et
 *    item courant du menu, rien d'autre.
 * 3. Registre : éditorial, lumineux et aéré, assumé jusqu'au bout.
 *
 * Replis balisés (ADR-004) : aucun.
 *
 * Écarts relevés en composant l'écran :
 * - Aucun composant ne produit de <h1> (titres de TopNav et ProjectOverview en <p>) : <h1>
 *   visuellement masqué, porté par l'écran.
 * - DropdownMenu porte role="menu", DropdownMenuButton ne pose pas role="menuitem" : l'écran
 *   le pose sur chaque item.
 *
 * Contenu : uniquement des faits du texte de l'étude de cas (page Portfolio de Figma) — ni
 * date, ni durée, ni chiffre.
 */
import {
  DropdownMenuButton,
  ProjectOverview,
  ProjectSectionDescription,
  ProjectSectionsDescription,
  TopNav,
} from '@brique-rouge/react';
import styles from './ProjectPageOdaptos.module.css';

export interface ProjectPageOdaptosProps {
  /** Retour à l'accueil (bouton « Accueil » du TopNav) */
  onBackClick?: () => void;
}

export function ProjectPageOdaptos({ onBackClick }: ProjectPageOdaptosProps) {
  return (
    <div className={styles.page}>
      <TopNav
        project="odaptos"
        title="Odaptos"
        subtitle="L'IA au service de la recherche utilisateur."
        onBackClick={onBackClick}
      >
        <DropdownMenuButton role="menuitem" company="odaptos" activated aria-current="page">
          Odaptos
        </DropdownMenuButton>
        <DropdownMenuButton role="menuitem" company="bpce">
          BPCE
        </DropdownMenuButton>
        <DropdownMenuButton role="menuitem" company="ibp">
          iBP
        </DropdownMenuButton>
        <DropdownMenuButton
          role="menuitem"
          company="conseil-constitutionnel"
          disabled
          hoverLabel="Showcase à venir"
        >
          Conseil Cons.
        </DropdownMenuButton>
        <DropdownMenuButton role="menuitem" company="vinci" disabled hoverLabel="Showcase à venir">
          Vinci
        </DropdownMenuButton>
      </TopNav>

      <main className={styles.main}>
        <h1 className={styles.srOnly}>Odaptos — étude de cas</h1>

        <ProjectOverview
          className={styles.overview}
          title="Odaptos"
          tagline="des fondations design pour un produit IA"
          role="Founding Product Designer"
          contributions="Recherche utilisateur, Design system, Dataset NER, Refonte de la plateforme"
        >
          <p>
            Plateforme <span className={styles.keyword}>B2B SaaS</span> qui permet aux UX
            Researchers de mener entretiens et tests utilisateurs avec l'aide de l'
            <span className={styles.keyword}>IA</span>. J'y ai mené deux chantiers en parallèle :
            orienter l'intégration de l'IA par la recherche utilisateur, et structurer de zéro les
            fondations design du produit.
          </p>
        </ProjectOverview>

        <ProjectSectionsDescription title="Contexte">
          <ProjectSectionDescription
            number="01"
            title="Le terrain"
            bulletPoints={[
              'Aucune documentation structurée pour guider les futurs concepteurs',
              'Des équipes design et développement appuyées sur des connaissances individuelles hétérogènes',
              'Une vélocité freinée et des sessions QA à répétition',
              "Une culture design encore à construire dans l'équipe",
            ]}
          >
            À mon arrivée, il n'existait pas de design system, et les usages de l'IA chez les UX
            Researchers étaient en pleine émergence.
          </ProjectSectionDescription>
        </ProjectSectionsDescription>
      </main>
    </div>
  );
}
