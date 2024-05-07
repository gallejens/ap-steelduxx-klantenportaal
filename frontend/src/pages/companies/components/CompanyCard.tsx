import type { CompanyInfo } from '@/types/api';
import { memo, useMemo, useState } from 'react';
import styles from '../styles/companies.module.scss';
import {
  Collapse,
  Divider,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
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
import { ADMINS_COMPANY_LABEL } from '../constants';
import { IconButton } from '@/components/iconbutton';

export const CompanyCard = memo<CompanyInfo>(({ company, accounts }) => {
  const [opened, setOpened] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();
  const client = useQueryClient();
  const { user } = useAuth();

  if (!user) throw new Error('User not found');

  const isAdminCompany = company === null;

  const [headAccount, ...normalAccounts] = useMemo(() => {
    const headAccountIdx = accounts.findIndex(
      a => a.role === 'ROLE_HEAD_ADMIN' || a.role === 'ROLE_HEAD_USER'
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

  const openChangeHeadAccountModal = (email: string) => {
    openModal(
      <ConfirmModal
        title={t('companiesPage:changeHead:title')}
        text={t('companiesPage:changeHead:text')}
        onConfirm={() => {
          closeModal();
          changeHeadAccount(email);
        }}
      />
    );
  };

  const openDeleteCompanyModal = () => {
    openModal(
      <ConfirmModal
        title={t('companiesPage:deleteCompany:title')}
        text={t('companiesPage:deleteCompany:text')}
        onConfirm={() => {
          closeModal();
          deleteCompany();
        }}
      />
    );
  };

  const deleteSubAccount = async (email: string) => {
    const result = await doApiAction<GenericAPIResponse>({
      endpoint: '/company-info/delete-user',
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

  const changeHeadAccount = async (email: string) => {
    if (!company) return;

    const result = await doApiAction<GenericAPIResponse>({
      endpoint: '/company-info/change-head',
      method: 'POST',
      body: { email, companyId: company.id },
    });

    client.invalidateQueries({ queryKey: ['companies'] });

    notifications.add({
      message: t(
        `companiesPage:changeHead:responses:${result?.message}` ??
          'notifications:genericError'
      ),
      autoClose: 10000,
    });
  };

  const deleteCompany = async () => {
    if (!company) return;

    const result = await doApiAction<GenericAPIResponse>({
      endpoint: '/company-info/delete-company',
      method: 'DELETE',
      body: { companyId: company.id },
    });

    client.invalidateQueries({ queryKey: ['companies'] });

    notifications.add({
      message: t(
        `companiesPage:deleteCompany:responses:${result?.message}` ??
          'notifications:genericError'
      ),
      autoClose: 10000,
    });
  };

  const showDeleteSubAccount = user.permissions.includes(
    isAdminCompany ? 'DELETE_ADMIN_ACCOUNTS' : 'DELETE_USER_ACCOUNTS'
  );
  const showChangeHeadAccount =
    user.permissions.includes('CHANGE_COMPANY_HEAD_ACCOUNT') && !isAdminCompany;
  const showDeleteCompany =
    user.permissions.includes('DELETE_COMPANY') && !isAdminCompany;
  const showCreateSubAccount = user.permissions.includes(
    isAdminCompany ? 'CREATE_ADMIN_ACCOUNTS' : 'CREATE_USER_ACCOUNTS'
  );

  return (
    <div className={styles.company_card}>
      <div className={styles.title}>
        <Title order={3}>{company?.name ?? ADMINS_COMPANY_LABEL}</Title>
        <div className={styles.buttons}>
          {showCreateSubAccount && (
            <IconButton tooltipKey='companiesPage:tooltips:subaccount'>
              <IconPlus onClick={() => openCreateSubAccountModal()} />
            </IconButton>
          )}
          {showDeleteCompany && (
            <IconButton tooltipKey='companiesPage:tooltips:delete'>
              <IconTrash onClick={() => openDeleteCompanyModal()} />
            </IconButton>
          )}
          {opened ? (
            <IconButton tooltipKey='companiesPage:tooltips:collapse'>
              <IconChevronUp onClick={() => setOpened(false)} />
            </IconButton>
          ) : (
            <IconButton tooltipKey='companiesPage:tooltips:open'>
              <IconChevronDown onClick={() => setOpened(true)} />
            </IconButton>
          )}
        </div>
      </div>
      <Divider my='xs' />
      <div className={styles.info}>
        <div>
          {company !== null && (
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
                    {showChangeHeadAccount && (
                      <IconButton tooltipKey='companiesPage:tooltips:changeHead'>
                        <IconChevronUp
                          onClick={() => openChangeHeadAccountModal(a.email)}
                        />
                      </IconButton>
                    )}
                    {showDeleteSubAccount && (
                      <IconButton tooltipKey='companiesPage:tooltips:delete'>
                        <IconTrash
                          onClick={() => openDeleteSubAccountModal(a.email)}
                        />
                      </IconButton>
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
