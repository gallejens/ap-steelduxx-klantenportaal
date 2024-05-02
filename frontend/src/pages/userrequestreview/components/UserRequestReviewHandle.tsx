import { type FC, useState } from 'react';
import { Button, Select, Textarea } from '@mantine/core';
import styles from '../styles/userRequestReview.module.scss';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { notifications } from '@/components/notifications';
import { type GenericAPIResponse, doApiAction } from '@/lib/api';
import { useParams } from '@tanstack/react-router';
import { ConfirmModal } from '@/components/modals';
import { useModalStore } from '@/stores/useModalStore';
import { useQuery } from '@tanstack/react-query';
import type { UserRequest } from '@/types/userrequest';

type Props = {
  onSubmit?: () => void;
  onSucces?: () => void;
};

export const UserRequestReviewHandle: FC<Props> = props => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();
  const { request_id: requestId } = useParams({
    from: '/app/requests/$request_id',
  });

  const [isApproved, setIsApproved] = useState(true);
  const [isDenied, setIsDenied] = useState(false);

  const { data: companyCodesResponse } = useQuery({
    queryKey: ['user-requests-review-company-codes'],
    queryFn: () =>
      doApiAction<GenericAPIResponse<string[]>>({
        endpoint: '/user-requests/company-codes',
        method: 'GET',
      }),
  });

  const companyCodes = companyCodesResponse?.data ?? [];

  const approveForm = useForm<UserRequest.UserRequestApproveValues>({
    initialValues: {
      referenceCode: '',
    },
    validate: {
      referenceCode: value => {
        if (!value || !companyCodes.includes(value)) {
          return t('userRequestForm:referenceCodeInputError');
        }
      },
    },
    validateInputOnBlur: true,
  });

  const denyForm = useForm<UserRequest.UserRequestDenyValues>({
    initialValues: {
      denyMessage: '',
    },
    validate: {
      denyMessage: value => {
        if (!value) {
          return t('userRequestForm:denyMessageInputError');
        }
      },
    },
    validateInputOnBlur: true,
  });

  const approveUserRequestReviewButton = async (
    values: UserRequest.UserRequestApproveValues
  ) => {
    if (!approveForm.isValid()) {
      notifications.add({
        title: t('notifications: genericError'),
        message: t('notifications:invalidForm'),
        autoClose: 10000,
      });
    }

    const resultApprove = await doApiAction<
      GenericAPIResponse<{ message: string }>
    >({
      endpoint: `/user-requests/${requestId}/approve`,
      method: 'POST',
      body: {
        referenceCode: values.referenceCode,
      },
    });

    notifications.add({
      message: t(resultApprove?.message ?? 'notifications:genericError'),
      autoClose: 10000,
    });

    props.onSubmit?.();

    if (resultApprove?.message === 'userRequestReviewPage:response:success') {
      props.onSucces?.();
    }
  };

  const handleApproveClick = () => {
    setIsApproved(true);
    setIsDenied(false);
  };

  const denyUserRequestReviewButton = async (
    values: UserRequest.UserRequestDenyValues
  ) => {
    if (!denyForm.isValid()) {
      notifications.add({
        title: t('notifications: genericError'),
        message: t('notifications:invalidForm'),
        autoClose: 10000,
      });
      return;
    }

    const resultDeny = await doApiAction<
      GenericAPIResponse<{ message: string }>
    >({
      endpoint: `/user-requests/${requestId}/deny`,
      method: 'POST',
      body: {
        denyMessage: values.denyMessage,
      },
    });

    notifications.add({
      message: t(resultDeny?.message ?? 'notifications:genericError'),
      autoClose: 10000,
    });

    props.onSubmit?.();

    if (resultDeny?.message === 'userRequestReviewPage:response:denied') {
      props.onSucces?.();
    }
  };

  const handleDenyClick = () => {
    setIsDenied(true);
    setIsApproved(false);
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
        {isApproved ? (
          <form
            onSubmit={approveForm.onSubmit(values =>
              openModal(
                <ConfirmModal
                  title={t(
                    'appshell:approveRequestConfirmation:approveConfirmTitle'
                  )}
                  text={t(
                    'appshell:approveRequestConfirmation:approveConfirmText'
                  )}
                  onConfirm={() => {
                    closeModal();
                    approveUserRequestReviewButton(values);
                  }}
                />
              )
            )}
          >
            <Select
              label={t('userRequestForm:referenceCodeInputTitle')}
              description={t('userRequestForm:referenceCodeInputDescription')}
              placeholder={t('userRequestForm:referenceCodeInputPlaceholder')}
              data={companyCodes}
              withAsterisk
              searchable
              {...approveForm.getInputProps('referenceCode')}
            />

            <div className={styles.confirm_button}>
              <Button type='submit'>
                {t('userRequestForm:confirmButton')}
              </Button>
            </div>
          </form>
        ) : null}

        {isDenied ? (
          <form
            onSubmit={denyForm.onSubmit(values =>
              openModal(
                <ConfirmModal
                  title={t('appshell:denyRequestConfirmation:denyConfirmTitle')}
                  text={t('appshell:denyRequestConfirmation:denyConfirmText')}
                  onConfirm={() => {
                    closeModal();
                    denyUserRequestReviewButton(values);
                  }}
                />
              )
            )}
          >
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
              {...denyForm.getInputProps('denyMessage')}
            />
            <div className={styles.confirm_button}>
              <Button type='submit'>
                {t('userRequestForm:confirmButton')}
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </>
  );
};
