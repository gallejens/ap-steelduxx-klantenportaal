import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/userRequestReview.module.scss';
import { NumberInput, TextInput } from '@mantine/core';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { doApiAction } from '@/lib/api';
import type { UserRequest } from '@/types/userrequest';

export const UserRequestReviewForm: FC<UserRequest.UserRequestValue> = () => {
  const { t } = useTranslation();

  const { request_id: requestId } = useParams({
    from: '/app/requests/$request_id',
  });

  const { data: userRequestValue } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['userRequestValue'],
    queryFn: () =>
      doApiAction<UserRequest.UserRequestValue>({
        endpoint: `/user-requests/${requestId}`,
        method: 'GET',
      }),
  });

  return (
    <form className={styles.userrequest_review_page_form}>
      <div className={styles.company_detail_fields}>
        <div className={styles.double_row}>
          <TextInput
            label={t('userRequestForm:companyInputTitle')}
            value={userRequestValue?.companyName}
            disabled
          />
          <TextInput
            label={t('userRequestForm:countryInputTitle')}
            value={userRequestValue?.country}
            disabled
          />
        </div>
        <TextInput
          label={t('userRequestForm:emailInputTitle')}
          value={userRequestValue?.email}
          disabled
        />
        <div className={styles.double_row}>
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
        <div className={styles.double_row}>
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
        <div className={styles.double_row}>
          <TextInput
            label={t('userRequestForm:firstNameInputTitle')}
            value={userRequestValue?.firstName}
            disabled
          />
          <TextInput
            label={t('userRequestForm:lastNameInputTitle')}
            value={userRequestValue?.lastName}
            disabled
          />
        </div>
      </div>
    </form>
  );
};
