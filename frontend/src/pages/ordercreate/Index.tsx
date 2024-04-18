import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type NewOrder } from '@/types/order';
import { type Product, type OrderTransportType } from '@/types/api';
import { ConfirmModal } from '@/components/modals';
import { useModalStore } from '@/stores/useModalStore';
import styles from './styles/orderCreate.module.scss';

export const OrderCreatePage: FC = () => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();

  const { data: companyCodesResponse } = useQuery({
    queryKey: ['user-requests-review-company-codes'],
    queryFn: () =>
      doApiAction<GenericAPIResponse<string[]>>({
        endpoint: '/user-requests/company-codes',
        method: 'GET',
      }),
  });

  const companyCodes = companyCodesResponse?.data ?? [];

  const newOrderForm = useForm<NewOrder.OrderValue>({
    initialValues: {
      referenceCode: '',
      transportType: '' as OrderTransportType,
      portOfDestinationCode: '',
      products: [],
    },
    validate: {
      referenceCode: value => {
        if (!value || !companyCodes.includes(value)) {
          return t(
            'newOrderPage:orderForm:referenceCode:referenceCodeInputError'
          );
        }
      },
      transportType: value => {
        if (!value) {
          return t(
            'newOrderPage:orderForm:transportType:transportTypeInputError'
          );
        }
      },
      portOfDestinationCode: value => {
        if (!value || value.length !== 5) {
          return t('newOrderPage:orderForm:portCode:portCodeInputError');
        }
      },
    },
    validateInputOnBlur: true,
  });

  const newProductForm = useForm<Product>({
    initialValues: {
      hsCode: '',
      name: '',
      quantity: '',
      weight: '',
      containerNumber: '',
    },
    validate: {
      // Optional, check wordt gedaan bij submit --> button verplaatst als error message tevoorschijn komt
      //   hsCode: value => {
      //     if (!value) {
      //       return t('newOrderPage:productForm:hsCode:hsCodeInputError');
      //     }
      //   },
      //   name: value => {
      //     if (!value) {
      //       return t('newOrderPage:productForm:name:nameInputError');
      //     }
      //   },
      //   quantity: value => {
      //     if (!value) {
      //       return t('newOrderPage:productForm:quantity:quantityInputError');
      //     }
      //   },
    },
    validateInputOnBlur: true,
  });

  const handleTransportTypeChange = (value: string | null) => {
    if (value === 'IMPORT') {
      newOrderForm.setFieldValue('portOfDestinationCode', 'BEANR');
      newOrderForm.setFieldValue('transportType', 'IMPORT');
    } else {
      newOrderForm.setFieldValue('portOfDestinationCode', '');
      newOrderForm.setFieldValue('transportType', 'EXPORT');
    }
  };

  // Products -- List with actions: add / remove
  //    hsCode
  //    name
  //    quantity
  //    weight
  //    breakbuld / containerized??
  //    containerNumber (enkel containerized)

  return (
    <form
      className={styles.order_form}
      onSubmit={newOrderForm.onSubmit(values =>
        openModal(
          <ConfirmModal
            title={t('appshell:newOrderConfirmation:newOrderConfirmTitle')}
            text={t('appshell:newOrderConfirmation:newOrderConfirmText')}
            onConfirm={() => {
              closeModal();
              // Save Order Function
            }}
          />
        )
      )}
    >
      <div className={styles.form_field_order}>
        <Select
          className={styles.input_field_order}
          label={t(
            'newOrderPage:orderForm:referenceCode:referenceCodeInputTitle'
          )}
          description={t(
            'newOrderPage:orderForm:referenceCode:referenceCodeInputDescription'
          )}
          placeholder={t(
            'newOrderPage:orderForm:referenceCode:referenceCodeInputPlaceholder'
          )}
          data={companyCodes}
          withAsterisk
          searchable
          {...newOrderForm.getInputProps('referenceCode')}
        />
        <Select
          className={styles.input_field_order}
          label={t(
            'newOrderPage:orderForm:transportType:transportTypeInputTitle'
          )}
          description={t(
            'newOrderPage:orderForm:transportType:transportTypeInputDescription'
          )}
          placeholder={t(
            'newOrderPage:orderForm:transportType:transportTypeInputPlaceholder'
          )}
          data={[
            { label: 'IMPORT', value: 'IMPORT' },
            { label: 'EXPORT', value: 'EXPORT' },
          ]}
          withAsterisk
          searchable
          {...newOrderForm.getInputProps('transportType')}
          onChange={handleTransportTypeChange}
        />
        <TextInput
          className={styles.input_field_order}
          label={t('newOrderPage:orderForm:portCode:portCodeInputTitle')}
          description={t(
            'newOrderPage:orderForm:portCode:portCodeInputDescription'
          )}
          placeholder={t(
            'newOrderPage:orderForm:portCode:portCodeInputPlaceholder'
          )}
          maxLength={5}
          value={newOrderForm.values.portOfDestinationCode}
          required
          {...newOrderForm.getInputProps('portOfDestinationCode')}
        />
      </div>
      <form
        className={styles.product_form}
        onSubmit={newOrderForm.onSubmit(values =>
          openModal(
            <ConfirmModal
              title={t(
                'appshell:newProductConfirmation:newProductConfirmTitle'
              )}
              text={t('appshell:newProductConfirmation:newProductConfirmText')}
              onConfirm={() => {
                closeModal();
                // Save Product Function
              }}
            />
          )
        )}
      >
        <div className={styles.form_field_product}>
          <div className={styles.column1}>
            <TextInput
              className={styles.input_field_product_header}
              label={t('newOrderPage:productForm:ProductInputTitle')}
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
          <div className={styles.column2}>
            <NumberInput
              className={styles.input_field_product_quantity}
              description={t(
                'newOrderPage:productForm:quantity:quantityInputDescription'
              )}
              placeholder={t(
                'newOrderPage:productForm:quantity:quantityInputPlaceholder'
              )}
              hideControls
              allowNegative={false}
              allowDecimal={false}
              required
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
              hideControls
              allowNegative={false}
              allowDecimal={false}
              {...newProductForm.getInputProps('weight')}
            />
          </div>

          <div className={styles.column3}>
            <NumberInput
              className={styles.input_field_product_containerNumber}
              description={t(
                'newOrderPage:productForm:containerNumber:containerNumberInputDescription'
              )}
              placeholder={t(
                'newOrderPage:productForm:containerNumber:containerNumberInputPlaceholder'
              )}
              hideControls
              allowNegative={false}
              allowDecimal={false}
              {...newProductForm.getInputProps('containerNumber')}
            />
            <div className={styles.addProduct_button}>
              <Button
                type='submit'
                fullWidth
              >
                {t('newOrderPage:productForm:addProductButton')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </form>

    // Product List
  );
};
