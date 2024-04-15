import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/userlist.module.scss';
import { Table } from '@/components/table';

type Account = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
};

export const AccountListPage: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { t } = useTranslation();

  const {
    data: accounts,
    status,
    error,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () =>
      doApiAction<GenericAPIResponse<Account[]>>({
        endpoint: '/accounts/all',
        method: 'GET',
      }),
  });

  if (status === 'pending') {
    return <div>{t('orderListPage:loading')}</div>;
  }

  if (status === 'error' || accounts === null) {
    return (
      <div>
        {t('orderListPage:error')} | {error?.message ?? 'Unknown error'}
      </div>
    );
  }

  return (
    <div className={styles.account_list_page}>
      <div className={styles.header}>
        <TextInput
          leftSection={<IconSearch />}
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
        />
      </div>
      <div className={styles.body}>
        <Table
          storageKey='accountlist'
          translationKey='accountListPage:table'
          searchValue={searchValue}
          columns={[
            {
              key: 'email',
              defaultSort: true,
              initialWidth: 250,
            },
            {
              key: 'firstName',
              initialWidth: 150,
            },
            {
              key: 'lastName',
              initialWidth: 250,
            },
            {
              key: 'company',
              initialWidth: 250,
            },
          ]}
          data={accounts.data ?? []}
        />
      </div>
    </div>
  );
};
