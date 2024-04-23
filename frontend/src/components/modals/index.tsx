import { useModalStore } from '@/stores/useModalStore';
import { Modal as MantineModal } from '@mantine/core';
import { type FC, type PropsWithChildren } from 'react';
import styles from './styles/modal.module.scss';
import classNames from 'classnames';

import { ConfirmModal } from './components/ConfirmModal';

export const Modals: FC = () => {
  const { modal } = useModalStore();

  if (modal === null) return null;

  return <>{modal.component}</>;
};

export const Modal: FC<
  PropsWithChildren & {
    title: string;
    onClose?: () => void;
    className?: string;
    size?: string;
  }
> = props => {
  const { closeModal } = useModalStore();

  return (
    <MantineModal
      opened
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      title={props.title}
      onClose={() => {
        closeModal();
        props.onClose?.();
      }}
      size={props.size ?? 'md'}
    >
      <div className={classNames(props.className, styles.modal_body)}>
        {props.children}
      </div>
    </MantineModal>
  );
};

export { ConfirmModal };
