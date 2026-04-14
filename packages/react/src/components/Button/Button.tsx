import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'contained' | 'outlined';
export type ButtonColorScheme = 'default' | 'light' | 'dark';
export type ButtonSize = 'nm' | 'md';

export interface ButtonProps {
  variant?: ButtonVariant;
  colorScheme?: ButtonColorScheme;
  size?: ButtonSize;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

export function Button({
  variant = 'contained',
  colorScheme = 'default',
  size = 'nm',
  children,
  leftIcon,
  rightIcon,
  disabled = false,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    variant === 'outlined' ? styles[`outlined--${colorScheme}`] : undefined,
    styles[`size--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {leftIcon !== undefined && (
        <span className={styles.icon} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children !== undefined && (
        <span className={styles.label}>{children}</span>
      )}
      {rightIcon !== undefined && (
        <span className={styles.icon} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
