import { forwardRef } from 'react';
import styles from './Link.module.css';

type LinkSize = 'sm' | 'md' | 'lg';
type LinkTheme = 'light' | 'dark';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  size?: LinkSize;
  /** `dark` pour un lien posé sur fond sombre */
  theme?: LinkTheme;
  /** Icône à gauche (Figma : booléen Left Icon + Left Icon Swap) */
  leftIcon?: React.ReactNode;
  /** Icône à droite (Figma : booléen Right Icon + Right Icon Swap) */
  rightIcon?: React.ReactNode;
  /** Lien inactif : sans href, non focalisable, annoncé comme désactivé */
  disabled?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      size = 'md',
      theme = 'light',
      leftIcon,
      rightIcon,
      disabled = false,
      href,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const classes = [styles.link, styles[`size-${size}`], styles[`theme-${theme}`], className]
      .filter(Boolean)
      .join(' ');

    return (
      <a
        ref={ref}
        data-component="ds-br-link"
        data-size={size}
        data-theme={theme}
        className={classes}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
        {...props}
      >
        {leftIcon && (
          <span className={styles.icon} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className={styles.label}>{children}</span>
        {rightIcon && (
          <span className={styles.icon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link };
export type { LinkProps, LinkSize, LinkTheme };
