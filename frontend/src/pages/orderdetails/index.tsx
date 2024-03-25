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
              {t('orderDetailPage:customerReference')}:{' '}
              {orderDetail?.customerReferenceNumber}
            </p>
            <p>
              {t('orderDetailPage:state')}: {orderDetail?.state}
            </p>
            <p>
              {t('orderDetailPage:transportType')}: {orderDetail?.transportType}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:portInformation')}</h2>
            <p>
              {t('orderDetailPage:origin')}: {orderDetail?.portOfOriginName} -{' '}
              {orderDetail?.portOfOriginCode}
            </p>
            <p>
              {t('orderDetailPage:destination')}:{' '}
              {orderDetail?.portOfDestinationName} -{' '}
              {orderDetail?.portOfDestinationCode}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:timeInformation')}</h2>
            <p>
              {t('orderDetailPage:ets')}: {orderDetail?.ets}
            </p>
            <p>
              {t('orderDetailPage:ats')}: {orderDetail?.ats}
            </p>
            <p>
              {t('orderDetailPage:eta')}: {orderDetail?.eta}
            </p>
            <p>
              {t('orderDetailPage:ata')}: {orderDetail?.ata}
            </p>
            <p>
              {t('orderDetailPage:estimatedTimeCargoOnQuay')}:{' '}
              {orderDetail?.estimatedTimeCargoOnQuay}
            </p>
            <p>
              {t('orderDetailPage:actualTimeCargoLoaded')}:{' '}
              {orderDetail?.actualTimeCargoLoaded}
            </p>
          </section>
        </div>
        <div className={styles.rightcolumn}>
          <section>
            <h2>{t('orderDetailPage:shipInformation')}</h2>
            <p>
              {t('orderDetailPage:name')}: {orderDetail?.shipName}
            </p>
            <p>
              {t('orderDetailPage:imo')}: {orderDetail?.shipIMO}
            </p>
            <p>
              {t('orderDetailPage:mmsi')}: {orderDetail?.shipMMSI}
            </p>
            <p>
              {t('orderDetailPage:type')}: {orderDetail?.shipType}
            </p>
          </section>
          <section>
            <h2>{t('orderDetailPage:products')}</h2>
            <ul>
              {orderDetail?.products.map((product: Product, index: number) => (
                <li key={index}>
                  {t('orderDetailPage:hsCode')}: {product.hsCode} -{' '}
                  {product.name} - {t('orderDetailPage:quantity')}:{' '}
                  {product.quantity}, {product.weight} kg -{' '}
                  {t('orderDetailPage:container')}: {product.containerNumber}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
