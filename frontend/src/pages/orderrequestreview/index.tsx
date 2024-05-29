import { type FC } from 'react';
import styles from './styles/orderRequestReview.module.scss';
import { OrderRequestReviewForm } from './components/OrderRequestReviewForm';
import { OrderRequestReviewHandle } from './components/OrderRequestReviewHandle';
import { useParams } from '@tanstack/react-router';
import type { OrderRequest } from '@/types/api';
import { doApiAction } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { ProductsList } from '@/components/productslist';
import LoaderComponent from '@/components/loader';
import { Divider, Title } from '@mantine/core';
import { useModalStore } from '@/stores/useModalStore';
import { EditProductModal } from './modal/EditProductModal';
import { useTranslation } from 'react-i18next';

export const OrderRequestReviewPage: FC = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const { orderrequestid: orderRequestId } = useParams({
    from: '/app/order-requests/$orderrequestid',
  });

  const {
    data: orderRequest,
    status,
    error,
  } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['orderRequestValue'],
    queryFn: () =>
      doApiAction<OrderRequest>({
        endpoint: `/order-requests/${orderRequestId}`,
        method: 'GET',
      }),
  });

  if (status === 'pending') {
    return <LoaderComponent />;
  }

  if (status === 'error' || !orderRequest) {
    return <div>{error?.message ?? 'Unknown error'}</div>;
  }

  const openEditProductModal = (productIdx: number) => {
    const product = orderRequest.products[productIdx];
    if (!product) return;

    openModal(<EditProductModal product={product} />);
  };

  const allowEditing = orderRequest.status === 'PENDING';

  return (
    <div className={styles.orderrequest_review_page}>
      <div className={styles.info}>
        <Title order={3}>{t('orderRequestReviewPage:infoTitle')}</Title>
        <Divider my='xs' />
        <OrderRequestReviewForm
          orderRequest={orderRequest}
          allowEditing={allowEditing}
        />
        {orderRequest.status === 'PENDING' && <OrderRequestReviewHandle />}
      </div>
      <Divider orientation='vertical' />
      <ProductsList
        className={styles.products}
        products={orderRequest.products}
        onEditProduct={allowEditing ? openEditProductModal : undefined}
      />
    </div>
  );
};
