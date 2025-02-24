import clsx from 'clsx';
import { FC, FocusEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import styles from './Button.module.scss';

type ButtonProps = {
  children: ReactNode;
  normalWidth?: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onFocus?: (event: FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (event: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export const Button: FC<ButtonProps> = ({
  children,
  normalWidth = false,
  disabled = false,
  ...remainingProps
}) => {
  return (
    <button
      className={clsx(styles.button, normalWidth && styles.normalWidth)}
      disabled={disabled}
      {...remainingProps}
    >
      {children}
    </button>
  );
};
