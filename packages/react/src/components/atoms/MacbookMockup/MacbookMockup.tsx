import { forwardRef } from 'react';
import styles from './MacbookMockup.module.css';
import shadowAsset from './assets/shadow.svg';
import rubberAsset from './assets/rubber.svg';
import feetAsset from './assets/feet.svg';
import bodyAsset from './assets/body.svg';
import bottomAsset from './assets/bottom.svg';
import bodyShadesAsset from './assets/body-shades.svg';
import screenFrameAsset from './assets/screen-frame.svg';
import bevelHardLightAsset from './assets/bevel-hard-light.svg';
import bevelMultiplyAsset from './assets/bevel-multiply.svg';

interface MacbookMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Contenu affiché dans l'écran — typiquement une capture d'écran */
  children: React.ReactNode;
}

const MacbookMockup = forwardRef<HTMLDivElement, MacbookMockupProps>(
  ({ children, className, ...props }, ref) => {
    const classes = [styles.mockup, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} data-component="ds-br-macbook-mockup" className={classes} {...props}>
        <div className={styles.shadowWrapper}>
          <div className={styles.shadowInset}>
            <img src={shadowAsset} alt="" />
          </div>
        </div>
        <div className={styles.rubberRight}>
          <img src={rubberAsset} alt="" />
        </div>
        <div className={styles.feetRight}>
          <img src={feetAsset} alt="" />
        </div>
        <div className={styles.rubberLeft}>
          <img src={rubberAsset} alt="" />
        </div>
        <div className={styles.feetLeft}>
          <img src={feetAsset} alt="" />
        </div>
        <div className={styles.body}>
          <img src={bodyAsset} alt="" />
        </div>
        <div className={styles.bottom}>
          <img src={bottomAsset} alt="" />
        </div>
        <div className={styles.bodyShades}>
          <img src={bodyShadesAsset} alt="" />
        </div>
        <div className={styles.screenFrame}>
          <img src={screenFrameAsset} alt="" />
        </div>
        <div className={styles.screen}>{children}</div>
        <div className={styles.displayBottom} />
        <div className={styles.bevelHardLight}>
          <img src={bevelHardLightAsset} alt="" />
        </div>
        <div className={styles.bevelMultiply}>
          <img src={bevelMultiplyAsset} alt="" />
        </div>
      </div>
    );
  }
);

MacbookMockup.displayName = 'MacbookMockup';

export { MacbookMockup };
export type { MacbookMockupProps };
