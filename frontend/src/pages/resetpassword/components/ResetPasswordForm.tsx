import { EMAIL_PLACEHOLDER } from '@/constants';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/resetpassword.module.scss';
import { isEmail, useForm } from '@mantine/form';
import { notifications } from '@/components/notifications';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { TextInput, Button } from '@mantine/core';

type FormValues = {
  email: string;
};

type Props = {
  onSubmit: () => void;
};

export const ResetPasswordForm: FC<Props> = props => {
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail(t('resetPasswordPage:emailInputError')),
    },
    validateInputOnBlur: true,
  });

  const handleResetButton = async (values: FormValues) => {
    if (!form.isValid()) {
      notifications.add({
        title: t('notifications:genericError'),
        message: t('notifications:invalidForm'),
        autoClose: 10000,
      });
      return;
    }

    await doApiAction<GenericAPIResponse>({
      method: 'POST',
      endpoint: '/auth/reset-password',
      body: {
        email: values.email,
      },
    });

    props.onSubmit();
  };

  return (
    <form
      className={styles.resetpassword_page}
      onSubmit={form.onSubmit(values => handleResetButton(values))}
    >
      <TextInput
        label={t('resetPasswordPage:emailInputLabel')}
        placeholder={EMAIL_PLACEHOLDER}
        {...form.getInputProps('email')}
        required
      />
      <div className={styles.button}>
        <Button type='submit'>{t('resetPasswordPage:actionButton')}</Button>
      </div>
    </form>
  );
};
