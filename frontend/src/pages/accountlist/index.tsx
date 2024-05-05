import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { ActionIcon, Button, TextInput } from '@mantine/core';
import { IconSearch, IconTrash } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/userlist.module.scss';
import { Table } from '@/components/table';
import { CreateSubaccountModal } from '@/components/modals/components/CreateSubaccountModal';
import { useModalStore } from '@/stores/useModalStore';
import { useAuth } from '@/hooks/useAuth';
import type { Auth } from '@/types/auth';
import { ConfirmModal } from '@/components/modals';

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
  const { openModal, closeModal } = useModalStore();
  const { user } = useAuth();
  const client = useQueryClient();
  // const [responseMessage, setResponseMessage] = useState<string | null>(null);

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

  const openDeleteSubAccountConfirmModal = (account: Account) => {
    openModal(
      <ConfirmModal
        title={t(
          'appshell:deleteSubAccountConfirmation:deleteSubAccountConfirmTitle'
        )}
        text={t(
          'appshell:deleteSubAccountConfirmation:deleteSubAccountConfirmText'
        )}
        onConfirm={() => {
          // deleteSubAccount(account);
          closeModal();
        }}
      ></ConfirmModal>
    );
  };

  // const deleteSubAccount = async (values: Account) => {
  //   const result = await doApiAction({
  //     endpoint: '/accounts/delete',
  //     method: 'DELETE',
  //     body: {
  //       email: values.email,
  //       firstName: values.firstName,
  //       lastName: values.lastName,
  //       role: values.role,
  //     },
  //   });

  //   setResponseMessage(result?.message ?? 'failed');
  // };

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
            {
              key: 'actions',
              emptyHeader: true,
              disallowSorting: true,
              disableResizing: true,
            },
          ]}
          data={
            accounts.data.map(a => ({
              ...a,
              actions:
                a.role !== 'ROLE_HEAD_ADMIN' && a.role !== 'ROLE_HEAD_USER' ? (
                  <ActionIcon
                    onClick={() => openDeleteSubAccountConfirmModal(a)}
                  >
                    <IconTrash />
                  </ActionIcon>
                ) : (
                  []
                ),
            })) ?? []
          }
        />
      </div>
    </div>
  );
};
