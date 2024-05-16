import { type FC } from 'react';
import styles from '../styles/orderDetails.module.scss';
import type { OrderDetails, OrderDocumentType } from '@/types/api';
import { doApiAction } from '@/lib/api';
import { OrderDocuments } from '@/components/orderdocuments';
import { buildDocumentsFromOrderDetails } from '../helpers';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  orderDetails: OrderDetails;
  customerCode?: string;
};

export const DocumentSection: FC<Props> = props => {
  const queryClient = useQueryClient();

  const documents = buildDocumentsFromOrderDetails(props.orderDetails);

  const handleDownload = async (type: OrderDocumentType) => {
    const response = await doApiAction<BlobPart>({
      endpoint: `/orders/document/download/${props.orderDetails.referenceNumber}/${type}`,
      method: 'GET',
      responseType: 'blob',
    });

    try {
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

  const handleUpload = async (type: OrderDocumentType, file: File) => {
    const formData = new FormData();
    formData.append('orderId', props.orderDetails.referenceNumber);
    formData.append('file', file);
    formData.append('type', type);
    if (props.customerCode) {
      formData.append('customerCode', props.customerCode);
    }

    const response = await doApiAction({
      endpoint: '/orders/document/upload',
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    queryClient.invalidateQueries({ queryKey: ['orderDetails'] });

    console.log(response);
  };

  return (
    <OrderDocuments
      documents={documents}
      onUpload={handleUpload}
      onDownload={handleDownload}
    />
  );
};
