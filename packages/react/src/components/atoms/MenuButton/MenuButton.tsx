import { forwardRef } from 'react';
import styles from './MenuButton.module.css';

type MenuButtonVariant = 'contained' | 'outlined';
type MenuButtonMode = 'default' | 'light' | 'dark';
type MenuButtonSize = 'sm' | 'nm' | 'md';

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Type visuel du bouton */
  variant?: MenuButtonVariant;
  /**
   * Mode (propriété Figma `Mode`) — 'default' pour contained ; pour outlined :
   * 'dark' = contour blanc, pour fond sombre · 'light' = contour noir, pour fond clair
   */
  mode?: MenuButtonMode;
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
      mode = 'default',
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
    const isIconOnly = !children && (Boolean(leftIcon) || Boolean(rightIcon));
    const classes = [
      styles.menuButton,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      variant === 'outlined' ? styles[`mode-${mode}`] : '',
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
        data-size={size}
        data-icon-only={isIconOnly}
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
export type { MenuButtonProps, MenuButtonVariant, MenuButtonMode, MenuButtonSize };
