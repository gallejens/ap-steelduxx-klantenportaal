import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRequestTable } from './components/UserRequestTable';
import { Button, Group, Input, Pagination, Select } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import styles from './styles/userRequestList.module.scss';
import { useNavigate } from '@tanstack/react-router';

export const userRequestListPage: FC = () => {
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
              navigate({ to: '/request_account' }); // TODO: Verander path naar een andere pagina 'new_request'
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

      <div className={styles.footer}>
        <Pagination.Root total={10}>
          <Group
            gap={5}
            justify='center'
          >
            <Pagination.First />
            <Pagination.Previous />
            <Pagination.Items />
            <Pagination.Next />
            <Pagination.Last />
          </Group>
        </Pagination.Root>
      </div>
    </div>
  );
};
