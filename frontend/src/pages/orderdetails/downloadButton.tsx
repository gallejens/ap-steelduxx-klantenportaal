import { FC } from 'react';
import { IconDownload } from '@tabler/icons-react';
import styles from './styles/orderDetails.module.scss';

interface DownloadButtonProps {
  downloadLink: string | null;
  downloadDocument: (link: string | null) => void;
}

export const DownloadButton: FC<DownloadButtonProps> = ({
  downloadLink,
  downloadDocument,
}) => {
  return (
    <button
      className={styles.downloadButton}
      onClick={() => downloadLink && downloadDocument(downloadLink)}
      aria-label='Download Document'
      title='Download Document'
    >
      <IconDownload
        size={24}
        strokeWidth={2}
      />
    </button>
  );
};
