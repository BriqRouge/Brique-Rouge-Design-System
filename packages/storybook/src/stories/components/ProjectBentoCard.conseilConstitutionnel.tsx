import styles from './ProjectBentoCard.conseilConstitutionnel.module.css';
import shadowAsset from './assets/project-bento-card/shadow.svg';
import screenFrameAsset from './assets/project-bento-card/screen-frame.svg';
import bodyAsset from './assets/project-bento-card/body.svg';
import bottomAsset from './assets/project-bento-card/bottom.svg';
import bevelHardLightAsset from './assets/project-bento-card/bevel-hard-light.svg';
import bevelMultiplyAsset from './assets/project-bento-card/bevel-multiply.svg';
import mobileScreenAsset from './assets/project-bento-card/cc-mobile-screen.png';

/**
 * Visuel de la carte "Conseil constitutionnel" (node Figma 1759:22826 idle /
 * 1759:22840 survol) : mockup ordinateur portable + mockup téléphone.
 * Les mêmes éléments se repositionnent/redimensionnent entre idle et survol
 * (voir ProjectBentoCard.conseilConstitutionnel.module.css) — à passer en
 * children de <ProjectBentoCard shape="rectangle" expandOnHover />.
 */
export function ConseilConstitutionnelVisual() {
  return (
    <>
      <div className={styles.laptop}>
        <div className={styles.laptopShadowWrapper}>
          <div className={styles.laptopShadowInset}>
            <img src={shadowAsset} alt="" />
          </div>
        </div>
        <div className={styles.screenFrame}>
          <img src={screenFrameAsset} alt="" />
        </div>
        <div className={styles.body}>
          <img src={bodyAsset} alt="" />
        </div>
        <div className={styles.bottom}>
          <img src={bottomAsset} alt="" />
        </div>
        <div className={styles.bevelHardLight}>
          <img src={bevelHardLightAsset} alt="" />
        </div>
        <div className={styles.bevelMultiply}>
          <img src={bevelMultiplyAsset} alt="" />
        </div>
        <div className={styles.screenClip} />
        <div className={styles.displayBottom} />
      </div>
      <div className={styles.phone}>
        <img src={mobileScreenAsset} alt="" />
        <div className={styles.phoneScreenPlaceholder} />
      </div>
    </>
  );
}
