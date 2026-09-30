import { forwardRef } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonColorScheme = 'neutral' | 'info' | 'warning' | 'success' | 'error';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Style visuel du bouton */
  variant?: ButtonVariant;
  /** Schéma de couleur — ignoré si variant="tertiary" (toujours neutre) */
  colorScheme?: ButtonColorScheme;
  /** Icône à gauche du label */
  leftIcon?: React.ReactNode;
  /** Icône à droite du label */
  rightIcon?: React.ReactNode;
  /** Contenu textuel du bouton */
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      colorScheme = 'neutral',
      leftIcon,
      rightIcon,
      disabled = false,
      children,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const hasSemanticColorScheme = variant !== 'tertiary' && colorScheme !== 'neutral';
    const isIconOnly = !children && (Boolean(leftIcon) || Boolean(rightIcon));
    const classes = [
      styles.button,
      styles[`variant-${variant}`],
      hasSemanticColorScheme ? styles[`color-scheme-${colorScheme}`] : '',
      isIconOnly ? styles.iconOnly : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        data-variant={variant}
        data-color-scheme={colorScheme}
        data-icon-only={isIconOnly}
        data-component="ds-br-button"
        className={classes}
        {...props}
      >
        {leftIcon && (
          <span className={styles.icon} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className={styles.icon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonColorScheme };
