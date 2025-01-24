import Exit from '@/assets/svg/icon-close.svg';
import clsx from 'clsx';
import { FC, MouseEvent, ReactNode } from 'react';
import styles from './Modal.module.scss';

type ModalType = {
  title: string;
  children: ReactNode;
  isActive: boolean;
  onClose?: () => void;
};

export const Modal: FC<ModalType> = ({
  title,
  children,
  isActive = false,
  onClose = () => {},
}) => {
  const handleCb = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };
  return (
    <div
      onClick={(e) => handleCb(e)}
      className={clsx(styles.modalContainer, {
        [styles.hidden]: isActive === false,
      })}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <Exit className={styles.exit} onClick={onClose} />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
