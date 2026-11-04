import { forwardRef, useId, useState } from 'react';
import brique from '../../../assets/brand/brique-bullet.svg';
import briqueShadow from '../../../assets/brand/brique-bullet-shadow.svg';
import { Badge } from '../../atoms/Badge';
import styles from './BulletBrique.module.css';

interface BulletBriqueProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Intitulé de la puce (ex : « J’apporte de la clarté ») */
  children: React.ReactNode;
  /** Mots-clés révélés à l'ouverture, affichés en Badge md */
  keywords: string[];
}

const BulletBrique = forwardRef<HTMLDivElement, BulletBriqueProps>(
  ({ children, keywords, className, ...props }, ref) => {
    const listId = useId();
    // Ouverture au survol (comme Figma), au focus clavier, et au clic / tap (épinglée)
    const [hovered, setHovered] = useState(false);
    const [focusVisible, setFocusVisible] = useState(false);
    const [pinned, setPinned] = useState(false);
    const expanded = hovered || focusVisible || pinned;

    const classes = [styles.bulletBrique, expanded && styles['is-expanded'], className]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        data-component="ds-br-bullet-brique"
        data-state={expanded ? 'opened' : 'closed'}
        className={classes}
        {...props}
      >
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={expanded}
          aria-controls={listId}
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') setHovered(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse') setHovered(false);
          }}
          onFocus={(event) => setFocusVisible(event.currentTarget.matches(':focus-visible'))}
          onBlur={() => setFocusVisible(false)}
          onClick={() => setPinned((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setFocusVisible(false);
              setPinned(false);
            }
          }}
        >
          <span className={styles.brique} aria-hidden="true">
            <img src={briqueShadow} alt="" className={styles.shadow} />
            <img src={brique} alt="" className={styles.brick} />
          </span>
          <span className={styles.label}>{children}</span>
        </button>
        <div className={styles.panel}>
          <div className={styles.panelInner}>
            <ul id={listId} className={styles.keywords}>
              {keywords.map((keyword) => (
                <li key={keyword}>
                  <Badge size="md">{keyword}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
);

BulletBrique.displayName = 'BulletBrique';

export { BulletBrique };
export type { BulletBriqueProps };
