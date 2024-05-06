import type { CompanyInfo, CompanyInfoAccount } from '@/types/api';
import { useMemo, useState, type FC } from 'react';
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
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { search } from '@/lib/util/search';

export const CompanyCard: FC<CompanyInfo> = ({ company, accounts }) => {
  const [opened, setOpened] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();

  const [headAccount, ...normalAccounts] = useMemo(() => {
    const headAccountIdx = accounts.findIndex(
      a => a.role === 'ROLE_HEAD_ADMIN' || 'ROLE_HEAD_USER'
    );

    const extraAccounts: CompanyInfoAccount[] = [...new Array(25)].map(
      (_, idx) => ({
        firstName: 'John',
        lastName: 'Doe',
        email: `${idx}@mail.com`,
        role: 'ROLE_USER',
      })
    );

    return [
      accounts[headAccountIdx],
      ...accounts.filter((_, idx) => idx !== headAccountIdx),
      ...extraAccounts,
    ];
  }, [accounts]);

  const addSubAccount = () => {
    //
  };

  return (
    <div className={styles.company_card}>
      <div className={styles.title}>
        <Title order={3}>{company.name}</Title>
        <div className={styles.buttons}>
          <ActionIcon>
            <IconPlus onClick={() => addSubAccount} />
          </ActionIcon>
          <ActionIcon>
            <IconChevronDown onClick={() => setOpened(s => !s)} />
          </ActionIcon>
        </div>
      </div>
      <Divider />
      <div className={styles.info}>
        <div>
          <div>
            <IconReport size={'1.2rem'} />
            <Text size='sm'>{company.vatNr}</Text>
          </div>
          <div>
            <IconPhone size={'1.2rem'} />
            <Text size='sm'>{company.phoneNr}</Text>
          </div>
          <div>
            <IconPin size={'1.2rem'} />
            <Text size='sm'>
              {company.country} - {company.postalCode} {company.district} -{' '}
              {company.street} {company.streetNr}
            </Text>
          </div>
          {company.extraInfo && (
            <div>
              <IconPlus size={'1.2rem'} />
              <Text size='sm'>{company.extraInfo}</Text>
            </div>
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
            {headAccount.lastName} {headAccount.firstName} - {headAccount.email}
          </Text>
        </div>
      </div>
      <Collapse
        in={opened}
        className={styles.collapsable}
      >
        <Divider />
        <TextInput
          size='xs'
          leftSection={<IconSearch size={'1rem'} />}
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
          className={styles.search}
        />
        <div className={styles.table}>
          <Table stickyHeader>
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
                  <Table.Td>
                    <ActionIcon>
                      <IconReport />
                    </ActionIcon>
                    <ActionIcon>
                      <IconPlus />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </Collapse>
    </div>
  );
};
