import { notifications } from '@/components/notifications';
import { doApiAction } from '@/lib/api';
import { Button, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/login.module.scss';

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginForm: FC = () => {
  const { t } = useTranslation();
  const loginForm = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: value => value.length === 0 && t('loginpage:emailInputError'),
      password: value =>
        value.length === 0 && t('loginpage:passwordInputError'),
    },
    validateInputOnBlur: true,
  });

  const handleLoginButton = async (values: LoginFormValues) => {
    if (!loginForm.isValid()) {
      notifications.add({
        title: t('notifications:genericError'),
        message: t('notifications:invalidForm'),
        color: 'red',
      });
      return;
    }

    const result = await doApiAction<{ data: string }>({
      endpoint: '/auth/signin',
      method: 'POST',
      body: {
        email: values.email,
        password: values.password,
      },
    });

    console.log(result);

    // const jwt = result?.data;
    // if (!jwt) return;

    // document.cookie = `auth-token=${jwt}`;
  };

  const handleResetPassword = () => {
    // TODO: Implement password resetting
  };

  return (
    <form
      className={styles.login_form}
      onSubmit={loginForm.onSubmit(values => handleLoginButton(values))}
    >
      <TextInput
        label={t('loginpage:emailInputTitle')}
        placeholder={t('loginpage:emailInputPlaceholder')}
        required
        {...loginForm.getInputProps('email')}
      />
      <div>
        <PasswordInput
          label={t('loginpage:passwordInputTitle')}
          placeholder={t('loginpage:passwordInputPlaceholder')}
          required
          {...loginForm.getInputProps('password')}
        />
        <Text
          className={styles.password_reset}
          c='dimmed'
          onClick={handleResetPassword}
        >
          {t('loginpage:forgotPassword')}
        </Text>
      </div>

      <div className={styles.login_button}>
        <Button type='submit'>{t('loginpage:loginButton')}</Button>
      </div>
    </form>
  );
};
