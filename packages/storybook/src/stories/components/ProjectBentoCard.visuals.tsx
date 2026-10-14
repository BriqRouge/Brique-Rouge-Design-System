import styles from './ProjectBentoCard.visuals.module.css';
import odaptosShadow from './assets/project-bento-card/odaptos/shadow.svg';
import odaptosScreenFrame from './assets/project-bento-card/odaptos/screen-frame.svg';
import odaptosBody from './assets/project-bento-card/odaptos/body.svg';
import odaptosBottom from './assets/project-bento-card/odaptos/bottom.svg';
import odaptosBevelHardLight from './assets/project-bento-card/odaptos/bevel-hard-light.svg';
import odaptosBevelMultiply from './assets/project-bento-card/odaptos/bevel-multiply.svg';
import bpceShadow from './assets/project-bento-card/bpce/shadow.svg';
import bpceScreenFrame from './assets/project-bento-card/bpce/screen-frame.svg';
import bpceBody from './assets/project-bento-card/bpce/body.svg';
import bpceBottom from './assets/project-bento-card/bpce/bottom.svg';
import bpceBevelHardLight from './assets/project-bento-card/bpce/bevel-hard-light.svg';
import bpceBevelMultiply from './assets/project-bento-card/bpce/bevel-multiply.svg';
import bpceScreen from './assets/project-bento-card/bpce/mycarlease-accueil.png';
import ibpRadarGrid from './assets/project-bento-card/ibp/radar-grid.svg';
import ibpPolygon1 from './assets/project-bento-card/ibp/polygon-1.svg';
import ibpPolygon5 from './assets/project-bento-card/ibp/polygon-5.svg';
import ibpPolygon6 from './assets/project-bento-card/ibp/polygon-6.svg';
import ibpPolygon7 from './assets/project-bento-card/ibp/polygon-7.svg';
import ibpPolygon8 from './assets/project-bento-card/ibp/polygon-8.svg';
import ibpHoverScreen from './assets/project-bento-card/ibp/hover-screen.png';
import cvIllustration from './assets/project-bento-card/cv/cv-illustration.svg';
import cvIllustrationHover from './assets/project-bento-card/cv/cv-illustration-hover.svg';

/*
 * Visuels des cartes de ProjectBentoCard (node Figma 2032:20121), à passer en
 * children / hoverChildren. Contenu illustratif propre à chaque projet : il
 * vit dans Storybook, pas dans le composant (qui ne gère aucun asset).
 * Le visuel Conseil constitutionnel est dans ProjectBentoCard.conseilConstitutionnel.tsx.
 */

interface MacbookAssets {
  shadow: string;
  screenFrame: string;
  body: string;
  bottom: string;
  bevelHardLight: string;
  bevelMultiply: string;
}

interface BentoMacbookProps {
  assets: MacbookAssets;
  /** Classe de positionnement/dimension propre à chaque carte */
  className: string;
  /** Classe de l'ombre portée (inset du layer "Shadow", propre à chaque export) */
  shadowClassName: string;
  /** Contenu de l'écran */
  children: React.ReactNode;
}

/**
 * Instance "Macbook Pro" des cartes bento (structure Figma : Shadow, Screen
 * Frame, Body, Bottom, Bevel ×2, écran, Display bottom). Les SVG diffèrent
 * d'une carte à l'autre (rayons et flous recalculés à l'export par Figma
 * selon la taille de l'instance) : chaque carte passe ses propres assets.
 */
function BentoMacbook({ assets, className, shadowClassName, children }: BentoMacbookProps) {
  return (
    <div className={`${styles.macbook} ${className}`}>
      <div className={styles.shadowWrapper}>
        <div className={shadowClassName}>
          <img src={assets.shadow} alt="" />
        </div>
      </div>
      <div className={styles.screenFrame}>
        <img src={assets.screenFrame} alt="" />
      </div>
      <div className={styles.body}>
        <img src={assets.body} alt="" />
      </div>
      <div className={styles.bottom}>
        <img src={assets.bottom} alt="" />
      </div>
      <div className={styles.bevelHardLight}>
        <img src={assets.bevelHardLight} alt="" />
      </div>
      <div className={styles.bevelMultiply}>
        <img src={assets.bevelMultiply} alt="" />
      </div>
      <div className={styles.screen}>{children}</div>
      <div className={styles.displayBottom} />
    </div>
  );
}

