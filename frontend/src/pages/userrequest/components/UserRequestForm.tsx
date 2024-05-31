import { notifications } from '@/components/notifications';
import { type GenericAPIResponse, doApiAction } from '@/lib/api';
import { Button, Divider, NumberInput, Select, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { checkVAT, countries } from 'jsvat';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from 'react-phone-number-input';
import styles from '../styles/userRequest.module.scss';
import { EMAIL_PLACEHOLDER } from '@/constants';
import { HttpStatusCode } from 'axios';
import { COUNTRIES } from '../constants';
import type { UserRequest } from '@/types/userrequest';

type Props = {
  onSuccess?: () => void;
};

export const UserRequestForm: FC<Props> = props => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const UserRequestForm = useForm<UserRequest.UserRequestFormValues>({
    initialValues: {
      companyName: '',
      country: '',
      phoneNr: '',
      vatNr: '',
      postalCode: '',
      district: '',
      street: '',
      streetNr: '',
      boxNr: '',
      extraInfo: '',
      firstName: '',
      lastName: '',
      email: '',
      createdOn: Date.now(),
    },
    validate: {
      companyName: value => {
        if (!value) {
          return t('userRequestForm:companyInputError');
        }
      },
      country: value => {
        if (!value) {
          return t('userRequestForm:countryInputError');
        }
      },
      email: isEmail(t('userRequestForm:emailInputError')),
      phoneNr: value => {
        if (
          !value ||
          !isPossiblePhoneNumber(value) ||
          !isValidPhoneNumber(value)
        ) {
          return t('userRequestForm:phoneNrInputError');
        }
      },
      vatNr: value => {
        if (value && !checkVAT(value, countries)?.isValid) {
          return t('userRequestForm:vatNrInputError');
        }
      },
      postalCode: value => {
        if (!value) {
          return t('userRequestForm:postalCodeInputError');
        }
      },
      district: value => {
        if (!value) {
          return t('userRequestForm:districtInputError');
        }
      },
      street: value => {
        if (!value) {
          return t('userRequestForm:streetInputError');
        }
      },
      streetNr: value => {
        if (!value && value !== '0') {
          return t('userRequestForm:streetNrInputError');
        }
      },
      boxNr: value => {
        if (value === '0') {
          return t('userRequestForm:boxNrInputError');
        }
      },
      firstName: value => {
        if (!value) {
          return t('userRequestForm:firstNameInputError');
        }
      },
      lastName: value => {
        if (!value) {
          return t('userRequestForm:lastNameInputError');
        }
      },
    },
    validateInputOnBlur: true,
  });

  const handleUserRequestButton = async (
    values: UserRequest.UserRequestFormValues
  ) => {
    if (!UserRequestForm.isValid()) {
      notifications.add({
        title: t('notifications:genericError'),
        message: t('notifications:invalidForm'),
        autoClose: 10000,
      });
      return;
    }

    setLoading(true);

    const result = await doApiAction<GenericAPIResponse<{ message: string }>>({
      endpoint: '/user-requests/new',
      method: 'POST',
      body: {
        companyName: values.companyName,
        country: values.country,
        email: values.email,
        phoneNr: values.phoneNr,
        vatNr: values.vatNr,
        postalCode: values.postalCode,
        district: values.district,
        street: values.street,
        streetNr: values.streetNr,
        boxNr: values.boxNr,
        extraInfo: values.extraInfo,
        firstName: values.firstName,
        lastName: values.lastName,
        createdOn: values.createdOn,
      },
    });

    const isSuccess = result?.status === HttpStatusCode.Created;

    if (!isSuccess) {
      notifications.add({
        message: t(result?.message ?? 'notifications:genericError'),
        autoClose: 10000,
      });
    }

    setLoading(false);

    if (isSuccess) {
      props.onSuccess?.();
    }
  };

  return (
    <form
      className={styles.userrequest_page_form}
      onSubmit={UserRequestForm.onSubmit(values =>
        handleUserRequestButton(values)
      )}
    >
      <div className={styles.company_detail_fields}>
        <div className={styles.row}>
          <TextInput
            label={t('userRequestForm:companyInputTitle')}
            description={t('userRequestForm:companyInputDescription')}
            placeholder={t('userRequestForm:companyInputPlaceholder')}
            required
            {...UserRequestForm.getInputProps('companyName')}
          />
          <Select
            label={t('userRequestForm:countryInputTitle')}
            description={t('userRequestForm:countryInputDescription')}
            placeholder={t('userRequestForm:countryInputPlaceholder')}
            data={COUNTRIES}
            searchable
            required
            {...UserRequestForm.getInputProps('country')}
          />
        </div>
        <div className={styles.row}>
          <TextInput
            label={t('userRequestForm:phoneNrInputTitle')}
            description={t('userRequestForm:phoneNrInputDescription')}
            placeholder={t('userRequestForm:phoneNrInputPlaceholder')}
            required
            {...UserRequestForm.getInputProps('phoneNr')}
          />
          <TextInput
            label={t('userRequestForm:vatNrInputTitle')}
            description={t('userRequestForm:vatNrInputDescription')}
            placeholder={t('userRequestForm:vatNrInputPlaceholder')}
            required
            {...UserRequestForm.getInputProps('vatNr')}
          />
        </div>
        <div className={styles.row}>
          <NumberInput
            label={t('userRequestForm:postalCodeInputTitle')}
            description={t('userRequestForm:postalCodeInputDescription')}
            placeholder={t('userRequestForm:postalCodeInputPlaceholder')}
            hideControls
            allowNegative={false}
            allowDecimal={false}
            required
            {...UserRequestForm.getInputProps('postalCode')}
          />
          <TextInput
            label={t('userRequestForm:districtInputTitle')}
            description={t('userRequestForm:districtInputDescription')}
            placeholder={t('userRequestForm:districtInputPlaceholder')}
            required
            {...UserRequestForm.getInputProps('district')}
          />
        </div>
        <div className={styles.street_row}>
          <TextInput
            label={t('userRequestForm:streetInputTitle')}
            description={t('userRequestForm:streetInputDescription')}
            placeholder={t('userRequestForm:streetInputPlaceholder')}
            required
            {...UserRequestForm.getInputProps('street')}
          />
          <TextInput
            label=' '
            description={t('userRequestForm:streetNrInputDescription')}
            placeholder={t('userRequestForm:streetNrInputPlaceholder')}
            maxLength={4}
            {...UserRequestForm.getInputProps('streetNr', { required: true })}
          />
          <NumberInput
            label=' '
            description={t('userRequestForm:boxNrInputDescription')}
            placeholder={t('userRequestForm:boxNrInputPlaceholder')}
            hideControls
            allowNegative={false}
            allowDecimal={false}
            maxLength={1}
            {...UserRequestForm.getInputProps('boxNr')}
          />
        </div>
        <TextInput
          className={styles.extra_info_input}
          description={t('userRequestForm:extraInfoInputDescription')}
          placeholder={t('userRequestForm:extraInfoInputPlaceholder')}
          {...UserRequestForm.getInputProps('extraInfo')}
        />
      </div>
      <Divider orientation='vertical' />
      <div className={styles.name_fields}>
        <TextInput
          label={t('userRequestForm:firstNameInputTitle')}
          description={t('userRequestForm:firstNameInputDescription')}
          placeholder={t('userRequestForm:firstNameInputPlaceholder')}
          required
          {...UserRequestForm.getInputProps('firstName')}
        />
        <TextInput
          label={t('userRequestForm:lastNameInputTitle')}
          description={t('userRequestForm:lastNameInputDescription')}
          placeholder={t('userRequestForm:lastNameInputPlaceholder')}
          required
          {...UserRequestForm.getInputProps('lastName')}
        />
        <TextInput
          label={t('userRequestForm:emailInputTitle')}
          description={t('userRequestForm:emailInputDescription')}
          placeholder={EMAIL_PLACEHOLDER}
          required
          {...UserRequestForm.getInputProps('email')}
        />
      </div>
      <div className={styles.go_login_userrequest_button}>
        <div className={styles.userrequest_button}>
          <Button
            type='submit'
            loading={loading}
          >
            {t('userRequestForm:userRequestButton')}
          </Button>
        </div>
      </div>
    </form>
  );
};
