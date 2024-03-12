import { useNavigate, useParams } from '@tanstack/react-router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRequestReviewForm } from './components/UserRequestReviewForm';
import { UserRequestReviewHandle } from './components/UserRequestReviewHandle';
import styles from './styles/userRequestReview.module.scss';

export const UserRequestReviewPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.userrequest_review_page}>
      <div className={styles.userrequest_form}>
        <UserRequestReviewForm />
      </div>
      <UserRequestReviewHandle />
    </div>
  );
};