/** Odaptos — repos (node 2032:20132). L'écran est une vidéo à venir (layer "Odaptos_DEMO_Final"). */
export function OdaptosVisual() {
  return (
    <BentoMacbook
      className={styles.odaptosMacbook}
      shadowClassName={styles.odaptosShadow}
      assets={{
        shadow: odaptosShadow,
        screenFrame: odaptosScreenFrame,
        body: odaptosBody,
        bottom: odaptosBottom,
        bevelHardLight: odaptosBevelHardLight,
        bevelMultiply: odaptosBevelMultiply,
      }}
    >
      <div className={styles.screenPlaceholder} />
    </BentoMacbook>
  );
}

/** BPCE — repos (node 2032:20330) : capture de la page d'accueil MyCarLease. */
export function BpceVisual() {
  return (
    <BentoMacbook
      className={styles.bpceMacbook}
      shadowClassName={styles.bpceShadow}
      assets={{
        shadow: bpceShadow,
        screenFrame: bpceScreenFrame,
        body: bpceBody,
        bottom: bpceBottom,
        bevelHardLight: bpceBevelHardLight,
        bevelMultiply: bpceBevelMultiply,
      }}
    >
      <img className={styles.bpceScreen} src={bpceScreen} alt="" />
    </BentoMacbook>
  );
}

/**
 * Odaptos et BPCE — survol (nodes 2032:20122 / 2032:20324) : le haut de la
 * façade est vide dans Figma, contenu à venir (validé par Damien). Passé en
 * hoverChildren pour masquer le MacBook au survol, comme dans Figma.
 */
export function EmptyHoverVisual() {
  return <div className={styles.emptyHover} />;
}

const ibpLabels = [
  { text: 'Centralisation des études', className: styles.ibpLabelCentralisation },
  { text: 'Systématisation de la recherche utilisateur', className: styles.ibpLabelSystematisation },
  {
    text: 'Industrialisation des process de création, d’analyse et de restitution',
    className: styles.ibpLabelIndustrialisation,
  },
  { text: 'Rationnalisation de la recherche', className: styles.ibpLabelRationnalisation },
  { text: 'Utilisation globale de l’outil', className: styles.ibpLabelUtilisation },
  { text: 'Connaissance partagée des besoins', className: styles.ibpLabelConnaissance },
  { text: 'Notification pro active', className: styles.ibpLabelNotification },
  { text: 'Détection des signaux faibles', className: styles.ibpLabelDetection },
  { text: 'Priorisation sur la base d’insights', className: styles.ibpLabelPriorisation },
  { text: 'Amélioration des prises de décision', className: styles.ibpLabelAmelioration },
];

function IbpShape({ src, className, inset = false }: { src: string; className: string; inset?: boolean }) {
  return (
    <div className={`${styles.ibpShape} ${className}`}>
      {inset ? (
        <div className={styles.ibpShapeInset}>
          <img className={styles.fill} src={src} alt="" />
        </div>
      ) : (
        <img className={styles.fill} src={src} alt="" />
      )}
    </div>
  );
}

/**
 * iBP — repos (node 2032:20120) : diagramme radar de maturité. Illustration
 * décorative (les libellés reprennent le contenu de la description) : masquée
 * aux lecteurs d'écran.
 */
export function IbpVisual() {
  return (
    <div className={styles.ibpRadar} aria-hidden="true">
      <IbpShape src={ibpRadarGrid} className={styles.ibpGrid} />
      <IbpShape src={ibpPolygon5} className={styles.ibpPolygon5} inset />
      {ibpLabels.map(({ text, className }) => (
        <p key={text} className={`${styles.ibpLabel} ${className}`}>
          {text}
        </p>
      ))}
      <IbpShape src={ibpPolygon1} className={styles.ibpPolygon1} />
      <IbpShape src={ibpPolygon6} className={styles.ibpPolygon6} inset />
      <IbpShape src={ibpPolygon7} className={styles.ibpPolygon7} inset />
      <IbpShape src={ibpPolygon8} className={styles.ibpPolygon8} inset />
    </div>
  );
}

/** iBP — survol (node 2032:20134) : capture d'écran avec ombre Elevation 3. */
export function IbpHoverVisual() {
  return <img className={styles.ibpHoverScreen} src={ibpHoverScreen} alt="" />;
}

/** CV — repos (node 2040:19226). */
export function CvVisual() {
  return (
    <div className={styles.cvIllustration}>
      <div className={styles.cvIllustrationInset}>
        <img className={styles.fill} src={cvIllustration} alt="" />
      </div>
    </div>
  );
}

/** CV — survol (node 2040:19238) : la même illustration, inclinée en perspective. */
export function CvHoverVisual() {
  return (
    <div className={styles.cvHoverWrapper}>
      <div className={styles.cvHoverTransform}>
        <div className={styles.cvHoverIllustration}>
          <div className={styles.cvHoverIllustrationInset}>
            <img className={styles.fill} src={cvIllustrationHover} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
