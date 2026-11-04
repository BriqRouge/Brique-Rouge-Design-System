import { forwardRef } from 'react';
import styles from './Badge.module.css';

type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeVariant = 'contained' | 'outlined';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  size?: BadgeSize;
  /** `outlined` est destiné aux fonds sombres (bordure et texte clairs) */
  variant?: BadgeVariant;
  leftIcon?: boolean;
  rightIcon?: boolean;
}

function RadioFillIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 4.5C5.17157 4.5 4.5 5.17157 4.5 6C4.5 6.82843 5.17157 7.5 6 7.5C6.82843 7.5 7.5 6.82843 7.5 6C7.5 5.17157 6.82843 4.5 6 4.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M8.99998 8.99998L6.00001 6.00001M6.00001 6.00001L3 3M6.00001 6.00001L9.00002 3M6.00001 6.00001L3 9.00002"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, size = 'md', variant = 'contained', leftIcon = false, rightIcon = false, className, ...props }, ref) => {
    const classes = [styles.badge, styles[`size-${size}`], styles[`variant-${variant}`], className]
      .filter(Boolean)
      .join(' ');

    return (
      <span
        ref={ref}
        data-component="ds-br-badge"
        data-size={size}
        data-variant={variant}
        className={classes}
        {...props}
      >
        {leftIcon && (
          <span className={styles.icon}>
            <RadioFillIcon />
          </span>
        )}
        <span className={styles.label}>{children}</span>
        {rightIcon && (
          <span className={styles.icon}>
            <CloseIcon />
          </span>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps, BadgeSize, BadgeVariant };
