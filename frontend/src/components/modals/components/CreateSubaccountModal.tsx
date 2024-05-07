import { useState, type FC } from 'react';
import { Modal } from '..';
import { useTranslation } from 'react-i18next';
import { Button, Text, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import styles from '../styles/changepasswordmodal.module.scss';
import { doApiAction } from '@/lib/api';

type CreateSubaccountValues = {
  email: string;
  firstName: string;
  lastName: string;
};

export const CreateSubaccountModal: FC<{ onConfirm: () => void }> = props => {
  const { t } = useTranslation();
  const form = useForm<CreateSubaccountValues>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
    validate: {
      email: isEmail(t('modals:createSubaccount:emailInputError')),
      firstName: value =>
        value === '' && t('modals:createSubaccount:firstNameInputError'),
      lastName: value =>
        value === '' && t('modals:createSubaccount:lastNameInputError'),
    },
  });
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSubmit = async (values: CreateSubaccountValues) => {
    const result = await doApiAction({
      endpoint: '/company-info/new',
      method: 'POST',
      body: {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
      },
    });

    setResponseMessage(result?.message ?? 'failed');
    props.onConfirm();
  };

  return (
    <Modal
      title={t('modals:createSubaccount:title')}
      className={styles.change_password_modal}
    >
      {responseMessage === null ? (
        <form onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <TextInput
            label={t('modals:createSubaccount:emailInputLabel')}
            required
            {...form.getInputProps('email')}
          />
          <TextInput
            label={t('modals:createSubaccount:firstNameInputLabel')}
            required
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label={t('modals:createSubaccount:lastNameInputLabel')}
            required
            {...form.getInputProps('lastName')}
          />
          <div className={styles.action_button}>
            <Button type='submit'>
              {t('modals:createSubaccount:actionButton')}
            </Button>
          </div>
        </form>
      ) : (
        <div className={styles.response_message}>
          <Text>
            {t(`modals:createSubaccount:response:${responseMessage}`)}
          </Text>
        </div>
      )}
    </Modal>
  );
};
