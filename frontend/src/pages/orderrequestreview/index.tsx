import { type FC } from 'react';
import styles from './styles/orderRequestReview.module.scss';
import { OrderRequestReviewForm } from './components/OrderRequestReviewForm';
import { OrderRequestReviewHandle } from './components/OrderRequestReviewHandle';
import { useNavigate } from '@tanstack/react-router';

export const OrderRequestReviewPage: FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.orderrequest_review_page}>
      <div className={styles.orderrequest_form}>
        <OrderRequestReviewForm />
      </div>
      <div className={styles.userrequest_handle}>
        <OrderRequestReviewHandle
          onSuccess={() => {
            navigate({ to: '/app/order-requests' });
          }}
        />
      </div>
    </div>
  );
};
