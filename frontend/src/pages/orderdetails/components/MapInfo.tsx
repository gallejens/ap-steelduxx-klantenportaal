import type { FC } from 'react';
import styles from '../styles/orderDetails.module.scss';
import type { OrderDetails } from '@/types/api';
import { useTranslation } from 'react-i18next';
import { Title } from '@mantine/core';

interface MapInfoProps {
  orderDetail: OrderDetails;
}

export const MapInfo: FC<MapInfoProps> = ({ orderDetail }) => {
  const { t } = useTranslation();
  const getIframeContent = (imo: string) => {
    return `
          <script type="text/javascript">
            var width="100%";
            var height="300";
            var names=true;
            var imo="${imo}";
            var show_track=true;
            var zoom=10;
          </script>
          <script type="text/javascript" src="https://www.vesselfinder.com/aismap.js"></script>
        `;
  };

  return (
    <div className={styles.mapContainer}>
      <Title
        order={3}
        className={styles.title}
      >
        {t('orderDetailPage:shipLocation')}
      </Title>
      <iframe
        title='VesselFinder Map'
        style={{ width: '100%', height: '420px' }}
        srcDoc={orderDetail ? getIframeContent(orderDetail.shipIMO) : ''}
        frameBorder='0'
      />
    </div>
  );
};
