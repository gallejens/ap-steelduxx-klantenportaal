import type { FC } from 'react';
import type { CreateOrderDocument } from '../types';
import styles from '../styles/orderCreate.module.scss';
import { ActionIcon, FileButton, Text, Title } from '@mantine/core';
import {
  ACCEPTED_DOCUMENT_FILETYPES,
  MAX_DOCUMENT_FILESIZE,
  ORDER_DOCUMENT_TYPES,
} from '../constants';
import { IconTrash, IconUpload } from '@tabler/icons-react';
import type { OrderDocumentType } from '@/types/api';
import { notifications } from '@/components/notifications';

type Props = {
  documents: CreateOrderDocument[];
  setDocuments: (
    setter: (documents: CreateOrderDocument[]) => CreateOrderDocument[]
  ) => void;
};

export const OrderDocuments: FC<Props> = props => {
  const handleDelete = (type: OrderDocumentType) => {
    props.setDocuments(s => s.filter(d => d.type !== type));
  };

  const handleFileChange = (type: OrderDocumentType, file: File | null) => {
    if (!file) return;

    if (file.size > MAX_DOCUMENT_FILESIZE) {
      notifications.add({
        message: 'Max 10MB',
        color: 'red',
      });
      return;
    }

    props.setDocuments(s => [
      ...s.filter(d => d.type !== type),
      { type, file },
    ]);
  };

  return (
    <div className={styles.order_documents}>
      {Object.entries(ORDER_DOCUMENT_TYPES).map(([key, value]) => {
        const existingDocument = props.documents.find(doc => doc.type === key);

        return (
          <div key={`document_${key}`}>
            <div className={styles.info}>
              <Title order={5}>{value}</Title>
              <Text>{existingDocument?.file.name ?? '/'}</Text>
            </div>
            {!existingDocument ? (
              <FileButton
                accept={ACCEPTED_DOCUMENT_FILETYPES}
                onChange={file => {
                  handleFileChange(key as OrderDocumentType, file);
                }}
              >
                {props => (
                  <ActionIcon {...props}>
                    <IconUpload />
                  </ActionIcon>
                )}
              </FileButton>
            ) : (
              <ActionIcon
                onClick={() => {
                  handleDelete(existingDocument.type);
                }}
              >
                <IconTrash />
              </ActionIcon>
            )}
          </div>
        );
      })}
    </div>
  );
};
