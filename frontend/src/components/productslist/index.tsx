import type { FC } from 'react';
import styles from './styles/productslist.module.scss';
import type { Product } from '@/types/api';
import { Divider, Title } from '@mantine/core';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../iconbutton';
import { IconPlus } from '@tabler/icons-react';
import { ProductCard } from './components/ProductCard';

type Props = {
  className?: string;
  products: Product[];
  onAddProduct?: () => void;
  onRemoveProduct?: (idx: number) => void;
  onEditProduct?: (idx: number) => void;
};

export const ProductsList: FC<Props> = props => {
  const { t } = useTranslation();

  return (
    <div className={classNames(styles.products_list, props.className)}>
      <div className={styles.header}>
        <Title order={3}>{t('productsList:title')}</Title>
        {props.onAddProduct !== undefined && (
          <IconButton
            icon={<IconPlus />}
            tooltipKey='productsList:tooltips:add'
            onClick={props.onAddProduct}
          />
        )}
      </div>
      <Divider />
      <div className={styles.list}>
        {props.products.map((product, idx) => (
          <ProductCard
            key={`product_${product.hsCode}_${idx}`}
            product={product}
            onRemove={
              props.onRemoveProduct !== undefined
                ? () => {
                    props.onRemoveProduct?.(idx);
                  }
                : undefined
            }
            onEdit={
              props.onEditProduct !== undefined
                ? () => {
                    props.onEditProduct?.(idx);
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};
