import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { Button, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import styles from './styles/companies.module.scss';
import { CreateSubaccountModal } from '@/components/modals/components/CreateSubaccountModal';
import { useModalStore } from '@/stores/useModalStore';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmModal } from '@/components/modals';
import { notifications } from '@/components/notifications';
import type { CompanyInfo } from '@/types/api';
import { CompanyCard } from './components/CompanyCard';

export const CompaniesPage: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { openModal, closeModal } = useModalStore();
  const { user } = useAuth();
  const client = useQueryClient();

  const {
    data: companies,
    status,
    error,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: () =>
      doApiAction<GenericAPIResponse<CompanyInfo[]>>({
        endpoint: '/company-info/all',
        method: 'GET',
      }),
  });

  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !companies) {
    return <div>Error: {error?.message ?? 'Unknown error'}</div>;
  }

  const openSubAccountModal = () => {
    openModal(
      <CreateSubaccountModal
        onConfirm={() => {
          client.invalidateQueries({ queryKey: ['companies'] });
        }}
      />
    );
  };

  const openDeleteSubAccountConfirmModal = (subaccountEmail: string) => {
    openModal(
      <ConfirmModal
        title='Delete Sub-Account'
        text='Are you sure you want to delete this sub-account?'
        onConfirm={() => {
          deleteSubAccount(subaccountEmail);
          closeModal();
        }}
      ></ConfirmModal>
    );
  };

  const deleteSubAccount = async (subaccountEmail: string) => {
    const result = await doApiAction({
      endpoint: '/auth/delete-account',
      method: 'DELETE',
      body: { email: subaccountEmail },
    });

    client.invalidateQueries({ queryKey: ['companies'] });

    if (result?.message !== undefined) {
      notifications.add({
        message: result?.message,
        autoClose: 10000,
      });
    }

    return result;
  };

  return (
    <div className={styles.companies_page}>
      <div className={styles.header}>
        <TextInput
          leftSection={<IconSearch />}
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
          className={styles.search}
        />
        {user?.permissions.includes('CREATE_USER_ACCOUNTS') && (
          <Button
            onClick={() => {
              openSubAccountModal();
            }}
          >
            Create Sub-Account
          </Button>
        )}
      </div>
      <div className={styles.list}>
        {companies.data.map(c => (
          <CompanyCard
            key={c.company.name}
            {...c}
          />
        ))}
      </div>
    </div>
  );
};
