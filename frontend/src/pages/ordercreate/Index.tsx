import { ActionIcon, Button, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type Product, type OrderTransportType } from '@/types/api';
import { ConfirmModal } from '@/components/modals';
import { useModalStore } from '@/stores/useModalStore';
import styles from './styles/orderCreate.module.scss';
import { Table } from '@/components/table';
import { IconTrash } from '@tabler/icons-react';
import { NewProductModal } from './modal/NewProductModal';
import { notifications } from '@/components/notifications';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { useNavigate } from '@tanstack/react-router';
import { DEFAULT_PORT_CODE } from './constants';

type NewOrderFormValues = {
  transportType: OrderTransportType;
  portOfDestinationCode: string;
  portOfOriginCode: string;
};

export const OrderCreatePage: FC = () => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  const newOrderForm = useForm<NewOrderFormValues>({
    initialValues: {
      transportType: 'IMPORT',
      portOfDestinationCode: DEFAULT_PORT_CODE,
      portOfOriginCode: '',
    },
    validate: {
      transportType: value =>
        !value
          ? t('newOrderPage:orderForm:transportType:transportTypeInputError')
          : null,
      portOfDestinationCode: value =>
        !value || value.length !== 5
          ? t(
              'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputError'
            )
          : null,
      portOfOriginCode: value =>
        !value || value.length !== 5
          ? t('newOrderPage:orderForm:portOriginCode:portOriginCodeInputError')
          : null,
    },
    validateInputOnBlur: true,
  });

  newOrderForm.watch('transportType', ({ value }) => {
    if (value === 'IMPORT') {
      newOrderForm.setFieldValue('portOfDestinationCode', DEFAULT_PORT_CODE);
      newOrderForm.setFieldValue('portOfOriginCode', '');
    } else {
      newOrderForm.setFieldValue('portOfDestinationCode', '');
      newOrderForm.setFieldValue('portOfOriginCode', DEFAULT_PORT_CODE);
    }
  });

  const openProductModal = () => {
    openModal(
      <NewProductModal
        onSubmit={product => {
          setProducts(s => [...s, product]);
        }}
      />
    );
  };

  const deleteProduct = (index: number) => {
    setProducts(s => s.filter((_, i) => i !== index));
  };

  const handleCreateOrderRequestButton = async (values: NewOrderFormValues) => {
    const result = await doApiAction<GenericAPIResponse<{ message: string }>>({
      endpoint: '/orders/new',
      method: 'POST',
      body: {
        transportType: values.transportType,
        portOfOriginCode: values.portOfOriginCode,
        portOfDestinationCode: values.portOfDestinationCode,
        products,
      },
    });

    notifications.add({
      message: t(result?.message ?? 'notifications:genericError'),
      autoClose: 5000,
    });

    if (result?.message === 'newOrderPage:success') {
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
            required
            searchable
            clearable={false}
            allowDeselect={false}
            {...newOrderForm.getInputProps('transportType')}
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
              newOrderForm.values.transportType === 'IMPORT'
                ? t(
                    'newOrderPage:orderForm:portOriginCode:portOriginCodeInputPlaceholder'
                  )
                : t(
                    'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputPlaceholder'
                  )
            }
            maxLength={5}
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
                {
                  key: 'containerType',
                },
                {
                  key: 'actions',
                  emptyHeader: true,
                  disallowSorting: true,
                  disableResizing: true,
                },
              ]}
              data={products.map((p, index) => ({
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
