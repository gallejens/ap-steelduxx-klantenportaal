import { EMAIL_PLACEHOLDER } from '@/constants';
import { Button, TextInput } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/resetpassword.module.scss';
import { useForm } from '@mantine/form';
import { notifications } from '@/components/notifications';

type FormValues = {
  email: string;
};

export const ResetPasswordForm: FC = () => {
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    initialValues: {
      email: '',
    },
    validate: {
      email: value =>
        value.length === 0 ? t('resetPasswordPage:emailInputError') : null,
    },
    validateInputOnBlur: true,
  });

  const handleResetButton = (values: FormValues) => {
    if (!form.isValid()) {
      notifications.add({
        title: t('notifications:genericError'),
        message: t('notifications:invalidForm'),
        color: 'red',
      });
      return;
    }

    console.log(values);
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
