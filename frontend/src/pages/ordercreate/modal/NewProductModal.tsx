import { Modal } from '@/components/modals';
import {
  Button,
  Checkbox,
  NumberInput,
  Select,
  TextInput,
} from '@mantine/core';
import { FC, useState } from 'react';
import styles from '../styles/orderCreate.module.scss';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

import { Product, ProductSize, ProductType } from '@/types/api';
import { useModalStore } from '@/stores/useModalStore';

interface NewProductModalProps {
  onSubmit: (newProduct: Product) => void;
}

export const NewProductModal: FC<NewProductModalProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const { closeModal } = useModalStore();
  const [checked, setChecked] = useState(true);

  const newProductForm = useForm<Product>({
    initialValues: {
      hsCode: '',
      name: '',
      quantity: '',
      weight: '',
      containerNumber: '',
      containerSize: '' as ProductSize,
      containerType: '' as ProductType,
    },
    validate: {
      hsCode: value => {
        if (!value) {
          return t('newOrderPage:productForm:hsCode:hsCodeInputError');
        }
      },
      name: value => {
        if (!value) {
          return t('newOrderPage:productForm:item:itemInputError');
        }
      },
      quantity: value => {
        if (!value) {
          return t('newOrderPage:productForm:quantity:quantityInputError');
        }
      },
      weight: value => {
        if (!value) {
          return t('newOrderPage:productForm:weight:weightInputError');
        }
      },
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = (values: Product) => {
    values.containerNumber =
      values.containerNumber === '' ? null : values.containerNumber;

    onSubmit(values);
    closeModal();
  };

  return (
    <Modal
      title={t('newOrderPage:productForm:ProductInputTitle')}
      className={styles.modal}
      size='55rem'
    >
      <form
        className={styles.product_form}
        onSubmit={newProductForm.onSubmit(handleSubmit)}
      >
        <div className={styles.row1}>
          <TextInput
            className={styles.input_field_product_hsCode}
            description={t(
              'newOrderPage:productForm:hsCode:hsCodeInputDescription'
            )}
            placeholder={t(
              'newOrderPage:productForm:hsCode:hsCodeInputPlaceholder'
            )}
            required
            {...newProductForm.getInputProps('hsCode')}
          />
          <TextInput
            className={styles.input_field_product_name}
            description={t(
              'newOrderPage:productForm:name:nameInputDescription'
            )}
            placeholder={t(
              'newOrderPage:productForm:name:nameInputPlaceholder'
            )}
            required
            {...newProductForm.getInputProps('name')}
          />
        </div>
        <div className={styles.row2}>
          <NumberInput
            className={styles.input_field_product_quantity}
            description={t(
              'newOrderPage:productForm:quantity:quantityInputDescription'
            )}
            placeholder={t(
              'newOrderPage:productForm:quantity:quantityInputPlaceholder'
            )}
            required
            value={'text'}
            hideControls
            allowNegative={false}
            allowDecimal={false}
            {...newProductForm.getInputProps('quantity')}
          />
          <NumberInput
            className={styles.input_field_product_weight}
            description={t(
              'newOrderPage:productForm:weight:weightInputDescription'
            )}
            placeholder={t(
              'newOrderPage:productForm:weight:weightInputPlaceholder'
            )}
            required
            value={'text'}
            hideControls
            allowNegative={false}
            allowDecimal={false}
            {...newProductForm.getInputProps('weight')}
          />
        </div>
        <Checkbox
          className={styles.container_checkbox}
          checked={checked}
          onChange={event => setChecked(event.currentTarget.checked)}
          size='md'
          label={t('newOrderPage:productForm:checkBoxContainer:checkBoxLabel')}
        />
        {checked && (
          <TextInput
            className={styles.input_field_product_containerNumber}
            description={t(
              'newOrderPage:productForm:container:number:numberInputDescription'
            )}
            placeholder={t(
              'newOrderPage:productForm:container:number:numberInputPlaceholder'
            )}
            {...newProductForm.getInputProps('containerNumber')}
          />
        )}
        {checked && (
          <div className={styles.input_field_product_transport_details}>
            <Select
              className={styles.input_field_product_transport_size}
              description={t(
                'newOrderPage:productForm:container:size:sizeInputDescription'
              )}
              placeholder={t(
                'newOrderPage:productForm:container:size:sizeInputPlaceholder'
              )}
              data={[
                { label: '20', value: 'SIZE_20' },
                { label: '40', value: 'SIZE_40' },
              ]}
              withAsterisk
              {...newProductForm.getInputProps('containerSize')}
            />
            <Select
              className={styles.input_field_product_transport_type}
              description={t(
                'newOrderPage:productForm:container:type:typeInputDescription'
              )}
              placeholder={t(
                'newOrderPage:productForm:container:type:typeInputPlaceholder'
              )}
              data={[
                { label: 'OT (open top)', value: 'OT' },
                { label: 'FT (flat)', value: 'FT' },
                { label: 'DV (dry van)', value: 'DV' },
                { label: 'HC (high cube)', value: 'HC' },
                { label: 'RF (reefer)', value: 'RF' },
              ]}
              withAsterisk
              {...newProductForm.getInputProps('containerType')}
            />
          </div>
        )}
        <div className={styles.confirm_button}>
          <Button type='submit'>
            {t('modals:changePassword:actionButton')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
