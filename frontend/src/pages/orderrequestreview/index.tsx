import { type FC } from 'react';
import styles from './styles/orderRequestReview.module.scss';
import { OrderRequestReviewForm } from './components/OrderRequestReviewForm';
import { OrderRequestReviewHandle } from './components/OrderRequestReviewHandle';
import { useNavigate, useParams } from '@tanstack/react-router';
import type { OrderRequest } from '@/types/api';
import { doApiAction } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const OrderRequestReviewPage: FC = () => {
  const navigate = useNavigate();
  const { orderrequestid: orderRequestId } = useParams({
    from: '/app/order-requests/$orderrequestid',
  });

  const { data: orderRequest } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['orderRequestValue'],
    queryFn: () =>
      doApiAction<OrderRequest>({
        endpoint: `/order-requests/${orderRequestId}`,
        method: 'GET',
      }),
  });

  return (
    <div className={styles.orderrequest_review_page}>
      <div className={styles.orderrequest_form}>
        <OrderRequestReviewForm />
      </div>
      {orderRequest?.status === 'PENDING' && (
        <div className={styles.userrequest_handle}>
          <OrderRequestReviewHandle
            onSuccess={() => {
              navigate({ to: '/app/order-requests' });
            }}
          />
        </div>
      )}
    </div>
  );
};
