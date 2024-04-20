import { ActionIcon, Button, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type OrderRequest } from '@/types/orderrequest';
import { Product, type OrderTransportType } from '@/types/api';
import { ConfirmModal } from '@/components/modals';
import { useModalStore } from '@/stores/useModalStore';
import styles from './styles/orderCreate.module.scss';
import { Table } from '@/components/table';
import { IconTrash } from '@tabler/icons-react';
import { NewProductModal } from './modal/NewProductModal';
import { notifications } from '@/components/notifications';
import { doApiAction, GenericAPIResponse } from '@/lib/api';
import { useNavigate } from '@tanstack/react-router';

type Props = {
  onSubmit?: () => void;
  onSuccess?: () => void;
};

export const OrderCreatePage: FC<Props> = props => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();
  const [transportType, setTransportType] = useState('');
  const navigate = useNavigate();

  const newOrderForm = useForm<OrderRequest.OrderRequestValue>({
    initialValues: {
      transportType: '' as OrderTransportType,
      portOfDestinationCode: '',
      portOfOriginCode: '',
      products: [],
    },
    validate: {
      transportType: value => {
        if (!value) {
          return t(
            'newOrderPage:orderForm:transportType:transportTypeInputError'
          );
        }
      },
      portOfDestinationCode: value => {
        if (!value || value.length !== 5) {
          return t(
            'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputError'
          );
        }
      },
      portOfOriginCode: value => {
        if (!value || value.length !== 5) {
          return t(
            'newOrderPage:orderForm:portOriginCode:portOriginCodeInputError'
          );
        }
      },
    },
    validateInputOnBlur: true,
  });

  const openProductModal = () => {
    openModal(<NewProductModal onSubmit={handleNewProductSubmit} />);
  };

  const handleTransportTypeChange = (value: string | null) => {
    if (value === 'IMPORT') {
      newOrderForm.setFieldValue('portOfDestinationCode', 'BEANR');
      newOrderForm.setFieldValue('portOfOriginCode', '');
      newOrderForm.setFieldValue('transportType', 'IMPORT');
      setTransportType(value);
    } else {
      newOrderForm.setFieldValue('portOfDestinationCode', '');
      newOrderForm.setFieldValue('portOfOriginCode', 'BEANR');
      newOrderForm.setFieldValue('transportType', 'EXPORT');
    }
  };

  const handleNewProductSubmit = (newProduct: Product) => {
    newOrderForm.setFieldValue('products', [
      ...newOrderForm.values.products,
      newProduct,
    ]);
  };

  const deleteProduct = (index: number) => {
    const updatedProducts = newOrderForm.values.products.filter(
      (_, i) => i !== index
    );
    newOrderForm.setFieldValue('products', updatedProducts);
  };

  const handleCreateOrderRequestButton = async (
    values: OrderRequest.OrderRequestValue
  ) => {
    if (!newOrderForm.isValid()) {
      notifications.add({
        title: t('notifications: genericError'),
        message: t('notifications:invalidForm'),
        color: 'red',
      });
      return;
    }

    const result = await doApiAction<GenericAPIResponse<{ message: string }>>({
      endpoint: '/orders/new',
      method: 'POST',
      body: {
        transportType: values.transportType,
        portOfOriginCode: values.portOfOriginCode,
        portOfDestinationCode: values.portOfDestinationCode,
        products: values.products,
      },
    });

    notifications.add({
      message: t(result?.message ?? 'notifications:genericError'),
      autoClose: 5000,
    });

    props.onSubmit?.();

    if (result?.message === 'newOrderPage:success') {
      props.onSuccess?.();
      navigate({ to: '/app/orders' });
    }
  };

  return (
    <div>
      <form
        className={styles.order_form}
        onSubmit={newOrderForm.onSubmit(values =>
          openModal(
            <ConfirmModal
              title={t('appshell:newOrderConfirmation:newOrderConfirmTitle')}
              text={t('appshell:newOrderConfirmation:newOrderConfirmText')}
              onConfirm={() => {
                closeModal();
                handleCreateOrderRequestButton(values);
              }}
            />
          )
        )}
      >
        <div className={styles.form_field_order}>
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
            label={t(
              'newOrderPage:orderForm:portOriginCode:portOriginCodeInputTitle'
            )}
            description={t(
              'newOrderPage:orderForm:portOriginCode:portOriginCodeInputDescription'
            )}
            placeholder={
              transportType === 'IMPORT'
                ? t(
                    'newOrderPage:orderForm:portOriginCode:portOriginCodeInputPlaceholder'
                  )
                : t(
                    'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputPlaceholder'
                  )
            }
            maxLength={5}
            value={newOrderForm.values.portOfOriginCode}
            required
            {...newOrderForm.getInputProps('portOfOriginCode')}
          />
          <TextInput
            className={styles.input_field_order}
            label={t(
              'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputTitle'
            )}
            description={t(
              'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputDescription'
            )}
            placeholder={t(
              'newOrderPage:orderForm:portOriginCode:portOriginCodeInputPlaceholder'
            )}
            maxLength={5}
            value={newOrderForm.values.portOfDestinationCode}
            required
            {...newOrderForm.getInputProps('portOfDestinationCode')}
          />
        </div>
        <div className={styles.addProduct_button}>
          <Button
            onClick={openProductModal}
            fullWidth
          >
            {t('newOrderPage:productForm:addProductButton')}
          </Button>
        </div>

        <div className={styles.list_column}>
          <h1 className={styles.list_title}>
            {t('newOrderPage:productListTitle')}
          </h1>
          <div className={styles.list_product}>
            <Table
              columns={[
                {
                  key: 'hsCode',
                },
                {
                  key: 'name',
                  initialWidth: 300,
                },
                {
                  key: 'quantity',
                },
                {
                  key: 'weight',
                  initialWidth: 200,
                },
                {
                  key: 'containerNumber',
                  initialWidth: 200,
                },
                {
                  key: 'containerSize',
                  initialWidth: 200,
                },
                { key: 'containerType' },
                {
                  key: 'actions',
                  emptyHeader: true,
                  disallowSorting: true,
                  disableResizing: true,
                },
              ]}
              data={newOrderForm.values.products.map((p, index) => ({
                ...p,
                actions: (
                  <ActionIcon onClick={() => deleteProduct(index)}>
                    <IconTrash />
                  </ActionIcon>
                ),
              }))}
              translationKey={'newOrderPage:table'}
            ></Table>
          </div>
          <div className={styles.addOrder_button_container}>
            <Button
              className={styles.button}
              type='submit'
            >
              {t('newOrderPage:addOrderButton')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
