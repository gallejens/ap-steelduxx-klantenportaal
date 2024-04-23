import { type FC } from 'react';
import { useParams, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import styles from './styles/orderDetails.module.scss';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import type { OrderDetails, OrderState, OrderTransportType } from '@/types/api';

export const OrderDetailsPage: FC = () => {
  const { t } = useTranslation();
  const { order_id: orderId } = useParams({
    from: '/app/orders/$order_id',
  });
  const { customerCode } = useSearch({
    from: '/app/orders/$order_id',
  });

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

  function getStateClass(state: OrderState): string {
    switch (state) {
      case 'SAILING':
        return styles.sailing;
      case 'PLANNED':
        return styles.planned;
      case 'CREATED':
        return styles.created;
      case 'ARRIVED':
        return styles.arrived;
      case 'CLOSED':
        return styles.closed;
      case 'LOADED':
        return styles.loaded;
      default:
        return '';
    }
  }

  function getTransportTypeClass(transportType: OrderTransportType): string {
    switch (transportType) {
      case 'IMPORT':
        return styles.import;
      case 'EXPORT':
        return styles.export;
      default:
        return '';
    }
  }

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
    <div className={styles.orderDetails}>
      <h1 className={styles.header}>
        {t('orderDetailPage:orderDetails')}: {orderDetail?.data.referenceNumber}
      </h1>
      <div className={styles.topRow}>
        <div className={styles.generalInfo}>
          <section>
            <h2 className={styles.title}>{t('orderDetailPage:generalInfo')}</h2>
            <p className={styles.subTitle}>
              {t('orderDetailPage:customerReference')}
            </p>
            <p>{orderDetail?.data.customerReferenceNumber ?? '?'}</p>
            <p className={styles.subTitle}>{t('orderDetailPage:state')}</p>
            <p className={getStateClass(orderDetail?.data.state)}>
              {orderDetail?.data.state ?? '?'}
            </p>
            <p className={styles.subTitle}>
              {t('orderDetailPage:transportType')}
            </p>
            <p
              className={getTransportTypeClass(orderDetail?.data.transportType)}
            >
              {orderDetail?.data.transportType}
            </p>
            <p className={styles.subTitle}>{t('orderDetailPage:origin')}</p>
            <p>
              {orderDetail?.data.portOfOriginName ?? '?'} -{' '}
              {orderDetail?.data.portOfOriginCode ?? '?'}
            </p>
            <p className={styles.subTitle}>
              {t('orderDetailPage:destination')}
            </p>
            <p>
              {orderDetail?.data.portOfDestinationName ?? '?'} -{' '}
              {orderDetail?.data.portOfDestinationCode ?? '?'}
            </p>
          </section>
        </div>
        <div className={styles.timeInfo}>
          <section>
            <h2 className={styles.title}>
              {t('orderDetailPage:timeInformation')}
            </h2>
            <p className={styles.subTitle}>{t('orderDetailPage:ets')}</p>
            <p>{orderDetail?.data.ets ?? '?'}</p>
            <p className={styles.subTitle}>{t('orderDetailPage:ats')}</p>
            <p>{orderDetail?.data.ats ?? '?'}</p>
            <p className={styles.subTitle}>{t('orderDetailPage:eta')}</p>
            <p>{orderDetail?.data.eta ?? '?'}</p>
            <p className={styles.subTitle}>{t('orderDetailPage:ata')}</p>
            <p>{orderDetail?.data.ata ?? '?'}</p>
            <p className={styles.subTitle}>
              {t('orderDetailPage:estimatedTimeCargoOnQuay')}
            </p>
            <p>{orderDetail?.data.estimatedTimeCargoOnQuay}</p>
            <p className={styles.subTitle}>
              {t('orderDetailPage:actualTimeCargoLoaded')}
            </p>
            <p>{orderDetail?.data.actualTimeCargoLoaded}</p>
          </section>
        </div>
        <div className={styles.shipInfo}>
          <section>
            <h2 className={styles.title}>
              {t('orderDetailPage:shipInformation')}
            </h2>
            <p className={styles.subTitle}>{t('orderDetailPage:shipName')}</p>
            <p>{orderDetail?.data.shipName ?? '?'}</p>
            <p className={styles.subTitle}>{t('orderDetailPage:imo')}</p>
            <p>{orderDetail?.data.shipIMO ?? '?'}</p>
            <p className={styles.subTitle}>{t('orderDetailPage:mmsi')}</p>
            <p>{orderDetail?.data.shipMMSI ?? '?'}</p>
            <p className={styles.subTitle}>{t('orderDetailPage:type')}</p>
            <p>{orderDetail?.data.shipType ?? '?'}</p>
          </section>
        </div>
        <div className={styles.mapContainer}>
          <h2 className={styles.title}>{t('orderDetailPage:shipLocation')}</h2>
          <iframe
            title='VesselFinder Map'
            style={{ width: '100%', height: '300px' }}
            srcDoc={
              orderDetail ? getIframeContent(orderDetail.data.shipIMO) : ''
            }
            frameBorder='0'
          />
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.productsList}>
          <section>
            <h2>{t('orderDetailPage:products')}</h2>
            <div className={styles.tableContainer}>
              <table>
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
            </div>
          </section>
        </div>
        <div className={styles.documentsContainer}>
          <p>documents</p>
          <p>download</p>
          <button>X</button>
        </div>
      </div>
    </div>
  );
};
