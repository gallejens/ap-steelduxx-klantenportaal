import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/userRequestReview.module.scss';
import { NumberInput, TextInput } from '@mantine/core';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { doApiAction } from '@/lib/api';

type userRequestValue = {
  companyName: string;
  country: string;
  email: string;
  phoneNr: string;
  vatNr: string;
  postalCode: string;
  district: string;
  street: string;
  streetNr: string;
  boxNr: string;
  extraInfo: string;
  firstName: string;
  lastName: string;
  status: string;
};

export const UserRequestReviewForm: FC<userRequestValue> = () => {
  const { t } = useTranslation();

  const { request_id: requestId } = useParams({
    from: '/app/requests/$request_id',
  });

  const { data: userRequestValue } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['userRequestValue'],
    queryFn: () =>
      doApiAction<userRequestValue>({
        endpoint: `/user_requests/${requestId}`,
        method: 'GET',
      }),
  });

  return (
    <form className={styles.userrequest_review_page_form}>
      <div className={styles.company_detail_fields}>
        <div className={styles.company_fields}>
          <TextInput
            className={styles.companyName_field}
            label={t('userRequestForm:companyInputTitle')}
            value={userRequestValue?.companyName}
            disabled
          />
          <TextInput
            className={styles.country_field}
            label={t('userRequestForm:countryInputTitle')}
            value={userRequestValue?.country}
            disabled
          />
        </div>

        <TextInput
          className={styles.email_field}
          label={t('userRequestForm:emailInputDescription')}
          value={userRequestValue?.email}
          disabled
        />

        <div className={styles.number_fields}>
          <TextInput
            label={t('userRequestForm:phoneNrInputTitle')}
            value={userRequestValue?.phoneNr}
            disabled
          />
          <TextInput
            label={t('userRequestForm:vatNrInputTitle')}
            value={userRequestValue?.vatNr}
            disabled
          />
        </div>
        <div className={styles.place_fields}>
          <NumberInput
            label={t('userRequestForm:postalCodeInputTitle')}
            value={userRequestValue?.postalCode}
            hideControls
            disabled
          />
          <TextInput
            label={t('userRequestForm:districtInputTitle')}
            value={userRequestValue?.district}
            disabled
          />
        </div>
        <div className={styles.street_fields}>
          <TextInput
            className={styles.street_field}
            label={t('userRequestForm:streetInputDescription')}
            value={userRequestValue?.street}
            disabled
          />
          <TextInput
            className={styles.streetNr_field}
            label={t('userRequestForm:streetNrInputDescription')}
            value={userRequestValue?.streetNr}
            disabled
          />
          <NumberInput
            className={styles.boxNr_field}
            label={t('userRequestForm:boxNrInputDescription')}
            value={userRequestValue?.boxNr}
            hideControls
            disabled
          />
        </div>
        <TextInput
          className={styles.extraInfo_field}
          label={t('userRequestForm:extraInfoInputDescription')}
          value={userRequestValue?.extraInfo}
          disabled
        />
      </div>
      <div className={styles.name_fields}>
        <TextInput
          label={t('userRequestForm:firstNameInputTitle')}
          description={t('userRequestForm:firstNameInputDescription')}
          value={userRequestValue?.firstName}
          disabled
        />
        <TextInput
          className={styles.lastname_field}
          label={' '}
          description={t('userRequestForm:lastNameInputDescription')}
          value={userRequestValue?.lastName}
          disabled
        />
      </div>
    </form>
  );
};
