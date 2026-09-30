import { forwardRef } from 'react';
import styles from './DropdownMenu.module.css';

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Contenu du menu — typiquement des <DropdownMenuButton /> */
  children: React.ReactNode;
}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, className, ...props }, ref) => {
    const classes = [styles.dropdownMenu, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        data-component="ds-br-dropdown-menu"
        role="menu"
        className={classes}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';

export { DropdownMenu };
export type { DropdownMenuProps };
