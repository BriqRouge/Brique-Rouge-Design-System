import { forwardRef } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'contained' | 'outlined';
export type ButtonColorScheme = 'default' | 'light' | 'dark';
export type ButtonSize = 'nm' | 'md';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  colorScheme?: ButtonColorScheme;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'contained',
      colorScheme = 'default',
      size = 'nm',
      children,
      leftIcon,
      rightIcon,
      disabled,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const classes = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      variant === 'outlined' ? styles[`color-scheme-${colorScheme}`] : '',
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
