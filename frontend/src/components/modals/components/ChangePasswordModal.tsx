import type { FC } from 'react';
import { Modal } from '..';
import { useTranslation } from 'react-i18next';
import { Button, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import styles from '../styles/changepasswordmodal.module.scss';
import { PasswordInputWithRequirements } from '@/components/passwordinputwithrequirements';
import { checkPasswordRequirements } from '@/lib/password';
import { notifications } from '@/components/notifications';

type Props = {
  onConfirm: () => void;
  onCancel?: () => void;
};

type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const ChangePasswordModal: FC<Props> = props => {
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

  const handleSubmit = (values: ChangePasswordFormValues) => {
    if (!form.isValid()) {
      notifications.add({
        title: t('notifications:genericError'),
        message: t('notifications:invalidForm'),
        color: 'red',
      });
      return;
    }

    console.log(values);
    props.onConfirm();
  };

  return (
    <Modal
      title={t('modals:changePassword:title')}
      onClose={props.onCancel}
      className={styles.change_password_modal}
    >
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
    </Modal>
  );
};
