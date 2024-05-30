import { Divider, Select, Title, Button, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type Product,
  type OrderTransportType,
  type OrderDocumentType,
} from '@/types/api';
import { ConfirmModal } from '@/components/modals';
import { useModalStore } from '@/stores/useModalStore';
import styles from './styles/orderCreate.module.scss';
import { notifications } from '@/components/notifications';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { useNavigate } from '@tanstack/react-router';
import { DEFAULT_PORT_CODE } from './constants';
import { PortcodesSelector } from '@/components/portcodesselector';
import { OrderDocuments } from '@/components/orderdocuments';
import { transformDocumentsToFileNames } from './helpers';
import { ProductsList } from '@/components/productslist';
import { NewProductModal } from './modal/NewProductModal';

type NewOrderFormValues = {
  transportType: OrderTransportType;
  portOfDestinationCode: string;
  portOfOriginCode: string;
  isContainerOrder: boolean;
};

export const OrderCreatePage: FC = () => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [documents, setDocuments] = useState<
    Record<OrderDocumentType, File | null>
  >({ bl: null, packing: null, customs: null });
  const [loading, setLoading] = useState(false);

  const newOrderForm = useForm<NewOrderFormValues>({
    initialValues: {
      transportType: 'IMPORT',
      portOfDestinationCode: DEFAULT_PORT_CODE,
      portOfOriginCode: '',
      isContainerOrder: false,
    },
    validate: {
      transportType: value =>
        !value &&
        t('newOrderPage:orderForm:transportType:transportTypeInputError'),
      portOfDestinationCode: value =>
        !value &&
        t(
          'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputError'
        ),
      portOfOriginCode: value =>
        !value &&
        t('newOrderPage:orderForm:portOriginCode:portOriginCodeInputError'),
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

  newOrderForm.watch('isContainerOrder', () => {
    setProducts([]);
  });

  const handleAddProduct = () => {
    openModal(
      <NewProductModal
        onSubmit={product => {
          setProducts(s => [...s, product]);
        }}
        isContainerOrder={newOrderForm.values.isContainerOrder}
      />
    );
  };

  const handleRemoveProduct = (idx: number) => {
    setProducts(s => s.filter((_, i) => i !== idx));
  };

  const handleCreateOrderRequestButton = () => {
    if (products.length === 0) {
      notifications.add({
        message: t('newOrderPage:emptyProducts'),
        autoClose: 10000,
      });
      return;
    }

    openModal(
      <ConfirmModal
        title={t('appshell:newOrderConfirmation:newOrderConfirmTitle')}
        text={t('appshell:newOrderConfirmation:newOrderConfirmText')}
        onConfirm={() => {
          closeModal();
          createOrder();
        }}
      />
    );
  };

  const createOrder = async () => {
    if (!newOrderForm.isValid()) {
      newOrderForm.validate();
      notifications.add({
        title: t('notifications:genericError'),
        message: t('notifications:invalidForm'),
        autoClose: 10000,
      });
      return;
    }

    setLoading(true);
    const result = await doApiAction<GenericAPIResponse<number>>({
      endpoint: '/order-requests/new',
      method: 'POST',
      body: {
        ...newOrderForm.values,
        products,
      },
    });

    const createdOrderRequest = !!result?.data;
    if (!createdOrderRequest) {
      setLoading(false);
      notifications.add({
        message: t(result?.message ?? 'notifications:genericError'),
        autoClose: 10000,
      });
      return;
    }

    for (const [type, file] of Object.entries(documents)) {
      if (!file) continue;

      const formData = new FormData();
      formData.set('orderRequestId', result.data.toString());
      formData.set('file', file);
      formData.set('type', type);

      await doApiAction({
        endpoint: '/order-requests/upload-file',
        method: 'POST',
        body: formData,
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
    }

    setLoading(false);
    notifications.add({
      message: t(result.message),
      autoClose: 10000,
    });

    if (result?.message === 'newOrderPage:success') {
      navigate({ to: '/app/orders' });
    }
  };

  return (
    <div className={styles.ordercreate_page}>
      <div className={styles.inputs}>
        <Title order={3}>{t('newOrderPage:title')}</Title>
        <form className={styles.form}>
          <Select
            label={t(
              'newOrderPage:orderForm:transportType:transportTypeInputTitle'
            )}
            description={t(
              'newOrderPage:orderForm:transportType:transportTypeInputDescription'
            )}
            placeholder={t(
              'newOrderPage:orderForm:transportType:transportTypeInputPlaceholder'
            )}
            data={['IMPORT', 'EXPORT']}
            required
            searchable
            clearable={false}
            allowDeselect={false}
            {...newOrderForm.getInputProps('transportType')}
          />
          <PortcodesSelector
            label={t(
              'newOrderPage:orderForm:portOriginCode:portOriginCodeInputTitle'
            )}
            description={t(
              'newOrderPage:orderForm:portOriginCode:portOriginCodeInputDescription'
            )}
            placeholder={t(
              'newOrderPage:orderForm:portOriginCode:portOriginCodeInputPlaceholder'
            )}
            required={newOrderForm.values.transportType === 'IMPORT'}
            disabled={newOrderForm.values.transportType !== 'IMPORT'}
            {...newOrderForm.getInputProps('portOfOriginCode')}
          />
          <PortcodesSelector
            label={t(
              'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputTitle'
            )}
            description={t(
              'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputDescription'
            )}
            placeholder={t(
              'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputPlaceholder'
            )}
            required={newOrderForm.values.transportType === 'EXPORT'}
            disabled={newOrderForm.values.transportType !== 'EXPORT'}
            {...newOrderForm.getInputProps('portOfDestinationCode')}
          />
          <Checkbox
            size='md'
            label={t('newOrderPage:orderForm:checkBoxContainer:checkBoxLabel')}
            {...newOrderForm.getInputProps('isContainerOrder')}
          />
        </form>
        <Divider />
        <OrderDocuments
          className={styles.documents}
          documents={transformDocumentsToFileNames(documents)}
          onSelect={(type, file) => setDocuments(s => ({ ...s, [type]: file }))}
          onDelete={type => setDocuments(s => ({ ...s, [type]: null }))}
        />
        <Divider />
        <Button
          onClick={handleCreateOrderRequestButton}
          fullWidth
          loading={loading}
        >
          {t('newOrderPage:addOrderButton')}
        </Button>
      </div>
      <Divider orientation='vertical' />
      <ProductsList
        className={styles.products}
        products={products}
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
      />
    </div>
  );
};
