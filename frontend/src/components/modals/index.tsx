import { useModalStore } from '@/stores/useModalStore';
import { Modal as MantineModal } from '@mantine/core';
import { type FC, type PropsWithChildren } from 'react';

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
    >
      {props.children}
    </MantineModal>
  );
};

export { ConfirmModal };
