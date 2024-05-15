import type { FC } from 'react';
import { useParams, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import styles from './styles/orderDetails.module.scss';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import type { OrderDetails } from '@/types/api';
import { OrderInfo } from './components/OrderInfo';
import { MapInfo } from './components/MapInfo';
import { ProductList } from './components/ProductList';
import { Title } from '@mantine/core';

export const OrderDetailsPage: FC = () => {
  const { t } = useTranslation();
  const { order_id: orderId } = useParams({
    from: '/app/orders/$order_id',
  });
  const { customerCode } = useSearch({
    from: '/app/orders/$order_id',
  });

  const {
    data: orderDetail,
    status,
    error,
  } = useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: () =>
      doApiAction<GenericAPIResponse<OrderDetails>>({
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

  if (status === 'error' || !orderDetail) {
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
        {t('orderDetailPage:orderDetails')}: {orderDetail?.data.referenceNumber}
      </Title>
      <div className={styles.container}>
        <div className={styles.columnLeft}>
          <div className={styles.topRow}>
            <OrderInfo orderDetail={orderDetail.data} />
            {/* <div className={styles.documentsContainer}>
              <OrderDocuments documents={} />
            </div> */}
          </div>
          <div className={styles.bottomRow}>
            <ProductList orderDetail={orderDetail.data} />
          </div>
        </div>
        <div className={styles.columnRight}>
          {orderDetail.data.state === 'SAILING' ? (
            <MapInfo orderDetail={orderDetail.data} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
