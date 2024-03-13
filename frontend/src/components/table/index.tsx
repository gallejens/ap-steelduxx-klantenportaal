import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/table.module.scss';
import { Pagination, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useRemToPx } from '@/hooks/useRemToPx';
import { DEFAULT_EMPTY_CELL_PLACEHOLDER } from './constants';
import { SortButton } from './components/SortButton';
import type { NTable } from './types';
import { ResizeableDiv } from './components/ResizeableDiv';

export const Table = <T extends string>(props: NTable.Props<T>) => {
  const { t } = useTranslation();

  const [activePage, setPage] = useState<number>(1);
  const { ref: tableRef, height: tableHeight } = useElementSize();
  const cellHeightInPx = useRemToPx(styles.cell_height);

  const [sort, setSort] = useState<NTable.Sort<T>>({
    column:
      props.columns.find(c => c.defaultSort)?.key ?? props.columns[0]?.key,
    direction: 'asc',
  });

  const handleSortIconClick = (column: T) => {
    setSort(s => ({
      column,
      direction: s.column === column && s.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // search & sort logic
  const processedRows = useMemo(() => {
    const searchValue = props.searchValue?.toLowerCase();
    let filteredRows = props.data;
    if (searchValue !== undefined && searchValue.length !== 0) {
      filteredRows = props.data.filter(row => {
        for (const columnId of Object.keys(row) as T[]) {
          if (props.columns.find(c => c.key === columnId)?.excludeFromSearch) {
            continue;
          }
          if (row[columnId]?.toLowerCase().includes(searchValue)) {
            return true;
          }
        }
        return false;
      });
    }

    return [...filteredRows].sort((a, b) => {
      const aValue = a[sort.column];
      const bValue = b[sort.column];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      return sort.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [props.data, props.searchValue, props.columns, sort]);

  // calculate amount of rows per page based on available space and amount of rows
  const pageSize = Math.floor(tableHeight / cellHeightInPx) - 1; // offset for header
  const totalPages = Math.ceil((processedRows ?? []).length / pageSize);

  // placeholder for empty cells
  const emptyCellPlaceholder =
    props.emptyCellPlaceholder ?? DEFAULT_EMPTY_CELL_PLACEHOLDER;

  // get rows on current page
  const visibleData = processedRows.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  return (
    <div className={styles.table_wrapper}>
      <div
        className={styles.body}
        ref={tableRef}
      >
        <div className={styles.table}>
          {props.columns.map((column, idx) => (
            <ResizeableDiv
              className={styles.column}
              key={`column_${column.key}`}
              storageKey={
                props.storageKey !== undefined
                  ? `${props.storageKey}${column.key}`
                  : undefined
              }
              initialWidth={column.width ?? '200px'}
              minWidth={column.maximumWidth ?? '75px'}
              maxWidth={column.minimumWidth ?? '750px'}
              disable={idx === props.columns.length - 1} // we disable on last column
            >
              <div className={styles.cell}>
                <Text
                  truncate='end'
                  size='sm'
                  fw={700}
                >
                  {t(`${props.translationKey}:${column.key}`)}
                </Text>
                {!column.disallowSorting && (
                  <SortButton
                    onClick={handleSortIconClick}
                    columnKey={column.key}
                    sort={sort}
                  />
                )}
              </div>
              {visibleData.map((row, idx) => (
                <div
                  key={`cell_${column.key}_${idx}`}
                  className={styles.cell}
                >
                  <Text
                    truncate='end'
                    size='xs'
                  >
                    {row[column.key] ?? emptyCellPlaceholder}
                  </Text>
                </div>
              ))}
            </ResizeableDiv>
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
