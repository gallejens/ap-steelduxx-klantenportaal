import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/orderRequestReview.module.scss';
import { Button, Select, TextInput } from '@mantine/core';
import { doApiAction } from '@/lib/api';
import type { OrderRequest, OrderTransportType } from '@/types/api';
import { useForm } from '@mantine/form';
import { PortcodesSelector } from '@/components/portcodesselector';
import { notifications } from '@/components/notifications/lib';
import { DEFAULT_PORT_CODE } from '@/pages/ordercreate/constants';

type EditOrderFormValues = {
  transportType: OrderTransportType;
  portOfDestinationCode: string;
  portOfOriginCode: string;
};

type Props = {
  orderRequest: OrderRequest;
  allowEditing: boolean;
};

export const OrderRequestReviewForm: FC<Props> = ({
  orderRequest,
  allowEditing,
}) => {
  const { t } = useTranslation();

  const editOrderForm = useForm<EditOrderFormValues>({
    initialValues: {
      transportType: orderRequest.transportType,
      portOfDestinationCode: orderRequest.portOfDestinationCode,
      portOfOriginCode: orderRequest.portOfOriginCode,
    },
    validate: {
      transportType: value =>
        !value &&
        t('newOrderPage:orderForm:transportType:transportTypeInputError'),
      portOfDestinationCode: value =>
        !value &&
        t(
          'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputError'
        ),
      portOfOriginCode: value =>
        !value &&
        t('newOrderPage:orderForm:portOriginCode:portOriginCodeInputError'),
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    editOrderForm.setValues({
      transportType: orderRequest.transportType,
      portOfDestinationCode: orderRequest.portOfDestinationCode,
      portOfOriginCode: orderRequest.portOfOriginCode,
    });
  }, [orderRequest]);

  editOrderForm.watch('transportType', ({ value }) => {
    if (value === 'IMPORT') {
      editOrderForm.setFieldValue('portOfDestinationCode', DEFAULT_PORT_CODE);
      editOrderForm.setFieldValue(
        'portOfOriginCode',
        editOrderForm.values.portOfDestinationCode
      );
    } else {
      editOrderForm.setFieldValue(
        'portOfDestinationCode',
        editOrderForm.values.portOfOriginCode
      );
      editOrderForm.setFieldValue('portOfOriginCode', DEFAULT_PORT_CODE);
    }
  });

  const handleSubmit = async (values: EditOrderFormValues) => {
    const result = await doApiAction({
      endpoint: `order-requests/${orderRequest.id}/edit`,
      method: 'PUT',
      body: {
        transportType: values.transportType,
        portOfOriginCode: values.portOfOriginCode,
        portOfDestinationCode: values.portOfDestinationCode,
      },
    });

    notifications.add({
      message: t(result?.message ?? 'notifications:genericError'),
      autoClose: 10000,
    });
  };

  return (
    <form
      className={styles.orderrequest_review_page_form}
      onSubmit={editOrderForm.onSubmit(values => handleSubmit(values))}
    >
      <TextInput
        className={styles.company_name_field}
        label={t('orderRequestForm:companyNameInputTitle')}
        description={t('orderRequestForm:')}
        value={orderRequest?.companyName}
        disabled
      />
      <TextInput
        className={styles.status_field}
        label={t('orderRequestForm:statusInputTitle')}
        value={orderRequest?.status}
        disabled
      />
      <Select
        className={styles.transport_type_field}
        label={t('orderRequestForm:transportTypeInputTitle')}
        value={orderRequest?.transportType}
        data={['IMPORT', 'EXPORT']}
        allowDeselect={false}
        disabled={!allowEditing}
        {...editOrderForm.getInputProps('transportType')}
      />
      <PortcodesSelector
        className={styles.port_origin_code_field}
        label={t('orderRequestForm:portOfOriginInputTitle')}
        value={orderRequest?.portOfOriginCode}
        allowDeselect={false}
        disabled={
          !allowEditing || editOrderForm.values.transportType === 'EXPORT'
        }
        {...editOrderForm.getInputProps('portOfOriginCode')}
      />
      <PortcodesSelector
        className={styles.port_dest_code_field}
        label={t('orderRequestForm:portOfDestinationInputTitle')}
        value={orderRequest?.portOfDestinationCode}
        allowDeselect={false}
        disabled={
          !allowEditing || editOrderForm.values.transportType === 'IMPORT'
        }
        {...editOrderForm.getInputProps('portOfDestinationCode')}
      />
      {allowEditing && (
        <div className={styles.button}>
          <Button
            type='submit'
            disabled={!editOrderForm.isDirty()}
          >
            {t('orderRequestReviewPage:confirmButton')}
          </Button>
        </div>
      )}
    </form>
  );
};
