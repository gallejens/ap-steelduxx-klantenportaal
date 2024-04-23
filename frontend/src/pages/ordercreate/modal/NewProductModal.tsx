import { Modal } from '@/components/modals';
import {
  Button,
  Checkbox,
  Divider,
  NumberInput,
  Select,
  TextInput,
} from '@mantine/core';
import { type FC } from 'react';
import styles from '../styles/orderCreate.module.scss';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import {
  type Product,
  type ProductContainerSize,
  type ProductContainerType,
} from '@/types/api';
import { useModalStore } from '@/stores/useModalStore';
import { PRODUCT_CONTAINER_SIZES, PRODUCT_CONTAINER_TYPES } from '../constants';

type NewProductModalProps = {
  onSubmit: (newProduct: Product) => void;
};

type NewProductFormValues = {
  hsCode: string;
  name: string;
  quantity: number;
  weight: number;
  isContainerProduct: boolean;
  containerNumber: string;
  containerSize: string;
  containerType: string;
};

export const NewProductModal: FC<NewProductModalProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const { closeModal } = useModalStore();

  const newProductForm = useForm<NewProductFormValues>({
    initialValues: {
      hsCode: '',
      name: '',
      quantity: 0,
      weight: 0,
      isContainerProduct: false,
      containerNumber: '',
      containerSize: '',
      containerType: '',
    },
    validate: {
      hsCode: value =>
        !value ? t('newOrderPage:productForm:hsCode:hsCodeInputError') : null,
      name: value =>
        !value ? t('newOrderPage:productForm:item:itemInputError') : null,
      quantity: value =>
        !value
          ? t('newOrderPage:productForm:quantity:quantityInputError')
          : null,
      weight: value =>
        !value ? t('newOrderPage:productForm:weight:weightInputError') : null,
      containerNumber: (value, { isContainerProduct }) =>
        !value && isContainerProduct
          ? t('newOrderPage:productForm:container:number:numberInputError')
          : null,
      containerSize: (value, { isContainerProduct }) =>
        !value && isContainerProduct
          ? t('newOrderPage:productForm:container:size:sizeInputError')
          : null,
      containerType: (value, { isContainerProduct }) =>
        !value && isContainerProduct
          ? t('newOrderPage:productForm:container:type:typeInputError')
          : null,
    },
  });

  const handleSubmit = (values: NewProductFormValues) => {
    const newProduct: Product = {
      hsCode: values.hsCode,
      name: values.name,
      quantity: values.quantity,
      weight: values.weight,
      ...(values.isContainerProduct
        ? {
            containerNumber: values.containerNumber,
            containerSize: values.containerSize as ProductContainerSize,
            containerType: values.containerType as ProductContainerType,
          }
        : {
            containerNumber: null,
            containerSize: null,
            containerType: null,
          }),
    };

    onSubmit(newProduct);
    closeModal();
  };

  return (
    <Modal
      title={t('newOrderPage:productForm:ProductInputTitle')}
      size='55rem'
    >
      <form
        className={styles.product_form}
        onSubmit={newProductForm.onSubmit(handleSubmit)}
      >
        <div>
          <TextInput
            label={t('newOrderPage:productForm:hsCode:hsCodeInputDescription')}
            placeholder={t(
              'newOrderPage:productForm:hsCode:hsCodeInputPlaceholder'
            )}
            required
            {...newProductForm.getInputProps('hsCode')}
          />
          <TextInput
            label={t('newOrderPage:productForm:name:nameInputDescription')}
            placeholder={t(
              'newOrderPage:productForm:name:nameInputPlaceholder'
            )}
            required
            {...newProductForm.getInputProps('name')}
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
            required
            hideControls
            allowNegative={false}
            allowDecimal={false}
            {...newProductForm.getInputProps('quantity')}
          />
          <NumberInput
            label={t('newOrderPage:productForm:weight:weightInputDescription')}
            placeholder={t(
              'newOrderPage:productForm:weight:weightInputPlaceholder'
            )}
            required
            hideControls
            allowNegative={false}
            allowDecimal={false}
            {...newProductForm.getInputProps('weight')}
          />
        </div>
        <Divider />
        <div>
          <Checkbox
            size='md'
            label={t(
              'newOrderPage:productForm:checkBoxContainer:checkBoxLabel'
            )}
            {...newProductForm.getInputProps('isContainerProduct')}
          />
          {newProductForm.values.isContainerProduct && (
            <TextInput
              label={t(
                'newOrderPage:productForm:container:number:numberInputDescription'
              )}
              placeholder={t(
                'newOrderPage:productForm:container:number:numberInputPlaceholder'
              )}
              {...newProductForm.getInputProps('containerNumber')}
            />
          )}
        </div>
        {newProductForm.values.isContainerProduct && (
          <div>
            <Select
              label={t(
                'newOrderPage:productForm:container:size:sizeInputDescription'
              )}
              placeholder={t(
                'newOrderPage:productForm:container:size:sizeInputPlaceholder'
              )}
              data={PRODUCT_CONTAINER_SIZES}
              withAsterisk
              {...newProductForm.getInputProps('containerSize')}
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
              withAsterisk
              {...newProductForm.getInputProps('containerType')}
            />
          </div>
        )}
        <div className={styles.confirm_button}>
          <Button type='submit'>
            {t('newOrderPage:productForm:addProductButton')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
