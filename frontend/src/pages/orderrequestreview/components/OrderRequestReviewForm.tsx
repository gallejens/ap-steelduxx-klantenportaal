import { type FC } from 'react';
//import { useTranslation } from 'react-i18next';
//import styles from '../styles/userRequestReview.module.scss';
import { TextInput } from '@mantine/core';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { doApiAction } from '@/lib/api';
import { OrderRequest } from '@/types/api';

export const OrderRequestReviewForm: FC = () => {
  // const { t } = useTranslation();

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
    <div>
      <TextInput value={orderRequest?.id}></TextInput>
    </div>
    // <form className={styles.orderrequest_review_page_form}>
    //   <div className={styles.company_detail_fields}>
    //     <div className={styles.company_fields}>
    //       <TextInput
    //         className={styles.companyName_field}
    //         label={t('orderRequestForm:id')}
    //         value={orderRequest?.id}
    //         disabled
    //       />
    //       <TextInput
    //         className={styles.country_field}
    //         label={t('orderRequestForm:')}
    //         value={orderRequest?.customerCode}
    //         disabled
    //       />
    //       <TextInput
    //         className={styles.country_field}
    //         label={t('orderRequestForm:')}
    //         value={orderRequest?.status}
    //         disabled
    //       />
    //       <TextInput
    //         className={styles.country_field}
    //         label={t('orderRequestForm:')}
    //         value={orderRequest?.transportType}
    //         disabled
    //       />
    //     </div>
    //   </div>
    //   <div className={styles.name_fields}>
    //     <TextInput
    //       label={t('orderRequestForm:')}
    //       description={t('orderRequestForm:')}
    //       value={orderRequest?.customerCode}
    //       disabled
    //     />
    //     <TextInput
    //       className={styles.lastname_field}
    //       label={' '}
    //       description={t('orderRequestForm:')}
    //       value={orderRequest?.portOfDestinationCode}
    //       disabled
    //     />
    //     <TextInput
    //       className={styles.lastname_field}
    //       label={' '}
    //       description={t('orderRequestForm:')}
    //       value={orderRequest?.portOfOriginCode}
    //       disabled
    //     />
    //   </div>
    // </form>
  );
};
