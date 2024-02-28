import { Button, Group, Text } from '@mantine/core';
import type { FC } from 'react';
import { Modal } from '..';

type Props = {
  title: string;
  text?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const ConfirmModal: FC<Props> = props => {
  return (
    <Modal
      title={props.title}
      onClose={props.onCancel}
    >
      {props.text && <Text size='sm'>{props.text}</Text>}
      <Group
        justify='flex-end'
        mt='md'
      >
        <Button
          type='submit'
          onClick={props.onConfirm}
        >
          Confirm
        </Button>
      </Group>
    </Modal>
  );
};
