import { notifications } from '@/components/notifications';
import { doApiAction } from '@/lib/api';
import { Button, NumberInput, Text, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { useNavigate } from '@tanstack/react-router';
import { checkVAT, countries } from 'jsvat';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from 'react-phone-number-input';
import styles from '../styles/userRequest.module.scss';

type UserRequestFormValues = {
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

export const UserRequestForm: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const UserRequestForm = useForm<UserRequestFormValues>({
    initialValues: {
      companyName: '',
      phoneNr: '',
      vatNr: '',
      postalCode: '',
      district: '',
      street: '',
      streetNr: '',
      boxNr: '',
      firstName: '',
      lastName: '',
      email: '',
      createdOn: Date.now(),
    },
    validate: {
      companyName: value => {
        if (!value) {
          return t('userrequestpage:companyInputError');
        }
      },
      email: isEmail(t('userrequestpage:emailInputError')),
      phoneNr: value => {
        if (
          !value ||
          !isPossiblePhoneNumber(value) ||
          !isValidPhoneNumber(value)
        ) {
          return t('userrequestpage:phoneNrInputError');
        }
      },
      vatNr: value => {
        if (!value || !checkVAT(value, countries)?.isValid) {
          return t('userrequestpage:vatNrInputError');
        }
      },
      postalCode: value => {
        if (!value) {
          return t('userrequestpage:postalCodeInputError');
        }
      },
      district: value => {
        if (!value) {
          return t('userrequestpage:districtInputError');
        }
      },
      street: value => {
        if (!value) {
          return t('userrequestpage:streetInputError');
        }
      },
      streetNr: value => {
        if (!value && value !== '0') {
          return t('userrequestpage:streetNrInputError');
        }
      },
      boxNr: value => {
        if (value === '0') {
          return t('userrequestpage:boxNrInputError');
        }
      },
      firstName: value => {
        if (!value) {
          return t('userrequestpage:firstNameInputError');
        }
      },
      lastName: value => {
        if (!value) {
          return t('userrequestpage:lastNameInputError');
        }
      },
    },
    validateInputOnBlur: true,
  });

  const handleUserRequestButton = async (values: UserRequestFormValues) => {
    if (!UserRequestForm.isValid()) {
      notifications.add({
        title: t('notifications: genericError'),
        message: t('notifications:invalidForm'),
        color: 'red',
      });
      return;
    }

    const result = await doApiAction<{ message: string }>({
      endpoint: '/user_request',
      method: 'POST',
      body: {
        companyName: values.companyName,
        email: values.email,
        phoneNr: values.phoneNr,
        vatNr: values.vatNr,
        postalCode: values.postalCode,
        district: values.district,
        street: values.street,
        streetNr: values.streetNr,
        boxNr: values.boxNr,
        firstName: values.firstName,
        lastName: values.lastName,
        createdOn: values.createdOn,
      },
    });

    notifications.add({
      message: t(result?.message ?? 'notifications:genericError'),
      autoClose: 5000,
    });
  };

  return (
    <form
      className={styles.userrequest_form}
      onSubmit={UserRequestForm.onSubmit(values =>
        handleUserRequestButton(values)
      )}
    >
      <div className={styles.company_detail_fields}>
        <TextInput
          label={t('userrequestpage:companyInputTitle')}
          description={t('userrequestpage:companyInputDescription')}
          placeholder={t('userrequestpage:companyInputPlaceholder')}
          required
          {...UserRequestForm.getInputProps('companyName')}
        />

        <div className={styles.number_fields}>
          <TextInput
            label={t('userrequestpage:phoneNrInputTitle')}
            description={t('userrequestpage:phoneNrInputDescription')}
            placeholder={t('userrequestpage:phoneNrInputPlaceholder')}
            required
            {...UserRequestForm.getInputProps('phoneNr')}
          />
          <TextInput
            label={t('userrequestpage:vatNrInputTitle')}
            description={t('userrequestpage:vatNrInputDescription')}
            placeholder={t('userrequestpage:vatNrInputPlaceholder')}
            required
            {...UserRequestForm.getInputProps('vatNr')}
          />
        </div>
        <div className={styles.place_fields}>
          <NumberInput
            label={t('userrequestpage:postalCodeInputTitle')}
            description={t('userrequestpage:postalCodeInputDescription')}
            placeholder={t('userrequestpage:postalCodeInputPlaceholder')}
            hideControls
            allowNegative={false}
            allowDecimal={false}
            required
            {...UserRequestForm.getInputProps('postalCode')}
          />
          <TextInput
            label={t('userrequestpage:districtInputTitle')}
            description={t('userrequestpage:districtInputDescription')}
            placeholder={t('userrequestpage:districtInputPlaceholder')}
            required
            {...UserRequestForm.getInputProps('district')}
          />
        </div>
        <div className={styles.street_fields}>
          <TextInput
            label={t('userrequestpage:streetInputTitle')}
            description={t('userrequestpage:streetInputDescription')}
            placeholder={t('userrequestpage:streetInputPlaceholder')}
            required
            {...UserRequestForm.getInputProps('street')}
          />
          <TextInput
            label={t('userrequestpage:streetNrInputTitle')}
            description={t('userrequestpage:streetNrInputDescription')}
            placeholder={t('userrequestpage:streetNrInputPlaceholder')}
            maxLength={4}
            required
            {...UserRequestForm.getInputProps('streetNr')}
          />
          <NumberInput
            label={t('userrequestpage:boxNrInputTitle')}
            description={t('userrequestpage:boxNrInputDescription')}
            placeholder={t('userrequestpage:boxNrInputPlaceholder')}
            hideControls
            allowNegative={false}
            allowDecimal={false}
            maxLength={1}
            {...UserRequestForm.getInputProps('boxNr')}
          />
        </div>
      </div>
      <div className={styles.name_fields}>
        <TextInput
          label={t('userrequestpage:firstNameInputTitle')}
          description={t('userrequestpage:firstNameInputDescription')}
          placeholder={t('userrequestpage:firstNameInputPlaceholder')}
          required
          {...UserRequestForm.getInputProps('firstName')}
        />
        <TextInput
          className={styles.lastname_field}
          label={' '}
          description={t('userrequestpage:lastNameInputDescription')}
          placeholder={t('userrequestpage:lastNameInputPlaceholder')}
          {...UserRequestForm.getInputProps('lastName', { required: true })}
        />
        <TextInput
          className={styles.email_field}
          label={t(' ')}
          description={t('userrequestpage:emailInputDescription')}
          placeholder={t('userrequestpage:emailInputPlaceholder')}
          {...UserRequestForm.getInputProps('email', { required: true })}
        />
      </div>
      <div className={styles.go_login_userrequest_button}>
        <div className={styles.userrequest_button}>
          <Button type='submit'>
            {t('userrequestpage:userRequestButton')}
          </Button>
        </div>
        <div className={styles.go_login_text}>
          <Text c='dimmed'>{t('userrequestpage:userRequestLabel')}</Text>
          <Text
            c='dimmed'
            onClick={() => {
              navigate({ to: '/login' });
            }}
            className={styles.login_link}
          >
            {t('userrequestpage:loginLink')}
          </Text>
        </div>
      </div>
    </form>
  );
};
