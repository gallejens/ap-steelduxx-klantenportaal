import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/orderDetails.module.scss';
import type { OrderDetails } from '@/types/api';
import { Title, Text, Badge } from '@mantine/core';
import {
  getOrderStateColor,
  getOrderTransportTypeColor,
} from '@/pages/orderlist/helpers';
import { IconArrowBadgeRight } from '@tabler/icons-react';

interface OrderInfoProps {
  orderDetail: OrderDetails;
}

export const OrderInfo: FC<OrderInfoProps> = ({ orderDetail }) => {
  const { t } = useTranslation();

  if (!orderDetail) {
    return <div>{t('orderDetailsPage:loading')}</div>;
  }

  return (
    <div className={styles.orderInfo}>
      <div className={styles.generalInfo}>
        <div className={styles.firstRow}>
          <Title
            className={styles.title}
            order={3}
          >
            {t('orderDetailPage:generalInfo')}:
          </Title>
          <div className={styles.titleInfo}>
            <Text>{orderDetail.customerReferenceNumber ?? ''}</Text>
            <Badge
              className={styles.transportBadge}
              color={getOrderTransportTypeColor(orderDetail.transportType)}
            >
              {orderDetail.transportType}
            </Badge>
          </div>
        </div>
        <div className={styles.secondRow}>
          <div className={styles.subColumnLeft}>
            <Text>{orderDetail.portOfDestinationName}</Text>
            <Text>{orderDetail.portOfDestinationCode}</Text>
          </div>
          <div className={styles.subColumnMiddle}>
            <Text
              fw={600}
              c={getOrderStateColor(orderDetail.state)}
            >
              {orderDetail.state}
            </Text>
            <IconArrowBadgeRight />
          </div>
          <div className={styles.subColumnRight}>
            <Text>{orderDetail.portOfOriginName}</Text>
            <Text>{orderDetail.portOfOriginCode}</Text>
          </div>
        </div>
        <div className={styles.thirdRow}>
          <div className={styles.subColumn3}>
            <Text className={styles.subTitle}>{t('orderDetailPage:ets')}:</Text>
            <Text>{orderDetail.ets ?? '?'}</Text>
          </div>
          <div className={styles.subColumn4}>
            <Text className={styles.subTitle}>{t('orderDetailPage:ats')}:</Text>
            <Text>{orderDetail.ats ?? '?'}</Text>
          </div>
          <div className={styles.subColumn5}>
            <Text className={styles.subTitle}>{t('orderDetailPage:eta')}:</Text>
            <Text>{orderDetail.eta ?? '?'}</Text>
          </div>
          <div className={styles.subColumn6}>
            <Text className={styles.subTitle}>{t('orderDetailPage:ata')}:</Text>
            <Text>{orderDetail.ata ?? '?'}</Text>
          </div>
        </div>
        <div className={styles.fourthRow}>
          <div className={styles.subColumn7}>
            <Text className={styles.subTitle}>
              {t('orderDetailPage:estimatedTimeCargoOnQuay')}:
            </Text>
            <Text>{orderDetail.estimatedTimeCargoOnQuay || '?'}</Text>
          </div>
          <div className={styles.subColumn8}>
            <Text className={styles.subTitle}>
              {t('orderDetailPage:actualTimeCargoLoaded')}:
            </Text>
            <Text>{orderDetail.actualTimeCargoLoaded || '?'}</Text>
          </div>
        </div>
        <div className={styles.fifthRow}>
          <div className={styles.subColumn9}>
            <Text>{orderDetail.shipName ?? '?'}</Text>
            <Text>{orderDetail.shipType ?? '?'}</Text>
          </div>
          <div className={styles.subColumn10}>
            <Text className={styles.subTitle}>{t('orderDetailPage:imo')}:</Text>
            <Text>{orderDetail.shipIMO ?? '?'}</Text>
          </div>
          <div className={styles.subColumn11}>
            <Text className={styles.subTitle}>
              {t('orderDetailPage:mmsi')}:
            </Text>
            <Text>{orderDetail.shipMMSI ?? '?'}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};
