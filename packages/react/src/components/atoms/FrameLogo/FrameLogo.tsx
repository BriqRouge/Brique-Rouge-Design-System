import { forwardRef } from 'react';
import styles from './FrameLogo.module.css';

interface FrameLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source de l'image */
  src: string;
  /** Texte alternatif pour l'accessibilité */
  alt?: string;
}

const FrameLogo = forwardRef<HTMLDivElement, FrameLogoProps>(
  ({ src, alt = '', className, ...props }, ref) => {
    const classes = [styles.frameLogo, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        data-component="ds-br-frame-logo"
        className={classes}
        {...props}
      >
        <img src={src} alt={alt} className={styles.image} />
      </div>
    );
  }
);

FrameLogo.displayName = 'FrameLogo';

export { FrameLogo };
export type { FrameLogoProps };
