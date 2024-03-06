import { useForm } from '@mantine/form';
import styles from '../styles/choosepassword.module.scss';
import { Button, PasswordInput, Text } from '@mantine/core';
import { notifications } from '@/components/notifications';
import { useTranslation } from 'react-i18next';
import type { FC } from 'react';
import { PasswordInputWithRequirements } from '@/components/passwordinputwithrequirements';
import { checkPasswordRequirements } from '@/lib/password';

type FormValues = {
  password: string;
  confirmPassword: string;
};

type Props = {
  email: string;
};

export const ChoosePasswordForm: FC<Props> = props => {
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: value =>
        checkPasswordRequirements(value).valid
          ? null
          : t('choosePasswordPage:passwordInputLabelError'),
      confirmPassword: (value, values) =>
        value !== values.password
          ? t('choosePasswordPage:confirmPasswordInputLabelError')
          : null,
    },
  });

  const handleChoosePassword = (values: FormValues) => {
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
      className={styles.choosepassword_page}
      onSubmit={form.onSubmit(values => handleChoosePassword(values))}
    >
      <Text className={styles.email_text}>
        Choosing password for: {props.email}
      </Text>
      <PasswordInputWithRequirements
        label={t('choosePasswordPage:passwordInputLabel')}
        required
        {...form.getInputProps('password')}
      />
      <PasswordInput
        label={t('choosePasswordPage:confirmPasswordInputLabel')}
        required
        {...form.getInputProps('confirmPassword')}
      />
      <div className={styles.button}>
        <Button type='submit'>{t('choosePasswordPage:actionButton')}</Button>
      </div>
    </form>
  );
};
