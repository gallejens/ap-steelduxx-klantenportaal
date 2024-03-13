import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/table.module.scss';
import { Pagination, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useRemToPx } from '@/hooks/useRemToPx';
import { DEFAULT_EMPTY_CELL_PLACEHOLDER } from './constants';

type Column<T extends string> = {
  key: T;
  excludeFromSearch?: boolean; // if true, do not use this column for search
  transform?: (value: any) => JSX.Element;
};

type Row<T extends string> = Record<T, string | null | undefined>;

type Props<T extends string> = {
  columns: Column<T>[];
  data: Row<NoInfer<T>>[];
  storageKey?: string; // if provided, the column widths will be saved to local storage
  translationKey: string; // localizations will be gotten from that key using the column keys
  emptyCellPlaceholder?: string; // placeholder to place in empty cells (default: '-')
  searchValue?: string | null; // searchvalue to filter the table
};

export const Table = <T extends string>(props: Props<T>) => {
  const { t } = useTranslation();
  const [activePage, setPage] = useState<number>(1);
  const { ref: tableRef, height: tableHeight } = useElementSize();
  const cellHeightInPx = useRemToPx(styles.cell_height);

  // calculate amount of rows per page based on available space
  const pageSize = Math.floor(tableHeight / cellHeightInPx) - 1; // offset for header
  const totalPages = Math.ceil((props.data ?? []).length / pageSize);

  const visibleData = props.data.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  const emptyCellPlaceholder =
    props.emptyCellPlaceholder ?? DEFAULT_EMPTY_CELL_PLACEHOLDER;

  return (
    <div className={styles.table_wrapper}>
      <div
        className={styles.body}
        ref={tableRef}
      >
        <div className={styles.table}>
          {props.columns.map(column => (
            <div
              key={`column_${column.key}`}
              className={styles.column}
            >
              <div>
                <Text
                  truncate='end'
                  size='sm'
                  fw={700}
                >
                  {t(`${props.translationKey}:${column.key}`)}
                </Text>
              </div>
              {visibleData.map((row, idx) => (
                <div key={`cell_${column.key}_${idx}`}>
                  <Text
                    truncate='end'
                    size='xs'
                  >
                    {row[column.key] ?? emptyCellPlaceholder}
                  </Text>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <Pagination
          total={totalPages}
          value={activePage}
          onChange={page => setPage(page)}
        />
      </div>
    </div>
  );
};
