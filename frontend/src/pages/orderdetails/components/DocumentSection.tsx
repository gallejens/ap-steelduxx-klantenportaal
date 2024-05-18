import { type FC } from 'react';
import type { OrderDetails, OrderDocumentType } from '@/types/api';
import { doApiAction } from '@/lib/api';
import { OrderDocuments } from '@/components/orderdocuments';
import { buildDocumentsFromOrderDetails } from '../helpers';
import { useQueryClient } from '@tanstack/react-query';
import { notifications } from '@/components/notifications';
import { useTranslation } from 'react-i18next';

type Props = {
  orderDetails: OrderDetails;
  customerCode?: string;
};

export const DocumentSection: FC<Props> = props => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const documents = buildDocumentsFromOrderDetails(props.orderDetails);

  const handleDownload = async (type: OrderDocumentType) => {
    const response = await doApiAction<BlobPart>({
      endpoint: `/orders/document/download/${props.orderDetails.referenceNumber}/${type}`,
      method: 'GET',
      responseType: 'blob',
    });

    try {
      if (!response) {
        throw new Error();
      }

      const pdfBlob = new Blob([response], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(pdfBlob);

      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.setAttribute(
        'download',
        `${props.orderDetails.referenceNumber}-${type}.pdf`
      );

      document.body.appendChild(tempLink);
      tempLink.click();

      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
    } catch (e: unknown) {
      notifications.add({
        message: t('orderDetailPage:documents:downloadFailed'),
        autoClose: 10000,
      });
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

    notifications.add({
      message: t(
        `orderDetailPage:documents:uploadResponse:${response?.message ?? 'failed'}`
      ),
      autoClose: 10000,
    });
  };

  return (
    <OrderDocuments
      documents={documents}
      onUpload={handleUpload}
      onDownload={handleDownload}
      allowUploadWhenDocumentPresent
    />
  );
};
