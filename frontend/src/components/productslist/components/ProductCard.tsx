import type { Product } from '@/types/api';
import type { FC } from 'react';
import styles from '../styles/productslist.module.scss';
import { Divider, Paper, Title } from '@mantine/core';
import { IconButton } from '@/components/iconbutton';
import { IconListItem } from '@/components/iconlistitem';
import {
  IconScan,
  IconStack2,
  IconWeight,
  IconTrash,
  IconForms,
  IconRuler2,
  IconContainer,
  IconEdit,
} from '@tabler/icons-react';
import { PRODUCT_CONTAINER_TYPES } from '@/constants';

type Props = {
  product: Product;
  onRemove?: () => void;
  onEdit?: () => void;
};

export const ProductCard: FC<Props> = props => {
  return (
    <Paper className={styles.product_card}>
      <div className={styles.header}>
        <Title order={4}>{props.product.name}</Title>
        <div className={styles.actions}>
          {props.onRemove !== undefined && (
            <IconButton
              icon={<IconTrash />}
              tooltipKey='productsList:tooltips:remove'
              onClick={props.onRemove}
            ></IconButton>
          )}
          {props.onEdit !== undefined && (
            <IconButton
              icon={<IconEdit />}
              tooltipKey='productsList:tooltips:edit'
              onClick={props.onEdit}
            ></IconButton>
          )}
        </div>
      </div>
      <Divider my='xs' />
      <div className={styles.body}>
        <div className={styles.info}>
          <IconListItem
            icon={IconScan}
            text={props.product.hsCode}
          />
          <IconListItem
            icon={IconStack2}
            text={`${props.product.quantity}x`}
          />
          <IconListItem
            icon={IconWeight}
            text={`${props.product.weight} kg`}
          />
        </div>
        {props.product.containerNumber !== null && (
          <>
            <Divider orientation='vertical' />
            <div className={styles.info}>
              <IconListItem
                icon={IconForms}
                text={props.product.containerNumber}
              />
              <IconListItem
                icon={IconRuler2}
                text={`${props.product.containerSize} ft`}
              />
              <IconListItem
                icon={IconContainer}
                text={PRODUCT_CONTAINER_TYPES[props.product.containerType]}
              />
            </div>
          </>
        )}
      </div>
    </Paper>
  );
};
