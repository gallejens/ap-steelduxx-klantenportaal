import { Divider, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import styles from './styles/companies.module.scss';
import { CompanyCard } from './components/CompanyCard';
import { search } from '@/lib/util/search';
import { fetchCompanyInfoList } from './helpers';

export const CompaniesPage: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');

  const { data, status, error } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanyInfoList,
  });

  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !data) {
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
        {data.adminInfo && (
          <>
            <CompanyCard {...data.adminInfo} />
            <Divider />
          </>
        )}
        {search(data.companies, searchValue).map((c, idx) => (
          <CompanyCard
            key={c.company?.name ?? `unknown-company-${idx}`}
            {...c}
          />
        ))}
      </div>
    </div>
  );
};
