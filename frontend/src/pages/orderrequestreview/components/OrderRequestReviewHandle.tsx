import { type FC, useState } from 'react';
import { Button } from '@mantine/core';
import styles from '../styles/orderRequestReview.module.scss';
import { useTranslation } from 'react-i18next';
import { notifications } from '@/components/notifications';
import { type GenericAPIResponse, doApiAction } from '@/lib/api';
import { useParams } from '@tanstack/react-router';
import { ConfirmModal } from '@/components/modals';

type Props = {
  onSubmit?: () => void;
  onSuccess?: () => void;
};

export const OrderRequestReviewHandle: FC<Props> = props => {
  const { t } = useTranslation();
  const { orderrequestid: orderRequestId } = useParams({
    from: '/app/order-requests/$orderrequestid',
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const handleApproveClick = async () => {
    setActionType('approve');
    setIsConfirmModalOpen(true);
  };

  const handleDenyClick = async () => {
    setActionType('deny');
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsConfirmModalOpen(false);
    if (actionType === 'approve') {
      await approveOrderRequest();
    } else if (actionType === 'deny') {
      await denyOrderRequest();
    }
  };

  const approveOrderRequest = async () => {
    const resultApprove = await doApiAction<
      GenericAPIResponse<{ message: string }>
    >({
      endpoint: `/order-requests/${orderRequestId}/approve`,
      method: 'POST',
      body: {},
    });

    notifications.add({
      message: t(resultApprove?.message ?? 'notifications:genericError'),
      autoClose: 10000,
    });

    props.onSubmit?.();

    if (resultApprove?.message === 'orderRequestReviewPage:response:success') {
      props.onSuccess?.();
    }
  };

  const denyOrderRequest = async () => {
    const resultDeny = await doApiAction<
      GenericAPIResponse<{ message: string }>
    >({
      endpoint: `/order-requests/${orderRequestId}/deny`,
      method: 'POST',
      body: {},
    });

    notifications.add({
      message: t(resultDeny?.message ?? 'notifications:genericError'),
      autoClose: 10000,
    });

    props.onSubmit?.();

    if (resultDeny?.message === 'orderRequestReviewPage:response:denied') {
      props.onSuccess?.();
    }
  };

  return (
    <>
      <div className={styles.button_container}>
        <Button
          className={styles.approve_button}
          variant='filled'
          color='#1F9254'
          size='lg'
          onClick={handleApproveClick}
        >
          {t('userRequestReviewPage:approveButton')}
        </Button>

        <Button
          className={styles.deny_button}
          variant='filled'
          color='#A30D11'
          size='lg'
          onClick={handleDenyClick}
        >
          {t('userRequestReviewPage:denyButton')}
        </Button>
      </div>

      {isConfirmModalOpen && (
        <ConfirmModal
          title={
            actionType === 'approve'
              ? t('appshell:approveRequestConfirmation:approveConfirmTitle')
              : t('appshell:denyRequestConfirmation:denyConfirmTitle')
          }
          text={
            actionType === 'approve'
              ? t('appshell:approveRequestConfirmation:approveConfirmText')
              : t('appshell:denyRequestConfirmation:denyConfirmText')
          }
          onConfirm={handleConfirm}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </>
  );
};
