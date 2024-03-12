import { FC } from 'react';
import { UserRequestReviewForm } from './components/UserRequestReviewForm';
import { UserRequestReviewHandle } from './components/UserRequestReviewHandle';
import styles from './styles/userRequestReview.module.scss';

export const UserRequestReviewPage: FC = () => {
  return (
    <div className={styles.userrequest_review_page}>
      <div className={styles.userrequest_form}>
        <UserRequestReviewForm
          companyName={''}
          email={''}
          phoneNr={''}
          vatNr={''}
          postalCode={''}
          district={''}
          street={''}
          streetNr={''}
          boxNr={''}
          firstName={''}
          lastName={''}
          status={''}
        />
      </div>
      <div className={styles.userrequest_handle}>
        <UserRequestReviewHandle />
      </div>
    </div>
  );
};
