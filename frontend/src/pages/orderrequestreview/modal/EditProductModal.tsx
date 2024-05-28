import { type FC } from 'react';
import { Modal } from '../../../components/modals';
import { useTranslation } from 'react-i18next';
import { Button, Divider, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import styles from '../styles/editproductmodal.module.scss';
import { doApiAction } from '@/lib/api';
import type { Product } from '@/types/api';
import {
  PRODUCT_CONTAINER_SIZES,
  PRODUCT_CONTAINER_TYPES,
} from '@/pages/ordercreate/constants';
import { notifications } from '@/components/notifications/lib';
import { useQueryClient } from '@tanstack/react-query';

type EditProductValues = {
  quantity: number;
  weight: number;
  containerNumber: string;
  containerSize: string;
  containerType: string;
};

export const EditProductModal: FC<{
  onConfirm: () => void;
  product: Product;
  orderRequestId: string;
}> = props => {
  const { t } = useTranslation();
  const client = useQueryClient();

  const editProductForm = useForm<EditProductValues>({
    initialValues: {
      quantity: props.product.quantity,
      weight: props.product.weight,
      containerNumber: props.product.containerNumber ?? '',
      containerSize: props.product.containerSize?.replace('SIZE_', '') ?? '',
      containerType: props.product.containerType ?? '',
    },
    validate: {
      quantity: value =>
        !value
          ? t('newOrderPage:productForm:quantity:quantityInputError')
          : null,
      weight: value =>
        !value ? t('newOrderPage:productForm:weight:weightInputError') : null,
      containerSize: value =>
        !value && props.product.containerSize
          ? t('newOrderPage:productForm:container:size:sizeInputError')
          : null,
      containerType: value =>
        !value && props.product.containerType
          ? t('newOrderPage:productForm:container:type:typeInputError')
          : null,
    },
  });

  const isContainerProduct =
    props.product.containerNumber !== null ||
    props.product.containerSize !== null ||
    props.product.containerType !== null;

  const handleSubmit = async (values: EditProductValues) => {
    if (!isContainerProduct) {
      const resultNonContainerProduct = await doApiAction({
        endpoint: `order-requests/${props.orderRequestId}/product/edit`,
        method: 'PUT',
        body: {
          quantity: values.quantity,
          weight: values.weight,
        },
      });

      notifications.add({
        message: t(
          resultNonContainerProduct?.message ?? 'notifications:genericError'
        ),
        autoClose: 10000,
      });
    } else {
      const resultContainerProduct = await doApiAction({
        endpoint: `order-requests/${props.orderRequestId}/product/edit`,
        method: 'PUT',
        body: {
          quantity: values.quantity,
          weight: values.weight,
          containerNumber: values.containerNumber,
          containerSize: values.containerSize,
          containerType: values.containerType,
        },
      });

      notifications.add({
        message: t(
          resultContainerProduct?.message ?? 'notifications:genericError'
        ),
        autoClose: 10000,
      });
    }

    client.invalidateQueries({ queryKey: ['orderRequestValue'] });

    props.onConfirm();
  };

  return (
    <Modal
      title={t('orderRequestReviewPage:editProductModal:title')}
      className={styles.edit_product_modal}
      size={'55rem'}
    >
      <form
        className={styles.product_form}
        onSubmit={editProductForm.onSubmit(values => handleSubmit(values))}
      >
        <div>
          <TextInput
            className={styles.hsCode_field}
            label={t('newOrderPage:productForm:hsCode:hsCodeInputDescription')}
            placeholder={t(
              'newOrderPage:productForm:hsCode:hsCodeInputPlaceholder'
            )}
            value={props.product.hsCode}
            disabled
          />
          <TextInput
            label={t('newOrderPage:productForm:name:nameInputDescription')}
            placeholder={t(
              'newOrderPage:productForm:name:nameInputPlaceholder'
            )}
            value={props.product.name}
            disabled
          />
        </div>
        <div>
          <NumberInput
            label={t(
              'newOrderPage:productForm:quantity:quantityInputDescription'
            )}
            placeholder={t(
              'newOrderPage:productForm:quantity:quantityInputPlaceholder'
            )}
            hideControls
            allowNegative={false}
            allowDecimal={false}
            required
            {...editProductForm.getInputProps('quantity')}
          />
          <NumberInput
            label={t('newOrderPage:productForm:weight:weightInputDescription')}
            placeholder={t(
              'newOrderPage:productForm:weight:weightInputPlaceholder'
            )}
            hideControls
            allowNegative={false}
            allowDecimal={false}
            required
            {...editProductForm.getInputProps('weight')}
          />
        </div>
        {isContainerProduct && <Divider />}
        <div>
          {isContainerProduct && (
            <TextInput
              label={t(
                'newOrderPage:productForm:container:number:numberInputDescription'
              )}
              placeholder={t(
                'newOrderPage:productForm:container:number:numberInputPlaceholder'
              )}
              required={isContainerProduct}
              {...editProductForm.getInputProps('containerNumber')}
            />
          )}
        </div>
        {isContainerProduct && (
          <div>
            <Select
              label={t(
                'newOrderPage:productForm:container:size:sizeInputDescription'
              )}
              placeholder={t(
                'newOrderPage:productForm:container:size:sizeInputPlaceholder'
              )}
              data={PRODUCT_CONTAINER_SIZES}
              allowDeselect={false}
              {...editProductForm.getInputProps('containerSize')}
            />
            <Select
              label={t(
                'newOrderPage:productForm:container:type:typeInputDescription'
              )}
              placeholder={t(
                'newOrderPage:productForm:container:type:typeInputPlaceholder'
              )}
              data={Object.entries(PRODUCT_CONTAINER_TYPES).reduce<
                { value: string; label: string }[]
              >((acc, [key, value]) => {
                acc.push({ value: key, label: value });
                return acc;
              }, [])}
              allowDeselect={false}
              {...editProductForm.getInputProps('containerType')}
            />
          </div>
        )}
        <div className={styles.confirm_button}>
          <Button
            type='submit'
            disabled={!editProductForm.isDirty()}
          >
            {t('orderRequestReviewPage:editProductModal:confirmButton')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
