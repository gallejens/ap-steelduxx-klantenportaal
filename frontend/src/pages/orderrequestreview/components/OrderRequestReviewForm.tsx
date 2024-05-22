import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/orderRequestReview.module.scss';
import { ActionIcon, Select, TextInput } from '@mantine/core';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { doApiAction } from '@/lib/api';
import type { OrderTransportType, OrderRequest, Product } from '@/types/api';
import { useForm } from '@mantine/form';
import { PortcodesSelector } from '@/components/portcodesselector';
import { IconEdit } from '@tabler/icons-react';
import { useModalStore } from '@/stores/useModalStore';
import { EditProductModal } from '../modal/EditProductModal';

type EditOrderFormValues = {
  transportType: OrderTransportType;
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
      transportType: (orderRequest?.transportType === 'IMPORT'
        ? 'IMPORT'
        : 'EXPORT') as OrderTransportType,
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

  const openEditProductModal = (product: Product) => {
    openModal(
      <EditProductModal
        product={product}
        onConfirm={() => {
          closeModal();
        }}
      />
    );
  };

  return (
    <form className={styles.orderrequest_review_page_form}>
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
    </form>
  );
};
