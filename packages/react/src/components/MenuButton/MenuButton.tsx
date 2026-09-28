import { forwardRef } from 'react';
import styles from './MenuButton.module.css';

type MenuButtonVariant = 'contained' | 'outlined';
type MenuButtonColorScheme = 'default' | 'light' | 'dark' | 'info' | 'warning';
type MenuButtonSize = 'nm' | 'md';

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Type visuel du bouton */
  variant?: MenuButtonVariant;
  /** Schéma de couleur — 'default' pour neutre, 'light'|'dark' pour outlined sur fond coloré, 'info'|'warning' pour les schémas sémantiques (contained et outlined) */
  colorScheme?: MenuButtonColorScheme;
  /** Taille du bouton */
  size?: MenuButtonSize;
  /** Icône à gauche du label */
  leftIcon?: React.ReactNode;
  /** Icône à droite du label */
  rightIcon?: React.ReactNode;
  /** Contenu textuel du bouton */
  children: React.ReactNode;
}

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  (
    {
      variant = 'contained',
      colorScheme = 'default',
      size = 'nm',
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
    const isSemanticColorScheme = colorScheme === 'info' || colorScheme === 'warning';
    const classes = [
      styles.menuButton,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      variant === 'outlined' || isSemanticColorScheme ? styles[`color-scheme-${colorScheme}`] : '',
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
        data-size={size}
        data-color-scheme={colorScheme}
        data-component="ds-br-menu-button"
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

MenuButton.displayName = 'MenuButton';

export { MenuButton };
export type { MenuButtonProps, MenuButtonVariant, MenuButtonColorScheme, MenuButtonSize };
