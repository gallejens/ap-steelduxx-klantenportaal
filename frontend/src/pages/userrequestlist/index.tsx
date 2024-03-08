import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRequestTable } from './components/UserRequestTable';
import { Button, Input, Select } from '@mantine/core';
import styles from './styles/userRequestList.module.scss';
import { useNavigate } from '@tanstack/react-router';

export const UserRequestListPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState<number>(10);

  return (
    <div className={styles.userrequest_table_page}>
      <div className={styles.header}>
        <div className={styles.first_column}>
          <Select
            className={styles.paging_select}
            value={pageSize.toString() ?? ''}
            data={['5', '10']}
            onChange={value => setPageSize(parseInt(value ?? '0', 10))}
            allowDeselect={false}
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
              navigate({ to: '/request-account' }); // TODO: Verander path naar een andere pagina 'new_request'
            }}
            className={styles.new_button}
          >
            {t('user_request_list_page:newUserRequest')}
          </Button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.userrequest_table}>
          <UserRequestTable pageSize={pageSize} />
        </div>
      </div>
    </div>
  );
};
