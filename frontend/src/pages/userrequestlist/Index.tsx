import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRequestTable } from './components/UserRequestTable';
import { Button, Input, Select } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import styles from './styles/userRequestList.module.scss';
import { useNavigate } from '@tanstack/react-router';

export const userRequestListPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.userrequest_table_page}>
      <div className={styles.header}>
        <div className={styles.first_column}>
          <Select
            className={styles.paging_select}
            placeholder='10'
            data={['5', '10']}
          />
        </div>
        <div className={styles.second_column}>
          <Input
            className={styles.search_bar}
            // icon={<IconSearch size={18} />}
            placeholder='Search'
            radius='sm'
          />
        </div>
        <div className={styles.third_column}>
          <Button
            type='submit'
            onClick={() => {
              navigate({ to: '/request_account' });
            }}
            className={styles.new_button}
          >
            {t('user_request_list_page:newUserRequest')}
          </Button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.userrequest_table}>
          <UserRequestTable />
        </div>
      </div>

      <div className={styles.footer}></div>
    </div>
  );
};
