import { type FC } from 'react';
import Markdown from 'react-markdown';
import { PublicPageWrapper } from '@/components/publicpagewrapper';
import styles from './styles/manual.module.scss';
import { MARKDOWN_COMPONENTS } from './constant';
import { useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import type { Auth } from '@/types/auth';
import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import userManual from '@/assets/manuals/user.md?raw';
import adminManual from '@/assets/manuals/admin.md?raw';

const MANUALS: Record<string, { md: string; roles?: Auth.Role[] }> = {
  user: { md: userManual },
  admin: { md: adminManual, roles: ['ROLE_ADMIN', 'ROLE_HEAD_ADMIN'] },
};

export const ManualPage: FC = () => {
  const { location } = useRouterState();
  const { user } = useAuth();
  const { t } = useTranslation();

  const manualType = location.pathname.split('/').pop() ?? '';
  const manual = MANUALS[manualType];

  const canViewPage =
    manual !== undefined &&
    (manual.roles ? user !== null && manual.roles.includes(user.role) : true);

  return (
    <PublicPageWrapper
      hideBackButton
      hideLanguageSelector
      panelWidth='fit-content'
    >
      <div className={styles.manual_page}>
        {canViewPage ? (
          <Markdown components={MARKDOWN_COMPONENTS}>
            {MANUALS[manualType].md}
          </Markdown>
        ) : (
          <Text>{t('manualPage:noAccess')}</Text>
        )}
      </div>
    </PublicPageWrapper>
  );
};
