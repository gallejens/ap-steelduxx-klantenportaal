import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/orderDetails.module.scss';
import type { OrderDetails, OrderState, OrderTransportType } from '@/types/api';
import { Title } from '@mantine/core';

interface OrderInfoProps {
  orderDetail: OrderDetails;
}

export const OrderInfo: FC<OrderInfoProps> = ({ orderDetail }) => {
  const { t } = useTranslation();

  function getTransportTypeClass(transportType: OrderTransportType): string {
    switch (transportType) {
      case 'IMPORT':
        return styles.import;
      case 'EXPORT':
        return styles.export;
      default:
        return '';
    }
  }

  function getStateClass(state: OrderState): string {
    switch (state) {
      case 'SAILING':
        return styles.sailing;
      case 'PLANNED':
        return styles.planned;
      case 'CREATED':
        return styles.created;
      case 'ARRIVED':
        return styles.arrived;
      case 'CLOSED':
        return styles.closed;
      case 'LOADED':
        return styles.loaded;
      default:
        return '';
    }
  }

  if (!orderDetail) {
    return <div>{t('orderDetailsPage:loading')}</div>;
  }

  return (
    <div className={styles.orderInfo}>
      <div className={styles.generalInfo}>
        <section>
          <Title order={3}>{t('orderDetailPage:generalInfo')}</Title>
          <p className={styles.subTitle}>
            {t('orderDetailPage:customerReference')}
          </p>
          <p>{orderDetail.customerReferenceNumber ?? '?'}</p>
          <p className={styles.subTitle}>{t('orderDetailPage:state')}</p>
          <p className={getStateClass(orderDetail.state)}>
            {orderDetail.state ?? '?'}
          </p>
          <p className={styles.subTitle}>
            {t('orderDetailPage:transportType')}
          </p>
          <p className={getTransportTypeClass(orderDetail.transportType)}>
            {orderDetail.transportType}
          </p>
          <p className={styles.subTitle}>{t('orderDetailPage:origin')}</p>
          <p>
            {orderDetail.portOfOriginName ?? '?'} -{' '}
            {orderDetail.portOfOriginCode ?? '?'}
          </p>
          <p className={styles.subTitle}>{t('orderDetailPage:destination')}</p>
          <p>
            {orderDetail.portOfDestinationName ?? '?'} -{' '}
            {orderDetail.portOfDestinationCode ?? '?'}
          </p>
        </section>
      </div>
      <div className={styles.timeInfo}>
        <section>
          <Title order={3}>{t('orderDetailPage:timeInformation')}</Title>
          <p className={styles.subTitle}>{t('orderDetailPage:ets')}</p>
          <p>{orderDetail.ets ?? '?'}</p>
          <p className={styles.subTitle}>{t('orderDetailPage:ats')}</p>
          <p>{orderDetail.ats ?? '?'}</p>
          <p className={styles.subTitle}>{t('orderDetailPage:eta')}</p>
          <p>{orderDetail.eta ?? '?'}</p>
          <p className={styles.subTitle}>{t('orderDetailPage:ata')}</p>
          <p>{orderDetail.ata ?? '?'}</p>
          <p className={styles.subTitle}>
            {t('orderDetailPage:estimatedTimeCargoOnQuay')}
          </p>
          <p>{orderDetail.estimatedTimeCargoOnQuay || '?'}</p>
          <p className={styles.subTitle}>
            {t('orderDetailPage:actualTimeCargoLoaded')}
          </p>
          <p>{orderDetail.actualTimeCargoLoaded || '?'}</p>
        </section>
      </div>
      <div className={styles.shipInfo}>
        <section>
          <Title order={3}>{t('orderDetailPage:shipInformation')}</Title>
          <p className={styles.subTitle}>{t('orderDetailPage:shipName')}</p>
          <p>{orderDetail.shipName ?? '?'}</p>
          <p className={styles.subTitle}>{t('orderDetailPage:imo')}</p>
          <p>{orderDetail.shipIMO ?? '?'}</p>
          <p className={styles.subTitle}>{t('orderDetailPage:mmsi')}</p>
          <p>{orderDetail.shipMMSI ?? '?'}</p>
          <p className={styles.subTitle}>{t('orderDetailPage:type')}</p>
          <p>{orderDetail.shipType ?? '?'}</p>
        </section>
      </div>
    </div>
  );
};
