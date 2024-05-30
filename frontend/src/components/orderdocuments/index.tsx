import { FileButton, Title, Text } from '@mantine/core';
import type { FC } from 'react';
import type { OrderDocumentType } from '@/types/api';
import {
  ACCEPTED_DOCUMENT_FILETYPES,
  MAX_DOCUMENT_FILESIZE,
  ORDER_DOCUMENT_TYPES,
} from './constants';
import { notifications } from '../notifications';
import styles from './styles/orderdocuments.module.scss';
import { IconUpload, IconTrash, IconDownload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { IconButton } from '../iconbutton';
import { useModalStore } from '@/stores/useModalStore';
import { ConfirmModal } from '../modals';

type Props = {
  className?: string;
  documents: Record<OrderDocumentType, string | null>;
  allowUploadWhenDocumentPresent?: boolean;
} & (
  | {
      onUpload: (type: OrderDocumentType, file: File) => void;
      onDownload: (type: OrderDocumentType) => void;
    }
  | {
      onSelect: (type: OrderDocumentType, file: File) => void;
      onDelete: (type: OrderDocumentType) => void;
    }
);

export const OrderDocuments: FC<Props> = props => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();

  const handleFileChange = async (
    type: OrderDocumentType,
    file: File | null
  ) => {
    if (!file) return;

    if (file.size > MAX_DOCUMENT_FILESIZE) {
      notifications.add({
        message: 'Max 10MB',
        autoClose: 10000,
      });
      return;
    }

    const confirmed = await new Promise<boolean>(resolve => {
      openModal(
        <ConfirmModal
          title={t('orderDocuments:modals:uploadTitle')}
          text={t('orderDocuments:modals:uploadText')}
          onConfirm={() => {
            resolve(true);
            closeModal();
          }}
          onCancel={() => {
            resolve(false);
            closeModal();
          }}
        />
      );
    });
    if (!confirmed) return;

    if ('onSelect' in props) {
      props.onSelect(type, file);
    } else {
      props.onUpload(type, file);
    }
  };

  return (
    <div className={classNames(styles.order_documents, props.className)}>
      <Title order={3}>{t('orderDocuments:title')}</Title>
      <div className={styles.list}>
        {Object.entries(props.documents).map(([type, fileName]) => (
          <div key={`document_${type}`}>
            <div className={styles.info}>
              <Title order={5}>
                {ORDER_DOCUMENT_TYPES[type as OrderDocumentType]}
              </Title>
              <Text truncate='end'>
                {fileName ?? t('orderDocuments:noFile')}
              </Text>
            </div>
            <div className={styles.actions}>
              {fileName !== null && 'onDownload' in props && (
                <IconButton
                  icon={<IconDownload />}
                  tooltipKey='orderDocuments:tooltips:download'
                  onClick={() => {
                    props.onDownload(type as OrderDocumentType);
                  }}
                />
              )}
              {(fileName === null || props.allowUploadWhenDocumentPresent) && (
                <FileButton
                  accept={ACCEPTED_DOCUMENT_FILETYPES}
                  onChange={file => {
                    handleFileChange(type as OrderDocumentType, file);
                  }}
                >
                  {props => (
                    <IconButton
                      {...props}
                      icon={<IconUpload />}
                      tooltipKey={
                        fileName === null
                          ? 'orderDocuments:tooltips:upload'
                          : 'orderDocuments:tooltips:replace'
                      }
                    />
                  )}
                </FileButton>
              )}
              {fileName !== null && 'onDelete' in props && (
                <IconButton
                  icon={<IconTrash />}
                  tooltipKey='orderDocuments:tooltips:remove'
                  onClick={() => {
                    props.onDelete(type as OrderDocumentType);
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
