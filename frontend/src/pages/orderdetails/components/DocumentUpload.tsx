import { type ChangeEvent, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/orderDetails.module.scss';
import type { OrderDetails, OrderDocumentType } from '@/types/api';

import { Button, Input, Title } from '@mantine/core';
import { useParams, useSearch } from '@tanstack/react-router';
import { doApiAction } from '@/lib/api';
import { IconDownload, IconUpload } from '@tabler/icons-react';

interface DocumentUploadProps {
  orderDetail: OrderDetails;
}

export const DocumentUpload: FC<DocumentUploadProps> = ({ orderDetail }) => {
  const { t } = useTranslation();

  const { order_id: orderId } = useParams({
    from: '/app/orders/$order_id',
  });
  const { customerCode } = useSearch({
    from: '/app/orders/$order_id',
  });

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDownload = async (documentType: OrderDocumentType) => {
    try {
      const response = await doApiAction<BlobPart>({
        endpoint: `/orders/download-document/${orderId}/${documentType}`,
        method: 'GET',
        responseType: 'blob',
      });
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${orderId}-${documentType}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert('Download failed!');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed!');
    }
  };

  const handleUpload = async (documentType: OrderDocumentType) => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('referenceNumber', orderId);
    formData.append('documentType', documentType);
    if (customerCode) {
      formData.append('customerCode', customerCode);
    }

    try {
      const response = await doApiAction({
        endpoint: '/orders/upload-document',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response && response.status === 200) {
        alert('Upload successful!');
      } else {
        alert('Upload failed!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed!');
    }
  };

  return (
    <div className={styles.documentsContainer}>
      <Title order={3}>{t('newOrderPage:documents')}</Title>

      <div className={styles.documentsFileselector}>
        <Input
          type='file'
          onChange={handleFileChange}
          accept='.pdf'
          id='fileInput'
          className={styles.hiddenFileInput}
        />
      </div>
      <div className={styles.documentItem}>
        {orderDetail?.billOfLadingDownloadLink ? (
          <>
            <p>Bill of Lading Document</p>
            <Button onClick={() => handleDownload('bl')}>
              <IconDownload />
            </Button>
          </>
        ) : (
          <>
            <p>Bill of Lading Document</p>
            <Button onClick={() => handleUpload('bl')}>
              <IconUpload />
            </Button>
          </>
        )}
      </div>
      <div className={styles.documentItem}>
        {orderDetail.packingListDownloadLink !== null ? (
          <>
            <p>Packing List Document</p>
            <Button onClick={() => handleDownload('packing')}>
              <IconDownload />
            </Button>
          </>
        ) : (
          <>
            <p>Packing List Document</p>
            <Button onClick={() => handleUpload('packing')}>
              <IconUpload />
            </Button>
          </>
        )}
      </div>
      <div className={styles.documentItem}>
        {orderDetail.customsDownloadLink !== null ? (
          <>
            <p>Customs Document</p>
            <Button onClick={() => handleDownload('customs')}>
              <IconDownload />
            </Button>
          </>
        ) : (
          <>
            <p>Customs Document</p>
            <Button onClick={() => handleUpload('customs')}>
              <IconUpload />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
