import { type FC } from 'react';
import { useParams, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import styles from './styles/orderDetails.module.scss';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import type { OrderDetails } from '@/types/api';

export const OrderDetailsPage: FC = () => {
  const { t } = useTranslation();
  const { order_id: orderId } = useParams({
    from: '/app/orders/$order_id',
  });
  const { customerCode } = useSearch({
    from: '/app/orders/$order_id',
  });

  console.log(customerCode);

  const {
    data: orderDetail,
    status,
    error,
  } = useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: () =>
      doApiAction<GenericAPIResponse<OrderDetails>>({
        endpoint: `/orders/${orderId}`,
        method: 'GET',
        params: customerCode
          ? {
              customerCode,
            }
          : undefined,
      }),
  });

  const getIframeContent = (imo: string) => {
    return `
      <script type="text/javascript">
        var width="100%";
        var height="300";
        var names=true;
        var imo="${imo}";
        var show_track=true;
      </script>
      <script type="text/javascript" src="https://www.vesselfinder.com/aismap.js"></script>
    `;
  };

  if (status === 'pending') {
    return <div>{t('orderDetailsPage:loading')}</div>;
  }

  if (status === 'error' || !orderDetail) {
    return (
      <div>
        {t('orderDetailsPage:error')} | {error?.message ?? 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className={styles.order_details_wrapper}>
      <div className={styles.order_details_header}>
        <h1>
          {t('orderDetailPage:orderDetails')}:{' '}
          {orderDetail.data.referenceNumber}
        </h1>
      </div>
      <div className={styles.order_details_content}>
        <div className={styles.leftcolumn}>
          <section>
            <h2>{t('orderDetailPage:generalInfo')}</h2>
            <p>
              {t('orderDetailPage:customerReference')}:{' '}
              {orderDetail.data.customerReferenceNumber}
            </p>
            <p>
              {t('orderDetailPage:state')}: {orderDetail.data.state}
            </p>
            <p>
              {t('orderDetailPage:transportType')}:{' '}
              {orderDetail.data.transportType}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:portInformation')}</h2>
            <p>
              {t('orderDetailPage:origin')}: {orderDetail.data.portOfOriginName}{' '}
              - {orderDetail.data.portOfOriginCode}
            </p>
            <p>
              {t('orderDetailPage:destination')}:{' '}
              {orderDetail.data.portOfDestinationName} -{' '}
              {orderDetail.data.portOfDestinationCode}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:timeInformation')}</h2>
            <p>
              {t('orderDetailPage:ets')}: {orderDetail.data.ets}
            </p>
            <p>
              {t('orderDetailPage:ats')}: {orderDetail.data.ats}
            </p>
            <p>
              {t('orderDetailPage:eta')}: {orderDetail.data.eta}
            </p>
            <p>
              {t('orderDetailPage:ata')}: {orderDetail.data.ata}
            </p>
            <p>
              {t('orderDetailPage:estimatedTimeCargoOnQuay')}:{' '}
              {orderDetail.data.estimatedTimeCargoOnQuay}
            </p>
            <p>
              {t('orderDetailPage:actualTimeCargoLoaded')}:{' '}
              {orderDetail.data.actualTimeCargoLoaded}
            </p>
          </section>
        </div>
        <div className={styles.rightcolumn}>
          <section>
            <h2>{t('orderDetailPage:shipInformation')}</h2>
            <p>
              {t('orderDetailPage:name')}: {orderDetail.data.shipName}
            </p>
            <p>
              {t('orderDetailPage:imo')}: {orderDetail.data.shipIMO}
            </p>
            <p>
              {t('orderDetailPage:mmsi')}: {orderDetail.data.shipMMSI}
            </p>
            <p>
              {t('orderDetailPage:type')}: {orderDetail.data.shipType}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:products')}</h2>
            <ul>
              {orderDetail.data.products.map((product, index: number) => (
                <li key={index}>
                  {t('orderDetailPage:hsCode')}: {product.hsCode} -{' '}
                  {product.name} -{t('orderDetailPage:quantity')}:{' '}
                  {product.quantity}, {product.weight} kg
                  {product.containerNumber != null ? (
                    <>
                      {' '}
                      - {t('orderDetailPage:container')}:{' '}
                      {product.containerNumber}
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
          <div style={{ width: '100%', height: '300px', border: 'none' }}>
            <iframe
              title='VesselFinder Map'
              style={{ width: '100%', height: '100%' }}
              srcDoc={
                orderDetail ? getIframeContent(orderDetail.data.shipIMO) : ''
              }
              frameBorder='0'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
