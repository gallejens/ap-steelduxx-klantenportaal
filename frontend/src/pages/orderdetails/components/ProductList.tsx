import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/orderDetails.module.scss';
import type { OrderDetails } from '@/types/api';
import { Title } from '@mantine/core';
import { PRODUCT_CONTAINER_TYPES } from '@/constants';

interface ProductListProps {
  orderDetail: OrderDetails;
}

export const ProductList: FC<ProductListProps> = ({ orderDetail }) => {
  const { t } = useTranslation();

  const sortedProducts = orderDetail?.products.sort((a, b) => {
    const containerTypeComparison = (a.containerType ?? '').localeCompare(
      b.containerType ?? ''
    );
    if (containerTypeComparison !== 0) {
      return containerTypeComparison;
    }
    return b.quantity - a.quantity;
  });

  return (
    <div className={styles.productsList}>
      <section>
        <Title order={3}>
          {t('orderDetailPage:products')} ({sortedProducts?.length})
        </Title>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>{t('orderDetailPage:hsCode')}</th>
                <th>{t('orderDetailPage:name')}</th>
                <th>{t('orderDetailPage:quantity')}</th>
                <th>{t('orderDetailPage:weight')}</th>
                {orderDetail?.products.some(p => p.containerNumber != null) && (
                  <th>{t('orderDetailPage:container')}</th>
                )}
                {orderDetail?.products.some(p => p.containerSize != null) && (
                  <th>{t('orderDetailPage:containerSize')}</th>
                )}
                {orderDetail?.products.some(p => p.containerType != null) && (
                  <th>{t('orderDetailPage:containerType')}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {orderDetail?.products.map((product, index: number) => (
                <tr key={index}>
                  <td>{product.hsCode}</td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.weight}</td>
                  {product.containerNumber != null && (
                    <td>{product.containerNumber}</td>
                  )}
                  {product.containerSize != null && (
                    <td>{product.containerSize} ft</td>
                  )}
                  {product.containerType != null && (
                    <td>{PRODUCT_CONTAINER_TYPES[product.containerType]}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
