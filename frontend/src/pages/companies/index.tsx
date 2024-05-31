import { Divider } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import styles from './styles/companies.module.scss';
import { CompanyCard } from './components/CompanyCard';
import { search } from '@/lib/util/search';
import { fetchCompanyInfoList } from './helpers';
import { MultiSearch } from '@/components/multisearch';
import LoaderComponent from '@/components/loader';

export const CompaniesPage: FC = () => {
  const [searchValues, setSearchValues] = useState<string[]>([]);

  const { data, status, error } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanyInfoList,
  });

  if (status === 'pending') {
    return <LoaderComponent />;
  }

  if (status === 'error' || !data) {
    return <div>Error: {error?.message ?? 'Unknown error'}</div>;
  }

  return (
    <div className={styles.companies_page}>
      {data.length > 1 && (
        <div className={styles.header}>
          <MultiSearch
            onChange={newValues => setSearchValues(newValues)}
            inputWidth='30rem'
          />
        </div>
      )}
      <div className={styles.list}>
        {search(data, searchValues).map((c, idx, all) => (
          <div key={`company-${idx}`}>
            <CompanyCard
              {...c}
              alwaysOpen={all.length === 1}
            />
            {idx === 0 && all.length > 1 && <Divider mt='md' />}
          </div>
        ))}
      </div>
    </div>
  );
};
