import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import './styles/orderDetails.module.scss';

interface OrderDetail {
  referenceNumber: string; // ex: "2646607000",
  customerReferenceNumber: string; // ex: "SRL/BHJ/EXP/PI-154",
  state: 'SAILING' | 'PLANNED' | 'CREATED' | 'ARRIVED' | 'CLOSED' | 'LOADED';
  transportType: 'IMPORT' | 'EXPORT';
  portOfOriginCode: string; // ex: "INMUN",
  portOfOriginName: string; // ex: "Mundra, India",
  portOfDestinationCode: string; // ex: "BEANR",
  portOfDestinationName: string; //ex: "Antwerp, Belgium",
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
  const { referenceNumber } = useParams<'referenceNumber'>();
  const { t } = useTranslation();

  const {
    data: orderDetail,
    status,
    error,
  } = useQuery<OrderDetail>({
    queryKey: ['orderDetail', referenceNumber],
    queryFn: () =>
      fetch(`/orders/${referenceNumber}`).then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
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
    <div className='order-details'>
      <h1>Order Details: {orderDetail.referenceNumber}</h1>
      <section>
        <h2>General Information</h2>
        <p>Customer Reference: {orderDetail.customerReferenceNumber}</p>
        <p>State: {orderDetail.state}</p>
        <p>Transport Type: {orderDetail.transportType}</p>
      </section>

      <section>
        <h2>Ship Information</h2>
        <p>Name: {orderDetail.shipName}</p>
        <p>IMO: {orderDetail.shipIMO}</p>
        <p>MMSI: {orderDetail.shipMMSI}</p>
        <p>Type: {orderDetail.shipType}</p>
      </section>

      <section>
        <h2>Products</h2>
        <ul>
          {orderDetail?.products.map((product: Product, index: number) => (
            <li key={index}>
              {product.name} - Quantity: {product.quantity}, Weight:{' '}
              {product.weight} kg
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
