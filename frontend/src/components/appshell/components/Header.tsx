import { NotificationPopover } from '@/components/notificationpopover';
import { Burger, Divider } from '@mantine/core';
import type { FC } from 'react';
import styles from '../styles/appshell.module.scss';
import { useAppshellStore } from '../stores/useAppshellStore';
import { IconButton } from '@/components/iconbutton';
import { IconBook } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';
import { LanguageSelector } from '@/components/languageselector';
import { useTranslation } from 'react-i18next';

export const Header: FC = () => {
  const [collapsed, setCollapsed] = useAppshellStore(s => [
    s.sidebarCollapsed,
    s.setSidebarCollapsed,
  ]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    i18n: { language },
  } = useTranslation();

  const handleNavigateToManual = () => {
    if (!user) return;

    if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_HEAD_ADMIN') {
      navigate({
        to: `/manual/${language}/admin`,
      });
    } else {
      navigate({
        to: `/manual/${language}/user`,
      });
    }
  };

  return (
    <div className={styles.appshell__header}>
      <Burger
        opened={!collapsed}
        onClick={() => {
          setCollapsed(s => !s);
        }}
        color='var(--mantine-color-primary-0)'
      />
      <div className={styles.actions}>
        <IconButton
          tooltipKey='appshell:header:tooltips:manual'
          icon={<IconBook />}
          onClick={handleNavigateToManual}
          transparent
        />
        <NotificationPopover />
        <Divider orientation='vertical' />
        <LanguageSelector
          color='var(--mantine-primary-color-7)'
          showBorder
        />
      </div>
    </div>
  );
};
