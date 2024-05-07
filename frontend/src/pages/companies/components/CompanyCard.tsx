import type { CompanyInfo } from '@/types/api';
import { memo, useMemo, useState } from 'react';
import styles from '../styles/companies.module.scss';
import {
  ActionIcon,
  Collapse,
  Divider,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconChevronDown,
  IconPhone,
  IconPin,
  IconPlus,
  IconReport,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { search } from '@/lib/util/search';
import { useModalStore } from '@/stores/useModalStore';
import { CreateSubaccountModal } from '@/components/modals/components/CreateSubaccountModal';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmModal } from '@/components/modals';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { notifications } from '@/components/notifications';

export const CompanyCard = memo<CompanyInfo>(({ company, accounts }) => {
  const [opened, setOpened] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();
  const client = useQueryClient();
  const { user } = useAuth();

  const [headAccount, ...normalAccounts] = useMemo(() => {
    const headAccountIdx = accounts.findIndex(
      a => a.role === 'ROLE_HEAD_ADMIN' || 'ROLE_HEAD_USER'
    );
    return [
      accounts[headAccountIdx],
      ...accounts.filter((_, idx) => idx !== headAccountIdx),
    ];
  }, [accounts]);

  const openCreateSubAccountModal = () => {
    openModal(
      <CreateSubaccountModal
        companyId={company?.id ?? null}
        onConfirm={() => {
          client.invalidateQueries({ queryKey: ['companies'] });
        }}
      />
    );
  };

  const openDeleteSubAccountModal = (email: string) => {
    openModal(
      <ConfirmModal
        title={t('companiesPage:deleteAccount:title')}
        text={t('companiesPage:deleteAccount:text')}
        onConfirm={() => {
          closeModal();
          deleteSubAccount(email);
        }}
      />
    );
  };

  const deleteSubAccount = async (email: string) => {
    const result = await doApiAction<GenericAPIResponse>({
      endpoint: '/company-info/delete',
      method: 'DELETE',
      body: { email },
    });

    client.invalidateQueries({ queryKey: ['companies'] });

    notifications.add({
      message: t(
        `companiesPage:deleteAccount:responses:${result?.message}` ??
          'notifications:genericError'
      ),
      autoClose: 10000,
    });
  };

  return (
    <div className={styles.company_card}>
      <div className={styles.title}>
        <Title order={3}>{company?.name ?? 'Admins'}</Title>
        <div className={styles.buttons}>
          {user?.permissions.includes('CREATE_USER_ACCOUNTS') && (
            <ActionIcon>
              <IconPlus onClick={() => openCreateSubAccountModal()} />
            </ActionIcon>
          )}
          <ActionIcon>
            <IconChevronDown onClick={() => setOpened(s => !s)} />
          </ActionIcon>
        </div>
      </div>
      <Divider my='xs' />
      <div className={styles.info}>
        <div>
          {company !== null ? (
            <>
              <div>
                <IconReport size={20} />
                <Text size='sm'>{company.vatNr}</Text>
              </div>
              <div>
                <IconPhone size={20} />
                <Text size='sm'>{company.phoneNr}</Text>
              </div>
              <div>
                <IconPin size={20} />
                <Text size='sm'>
                  {company.country} - {company.postalCode} {company.district} -{' '}
                  {company.street} {company.streetNr}
                </Text>
              </div>
              {company.extraInfo && (
                <div>
                  <IconPlus size={20} />
                  <Text size='sm'>{company.extraInfo}</Text>
                </div>
              )}
            </>
          ) : (
            <Text>/</Text>
          )}
        </div>
        <Divider orientation='vertical' />
        <div>
          <Text
            fw='bold'
            size='sm'
          >
            {t('companiesPage:headAccount')}
          </Text>
          <Text size='sm'>
            {headAccount.firstName} {headAccount.lastName} - {headAccount.email}
          </Text>
        </div>
      </div>

      <Collapse
        in={opened}
        className={styles.collapsable}
      >
        <Divider my='xs' />
        <TextInput
          size='xs'
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
          className={styles.search}
        />
        <div className={styles.table}>
          <Table
            stickyHeader
            withColumnBorders
            withRowBorders={false}
            striped
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Text size='sm'>{t('companiesPage:table:email')}</Text>
                </Table.Th>
                <Table.Th>
                  <Text size='sm'>{t('companiesPage:table:firstName')}</Text>
                </Table.Th>
                <Table.Th>
                  <Text size='sm'>{t('companiesPage:table:lastName')}</Text>
                </Table.Th>
                <Table.Th>
                  <Text size='sm'>{t('companiesPage:table:actions')}</Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {search(normalAccounts, searchValue).map(a => (
                <Table.Tr key={a.email}>
                  <Table.Td>{a.email}</Table.Td>
                  <Table.Td>{a.firstName}</Table.Td>
                  <Table.Td>{a.lastName}</Table.Td>
                  <Table.Td className={styles.actions}>
                    {user?.permissions.includes('DELETE_USER_ACCOUNTS') && (
                      <ActionIcon>
                        <IconTrash
                          onClick={() => openDeleteSubAccountModal(a.email)}
                        />
                      </ActionIcon>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </Collapse>
    </div>
  );
});
