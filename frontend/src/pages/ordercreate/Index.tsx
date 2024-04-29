import {
  ActionIcon,
  Divider,
  Select,
  TextInput,
  Title,
  Button,
} from '@mantine/core';
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
import type { CreateOrderDocument } from './types';
import { OrderDocuments } from './components/OrderDocuments';

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
  const [documents, setDocuments] = useState<CreateOrderDocument[]>([]);
  const [loading, setLoading] = useState(false);

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

    for (const doc of documents) {
      const formData = new FormData();
      formData.set('orderRequestId', result.data.toString());
      formData.set('file', doc.file);
      formData.set('type', doc.type);

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
          <TextInput
            label={t(
              'newOrderPage:orderForm:portOriginCode:portOriginCodeInputTitle'
            )}
            description={t(
              'newOrderPage:orderForm:portOriginCode:portOriginCodeInputDescription'
            )}
            placeholder={t(
              'newOrderPage:orderForm:portOriginCode:portOriginCodeInputPlaceholder'
            )}
            maxLength={5}
            required={newOrderForm.values.transportType === 'IMPORT'}
            disabled={newOrderForm.values.transportType !== 'IMPORT'}
            {...newOrderForm.getInputProps('portOfOriginCode')}
          />
          <TextInput
            label={t(
              'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputTitle'
            )}
            description={t(
              'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputDescription'
            )}
            placeholder={t(
              'newOrderPage:orderForm:portDestinationCode:portDestinationCodeInputPlaceholder'
            )}
            maxLength={5}
            required={newOrderForm.values.transportType === 'EXPORT'}
            disabled={newOrderForm.values.transportType !== 'EXPORT'}
            {...newOrderForm.getInputProps('portOfDestinationCode')}
          />
        </form>
        <Divider />
        <div className={styles.documents}>
          <Title order={3}>{t('newOrderPage:documents')}</Title>
          <OrderDocuments
            documents={documents}
            setDocuments={setDocuments}
          />
        </div>
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
      <div className={styles.products}>
        <div className={styles.header}>
          <Title order={3}>{t('newOrderPage:products')}</Title>
          <Button onClick={openProductModal}>
            {t('newOrderPage:productForm:addProductButton')}
          </Button>
        </div>
        <div className={styles.table}>
          <Table
            columns={[
              {
                key: 'hsCode',
                initialWidth: 100,
              },
              {
                key: 'name',
                initialWidth: 250,
              },
              {
                key: 'quantity',
                initialWidth: 100,
              },
              {
                key: 'weight',
                initialWidth: 175,
              },
              {
                key: 'containerNumber',
                initialWidth: 175,
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
      </div>
    </div>
  );
};
