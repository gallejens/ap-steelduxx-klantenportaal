import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import styles from './styles/companies.module.scss';
import type { CompanyInfo } from '@/types/api';
import { CompanyCard } from './components/CompanyCard';
import { search } from '@/lib/util/search';

export const CompaniesPage: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');

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

  return (
    <div className={styles.companies_page}>
      <div className={styles.header}>
        <TextInput
          leftSection={<IconSearch />}
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
          className={styles.search}
        />
      </div>
      <div className={styles.list}>
        {search(companies.data, searchValue).map(c => (
          <CompanyCard
            key={c.company.name}
            {...c}
          />
        ))}
      </div>
    </div>
  );
};
