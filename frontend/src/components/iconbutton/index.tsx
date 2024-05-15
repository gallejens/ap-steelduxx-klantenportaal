import { ActionIcon, Tooltip } from '@mantine/core';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  tooltipKey: string;
  icon: JSX.Element;
  onClick?: () => void;
  transparent?: boolean;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { t } = useTranslation();
  const label = t(props.tooltipKey);

  return (
    <Tooltip
      label={label}
      transitionProps={{ transition: 'rotate-right' }}
    >
      <ActionIcon
        variant={props.transparent ? 'transparent' : 'filled'}
        onClick={props.onClick}
        aria-label={label}
        color={props.transparent ? 'var(--mantine-color-primary-0)' : undefined}
        ref={ref}
      >
        {props.icon}
      </ActionIcon>
    </Tooltip>
  );
});
