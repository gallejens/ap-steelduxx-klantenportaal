import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { Button, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/userlist.module.scss';
import { Table } from '@/components/table';
import { CreateSubaccountModal } from '@/components/modals/components/CreateSubaccountModal';
import { useModalStore } from '@/stores/useModalStore';
import { useAuth } from '@/hooks/useAuth';
import type { Auth } from '@/types/auth';

type Account = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  role: Auth.Role;
};

export const AccountListPage: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { user } = useAuth();
  const client = useQueryClient();

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

  if (status === 'error' || !accounts) {
    return (
      <div>
        {t('orderListPage:error')} | {error?.message ?? 'Unknown error'}
      </div>
    );
  }

  const openSubAccountModal = () => {
    openModal(
      <CreateSubaccountModal
        onConfirm={() => {
          client.invalidateQueries({ queryKey: ['accounts'] });
        }}
      />
    );
  };

  return (
    <div className={styles.account_list_page}>
      <div className={styles.header}>
        <TextInput
          leftSection={<IconSearch />}
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
          className={styles.search}
        />
        {user?.permissions.includes('CREATE_SUB_ACCOUNTS') && (
          <Button
            onClick={() => {
              openSubAccountModal();
            }}
          >
            {t('accountListPage:createSubAccount')}
          </Button>
        )}
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
              emptyCellPlaceholder: 'Admin',
            },
            {
              key: 'role',
              initialWidth: 150,
              transform: (role: Auth.Role) =>
                role === 'ROLE_HEAD_ADMIN' || role === 'ROLE_HEAD_USER',
            },
          ]}
          data={accounts.data ?? []}
        />
      </div>
    </div>
  );
};
