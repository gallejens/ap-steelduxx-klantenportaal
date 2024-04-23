import { type FC } from 'react';
import styles from './styles/orderRequestReview.module.scss';
import { OrderRequestReviewForm } from './components/OrderRequestReviewForm';

export const OrderRequestReviewPage: FC = () => {
  return (
    <div className={styles.orderrequest_review_page}>
      <div className={styles.orderrequest_form}>
        <OrderRequestReviewForm />
      </div>
    </div>
  );
};
