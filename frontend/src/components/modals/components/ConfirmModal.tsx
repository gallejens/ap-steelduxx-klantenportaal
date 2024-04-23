import { Button, Text } from '@mantine/core';
import type { FC } from 'react';
import { Modal } from '..';
import styles from '../styles/confirmmodal.module.scss';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  text?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const ConfirmModal: FC<Props> = props => {
  const { t } = useTranslation();

  return (
    <Modal
      title={props.title}
      onClose={props.onCancel}
      className={styles.confirm_modal}
    >
      {props.text && <Text size='sm'>{props.text}</Text>}
      <div className={styles.action_button}>
        <Button onClick={props.onConfirm}>{t('modals:confirm:action')}</Button>
      </div>
    </Modal>
  );
};
