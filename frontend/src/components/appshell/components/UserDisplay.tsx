import type { FC } from 'react';
import styles from '../styles/appshell.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { Menu, Text } from '@mantine/core';
import { IconLogout, IconPassword } from '@tabler/icons-react';

export const UserDisplay: FC = () => {
  const { signOut, user } = useAuth();

  if (user === null) return null;

  return (
    <Menu
      trigger='click-hover'
      position='right-end'
      offset={10}
      closeDelay={400}
    >
      <Menu.Target>
        <div className={styles.user_display}>
          <div className={styles.avatar}>
            <img
              src='/default-pfp.png'
              alt='default icon'
            />
          </div>
          <div className={styles.info}>
            <Text className={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
            <Text className={styles.email}>{user.email}</Text>
          </div>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Settings</Menu.Label>
        <Menu.Item
          leftSection={<IconLogout />}
          onClick={() => signOut()}
        >
          Logout
        </Menu.Item>
        <Menu.Item
          leftSection={<IconPassword />}
          onClick={() => console.log('Do changepassword gedoe')}
        >
          Change Password
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
