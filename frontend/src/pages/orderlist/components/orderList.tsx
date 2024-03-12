import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Pagination, Group, Badge, Text } from '@mantine/core';
import styles from '../styles/orderList.module.scss';

interface Order {
  referenceNumber: string; // ex: "2646607000",
  customerReferenceNumber: string; // ex: "SRL/BHJ/EXP/PI-154",
  state: 'SAILING' | 'PLANNED' | 'CREATED' | 'ARRIVED' | 'CLOSED' | 'LOADED';
  transportType: 'IMPORT' | 'EXPORT';
  portOfOriginCode: string; // ex: "INMUN",
  portOfDestinationCode: string; // ex: "BEANR",
  shipName: string; // ex: "EDISON",
  ets: string | null; // ex: "07-03-2024 11:58",
  ats: string | null; // ex: "07-03-2024 23:58",
  eta: string | null; // ex: "27-03-2024 11:58",
  ata: string | null; // ex: null
}

interface OrderListProps {
  pageSize: number;
}

export const OrderList: React.FC<OrderListProps> = ({ pageSize }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activePage, setPage] = useState(1);

  useEffect(() => {
    axios
      .get<Order[]>('http://localhost:8080/api/orders/all')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error =>
        console.error('There was an error fetching the orders:', error)
      );
  }, []);

  function getStateColor(state: Order['state']): string {
    switch (state) {
      case 'SAILING':
        return 'orange';
      case 'PLANNED':
        return 'blue';
      case 'CREATED':
        return 'gray';
      case 'ARRIVED':
        return 'green';
      case 'CLOSED':
        return 'red';
      case 'LOADED':
        return 'violet';
      default:
        return 'gray';
    }
  }

  const transformOrdersToTableData = () => {
    const head = [
      'Reference Number',
      'Customer Reference Number',
      'State',
      'Transport Type',
      'Port of Origin',
      'Port of Destination',
      'Ship Name',
      'ETS',
      'ATS',
      'ETA',
      'ATA',
    ];

    const body = orders
      .slice((activePage - 1) * pageSize, activePage * pageSize)
      .map(order => [
        order.referenceNumber,
        order.customerReferenceNumber,
        <Badge color={getStateColor(order.state)}>{order.state}</Badge>,
        <Badge color={order.transportType === 'IMPORT' ? 'blue' : 'pink'}>
          {order.transportType}
        </Badge>,
        order.portOfOriginCode,
        order.portOfDestinationCode,
        order.shipName,
        <Text style={{ fontStyle: 'italic', opacity: 0.7 }}>
          {order.ets || 'N/A'}
        </Text>,
        <Text style={{ fontStyle: 'italic', opacity: 0.7 }}>
          {order.ats || 'N/A'}
        </Text>,
        <Text style={{ fontStyle: 'italic', opacity: 0.7 }}>
          {order.eta || 'N/A'}
        </Text>,
        <Text style={{ fontStyle: 'italic', opacity: 0.7 }}>
          {order.ata || 'N/A'}
        </Text>,
      ]);

    return { head, body };
  };

  return (
    <>
      <Table
        className={styles.orderListTable}
        data={transformOrdersToTableData()}
      />
      <Group style={{ justifyContent: 'center', marginTop: '1rem' }}>
        <Pagination
          total={Math.ceil(orders.length / pageSize)}
          value={activePage}
          onChange={page => setPage(page)}
        />
      </Group>
    </>
  );
};
