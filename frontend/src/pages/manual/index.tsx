import { type FC } from 'react';
import Markdown from 'react-markdown';
import { PublicPageWrapper } from '@/components/publicpagewrapper';
import styles from './styles/manual.module.scss';
import { MARKDOWN_COMPONENTS } from './constant';
import { useParams } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import type { Auth } from '@/types/auth';
import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import enUserManual from '@/assets/manuals/en/user.md?raw';
import enAdminManual from '@/assets/manuals/en/admin.md?raw';
import nlUserManual from '@/assets/manuals/nl/user.md?raw';
import nlAdminManual from '@/assets/manuals/nl/admin.md?raw';

const MANUALS: Record<
  string,
  { languages: Record<string, string>; roles?: Auth.Role[] }
> = {
  user: {
    languages: {
      en: enUserManual,
      nl: nlUserManual,
    },
  },
  admin: {
    languages: {
      en: enAdminManual,
      nl: nlAdminManual,
    },
    roles: ['ROLE_ADMIN', 'ROLE_HEAD_ADMIN'],
  },
};

export const ManualPage: FC = () => {
  const { user } = useAuth();
  const { language, type } = useParams({
    from: '/manual/$language/$type',
  });
  const { t } = useTranslation();

  const manual = MANUALS[type];
  const markdown = manual?.languages[language];

  const canViewPage =
    manual !== undefined &&
    markdown !== undefined &&
    (manual.roles ? user !== null && manual.roles.includes(user.role) : true);

  return (
    <PublicPageWrapper
      hideBackButton
      hideLanguageSelector
      panelWidth='fit-content'
    >
      <div className={styles.manual_page}>
        {canViewPage ? (
          <Markdown components={MARKDOWN_COMPONENTS}>{markdown}</Markdown>
        ) : (
          <Text>{t('manualPage:noAccess')}</Text>
        )}
      </div>
    </PublicPageWrapper>
  );
};
