import { useState, type FC } from 'react';
import { Modal } from '../../../components/modals';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  NumberInput,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import styles from '../styles/editproductmodal.module.scss';
import { doApiAction } from '@/lib/api';
import type {
  Product,
  ProductContainerSize,
  ProductContainerType,
} from '@/types/api';
import {
  PRODUCT_CONTAINER_SIZES,
  PRODUCT_CONTAINER_TYPES,
} from '@/pages/ordercreate/constants';

type EditProductValues = {
  quantity: number;
  weight: number;
  containerNumber: string;
  containerSize: ProductContainerSize;
  containerType: ProductContainerType;
};

export const EditProductModal: FC<{
  onConfirm: () => void;
  product: Product;
}> = props => {
  const { t } = useTranslation();
  const editProductForm = useForm<EditProductValues>({
    // TODO
    initialValues: {
      quantity: props.product.quantity,
      weight: props.product.weight,
      containerNumber: props.product.containerNumber ?? '',
      containerSize: '20',
      containerType: 'DV',
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
    props.product.containerNumber !== null &&
    props.product.containerSize !== null &&
    props.product.containerType !== null;
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSubmit = async (values: EditProductValues) => {
    const result = await doApiAction({
      endpoint: '/order-request/product/edit',
      method: 'PUT',
      body: {},
    });

    setResponseMessage(result?.message ?? 'failed');
    props.onConfirm();
  };

  return (
    <Modal
      title={t('orderRequestReviewPage:editProductModal:title')}
      className={styles.edit_product_modal}
      size={'55rem'}
    >
      {responseMessage === null ? (
        <form
          className={styles.product_form}
          onSubmit={editProductForm.onSubmit(values => handleSubmit(values))}
        >
          <div>
            <TextInput
              className={styles.hsCode_field}
              label={t(
                'newOrderPage:productForm:hsCode:hsCodeInputDescription'
              )}
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
              label={t(
                'newOrderPage:productForm:weight:weightInputDescription'
              )}
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
                {...editProductForm.getInputProps('containerType')}
              />
            </div>
          )}
          <div className={styles.confirm_button}>
            <Button type='submit'>
              {t('orderRequestReviewPage:editProductModal:confirmButton')}
            </Button>
          </div>
        </form>
      ) : (
        <div className={styles.response_message}>
          <Text>{t(`orderRequestReviewPage:response:${responseMessage}`)}</Text>
        </div>
      )}
    </Modal>
  );
};
