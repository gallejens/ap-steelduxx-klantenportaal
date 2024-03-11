import { notifications } from '@/components/notifications';
import { Button, PasswordInput, Text, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/login.module.scss';
import { useNavigate } from '@tanstack/react-router';
import { EMAIL_PLACEHOLDER } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginForm: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginForm = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail(t('loginpage:emailInputError')),
      password: value =>
        value.length === 0 ? t('loginpage:passwordInputError') : null,
    },
    validateInputOnBlur: true,
  });
  const { signIn } = useAuth();

  const handleLoginButton = async (values: LoginFormValues) => {
    if (!loginForm.isValid()) {
      notifications.add({
        title: t('notifications:genericError'),
        message: t('notifications:invalidForm'),
        color: 'red',
      });
      return;
    }

    const result = await signIn(values.email, values.password);
    if (result.success) {
      navigate({
        to: '/app/home',
      });
    } else {
      notifications.add({
        message: t(result.message),
        autoClose: 5000,
      });
    }
  };

  return (
    <form
      className={styles.login_page_form}
      onSubmit={loginForm.onSubmit(values => handleLoginButton(values))}
    >
      <TextInput
        label={t('loginpage:emailInputTitle')}
        placeholder={EMAIL_PLACEHOLDER}
        required
        {...loginForm.getInputProps('email')}
      />
      <PasswordInput
        label={t('loginpage:passwordInputTitle')}
        required
        {...loginForm.getInputProps('password')}
      />
      <div className={styles.actions}>
        <Text
          className={styles.password_reset}
          c='dimmed'
          onClick={() => {
            navigate({
              to: '/reset-password',
            });
          }}
        >
          {t('loginpage:forgotPassword')}
        </Text>
        <Button type='submit'>{t('loginpage:loginButton')}</Button>
      </div>
    </form>
  );
};
