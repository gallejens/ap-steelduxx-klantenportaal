import { ActionIcon, Tooltip } from '@mantine/core';
import { type FC, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  tooltipKey: string;
};

export const IconButton: FC<PropsWithChildren<Props>> = props => {
  const { t } = useTranslation();

  return (
    <Tooltip label={t(props.tooltipKey)}>
      <ActionIcon>{props.children}</ActionIcon>
    </Tooltip>
  );
};
