import { type FC } from 'react';
import { UserRequestReviewForm } from './components/UserRequestReviewForm';
import { UserRequestReviewHandle } from './components/UserRequestReviewHandle';
import styles from './styles/userRequestReview.module.scss';
import { useNavigate } from '@tanstack/react-router';

export const UserRequestReviewPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.userrequest_review_page}>
      <div className={styles.userrequest_form}>
        <UserRequestReviewForm
          companyName={''}
          country={''}
          email={''}
          phoneNr={''}
          vatNr={''}
          postalCode={''}
          district={''}
          street={''}
          streetNr={''}
          boxNr={''}
          extraInfo={''}
          firstName={''}
          lastName={''}
          status={''}
        />
      </div>
      <div className={styles.userrequest_handle}>
        <UserRequestReviewHandle
          onSucces={() => {
            navigate({ to: '/app/requests' });
          }}
        />
      </div>
    </div>
  );
};
