import { Modal } from '@/components/modals';
import { Button, FileInput, Select } from '@mantine/core';
import { type FC } from 'react';
import styles from '../styles/orderCreate.module.scss';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { type OrderDocumentType } from '@/types/api';
import { useModalStore } from '@/stores/useModalStore';
import { ORDER_DOCUMENT_TYPES } from '../constants';
import type { CreateOrderDocument } from '../types';

type UploadDocumentModalProps = {
  onSubmit: (document: CreateOrderDocument) => void;
};

type FormValues = {
  type: string;
  file: File | null;
};

export const UploadDocumentModal: FC<UploadDocumentModalProps> = props => {
  const { t } = useTranslation();
  const { closeModal } = useModalStore();

  const form = useForm<FormValues>({
    initialValues: {
      type: '',
      file: null,
    },
    validate: {
      type: value =>
        !value ? t('newOrderPage:documents:modal:typeSelect:error') : null,
      file: value =>
        value === null
          ? t('newOrderPage:documents:modal:filePicker:error')
          : null,
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (values.file === null || values.type === '') return;

    const document: CreateOrderDocument = {
      type: values.type as OrderDocumentType,
      file: values.file,
    };

    props.onSubmit(document);
    closeModal();
  };

  return (
    <Modal title={t('newOrderPage:documents:modal:title')}>
      <form
        className={styles.upload_document_form}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Select
          label={t('newOrderPage:documents:modal:typeSelect:label')}
          data={Object.entries(ORDER_DOCUMENT_TYPES).reduce<
            { value: string; label: string }[]
          >((acc, [key, value]) => {
            acc.push({ value: key, label: value });
            return acc;
          }, [])}
          required
          {...form.getInputProps('type')}
        />
        <FileInput
          label={t('newOrderPage:documents:modal:filePicker:label')}
          required
          {...form.getInputProps('file')}
        />
        <div className={styles.confirm_button}>
          <Button type='submit'>
            {t('newOrderPage:documents:modal:confirm')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
