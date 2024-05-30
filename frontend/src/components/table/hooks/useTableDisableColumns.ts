import { useLocalStorage } from '@mantine/hooks';

export const useTableDisableColumns = <T extends string>({
  storageKey,
}: {
  storageKey: string;
}) => {
  const [disabledColumns, setDisabledColumns] = useLocalStorage<T[]>({
    key: `disabledColumns_${storageKey}`,
    defaultValue: [],
  });

  const toggleDisableColumn = (column: T) => {
    setDisabledColumns(s =>
      s.includes(column) ? [...s.filter(c => c !== column)] : [...s, column]
    );
  };

  return {
    disabledColumns,
    toggleDisableColumn,
  };
};
