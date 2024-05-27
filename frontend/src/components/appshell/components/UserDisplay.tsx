import { type FC } from 'react';
import styles from '../styles/appshell.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, Popover, Text } from '@mantine/core';
import {
  IconChevronRight,
  IconLogout,
  IconPassword,
  IconSettings,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useModalStore } from '@/stores/useModalStore';
import { ChangePasswordModal } from '@/components/modals/components/ChangePasswordModal';
import { ConfirmModal } from '@/components/modals';
import { useAppshellStore } from '../stores/useAppshellStore';
import { UserPreferencesModal } from '@/components/modals/components/UserPreferencesModal';

export const UserDisplay: FC = () => {
  const { signOut, user } = useAuth();
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();
  const collapsed = useAppshellStore(s => s.sidebarCollapsed);

  if (user === null) return null;

  const handleLogoutOptionClick = () => {
    openModal(
      <ConfirmModal
        title={t('appshell:userOptions:logoutConfirmTitle')}
        text={t('appshell:userOptions:logoutConfirmText')}
        onConfirm={() => {
          closeModal();
          signOut();
        }}
      />
    );
  };

  const handleChangePasswordOptionClick = () => {
    openModal(<ChangePasswordModal />);
  };

  const handlePreferencesOptionClick = () => {
    openModal(<UserPreferencesModal />);
  };

  return (
    <div className={styles.appshell__user_display}>
      <Popover
        withArrow
        shadow='md'
      >
        <Popover.Target>
          <div>
            <Avatar>
              {user.firstName.charAt(0).toUpperCase()}
              {user.lastName.charAt(0).toUpperCase()}
            </Avatar>
            {!collapsed && (
              <>
                <div className={styles.info}>
                  <Text className={styles.name}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text className={styles.email}>{user.email}</Text>
                </div>
                <IconChevronRight size={16} />
              </>
            )}
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <div className={styles.user_display_popover}>
            <div onClick={handleLogoutOptionClick}>
              <IconLogout size={19} />
              <Text>{t('appshell:userOptions:logout')}</Text>
            </div>
            <div onClick={handleChangePasswordOptionClick}>
              <IconPassword size={19} />
              <Text>{t('appshell:userOptions:changePassword')}</Text>
            </div>
            <div onClick={handlePreferencesOptionClick}>
              <IconSettings size={19} />
              <Text>{t('appshell:userOptions:preferences')}</Text>
            </div>
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};
