import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/table.module.scss';
import { Pagination, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useRemToPx } from '@/hooks/useRemToPx';
import { DEFAULT_EMPTY_CELL_PLACEHOLDER, DEFAULT_WIDTHS } from './constants';
import { SortButton } from './components/SortButton';
import type { NTable } from './types';
import {
  applyResizeHandlerDraggingStyles,
  buildColumnSizeStorageKey,
} from './util';

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

  const columnRefs = useRef<Partial<Record<T, HTMLDivElement | null>>>({});
  const [currentResizingColumn, setCurrentResizingColumn] = useState<T | null>(
    null
  );

  const columnKeyToIndex = props.columns.reduce(
    (acc, c, i) => {
      acc[c.key] = i;
      return acc;
    },
    {} as Record<T, number>
  );

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
        for (const columnKey of Object.keys(row) as T[]) {
          if (props.columns[columnKeyToIndex[columnKey]].excludeFromSearch) {
            continue;
          }
          if (row[columnKey]?.toLowerCase().includes(searchValue)) {
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
  const rows = processedRows.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  // Load all column sizes from storage
  useEffect(() => {
    if (!props.storageKey) return;

    const savedSizesJSON = localStorage.getItem(
      buildColumnSizeStorageKey(props.storageKey)
    );
    if (!savedSizesJSON) return;

    const savedSizes: Record<string, string> = JSON.parse(savedSizesJSON);

    for (const [key, ref] of Object.entries(columnRefs.current) as [
      T,
      HTMLDivElement | null,
    ][]) {
      if (ref === null) continue;
      const savedSize = savedSizes[key];
      if (!savedSize) continue;
      ref.style.width = savedSize;
    }
  }, []);

  useEffect(() => {
    if (currentResizingColumn === null || columnRefs.current === null) return;

    const columnRef = columnRefs.current[currentResizingColumn];
    const lastColumnRef =
      columnRefs.current[props.columns[props.columns.length - 1].key];
    if (!columnRef || !lastColumnRef) return;

    const mouseUpHandler = () => {
      setCurrentResizingColumn(null);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const lastColumnWidth = lastColumnRef.getBoundingClientRect().width;
      const originalWidth = columnRef.getBoundingClientRect().width;

      const newWidth = Math.max(originalWidth + e.movementX);
      const actualDiff = newWidth - originalWidth;

      const newLastColumnWidth = lastColumnWidth - actualDiff;
      if (
        newLastColumnWidth <=
        (props.columns[columnKeyToIndex[currentResizingColumn]]?.minimumWidth ??
          DEFAULT_WIDTHS.min)
      ) {
        return;
      }

      columnRef.style.width = `${newWidth}px`;
    };

    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);

      applyResizeHandlerDraggingStyles(false);

      // save column sizes to storage
      if (props.storageKey) {
        const sizes: Record<string, string> = {};
        for (const [key, ref] of Object.entries(columnRefs.current) as [
          T,
          HTMLDivElement | null,
        ][]) {
          if (ref === null) continue;
          sizes[key] = ref.style.width;
        }

        localStorage.setItem(
          buildColumnSizeStorageKey(props.storageKey),
          JSON.stringify(sizes)
        );
      }
    };
  }, [currentResizingColumn]);

  return (
    <div className={styles.table_wrapper}>
      <div
        className={styles.body}
        ref={tableRef}
      >
        <div className={styles.table}>
          {props.columns.map(column => (
            <div
              ref={ref => (columnRefs.current[column.key] = ref)}
              key={`column_${column.key}`}
              className={styles.column}
              style={{
                width: column.initialWidth ?? DEFAULT_WIDTHS.initial,
                minWidth: column.maximumWidth ?? DEFAULT_WIDTHS.min,
                maxWidth: column.minimumWidth ?? DEFAULT_WIDTHS.max,
              }}
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
              {rows.map((row, idx) => (
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
              <div
                className={styles.resize_handle}
                onMouseDown={() => {
                  setCurrentResizingColumn(column.key);
                  applyResizeHandlerDraggingStyles(true);
                }}
              />
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
