import { type FC, useState } from 'react';
import { Button, TextInput, Textarea } from '@mantine/core';
import styles from '../styles/userRequestReview.module.scss';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { notifications } from '@/components/notifications';
import { GenericAPIResponse, doApiAction } from '@/lib/api';
import { useParams } from '@tanstack/react-router';

type UserRequestHandleValues = {
  refernceCode: string;
  denyMessage: string;
};

type Props = {
  onSubmit: () => void;
};

export const UserRequestReviewHandle: FC<Props> = props => {
  const { t } = useTranslation();
  const { request_id: requestId } = useParams({
    from: '/app/requests/$request_id',
  });

  const [isApproved, setIsApproved] = useState(true);
  const [isDenied, setIsDenied] = useState(false);

  const UserRequestReviewForm = useForm<UserRequestHandleValues>({
    initialValues: {
      refernceCode: '',
      denyMessage: '',
    },
    validate: {
      refernceCode: value => {
        if (!value) {
          return t('userRequestForm:referenceCodeInputError');
        }
      },
      denyMessage: value => {
        if (!value) {
          return t('userRequestForm:denyMessageInputError');
        }
      },
    },
    validateInputOnBlur: true,
  });

  const handleApproveClick = () => {
    setIsApproved(true);
    setIsDenied(false);
  };

  const handleDenyClick = () => {
    setIsDenied(true);
    setIsApproved(false);
  };

  const handleUserRequestReviewButton = async (
    values: UserRequestHandleValues
  ) => {
    if (!UserRequestReviewForm.isValid()) {
      notifications.add({
        title: t('notifications: genericError'),
        message: t('notifications:invalidForm'),
        color: 'red',
      });
      return;
    }

    const resultApprove = await doApiAction<
      GenericAPIResponse<{ message: string }>
    >({
      endpoint: `/user_requests/${requestId}/approve`,
      method: 'POST',
      body: {
        referenceCode: values.refernceCode,
      },
    });

    notifications.add({
      message: t(resultApprove?.message ?? 'notifications:genericError'),
      autoClose: 5000,
    });

    const resultDeny = await doApiAction<
      GenericAPIResponse<{ message: string }>
    >({
      endpoint: `/user_requests/${requestId}/deny`,
      method: 'POST',
      body: {
        denyMessage: values.denyMessage,
      },
    });

    notifications.add({
      message: t(resultDeny?.message ?? 'notifications:genericError'),
      autoClose: 5000,
    });

    props.onSubmit();
  };

  return (
    <>
      <div className={styles.button_container}>
        <Button
          className={styles.approve_button}
          variant={isApproved ? 'filled' : 'light'}
          color='#1F9254'
          size='lg'
          onClick={handleApproveClick}
        >
          {t('userRequestReviewPage:approveButton')}
        </Button>

        <Button
          className={styles.deny_button}
          variant={isDenied ? 'filled' : 'light'}
          color='#A30D11'
          size='lg'
          onClick={handleDenyClick}
        >
          {t('userRequestReviewPage:denyButton')}
        </Button>
      </div>

      <div className={styles.handle_container}>
        <form
          onSubmit={UserRequestReviewForm.onSubmit(values =>
            handleUserRequestReviewButton(values)
          )}
        >
          {isApproved ? (
            <TextInput
              label={t('userRequestForm:referenceCodeInputTitle')}
              withAsterisk
              description={t('userRequestForm:referenceCodeInputDescription')}
              placeholder={t('userRequestForm:referenceCodeInputPlaceholder')}
              required
              {...UserRequestReviewForm.getInputProps('refernceCode')}
            />
          ) : null}
          {isDenied ? (
            <Textarea
              className={styles.deny_input}
              withAsterisk
              autosize
              minRows={2}
              maxRows={10}
              label={t('userRequestForm:denyMessageInputTitle')}
              description={t('userRequestForm:denyMessageInputDescription')}
              placeholder={t('userRequestForm:denyMessageInputPlaceholder')}
              required
              {...UserRequestReviewForm.getInputProps('denyMessage')}
            />
          ) : null}
          <div className={styles.confirm_button}>
            <Button type='submit'>{t('userRequestForm:confirmButton')}</Button>
          </div>
        </form>
      </div>
    </>
  );
};
