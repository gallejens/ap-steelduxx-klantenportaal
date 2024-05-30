import { useModalStore } from '@/stores/useModalStore';
import { Divider, Modal as MantineModal } from '@mantine/core';
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
    className?: string;
    size?: string;
  }
> = props => {
  const { closeModal } = useModalStore();

  return (
    <MantineModal.Root
      opened
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      onClose={() => {
        closeModal();
        props.onClose?.();
      }}
      size={props.size ?? 'md'}
      padding={0}
    >
      <MantineModal.Overlay />
      <MantineModal.Content>
        <MantineModal.Header>
          <MantineModal.Title>{props.title}</MantineModal.Title>
          <MantineModal.CloseButton />
        </MantineModal.Header>
        <Divider
          orientation='horizontal'
          mb='xs'
        />
        <MantineModal.Body>
          <div className={props.className}>{props.children}</div>
        </MantineModal.Body>
      </MantineModal.Content>
    </MantineModal.Root>
  );
};

export { ConfirmModal };
