import { type FC } from 'react';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import styles from './styles/orderDetails.module.scss';
import { doApiAction } from '@/lib/api';

interface OrderDetail {
  referenceNumber: string; // ex: "2646607000",
  customerReferenceNumber: string; // ex: "SRL/BHJ/EXP/PI-154",
  state: 'SAILING' | 'PLANNED' | 'CREATED' | 'ARRIVED' | 'CLOSED' | 'LOADED';
  transportType: 'IMPORT' | 'EXPORT';
  portOfOriginCode: string; // ex: "INMUN",
  portOfOriginName: string; // ex: "Mundra, India",
  portOfDestinationCode: string; // ex: "BEANR",
  portOfDestinationName: string; // ex: "Antwerp, Belgium",
  shipName: string; // ex: "EDISON",
  shipIMO: string; // ex: "9463011",
  shipMMSI: string; // ex: "235082896",
  shipType: string; // ex: "Container Ship",
  ets: string | null; // ex: "07-03-2024 11:58",
  ats: string | null; // ex: "07-03-2024 23:58",
  eta: string | null; // ex: "27-03-2024 11:58",
  ata: string | null; // ex: null
  preCarriage: string; // ex: "RAIL",
  estimatedTimeCargoOnQuay: string; // ex: "13-03-2024 17:12",
  actualTimeCargoLoaded: string; // ex: "17-03-2024 17:12",
  billOfLadingDownloadLink: string; // ex: "/document/download/2646607000/bl"
  packingListDownloadLink: string; // ex: "/document/download/2646607000/packing",
  customsDownloadLink: string; // ex: "/document/download/2646607000/customs",
  products: Product[];
}

interface Product {
  hsCode: string; // ex "73063090",
  name: string; // ex: "Galvanized steel pipes",
  quantity: number; // ex: 15,
  weight: number; // ex: 14328000,
  containerNumber: string; // ex: "OOCU7396492",
}

export const OrderDetailsPage: FC = () => {
  const { t } = useTranslation();
  const { order_id: orderId } = useParams({
    from: '/app/orders/$order_id',
  });

  const {
    data: orderDetail,
    status,
    error,
  } = useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: () =>
      doApiAction<OrderDetail>({
        endpoint: `/orders/${orderId}`,
        method: 'GET',
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

  if (status === 'error') {
    return (
      <div>
        {t('orderDetailsPage:error')} | {error.message}
      </div>
    );
  }

  return (
    <div className={styles.order_details_wrapper}>
      <div className={styles.order_details_header}>
        <h1>
          {t('orderDetailPage:orderDetails')}: {orderDetail?.referenceNumber}
        </h1>
      </div>
      <div className={styles.order_details_content}>
        <div className={styles.leftcolumn}>
          <section>
            <h2>{t('orderDetailPage:generalInfo')}</h2>
            <p>
              <strong>{t('orderDetailPage:customerReference')}:</strong>{' '}
              {orderDetail?.customerReferenceNumber}
            </p>
            <p>
              <strong>{t('orderDetailPage:state')}:</strong>{' '}
              {orderDetail?.state}
            </p>
            <p>
              <strong>{t('orderDetailPage:transportType')}:</strong>{' '}
              {orderDetail?.transportType}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:portInformation')}</h2>
            <p>
              <strong>{t('orderDetailPage:origin')}:</strong>{' '}
              {orderDetail?.portOfOriginName} - {orderDetail?.portOfOriginCode}
            </p>
            <p>
              <strong>{t('orderDetailPage:destination')}:</strong>{' '}
              {orderDetail?.portOfDestinationName} -{' '}
              {orderDetail?.portOfDestinationCode}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:timeInformation')}</h2>
            <p>
              <strong>{t('orderDetailPage:ets')}:</strong> {orderDetail?.ets}
            </p>
            <p>
              <strong>{t('orderDetailPage:ats')}:</strong> {orderDetail?.ats}
            </p>
            <p>
              <strong>{t('orderDetailPage:eta')}:</strong> {orderDetail?.eta}
            </p>
            <p>
              <strong>{t('orderDetailPage:ata')}:</strong> {orderDetail?.ata}
            </p>
            <p>
              <strong>{t('orderDetailPage:estimatedTimeCargoOnQuay')}:</strong>{' '}
              {orderDetail?.estimatedTimeCargoOnQuay}
            </p>
            <p>
              <strong>{t('orderDetailPage:actualTimeCargoLoaded')}:</strong>{' '}
              {orderDetail?.actualTimeCargoLoaded}
            </p>
          </section>
        </div>
        <div className={styles.rightcolumn}>
          <section>
            <h2>{t('orderDetailPage:shipInformation')}</h2>
            <p>
              <strong>{t('orderDetailPage:name')}:</strong>{' '}
              {orderDetail?.shipName}
            </p>
            <p>
              <strong>{t('orderDetailPage:imo')}:</strong>{' '}
              {orderDetail?.shipIMO}
            </p>
            <p>
              <strong>{t('orderDetailPage:mmsi')}:</strong>{' '}
              {orderDetail?.shipMMSI}
            </p>
            <p>
              <strong>{t('orderDetailPage:type')}:</strong>{' '}
              {orderDetail?.shipType}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:products')}</h2>
            <ul>
              {orderDetail?.products.map((product: Product, index: number) => (
                <li key={index}>
                  <strong>{t('orderDetailPage:hsCode')}:</strong>{' '}
                  {product.hsCode} - {product.name} -
                  <strong>{t('orderDetailPage:quantity')}:</strong>{' '}
                  {product.quantity}, {formatWeight(product.weight)} kg
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
              srcDoc={orderDetail ? getIframeContent(orderDetail.shipIMO) : ''}
              frameBorder='0'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
