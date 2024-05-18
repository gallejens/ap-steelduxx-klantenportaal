import type { FC } from 'react';
import { useParams, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import styles from './styles/orderDetails.module.scss';
import { doApiAction } from '@/lib/api';
import type { OrderDetails } from '@/types/api';
import { OrderInfo } from './components/OrderInfo';
import { MapInfo } from './components/MapInfo';
import { ProductList } from './components/ProductList';
import { Title } from '@mantine/core';
import { DocumentSection } from './components/DocumentSection';

export const OrderDetailsPage: FC = () => {
  const { t } = useTranslation();
  const { order_id: orderId } = useParams({
    from: '/app/orders/$order_id',
  });
  const { customerCode } = useSearch({
    from: '/app/orders/$order_id',
  });

  const {
    data: orderDetails,
    status,
    error,
  } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: () =>
      doApiAction<OrderDetails>({
        endpoint: `/orders/${orderId}`,
        method: 'GET',
        params: customerCode
          ? {
              customerCode,
            }
          : undefined,
      }),
  });

  if (status === 'pending') {
    return <div>{t('orderDetailsPage:loading')}</div>;
  }

  if (status === 'error' || !orderDetails) {
    return (
      <div>
        {t('orderDetailsPage:error')} | {error?.message ?? 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className={styles.orderDetails}>
      <Title
        order={2}
        className={styles.header}
      >
        {t('orderDetailPage:orderDetails')}: {orderDetails.referenceNumber}
      </Title>
      <div className={styles.container}>
        <div className={styles.columnLeft}>
          <div className={styles.topRow}>
            <OrderInfo orderDetail={orderDetails} />
            <div className={styles.documentsContainer}>
              <DocumentSection
                orderDetails={orderDetails}
                customerCode={customerCode}
              />
            </div>
          </div>
          <div className={styles.bottomRow}>
            <ProductList orderDetail={orderDetails} />
          </div>
        </div>
        <div className={styles.columnRight}>
          {orderDetails.state === 'SAILING' ? (
            <MapInfo orderDetail={orderDetails} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
