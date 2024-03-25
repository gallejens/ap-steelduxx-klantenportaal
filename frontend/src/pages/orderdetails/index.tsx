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
        <h1>Order Details: {orderDetail?.referenceNumber}</h1>
      </div>
      <div className={styles.order_details_content}>
        <div className={styles.leftcolumn}>
          <section>
            <h2>General Information</h2>
            <p>Customer Reference: {orderDetail?.customerReferenceNumber}</p>
            <p>State: {orderDetail?.state}</p>
            <p>Transport Type: {orderDetail?.transportType}</p>
          </section>
          <section>
            <h2>Port Information</h2>
            <p>
              Origin: {orderDetail?.portOfOriginName} -{' '}
              {orderDetail?.portOfOriginCode}
            </p>
            <p>
              Destination: {orderDetail?.portOfDestinationName} -{' '}
              {orderDetail?.portOfDestinationCode}
            </p>
          </section>
          <section>
            <h2>Time Information</h2>
            <p>ETS: {orderDetail?.ets}</p>
            <p>ATS: {orderDetail?.ats}</p>
            <p>ETA: {orderDetail?.eta}</p>
            <p>ATA: {orderDetail?.ata}</p>
            <p>
              Estimated Time Cargo On Quay:{' '}
              {orderDetail?.estimatedTimeCargoOnQuay}
            </p>
            <p>
              Actual Time Cargo Loaded: {orderDetail?.actualTimeCargoLoaded}
            </p>
          </section>
        </div>
        <div className={styles.rightcolumn}>
          <section>
            <h2>Ship Information</h2>
            <p>Name: {orderDetail?.shipName}</p>
            <p>IMO: {orderDetail?.shipIMO}</p>
            <p>MMSI: {orderDetail?.shipMMSI}</p>
            <p>Type: {orderDetail?.shipType}</p>
          </section>
          <section>
            <h2>Products</h2>
            <ul>
              {orderDetail?.products.map((product: Product, index: number) => (
                <li key={index}>
                  HsCode: {product.hsCode} - {product.name} - Quantity:
                  {product.quantity}, {product.weight} kg - Container:
                  {product.containerNumber}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
