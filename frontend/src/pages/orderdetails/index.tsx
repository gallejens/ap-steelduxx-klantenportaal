import type { FC } from 'react';
import { useParams, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import styles from './styles/orderDetails.module.scss';
import { doApiAction } from '@/lib/api';
import type { OrderDetails } from '@/types/api';
import { OrderInfo } from './components/OrderInfo';
import { MapInfo } from './components/MapInfo';
import { Divider, Title } from '@mantine/core';
import { DocumentSection } from './components/DocumentSection';
import LoaderComponent from '@/components/loader';
import { ProductsList } from '@/components/productslist';
import { SHOULD_SHOW_MAP_STATES } from './constants';

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
    return <LoaderComponent />;
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
      <div className={styles.header}>
        <Title order={2}>{t('orderDetailPage:title')}</Title>
        <Title order={3}>
          {orderDetails.referenceNumber} -{' '}
          {orderDetails.customerReferenceNumber}
        </Title>
      </div>
      <Divider orientation='horizontal' />
      <div className={styles.body}>
        <div className={styles.general_info}>
          <OrderInfo orderDetail={orderDetails} />
          <Divider />
          <DocumentSection
            orderDetails={orderDetails}
            customerCode={customerCode}
          />
        </div>
        <Divider orientation='vertical' />
        <ProductsList
          products={orderDetails.products}
          className={styles.products}
        />
        {SHOULD_SHOW_MAP_STATES.has(orderDetails.state) && (
          <>
            <Divider orientation='vertical' />
            <div className={styles.map}>
              <MapInfo imo={orderDetails.shipIMO} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
