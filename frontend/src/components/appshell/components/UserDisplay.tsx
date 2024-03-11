import { useState, type FC } from 'react';
import styles from '../styles/appshell.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, Text } from '@mantine/core';
import {
  IconChevronRight,
  IconLogout,
  IconPassword,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export const UserDisplay: FC = () => {
  const { signOut, user } = useAuth();
  const [menuOpened, setMenuOpened] = useState(false);
  const { t } = useTranslation();

  if (user === null) return null;

  const handleLogoutOptionClick = () => {
    signOut();
  };

  const handleChangePasswordOptionClick = () => {
    console.log('Change password');
  };

  return (
    <div
      className={styles.user_display}
      onClick={() => setMenuOpened(s => !s)}
    >
      <div>
        <Avatar src={'/default-pfp.png'}></Avatar>
        <div className={styles.info}>
          <Text className={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text className={styles.email}>{user.email}</Text>
        </div>
        <IconChevronRight size={16} />
      </div>
      {menuOpened && (
        <div className={styles.options}>
          <div onClick={handleLogoutOptionClick}>
            <IconLogout size={19} />
            <Text>{t('appshell:userOptions:logout')}</Text>
          </div>
          <div onClick={handleChangePasswordOptionClick}>
            <IconPassword size={19} />
            <Text>{t('appshell:userOptions:changePassword')}</Text>
          </div>
        </div>
      )}
    </div>
  );
};
