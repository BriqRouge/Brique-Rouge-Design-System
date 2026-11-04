import { forwardRef } from 'react';
import styles from './BentoBox.module.css';

interface BentoBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Cartes `ProjectBentoCard`, dans l'ordre de lecture de la grille Figma :
   * Odaptos, iBP, Conseil constitutionnel (shape="rectangle"), CV, BPCE.
   */
  children: React.ReactNode;
}

const BentoBox = forwardRef<HTMLDivElement, BentoBoxProps>(
  ({ children, className, ...props }, ref) => {
    const classes = [styles.bentoBox, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} data-component="ds-br-bento-box" className={classes} {...props}>
        {children}
      </div>
    );
  }
);

BentoBox.displayName = 'BentoBox';

export { BentoBox };
export type { BentoBoxProps };
