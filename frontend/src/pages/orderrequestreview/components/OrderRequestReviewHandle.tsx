import { type FC } from 'react';
import { Button } from '@mantine/core';
import styles from '../styles/orderRequestReview.module.scss';
import { useTranslation } from 'react-i18next';
import { notifications } from '@/components/notifications';
import { doApiAction } from '@/lib/api';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ConfirmModal } from '@/components/modals';
import { useModalStore } from '@/stores/useModalStore';

export const OrderRequestReviewHandle: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { orderrequestid: orderRequestId } = useParams({
    from: '/app/order-requests/$orderrequestid',
  });
  const { openModal, closeModal } = useModalStore();

  const handleApproveClick = async () => {
    openModal(
      <ConfirmModal
        title={t('appshell:approveRequestConfirmation:approveConfirmTitle')}
        text={t('appshell:approveRequestConfirmation:approveConfirmText')}
        onConfirm={async () => {
          await approveOrderRequest();
          closeModal();
        }}
      />
    );
  };

  const handleDenyClick = async () => {
    openModal(
      <ConfirmModal
        title={t('appshell:denyRequestConfirmation:denyConfirmTitle')}
        text={t('appshell:denyRequestConfirmation:denyConfirmText')}
        onConfirm={async () => {
          await denyOrderRequest();
          closeModal();
        }}
      />
    );
  };

  const approveOrderRequest = async () => {
    const resultApprove = await doApiAction({
      endpoint: `/order-requests/${orderRequestId}/approve`,
      method: 'POST',
      body: {},
    });

    notifications.add({
      message: t(resultApprove?.message ?? 'notifications:genericError'),
      autoClose: 10000,
    });

    navigate({ to: '/app/order-requests' });
  };

  const denyOrderRequest = async () => {
    const resultDeny = await doApiAction({
      endpoint: `/order-requests/${orderRequestId}/deny`,
      method: 'POST',
      body: {},
    });

    notifications.add({
      message: t(resultDeny?.message ?? 'notifications:genericError'),
      autoClose: 10000,
    });

    navigate({ to: '/app/order-requests' });
  };

  return (
    <div className={styles.userrequest_handle}>
      <Button
        variant='filled'
        color='#1F9254'
        size='lg'
        onClick={handleApproveClick}
      >
        {t('userRequestReviewPage:approveButton')}
      </Button>
      <Button
        variant='filled'
        color='#A30D11'
        size='lg'
        onClick={handleDenyClick}
      >
        {t('userRequestReviewPage:denyButton')}
      </Button>
    </div>
  );
};
