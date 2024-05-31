import { Divider, Select, Title, Button, TextInput } from '@mantine/core';
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
  customerReferenceNumber: string;
  transportType: OrderTransportType;
  orderType: 'BULK' | 'CONTAINER';
  portOfOriginCode: string;
  portOfDestinationCode: string;
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
      customerReferenceNumber: '',
      transportType: 'IMPORT',
      orderType: 'BULK',
      portOfOriginCode: '',
      portOfDestinationCode: DEFAULT_PORT_CODE,
    },
    validate: {
      customerReferenceNumber: value =>
        !value && t('newOrderPage:orderForm:customerReferenceNumber:error'),
      transportType: value =>
        !value && t('newOrderPage:orderForm:transportType:error'),
      orderType: value => !value && t('newOrderPage:orderForm:orderType:error'),
      portOfDestinationCode: value =>
        !value && t('newOrderPage:orderForm:portDestinationCode:error'),
      portOfOriginCode: value =>
        !value && t('newOrderPage:orderForm:portOriginCode:error'),
    },
    validateInputOnBlur: true,
  });

  newOrderForm.watch('transportType', ({ value }) => {
    if (value === 'IMPORT') {
      newOrderForm.setFieldValue(
        'portOfOriginCode',
        newOrderForm.getValues().portOfDestinationCode
      );
      newOrderForm.setFieldValue('portOfDestinationCode', DEFAULT_PORT_CODE);
    } else {
      newOrderForm.setFieldValue(
        'portOfDestinationCode',
        newOrderForm.getValues().portOfOriginCode
      );
      newOrderForm.setFieldValue('portOfOriginCode', DEFAULT_PORT_CODE);
    }
  });

  newOrderForm.watch('orderType', () => {
    setProducts([]);
  });

  const handleAddProduct = () => {
    openModal(
      <NewProductModal
        onSubmit={product => {
          setProducts(s => [...s, product]);
        }}
        showContainerFields={newOrderForm.values.orderType === 'CONTAINER'}
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
          <TextInput
            label={t('newOrderPage:orderForm:customerReferenceNumber:title')}
            description={t(
              'newOrderPage:orderForm:customerReferenceNumber:description'
            )}
            placeholder={t(
              'newOrderPage:orderForm:customerReferenceNumber:placeholder'
            )}
            required
            {...newOrderForm.getInputProps('customerReferenceNumber')}
          />
          <div className={styles.double}>
            <Select
              label={t('newOrderPage:orderForm:transportType:title')}
              description={t(
                'newOrderPage:orderForm:transportType:description'
              )}
              placeholder={t(
                'newOrderPage:orderForm:transportType:placeholder'
              )}
              data={['IMPORT', 'EXPORT']}
              required
              clearable={false}
              allowDeselect={false}
              {...newOrderForm.getInputProps('transportType')}
            />
            <Select
              label={t('newOrderPage:orderForm:orderType:title')}
              description={t('newOrderPage:orderForm:orderType:description')}
              placeholder={t('newOrderPage:orderForm:orderType:placeholder')}
              data={['BULK', 'CONTAINER']}
              required
              clearable={false}
              allowDeselect={false}
              {...newOrderForm.getInputProps('orderType')}
            />
          </div>
          <div className={styles.double}>
            <PortcodesSelector
              label={t('newOrderPage:orderForm:portOriginCode:title')}
              description={t(
                'newOrderPage:orderForm:portOriginCode:description'
              )}
              placeholder={t(
                'newOrderPage:orderForm:portOriginCode:placeholder'
              )}
              required={newOrderForm.values.transportType === 'IMPORT'}
              disabled={newOrderForm.values.transportType !== 'IMPORT'}
              {...newOrderForm.getInputProps('portOfOriginCode')}
            />
            <PortcodesSelector
              label={t('newOrderPage:orderForm:portDestinationCode:title')}
              description={t(
                'newOrderPage:orderForm:portDestinationCode:description'
              )}
              placeholder={t(
                'newOrderPage:orderForm:portDestinationCode:placeholder'
              )}
              required={newOrderForm.values.transportType === 'EXPORT'}
              disabled={newOrderForm.values.transportType !== 'EXPORT'}
              {...newOrderForm.getInputProps('portOfDestinationCode')}
            />
          </div>
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
