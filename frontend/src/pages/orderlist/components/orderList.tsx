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

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
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

  const paginatedOrders = chunk(orders, pageSize);

  const rows = paginatedOrders[activePage - 1]?.map(order => (
    <tr key={order.referenceNumber}>
      <td>{order.referenceNumber}</td>
      <td>{order.customerReferenceNumber}</td>
      <td>
        <Badge color={getStateColor(order.state)}>{order.state}</Badge>
      </td>
      <td>
        <Badge color={order.transportType === 'IMPORT' ? 'blue' : 'pink'}>
          {order.transportType}
        </Badge>
      </td>
      <td>{order.portOfOriginCode}</td>
      <td>{order.portOfDestinationCode}</td>
      <td>{order.shipName}</td>
      <td>
        <Text style={{ fontStyle: 'italic', opacity: 0.7 }}>
          {order.ets || 'N/A'}
        </Text>
      </td>
      <td>
        <Text style={{ fontStyle: 'italic', opacity: 0.7 }}>
          {order.ats || 'N/A'}
        </Text>
      </td>
      <td>
        <Text style={{ fontStyle: 'italic', opacity: 0.7 }}>
          {order.eta || 'N/A'}
        </Text>
      </td>
      <td>
        <Text style={{ fontStyle: 'italic', opacity: 0.7 }}>
          {order.ata || 'N/A'}
        </Text>
      </td>
    </tr>
  ));

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

  return (
    <>
      <Table
        className={styles.orderListTable}
        striped
        highlightOnHover
      >
        <thead>
          <tr>
            <th>Reference Number</th>
            <th>Customer Reference Number</th>
            <th>State</th>
            <th>Transport Type</th>
            <th>Port of Origin</th>
            <th>Port of Destination</th>
            <th>Ship Name</th>
            <th>ETS</th>
            <th>ATS</th>
            <th>ETA</th>
            <th>ATA</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Group style={{ justifyContent: 'center', marginTop: '1rem' }}>
        <Pagination
          total={paginatedOrders.length}
          value={activePage}
          onChange={page => setPage(page)}
        />
      </Group>
    </>
  );
};
