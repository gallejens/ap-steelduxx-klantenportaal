import { useForm } from '@mantine/form';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/userRequestReview.module.scss';
import { Button, NumberInput, TextInput } from '@mantine/core';
import { EMAIL_PLACEHOLDER } from '@/constants';

type UserRequestReviewFormValues = {
  companyName: string;
  phoneNr: string;
  vatNr: string;
  postalCode: string;
  district: string;
  street: string;
  streetNr: string;
  boxNr: string;
  firstName: string;
  lastName: string;
  email: string;
  createdOn: number;
};

export const UserRequestReviewForm: FC = () => {
  const { t } = useTranslation();

  const UserRequestReviewForm = useForm<UserRequestReviewFormValues>({});

  return (
    <form className={styles.userrequest_review_page_form}>
      <div className={styles.company_detail_fields}>
        <TextInput
          className={styles.company_field}
          label={t('userRequestForm:companyInputTitle')}
          disabled
        />
        <TextInput
          className={styles.email_field}
          label={t('userRequestForm:emailInputDescription')}
          disabled
        />

        <div className={styles.number_fields}>
          <TextInput
            label={t('userRequestForm:phoneNrInputTitle')}
            disabled
          />
          <TextInput
            label={t('userRequestForm:vatNrInputTitle')}
            disabled
          />
        </div>
        <div className={styles.place_fields}>
          <NumberInput
            label={t('userRequestForm:postalCodeInputTitle')}
            hideControls
            disabled
          />
          <TextInput
            label={t('userRequestForm:districtInputTitle')}
            disabled
          />
        </div>
        <div className={styles.street_fields}>
          <TextInput
            label={t('userRequestForm:streetInputTitle')}
            disabled
          />
          <TextInput
            label={t('userRequestForm:streetNrInputTitle')}
            disabled
          />
          <NumberInput
            label={t('userRequestForm:boxNrInputTitle')}
            hideControls
            disabled
          />
        </div>
      </div>
      <div className={styles.name_fields}>
        <TextInput
          label={t('userRequestForm:firstNameInputTitle')}
          description={t('userRequestForm:firstNameInputDescription')}
          disabled
        />
        <TextInput
          className={styles.lastname_field}
          label={' '}
          description={t('userRequestForm:lastNameInputDescription')}
          disabled
        />
      </div>
    </form>
  );
};
