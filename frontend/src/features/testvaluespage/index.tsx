import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, useState } from 'react';
import { doApiAction } from '../../lib/api';
import styles from './testvaluespage.module.css';

export const TestValuesPage: FC = () => {
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
        <div className={styles.item} key={testValue.id}>
          <p>{testValue.value}</p>
          <button
            onClick={() => {
              deleteMutation.mutate(testValue.id);
            }}
            type='button'
          >
            Delete
          </button>
        </div>
      ))}
      <div className={styles.item}>
        <input
          type='text'
          value={inputValue}
          onChange={e => setInputValue(e.currentTarget.value)}
        />
        <button
          onClick={() => {
            addMutation.mutate(inputValue);
            setInputValue('');
          }}
          type='button'
        >
          Add new
        </button>
      </div>
    </div>
  );
};
