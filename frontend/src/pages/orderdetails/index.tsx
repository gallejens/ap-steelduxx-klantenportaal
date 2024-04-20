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

  function formatWeight(weight: number): string {
    return weight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

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
          {orderDetail?.data.referenceNumber}
        </h1>
      </div>
      <div className={styles.order_details_content}>
        <div className={styles.leftcolumn}>
          <section>
            <h2>{t('orderDetailPage:generalInfo')}</h2>
            <p>
              <strong>{t('orderDetailPage:customerReference')}:</strong>{' '}
              {orderDetail?.data.customerReferenceNumber}
            </p>
            <p>
              <strong>{t('orderDetailPage:state')}:</strong>{' '}
              {orderDetail?.data.state}
            </p>
            <p>
              <strong>{t('orderDetailPage:transportType')}:</strong>{' '}
              {orderDetail?.data.transportType}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:portInformation')}</h2>
            <p>
              <strong>{t('orderDetailPage:origin')}:</strong>{' '}
              {orderDetail?.data.portOfOriginName} -{' '}
              {orderDetail?.data.portOfOriginCode}
            </p>
            <p>
              <strong>{t('orderDetailPage:destination')}:</strong>{' '}
              {orderDetail?.data.portOfDestinationName} -{' '}
              {orderDetail?.data.portOfDestinationCode}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:timeInformation')}</h2>
            <p>
              <strong>{t('orderDetailPage:ets')}:</strong>{' '}
              {orderDetail?.data.ets}
            </p>
            <p>
              <strong>{t('orderDetailPage:ats')}:</strong>{' '}
              {orderDetail?.data.ats}
            </p>
            <p>
              <strong>{t('orderDetailPage:eta')}:</strong>{' '}
              {orderDetail?.data.eta}
            </p>
            <p>
              <strong>{t('orderDetailPage:ata')}:</strong>{' '}
              {orderDetail?.data.ata}
            </p>
            <p>
              <strong>{t('orderDetailPage:estimatedTimeCargoOnQuay')}:</strong>{' '}
              {orderDetail?.data.estimatedTimeCargoOnQuay}
            </p>
            <p>
              <strong>{t('orderDetailPage:actualTimeCargoLoaded')}:</strong>{' '}
              {orderDetail?.data.actualTimeCargoLoaded}
            </p>
          </section>
        </div>
        <div className={styles.rightcolumn}>
          <section>
            <h2>{t('orderDetailPage:shipInformation')}</h2>
            <p>
              <strong>{t('orderDetailPage:shipName')}:</strong>{' '}
              {orderDetail?.data.shipName}
            </p>
            <p>
              <strong>{t('orderDetailPage:imo')}:</strong>{' '}
              {orderDetail?.data.shipIMO}
            </p>
            <p>
              <strong>{t('orderDetailPage:mmsi')}:</strong>{' '}
              {orderDetail?.data.shipMMSI}
            </p>
            <p>
              <strong>{t('orderDetailPage:type')}:</strong>{' '}
              {orderDetail?.data.shipType}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:products')}</h2>
            <table className={styles.product_table}>
              <thead>
                <tr>
                  <th>{t('orderDetailPage:hsCode')}</th>
                  <th>{t('orderDetailPage:name')}</th>
                  <th>{t('orderDetailPage:quantity')}</th>
                  <th>{t('orderDetailPage:weight')}</th>
                  {orderDetail?.data.products.some(
                    p => p.containerNumber != null
                  ) && <th>{t('orderDetailPage:container')}</th>}
                  {orderDetail?.data.products.some(
                    p => p.containerSize != null
                  ) && <th>{t('orderDetailPage:containerSize')}</th>}
                  {orderDetail?.data.products.some(
                    p => p.containerType != null
                  ) && <th>{t('orderDetailPage:containerType')}</th>}
                </tr>
              </thead>
              <tbody>
                {orderDetail?.data.products.map((product, index: number) => (
                  <tr key={index}>
                    <td>{product.hsCode}</td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{formatWeight(product.weight)} kg</td>
                    {product.containerNumber != null && (
                      <td>{product.containerNumber}</td>
                    )}
                    {product.containerSize != null && (
                      <td>{product.containerSize}</td>
                    )}
                    {product.containerType != null && (
                      <td>{product.containerType}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
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
