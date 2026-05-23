import { forwardRef, useState, useEffect, useRef, useId } from 'react';
import { MenuButton } from '../MenuButton';
import { DropdownMenu } from '../DropdownMenu';
import type { MenuButtonVariant, MenuButtonColorScheme, MenuButtonSize } from '../MenuButton';
import styles from './DropdownMenuTrigger.module.css';

interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Contenu du menu — typiquement des <DropdownMenuButton /> */
  children: React.ReactNode;
  /** Label du bouton déclencheur */
  triggerLabel: string;
  /** Icône à gauche du bouton trigger */
  triggerLeftIcon?: React.ReactNode;
  /** Icône à droite du bouton trigger */
  triggerRightIcon?: React.ReactNode;
  /** Variant du bouton trigger */
  triggerVariant?: MenuButtonVariant;
  /** Color scheme du bouton trigger */
  triggerColorScheme?: MenuButtonColorScheme;
  /** Size du bouton trigger */
  triggerSize?: MenuButtonSize;
  /** État contrôlé (optionnel — si non fourni, le composant gère son état en interne) */
  open?: boolean;
  /** Callback quand l'état open/close change */
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenuTrigger = forwardRef<HTMLDivElement, DropdownMenuTriggerProps>(
  (
    {
      children,
      triggerLabel,
      triggerLeftIcon,
      triggerRightIcon,
      triggerVariant = 'contained',
      triggerColorScheme = 'default',
      triggerSize = 'nm',
      open: controlledOpen,
      onOpenChange,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const menuId = useId();

    const cancelClose = () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };

    const scheduleClose = () => {
      cancelClose();
      closeTimer.current = setTimeout(() => {
        if (!isControlled) setInternalOpen(false);
        onOpenChange?.(false);
      }, 150);
    };

    const handleOpen = () => {
      cancelClose();
      if (isOpen) return;
      if (!isControlled) setInternalOpen(true);
      onOpenChange?.(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (!containerRef.current?.contains(e.relatedTarget as Node)) {
        scheduleClose();
      }
    };

    // Nettoyage du timer à la destruction du composant
    useEffect(() => {
      return () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
      };
    }, []);

    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cancelClose();
          if (!isControlled) setInternalOpen(false);
          onOpenChange?.(false);
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          cancelClose();
          if (!isControlled) setInternalOpen(false);
          onOpenChange?.(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, isControlled, onOpenChange]);

    const classes = [styles.dropdownMenuTrigger, className].filter(Boolean).join(' ');

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-component="ds-br-dropdown-menu-trigger"
        data-state={isOpen ? 'open' : 'closed'}
        className={classes}
        onMouseEnter={handleOpen}
        onMouseLeave={scheduleClose}
        onBlur={handleBlur}
        {...props}
      >
        <MenuButton
          variant={triggerVariant}
          colorScheme={triggerColorScheme}
          size={triggerSize}
          leftIcon={triggerLeftIcon}
          rightIcon={triggerRightIcon}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={isOpen ? menuId : undefined}
          onFocus={handleOpen}
          onClick={handleOpen}
        >
          {triggerLabel}
        </MenuButton>
        <DropdownMenu
          id={menuId}
          className={styles.menu}
          aria-hidden={isOpen ? undefined : true}
        >
          {children}
        </DropdownMenu>
      </div>
    );
  }
);

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export { DropdownMenuTrigger };
export type { DropdownMenuTriggerProps };
