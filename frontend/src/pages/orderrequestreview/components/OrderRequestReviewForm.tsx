import { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/orderRequestReview.module.scss';
import { ActionIcon, Button, Select, TextInput } from '@mantine/core';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { doApiAction } from '@/lib/api';
import type { OrderRequest, Product } from '@/types/api';
import { useForm } from '@mantine/form';
import { PortcodesSelector } from '@/components/portcodesselector';
import { IconEdit } from '@tabler/icons-react';
import { useModalStore } from '@/stores/useModalStore';
import { EditProductModal } from '../modal/EditProductModal';
import { notifications } from '@/components/notifications/lib';

type EditOrderFormValues = {
  transportType: string;
  portOfDestinationCode: string;
  portOfOriginCode: string;
};

export const OrderRequestReviewForm: FC = () => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();

  const { orderrequestid: orderrequestId } = useParams({
    from: '/app/order-requests/$orderrequestid',
  });

  const { data: orderRequest } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['orderRequestValue'],
    queryFn: () =>
      doApiAction<OrderRequest>({
        endpoint: `/order-requests/${orderrequestId}`,
        method: 'GET',
      }),
  });

  const isNotPending = orderRequest?.status !== 'PENDING';

  const editOrderForm = useForm<EditOrderFormValues>({
    initialValues: {
      transportType: orderRequest?.transportType ?? '',
      portOfDestinationCode: orderRequest?.portOfDestinationCode ?? '',
      portOfOriginCode: orderRequest?.portOfOriginCode ?? '',
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
    if (orderRequest) {
      editOrderForm.setValues({
        transportType: orderRequest.transportType,
        portOfDestinationCode: orderRequest.portOfDestinationCode,
        portOfOriginCode: orderRequest.portOfOriginCode,
      });
    }
  }, [orderRequest, editOrderForm.setValues]);

  const [prevTransportType, setPrevTransportType] = useState('');

  useEffect(() => {
    if (editOrderForm.values.transportType !== prevTransportType) {
      if (editOrderForm.values.transportType === 'IMPORT') {
        editOrderForm.setFieldValue(
          'portOfOriginCode',
          orderRequest?.portOfDestinationCode ?? ''
        );
        editOrderForm.setFieldValue(
          'portOfDestinationCode',
          orderRequest?.portOfOriginCode ?? ''
        );
      } else if (editOrderForm.values.transportType === 'EXPORT') {
        editOrderForm.setFieldValue(
          'portOfOriginCode',
          orderRequest?.portOfOriginCode ?? ''
        );
        editOrderForm.setFieldValue(
          'portOfDestinationCode',
          orderRequest?.portOfDestinationCode ?? ''
        );
      }
      setPrevTransportType(editOrderForm.values.transportType);
    }
  }, [editOrderForm.values.transportType, prevTransportType, orderRequest]);

  const openEditProductModal = (product: Product) => {
    openModal(
      <EditProductModal
        product={product}
        onConfirm={() => {
          closeModal();
        }}
        orderRequestId={orderrequestId}
      />
    );
  };

  const handleSubmit = async (values: EditOrderFormValues) => {
    const result = await doApiAction({
      endpoint: `order-requests/${orderrequestId}/edit`,
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
      <div className={styles.company_detail_fields}>
        <div className={styles.first_row}>
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
            disabled={isNotPending}
            {...editOrderForm.getInputProps('transportType')}
          />
        </div>
        <div className={styles.second_row}>
          <TextInput
            className={styles.company_name_field}
            label={t('orderRequestForm:companyNameInputTitle')}
            description={t('orderRequestForm:')}
            value={orderRequest?.companyName}
            disabled
          />
        </div>
        <div className={styles.third_row}>
          <PortcodesSelector
            className={styles.port_origin_code_field}
            label={t('orderRequestForm:portOfOriginInputTitle')}
            value={orderRequest?.portOfOriginCode}
            allowDeselect={false}
            disabled={isNotPending}
            {...editOrderForm.getInputProps('portOfOriginCode')}
          />
          <PortcodesSelector
            className={styles.port_dest_code_field}
            label={t('orderRequestForm:portOfDestinationInputTitle')}
            value={orderRequest?.portOfDestinationCode}
            allowDeselect={false}
            disabled={isNotPending}
            {...editOrderForm.getInputProps('portOfDestinationCode')}
          />
        </div>
      </div>
      <div className={styles.product_table}>
        <table>
          <thead>
            <tr>
              <th>{t('orderRequestForm:productName')}</th>
              <th>{t('orderRequestForm:quantity')}</th>
              <th>{t('orderRequestForm:weight')}</th>
              <th>{t('orderRequestForm:containerNumber')}</th>
              <th>{t('orderRequestForm:containerSize')}</th>
              <th>{t('orderRequestForm:containerType')}</th>
            </tr>
          </thead>
          <tbody>
            {orderRequest?.product.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.weight}</td>
                <td>{product.containerNumber ?? '-'}</td>
                <td>{product.containerSize}</td>
                <td>{product.containerType}</td>
                <td>
                  <ActionIcon>
                    <IconEdit
                      onClick={() => {
                        openEditProductModal(product);
                      }}
                    />
                  </ActionIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.confirm_button}>
        <Button
          type='submit'
          disabled={!editOrderForm.isDirty()}
        >
          {t('orderRequestReviewPage:confirmButton')}
        </Button>
      </div>
    </form>
  );
};
