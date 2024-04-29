import { useState, type FC } from 'react';
import { Modal } from '..';
import { useTranslation } from 'react-i18next';
import { Button, PasswordInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import styles from '../styles/changepasswordmodal.module.scss';
import { PasswordInputWithRequirements } from '@/components/passwordinputwithrequirements';
import { checkPasswordRequirements } from '@/lib/password';
import { notifications } from '@/components/notifications';
import { doApiAction } from '@/lib/api';

type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const ChangePasswordModal: FC = () => {
  const { t } = useTranslation();
  const form = useForm<ChangePasswordFormValues>({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: {
      oldPassword: value =>
        value.length === 0
          ? t('modals:changePassword:oldPasswordInputLabelerror')
          : null,
      newPassword: value =>
        checkPasswordRequirements(value).valid
          ? null
          : t('modals:changePassword:newPasswordInputLabelError'),
      confirmNewPassword: (value, values) =>
        value !== values.newPassword
          ? t('modals:changePassword:confirmNewPasswordInputLabelError')
          : null,
    },
  });
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    if (!form.isValid()) {
      notifications.add({
        title: t('notifications:genericError'),
        message: t('notifications:invalidForm'),
        autoClose: 10000,
      });
      return;
    }

    const result = await doApiAction({
      endpoint: '/auth/change-password',
      method: 'POST',
      body: {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
    });

    setResponseMessage(result?.message ?? 'failed');
  };

  return (
    <Modal
      title={t('modals:changePassword:title')}
      className={styles.change_password_modal}
    >
      {responseMessage === null ? (
        <form onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <PasswordInput
            label={t('modals:changePassword:oldPasswordInputLabel')}
            required
            {...form.getInputProps('oldPassword')}
          />
          <PasswordInputWithRequirements
            label={t('modals:changePassword:newPasswordInputLabel')}
            required
            {...form.getInputProps('newPassword')}
          />
          <PasswordInput
            label={t('modals:changePassword:confirmNewPasswordInputLabel')}
            required
            {...form.getInputProps('confirmNewPassword')}
          />
          <div className={styles.action_button}>
            <Button type='submit'>
              {t('modals:changePassword:actionButton')}
            </Button>
          </div>
        </form>
      ) : (
        <div className={styles.response_message}>
          <Text>{t(`modals:changePassword:response:${responseMessage}`)}</Text>
        </div>
      )}
    </Modal>
  );
};
