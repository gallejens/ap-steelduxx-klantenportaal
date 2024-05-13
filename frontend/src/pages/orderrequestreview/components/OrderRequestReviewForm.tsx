import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/orderRequestReview.module.scss';
import { TextInput } from '@mantine/core';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { doApiAction } from '@/lib/api';
import { type OrderRequest } from '@/types/api';

export const OrderRequestReviewForm: FC = () => {
  const { t } = useTranslation();

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

  return (
    <form className={styles.orderrequest_review_page_form}>
      <div className={styles.company_detail_fields}></div>
      <div className={styles.name_fields}>
        <TextInput
          className={styles.number_fields}
          label={t('orderRequestForm:idInputTitle')}
          value={orderRequest?.id}
          disabled
        />
        <TextInput
          className={styles.status_field}
          label={t('orderRequestForm:statusInputTitle')}
          value={orderRequest?.status}
          disabled
        />
        <TextInput
          className={styles.number_fields}
          label={t('orderRequestForm:transportTypeInputTitle')}
          value={orderRequest?.transportType}
          disabled
        />
        <TextInput
          className={styles.number_fields}
          label={t('orderRequestForm:companyNameInputTitle')}
          description={t('orderRequestForm:')}
          value={orderRequest?.companyName}
          disabled
        />
        <TextInput
          className={styles.number_fields}
          label={t('orderRequestForm:portOfDestinationInputTitle')}
          description={t('orderRequestForm:')}
          value={orderRequest?.portOfDestinationCode}
          disabled
        />
        <TextInput
          className={styles.number_fields}
          label={t('orderRequestForm:portOfOriginInputTitle')}
          description={t('orderRequestForm:')}
          value={orderRequest?.portOfOriginCode}
          disabled
        />
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
};
