import { Button, TextInput } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { doApiAction } from '../../lib/api';
import { TestValue } from './components/TestValue';
import styles from './styles/testvaluespage.module.scss';

export const TestValuesPage: FC = () => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const client = useQueryClient();

  const {
    data: testValues,
    status,
    error,
  } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['testvalues'],
    queryFn: () =>
      doApiAction<{ id: number; value: string }[]>({
        endpoint: '/',
        method: 'GET',
      }),
  });

  const addMutation = useMutation({
    mutationFn: (value: string) => {
      return doApiAction<{ id: number; value: string }>({
        endpoint: '/add',
        method: 'POST',
        body: { value },
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['testvalues'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return doApiAction({
        endpoint: `/${id}`,
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['testvalues'] });
    },
  });

  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.wrapper}>
      {testValues.map(testValue => (
        <TestValue
          key={testValue.id}
          value={testValue.value}
          onDelete={() => {
            deleteMutation.mutate(testValue.id);
          }}
        />
      ))}
      <div className={styles.item}>
        <TextInput
          placeholder={t('testvaluespage:newValueInputPlaceholder')}
          value={inputValue}
          onChange={e => setInputValue(e.currentTarget.value)}
        />
        <Button
          onClick={() => {
            addMutation.mutate(inputValue);
            setInputValue('');
          }}
        >
          {t('testvaluespage:newValueButton')}
        </Button>
      </div>
      <Button
        onClick={() => {
          changeLanguage(language === 'en' ? 'nl' : 'en');
        }}
      >
        Toggle Language
      </Button>
    </div>
  );
};
