import type { FC } from 'react';
import styles from '../styles/orderDetails.module.scss';
import { useTranslation } from 'react-i18next';
import { Divider, Title } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

const IFRAME_HEADER_SIZE = 28;
const IFRAME_MARGIN = 8;

const getIframeContent = (imo: string, height: number) => {
  return `
        <script type="text/javascript">
          var width="100%";
          var height="${height + IFRAME_HEADER_SIZE}";
          var names=true;
          var imo="${imo}";
          var show_track=true;
          var zoom=1;
        </script>
        <script type="text/javascript" src="https://www.vesselfinder.com/aismap.js"></script>
      `;
};

type Props = {
  imo: string;
};

export const MapInfo: FC<Props> = ({ imo }) => {
  const { t } = useTranslation();
  const { ref, height } = useElementSize();

  return (
    <div className={styles.map_info}>
      <Title
        order={3}
        className={styles.title}
      >
        {t('orderDetailPage:shipLocation')}
      </Title>
      <Divider orientation='horizontal' />
      <div
        className={styles.frame_container}
        ref={ref}
      >
        <iframe
          style={{
            position: 'absolute',
            top: `-${IFRAME_HEADER_SIZE}px`,
            left: `-${IFRAME_MARGIN}px`,
            width: `calc(100% + ${IFRAME_MARGIN * 2}px)`,
            height: `${height + IFRAME_HEADER_SIZE}px`,
          }}
          srcDoc={getIframeContent(imo, height)}
        />
      </div>
    </div>
  );
};
