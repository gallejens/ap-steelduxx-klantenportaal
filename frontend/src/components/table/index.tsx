import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/table.module.scss';
import { Pagination } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { usePxPerRem } from '@/hooks/useRemToPx';
import { ROW_HEIGHT } from './constants';

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
  const pxPerRem = usePxPerRem();

  const pageSize = Math.floor(tableHeight / (pxPerRem * ROW_HEIGHT)) - 1;
  const visibleData = props.data.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  return (
    <div className={styles.table_wrapper}>
      <div
        className={styles.table}
        ref={tableRef}
      >
        {visibleData.map((r, idx) => {
          return (
            <div
              key={`table_row_${idx}`}
              style={{ height: `${ROW_HEIGHT}rem` }}
            >
              {Object.values(r).join(', ')}
            </div>
          );
        })}
      </div>
      <div className={styles.pagination}>
        <Pagination
          total={Math.ceil((props.data ?? []).length / pageSize)}
          value={activePage}
          onChange={page => setPage(page)}
        />
      </div>
    </div>
  );
};
