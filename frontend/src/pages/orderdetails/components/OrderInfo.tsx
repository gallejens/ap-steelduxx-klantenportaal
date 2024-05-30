import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/orderDetails.module.scss';
import type { OrderDetails } from '@/types/api';
import { Title, Text, Badge, Divider } from '@mantine/core';
import {
  getOrderStateColor,
  getOrderTransportTypeColor,
} from '@/pages/orderlist/helpers';
import { IconArrowBadgeRight } from '@tabler/icons-react';

type Props = {
  orderDetail: OrderDetails;
};

export const OrderInfo: FC<Props> = ({ orderDetail }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.order_info}>
      <div className={styles.header}>
        <Title order={3}>{t('orderDetailPage:generalInfo')}</Title>
        <div className={styles.badges}>
          <Badge
            color={getOrderStateColor(orderDetail.state)}
            size='lg'
          >
            {orderDetail.state}
          </Badge>
          <Badge
            color={getOrderTransportTypeColor(orderDetail.transportType)}
            size='lg'
          >
            {orderDetail.transportType}
          </Badge>
        </div>
      </div>
      <Divider orientation='horizontal' />
      <div className={styles.ports}>
        <div>
          <Text size='sm'>{orderDetail.portOfOriginName}</Text>
          <Text c='dimmed'>{orderDetail.portOfOriginCode}</Text>
        </div>
        <IconArrowBadgeRight size={40} />
        <div>
          <Text size='sm'>{orderDetail.portOfDestinationName}</Text>
          <Text c='dimmed'>{orderDetail.portOfDestinationCode}</Text>
        </div>
      </div>
      <Divider orientation='horizontal' />
      <div className={styles.times}>
        <div />
        <Text
          c='dimmed'
          size='sm'
        >
          {t('orderDetailPage:times:estimated')}:
        </Text>
        <Text
          c='dimmed'
          size='sm'
        >
          {t('orderDetailPage:times:actual')}:
        </Text>
        <Title order={5}>{t('orderDetailPage:times:departure')}</Title>
        <Text>{orderDetail.ets ?? '/'}</Text>
        <Text>{orderDetail.eta ?? '/'}</Text>
        <Title order={5}>{t('orderDetailPage:times:arrival')}</Title>
        <Text>{orderDetail.ats ?? '/'}</Text>
        <Text>{orderDetail.ata ?? '/'}</Text>
      </div>
      <Divider orientation='horizontal' />
      <div className={styles.cargo_times}>
        <div>
          <Text size='sm'>
            {t('orderDetailPage:estimatedTimeCargoOnQuay')}:
          </Text>
          <Text>{orderDetail.estimatedTimeCargoOnQuay ?? '/'}</Text>
        </div>
        <div>
          <Text size='sm'>{t('orderDetailPage:actualTimeCargoLoaded')}:</Text>
          <Text>{orderDetail.actualTimeCargoLoaded ?? '/'}</Text>
        </div>
      </div>
      <Divider orientation='horizontal' />
      <div className={styles.ship}>
        <div>
          <Title order={5}>{orderDetail.shipName ?? '?'}</Title>
          <Text c='dimmed'>{orderDetail.shipType ?? '?'}</Text>
        </div>
        <div>
          <Text
            c='dimmed'
            size='sm'
          >
            {t('orderDetailPage:imo')}
          </Text>
          <Text>{orderDetail.shipIMO ?? '?'}</Text>
        </div>
        <div>
          <Text
            c='dimmed'
            size='sm'
          >
            {t('orderDetailPage:mmsi')}
          </Text>
          <Text>{orderDetail.shipMMSI ?? '?'}</Text>
        </div>
      </div>
    </div>
  );
};
