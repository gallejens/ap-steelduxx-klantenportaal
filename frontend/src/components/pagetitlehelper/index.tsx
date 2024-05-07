import { useDocumentTitle } from '@mantine/hooks';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const PageTitleHelper: FC = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('pageTitleHelper:title'));

  return <></>;
};
