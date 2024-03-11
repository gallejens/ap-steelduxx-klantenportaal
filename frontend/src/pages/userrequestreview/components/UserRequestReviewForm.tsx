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
    <form className={styles.userrequest_page_form}>
      <div className={styles.company_detail_fields}>
        <TextInput
          label={t('userrequestpage:companyInputTitle')}
          placeholder={t('userrequestpage:companyInputPlaceholder')}
          disabled
        />
        <div className={styles.number_fields}>
          <TextInput
            label={t('userrequestpage:phoneNrInputTitle')}
            placeholder={t('userrequestpage:phoneNrInputPlaceholder')}
            disabled
          />
          <TextInput
            label={t('userrequestpage:vatNrInputTitle')}
            placeholder={t('userrequestpage:vatNrInputPlaceholder')}
            disabled
          />
        </div>
        <div className={styles.place_fields}>
          <NumberInput
            label={t('userrequestpage:postalCodeInputTitle')}
            placeholder={t('userrequestpage:postalCodeInputPlaceholder')}
            hideControls
            disabled
          />
          <TextInput
            label={t('userrequestpage:districtInputTitle')}
            placeholder={t('userrequestpage:districtInputPlaceholder')}
            disabled
          />
        </div>
        <div className={styles.street_fields}>
          <TextInput
            label={t('userrequestpage:streetInputTitle')}
            placeholder={t('userrequestpage:streetInputPlaceholder')}
            disabled
          />
          <TextInput
            label={t('userrequestpage:streetNrInputTitle')}
            placeholder={t('userrequestpage:streetNrInputPlaceholder')}
            disabled
          />
          <NumberInput
            label={t('userrequestpage:boxNrInputTitle')}
            placeholder={t('userrequestpage:boxNrInputPlaceholder')}
            hideControls
            disabled
          />
        </div>
      </div>
      <div className={styles.name_fields}>
        <TextInput
          label={t('userrequestpage:firstNameInputTitle')}
          placeholder={t('userrequestpage:firstNameInputPlaceholder')}
          disabled
        />
        <TextInput
          className={styles.lastname_field}
          label={' '}
          placeholder={t('userrequestpage:lastNameInputPlaceholder')}
          disabled
        />
        <TextInput
          className={styles.email_field}
          label={t(' ')}
          placeholder={EMAIL_PLACEHOLDER}
          disabled
        />
      </div>
      <div className={styles.back_button}>
        <div className={styles.userrequest_button}>
          <Button
            onClick={() => history.go(-1)}
            className={styles.back_button}
          >
            {t('userrequestreviewpage:userRequestButton')}
          </Button>
        </div>
      </div>
    </form>
  );
};
